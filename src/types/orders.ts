export interface OrderItem {
    productId: number;
    quantity: number;
    price?: number | null;
}

export interface OrderCreateDTO {
    customerId: number;
    companyId: number;
    dateOrder: string;
    priceListId?: number | null;
    customerShippingAdressId?: number | null;
    customerInvoiceAdressId?: number | null;
    items: OrderItem[];
  }

export interface OrderResponseDTO {
    id: number
}