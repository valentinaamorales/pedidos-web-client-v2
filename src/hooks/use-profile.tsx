'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { UserProfile } from '@/types/users';
import { UserService } from '@/app/api/users/user-service'

export function useProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await UserService.getProfile();

        if (!data.code_erp || !data.full_name || !data.user_type) {
          router.push('/incomplete-profile');
          return;
        }

        setProfile(data);
        setError(null);
      } catch (err) {
        console.error("Profile error:", err);
        
        if (axios.isAxiosError(err)) {
          // Si es un error 404 o contiene el mensaje sobre perfil incompleto
          if (err.response?.status === 404 || 
              (err.response?.data?.detail && 
               err.response.data.detail.includes("perfil de usuario está incompleto"))) {
            console.log("Redirecting to unauthorized due to 404 or incomplete profile message");
            router.push('/incomplete-profile');
            return;
          }
        }
        
        setError(err instanceof Error ? err : new Error('Su perfil no pudo ser cargado, por favor contacte al administrador para que llene sus datos'));
      } finally {
        setLoading(false);
      }
    }
  
    fetchProfile();
  }, [router]);

  return { profile, loading, error };
}