import { useEffect } from 'react';
import { useAgent } from '@/contexts/AgentContext';

interface UseAgentShortcutsOptions {
  enabled?: boolean;
}

export function useAgentShortcuts({ enabled = true }: UseAgentShortcutsOptions = {}) {
  const { toggleChat, openChat, setQuickQuery, canUseAgent } = useAgent();

  useEffect(() => {
    if (!enabled || !canUseAgent) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // No activar shortcuts si estamos escribiendo en un input o textarea
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true'
      ) {
        return;
      }

      // Ctrl + K para abrir/cerrar chat
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        toggleChat();
        return;
      }

      // Ctrl + Shift + A para abrir agente
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        openChat();
        return;
      }

      // Teclas numéricas para consultas rápidas (solo si el chat no está abierto)
      if (event.ctrlKey && event.shiftKey) {
        switch (event.key) {
          case '1':
            event.preventDefault();
            setQuickQuery('¿Cuál es el stock total por almacén?');
            break;
          case '2':
            event.preventDefault();
            setQuickQuery('Muéstrame productos con stock bajo');
            break;
          case '3':
            event.preventDefault();
            setQuickQuery('¿Cuáles son los productos más vendidos este mes?');
            break;
          case '4':
            event.preventDefault();
            setQuickQuery('¿Qué productos están próximos a vencer?');
            break;
          case '5':
            event.preventDefault();
            setQuickQuery('¿Cuántos productos hay por categoría?');
            break;
          case '6':
            event.preventDefault();
            setQuickQuery('Muéstrame los últimos movimientos de inventario');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, canUseAgent, toggleChat, openChat, setQuickQuery]);

  // Mostrar hints de teclado
  const shortcuts = [
    { keys: 'Ctrl + K', description: 'Abrir/cerrar agente' },
    { keys: 'Ctrl + Shift + A', description: 'Abrir agente' },
    { keys: 'Ctrl + Shift + 1', description: 'Stock por almacén' },
    { keys: 'Ctrl + Shift + 2', description: 'Stock bajo' },
    { keys: 'Ctrl + Shift + 3', description: 'Más vendidos' },
    { keys: 'Ctrl + Shift + 4', description: 'Por vencer' },
    { keys: 'Ctrl + Shift + 5', description: 'Por categoría' },
    { keys: 'Ctrl + Shift + 6', description: 'Últimos movimientos' },
  ];

  return { shortcuts };
}