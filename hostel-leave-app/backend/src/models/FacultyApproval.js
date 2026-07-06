class FacultyApproval {
  constructor({
    id,
    leave_id,
    staff_name,
    designation,
    approval_order,
    approved_date = null,
    status = 'Submitted',
    approved_by = null,
  }) {
    this.id = id;
    this.leave_id = leave_id;
    this.staff_name = staff_name;
    this.designation = designation;
    this.approval_order = approval_order;
    this.approved_date = approved_date;
    this.status = status;
    this.approved_by = approved_by;
  }
}

module.exports = FacultyApproval;
