'use client';

import { useParams } from "next/navigation";

export default function OrderPopupPage() {
  const params = useParams();
  const { orderId } = params;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Detalles del Pedido #{orderId}</h1>
      
      <div className="bg-gray-100 p-8 rounded-md text-center">
        <p className="text-muted-foreground mb-4">
          Esta funcionalidad está en desarrollo.
        </p>
        <p className="text-muted-foreground">
          Aquí se mostrarán futuros detalles para el pedido #{orderId}.
        </p>
      </div>
    </div>
  );
}