import api from './client';
export const authApi = {
  register: async (payload) => (await api.post('/auth/register', payload)).data,
  login: async (payload) => (await api.post('/auth/login', payload)).data,
  adminLogin: async (payload) => (await api.post('/auth/admin/login', payload)).data,
  me: async () => (await api.get('/auth/me')).data,
};
export const alumniApi = {
  myProfile: async () => (await api.get('/alumni/me')).data,
  updateMyProfile: async (payload) => (await api.patch('/alumni/me', payload)).data,
  list: async (params) => (await api.get('/alumni', { params })).data,
};
