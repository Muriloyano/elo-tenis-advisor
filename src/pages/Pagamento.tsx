// src/pages/Pagamento.tsx

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import Logo from "../components/Logo";
import { Link } from "react-router-dom"; // Para o botão de "Já paguei"

// --- ⚠️ IMPORTANTE ⚠️ ---
// Troque "SEUNUMERO" abaixo pelo seu número de WhatsApp.
// Use o formato com código do país, sem o "+". Ex: 5511999999999
const WHATSAPP_LINK = "https://wa.me/5544991549878?text=Oi%2C%20quero%20comprar%20o%20acesso%20ao%20ECE%20ELO%20Analyzer%21";

const Pagamento = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Este Card usa a cor azul super-escura 
        que definimos no seu 'index.css' 
      */}
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <Logo className="w-20 h-20 mb-4" />
          <CardTitle className="text-3xl font-bold">Acesso Exclusivo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-card-foreground">
            Seu cadastro foi feito! Para liberar o acesso completo ao analisador,
            o pagamento é feito manualmente via Pix.
          </p>
          <p className="text-lg font-bold text-primary">
            Valor: R$ 29,90 (Mês)
          </p>
          <p className="text-sm text-muted-foreground">
            Clique no botão abaixo para me chamar no WhatsApp,
            enviar o Pix e eu liberarei seu acesso imediatamente.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" asChild>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
              Pagar via WhatsApp
            </a>
          </Button>
          <Button variant="link" asChild>
            {/* Este link leva o usuário de volta ao Login,
              caso ele já tenha pago e precise logar de novo.
            */}
            <Link to="/login">
              Já paguei e quero fazer login
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Pagamento;