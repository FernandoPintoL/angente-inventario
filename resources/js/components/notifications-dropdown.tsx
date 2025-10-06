import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { AlertCircle, Bell, CheckCheck, Package, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Notification {
    id: string;
    type: string;
    data: {
        tipo: 'stock_bajo' | 'proximos_vencer';
        mensaje: string;
        url: string;
        prioridad: 'alta' | 'media' | 'baja';
        producto_nombre?: string;
        producto_id?: number;
        stock_actual?: number;
        stock_minimo?: number;
        cantidad_productos?: number;
        dias_anticipacion?: number;
    };
    read_at: string | null;
    created_at: string;
}

export function NotificationsDropdown() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('/api/notificaciones/no-leidas', {
                params: { limit: 10 },
            });
            setNotifications(response.data.data);
            setCount(response.data.total);
        } catch (error) {
            console.error('Error al cargar notificaciones:', error);
        }
    };

    const fetchCount = async () => {
        try {
            const response = await axios.get('/api/notificaciones/count');
            setCount(response.data.count);
        } catch (error) {
            console.error('Error al obtener contador:', error);
        }
    };

    useEffect(() => {
        fetchCount();
        // Actualizar contador cada 30 segundos
        const interval = setInterval(fetchCount, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (open) {
            fetchNotifications();
        }
    }, [open]);

    const markAsRead = async (id: string) => {
        try {
            await axios.post(`/api/notificaciones/${id}/marcar-leida`);
            setNotifications((prev) => prev.filter((n) => n.id !== id));
            setCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error al marcar como leída:', error);
        }
    };

    const markAllAsRead = async () => {
        setLoading(true);
        try {
            await axios.post('/api/notificaciones/marcar-todas-leidas');
            setNotifications([]);
            setCount(0);
        } catch (error) {
            console.error('Error al marcar todas como leídas:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            await axios.delete(`/api/notificaciones/${id}`);
            setNotifications((prev) => prev.filter((n) => n.id !== id));
            setCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error al eliminar notificación:', error);
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        markAsRead(notification.id);
        if (notification.data.url) {
            router.visit(notification.data.url);
            setOpen(false);
        }
    };

    const getNotificationIcon = (tipo: string) => {
        switch (tipo) {
            case 'stock_bajo':
                return <Package className="h-5 w-5 text-orange-500" />;
            case 'proximos_vencer':
                return <AlertCircle className="h-5 w-5 text-red-500" />;
            case 'alerta_general':
                return <Bell className="h-5 w-5 text-yellow-500" />;
            case 'venta_aprobada':
                return <CheckCheck className="h-5 w-5 text-green-500" />;
            case 'compra_pendiente':
                return <Package className="h-5 w-5 text-blue-500" />;
            case 'reporte_generado':
                return <Bell className="h-5 w-5 text-indigo-500" />;
            case 'error_sistema':
                return <AlertCircle className="h-5 w-5 text-red-600" />;
            default:
                return <Bell className="h-5 w-5 text-blue-500" />;
        }
    };

    const getPriorityColor = (prioridad: string) => {
        switch (prioridad) {
            case 'alta':
                return 'border-l-red-500';
            case 'media':
                return 'border-l-orange-500';
            case 'baja':
                return 'border-l-blue-500';
            default:
                return 'border-l-gray-500';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Ahora';
        if (diffMins < 60) return `Hace ${diffMins}m`;
        if (diffHours < 24) return `Hace ${diffHours}h`;
        return `Hace ${diffDays}d`;
    };

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="group relative h-9 w-9 cursor-pointer">
                                <Bell className="!size-5 opacity-80 group-hover:opacity-100" />
                                {count > 0 && (
                                    <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                        {count > 9 ? '9+' : count}
                                    </span>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Notificaciones{count > 0 && ` (${count})`}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-4 py-2">
                    <h3 className="font-semibold">Notificaciones</h3>
                    {count > 0 && (
                        <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={loading} className="h-auto p-1 text-xs">
                            <CheckCheck className="mr-1 h-3 w-3" />
                            Marcar todas
                        </Button>
                    )}
                </div>
                <DropdownMenuSeparator />

                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center text-sm text-muted-foreground">
                        <Bell className="mb-2 h-8 w-8 opacity-50" />
                        <p>No hay notificaciones</p>
                    </div>
                ) : (
                    <ScrollArea className="max-h-[400px]">
                        {notifications.map((notification) => (
                            <div key={notification.id}>
                                <DropdownMenuItem
                                    className={cn('cursor-pointer border-l-4 p-4 focus:bg-accent', getPriorityColor(notification.data.prioridad))}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="flex w-full items-start space-x-3">
                                        <div className="mt-0.5">{getNotificationIcon(notification.data.tipo)}</div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium leading-tight">{notification.data.mensaje}</p>
                                            <p className="text-xs text-muted-foreground">{formatDate(notification.created_at)}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 shrink-0 opacity-50 hover:opacity-100"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteNotification(notification.id);
                                            }}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="my-0" />
                            </div>
                        ))}
                    </ScrollArea>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
