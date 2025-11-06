// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

// ... (as interfaces Profile, LogoutFunction, AuthContextType não mudam) ...
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
  const [loading, setLoading] = useState(true);

  const logout: LogoutFunction = async () => {
    setLoading(true); 
    await supabase.auth.signOut();
  };

  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      setLoading(false); 
    }, 10000); 

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        
        console.log("AuthContext: MUDANÇA DE ESTADO DETECTADA."); // DEBUG

        try {
          if (session) {
            console.log("AuthContext: Sessão encontrada! Buscando perfil para o ID:", session.user.id); // DEBUG
            setSession(session);
            
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id) // A falha deve estar aqui
              .single(); // O .single() falha se não achar NADA

            if (error) {
              // --- ESTE É O PROVÁVEL PROBLEMA ---
              console.error("AuthContext: ERRO AO BUSCAR PERFIL! (Provavelmente '0 rows' ou 'RLS'):", error.message); // DEBUG
              setProfile(null);
            } else {
              console.log("AuthContext: Perfil encontrado e carregado:", data); // DEBUG
              setProfile(data); // Sucesso!
            }

          } else {
            console.log("AuthContext: Sem sessão. Deslogado."); // DEBUG
            setSession(null);
            setProfile(null);
          }
        } catch (error) {
          console.error("AuthContext: Erro crítico no listener:", error);
          setSession(null);
          setProfile(null);
        } finally {
          console.log("AuthContext: 'loading' definido para 'false'."); // DEBUG
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