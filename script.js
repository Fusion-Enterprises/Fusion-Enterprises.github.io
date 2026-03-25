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
      const nameInput = document.getElementById("name");
      const emailInput = document.getElementById("email");
      const messageInput = document.getElementById("message");
      const staySignedInCheckbox = document.getElementById("stay-signed-in");

      // Autofill details if "Stay signed in" was checked previously
      if (localStorage.getItem("userName")) {
        nameInput.value = localStorage.getItem("userName");
      }
      if (localStorage.getItem("userEmail")) {
        emailInput.value = localStorage.getItem("userEmail");
      }

      // Pre-fill message if user clicked a specific product
      const cameFromProducts = document.referrer.toLowerCase().includes("product");
      if (!cameFromProducts) {
        localStorage.removeItem("selectedProduct");
      }
      const product = localStorage.getItem("selectedProduct");
      if (product && messageInput) {
        messageInput.value = `I would Like to enquire about the price and availability of "${product}"`;
      }

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        const submitBtn = form.querySelector('.stateful-button');
        
        if (submitBtn && (submitBtn.classList.contains('loading') || submitBtn.classList.contains('sent'))) return;

        if (submitBtn) submitBtn.classList.add('loading');

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const userMessage = messageInput ? messageInput.value.trim() : "";

        if (staySignedInCheckbox && staySignedInCheckbox.checked) {
          localStorage.setItem("userName", name);
          localStorage.setItem("userEmail", email);
        } else {
          localStorage.removeItem("userName");
          localStorage.removeItem("userEmail");
        }

        let message = `Name: ${name}\nEmail: ${email}`;
        if (userMessage) message += `\n\n${userMessage}`;

        const whatsappURL = `https://wa.me/923348033319?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, "_blank");
      });
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