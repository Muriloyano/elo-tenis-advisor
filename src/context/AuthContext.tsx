// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

// 1. Definir o tipo (interface) para o perfil do usuário
interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  tem_assinatura_ativa: boolean;
}

// 2. Definir o tipo para a função de logout
type LogoutFunction = () => Promise<void>;

// 3. Definir o tipo para o Contexto (o que ele vai fornecer)
interface AuthContextType {
  session: Session | null;
  profile: Profile | null; // O perfil do usuário
  loading: boolean;      // Flag de carregamento
  logout: LogoutFunction; // Função de logout
}

// 4. Criar o Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 5. Criar o Provedor (o componente que vai "envolver" o app)
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true); // Começa true

  // Função de Logout
  const logout: LogoutFunction = async () => {
    setLoading(true); // Mostra o loading ao deslogar
    await supabase.auth.signOut();
    // O onAuthStateChange vai lidar com o resto (setSession/setProfile para null)
  };

  useEffect(() => {
    // Safety Net: Se o Supabase demorar mais de 10s, destrava o app
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 10000);

    // 6. Monitorar mudanças de autenticação (Login, Logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        
        try {
          if (session) {
            // --- USUÁRIO ESTÁ LOGADO ---
            setSession(session);
            
            // Buscar o perfil do usuário no banco de dados
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single(); // Espera UM resultado

            if (error) {
              console.error("AuthContext: Erro ao buscar perfil (RLS?):", error.message);
              setProfile(null); // Perfil não encontrado ou RLS bloqueou
            } else {
              setProfile(data); // Perfil encontrado!
            }

          } else {
            // --- USUÁRIO ESTÁ DESLOGADO ---
            setSession(null);
            setProfile(null);
          }
        } catch (error) {
          console.error("AuthContext: Erro crítico no listener:", error);
          setSession(null);
          setProfile(null);
        } finally {
          // Destrava o app (remove o "Verificando sessão...")
          clearTimeout(safetyTimeout); 
          setLoading(false); 
        }
      }
    );

    // 7. Limpar o listener quando o componente for "desmontado"
    return () => {
      authListener?.subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []); // [] = Rodar apenas uma vez, quando o app carregar

  // 8. Fornecer os valores para os componentes "filhos"
  return (
    <AuthContext.Provider value={{ session, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 9. Criar o "hook" customizado para facilitar o uso
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};