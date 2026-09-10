$(document).ready(function() {
    setTimeout(function() {
        $(".preloader").fadeOut("slow");
    }, 2000);
});

// Navbar Script For Mobile

$(document).on("click", ".navbar-toggler", function() {
    var navbar_height = $(".navbar-collapse").innerHeight();
    if (navbar_height >= 150) {
        $(".navbar-collapse").animate({
            height: "0"
        }, 200);
        $(".menu_button_box").css("top", "25px");
    } else {
        $(".navbar-collapse")
            .animate({
                height: "275px"
            }, 200)
            .css("display", "block", "important");
        $(".menu_button_box").css("top", "0");
    }
});

$(".slider_box").slick({
    infinite: true,
    autoplay: true,
    dots: true,
    infinite: true,
    speed: 1000,
    arrows: false,
    autoplaySpeed: 3000,
});

$(".slider_box2").slick({
    infinite: true,
    autoplay: true,
    dots: true,
    infinite: true,
    speed: 1000,
    arrows: true,
    autoplaySpeed: 3000,
    prevArrow: '<div class="client_arrow_left"><img src="assets/images/services/website/slick_arrow.svg" alt=""></div>',
    nextArrow: '<div class="client_arrow_right"><img src="assets/images/services/website/slick_arrow.svg" alt=""></div>',
});

$(".testimonial_slider").slick({
    infinite: true,
    autoplay: true,
    dots: true,
    infinite: true,
    speed: 1000,
    arrows: false,
    autoplaySpeed: 3000,
    prevArrow: '<div class="custom_arrow_left"><i class="fas fa-arrow-circle-left"></i></div>',
    nextArrow: '<div class="custom_arrow_right"><i class="fas fa-arrow-circle-right"></i></div>',
});

// Service Page

$(".web_slider").slick({
    infinite: true,
    autoplay: true,
    dots: false,
    infinite: true,
    speed: 1000,
    arrows: false,
    autoplaySpeed: 2000,
});

$(".android_slider").slick({
    infinite: true,
    autoplay: true,
    dots: false,
    infinite: true,
    speed: 1000,
    arrows: false,
    autoplaySpeed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
});

$(".website_slider_box_inner").slick({
    centerMode: true,
    infinite: true,
    autoplay: true,
    dots: false,
    infinite: true,
    speed: 500,
    arrows: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow: '<div class="client_arrow_left"><img src="assets/images/services/website/slick_arrow.svg" alt=""></div>',
    nextArrow: '<div class="client_arrow_right"><img src="assets/images/services/website/slick_arrow.svg" alt=""></div>',
    responsive: [{
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: true,
            },
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
            },
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
            },
        },
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
    ],
});

// Work Page Script

$(window).scroll(function() {
    var by_top = $(window).scrollTop();
    if (by_top >= 1250) {
        $(".book").css({
            position: "relative",
            left: "50%",
            top: "53%",
            height: "22%",
        });
        $(".book_body .info").css({
            position: "relative",
            left: "0%",
            top: "20%",
        });
    } else {
        $(".book").css({
            position: "fixed",
            right: "10%",
            top: "20%",
            height: "75%",
        });
        $(".book_body .info").css({
            position: "fixed",
            left: "20%",
            top: "50%",
        });
    }
    console.log(by_top);
});

// Gsap Link

console.clear();

const randomX = random(1, 10);
const randomY = random(1, 10);
const randomDelay = random(0, 1);
const randomTime = random(1, 3);
const randomTime2 = random(3, 5);
const randomAngle = random(-10, 10);

const cans = gsap.utils.toArray(".multi_img > img");
cans.forEach((can) => {
    gsap.set(can, {
        x: randomX(-1),
        y: randomX(1),
        rotation: randomAngle(-1),
    });

    moveX(can, 1);
    moveY(can, -1);
    rotate(can, 1);
});

function rotate(target, direction) {
    gsap.to(target, randomTime2(), {
        rotation: randomAngle(direction),
        // delay: randomDelay(),
        ease: Sine.easeInOut,
        onComplete: rotate,
        onCompleteParams: [target, direction * -1],
    });
}

