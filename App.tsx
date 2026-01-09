
import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, Send, Plus, Minus, X, Menu, Phone, Instagram, Check } from 'lucide-react';
import { PRODUCTS, SHOP_SETTINGS } from './data';
import { Product, CartItem, Category, Extra } from './types';

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
  onConfirm: (extras: Extra[]) => void;
}> = ({ product, onClose, onConfirm }) => {
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);

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
            onClick={() => onConfirm(selectedExtras)}
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

// --- Main App ---

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | 'Todos'>('Todos');
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);

  const categories: (Category | 'Todos')[] = ['Todos', 'Combos', 'Burgers', 'Postres', 'Bebidas'];

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'Todos') return PRODUCTS;
    return PRODUCTS.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => {
    const extrasPrice = item.selectedExtras ? item.selectedExtras.reduce((sum, e) => sum + e.price, 0) : 0;
    return acc + ((item.price + extrasPrice) * item.quantity);
  }, 0);

  const handleAddToCart = (product: Product) => {
    // Si el producto tiene extras disponibles, abrir modal de personalización
    if (product.extras && product.extras.length > 0) {
      setCustomizingProduct(product);
    } else {
      // Si no tiene extras, agregar directamente al carrito
      addToCartWithExtras(product, []);
    }
  };

  const addToCartWithExtras = (product: Product, extras: Extra[]) => {
    setLastAdded(product.id);
    setTimeout(() => setLastAdded(null), 500);
    
    setCart(prev => {
      // Crear un ID único para este item considerando los extras
      const extrasIds = extras.map(e => e.id).sort().join('-');
      const cartItemId = `${product.id}-${extrasIds}`;
      
      // Buscar si ya existe este producto con estos mismos extras
      const existing = prev.find(item => item.cartItemId === cartItemId);
      
      if (existing) {
        // Si existe, incrementar cantidad
        return prev.map(item => 
          item.cartItemId === cartItemId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Si no existe, agregar nuevo item al carrito
        return [...prev, { 
          ...product, 
          quantity: 1, 
          selectedExtras: extras,
          cartItemId
        }];
      }
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

  const sendOrder = () => {
    const message = `¡Hola Bajoneras Burger! 🍔%0A%0AQuisiera hacer un pedido:%0A%0A${cart.map(item => {
      const extrasPrice = item.selectedExtras ? item.selectedExtras.reduce((sum, e) => sum + e.price, 0) : 0;
      const itemTotal = (item.price + extrasPrice) * item.quantity;
      let itemText = `• ${item.quantity}x ${item.name}`;
      
      if (item.selectedExtras && item.selectedExtras.length > 0) {
        itemText += `%0A  Extras: ${item.selectedExtras.map(e => e.name).join(', ')}`;
      }
      
      itemText += ` - $${itemTotal.toLocaleString()}`;
      return itemText;
    }).join('%0A')}%0A%0A*Total: $${totalPrice.toLocaleString()}*%0A%0A¡Muchas gracias!`;
    window.open(`https://wa.me/${SHOP_SETTINGS.whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-yellow-400 selection:text-black antialiased overflow-x-hidden">
      
      {/* Modal de Personalización */}
      {customizingProduct && (
        <CustomizationModal
          product={customizingProduct}
          onClose={() => setCustomizingProduct(null)}
          onConfirm={(extras) => addToCartWithExtras(customizingProduct, extras)}
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
            <div className="flex flex-wrap gap-3 justify-center pt-2">
               <Badge color="bg-green-500 font-black text-xs sm:text-sm">{SHOP_SETTINGS.freeDeliveryText}</Badge>
               <Badge color="bg-red-600 font-black text-xs sm:text-sm shadow-red-600/20 shadow-lg">ABIERTOS AHORA</Badge>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 animate-bounce opacity-40">
           <div className="w-1 h-10 rounded-full bg-gradient-to-b from-yellow-400 to-transparent"></div>
        </div>
      </header>

      {/* Navegación Sticky */}
      <nav className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-2xl border-b border-white/5 py-3 sm:py-5 shadow-[0_15px_40px_rgba(0,0,0,0.9)]">
        <div className="max-w-6xl mx-auto px-4">
          {/* Botón hamburguesa para móvil */}
          <div className="flex sm:hidden items-center justify-between">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-3 bg-yellow-400 text-black rounded-xl font-black hover:bg-white transition-all"
            >
              <Menu size={24} />
            </button>
            <span className="font-bebas text-2xl tracking-widest italic">MENÚ</span>
          </div>

          {/* Menú desktop */}
          <div className="hidden sm:block overflow-x-auto no-scrollbar scroll-smooth">
            <div className="flex gap-4 sm:gap-8 justify-start sm:justify-center min-w-max pb-1 sm:pb-0">
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
        {activeCategory === 'Todos' && (
          <section className="mb-20 sm:mb-32">
            <div className="group relative bg-neutral-900 rounded-[2.5rem] sm:rounded-[4rem] p-1 shadow-2xl overflow-hidden hover:shadow-yellow-400/20 transition-all duration-700">
               <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-600 opacity-10 group-hover:opacity-40 transition-opacity"></div>
               <div className="relative bg-neutral-900/95 rounded-[2.4rem] sm:rounded-[3.9rem] p-6 sm:p-16 flex flex-col lg:flex-row items-center gap-10 sm:gap-16">
                  <div className="w-full lg:w-1/2 aspect-video sm:aspect-square rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl relative">
                     <img src={PRODUCTS[0].image} alt="Destacado" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                     <div className="absolute top-4 left-4 sm:top-8 sm:left-8 bg-yellow-400 text-black px-5 py-2 sm:px-8 py-3 rounded-2xl border-4 border-black shadow-2xl">
                        <p className="font-bebas text-2xl sm:text-4xl tracking-widest leading-none uppercase italic">¡BAJÓN DEL MES!</p>
                     </div>
                  </div>
                  <div className="w-full lg:w-1/2 space-y-6 sm:space-y-10 text-center lg:text-left">
                     <h2 className="font-bebas text-5xl sm:text-8xl md:text-9xl leading-[0.9] tracking-tighter italic text-white drop-shadow-lg">COMBO<br/><span className="text-yellow-400">BAJONERO</span></h2>
                     <p className="text-neutral-400 text-lg sm:text-2xl leading-relaxed font-light px-2 sm:px-0">{PRODUCTS[0].description}</p>
                     <div className="flex flex-col items-center lg:items-start gap-6 pt-4">
                        <span className="text-6xl sm:text-7xl lg:text-8xl font-black text-white italic tracking-tighter border-b-4 border-yellow-400 pb-2">${PRODUCTS[0].price.toLocaleString()}</span>
                        <button 
                          onClick={() => handleAddToCart(PRODUCTS[0])}
                          className="bg-yellow-400 text-black py-5 sm:py-7 px-10 sm:px-16 rounded-3xl font-black text-xl sm:text-2xl lg:text-3xl flex items-center justify-center gap-4 hover:bg-white hover:scale-105 transition-all shadow-2xl active:scale-95"
                        >
                          <ShoppingCart size={28} className="sm:w-9 sm:h-9" /> ¡PEDIR YA!
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          </section>
        )}

        <div className="space-y-24 sm:space-y-40">
          {(activeCategory === 'Todos' ? ['Combos', 'Burgers', 'Postres', 'Bebidas'] : [activeCategory]).map(cat => (
             <section key={cat} className="animate-fade-in scroll-mt-28" id={cat.toLowerCase()}>
               <SectionHeading title={cat} />
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-14">
                 {PRODUCTS.filter(p => p.category === cat).map(product => (
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
            onClick={() => setIsCartOpen(true)}
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

      {/* Sidebar del Carrito */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl transition-opacity duration-500" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full sm:max-w-2xl bg-neutral-900 h-full shadow-2xl flex flex-col animate-slide-in-right overflow-hidden border-l border-white/5">
            <div className="p-8 sm:p-12 border-b border-white/10 flex items-center justify-between bg-black/60">
              <div className="flex items-center gap-6">
                <img src={SHOP_SETTINGS.logoUrl} alt="Logo" className="h-16 w-16 sm:h-24 sm:w-24 object-cover rounded-2xl bg-white/5" />
                <h2 className="font-bebas text-5xl sm:text-7xl tracking-widest italic leading-none">CARRITO</h2>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-3 sm:p-5 bg-neutral-800 hover:bg-yellow-400 hover:text-black rounded-2xl transition-all hover:rotate-90">
                <X size={36} className="sm:w-10 sm:h-10" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 sm:p-12 space-y-10 sm:space-y-14 no-scrollbar">
              {cart.length === 0 ? (
                <div className="text-center py-32 opacity-20 flex flex-col items-center">
                  <ShoppingCart size={120} strokeWidth={1} className="mb-12" />
                  <p className="font-bebas text-4xl sm:text-6xl italic tracking-widest">¡PEDÍ ALGO!</p>
                </div>
              ) : (
                cart.map(item => {
                  const extrasPrice = item.selectedExtras ? item.selectedExtras.reduce((sum, e) => sum + e.price, 0) : 0;
                  const itemTotalPrice = item.price + extrasPrice;
                  
                  return (
                    <div key={item.cartItemId} className="flex gap-6 sm:gap-10 items-start animate-fade-in group">
                      <div className="h-24 w-24 sm:h-36 sm:w-36 flex-shrink-0 relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl border border-white/10">
                         <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-lg sm:text-2xl uppercase tracking-tighter mb-2">{item.name}</h4>
                        {item.selectedExtras && item.selectedExtras.length > 0 && (
                          <div className="mb-2 flex flex-wrap gap-2">
                            {item.selectedExtras.map(extra => (
                              <span key={extra.id} className="text-xs bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded-lg font-bold border border-yellow-400/30">
                                +{extra.name}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-yellow-400 font-black text-base sm:text-xl">${itemTotalPrice.toLocaleString()}</p>
                      </div>
                      <div className="flex flex-col items-center gap-4 bg-black/60 p-3 sm:p-5 rounded-2xl border border-white/5">
                        <button onClick={() => handleAddToCart(item)} className="p-2 bg-neutral-800 hover:bg-green-500 rounded-xl transition-all"><Plus size={24}/></button>
                        <span className="font-black text-2xl sm:text-3xl w-10 text-center">{item.quantity}</span>
                        <button onClick={() => removeFromCart(item.cartItemId!)} className="p-2 bg-neutral-800 hover:bg-red-500 rounded-xl transition-all"><Minus size={24}/></button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-8 sm:p-12 bg-black border-t border-white/10 space-y-4 pb-16">
              <div className="space-y-4">
                <div className="flex justify-between text-neutral-500 text-lg sm:text-2xl font-bold uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-3xl sm:text-6xl font-black pt-6 border-t border-white/10">
                  <span className="font-bebas italic tracking-widest">TOTAL</span>
                  <span className="text-yellow-400 italic">${totalPrice.toLocaleString()}</span>
                </div>
              </div>
              <button 
                onClick={sendOrder}
                disabled={cart.length === 0}
                className="w-full bg-green-500 text-black py-6 sm:py-9 rounded-3xl font-black text-2xl sm:text-4xl flex items-center justify-center gap-4 hover:bg-green-400 transition-all active:scale-95 disabled:opacity-20 shadow-2xl uppercase italic"
              >
                <Send size={32} className="sm:w-10 sm:h-10" /> ENVIAR PEDIDO
              </button>
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
          <div className="flex gap-10 sm:gap-16">
            <a href="#" className="p-6 sm:p-10 bg-neutral-900 rounded-[2rem] sm:rounded-[3rem] hover:bg-yellow-400 hover:text-black transition-all hover:-translate-y-4 shadow-2xl border border-white/5"><Instagram size={40} /></a>
            <a href={`https://wa.me/${SHOP_SETTINGS.whatsappNumber}`} className="p-6 sm:p-10 bg-neutral-900 rounded-[2rem] sm:rounded-[3rem] hover:bg-green-500 hover:text-black transition-all hover:-translate-y-4 shadow-2xl border border-white/5"><Phone size={40} /></a>
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
          <p className="text-neutral-500 text-sm sm:text-xl leading-relaxed font-light line-clamp-3 italic opacity-80">{product.description}</p>
        </div>
        
        <div className="flex flex-col items-stretch gap-6">
          <div className="flex flex-col">
             <span className="text-neutral-600 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] mb-1">Precio Final</span>
             <span className="font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tighter italic">${product.price.toLocaleString()}</span>
          </div>
          <button 
            onClick={() => onAdd(product)}
            className="w-full bg-white text-black py-5 sm:py-7 px-6 sm:px-8 rounded-2xl sm:rounded-[2rem] font-black text-base sm:text-xl lg:text-2xl uppercase flex items-center justify-center gap-3 hover:bg-yellow-400 transition-all active:scale-90 shadow-2xl group-hover:translate-y-[-8px] border-4 border-transparent hover:border-black"
          >
            <Plus size={20} className="sm:w-6 sm:h-6 lg:w-8 lg:h-8" /> AGREGAR
          </button>
        </div>
      </div>
    </div>
  );
};
