// src/context/AuthContext.tsx
// Esta é a versão FINAL, à prova de falhas, com try/catch/finally
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

// Interface do Perfil
interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  tem_assinatura_ativa: boolean;
}

type LogoutFunction = () => Promise<void>;

// Interface do Contexto
interface AuthContextType {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  logout: LogoutFunction;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true); // Começa como true

  const logout: LogoutFunction = async () => {
    setLoading(true); // Mostrar loading ao deslogar
    await supabase.auth.signOut();
  };

  useEffect(() => {
    // 1. Iniciar o 'setLoading(false)' após 10 segundos
    //    Isso é um "timeout de segurança"
    const safetyTimeout = setTimeout(() => {
      setLoading(false); // Força o fim do loading se tudo mais falhar
    }, 10000); // 10 segundos

    // 2. Listener normal
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        
        try {
          if (session) {
            setSession(session);
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (error) {
              console.error("AuthContext: Erro ao buscar perfil (RLS?):", error.message);
              setProfile(null);
            } else {
              setProfile(data); // Sucesso!
            }

          } else {
            // Usuário deslogou
            setSession(null);
            setProfile(null);
          }
        } catch (error) {
          console.error("AuthContext: Erro crítico no listener:", error);
          setSession(null);
          setProfile(null);
        } finally {
          // 3. O ponto mais importante:
          clearTimeout(safetyTimeout); // Cancela o timeout de segurança
          setLoading(false); // Para o loading
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
      clearTimeout(safetyTimeout); // Limpa o timeout se o componente for desmontado
    };
  }, []);

  // O {children} aqui está correto (correção da "tela azul")
  return (
    <AuthContext.Provider value={{ session, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};