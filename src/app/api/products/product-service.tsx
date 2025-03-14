import { getAccessToken } from '@/app/actions/getAccessToken';
import { axiosInstance } from '@/lib/axios';
import axios from 'axios';

export interface Product {
  id: string;
  name: string;
  unit: string;
  // Añade otros campos que vengan del backend según sea necesario
  price?: number;
  code?: string;
}

export class ProductService {
  static async searchProducts(
    companyId: string | number,
    searchTerm?: string
  ): Promise<Product[]> {
    try {
      const accessToken = await getAccessToken();
      
      if (!accessToken) {
        throw new Error('No access token available');
      }

      // Construir URL con parámetros
      let url = `/products?company_id=${companyId}`;
      
      // Solo añadir el parámetro name si hay un término de búsqueda de al menos 3 caracteres
      if (searchTerm && searchTerm.length >= 3) {
        url += `&name=${encodeURIComponent(searchTerm)}`;
      } else if (searchTerm && searchTerm.length > 0) {
        // Si hay un término pero no alcanza los 3 caracteres, no buscar
        return [];
      }
      
      console.log('Fetching products from:', url);
      
      const { data } = await axiosInstance.get<Product[]>(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Cache-Control': 'no-cache',
        }
      });
      
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error searching products:', {
          status: error.response?.status,
          message: error.message,
          data: error.response?.data
        });
      }
      throw new Error('Failed to search products');
    }
  }
}