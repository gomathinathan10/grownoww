// Razorpay Payment Configuration for GrowNoww Technologies
// You can supply environment variables RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET,
// or edit them directly in this file when going live.

module.exports = {
  // Test Key ID (Replace with your actual Razorpay Key ID from dashboard.razorpay.com)
  keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_GrownowwDemoKey',
  
  // Secret Key (Replace with your actual Razorpay Key Secret)
  keySecret: process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_GrownowwDemoSecret',

  // Company Details shown on Checkout
  company: {
    name: 'GrownowW Technologies',
    tagline: 'Delivering Next-Gen Web, App & Software Solutions',
    logo: '../assets/images/logo/favicon.png',
    themeColor: '#0052cc',
    supportPhone: '+91 99947 13122',
    supportEmail: 'info@grownoww.com',
    currency: 'INR'
  },

  // Enable sandbox/mock response when test key is not yet connected to live gateway
  isDemoMode: function() {
    return this.keyId.startsWith('rzp_test_GrownowwDemo');
  }
};
