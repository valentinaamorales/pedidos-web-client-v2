import { axiosInstance } from '@/lib/axios';
import { UserProfile, UsersListDto} from '@/types/users';
import { getAccessToken } from '@/app/actions/getAccessToken';
import axios from 'axios';

export class UserService {
  static async getProfile(): Promise<UserProfile> {
    try {
      const accessToken = await getAccessToken();
      
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const { data } = await axiosInstance.get<UserProfile>('/users/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Cache-Control': 'no-cache',
        }
      });

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching user profile:', {
          status: error.response?.status,
          message: error.message,
          data: error.response?.data
        });

        if (error.response?.status === 404) {
          throw new Error('User profile not found');
        }
      }
      throw new Error('Failed to fetch user profile');
    }
  }

  static async getUsers(): Promise<UsersListDto> {
    try {
      const accessToken = await getAccessToken();
      
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const { data } = await axiosInstance.get<UsersListDto>('/users/paginated', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Cache-Control': 'no-cache',
        }
      });

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching users:', {
          status: error.response?.status,
          message: error.message,
          data: error.response?.data
        });

        if (error.response?.status === 404) {
          throw new Error('Users not found');
        }
      }
      throw new Error('Failed to fetch users');
    }
  }
}