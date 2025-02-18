import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/auth/login';  // por si el back responde 401 mandar al login
    }
    return Promise.reject(error);
  }
);

