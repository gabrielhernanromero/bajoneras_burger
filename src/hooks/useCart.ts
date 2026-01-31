import { useState, useCallback } from 'react';
import { CartItem, Product, Extra, ComboburgerSelection } from '../types';
import { generateId } from '../utils';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  const addToCart = useCallback((
    product: Product,
    selectedExtras: Extra[] = [],
    notes: string = '',
    comboBurgers?: ComboburgerSelection[]
  ) => {
    const cartItemId = generateId();
    const newItem: CartItem = {
      ...product,
      quantity: 1,
      selectedExtras,
      cartItemId,
      notes,
      comboBurgers,
    };

    setCart((prev) => [...prev, newItem]);
    setLastAddedId(cartItemId);

    // Limpiar la animación después de 1 segundo
    setTimeout(() => setLastAddedId(null), 1000);
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  }, []);

  const updateQuantity = useCallback((cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  }, []);

  const updateItem = useCallback((cartItemId: string, updates: Partial<CartItem>) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          return { ...item, ...updates };
        }
        return item;
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const getTotalItems = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const getTotalPrice = useCallback(() => {
    return cart.reduce((total, item) => {
      let itemPrice = item.price;

      if (item.selectedExtras) {
        itemPrice += item.selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
      }

      if (item.comboBurgers) {
        item.comboBurgers.forEach((combo) => {
          itemPrice += combo.extras.reduce((sum, extra) => sum + extra.price, 0);
        });
      }

      return total + itemPrice * item.quantity;
    }, 0);
  }, [cart]);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateItem,
    clearCart,
    getTotalItems,
    getTotalPrice,
    lastAddedId,
  };
};
