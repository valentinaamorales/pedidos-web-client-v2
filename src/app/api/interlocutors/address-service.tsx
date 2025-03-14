import { Address } from "@/types/addresses";
import { getAccessToken } from '@/app/actions/getAccessToken';
import { axiosInstance } from '@/lib/axios';

// Direcciones por defecto para casos donde la API no devuelve datos
const defaultDeliveryAddress: Address = {
  id: "delivery-default",
  name: "Dirección Principal",
  type: "delivery",
  city: "Ciudad de México",
  street: "Calle Principal #123",
  state: [1, "CDMX"],
  country: [52, "México"],
  address: "Calle Principal #123, Ciudad de México, CDMX"
};

const defaultInvoiceAddress: Address = {
  id: "invoice-default",
  name: "Dirección Fiscal",
  type: "invoice",
  city: "Ciudad de México",
  street: "Av. Reforma #456",
  state: [1, "CDMX"],
  country: [52, "México"],
  address: "Av. Reforma #456, Ciudad de México, CDMX"
};

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
      
      // Usar el endpoint correcto
      const url = `/interlocutors?parent_id=${parentId}&type=${type}`;
      
      // Usar axiosInstance en lugar de axios directamente
      const { data } = await axiosInstance.get<Address[]>(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Cache-Control': 'no-cache',
        }
      });
      
      // Si la respuesta está vacía, devolver dirección por defecto para este tipo
      if (!data || data.length === 0) {
        return type === "delivery" ? [defaultDeliveryAddress] : [defaultInvoiceAddress];
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
          address: fullAddress || address.street || "Dirección no especificada"
        };
      });
      
    } catch (error) {
      console.error(`Error fetching ${type} addresses:`, error);
      
      // En caso de error, devolver direcciones por defecto
      return type === "delivery" ? [defaultDeliveryAddress] : [defaultInvoiceAddress];
    }
  }
}