import { getAccessToken } from '@/app/actions/getAccessToken';
import { axiosInstance } from '@/lib/axios';
import axios from 'axios';
import { PriceList } from '@/types/products';

export class PriceListService {
  static async getPriceList(
    customerId: string | number, 
    companyId: string | number
  ): Promise<PriceList | null> {
    try {
      const accessToken = await getAccessToken();
      
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const url = `/pricelists?customer_id=${customerId}&company_id=${companyId}`;
            
      const { data } = await axiosInstance.get<PriceList[]>(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Cache-Control': 'no-cache',
        }
      });
      
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching price list:', error);
      }
      return null;
    }
  }

  static parsePriceString(priceStr: string): number {
    if (!priceStr) return 0;
    return parseFloat(priceStr.replace(/[$,\s]/g, '')) || 0;
  }
}

export type { PriceList };