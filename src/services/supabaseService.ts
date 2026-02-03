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
    // Campos de hamburguesas
    hamburguesas_a_elegir: product.burgersToSelect && product.burgersToSelect > 0 ? parseInt(String(product.burgersToSelect), 10) : null,
    allow_duplicate_burgers: product.allowDuplicateBurgers === true ? true : (product.allowDuplicateBurgers === false ? false : null),
    allowed_burgers: product.allowedBurgers && Array.isArray(product.allowedBurgers) ? product.allowedBurgers : [],
    // Campos de escalabilidad y promoción
    priority_order: product.priorityOrder ? parseInt(String(product.priorityOrder), 10) : 0,
    active_days: product.activeDays && Array.isArray(product.activeDays) ? product.activeDays : [],
    discount_label: product.discountLabel ? String(product.discountLabel).trim() : null,
    discount_percentage: product.discountPercentage ? parseFloat(String(product.discountPercentage)) : 0,
    estimated_cost: product.estimatedCost ? parseInt(String(product.estimatedCost), 10) : null,
    minimum_margin: product.minimumMargin ? parseFloat(String(product.minimumMargin)) : null,
  };
  
  // Solo incluir id si es un número válido o puede convertirse a número válido
  if (product.id) {
    // Intentar extraer número del ID si es string tipo "product-123" o convertir directamente
    let numId: number | null = null;
    
    if (typeof product.id === 'number') {
      numId = product.id;
    } else if (typeof product.id === 'string') {
      // Si el ID es un string, intentar parsearlo
      const parsed = parseInt(product.id, 10);
      // Solo usar si es un número válido y mayor a 0
      if (!isNaN(parsed) && parsed > 0) {
        numId = parsed;
      }
    }
    
    // Solo incluir el ID si es un número válido mayor a 0
    // Si no es válido, Supabase generará uno automáticamente
    if (numId && numId > 0) {
      mapped.id = numId;
    }
  }
  
  // Si no hay ID válido, Supabase lo autogenerará (campo SERIAL)
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
  // Campos de hamburguesas
  burgersToSelect: product.hamburguesas_a_elegir || undefined,
  allowDuplicateBurgers: product.allow_duplicate_burgers !== null && product.allow_duplicate_burgers !== undefined ? product.allow_duplicate_burgers : undefined,
  allowedBurgers: product.allowed_burgers || [],
  // Campos de escalabilidad
  priorityOrder: product.priority_order || undefined,
  activeDays: product.active_days || [],
  discountLabel: product.discount_label || undefined,
  discountPercentage: product.discount_percentage || undefined,
  estimatedCost: product.estimated_cost || undefined,
  minimumMargin: product.minimum_margin || undefined,
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
    
    const spanishProduct = toSpanishFields(product);
    console.log('Intentando guardar producto:', spanishProduct);
    
    // Si no tiene ID válido, es un INSERT nuevo
    // Si tiene ID válido, es un UPDATE
    const isNewProduct = !spanishProduct.id;
    
    if (isNewProduct) {
      console.log('Insertando nuevo producto (sin ID)...');
      const { data, error } = await supabase
        .from('Productos')
        .insert(spanishProduct)
        .select();
      
      if (error) {
        console.error('❌ Error insertando producto en Supabase:', error);
        throw new Error(`Error de Supabase: ${error.message}`);
      }
      
      console.log('✅ Producto insertado exitosamente:', data);
      return data ? data.map(toEnglishFields) : null;
    } else {
      console.log('Actualizando producto existente con ID:', spanishProduct.id);
      const { data, error } = await supabase
        .from('Productos')
        .upsert(spanishProduct)
        .select();
      
      if (error) {
        console.error('❌ Error actualizando producto en Supabase:', error);
        throw new Error(`Error de Supabase: ${error.message}`);
      }
      
      console.log('✅ Producto actualizado exitosamente:', data);
      return data ? data.map(toEnglishFields) : null;
    }
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
      
      // Separar productos nuevos (sin ID válido) de productos existentes
      const newProducts: any[] = [];
      const existingProducts: any[] = [];
      
      products.forEach(p => {
        const spanishProduct = toSpanishFields(p);
        if (spanishProduct.id) {
          existingProducts.push(spanishProduct);
        } else {
          newProducts.push(spanishProduct);
        }
      });
      
      console.log(`Productos nuevos: ${newProducts.length}, Existentes: ${existingProducts.length}`);
      
      const allResults: any[] = [];
      
      // Insertar productos nuevos
      if (newProducts.length > 0) {
        console.log('Insertando productos nuevos:', newProducts);
        const { data: insertData, error: insertError } = await supabase
          .from('Productos')
          .insert(newProducts)
          .select();
        
        if (insertError) {
          console.error('❌ Error insertando productos nuevos:', insertError);
          throw new Error(`Error de Supabase: ${insertError.message}`);
        }
        
        if (insertData) {
          console.log('✅ Productos nuevos insertados:', insertData.length);
          allResults.push(...insertData);
        }
      }
      
      // Actualizar productos existentes
      if (existingProducts.length > 0) {
        console.log('Actualizando productos existentes:', existingProducts);
        const { data: updateData, error: updateError } = await supabase
          .from('Productos')
          .upsert(existingProducts, { onConflict: 'id' })
          .select();
        
        if (updateError) {
          console.error('❌ Error actualizando productos existentes:', updateError);
          throw new Error(`Error de Supabase: ${updateError.message}`);
        }
        
        if (updateData) {
          console.log('✅ Productos existentes actualizados:', updateData.length);
          allResults.push(...updateData);
        }
      }
      
      // Obtener todos los productos actuales para limpiar los que no están en la nueva lista
      console.log('Obteniendo todos los productos para limpiar...');
      const { data: allDbProducts, error: getAllError } = await supabase
        .from('Productos')
        .select('id');
      
      if (getAllError) {
        console.error('⚠️ Error obteniendo productos para limpiar:', getAllError);
      } else if (allDbProducts) {
        // Obtener IDs de los productos que acabamos de guardar
        const savedIds = new Set(allResults.map(p => p.id));
        const dbIds = allDbProducts.map(p => p.id);
        
        console.log('IDs guardados:', Array.from(savedIds));
        console.log('IDs en BD:', dbIds);
        
        // Eliminar productos que ya no están en la lista
        for (const dbId of dbIds) {
          if (!savedIds.has(dbId)) {
            console.log(`Eliminando producto con id: ${dbId}`);
            const { error: delError } = await supabase
              .from('Productos')
              .delete()
              .eq('id', dbId);
            
            if (delError) {
              console.error(`Error eliminando id ${dbId}:`, delError);
            }
          }
        }
      }
      
      const result = allResults.map(toEnglishFields);
      console.log('=== FIN replaceAllProducts - Retornando:', result.length, 'productos');
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
