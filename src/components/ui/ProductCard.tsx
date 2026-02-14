import React from 'react';
import { ShoppingCart, Plus } from 'lucide-react';
import { Product } from '../../types';
import { Badge } from './Badge';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  isAnimating?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd, isAnimating }) => {
  return (
    <div className={`bg-neutral-900 rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden group hover:shadow-[0_40px_100px_rgba(0,0,0,0.95)] transition-all duration-700 flex flex-col border border-white/5 hover:border-yellow-400/30 min-h-[650px] sm:min-h-[800px] ${isAnimating ? 'animate-pop shadow-[0_0_60px_rgba(250,204,21,0.2)]' : ''}`}>
      <div className="relative h-72 sm:h-[450px] overflow-hidden bg-neutral-800">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-[2s]" 
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
             <span className="font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tighter italic">${product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</span>
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
