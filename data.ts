
import { Product } from './types';

export const SHOP_SETTINGS = {
  name: "Bajoneras Burger",
  whatsappNumber: "5491154661480", // Reemplazar con el número real
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
    image: "/combos/combo-bajonero-individual.png",
    category: "Combos",
    isPopular: true,
    isCombo: true
  },
  {
    id: "combo-bajonero-compartir",
    name: "COMBO BAJONERO PARA COMPARTIR",
    description: "2 Hamburguesas a elección + Papas Fritas + Chocotorta para Compartir. ¡Un festín para dos!",
    price: 30000,
    image: "/combos/combo-bajonero-compartir.png",
    category: "Combos",
    isCombo: true
  },
  {
    id: "burger-doble-bacon",
    name: "DOBLE BACON",
    description: "Doble medallón smash con bacon crocante caramelizado y cheddar fundido. Un clásico infalible.",
    price: 14000,
    image: "/burgers/doble_bacon.jpg",
    category: "Burgers",
    isPopular: true,
    extras: [
      { id: "extra-bacon", name: "Bacon Extra", price: 1500 },
      { id: "extra-cheddar", name: "Doble Cheddar", price: 1000 },
      { id: "extra-huevo", name: "Huevo Frito", price: 800 }
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
      { id: "extra-cheddar", name: "Doble Cheddar", price: 1000 },
      { id: "extra-cebolla-caramelizada", name: "Cebolla Caramelizada", price: 700 }
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
      { id: "extra-cheddar", name: "Doble Cheddar", price: 1000 },
      { id: "extra-huevo", name: "Huevo Frito", price: 800 }
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
