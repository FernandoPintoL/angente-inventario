import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ClockIcon, MessageSquareIcon, TrashIcon, SearchIcon, RefreshCwIcon } from 'lucide-react';

interface ConversationItem {
  id: string;
  query: string;
  response: any;
  created_at: string;
  status: 'pending' | 'completed' | 'failed';
}

interface ChatHistoryProps {
  className?: string;
  onConversationSelect?: (conversation: ConversationItem) => void;
}

export function ChatHistory({ className, onConversationSelect }: ChatHistoryProps) {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredConversations, setFilteredConversations] = useState<ConversationItem[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    const filtered = conversations.filter(conv =>
      conv.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (conv.response?.message && conv.response.message.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredConversations(filtered);
  }, [conversations, searchTerm]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/agente/historial', {
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data.historial || []);
      }
    } catch (error) {
      console.error('Error cargando historial:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar todo el historial?')) {
      return;
    }

    try {
      const response = await fetch('/api/agente/historial', {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      if (response.ok) {
        setConversations([]);
      }
    } catch (error) {
      console.error('Error eliminando historial:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `Hace ${diffInMinutes} min`;
    } else if (diffInHours < 24) {
      return `Hace ${Math.floor(diffInHours)} h`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const truncateText = (text: string, maxLength: number = 60) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Card className={cn("h-[600px] flex flex-col", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ClockIcon className="size-5 text-primary" />
            Historial de Conversaciones
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadHistory}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCwIcon className={cn("size-4", loading && "animate-spin")} />
              Actualizar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearHistory}
              disabled={loading || conversations.length === 0}
              className="flex items-center gap-2 text-destructive hover:text-destructive"
            >
              <TrashIcon className="size-4" />
              Limpiar
            </Button>
          </div>
        </div>

        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar en historial..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <div className="h-full overflow-y-auto px-6 pb-6 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <RefreshCwIcon className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <MessageSquareIcon className="size-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {searchTerm ? 'No se encontraron conversaciones' : 'No hay conversaciones en el historial'}
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50",
                  conversation.status === 'failed' && "border-destructive/20 bg-destructive/5",
                  conversation.status === 'pending' && "border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20"
                )}
                onClick={() => onConversationSelect?.(conversation)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground mb-1">
                      {truncateText(conversation.query)}
                    </div>
                    {conversation.response?.message && (
                      <div className="text-xs text-muted-foreground mb-2">
                        {truncateText(conversation.response.message)}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(conversation.created_at)}
                      </span>
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          conversation.status === 'completed' && "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
                          conversation.status === 'failed' && "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
                          conversation.status === 'pending' && "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200"
                        )}
                      >
                        {conversation.status === 'completed' && '✓ Completado'}
                        {conversation.status === 'failed' && '✗ Error'}
                        {conversation.status === 'pending' && '⏳ Pendiente'}
                      </span>
                    </div>
                  </div>
                  {conversation.response?.data && (
                    <div className="flex-shrink-0">
                      <div className="size-2 rounded-full bg-blue-500" title="Contiene datos" />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}