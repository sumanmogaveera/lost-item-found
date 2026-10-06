import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchItems = async (filters) => {
  const { data } = await api.get('/items', { params: filters });
  return data;
};

export const fetchItemById = async (id) => {
  const { data } = await api.get(`/items/${id}`);
  return data;
};

export const uploadItem = async (itemData) => {
  const { data } = await api.post('/items', itemData);
  return data;
};

export const login = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

export const loginWithGoogle = async (token) => {
  const { data } = await api.post('/auth/google', { token });
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

export const register = async (userData) => {
  const { data } = await api.post('/auth/register', userData);
  return data;
};

export const updateProfile = async (profileData) => {
  const { data } = await api.put('/auth/profile', profileData);
  return data;
};

export const deleteAccount = async () => {
  const { data } = await api.delete('/auth/profile');
  return data;
};

export const fetchMyItems = async () => {
  const { data } = await api.get('/items/me');
  return data;
};

export const visualSearch = async (image) => {
  const { data } = await api.post('/ai/visual-search', { image });
  return data;
};

export const deleteItem = async (id) => {
  const { data } = await api.delete(`/items/${id}`);
  return data;
};

export const verifyItem = async (id, answer) => {
  const { data } = await api.post(`/items/${id}/verify`, { answer });
  return data;
};

export const subscribeToSearch = async (subscriptionData) => {
    const { data } = await api.post('/search-interests', subscriptionData);
    return data;
};

export const fetchMySubscriptions = async () => {
    const { data } = await api.get('/search-interests/me');
    return data;
};

export const fetchNotifications = async () => {
    const { data } = await api.get('/notifications');
    return data;
};

export const markNotificationRead = async (id) => {
    const { data } = await api.patch(`/notifications/${id}/read`);
    return data;
};

export default api;
