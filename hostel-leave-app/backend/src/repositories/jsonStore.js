const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', '..', 'data.json');

function defaultData() {
  return {
    nextIds: { users: 1, leaves: 1, faculty_approvals: 1, parent_approvals: 1 },
    users: [],
    leaves: [],
    faculty_approvals: [],
    parent_approvals: [],
  };
}

class JsonStore {
  constructor(file = DB_FILE) {
    this.file = file;
    this.data = this._load();
  }

  _load() {
    if (!fs.existsSync(this.file)) {
      const data = defaultData();
      fs.writeFileSync(this.file, JSON.stringify(data, null, 2));
      return data;
    }
    return JSON.parse(fs.readFileSync(this.file, 'utf-8'));
  }

  persist() {
    fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2));
  }

  nextId(table) {
    const id = this.data.nextIds[table]++;
    this.persist();
    return id;
  }

  table(name) {
    return this.data[name];
  }
}

// Singleton instance shared across all repositories
const store = new JsonStore();

module.exports = store;
