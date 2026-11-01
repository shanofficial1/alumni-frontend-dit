
import axios from 'axios';
import { TOKEN_KEY } from '../../config/auth';

const baseURL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: baseURL.replace(/\/+$/, ''),
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers?.Authorization) {
    delete config.headers.Authorization;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    error.userMessage =
      error.response?.data?.message ||
      (error.code === 'ECONNABORTED'
        ? 'The request timed out. Please try again.'
        : !error.response
          ? 'Unable to reach the server. Check your connection and try again.'
          : 'Something went wrong. Please try again.');

    return Promise.reject(error);
  }
);

export default api;
