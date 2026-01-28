import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = 'lg',
}) => {
  if (!isOpen) return null;
  
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };
  
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose}></div>
      <div className={`relative w-full ${sizeClasses[size]} bg-neutral-900 rounded-[2rem] sm:rounded-[3rem] shadow-2xl animate-fade-in-up overflow-hidden border-2 border-yellow-400/30 my-8`}>
        {/* Header */}
        <div className="p-6 sm:p-8 md:p-10 border-b border-white/10 bg-gradient-to-br from-black to-neutral-900">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-bebas text-3xl sm:text-4xl md:text-5xl tracking-widest italic text-yellow-400 leading-none mb-2">
                {title}
              </h3>
              {subtitle && (
                <p className="text-neutral-400 text-sm sm:text-base font-bold uppercase tracking-wider">
                  {subtitle}
                </p>
              )}
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
        {children}
      </div>
    </div>
  );
};
