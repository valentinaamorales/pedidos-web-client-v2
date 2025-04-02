import { axiosInstance } from '@/lib/axios';
import { getAccessToken } from '@/app/actions/getAccessToken';
import { OrderItem, OrderCreateDTO, OrderResponseDTO, OrdersQueryParams } from "@/types/orders";

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

            const queryString = queryParams.toString();
            const url = `/orders${queryString ? `?${queryString}` : ""}`;

            const { data } = await axiosInstance.get<OrderResponseDTO[]>(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Cache-Control": "no-cache",
                },
            });

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
}