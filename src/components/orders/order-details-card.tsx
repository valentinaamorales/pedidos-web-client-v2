import { useEffect, useState } from "react";
import { OrderResponseDTO } from "@/types/orders";
import { OrderService } from "@/app/api/order/order-service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Loader2 } from "lucide-react";

interface OrderDetailsCardProps {
  orderId: string | number;
}

export function OrderDetailsCard({ orderId }: OrderDetailsCardProps) {
  const [order, setOrder] = useState<OrderResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const orderData = await OrderService.getOrderById(orderId);
        setOrder(orderData);
      } catch (error: any) {
        setError(error.message || "Error al cargar los detalles del pedido");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  if (!order) {
    return <p>No se encontró información del pedido.</p>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Información General</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Cliente</h3>
            <p className="text-sm">{order.customer[1] || "No disponible"}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Estado</h3>
            <p className="text-sm">{order.state || "No disponible"}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Fecha</h3>
            <p className="text-sm">{order.dateOrder || "No disponible"}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Total</h3>
            <p className="text-sm">
              {order.amounTotal 
                ? `${order.amounTotal.toLocaleString('es-CO')} ${order.currency ? order.currency[1] : ''}` 
                : "No disponible"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Dirección de Entrega</h3>
            <p className="text-sm">{order.deliveryAddress || "No especificada"}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Dirección de Facturación</h3>
            <p className="text-sm">{order.invoiceAddress || "No especificada"}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Vendedor</h3>
            <p className="text-sm">{order.vendor && order.vendor.length > 1 ? order.vendor[1] : "No disponible"}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Términos de Pago</h3>
            <p className="text-sm">{order.paymentTerm && order.paymentTerm.length > 1 ? order.paymentTerm[1] : "No disponible"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}