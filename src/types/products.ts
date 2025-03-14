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