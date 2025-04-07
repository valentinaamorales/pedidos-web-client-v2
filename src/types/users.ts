export interface UserProfile {
    id: string,
    code_erp: string,
    full_name: string,
    email: string,
    user_type: string,
    auth0_id: string,
    is_active: boolean
}

export interface CustomerProfile {
    id: number;
    name: string;
    active: boolean;
    city?: [number, string];
    state?: [number, string];
    country?: [number, string];
    vat?: string;
    email?: string;
    isCompany: boolean;
    listPrice?: [number, string];
    company: number;
}

export interface UsersListDto {
    id: string;
    full_name: string,
    user_type: string,
    is_active: boolean
}

interface UserQueryParams {
    limit?: number;
    offset?: number;
  }

export type UserRole = 'admin' | 'employee' | 'customer' | 'unauthorized';