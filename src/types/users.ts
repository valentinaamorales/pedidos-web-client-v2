export interface UserProfile {
    id: string,
    code_erp: string,
    full_name: string,
    email: string,
    user_type: string,
    auth0_id: string,
    is_active: boolean
}

export interface UsersListDto {
    id: string;
    full_name: string,
    user_type: string,
    is_active: boolean
}