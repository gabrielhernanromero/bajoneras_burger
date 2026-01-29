import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'font-black uppercase flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl rounded-2xl';
  
  const variantClasses = {
    primary: 'bg-yellow-400 text-black hover:bg-white border-4 border-transparent hover:border-black',
    secondary: 'bg-neutral-800 text-white hover:bg-neutral-700 border-2 border-white/10 hover:border-yellow-400/50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-transparent text-yellow-400 border-2 border-yellow-400 hover:bg-yellow-400 hover:text-black',
  };
  
  const sizeClasses = {
    sm: 'py-3 px-4 text-sm',
    md: 'py-5 sm:py-7 px-6 sm:px-8 text-base sm:text-xl',
    lg: 'py-6 sm:py-8 px-8 sm:px-10 text-lg sm:text-2xl',
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
};
