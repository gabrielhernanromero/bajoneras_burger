# 🚀 GUÍA DE CONFIGURACIÓN DE SUPABASE

## Paso 1: Crear cuenta en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en "Start your project"
3. Regístrate con GitHub, Google o email

## Paso 2: Crear un nuevo proyecto

1. En el dashboard, haz clic en "New Project"
2. Completa los datos:
   - **Nombre del proyecto:** `bajoneras-burger`
   - **Database Password:** Crea una contraseña segura (guárdala)
   - **Region:** Selecciona la más cercana (ej: South America)
3. Haz clic en "Create new project"
4. Espera 1-2 minutos mientras se crea el proyecto

## Paso 3: Crear la tabla de productos

1. En el menú lateral, ve a **"Table Editor"**
2. Haz clic en **"Create a new table"**
3. Configura la tabla:
   - **Name:** `products`
   - **Enable Row Level Security (RLS):** **DESACTIVADO** ❌ (importante para empezar)

4. Crea las siguientes columnas (además de `id` y `created_at` que vienen por defecto):

| Column Name     | Type    | Default Value | Extra Options            |
|----------------|---------|---------------|--------------------------|
| name           | text    |               | NOT NULL                 |
| description    | text    |               |                          |
| price          | numeric |               | NOT NULL                 |
| image          | text    |               |                          |
| category       | text    |               | NOT NULL                 |
| extras         | jsonb   | []            |                          |
| comboType      | text    |               |                          |

5. Haz clic en **"Save"**

## Paso 4: Configurar políticas de acceso (importante)

1. Ve a **"Authentication"** > **"Policies"** en el menú lateral
2. Busca la tabla `products`
3. Haz clic en **"New Policy"**
4. Selecciona **"Create a policy from scratch"**
5. Configura:
   - **Policy name:** `Enable read access for all users`
   - **Allowed operation:** SELECT
   - **Target roles:** `anon` y `authenticated`
   - **Policy definition:** Deja el SQL como está (true)
6. Haz clic en **"Review"** y luego **"Save policy"**

7. Repite el proceso para permitir INSERT, UPDATE y DELETE (para el panel de admin):
   - **Policy name:** `Enable all access for admin`
   - **Allowed operation:** ALL
   - **Target roles:** `anon`
   - **Policy definition:** true

## Paso 5: Obtener las credenciales

1. Ve a **"Settings"** (⚙️) en el menú lateral
2. Haz clic en **"API"**
3. Copia los siguientes valores:

### URL del Proyecto
```
https://xxxxxxxxxxxxx.supabase.co
```

### Clave Anónima (anon key)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Paso 6: Configurar las variables de entorno

1. Abre el archivo `.env.local` en tu proyecto
2. Reemplaza los valores:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Guarda el archivo

## Paso 7: Reiniciar el servidor de desarrollo

1. Detén el servidor actual (Ctrl+C)
2. Ejecuta de nuevo:
```bash
npm run dev
```

## Paso 8: Verificar la conexión

1. Abre tu aplicación en el navegador
2. Los productos deberían cargarse desde Supabase
3. Accede al panel de admin: `http://localhost:3000/?admin=bajoneras2026`
4. Haz un cambio y guárdalo
5. Recarga la página - los cambios deberían persistir

## 🎯 Configuración en Vercel (Producción)

Cuando despliegues a Vercel, debes agregar las variables de entorno:

1. Ve a tu proyecto en Vercel
2. Settings > Environment Variables
3. Agrega:
   - `VITE_SUPABASE_URL` = tu URL de Supabase
   - `VITE_SUPABASE_ANON_KEY` = tu clave anónima
4. Redeploy el proyecto

## ⚠️ Importante

- **NO compartas** tu archivo `.env.local` en Git
- El archivo `.env.local` ya está en `.gitignore`
- Guarda tu contraseña de base de datos en un lugar seguro
- Las claves anónimas (anon key) son seguras para usar en el frontend

## 🔒 Seguridad (Opcional - Avanzado)

Para mayor seguridad, puedes:
1. Habilitar RLS (Row Level Security)
2. Crear políticas más restrictivas
3. Usar autenticación de usuarios en el panel de admin

---

✅ ¡Listo! Ahora tu aplicación usa Supabase y todos los cambios que hagas en el panel de admin se verán para todos los clientes en tiempo real.
