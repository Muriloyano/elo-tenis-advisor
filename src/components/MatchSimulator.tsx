// src/components/MatchSimulator.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Ainda usamos para as Odds
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Player } from "../types"; // <-- Certifique-se que este caminho está correto
import { PlayerCombobox } from "./PlayerCombobox"; 

interface MatchSimulatorProps {
  onSimulate: (data: SimulationData) => void;
  isLoading: boolean;
  isDataLoading: boolean;
  allPlayers: Player[]; 
}

// =================================================================
//
// AQUI ESTÁ A PARTE QUE PROVAVELMENTE ESTAVA EM FALTA
// O 'export' faz com que o 'Index.tsx' a consiga importar.
//
export interface SimulationData {
  player1: string;
  player2: string;
  odds1: number;
  odds2: number;
}
//
// =================================================================

export const MatchSimulator = ({ 
  onSimulate, 
  isLoading, 
  isDataLoading,
  allPlayers 
}: MatchSimulatorProps) => {

  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [odds1, setOdds1] = useState("");
  const [odds2, setOdds2] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!player1 || !player2 || !odds1 || !odds2) {
      toast.error("Preencha todos os campos");
      return;
    }

    const odds1Num = parseFloat(odds1);
    const odds2Num = parseFloat(odds2);

    if (isNaN(odds1Num) || isNaN(odds2Num) || odds1Num <= 1 || odds2Num <= 1) {
      toast.error("Odds devem ser maiores que 1.00");
      return;
    }
    
    onSimulate({
      player1: player1.trim(),
      player2: player2.trim(),
      odds1: odds1Num,
      odds2: odds2Num,
    });
  };

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-gradient">Simular Confronto</h1>
          <p className="text-muted-foreground text-sm">
            Análise baseada em Elo Rating do Tennis Abstract
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="player1" className="text-sm font-medium">
              Jogador 1
            </Label>
            <PlayerCombobox 
              players={allPlayers}
              value={player1}
              onValueChange={setPlayer1}
              disabled={isDataLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="odds1" className="text-sm font-medium">
              Odd Jogador 1
            </Label>
            <Input
              id="odds1"
              type="number"
              step="0.01"
              placeholder="Ex: 1.85"
              value={odds1}
              onChange={(e) => setOdds1(e.target.value)}
              className="bg-input border-border/50 focus:border-primary transition-colors"
              disabled={isDataLoading}
            />
          </div>
        </div>

        <div className="relative py-4">
          {/* ... (código do VS) ... */}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="player2" className="text-sm font-medium">
              Jogador 2
            </Label>
            <PlayerCombobox 
              players={allPlayers}
              value={player2}
              onValueChange={setPlayer2}
              disabled={isDataLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="odds2" className="text-sm font-medium">
              Odd Jogador 2
            </Label>
            <Input
              id="odds2"
              type="number"
              step="0.01"
              placeholder="Ex: 2.10"
              value={odds2}
              onChange={(e) => setOdds2(e.target.value)}
              className="bg-input border-border/50 focus:border-primary transition-colors"
              disabled={isDataLoading}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading || isDataLoading}
          className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 text-primary-foreground font-semibold py-6 text-lg"
        >
          {isDataLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Carregando ranking...
            </>
          ) : isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Analisando...
            </>
          ) : (
            "Simular"
          )}
        </Button>
      </form>
    </Card>
  );
};