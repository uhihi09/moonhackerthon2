import axios from 'axios';

// 환경에 따른 API Base URL 설정
const API_BASE_URL = import.meta.env.DEV 
  ? '' // 개발 환경: 프록시 사용
  : (import.meta.env.VITE_API_URL || 'http://localhost:8080');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ✅ 인증 API
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  signup: (userData) => api.post('/api/auth/signup', userData),
  logout: () => {
    api.post('/api/auth/logout').catch(() => {});
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// ✅ 사용자 정보 API
export const userAPI = {
  getCurrentUser: () => api.get('/api/user/me'),
  getEmergencyContacts: () => api.get('/api/user/emergency-contacts'),
  addEmergencyContact: (contact) => api.post('/api/user/emergency-contacts', contact),
  updateEmergencyContact: (contactId, contact) => 
    api.put(`/api/user/emergency-contacts/${contactId}`, contact),
  deleteEmergencyContact: (contactId) => 
    api.delete(`/api/user/emergency-contacts/${contactId}`),
};

// ✅ 위치 API
export const locationAPI = {
  getHistory: (limit = 10) => api.get(`/api/location/history?limit=${limit}`),
  getRecentLocations: () => api.get('/api/location/recent'),
  getLocationByDateRange: (startDate, endDate) => 
    api.get(`/api/location/history/range?startDate=${startDate}&endDate=${endDate}`),
  getCurrentLocation: () => api.get('/api/location/current'), // 기존 코드 호환
};

// ✅ 긴급 알림 API
export const emergencyAPI = {
  createAlert: (data) => api.post('/api/emergency/alert', data),
  getAlerts: () => api.get('/api/emergency/alerts'),
  getAlertDetail: (alertId) => api.get(`/api/emergency/alerts/${alertId}`),
  resolveAlert: (alertId) => api.patch(`/api/emergency/alerts/${alertId}/resolve`),
  // 기존 코드 호환
  getRecords: () => api.get('/api/emergency/alerts'),
  getRecordDetail: (id) => api.get(`/api/emergency/alerts/${id}`),
  sendEmergency: (data) => api.post('/api/emergency/alert', data),
};

// ✅ 긴급 연락처 API
export const contactAPI = {
  getContacts: () => api.get('/api/user/emergency-contacts'),
  addContact: (contact) => api.post('/api/user/emergency-contacts', contact),
  updateContact: (id, contact) => api.put(`/api/user/emergency-contacts/${id}`, contact),
  deleteContact: (id) => api.delete(`/api/user/emergency-contacts/${id}`),
};

export default api;