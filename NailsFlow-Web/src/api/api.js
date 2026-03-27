import axios from 'axios';

const API_URL = 'http://localhost:5005/api';

const getToken = () => localStorage.getItem('token');
const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (credentials) => api.post('/Auth/login', credentials),
  register: (userData) => api.post('/Auth/register', userData),
  getCurrentUser: () => api.get('/Auth/me'),
};

export const serviceApi = {
  getAll: () => api.get('/Service'),
  getById: (id) => api.get(`/Service/${id}`),
  create: (data) => api.post('/Service', data),
  update: (id, data) => api.put(`/Service/${id}`, data),
  delete: (id) => api.delete(`/Service/${id}`),
};

export const customerApi = {
  getAll: () => api.get('/Customer'),
  getById: (id) => api.get(`/Customer/${id}`),
  create: (data) => api.post('/Customer', data),
  update: (id, data) => api.put(`/Customer/${id}`, data),
  delete: (id) => api.delete(`/Customer/${id}`),
};

export const appointmentApi = {
  getAll: () => api.get('/Appointment'),
  getById: (id) => api.get(`/Appointment/${id}`),
  create: (data) => api.post('/Appointment', data),
  update: (id, data) => api.put(`/Appointment/${id}`, data),
  delete: (id) => api.delete(`/Appointment/${id}`),
};

export const promotionApi = {
  getAll: () => api.get('/Promotion'),
  getById: (id) => api.get(`/Promotion/${id}`),
  create: (data) => api.post('/Promotion', data),
  update: (id, data) => api.put(`/Promotion/${id}`, data),
  delete: (id) => api.delete(`/Promotion/${id}`),
};

export const paymentApi = {
  getAll: () => api.get('/Payment'),
  getById: (id) => api.get(`/Payment/${id}`),
  create: (data) => api.post('/Payment', data),
  update: (id, data) => api.put(`/Payment/${id}`, data),
  delete: (id) => api.delete(`/Payment/${id}`),
};

export const userApi = {
  getAll: () => api.get('/User'),
  getById: (id) => api.get(`/User/${id}`),
  create: (data) => api.post('/User', data),
  update: (id, data) => api.put(`/User/${id}`, data),
  delete: (id) => api.delete(`/User/${id}`),
};

export { getToken, getUser };
export default api;