function moveX(target, direction) {
    gsap.to(target, randomTime(), {
        x: randomX(direction),
        ease: Sine.easeInOut,
        onComplete: moveX,
        onCompleteParams: [target, direction * -1],
    });
}

function moveY(target, direction) {
    gsap.to(target, randomTime(), {
        y: randomY(direction),
        ease: Sine.easeInOut,
        onComplete: moveY,
        onCompleteParams: [target, direction * -1],
    });
}

function random(min, max) {
    const delta = max - min;
    return (direction = 1) => (min + delta * Math.random()) * direction;
}

// Case Study UX

gsap.registerPlugin(ScrollTrigger);

const tl = gsap.timeline({
    defaults: {
        duration: 1,
        ease: "none"
    },
    scrollTrigger: {
        trigger: ".discovery",
        start: "top -50%",
        end: "+=200%",
        scrub: true,
        nullTargetWarn: false,
        // pin: true,
        // markers: true,
    },
});

tl.to(".ux_strategy .container .dot", {
    scale: 100
}).set(
    ".ux_strategy .container", {
        autoAlpha: 0
    }
);

gsap.set(".ux_strategy .container", {
    zIndex: (i, target, targets) => targets.length - i,
});

// AOS

AOS.init();

// Home Our Process

$(window).scroll(function() {
    var process = $(".process1").offset().top - window.innerHeight;
    if ($(window).scrollTop() > process) {
        $(".process1").addClass("start");
    } else {
        $(".process1").removeClass("start");
    }

    var process2 = $(".process2").offset().top - window.innerHeight;
    if ($(window).scrollTop() > process2) {
        $(".process2").addClass("start");
    } else {
        $(".process2").removeClass("start");
    }

    var process3 = $(".process3").offset().top - window.innerHeight;
    if ($(window).scrollTop() > process3) {
        $(".process3").addClass("start");
    } else {
        $(".process3").removeClass("start");
    }
});

// Case Study UX

const tm = gsap.timeline({
    defaults: {
        duration: 2,
        ease: "none"
    },
    scrollTrigger: {
        trigger: ".our_client_say",
        start: "top 5%",
        end: "+=120%",
        scrub: true,
        // pin: true,
        // markers: true,
    },
});

tm.to(".ani_what_we .square", {
    scaleY: 130
}).set(".ani_what_we", {
    autoAlpha: 0,
});

gsap.set(".ani_what_we", {
    zIndex: (i, target, targets) => targets.length - i,
});

// Form
$(".popup_form .back_form").hide();
$(document).on("click", ".form_category_inner", function() {
    $(this).closest(".cat_container").find(".options").toggleClass("reveal");
    $(".popup_form .back_form").show();
});

$(document).on("click", ".popup_form .back_form", function() {
    $(".options").removeClass("reveal");
    $(this).hide().fadeOut("slow");
});

// $(document).on("click", ".options_inner", function() {
//     var service = $(this).find("h6").text().trim();
//     $(".query_form").addClass("come");
//     $(".form_category_box").addClass("goleft");

//     $("#service option").each(function() {
//         var option_value = $(this).val();
//         if (service == option_value) {
//             $(this).prop("selected", true);
//         }

//     });
// });

$(document).ready(function() {
    var body_width = document.body.clientWidth;
    if (body_width < 768) {
        $(".what_we_do").removeClass("ani_what_we");
        $(".our_client_say").removeClass("remove_client");
        // alert(body_width);
    } else {
        $(".what_we_do").addClass("ani_what_we");
        $(".our_client_say").addClass("remove_client");
    }
});

$(document).on("click", ".rate1 label", function() {
    var rate1 = $(this).closest(".rate1").find(this).text();
    $("#q1").val(rate1);
});

$(document).on("click", ".rate2 label", function() {
    var rate2 = $(this).closest(".rate2").find(this).text();
    $("#q2").val(rate2);
});

$(document).on("click", ".rate3 label", function() {
    var rate3 = $(this).closest(".rate3").find(this).text();
    $("#q3").val(rate3);
});

$(document).on("click", ".rate4 label", function() {
    var rate4 = $(this).closest(".rate4").find(this).text();
    $("#q5").val(rate4);

    var qtn = $(".qtn4").val();

    $("#q4").val(qtn);
});

