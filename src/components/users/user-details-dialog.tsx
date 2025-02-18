import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Link from "next/link";
import UserDetailsCard from "@/components/users/user-details-card";
// import OrderProductsCard from "@/components/MyOrders/OrderProductsCard";

interface UserDetailsDialogProps {
  id: string;
}

export function UserDetailsDialog({ id }: UserDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 rounded-full hover:bg-primary hover:text-secondary"
        >
          <span className="sr-only">Ver detalles</span>
          <MoreHorizontal />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Tabs defaultValue="userDetails" className="w-full mx-auto mt-4">
          <TabsContent value="userDetails" className="mt-2">
            <UserDetailsCard id={id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
