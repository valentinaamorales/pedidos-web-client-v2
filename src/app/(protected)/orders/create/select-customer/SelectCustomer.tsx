"use client"

import { useState, useEffect} from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { CustomerService } from "@/app/api/customers/customer-service"
import { Customer } from "@/types/customers"

const FormSchema = z.object({
  customer: z.string({
    required_error: "Por favor selecciona un cliente.",
  }),
  customerId: z.string().optional(),
})

interface SelectCustomerProps {
  formData: Record<string, any>;
  updateFormData: (data: Record<string, any>) => void;
  onComplete: () => void;
}

export default function SelectCustomer({ formData, updateFormData, onComplete }: SelectCustomerProps) {
  // Añadir estado para controlar el montaje en cliente
  const [isMounted, setIsMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [hasSearched, setHasSearched] = useState(false)

  // Garantizar que el componente solo se renderice completamente en el cliente
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Añadir un efecto que reinicie el estado isSubmitting cuando el componente se monte o actualice
  useEffect(() => {
    setIsSubmitting(false);
  }, [formData])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: formData || {},
  })

  useEffect(() => {
    if (!isMounted) return; // No ejecutar efectos hasta que estemos en el cliente

    // No hacer nada con el efecto inicial o cuando searchTerm cambia a menos de 3 caracteres
    if (searchTerm.length < 3) {
      if (searchTerm.length > 0) {
        setCustomers([]);
      }
      return;
    }
    
    const fetchCustomers = async () => {
      if (!formData.companyId) {
        toast.error("No se ha seleccionado una empresa");
        return;
      }

      setIsLoading(true);
      setHasSearched(true);
      
      try {
        const data = await CustomerService.searchCustomers(formData.companyId, searchTerm);
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast.error("Error al cargar los clientes");
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchCustomers();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, formData.companyId, isMounted]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (isSubmitting) return;
    setIsSubmitting(true)
    try {
      const selectedCustomer = customers.find(customer => customer.name === data.customer);
      
      if (!selectedCustomer) {
        toast.error("No se encontró el cliente seleccionado");
        setIsSubmitting(false);
        return;
      }
      
      const updatedFormData = {
        ...formData,
        customer: data.customer,
        customerId: selectedCustomer.id
      };
      
      updateFormData(updatedFormData);
      toast("Cliente seleccionado", {
        description: `Has seleccionado a ${data.customer}`
      });

      onComplete();
    } catch (error) {
      toast("Error", {
        description: "Hubo un problema al seleccionar el cliente."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Si no está montado en el cliente, muestra un esqueleto o versión simplificada
  if (!isMounted) {
    return (
      <Card className="w-full mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Seleccionar Cliente</CardTitle>
          <CardDescription className="text-md text-muted-foreground">
            Selecciona el cliente para este pedido.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="w-full space-y-6">
            <div className="mb-4">
              <div className="h-10 w-full bg-gray-100 animate-pulse rounded"></div>
            </div>
            <div className="mb-4">
              <div className="h-10 w-full bg-gray-100 animate-pulse rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Renderizado normal una vez que estemos en el cliente
  return (
    <Card className="w-full mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Seleccionar Cliente</CardTitle>
        <CardDescription className="text-md text-muted-foreground">
          Selecciona el cliente para este pedido.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
            <div className="mb-4">
              <FormLabel>Buscar Cliente</FormLabel>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Escribe al menos 3 caracteres para buscar"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full"
                />
              </div>
              {searchTerm.length > 0 && searchTerm.length < 3 && (
                <p className="text-sm text-muted-foreground mt-1">
                  Escribe al menos 3 caracteres para iniciar la búsqueda
                </p>
              )}
            </div>
            
            <FormField
              control={form.control}
              name="customer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoading ? "Cargando..." : "Seleccionar cliente"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoading ? (
                        <SelectItem value="loading" disabled>Cargando clientes...</SelectItem>
                      ) : customers.length === 0 ? (
                        <SelectItem value="empty" disabled>
                          {hasSearched && searchTerm.length >= 3 
                            ? "No se encontraron clientes" 
                            : "Escribe para buscar clientes"}
                        </SelectItem>
                      ) : (
                        customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.name || `Cliente ${customer.id}`}>
                            {customer.name || `Cliente ${customer.id}`}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="bg-dark-green hover:bg-dark-green/90 text-white" 
                disabled={isSubmitting || isLoading || customers.length === 0}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando
                  </>
                ) : (
                  "Continuar"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

