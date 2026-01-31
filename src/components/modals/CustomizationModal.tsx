import React, { useState } from 'react';
import { Plus, MessageSquare, Check } from 'lucide-react';
import { Product, Extra } from '../../types';
import { Modal } from '../ui/Modal';

interface CustomizationModalProps {
  product: Product;
  onClose: () => void;
  onConfirm: (extras: Extra[], notes: string) => void;
  initialExtras?: Extra[];
  initialNotes?: string;
  confirmLabel?: string;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  product,
  onClose,
  onConfirm,
  initialExtras = [],
  initialNotes = '',
  confirmLabel = 'AGREGAR AL CARRITO'
}) => {
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>(initialExtras);
  const [productNotes, setProductNotes] = useState(initialNotes);

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
    <Modal
      isOpen={true}
      onClose={onClose}
      title="PERSONALIZA TU PEDIDO"
      subtitle={product.name}
      size="md"
    >
      {/* Extras List */}
      <div className="p-6 sm:p-8 md:p-10 max-h-[40vh] sm:max-h-[45vh] overflow-y-auto space-y-3 sm:space-y-4">
        <p className="text-neutral-500 text-xs sm:text-sm font-bold uppercase tracking-widest mb-4 sm:mb-6">
          Selecciona tus extras
        </p>

        {/* Prominent Cheddar Option */}
        {product.extras?.find(e => e.id === 'extra-doble-cheddar') && (
          <div className="mb-6">
            <button
              onClick={() => toggleExtra(product.extras!.find(e => e.id === 'extra-doble-cheddar')!)}
              className={`w-full p-4 sm:p-5 rounded-2xl border-4 transition-all flex items-center justify-between group relative overflow-hidden ${selectedExtras.some(e => e.id === 'extra-doble-cheddar')
                ? 'bg-yellow-400 border-yellow-400 text-black shadow-[0_0_30px_rgba(250,204,21,0.4)] scale-[1.02]'
                : 'bg-neutral-900 border-yellow-400/30 hover:border-yellow-400 text-white'
                }`}
            >
              <div className="flex items-center gap-4 z-10">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${selectedExtras.some(e => e.id === 'extra-doble-cheddar') ? 'bg-black border-black' : 'border-yellow-400'
                  }`}>
                  {selectedExtras.some(e => e.id === 'extra-doble-cheddar') && <Check size={18} className="text-yellow-400" strokeWidth={4} />}
                </div>
                <div className="text-left">
                  <span className="font-bebas text-2xl sm:text-3xl tracking-wide block leading-none mb-1">¿PINTA DOBLE CHEDDAR? 🧀</span>
                  <span className="text-xs font-bold uppercase opacity-80">¡Hacela todavía más bajonera!</span>
                </div>
              </div>
              <span className={`font-black text-xl sm:text-2xl z-10 ${selectedExtras.some(e => e.id === 'extra-doble-cheddar') ? 'text-black' : 'text-yellow-400'}`}>
                +$1.500
              </span>

              {/* Background gradient hint */}
              {!selectedExtras.some(e => e.id === 'extra-doble-cheddar') && (
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              )}
            </button>
          </div>
        )}

        {product.extras && product.extras.length > 0 ? (
          product.extras
            .filter(e => e.id !== 'extra-doble-cheddar')
            .map(extra => {
              const isSelected = selectedExtras.some(e => e.id === extra.id);
              return (
                <button
                  key={extra.id}
                  onClick={() => toggleExtra(extra)}
                  className={`w-full p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all flex items-center justify-between group ${isSelected
                    ? 'bg-yellow-400 border-yellow-400 text-black shadow-lg scale-105'
                    : 'bg-neutral-800 border-white/10 hover:border-yellow-400/50 hover:bg-neutral-700'
                    }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-black border-black' : 'border-white/20 group-hover:border-yellow-400/50'
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
          <span>{confirmLabel}</span>
        </button>
      </div>
    </Modal>
  );
};
