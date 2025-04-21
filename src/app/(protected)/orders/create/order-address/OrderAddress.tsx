"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Address } from "@/types/addresses"
import { AddressService } from "@/app/api/interlocutors/address-service"

const FormSchema = z.object({
  merchandiseRecipient: z.string().optional(),
  billingRecipient: z.string().optional(),
  observations: z.string().optional(),
  file: z.any().optional(),
});

interface OrderAddressProps {
  formData: Record<string, any>;
  updateFormData: (data: Record<string, any>) => void;
  onComplete?: () => void;
  onValidationChange?: (isValid: boolean) => void;
  isCustomerView?: boolean;
}

const OrderAddress = forwardRef(({ formData, updateFormData, onComplete, onValidationChange, isCustomerView = false }: OrderAddressProps, ref) => {
  const [deliveryAddresses, setDeliveryAddresses] = useState<Address[]>([]);
  const [invoiceAddresses, setInvoiceAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: formData || {},
  });

  // Exponer método para guardar datos
  useImperativeHandle(ref, () => ({
    saveData: () => {
      const data = form.getValues();
      
      // Buscar direcciones completas por su ID
      const selectedDeliveryAddress = data.merchandiseRecipient ? 
        deliveryAddresses.find(address => String(address.id) === String(data.merchandiseRecipient)) : null;
        
      const selectedInvoiceAddress = data.billingRecipient ?
        invoiceAddresses.find(address => String(address.id) === String(data.billingRecipient)) : null;
      
      // Actualizar formData
      updateFormData({
        ...formData,
        ...data,
        deliveryAddress: selectedDeliveryAddress,
        invoiceAddress: selectedInvoiceAddress
      });
      
      return true; // Siempre permitir continuar ya que las direcciones son opcionales
    }
  }));

  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(true);
    }
  }, [onValidationChange]);

  useEffect(() => {
    if (!formData.customerId) {
      if (!isCustomerView && !formData.autoLoading) {
        toast.error("No se ha seleccionado un cliente");
      }
      return;
    }

    const fetchAddresses = async () => {
      setIsLoading(true);
      
      try {
        try {
          const deliveryData = await AddressService.getAddresses(formData.customerId, "delivery");
          setDeliveryAddresses(deliveryData);
          
          if (formData.deliveryAddress?.id) {
            if (formData.deliveryAddress.id !== 'delivery-default' && formData.deliveryAddress.id !== 'none') {
              // Si ya tiene un ID válido
              form.setValue("merchandiseRecipient", formData.deliveryAddress.id);
            } else if (formData.deliveryAddress.address && deliveryData.length === 1) {
              // Si tiene dirección por defecto y solo hay una opción, seleccionar automáticamente
              form.setValue("merchandiseRecipient", String(deliveryData[0].id));
            } else if (deliveryData.length === 1) {
              // Si solo hay una dirección disponible, seleccionarla
              form.setValue("merchandiseRecipient", String(deliveryData[0].id));
            }
          } else if (deliveryData.length === 1) {
            // Si solo hay una dirección disponible y no hay selección previa
            form.setValue("merchandiseRecipient", String(deliveryData[0].id));
          }
        } catch (deliveryError) {
          setDeliveryAddresses([]);
        }
        
        try {
          const invoiceData = await AddressService.getAddresses(formData.customerId, "invoice");
          setInvoiceAddresses(invoiceData);
          
          if (formData.invoiceAddress?.id) {
            if (formData.invoiceAddress.id !== 'invoice-default' && formData.invoiceAddress.id !== 'none') {
              form.setValue("billingRecipient", formData.invoiceAddress.id);
            } else if (formData.invoiceAddress.address && invoiceData.length === 1) {
              form.setValue("billingRecipient", String(invoiceData[0].id));
            } else if (invoiceData.length === 1) {
              form.setValue("billingRecipient", String(invoiceData[0].id));
            }
          } else if (invoiceData.length === 1) {
            form.setValue("billingRecipient", String(invoiceData[0].id));
          }
        } catch (invoiceError) {
          setInvoiceAddresses([]);
        }
        
      } catch (error) {
        console.error("Error general cargando direcciones:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, [formData.customerId, form]);

  return (
    <Card className="mx-auto w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          Información del Pedido
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <Form {...form}>
          <div className="w-full space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="merchandiseRecipient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección de Entrega</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={isLoading ? "Cargando direcciones..." : "Seleccionar dirección"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoading ? (
                          <SelectItem value="loading" disabled>Cargando direcciones...</SelectItem>
                        ) : deliveryAddresses.length === 0 ? (
                          <SelectItem value="empty" disabled>No hay direcciones disponibles</SelectItem>
                        ) : (
                          <>
                            {/* Opción para no seleccionar dirección */}
                            <SelectItem value="none">
                              -- Sin dirección de entrega --
                            </SelectItem>
                            {deliveryAddresses.map((address) => (
                              <SelectItem key={address.id} value={String(address.id)}>
                                {address.name || "Dirección"} - {address.address}
                              </SelectItem>
                            ))}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="billingRecipient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección de Facturación</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={isLoading ? "Cargando direcciones..." : "Seleccionar dirección"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoading ? (
                          <SelectItem value="loading" disabled>Cargando direcciones...</SelectItem>
                        ) : invoiceAddresses.length === 0 ? (
                          <SelectItem value="empty" disabled>No hay direcciones disponibles</SelectItem>
                        ) : (
                          <>
                            <SelectItem value="none">
                              -- Sin dirección de facturación --
                            </SelectItem>
                            {invoiceAddresses.map((address) => (
                              <SelectItem key={address.id} value={String(address.id)}>
                                {address.name || "Dirección"} - {address.address}
                              </SelectItem>
                            ))}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Añade observaciones para tu pedido aquí"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
      </CardContent>
    </Card>
  );
});

OrderAddress.displayName = "OrderAddress";
export default OrderAddress;