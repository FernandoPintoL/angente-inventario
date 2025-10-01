<?php

namespace App\Services;

use App\Models\Compra;
use App\Models\Producto;
use App\Models\StockProducto;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    /**
     * Obtener métricas principales del dashboard
     */
    public function getMainMetrics(string $periodo = 'mes_actual'): array
    {
        $fechas = $this->getFechasPeriodo($periodo);

        return [
            'compras' => $this->getMetricasCompras($fechas),
            'inventario' => $this->getMetricasInventario(),
        ];
    }

    /**
     * Obtener datos para gráficos de compras por período
     */
    public function getGraficoCompras(string $tipo = 'diario', int $dias = 30): array
    {
        $fechaInicio = Carbon::now()->subDays($dias);

        $compras = Compra::select(
            DB::raw('DATE(fecha) as fecha'),
            DB::raw('COUNT(*) as total_compras'),
            DB::raw('SUM(total) as monto_total'),
            DB::raw('AVG(total) as promedio_compra')
        )
            ->where('fecha', '>=', $fechaInicio)
            ->groupBy(DB::raw('DATE(fecha)'))
            ->orderBy('fecha')
            ->get();

        return [
            'labels' => $compras->pluck('fecha')->map(function ($fecha) {
                return Carbon::parse($fecha)->format('d/m');
            })->toArray(),
            'datasets' => [
                [
                    'label' => 'Monto de Compras (Bs)',
                    'data' => $compras->pluck('monto_total')->toArray(),
                    'backgroundColor' => 'rgba(239, 68, 68, 0.5)',
                    'borderColor' => 'rgb(239, 68, 68)',
                    'tension' => 0.1,
                ],
                [
                    'label' => 'Cantidad de Compras',
                    'data' => $compras->pluck('total_compras')->toArray(),
                    'backgroundColor' => 'rgba(251, 146, 60, 0.5)',
                    'borderColor' => 'rgb(251, 146, 60)',
                    'tension' => 0.1,
                    'yAxisID' => 'y1',
                ],
            ],
        ];
    }

    /**
     * Obtener productos más comprados
     */
    public function getProductosMasComprados(int $limite = 10): array
    {
        return DB::table('detalle_compras')
            ->join('productos', 'detalle_compras.producto_id', '=', 'productos.id')
            ->join('compras', 'detalle_compras.compra_id', '=', 'compras.id')
            ->whereDate('compras.fecha', '>=', Carbon::now()->subDays(30))
            ->select(
                'productos.nombre',
                DB::raw('SUM(detalle_compras.cantidad) as total_comprado'),
                DB::raw('SUM(detalle_compras.subtotal) as gasto_total')
            )
            ->groupBy('productos.id', 'productos.nombre')
            ->orderBy('total_comprado', 'desc')
            ->limit($limite)
            ->get()
            ->toArray();
    }

    /**
     * Obtener alertas de stock bajo
     */
    public function getAlertasStock(): array
    {
        $stockBajo = StockProducto::with(['producto', 'almacen'])
            ->whereColumn('cantidad', '<=', DB::raw('productos.stock_minimo'))
            ->join('productos', 'stock_productos.producto_id', '=', 'productos.id')
            ->where('productos.activo', true)
            ->select('stock_productos.*')
            ->get();

        $stockCritico = $stockBajo->where('cantidad', '<=', function ($item) {
            return $item->producto->stock_minimo * 0.5;
        });

        return [
            'stock_bajo' => $stockBajo->count(),
            'stock_critico' => $stockCritico->count(),
            'productos_afectados' => $stockBajo->take(5)->map(function ($stock) {
                return [
                    'producto' => $stock->producto->nombre,
                    'almacen' => $stock->almacen->nombre,
                    'cantidad_actual' => $stock->cantidad,
                    'stock_minimo' => $stock->producto->stock_minimo,
                ];
            }),
        ];
    }

    /**
     * Obtener métricas de compras
     */
    private function getMetricasCompras(array $fechas): array
    {
        $comprasActuales = Compra::whereBetween('fecha', [$fechas['inicio'], $fechas['fin']])->sum('total');
        $comprasAnteriores = Compra::whereBetween('fecha', [$fechas['inicio_anterior'], $fechas['fin_anterior']])->sum('total');

        $cambio = $comprasAnteriores > 0 ? (($comprasActuales - $comprasAnteriores) / $comprasAnteriores) * 100 : 0;

        return [
            'total' => $comprasActuales,
            'cantidad' => Compra::whereBetween('fecha', [$fechas['inicio'], $fechas['fin']])->count(),
            'promedio' => Compra::whereBetween('fecha', [$fechas['inicio'], $fechas['fin']])->avg('total') ?? 0,
            'cambio_porcentual' => round($cambio, 2),
        ];
    }

    /**
     * Obtener métricas de inventario
     */
    private function getMetricasInventario(): array
    {
        $totalProductos = Producto::where('activo', true)->count();
        $stockTotal = StockProducto::sum('cantidad');
        $valorInventario = DB::table('stock_productos')
            ->join('productos', 'stock_productos.producto_id', '=', 'productos.id')
            ->join('precios_producto', function ($join) {
                $join->on('productos.id', '=', 'precios_producto.producto_id')
                    ->where('precios_producto.es_precio_base', true)
                    ->where('precios_producto.activo', true);
            })
            ->sum(DB::raw('stock_productos.cantidad * precios_producto.precio'));

        return [
            'total_productos' => $totalProductos,
            'stock_total' => $stockTotal,
            'valor_inventario' => $valorInventario,
            'productos_sin_stock' => StockProducto::where('cantidad', '<=', 0)->count(),
        ];
    }

    /**
     * Obtener fechas para el período especificado
     */
    private function getFechasPeriodo(string $periodo): array
    {
        switch ($periodo) {
            case 'hoy':
                $inicio = Carbon::today();
                $fin = Carbon::today()->endOfDay();
                $inicioAnterior = Carbon::yesterday();
                $finAnterior = Carbon::yesterday()->endOfDay();
                break;

            case 'semana_actual':
                $inicio = Carbon::now()->startOfWeek();
                $fin = Carbon::now()->endOfWeek();
                $inicioAnterior = Carbon::now()->subWeek()->startOfWeek();
                $finAnterior = Carbon::now()->subWeek()->endOfWeek();
                break;

            case 'mes_actual':
            default:
                $inicio = Carbon::now()->startOfMonth();
                $fin = Carbon::now()->endOfMonth();
                $inicioAnterior = Carbon::now()->subMonth()->startOfMonth();
                $finAnterior = Carbon::now()->subMonth()->endOfMonth();
                break;

            case 'año_actual':
                $inicio = Carbon::now()->startOfYear();
                $fin = Carbon::now()->endOfYear();
                $inicioAnterior = Carbon::now()->subYear()->startOfYear();
                $finAnterior = Carbon::now()->subYear()->endOfYear();
                break;
        }

        return [
            'inicio' => $inicio,
            'fin' => $fin,
            'inicio_anterior' => $inicioAnterior,
            'fin_anterior' => $finAnterior,
        ];
    }
}
