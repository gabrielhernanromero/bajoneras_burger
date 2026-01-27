import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Solo crear el cliente si hay credenciales configuradas
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== '';

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;

// Mapeo de campos inglés -> español (DB)
const toSpanishFields = (product: any) => {
  const mapped: any = {
    nombre: product.name,
    descripcion: product.description,
    precio: product.price,
    imagen: product.image,
    categoria: product.category,
    extras: product.extras || [],
    combo: product.comboType || null,
  };
  
  // Solo incluir id si existe (para updates)
  if (product.id) {
    mapped.id = product.id;
  }
  
  return mapped;
};

// Mapeo de campos español (DB) -> inglés
const toEnglishFields = (product: any) => ({
  id: product.id,
  name: product.nombre,
  description: product.descripcion,
  price: product.precio,
  image: product.imagen,
  category: product.categoria,
  extras: product.extras || [],
  comboType: product.combo || undefined,
});

// Funciones para interactuar con la base de datos
export const supabaseService = {
  // Obtener todos los productos
  async getProducts() {
    // Si Supabase no está configurado, retornar null
    if (!supabase) {
      console.log('Supabase no configurado, usando datos locales');
      return null;
    }
    
    const { data, error } = await supabase
      .from('Productos')
      .select('*');
    
    if (error) {
      console.error('Error obteniendo productos:', error);
      return null;
    }
    
    // Convertir de español a inglés
    return data ? data.map(toEnglishFields) : null;
  },

  // Guardar/actualizar producto
  async upsertProduct(product: any) {
    if (!supabase) {
      console.log('Supabase no configurado');
      return null;
    }
    
    const spanishProduct = toSpanishFields(product);
    
    const { data, error } = await supabase
      .from('Productos')
      .upsert(spanishProduct)
      .select();
    
    if (error) {
      console.error('Error guardando producto:', error);
      return null;
    }
    
    return data ? data.map(toEnglishFields) : null;
  },

  // Guardar múltiples productos (reemplazar todos)
  async replaceAllProducts(products: any[]) {
    if (!supabase) {
      console.log('Supabase no configurado');
      return null;
    }
    
    try {
      // Convertir productos a español
      const spanishProducts = products.map(p => toSpanishFields(p));

      // Usar upsert para actualizar o insertar según el id
      const { data, error } = await supabase
        .from('Productos')
        .upsert(spanishProducts, { onConflict: 'id' })
        .select();
      
      if (error) {
        console.error('Error guardando productos:', error);
        return null;
      }
      
      // Si no hay datos, significa que no hay productos nuevos
      // Ahora eliminar los que ya no existen
      const { data: allProducts } = await supabase
        .from('Productos')
        .select('id');
      
      if (allProducts) {
        const newProductIds = new Set(products.map(p => p.id));
        const existingIds = allProducts.map(p => p.id);
        
        // Eliminar productos que ya no están en la lista
        for (const id of existingIds) {
          if (!newProductIds.has(id)) {
            await supabase
              .from('Productos')
              .delete()
              .eq('id', id);
          }
        }
      }
      
      return data ? data.map(toEnglishFields) : null;
    } catch (error) {
      console.error('Error en replaceAllProducts:', error);
      return null;
    }
  },

  // Eliminar producto
  async deleteProduct(productId: string) {
    if (!supabase) {
      console.log('Supabase no configurado');
      return false;
    }
    
    const { error } = await supabase
      .from('Productos')
      .delete()
      .eq('id', productId);
    
    if (error) {
      console.error('Error eliminando producto:', error);
      return false;
    }
    
    return true;
  },

  // Subir imagen a Supabase Storage
  async uploadImage(file: File): Promise<string | null> {
    if (!supabase) {
      console.log('Supabase no configurado');
      return null;
    }
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error subiendo imagen:', uploadError);
        return null;
      }

      // Obtener URL pública de la imagen
      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error en uploadImage:', error);
      return null;
    }
  }
};
