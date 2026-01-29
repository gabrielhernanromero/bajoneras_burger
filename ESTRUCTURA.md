# 📁 Estructura del Proyecto - Bajoneras Burger

Esta es la estructura organizada y profesional del proyecto.

## 🏗️ Árbol de Directorios

```
bajoneras-burger/
│
├── 📂 src/                           # Código fuente modular
│   ├── 📂 components/               # Componentes React
│   │   ├── 📂 ui/                  # Componentes UI reutilizables
│   │   │   ├── Badge.tsx           # Etiquetas (Popular, Promo)
│   │   │   ├── Button.tsx          # Botón reutilizable con variantes
│   │   │   ├── Modal.tsx           # Contenedor modal genérico
│   │   │   ├── ProductCard.tsx     # Tarjeta de producto
│   │   │   ├── SectionHeading.tsx  # Títulos de sección
│   │   │   └── index.ts            # Barrel export
│   │   │
│   │   ├── 📂 modals/              # Modales especializados
│   │   │   ├── CustomizationModal.tsx     # Modal de personalización
│   │   │   ├── ComboCustomizationModal.tsx # Modal de combos
│   │   │   └── index.ts            # Barrel export
│   │   │
│   │   └── 📂 admin/               # Panel de administración
│   │       ├── AdminPanel.tsx      # Componente principal del admin
│   │       └── index.ts            # Barrel export
│   │
│   ├── 📂 hooks/                    # Custom hooks
│   │   ├── useCart.ts              # Lógica del carrito
│   │   ├── useProducts.ts          # Lógica de productos
│   │   ├── useModal.ts             # Lógica de modales
│   │   └── index.ts                # Barrel export
│   │
│   ├── 📂 services/                 # Servicios externos
│   │   ├── supabaseService.ts      # Conexión a Supabase
│   │   ├── whatsappService.ts      # Lógica de WhatsApp
│   │   └── index.ts                # Barrel export
│   │
│   ├── 📂 utils/                    # Utilidades y helpers
│   │   ├── imageUtils.ts           # Compresión de imágenes
│   │   ├── formatters.ts           # Formateadores (precios, teléfonos)
│   │   ├── validators.ts           # Validaciones
│   │   └── index.ts                # Barrel export
│   │
│   ├── 📂 constants/                # Constantes y configuración
│   │   ├── shopData.ts             # Datos de la tienda y productos
│   │   └── index.ts                # Barrel export
│   │
│   ├── 📂 types/                    # TypeScript definitions
│   │   └── index.ts                # Tipos (Product, CartItem, etc)
│   │
│   └── App.tsx                      # Componente principal (300 líneas)
│
├── 📂 public/                       # Archivos estáticos públicos
│   ├── mer.jfif                    # Logo de la tienda
│   ├── 📂 burgers/                 # Imágenes de hamburguesas
│   ├── 📂 combos/                  # Imágenes de combos
│   │   └── README.md               # Info sobre combos
│   └── 📂 postres/                 # Imágenes de postres
│
├── 📂 config/                       # Archivos de configuración
│   ├── tsconfig.json               # Configuración TypeScript
│   ├── vite.config.ts              # Configuración Vite
│   └── vite-env.d.ts               # Tipos de entorno Vite
│
├── 📂 docs/                         # Documentación
│   ├── ESTRUCTURA_MODULAR.md       # Arquitectura del proyecto
│   ├── GUIA_MIGRACION.md           # Guía de migración
│   ├── GUIA_SUPABASE.md            # Setup de Supabase
│   ├── GUIA_SUBIDA_IMAGENES.md     # Manejo de imágenes
│   ├── REFACTORIZACION_COMPLETADA.md # Detalles técnicos
│   ├── INSTRUCCIONES_FINALES.md    # Instrucciones de uso
│   ├── README_RESUMEN.md           # Resumen ejecutivo
│   └── CHANGELOG.md                # Historial de cambios
│
├── 📂 backups/                      # Archivos de respaldo
│   ├── AdminPanel.tsx.backup       # Backup del AdminPanel original
│   ├── App.tsx.backup              # Backup del App original
│   └── README.old.md               # Backup del README anterior
│
├── 📂 assets/                       # Assets del proyecto
│   └── 📂 temp-images/             # Imágenes temporales
│       ├── Super_mel_smasheada.png
│       ├── chocotorta_chica_llena.png
│       ├── chocotorta_grande_llena.png
│       ├── doble_bacon_smasheada.jpg
│       ├── oklajoma_smasheada.jpg
│       └── mer.jfif
│
├── 📂 dist/                         # Build de producción (generado)
│
├── 📂 node_modules/                 # Dependencias (generado)
│
├── 📄 index.html                    # HTML principal
├── 📄 index.tsx                     # Entry point de React
├── 📄 package.json                  # Dependencias y scripts
├── 📄 package-lock.json             # Lock de dependencias
├── 📄 server.js                     # Servidor Express (opcional)
├── 📄 metadata.json                 # Metadata del proyecto
├── 📄 .env                          # Variables de entorno (no en Git)
├── 📄 .gitignore                    # Archivos ignorados por Git
├── 📄 README.md                     # Documentación principal
└── 📄 ESTRUCTURA.md                 # Este archivo

# Enlaces simbólicos (apuntan a config/)
tsconfig.json -> config/tsconfig.json
vite.config.ts -> config/vite.config.ts
vite-env.d.ts -> config/vite-env.d.ts
```

