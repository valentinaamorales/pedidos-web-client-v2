// src/hooks/use-customer-data.tsx
import { useState, useEffect } from 'react';
import { UserService } from '@/app/api/users/user-service';
import { CustomerProfile } from '@/types/users';

export function useCustomerData() {
  const [customerData, setCustomerData] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCustomerData() {
      try {
        setIsLoading(true);
        const data = await UserService.getCustomerProfile();
        setCustomerData(data);
      } catch (err) {
        setError("Error obteniendo datos del cliente");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCustomerData();
  }, []);

  return { customerData, isLoading, error };
}