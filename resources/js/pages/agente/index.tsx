import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { ChatBot } from '@/components/agente/ChatBot';
import { ChatHistory } from '@/components/agente/ChatHistory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BotIcon,
  MessageSquareIcon,
  ZapIcon,
  ShieldCheckIcon,
  ClockIcon,
  TrendingUpIcon,
  PackageIcon,
  AlertTriangleIcon
} from 'lucide-react';

interface ConversationItem {
  id: string;
  query: string;
  response: any;
  created_at: string;
  status: 'pending' | 'completed' | 'failed';
}

interface AgentePageProps {
  canUseAgent: boolean;
  canViewHistory: boolean;
  agentHealth?: {
    status: string;
    message?: string;
  };
}

export default function AgentePage({ canUseAgent, canViewHistory, agentHealth }: AgentePageProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<ConversationItem | null>(null);

  const handleConversationSelect = (conversation: ConversationItem) => {
    setSelectedConversation(conversation);
    // Aquí podrías implementar la lógica para mostrar la conversación seleccionada
    console.log('Conversación seleccionada:', conversation);
  };

  const examples = [
    {
      icon: PackageIcon,
      title: "Consulta de Stock",
      description: "¿Cuál es el stock del producto ABC-123?",
      category: "Stock"
    },
    {
      icon: AlertTriangleIcon,
      title: "Stock Bajo",
      description: "Muéstrame los productos con poco stock",
      category: "Alertas"
    },
    {
      icon: TrendingUpIcon,
      title: "Movimientos",
      description: "¿Cuáles fueron los últimos movimientos de inventario?",
      category: "Movimientos"
    },
    {
      icon: ClockIcon,
      title: "Productos Vencidos",
      description: "¿Qué productos están próximos a vencer?",
      category: "Vencimientos"
    }
  ];

  const features = [
    {
      icon: MessageSquareIcon,
      title: "Consultas en Lenguaje Natural",
      description: "Pregunta sobre tu inventario como si fuera una conversación normal"
    },
    {
      icon: ZapIcon,
      title: "Respuestas Instantáneas",
      description: "Obtén información en tiempo real sobre stock, productos y movimientos"
    },
    {
      icon: ShieldCheckIcon,
      title: "Datos Confiables",
      description: "Información directa de tu base de datos actualizada"
    }
  ];

  if (!canUseAgent) {
    return (
      <>
        <Head title="Agente de Inventario - Sin Permisos" />
        <div className="container mx-auto p-6">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="size-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                <ShieldCheckIcon className="size-8 text-destructive" />
              </div>
              <CardTitle>Acceso Denegado</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                No tienes permisos para usar el agente de inventario.
                Contacta con tu administrador para obtener acceso.
              </p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Head title="Agente de Inventario" />
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BotIcon className="size-8 text-primary" />
              Agente de Inventario
            </h1>
            <p className="text-muted-foreground mt-1">
              Tu asistente inteligente para gestión de inventario
            </p>
          </div>

          {agentHealth && (
            <Badge
              variant={agentHealth.status === 'ok' ? 'default' : 'destructive'}
              className="flex items-center gap-2"
            >
              <div className={`size-2 rounded-full ${
                agentHealth.status === 'ok' ? 'bg-green-500' : 'bg-red-500'
              }`} />
              {agentHealth.status === 'ok' ? 'Agente Conectado' : 'Agente Desconectado'}
            </Badge>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Section */}
          <div className={`${showHistory ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <ChatBot
              onHistoryToggle={canViewHistory ? () => setShowHistory(!showHistory) : undefined}
              showHistory={showHistory}
            />
          </div>

          {/* History Section */}
          {showHistory && canViewHistory && (
            <div className="lg:col-span-1 mb-12">
              <ChatHistory onConversationSelect={handleConversationSelect} />
            </div>
          )}
        </div>

        <br />

        {/* Features Section */}
        {!showHistory && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-3">
              <h2 className="text-xl font-semibold mb-4">¿Qué puedes hacer?</h2>
            </div>

            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <feature.icon className="size-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Examples Section */}
        {!showHistory && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Ejemplos de Consultas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {examples.map((example, index) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    // Aquí podrías implementar auto-completar en el chat
                    console.log('Ejemplo seleccionado:', example.description);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="size-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                        <example.icon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm mb-1">{example.title}</div>
                        <div className="text-xs text-muted-foreground leading-relaxed">
                          "{example.description}"
                        </div>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {example.category}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Help Section */}
        {!showHistory && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Consejos para mejores resultados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div>• <strong>Sé específico:</strong> Menciona SKUs, nombres de productos o números exactos</div>
              <div>• <strong>Usa contexto:</strong> "el producto ABC-123" es mejor que solo "ABC-123"</div>
              <div>• <strong>Pregunta paso a paso:</strong> Una consulta a la vez para mejores resultados</div>
              <div>• <strong>Usa palabras clave:</strong> "stock", "inventario", "movimientos", "vencimientos"</div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}