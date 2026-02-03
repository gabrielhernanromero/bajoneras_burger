-- Script para agregar la columna allowed_burgers a la tabla Productos
-- Esta columna almacena un array de IDs de hamburguesas permitidas en combos

-- Agregar la columna allowed_burgers como un array JSON
ALTER TABLE "Productos"
ADD COLUMN IF NOT EXISTS allowed_burgers jsonb DEFAULT '[]'::jsonb;

-- Agregar comentario explicativo
COMMENT ON COLUMN "Productos".allowed_burgers IS 'Array de IDs de hamburguesas permitidas para seleccionar en este combo. Si está vacío, se permiten todas las hamburguesas.';
