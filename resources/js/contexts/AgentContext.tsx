import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

interface Message {
  id: string;
  type: 'user' | 'agent';
  content: string;
  data?: any;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
  confidence?: number;
  intent?: string;
  success?: boolean;
}

interface AgentContextType {
  // Estado del chat
  isOpen: boolean;
  messages: Message[];
  isLoading: boolean;
  isMinimized: boolean;

  // Acciones del chat
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  minimizeChat: () => void;
  maximizeChat: () => void;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;

  // Estado del agente
  agentHealth: {
    status: 'healthy' | 'unhealthy' | 'unknown';
    message?: string;
  };

  // Permisos
  canUseAgent: boolean;
  canViewHistory: boolean;

  // Métodos de utilidad
  insertExampleQuery: (query: string) => void;
  setQuickQuery: (query: string) => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function useAgent() {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error('useAgent must be used within an AgentProvider');
  }
  return context;
}

interface AgentProviderProps {
  children: React.ReactNode;
}

export function AgentProvider({ children }: AgentProviderProps) {
  const { auth, canUseAgent: propCanUseAgent, canViewHistory: propCanViewHistory } = usePage().props as any;

  // Estado del chat
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'agent',
      content: '¡Hola! Soy tu asistente de inventario. Puedo ayudarte con consultas sobre stock, productos, movimientos y más. ¿En qué puedo ayudarte?',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [agentHealth, setAgentHealth] = useState<{
    status: 'healthy' | 'unhealthy' | 'unknown';
    message?: string;
  }>({ status: 'unknown' });

  // Permisos del usuario - usar props del controlador si están disponibles
  const canUseAgent = propCanUseAgent ?? (auth?.user?.permissions?.includes('agente.use') ?? false);
  const canViewHistory = propCanViewHistory ?? (auth?.user?.permissions?.includes('agente.history') ?? false);

  // Debug permissions
  console.log('Agent permissions debug:', {
    propCanUseAgent,
    propCanViewHistory,
    auth: auth,
    user: auth?.user,
    permissions: auth?.user?.permissions,
    finalCanUseAgent: canUseAgent,
    finalCanViewHistory: canViewHistory
  });

  // Verificar el estado del agente al cargar
  useEffect(() => {
    checkAgentHealth();
  }, []);

  const checkAgentHealth = useCallback(async () => {
    try {
      const response = await fetch('/api/agente/health', {
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAgentHealth({
          status: data.external_agent?.status === 'healthy' ? 'healthy' : 'unhealthy',
          message: data.external_agent?.message
        });
      } else {
        setAgentHealth({ status: 'unhealthy', message: 'Error de conexión' });
      }
    } catch (error) {
      setAgentHealth({ status: 'unhealthy', message: 'No disponible' });
    }
  }, []);

  // Acciones del chat
  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
    setIsMinimized(false);
  }, []);

  const openChat = useCallback(() => {
    setIsOpen(true);
    setIsMinimized(false);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
    setIsMinimized(false);
  }, []);

  const minimizeChat = useCallback(() => {
    setIsMinimized(true);
  }, []);

  const maximizeChat = useCallback(() => {
    setIsMinimized(false);
  }, []);

  const sendMessage = useCallback(async (query: string) => {
    console.log('sendMessage called with:', { query, isLoading, canUseAgent });
    if (!query.trim() || isLoading || !canUseAgent) {
      console.log('sendMessage blocked:', {
        emptyQuery: !query.trim(),
        isLoading,
        noPermission: !canUseAgent
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: query,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
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
  }, [isLoading, canUseAgent]);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: '1',
        type: 'agent',
        content: '¡Hola! Soy tu asistente de inventario. Puedo ayudarte con consultas sobre stock, productos, movimientos y más. ¿En qué puedo ayudarte?',
        timestamp: new Date(),
      },
    ]);
  }, []);

  const insertExampleQuery = useCallback((query: string) => {
    openChat();
    // Aquí se puede implementar la lógica para insertar la query en el input
    // Por ahora solo abrimos el chat
  }, [openChat]);

  const setQuickQuery = useCallback((query: string) => {
    openChat();
    // Auto-send the query
    setTimeout(() => {
      sendMessage(query);
    }, 100);
  }, [openChat, sendMessage]);

  const value: AgentContextType = {
    // Estado del chat
    isOpen,
    messages,
    isLoading,
    isMinimized,

    // Acciones del chat
    toggleChat,
    openChat,
    closeChat,
    minimizeChat,
    maximizeChat,
    sendMessage,
    clearMessages,

    // Estado del agente
    agentHealth,

    // Permisos
    canUseAgent,
    canViewHistory,

    // Métodos de utilidad
    insertExampleQuery,
    setQuickQuery,
  };

  return (
    <AgentContext.Provider value={value}>
      {children}
    </AgentContext.Provider>
  );
}