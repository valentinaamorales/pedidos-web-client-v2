"use client"
 
import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CompanyService } from "@/app/api/companies/company-service"
import { Company } from "@/types/companies"
 
const FormSchema = z.object({
  company: z.string({
    required_error: "Por favor selecciona una empresa.",
  }),
  companyId: z.string().optional(),
})
 
interface SelectCompanyProps {
  formData: Record<string, any>;
  updateFormData: (data: Record<string, any>) => void;
  onComplete: () => void;
  onValidationChange?: (isValid: boolean) => void;
}
 
const SelectCompany = forwardRef(({ formData, updateFormData, onComplete, onValidationChange }: SelectCompanyProps, ref) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentCompany, setCurrentCompany] = useState<Company | null>(
    formData.company && formData.companyId ? 
    { id: formData.companyId, name: formData.company } : null
  )

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      company: formData?.company || "",
      companyId: formData?.companyId?.toString() || ""
    },
  })

  useEffect(() => {
    if (formData?.companyId && formData?.company) {
      // Establecer el estado interno
      setCurrentCompany({
        id: formData.companyId,
        name: formData.company
      });
      
      form.setValue("company", formData.company);
      form.setValue("companyId", formData.companyId.toString());
    }
  }, [formData, form]);

  // Efecto para la validación
  useEffect(() => {
    if (onValidationChange) {
      // Usar el mismo enfoque que SelectCustomer
      onValidationChange(!!currentCompany || !!(formData.company && formData.customerId));
    }
  }, [currentCompany, formData, onValidationChange]);

  // Exponer método saveData mediante ref
  useImperativeHandle(ref, () => ({
    saveData: () => {
      // Si hay un currentCompany establecido, usarlo
      if (currentCompany) {
        updateFormData({
          ...formData,
          company: currentCompany.name,
          companyId: currentCompany.id
        });
        return true;
      } else if (formData.company && formData.companyId) {
        // Si ya hay datos de empresa en formData, permitir continuar
        return true;
      }
      
      toast.error("Por favor selecciona una empresa");
      return false;
    }
  }));

  // Cargar la lista de empresas
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await CompanyService.getCompanies();
        setCompanies(data);
        
        // Si tenemos companyId pero no currentCompany, intentar establecerlo
        if (formData?.companyId && !currentCompany) {
          const matchingCompany = data.find(c => 
            c.id.toString() === formData.companyId.toString()
          );
          
          if (matchingCompany) {
            setCurrentCompany(matchingCompany);
            form.setValue("company", matchingCompany.name);
            form.setValue("companyId", matchingCompany.id.toString());
          }
        }
      } catch (error) {
        toast.error("Error al cargar las empresas");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
 
    fetchCompanies();
  }, []);
 
  // Función para manejar la selección de empresa
  const handleCompanySelect = (companyName: string) => {
    const selectedCompany = companies.find(company => company.name === companyName);
    
    if (selectedCompany) {
      // Actualizar el estado interno
      setCurrentCompany(selectedCompany);
      
      // Actualizar AMBOS campos del formulario
      form.setValue("company", selectedCompany.name);
      form.setValue("companyId", selectedCompany.id.toString());
    }
  };
 
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true)
    try {
      // Si tenemos un currentCompany, usarlo directamente
      if (currentCompany) {
        updateFormData({
          ...formData,
          company: currentCompany.name,
          companyId: currentCompany.id
        });
      } else {
        // Buscar la empresa seleccionada por nombre
        const selectedCompany = companies.find(company => company.name === data.company);
        
        if (!selectedCompany) {
          toast.error("No se encontró la empresa seleccionada");
          return;
        }
        
        updateFormData({
          ...formData,
          company: data.company,
          companyId: selectedCompany.id
        });
      }
      
      toast.success("Empresa seleccionada correctamente");
      onComplete();
    } catch (error) {
      toast.error("Error al seleccionar la empresa");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }
 
  return (
    <Card className="w-full mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Seleccionar Empresa</CardTitle>
        <CardDescription className="text-md text-muted-foreground">
          Selecciona la empresa para la cual deseas crear el pedido.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empresa</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleCompanySelect(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoading ? "Cargando..." : "Seleccionar empresa"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoading ? (
                        <SelectItem value="loading" disabled>Cargando empresas...</SelectItem>
                      ) : (
                        companies.map((company) => (
                          <SelectItem key={company.id} value={company.name}>
                            {company.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
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

SelectCompany.displayName = "SelectCompany";
export default SelectCompany;