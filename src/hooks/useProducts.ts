import { useState, useEffect } from 'react';
import { Product } from '../types';
import { supabaseService } from '../services';
import { PRODUCTS } from '../constants';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log('Cargando productos desde Supabase...');
        const supabaseProducts = await supabaseService.getProducts();
        if (supabaseProducts && supabaseProducts.length > 0) {
          console.log('Productos cargados de Supabase:', supabaseProducts);
          setProducts(supabaseProducts);
        } else {
          console.warn('No hay productos en Supabase, usando datos locales');
          setProducts(PRODUCTS);
        }
      } catch (error) {
        console.error('Error cargando productos:', error);
        setProducts(PRODUCTS); // Fallback a datos locales
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const updateProducts = async (newProducts: Product[]) => {
    try {
      console.log('Actualizando productos en Supabase...', newProducts);
      const result = await supabaseService.replaceAllProducts(newProducts);
      
      if (result && Array.isArray(result)) {
        console.log('✅ Productos actualizados exitosamente:', result);
        setProducts(result); // Usar los datos retornados de Supabase, no los locales
        return true;
      } else {
        console.error('❌ replaceAllProducts no retornó datos válidos:', result);
        return false;
      }
    } catch (error) {
      console.error('❌ Error actualizando productos:', error);
      return false;
    }
  };

  return {
    products,
    setProducts,
    updateProducts,
    loading,
  };
};
