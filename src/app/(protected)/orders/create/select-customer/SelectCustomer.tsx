"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2, Search, Check, ChevronsUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { CustomerService } from "@/app/api/customers/customer-service"
import { Customer } from "@/types/customers"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandLoading, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const FormSchema = z.object({
  customer: z.string({
    required_error: "Por favor selecciona un cliente.",
  }),
  customerId: z.string().optional(),
})

interface SelectCustomerProps {
  formData: Record<string, any>;
  updateFormData: (data: Record<string, any>) => void;
  onComplete?: () => void;
  onValidationChange?: (isValid: boolean) => void;
}

interface CustomerWithSelection extends Customer {
  selected?: boolean;
}

// Usar forwardRef para exponer métodos al componente padre
const SelectCustomer = forwardRef(({ formData, updateFormData, onComplete, onValidationChange }: SelectCustomerProps, ref) => {
  const [isMounted, setIsMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customers, setCustomers] = useState<CustomerWithSelection[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [hasSearched, setHasSearched] = useState(false)
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(
    formData.customer && formData.customerId ? 
    { id: formData.customerId, name: formData.customer } : null
  )

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      customer: formData?.customer || "",
      customerId: formData?.customerId?.toString() || ""
    },
  })

  // Exponer el método saveData al componente padre a través de ref
  useImperativeHandle(ref, () => ({
    saveData: () => {
      const { customer, customerId } = form.getValues();
      
      // Si hay un cliente seleccionado, guardarlo
      if (customer && customerId && currentCustomer) {
        updateFormData({
          ...formData,
          customer,
          customerId
        });
        return true;
      } else if (currentCustomer) {
        // Usar el cliente actual si está seleccionado
        updateFormData({
          ...formData,
          customer: currentCustomer.name,
          customerId: currentCustomer.id
        });
        return true;
      } else if (formData.customer && formData.customerId) {
        // Si ya hay un cliente en formData, permitir continuar
        return true;
      }
      
      toast.error("Por favor selecciona un cliente");
      return false;
    }
  }));

  // Garantizar que el componente solo se renderice en el cliente
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Notificar al padre si el paso es válido cuando cambia el cliente seleccionado
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(!!currentCustomer || !!(formData.customer && formData.customerId));
    }
  }, [currentCustomer, formData.customer, formData.customerId, onValidationChange]);

  // Función para buscar clientes con paginación
  const searchCustomers = async (term: string, pageNum: number = 1, append: boolean = false) => {
    if (!formData.companyId) {
      toast.error("No se ha seleccionado una empresa");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    
    try {
      // Aquí asumimos que el servicio soporta paginación
      // Si no, necesitarás modificar la API para aceptar parámetros page y limit
      const data = await CustomerService.searchCustomers(
        formData.companyId, 
        term,
        pageNum, 
        10 // tamaño de página
      );
      
      // Detectar si hay más resultados
      setHasMore(data.length === 10);
      
      // Actualizar la lista (append o reemplazar)
      if (append) {
        setCustomers(prev => [...prev, ...data]);
      } else {
        setCustomers(data);
      }
      
    } catch (error) {
      console.error("Error buscando clientes:", error);
      toast.error("Error al cargar los clientes");
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar cambio de término de búsqueda
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1); // Reiniciar página
    
    if (value.length >= 3) {
      searchCustomers(value, 1, false); // Nueva búsqueda, reemplazar resultados
    } else {
      setCustomers([]); // Limpiar resultados si el término es muy corto
    }
  };

  // Cargar más resultados al hacer scroll
  const handleLoadMore = () => {
    if (!isLoading && hasMore && searchTerm.length >= 3) {
      const nextPage = page + 1;
      setPage(nextPage);
      searchCustomers(searchTerm, nextPage, true); // Cargar más y añadir a los existentes
    }
  };

  // Manejar selección de cliente
  const handleSelectCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    form.setValue("customer", customer.name || "");
    form.setValue("customerId", customer.id?.toString() || "");
    setOpen(false); // Cerrar el popover
  };

  if (!isMounted) {
    // Skeleton de carga
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
            <div className="h-10 w-full bg-gray-100 animate-pulse rounded"></div>
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
          <form className="w-full space-y-6">
            <FormField
              control={form.control}
              name="customer"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Cliente</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value || currentCustomer?.name || "Buscar cliente..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command shouldFilter={false}>
                        <CommandInput 
                          placeholder="Buscar cliente..." 
                          value={searchTerm}
                          onValueChange={handleSearchChange}
                          className="h-9"
                        />
                        <CommandList>
                          {searchTerm.length > 0 && searchTerm.length < 3 && (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                              Escribe al menos 3 caracteres para buscar
                            </div>
                          )}

                          {isLoading && customers.length === 0 && (
                            <div className="py-6 text-center text-sm flex items-center justify-center text-muted-foreground">
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Buscando clientes...
                            </div>
                          )}

                          {!isLoading && customers.length === 0 && searchTerm.length >= 3 && (
                            <CommandEmpty>No se encontraron clientes</CommandEmpty>
                          )}
                          
                          {customers.length > 0 && (
                            <CommandGroup className="max-h-[300px] overflow-auto">
                              {customers.map((customer) => (
                                <CommandItem
                                  key={customer.id}
                                  value={customer.name}
                                  onSelect={() => handleSelectCustomer(customer)}
                                >
                                  {customer.name}
                                  <Check
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      (field.value === customer.name || currentCustomer?.id === customer.id)
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )}
                          
                          {hasMore && searchTerm.length >= 3 && !isLoading && (
                            <div className="p-1">
                              <Button
                                variant="ghost"
                                className="w-full py-2 justify-center"
                                onClick={handleLoadMore}
                                disabled={isLoading}
                                type="button"
                              >
                                {isLoading ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Cargando más...
                                  </>
                                ) : (
                                  "Cargar más resultados"
                                )}
                              </Button>
                            </div>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
});

SelectCustomer.displayName = "SelectCustomer";
export default SelectCustomer;