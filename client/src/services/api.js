import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
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

// Response interceptor
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

// API endpoints
export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  createProfile: (data) => api.post('/profile', data),
  deleteProfile: () => api.delete('/profile'),
};

export const projectsAPI = {
  getProjects: (params) => api.get('/profile/projects', { params }),
  getProjectsBySkill: (skill, params) => api.get(`/profile/projects?skill=${skill}`, { params }),
};

export const skillsAPI = {
  getTopSkills: (limit) => api.get(`/profile/skills/top?limit=${limit}`),
  getSkillsByCategory: (category) => api.get(`/profile/skills?category=${category}`),
  getAllSkills: () => api.get('/profile/skills'),
};

export const searchAPI = {
  search: (query, params) => api.get(`/profile/search?q=${encodeURIComponent(query)}`, { params }),
};

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

export const healthAPI = {
  getHealth: () => api.get('/health'),
};

export default api;
