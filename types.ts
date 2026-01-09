
export type Category = 'Combos' | 'Burgers' | 'Postres' | 'Bebidas';

export interface Extra {
  id: string;
  name: string;
  price: number;
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
  extras?: Extra[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedExtras?: Extra[];
  cartItemId?: string; // ID único para diferenciar productos con distintos extras
}
