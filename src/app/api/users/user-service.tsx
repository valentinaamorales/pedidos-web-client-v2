import { axiosInstance } from '@/lib/axios';
import { UserProfile, UsersListDto, UserQueryParams} from '@/types/users';
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

  static async getUsers(params: UserQueryParams = {}): Promise<UsersListDto[]> {
    try {
      const accessToken = await getAccessToken();
      
      if (!accessToken) {
        throw new Error('No access token available');
      }
      
      // Construir parámetros de consulta para paginación
      const queryParams = new URLSearchParams();
      if (params.limit !== undefined) {
        queryParams.append('limit', params.limit.toString());
      }
      if (params.offset !== undefined) {
        queryParams.append('offset', params.offset.toString());
      }
      
      const queryString = queryParams.toString();
      const url = `/users${queryString ? `?${queryString}` : ''}`;
      
      const { data } = await axiosInstance.get(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  static async getUserById(id: string): Promise<UserProfile> {
    try {
      const accessToken = await getAccessToken();
      
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const { data } = await axiosInstance.get<UserProfile>(`/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Cache-Control': 'no-cache',
        }
      });

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching user:', {
          status: error.response?.status,
          message: error.message,
          data: error.response?.data
        });

        if (error.response?.status === 404) {
          throw new Error('User not found');
        }
      }
      throw new Error('Failed to fetch user');
    }
  }

  static async updateProfile(profile: UserProfile): Promise<UserProfile> {
    try {
      const accessToken = await getAccessToken();
      
      if (!accessToken) {
        throw new Error('No access token available');
      }
  
      if (!profile.id) {
        throw new Error('User ID is required');
      }
  
      const { data } = await axiosInstance.patch<UserProfile>(
        `/users/${profile.id}`, 
        profile,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Cache-Control': 'no-cache',
          }
        }
      );
  
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error updating user profile:', {
          status: error.response?.status,
          message: error.message,
          data: error.response?.data
        });
  
        if (error.response?.status === 404) {
          throw new Error('User profile not found');
        }
        if (error.response?.status === 403) {
          throw new Error('Not authorized to update this profile');
        }
        if (error.response?.status === 405) {
          throw new Error('Method not allowed for this endpoint');
        }
      }
      throw new Error('Failed to update user profile');
    }
  }
}