const store = require('./jsonStore');
const User = require('../models/User');

class UserRepository {
  findByUsername(username) {
    const row = store.table('users').find((u) => u.username === username);
    return row ? new User(row) : null;
  }

  findById(id) {
    const row = store.table('users').find((u) => u.id === Number(id));
    return row ? new User(row) : null;
  }

  create({ username, password, full_name, parent_phone }) {
    const id = store.nextId('users');
    const row = { id, username, password, full_name, parent_phone };
    store.table('users').push(row);
    store.persist();
    return new User(row);
  }
}

module.exports = new UserRepository();
