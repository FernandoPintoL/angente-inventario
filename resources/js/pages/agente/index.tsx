import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ChatBot } from '@/components/agente/ChatBot';
import { ChatHistory } from '@/components/agente/ChatHistory';
import { VoiceRecorder } from '@/components/agente/VoiceRecorder';
import { useAgent } from '@/contexts/AgentContext';
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
  AlertTriangleIcon,
  SparklesIcon,
  KeyboardIcon,
  MicIcon
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

// Componente interno que usa el contexto del agente
function AgentePageContent({ canUseAgent, canViewHistory, agentHealth }: AgentePageProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<ConversationItem | null>(null);

  // Usar el contexto del agente
  const {
    openChat,
    agentHealth: contextAgentHealth,
    setQuickQuery,
    canUseAgent: contextCanUse
  } = useAgent();

  // Usar los permisos del contexto si están disponibles
  const hasPermission = contextCanUse || canUseAgent;
  const healthStatus = contextAgentHealth.status !== 'unknown' ? contextAgentHealth : agentHealth;

  // Abrir el chat automáticamente cuando se entra a la página
  useEffect(() => {
    if (hasPermission) {
      openChat();
    }
  }, [hasPermission, openChat]);

  const handleConversationSelect = (conversation: ConversationItem) => {
    setSelectedConversation(conversation);
    console.log('Conversación seleccionada:', conversation);
  };

  const handleExampleClick = (query: string) => {
    setQuickQuery(query);
  };

  const handleVoiceQuery = (transcript: string) => {
    if (transcript.trim()) {
      setQuickQuery(transcript);
    }
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

  if (!hasPermission) {
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

          <div className="flex items-center gap-3">
            <Badge
              variant={healthStatus?.status === 'healthy' ? 'default' : 'destructive'}
              className="flex items-center gap-2"
            >
              <div className={`size-2 rounded-full ${
                healthStatus?.status === 'healthy' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`} />
              {healthStatus?.status === 'healthy' ? 'Agente Conectado' : 'Agente Desconectado'}
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Section */}
          <div className={`${showHistory ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <div className="grid gap-6">

              {/* Chat Bot */}
              <ChatBot
                onHistoryToggle={canViewHistory ? () => setShowHistory(!showHistory) : undefined}
                showHistory={showHistory}
              />
            </div>
          </div>

          {/* History Section */}
          {showHistory && canViewHistory && (
            <div className="lg:col-span-1 mb-12">
              <ChatHistory onConversationSelect={handleConversationSelect} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Componente principal que envuelve en AppLayout
export default function AgentePage(props: AgentePageProps) {
  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: '/dashboard' },
      { title: 'Agente de Inventario', href: '/agente' }
    ]}>
      <AgentePageContent {...props} />
    </AppLayout>
  );
}