$(document).on("click", ".query_form input[type=checkbox]", function() {
    var val = [];
    $(".query_form input[type=checkbox]:checkbox:checked").each(function(i) {
        val[i] = $(this).val();
    });

    var service = val.toString();
    var servicess = $("#hidden_service").val(service);

    if (servicess == "") {
        $(".query_form input[type=checkbox]").each(function(i) {
            $(this).prop("required", true);
        });
    } else {
        $(".query_form input[type=checkbox]").each(function(i) {
            $(this).prop("required", false);
        });
    }
});

$(document).on("click", ".service_contact input[type=checkbox]", function() {
    $(".service_info").text("");
    var val = [];

    $(".service_contact input[type=checkbox]:checkbox:checked").each(function(
        i
    ) {
        val[i] = $(this).val();
    });

    var service = val.toString();
    var servicess = $(".hidden_service").val(service);

    // $(".selected_services").text(servicess);

    if (servicess == "") {
        $(".service_contact input[type=checkbox]").each(function(i) {
            $(this).prop("required", true);
        });
    } else {
        $(".service_contact input[type=checkbox]").each(function(i) {
            $(this).prop("required", false);
        });
    }
});

$(".gone").click(function() {
    $(".query_form").removeClass("come");
});

// Form Close Script
$(document).on("click", ".close_btn", function() {
    $(".form_bg").removeClass("visible visibleall");
});

$(document).on("click", ".fixed_quote", function() {
    $(".form_bg").addClass("visibleall");
});

// toggle demo allwyn
// $(document).on("click", ".book_demo_btn", function () {
//     // alert("hello");
//     $(".form_bg").addClass("visible");
// });

$(".next_btn button").on("click", function() {
    var popup_name = $(".query_form #Name").val();
    var popup_phone = $(".query_form #mobile").val();
    var popup_email = $(".query_form #email").val();

    if (popup_name != "" && popup_phone != "" && popup_email != "") {
        $(".service_submit").attr("type", "submit");
    } else {
        $(".service_submit").attr("type", "button");
    }

    if ($(".hidden_service").val() != "") {
        $(".query_form").addClass("come");
    } else {
        $(".service_info").text("You forget to select your service").css({
            color: "red",
            "font-family": "var(--poppins)",
            "font-weight": "500",
            "margin-right": "20px",
        });
    }
});

//Popup Form Script

$(document).ready(function() {
    var get_ip = localStorage.getItem("ip");

    $.getJSON("https://api.ipify.org?format=json", function(data) {
        //get ip address

        var user_ip = data.ip;
        $("#popup_formload").on("submit", function() {
            localStorage.setItem("ip", user_ip);
        });
        if (get_ip != user_ip) {
            // check ip address for show popup only once
            setTimeout(function() {
                $(".form_bg").addClass("visible");
            }, 2000);
        }
    });

    $(".query_form input").on("keyup", function() {
        $(".service_submit").attr("type", "submit");
        $(".js_add").text("");
    });

    $(".service_submit").on("click", function() {
        var popup_name = $(".query_form #Name").val();
        var popup_phone = $(".query_form #mobile").val();
        var popup_email = $(".query_form #email").val();
        if (popup_name == "" && popup_phone == "" && popup_email == "") {
            $(this).after(
                "<span class='js_add' style='color:red';font-weight:500;font-family:var(--poppins)>Please fillout all the Fields</span>"
            );
        }
    });

    // Clear Local Storage After 24 hours
    var hours = 24;

    setTimeout(function() {
        window.localStorage.removeItem("ip");
    }, hours * 60 * 60 * 1000);
});

function rate(value) {
    clearRates(); //vacia clase active
    addRates(value); //añade clase active
}

function rate2(value) {
    clearRates2(); //vacia clase active
    addRates2(value); //añade clase active
}

function rate3(value) {
    clearRates3(); //vacia clase active
    addRates3(value); //añade clase active
}

function rate4(value) {
    clearRates4(); //vacia clase active
    addRates4(value); //añade clase active
}

