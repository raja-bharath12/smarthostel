/**
 * ApiClient centralizes all HTTP communication with the backend.
 * Every service (auth, leave, ...) goes through this instead of calling
 * fetch() directly, so headers/error handling stay in one place.
 */
const ApiClient = {
  baseUrl: '/api',

  getToken() {
    return localStorage.getItem('shToken');
  },

  setSession(token, user) {
    localStorage.setItem('shToken', token);
    localStorage.setItem('shUser', JSON.stringify(user));
  },

  clearSession() {
    localStorage.removeItem('shToken');
    localStorage.removeItem('shUser');
  },

  getUser() {
    return JSON.parse(localStorage.getItem('shUser') || '{}');
  },

  isAuthenticated() {
    return Boolean(this.getToken());
  },

  _headers() {
    const headers = { 'Content-Type': 'application/json' };
    const token = this.getToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;
    return headers;
  },

  async request(method, path, body) {
    const res = await fetch(this.baseUrl + path, {
      method,
      headers: this._headers(),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 401) {
      this.clearSession();
      window.location.href = '/pages/login.html';
      throw new Error('Session expired.');
    }

    return res.json();
  },

  get(path) {
    return this.request('GET', path);
  },
  post(path, body) {
    return this.request('POST', path, body);
  },
  del(path) {
    return this.request('DELETE', path);
  },
};
