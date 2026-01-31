import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, Send, Plus, Minus, X, Menu, Phone, Instagram, MapPin, Truck, Store, CreditCard, Banknote, Receipt, Settings } from 'lucide-react';
import { Product, Category, CartItem, Extra, ComboburgerSelection } from './types';
import { useCart, useProducts, useModal } from './hooks';
import { SHOP_SETTINGS, PRODUCTS } from './constants';

import { SectionHeading, ProductCard } from './components/ui';
import { CustomizationModal, ComboCustomizationModal, CartModal } from './components/modals';
import AdminPanel from './components/admin/AdminPanel';

export default function App() {
  // Hooks personalizados
  const { cart, addToCart, removeFromCart, updateQuantity, updateItem, getTotalItems, getTotalPrice, lastAddedId } = useCart();
  const { products, setProducts, updateProducts, loading } = useProducts();

  // Estados locales
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [customizingCombo, setCustomizingCombo] = useState<Product | null>(null);

  // Estados para Edición
  const [editingCartItemId, setEditingCartItemId] = useState<string | null>(null);
  const [editingExtras, setEditingExtras] = useState<Extra[]>([]);
  const [editingNotes, setEditingNotes] = useState('');
  const [editingComboSelection, setEditingComboSelection] = useState<ComboburgerSelection[]>([]);

  const [comboCarouselIndex, setComboCarouselIndex] = useState(0);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Detectar acceso admin
  useEffect(() => {
    const checkAdmin = () => {
      const hash = window.location.hash;
      const urlParams = new URLSearchParams(window.location.search);
      if (hash === '#admin' || urlParams.get('admin') === 'bajoneras2026') {
        setShowAdminPanel(true);
      }
    };

    checkAdmin();
    window.addEventListener('hashchange', checkAdmin);

    return () => window.removeEventListener('hashchange', checkAdmin);
  }, []);

  // Categorías dinámicas con orden específico
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.category as string)));
    const orderMap: { [key: string]: number } = {
      'Combos': 0,
      'Burgers': 1,
      'Postres': 2
    };

    // Ordenar por el mapa, y agregar nuevas categorías al final
    const sortedCategories = uniqueCategories.sort((a, b) => {
      const orderA = orderMap[a] ?? 999;
      const orderB = orderMap[b] ?? 999;
      return orderA - orderB;
    });

    return ['Todos', ...sortedCategories];
  }, [products]);

  // Productos filtrados
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'Todos') return products;
    return products.filter(p => p.category === activeCategory);
  }, [activeCategory, products]);

  // Handlers
  const handleAddToCart = (product: Product) => {
    // INYECCIÓN DE EXTRAS LOCALES:
    // Buscamos la definición local de este producto para usar sus extras actualizados
    // aunque la imagen venga de Supabase.
    let localDef = PRODUCTS.find(p => p.id === product.id);
    if (!localDef) {
      // Fallback por nombre si el ID no coincide
      localDef = PRODUCTS.find(p => p.name.trim().toLowerCase() === product.name.trim().toLowerCase());
    }

    const productWithExtras = localDef ? {
      ...product,
      extras: localDef.extras,
      price: localDef.price // Aseguramos usar el precio local también
    } : product;

    if (productWithExtras.category === 'Combos') {
      setCustomizingCombo(productWithExtras);
    } else if (productWithExtras.extras && productWithExtras.extras.length > 0) {
      setCustomizingProduct(productWithExtras);
    } else {
      addToCart(productWithExtras, [], '');
    }
  };

  const handleEditCartItem = (item: CartItem) => {
    // 1. Cerrar carrito
    setIsCartOpen(false);

    // 2. Setear ID de edición
    setEditingCartItemId(item.cartItemId || null);

    // 3. Buscar definición local (inyección)
    let localDef = PRODUCTS.find(p => p.id === item.id);
    if (!localDef) {
      localDef = PRODUCTS.find(p => p.name.trim().toLowerCase() === item.name.trim().toLowerCase());
    }
    const productWithExtras = localDef ? {
      ...item,
      extras: localDef.extras,
      price: localDef.price
    } : item;

    // 4. Abrir modal correspondiente pre-cargado
    if (item.category === 'Combos') {
      // Para combos, forzamos re-selección desde cero porque el wizard no soporta edición por pasos
      setEditingComboSelection([]);
      setCustomizingCombo(productWithExtras);
    } else {
      setEditingExtras(item.selectedExtras || []);
      setEditingNotes(item.notes || '');
      setCustomizingProduct(productWithExtras);
    }
  };

  const handleAddProductFromCart = (product: Product) => {
    // 1. Cerrar carrito
    setIsCartOpen(false);

    // 2. Usar la lógica de agregar normal para abrir el modal fresco
    // Nota: Como 'product' viene del carrito, ya tiene 'extras' y precio modificado.
    // Necesitamos la definición "original" para empezar de cero, o queremos clonar?
    // El usuario dijo: "ESTA ES UNA NUEVA POR LO QUE TAMBIEN SE LE DEBE PREGUNTAR AL USUARIO SI QUIERE EXTRAS"
    // Esto implica el flujo standard de "Agregar producto".
    // Buscamos el producto original por ID para tener los defaults limpios.

    const originalProduct = PRODUCTS.find(p => p.id === product.id);
    if (originalProduct) {
      handleAddToCart(originalProduct);
    } else {
      // Fallback si no encontramos (raro), usamos el del carrito pero limpiando selections
      // Pero handleAddToCart ya hace inyección anyway.
      handleAddToCart(product);
    }
  };

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-yellow-400 selection:text-black antialiased overflow-x-hidden">

      {/* Modales */}
      {/* Modales */}
      {customizingProduct && (
        <CustomizationModal
          product={customizingProduct}
          initialExtras={editingCartItemId ? editingExtras : []}
          initialNotes={editingCartItemId ? editingNotes : ''}
          confirmLabel={editingCartItemId ? 'GUARDAR CAMBIOS' : 'AGREGAR AL CARRITO'}
          onClose={() => {
            setCustomizingProduct(null);
            setEditingCartItemId(null); // Limpiar si cancela
            if (editingCartItemId) setIsCartOpen(true); // Volver al carrito si estaba editando
          }}
          onConfirm={(extras, notes) => {
            if (editingCartItemId) {
              updateItem(editingCartItemId, { selectedExtras: extras, notes: notes });
              setEditingCartItemId(null);
              setIsCartOpen(true); // Volver al carrito
            } else {
              addToCart(customizingProduct, extras, notes);
            }
            setCustomizingProduct(null);
          }}
        />
      )}

      {customizingCombo && (
        <ComboCustomizationModal
          combo={customizingCombo}
          initialBurgers={editingCartItemId ? editingComboSelection : []}
          confirmLabel={editingCartItemId ? 'GUARDAR CAMBIOS' : 'AGREGAR AL CARRITO'}
          onClose={() => {
            setCustomizingCombo(null);
            setEditingCartItemId(null);
            if (editingCartItemId) setIsCartOpen(true);
          }}
          onConfirm={(burgers) => {
            if (editingCartItemId) {
              updateItem(editingCartItemId, { comboBurgers: burgers });
              setEditingCartItemId(null);
              setIsCartOpen(true);
            } else {
              addToCart(customizingCombo, [], '', burgers);
            }
            setCustomizingCombo(null);
          }}
          products={products}
        />
      )}

      {/* Cart Modal */}
      {isCartOpen && (
        <CartModal
          cart={cart}
          onClose={() => setIsCartOpen(false)}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onEdit={handleEditCartItem}
          onAddProduct={handleAddProductFromCart}
          totalPrice={totalPrice}
        />
      )}

      {/* Header / Hero Section */}
      <header className="relative min-h-[55vh] flex flex-col items-center justify-center bg-black overflow-hidden py-12 sm:py-20">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-fixed bg-center blur-sm scale-110"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-black/20 to-black"></div>

        <div className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-2xl animate-fade-in-up">
          <div className="relative group transition-transform duration-700 hover:scale-105 active:scale-95">
            <div className="absolute inset-0 bg-yellow-400/30 blur-[60px] sm:blur-[120px] rounded-full group-hover:bg-yellow-400/50 transition-all duration-700"></div>

            <div className="relative w-56 h-56 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-white/5 rounded-full overflow-hidden">
              <img
                src={SHOP_SETTINGS.logoUrl}
                alt="Logo"
                className="w-full h-full object-cover animate-float block"
                loading="eager"
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

      {/* Botón hamburguesa móvil */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 sm:hidden p-3 bg-yellow-400 text-black rounded-xl font-black hover:bg-white transition-all shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* Navegación Sticky */}
      <nav className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-2xl border-b border-white/5 py-3 sm:py-5 shadow-[0_15px_40px_rgba(0,0,0,0.9)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex sm:hidden items-center justify-between">
            <span className="font-bebas text-2xl tracking-widest italic">MENÚ</span>
          </div>

          <div className="hidden sm:block overflow-x-auto no-scrollbar scroll-smooth">
            <div className="flex gap-4 sm:gap-8 justify-start sm:justify-center min-w-max pb-1 sm:pb-0 items-center">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 sm:px-10 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 ${activeCategory === cat
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

      {/* Menú móvil */}
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
                  className={`w-full px-6 py-4 rounded-xl font-black text-lg uppercase tracking-widest transition-all ${activeCategory === cat
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
        {/* Carrusel de Combos */}
        {(activeCategory === 'Todos' || activeCategory === 'Combos') && (
          <section className="animate-fade-in scroll-mt-28 mb-24" id="combos-carousel">
            <SectionHeading title="COMBOS" />
            <div className="relative">
              <div className="flex items-center justify-center gap-4 sm:gap-8">
                <button
                  onClick={() => {
                    const combosCount = products.filter(p => p.category === 'Combos').length;
                    setComboCarouselIndex((prev) => (prev - 1 + combosCount) % combosCount);
                  }}
                  className="flex-shrink-0 p-3 sm:p-4 bg-yellow-400 hover:bg-white text-black rounded-full transition-all hover:scale-110 active:scale-90 shadow-lg"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="flex-1 overflow-hidden">
                  <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${comboCarouselIndex * 100}%)` }}>
                    {products.filter(p => p.category === 'Combos').map(product => (
                      <div key={product.id} className="w-full flex-shrink-0">
                        <ProductCard product={product} onAdd={handleAddToCart} isAnimating={lastAddedId === product.id} />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    const combosCount = products.filter(p => p.category === 'Combos').length;
                    setComboCarouselIndex((prev) => (prev + 1) % combosCount);
                  }}
                  className="flex-shrink-0 p-3 sm:p-4 bg-yellow-400 hover:bg-white text-black rounded-full transition-all hover:scale-110 active:scale-90 shadow-lg"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="flex justify-center gap-2 sm:gap-3 mt-6 sm:mt-8">
                {products.filter(p => p.category === 'Combos').map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setComboCarouselIndex(idx)}
                    className={`h-2 sm:h-3 rounded-full transition-all ${idx === comboCarouselIndex
                      ? 'bg-yellow-400 w-8 sm:w-10'
                      : 'bg-neutral-700 w-2 sm:w-3 hover:bg-neutral-600'
                      }`}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Otras Secciones */}
        <div className="space-y-24 sm:space-y-40">
          {(activeCategory === 'Todos'
            ? categories.filter(cat => cat !== 'Todos' && cat !== 'Combos')
            : (activeCategory !== 'Combos' ? [activeCategory] : [])
          ).map(cat => (
            <section key={cat} className="animate-fade-in scroll-mt-28" id={cat.toLowerCase()}>
              <SectionHeading title={cat} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-14">
                {products.filter(p => p.category === cat).map(product => (
                  <ProductCard key={product.id} product={product} onAdd={handleAddToCart} isAnimating={lastAddedId === product.id} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Botón Flotante del Carrito */}
      {totalItems > 0 && !isCartOpen && (
        <button
          onClick={() => {
            setIsCartOpen(true);
          }}
          className="fixed bottom-10 sm:bottom-12 left-0 right-0 mx-auto z-[60] w-[90%] sm:w-auto sm:min-w-[400px] max-w-sm sm:max-w-lg bg-yellow-400 text-black py-4 sm:py-6 rounded-2xl sm:rounded-[2rem] font-black text-xl sm:text-3xl flex items-center justify-between px-6 sm:px-12 shadow-[0_25px_60px_rgba(0,0,0,0.8)] border-4 border-black ring-8 ring-yellow-400/20 hover:scale-[1.05] active:scale-90 transition-all animate-bounce-subtle pointer-events-auto group"
        >
          <div className="relative">
            <ShoppingCart size={32} className="sm:w-10 sm:h-10" />
            <span className="absolute -top-3 -right-3 bg-black text-yellow-400 rounded-full w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm font-bold flex items-center justify-center border-4 border-yellow-400">{totalItems}</span>
          </div>
          <span className="tracking-wider">VER PEDIDO</span>
          <span className="text-lg sm:text-2xl font-black tracking-tighter">${totalPrice.toLocaleString()}</span>
        </button>
      )}

      {/* Panel de Administración */}
      {showAdminPanel && !loading && (
        <AdminPanel
          products={products}
          onClose={() => setShowAdminPanel(false)}
          onSave={async (updatedProducts) => {
            console.log('App: Guardando productos actualizados:', updatedProducts);
            const success = await updateProducts(updatedProducts);
            if (success) {
              setShowAdminPanel(false);
              alert('✅ Cambios guardados exitosamente!');
            } else {
              alert('⚠️ Error al guardar en la base de datos.\n\nVerifica la consola (F12) para más detalles.');
            }
          }}
        />
      )}

      {/* Estilos y Animaciones */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        .font-bebas { font-family: 'Bebas Neue', cursive; }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        .animate-float { animation: float 5s ease-in-out infinite; }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-bounce-subtle { animation: bounce-subtle 2.5s ease-in-out infinite; }
        @keyframes slide-in-left {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-left { animation: slide-in-left 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(80px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        @keyframes pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
        .animate-pop { animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        html { scroll-behavior: smooth; background: #0a0a0a; }
      `}</style>
    </div>
  );
}
