const leaveRepository = require('../repositories/leaveRepository');
const approvalRepository = require('../repositories/approvalRepository');

const DEFAULT_APPROVAL_CHAIN = [
  ['IVR IVR', 'IVR', 1],
  ['Class Advisor', 'Class Advisor', 2],
  ['HOD', 'HOD', 3],
  ['Warden', 'Warden', 4],
];

class LeaveService {
  listForUser(userId, page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    const total = leaveRepository.countForUser(userId);
    const data = leaveRepository.findForUser(userId, offset, pageSize);

    return {
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    };
  }

  applyLeave(userId, { leave_type, from_date, to_date, leave_reason, accompanying_person }) {
    if (!leave_type || !from_date || !to_date || !leave_reason) {
      return { success: false, message: 'All required fields must be filled.' };
    }

    if (new Date(to_date) <= new Date(from_date)) {
      return { success: false, message: 'To Date must be after From Date.' };
    }

    const applicationNo = String(Math.floor(100000 + Math.random() * 899999));

    const leave = leaveRepository.create({
      user_id: userId,
      leave_type,
      application_no: applicationNo,
      from_date,
      to_date,
      accompanying_person: accompanying_person || 'Self',
      call_count: 1,
      leave_reason,
      status: 'Submitted',
    });

    DEFAULT_APPROVAL_CHAIN.forEach(([staff_name, designation, approval_order]) => {
      approvalRepository.createFacultyApproval({
        leave_id: leave.id,
        staff_name,
        designation,
        approval_order,
        approved_date: null,
        status: 'Submitted',
        approved_by: null,
      });
    });

    return { success: true, message: 'Leave applied successfully.', application_no: applicationNo, leave };
  }

  cancelLeave(userId, leaveId) {
    const leave = leaveRepository.findById(leaveId, userId);

    if (!leave) {
      return { success: false, status: 404, message: 'Leave not found.' };
    }
    if (leave.status !== 'Submitted') {
      return { success: false, status: 400, message: 'Only submitted leaves can be cancelled.' };
    }

    leaveRepository.updateStatus(leave.id, 'Cancelled');
    return { success: true, message: 'Leave cancelled.' };
  }

  getApprovalDetails(userId, leaveId) {
    const leave = leaveRepository.findById(leaveId, userId);
    if (!leave) {
      return { success: false, status: 404, message: 'Leave not found.' };
    }

    const faculty = approvalRepository.getFacultyApprovals(leave.id);
    const parent = approvalRepository.getParentApprovals(leave.id);
    const parentStatus =
      parent.length && parent.every((p) => p.status === 'Call Answer') ? 'Approved' : 'Pending';

    return { success: true, faculty, parent, parentStatus };
  }
}

module.exports = new LeaveService();
