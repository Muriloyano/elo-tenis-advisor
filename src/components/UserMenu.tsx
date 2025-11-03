import { useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // 1. Chama a função de logout do AuthContext (que limpa a sessão Supabase)
    await logout();
    // 2. Redireciona o usuário para a página de login
    navigate("/login");
  };

  return (
    // O DropdownMenu será o container do nosso menu sanduíche
    <DropdownMenu>
      {/* O DropdownMenuTrigger será o nosso botão sanduíche */}
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="focus-visible:ring-offset-0 focus-visible:ring-transparent">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir menu do usuário</span>
        </Button>
      </DropdownMenuTrigger>
      
      {/* O DropdownMenuContent é a caixa que aparece ao clicar */}
      <DropdownMenuContent align="end" className="w-56">
        {/* Você pode adicionar outros itens aqui, como "Perfil" ou "Configurações" */}
        
        <DropdownMenuSeparator /> 

        {/* Item de Logout */}
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:bg-red-50">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair (Logout)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}