// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

// Definimos o tipo da nossa função de logout
type LogoutFunction = () => Promise<void>;

// Definimos o tipo do nosso contexto (AuthContextType)
interface AuthContextType {
  session: Session | null;
  loading: boolean;
  logout: LogoutFunction; // <-- ADICIONADO: A função de logout
}

// Criamos o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Criamos o "Provedor" do contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // --- FUNÇÃO LOGOUT CRIADA AQUI ---
  const logout: LogoutFunction = async () => {
    // O onAuthStateChange (no useEffect) vai capturar este evento
    // e setar o session para null, acionando o redirecionamento.
    setLoading(true);
    await supabase.auth.signOut();
  };
  // --- FIM DA CRIAÇÃO ---

  useEffect(() => {
    // 1. Pega a sessão atual, se existir
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. "Escuta" mudanças no estado de autenticação (login, logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    // Limpa o "escutador" quando o componente for desmontado
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    // Fornecemos 'logout' junto com 'session' e 'loading'
    <AuthContext.Provider value={{ session, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Criamos um "hook" customizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};