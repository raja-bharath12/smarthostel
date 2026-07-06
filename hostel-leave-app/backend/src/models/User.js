class User {
  constructor({ id, username, password, full_name, parent_phone }) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.full_name = full_name;
    this.parent_phone = parent_phone;
  }

  /** Returns a version of the user safe to send to the client (no password). */
  toPublic() {
    return {
      id: this.id,
      username: this.username,
      full_name: this.full_name,
    };
  }
}

module.exports = User;
