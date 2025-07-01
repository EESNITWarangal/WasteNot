// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Hero slider functionality
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  let currentSlide = 0;

  console.log('Found slides:', slides.length); // Debug

  function showSlide(index) {
    console.log('Showing slide:', index); // Debug
    
    // First, remove 'active' class from ALL slides
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      console.log(`Slide ${i}: removed active`); // Debug
    });
    
    // Then, add 'active' class only to the current slide
    slides[index].classList.add('active');
    console.log(`Slide ${index}: added active`); // Debug
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    });
    nextBtn.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    });
  }

  // Optional: auto-slide every 7 seconds
  let autoSlide = setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 7000);

  // Pause auto-slide on hover
  const heroSlider = document.querySelector('.hero-slider');
  if (heroSlider) {
    heroSlider.addEventListener('mouseenter', () => clearInterval(autoSlide));
    heroSlider.addEventListener('mouseleave', () => {
      autoSlide = setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
      }, 7000);
    });
  }

  // Show first slide on load
  showSlide(currentSlide);
});

// List Excess Food button (placeholder functionality)
const listFoodBtn = document.getElementById('listFoodBtn');
if (listFoodBtn) {
  listFoodBtn.addEventListener('click', function(e) {
    // Remove this alert if you add real functionality
    // e.preventDefault(); // Uncomment if you want to prevent navigation
    // alert('Feature coming soon!');
  });
}

// Hamburger menu (mobile only)
function setupHamburger() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (!hamburger || !mobileNav) return;
  function toggleNav() {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    mobileNav.hidden = expanded;
    hamburger.setAttribute('aria-expanded', !expanded);
  }
  hamburger.onclick = toggleNav;
  // Hide mobile nav if resizing to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 700) {
      mobileNav.hidden = true;
      hamburger.setAttribute('aria-expanded', false);
    }
  });
}
if (window.innerWidth <= 700) setupHamburger();

// Animated stats counter
function animateStats() {
  const stats = document.querySelectorAll('.stat-number');
  let started = false;
  function runCounter() {
    if (started) return;
    stats.forEach(stat => {
      const target = parseInt(stat.textContent.replace(/[^\d]/g, ''));
      let count = 0;
      const increment = Math.ceil(target / 100);
      const plus = stat.textContent.includes('+');
      function update() {
        count += increment;
        if (count >= target) {
          stat.textContent = target.toLocaleString() + (plus ? '+' : '');
        } else {
          stat.textContent = count.toLocaleString() + (plus ? '+' : '');
          requestAnimationFrame(update);
        }
      }
      update();
    });
    started = true;
  }
  function onScroll() {
    const section = document.querySelector('.stats-section');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      runCounter();
      window.removeEventListener('scroll', onScroll);
    }
  }
  window.addEventListener('scroll', onScroll);
  onScroll();
}
animateStats();

// Fade-in for gallery and hero slider images
function fadeInOnView(selector) {
  const els = document.querySelectorAll(selector);
  function check() {
    els.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50) {
        el.style.opacity = 1;
        el.style.transform = 'none';
      }
    });
  }
  window.addEventListener('scroll', check);
  window.addEventListener('resize', check);
  check();
}
fadeInOnView('.gallery-item img');
fadeInOnView('.slide.active img'); 