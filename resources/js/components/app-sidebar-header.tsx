import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { AgentQuickAccess, AgentQuickButton } from '@/components/agente/AgentQuickAccess';
import { AgentShortcutsHelp, AgentShortcutHint } from '@/components/agente/AgentShortcutsHelp';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2 flex-1">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            {/* Agente Quick Access */}
            <div className="flex items-center gap-2">
                {/* Hint de atajo para pantallas grandes */}
                <AgentShortcutHint />

                {/* Ayuda de shortcuts */}
                <AgentShortcutsHelp />

                {/* Acceso completo en pantallas medianas */}
                <div className="hidden md:block">
                    <AgentQuickAccess />
                </div>

                {/* Botón compacto en pantallas pequeñas */}
                <div className="md:hidden">
                    <AgentQuickButton />
                </div>
            </div>
        </header>
    );
}
