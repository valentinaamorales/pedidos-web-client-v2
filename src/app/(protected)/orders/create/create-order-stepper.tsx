"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CircleArrowLeft, CircleArrowRight, CircleCheck } from "lucide-react"
import dynamic from "next/dynamic"
import { toast } from "sonner"

const SelectCompany = dynamic(() => import("./select-company/SelectCompany"))
const SelectCustomer = dynamic(() => import("./select-customer/SelectCustomer"))
const OrderAddress = dynamic(() => import("./order-address/OrderAddress"))
const SelectProducts = dynamic(() => import("./select-products/SelectProducts"))

const steps = [
  { id: "company", title: "Seleccionar Empresa", component: SelectCompany },
  { id: "customer", title: "Seleccionar Cliente", component: SelectCustomer },
  { id: "order", title: "Información del Pedido", component: OrderAddress },
  { id: "products", title: "Agregar Productos", component: SelectProducts },
]

interface FormData {
  company: any;
  customer: any;
  orderInfo: any;
  products: never[];
  observations: string;
  [key: string]: any;
}

export function CreateOrderStepper() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    company: null,
    customer: null,
    orderInfo: null,
    products: [],
    observations: "",
  })

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateFormData = (stepId: string, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [stepId]: data,
    }))
  }

  const handleSubmit = async () => {
    try {
      // Here you would submit the complete form data to your API
      console.log("Submitting order:", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast("Pedido creado con éxito",
        {description: "Tu pedido ha sido enviado correctamente.",
      })

      // Reset form or redirect
    } catch (error) {
      toast("Error al crear el pedido",
        {description: "Ha ocurrido un error al enviar tu pedido. Por favor intenta nuevamente."
      })
    }
  }

  const CurrentStepComponent = steps[currentStep].component

  return (
    <div className="w-full max-w-[900px] mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm sm:text-base mb-2
                  ${index <= currentStep ? "bg-dark-green text-white" : "bg-secondary text-primary"}
                  font-semibold transition-colors duration-300`}
              >
                {index + 1}
              </div>
              <span
                className={`text-xs sm:text-sm text-center ${index <= currentStep ? "text-dark-green font-medium" : "text-muted-foreground"}`}
              >
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className="absolute left-0 right-0 h-1 top-5 -z-10">
                  <div
                    className={`h-1 ${index < currentStep ? "bg-dark-green" : "bg-secondary"} transition-all duration-300`}
                    style={{ width: index < currentStep ? "100%" : "0%" }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="mt-4 w-full">
        <CurrentStepComponent
          formData={formData[steps[currentStep].id]}
          updateFormData={(data: Record<string, any>) => updateFormData(steps[currentStep].id, data)}
          onComplete={nextStep}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between w-full">
        <Button onClick={prevStep} disabled={currentStep === 0} variant="outline" className="flex items-center gap-2">
          <CircleArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Anterior</span>
        </Button>

        {currentStep === steps.length - 1 ? (
          <Button
            onClick={handleSubmit}
            className="bg-dark-green text-white hover:bg-dark-green/90 flex items-center gap-2"
          >
            <CircleCheck className="h-4 w-4" />
            <span>Finalizar Pedido</span>
          </Button>
        ) : (
          <Button
            onClick={nextStep}
            className="bg-dark-green text-white hover:bg-dark-green/90 flex items-center gap-2"
          >
            <span className="hidden sm:inline">Siguiente</span>
            <CircleArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

