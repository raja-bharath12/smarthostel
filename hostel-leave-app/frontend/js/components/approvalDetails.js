/**
 * ApprovalDetails - fills in the Approval Details modal content.
 */
const ApprovalDetails = {
  render({ faculty, parent, parentStatus }) {
    const facultyBody = document.getElementById('facultyApprovalBody');
    facultyBody.innerHTML = faculty
      .map(
        (f, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${escapeHtml(f.staff_name)}</td>
        <td>${escapeHtml(f.designation)}</td>
        <td>${f.approval_order}</td>
        <td>${escapeHtml(f.approved_date) || '-'}</td>
        <td><span class="badge ${f.status}">${f.status}</span></td>
        <td>${escapeHtml(f.approved_by) || '-'}</td>
      </tr>`
      )
      .join('');

    const parentBody = document.getElementById('parentApprovalBody');
    parentBody.innerHTML = parent
      .map(
        (p, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${escapeHtml(p.ivr_approval_no)}</td>
        <td>${p.order_no}</td>
        <td>${escapeHtml(p.call_date)}</td>
        <td>${escapeHtml(p.status)}</td>
      </tr>`
      )
      .join('');

    const statusBadge = document.getElementById('parentStatusBadge');
    statusBadge.textContent = parentStatus;
    statusBadge.className = 'badge ' + (parentStatus === 'Approved' ? 'Approved' : 'Submitted');
  },
};
