import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    const { data, error } = await supabase
      .from('Productos')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error obteniendo productos:', error);
      return null;
    }
    
    // Convertir de español a inglés
    return data ? data.map(toEnglishFields) : null;
  },

  // Guardar/actualizar producto
  async upsertProduct(product: any) {
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
    // Primero, obtener todos los IDs existentes
    const { data: existingProducts } = await supabase
      .from('Productos')
      .select('id');
    
    // Si hay productos existentes, eliminarlos uno por uno
    if (existingProducts && existingProducts.length > 0) {
      for (const product of existingProducts) {
        await supabase
          .from('Productos')
          .delete()
          .eq('id', product.id);
      }
    }

    // Convertir productos a español y REMOVER el campo id para que Supabase genere nuevos
    const spanishProducts = products.map(p => {
      const { id, ...rest } = toSpanishFields(p);
      return rest;
    });

    // Insertar los nuevos productos
    const { data, error } = await supabase
      .from('Productos')
      .insert(spanishProducts)
      .select();
    
    if (error) {
      console.error('Error guardando productos:', error);
      return null;
    }
    
    return data ? data.map(toEnglishFields) : null;
  },

  // Eliminar producto
  async deleteProduct(productId: string) {
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
