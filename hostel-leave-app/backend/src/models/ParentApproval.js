class ParentApproval {
  constructor({ id, leave_id, ivr_approval_no, order_no, call_date, status }) {
    this.id = id;
    this.leave_id = leave_id;
    this.ivr_approval_no = ivr_approval_no;
    this.order_no = order_no;
    this.call_date = call_date;
    this.status = status;
  }
}

module.exports = ParentApproval;