function clearRates() {
    for (var i = 1; i <= 10; i++) {
        document.getElementById("star" + i).classList.remove("active");
    }
}

function addRates(value) {
    for (var i = 1; i <= value; i++) {
        document.getElementById("star" + i).classList.add("active");
    }
}

//2
function clearRates2() {
    for (var i = 1; i <= 10; i++) {
        document.getElementById("2star" + i).classList.remove("active");
    }
}

function addRates2(value) {
    for (var i = 1; i <= value; i++) {
        document.getElementById("2star" + i).classList.add("active");
    }
}

//3

function clearRates3() {
    for (var i = 1; i <= 10; i++) {
        document.getElementById("3star" + i).classList.remove("active");
    }
}

function addRates3(value) {
    for (var i = 1; i <= value; i++) {
        document.getElementById("3star" + i).classList.add("active");
    }
}

//4

function clearRates4() {
    for (var i = 1; i <= 10; i++) {
        document.getElementById("4star" + i).classList.remove("active");
    }
}

function addRates4(value) {
    for (var i = 1; i <= value; i++) {
        document.getElementById("4star" + i).classList.add("active");
    }
}

// window.addEventListener("click", function(click) {
//     if (!document.getElementById("rate").contains(click.target)) {
//         clearRates();
//     }
// })

//Disable Right Click
document.addEventListener("contextmenu", (event) => event.preventDefault());

$(window).on("load", function() {
    var pageurl = window.location.href;
    if (pageurl.includes("grownoww.com/contact") || pageurl.endsWith("/contact") || pageurl.includes("/contact#")) {
        setTimeout(() => {
            $("html,body").animate({
                scrollTop: 370
            }, "slow");
        }, 300);
    }
});

// Only Numbers

function isNumberKey(evt) {
    var charCode = evt.which ? evt.which : evt.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
}

// faq script

let faqs = [];

