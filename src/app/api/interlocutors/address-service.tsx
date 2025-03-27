import { axiosInstance } from "@/lib/axios";
import { Address } from "@/types/addresses";
import { getAccessToken } from '@/app/actions/getAccessToken';

export class AddressService {
  static async getAddresses(
    parentId: string,
    type: "delivery" | "invoice"
  ): Promise<Address[]> {
    try {
      const accessToken = await getAccessToken();
      
      if (!accessToken) {
        throw new Error("No access token available");
      }
      
      const url = `/interlocutors?parent_id=${parentId}&contact_type=${type}`;
      
      const response = await axiosInstance.get<Address[]>(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Cache-Control': 'no-cache',
        },
        validateStatus: function (status) {
          return (status >= 200 && status < 300) || status === 404;
        }
      });

      const data = response.data;
      
      if (response.status === 404 || data.length === 0) {
        console.log(`No se encontraron direcciones de ${type}`);
        return [];
      }
      
      // Mejorar los datos para mostrar en la UI
      return data.map(address => {
        // Crear un campo de dirección completa para mostrar en la UI
        const fullAddress = [
          address.street,
          address.city,
          address.state?.[1],
          address.country?.[1]
        ].filter(Boolean).join(", ");
        
        return {
          ...address,
          id: String(address.id), // Asegurar que el ID sea string
          address: fullAddress || address.street || "Dirección no especificada"
        };
      });
      
    } catch (error: any) {
      console.error(`Error fetching ${type} addresses:`, error);
      return [];
      }
    }
  }