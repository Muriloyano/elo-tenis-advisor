// src/pages/Cadastro.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "../lib/supabaseClient"; // Importamos o Supabase
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";

// Pegamos o nosso token secreto do arquivo .env
// O Vite exige que variáveis de ambiente comecem com "VITE_"
const SECRET_INVITE_TOKEN = import.meta.env.VITE_INVITE_TOKEN;

const Cadastro = () => {
  // States para os novos campos
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteToken, setInviteToken] = useState(""); // State para o token
  
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // --- Verificação do Token ---
    if (!SECRET_INVITE_TOKEN) {
      toast.error("Erro de configuração: Token de convite não definido pelo admin.");
      setIsLoading(false);
      return;
    }

    if (inviteToken !== SECRET_INVITE_TOKEN) {
      toast.error("Token de convite inválido.");
      setIsLoading(false);
      return; // Para a execução
    }
    // --- FIM DA VERIFICAÇÃO ---

    // 1. Criamos o usuário no serviço de Autenticação
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (authError) {
      toast.error(authError.message);
      setIsLoading(false);
      return;
    }

    if (!authData.user) {
      toast.error("Erro ao criar usuário, tente novamente.");
      setIsLoading(false);
      return;
    }

    // 2. Inserimos os dados extras na tabela 'profiles'
    const { error: profileError } = await supabase
      .from('profiles') // O nome da sua tabela
      .insert({ 
        id: authData.user.id, // O ID do usuário que acabamos de criar
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
      });

    if (profileError) {
      toast.error(`Usuário criado, mas falha ao salvar perfil: ${profileError.message}`);
    } else {
      toast.success("Cadastro realizado com sucesso!");
      navigate("/login"); 
    }
    
    setIsLoading(false);
  };

  return (
    // Adicionei py-12 para dar espaço em telas menores
    <div className="min-h-screen bg-gradient-result flex items-center justify-center py-12">
      <Card className="w-full max-w-lg bg-gradient-card border-border/50 shadow-card">
        <form onSubmit={handleCadastro} className="p-6 space-y-5">
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-3xl font-bold text-gradient">Criar Conta</h1>
          </div>
          
          {/* Campos de Perfil */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nome</Label>
              <Input id="firstName" placeholder="Seu nome" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Sobrenome</Label>
              <Input id="lastName" placeholder="Seu sobrenome" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="birthDate">Data de Nascimento</Label>
            <Input id="birthDate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
          </div>
          
          <hr className="border-border/50" />
          
          {/* Campos de Autenticação */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          
          <hr className="border-border/50" />

          {/* Campo do Token */}
          <div className="space-y-2">
            <Label htmlFor="token">Token de Convite</Label>
            <Input id="token" type="password" placeholder="Chave de acesso secreta" value={inviteToken} onChange={(e) => setInviteToken(e.target.value)} required />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Criando..." : "Cadastrar"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Faça Login
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Cadastro;