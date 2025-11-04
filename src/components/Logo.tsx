// src/components/Logo.tsx
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

// Criamos o componente
const Logo = ({ className }: LogoProps) => {
  return (
    <img 
      src="/logo.jpeg" // O caminho para a imagem na pasta 'public'
      alt="ELO Tennis Advisor Logo" 
      // CORRIGIDO: 'rounded-lg' para suavizar as bordas (em vez de 'rounded-full')
      // Adicionamos 'mx-auto' para centralizar por padrão
      className={cn("w-24 h-24 rounded-lg mx-auto", className)} 
    />
  );
}

// Usamos 'export default' para corrigir o erro de importação que você teve
export default Logo;