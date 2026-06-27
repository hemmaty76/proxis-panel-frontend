import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403 && error.response?.data?.detail === 'PASSWORD_CHANGE_REQUIRED') {
      localStorage.setItem('password_change_required', 'true');
      if (window.location.pathname !== '/force-password-change') {
        window.location.href = '/force-password-change';
      }
    }
    return Promise.reject(error);
  }
);