const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');
const paymentConfig = require('./config/payment');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
};

function parseRequestBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 2e6) {
        req.destroy();
        resolve({});
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        try {
          const qs = require('querystring');
          resolve(qs.parse(body));
        } catch {
          resolve({});
        }
      }
    });
  });
}

function sendJsonResponse(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

// Helper to call official Razorpay API for order creation
function callRazorpayCreateOrder(keyId, keySecret, orderData) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const postData = JSON.stringify(orderData);

    const options = {
      hostname: 'api.razorpay.com',
      port: 443,
      path: '/v1/orders',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': `Basic ${auth}`
      }
    };

    const apiReq = https.request(options, (apiRes) => {
      let data = '';
      apiRes.on('data', chunk => { data += chunk; });
      apiRes.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (apiRes.statusCode >= 200 && apiRes.statusCode < 300) {
            resolve(json);
          } else {
            reject(new Error(json.error ? json.error.description : 'Razorpay order creation error'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    apiReq.on('error', (err) => reject(err));
    apiReq.write(postData);
    apiReq.end();
  });
}

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  let reqUrl = decodeURI(req.url.split('?')[0]);

  // ===== PAYMENT API ENDPOINTS =====

  // 1. Get Payment Configuration
  if (reqUrl === '/api/payment-config' && req.method === 'GET') {
    return sendJsonResponse(res, 200, {
      success: true,
      keyId: paymentConfig.keyId,
      company: paymentConfig.company,
      isDemo: paymentConfig.isDemoMode()
    });
  }

  // 2. Create Razorpay Order
  if (reqUrl === '/api/create-order' && req.method === 'POST') {
    try {
      const payload = await parseRequestBody(req);
      const amount = parseFloat(payload.amount);
      if (!amount || isNaN(amount) || amount <= 0) {
        return sendJsonResponse(res, 400, { success: false, message: 'Invalid payment amount.' });
      }

      const currency = (payload.currency || paymentConfig.company.currency || 'INR').toUpperCase();
      const amountInSubunits = Math.round(amount * 100); // in Paise for INR
      const receiptId = `rcpt_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

      let orderResponse;
      // If live or configured with valid API keys, invoke Razorpay API
      if (!paymentConfig.isDemoMode()) {
        try {
          orderResponse = await callRazorpayCreateOrder(paymentConfig.keyId, paymentConfig.keySecret, {
            amount: amountInSubunits,
            currency: currency,
            receipt: receiptId,
            notes: {
              customer_name: payload.customer?.name || '',
              customer_email: payload.customer?.email || '',
              customer_phone: payload.customer?.phone || '',
              purpose: payload.purpose || 'GrownowW Service',
              invoice_number: payload.invoiceNumber || ''
            }
          });
        } catch (apiErr) {
          console.warn('Razorpay live API request failed, falling back to secure test mode:', apiErr.message);
        }
      }

      // If in demo mode or fallback
      if (!orderResponse) {
        orderResponse = {
          id: `order_demo_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
          entity: 'order',
          amount: amountInSubunits,
          amount_paid: 0,
          amount_due: amountInSubunits,
          currency: currency,
          receipt: receiptId,
          status: 'created',
          attempts: 0
        };
      }

      return sendJsonResponse(res, 200, {
        success: true,
        orderId: orderResponse.id,
        amount: amountInSubunits,
        currency: currency,
        keyId: paymentConfig.keyId,
        company: paymentConfig.company,
        receiptId: receiptId,
        isDemo: paymentConfig.isDemoMode()
      });
    } catch (err) {
      console.error('Error creating order:', err);
      return sendJsonResponse(res, 500, { success: false, message: 'Failed to create payment order.' });
    }
  }

  // 3. Verify Payment Signature & Record
  if (reqUrl === '/api/verify-payment' && req.method === 'POST') {
    try {
      const payload = await parseRequestBody(req);
      const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        customer,
        purpose,
        invoiceNumber,
        amount,
        currency
      } = payload;

      if (!razorpay_payment_id || !razorpay_order_id) {
        return sendJsonResponse(res, 400, { success: false, message: 'Missing payment identifiers.' });
      }

      let isValid = false;
      if (paymentConfig.isDemoMode()) {
        isValid = true;
      } else {
        const expectedSignature = crypto
          .createHmac('sha256', paymentConfig.keySecret)
          .update(`${razorpay_order_id}|${razorpay_payment_id}`)
          .digest('hex');
        isValid = (expectedSignature === razorpay_signature);
      }

      if (!isValid) {
        return sendJsonResponse(res, 400, { success: false, message: 'Payment verification signature mismatch.' });
      }

      const receiptNumber = `GNW-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const paymentRecord = {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        receiptNumber: receiptNumber,
        amount: amount,
        currency: currency || 'INR',
        customer: customer || {},
        purpose: purpose || 'Services',
        invoiceNumber: invoiceNumber || 'N/A',
        status: 'SUCCESS',
        paidAt: new Date().toISOString()
      };

      // Save to data/payments.json
      const paymentsFilePath = path.join(__dirname, 'data', 'payments.json');
      try {
        let existing = [];
        if (fs.existsSync(paymentsFilePath)) {
          const raw = fs.readFileSync(paymentsFilePath, 'utf8');
          existing = JSON.parse(raw || '[]');
        }
        existing.unshift(paymentRecord);
        fs.writeFileSync(paymentsFilePath, JSON.stringify(existing, null, 2), 'utf8');
      } catch (fileErr) {
        console.error('Error recording payment to data/payments.json:', fileErr);
      }

      return sendJsonResponse(res, 200, {
        success: true,
        message: 'Payment verified and confirmed successfully!',
        receipt: paymentRecord
      });
    } catch (err) {
      console.error('Error verifying payment:', err);
      return sendJsonResponse(res, 500, { success: false, message: 'Error processing payment verification.' });
    }
  }

  // 4. View Recorded Payments List
  if (reqUrl === '/api/payments' && req.method === 'GET') {
    const paymentsFilePath = path.join(__dirname, 'data', 'payments.json');
    let payments = [];
    if (fs.existsSync(paymentsFilePath)) {
      try {
        payments = JSON.parse(fs.readFileSync(paymentsFilePath, 'utf8') || '[]');
      } catch (e) {
        payments = [];
      }
    }
    return sendJsonResponse(res, 200, { success: true, count: payments.length, payments });
  }

  // ===== STATIC FILE SERVING =====
  if (reqUrl === '/') reqUrl = '/pages/index.html';
  if (reqUrl === '/pay' || reqUrl === '/payment') reqUrl = '/pages/pay.html';
  if (reqUrl === '/partners' || reqUrl === '/partners.html' || reqUrl === '/pages/partners.html') {
    res.writeHead(301, { 'Location': '/pages/services.html' });
    return res.end();
  }

  // Handle requests where relative ../assets was resolved as /pages/assets/
  if (reqUrl.startsWith('/pages/assets/')) {
    reqUrl = reqUrl.replace(/^\/pages/, '');
  }

  let filePath = path.join(__dirname, reqUrl);
  
  if (!fs.existsSync(filePath)) {
    const pagesPath = path.join(__dirname, 'pages', reqUrl);
    if (fs.existsSync(pagesPath)) {
      filePath = pagesPath;
    } else if (fs.existsSync(pagesPath + '.html')) {
      filePath = pagesPath + '.html';
    } else if (fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  if (ext === '.mp4' || ext === '.webm') {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('404 Not Found: ' + reqUrl);
      }
      const range = req.headers.range;
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
        const chunksize = (end - start) + 1;
        const fileStream = fs.createReadStream(filePath, { start, end });
        const head = {
          'Content-Range': `bytes ${start}-${end}/${stats.size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': contentType,
        };
        res.writeHead(206, head);
        fileStream.pipe(res);
      } else {
        const head = {
          'Content-Length': stats.size,
          'Accept-Ranges': 'bytes',
          'Content-Type': contentType,
        };
        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res);
      }
    });
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found: ' + reqUrl);
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + err.code);
      }
    } else {
      const headers = { 'Content-Type': contentType };
      if (reqUrl.includes('favicon') || ext === '.ico') {
        headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
        headers['Pragma'] = 'no-cache';
        headers['Expires'] = '0';
      }
      res.writeHead(200, headers);
      res.end(content);
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

