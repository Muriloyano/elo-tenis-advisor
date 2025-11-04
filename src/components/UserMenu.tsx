// src/components/UserMenu.tsx
import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // CORRIGIDO: import do contexto
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu() {
  const { logout } = useAuth(); // Pega a função logout
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.info("Sessão encerrada.");
    navigate("/login"); 
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="focus-visible:ring-offset-0 focus-visible:ring-transparent">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir menu do usuário</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem disabled>
          <span>Usuário: {/* Nome do usuário aqui se for implementado */}</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator /> 

        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:bg-red-50">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair (Logout)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}