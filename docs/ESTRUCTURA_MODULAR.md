# Estructura Modular del Proyecto

## 📁 Estructura de Carpetas

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes de interfaz básicos
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── ProductCard.tsx
│   │   ├── SectionHeading.tsx
│   │   └── index.ts
│   ├── modals/         # Modales específicos
│   │   ├── CustomizationModal.tsx
│   │   ├── ComboCustomizationModal.tsx
│   │   └── index.ts
│   └── admin/          # Componentes del panel admin
│
├── hooks/              # Custom hooks
│   ├── useCart.ts      # Lógica del carrito
│   ├── useProducts.ts  # Lógica de productos
│   ├── useModal.ts     # Lógica de modales
│   └── index.ts
│
├── services/           # Servicios externos
│   ├── supabaseService.ts  # Conexión a Supabase
│   ├── whatsappService.ts  # Lógica de WhatsApp
│   └── index.ts
│
├── utils/              # Utilidades
│   ├── imageUtils.ts   # Compresión de imágenes
│   ├── formatters.ts   # Formateadores
│   ├── validators.ts   # Validaciones
│   └── index.ts
│
├── constants/          # Constantes
│   ├── shopData.ts     # Datos de la tienda
│   └── index.ts
│
└── types/              # Definiciones de tipos
    └── index.ts
```

## 🎯 Principios Aplicados

### 1. **Separación de Responsabilidades**
- Cada archivo tiene una única responsabilidad
- Componentes UI separados de la lógica de negocio
- Servicios independientes para cada API/función externa

### 2. **Reutilización de Código**
- Componentes genéricos (Button, Badge, Modal)
- Hooks personalizados para lógica compartida
- Utilidades comunes centralizadas

### 3. **Path Aliases**
```typescript
import { Button } from '@components/ui';
import { useCart } from '@hooks';
import { formatPrice } from '@utils';
import { SHOP_SETTINGS } from '@constants';
```

### 4. **Hooks Personalizados**

#### `useCart`
Maneja toda la lógica del carrito:
- Agregar/eliminar productos
- Actualizar cantidades
- Calcular totales
- Extras y combos

#### `useProducts`
Maneja la carga y actualización de productos:
- Carga desde Supabase
- Actualización de productos
- Estado de carga

#### `useModal`
Simplifica el manejo de estados de modales:
- Open/close/toggle
- Estado booleano limpio

### 5. **Servicios**

#### `WhatsAppService`
- Generación de mensajes
- Formato de pedidos
- Cálculo de totales
- Envío de órdenes

#### `supabaseService`
- Conexión a Supabase
- CRUD de productos
- Mapeo de campos

### 6. **Utilidades**

#### `imageUtils`
- Compresión de imágenes
- Conversión a base64
- Redimensionamiento

#### `formatters`
- Formato de precios
- Formato de teléfonos
- Truncado de textos

#### `validators`
- Validación de emails
- Validación de archivos
- Validación de tamaños

## 📦 Componentes Principales

### UI Components
- **Badge**: Etiquetas de productos (Popular, Promo)
- **Button**: Botón reutilizable con variantes
- **Modal**: Contenedor de modales genérico
- **ProductCard**: Tarjeta de producto consistente
- **SectionHeading**: Títulos de sección uniformes

### Modales
- **CustomizationModal**: Personalización de productos
- **ComboCustomizationModal**: Personalización de combos

## 🔧 Ventajas de esta Estructura

1. **Mantenibilidad**: Fácil encontrar y modificar código
2. **Escalabilidad**: Simple agregar nuevos features
3. **Testing**: Componentes y funciones aisladas son fáciles de testear
4. **Colaboración**: Estructura clara para múltiples desarrolladores
5. **Reutilización**: Componentes y lógica compartida entre features
6. **Performance**: Imports optimizados y code splitting

## 📝 Ejemplos de Uso

### Uso de Hooks
```typescript
const { cart, addToCart, getTotalPrice } = useCart();
const { products, loading } = useProducts();
const modal = useModal();
```

### Uso de Servicios
```typescript
const total = WhatsAppService.calculateTotal(cart);
const message = WhatsAppService.generateOrderMessage(cart, total, ...);
WhatsAppService.sendOrder(message);
```

### Uso de Utilidades
```typescript
const compressed = await compressImage(file, 1);
const price = formatPrice(15000); // "15.000"
const isValid = isValidEmail(email);
```

## 🚀 Próximos Pasos

1. Crear tests unitarios para hooks y utils
2. Agregar Storybook para documentar componentes
3. Implementar lazy loading de componentes
4. Agregar error boundaries
5. Implementar Context API para estado global si crece
