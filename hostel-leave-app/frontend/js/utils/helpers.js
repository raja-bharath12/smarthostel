/**
 * Small collection of pure helper functions shared across controllers/components.
 */

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

function formatServerTime(date = new Date()) {
  return date.toLocaleString();
}
