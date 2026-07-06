const store = require('./jsonStore');
const Leave = require('../models/Leave');

class LeaveRepository {
  countForUser(userId) {
    return store.table('leaves').filter((l) => l.user_id === Number(userId)).length;
  }

  findForUser(userId, offset, limit) {
    return store
      .table('leaves')
      .filter((l) => l.user_id === Number(userId))
      .sort((a, b) => b.id - a.id)
      .slice(offset, offset + limit)
      .map((row) => new Leave(row));
  }

  findById(id, userId) {
    const row = store
      .table('leaves')
      .find((l) => l.id === Number(id) && l.user_id === Number(userId));
    return row ? new Leave(row) : null;
  }

  create(leaveData) {
    const id = store.nextId('leaves');
    const leave = new Leave({ id, ...leaveData });
    store.table('leaves').push({ ...leave });
    store.persist();
    return leave;
  }

  updateStatus(id, status) {
    const row = store.table('leaves').find((l) => l.id === Number(id));
    if (!row) return null;
    row.status = status;
    store.persist();
    return new Leave(row);
  }
}

module.exports = new LeaveRepository();
