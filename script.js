// === PAGE SETUP & NAVIGATION ===
const path = window.location.pathname;
const currentPage = path.split("/").pop() || "index.html";

window.addEventListener("DOMContentLoaded", function () {
    
    // 1. LOCK SCROLLING while preloader is active
    document.body.style.overflow = 'hidden';

    // 2. INJECT UI ELEMENTS (Preloader, Back-to-Top, Scroll Progress)
    // This ensures they exist on every page without editing HTML files manually
    const uiContainer = document.createElement('div');
    uiContainer.innerHTML = `
        <div id="preloader"><div class="loader"></div></div>
        <div class="scroll-progress-container"><div class="scroll-progress-bar"></div></div>
        <div class="back-to-top" title="Back to Top">&#8679;</div>
    `;
    
    while (uiContainer.firstChild) {
        document.body.appendChild(uiContainer.firstChild);
    }
// === WHATSAPP FORM LOGIC ===
const form = document.getElementById("whatsapp-form");
if (form) {
  // 1. Get the product name from the URL (?product=Name)
  const urlParams = new URLSearchParams(window.location.search);
  const product = urlParams.get('product');

  // Handle Form Submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    // Autofill inquiry text from URL or localStorage
    const selectedProduct = product || localStorage.getItem("selectedProduct");

    // Construct the WhatsApp message
    let message = `Name: ${name}\nEmail: ${email}`;
    if (selectedProduct) {
      message += `\n\nI would like to inquire about ${selectedProduct}`;
      localStorage.removeItem("selectedProduct");
    }

    const whatsappURL = `https://wa.me/923348033319?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
  });
}
// Function to handle "Contact Seller" clicks
function contactSeller(productName) {
  // Encodes the product name to be safe for a URL
  const encodedProduct = encodeURIComponent(productName);
  // Redirects directly to contact.html with a query parameter
  window.location.href = `contact.html?product=${encodedProduct}`;
}


    // === ACTIVE NAV LINK HIGHLIGHTER ===
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // === PRODUCT CLICK TRACKING ===
    document.addEventListener('click', (e) => {
        const productBtn = e.target.closest('.product-card button, .product-item button');
        if (productBtn) {
            const productCard = productBtn.closest('.product-card, .product-item');
            const productName = productCard.querySelector('h3, strong').textContent.trim();
            localStorage.setItem("selectedProduct", productName);
            window.location.href = "contact.html";
        }
    });
});

// === SCROLL EVENTS ===
window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  
  const progressBar = document.querySelector('.scroll-progress-bar');
  if (progressBar) progressBar.style.width = scrolled + "%";

  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) backToTop.classList.toggle('active', winScroll > 300);
});

// === BACK TO TOP CLICK ===
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('back-to-top')) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// === HIDE PRELOADER & RE-ENABLE SCROLLING ===
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    document.body.classList.add('loaded');
    // Allow scrolling again once page is ready
    document.body.style.overflow = 'auto'; 
  }
});

// Automatically update copyright year
document.addEventListener("DOMContentLoaded", () => {
  const yearElements = document.querySelectorAll(".copyright-year");
  yearElements.forEach(el => el.textContent = new Date().getFullYear());
});
// === PERSISTENT SCROLL REVEAL OBSERVER ===
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    } else {
      // REMOVE class when leaving viewport to allow infinite re-animation
      entry.target.classList.remove('show');
    }
  });
}, { 
  threshold: 0.1, 
  rootMargin: '0px 0px -50px 0px' 
});

document.addEventListener("DOMContentLoaded", () => {
  // 1. Target individual cards for staggered Left-to-Right animation
  const cards = document.querySelectorAll('.benefit-card, .product-card, .contact-info-card');
  cards.forEach((card, index) => {
    card.classList.add('card-reveal');
    // Add staggered delay based on position (0.2s, 0.4s, 0.6s)
    card.style.transitionDelay = `${(index % 3) * 0.2}s`;
    revealObserver.observe(card);
  });

  // 2. Target general content (titles, text) inside sections (keeping overlays static)
  const contentItems = document.querySelectorAll(
    '.about-section > *:not(.benefits-grid), .benefits-section > h2, .contact-form-container, .partners-section > *'
  );
  
  contentItems.forEach(item => {
    item.classList.add('scroll-reveal');
    revealObserver.observe(item);
  });
});





// ===================================================
//  PROFESSIONAL UPGRADES — New Animations & Features
// ===================================================

// ── Sticky Header Scroll Class ──
window.addEventListener('scroll', () => {
  const header = document.querySelector('.sticky-header');
  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }
});

// ── Typing Animation ──
(function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const words = [
    'PLCs & HMIs',
    'Solar Inverters',
    'VFDs & Contactors',
    'Lithium Batteries',
    'Power Tools',
    'Electrical Breakers'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = words[wordIndex];
    if (deleting) {
      el.textContent = current.slice(0, --charIndex);
    } else {
      el.textContent = current.slice(0, ++charIndex);
    }

    let delay = deleting ? 60 : 110;

    if (!deleting && charIndex === current.length) {
      delay = 1800;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 400;
    }
    setTimeout(tick, delay);
  }
  setTimeout(tick, 800);
})();

// ── Counter Animation ──
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const easeOutQuad = t => t * (2 - t);

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    let start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const value = Math.floor(easeOutQuad(progress) * target);
      el.textContent = value;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  };

  const statsSection = document.getElementById('hero-stats');
  if (!statsSection) return;

  let counted = false;
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      counters.forEach(el => animateCounter(el));
    }
  }, { threshold: 0.4 });

  observer.observe(statsSection);
})();

// ── Smooth Anchor Scroll (for "Explore Products" button) ──
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const target = document.querySelector(link.getAttribute('href'));
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});







