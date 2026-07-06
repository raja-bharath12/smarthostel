const VALID_STATUSES = ['Submitted', 'Approved', 'Cancelled', 'Closed', 'ForciblyClosed'];

class Leave {
  constructor({
    id,
    user_id,
    leave_type,
    application_no,
    from_date,
    to_date,
    accompanying_person = 'Self',
    call_count = 1,
    leave_reason,
    status = 'Submitted',
    created_at,
  }) {
    this.id = id;
    this.user_id = user_id;
    this.leave_type = leave_type;
    this.application_no = application_no;
    this.from_date = from_date;
    this.to_date = to_date;
    this.accompanying_person = accompanying_person;
    this.call_count = call_count;
    this.leave_reason = leave_reason;
    this.status = status;
    this.created_at = created_at || new Date().toISOString();
  }

  static isValidStatus(status) {
    return VALID_STATUSES.includes(status);
  }
}

Leave.VALID_STATUSES = VALID_STATUSES;

module.exports = Leave;
