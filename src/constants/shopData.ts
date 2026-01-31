
import { Product } from '../types';

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
    image: "/combos/comboindividualul-1769139267385.png",
    category: "Combos",
    isPopular: true,
    isCombo: true
  },
  {
    id: "combo-bajonero-compartir",
    name: "COMBO BAJONERO PARA COMPARTIR",
    description: "2 Hamburguesas a elección + Papas Fritas + Chocotorta para Compartir. ¡Un festín para dos!",
    price: 30000,
    image: "/combos/combox2ultimo-1769139297872.png",
    category: "Combos",
    isCombo: true
  },
  {
    id: "burger-doble-bacon",
    name: "DOBLE BACON",
    description: "Doble carne (240g), 4 fetas de cheddar y 4 tiras de bacon crocante en pan de papa dorado en manteca.",
    price: 14000,
    image: "/burgers/doblebaconultimo-1769139529253.png",
    category: "Burgers",
    isPopular: true,
    extras: [
      { id: "extra-doble-cheddar", name: "Doble Cheddar", price: 1500 },
      { id: "extra-doble-bacon", name: "Doble Bacon", price: 1500 },
      { id: "extra-cheddar-papas", name: "Cheddar en Papas", price: 2000 },
      { id: "extra-bacon-papas", name: "Bacon en Papas", price: 2000 },
      { id: "extra-cheddar-bacon-papas", name: "Cheddar y Bacon en Papas", price: 3000 },
      { id: "extra-medallon", name: "Medallón Extra 120g", price: 3000 }
    ]
  },
  {
    id: "burger-super-mell",
    name: "CHEESEBURGER",
    description: "Doble carne (240g), 4 fetas de cheddar y extra salsa cheddar en pan de papa dorado en manteca.",
    price: 14000,
    image: "/burgers/supermellul-1769139391647.png",
    category: "Burgers",
    isPopular: true,
    extras: [
      { id: "extra-doble-cheddar", name: "Doble Cheddar", price: 1500 },
      { id: "extra-doble-bacon", name: "Doble Bacon", price: 1500 },
      { id: "extra-cheddar-papas", name: "Cheddar en Papas", price: 2000 },
      { id: "extra-bacon-papas", name: "Bacon en Papas", price: 2000 },
      { id: "extra-cheddar-bacon-papas", name: "Cheddar y Bacon en Papas", price: 3000 },
      { id: "extra-medallon", name: "Medallón Extra 120g", price: 3000 }
    ]
  },
  {
    id: "burger-oklahoma",
    name: "OKLAHOMA",
    description: "Doble carne (240g) smasheada con cebolla, 4 fetas de cheddar y salsa cheddar en pan de papa dorado.",
    price: 14000,
    image: "/burgers/oklajomaul-1769139419558.png",
    category: "Burgers",
    extras: [
      { id: "extra-doble-cheddar", name: "Doble Cheddar", price: 1500 },
      { id: "extra-doble-bacon", name: "Doble Bacon", price: 1500 },
      { id: "extra-cheddar-papas", name: "Cheddar en Papas", price: 2000 },
      { id: "extra-bacon-papas", name: "Bacon en Papas", price: 2000 },
      { id: "extra-cheddar-bacon-papas", name: "Cheddar y Bacon en Papas", price: 3000 },
      { id: "extra-medallon", name: "Medallón Extra 120g", price: 3000 }
    ]
  },
  {
    id: "chocotorta-grande",
    name: "CHOCOTORTA GRANDE",
    description: "Nuestra clásica Chocotorta XXL. Capas infinitas de galletitas, dulce de leche y queso crema. ¡Perfecta para compartir!",
    price: 7000,
    image: "/postres/chocograndeul-1769139461931.png",
    category: "Postres",
    isPopular: true
  },
  {
    id: "chocotorta-chica",
    name: "CHOCOTORTA CHICA",
    description: "Nuestra deliciosa Chocotorta en porción individual. Capas de galletitas, dulce de leche y queso crema. ¡Para disfrutar solo!",
    price: 4000,
    image: "/postres/chocochicaul-1769139502516.png",
    category: "Postres"
  }
];
