// En src/app/actions/getUserEmail.ts
'use server'

import { auth0 } from '@/lib/auth0'
import { jwtDecode } from 'jwt-decode'

type EmailTokenInfo = {
  email?: string;
  sub?: string;
  error?: string;
}

export async function getUserEmailFromIdToken(): Promise<EmailTokenInfo> {
  try {
    const session = await auth0.getSession();
    
    if (!session) {
      return { error: 'No session available' };
    }
    
    if (session.user?.email) {
      return {
        email: session.user.email,
        sub: session.user.sub
      };
    }
    
    return { 
      error: 'No email found in session or tokens',
      sub: session.user?.sub
    };
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}