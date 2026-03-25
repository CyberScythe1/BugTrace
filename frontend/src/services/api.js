import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('bt_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const analyzeCode = (payload) => api.post('/reviews/analyze', payload).then(r => r.data);
export const getReviews = () => api.get('/reviews').then(r => r.data);
export const getReview = (id) => api.get(`/reviews/${id}`).then(r => r.data);
export const getAdminStats = () => api.get('/admin/stats').then(r => r.data);
export const getAdminUsers = () => api.get('/admin/users').then(r => r.data);
export const getAdminReviews = () => api.get('/admin/reviews').then(r => r.data);

export default api;
