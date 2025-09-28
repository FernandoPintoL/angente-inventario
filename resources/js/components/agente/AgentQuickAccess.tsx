import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAgent } from '@/contexts/AgentContext';
import {
  BotIcon,
  MessageSquareIcon,
  ZapIcon,
  PackageIcon,
  AlertTriangleIcon,
  TrendingUpIcon,
  ClockIcon,
  HistoryIcon,
  SparklesIcon,
  SearchIcon
} from 'lucide-react';

export function AgentQuickAccess() {
  const {
    agentHealth,
    canUseAgent,
    openChat,
    setQuickQuery,
    toggleChat
  } = useAgent();

  const [isOpen, setIsOpen] = useState(false);

  if (!canUseAgent) {
    return null;
  }

  const quickQueries = [
    {
      icon: PackageIcon,
      label: "Stock por almacén",
      query: "¿Cuál es el stock total por almacén?",
      description: "Ver distribución de inventario"
    },
    {
      icon: AlertTriangleIcon,
      label: "Stock bajo",
      query: "Muéstrame productos con stock bajo",
      description: "Productos que necesitan reabastecimiento"
    },
    {
      icon: TrendingUpIcon,
      label: "Más vendidos",
      query: "¿Cuáles son los productos más vendidos este mes?",
      description: "Análisis de productos top"
    },
    {
      icon: ClockIcon,
      label: "Por vencer",
      query: "¿Qué productos están próximos a vencer?",
      description: "Control de fechas de vencimiento"
    }
  ];

  const handleQuickQuery = (query: string) => {
    setQuickQuery(query);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative flex items-center gap-2 h-9 px-3"
        >
          <div className="relative">
            <BotIcon className="h-4 w-4" />
            {agentHealth.status === 'healthy' && (
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            )}
          </div>
          <span className="hidden sm:inline text-sm font-medium">Agente</span>
          <Badge
            variant={agentHealth.status === 'healthy' ? 'default' : 'secondary'}
            className="hidden md:inline-flex h-5 px-1.5 text-xs"
          >
            {agentHealth.status === 'healthy' ? 'ON' : 'OFF'}
          </Badge>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center gap-2">
          <BotIcon className="h-4 w-4" />
          Agente de Inventario
          <Badge
            variant={agentHealth.status === 'healthy' ? 'default' : 'destructive'}
            className="ml-auto"
          >
            {agentHealth.status === 'healthy' ? 'Conectado' : 'Desconectado'}
          </Badge>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={toggleChat} className="flex items-center gap-2">
          <MessageSquareIcon className="h-4 w-4" />
          <div>
            <div className="font-medium">Abrir Chat</div>
            <div className="text-xs text-muted-foreground">Conversación completa</div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="flex items-center gap-2 text-xs">
          <ZapIcon className="h-3 w-3" />
          Consultas Rápidas
        </DropdownMenuLabel>

        {quickQueries.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => handleQuickQuery(item.query)}
            className="flex items-start gap-3 py-3 cursor-pointer"
          >
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <item.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-sm">{item.label}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">
                {item.description}
              </div>
            </div>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            openChat();
            setIsOpen(false);
          }}
          className="flex items-center gap-2"
        >
          <SearchIcon className="h-4 w-4" />
          <div>
            <div className="font-medium">Consulta Personalizada</div>
            <div className="text-xs text-muted-foreground">Pregunta lo que necesites</div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Componente compacto para espacios reducidos
export function AgentQuickButton() {
  const { agentHealth, canUseAgent, toggleChat } = useAgent();

  if (!canUseAgent) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleChat}
      className="relative h-9 w-9"
      title="Agente de Inventario"
    >
      <div className="relative">
        <BotIcon className="h-4 w-4" />
        {agentHealth.status === 'healthy' && (
          <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
        )}
      </div>
    </Button>
  );
}