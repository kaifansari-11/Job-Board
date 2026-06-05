// Prevent multiple form submissions
document.addEventListener('DOMContentLoaded', () => {
  // Form protection
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function (e) {
      const btn = this.querySelector('button[type="submit"]');
      if (btn) {
        if (btn.dataset.submitted === 'true') {
          e.preventDefault();
          return;
        }
        btn.dataset.submitted = 'true';
        btn.disabled = true;
        btn.textContent = 'Submitting...';
      }
    });
  });

  // Hamburger menu
  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('navMobile');
  if (hamburger && navMobile) {
    hamburger.addEventListener('click', () => {
      navMobile.classList.toggle('open');
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navMobile.contains(e.target)) {
        navMobile.classList.remove('open');
      }
    });
  }
});