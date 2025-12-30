import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Auth Services
export const authAPI = {
  register: (email, password, username) =>
    api.post('/auth/register', { email, password, username }),
  
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  
  getUser: () => api.get('/auth/user'),
};

// Review Services
export const reviewAPI = {
  submitReview: (code, title, language) =>
    api.post('/reviews', { code, title, language }),
  
  getReviews: (page = 1, limit = 10) =>
    api.get(`/reviews?page=${page}&limit=${limit}`),
  
  getReview: (id) =>
    api.get(`/reviews/${id}`),
  
  deleteReview: (id) =>
    api.delete(`/reviews/${id}`),
};

// Feedback Services
export const feedbackAPI = {
  submitFeedback: (reviewId, accuracy, helpfulness, trust, time_spent, comments) =>
    api.post(`/reviews/${reviewId}/feedback`, { 
      accuracy, 
      helpfulness, 
      trust, 
      time_spent, 
      comments 
    }),
  
  getFeedback: (reviewId) =>
    api.get(`/reviews/${reviewId}/feedback`),
  
  getStatistics: () =>
    api.get('/statistics'),
};

export default api;

