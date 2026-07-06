const authService = require('../services/authService');

class AuthController {
  login(req, res) {
    const { username, password } = req.body;
    const result = authService.login(username, password);

    if (!result.success) {
      return res.status(401).json(result);
    }

    res.json(result);
  }

  logout(req, res) {
    authService.logout(req.token);
    res.json({ success: true });
  }
}

module.exports = new AuthController();
