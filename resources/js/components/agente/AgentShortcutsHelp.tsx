import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useAgentShortcuts } from '@/hooks/useAgentShortcuts';
import { useAgent } from '@/contexts/AgentContext';
import {
  KeyboardIcon,
  ZapIcon,
  InfoIcon
} from 'lucide-react';

export function AgentShortcutsHelp() {
  const { canUseAgent } = useAgent();
  const { shortcuts } = useAgentShortcuts();
  const [open, setOpen] = useState(false);

  if (!canUseAgent) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title="Atajos de teclado del agente"
        >
          <KeyboardIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyboardIcon className="h-5 w-5" />
            Atajos de Teclado del Agente
          </DialogTitle>
          <DialogDescription>
            Usa estos atajos para acceso rápido al agente de inventario
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <ZapIcon className="h-4 w-4" />
              Controles del Chat
            </h4>
            <div className="space-y-2">
              {shortcuts.slice(0, 2).map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {shortcut.description}
                  </span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {shortcut.keys}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Consultas Rápidas</h4>
            <div className="space-y-2">
              {shortcuts.slice(2).map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {shortcut.description}
                  </span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {shortcut.keys}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <InfoIcon className="h-3 w-3 mt-0.5 flex-shrink-0" />
              <span>
                Los atajos funcionan desde cualquier parte del sistema cuando no estés
                escribiendo en un campo de texto.
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Componente para mostrar hint de atajo en el header
export function AgentShortcutHint() {
  const { canUseAgent } = useAgent();

  if (!canUseAgent) {
    return null;
  }

  return (
    <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground">
      <span>Agente:</span>
      <Badge variant="outline" className="font-mono text-xs">
        Ctrl + K
      </Badge>
    </div>
  );
}