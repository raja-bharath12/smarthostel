const crypto = require('crypto');
const userRepository = require('../repositories/userRepository');

// In-memory session store: token -> { id, username, full_name }
const sessions = new Map();

class AuthService {
  generateToken() {
    return 'tok_' + crypto.randomBytes(16).toString('hex');
  }

  login(username, password) {
    const user = userRepository.findByUsername(username);

    if (!user || user.password !== password) {
      return { success: false, message: 'Invalid username or password.' };
    }

    const token = this.generateToken();
    sessions.set(token, user.toPublic());

    return { success: true, token, user: user.toPublic() };
  }

  logout(token) {
    sessions.delete(token);
  }

  getSessionUser(token) {
    return sessions.get(token) || null;
  }
}

module.exports = new AuthService();
