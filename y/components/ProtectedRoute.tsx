// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react'; // Mantemos o seu loader!

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { session, loading } = useAuth(); 

  if (loading) {
    // 2. A usar o seu loading spinner, MAS SEM O TEXTO
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        {/* O texto "Verificando acesso..." foi removido daqui */}
      </div>
    );
  }

  // 3. Se NÃO estiver logado (sem sessão), vai para o login.
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // 4. Se ESTIVER logado, deixa o utilizador entrar.
  return <>{children}</>;
};

export default ProtectedRoute;