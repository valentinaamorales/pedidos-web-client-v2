'use client';

import { useProfile } from "@/hooks/use-profile";
import { OrdersTable } from "@/components/orders/orders-table";
import { useRole } from "@/hooks/use-role";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";

export default function Orders() {
  const { profile, loading: profileLoading } = useProfile();
  const { role } = useRole();
  
  // Convertir el code_erp (que es un string) a número
  const userCreateOrderId = profile?.code_erp ? parseInt(profile.code_erp) : undefined;
  const isCustomer = role === 'customer';
  
  return (
    <main>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            {isCustomer ? "Mis Pedidos" : "Mis Pedidos Creados"}
          </h1>
          <Link href="/orders/create">
            <Button className="bg-dark-green hover:bg-dark-green/90">
              <Plus className="mr-2 h-4 w-4" />
              Crear Pedido
            </Button>
          </Link>
        </div>
        
        {profileLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <span>Cargando información del usuario...</span>
          </div>
        ) : (
          <OrdersTable 
            userCreateOrderId={userCreateOrderId}
            isCustomerView={isCustomer}
          />
        )}
      </div>
    </main>
  );
}