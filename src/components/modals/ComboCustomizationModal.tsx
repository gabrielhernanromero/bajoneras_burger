import React, { useState } from 'react';
import { Check, MessageSquare } from 'lucide-react';
import { Product, Extra, ComboburgerSelection } from '../../types';
import { Modal } from '../ui/Modal';
import { PRODUCTS } from '../../constants';

interface ComboCustomizationModalProps {
  combo: Product;
  onClose: () => void;
  onConfirm: (burgers: ComboburgerSelection[]) => void;
  products: Product[];
  initialBurgers?: ComboburgerSelection[];
  confirmLabel?: string;
}

export const ComboCustomizationModal: React.FC<ComboCustomizationModalProps> = ({
  combo,
  onClose,
  onConfirm,
  products,
  initialBurgers = [],
  confirmLabel = 'AGREGAR AL CARRITO'
}) => {
  const burgersCount = (combo.id === 'combo-bajonero-compartir' || combo.name.toLowerCase().includes('compartir')) ? 2 : 1;
  const availableBurgers = products
    .filter(p => p.category === 'Burgers')
    .map(burger => {
      // INYECCIÓN DE EXTRAS LOCALES (IGUAL QUE EN APP.TSX):
      let localDef = PRODUCTS.find(p => p.id === burger.id);
      if (!localDef) {
        localDef = PRODUCTS.find(p => p.name.trim().toLowerCase() === burger.name.trim().toLowerCase());
      }
      return localDef ? { ...burger, extras: localDef.extras, price: localDef.price } : burger;
    });

  const [selectedBurgers, setSelectedBurgers] = useState<ComboburgerSelection[]>(initialBurgers);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentBurgerSelection, setCurrentBurgerSelection] = useState<Product | null>(null);
  const [currentExtras, setCurrentExtras] = useState<Extra[]>([]);
  const [currentNotes, setCurrentNotes] = useState('');

  const formatExtraPrice = (price?: number) => (Number(price) || 0).toLocaleString();
  const cheddarExtra = currentBurgerSelection?.extras?.find(e => e.id === 'extra-doble-cheddar');

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

  const totalExtrasPrice = currentExtras.reduce((sum, e) => sum + (Number(e.price) || 0), 0);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="PERSONALIZA TU COMBO"
      subtitle={combo.name}
      size="xl"
    >
      <div className="p-6 sm:p-8 md:p-10">
        <p className="text-yellow-400 text-xs sm:text-sm font-bold mb-6">
          Paso {currentStep + 1} de {burgersCount}: Elegí tu {burgersCount === 2 ? (currentStep === 0 ? 'primera' : 'segunda') : ''} hamburguesa
        </p>

        {/* Content */}
        <div className="max-h-[50vh] overflow-y-auto space-y-6">
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
                  {/* Prominent Cheddar Option for Combo */}
                  {cheddarExtra && (
                    <div className="mb-4">
                      <button
                        onClick={() => toggleExtra(cheddarExtra)}
                        className={`w-full p-4 rounded-xl border-4 transition-all flex items-center justify-between group relative overflow-hidden ${currentExtras.some(e => e.id === 'extra-doble-cheddar')
                          ? 'bg-yellow-400 border-yellow-400 text-black shadow-[0_0_20px_rgba(250,204,21,0.4)] scale-[1.02]'
                          : 'bg-neutral-900 border-yellow-400/30 hover:border-yellow-400 text-white'
                          }`}
                      >
                        <div className="flex items-center gap-3 z-10">
                          <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${currentExtras.some(e => e.id === 'extra-doble-cheddar') ? 'bg-black border-black' : 'border-yellow-400'
                            }`}>
                            {currentExtras.some(e => e.id === 'extra-doble-cheddar') && <Check size={16} className="text-yellow-400" strokeWidth={4} />}
                          </div>
                          <div className="text-left">
                            <span className="font-bebas text-xl sm:text-2xl tracking-wide block leading-none mb-0.5">¿PINTA DOBLE CHEDDAR? 🧀</span>
                          </div>
                        </div>
                        <span className={`font-black text-lg sm:text-xl z-10 ${currentExtras.some(e => e.id === 'extra-doble-cheddar') ? 'text-black' : 'text-yellow-400'}`}>
                          +${formatExtraPrice(cheddarExtra.price)}
                        </span>

                        {/* Background gradient hint */}
                        {!currentExtras.some(e => e.id === 'extra-doble-cheddar') && (
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        )}
                      </button>
                    </div>
                  )}

                  <div className="space-y-3">
                    {currentBurgerSelection.extras
                      .filter(e => e.id !== 'extra-doble-cheddar')
                      .map(extra => {
                        const isSelected = currentExtras.some(e => e.id === extra.id);
                        return (
                          <button
                            key={extra.id}
                            onClick={() => toggleExtra(extra)}
                            className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${isSelected
                              ? 'bg-yellow-400 border-yellow-400 text-black shadow-lg'
                              : 'bg-neutral-800 border-white/10 hover:border-yellow-400/50 hover:bg-neutral-700'
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-black border-black' : 'border-white/20 group-hover:border-yellow-400/50'
                                }`}>
                                {isSelected && <Check size={14} className="text-yellow-400" />}
                              </div>
                              <span className="font-black text-sm sm:text-base uppercase">{extra.name}</span>
                            </div>
                            <span className={`font-black text-base sm:text-lg ${isSelected ? 'text-black' : 'text-yellow-400'}`}>
                              +${formatExtraPrice(extra.price)}
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
          <div className="mt-6">
            <button
              onClick={confirmCurrentBurger}
              className="w-full bg-yellow-400 text-black py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-white transition-all active:scale-95 shadow-2xl uppercase tracking-wide"
            >
              <Check size={24} />
              <span>{selectedBurgers.length + 1 < burgersCount ? 'CONFIRMAR Y ELEGIR LA SIGUIENTE' : confirmLabel}</span>
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
