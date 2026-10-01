import axios from 'axios';

// Create an Axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
});

// Interceptor to add Auth Token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor to handle 401 (Unauthorized)
api.interceptors.response.use((response) => response, (error) => {
  if (error.response && error.response.status === 401) {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      // Do not redirect to login if user is on public pages or already on login
      const isPublicOrLogin = 
        pathname.includes('/login') || 
        pathname.includes('/status') || 
        pathname.includes('/join') || 
        pathname.includes('/verify') || 
        pathname.includes('/forgot-password') ||
        pathname === '/' || 
        /^\/[a-z]{2}\/?$/.test(pathname);

      if (!isPublicOrLogin) {
        localStorage.removeItem('token');
        const lang = pathname.split('/')[1] || 'en';
        window.location.href = `/${lang}/login`;
      }
    }
  }
  return Promise.reject(error);
});

export default api;
