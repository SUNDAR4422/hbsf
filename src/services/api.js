import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });

        localStorage.setItem('access_token', response.data.access);
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  logout: () => api.post('/auth/logout/'),
  changePassword: (data) => api.post('/auth/change-password/', data),
  getMe: () => api.get('/auth/me/'),
  createWarden: (data) => api.post('/auth/wardens/create/', data),
  listWardens: () => api.get('/auth/wardens/'),
  updateWarden: (id, data) => api.patch(`/auth/wardens/${id}/`, data),
  deleteWarden: (id) => api.delete(`/auth/wardens/${id}/`),
  getDeanProfile: () => api.get('/auth/dean-profile/'),
  updateDeanProfile: (data) => api.put('/auth/dean-profile/', data),
};

// Student APIs
export const studentAPI = {
  getProfile: () => api.get('/students/profile/'),
  updateProfile: (data) => api.put('/students/profile/', data),
  listDepartments: () => api.get('/students/departments/'),
  bulkUpload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/students/bulk-upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  listStudents: () => api.get('/students/list/'),
  createStudent: (data) => api.post('/students/create/', data),
  updateStudent: (id, data) => api.put(`/students/${id}/`, data),
  deleteStudent: (id) => api.delete(`/students/${id}/`),
  getStudent: (id) => api.get(`/students/${id}/`),
};

// Students Management APIs (Dean)
export const studentsAPI = {
  getDepartments: () => api.get('/students/departments/'),
  createDepartment: (data) => api.post('/students/departments/manage/', data),
  updateDepartment: (id, data) => api.put(`/students/departments/${id}/`, data),
  deleteDepartment: (id) => api.delete(`/students/departments/${id}/`),
  getAcademicYear: () => api.get('/students/academic-year/'),
  updateAcademicYear: (data) => api.put('/students/academic-year/', data),
};

// Bonafide APIs
export const bonafideAPI = {
  createRequest: (data) => {
    const isFormData = data instanceof FormData;
    return api.post('/bonafide/request/create/', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
  },
  getMyRequests: () => api.get('/bonafide/requests/my/'),
  getAllRequests: () => api.get('/bonafide/requests/all/'),
  getWardenPendingRequests: () => api.get('/bonafide/requests/warden/pending/'),
  getWardenPending: () => api.get('/bonafide/requests/warden/pending/'),
  getDeanPendingRequests: () => api.get('/bonafide/requests/dean/pending/'),
  getDeanPending: () => api.get('/bonafide/requests/dean/pending/'),
  wardenReview: (requestId, data) => api.post(`/bonafide/review/warden/${requestId}/`, data),
  deanReview: (requestId, data) => api.post(`/bonafide/review/dean/${requestId}/`, data),
  download: (requestId) => api.get(`/bonafide/download/${requestId}/`, { responseType: 'blob' }),
  verify: (verificationCode) => api.get(`/bonafide/verify/${verificationCode}/`),
  getSettings: () => api.get('/bonafide/settings/'),
  updateSettings: (data) => api.put('/bonafide/settings/', data),
};

// Hostel APIs
export const hostelAPI = {
  list: () => api.get('/hostels/'),
  getHostels: () => api.get('/hostels/'),
  create: (data) => api.post('/hostels/create/', data),
  getDetails: (id) => api.get(`/hostels/${id}/`),
  update: (id, data) => api.put(`/hostels/${id}/`, data),
  getWardenProfile: () => api.get('/hostels/warden/profile/'),
  createWardenProfile: (data) => api.post('/hostels/warden/create/', data),
  listWardens: () => api.get('/hostels/wardens/'),
  getWardens: () => api.get('/hostels/wardens/'),
  updateWardenProfile: (id, data) => api.patch(`/hostels/wardens/${id}/`, data),
  deleteWardenProfile: (id) => api.delete(`/hostels/wardens/${id}/`),
  
  // Bank Account APIs
  getBankAccounts: (hostelId = null) => api.get('/hostels/bank-accounts/', { params: hostelId ? { hostel: hostelId } : {} }),
  createBankAccount: (data) => api.post('/hostels/bank-accounts/', data),
  updateBankAccount: (id, data) => api.put(`/hostels/bank-accounts/${id}/`, data),
  deleteBankAccount: (id) => api.delete(`/hostels/bank-accounts/${id}/`),
};// Audit APIs
export const auditAPI = {
  getLogs: () => api.get('/audit/logs/'),
  getMyLogs: () => api.get('/audit/logs/my/'),
};

export default api;
