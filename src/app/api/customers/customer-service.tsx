import { axiosInstance } from '@/lib/axios';
import { Customer } from '@/types/customers';
import { getAccessToken } from '@/app/actions/getAccessToken';
import axios from 'axios';
 
export class CustomerService {
  static async getCustomers(): Promise<Customer[]> {
    try {
      const accessToken = await getAccessToken();
      
      if (!accessToken) {
        throw new Error('No access token available');
      }
 
      const { data } = await axiosInstance.get<Customer[]>('/customers', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Cache-Control': 'no-cache',
        }
      });
 
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching customers:', {
          status: error.response?.status,
          message: error.message,
          data: error.response?.data
        });
      }
      throw new Error('Failed to fetch customers');
    }
  }
 
    static async getCustomerById(id: number): Promise<Customer> {
    try {
      const accessToken = await getAccessToken();
      
      if (!accessToken) {
        throw new Error('No access token available');
      }
 
      const { data } = await axiosInstance.get<Customer>(`/customers/${id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Cache-Control': 'no-cache',
        }
      });
 
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching customer:', {
          status: error.response?.status,
          message: error.message,
          data: error.response?.data
        });
      }
      throw new Error('Failed to fetch customer');
    }
  }
 
  static async getCustomersByCompanyId(companyId: number): Promise<Customer[]> {
    try {
      const accessToken = await getAccessToken();
      
      if (!accessToken) {
        throw new Error('No access token available');
      }
 
      const { data } = await axiosInstance.get<Customer[]>(`/customers?company_id=${companyId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Cache-Control': 'no-cache',
        }
      });
 
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching customers by company ID:', {
          status: error.response?.status,
          message: error.message,
          data: error.response?.data
        });
      }
      throw new Error('Failed to fetch customers by company ID');
    }
  }
 
  static async searchCustomers(companyId: string, searchTerm: string): Promise<Customer[]> {
    try {
        const accessToken = await getAccessToken();
      
         if (!accessToken) {
        throw new Error('No access token available');
      }

        let url = `/customers?company_id=${companyId}`;

        if (searchTerm && searchTerm.length >= 3) {
            url += `&name=${encodeURIComponent(searchTerm)}`;
        }else{
            return [];
        }
  
        const { data } = await axiosInstance.get<Customer[]>(url, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Cache-Control': 'no-cache',
            }
          });
  
        return data;

    } catch (error) {
    if (axios.isAxiosError(error)) {
        console.error('Error searching customers:', {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
        });
    }
    throw new Error('Failed to search customers');
    }
}
}