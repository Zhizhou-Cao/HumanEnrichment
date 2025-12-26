
import React from 'react';

interface HandDrawnBoxProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  color?: string;
}

export const HandDrawnBox: React.FC<HandDrawnBoxProps> = ({ children, className = '', style, onClick, color = '#fff' }) => {
  return (
    <div 
      onClick={onClick}
      className={`relative group hand-drawn ${onClick ? 'cursor-pointer active:scale-95' : ''} ${className}`}
      style={{ ...style }}
    >
      <div 
        className="absolute inset-0 border-2 border-black/80 rounded-lg transform -rotate-1 group-hover:rotate-0 transition-transform"
        style={{ 
          backgroundColor: color,
          borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
        }}
      ></div>
      <div className="relative p-4 z-10 text-gray-800 font-bold">
        {children}
      </div>
    </div>
  );
};
