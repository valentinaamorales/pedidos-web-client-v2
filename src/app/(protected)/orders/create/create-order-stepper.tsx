"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CircleArrowLeft, CircleArrowRight, CircleCheck, Loader2 } from "lucide-react"
import dynamic from "next/dynamic"
import { toast } from "sonner"
import { Product } from "@/types/products"
import { useRouter, useSearchParams } from "next/navigation"
import { OrderService } from "@/app/api/order/order-service"
import { CompanyService } from "@/app/api/companies/company-service"

// Referencias a los componentes
const SelectCompany = dynamic(() => import("./select-company/SelectCompany"))
const SelectCustomer = dynamic(() => import("./select-customer/SelectCustomer"))
const OrderAddress = dynamic(() => import("./order-address/OrderAddress"))
const SelectProducts = dynamic(() => import("./select-products/SelectProducts"))

// Tipos para las referencias a los componentes
interface ComponentWithSaveMethod {
  saveData?: () => boolean | Record<string, any>;
}

const steps = [
  { id: "company", title: "Seleccionar Empresa", component: SelectCompany },
  { id: "customer", title: "Seleccionar Cliente", component: SelectCustomer },
  { id: "order", title: "Información del Pedido", component: OrderAddress },
  { id: "products", title: "Agregar Productos", component: SelectProducts },
]

interface FormData {
  company?: string;
  companyId?: string | number;
  customer?: string;
  customerId?: string | number;
  orderInfo?: any;
  products: Array<Product & { quantity: number }>;
  observations: string;
  priceListId?: number;
  deliveryAddress?: any;
  invoiceAddress?: any;
}

