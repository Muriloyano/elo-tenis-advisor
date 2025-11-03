// src/components/PlayerCombobox.tsx
"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Player } from "../types/index";

interface PlayerComboboxProps {
  players: Player[]; // A lista de todos os jogadores
  value: string;     // O jogador selecionado (o nome)
  onValueChange: (value: string) => void; // A função para mudar o jogador
  disabled?: boolean; // Para desabilitar enquanto o CSV carrega
}

export function PlayerCombobox({ players, value, onValueChange, disabled }: PlayerComboboxProps) {
  const [open, setOpen] = React.useState(false)

  // Encontra o nome completo para exibir no botão
  const getDisplayName = (val: string) => {
    // Encontra o jogador pelo nome completo
    const player = players.find(p => `${p.name_first} ${p.name_last}`.toLowerCase() === val.toLowerCase());
    return player ? `${player.name_first} ${player.name_last}` : "Selecione o jogador...";
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-input border-border/50 text-muted-foreground focus:border-primary transition-colors"
          disabled={disabled}
        >
          {getDisplayName(value)}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      {/* O PopoverContent precisa ter a mesma largura do botão que o abriu */}
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Buscar jogador (ex: Sinner...)" />
          <CommandList>
            <CommandEmpty>Nenhum jogador encontrado.</CommandEmpty>
            <CommandGroup>
              {players.map((player) => {
                // Criamos o nome completo para cada item
                const fullName = `${player.name_first} ${player.name_last}`
                return (
                  <CommandItem
                    key={player.player_id}
                    value={fullName} // O valor de busca é o nome completo
                    onSelect={(currentValue) => {
                      // Quando selecionado:
                      // 1. Atualiza o 'state' do pai (setPlayer1 ou setPlayer2)
                      onValueChange(fullName)
                      // 2. Fecha o popover
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        // Mostra o "check" se este for o jogador selecionado
                        value.toLowerCase() === fullName.toLowerCase() ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {fullName}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}