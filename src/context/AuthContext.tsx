// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

// 1. Criamos uma interface para os dados do seu Perfil
//    (Incluindo a nova coluna!)
interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  tem_assinatura_ativa: boolean; // <-- NOSSA NOVA COLUNA
}

type LogoutFunction = () => Promise<void>;

// 2. Atualizamos o Contexto para incluir o 'profile'
interface AuthContextType {
  session: Session | null;
  profile: Profile | null; // <-- NOVO DADO DO PERFIL
  loading: boolean;
  logout: LogoutFunction;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null); // <-- NOVO ESTADO
  const [loading, setLoading] = useState(true);

  const logout: LogoutFunction = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    // O onAuthStateChange vai lidar com a limpeza do session e profile
  };

  useEffect(() => {
    // 3. Modificamos o useEffect para buscar o Perfil JUNTO com a sessão
    //    Não precisamos mais do getSession(), o onAuthStateChange cuida de tudo.
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          // Usuário está logado, vamos buscar o perfil dele
          setSession(session);
          
          const { data, error } = await supabase
            .from('profiles') // Da sua tabela 'profiles'
            .select('*') // Pega todas as colunas
            .eq('id', session.user.id) // Onde o ID bate com o usuário logado
            .single(); // Esperamos SÓ UM resultado

          if (error) {
            console.error("AuthContext: Erro ao buscar perfil:", error.message);
            setProfile(null);
          } else {
            setProfile(data); // Salva o perfil no estado
          }

        } else {
          // Usuário deslogou, limpar tudo
          setSession(null);
          setProfile(null);
        }
        
        // 4. O carregamento SÓ termina DEPOIS de checar sessão E perfil
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // 5. Passamos o 'profile' para o Provider
  return (
    <AuthContext.Provider value={{ session, profile, loading, logout }}>
      {!loading && children}
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