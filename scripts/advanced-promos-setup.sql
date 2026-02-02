-- ============================================
-- SCRIPT: Agregar Campos Avanzados de Promociones
-- ============================================
-- Ejecuta este script en Supabase SQL Editor

-- 1. Agregar columna de tipo de producto
ALTER TABLE "Productos" 
ADD COLUMN IF NOT EXISTS "product_type" varchar(20) DEFAULT 'simple';

-- 2. Agregar columna para selección fija
ALTER TABLE "Productos" 
ADD COLUMN IF NOT EXISTS "is_fixed_selection" bool DEFAULT false;

-- 3. Agregar columna de límite de selección
ALTER TABLE "Productos" 
ADD COLUMN IF NOT EXISTS "selection_limit" int4 DEFAULT 0;

-- 4. Agregar columna de categorías permitidas
ALTER TABLE "Productos" 
ADD COLUMN IF NOT EXISTS "allowed_categories" jsonb;

-- 5. Agregar columna de items permitidos
ALTER TABLE "Productos" 
ADD COLUMN IF NOT EXISTS "allowed_items" jsonb;

-- 6. Agregar columna de porcentaje de descuento
ALTER TABLE "Productos" 
ADD COLUMN IF NOT EXISTS "discount_percentage" float8 DEFAULT 0;

-- 7. Agregar columna de días disponibles
ALTER TABLE "Productos" 
ADD COLUMN IF NOT EXISTS "available_days" jsonb;

-- 8. Agregar columna de stock limitado
ALTER TABLE "Productos" 
ADD COLUMN IF NOT EXISTS "stock_limit" int4;

-- 9. Agregar columna de costo estimado
ALTER TABLE "Productos" 
ADD COLUMN IF NOT EXISTS "estimated_cost" int4;

-- 10. Agregar columna de margen mínimo
ALTER TABLE "Productos" 
ADD COLUMN IF NOT EXISTS "minimum_margin" float8;

-- ============================================
-- Configurar los productos existentes como PROMO
-- ============================================

-- PROMO PARA COMPARTIR (ID: 1)
UPDATE "Productos" 
SET 
  "product_type" = 'promo',
  "is_fixed_selection" = false,
  "selection_limit" = 2,
  "allowed_categories" = '["Burgers"]'::jsonb,
  "discount_percentage" = 10
WHERE id = 1;

-- BURGER X2 (ID: 18)
UPDATE "Productos" 
SET 
  "product_type" = 'promo',
  "is_fixed_selection" = false,
  "selection_limit" = 2,
  "allowed_categories" = '["Burgers"]'::jsonb,
  "discount_percentage" = 8
WHERE id = 18;

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Ejecuta esto para verificar que todo se creó:
-- SELECT id, nombre, product_type, is_fixed_selection, selection_limit, discount_percentage FROM "Productos" WHERE id IN (1, 18);
