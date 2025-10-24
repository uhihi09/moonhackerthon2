import axios from 'axios';

const API_BASE_URL = 'http://135.04.103.218:8080/api';

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

// 인증 API
export const authAPI = {
  login: (credentials) => api.post('/user/login', credentials),
  register: (userData) => api.post('/user/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// 위치 API
export const locationAPI = {
  getRecentLocations: (days = 1) => api.get(`/location/recent?days=${days}`),
  getCurrentLocation: () => api.get('/location/current'),
};

// 긴급 버튼 API
export const emergencyAPI = {
  getRecords: () => api.get('/emergency/records'),
  getRecordDetail: (id) => api.get(`/emergency/records/${id}`),
  sendEmergency: (data) => api.post('/emergency/send', data),
};

// 긴급 연락처 API
export const contactAPI = {
  getContacts: () => api.get('/contacts'),
  addContact: (contact) => api.post('/contacts', contact),
  deleteContact: (id) => api.delete(`/contacts/${id}`),
};

export default api;