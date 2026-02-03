
export type Category = string; // Ahora las categorías son dinámicas
export type ProductType = 'simple' | 'promo' | 'combo';

export interface Extra {
  id: string;
  name: string;
  price: number;
}

export interface PromoConfig {
  type: ProductType; // 'simple', 'promo' o 'combo'
  is_fixed: boolean; // true: 2 iguales, false: 2 a elegir
  selection_limit: number; // Cuántos items puede elegir (1, 2, 3, 4...)
  allowed_categories?: string[]; // Categorías permitidas en la promo
  allowed_items?: string[]; // IDs específicos de productos permitidos
  discount_percentage?: number; // % de descuento respecto al precio normal
  available_days?: string[]; // Días activos (ej: ["martes", "miércoles"])
  stock_limit?: number; // Stock limitado de promos
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: Category;
  isPopular?: boolean;
  isPromo?: boolean;
  isCombo?: boolean;
  extras?: Extra[];
  // Campos de hamburguesas
  burgersToSelect?: number; // Cantidad de hamburguesas que se pueden elegir
  allowDuplicateBurgers?: boolean; // Si permite elegir la misma hamburguesa varias veces
  allowedBurgers?: string[]; // IDs de las hamburguesas permitidas en el combo
  // Campos de escalabilidad y promoción
  priorityOrder?: number; // Orden de prioridad en el menú
  activeDays?: string[]; // Días activos (ej: ["lunes", "martes", "miércoles"])
  discountLabel?: string; // Etiqueta visual (ej: "20% OFF" o "Ahorrás $3000")
  discountPercentage?: number; // Porcentaje de descuento
  estimatedCost?: number; // Costo estimado si elige los ítems más caros
  minimumMargin?: number; // Margen mínimo en %
  // Nueva estructura de promociones avanzadas
  promoConfig?: PromoConfig;
}

export interface ComboburgerSelection {
  burger: Product;
  extras: Extra[];
  notes: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedExtras?: Extra[];
  cartItemId?: string; // ID único para diferenciar productos con distintos extras
  notes?: string; // Observaciones del producto
  comboBurgers?: ComboburgerSelection[]; // Hamburguesas seleccionadas en combos
}