$(document).ready(function() {
    const faqContainer = $(".faq_section .row");

    const currentPath = window.location.pathname;

    console.log("Current Path:" + currentPath);

    if (
        currentPath == "/" ||
        currentPath.startsWith("/blog") ||
        currentPath.startsWith("/careers") ||
        currentPath.startsWith("/career") ||
        currentPath.startsWith("/enquiries") ||
        currentPath == "/contact" ||
        currentPath == "/crm" ||
        currentPath.includes("company-in")
    ) {
        $(".faq_section").hide();
        return;
    } else {
        $(".faq_section").show();
    }

    // aboutus
    if (currentPath == "/aboutus" || currentPath == "/chennai") {
        faqs = [{
                question: "1. How long has GrownowW been in the industry?",
                answer: "We have over 6 years of experience in delivering innovative IT solutions, ensuring high-quality services to businesses across multiple industries.",
            },
            {
                question: "2. What types of projects has GrownowW successfully handled?",
                answer: "We have handled a wide range of projects including software development, web applications, IT consulting, and custom solutions tailored to client needs.",
            },
            {
                question: "3. Can you share a success story of GrownowW?",
                answer: "One of our notable success stories is helping a client streamline their business operations with a custom software solution, increasing their productivity by 40% in just six months.",
            },
            {
                question: "4. How does GrownowW approach teamwork on projects?",
                answer: "Our team follows a collaborative approach where developers, designers, and project managers work closely to ensure on-time delivery and client satisfaction.",
            },
            {
                question: "5. What services does GrownowW provide?",
                answer: "We offer end-to-end IT services including software development, web design, mobile app development, IT consulting, and digital transformation solutions.",
            },
            {
                question: "6. How do you ensure the quality and reliability of your services?",
                answer: "We follow a structured development process, regular quality testing, and client feedback integration to maintain the highest standards in every project.",
            },
            {
                question: "7. Who are your channel partners, and how do you collaborate with them?",
                answer: "We collaborate with trusted channel partners to expand our service reach and provide complete solutions, including software licensing and support services.",
            },
            {
                question: "8. What makes GrownowW stand out in the IT industry?",
                answer: "Our strong client focus, 6+ years of proven experience, dedicated team, and innovative solutions make us a reliable technology partner.",
            },
            {
                question: "9. How does GrownowW handle client communication and project updates?",
                answer: "We provide regular project updates, maintain transparent communication, and offer dedicated support channels for smooth collaboration.",
            },
            {
                question: "10. How can potential clients or partners connect with GrownowW?",
                answer: "You can reach us through our website’s contact page, email, or phone to discuss project requirements or partnership opportunities.",
            },
        ];
    }

    // service page faq

    if (currentPath == "/services") {
        faqs = [{
                question: "1. What services does GrownowW offer?",
                answer: "GrownowW provides a full suite of digital services including Mobile App Development, Website Development, Custom Software Development (ERP/CRM/etc.), Graphic Design, SEO, and Digital Marketing.",
            },
            {
                question: "2. Which industries do you serve with custom CRM solutions?",
                answer: "They develop customized CRM systems across industries such as B2B, dental, e‑commerce, education, hotels, healthcare, real estate, travel, financial services, and more.",
            },
            {
                question: "3. What types of websites can you build?",
                answer: "Web development services include custom business websites, e‑commerce platforms, WordPress and CMS sites, UI/UX design and mobile responsiveness, plus ongoing maintenance and support.",
            },
            {
                question: "4. Do you offer native and cross‑platform mobile app development?",
                answer: "Yes—they handle Android, iOS, and hybrid cross-platform apps using frameworks like Flutter, React Native, Kotlin, Swift, etc.",
            },
            {
                question: "5. How does your custom software process work?",
                answer: "Their software development follows a structured approach: discovery → requirement analysis → Scrum-managed development → ongoing client communication → launch → post-launch support.",
            },
            {
                question: "6. What graphic design services do you provide?",
                answer: "They offer design services including logo & branding, brochures, packaging, social media creatives, posters, infographics, app/website graphics, and more.",
            },
            {
                question: "7. What SEO and digital marketing services are included?",
                answer: "GrownowW delivers on-page and off-page SEO, technical and local SEO, content marketing, PPC (Google Ads, Facebook, Instagram, LinkedIn), lead generation campaigns, landing page optimisation, and GMB profile management.",
            },
            {
                question: "8. What makes GrownowW unique or trustworthy?",
                answer: "With over five years of experience and more than 400 completed websites and apps, they emphasize custom design, UX-first development, fast-loading, responsive sites, and transparent client collaboration.",
            },
            {
                question: "9. Where is GrownowW located and do you have branches?",
                answer: "Their head office is in Coimbatore, Tamil Nadu, with branches in Salem (Tamil Nadu) and Milton Keynes, UK.",
            },
            {
                question: "10. How can I get started or get a quote?",
                answer: "You can inquire through their “Get a Quote” or “Book a Demo” options, where you'll discuss your project, receive a custom proposal, meet the assigned team, and track progress transparently until delivery.",
            },
        ];
    }

    // works page faq

    if (currentPath == "/works") {
        faqs = [{
                question: "1. What kind of projects does GrownowW showcase on the Works page?",
                answer: "We display real-world examples of websites, mobile apps, ERP/custom software, branding and graphic design created for clients across industries like architecture, retail, job portals, food & dairy, financial services and more.",
            },
            {
                question: "2. Which industries has GrownowW worked with?",
                answer: "Clients include architecture & interior firms (Studio Emerge, Cabiinet Designs), cosmetics (Glam‑U), job portals (Madeus Jobs), dairy (Kovai Farms), ERP systems (RAC ERP, TOT Hygiene), among others.",
            },
            {
                question: "3. What services were provided in these projects?",
                answer: "Services span across responsive website development, native/cross‑platform mobile apps, ERP and custom software development, graphic & branding solutions like logos and brochures.",
            },
            {
                question: "4. How many completed projects does GrownowW have so far?",
                answer: "As of today, GrownowW has delivered over 400 professional websites and mobile apps since 2018.",
            },
            {
                question: "5. Does GrownowW work on projects outside Coimbatore?",
                answer: "Yes, they have expanded to serve clients beyond Coimbatore, including through their branch in Salem, Tamil Nadu, and globally with a UK branch in Milton Keynes.",
            },
            {
                question: "6. What is the process behind these showcased projects?",
                answer: "Projects typically follow a structured workflow: discovery & requirement gathering, planning, design & development, QA/testing, launch, and ongoing support—often using Agile/Scrum methodologies.",
            },
            {
                question: "7. Can I request a case study or client reference from the Works page?",
                answer: "Absolutely! You can ask for detailed case studies or client references for specific projects like Studio Emerge or Madeus Jobs via their contact form on the website.",
            },
            {
                question: "8. Do these showcased works include SEO and digital marketing support?",
                answer: "Yes, many projects featured combine custom development with SEO, social media marketing, and lead-generation services tailored to boost brand visibility and performance.",
            },
            {
                question: "9. Are the mobile apps showcased native or hybrid?",
                answer: "GrownowW builds both native (Android/iOS) and hybrid apps, depending on client needs and project requirements.",
            },
            {
                question: "10. How can I collaborate with GrownowW on a similar project?",
                answer: "You can initiate collaboration by filling out the “Get a Quote” form or “Contact Us” section, sharing your idea, discussing timelines and budget—and they’ll guide you through consultation to launch.",
            },
        ];
    }

    // partners page faq
    if (currentPath == "/partners") {
        faqs = [{
                question: "1. What is the minimum investment required to become a GrownowW partner?",
                answer: "The minimum investment to become a GrownowW partner is ₹12 lakhs per office, which includes office setup and initial operational expenses.",
            },
            {
                question: "2. Does GrownowW help in setting up the office?",
                answer: "Yes, we provide complete assistance in office setup, including branding, infrastructure guidance, and operational support to ensure your branch is ready for business.",
            },
            {
                question: "3. Can I open a GrownowW partner office in any location?",
                answer: "Yes, our partner model allows you to set up your office anywhere in India, subject to availability and market potential in your chosen area.",
            },
            {
                question: "4. What kind of business leads will I receive as a partner?",
                answer: "We provide qualified leads for IT services, software solutions, and digital transformation projects, helping you start business operations quickly.",
            },
            {
                question: "5. What benefits do partners receive apart from leads?",
                answer: "As a partner, you gain profit-sharing opportunities, branding support, marketing assistance, training programs, and priority access to new projects.",
            },
            {
                question: "6. Is prior IT or business experience required to become a partner?",
                answer: "While prior experience is helpful, it is not mandatory. GrownowW provides full guidance, training, and operational support to help you succeed.",
            },
            {
                question: "7. How is revenue shared between GrownowW and the partner?",
                answer: "Revenue is shared on a mutually agreed profit-sharing model, ensuring a win-win situation for both the company and the partner.",
            },
            {
                question: "8. Will GrownowW provide marketing and promotional support?",
                answer: "Yes, we provide digital marketing support, promotional materials, and brand campaigns to help generate leads and grow your local presence.",
            },
            {
                question: "9. How long does it take to start operations after signing up as a partner?",
                answer: "Typically, a partner office can start operations within 30-45 days after the agreement, depending on location readiness and setup.",
            },
            {
                question: "10. How can I apply to become a GrownowW partner?",
                answer: "You can apply directly through our website or contact our business development team. After an evaluation process, we guide you through the next steps to join our partner network.",
            },
        ];
    }

    faqs.forEach((faq, index) => {
        const faqItem = $(`
      <div class="col-lg-6">
        <div class="faq-content">
          <div class="row">
            <div class="col-lg-1">
              <img src="assets/images/faq-icon.png" alt="" class="img-fluid">
            </div>
            <div class="col-lg-11">
              <h5>${faq.question}</h5>
              <p class="mt-3">${faq.answer}</p>
            </div>
          </div>
        </div>
      </div>
    `);

        faqContainer.append(faqItem);
    });

    // Append the full container to a specific element, e.g., #faq-section
    $("#faq-section").append(faqContainer);
});

$(document).ready(function() {

    $(document).on("click", ".medias", function() {
        const target = $(this).find('img').data("target");
        window.location.href = "/services#" + target;
    });

    if (window.location.hash) {
        const target = window.location.hash;
        const $el = $(target);

        if ($el.length) {
            $("html, body").animate({
                    scrollTop: $el.offset().top - 100,
                },
                800
            );
        }
    }
});