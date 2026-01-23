
import { Product } from './types';

export const SHOP_SETTINGS = {
  name: "Bajoneras Burger",
  whatsappNumber: "541128422773", // +54 11 2842-2773
  instagramHandle: "bajoneras.burgeer", // Usuario de Instagram
  currency: "$",
  deliveryFee: 0,
  freeDeliveryText: "ENVÍO GRATIS",
  // Logo personalizado - Debe estar en la carpeta "public"
  logoUrl: "/mer.jfif",
  // Horarios de atención
  schedule: "Viernes, Sábado y Domingo de 20:00 a 00:00",
  // Zona de delivery
  deliveryZones: "Morón, Castelar, Haedo, Castillo"
};

export const PRODUCTS: Product[] = [
  {
    id: "combo-bajonero-individual",
    name: "COMBO BAJONERO INDIVIDUAL",
    description: "Cualquier hamburguesa a elección + Papas Fritas + Chocotorta Individual. ¡El bajón perfecto!",
    price: 16000,
    image: "/combos/geminigeneratedimagebou6wnbou6wnbou6-1769127666231.png",
    category: "Combos",
    isPopular: true,
    isCombo: true
  },
  {
    id: "combo-bajonero-compartir",
    name: "COMBO BAJONERO PARA COMPARTIR",
    description: "2 Hamburguesas a elección + Papas Fritas + Chocotorta para Compartir. ¡Un festín para dos!",
    price: 30000,
    image: "/combos/geminigeneratedimage2h4nmw2h4nmw2h4n-1769127084777.png",
    category: "Combos",
    isCombo: true
  },
  {
    id: "burger-doble-bacon",
    name: "DOBLE BACON",
    description: "Doble carne (240g), 4 fetas de cheddar y 4 tiras de bacon crocante en pan de papa dorado en manteca.",
    price: 14000,
    image: "/burgers/doble_bacon.jpg",
    category: "Burgers",
    isPopular: true,
    extras: [
      { id: "extra-bacon", name: "Bacon Extra", price: 1500 },
      { id: "extra-cheddar", name: "Queso Cheddar", price: 1500 },
      { id: "extra-medallon-120", name: "Medallón 120 g", price: 3000 },
      { id: "extra-cheddar-bacon-papas", name: "Cheddar y Bacon en Papas", price: 4000 },
      { id: "extra-huevo", name: "Huevo Frito", price: 1000 }
    ]
  },
  {
    id: "burger-super-mell",
    name: "SUPER MELL",
    description: "La joya de la casa. Triple medallón smash, triple cheddar, cebolla crispy y nuestra salsa secreta.",
    price: 14000,
    image: "/burgers/Super_Mell.jpg",
    category: "Burgers",
    isPopular: true,
    extras: [
      { id: "extra-bacon", name: "Bacon Extra", price: 1500 },
      { id: "extra-cheddar", name: "Queso Cheddar", price: 1500 },
      { id: "extra-medallon-120", name: "Medallón 120 g", price: 3000 },
      { id: "extra-cheddar-bacon-papas", name: "Cheddar y Bacon en Papas", price: 4000 },
      { id: "extra-huevo", name: "Huevo Frito", price: 1000 }
    ]
  },
  {
    id: "burger-oklahoma",
    name: "OKLAHOMA",
    description: "El estilo clásico: Doble medallón smash con cebolla finamente cortada e integrada en la carne. Mucho cheddar y sabor real.",
    price: 14000,
    image: "/burgers/Oklajoma.jpg",
    category: "Burgers",
    extras: [
      { id: "extra-bacon", name: "Bacon Extra", price: 1500 },
      { id: "extra-cheddar", name: "Queso Cheddar", price: 1500 },
      { id: "extra-medallon-120", name: "Medallón 120 g", price: 3000 },
      { id: "extra-cheddar-bacon-papas", name: "Cheddar y Bacon en Papas", price: 4000 },
      { id: "extra-huevo", name: "Huevo Frito", price: 1000 }
    ]
  },
  {
    id: "chocotorta-grande",
    name: "CHOCOTORTA GRANDE",
    description: "Nuestra clásica Chocotorta XXL. Capas infinitas de galletitas, dulce de leche y queso crema. ¡Perfecta para compartir!",
    price: 7000,
    image: "/postres/chocotorta-grande.jpg",
    category: "Postres",
    isPopular: true
  },
  {
    id: "chocotorta-chica",
    name: "CHOCOTORTA CHICA",
    description: "Nuestra deliciosa Chocotorta en porción individual. Capas de galletitas, dulce de leche y queso crema. ¡Para disfrutar solo!",
    price: 4000,
    image: "/postres/chocotorta-chica.png",
    category: "Postres"
  }
];
