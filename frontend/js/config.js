// ─────────────────────────────────────────────────────────────────────────────
// config.js — Change API_BASE_URL to your deployed Render backend URL
// ─────────────────────────────────────────────────────────────────────────────

const CONFIG = {
  // 🔴 IMPORTANT: Replace with your Render backend URL after deploying
  API_BASE_URL: 'https://fitness-tracker1-z6m1.onrender.com/api',

  // For local development, use:
  // API_BASE_URL: 'http://localhost:5000/api',
};

// Token helpers
const Auth = {
  getToken: () => localStorage.getItem('fittrack_token'),
  getUser: () => {
    const u = localStorage.getItem('fittrack_user');
    return u ? JSON.parse(u) : null;
  },
  setSession: (token, user) => {
    localStorage.setItem('fittrack_token', token);
    localStorage.setItem('fittrack_user', JSON.stringify(user));
  },
  clear: () => {
    localStorage.removeItem('fittrack_token');
    localStorage.removeItem('fittrack_user');
  },
  isLoggedIn: () => !!localStorage.getItem('fittrack_token'),
  requireAuth: () => {
    if (!Auth.isLoggedIn()) {
      window.location.href = '/pages/login.html';
      return false;
    }
    return true;
  },
};

// API fetch wrapper
async function apiFetch(endpoint, options = {}) {
  const token = Auth.getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}
