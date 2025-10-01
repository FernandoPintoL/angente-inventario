import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    ShoppingCart,
    Package,
    Activity
} from 'lucide-react';

// Componentes del dashboard
import { MetricCard } from '@/components/dashboard/metric-card';
import { ChartWrapper } from '@/components/dashboard/chart-wrapper';
import { AlertasStock } from '@/components/dashboard/alertas-stock';
import { ProductosMasVendidos } from '@/components/dashboard/productos-mas-vendidos';
import { PeriodSelector } from '@/components/dashboard/period-selector';

interface DashboardProps {
    metricas: {
        compras: {
            total: number;
            cantidad: number;
            promedio: number;
            cambio_porcentual: number;
        };
        inventario: {
            total_productos: number;
            stock_total: number;
            valor_inventario: number;
            productos_sin_stock: number;
        };
    };
    graficoCompras: {
        labels: string[];
        datasets: Array<{
            label: string;
            data: number[];
            backgroundColor: string;
            borderColor: string;
            tension?: number;
            yAxisID?: string;
        }>;
    };
    productosMasComprados: Array<{
        nombre: string;
        total_comprado: number;
        gasto_total: number;
    }>;
    alertasStock: {
        stock_bajo: number;
        stock_critico: number;
        productos_afectados: Array<{
            producto: string;
            almacen: string;
            cantidad_actual: number;
            stock_minimo: number;
        }>;
    };
    periodo: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({
    metricas,
    graficoCompras,
    productosMasComprados,
    alertasStock,
    periodo: initialPeriodo,
}: DashboardProps) {
    const [periodo, setPeriodo] = useState(initialPeriodo || 'mes_actual');
    const [loading, setLoading] = useState(false);

    // Valores por defecto para evitar errores de undefined
    const defaultMetricas = {
        compras: { total: 0, cantidad: 0, promedio: 0, cambio_porcentual: 0 },
        inventario: { total_productos: 0, stock_total: 0, valor_inventario: 0, productos_sin_stock: 0 },
    };

    const defaultGraficoCompras = {
        labels: [],
        datasets: [],
    };

    const safeMetricas = metricas || defaultMetricas;
    const safeGraficoCompras = graficoCompras || defaultGraficoCompras;
    const safeProductosMasComprados = productosMasComprados || [];
    const safeAlertasStock = alertasStock || { stock_bajo: 0, stock_critico: 0, productos_afectados: [] };

    const handlePeriodChange = (newPeriod: string) => {
        setPeriodo(newPeriod);
        setLoading(true);

        router.get(dashboard().url, { periodo: newPeriod }, {
            preserveScroll: true,
            onFinish: () => setLoading(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                            Dashboard
                        </h1>
                        <p className="text-neutral-600 dark:text-neutral-400">
                            Resumen general de tu distribuidora
                        </p>
                    </div>
                    <PeriodSelector
                        value={periodo}
                        onChange={handlePeriodChange}
                    />
                </div>

                {/* Métricas principales */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <MetricCard
                        title="Compras Totales"
                        value={safeMetricas.compras.total}
                        subtitle={`${safeMetricas.compras.cantidad} compras`}
                        change={safeMetricas.compras.cambio_porcentual}
                        icon={ShoppingCart}
                        loading={loading}
                    />
                    <MetricCard
                        title="Valor Inventario"
                        value={safeMetricas.inventario.valor_inventario}
                        subtitle={`${safeMetricas.inventario.total_productos} productos`}
                        icon={Package}
                        loading={loading}
                    />
                    <MetricCard
                        title="Stock Total"
                        value={safeMetricas.inventario.stock_total}
                        subtitle={`${safeMetricas.inventario.productos_sin_stock} sin stock`}
                        icon={Activity}
                        loading={loading}
                    />
                </div>

                {/* Gráficos y datos detallados */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Gráfico de compras */}
                    <ChartWrapper
                        title="Evolución de Compras"
                        type="line"
                        data={safeGraficoCompras}
                        loading={loading}
                        className="lg:col-span-2"
                    />

                    {/* Productos más comprados */}
                    <ProductosMasVendidos
                        productos={safeProductosMasComprados}
                        loading={loading}
                        title="Productos Más Comprados"
                    />
                </div>

                {/* Alertas de stock */}
                <AlertasStock
                    alertas={safeAlertasStock}
                    loading={loading}
                />
            </div>
        </AppLayout>
    );
}
