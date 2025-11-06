// src/pages/Cadastro.tsx
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

const Cadastro = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); 

    try {
      // Tentamos criar o usuário
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (authError) {
        throw authError; 
      }
      if (!authData.user) {
        throw new Error("Erro ao criar usuário, tente novamente.");
      }

      // O '}' extra foi REMOVIDO daqui
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ 
          id: authData.user.id,
          first_name: firstName,
          last_name: lastName,
          birth_date: birthDate,
        });

      if (profileError) {
        throw profileError; 
      }
      
      toast.success("Cadastro realizado com sucesso!");
      navigate("/login"); 

    } catch (error: any) { 
      console.error("Erro no cadastro:", error);
      toast.error(error.message || "Falha no cadastro. Tente novamente.");
    
    } finally { 
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4">
      <Card className="w-full max-w-lg">
        <form onSubmit={handleCadastro}>
          <CardHeader className="items-center text-center">
            <Logo className="w-20 h-20 mb-4" />
            <CardTitle className="text-3xl font-bold">Criar Conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              {/* A LINHA QUEBRADA FOI CORRIGIDA AQUI */}
              <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Criando..." : "Cadastrar"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Faça Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Cadastro;