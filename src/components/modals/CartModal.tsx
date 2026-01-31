import React, { useState } from 'react';
import { Minus, Plus, Trash2, Send, MapPin, CreditCard, Banknote, User, Receipt, ShoppingCart, Check, X, Pencil } from 'lucide-react';
import { CartItem, Product } from '../../types';
import { WhatsAppService } from '../../services';
import { SHOP_SETTINGS } from '../../constants';

interface CartModalProps {
    cart: CartItem[];
    onClose: () => void;
    onRemove: (id: string) => void;
    onUpdateQuantity: (id: string, delta: number) => void;
    onEdit?: (item: CartItem) => void;
    onAddProduct?: (item: Product) => void;
    totalPrice: number;
}

export const CartModal: React.FC<CartModalProps> = ({
    cart,
    onClose,
    onRemove,
    onUpdateQuantity,
    onEdit,
    onAddProduct,
    totalPrice,
}) => {
    // Estado del paso actual (0: Carrito, 1: Datos, 2: Confirmación)
    const [checkoutStep, setCheckoutStep] = useState(0);

    // Estados del formulario
    const [customerName, setCustomerName] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [betweenStreets, setBetweenStreets] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'transferencia'>('efectivo');

    // Delivery es la única opción por ahora
    const deliveryMethod = 'delivery';

    const handleSendOrder = () => {
        const message = WhatsAppService.generateOrderMessage(
            cart,
            totalPrice,
            deliveryMethod,
            customerAddress,
            paymentMethod,
            customerName,
            betweenStreets
        );

        WhatsAppService.sendOrder(message);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex justify-end">
            {/* Overlay backdrop */}
            <div
                className="absolute inset-0 bg-black/95 backdrop-blur-xl transition-opacity duration-500"
                onClick={onClose}
            />

            {/* Sidebar Container */}
            <div className="relative w-full sm:max-w-2xl bg-neutral-900 h-full shadow-2xl flex flex-col animate-slide-in-right overflow-hidden border-l border-white/5">

                {/* Header con Logo */}
                <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-black/60 gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        {/* Logo Placeholder */}
                        <div className="h-10 w-10 sm:h-16 sm:w-16 rounded-xl bg-yellow-400/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl sm:text-2xl">🍔</span>
                        </div>

                        <div className="min-w-0">
                            <h2 className="font-bebas text-2xl sm:text-5xl tracking-widest italic leading-tight text-white">CHECKOUT</h2>
                            <p className="text-neutral-500 text-[10px] sm:text-xs font-bold tracking-widest uppercase mt-0.5">
                                {checkoutStep === 0 && "PASO 1: SELECCIÓN"}
                                {checkoutStep === 1 && "PASO 2: TUS DATOS"}
                                {checkoutStep === 2 && "PASO 3: CONFIRMAR"}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 sm:p-3 bg-neutral-800 hover:bg-yellow-400 hover:text-black rounded-xl transition-all hover:rotate-90 flex-shrink-0 text-white">
                        <X size={20} className="sm:w-6 sm:h-6" />
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
                            style={{ width: `${((checkoutStep) / 2) * 100}%` }} // Adjusted to fill based on steps 0, 1, 2. 
                        // Step 0: 0% -> might be better to start at some %
                        // Let's use the exact logic from backup: `${(checkoutStep / 2) * 100}%`
                        ></div>
                    </div>
                    <div className="flex justify-between mt-2 sm:mt-3">
                        {[0, 1, 2].map((step) => (
                            <div key={step} className={`flex flex-col items-center gap-1 ${checkoutStep >= step ? 'text-yellow-400' : 'text-neutral-600'}`}>
                                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-black text-xs ${checkoutStep >= step ? 'bg-yellow-400 text-black' : 'bg-neutral-800'}`}>
                                    {step + 1}
                                </div>
                                <span className="text-[9px] sm:text-[10px] font-bold">
                                    {step === 0 ? 'CARRITO' : step === 1 ? 'DATOS' : 'CONFIRMAR'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contenido Principal Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">

                    {/* PASO 0: LISTA DE PRODUCTOS */}
                    {checkoutStep === 0 && (
                        <div className="space-y-6 animate-fade-in">
                            {cart.length === 0 ? (
                                <div className="text-center py-12 text-neutral-500">
                                    <ShoppingCart size={64} className="mx-auto mb-4 opacity-50" />
                                    <p className="text-xl font-bold">Tu carrito está vacío</p>
                                    <button onClick={onClose} className="mt-4 text-yellow-400 hover:text-white font-bold underline">
                                        Volver al menú
                                    </button>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.cartItemId} className="flex gap-4 p-4 bg-neutral-800/50 rounded-2xl border border-white/5 relative group">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl"
                                        />
                                        <div className="flex-1 space-y-2">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-black text-lg sm:text-xl uppercase tracking-wide text-white">{item.name}</h4>
                                                <div className="flex gap-2">
                                                    {onEdit && (
                                                        <button
                                                            onClick={() => item.cartItemId && onEdit(item)}
                                                            className="text-neutral-500 hover:text-yellow-400 transition-colors bg-black/40 p-2 rounded-lg"
                                                            title="Editar extras"
                                                        >
                                                            <Pencil size={18} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => item.cartItemId && onRemove(item.cartItemId)}
                                                        className="text-neutral-500 hover:text-red-500 transition-colors bg-black/40 p-2 rounded-lg"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Extras & Combo Details */}
                                            <div className="text-sm text-neutral-400 space-y-1">
                                                {item.selectedExtras && item.selectedExtras.length > 0 && (
                                                    <p>+ {item.selectedExtras.map(e => e.name).join(', ')}</p>
                                                )}
                                                {item.comboBurgers && item.comboBurgers.length > 0 && (
                                                    <div className="pl-2 border-l-2 border-yellow-400/30 text-xs mt-2 space-y-2">
                                                        {item.comboBurgers.map((burger, idx) => (
                                                            <div key={idx} className="flex flex-col">
                                                                <span className="font-bold text-white">• {burger.burger.name}</span>
                                                                {burger.extras && burger.extras.length > 0 && (
                                                                    <span className="text-yellow-400/80 pl-2">+ {burger.extras.map(e => e.name).join(', ')}</span>
                                                                )}
                                                                {burger.notes && (
                                                                    <span className="text-neutral-500 italic pl-2">"{burger.notes}"</span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {item.notes && <p className="italic text-yellow-400/80">"{item.notes}"</p>}
                                            </div>

                                            <div className="flex justify-between items-end mt-2">
                                                <p className="font-black text-yellow-400 text-xl">
                                                    ${((item.price +
                                                        (item.selectedExtras?.reduce((acc, curr) => acc + curr.price, 0) || 0) +
                                                        (item.comboBurgers?.reduce((acc, burger) =>
                                                            acc + burger.extras.reduce((sum, extra) => sum + extra.price, 0), 0) || 0)
                                                    ) * item.quantity).toLocaleString()}
                                                </p>

                                                <div className="flex items-center gap-3 bg-black rounded-lg p-1 border border-white/10">
                                                    <button
                                                        onClick={() => item.cartItemId && onUpdateQuantity(item.cartItemId, -1)}
                                                        className="p-1 text-white hover:text-yellow-400 transition-colors"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="font-bold w-4 text-center text-white">{item.quantity}</span>
                                                    <button
                                                        onClick={() => {
                                                            if (!item.cartItemId) return;
                                                            if ((item.category === 'Burgers' || item.category === 'Combos') && onAddProduct) {
                                                                onAddProduct(item);
                                                            } else {
                                                                onUpdateQuantity(item.cartItemId, 1);
                                                            }
                                                        }}
                                                        className="p-1 text-white hover:text-yellow-400 transition-colors"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* PASO 1: DATOS DE ENVÍO */}
                    {checkoutStep === 1 && (
                        <div className="space-y-6 animate-fade-in">
                            {/* Nombre */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-white text-sm font-black uppercase tracking-wide">
                                    <User size={18} className="text-yellow-400" /> Tu Nombre <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: Homero Simpson"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="w-full bg-neutral-800 border-2 border-white/10 rounded-xl px-4 py-3 text-white focus:border-yellow-400 focus:outline-none transition-all placeholder:text-neutral-600 font-bold"
                                />
                            </div>

                            {/* Dirección */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-white text-sm font-black uppercase tracking-wide">
                                    <MapPin size={18} className="text-yellow-400" /> Dirección de Entrega <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Calle y Altura (Ej: Av. Siempreviva 742)"
                                    value={customerAddress}
                                    onChange={(e) => setCustomerAddress(e.target.value)}
                                    className="w-full bg-neutral-800 border-2 border-white/10 rounded-xl px-4 py-3 text-white focus:border-yellow-400 focus:outline-none transition-all placeholder:text-neutral-600 font-bold"
                                />
                            </div>

                            {/* Entre Calles */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-white text-sm font-black uppercase tracking-wide">
                                    <MapPin size={18} className="text-yellow-400" /> Entre Calles <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: Entre Calle A y Calle B"
                                    value={betweenStreets}
                                    onChange={(e) => setBetweenStreets(e.target.value)}
                                    className="w-full bg-neutral-800 border-2 border-white/10 rounded-xl px-4 py-3 text-white focus:border-yellow-400 focus:outline-none transition-all placeholder:text-neutral-600 font-bold"
                                />
                            </div>

                            {/* Forma de Pago */}
                            <div className="space-y-2 pt-4 border-t border-white/10">
                                <label className="flex items-center gap-2 text-white text-sm font-black uppercase tracking-wide mb-3">
                                    <CreditCard size={18} className="text-yellow-400" /> Forma de Pago
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setPaymentMethod('efectivo')}
                                        className={`p-3 sm:p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all relative ${paymentMethod === 'efectivo'
                                            ? 'bg-yellow-400 border-yellow-400 text-black shadow-lg scale-105'
                                            : 'bg-neutral-800 border-white/10 hover:bg-neutral-700 text-neutral-400'
                                            }`}
                                    >
                                        <Banknote size={24} className="sm:w-8 sm:h-8" />
                                        <span className="font-bold uppercase text-xs sm:text-base">Efectivo</span>
                                        {paymentMethod === 'efectivo' && (
                                            <div className="absolute top-2 right-2 bg-black rounded-full p-0.5">
                                                <Check size={12} className="text-yellow-400" />
                                            </div>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('transferencia')}
                                        className={`p-3 sm:p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all relative ${paymentMethod === 'transferencia'
                                            ? 'bg-yellow-400 border-yellow-400 text-black shadow-lg scale-105'
                                            : 'bg-neutral-800 border-white/10 hover:bg-neutral-700 text-neutral-400'
                                            }`}
                                    >
                                        <CreditCard size={24} className="sm:w-8 sm:h-8" />
                                        <span className="font-bold uppercase text-xs sm:text-base">Transferencia</span>
                                        {paymentMethod === 'transferencia' && (
                                            <div className="absolute top-2 right-2 bg-black rounded-full p-0.5">
                                                <Check size={12} className="text-yellow-400" />
                                            </div>
                                        )}
                                    </button>
                                </div>
                                {paymentMethod === 'efectivo' && (
                                    <p className="text-center text-xs text-yellow-400 mt-2 font-bold bg-yellow-400/10 py-2 rounded-lg">
                                        Pago en efectivo
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* PASO 2: TICKET DE CONFIRMACIÓN */}
                    {checkoutStep === 2 && (
                        <div className="space-y-6 animate-fade-in pb-8">
                            <div className="bg-white text-black rounded-3xl overflow-hidden shadow-2xl relative mx-auto max-w-md transform rotate-1 hover:rotate-0 transition-transform duration-500">
                                {/* Borde superior */}
                                <div className="h-4 bg-stripes-yellow-black"></div> {/* Simulación visual */}
                                <div className="h-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"></div>

                                {/* Header Ticket */}
                                <div className="bg-neutral-900 text-white p-4 sm:p-6 text-center border-b-2 border-dashed border-neutral-700">
                                    <h3 className="font-bebas text-3xl sm:text-4xl tracking-widest italic text-yellow-400">BAJONERAS</h3>
                                    <p className="text-neutral-400 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em]">Ticket de Pedido</p>
                                </div>

                                {/* Datos Cliente */}
                                <div className="p-6 bg-neutral-50 border-b-2 border-dashed border-neutral-300 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="font-bold text-neutral-600">Cliente:</span>
                                        <span className="font-black truncate max-w-[150px]">{customerName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-bold text-neutral-600">Dirección:</span>
                                        <span className="font-black text-right truncate max-w-[150px]">{customerAddress}</span>
                                    </div>
                                    {betweenStreets && (
                                        <div className="flex justify-between">
                                            <span className="font-bold text-neutral-600">Entre calles:</span>
                                            <span className="font-black text-right truncate max-w-[150px]">{betweenStreets}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="font-bold text-neutral-600">Pago:</span>
                                        <span className="font-black uppercase">{paymentMethod}</span>
                                    </div>
                                </div>

                                {/* Lista Items */}
                                <div className="p-6 bg-white space-y-3">
                                    <p className="font-black text-xs text-neutral-400 uppercase tracking-widest mb-4 border-b pb-2">Detalle</p>
                                    {cart.map(item => (
                                        <div key={item.cartItemId} className="flex justify-between items-start text-sm">
                                            <div className="flex-1 pr-4">
                                                <span className="font-black">{item.quantity}x {item.name}</span>
                                                {item.selectedExtras?.map(e => (
                                                    <div key={e.id} className="text-xs text-neutral-500 pl-2">+ {e.name}</div>
                                                ))}
                                                {/* Detalle de Combos en Ticket */}
                                                {item.comboBurgers?.map((burger, idx) => (
                                                    <div key={idx} className="pl-2 mt-1 border-l border-neutral-300">
                                                        <div className="text-xs font-bold text-neutral-700">{burger.burger.name}</div>
                                                        {burger.extras.map(e => (
                                                            <div key={e.id} className="text-[10px] text-neutral-500 pl-2">+ {e.name}</div>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                            <span className="font-bold">
                                                ${((item.price +
                                                    (item.selectedExtras?.reduce((s, e) => s + e.price, 0) || 0) +
                                                    (item.comboBurgers?.reduce((acc, burger) =>
                                                        acc + burger.extras.reduce((sum, extra) => sum + extra.price, 0), 0) || 0)
                                                ) * item.quantity).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Total */}
                                <div className="p-6 bg-neutral-900 text-white border-t-2 border-dashed border-neutral-700">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bebas text-3xl tracking-widest">TOTAL</span>
                                        <span className="font-black text-4xl text-yellow-400 italic">
                                            ${totalPrice.toLocaleString()}
                                        </span>
                                    </div>

                                </div>

                                {/* Borde inferior */}
                                <div className="h-3 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400"></div>
                            </div>

                            <div className="text-center animate-pulse">
                                <p className="text-green-400 font-bold uppercase tracking-widest text-sm">
                                    ¡Todo listo para enviar!
                                </p>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer con Botones */}
                <div className="p-4 sm:p-8 bg-black border-t border-white/10 space-y-4">
                    {/* Mostrar Total solo en pasos 0 y 1 */}
                    {checkoutStep < 2 && (
                        <div className="flex justify-between items-end mb-4">
                            <span className="font-bebas text-3xl tracking-widest text-white">TOTAL</span>
                            <div className="text-right">
                                <span className="font-black text-4xl text-yellow-400 italic">${totalPrice.toLocaleString()}</span>

                            </div>
                        </div>
                    )}

                    <div className="flex gap-4">
                        {checkoutStep > 0 && (
                            <button
                                onClick={() => setCheckoutStep(prev => prev - 1)}
                                className="px-6 py-4 bg-neutral-800 text-white rounded-2xl font-bold hover:bg-neutral-700 transition-all uppercase"
                            >
                                Volver
                            </button>
                        )}

                        {checkoutStep < 2 ? (
                            <button
                                onClick={() => {
                                    if (checkoutStep === 0 && cart.length > 0) setCheckoutStep(1);
                                    if (checkoutStep === 1 && customerName && customerAddress && betweenStreets) setCheckoutStep(2);
                                }}
                                disabled={
                                    (checkoutStep === 0 && cart.length === 0) ||
                                    (checkoutStep === 1 && (!customerName || !customerAddress || !betweenStreets))
                                }
                                className="flex-1 bg-yellow-400 text-black py-4 rounded-2xl font-black text-xl hover:bg-white transition-all active:scale-95 uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:shadow-[0_0_30px_rgba(250,204,21,0.5)]"
                            >
                                {checkoutStep === 0 ? 'Iniciar Pedido' : 'Ver Ticket'}
                            </button>
                        ) : (
                            <button
                                onClick={handleSendOrder}
                                className="flex-1 bg-green-500 text-white py-4 rounded-2xl font-black text-xl hover:bg-green-400 transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-wide shadow-[0_0_20px_rgba(34,197,94,0.3)] animate-bounce-subtle"
                            >
                                <Send size={24} />
                                Enviar a WhatsApp
                            </button>
                        )}
                    </div>
                </div>

            </div>

            <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .bg-stripes-yellow-black {
           background: repeating-linear-gradient(
             45deg,
             #000,
             #000 10px,
             #facc15 10px,
             #facc15 20px
           );
        }
      `}</style>
        </div>
    );
};
