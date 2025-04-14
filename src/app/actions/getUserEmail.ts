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
    
    // CAMBIO CLAVE: Intentar obtener email de session.user primero
    if (session.user?.email) {
      console.log('Email encontrado en session.user:', session.user.email);
      return {
        email: session.user.email,
        sub: session.user.sub
      };
    }
    
    // Fallback: Intentar obtener desde ID token si existe (aunque sabemos que no está disponible)
    if (session.tokenSet?.id_token) {
      try {
        const decoded = jwtDecode<{ email?: string; sub?: string }>(session.tokenSet.id_token);
        return {
          email: decoded.email,
          sub: decoded.sub
        };
      } catch (decodeError) {
        console.error('Error decoding ID token:', decodeError);
      }
    }
    
    return { 
      error: 'No email found in session or tokens',
      sub: session.user?.sub
    };
  } catch (error) {
    console.error('Error extracting email from session:', error);
    return { 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}