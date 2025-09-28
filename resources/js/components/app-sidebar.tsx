import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useAgent } from '@/contexts/AgentContext';
import React, { useEffect, useState, useCallback } from 'react';
import {
    Package,
    Boxes,
    Users,
    Truck,
    Wallet,
    CreditCard,
    ShoppingCart,
    TrendingUp,
    BarChart3,
    Settings,
    FolderTree,
    Tags,
    Ruler,
    DollarSign,
    Building2,
    ClipboardList,
    LucideIcon,
    BotIcon,
    ChartPie,
    ChartSpline,
} from 'lucide-react';
import AppLogo from './app-logo';

// Mapeo de nombres de iconos a componentes
const iconMap: Record<string, LucideIcon> = {
    Package,
    Boxes,
    Users,
    Truck,
    Wallet,
    CreditCard,
    ShoppingCart,
    TrendingUp,
    BarChart3,
    Settings,
    FolderTree,
    Tags,
    Ruler,
    DollarSign,
    Building2,
    ClipboardList,
    BotIcon,
    ChartPie,
    ChartSpline,
};

// Tipos para los módulos de la API
interface ModuloAPI {
    title: string;
    href: string;
    icon?: string;
    children?: ModuloAPI[];
}

// Hook personalizado para obtener módulos del sidebar
const useSidebarModules = () => {
    const [modules, setModules] = useState<NavItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const processModules = useCallback((modules: ModuloAPI[]): NavItem[] => {
        return modules.map((module) => ({
            title: module.title,
            href: module.href,
            icon: module.icon && iconMap[module.icon] ? iconMap[module.icon] : null,
            children: module.children ? processModules(module.children) : undefined,
        }));
    }, []);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const response = await fetch('/api/modulos-sidebar', { credentials: 'include' });
                if (!response.ok) {
                    throw new Error('Error al cargar módulos del sidebar');
                }
                const data: ModuloAPI[] = await response.json();

                const processedModules = processModules(data);
                setModules(processedModules);
            } catch (err) {
                console.error('Error fetching sidebar modules:', err);
                setError(err instanceof Error ? err.message : 'Error desconocido');
                // Fallback a módulos vacíos en caso de error
                setModules([]);
            } finally {
                setLoading(false);
            }
        };

        fetchModules();
    }, [processModules]);

    return { modules, loading, error };
};

const footerNavItems: NavItem[] = [];

// Componente para el botón del agente
function AgentButton() {
    const { canUseAgent, agentHealth } = useAgent();
    const { url } = usePage();

    if (!canUseAgent) {
        return null;
    }

    const statusColor = agentHealth.status === 'healthy' ? 'bg-green-500' : 'bg-red-500';
    const statusText = agentHealth.status === 'healthy' ? 'Conectado' : 'Desconectado';
    const isActive = url.startsWith('/agente');

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                size="lg"
                asChild
                tooltip={`Agente de Inventario - ${statusText}`}
                className={`relative group hover:bg-accent hover:text-accent-foreground transition-all duration-200 ${
                    isActive ? 'bg-accent text-accent-foreground shadow-sm' : ''
                }`}
            >
                <Link href="/agente" prefetch>
                    <div className="flex items-center gap-3 relative w-full">
                        <div className="relative flex-shrink-0">
                            <BotIcon className={`h-5 w-5 transition-colors ${
                                isActive
                                    ? 'text-primary'
                                    : 'text-primary group-hover:text-primary/80'
                            }`} />
                            {/* Indicador de estado */}
                            <div
                                className={`absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border border-background ${statusColor} ${
                                    agentHealth.status === 'healthy' ? 'animate-pulse' : ''
                                }`}
                            />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                            <span className="font-medium text-sm truncate">Agente IA</span>
                            <span className="text-xs text-muted-foreground truncate">
                                {statusText}
                            </span>
                        </div>
                    </div>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

export function AppSidebar() {
    const { modules, loading, error } = useSidebarModules();

    // Mientras carga, mostrar esqueleto
    if (loading) {
        return (
            <Sidebar collapsible="icon" variant="inset">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link href={dashboard()} prefetch>
                                    <AppLogo />
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        {/* Botón del Agente */}
                        <AgentButton />
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent>
                    <div className="space-y-2 p-2">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        ))}
                    </div>
                </SidebarContent>

                <SidebarFooter>
                    <NavFooter items={footerNavItems} className="mt-auto" />
                    <NavUser />
                </SidebarFooter>
            </Sidebar>
        );
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    {/* Botón del Agente */}
                    <AgentButton />
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {error ? (
                    <div className="p-4 text-sm text-red-600 dark:text-red-400">
                        <p>Error al cargar módulos:</p>
                        <p className="text-xs">{error}</p>
                    </div>
                ) : (
                    <NavMain items={modules} />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}