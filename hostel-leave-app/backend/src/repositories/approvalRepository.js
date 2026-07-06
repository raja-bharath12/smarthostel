const store = require('./jsonStore');
const FacultyApproval = require('../models/FacultyApproval');
const ParentApproval = require('../models/ParentApproval');

class ApprovalRepository {
  createFacultyApproval(data) {
    const id = store.nextId('faculty_approvals');
    const approval = new FacultyApproval({ id, ...data });
    store.table('faculty_approvals').push({ ...approval });
    store.persist();
    return approval;
  }

  createParentApproval(data) {
    const id = store.nextId('parent_approvals');
    const approval = new ParentApproval({ id, ...data });
    store.table('parent_approvals').push({ ...approval });
    store.persist();
    return approval;
  }

  getFacultyApprovals(leaveId) {
    return store
      .table('faculty_approvals')
      .filter((f) => f.leave_id === Number(leaveId))
      .sort((a, b) => a.approval_order - b.approval_order || a.id - b.id)
      .map((row) => new FacultyApproval(row));
  }

  getParentApprovals(leaveId) {
    return store
      .table('parent_approvals')
      .filter((p) => p.leave_id === Number(leaveId))
      .sort((a, b) => a.id - b.id)
      .map((row) => new ParentApproval(row));
  }
}

module.exports = new ApprovalRepository();
