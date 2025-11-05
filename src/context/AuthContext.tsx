// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

// 1. Criamos uma interface para os dados do seu Perfil
interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  tem_assinatura_ativa: boolean;
}

type LogoutFunction = () => Promise<void>;

// 2. Atualizamos o Contexto para incluir o 'profile'
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
    setLoading(true); // Ativa o loading ao deslogar
    await supabase.auth.signOut();
    // O onAuthStateChange vai lidar com a limpeza
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        
        if (session) {
          // Usuário está logado, vamos buscar o perfil dele
          setSession(session);
          
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
          // Usuário deslogou, limpar tudo
          setSession(null);
          setProfile(null);
        }
        
        // O carregamento SÓ termina DEPOIS de checar sessão E perfil
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // --- 🚨 A CORREÇÃO ESTÁ AQUI 🚨 ---
  // Nós removemos o '{!loading && children}' e trocamos por apenas '{children}'.
  // Isso permite que o ProtectedRoute (que está dentro de 'children')
  // mostre o seu próprio spinner de carregamento.
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