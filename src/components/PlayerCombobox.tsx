// src/components/PlayerCombobox.tsx

import * as React from 'react';
import { Player } from "../types"; 
import { ChevronsUpDown, Check } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button"; 
import { cn } from "@/lib/utils"; 

interface PlayerComboboxProps {
  players: Player[];
  value: string; 
  onValueChange: (value: string) => void; 
  disabled: boolean;
}

export function PlayerCombobox({ players, value, onValueChange, disabled }: PlayerComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const getDisplayName = (val: string) => {
    const player = players.find(p => 
      p.player && p.player.toLowerCase() === val.toLowerCase()
    );
    return player ? player.player : "Selecione o jogador...";
  };

  const handleSelect = (currentValue: string) => {
    // Corrigindo um typo da versão anterior (onValueVChange -> onValueChange)
    onValueChange(currentValue === value ? "" : currentValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm",
            "bg-input border-border/50",
            
            // --- CORREÇÃO DA COR DO TEXTO AQUI ---
            // Se tiver um valor, use a cor do card (branco/gelo).
            // Senão, use a cor de "placeholder" (cinza).
            value ? "text-card-foreground" : "text-muted-foreground",
            
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
          disabled={disabled}
        >
          {getDisplayName(value)}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar jogador..." />
          <CommandList>
            <CommandEmpty>Nenhum jogador encontrado.</CommandEmpty>
            <CommandGroup>
              {players.map((player) => (
                <CommandItem
                  key={player.rank}
                  onSelect={() => handleSelect(player.player)} 
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === player.player ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="truncate">
                    {player.player} (ELO: {player.elo})
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}