// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  tem_assinatura_ativa: boolean;
}

type LogoutFunction = () => Promise<void>;

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
  const [loading, setLoading] = useState(true); // Começa true

  const logout: LogoutFunction = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    // O onAuthStateChange (abaixo) irá lidar com a mudança
    // e o 'finally' lá em baixo irá destravar o ecrã
  };

  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 10000); // 10 segundos

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {

        try {
          if (session) {
            // --- UTILIZADOR ESTÁ LOGADO ---
            setSession(session);

            // Buscar o perfil do utilizador
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single(); 

            if (error) {
              console.error("AuthContext: Erro ao buscar perfil:", error.message);
              setProfile(null);
            } else {
              setProfile(data);
            }

          } else {
            // --- UTILIZADOR ESTÁ DESLOGADO ---
            setSession(null);
            setProfile(null);
          }
        } catch (error) {
          console.error("AuthContext: Erro crítico no listener:", error);
          setSession(null);
          setProfile(null);
        } finally {
          // --- ESTA É A CORREÇÃO ---
          // Não importa o que aconteça, para o "loading"
          clearTimeout(safetyTimeout); 
          setLoading(false); 
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []); 

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