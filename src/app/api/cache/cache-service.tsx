import { OrderResponseDTO } from "@/types/orders";

/**
 * Servicio para almacenar y recuperar pedidos en caché
 */
export class OrderCacheService {
  // Almacenamiento estático para pedidos
  private static ordersCache: Record<string | number, OrderResponseDTO> = {};

  /**
   * Almacena un pedido en la caché
   */
  static cacheOrder(order: OrderResponseDTO): void {
    OrderCacheService.ordersCache[order.id] = order;
  }

  /**
   * Almacena múltiples pedidos en la caché
   */
  static cacheOrders(orders: OrderResponseDTO[]): void {
    orders.forEach(order => {
      OrderCacheService.cacheOrder(order);
    });
  }

  /**
   * Recupera un pedido de la caché por su ID
   * @returns El pedido si existe en caché, undefined si no
   */
  static getOrder(id: string | number): OrderResponseDTO | undefined {
    return OrderCacheService.ordersCache[id];
  }

  /**
   * Verifica si un pedido existe en la caché
   */
  static hasOrder(id: string | number): boolean {
    return !!OrderCacheService.ordersCache[id];
  }

  /**
   * Limpia la caché de pedidos
   */
  static clearCache(): void {
    OrderCacheService.ordersCache = {};
  }
}