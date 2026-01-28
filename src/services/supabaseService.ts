import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Solo crear el cliente si hay credenciales configuradas
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== '';

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;

// Mapeo de campos inglés -> español (DB)
const toSpanishFields = (product: any, isUpdate: boolean = false) => {
  const mapped: any = {
    nombre: String(product.name || '').trim(),
    descripcion: String(product.description || '').trim(),
    precio: parseInt(String(product.price || 0), 10), // Convertir a número entero
    imagen: String(product.image || '').trim(),
    categoria: String(product.category || '').trim(),
    extras: product.extras || [],
    combo: product.comboType ? String(product.comboType).trim() : null, // Asegurar que es string
  };
  
  // Solo incluir id si existe Y es un update (no para inserts nuevos)
  if (product.id && (isUpdate || typeof product.id === 'number')) {
    const numId = typeof product.id === 'string' ? parseInt(product.id, 10) : product.id;
    // Solo incluir si es un número válido mayor a 0
    if (!isNaN(numId) && numId > 0) {
      mapped.id = numId;
    }
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
      console.error('Supabase no configurado');
      throw new Error('Supabase no configurado');
    }
    
    const hasValidId = product.id && !isNaN(parseInt(String(product.id), 10)) && parseInt(String(product.id), 10) > 0;
    const spanishProduct = toSpanishFields(product, hasValidId);
    console.log('Intentando guardar producto:', spanishProduct);
    
    const { data, error } = await supabase
      .from('Productos')
      .upsert(spanishProduct)
      .select();
    
    if (error) {
      console.error('❌ Error guardando producto en Supabase:', error);
      throw new Error(`Error de Supabase: ${error.message}`);
    }
    
    console.log('✅ Producto guardado exitosamente:', data);
    return data ? data.map(toEnglishFields) : null;
  },

  // Guardar múltiples productos (reemplazar todos)
  async replaceAllProducts(products: any[]) {
    if (!supabase) {
      console.error('Supabase no configurado');
      throw new Error('Supabase no configurado');
    }
    
    try {
      console.log('=== INICIANDO replaceAllProducts ===');
      console.log('Productos a guardar:', products.length);
      
      // Convertir productos a español, detectando si tienen ID válido
      const spanishProducts = products.map(p => {
        const hasValidId = p.id && !isNaN(parseInt(String(p.id), 10)) && parseInt(String(p.id), 10) > 0;
        console.log(`Producto: ${p.name}, ID: ${p.id}, hasValidId: ${hasValidId}`);
        return toSpanishFields(p, hasValidId);
      });
      
      console.log('Productos en español (listos para guardar):', spanishProducts);

      // Usar upsert para actualizar o insertar según el id
      const { data, error } = await supabase
        .from('Productos')
        .upsert(spanishProducts, { onConflict: 'id' })
        .select();
      
      if (error) {
        console.error('❌ Error de Supabase en upsert:', error);
        throw new Error(`Error de Supabase: ${error.message}`);
      }
      
      if (!data || data.length === 0) {
        console.warn('⚠️ Upsert completado pero no hay datos retornados');
      } else {
        console.log('✅ Datos retornados de Supabase:', data);
      }
      
      // Obtener todos los productos actuales
      console.log('Obteniendo todos los productos para limpiar...');
      const { data: allProducts, error: getAllError } = await supabase
        .from('Productos')
        .select('id');
      
      if (getAllError) {
        console.error('⚠️ Error obteniendo productos para limpiar:', getAllError);
      } else if (allProducts) {
        const newProductIds = new Set(products.map(p => p.id).filter(id => id));
        const existingIds = allProducts.map(p => p.id);
        
        console.log('IDs nuevos:', Array.from(newProductIds));
        console.log('IDs existentes en BD:', existingIds);
        
        // Eliminar productos que ya no están en la lista
        for (const id of existingIds) {
          if (!newProductIds.has(id)) {
            console.log(`Eliminando producto con id: ${id}`);
            const { error: delError } = await supabase
              .from('Productos')
              .delete()
              .eq('id', id);
            
            if (delError) {
              console.error(`Error eliminando id ${id}:`, delError);
            }
          }
        }
      }
      
      const result = data ? data.map(toEnglishFields) : [];
      console.log('=== FIN replaceAllProducts - Retornando:', result);
      return result;
    } catch (error) {
      console.error('=== ERROR en replaceAllProducts:', error);
      throw error;
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
      console.error('Supabase no configurado');
      return null;
    }
    
    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `productos/${fileName}`;

      console.log(`Intentando subir a Supabase: ${filePath}, tamaño: ${(file.size / 1024 / 1024).toFixed(2)}MB`);

      // Subir archivo
      const { data, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type || 'image/jpeg'
        });

      if (uploadError) {
        console.error('❌ Error subiendo imagen a Supabase Storage:', uploadError);
        throw new Error(`Error de almacenamiento: ${uploadError.message}`);
      }

      if (!data) {
        throw new Error('No se recibió respuesta del servidor');
      }

      console.log(`✅ Archivo subido: ${data.path}`);

      // Obtener URL pública
      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        throw new Error('No se pudo obtener la URL pública');
      }

      const publicUrl = publicUrlData.publicUrl;
      console.log(`✅ URL pública generada: ${publicUrl}`);
      return publicUrl;
    } catch (error) {
      console.error('Error en uploadImage:', error);
      throw error;
    }
  }
};
