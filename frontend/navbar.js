// Navbar interactivity for all pages

document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const navLinks = document.querySelectorAll('.desktop-nav a, .mobile-nav a');

  // Hamburger menu toggle
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !isOpen);
      mobileNav.hidden = isOpen;
    });

    // Close mobile nav on link click
    mobileNav.addEventListener('click', function(e) {
      if (e.target.tagName === 'A') {
        mobileNav.hidden = true;
        hamburger.setAttribute('aria-expanded', false);
      }
    });

    // Hide mobile nav if resizing to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 700) {
        mobileNav.hidden = true;
        hamburger.setAttribute('aria-expanded', false);
      }
    });

    // Optional: close mobile nav if clicking outside
    document.addEventListener('click', function(e) {
      if (!mobileNav.hidden && window.innerWidth <= 700) {
        if (!mobileNav.contains(e.target) && !hamburger.contains(e.target)) {
          mobileNav.hidden = true;
          hamburger.setAttribute('aria-expanded', false);
        }
      }
    });
  }

  // Highlight active link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
  const header = document.querySelector('.main-header');
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}); 