import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAgent } from '@/contexts/AgentContext';
import { DataFormatter } from './DataFormatter';
import { VoiceInput } from './VoiceInput';
import {
  BotIcon,
  UserIcon,
  SendIcon,
  Loader2Icon,
  MinusIcon,
  XIcon,
  MaximizeIcon,
  MessageSquareIcon,
  ZapIcon,
  PackageIcon,
  AlertTriangleIcon,
  TrendingUpIcon,
  ClockIcon,
  SparklesIcon,
  MicIcon
} from 'lucide-react';

export function FloatingChat() {
  const {
    isOpen,
    isMinimized,
    messages,
    isLoading,
    canUseAgent,
    agentHealth,
    toggleChat,
    closeChat,
    minimizeChat,
    maximizeChat,
    sendMessage,
    clearMessages,
    setQuickQuery
  } = useAgent();

  const [inputValue, setInputValue] = useState('');
  const [showExamples, setShowExamples] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    await sendMessage(inputValue);
    setInputValue('');
    setShowExamples(false);
  };

  const handleExampleClick = (query: string) => {
    setQuickQuery(query);
    setShowExamples(false);
  };

  const handleVoiceTranscript = async (transcript: string) => {
    if (!transcript.trim()) return;
    await sendMessage(transcript);
    setShowExamples(false);
  };

  const examples = [
    {
      icon: PackageIcon,
      text: "¿Cuál es el stock total por almacén?",
      category: "Stock",
      color: "bg-blue-500"
    },
    {
      icon: AlertTriangleIcon,
      text: "Muéstrame productos con stock bajo",
      category: "Alertas",
      color: "bg-red-500"
    },
    {
      icon: TrendingUpIcon,
      text: "¿Cuáles son los productos más vendidos?",
      category: "Ventas",
      color: "bg-green-500"
    },
    {
      icon: ClockIcon,
      text: "Productos próximos a vencer",
      category: "Vencimientos",
      color: "bg-yellow-500"
    }
  ];

  if (!canUseAgent) {
    return null;
  }

  // Chat Trigger Button
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleChat}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group relative"
        >
          <div className="relative">
            <BotIcon className="h-6 w-6 transition-transform group-hover:scale-110" />
            {agentHealth.status === 'healthy' && (
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full animate-pulse" />
            )}
          </div>
        </Button>
        <div className="absolute bottom-16 right-0 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Agente de Inventario
        </div>
      </div>
    );
  }

  // Chat Window
  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 transition-all duration-300",
      isMinimized ? "w-80 h-12" : "w-96 h-[32rem]",
      "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]",
      "sm:w-96 sm:h-[32rem]"
    )}>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="relative">
              <BotIcon className="h-6 w-6" />
              {agentHealth.status === 'healthy' && (
                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 border-2 border-white rounded-full" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-sm">Agente de Inventario</h3>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="text-xs bg-white/20 text-white border-white/30"
                >
                  {agentHealth.status === 'healthy' ? 'Conectado' : 'Desconectado'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-white/20"
              onClick={isMinimized ? maximizeChat : minimizeChat}
            >
              {isMinimized ? <MaximizeIcon className="h-4 w-4" /> : <MinusIcon className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-white/20"
              onClick={closeChat}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Chat Content */}
        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 animate-in slide-in-from-bottom-2",
                    message.type === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.type === 'agent' && (
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <BotIcon className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  )}

                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                      message.type === 'user'
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "bg-gray-100 dark:bg-gray-800",
                      message.status === 'error' && "border border-red-200 bg-red-50 dark:bg-red-950/20"
                    )}
                  >
                    <div className="whitespace-pre-wrap break-words">{message.content}</div>

                    {message.confidence !== undefined && message.type === 'agent' && (
                      <div className="mt-2 flex items-center gap-2 text-xs opacity-70">
                        {message.intent && (
                          <span className="bg-white/20 px-2 py-1 rounded">
                            {message.intent}
                          </span>
                        )}
                        <span>
                          {Math.round((message.confidence || 0) * 100)}% confianza
                        </span>
                      </div>
                    )}

                    {message.data && <DataFormatter data={message.data} compact={true} />}

                    <div className="text-xs opacity-50 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>

                  {message.type === 'user' && (
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                        <UserIcon className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start animate-in slide-in-from-bottom-2">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <BotIcon className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                      <span>Analizando consulta...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Examples */}
            {showExamples && messages.length <= 1 && (
              <div className="px-4 pb-2">
                <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <SparklesIcon className="h-3 w-3" />
                  Consultas de ejemplo:
                </div>
                <div className="space-y-2">
                  {examples.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(example.text)}
                      className="w-full text-left p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn("h-6 w-6 rounded flex items-center justify-center", example.color)}>
                          <example.icon className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-xs group-hover:text-primary transition-colors">
                          {example.text}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={() => setShowExamples(true)}
                  onBlur={() => setTimeout(() => setShowExamples(false), 200)}
                  placeholder="Escribe o habla tu consulta..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                  disabled={isLoading}
                />

                {/* Voice Input Button */}
                <VoiceInput
                  onTranscript={handleVoiceTranscript}
                  disabled={isLoading}
                />

                <Button
                  type="submit"
                  size="icon"
                  disabled={!inputValue.trim() || isLoading}
                  className="h-10 w-10 rounded-lg"
                >
                  {isLoading ? (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  ) : (
                    <SendIcon className="h-4 w-4" />
                  )}
                </Button>
              </form>

              <div className="flex items-center justify-between mt-2">
                <button
                  onClick={clearMessages}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Limpiar chat
                </button>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <MicIcon className="h-3 w-3" />
                  <span>Habla o presiona Enter</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}