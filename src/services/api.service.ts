import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com';

const api = axios.create({ baseURL: API_URL, timeout: 30000 });

export const sService = {
  getAll: () => api.get('/').then(r => r.data),
  getById: (id: string) => api.get(`/${id}`).then(r => r.data),
  create: (data: unknown) => api.post('/', data).then(r => r.data),
  update: (id: string, data: unknown) => api.put(`/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/${id}`),
};

export default sService;