## 📊 Estadísticas del Proyecto

- **Líneas de código**: ~3,000 (reducido de ~5,000)
- **Componentes**: 8 componentes reutilizables
- **Hooks personalizados**: 3 hooks
- **Servicios**: 2 servicios
- **Utilidades**: 12 funciones
- **Archivos TypeScript**: 25+
- **Archivos de documentación**: 8

## 🎯 Principios de Organización

### 1. Separación por Responsabilidad
Cada carpeta tiene una responsabilidad clara:
- `components/` - Solo componentes visuales
- `hooks/` - Solo lógica reutilizable
- `services/` - Solo integraciones externas
- `utils/` - Solo funciones puras

### 2. Barrel Exports
Cada carpeta tiene un `index.ts` para exportaciones limpias:
```typescript
import { Button, Badge } from '@components/ui';
```

### 3. Path Aliases
Configurados en `tsconfig.json` y `vite.config.ts`:
```typescript
@components/* → src/components/*
@hooks/* → src/hooks/*
@utils/* → src/utils/*
@services/* → src/services/*
@constants/* → src/constants/*
@types/* → src/types/*
```

### 4. Co-location
Archivos relacionados están juntos:
- Componentes UI en `components/ui/`
- Modales en `components/modals/`
- Admin en `components/admin/`

### 5. Configuración Centralizada
Todos los archivos de config en `config/` con symlinks en raíz

## 🔍 Navegación Rápida

### Agregar un Componente UI
```
src/components/ui/NuevoComponente.tsx
src/components/ui/index.ts (agregar export)
```

### Agregar un Hook
```
src/hooks/useNuevoHook.ts
src/hooks/index.ts (agregar export)
```

### Agregar una Utilidad
```
src/utils/nuevaUtilidad.ts
src/utils/index.ts (agregar export)
```

### Modificar Productos
```
src/constants/shopData.ts
O usar el panel admin
```

## 📝 Notas

- Los archivos en `config/` están enlazados simbólicamente en la raíz
- Los archivos en `backups/` son versiones anteriores del código
- Los archivos en `assets/temp-images/` son imágenes temporales (pueden moverse a public/)
- La carpeta `dist/` se genera automáticamente con `npm run build`
- La carpeta `node_modules/` se genera con `npm install`

## 🚀 Próximos Pasos Sugeridos

1. Mover imágenes de `assets/temp-images/` a `public/burgers/` según corresponda
2. Eliminar `backups/` después de verificar que todo funciona
3. Agregar tests en `src/__tests__/`
4. Agregar Storybook para documentar componentes
5. Implementar CI/CD

---

**Última actualización**: 28 de enero de 2026  
**Versión**: 2.0 - Estructura Profesional Organizada
