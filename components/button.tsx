import React from 'react';
import classNames from 'classnames';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'teal' | 'burgundy' | 'gold' | 'plum';
};

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className, ...props }) => {
  const variantStyles = {
    primary: 'bg-[#00577a] text-white hover:bg-[#004764] shadow-sm',
    teal: 'bg-[#00577a] text-white hover:bg-[#004460] shadow-sm',
    burgundy: 'bg-[#661c33] text-white hover:bg-[#521628] shadow-sm',
    plum: 'bg-[#3d2d30] text-white hover:bg-[#281d20] shadow-sm',
    gold: 'bg-[#d6b129] text-gray-900 hover:bg-[#c29f22] shadow-sm font-bold',
    secondary: 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50',
  };

  return (
    <button
      className={classNames(
        'px-6 py-3 rounded-lg font-sans font-medium transition-all duration-200 cursor-pointer active:scale-95',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
};
