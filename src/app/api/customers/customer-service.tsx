import { axiosInstance } from '@/lib/axios';
import { Customer } from '@/types/customers';
import { getAccessToken } from '@/app/actions/getAccessToken';
import axios, { CancelTokenSource } from 'axios';
 
export class CustomerService {

  static currentRequest: CancelTokenSource | null = null;

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
 
  static async searchCustomers(
    companyId: string | number,
    searchTerm: string,
    page: number = 0,
    limit: number = 10
  ): Promise<Customer[]> {
    try {
        const accessToken = await getAccessToken();
      
        if (!accessToken) {
          throw new Error('No access token available');
      }
      
      if (CustomerService.currentRequest){
        CustomerService.currentRequest.cancel('Petición cancelada por nueva búsqueda');
      }

      const offset = page * limit;

        // Crear nuevo token de cancelación para esta petición
        CustomerService.currentRequest = axios.CancelToken.source();

        let url = `/customers?company_id=${companyId}&offset=${offset}&limit=${limit}`;

        if (searchTerm && searchTerm.length >= 3) {
            url += `&name=${encodeURIComponent(searchTerm)}`;
        }else{
            return [];
        }
  
        const { data } = await axiosInstance.get<Customer[]>(url, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Cache-Control': 'no-cache',
            },
            cancelToken: CustomerService.currentRequest.token
          });
  
        return data;

    } catch (error) {
      if(axios.isCancel(error)){
        return [];
      }
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