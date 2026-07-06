/**
 * Toast - simple bottom-right notification popup.
 * Expects an element with id="toast" to exist on the page.
 */
const Toast = {
  show(message, isError = false) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.className = 'toast show' + (isError ? ' error' : '');
    setTimeout(() => (el.className = 'toast'), 3000);
  },
};
