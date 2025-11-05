// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react'; // <-- Para um spinner de loading melhor

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // O 'session' do Supabase contém o 'user', 
  // e o 'user' contém o 'user_metadata'
  const { session, loading } = useAuth(); 

  if (loading) {
    // --- MELHORIA DE UX ---
    // Troquei o texto por um spinner centralizado
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Verificando acesso...</p>
      </div>
    );
  }

  if (!session) {
    // Usuário não está logado, redireciona para /login
    return <Navigate to="/login" replace />;
  }

  // --- 🚨 LÓGICA DO PAYWALL ADICIONADA AQUI 🚨 ---

  // 1. Pegamos o "metadata" do usuário 
  //    (onde VOCÊ vai adicionar a permissão manualmente)
  const metadata = session.user.user_metadata;

  // 2. Checamos se a chave "tem_assinatura_ativa" existe e é 'true'
  //    Usamos '===' para ter certeza.
  const hasActiveSubscription = metadata?.tem_assinatura_ativa === true;

  if (hasActiveSubscription) {
    // 3. SE SIM: O usuário pagou. Mostra a página (o simulador).
    return <>{children}</>;
  } else {
    // 4. SE NÃO: O usuário está logado, mas não pagou. 
    //    Redireciona para a tela de pagamento que criamos.
    return <Navigate to="/pagamento" replace />;
  }
};

export default ProtectedRoute;