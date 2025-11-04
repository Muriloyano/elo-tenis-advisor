// src/pages/Login.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../components/Logo"; // <-- Esta importação agora funciona

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Login realizado com sucesso!");
      navigate("/"); 
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-result flex items-center justify-center">
      <Card className="w-full max-w-md bg-gradient-card border-border/50 shadow-card">
        <form onSubmit={handleLogin} className="p-6 space-y-6">
          
          <Logo className="w-20 h-20 mb-4" /> 
          
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gradient">Login</h1>
          </div>
          <div className="space-y-4">
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
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <Link to="/cadastro" className="text-primary hover:underline">
              Cadastre-se
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Login;