// src/pages/Login.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"; 
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../components/Logo";
import "../index.css"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // 1. O loading começa

    // --- 🚨 CORREÇÃO APLICADA AQUI 🚨 ---
    try {
      // 2. Tentamos fazer o login
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        // 3. Se o Supabase deu um erro (ex: senha errada)
        toast.error(error.message);
      } else {
        // 4. Se deu tudo certo
        toast.success("Login realizado com sucesso!");
        navigate("/"); // Redireciona para a home (onde o ProtectedRoute vai pegar)
      }

    } catch (unknownError) {
      // 5. Se deu um erro INESPERADO (ex: rede caiu)
      console.error("Erro inesperado no login:", unknownError);
      toast.error("Ocorreu um erro inesperado. Tente novamente.");

    } finally {
      // 6. (A MÁGICA)
      // Este bloco roda NÃO IMPORTA O QUE ACONTEÇA (sucesso ou erro).
      // Isso garante que o "travamento" nunca mais aconteça.
      setIsLoading(false); 
    }
    // --- FIM DA CORREÇÃO ---
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <form onSubmit={handleLogin}>
          <CardHeader className="items-center text-center">
            <Logo className="w-20 h-20 mb-4" /> 
            <CardTitle className="text-3xl font-bold">Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Link to="/cadastro" className="font-medium text-primary hover:underline">
                Cadastre-se
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;