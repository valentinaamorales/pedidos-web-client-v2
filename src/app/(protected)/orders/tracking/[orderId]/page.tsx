'use client';

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TrackingPage() {
  const { orderId } = useParams();

  return (
    <div className="container py-8">
      <div className="flex items-center mb-6">
        <Link href="/orders">
          <Button variant="ghost" className="flex gap-2 items-center">
            <ArrowLeft className="h-4 w-4" />
            Volver a pedidos
          </Button>
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Seguimiento del Pedido #{orderId}</h1>
      
      <div className="bg-muted p-8 rounded-md text-center">
        <h2 className="text-xl font-medium mb-4">Funcionalidad en desarrollo</h2>
        <p className="text-muted-foreground">
          El sistema de seguimiento de pedidos estará disponible próximamente.
        </p>
      </div>
    </div>
  );
}