import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { SendIcon, BotIcon, UserIcon, Loader2Icon, HistoryIcon, TrashIcon } from 'lucide-react';
import { DataFormatter } from './DataFormatter';

interface Message {
  id: string;
  type: 'user' | 'agent';
  content: string;
  data?: any;
  clarification?: {
    needs_clarification: boolean;
    question: string;
  };
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
  confidence?: number;
  intent?: string;
  success?: boolean;
}

interface ChatBotProps {
  className?: string;
  onHistoryToggle?: () => void;
  showHistory?: boolean;
}

export function ChatBot({ className, onHistoryToggle, showHistory = false }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'agent',
      content: '¡Hola! Soy tu asistente de inventario. Puedo ayudarte con consultas sobre stock, productos, movimientos y más. ¿En qué puedo ayudarte?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (query: string) => {
    if (!query.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: query,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/agente/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          query,
          context: {},
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la comunicación con el agente');
      }

      const data = await response.json();

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: data.response || data.message || 'No se pudo procesar la consulta',
        data: data.data,
        clarification: data.clarification,
        timestamp: new Date(),
        confidence: data.confidence,
        intent: data.intent,
        success: data.success,
        status: data.success === false ? 'error' : 'sent',
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error('Error enviando mensaje:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: 'Lo siento, ocurrió un error al procesar tu consulta. Por favor, intenta nuevamente.',
        timestamp: new Date(),
        status: 'error',
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        type: 'agent',
        content: '¡Hola! Soy tu asistente de inventario. Puedo ayudarte con consultas sobre stock, productos, movimientos y más. ¿En qué puedo ayudarte?',
        timestamp: new Date(),
      },
    ]);
  };

  const formatData = (data: any) => {
    return <DataFormatter data={data} />;
  };

  return (
    <Card className={cn("flex flex-col h-[600px]", className)}>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <BotIcon className="size-5 text-primary" />
          Agente de Inventario
        </CardTitle>
        <div className="flex gap-2">
          {onHistoryToggle && (
            <Button
              variant="outline"
              size="sm"
              onClick={onHistoryToggle}
              className="flex items-center gap-2"
            >
              <HistoryIcon className="size-4" />
              {showHistory ? 'Ocultar' : 'Historial'}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={clearChat}
            className="flex items-center gap-2"
          >
            <TrashIcon className="size-4" />
            Limpiar
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4 p-0">
        <div className="flex-1 overflow-y-auto space-y-4 px-6 py-4 max-h-[450px] chat-scroll">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.type === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {message.type === 'agent' && (
                <div className="flex-shrink-0">
                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <BotIcon className="size-4 text-primary" />
                  </div>
                </div>
              )}

              <div
                className={cn(
                  "max-w-[85%] rounded-lg px-4 py-3",
                  message.type === 'user'
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50",
                  message.status === 'error' && "border border-destructive/20"
                )}
              >
                <div className="text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere">{message.content}</div>

                {message.confidence !== undefined && message.type === 'agent' && (
                  <div className="mt-1 text-xs opacity-60">
                    {message.intent && <span className="mr-2">Intención: {message.intent}</span>}
                    <span>Confianza: {Math.round((message.confidence || 0) * 100)}%</span>
                  </div>
                )}

                {message.data && formatData(message.data)}

                {message.clarification?.needs_clarification && (
                  <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-950/20 rounded border border-amber-200 dark:border-amber-800">
                    <div className="text-xs font-medium text-amber-800 dark:text-amber-200 mb-1">
                      Necesito más información:
                    </div>
                    <div className="text-xs text-amber-700 dark:text-amber-300">
                      {message.clarification.question}
                    </div>
                  </div>
                )}

                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>

              {message.type === 'user' && (
                <div className="flex-shrink-0">
                  <div className="size-8 rounded-full bg-secondary flex items-center justify-center">
                    <UserIcon className="size-4" />
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <BotIcon className="size-4 text-primary" />
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg px-4 py-2">
                <div className="flex items-center gap-2">
                  <Loader2Icon className="size-4 animate-spin" />
                  <span className="text-sm">Procesando consulta...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 pt-0 border-t bg-background">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribe tu consulta sobre inventario..."
              className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring disabled:opacity-50"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <SendIcon className="size-4" />
              )}
              Enviar
            </Button>
          </form>

          <div className="mt-2 text-xs text-muted-foreground">
            Ejemplo: "muéstrame las categorías" o "productos con stock bajo"
          </div>
        </div>
      </CardContent>
    </Card>
  );
}