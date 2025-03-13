export interface Customer {
    id: number;
    name?: string;
    active?: boolean;
    city?: string | null;
    state?: string[] | null;
    country?: string[] | null;
    vat?: string | null;
    email?: string | null;
    isCompnay?: boolean;
    listPrice?: string[] | null;
    company?: number | null;
  }