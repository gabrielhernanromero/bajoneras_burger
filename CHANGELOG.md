# Changelog - Bajoneras Burger

## 21 de Enero de 2026 - Persistencia de Datos

### ✅ Mejoras Implementadas

#### 🔒 Persistencia Automática de Productos
- **Problema resuelto**: Los cambios realizados en el panel de administración (incluyendo fotos de combos individuales y grupales) ahora se guardan de forma persistente.
- **Solución**: Implementación de `localStorage` para almacenar todos los cambios realizados en el panel admin.

#### � Cómo Agregar Imágenes (IMPORTANTE)

**⚠️ NO subas archivos de imagen grandes directamente - causará errores de almacenamiento**

**OPCIÓN 1: Guardar en el Proyecto (RECOMENDADO)**

1. **Copiar la imagen a la carpeta del proyecto:**
   ```
   public/
   ├── combos/
   │   └── mi-combo.jpg          ← Copia tu imagen aquí
   ├── burgers/
   │   └── mi-burger.jpg         ← O aquí según la categoría
   └── postres/
       └── mi-postre.jpg         ← O aquí
   ```

2. **En el panel admin, usar la URL local:**
   - Edita el producto
   - En el campo "O pega una URL" escribe: `/combos/mi-combo.jpg`
   - ¡Listo! La imagen se verá sin problemas de almacenamiento

**OPCIÓN 2: Usar Hosting Gratuito de Imágenes**

Si no quieres copiar archivos al proyecto, puedes subir tus imágenes a:

- **Imgur.com** (Recomendado)
  1. Ve a https://imgur.com
  2. Click en "New post" → Sube tu imagen
  3. Click derecho en la imagen → "Copiar dirección de imagen"
  4. Pega esa URL en el campo del panel admin

- **Postimages.org** (Sin cuenta necesaria)
  1. Ve a https://postimages.org
  2. Sube tu imagen
  3. Copia el "Direct link"
  4. Pega en el panel admin

- **ImgBB.com** (Rápido y fácil)
  1. Ve a https://imgbb.com
  2. Sube tu imagen
  3. Copia el link "Direct link"
  4. Pega en el panel admin

#### �📦 Características Nuevas

1. **Guardado Automático**
   - Cuando el dueño presiona "GUARDAR CAMBIOS" en el panel admin, los datos se guardan en localStorage
   - Los cambios son persistentes incluso al recargar la página
   - Incluye: precios, descripciones, nombres, imágenes (incluso base64), y todos los atributos de productos

2. **Carga Automática**
   - Al iniciar la aplicación, se cargan automáticamente los datos guardados en localStorage
   - Si no hay datos guardados, se usan los valores por defecto de `data.ts`

3. **Botón de Reset**
   - Nuevo botón "RESETEAR A ORIGINAL" en el panel admin
   - Permite volver a los valores originales de `data.ts`
   - Solicita confirmación antes de resetear

4. **Mensajes Mejorados**
   - Confirmación visual cuando los cambios se guardan exitosamente
   - Alertas de error si algo falla en el proceso de guardado

### 🎯 Cómo Usar

#### Para el Dueño del Negocio:

1. **Acceder al Panel Admin**
   - Hacer scroll hasta el footer
   - Click en el ícono de configuración (⚙️)
   - Ingresar contraseña: `burger2024`

2. **Editar Productos**
   - Click en el botón de editar (lápiz) de cualquier producto
   - Modificar: nombre, precio, descripción
   - **Para cambiar imagen**: 
     - Arrastrar y soltar una imagen en la zona indicada
     - O hacer click para seleccionar desde el explorador
     - O pegar una URL de imagen

3. **Guardar Cambios**
   - Click en "GUARDAR CAMBIOS" (botón amarillo)
   - Los datos se guardan automáticamente
   - ✅ Confirmación de guardado exitoso

4. **Resetear a Original**
   - Si necesitas volver a los datos originales
   - Click en "RESETEAR A ORIGINAL" (botón rojo)
   - Confirmar la acción

### 🔧 Detalles Técnicos

#### Archivos Modificados:

1. **App.tsx**
   - Inicialización de productos con localStorage
   - Función de guardado que persiste en localStorage
   - Manejo de errores mejorado

2. **AdminPanel.tsx**
   - Agregado import de `RotateCcw` de lucide-react
   - Nueva función `handleReset` para resetear productos
   - Nuevo botón de reset en la interfaz
   - Mensaje de guardado más claro

#### Almacenamiento:

- **Clave localStorage**: `bajoneras_products`
- **Formato**: JSON stringificado del array de productos
- **Persistencia**: Los datos persisten entre sesiones del navegador
- **Compatibilidad**: Funciona en todos los navegadores modernos

### ⚠️ Notas Importantes

1. **Límites de localStorage**:
   - Máximo ~5-10MB según el navegador
   - Las imágenes base64 pueden ser grandes
   - Recomendado: usar URLs de imágenes cuando sea posible

2. **Backup**:
   - El código JSON se puede copiar desde "VER CÓDIGO JSON"
   - Útil para hacer backup manual de los datos

3. **Sincronización**:
   - Los datos se guardan solo en el navegador local
   - No se sincronizan automáticamente entre dispositivos
   - Para sincronizar: copiar código JSON y aplicar en otro dispositivo

### 🎉 Beneficios

✅ Los cambios son permanentes  
✅ No se pierden al recargar la página  
✅ Fácil de usar para el dueño del negocio  
✅ Posibilidad de resetear si algo sale mal  
✅ Incluye imágenes (base64 o URLs)  
✅ Sin necesidad de editar código manualmente
