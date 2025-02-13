import axios from 'axios';
import { ENDPOINTS } from '@/config/api';
import { UserProfile } from '@/types/users';
import { getAccessToken } from '@/app/actions/getAccessToken';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to handle credentials
api.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});

export class UserService {
  static async getProfile(): Promise<UserProfile> {
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      throw new Error('No access token available');
    }

    try {
      const { data } = await api.get<UserProfile>(ENDPOINTS.userProfile, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching user profile:', {
          status: error.response?.status,
          message: error.message,
          data: error.response?.data
        });
      }
      throw error;
    }
  }
}