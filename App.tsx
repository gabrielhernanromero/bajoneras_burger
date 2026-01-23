
import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, Send, Plus, Minus, X, Menu, Phone, Instagram, Check, User, MapPin, Truck, Store, CreditCard, Banknote, Receipt, MessageSquare, Settings } from 'lucide-react';
import { PRODUCTS, SHOP_SETTINGS } from './data';
import { Product, CartItem, Category, Extra, ComboburgerSelection } from './types';
import AdminPanel from './AdminPanel';

// --- Helper Components ---

const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = "bg-yellow-400" }) => (
  <span className={`${color} text-black text-[10px] sm:text-[11px] font-bold px-2 sm:px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm whitespace-nowrap`}>
    {children}
  </span>
);

const SectionHeading: React.FC<{ title: string }> = ({ title }) => (
  <h2 className="font-bebas text-3xl sm:text-4xl md:text-5xl mb-6 sm:mb-8 tracking-wide border-l-4 sm:border-l-8 border-yellow-400 pl-4 sm:pl-6 uppercase italic">{title}</h2>
);

// --- Modal de Personalización ---
const CustomizationModal: React.FC<{
  product: Product;
  onClose: () => void;
  onConfirm: (extras: Extra[], notes: string) => void;
}> = ({ product, onClose, onConfirm }) => {
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);
  const [productNotes, setProductNotes] = useState('');

  const toggleExtra = (extra: Extra) => {
    setSelectedExtras(prev => {
      const exists = prev.find(e => e.id === extra.id);
      if (exists) {
        return prev.filter(e => e.id !== extra.id);
      } else {
        return [...prev, extra];
      }
    });
  };

  const totalExtrasPrice = selectedExtras.reduce((sum, e) => sum + e.price, 0);
  const totalPrice = product.price + totalExtrasPrice;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-neutral-900 rounded-[2rem] sm:rounded-[3rem] shadow-2xl animate-fade-in-up overflow-hidden border-2 border-yellow-400/30 my-8">
        {/* Header */}
        <div className="p-6 sm:p-8 md:p-10 border-b border-white/10 bg-gradient-to-br from-black to-neutral-900">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-bebas text-3xl sm:text-4xl md:text-5xl tracking-widest italic text-yellow-400 leading-none mb-2">
                PERSONALIZA TU PEDIDO
              </h3>
              <p className="text-neutral-400 text-sm sm:text-base font-bold uppercase tracking-wider">
                {product.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 sm:p-3 bg-neutral-800 hover:bg-yellow-400 hover:text-black rounded-xl sm:rounded-2xl transition-all hover:rotate-90 flex-shrink-0"
            >
              <X size={20} className="sm:hidden" />
              <X size={24} className="hidden sm:block" />
            </button>
          </div>
        </div>

        {/* Extras List */}
        <div className="p-6 sm:p-8 md:p-10 max-h-[40vh] sm:max-h-[45vh] overflow-y-auto space-y-3 sm:space-y-4">
          <p className="text-neutral-500 text-xs sm:text-sm font-bold uppercase tracking-widest mb-4 sm:mb-6">
            Selecciona tus extras
          </p>
          {product.extras && product.extras.length > 0 ? (
            product.extras.map(extra => {
              const isSelected = selectedExtras.some(e => e.id === extra.id);
              return (
                <button
                  key={extra.id}
                  onClick={() => toggleExtra(extra)}
                  className={`w-full p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-yellow-400 border-yellow-400 text-black shadow-lg scale-105'
                      : 'bg-neutral-800 border-white/10 hover:border-yellow-400/50 hover:bg-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                      isSelected ? 'bg-black border-black' : 'border-white/20 group-hover:border-yellow-400/50'
                    }`}>
                      {isSelected && <Check size={16} className="text-yellow-400 sm:w-[18px] sm:h-[18px]" />}
                    </div>
                    <span className="font-black text-base sm:text-lg md:text-xl uppercase tracking-wide">{extra.name}</span>
                  </div>
                  <span className={`font-black text-lg sm:text-xl md:text-2xl ${isSelected ? 'text-black' : 'text-yellow-400'}`}>
                    +${extra.price.toLocaleString()}
                  </span>
                </button>
              );
            })
          ) : (
            <p className="text-neutral-600 italic text-center py-8">No hay extras disponibles para este producto.</p>
          )}
          
          {/* Campo de observaciones */}
          <div className="pt-4 border-t border-white/10">
            <label className="flex items-center gap-2 text-white text-sm font-black mb-3 uppercase tracking-wide">
              <MessageSquare size={16} strokeWidth={3} />
              <span>Observaciones</span>
              <span className="text-neutral-500 text-xs normal-case font-normal">(Opcional)</span>
            </label>
            <div className="relative">
              <textarea
                value={productNotes}
                onChange={(e) => setProductNotes(e.target.value)}
                placeholder="Ej: Sin cebolla, sin tomate, bien cocida..."
                rows={2}
                maxLength={150}
                className="w-full bg-neutral-800 border-2 border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold placeholder:text-neutral-600 focus:border-yellow-400 focus:outline-none transition-all resize-none"
              />
              <div className="absolute bottom-2 right-3 text-xs text-neutral-600">
                {productNotes.length}/150
              </div>
            </div>
          </div>
        </div>

        {/* Footer con totales */}
        <div className="p-6 sm:p-8 md:p-10 bg-black border-t border-white/10 space-y-4 sm:space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">Precio Base</p>
              <p className="text-white font-black text-xl sm:text-2xl">${product.price.toLocaleString()}</p>
            </div>
            {totalExtrasPrice > 0 && (
              <div className="text-right">
                <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">Extras</p>
                <p className="text-yellow-400 font-black text-xl sm:text-2xl">+${totalExtrasPrice.toLocaleString()}</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center pt-3 sm:pt-4 border-t border-white/10">
            <p className="font-bebas text-2xl sm:text-3xl md:text-4xl tracking-widest italic">TOTAL</p>
            <p className="font-black text-3xl sm:text-4xl md:text-5xl text-yellow-400 italic">${totalPrice.toLocaleString()}</p>
          </div>

          <button
            onClick={() => onConfirm(selectedExtras, productNotes)}
            className="w-full bg-yellow-400 text-black py-5 sm:py-6 md:py-7 rounded-2xl sm:rounded-3xl font-black text-lg sm:text-xl md:text-2xl flex items-center justify-center gap-3 sm:gap-4 hover:bg-white transition-all active:scale-95 shadow-2xl uppercase tracking-wide"
          >
            <Plus size={24} className="sm:hidden" />
            <Plus size={28} className="hidden sm:block" />
            <span>AGREGAR AL CARRITO</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Modal de Personalización de Combos ---
const ComboCustomizationModal: React.FC<{
  combo: Product;
  onClose: () => void;
  onConfirm: (burgers: ComboburgerSelection[]) => void;
  products: Product[];
}> = ({ combo, onClose, onConfirm, products }) => {
  // Los combos "para compartir" permiten elegir dos hamburguesas
  const isShareCombo = combo.id.includes('compartir') || combo.name.toLowerCase().includes('compartir');
  const burgersCount = isShareCombo ? 2 : 1;
  const availableBurgers = products.filter(p => p.category === 'Burgers');
  
  const [selectedBurgers, setSelectedBurgers] = useState<ComboburgerSelection[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentBurgerSelection, setCurrentBurgerSelection] = useState<Product | null>(null);
  const [currentExtras, setCurrentExtras] = useState<Extra[]>([]);
  const [currentNotes, setCurrentNotes] = useState('');

  const toggleExtra = (extra: Extra) => {
    setCurrentExtras(prev => {
      const exists = prev.find(e => e.id === extra.id);
      if (exists) {
        return prev.filter(e => e.id !== extra.id);
      } else {
        return [...prev, extra];
      }
    });
  };

  const selectBurger = (burger: Product) => {
    setCurrentBurgerSelection(burger);
    setCurrentExtras([]);
    setCurrentNotes('');
  };

  const confirmCurrentBurger = () => {
    if (!currentBurgerSelection) return;
    
    const newSelection: ComboburgerSelection = {
      burger: currentBurgerSelection,
      extras: currentExtras,
      notes: currentNotes
    };
    
    setSelectedBurgers([...selectedBurgers, newSelection]);
    
    if (selectedBurgers.length + 1 < burgersCount) {
      setCurrentStep(currentStep + 1);
      setCurrentBurgerSelection(null);
      setCurrentExtras([]);
      setCurrentNotes('');
    } else {
      onConfirm([...selectedBurgers, newSelection]);
    }
  };

  const totalExtrasPrice = currentExtras.reduce((sum, e) => sum + e.price, 0);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose}></div>
      <div className="relative w-full max-w-4xl bg-neutral-900 rounded-[2rem] sm:rounded-[3rem] shadow-2xl animate-fade-in-up overflow-hidden border-2 border-yellow-400/30 my-8">
        {/* Header */}
        <div className="p-6 sm:p-8 md:p-10 border-b border-white/10 bg-gradient-to-br from-black to-neutral-900">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-bebas text-3xl sm:text-4xl md:text-5xl tracking-widest italic text-yellow-400 leading-none mb-2">
                PERSONALIZA TU COMBO
              </h3>
              <p className="text-neutral-400 text-sm sm:text-base font-bold uppercase tracking-wider">
                {combo.name}
              </p>
              <p className="text-yellow-400 text-xs sm:text-sm font-bold mt-2">
                Paso {currentStep + 1} de {burgersCount}: Elegí tu {burgersCount === 2 ? (currentStep === 0 ? 'primera' : 'segunda') : ''} hamburguesa
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 sm:p-3 bg-neutral-800 hover:bg-yellow-400 hover:text-black rounded-xl sm:rounded-2xl transition-all hover:rotate-90 flex-shrink-0"
            >
              <X size={20} className="sm:hidden" />
              <X size={24} className="hidden sm:block" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 md:p-10 max-h-[50vh] overflow-y-auto space-y-6">
          {!currentBurgerSelection ? (
            /* Selección de hamburguesa */
            <>
              <p className="text-neutral-500 text-xs sm:text-sm font-bold uppercase tracking-widest mb-4">
                Seleccioná una hamburguesa
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableBurgers.map(burger => (
                  <button
                    key={burger.id}
                    onClick={() => selectBurger(burger)}
                    className="p-4 bg-neutral-800 border-2 border-white/10 hover:border-yellow-400/50 hover:bg-neutral-700 rounded-xl transition-all text-left group"
                  >
                    <div className="flex gap-3 items-center">
                      <img src={burger.image} className="w-16 h-16 object-cover rounded-lg" alt={burger.name} />
                      <div className="flex-1">
                        <h4 className="font-black text-sm sm:text-base uppercase text-white group-hover:text-yellow-400 transition-colors">
                          {burger.name}
                        </h4>
                        <p className="text-neutral-500 text-xs mt-1 line-clamp-2">{burger.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            /* Personalización de hamburguesa seleccionada */
            <>
              <div className="bg-black/50 p-4 rounded-xl border border-yellow-400/30">
                <p className="text-yellow-400 text-xs font-bold uppercase mb-2">Hamburguesa seleccionada:</p>
                <p className="text-white font-black text-lg">{currentBurgerSelection.name}</p>
              </div>

              {currentBurgerSelection.extras && currentBurgerSelection.extras.length > 0 && (
                <>
                  <p className="text-neutral-500 text-xs sm:text-sm font-bold uppercase tracking-widest">
                    Extras (opcional)
                  </p>
                  <div className="space-y-3">
                    {currentBurgerSelection.extras.map(extra => {
                      const isSelected = currentExtras.some(e => e.id === extra.id);
                      return (
                        <button
                          key={extra.id}
                          onClick={() => toggleExtra(extra)}
                          className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${
                            isSelected
                              ? 'bg-yellow-400 border-yellow-400 text-black shadow-lg'
                              : 'bg-neutral-800 border-white/10 hover:border-yellow-400/50 hover:bg-neutral-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                              isSelected ? 'bg-black border-black' : 'border-white/20 group-hover:border-yellow-400/50'
                            }`}>
                              {isSelected && <Check size={14} className="text-yellow-400" />}
                            </div>
                            <span className="font-black text-sm sm:text-base uppercase">{extra.name}</span>
                          </div>
                          <span className={`font-black text-base sm:text-lg ${isSelected ? 'text-black' : 'text-yellow-400'}`}>
                            +${extra.price.toLocaleString()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Observaciones */}
              <div className="pt-4 border-t border-white/10">
                <label className="flex items-center gap-2 text-white text-sm font-black mb-3 uppercase tracking-wide">
                  <MessageSquare size={16} strokeWidth={3} />
                  <span>Observaciones</span>
                  <span className="text-neutral-500 text-xs normal-case font-normal">(Opcional)</span>
                </label>
                <textarea
                  value={currentNotes}
                  onChange={(e) => setCurrentNotes(e.target.value)}
                  placeholder="Ej: Sin cebolla, sin tomate..."
                  rows={2}
                  maxLength={150}
                  className="w-full bg-neutral-800 border-2 border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold placeholder:text-neutral-600 focus:border-yellow-400 focus:outline-none transition-all resize-none"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {currentBurgerSelection && (
          <div className="p-6 sm:p-8 md:p-10 bg-black border-t border-white/10">
            <button
              onClick={confirmCurrentBurger}
              className="w-full bg-yellow-400 text-black py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-white transition-all active:scale-95 shadow-2xl uppercase tracking-wide"
            >
              <Check size={24} />
              <span>{selectedBurgers.length + 1 < burgersCount ? 'SIGUIENTE HAMBURGUESA' : 'AGREGAR AL CARRITO'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [customizingCombo, setCustomizingCombo] = useState<Product | null>(null);
  const [comboCarouselIndex, setComboCarouselIndex] = useState(0);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
  // Cargar productos desde el servidor o usar los valores por defecto
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const savedProducts = localStorage.getItem('bajoneras_products');
      if (savedProducts) {
        return JSON.parse(savedProducts);
      }
    } catch (error) {
      console.error('Error cargando productos desde localStorage:', error);
    }
    return PRODUCTS;
  });

  // Efecto para cargar productos desde el servidor al montar
  useEffect(() => {
    const loadProductsFromServer = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/products');
        if (response.ok) {
          const serverProducts = await response.json();
          if (serverProducts && serverProducts.length > 0) {
            setProducts(serverProducts);
            console.log('✅ Productos cargados desde servidor:', serverProducts.length);
            return;
          }
        }
      } catch (error) {
        console.warn('No se pudo cargar productos del servidor, usando datos locales:', error);
      }
    };

    loadProductsFromServer();
  }, []);
  
  // Obtener categorías dinámicas de los productos
  const categories = useMemo(() => 
    ['Todos', ...Array.from(new Set(products.map(p => p.category as string)))],
    [products]
  );
  
  // Estados del checkout stepper
  const [checkoutStep, setCheckoutStep] = useState(0); // 0: Carrito, 1: Datos, 2: Logística
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerBetweenStreets, setCustomerBetweenStreets] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'transferencia'>('efectivo');
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'retiro'>('delivery');

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'Todos') return products;
    return products.filter(p => p.category === activeCategory);
  }, [activeCategory, products]);

  // Función helper para calcular el precio de un item incluyendo extras de combos
  const getItemPrice = (item: CartItem): number => {
    let extrasPrice = 0;
    
    // Sumar extras directos del producto
    if (item.selectedExtras) {
      extrasPrice += item.selectedExtras.reduce((sum, e) => sum + e.price, 0);
    }
    
    // Sumar extras de hamburguesas en combos
    if (item.comboBurgers) {
      item.comboBurgers.forEach(burger => {
        if (burger.extras) {
          extrasPrice += burger.extras.reduce((sum, e) => sum + e.price, 0);
        }
      });
    }
    
    return item.price + extrasPrice;
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => {
    return acc + (getItemPrice(item) * item.quantity);
  }, 0);

  const handleAddToCart = (product: Product) => {
    // Si es un combo, abrir modal de personalización de combo
    if (product.category === 'Combos') {
      setCustomizingCombo(product);
    }
    // Si el producto tiene extras disponibles, abrir modal de personalización
    else if (product.extras && product.extras.length > 0) {
      setCustomizingProduct(product);
    } else {
      // Si no tiene extras, agregar directamente al carrito
      addToCartWithExtras(product, []);
    }
  };

  const addComboToCart = (combo: Product, burgers: ComboburgerSelection[]) => {
    setLastAdded(combo.id);
    setTimeout(() => setLastAdded(null), 500);
    
    const cartItemId = `${combo.id}-${Date.now()}`;
    
    setCart(prev => [...prev, { 
      ...combo, 
      quantity: 1, 
      comboBurgers: burgers,
      cartItemId
    }]);
    
    // Cerrar modal de personalización de combo
    setCustomizingCombo(null);
  };

  const addToCartWithExtras = (product: Product, extras: Extra[], notes: string = '') => {
    setLastAdded(product.id);
    setTimeout(() => setLastAdded(null), 500);
    
    setCart(prev => {
      // Crear un ID único para este item considerando los extras y notas
      const extrasIds = extras.map(e => e.id).sort().join('-');
      const notesId = notes.trim() ? `-notes-${notes.trim().slice(0, 20)}` : '';
      const cartItemId = `${product.id}-${extrasIds}${notesId}-${Date.now()}`;
      
      // Siempre agregar como nuevo item si tiene notas diferentes
      return [...prev, { 
        ...product, 
        quantity: 1, 
        selectedExtras: extras,
        notes: notes.trim() || undefined,
        cartItemId
      }];
    });
    
    // Cerrar modal de personalización
    setCustomizingProduct(null);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => {
      const item = prev.find(i => i.cartItemId === cartItemId);
      if (item && item.quantity > 1) {
        return prev.map(i => i.cartItemId === cartItemId ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.cartItemId !== cartItemId);
    });
  };

  const updateCartItemNotes = (cartItemId: string, notes: string) => {
    setCart(prev => prev.map(item => 
      item.cartItemId === cartItemId 
        ? { ...item, notes: notes.trim() || undefined } 
        : item
    ));
  };

  const sendOrder = () => {
    // Generar timestamp único para el pedido
    const orderTimestamp = new Date().toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    // Generar ID único del pedido
    const orderId = `WEB-${Date.now().toString().slice(-6)}`;
    
    // Calcular totales y cantidades
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Construir sección de productos
    const productsList = cart.map((item, index) => {
      const itemUnitPrice = getItemPrice(item);
      const itemTotal = itemUnitPrice * item.quantity;
      
      let itemText = `▪️ ${item.quantity}x *${item.name.toUpperCase()}*`;
      
      // Si es un combo con hamburguesas personalizadas
      if (item.comboBurgers && item.comboBurgers.length > 0) {
        item.comboBurgers.forEach((burger, idx) => {
          itemText += `%0A   ╰ ${idx + 1}° Burger: *${burger.burger.name}*`;
          if (burger.extras.length > 0) {
            const extrasList = burger.extras.map(e => e.name).join(', ');
            itemText += `%0A      • Extras: ${extrasList}`;
          }
          if (burger.notes) {
            itemText += `%0A      • Obs: _${burger.notes}_`;
          }
        });
      }
      
      if (item.selectedExtras && item.selectedExtras.length > 0) {
        const extrasList = item.selectedExtras.map(e => e.name).join(', ');
        itemText += `%0A   ╰ *Extras:* ${extrasList}`;
      }
      
      if (item.notes) {
        itemText += `%0A   ╰ *Observaciones:* _${item.notes}_`;
      }
      
      itemText += `%0A   💲 $${itemTotal.toLocaleString()}`;
      return itemText;
    }).join('%0A%0A');
    
    // Construir mensaje estructurado para WhatsApp y bots
    const message = `Hola Bajoneras! 👋 Quiero confirmar este pedido de la web:%0A%0A` +
      `🧾 *Pedido N° ${orderId}*%0A` +
      `👤 *${customerName}*%0A` +
      `📍 *${customerAddress}*%0A` +
      (customerBetweenStreets ? `Entre calles: ${customerBetweenStreets}%0A%0A` : `%0A%0A`) +
      
      `🛒 *DETALLE:*%0A%0A` +
      `${productsList}%0A%0A` +
      
      `💳 *Pago:* ${paymentMethod === 'efectivo' ? 'Efectivo' : 'Transferencia'}%0A` +
      `🚚 *Envío:* ${deliveryMethod === 'delivery' ? 'GRATIS' : 'RETIRO EN LOCAL'}%0A%0A` +
      
      `💰 *TOTAL A PAGAR: $${totalPrice.toLocaleString()}*%0A%0A` +
      
      `Aguardo confirmación${paymentMethod === 'transferencia' ? ' para transferir' : ''}. Gracias!`;
    
    // Abrir WhatsApp con el mensaje
    window.open(`https://wa.me/${SHOP_SETTINGS.whatsappNumber}?text=${message}`, '_blank');
    
    // Resetear todo después del envío
    setCart([]);
    setIsCartOpen(false);
    setCheckoutStep(0);
    setCustomerName('');
    setCustomerAddress('');
    setCustomerBetweenStreets('');
    setPaymentMethod('efectivo');
    setDeliveryMethod('delivery');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-yellow-400 selection:text-black antialiased overflow-x-hidden">
      
      {/* Modal de Personalización */}
      {customizingProduct && (
        <CustomizationModal
          product={customizingProduct}
          onClose={() => setCustomizingProduct(null)}
          onConfirm={(extras, notes) => addToCartWithExtras(customizingProduct, extras, notes)}
        />
      )}

      {/* Modal de Personalización de Combos */}
      {customizingCombo && (
        <ComboCustomizationModal
          combo={customizingCombo}
          onClose={() => setCustomizingCombo(null)}
          onConfirm={(burgers) => addComboToCart(customizingCombo, burgers)}
          products={products}
        />
      )}

      {/* Header / Hero Section */}
      <header className="relative min-h-[55vh] flex flex-col items-center justify-center bg-black overflow-hidden py-12 sm:py-20">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-fixed bg-center blur-sm scale-110"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-black/20 to-black"></div>
        
        {/* LOGO DE HOMERO */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-2xl animate-fade-in-up">
          <div className="relative group transition-transform duration-700 hover:scale-105 active:scale-95">
            <div className="absolute inset-0 bg-yellow-400/30 blur-[60px] sm:blur-[120px] rounded-full group-hover:bg-yellow-400/50 transition-all duration-700"></div>
            
            <div className="relative w-56 h-56 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-white/5 rounded-full overflow-hidden">
              <img 
                src={SHOP_SETTINGS.logoUrl} 
                alt="Logo" 
                className="w-full h-full object-cover animate-float block"
                loading="eager"
                onError={(e) => {
                  console.error("No se pudo cargar la imagen del logo:", SHOP_SETTINGS.logoUrl);
                  // Opcionalmente podrías poner un texto si falla
                }}
              />
            </div>
          </div>

          <div className="mt-8 space-y-3 sm:space-y-4 px-2">
            <h1 className="font-bebas text-5xl sm:text-6xl md:text-8xl tracking-widest text-white drop-shadow-2xl">BAJONERAS BURGER</h1>
            <p className="text-yellow-400 font-bold text-lg sm:text-2xl tracking-[0.3em] uppercase italic opacity-90 drop-shadow-lg">¡Uuuuh... hamburguesas!</p>
          </div>
        </div>

        <div className="absolute bottom-8 animate-bounce opacity-40">
           <div className="w-1 h-10 rounded-full bg-gradient-to-b from-yellow-400 to-transparent"></div>
        </div>
      </header>

      {/* Botón hamburguesa fijo para móvil */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 sm:hidden p-3 bg-yellow-400 text-black rounded-xl font-black hover:bg-white transition-all shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* Navegación Sticky */}
      <nav className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-2xl border-b border-white/5 py-3 sm:py-5 shadow-[0_15px_40px_rgba(0,0,0,0.9)]">
        <div className="max-w-6xl mx-auto px-4">
          {/* Título para móvil */}
          <div className="flex sm:hidden items-center justify-between">
            <span className="font-bebas text-2xl tracking-widest italic">MENÚ</span>
            <button
              onClick={() => setShowAdminPanel(true)}
              className="p-2 bg-neutral-800 hover:bg-yellow-400 hover:text-black rounded-lg transition-all"
              title="Panel de Administrador"
            >
              <Settings size={20} />
            </button>
          </div>

          {/* Menú desktop */}
          <div className="hidden sm:block overflow-x-auto no-scrollbar scroll-smooth">
            <div className="flex gap-4 sm:gap-8 justify-start sm:justify-center min-w-max pb-1 sm:pb-0 items-center">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 sm:px-10 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 ${
                    activeCategory === cat 
                      ? 'bg-yellow-400 text-black shadow-[0_0_25px_rgba(250,204,21,0.4)] translate-y-[-2px] ring-2 ring-black' 
                      : 'bg-neutral-900 sm:bg-transparent text-neutral-500 hover:text-white hover:bg-white/5 border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
              <div className="flex-1"></div>
              <button
                onClick={() => setShowAdminPanel(true)}
                className="p-2.5 bg-neutral-800 hover:bg-yellow-400 hover:text-black text-neutral-400 hover:text-black rounded-lg transition-all"
                title="Panel de Administrador"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Menú móvil desplegable */}
      {isMobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-3/4 bg-neutral-900 h-full shadow-2xl flex flex-col animate-slide-in-left border-r border-white/5">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/60">
              <h2 className="font-bebas text-4xl tracking-widest italic">CATEGORÍAS</h2>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-neutral-800 hover:bg-yellow-400 hover:text-black rounded-xl transition-all">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-6 py-4 rounded-xl font-black text-lg uppercase tracking-widest transition-all ${
                    activeCategory === cat 
                      ? 'bg-yellow-400 text-black shadow-lg' 
                      : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-20 pb-44">
        {/* Carrusel de Combos - Primera Sección */}
        {(activeCategory === 'Todos' || activeCategory === 'Combos') && (
          <section className="animate-fade-in scroll-mt-28" id="combos-carousel">
            <SectionHeading title="COMBOS" />
            <div className="relative">
              {/* Carrusel Items */}
              <div className="overflow-hidden">
                <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${comboCarouselIndex * 100}%)` }}>
                  {products.filter(p => p.category === 'Combos').map(product => (
                    <div key={product.id} className="w-full flex-shrink-0">
                      <ProductCard product={product} onAdd={handleAddToCart} isAnimating={lastAdded === product.id} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Botones de navegación - Posicionados absolutamente */}
              <button
                onClick={() => {
                  const combosCount = products.filter(p => p.category === 'Combos').length;
                  setComboCarouselIndex((prev) => (prev - 1 + combosCount) % combosCount);
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 z-10 p-3 sm:p-4 bg-yellow-400 hover:bg-white text-black rounded-full transition-all hover:scale-110 active:scale-90 shadow-lg"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={() => {
                  const combosCount = products.filter(p => p.category === 'Combos').length;
                  setComboCarouselIndex((prev) => (prev + 1) % combosCount);
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 z-10 p-3 sm:p-4 bg-yellow-400 hover:bg-white text-black rounded-full transition-all hover:scale-110 active:scale-90 shadow-lg"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Indicadores de página */}
              <div className="flex justify-center gap-2 sm:gap-3 mt-6 sm:mt-8">
                {products.filter(p => p.category === 'Combos').map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setComboCarouselIndex(idx)}
                    className={`h-2 sm:h-3 rounded-full transition-all ${
                      idx === comboCarouselIndex
                        ? 'bg-yellow-400 w-8 sm:w-10'
                        : 'bg-neutral-700 w-2 sm:w-3 hover:bg-neutral-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="space-y-24 sm:space-y-40">
          {/* Sección de Burgers y Postres */}
          {(activeCategory === 'Todos' ? ['Burgers', 'Postres'] : (activeCategory !== 'Combos' ? [activeCategory] : [])).map(cat => (
             <section key={cat} className="animate-fade-in scroll-mt-28" id={cat.toLowerCase()}>
               <SectionHeading title={cat} />
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-14">
                 {products.filter(p => p.category === cat).map(product => (
                   <ProductCard key={product.id} product={product} onAdd={handleAddToCart} isAnimating={lastAdded === product.id} />
                 ))}
               </div>
             </section>
          ))}
        </div>
      </main>

      {/* Botón Flotante */}
      <div className="fixed bottom-6 sm:bottom-10 left-0 right-0 z-50 px-5 sm:px-8 flex justify-center pointer-events-none">
        {totalItems > 0 && (
          <button 
            onClick={() => {
              setIsCartOpen(true);
              setCheckoutStep(0);
            }}
            className="w-full max-w-sm sm:max-w-lg bg-yellow-400 text-black py-5 sm:py-7 rounded-2xl sm:rounded-[2rem] font-black text-xl sm:text-3xl flex items-center justify-between px-8 sm:px-12 shadow-[0_25px_60px_rgba(0,0,0,0.8)] border-4 border-black ring-8 ring-yellow-400/20 hover:scale-[1.05] active:scale-90 transition-all animate-bounce-subtle pointer-events-auto group"
          >
            <div className="relative">
              <ShoppingCart size={32} className="sm:w-10 sm:h-10" />
              <span className="absolute -top-3 -right-3 bg-black text-yellow-400 rounded-full w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm font-bold flex items-center justify-center border-4 border-yellow-400">{totalItems}</span>
            </div>
            <span className="tracking-[0.1em] italic uppercase font-bebas">PEDIDO (${totalPrice.toLocaleString()})</span>
            <div className="bg-black/10 px-4 py-2 rounded-xl text-sm font-black">LISTO</div>
          </button>
        )}
      </div>

      {/* Sidebar del Carrito con Checkout por Pasos */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl transition-opacity duration-500" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full sm:max-w-2xl bg-neutral-900 h-full shadow-2xl flex flex-col animate-slide-in-right overflow-hidden border-l border-white/5">
            
            {/* Header con Logo */}
            <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-black/60 gap-4">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <img src={SHOP_SETTINGS.logoUrl} alt="Logo" className="h-12 w-12 sm:h-16 sm:w-16 object-cover rounded-xl bg-white/5 flex-shrink-0" />
                <div className="min-w-0">
                  <h2 className="font-bebas text-3xl sm:text-5xl tracking-widest italic leading-tight">CHECKOUT</h2>
                  <p className="text-neutral-500 text-[10px] sm:text-xs font-bold tracking-widest uppercase mt-0.5">
                    {checkoutStep === 0 && "Tu Selección"}
                    {checkoutStep === 1 && "Tus Datos"}
                    {checkoutStep === 2 && "Confirmación"}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 sm:p-3 bg-neutral-800 hover:bg-yellow-400 hover:text-black rounded-xl transition-all hover:rotate-90 flex-shrink-0">
                <X size={24} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Barra de Progreso */}
            <div className="bg-neutral-950 px-6 sm:px-8 py-3 sm:py-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] sm:text-xs font-bold text-neutral-500 uppercase tracking-widest">Progreso</span>
                <span className="text-[10px] sm:text-xs font-black text-yellow-400">{Math.round((checkoutStep / 2) * 100)}%</span>
              </div>
              <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-700 ease-out shadow-[0_0_20px_rgba(250,204,21,0.5)]"
                  style={{ width: `${(checkoutStep / 2) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 sm:mt-3">
                <div className={`flex flex-col items-center gap-1 ${checkoutStep >= 0 ? 'text-yellow-400' : 'text-neutral-600'}`}>
                  <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-black text-xs ${checkoutStep >= 0 ? 'bg-yellow-400 text-black' : 'bg-neutral-800'}`}>1</div>
                  <span className="text-[9px] sm:text-[10px] font-bold">CARRITO</span>
                </div>
                <div className={`flex flex-col items-center gap-1 ${checkoutStep >= 1 ? 'text-yellow-400' : 'text-neutral-600'}`}>
                  <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-black text-xs ${checkoutStep >= 1 ? 'bg-yellow-400 text-black' : 'bg-neutral-800'}`}>2</div>
                  <span className="text-[9px] sm:text-[10px] font-bold">DATOS</span>
                </div>
                <div className={`flex flex-col items-center gap-1 ${checkoutStep >= 2 ? 'text-yellow-400' : 'text-neutral-600'}`}>
                  <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-black text-xs ${checkoutStep >= 2 ? 'bg-yellow-400 text-black' : 'bg-neutral-800'}`}>3</div>
                  <span className="text-[9px] sm:text-[10px] font-bold">CONFIRMAR</span>
                </div>
              </div>
            </div>
            
            {/* Contenido según el paso */}
            <div className="flex-1 overflow-y-auto p-8 sm:p-12 space-y-6 no-scrollbar">
              
              {/* PASO 0: CARRITO */}
              {checkoutStep === 0 && (
                <div className="space-y-8 animate-fade-in">
                  
                  {cart.length === 0 ? (
                    <>
                      {/* Carrito Vacío */}
                      <div className="bg-red-500/10 border-l-4 border-red-500 p-6 rounded-xl">
                        <p className="text-red-400 font-bold text-base sm:text-lg mb-2">
                          😢 ¡Tu carrito está más vacío que el refrigerador de Homero!
                        </p>
                        <p className="text-neutral-400 text-sm">
                          No te preocupes, tenemos el remedio perfecto para ese bajón...
                        </p>
                      </div>
                      
                      <div className="text-center py-20 flex flex-col items-center space-y-8">
                        <div className="relative">
                          <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full"></div>
                          <ShoppingCart size={120} strokeWidth={1} className="mb-6 text-neutral-700 relative" />
                        </div>
                        <div className="space-y-4">
                          <p className="font-bebas text-4xl sm:text-6xl italic tracking-widest text-neutral-600">¡TODAVÍA NO HAY NADA!</p>
                          <p className="text-neutral-500 text-sm sm:text-base max-w-md">
                            Explorá nuestro menú y armá el pedido más bajonero de tu vida 🍔✨
                          </p>
                        </div>
                        <button
                          onClick={() => setIsCartOpen(false)}
                          className="bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black text-lg uppercase tracking-wide hover:bg-yellow-300 transition-all active:scale-95 shadow-lg"
                        >
                          📋 VER MENÚ
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Banner de Recomendación del Chef */}
                      {totalPrice < 8000 && (
                        <div className="bg-orange-500/10 border-l-4 border-orange-500 p-5 rounded-xl relative overflow-hidden group hover:bg-orange-500/20 transition-all cursor-pointer">
                          <div className="absolute top-0 right-0 text-6xl opacity-10 group-hover:scale-110 transition-transform">👨‍🍳</div>
                          <div className="relative">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl">👨‍🍳</span>
                              <h4 className="font-bebas text-xl sm:text-2xl tracking-widest text-orange-400 italic">
                                RECOMENDACIÓN DEL CHEF
                              </h4>
                            </div>
                            <p className="text-white font-bold text-sm mb-2">
                              ¿Qué tal unas papas o una bebida para acompañar? 
                            </p>
                            <p className="text-neutral-400 text-xs">
                              ¡Agregá algo más y hacé tu bajón completo! 🍟🥤
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Lista de Productos */}
                      <div className="space-y-6">
                        {cart.map(item => {
                          const itemTotalPrice = getItemPrice(item);
                          
                          return (
                            <div key={item.cartItemId} className="flex gap-4 sm:gap-6 items-start animate-fade-in group bg-neutral-800/50 p-4 sm:p-5 rounded-2xl border border-white/5 hover:border-yellow-400/30 transition-all">
                              <div className="h-24 w-24 sm:h-28 sm:w-28 flex-shrink-0 relative overflow-hidden rounded-xl shadow-xl border-2 border-white/10 group-hover:border-yellow-400/50 transition-all">
                                 <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-black text-lg sm:text-xl uppercase tracking-tight mb-2 group-hover:text-yellow-400 transition-colors">{item.name}</h4>
                                
                                {/* Mostrar hamburguesas del combo */}
                                {item.comboBurgers && item.comboBurgers.length > 0 && (
                                  <div className="mb-3 space-y-2 bg-black/30 p-3 rounded-lg border border-yellow-400/20">
                                    <p className="text-xs font-bold text-yellow-400 uppercase tracking-wide mb-2">📋 Tu Combo incluye:</p>
                                    {item.id === 'combo-bajonero-individual' && (
                                      <p className="text-[11px] font-black text-orange-300">
                                        Incluye 1 Chocotorta chica 🍰
                                      </p>
                                    )}
                                    {item.id === 'combo-bajonero-compartir' && (
                                      <p className="text-[11px] font-black text-orange-300">
                                        Incluye 1 Chocotorta grande 🍰
                                      </p>
                                    )}
                                    {item.comboBurgers.map((burger, idx) => (
                                      <div key={idx} className="text-xs">
                                        <p className="text-white font-black">• {burger.burger.name}</p>
                                        {burger.extras.length > 0 && (
                                          <p className="text-neutral-400 ml-3">+ {burger.extras.map(e => e.name).join(', ')}</p>
                                        )}
                                        {burger.notes && (
                                          <p className="text-neutral-500 italic ml-3">"{burger.notes}"</p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {item.selectedExtras && item.selectedExtras.length > 0 && (
                                  <div className="mb-3 flex flex-wrap gap-2">
                                    {item.selectedExtras.map(extra => (
                                      <span key={extra.id} className="text-xs bg-yellow-400/20 text-yellow-400 px-2.5 py-1 rounded-lg font-bold border border-yellow-400/30">
                                        +{extra.name}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                
                                {/* Campo editable de notas solo si no es combo */}
                                {!item.comboBurgers && (
                                  <div className="mb-2 relative">
                                    <div className="flex items-center gap-1.5 mb-1">
                                      <MessageSquare size={12} className="text-neutral-500" />
                                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide">Observaciones</span>
                                      {item.notes && (
                                        <span className="text-[9px] text-neutral-600 ml-auto">{item.notes.length}/150</span>
                                      )}
                                    </div>
                                    <input
                                      type="text"
                                      value={item.notes || ''}
                                      onChange={(e) => updateCartItemNotes(item.cartItemId!, e.target.value)}
                                      placeholder="Ej: Sin cebolla, sin tomate, bien cocida..."
                                      maxLength={150}
                                      className="w-full text-xs text-neutral-300 bg-neutral-900/80 px-3 py-2 rounded-lg border border-white/10 focus:border-yellow-400/70 focus:outline-none transition-all placeholder:text-neutral-600 hover:border-yellow-400/30"
                                    />
                                  </div>
                                )}
                                
                                <div className="flex items-baseline gap-2">
                                  <p className="text-yellow-400 font-black text-lg sm:text-xl">${itemTotalPrice.toLocaleString()}</p>
                                  <p className="text-neutral-500 text-xs font-bold">c/u</p>
                                </div>
                                <p className="text-neutral-600 text-xs mt-1 font-bold">
                                  Subtotal: ${(itemTotalPrice * item.quantity).toLocaleString()}
                                </p>
                              </div>
                              <div className="flex flex-col items-center gap-2.5 bg-black/60 p-3 rounded-xl border border-white/5">
                                <button 
                                  onClick={() => handleAddToCart(item)} 
                                  className="p-2.5 bg-neutral-800 hover:bg-green-500 rounded-lg transition-all hover:scale-110 active:scale-95"
                                  title="Agregar uno más"
                                >
                                  <Plus size={18}/>
                                </button>
                                <span className="font-black text-2xl w-10 text-center text-white">{item.quantity}</span>
                                <button 
                                  onClick={() => removeFromCart(item.cartItemId!)} 
                                  className="p-2.5 bg-neutral-800 hover:bg-red-500 rounded-lg transition-all hover:scale-110 active:scale-95"
                                  title="Quitar uno"
                                >
                                  <Minus size={18}/>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* PASO 1: DATOS DEL CLIENTE */}
              {checkoutStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  
                  <div className="space-y-4">
                    {/* Input de Nombre */}
                    <div className="group">
                      <label className="flex items-center gap-2 text-white text-sm sm:text-base font-black mb-2 uppercase tracking-wide">
                        <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-black">
                          <User size={18} strokeWidth={3} />
                        </div>
                        <span>Tu Nombre</span>
                        <span className="text-red-500 text-2xl leading-none">*</span>
                      </label>
                      <div className="relative">
                        <input 
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Ej: Homero Simpson"
                          className="w-full bg-gradient-to-br from-neutral-800 to-neutral-900 border-3 border-white/20 rounded-xl px-4 py-3 text-white text-lg sm:text-xl font-bold placeholder:text-neutral-600 focus:border-yellow-400 focus:shadow-[0_0_30px_rgba(250,204,21,0.3)] focus:outline-none transition-all duration-300"
                        />
                        {customerName && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                            <Check size={24} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      <p className="mt-1.5 text-neutral-500 text-xs italic flex items-center gap-1.5">
                        <span className="text-yellow-400">💡</span>
                        <span>Escribí el <span className="text-yellow-400 font-bold">nombre de la persona que recibe el pedido</span></span>
                      </p>
                    </div>
                    
                    {/* Input de Dirección/Teléfono */}
                    <div className="group">
                      <label className="flex items-center gap-2 text-white text-sm sm:text-base font-black mb-2 uppercase tracking-wide">
                        <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-black">
                          <MapPin size={18} strokeWidth={3} />
                        </div>
                        <span>Tu Dirección</span>
                        <span className="text-red-500 text-2xl leading-none">*</span>
                      </label>
                      <div className="relative">
                        <input 
                          type="text"
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value)}
                          placeholder="Ej: Av. Siempreviva 742, Springfield"
                          className="w-full bg-gradient-to-br from-neutral-800 to-neutral-900 border-3 border-white/20 rounded-xl px-4 py-3 text-white text-lg sm:text-xl font-bold placeholder:text-neutral-600 focus:border-yellow-400 focus:shadow-[0_0_30px_rgba(250,204,21,0.3)] focus:outline-none transition-all duration-300"
                        />
                        {customerAddress && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                            <Check size={24} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      <p className="mt-1.5 text-neutral-500 text-xs italic flex items-center gap-1.5">
                        <span className="text-yellow-400">📍</span>
                        <span>Especificá <span className="text-yellow-400 font-bold">calle, altura y entre calles</span> para que tu bajón llegue calentito</span>
                      </p>
                    </div>

                    {/* Input de Entre Calles */}
                    <div className="group">
                      <label className="flex items-center gap-2 text-white text-sm sm:text-base font-black mb-2 uppercase tracking-wide">
                        <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-black">
                          <MapPin size={18} strokeWidth={3} />
                        </div>
                        <span>Entre Calles</span>
                        <span className="text-red-500 text-2xl leading-none">*</span>
                      </label>
                      <div className="relative">
                        <input 
                          type="text"
                          value={customerBetweenStreets}
                          onChange={(e) => setCustomerBetweenStreets(e.target.value)}
                          placeholder="Ej: Entre Av. Los Andes y Calle Principal"
                          className="w-full bg-gradient-to-br from-neutral-800 to-neutral-900 border-3 border-white/20 rounded-xl px-4 py-3 text-white text-lg sm:text-xl font-bold placeholder:text-neutral-600 focus:border-yellow-400 focus:shadow-[0_0_30px_rgba(250,204,21,0.3)] focus:outline-none transition-all duration-300"
                        />
                        {customerBetweenStreets && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                            <Check size={24} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Método de Pago */}
                    <div>
                      <label className="flex items-center gap-2 text-white text-sm sm:text-base font-black mb-2 uppercase tracking-wide">
                        <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-black">
                          <CreditCard size={18} strokeWidth={3} />
                        </div>
                        <span>Forma de Pago</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setPaymentMethod('efectivo')}
                          className={`p-3 rounded-xl border-3 font-bold text-xs sm:text-sm uppercase transition-all relative overflow-hidden group ${
                            paymentMethod === 'efectivo'
                              ? 'bg-yellow-400 border-yellow-400 text-black shadow-[0_0_30px_rgba(250,204,21,0.4)] scale-105'
                              : 'bg-neutral-800 border-white/10 text-neutral-400 hover:border-yellow-400/50 hover:bg-neutral-700'
                          }`}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br from-yellow-300 to-orange-400 opacity-0 transition-opacity ${paymentMethod === 'efectivo' ? 'opacity-20' : 'group-hover:opacity-10'}`}></div>
                          <div className="relative flex flex-col items-center gap-1">
                            <Banknote size={24} strokeWidth={2.5} />
                            <span>Efectivo</span>
                          </div>
                          {paymentMethod === 'efectivo' && (
                            <div className="absolute top-1.5 right-1.5 bg-black rounded-full p-1">
                              <Check size={14} strokeWidth={4} className="text-yellow-400" />
                            </div>
                          )}
                        </button>
                        <button
                          onClick={() => setPaymentMethod('transferencia')}
                          className={`p-3 rounded-xl border-3 font-bold text-xs sm:text-sm uppercase transition-all relative overflow-hidden group ${
                            paymentMethod === 'transferencia'
                              ? 'bg-yellow-400 border-yellow-400 text-black shadow-[0_0_30px_rgba(250,204,21,0.4)] scale-105'
                              : 'bg-neutral-800 border-white/10 text-neutral-400 hover:border-yellow-400/50 hover:bg-neutral-700'
                          }`}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br from-yellow-300 to-orange-400 opacity-0 transition-opacity ${paymentMethod === 'transferencia' ? 'opacity-20' : 'group-hover:opacity-10'}`}></div>
                          <div className="relative flex flex-col items-center gap-1">
                            <CreditCard size={24} strokeWidth={2.5} />
                            <span>Transfer.</span>
                          </div>
                          {paymentMethod === 'transferencia' && (
                            <div className="absolute top-1.5 right-1.5 bg-black rounded-full p-1">
                              <Check size={14} strokeWidth={4} className="text-yellow-400" />
                            </div>
                          )}
                        </button>
                      </div>
                      <p className="mt-1.5 text-neutral-500 text-xs italic flex items-center gap-1.5">
                        <span className="text-yellow-400">💰</span>
                        <span>Elegí cómo preferís pagar tu pedido</span>
                      </p>
                    </div>

                    {/* Validación Visual */}
                    {customerName.trim() && customerAddress.trim() ? (
                      <div className="bg-green-500/10 border-l-4 border-green-500 p-2.5 rounded-xl animate-fade-in">
                        <div className="flex items-center gap-2">
                          <div className="text-lg">✅</div>
                          <div>
                            <p className="text-green-400 font-bold text-xs sm:text-sm mb-0.5">
                              ¡Perfecto, {customerName.split(' ')[0]}! 
                            </p>
                            <p className="text-neutral-400 text-xs">
                              Ya tenemos todo lo que necesitamos. Hacé click en "CONTINUAR" para confirmar tu pedido
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : null}

                  </div>
                </div>
              )}

              {/* PASO 2: CONFIRMACIÓN Y PAGO */}
              {checkoutStep === 2 && (
                <div className="space-y-8 animate-fade-in">
                  
                  {/* Header de Confirmación */}
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/40 p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/10 blur-3xl rounded-full"></div>
                    <div className="relative flex items-start gap-4">
                      <div className="text-4xl">🎊</div>
                      <div className="flex-1">
                        <h3 className="font-bebas text-2xl sm:text-3xl tracking-widest text-green-400 mb-2 italic">
                          ¡REVISÁ TU PEDIDO!
                        </h3>
                        <p className="text-white font-bold text-sm sm:text-base mb-2">
                          Todo está listo, {customerName.split(' ')[0]} 🍔
                        </p>
                        <p className="text-neutral-400 text-xs italic">
                          Si todo te parece bien, apretá el botón verde para enviarlo por WhatsApp
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Ticket/Recibo Profesional */}
                  <div className="bg-white text-black rounded-3xl overflow-hidden shadow-2xl border-4 border-neutral-800 relative">
                    {/* Borde superior decorativo */}
                    <div className="h-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"></div>
                    
                    {/* Header del Ticket */}
                    <div className="bg-neutral-900 text-white p-6 text-center border-b-2 border-dashed border-neutral-700">
                      <div className="flex justify-center mb-3">
                        <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                          <Receipt size={32} className="text-black" strokeWidth={2.5} />
                        </div>
                      </div>
                      <h3 className="font-bebas text-3xl sm:text-4xl tracking-widest italic text-yellow-400">BAJONERAS BURGER</h3>
                      <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mt-2">Ticket de Pedido</p>
                      <div className="mt-4 pt-4 border-t border-neutral-700 text-xs space-y-1">
                        <p className="text-neutral-400">Fecha: {new Date().toLocaleDateString('es-AR')}</p>
                        <p className="text-neutral-400">Hora: {new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>

                    {/* Datos del Cliente */}
                    <div className="p-6 bg-neutral-50 border-b-2 border-dashed border-neutral-300">
                      <h4 className="font-black text-sm uppercase tracking-wider mb-4 text-neutral-700 flex items-center gap-2">
                        <User size={16} strokeWidth={3} />
                        Datos del Cliente
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-neutral-600 font-bold">Nombre:</span>
                          <span className="font-black text-right">{customerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600 font-bold">Dirección:</span>
                          <span className="font-black text-right max-w-[60%]">{customerAddress}</span>
                        </div>
                        {customerBetweenStreets && (
                          <div className="flex justify-between">
                            <span className="text-neutral-600 font-bold">Entre calles:</span>
                            <span className="font-black text-right max-w-[60%]">{customerBetweenStreets}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-neutral-600 font-bold">Pago:</span>
                          <span className="font-black uppercase">{paymentMethod === 'efectivo' ? '💵 EFECTIVO' : '💳 TRANSFERENCIA'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Detalle del Pedido */}
                    <div className="p-6 bg-white">
                      <h4 className="font-black text-sm uppercase tracking-wider mb-4 text-neutral-700 flex items-center gap-2">
                        <ShoppingCart size={16} strokeWidth={3} />
                        Detalle del Pedido
                      </h4>
                      <div className="space-y-4">
                        {cart.map(item => {
                          const itemUnitPrice = getItemPrice(item);
                            <div key={item.cartItemId} className="border-b border-neutral-200 pb-3 last:border-b-0">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <div className="flex items-start gap-2">
                                    <span className="font-black text-lg">{item.quantity}x</span>
                                    <div className="flex-1">
                                      <p className="font-black text-sm uppercase leading-tight">{item.name}</p>
                                      
                                      {/* Mostrar hamburguesas del combo */}
                                      {item.comboBurgers && item.comboBurgers.length > 0 && (
                                        <div className="mt-2 bg-orange-50 p-2 rounded border border-orange-200">
                                          <p className="text-[10px] font-bold text-orange-700 uppercase mb-1">🍔 Hamburguesas:</p>
                                          {item.comboBurgers.map((burger, idx) => (
                                            <div key={idx} className="text-xs text-neutral-700 mb-1">
                                              <p className="font-bold">• {burger.burger.name}</p>
                                              {burger.extras && burger.extras.length > 0 && (
                                                <p className="text-[10px] text-neutral-600 ml-2">
                                                  Extras: {burger.extras.map(e => e.name).join(', ')}
                                                </p>
                                              )}
                                              {burger.notes && (
                                                <p className="text-[10px] text-neutral-600 italic ml-2">
                                                  Obs: {burger.notes}
                                                </p>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                      
                                      {item.selectedExtras && item.selectedExtras.length > 0 && (
                                        <div className="mt-1 space-y-1">
                                          {item.selectedExtras.map(extra => (
                                            <p key={extra.id} className="text-xs text-neutral-600 italic">
                                              + {extra.name} <span className="font-bold">(${extra.price.toLocaleString()})</span>
                                            </p>
                                          ))}
                                        </div>
                                      )}
                                      {item.notes && (
                                        <p className="mt-1 text-xs text-neutral-600 italic bg-yellow-50 px-2 py-0.5 rounded inline-block">
                                          📝 {item.notes}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right ml-4">
                                  <p className="font-black text-lg">${itemTotal.toLocaleString()}</p>
                                  <p className="text-xs text-neutral-500 font-bold">${itemUnitPrice.toLocaleString()} c/u</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="p-6 bg-neutral-900 text-white border-t-2 border-dashed border-neutral-700">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm text-neutral-400 font-bold">
                          <span>Subtotal</span>
                          <span>${totalPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-neutral-400 font-bold">
                          <span>Envío</span>
                          <span className="text-green-400 font-black">GRATIS 🎁</span>
                        </div>
                        <div className="pt-3 border-t-2 border-yellow-400/30 flex justify-between items-center">
                          <span className="font-bebas text-3xl sm:text-4xl tracking-widest italic">TOTAL</span>
                          <span className="font-black text-3xl sm:text-4xl text-yellow-400 italic">${totalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer del Ticket */}
                    <div className="bg-neutral-50 p-4 text-center border-t-2 border-dashed border-neutral-300">
                      <p className="text-xs text-neutral-600 font-bold uppercase tracking-widest">
                        ¡Gracias por tu pedido!
                      </p>
                      <p className="text-[10px] text-neutral-500 mt-1 italic">
                        "Marge, no te voy a mentir... ¡Quiero otra hamburguesa!" - Homero
                      </p>
                    </div>

                    {/* Borde inferior decorativo */}
                    <div className="h-3 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400"></div>
                  </div>

                </div>
              )}
            </div>

            {/* Footer con Total y Botones */}
            <div className="p-8 sm:p-12 bg-black border-t border-white/10 space-y-4">
              <div className="flex justify-between text-3xl sm:text-5xl font-black">
                <span className="font-bebas italic tracking-widest">TOTAL</span>
                <span className="text-yellow-400 italic">${totalPrice.toLocaleString()}</span>
              </div>
              
              <div className="flex gap-4">
                {checkoutStep > 0 && (
                  <button 
                    onClick={() => setCheckoutStep(checkoutStep - 1)}
                    className="flex-1 bg-neutral-800 text-white py-5 rounded-2xl font-black text-lg uppercase tracking-wide hover:bg-neutral-700 transition-all"
                  >
                    ← VOLVER
                  </button>
                )}
                
                {checkoutStep < 2 && (
                  <button 
                    onClick={() => {
                      if (checkoutStep === 0 && cart.length > 0) {
                        setCheckoutStep(1);
                      } else if (checkoutStep === 1 && customerName.trim() && customerAddress.trim() && customerBetweenStreets.trim()) {
                        setCheckoutStep(2);
                      }
                    }}
                    disabled={
                      (checkoutStep === 0 && cart.length === 0) || 
                      (checkoutStep === 1 && (!customerName.trim() || !customerAddress.trim() || !customerBetweenStreets.trim()))
                    }
                    className={`flex-1 py-5 rounded-2xl font-black text-lg sm:text-xl uppercase tracking-wide transition-all ${
                      (checkoutStep === 0 && cart.length === 0) || 
                      (checkoutStep === 1 && (!customerName.trim() || !customerAddress.trim() || !customerBetweenStreets.trim()))
                        ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed opacity-50'
                        : 'bg-yellow-400 text-black hover:bg-yellow-300 active:scale-95 shadow-lg'
                    }`}
                  >
                    {checkoutStep === 0 ? '¡SEGUIR! →' : 'CONTINUAR →'}
                  </button>
                )}
                
                {checkoutStep === 2 && (
                  <button 
                    onClick={sendOrder}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-black py-6 rounded-2xl font-black text-xl sm:text-2xl flex items-center justify-center gap-3 hover:from-green-400 hover:to-green-500 transition-all active:scale-95 shadow-2xl uppercase italic animate-pulse"
                  >
                    <Send size={28} /> ¡ENVIAR PEDIDO!
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-black py-24 sm:py-40 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-12 text-center">
          <div className="w-56 h-56 sm:w-80 sm:h-80 mb-6 bg-white/5 rounded-full border border-white/10 shadow-2xl animate-float overflow-hidden">
            <img src={SHOP_SETTINGS.logoUrl} alt="Logo" className="w-full h-full object-cover filter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] block" />
          </div>
          
          {/* Información de horarios y zona */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 w-full max-w-3xl">
            <div className="bg-neutral-900/50 p-6 sm:p-8 rounded-2xl border border-white/10">
              <div className="text-yellow-400 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <h3 className="font-bebas text-xl sm:text-2xl tracking-widest text-white mb-2">HORARIOS</h3>
              <p className="text-neutral-400 text-sm sm:text-base font-bold">{SHOP_SETTINGS.schedule}</p>
            </div>
            <div className="bg-neutral-900/50 p-6 sm:p-8 rounded-2xl border border-white/10">
              <div className="text-yellow-400 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <h3 className="font-bebas text-xl sm:text-2xl tracking-widest text-white mb-2">ZONA DE DELIVERY</h3>
              <p className="text-neutral-400 text-sm sm:text-base font-bold">{SHOP_SETTINGS.deliveryZones}</p>
            </div>
          </div>

          <div className="flex gap-10 sm:gap-16">
            <a href={`https://instagram.com/${SHOP_SETTINGS.instagramHandle}`} target="_blank" rel="noopener noreferrer" className="p-6 sm:p-10 bg-neutral-900 rounded-[2rem] sm:rounded-[3rem] hover:bg-yellow-400 hover:text-black transition-all hover:-translate-y-4 shadow-2xl border border-white/5" title="Síguenos en Instagram"><Instagram size={40} /></a>
            <a href={`https://wa.me/${SHOP_SETTINGS.whatsappNumber}?text=Hola%20Bajoneras%20Burger%21%20%F0%9F%98%8B%0A%0AQuiero%20hacer%20un%20pedido%20desde%20la%20web.%20Consultar%20disponibilidad%20y%20horarios.`} target="_blank" rel="noopener noreferrer" className="p-6 sm:p-10 bg-neutral-900 rounded-[2rem] sm:rounded-[3rem] hover:bg-green-500 hover:text-black transition-all hover:-translate-y-4 shadow-2xl border border-white/5" title="Contactanos por WhatsApp"><Phone size={40} /></a>
          </div>
          <p className="text-neutral-500 text-2xl sm:text-4xl italic font-light max-w-3xl leading-snug px-4">
            "Marge, no te voy a mentir... <br className="hidden sm:block"/> ¡Quiero otra hamburguesa!"
          </p>
          <div className="w-32 h-2 bg-yellow-400 rounded-full shadow-[0_0_30px_rgba(250,204,21,0.6)]"></div>
          <p className="text-[10px] sm:text-sm text-neutral-800 font-bold tracking-[1em] uppercase">BAJONERAS BURGER &copy; ALL RIGHTS RESERVED</p>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2.5s ease-in-out infinite;
        }
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slide-in-left {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(80px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        @keyframes pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
        .animate-pop {
          animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        html { scroll-behavior: smooth; background: #0a0a0a; }
      `}</style>

      {/* Admin Panel */}
      {showAdminPanel && (
        <AdminPanel 
          products={products} 
          onClose={() => setShowAdminPanel(false)} 
          onSave={(updatedProducts) => {
            try {
              const dataString = JSON.stringify(updatedProducts);
              const sizeInMB = new Blob([dataString]).size / (1024 * 1024);
              
              // Verificar si excede el límite de localStorage (aprox 5-10MB)
              if (sizeInMB > 5) {
                alert(`⚠️ ADVERTENCIA: Los datos ocupan ${sizeInMB.toFixed(2)}MB.\n\n` +
                      `Las imágenes base64 son muy pesadas. Se recomienda:\n` +
                      `1. Usar URLs de imágenes en lugar de archivos\n` +
                      `2. Subir las imágenes a un servidor/hosting\n` +
                      `3. Usar imágenes más pequeñas\n\n` +
                      `De todas formas se intentará guardar...`);
              }
              
              // Guardar en localStorage
              localStorage.setItem('bajoneras_products', dataString);
              setProducts(updatedProducts);
              setShowAdminPanel(false);
              alert(`✅ Cambios guardados exitosamente!\n\nDatos: ${sizeInMB.toFixed(2)}MB\nLos datos son ahora persistentes en toda la aplicación.`);
            } catch (error) {
              console.error('Error guardando productos:', error);
              
              // Mensaje de error más específico
              let errorMsg = '❌ Error al guardar los cambios.\n\n';
              if (error instanceof Error && error.name === 'QuotaExceededError') {
                errorMsg += 'PROBLEMA: El tamaño de los datos excede el límite de almacenamiento del navegador.\n\n' +
                           'SOLUCIONES:\n' +
                           '1. Usa URLs de imágenes en lugar de subir archivos\n' +
                           '2. Reduce el número de productos con imágenes grandes\n' +
                           '3. Comprime las imágenes antes de subirlas\n\n' +
                           'TIP: Las imágenes base64 pueden ser 30% más grandes que el archivo original.';
              } else {
                errorMsg += `Detalles: ${error instanceof Error ? error.message : 'Error desconocido'}\n\n` +
                           'Intenta de nuevo o contacta al desarrollador.';
              }
              alert(errorMsg);
            }
          }}
        />
      )}
    </div>
  );
}

const ProductCard: React.FC<{ product: Product; onAdd: (p: Product) => void; isAnimating?: boolean }> = ({ product, onAdd, isAnimating }) => {
  return (
    <div className={`bg-neutral-900 rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden group hover:shadow-[0_40px_100px_rgba(0,0,0,0.95)] transition-all duration-700 flex flex-col border border-white/5 hover:border-yellow-400/30 min-h-[650px] sm:min-h-[800px] ${isAnimating ? 'animate-pop shadow-[0_0_60px_rgba(250,204,21,0.2)]' : ''}`}>
      <div className="relative h-72 sm:h-[450px] overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" 
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
        <div className="absolute top-5 left-5 sm:top-10 sm:left-10 flex flex-col gap-3">
           {product.isPopular && <Badge color="bg-yellow-400 px-4 py-2 text-xs sm:text-base">MÁS PEDIDO</Badge>}
           {product.isPromo && <Badge color="bg-orange-600 px-4 py-2 text-xs sm:text-base shadow-lg shadow-orange-600/30">OFERTA REBOSANTE</Badge>}
        </div>
      </div>

      <div className="p-8 sm:p-14 flex-1 flex flex-col justify-between space-y-8 sm:space-y-12">
        <div className="space-y-4 sm:space-y-6">
          <h3 className="font-bebas text-4xl sm:text-6xl tracking-widest uppercase group-hover:text-yellow-400 transition-colors leading-none italic drop-shadow-md">{product.name}</h3>
          <p className="text-neutral-500 text-sm sm:text-xl leading-relaxed font-light italic opacity-80">{product.description}</p>
        </div>
        
        <div className="flex flex-col items-stretch gap-6">
          <div className="flex flex-col">
             <span className="text-neutral-600 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] mb-1">Precio Final</span>
             <span className="font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tighter italic">${product.price.toLocaleString()}</span>
          </div>
          <button 
            onClick={() => onAdd(product)}
            className="w-full bg-yellow-400 text-black py-5 sm:py-7 px-6 sm:px-8 rounded-2xl sm:rounded-[2rem] font-black text-base sm:text-xl lg:text-2xl uppercase flex items-center justify-center gap-3 hover:bg-white transition-all active:scale-90 shadow-2xl group-hover:translate-y-[-8px] border-4 border-transparent hover:border-black"
          >
            {product.isCombo ? (
              <>
                <ShoppingCart size={20} className="sm:w-6 sm:h-6 lg:w-8 lg:h-8" /> ¡PEDIR YA!
              </>
            ) : (
              <>
                <Plus size={20} className="sm:w-6 sm:h-6 lg:w-8 lg:h-8" /> AGREGAR
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
