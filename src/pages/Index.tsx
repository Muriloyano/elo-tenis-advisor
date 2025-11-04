// src/pages/Index.tsx
import { useState, useEffect } from "react";
import Papa from "papaparse";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"; 
import { supabase } from "../lib/supabaseClient"; 
import { useAuth } from "../context/AuthContext";
// --- CORREÇÃO DE IMPORTS (Caminhos relativos) ---
import { MatchSimulator, SimulationData } from "../components/MatchSimulator";
import { MatchResult, AnalysisResult } from "../components/MatchResult";
import { Player } from "../types"; 
import { UserMenu } from "@/components/UserMenu"; 
// --- FIM DA CORREÇÃO ---
import Logo from "../components/Logo"; // <-- Importação da Logo (default)

const Index = () => {
  const { loading } = useAuth(); 
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false); 
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false); 

  useEffect(() => {
    const filePath = '/atp_ratings_current.csv'; 
    Papa.parse<Player>(filePath, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const validPlayers = results.data.filter(player => player.player && typeof player.player === 'string'); 
        setAllPlayers(validPlayers); 
        setIsDataLoaded(true);      
        console.log(`Dados do ranking carregados: ${validPlayers.length} jogadores.`);
        toast.success(`Ranking Top ${validPlayers.length} carregado!`);
      },
      error: (error) => {
        console.error("Erro ao carregar o CSV:", error);
        toast.error("Falha ao carregar o ranking. Verifique o arquivo CSV.");
      }
    });
  }, []); 

  // --- Funções de Cálculo (Mantenha as suas) ---
  const calculateEloProbs = (elo1: number, elo2: number) => {
    const eloDiff = elo1 - elo2;
    const prob1 = 1 / (1 + Math.pow(10, -eloDiff / 400));
    const prob2 = 1 - prob1;
    return { prob1: prob1 * 100, prob2: prob2 * 100 };
  };
  const calculateEV = (probability: number, odds: number) => {
    return ((probability / 100) * odds - 1) * 100;
  };
  const getRecommendation = (ev1: number, ev2: number, player1: string, player2: string) => {
    const threshold = 5; 
    if (ev1 > threshold && ev1 > ev2) { 
      return `✓ Aposta de VALOR identificada em ${player1}. O Expected Value positivo de ${ev1.toFixed(2)}% indica que as odds estão favoráveis em relação à probabilidade real baseada no Elo.`;
    } else if (ev2 > threshold && ev2 > ev1) {
      return `✓ Aposta de VALOR identificada em ${player2}. O Expected Value positivo de ${ev2.toFixed(2)}% indica que as odds estão favoráveis em relação à probabilidade real baseada no Elo.`;
    } else if (ev1 > 0 && ev2 > 0) {
      return `Ambos jogadores apresentam EV positivo, mas abaixo do limiar recomendado (${threshold}%). Sugere-se cautela ou aguardar por odds melhores.`;
    } else if (ev1 < 0 && ev2 < 0) {
      return `✗ Nenhuma aposta de valor identificada. Ambos os jogadores apresentam Expected Value negativo, indicando odds desfavoráveis em relação às probabilidades reais baseadas no Elo.`;
    } else {
      const betterPlayer = ev1 > ev2 ? player1 : player2;
      const betterEV = Math.max(ev1, ev2);
      return `${betterPlayer} apresenta melhor EV (${betterEV.toFixed(2)}%), mas está abaixo do limiar ideal para uma aposta de alto valor. Considere com cautela.`;
    }
  };
  const handleSimulate = async (data: SimulationData) => {
    setIsLoading(true);
    const findElo = (playerName: string): number | null => {
      const normalizedName = playerName.trim().toLowerCase();
      const playerFound = allPlayers.find(p => {
        if (typeof p.player !== "string") {
            return false;
        }
        return p.player.toLowerCase() === normalizedName;
      });
      return playerFound ? playerFound.elo : null; 
    };
    const elo1 = findElo(data.player1);
    const elo2 = findElo(data.player2);
    if (elo1 === null || elo2 === null) {
      const notFound = [];
      if (elo1 === null) notFound.push(data.player1);
      if (elo2 === null) notFound.push(data.player2);
      toast.error(`Jogador não encontrado: ${notFound.join(', ')}. Verifique a ortografia.`);
      setIsLoading(false);
      return;
    }
    const { prob1, prob2 } = calculateEloProbs(elo1, elo2);
    const ev1 = calculateEV(prob1, data.odds1);
    const ev2 = calculateEV(prob2, data.odds2);
    const analysisResult: AnalysisResult = {
      player1: data.player1,
      player2: data.player2,
      elo1: elo1,
      elo2: elo2,
      prob1,
      prob2,
      ev1,
      ev2,
      odds1: data.odds1,
      odds2: data.odds2,
      recommendation: getRecommendation(ev1, ev2, data.player1, data.player2),
    };
    setResult(analysisResult);
    toast.success("Análise concluída!");
    setIsLoading(false);
  };
  // --- Fim das funções ---

  const handleBack = () => {
    setResult(null);
  };

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="ml-4 text-muted-foreground">Verificando sessão...</p>
          </div>
      );
  }

  return (
    // Fundo da página (azul claro)
    // Removido 'bg-gradient-result'
    <div className="relative min-h-screen">
      
      <div className="fixed top-4 right-4 z-50"> 
          <UserMenu />
      </div>

      {/* Padding-top para o menu fixo */}
      <div className="container max-w-2xl mx-auto px-4 py-8 md:py-12 pt-20"> 
        
        {/* Logo centralizada acima do simulador */}
        <Logo className="w-20 h-20 mb-6 mx-auto" /> 
        
        {!result ? (
          <MatchSimulator 
            onSimulate={handleSimulate} 
            isLoading={isLoading}
            isDataLoading={!isDataLoaded}
            allPlayers={allPlayers}
          />
        ) : (
          <MatchResult result={result} onBack={handleBack} />
        )}
      </div>

      {/* Elementos decorativos (blur) removidos */}
    </div>
  );
};

export default Index;