// Common Navigation Bar JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Hamburger menu functionality
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.getElementById('mobileNav');
  
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function() {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      mobileNav.hidden = expanded;
      this.setAttribute('aria-expanded', !expanded);
    });
    
    // Touch fallback for mobile browsers
    hamburger.addEventListener('touchstart', function(e) {
      e.preventDefault();
      this.click();
    });
    
    // Hide mobile nav if resizing to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 700) {
        mobileNav.hidden = true;
        hamburger.setAttribute('aria-expanded', false);
      }
    });
    
    // Close mobile nav when clicking on a link
    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.hidden = true;
        hamburger.setAttribute('aria-expanded', false);
      });
    });
  }
  
  // Add active class to current page link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.desktop-nav a, .mobile-nav a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}); 