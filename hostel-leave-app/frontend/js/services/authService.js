/**
 * AuthService wraps all authentication-related API calls.
 */
const AuthService = {
  async login(username, password) {
    return ApiClient.post('/login', { username, password });
  },

  async logout() {
    try {
      await ApiClient.post('/logout');
    } catch (e) {
      // ignore network errors on logout, still clear local session
    }
    ApiClient.clearSession();
  },
};
