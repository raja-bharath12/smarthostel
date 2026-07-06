const authService = require('../services/authService');

function authMiddleware(req, res, next) {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  const user = authService.getSessionUser(token);

  if (!user) {
    return res.status(401).json({ success: false, message: 'Not authenticated. Please log in again.' });
  }

  req.user = user;
  req.token = token;
  next();
}

module.exports = authMiddleware;
