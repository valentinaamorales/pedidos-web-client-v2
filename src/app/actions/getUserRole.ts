"use server"

import { auth0 } from '@/lib/auth0'
import { jwtDecode } from "jwt-decode"

type DecodedToken = {
  permissions: string[]
}

type UserRole = 'admin' | 'employee' | 'customer' | 'unauthorized'

export async function getUserRole(): Promise<UserRole> {
  const session = await auth0.getSession()

  if (!session?.tokenSet?.accessToken) {
    console.log('No access token found')
    return 'unauthorized'
  }

  try {
    const decodedToken = jwtDecode(session.tokenSet.accessToken) as DecodedToken
    const permissions = decodedToken.permissions || []

    if (permissions.some(p => p.startsWith('admin:'))) {
      return "admin"
    } 
    
    if (permissions.some(p => p.startsWith('employee:'))) {
      return "employee"
    } 
    
    if (permissions.some(p => p.startsWith('customer:'))) {
      return "customer"
    }

    return "unauthorized"
  } catch (error) {
    console.error("Error decoding token:", error)
    return "unauthorized"
  }
}