
import { Product } from './types';

export const SHOP_SETTINGS = {
  name: "Bajoneras Burger",
  whatsappNumber: "5491112345678", // Reemplazar con el número real
  currency: "$",
  deliveryFee: 0,
  freeDeliveryText: "ENVÍO GRATIS",
  // Logo personalizado
  logoUrl: "./mer.jfif" 
};

export const PRODUCTS: Product[] = [
  // ====================================================================
  // PARA CAMBIAR UN PRODUCTO:
  // 1. "image": Reemplaza la URL con tu imagen (puede ser URL online o "./tu-imagen.jpg")
  // 2. "price": Cambia el número por el precio que quieras (sin puntos ni comas)
  // 3. "name": El nombre del producto
  // 4. "description": La descripción del producto
  // ====================================================================
  {
    id: "combo-viernes",
    name: "COMBO BAJONERO (VIERNES)",
    description: "Smash Simple con Doble Cheddar + Papas Fritas + Lata de Coca + Chocotorta. ¡El mejor inicio del finde!",
    price: 20000, // ← CAMBIA EL PRECIO AQUÍ (solo número, sin puntos ni comas)
    image: "https://images.unsplash.com/photo-1610614819513-58e34989848b?q=80&w=2070&auto=format&fit=crop", // ← CAMBIA LA IMAGEN AQUÍ
    category: "Combos",
    isPromo: true
  },
  {
    id: "combo-duo-share",
    name: "DÚO BAJONERO SHARE",
    description: "2 Burgers Dobles (a elección) con Papas + 1 Chocotorta Grande para compartir + 2 Latas de Coca. ¡Un festín para dos!",
    price: 32000, // ← CAMBIA EL PRECIO AQUÍ
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1965&auto=format&fit=crop", // ← CAMBIA LA IMAGEN AQUÍ
    category: "Combos",
    isPopular: true
  },
  {
    id: "combo-individual-premium",
    name: "INDIVIDUAL PREMIUM",
    description: "1 Burger Doble con Papas + 1 Chocotorta Individual + 1 Lata de Coca. El bajón solitario definitivo.",
    price: 19500, // ← CAMBIA EL PRECIO AQUÍ
    image: "https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?q=80&w=1887&auto=format&fit=crop", // ← CAMBIA LA IMAGEN AQUÍ
    category: "Combos"
  },
  {
    id: "burger-supermeel",
    name: "SUPERMEEL",
    description: "La joya de la casa. Triple medallón smash, triple cheddar, cebolla crispy, pepinos y nuestra salsa secreta Supermeel. Viene con papas fritas.",
    price: 19000, // ← CAMBIA EL PRECIO AQUÍ
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=1760&auto=format&fit=crop", // ← CAMBIA LA IMAGEN AQUÍ
    category: "Burgers",
    isPopular: true,
    // ====================================================================
    // EXTRAS DISPONIBLES PARA ESTE PRODUCTO:
    // - Puedes AGREGAR nuevos extras copiando el formato: { id: "extra-nombre", name: "NOMBRE DEL EXTRA", price: 1000 }
    // - Puedes ELIMINAR extras borrando toda la línea completa
    // - Puedes CAMBIAR EL PRECIO modificando el número después de "price:"
    // - Puedes CAMBIAR EL NOMBRE modificando el texto después de "name:"
    // ====================================================================
    extras: [
      { id: "extra-bacon", name: "Bacon Extra", price: 1500 },              // ← CAMBIAR PRECIO AQUÍ
      { id: "extra-cheddar", name: "Doble Cheddar", price: 1000 },          // ← CAMBIAR PRECIO AQUÍ
      { id: "extra-huevo", name: "Huevo Frito", price: 800 },               // ← CAMBIAR PRECIO AQUÍ
      { id: "extra-cebolla-caramelizada", name: "Cebolla Caramelizada", price: 700 }  // ← CAMBIAR PRECIO AQUÍ
    ]
  },
  {
    id: "burger-baconsmash",
    name: "BACONSMASH",
    description: "Doble medallón de carne premium, extra cheddar fundido y lluvia de bacon crocante caramelizado. Un clásico infalible. Viene con papas fritas.",
    price: 17500, // ← CAMBIA EL PRECIO AQUÍ
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2071&auto=format&fit=crop", // ← CAMBIA LA IMAGEN AQUÍ
    category: "Burgers",
    // ====================================================================
    // EXTRAS: Agregar, eliminar o modificar extras para BACONSMASH
    // ====================================================================
    extras: [
      { id: "extra-bacon", name: "Bacon Extra", price: 1500 },              // ← CAMBIAR PRECIO AQUÍ
      { id: "extra-cheddar", name: "Doble Cheddar", price: 1000 },          // ← CAMBIAR PRECIO AQUÍ
      { id: "extra-pepinos", name: "Pepinos Encurtidos", price: 500 },      // ← CAMBIAR PRECIO AQUÍ
      { id: "extra-jalapeños", name: "Jalapeños", price: 600 }              // ← CAMBIAR PRECIO AQUÍ
    ]
  },
  {
    id: "burger-oklahoma",
    name: "OKLAHOMA",
    description: "El estilo clásico: Doble medallón smash con cebolla finamente cortada e integrada en la carne durante la cocción. Mucho cheddar y sabor real. Viene con papas fritas.",
    price: 16500, // ← CAMBIA EL PRECIO AQUÍ
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=2072&auto=format&fit=crop", // ← CAMBIA LA IMAGEN AQUÍ
    category: "Burgers",
    // ====================================================================
    // EXTRAS: Agregar, eliminar o modificar extras para OKLAHOMA
    // ====================================================================
    extras: [
      { id: "extra-bacon", name: "Bacon Extra", price: 1500 },              // ← CAMBIAR PRECIO AQUÍ
      { id: "extra-cheddar", name: "Doble Cheddar", price: 1000 },          // ← CAMBIAR PRECIO AQUÍ
      { id: "extra-huevo", name: "Huevo Frito", price: 800 }                // ← CAMBIAR PRECIO AQUÍ
    ]
  },
  {
    id: "cheese-doble",
    name: "CHEESEBURGER DOBLE",
    description: "2 medallones de 110g de carne smasheados con 4 fetas de queso cheddar y nuestra salsa especial. Viene con papas fritas.",
    price: 15000, // ← CAMBIA EL PRECIO AQUÍ
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop", // ← CAMBIA LA IMAGEN AQUÍ
    category: "Burgers",
    // ====================================================================
    // EXTRAS: Agregar, eliminar o modificar extras para CHEESEBURGER DOBLE
    // ====================================================================
    extras: [
      { id: "extra-bacon", name: "Bacon Extra", price: 1500 },              // ← CAMBIAR PRECIO AQUÍ
      { id: "extra-cheddar", name: "Doble Cheddar", price: 1000 },          // ← CAMBIAR PRECIO AQUÍ
      { id: "extra-tomate", name: "Tomate Fresco", price: 400 },            // ← CAMBIAR PRECIO AQUÍ
      { id: "extra-lechuga", name: "Lechuga Crispy", price: 400 }           // ← CAMBIAR PRECIO AQUÍ
    ]
  },
  {
    id: "chocotorta-share",
    name: "CHOCOTORTA SHARE (COMPARTIR)",
    description: "Nuestra clásica Chocotorta en version XXL. Pisos infinitos de galletitas, mucho dulce de leche y queso crema. ¡Ideal para 2 o 3 personas!",
    price: 8500, // ← CAMBIA EL PRECIO AQUÍ
    image: "https://images.unsplash.com/photo-1579306194872-64d3b7bac4c2?q=80&w=2070&auto=format&fit=crop", // ← CAMBIA LA IMAGEN AQUÍ
    category: "Postres",
    isPopular: true
  },
  {
    id: "chocotorta-ind",
    name: "CHOCOTORTA INDIVIDUAL",
    description: "Pisos de Chocolinas humedecidos en café con la deliciosa mezcla de dulce de leche y queso crema.",
    price: 4500, // ← CAMBIA EL PRECIO AQUÍ
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1887&auto=format&fit=crop", // ← CAMBIA LA IMAGEN AQUÍ
    category: "Postres"
  },
  {
    id: "coca-lata",
    name: "COCA COLA LATA",
    description: "Sabor original de 354ml - Refrescante, con hielo y bien helada.",
    price: 2500, // ← CAMBIA EL PRECIO AQUÍ
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?q=80&w=1965&auto=format&fit=crop", // ← CAMBIA LA IMAGEN AQUÍ
    category: "Bebidas"
  },
  {
    id: "fanta-lata",
    name: "FANTA LATA",
    description: "Sabor naranja intenso de 354ml - Refrescante y bien helada.",
    price: 2500, // ← CAMBIA EL PRECIO AQUÍ
    image: "https://images.unsplash.com/photo-1624517452488-04869289c4ca?q=80&w=2005&auto=format&fit=crop", // ← CAMBIA LA IMAGEN AQUÍ
    category: "Bebidas"
  },
  {
    id: "sprite-lata",
    name: "SPRITE LATA",
    description: "Lima-limón refrescante de 354ml - Refrescante y bien helada.",
    price: 2500, // ← CAMBIA EL PRECIO AQUÍ
    image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?q=80&w=1887&auto=format&fit=crop", // ← CAMBIA LA IMAGEN AQUÍ
    category: "Bebidas"
  }
];
