import { axiosInstance } from '@/lib/axios';
import { getAccessToken } from '@/app/actions/getAccessToken';
import { OrderItem, OrderCreateDTO, OrderResponseDTO } from "@/types/orders";

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
}