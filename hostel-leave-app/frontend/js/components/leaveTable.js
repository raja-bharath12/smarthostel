/**
 * LeaveTable - renders leave rows into the table body and wires
 * row-level action buttons (view approvals / cancel) to the given callbacks.
 */
const LeaveTable = {
  render(leaves, page, pageSize, { onView, onCancel }) {
    const tbody = document.getElementById('leaveTableBody');

    if (!leaves || leaves.length === 0) {
      tbody.innerHTML = '<tr><td colspan="10">No leave records found.</td></tr>';
      return;
    }

    tbody.innerHTML = leaves
      .map((leave, idx) => {
        const sno = (page - 1) * pageSize + idx + 1;
        return `
        <tr>
          <td>${sno}</td>
          <td>${escapeHtml(leave.leave_type)}</td>
          <td>${escapeHtml(leave.application_no)}</td>
          <td>${escapeHtml(leave.from_date)}</td>
          <td>${escapeHtml(leave.to_date)}</td>
          <td>${escapeHtml(leave.accompanying_person)}</td>
          <td>${leave.call_count}</td>
          <td>${escapeHtml(leave.leave_reason)}</td>
          <td><span class="badge ${leave.status}">${leave.status}</span></td>
          <td>
            <button class="icon-btn view" data-view="${leave.id}">☰</button>
            ${leave.status === 'Submitted' ? `<button class="icon-btn cancel" data-cancel="${leave.id}">✕</button>` : ''}
          </td>
        </tr>`;
      })
      .join('');

    tbody.querySelectorAll('[data-view]').forEach((btn) => {
      btn.addEventListener('click', () => onView(btn.dataset.view));
    });
    tbody.querySelectorAll('[data-cancel]').forEach((btn) => {
      btn.addEventListener('click', () => onCancel(btn.dataset.cancel));
    });
  },

  renderPagination({ page, totalPages, total }) {
    document.getElementById('pageInfo').textContent = `${page} of ${totalPages} pages (${total} items)`;
    document.getElementById('prevPage').disabled = page <= 1;
    document.getElementById('firstPage').disabled = page <= 1;
    document.getElementById('nextPage').disabled = page >= totalPages;
    document.getElementById('lastPage').disabled = page >= totalPages;
  },
};
