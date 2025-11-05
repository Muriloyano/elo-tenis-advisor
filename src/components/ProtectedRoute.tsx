// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // 1. AGORA PUXAMOS O 'profile' DO NOSSO CONTEXTO ATUALIZADO
  //    O 'loading' agora espera tanto pela sessão QUANTO pelo perfil
  const { session, profile, loading } = useAuth(); 

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Verificando acesso...</p>
      </div>
    );
  }

  if (!session) {
    // 2. Isso continua igual: sem sessão, vai para o login
    return <Navigate to="/login" replace />;
  }

  // --- 🚨 LÓGICA DO PAYWALL (PLANO B) 🚨 ---

  // 3. Checamos a coluna 'tem_assinatura_ativa' do PERFIL
  //    Não precisamos mais do 'user_metadata'
  const hasActiveSubscription = profile?.tem_assinatura_ativa === true;

  if (hasActiveSubscription) {
    // 4. SE SIM: O usuário pagou. Mostra o simulador.
    return <>{children}</>;
  } else {
    // 5. SE NÃO: Usuário logado, mas não pagou. 
    //    Redireciona para a tela de pagamento.
    return <Navigate to="/pagamento" replace />;
  }
};

export default ProtectedRoute;