'use server'

import { auth0 } from '@/lib/auth0'

export async function getAccessToken(): Promise<string | null> {
  const session = await auth0.getSession()
  return session?.tokenSet?.accessToken || null
}