"use client"

import { useState, useEffect } from "react"
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
  const [isMounted, setIsMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [hasSearched, setHasSearched] = useState(false)
  const [previouslySelectedCustomer, setPreviouslySelectedCustomer] = useState<Customer | null>(null)

  // Garantizar que el componente solo se renderice en el cliente
  useEffect(() => {
    setIsMounted(true)
    
    // Cargar cliente previamente seleccionado
    if (formData.customer && formData.customerId) {
      setPreviouslySelectedCustomer({
        id: formData.customerId,
        name: formData.customer
      });
      
      // Establecer el cliente como disponible
      setCustomers([{
        id: formData.customerId,
        name: formData.customer
      }]);
    }
  }, [])

  // Reiniciar isSubmitting cuando cambia formData
  useEffect(() => {
    setIsSubmitting(false);
  }, [formData])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      customer: formData?.customer || "",
      customerId: formData?.customerId?.toString() || ""
    },
  })

  useEffect(() => {
    if (!isMounted) return;

    if (searchTerm.length < 3) {
      if (searchTerm.length > 0) {
        // No vaciar clientes si hay uno seleccionado previamente
        if (previouslySelectedCustomer && customers.length === 1) {
          return;
        }
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
        
        // Si hay un cliente previo y no está en resultados, incluirlo
        if (previouslySelectedCustomer && !data.some(c => c.id === previouslySelectedCustomer.id)) {
          setCustomers([previouslySelectedCustomer, ...data]);
        } else {
          setCustomers(data);
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast.error("Error al cargar los clientes");
        
        // Mantener cliente previo en caso de error
        if (previouslySelectedCustomer) {
          setCustomers([previouslySelectedCustomer]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchCustomers();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, formData.companyId, isMounted, previouslySelectedCustomer]);

  // Esta función se ejecutará cuando hagas clic en "Continuar" sin usar form.handleSubmit
  const handleContinue = () => {
    // Si ya hay un cliente seleccionado en el form
    const customerValue = form.getValues("customer");
    
    // Si no hay cliente seleccionado
    if (!customerValue) {
      // Si hay cliente previo en el formData, usarlo
      if (formData.customer && formData.customerId) {
        onComplete();
        return;
      }
      
      toast.error("Por favor selecciona un cliente");
      return;
    }
    
    // Buscar cliente seleccionado
    const selectedCustomer = customers.find(c => c.name === customerValue);
    
    if (!selectedCustomer) {
      toast.error("No se encontró el cliente seleccionado");
      return;
    }
    
    updateFormData({
      ...formData,
      customer: customerValue,
      customerId: selectedCustomer.id
    });
    
    toast("Cliente seleccionado", {
      description: `Has seleccionado a ${customerValue}`
    });
    
    onComplete();
  }
  
  const hasSelectedCustomer = previouslySelectedCustomer !== null;
  
  if (!isMounted) {
    // Código de loading...
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
          <div className="w-full space-y-6">
            {/* Siempre mostrar el campo de búsqueda */}
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
            
            {/* Mostrar resultados de búsqueda cuando sea apropiado */}
            {(hasSearched && searchTerm.length >= 3) || hasSelectedCustomer ? (
              <FormField
                control={form.control}
                name="customer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Actualizar el cliente seleccionado cuando cambie el valor
                        const newSelectedCustomer = customers.find(c => c.name === value);
                        if (newSelectedCustomer) {
                          setPreviouslySelectedCustomer(newSelectedCustomer);
                        }
                      }} 
                      defaultValue={field.value || previouslySelectedCustomer?.name}
                    >
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
            ) : null}
            
            <div className="flex justify-end">
              <Button 
                type="button"
                className="bg-dark-green hover:bg-dark-green/90 text-white" 
                disabled={isSubmitting || isLoading || (customers.length === 0 && !previouslySelectedCustomer)}
                onClick={handleContinue}
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
          </div>
        </Form>
      </CardContent>
    </Card>
  )
}

