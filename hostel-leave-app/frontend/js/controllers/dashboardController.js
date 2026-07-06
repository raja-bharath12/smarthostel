/**
 * DashboardController - the "glue" for the Leave Apply page.
 * Delegates data access to LeaveService/AuthService and rendering to the
 * LeaveTable/ApprovalDetails/Modal/Toast components.
 */
document.addEventListener('DOMContentLoaded', () => {
  if (!ApiClient.isAuthenticated()) {
    window.location.href = 'login.html';
    return;
  }

  const user = ApiClient.getUser();
  document.getElementById('userIdLabel').textContent = user.username || '--';

  let currentPage = 1;
  let pageSize = 10;

  async function loadLeaves() {
    const tbody = document.getElementById('leaveTableBody');
    tbody.innerHTML = '<tr><td colspan="10">Loading...</td></tr>';

    try {
      const result = await LeaveService.list(currentPage, pageSize);

      if (!result.success) {
        tbody.innerHTML = '<tr><td colspan="10">Could not load leave records.</td></tr>';
        return;
      }

      LeaveTable.render(result.data, currentPage, pageSize, {
        onView: openApprovalModal,
        onCancel: cancelLeave,
      });
      LeaveTable.renderPagination(result.pagination);
    } catch (err) {
      tbody.innerHTML = '<tr><td colspan="10">Could not load leave records.</td></tr>';
    }
  }

  async function cancelLeave(id) {
    if (!confirm('Are you sure you want to cancel this leave request?')) return;

    try {
      const result = await LeaveService.cancel(id);
      if (result.success) {
        Toast.show('Leave cancelled.');
        loadLeaves();
      } else {
        Toast.show(result.message || 'Could not cancel leave.', true);
      }
    } catch (err) {
      Toast.show('Network error while cancelling leave.', true);
    }
  }

  async function openApprovalModal(id) {
    try {
      const result = await LeaveService.getApprovalDetails(id);
      if (!result.success) {
        Toast.show(result.message || 'Could not load approval details.', true);
        return;
      }
      ApprovalDetails.render(result);
      Modal.open('approvalModalOverlay');
    } catch (err) {
      Toast.show('Network error while loading approval details.', true);
    }
  }

  // ---- Apply Leave modal ----
  document.getElementById('openApplyModal').addEventListener('click', () => {
    document.getElementById('serverTimeNotice').textContent =
      `Server Time: ${formatServerTime()}. From Date Time must be greater than server time.`;
    Modal.open('applyModalOverlay');
  });

  document.getElementById('submitApply').addEventListener('click', async () => {
    const leave_type = document.getElementById('leaveType').value;
    const from_date = document.getElementById('fromDate').value;
    const to_date = document.getElementById('toDate').value;
    const accompanying_person = document.getElementById('accompanyingPerson').value || 'Self';
    const leave_reason = document.getElementById('leaveReasonType').value;

    if (!leave_type || !from_date || !to_date || !leave_reason) {
      Toast.show('Please fill all required fields.', true);
      return;
    }
    if (new Date(from_date) < new Date()) {
      Toast.show('From Date Time must be greater than server time.', true);
      return;
    }
    if (new Date(to_date) <= new Date(from_date)) {
      Toast.show('To Date must be after From Date.', true);
      return;
    }

    try {
      const result = await LeaveService.apply({ leave_type, from_date, to_date, accompanying_person, leave_reason });
      if (result.success) {
        Toast.show('Leave applied successfully.');
        Modal.close('applyModalOverlay');
        currentPage = 1;
        loadLeaves();
      } else {
        Toast.show(result.message || 'Could not apply leave.', true);
      }
    } catch (err) {
      Toast.show('Network error while applying leave.', true);
    }
  });

  Modal.bindCloseButtons();

  // ---- Pagination controls ----
  document.getElementById('pageSizeSelect').addEventListener('change', (e) => {
    pageSize = parseInt(e.target.value, 10);
    currentPage = 1;
    loadLeaves();
  });
  document.getElementById('firstPage').addEventListener('click', () => {
    currentPage = 1;
    loadLeaves();
  });
  document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      loadLeaves();
    }
  });
  document.getElementById('nextPage').addEventListener('click', () => {
    currentPage++;
    loadLeaves();
  });
  document.getElementById('lastPage').addEventListener('click', async () => {
    const result = await LeaveService.list(1, pageSize);
    currentPage = result.pagination.totalPages;
    loadLeaves();
  });

  // ---- Logout / mobile nav ----
  document.getElementById('logoutBtn').addEventListener('click', async () => {
    await AuthService.logout();
    window.location.href = 'login.html';
  });

  document.getElementById('hamburgerBtn').addEventListener('click', () => {
    const sb = document.getElementById('sidebar');
    sb.style.display = sb.style.display === 'block' ? 'none' : 'block';
  });

  loadLeaves();
});
