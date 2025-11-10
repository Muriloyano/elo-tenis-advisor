// src/App.tsx (Versão Limpa, Sem Login)
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Nossas páginas
import Index from "./pages/Index"; // A única página que importa
import NotFound from "./pages//NotFound";
// REMOVEMOS: Login, Cadastro, ProtectedRoute, AuthProvider, Pagamento

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* O AuthProvider foi REMOVIDO */}
      <BrowserRouter>
        <Routes>
          {/* A Rota Principal agora carrega o Index DIRETAMENTE */}
          <Route 
            path="/" 
            element={<Index />} 
          />

          {/* As rotas de Login, Cadastro e Pagamento foram REMOVIDAS */}

          {/* Rota de "Não Encontrado" */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;