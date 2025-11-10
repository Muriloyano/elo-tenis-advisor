// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react'; // Mantemos seu loader!

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // 1. SÓ precisamos do 'session' e 'loading'.
  //    Não precisamos mais do 'profile' porque não vamos checar a assinatura.
  const { session, loading } = useAuth(); 

  if (loading) {
    // 2. Usando o seu loading spinner (que você colou)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Verificando acesso...</p>
      </div>
    );
  }

  // 3. Se NÃO estiver logado (sem sessão), vai para o login.
  //    Isso protege o simulador de visitantes anônimos.
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // 4. Se ESTIVER logado (passou pelo 'if' acima), deixa o usuário entrar.
  //    Toda a lógica do 'tem_assinatura_ativa' e do '/pagamento' foi REMOVIDA.
  return <>{children}</>;
};

export default ProtectedRoute;