const path = window.location.pathname;
const currentPage = path.split("/").pop() || "index.html";



if (bgImages[currentPage]) {
  document.body.style.background = `url('${bgImages[currentPage]}') no-repeat center top fixed`;
  document.body.style.backgroundSize = "cover";
} 

    window.addEventListener("DOMContentLoaded", function () {
    
    // === INJECT UI ELEMENTS (Preloader, Back-to-Top, Scroll Progress) ===
    // This ensures they exist on every page without editing HTML files manually
    const uiContainer = document.createElement('div');
    uiContainer.innerHTML = `
        <div id="preloader"><div class="loader"></div></div>
        <div class="scroll-progress-container"><div class="scroll-progress-bar"></div></div>
        <div class="back-to-top" title="Back to Top">&#8679;</div>
    `;
    // Append to body
    while (uiContainer.firstChild) {
        document.body.appendChild(uiContainer.firstChild);
    }

    const form = document.getElementById("whatsapp-form");
    if (form) {
      const nameInput = document.getElementById("name");
      const emailInput = document.getElementById("email");
      const messageInput = document.getElementById("message");
      const staySignedInCheckbox = document.getElementById("stay-signed-in"); // Assuming this is added to HTML

      // Autofill user details if they previously chose to stay signed in
      if (localStorage.getItem("userName")) {
        nameInput.value = localStorage.getItem("userName");
      }
      if (localStorage.getItem("userEmail")) {
        emailInput.value = localStorage.getItem("userEmail");
      }

      // Check if user came from any product page (products.html, products-auto.html, etc.)
      const cameFromProducts = document.referrer.toLowerCase().includes("product");
      if (!cameFromProducts) {
        localStorage.removeItem("selectedProduct");
      }
      // Get the product from storage for the current session.
      const product = localStorage.getItem("selectedProduct");

      // Pre-fill the message field if coming from a product page
      if (product && messageInput) {
        messageInput.value = `I would Like to enquire about the price and availability of "${product}"`;
      }

      // === FORM SUBMIT ===
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        const submitBtn = form.querySelector('.stateful-button');
        const btnText = submitBtn.querySelector('.button-text');

        // Prevent multiple submissions
        if (submitBtn.classList.contains('loading') || submitBtn.classList.contains('sent')) {
            return;
        }

        // Show loading state
        submitBtn.classList.add('loading');

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const userMessage = messageInput ? messageInput.value.trim() : "";
        
        // Handle "Stay signed in" logic
        if (staySignedInCheckbox && staySignedInCheckbox.checked) {
          localStorage.setItem("userName", name);
          localStorage.setItem("userEmail", email);
        } else {
          localStorage.removeItem("userName");
          localStorage.removeItem("userEmail");
        }

        let message = `Name: ${name}\nEmail: ${email}`;
        if (userMessage) {
          message += `\n\n${userMessage}`;
        }

        const whatsappURL = `https://wa.me/923348033319?text=${encodeURIComponent(message)}`;
        
        // Open WhatsApp immediately to avoid popup blockers
        window.open(whatsappURL, "_blank");

        // Show loading state
        submitBtn.classList.add('loading');

        setTimeout(() => {
          // Now that the message is prepared, clear the product from storage
          // so it's not re-used on a page refresh.
          localStorage.removeItem("selectedProduct");
          
          submitBtn.classList.remove('loading');
          submitBtn.classList.add('sent');
          if(btnText) btnText.textContent = 'Sent!';

          // When the user returns to this tab, clear the form.
          const clearFormOnFocus = () => {
            if (!staySignedInCheckbox || !staySignedInCheckbox.checked) {
              nameInput.value = '';
              emailInput.value = '';
              if (messageInput) messageInput.value = '';
            }
            window.removeEventListener('focus', clearFormOnFocus);
          };
          window.addEventListener('focus', clearFormOnFocus);

          // Optional: Reset button after a few seconds
          setTimeout(() => {
              submitBtn.classList.remove('sent');
              if(btnText) btnText.textContent = 'Send Message';
          }, 4000);

        }, 1000); // Simulate a 1-second network delay
      });
    }
  });



function contactSeller(productName) {
  // Save the selected product so contact.html can use it
  localStorage.setItem("selectedProduct", productName);

  // Redirect to contact page
  window.location.href = "contact.html";
}

const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
const navbg = document.querySelector('.nav-bg');
if (menuIcon) {
  menuIcon.addEventListener('click', () => {
      menuIcon.classList.toggle('bx-x');
      navbar.classList.toggle('active');
      if (navbg) navbg.classList.toggle('active');
  });
}


document.querySelectorAll('.has-dropdown').forEach(item => {
  item.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      const menu = this.nextElementSibling;
      menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Select all elements you want to reveal on scroll
  const elementsToReveal = document.querySelectorAll('.benefit-card, .product-category-card, .product-card, .slide-in');

  // Set up the observer
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      // If the element is in view
      if (entry.isIntersecting) {
        // Add the 'visible' class to trigger the animation
        entry.target.classList.add('visible');
      } else {
        // Remove the class to reset the animation when scrolling away
        entry.target.classList.remove('visible');
      }
    });
  }, {
    threshold: 0.1 // Start animation when 10% of the element is visible
  });

  // Add the 'reveal' class to all target elements and start observing them
  elementsToReveal.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });
});

// === Scroll Progress & Back to Top Logic ===
window.addEventListener('scroll', () => {
  // 1. Update Progress Bar
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  const progressBar = document.querySelector('.scroll-progress-bar');
  if (progressBar) {
    progressBar.style.width = scrolled + "%";
  }

  // 2. Show/Hide Back to Top Button
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    backToTop.classList.toggle('active', winScroll > 300);
  }

  // 3. Parallax Background Effect
  // Moves background at 30% speed of scroll for depth effect (Desktop only)
  if (bgImages[currentPage] && window.innerWidth > 768) {
    document.body.style.backgroundPositionY = -(winScroll * 0.3) + "px";
  }
});

// Back to Top Click Event
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('back-to-top')) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// Automatically update copyright year
document.addEventListener("DOMContentLoaded", () => {
  const yearElements = document.querySelectorAll(".copyright-year");
  yearElements.forEach(el => el.textContent = new Date().getFullYear());

  // === Active Navigation Link ===
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(link => {
    // Check if the link href matches the current page
    if (link.getAttribute('href') === currentPage || (currentPage === '' && link.getAttribute('href') === 'index.html')) {
      link.classList.add('active');
    }
  });
});