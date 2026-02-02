-- ============================================
-- SCRIPT: Campos Finales de Escalabilidad
-- ============================================

-- 1. Campos de hamburguesas (ya existen pero verificamos)
ALTER TABLE "Productos" 
ADD COLUMN IF NOT EXISTS "hamburguesas_a_elegir" int4;

ALTER TABLE "Productos" 
ADD COLUMN IF NOT EXISTS "allow_duplicate_burgers" bool DEFAULT true;

-- 2. Nuevos campos de escalabilidad y rentabilidad
ALTER TABLE "Productos" 
ADD COLUMN IF NOT EXISTS "priority_order" int4 DEFAULT 0;

ALTER TABLE "Productos" 
ADD COLUMN IF NOT EXISTS "active_days" jsonb DEFAULT '[]'::jsonb;

ALTER TABLE "Productos" 
ADD COLUMN IF NOT EXISTS "discount_label" varchar(100);

ALTER TABLE "Productos" 
ADD COLUMN IF NOT EXISTS "discount_percentage" float8 DEFAULT 0;

ALTER TABLE "Productos" 
ADD COLUMN IF NOT EXISTS "estimated_cost" int4;

ALTER TABLE "Productos" 
ADD COLUMN IF NOT EXISTS "minimum_margin" float8;

-- ============================================
-- Configurar PROMO PARA COMPARTIR (ID: 1)
-- ============================================
UPDATE "Productos" 
SET 
  "hamburguesas_a_elegir" = 2,
  "allow_duplicate_burgers" = true,
  "priority_order" = 1,
  "active_days" = '["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]'::jsonb,
  "discount_label" = 'Ahorrás hasta $3000',
  "discount_percentage" = 10
WHERE id = 1;

-- ============================================
-- Configurar BURGER X2 (ID: 18)
-- ============================================
UPDATE "Productos" 
SET 
  "hamburguesas_a_elegir" = 2,
  "allow_duplicate_burgers" = false,
  "priority_order" = 2,
  "active_days" = '["martes", "miércoles"]'::jsonb,
  "discount_label" = '2 Burgers Distintas - $2000 OFF',
  "discount_percentage" = 8
WHERE id = 18;

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================
SELECT id, nombre, hamburguesas_a_elegir, allow_duplicate_burgers, priority_order, active_days, discount_label, discount_percentage 
FROM "Productos" 
WHERE id IN (1, 18);
