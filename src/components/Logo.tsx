import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <img 
      src="./logo.jpeg" // Caminho para a imagem na pasta 'public'
      alt="ELO Tennis Advisor Logo" 
      // CORRIGIDO: Removido 'rounded-full' e 'mx-auto' (controlamos no componente pai)
      // Adicionado 'rounded-lg' para suavizar as bordas
      className={cn("w-24 h-24 rounded-lg", className)} 
    />
  );
}

export default Logo;
