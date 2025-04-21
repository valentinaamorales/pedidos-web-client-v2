import { axiosInstance } from '@/lib/axios';
import { getAccessToken } from '@/app/actions/getAccessToken';
import { OrderItem, OrderCreateDTO, OrderResponseDTO, OrdersQueryParams } from "@/types/orders";
import { OrderCacheService } from "@/app/api/cache/cache-service";

export class OrderService {
    static async createOrder(orderData: OrderCreateDTO): Promise<OrderResponseDTO> {
        try {
            const accessToken = await getAccessToken();
            if (!accessToken) {
                throw new Error("No access token available");
            }

            const { data } = await axiosInstance.post<OrderResponseDTO>("/orders", orderData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Cache-Control": "no-cache",
                },
            });

            return data;
        } catch (error) {
            console.error("Error creating order:", error);
            throw new Error("Failed to create order");
        }
    }

    static async getOrders(params: OrdersQueryParams = {}): Promise<OrderResponseDTO[]> {
        try {
            const accessToken = await getAccessToken();
            if (!accessToken) {
                throw new Error("No access token available");
            }

            const queryParams = new URLSearchParams();
            if (params.limit) queryParams.append("limit", params.limit.toString());
            if (params.offset) queryParams.append("offset", params.offset.toString());
            if (params.userCreateOrderId) queryParams.append("user_create_order_id", params.userCreateOrderId.toString());

            const queryString = queryParams.toString();
            const url = `/orders?${queryString}`;
            
            const { data } = await axiosInstance.get<OrderResponseDTO[]>(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Cache-Control": "no-cache",
                },
            });

            OrderCacheService.cacheOrders(data);

            return data;
        } catch (error: any) {
            console.error("Error fetching orders:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });

            throw new Error(error?.response?.data?.message || "No se pudieron cargar los pedidos.");
        }
    }

    static async getOrderById(id: string | number): Promise<OrderResponseDTO> {
        // Primero verificamos si el pedido está en caché
        if (OrderCacheService.hasOrder(id)) {
          const cachedOrder = OrderCacheService.getOrder(id);
          if (cachedOrder) {
            return cachedOrder;
          }
        }
        
        // Si no está en caché, intentamos obtener todos los pedidos
        // Esta es una solución temporal hasta que el backend tenga un endpoint getById
        try {
          // Intentamos obtener una lista de pedidos y buscar el nuestro
          const orders = await this.getOrders();
          
          // Buscamos el pedido por ID
          const order = orders.find(o => String(o.id) === String(id));
          
          if (!order) {
            throw new Error(`No se encontró el pedido con ID ${id}`);
          }
          
          // Guardarlo en caché para uso futuro
          OrderCacheService.cacheOrder(order);
          
          return order;
        } catch (error) {
          console.error(`Error obteniendo detalles del pedido ${id}:`, error);
          throw new Error("No se pudo obtener el detalle del pedido. Intente nuevamente más tarde.");
        }
      }
}