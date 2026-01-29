# 🍔 Bajoneras Burger - Menú Interactivo

> Sistema de menú digital profesional con carrito de compras y panel de administración

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)]()
[![React](https://img.shields.io/badge/React-19.2-61dafb)]()
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff)]()

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Scripts Disponibles](#-scripts-disponibles)
- [Configuración](#-configuración)
- [Documentación](#-documentación)

## ✨ Características

### Para Clientes
- 🛒 **Carrito de Compras Intuitivo** - Agrega, modifica y elimina productos fácilmente
- 🎨 **Personalización de Productos** - Extras, observaciones y combos personalizables
- 📱 **Responsive Design** - Perfecto en móviles, tablets y desktop
- 📲 **Pedidos por WhatsApp** - Envío directo con formato profesional
- 🏷️ **Filtros por Categoría** - Navegación rápida entre productos
- ⚡ **Performance Optimizado** - Carga rápida y animaciones suaves

### Para Administradores
- 🔐 **Panel de Administración Seguro** - Acceso protegido por contraseña
- ✏️ **Gestión de Productos** - CRUD completo (Crear, Leer, Actualizar, Eliminar)
- 🖼️ **Upload de Imágenes** - Integración con Supabase Storage
- 🗂️ **Gestión de Categorías** - Categorías dinámicas
- 💾 **Persistencia en la Nube** - Datos sincronizados con Supabase
- 🔄 **Actualización en Tiempo Real** - Cambios visibles al instante

## 🛠️ Tecnologías

### Frontend
- **React 19.2** - Biblioteca UI
- **TypeScript 5.8** - Tipado estático
- **Vite 6.2** - Build tool ultrarrápido
- **Tailwind CSS** - Estilos utilitarios
- **Lucide React** - Iconos modernos

### Backend/Base de Datos
- **Supabase** - Backend as a Service
- **Supabase Storage** - Almacenamiento de imágenes
- **PostgreSQL** - Base de datos

## 🚀 Instalación

### Prerequisitos
- Node.js >= 18.0.0
- npm >= 9.0.0

### Pasos

1. **Instalar dependencias**
```bash
npm install
```

2. **Configurar variables de entorno**

Crea un archivo `.env` con tus credenciales de Supabase:
```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

3. **Iniciar desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
bajoneras-burger/
├── src/                      # Código fuente modular
│   ├── components/          # Componentes React
│   │   ├── ui/             # Componentes UI reutilizables
│   │   ├── modals/         # Modales especializados
│   │   └── admin/          # Panel de administración
│   ├── hooks/              # Custom hooks (useCart, useProducts, useModal)
│   ├── services/           # Servicios (Supabase, WhatsApp)
│   ├── utils/              # Utilidades (formatters, validators, imageUtils)
│   ├── constants/          # Constantes y configuración
│   ├── types/              # TypeScript definitions
│   └── App.tsx             # Componente principal
├── public/                  # Archivos estáticos
│   ├── burgers/            # Imágenes de hamburguesas
│   ├── combos/             # Imágenes de combos
│   └── postres/            # Imágenes de postres
├── config/                  # Configuración (tsconfig, vite, etc)
├── docs/                    # Documentación completa
├── backups/                 # Archivos de respaldo
├── assets/                  # Assets del proyecto
│   └── temp-images/        # Imágenes temporales
├── dist/                    # Build de producción
└── package.json            # Dependencias
```

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo (puerto 3000)
npm run server       # Servidor Express
npm start            # Dev + Server concurrentemente

# Producción
npm run build        # Build optimizado para producción
npm run preview      # Preview del build
```

## ⚙️ Configuración

### Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Crea la tabla `Productos` (ver `docs/GUIA_SUPABASE.md`)
3. Crea un bucket público `product-images` en Storage
4. Configura las variables de entorno en `.env`

### WhatsApp

Edita el número en `src/constants/shopData.ts`:

```typescript
export const SHOP_SETTINGS = {
  whatsappNumber: "5491154661480", // Tu número
  // ...
};
```

### Panel Admin

- **URL**: Agrega `?admin=bajoneras2026` a tu URL
- **Contraseña**: Configurable en `src/components/admin/AdminPanel.tsx`
- **Default**: `burger2024`

## 📚 Documentación

Documentación completa en `/docs`:

| Documento | Descripción |
|-----------|-------------|
| [ESTRUCTURA_MODULAR.md](docs/ESTRUCTURA_MODULAR.md) | Arquitectura del código |
| [GUIA_MIGRACION.md](docs/GUIA_MIGRACION.md) | Migración y actualización |
| [GUIA_SUPABASE.md](docs/GUIA_SUPABASE.md) | Setup de Supabase |
| [GUIA_SUBIDA_IMAGENES.md](docs/GUIA_SUBIDA_IMAGENES.md) | Manejo de imágenes |
| [REFACTORIZACION_COMPLETADA.md](docs/REFACTORIZACION_COMPLETADA.md) | Detalles técnicos |
| [INSTRUCCIONES_FINALES.md](docs/INSTRUCCIONES_FINALES.md) | Guía de uso |

## 🎨 Personalización

### Cambiar Logo
Reemplaza `public/mer.jfif` con tu logo

### Modificar Productos
Usa el panel admin (`?admin=bajoneras2026`)

### Cambiar Estilos
Los colores principales:
- Primario: `yellow-400`
- Fondo: `neutral-950`
- Texto: `white`

## 🚀 Deploy

### Vercel (Recomendado)
```bash
vercel
```

### Build Manual
```bash
npm run build
# Los archivos estarán en /dist
```

## 🏗️ Arquitectura

El proyecto sigue una arquitectura modular profesional:

- **Componentes UI reutilizables** - Badge, Button, Modal, ProductCard
- **Hooks personalizados** - useCart, useProducts, useModal
- **Servicios** - WhatsAppService, supabaseService
- **Utilidades** - imageUtils, formatters, validators
- **Path Aliases** - Imports limpios con `@components`, `@hooks`, etc

Ver `docs/ESTRUCTURA_MODULAR.md` para más detalles.

## 📞 Soporte

**Bajoneras Burger**
- 📱 WhatsApp: +54 9 11 5466-1480
- 🕒 Horarios: Vie, Sáb y Dom de 20:00 a 00:00
- 📍 Zona: Morón, Castelar, Haedo, Castillo

---

⭐ **¡Hecho con amor y hamburguesas!** 🍔

**Versión**: 2.0 - Código Modularizado  
**Última actualización**: 28 de enero de 2026
