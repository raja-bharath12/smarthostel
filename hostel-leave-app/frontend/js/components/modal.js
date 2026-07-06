/**
 * Modal - generic open/close helper for overlay modals.
 * Any element with [data-close="someModalId"] will close that modal on click.
 */
const Modal = {
  open(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('open');
  },

  close(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
  },

  bindCloseButtons() {
    document.querySelectorAll('[data-close]').forEach((btn) => {
      btn.addEventListener('click', () => Modal.close(btn.dataset.close));
    });
  },
};
