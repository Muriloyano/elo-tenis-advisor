// src/components/Logo.tsx
import Image from 'logo.jpeg'; // Se você estiver usando Next.js, caso contrário use <img>
import React from 'react';

interface LogoProps {
  width?: number; // Largura opcional para flexibilidade
  height?: number; // Altura opcional
  className?: string; // Classes adicionais para estilização
}

const Logo: React.FC<LogoProps> = ({ width = 80, height = 80, className }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {/* Se estiver usando Next.js, use o componente Image */}
      {/* <Image 
        src="/path/to/your/logo.png" // CUIDADO: Este caminho é importante!
        alt="ELO Tennis Advisor Logo"
        width={width}
        height={height}
        priority 
      /> */}

      {/* Se não estiver usando Next.js, use a tag <img> */}
      <img 
        src="/elo-tennis-logo.png" // CUIDADO: Este caminho é importante!
        alt="ELO Tennis Advisor Logo"
        width={width}
        height={height}
      />
    </div>
  );
};

export default Logo;