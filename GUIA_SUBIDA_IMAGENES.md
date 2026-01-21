# 🚀 Sistema de Subida Automática de Imágenes

## ✅ ¡Problema Resuelto!

Ahora el dueño del negocio puede **arrastrar o seleccionar imágenes directamente desde su PC** y se guardarán automáticamente en la carpeta correcta.

---

## 📋 Instrucciones de Uso

### 🔧 Iniciar la Aplicación

**IMPORTANTE:** Ahora debes usar este comando en lugar de `npm run dev`:

```bash
npm start
```

Este comando inicia:
- ✅ El servidor web (Vite) en `http://localhost:3001`
- ✅ El servidor de subida de imágenes en `http://localhost:3002`

### 📸 Cómo Agregar Imágenes (Súper Fácil)

1. **Abre el Panel Admin**
   - Scroll al footer → Click en ⚙️
   - Contraseña: `burger2024`

2. **Edita un Producto**
   - Click en el botón de editar (lápiz azul)

3. **Arrastra o Selecciona la Imagen**
   - Arrastra tu imagen a la zona indicada
   - O haz click para seleccionar desde tu PC
   - ✅ La imagen se sube automáticamente
   - ✅ Se guarda en `public/combos/` o `public/burgers/` según el producto

4. **Guarda los Cambios**
   - Click en "GUARDAR CAMBIOS"
   - ¡Listo! La imagen es ahora permanente

---

## 🔍 Cómo Funciona

### Flujo Automático:

```
1. Usuario arrastra imagen
   ↓
2. Se valida el tamaño (máx 5MB)
   ↓
3. Se sube al servidor (localhost:3002)
   ↓
4. Se guarda en public/[categoría]/[nombre-imagen].jpg
   ↓
5. Se genera la URL: /combos/nombre-imagen.jpg
   ↓
6. Se actualiza automáticamente el producto
   ↓
7. Usuario presiona "GUARDAR CAMBIOS"
   ↓
8. ✅ Los datos se guardan en localStorage (permanente)
```

---

## 📁 Archivos Creados/Modificados

### Nuevos Archivos:
- **server.js** - Servidor Node.js para subir imágenes
- **public/combos/** - Carpeta para imágenes de combos (creada)

### Archivos Modificados:
- **package.json** - Agregado script `npm start`
- **AdminPanel.tsx** - Sistema de subida automática
- **App.tsx** - Persistencia con localStorage

### Dependencias Instaladas:
- `express` - Servidor web
- `multer` - Manejo de archivos
- `cors` - Permitir peticiones del frontend
- `concurrently` - Ejecutar múltiples procesos

---

## ⚙️ Características del Sistema

### ✅ Validaciones Automáticas:
- Máximo 5MB por imagen
- Solo formatos: JPG, PNG, WEBP, GIF
- Nombres de archivo limpios (sin espacios, caracteres especiales)
- Prevención de duplicados (timestamp en el nombre)

### ✅ Organización Automática:
- **Combos** → `public/combos/`
- **Burgers** → `public/burgers/`
- **Postres** → `public/postres/`

### ✅ Sin Problemas de Almacenamiento:
- Las imágenes se guardan como archivos (no base64)
- localStorage solo guarda la URL (muy ligero)
- Persistencia total sin límites

---

## 🆘 Solución de Problemas

### ❌ Error: "Error al subir la imagen"
**Causa:** El servidor no está corriendo
**Solución:** Usa `npm start` en lugar de `npm run dev`

### ❌ Error: "La imagen es demasiado grande"
**Causa:** La imagen supera los 5MB
**Solución:** Comprime la imagen antes de subirla
- Online: https://tinypng.com o https://squoosh.app
- Windows: Abre la imagen → "Guardar como" → Reducir calidad

### ❌ La imagen no se ve
**Causa:** No presionaste "GUARDAR CAMBIOS"
**Solución:** Después de subir la imagen, click en "GUARDAR CAMBIOS"

---

## 🎯 Ventajas del Nuevo Sistema

✅ **Fácil de usar** - Solo arrastrar y soltar
✅ **Automático** - No copiar archivos manualmente  
✅ **Organizado** - Carpetas por categoría
✅ **Sin límites** - No usa localStorage para imágenes
✅ **Persistente** - Los cambios son permanentes
✅ **Profesional** - Manejo de errores completo

---

## 🚀 Comandos Importantes

```bash
# Iniciar la aplicación (USAR ESTE)
npm start

# Solo servidor web (NO recomendado)
npm run dev

# Solo servidor de imágenes
npm run server

# Construir para producción
npm run build
```

---

**¡Listo!** Ahora el sistema es totalmente automático y fácil de usar para el dueño del negocio. 🎉
