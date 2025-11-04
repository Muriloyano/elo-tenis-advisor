// src/components/PlayerCombobox.tsx

import * as React from 'react';
import { Player } from "../types"; // Importamos o tipo Player
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
import { cn } from "@/lib/utils"; // Ferramenta para juntar classes Tailwind

interface PlayerComboboxProps {
  players: Player[];
  value: string; // Valor selecionado
  onValueChange: (value: string) => void; 
  disabled: boolean;
}

export function PlayerCombobox({ players, value, onValueChange, disabled }: PlayerComboboxProps) {
  const [open, setOpen] = React.useState(false);

  // CORRIGIDO: Agora usa player.player, que é o nome completo
  const getDisplayName = (val: string) => {
    const player = players.find(p => 
      p.player && p.player.toLowerCase() === val.toLowerCase()
    );
    return player ? player.player : "Selecione o jogador...";
  };

  const handleSelect = (currentValue: string) => {
    onValueChange(currentValue === value ? "" : currentValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {/* CORRIGIDO: Exibe o nome completo usando a função corrigida */}
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
                  // O valor que é salvo no estado é o nome completo (player.player)
                  onSelect={() => handleSelect(player.player)} 
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === player.player ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {/* CORRIGIDO: Exibe apenas o player.player */}
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