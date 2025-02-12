import axios from 'axios';
import { ENDPOINTS } from '@/config/api';
import { UserProfile } from '@/types/users';
import { getAccessToken } from '@/app/actions/getAccessToken';

const api = axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_API_URL
  },
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
        });
      }
      throw error;
    }
  }
}