export function CreateOrderStepper() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const copyFromId  = searchParams.get('copyFromId'); // Obtener el ID del pedido original si existe

  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isStepValid, setIsStepValid] = useState(true) // Por defecto true para permitir avanzar inicialmente
  const [isLoading, setIsLoading] = useState(!!copyFromId);

  // Referencia para acceder a métodos de componentes hijos
  const componentRef = useRef<ComponentWithSaveMethod>(null)
  
  const [formData, setFormData] = useState<FormData>({
    company: undefined,
    customer: undefined,
    orderInfo: undefined,
    products: [],
    observations: "",
  })

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateFormData = (data: any) => {
    setFormData((prev) => {
      const newData = { ...prev, ...data };
      return newData;
    });
  }


  // Función para guardar los datos del paso actual y avanzar
  const handleStepComplete = () => {
    // Si el componente actual expone un método saveData, llamarlo
    let canContinue = true;
    let updatedData = null;
    
    // Intentar guardar datos del componente actual si expone el método
    if (componentRef.current && typeof componentRef.current.saveData === 'function') {
      const result = componentRef.current.saveData();

      if (result === false){
        canContinue = false;
      } else if (typeof result === 'object' && result !== null) {
        updatedData = result;
        canContinue = true;
      } else {
        canContinue = Boolean(result);
      }
    }
    
    // Solo avanzar si se guardaron los datos correctamente o no hay método de guardado
    if (canContinue) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        if (updatedData !== null) {
          const mergedData = {...formData, ...updatedData };
          handleSubmitWithData(mergedData);
        } else {
          handleSubmit();
        }
      }
    }
  }


  const handleValidationChange = (isValid: boolean) => {
    setIsStepValid(isValid);
  }


  const handleSubmitWithData = async (data: FormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (!data.companyId || !data.customerId) {
        throw new Error("Selecciona una empresa y un cliente para continuar");
      }
      if (!data.products || data.products.length === 0) {
        throw new Error("Agrega al menos un producto para continuar");
      }

      // Obtener IDs de direcciones desde los datos proporcionados
      const shippingAddressId = data.deliveryAddress?.id && 
                              data.deliveryAddress.id !== 'delivery-default' && 
                              data.deliveryAddress.id !== 'none' ? 
                              data.deliveryAddress.id : null;
      
      const invoiceAddressId = data.invoiceAddress?.id && 
                              data.invoiceAddress.id !== 'invoice-default' && 
                              data.invoiceAddress.id !== 'none' ? 
                              data.invoiceAddress.id : null;

      const today = new Date();
      const todayCol = new Date(today.getTime() -5 * 60 * 60 * 1000);
      const dateOrder = todayCol.toISOString().replace('T', ' ').split('.')[0];

      const items = data.products.map(product => ({
        productId: Number(product.reference),
        quantity: product.quantity,
        price: product.price,
      }));

      const orderData = {
        companyId: Number(data.companyId),
        customerId: Number(data.customerId),
        dateOrder,
        // Incluir campos opcionales solo si tienen valor
        ...(data.priceListId ? { priceListId: data.priceListId } : {}),
        ...(shippingAddressId ? { customerShippingAdressId: Number(shippingAddressId) } : {}),
        ...(invoiceAddressId ? { customerInvoiceAdressId: Number(invoiceAddressId) } : {}),
        items,
      };

      const response = await OrderService.createOrder(orderData);
      
      toast.success("¡Pedido creado exitosamente!", {
        description: `El pedido #${response.id} ha sido creado correctamente.`,
        duration: 5000
      });
      
      setTimeout(() => {
        router.push('/orders/');
      }, 1500);

    } catch (error: any) {
      console.error("Error creando pedido:", error);
      toast.error("Error al crear el pedido", {
        description: error.message || "Ha ocurrido un error al enviar tu pedido. Por favor intenta nuevamente."
    });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = () => {
    handleSubmitWithData(FormData);
  };

  // Efecto para cargar datos del pedido original si existe copyFromId
  useEffect(() => {
    if (copyFromId) {
      const loadOrderData = async () => {
        try {
          console.log("Cargando datos del pedido:", copyFromId);
          setIsLoading(true);
          const orderData = await OrderService.getOrderById(copyFromId);

          if (!orderData) {
            throw new Error("No se encontró el pedido");
          }
          
          console.log("Datos del pedido:", orderData);

          let companyName = "";
          let companyId = orderData.company;

          try {
            const companyData = await CompanyService.getCompanyById(companyId);
            companyName = companyData.name;
          } catch (err) {
            console.error("Error al obtener datos de la empresa:", err);
          }
          
          const preparedData = {
            company: companyName, // Nombre de la empresa
            companyId: companyId, // ID de la empresa
            customer: orderData.customer[1], // Nombre del cliente
            customerId: orderData.customer[0], // ID del cliente
            deliveryAddress: {
              id: "delivery-default",
              address: orderData.deliveryAddress
            },
            invoiceAddress: {
              id: "invoice-default",
              address: orderData.invoiceAddress
            },
            priceListId: orderData.listPrice ? orderData.listPrice[0] : undefined,
            products: orderData.items.map(item => ({
              id: item.productId,
              name: item.productName,
              quantity: item.quantity,
              reference: item.productId,
              price: item.priceUnit || 0,
              uom_id: ["uom", ""]
            })),
            observations: orderData.referenceCustomer || ""
          };
          
          setFormData(preparedData);

          setTimeout(() => {
            // Ir directamente al último paso para revisar/confirmar
            setCurrentStep(steps.length - 1);
            setIsLoading(false);
            
            toast.success("Datos del pedido cargados correctamente", {
              description: "Revisa los productos y completa el pedido."
            });
          }, 500);

        } catch (error) {
          toast.error("Error al cargar los datos del pedido");
        } finally {
          setIsLoading(false);
        }
      };
      
      loadOrderData();
    }
  }, [copyFromId]);
 
  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="w-full max-w-[900px] mx-auto">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p>Cargando datos del pedido anterior...</p>
        </div>
      ) : (
        <>
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm sm:text-base mb-2
                      ${
                        index < currentStep
                          ? "bg-dark-green text-white"
                          : index === currentStep
                          ? "bg-dark-green text-white border-2 border-dark-green"
                          : "bg-gray-100 text-gray-400"
                      }`}
                  >
                    {index < currentStep ? <CircleCheck className="h-5 w-5" /> : index + 1}
                  </div>
                  <span
                    className={`text-xs sm:text-sm font-medium ${
                      index <= currentStep ? "text-dark-green" : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
  
          {/* Current Step Form */}
          <div className="mb-6">
            <CurrentStepComponent
              ref={componentRef}
              formData={formData}
              updateFormData={updateFormData}
              onComplete={handleStepComplete}
              onValidationChange={handleValidationChange}
            />
          </div>
  
          {/* Navigation - NAVEGACIÓN CENTRALIZADA */}
          <div className="flex justify-between mt-8 pb-8">
            {currentStep > 0 ? (
              <Button
                variant="outline"
                onClick={prevStep}
                className="flex items-center"
                disabled={isSubmitting}
              >
                <CircleArrowLeft className="mr-2 h-4 w-4" />
                Anterior
              </Button>
            ) : (
              <div></div> // Espacio vacío para mantener alineación
            )}
            
            {currentStep < steps.length - 1 ? (
              <Button 
                className="bg-dark-green hover:bg-dark-green/90 text-white"
                onClick={handleStepComplete}
                disabled={!isStepValid || isSubmitting}
              >
                <span>Continuar</span>
                <CircleArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                className="bg-secondary hover:bg-secondary/80 text-black"
                onClick={handleStepComplete}
                disabled={!isStepValid || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Procesando</span>
                  </>
                ) : (
                  <>
                    <span>Finalizar pedido</span>
                    <CircleCheck className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}