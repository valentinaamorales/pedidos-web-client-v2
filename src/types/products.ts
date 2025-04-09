export interface ProductPackage {
  id: number;
  name: string;
  quantity: number;
  uom_id: [number, string];
}

export interface PriceListItem {
  id: number;
  name: string;
  product: [number, string];
  productReference: string;
  price: string;
  packagesItems: ProductPackage[];
  min_quantity: number;
  date_start?: string | null;
  date_end?: string | null;
}

export interface PriceList {
  id: number;
  name: string;
  company?: number;
  items: PriceListItem[];
}

export interface Product {
  id: number;
  name: string;
  reference?: string;
  type?: string;
  active?: boolean;
  price?: number;
  uom_id?: [number, string]; // Formato [id, unidad] como [12, "kg"]
  currency?: [number, string]; // Formato [id, moneda] como [2, "USD"]
  company?: number;
}