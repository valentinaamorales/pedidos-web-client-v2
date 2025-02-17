import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
  } from "@/components/ui/card";
import { OrdersTable } from "@/components/orders/orders-table";
  
  const OrdersCard = () => {
    return (
      <Card className="w-full max-w-[900px] mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Pedidos recientes</CardTitle>
          <CardDescription className="text-md text-muted-foreground">
            Estos son tus pedidos realizados en los últimos días.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-4">
          <OrdersTable />
        </CardContent>
      </Card>
    );
  };
  
  export default OrdersCard;
  