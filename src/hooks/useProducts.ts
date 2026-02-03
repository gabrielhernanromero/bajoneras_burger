import { useState, useEffect } from 'react';
import { Product } from '../types';
import { supabaseService } from '../services';
import { PRODUCTS } from '../constants';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const getFallbackExtrasByCategory = (category?: string) => {
    if (!category) return undefined;
    const normalizedCategory = category.trim().toLowerCase();
    const extrasPool = PRODUCTS.filter(p => p.extras && p.extras.length > 0 && p.category.trim().toLowerCase() === normalizedCategory)
      .flatMap(p => p.extras || []);
    if (extrasPool.length === 0) return undefined;
    const unique = new Map(extrasPool.map(extra => [extra.id, extra]));
    return Array.from(unique.values());
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log('Cargando productos desde Supabase...');
        const supabaseProducts = await supabaseService.getProducts();

        if (supabaseProducts && supabaseProducts.length > 0) {
          console.log('Productos cargados de Supabase:', supabaseProducts);
          const mergedProducts = supabaseProducts.map((product) => {
            if (product.extras && product.extras.length > 0) return product;
            const localDef = PRODUCTS.find(p => p.id === product.id)
              || PRODUCTS.find(p => p.name.trim().toLowerCase() === product.name.trim().toLowerCase());
            if (localDef?.extras && localDef.extras.length > 0) {
              return { ...product, extras: localDef.extras };
            }
            const categoryExtras = getFallbackExtrasByCategory(product.category);
            if (categoryExtras && categoryExtras.length > 0) {
              return { ...product, extras: categoryExtras };
            }
            return product;
          });
          setProducts(mergedProducts);
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
