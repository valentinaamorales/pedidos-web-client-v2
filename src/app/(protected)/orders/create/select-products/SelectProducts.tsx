"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Plus, Trash2, Minus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { PriceListService } from "@/app/api/pricelists/pricelist-service"
import { PriceList, PriceListItem, ProductPackage } from '@/types/pricelists';

// Extendemos el tipo para nuestro uso interno
interface ProductWithSelection extends PriceListItem {
  selectedPackage: ProductPackage | null;
  packageQuantity: number;
}

interface SelectProductsProps {
  formData?: {
    products?: any[];
    observations?: string;
    companyId?: string | number; 
    customerId?: string | number;
  }
  updateFormData: (data: Record<string, any>) => void;
  onComplete?: () => void; 
  onValidationChange?: (isValid: boolean) => void;
  isCustomerView?: boolean;
}

const SelectProducts = forwardRef(({ formData, updateFormData, onComplete, onValidationChange }: SelectProductsProps, ref) => {
  const [pricelist, setPriceList] = useState<PriceList | null>(null);
  const [products, setProducts] = useState<ProductWithSelection[]>([]);
  const [observations, setObservations] = useState(formData?.observations || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<PriceListItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [editingQuantities, setEditingQuantities] = useState<Record<number, string>>({});

  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(products.length > 0);
    }
  }, [products, onValidationChange]);

  // Efecto para cargar la lista de precios al iniciar
  useEffect(() => {
    if (!formData?.companyId || !formData?.customerId) {
      return;
    }

    const fetchPriceList = async () => {
      setIsLoading(true);
      try {
        const data = await PriceListService.getPriceList(
          formData.customerId,
          formData.companyId
        );

        // Insertar aquí el código para añadir la opción por kg
        if (data && data.items) {
          // Modificar los packagesItems para añadir opción por kg
          const enhancedItems = data.items.map(item => {
            // Tomar la unidad de medida del primer packagesItem si existe
            const baseUom = item.packagesItems.length > 0 ? item.packagesItems[0].uom_id : [1, "und"];
            
            // Añadir opción "Por kilogramo" si la unidad es kg
            let packages = [...item.packagesItems];
            if (baseUom[1].toLowerCase() === "kg" && !packages.some(p => p.quantity === 1)) {
              packages.push({
                id: -1, // ID especial para la opción por kg
                name: "Por kilogramo",
                quantity: 1, // 1 kg
                uom_id: baseUom
              });
            }
            
            return {
              ...item,
              packagesItems: packages
            };
          });
          
          // Actualizar data con los items mejorados
          data.items = enhancedItems;
        }

        setPriceList(data);
        
        // Inicializar productos anteriores si existen
        if (formData?.products && formData.products.length > 0) {
          // Buscar los productos en la lista de precios para restaurar correctamente
          const restoredProducts = formData.products.map(p => {
            // Buscar el producto en la lista de precios
            const priceListItem = data?.items?.find(item => 
              item.productReference === p.reference || 
              (item.product && item.product[0] === p.id)
            );
            
            if (priceListItem) {
              // Encontrar el package correspondiente
              const packageItem = priceListItem.packagesItems.find(pkg => 
                pkg.uom_id[0] === p.uom_id[0]
              ) || priceListItem.packagesItems[0];
              
              return {
                ...priceListItem,
                selectedPackage: packageItem || null,
                packageQuantity: p.quantity / (packageItem?.quantity || 1)
              };
            }
            
            // Si no se encuentra en la lista de precios, usar los datos que tenemos
            return {
              id: p.id,
              name: p.name,
              product: [p.id, p.name],
              productReference: p.reference,
              price: p.price.toString(),
              packagesItems: p.uom_id ? [{
                id: 1,
                name: p.packageInfo || "Unidad",
                quantity: 1,
                uom_id: p.uom_id
              }] : [],
              min_quantity: 0,
              selectedPackage: {
                id: 1,
                name: p.packageInfo || "Unidad",
                quantity: 1,
                uom_id: p.uom_id || [1, "unid"]
              },
              packageQuantity: p.quantity
            };
          });
          
          setProducts(restoredProducts);
        }
      } catch (error) {
        console.error("Error al cargar la lista de precios:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPriceList();
  }, [formData?.customerId, formData?.companyId]);

  // Filtrar productos según el término de búsqueda
  useEffect(() => {
    if (!searchTerm || searchTerm.length < 3 || !pricelist || !pricelist.items) {
      setFilteredProducts([]);
      return;
    }

    setHasSearched(true);
    
    const searchLower = searchTerm.toLowerCase();
    const filtered = pricelist.items.filter(item => 
      item.name.toLowerCase().includes(searchLower) || 
      item.productReference.toLowerCase().includes(searchLower) ||
      item.product[1].toLowerCase().includes(searchLower)
    );
    
    setFilteredProducts(filtered);
  }, [searchTerm, pricelist]);

  // Añadir un producto a la selección
  const addProduct = (product: PriceListItem) => {
    if (products.some(p => p.id === product.id)) {
      toast.warning("Este producto ya está en tu lista");
      return;
    }
    
    // Seleccionar el primer empaque por defecto
    const selectedPackage = product.packagesItems[0] || null;
    
    const newProduct: ProductWithSelection = {
      ...product,
      selectedPackage,
      packageQuantity: 1
    };

    setProducts([...products, newProduct]);
    setIsDialogOpen(false);
    toast.success("Producto agregado");
  };

  // Actualizar la cantidad de un producto
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) quantity = 1;
    
    // Encontrar el producto que se está modificando
    const product = products.find(p => p.id === productId);
    
    // Si es opción "Por kilogramo" (ID -1) y hay otros packagesItems
    if (product && product.selectedPackage?.id === -1 && product.packagesItems.length > 1) {
      // Encontrar el tamaño del bulto estándar (el primer packagesItem que no sea "Por kilogramo")
      const standardPackage = product.packagesItems.find(p => p.id !== -1);
      
      if (standardPackage) {
        const packageSize = standardPackage.quantity;
        
        // Asegurarse de que la cantidad sea múltiplo del tamaño del paquete
        if (quantity % packageSize !== 0) {
          // Redondear al múltiplo más cercano
          quantity = Math.round(quantity / packageSize) * packageSize;
          
          // Asegurarse de que sea al menos el tamaño del paquete
          if (quantity < packageSize) quantity = packageSize;
          
          // Notificar al usuario
          toast.info(`La cantidad se ha ajustado a ${quantity} kg para coincidir con el tamaño del empaque`);
        }
      }
    }
    
    // Actualizar la cantidad
    setProducts(products.map(p => 
      p.id === productId ? { ...p, packageQuantity: quantity } : p
    ));
  };

  // Cambiar la presentación seleccionada
  const updateSelectedPackage = (productId: number, packageId: number) => {
    setProducts(products.map(p => {
      if (p.id === productId) {
        const newPackage = p.packagesItems.find(pkg => pkg.id === packageId) || null;
        return {
          ...p,
          selectedPackage: newPackage,
          packageQuantity: 1
        };
      }
      return p;
    }));
  };

  // Eliminar un producto
  const removeProduct = (productId: number) => {
    setProducts(products.filter(p => p.id !== productId));
    toast.success("Producto eliminado");
  };

  // Calcular cantidad total (unidades * tamaño de empaque)
  const calculateTotalQuantity = (product: ProductWithSelection): number => {
    if (!product.selectedPackage) return product.packageQuantity;
    return product.packageQuantity * product.selectedPackage.quantity;
  };

  // Parsear string de precio a número
  const parsePrice = (priceStr: string): number => {
    return PriceListService.parsePriceString(priceStr);
  };

  // Calcular precio total de un producto
  const calculateProductTotal = (product: ProductWithSelection): number => {
    const unitPrice = parsePrice(product.price);
    if (!product.selectedPackage) return 0;

    // Calcular kg totales: cantidad de paquetes × kg por paquete
    const totalKg = product.packageQuantity * product.selectedPackage.quantity;
    
    // Multiplicar precio unitario por kg totales
    return unitPrice * totalKg;
  };
  
  // Calcular el total del pedido
  const calculateOrderTotal = (): number => {
    return products.reduce((total, product) => {
      return total + calculateProductTotal(product);
    }, 0);
  };

  // Exponer métodos al componente padre
  useImperativeHandle(ref, () => ({
    saveData: () => {
      if (products.length === 0) {
        toast.error("Debes añadir al menos un producto");
        return false;
      }

      // Formatear productos para el formulario
      const formattedProducts = products.map(p => ({
        id: p.product[0],
        name: p.product[1],
        reference: p.productReference,
        quantity: calculateTotalQuantity(p),
        price: parsePrice(p.price),
        uom_id: p.selectedPackage?.uom_id || [0, ""],
        packageInfo: p.selectedPackage?.name,
        packageQuantity: p.packageQuantity
      }));

      const updatedData = {
        products: formattedProducts,
        observations,
        pricelistId: pricelist?.id
      };
      
      updateFormData(updatedData);
      return updatedData;
    }
  }));

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Agregar Productos</CardTitle>
        <CardDescription className="text-md text-muted-foreground">
          Selecciona los productos disponibles para este cliente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <h3 className="text-lg font-medium">Productos seleccionados ({products.length})</h3>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-dark-green hover:bg-dark-green/90 w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Agregar Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-w-[95vw] w-full">
              <DialogHeader>
                <DialogTitle>Buscar Productos</DialogTitle>
                <DialogDescription>Busca y selecciona los productos disponibles</DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2 my-4">
                <div className="relative w-full">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Buscar productos..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              {searchTerm.length > 0 && searchTerm.length < 3 && (
                <p className="text-sm text-muted-foreground mt-1 mb-2">
                  Escribe al menos 3 caracteres para iniciar la búsqueda
                </p>
              )}

              <ScrollArea className="h-[300px] rounded-md border p-4">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div key={product.id} className="py-2 border-b flex justify-between items-center">
                      <div>
                        <p className="font-medium">{product.product[1]}</p>
                        <p className="text-sm text-muted-foreground">Ref: {product.productReference}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => addProduct(product)}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Agregar
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4 text-muted-foreground">
                    {hasSearched && searchTerm.length >= 3 
                      ? "No se encontraron productos" 
                      : "Escribe para buscar productos"}
                  </p>
                )}
              </ScrollArea>
              
              <DialogFooter className="sm:justify-end">
                <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)}>
                  Cerrar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {products.length > 0 ? (
          <div className="space-y-4">
            {/* Tabla de productos (para pantallas medianas y grandes) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Producto</th>
                    <th className="py-2 w-[180px]">Presentación</th>
                    <th className="py-2 w-[120px]">Cantidad</th>
                    <th className="py-2 text-right">Precio</th>
                    <th className="py-2 text-right">Total</th>
                    <th className="py-2 w-[60px]"></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="py-2">
                        <div>
                          <p className="font-medium">{product.product[1]}</p>
                          <p className="text-xs text-muted-foreground">Ref: {product.productReference}</p>
                        </div>
                      </td>
                      <td className="py-2">
                        <Select 
                          value={product.selectedPackage?.id.toString() || ""} 
                          onValueChange={(value) => updateSelectedPackage(product.id, parseInt(value))}
                        >
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            {product.packagesItems.map(pkg => (
                              <SelectItem key={pkg.id} value={pkg.id.toString()}>
                                {pkg.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-2">
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(product.id, product.packageQuantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="text"
                            value={editingQuantities[product.id] !== undefined 
                              ? editingQuantities[product.id] 
                              : product.packageQuantity}
                            onChange={(e) => {
                              if (/^\d*$/.test(e.target.value)) {
                                setEditingQuantities({
                                  ...editingQuantities,
                                  [product.id]: e.target.value
                                });
                              }
                            }}
                            onBlur={(e) => {
                              const value = e.target.value;
                              if (value) {
                                const numValue = parseInt(value);
                                if (!isNaN(numValue) && numValue >= 1) {
                                  updateQuantity(product.id, numValue);
                                }
                              }
                              const newEditing = {...editingQuantities};
                              delete newEditing[product.id];
                              setEditingQuantities(newEditing);
                            }}
                            className="h-7 w-12 text-center text-sm p-1"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(product.id, product.packageQuantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                      <td className="py-2 text-right text-sm">
                        {parsePrice(product.price).toLocaleString('es-CO', {
                          style: 'currency',
                          currency: 'COP'
                        })}
                      </td>
                      <td className="py-2 text-right font-medium">
                        {calculateProductTotal(product).toLocaleString('es-CO', {
                          style: 'currency',
                          currency: 'COP'
                        })}
                      </td>
                      <td className="py-2 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeProduct(product.id)}
                          className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} className="py-2 text-right font-bold">Total pedido:</td>
                    <td className="py-2 text-right font-bold">
                      {calculateOrderTotal().toLocaleString('es-CO', {
                        style: 'currency',
                        currency: 'COP'
                      })}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Versión móvil (cards) */}
            <div className="sm:hidden space-y-4">
              {products.map((product) => (
                <div key={product.id} className="border rounded-lg p-4 relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeProduct(product.id)}
                    className="absolute right-2 top-2 h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <div className="mb-3">
                    <h4 className="font-medium">{product.product[1]}</h4>
                    <p className="text-xs text-muted-foreground">Ref: {product.productReference}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs block mb-1">Presentación</Label>
                      <Select 
                        value={product.selectedPackage?.id.toString() || ""} 
                        onValueChange={(value) => updateSelectedPackage(product.id, parseInt(value))}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {product.packagesItems.map(pkg => (
                            <SelectItem key={pkg.id} value={pkg.id.toString()}>
                              {pkg.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs block mb-1">Cantidad</Label>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(product.id, product.packageQuantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="text"
                          value={product.packageQuantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value) && value >= 1) {
                              updateQuantity(product.id, value);
                            }
                          }}
                          className="h-7 w-12 text-center text-sm p-1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(product.id, product.packageQuantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex justify-between items-center text-sm">
                    <span>Precio unitario: {parsePrice(product.price).toLocaleString('es-CO', {
                      style: 'currency',
                      currency: 'COP'
                    })}</span>
                    <span className="font-bold">Total: {calculateProductTotal(product).toLocaleString('es-CO', {
                      style: 'currency',
                      currency: 'COP'
                    })}</span>
                  </div>
                </div>
              ))}
              
              {/* Total en móvil */}
              <div className="border-t pt-4 flex justify-between">
                <span className="font-bold">Total pedido:</span>
                <span className="font-bold">
                  {calculateOrderTotal().toLocaleString('es-CO', {
                    style: 'currency',
                    currency: 'COP'
                  })}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 border rounded-md bg-muted/20">
            <p className="text-muted-foreground">No hay productos agregados</p>
            <p className="text-sm text-muted-foreground mt-1">Haz clic en "Agregar Producto" para comenzar</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="observations">Observaciones</Label>
          <Textarea
            id="observations"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Añade cualquier observación adicional aquí"
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
    </Card>
  );
});

SelectProducts.displayName = "SelectProducts";
export default SelectProducts;