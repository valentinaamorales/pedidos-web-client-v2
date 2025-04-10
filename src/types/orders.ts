export interface OrderItem {
    productId: number;
    quantity: number;
    price?: number | null;
}

export interface OrderCreateDTO {
    customerId: number;
    companyId: number;
    dateOrder: string;
    pricelistId?: number | null;
    customerShippingAdressId?: number | null;
    customerInvoiceAdressId?: number | null;
    userId?: number;
    items: OrderItem[];
  }

export interface OrderItemResponse{
    productId: number;
    productName: string;
    quantity: number;
    priceUnit: number;
    priceSubtotal: number;
}

export interface OrderResponseDTO {
    id: number;
    name: string;
    dateOrder: string;
    state: string;
    company: number;
    amounTotal?: number;    //Asi llega del servicio
    currency: [number, string] | [];
    customer: [number, string] | [];
    invoiceAddress?: string;
    deliveryAddress?: string;
    vendor: [number, string] | [];
    listPrice: [number, string] | [];
    paymentTerm: [number, string] | [];
    referenceCustomer?: string;
    observations?: string;
    userCreatedOrder?: [number, string] | [];
    items: OrderItemResponse[];
}

export interface Order {
    id: number | string;
    name: string;
    dateOrder: string;
    state: string;
    customer: [number, string] | []
    amounTotal?: number;
}

export interface OrdersQueryParams {
    limit?: number;
    offset?: number;
}