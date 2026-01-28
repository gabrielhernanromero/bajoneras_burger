import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, color = "bg-yellow-400" }) => (
  <span className={`${color} text-black text-[10px] sm:text-[11px] font-bold px-2 sm:px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm whitespace-nowrap`}>
    {children}
  </span>
);
