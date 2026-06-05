// Prevent multiple form submissions
document.addEventListener('DOMContentLoaded', () => {
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
});