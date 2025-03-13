import { axiosInstance } from '@/lib/axios';
import { Company } from '@/types/companies';
import { Customer } from '@/types/customers';
import { getAccessToken } from '@/app/actions/getAccessToken';
import axios from 'axios';
 
export class CompanyService {
  static async getCompanies(): Promise<Company[]> {
    try {
      const accessToken = await getAccessToken();
      
      if (!accessToken) {
        throw new Error('No access token available');
      }
 
      const { data } = await axiosInstance.get<Company[]>('/companies', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Cache-Control': 'no-cache',
        }
      });
 
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching companies:', {
          status: error.response?.status,
          message: error.message,
          data: error.response?.data
        });
      }
      throw new Error('Failed to fetch companies');
    }
  }
}