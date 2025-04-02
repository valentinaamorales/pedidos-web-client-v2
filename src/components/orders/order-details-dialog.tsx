import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Link from "next/link";
import { OrderDetailsCard } from "./order-details-card";
import { OrderProductsCard } from "./order-products-card";

interface OrderDetailsDialogProps {
  orderId: string | number;
}

export function OrderDetailsDialog({ orderId }: OrderDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 rounded-full hover:bg-primary hover:text-secondary"
        >
          <span className="sr-only">Ver detalles del pedido {orderId}</span>
          <MoreHorizontal />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalles del Pedido #{orderId}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="orderDetails" className="w-full mx-auto mt-4">
          <TabsList className="flex flex-col sm:flex-row w-full gap-2 p-2 h-auto bg-white">
            <TabsTrigger
              value="orderDetails"
              className="flex-1 px-4 text-sm sm:text-base w-full bg-dark-green text-white rounded-md data-[state=active]:bg-dark-green/90 data-[state=active]:text-secondary  hover:text-secondary transition-colors"
            >
              Pedido #{orderId}
            </TabsTrigger>
            <TabsTrigger
              value="orderProducts"
              className="flex-1 px-4 text-sm sm:text-base w-full bg-dark-green text-white rounded-md data-[state=active]:bg-dark-green/90 data-[state=active]:text-secondary  hover:text-secondary transition-colors"
            >
              Productos
            </TabsTrigger>
          </TabsList>
          <TabsContent value="orderDetails" className="mt-2">
            <OrderDetailsCard orderId={orderId} />
          </TabsContent>
          <TabsContent value="orderProducts" className="mt-2">
            <OrderProductsCard orderId={orderId} />
          </TabsContent>
        </Tabs>
        <DialogFooter className="sm:justify-end">
          <Link href="/orders/create">
            <Button className="bg-primary hover:bg-primary hover:text-secondary">
              Pedir de nuevo
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}