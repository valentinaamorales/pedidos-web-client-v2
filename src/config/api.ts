export const API_URL = process.env.NEXT_PUBLIC_API_URL
export const ENDPOINTS = {
  userProfile: `${API_URL}/users/me`,
  users: `${API_URL}/users/`,
};