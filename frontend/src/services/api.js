import axios from 'axios';
import { auth } from '../../firebase/firebase-config';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (email, password, name) => 
    api.post('/auth/register', { email, password, name }),
  login: (idToken) => 
    api.post('/auth/login', { idToken }),
  verify: () => 
    api.get('/auth/verify')
};

export const itemsAPI = {
  getAll: (limit = 20) => 
    api.get('/items/', { params: { limit } }),
  getById: (id) => 
    api.get(`/items/${id}`),
  create: (data) => 
    api.post('/items/', data),
  delete: (id) => 
    api.delete(`/items/${id}`)
};

export const ratingsAPI = {
  getItemRatings: (itemId) => 
    api.get(`/ratings/item/${itemId}`),
  addRating: (itemId, rating) => 
    api.post('/ratings/', { itemId, rating }),
  getUserRating: (itemId) => 
    api.get(`/ratings/user/${itemId}`)
};

export const recommendationsAPI = {
  getUserRecommendations: (limit = 10) => 
    api.get('/recommendations/user', { params: { limit } })
};

export const adminAPI = {
  getUsers: () => 
    api.get('/admin/users'),
  deleteUser: (userId) => 
    api.delete(`/admin/users/${userId}`),
  updateUserRole: (userId, role) => 
    api.put(`/admin/users/${userId}/role`, { role }),
  getStats: () => 
    api.get('/admin/stats')
};

export default api;