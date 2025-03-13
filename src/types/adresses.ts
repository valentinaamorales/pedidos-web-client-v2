export interface Address {
    id: string;
    name?: string;
    active?: boolean;
    type?: string;
    city?: string;
    street?: string;
    street2?: string | null;
    zip?: string | null;
    state?: [number, string] | null;
    country?: [number, string] | null;
    email?: string;
    phone?: string | null;
    mobile?: string | null;
    address?: string; // Campo adicional para mostrar la dirección completa en la UI
  }