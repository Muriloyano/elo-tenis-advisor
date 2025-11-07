// src/pages/Cadastro.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Logo from "../components/Logo";
import "../index.css";

const Cadastro = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); // Trava o botão
    toast.loading("Criando sua conta...");

    try {
      // 1. Criar o usuário na Autenticação
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        throw authError; // Joga o erro para o catch
      }

      if (!authData.user) {
        throw new Error("Falha ao criar usuário, tente novamente.");
      }

      // 2. Inserir o perfil no banco de dados
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id, // Usa o ID do usuário criado
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
        tem_assinatura_ativa: false, // Padrão
      });

      if (profileError) {
        // Se o perfil falhar, o usuário ainda existe, mas logamos o erro
        console.error("Erro ao criar perfil:", profileError.message);
        // O RLS (new row violates...) que vimos antes cairia aqui
        throw profileError; 
      }

      toast.dismiss();
      toast.success("Conta criada com sucesso!");
      
      // Como a confirmação de email está desativada, o signUp já loga o usuário.
      // Navegamos para o /pagamento para o ProtectedRoute redirecionar.
      navigate("/pagamento");

    } catch (error: any) {
      toast.dismiss();
      console.error("Erro no cadastro:", error.message);

      let userMessage = "Falha ao criar conta. Tente novamente.";
      if (error.message.includes("User already registered")) {
        userMessage = "Este email já está cadastrado.";
      } else if (error.message.includes("violates row-level security policy")) {
        userMessage = "Erro de permissão ao criar perfil. (RLS)";
      } else if (error.message.includes("Password should be at least 6 characters")) {
        userMessage = "A senha deve ter pelo menos 6 caracteres.";
      }
      toast.error(userMessage);

    } finally {
      // --- ESTA É A CORREÇÃO ---
      // Garante que o botão seja destravado, não importa o que aconteça.
      setIsLoading(false);
      // --- FIM DA CORREÇÃO ---
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg">
        <div className="text-center">
          <Logo className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground">Criar Conta</h1>
          <p className="text-muted-foreground">
            Preencha seus dados para começar.
          </p>
        </div>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-muted-foreground"
              >
                Nome
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-muted-foreground"
              >
                Sobrenome
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="birthDate"
              className="block text-sm font-medium text-muted-foreground"
            >
              Data de Nascimento
            </label>
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              required
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-muted-foreground"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-muted-foreground"
            >
              Senha (mín. 6 caracteres)
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-background bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isLoading ? "Criando conta..." : "Criar conta"}
          </button>
        </form>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Faça Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;