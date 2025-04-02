import { useEffect, useState } from "react";
import { OrderResponseDTO, OrderItemResponse } from "@/types/orders";
import { OrderService } from "@/app/api/order/order-service";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Loader2 } from "lucide-react";

interface OrderProductsCardProps {
  orderId: string | number;
}

export function OrderProductsCard({ orderId }: OrderProductsCardProps) {
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

  if (!order || !order.items || order.items.length === 0) {
    return <p>No se encontraron productos en este pedido.</p>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Productos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead className="text-right">Cantidad</TableHead>
              <TableHead className="text-right">Precio Unit.</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.items.map((item) => (
              <TableRow key={`${item.productId}-${item.productName}`}>
                <TableCell className="font-medium">{item.productName}</TableCell>
                <TableCell className="text-right">{item.quantity.toLocaleString('es-CO')}</TableCell>
                <TableCell className="text-right">
                  {item.priceUnit.toLocaleString('es-CO')}
                </TableCell>
                <TableCell className="text-right">
                  {item.priceSubtotal.toLocaleString('es-CO')}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} className="text-right font-bold">
                TOTAL ({order.currency ? order.currency[1] : ''})
              </TableCell>
              <TableCell className="text-right font-bold">
                {order.amounTotal?.toLocaleString('es-CO')}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}