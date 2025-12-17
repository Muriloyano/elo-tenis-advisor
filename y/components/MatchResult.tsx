import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface AnalysisResult {
  player1: string;
  player2: string;
  elo1: number;
  elo2: number;
  prob1: number;
  prob2: number;
  ev1: number;
  ev2: number;
  odds1: number;
  odds2: number;
  recommendation: string;
}

interface MatchResultProps {
  result: AnalysisResult;
  onBack: () => void;
}

export const MatchResult = ({ result, onBack }: MatchResultProps) => {
  const bestValue = result.ev1 > result.ev2 ? "player1" : result.ev2 > result.ev1 ? "player2" : "none";

  const getEVIcon = (ev: number) => {
    if (ev > 5) return <TrendingUp className="h-5 w-5 text-primary" />;
    if (ev < -5) return <TrendingDown className="h-5 w-5 text-destructive" />;
    return <Minus className="h-5 w-5 text-muted-foreground" />;
  };

  const getEVColor = (ev: number) => {
    if (ev > 5) return "text-primary";
    if (ev > 0) return "text-primary/70";
    if (ev > -5) return "text-muted-foreground";
    return "text-destructive";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* --- CORREÇÃO AQUI ---
        Removido "bg-gradient-card" e "shadow-card".
        Agora ele usará o 'bg-card' (azul escuro) padrão.
      */}
      <Card className="border-border/50 overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2 pb-4 border-b border-border/50">
            {/* --- CORREÇÃO AQUI ---
              Trocado "text-gradient" por "text-card-foreground" 
              (a cor de texto branca/gelo do seu tema).
            */}
            <h2 className="text-2xl font-bold text-card-foreground">Resultado da Análise</h2>
            <p className="text-sm text-muted-foreground">
              {result.player1} vs {result.player2}
            </p>
          </div>

          {/* Elo Ratings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground mb-1">Elo Rating</p>
              <p className="text-2xl font-bold text-foreground">{result.elo1}</p>
              <p className="text-xs text-muted-foreground mt-1">{result.player1}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground mb-1">Elo Rating</p>
              <p className="text-2xl font-bold text-foreground">{result.elo2}</p>
              <p className="text-xs text-muted-foreground mt-1">{result.player2}</p>
            </div>
          </div>

          {/* Probability Bar */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-center text-muted-foreground">
              Probabilidade de Vitória (by Elo)
            </h3>
            <div className="relative h-12 rounded-lg overflow-hidden bg-muted/30">
              {/* --- CORREÇÃO AQUI ---
                Trocado "bg-gradient-primary" por "bg-primary"
                (o verde-limão sólido do seu tema).
              */}
              <div
                className="absolute inset-y-0 left-0 bg-primary flex items-center justify-start px-4 transition-all duration-500"
                style={{ width: `${result.prob1}%` }}
              >
                <span className="text-sm font-bold text-primary-foreground">
                  {result.prob1.toFixed(1)}%
                </span>
              </div>
              <div
                className="absolute inset-y-0 right-0 bg-secondary flex items-center justify-end px-4 transition-all duration-500"
                style={{ width: `${result.prob2}%` }}
              >
                <span className="text-sm font-bold text-secondary-foreground">
                  {result.prob2.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Expected Value Calculation */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-center text-muted-foreground">
              Cálculo do Valor Esperado pelas Odds
            </h3>
            <Card className="bg-muted/20 border-border/30 p-4 space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Fórmula:</span>
                  <span className="text-xs font-mono text-foreground/80">EV = (Prob × Odd) - 1</span>
                </div>
                
                <div className="space-y-2 pt-2 border-t border-border/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getEVIcon(result.ev1)}
                      <span className="text-sm font-medium">{result.player1}</span>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${getEVColor(result.ev1)}`}>
                        {result.ev1 > 0 ? "+" : ""}{result.ev1.toFixed(2)}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        EV = ({result.prob1.toFixed(1)}% × {result.odds1.toFixed(2)}) - 1
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getEVIcon(result.ev2)}
                      <span className="text-sm font-medium">{result.player2}</span>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${getEVColor(result.ev2)}`}>
                        {result.ev2 > 0 ? "+" : ""}{result.ev2.toFixed(2)}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        EV = ({result.prob2.toFixed(1)}% × {result.odds2.toFixed(2)}) - 1
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Conclusion */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-center text-muted-foreground">Conclusão</h3>
            <Card className={`p-4 border-2 ${
              bestValue === "player1" 
                ? "bg-primary/10 border-primary/50" 
                : bestValue === "player2" 
                ? "bg-secondary/10 border-secondary/50" 
                : "bg-muted/20 border-border/50"
            }`}>
              <p className="text-sm text-center leading-relaxed">
                {result.recommendation}
              </p>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 border-t border-border/50">
          <Button
            variant="ghost"
            onClick={onBack}
            className="rounded-none border-r border-border/50 h-14 hover:bg-primary/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Nova Análise
          </Button>
          <div className="flex items-center justify-center px-4">
            <span className="text-sm font-medium text-muted-foreground">
              {bestValue === "player1" ? result.player1 : bestValue === "player2" ? result.player2 : "Sem valor"}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};