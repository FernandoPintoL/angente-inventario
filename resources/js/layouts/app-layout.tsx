import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { AgentProvider } from '@/contexts/AgentContext';
import { FloatingChat } from '@/components/agente/FloatingChat';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAgentShortcuts } from '@/hooks/useAgentShortcuts';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

function AppLayoutContent({ children, breadcrumbs, ...props }: AppLayoutProps) {
    // Activar shortcuts globales
    useAgentShortcuts();

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}

            {/* Chat flotante del agente */}
            <FloatingChat />

            {/* React Hot Toast Container */}
            <Toaster
                position="top-right"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                    // Define default options
                    className: '',
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    // Default options for specific types
                    success: {
                        duration: 3000,
                        style: {
                            background: 'green',
                        },
                    },
                    error: {
                        duration: 5000,
                        style: {
                            background: 'red',
                        },
                    },
                }}
            />
        </AppLayoutTemplate>
    );
}

export default (props: AppLayoutProps) => (
    <AgentProvider>
        <AppLayoutContent {...props} />
    </AgentProvider>
);
