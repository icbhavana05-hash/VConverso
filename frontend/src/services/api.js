import axios from 'axios';

// Resolve backend API base URL with flexible fallbacks
const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  import.meta.env.REACT_APP_API_URL || 
  'http://localhost:5000/api';

console.log(`[API Service] Requesting backend at base: ${API_BASE_URL}`);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to automatically attach JWT Session Token to outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle session expiration or unauthorized requests
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('[API Service] Unauthorized access detected - Clearing token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Optional: Redirect to login page if window is defined
      if (typeof window !== 'undefined' && !window.location.pathname.endsWith('/login') && !window.location.pathname.endsWith('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
