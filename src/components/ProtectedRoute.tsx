// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { session, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>; // Ou um componente de Spinner
  }

  if (!session) {
    // Usuário não está logado, redireciona para /login
    return <Navigate to="/login" replace />;
  }

  // Usuário está logado, mostra a página
  return <>{children}</>;
};

export default ProtectedRoute;