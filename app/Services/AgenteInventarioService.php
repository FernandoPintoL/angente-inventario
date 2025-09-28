<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\StockProducto;
use App\Models\Producto;
use App\Models\MovimientoInventario;

class AgenteInventarioService
{
    protected $baseUrl;
    protected $timeout;

    public function __construct()
    {
        $this->baseUrl = config('agente.base_url', 'http://localhost:8000');
        $this->timeout = config('agente.timeout', 30);
    }

    public function ask(string $userId, string $query, array $context = []): array
    {
        try {
            // Preparar el payload según la nueva API
            $payload = [
                'human_query' => $query,
                'include_table_info' => false,
                'limit_results' => 100
            ];

            Log::info('Enviando consulta al agente de inventario', [
                'user_id' => $userId,
                'query' => $query,
                'payload' => $payload
            ]);

            $response = Http::timeout($this->timeout)
                ->post("{$this->baseUrl}/api/v1/query", $payload);

            if ($response->successful()) {
                $data = $response->json();

                // Transformar la respuesta del nuevo formato al formato esperado por el frontend
                return $this->transformAgentResponse($data, $userId);
            }

            Log::error('Error en respuesta del agente de inventario', [
                'status' => $response->status(),
                'body' => $response->body(),
                'user_id' => $userId,
                'query' => $query
            ]);

            return [
                'response' => 'El agente de inventario no está disponible en este momento.',
                'confidence' => 0.0,
                'intent' => 'error',
                'data' => [
                    'error' => 'Service unavailable',
                    'status_code' => $response->status()
                ],
                'success' => false
            ];

        } catch (\Exception $e) {
            Log::error('Excepción al comunicarse con agente de inventario', [
                'error' => $e->getMessage(),
                'user_id' => $userId,
                'query' => $query
            ]);

            // Fallback: intentar responder con datos locales
            return $this->handleLocalFallback($query);
        }
    }

    public function isHealthy(): bool
    {
        try {
            $response = Http::timeout(5)
                ->get("{$this->baseUrl}/api/v1/health");

            if (!$response->successful()) {
                return false;
            }

            $data = $response->json();

            // Verificar el nuevo formato de respuesta del agente
            return isset($data['status']) && $data['status'] === 'healthy';
        } catch (\Exception $e) {
            return false;
        }
    }

    public function getHealthStatus(): array
    {
        try {
            $response = Http::timeout(5)
                ->get("{$this->baseUrl}/api/v1/health");

            if ($response->successful()) {
                $data = $response->json();

                // Normalizar formato de respuesta del nuevo agente
                return [
                    'status' => $data['status'] ?? 'unknown',
                    'service' => $data['service'] ?? 'intelligent_agent',
                    'version' => '3.0.0', // Nueva versión del agente
                    'environment' => config('app.env'),
                    'statistics' => $data['statistics'] ?? null,
                    'timestamp' => $data['timestamp'] ?? now()->toISOString()
                ];
            }

            return [
                'status' => 'unhealthy',
                'service' => 'intelligent_agent',
                'version' => 'unknown',
                'environment' => 'unknown',
                'error' => 'HTTP ' . $response->status()
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'unhealthy',
                'service' => 'intelligent_agent',
                'version' => 'unknown',
                'environment' => 'unknown',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Transformar la respuesta del nuevo agente al formato esperado por el frontend
     */
    protected function transformAgentResponse(array $agentData, string $userId): array
    {
        Log::info('Transformando respuesta del agente', [
            'user_id' => $userId,
            'agent_data_keys' => array_keys($agentData)
        ]);

        // Extraer datos de la nueva estructura
        $answer = $agentData['answer'] ?? 'No se pudo procesar la consulta';
        $sqlQuery = $agentData['sql_query'] ?? null;
        $rawData = $agentData['raw_data'] ?? [];
        $structuredData = $agentData['structured_data'] ?? null;
        $executionTime = $agentData['execution_time'] ?? 0;

        // Determinar el tipo de datos para el formatter
        $formattedData = null;
        if ($structuredData && isset($structuredData['columns']) && isset($structuredData['rows'])) {
            // Convertir structured_data a formato para tablas
            $formattedData = [
                'type' => 'structured_table',
                'title' => $this->extractTableTitle($answer, $sqlQuery),
                'columns' => $this->transformColumns($structuredData['columns']),
                'data' => $this->transformRows($structuredData['rows'], $structuredData['columns']),
                'total_rows' => $structuredData['total_rows'] ?? count($structuredData['rows']),
                'sql_query' => $sqlQuery,
                'execution_time' => $executionTime
            ];
        } elseif (!empty($rawData)) {
            // Usar raw_data si no hay structured_data
            $formattedData = [
                'type' => 'raw_data',
                'data' => $rawData,
                'sql_query' => $sqlQuery,
                'execution_time' => $executionTime
            ];
        }

        return [
            'response' => $answer,
            'confidence' => 0.9, // El nuevo agente no provee confidence, asumimos alta
            'intent' => $this->extractIntent($sqlQuery),
            'data' => $formattedData,
            'success' => true,
            'metadata' => [
                'sql_query' => $sqlQuery,
                'execution_time' => $executionTime,
                'timestamp' => $agentData['timestamp'] ?? now()->toISOString(),
                'agent_version' => '3.0.0'
            ]
        ];
    }

    /**
     * Extraer título para la tabla basado en la respuesta
     */
    protected function extractTableTitle(string $answer, ?string $sqlQuery): string
    {
        // Intentar extraer título de la respuesta
        if (preg_match('/^([^:]+):/', $answer, $matches)) {
            return trim($matches[1]);
        }

        // Fallback basado en la consulta SQL
        if ($sqlQuery) {
            if (stripos($sqlQuery, 'productos') !== false) {
                return 'Productos';
            } elseif (stripos($sqlQuery, 'movimientos') !== false) {
                return 'Movimientos de Inventario';
            } elseif (stripos($sqlQuery, 'ventas') !== false) {
                return 'Ventas';
            } elseif (stripos($sqlQuery, 'categorias') !== false) {
                return 'Categorías';
            }
        }

        return 'Reporte de Datos';
    }

    /**
     * Transformar columnas del structured_data al formato esperado
     */
    protected function transformColumns(array $columns): array
    {
        return array_map(function ($column) {
            return [
                'key' => $column['name'],
                'label' => $this->formatColumnLabel($column['name']),
                'sortable' => true,
                'type' => $column['type'],
                'nullable' => $column['nullable'] ?? false
            ];
        }, $columns);
    }

    /**
     * Formatear etiqueta de columna
     */
    protected function formatColumnLabel(string $columnName): string
    {
        $labels = [
            'id' => 'ID',
            'codigo' => 'Código',
            'sku' => 'SKU',
            'nombre' => 'Nombre',
            'descripcion' => 'Descripción',
            'precio' => 'Precio',
            'stock' => 'Stock',
            'cantidad' => 'Cantidad',
            'fecha' => 'Fecha',
            'created_at' => 'Fecha de Creación',
            'updated_at' => 'Última Actualización',
            'categoria' => 'Categoría',
            'marca' => 'Marca',
            'almacen' => 'Almacén',
            'total' => 'Total',
            'estado' => 'Estado'
        ];

        if (isset($labels[$columnName])) {
            return $labels[$columnName];
        }

        // Formateo automático: primera letra mayúscula y reemplazar guiones bajos
        return ucfirst(str_replace('_', ' ', $columnName));
    }

    /**
     * Transformar filas del structured_data a objetos
     */
    protected function transformRows(array $rows, array $columns): array
    {
        return array_map(function ($row) use ($columns) {
            $object = [];
            foreach ($row as $index => $value) {
                if (isset($columns[$index])) {
                    $object[$columns[$index]['name']] = $value;
                }
            }
            return $object;
        }, $rows);
    }

    /**
     * Extraer intent basado en la consulta SQL
     */
    protected function extractIntent(?string $sqlQuery): string
    {
        if (!$sqlQuery) {
            return 'consulta_general';
        }

        $sqlLower = strtolower($sqlQuery);

        if (strpos($sqlLower, 'stock') !== false) {
            return 'consultar_stock';
        } elseif (strpos($sqlLower, 'productos') !== false) {
            return 'consultar_productos';
        } elseif (strpos($sqlLower, 'movimientos') !== false) {
            return 'consultar_movimientos';
        } elseif (strpos($sqlLower, 'ventas') !== false) {
            return 'consultar_ventas';
        } elseif (strpos($sqlLower, 'categorias') !== false) {
            return 'consultar_categorias';
        }

        return 'consulta_sql';
    }

    protected function enrichContext(array $context, string $query): array
    {
        // Si la consulta menciona un SKU específico, agregar información del producto
        if (preg_match('/([A-Z0-9\-]+)/', $query, $matches)) {
            $sku = $matches[1];
            $producto = Producto::where('sku', $sku)->first();

            if ($producto) {
                $context['producto_encontrado'] = [
                    'id' => $producto->id,
                    'sku' => $producto->sku,
                    'nombre' => $producto->nombre,
                    'stock_total' => $producto->stockProductos()->sum('cantidad_disponible'),
                    'precio_venta' => $producto->precioVenta?->precio ?? 0
                ];
            }
        }

        // Agregar estadísticas generales de inventario si no hay contexto específico
        if (empty($context)) {
            $context['inventario_general'] = [
                'total_productos' => Producto::count(),
                'productos_stock_bajo' => StockProducto::join('productos', 'stock_productos.producto_id', '=', 'productos.id')
                    ->whereRaw('stock_productos.cantidad_disponible <= productos.stock_minimo')
                    ->count(),
                'ultimo_movimiento' => MovimientoInventario::latest()->first()?->created_at?->format('Y-m-d H:i:s')
            ];
        }

        return $context;
    }

    /**
     * Obtener productos próximos a vencer
     */
    protected function getProductosProximosVencer(int $dias = 15)
    {
        return Producto::proximosAVencer($dias)
                       ->with([
                           'categoria:id,nombre',
                           'stockProximoVencerRelacion' => function($query) use ($dias) {
                               $query->where('fecha_vencimiento', '<=', now()->addDays($dias))
                                     ->with('almacen:id,nombre')
                                     ->orderBy('fecha_vencimiento');
                           }
                       ])
                       ->get();
    }

    protected function handleLocalFallback(string $query): array
    {
        // Intentar responder con datos locales para consultas comunes

        // Consulta de stock bajo
        if (preg_match('/stock.*bajo|poco.*stock|productos.*agotando/i', $query)) {
            $productosStockBajo = StockProducto::with('producto')
                ->join('productos', 'stock_productos.producto_id', '=', 'productos.id')
                ->whereRaw('stock_productos.cantidad_disponible <= productos.stock_minimo')
                ->select('stock_productos.*')
                ->limit(10)
                ->get()
                ->map(function ($stock) {
                    return [
                        'sku' => $stock->producto->sku ?? 'N/A',
                        'nombre' => $stock->producto->nombre,
                        'stock_actual' => $stock->cantidad_disponible,
                        'stock_minimo' => $stock->producto->stock_minimo
                    ];
                });

            return [
                'response' => "📋 **Productos con Stock Bajo**\n\nEncontré {$productosStockBajo->count()} productos con stock bajo.",
                'confidence' => 0.8,
                'intent' => 'consultar_stock_bajo',
                'data' => [
                    'productos' => $productosStockBajo->toArray(),
                    'total_count' => $productosStockBajo->count()
                ],
                'success' => true
            ];
        }

        // Consulta de SKU específico
        if (preg_match('/stock.*([A-Z0-9\-]+)|([A-Z0-9\-]+).*stock/i', $query, $matches)) {
            $sku = $matches[1] ?? $matches[2];
            $producto = Producto::where('sku', $sku)->first();

            if ($producto) {
                $stockTotal = $producto->stockProductos()->sum('cantidad_disponible');

                return [
                    'response' => "📦 **Stock del Producto {$sku}**\n\n{$producto->nombre}: {$stockTotal} unidades disponibles",
                    'confidence' => 0.9,
                    'intent' => 'consultar_stock_producto',
                    'data' => [
                        'producto' => [
                            'sku' => $producto->sku,
                            'nombre' => $producto->nombre,
                            'stock_total' => $stockTotal,
                            'precio_venta' => $producto->precioVenta?->precio ?? 0
                        ]
                    ],
                    'success' => true
                ];
            } else {
                return [
                    'response' => "❌ No encontré ningún producto con el SKU '{$sku}'. ¿Podrías verificar el SKU?",
                    'confidence' => 0.3,
                    'intent' => 'producto_no_encontrado',
                    'data' => [
                        'searched_sku' => $sku,
                        'suggestions' => ['Verificar el SKU', 'Buscar por nombre del producto']
                    ],
                    'success' => false
                ];
            }
        }

        // Consulta de productos próximos a vencer
        if (preg_match('/próximos.*vencer|prox.*vencer|vencer.*días|productos.*vencen|vencimiento/i', $query)) {
            // Extraer número de días si se especifica
            $dias = 15; // Default
            if (preg_match('/(\d+)\s*días?/i', $query, $matches)) {
                $dias = (int)$matches[1];
            }

            $productosProximosVencer = $this->getProductosProximosVencer($dias);

            if ($productosProximosVencer->isEmpty()) {
                return [
                    'response' => "✅ **Productos Próximos a Vencer ({$dias} días)**\n\n¡Excelente! No hay productos próximos a vencer en los próximos {$dias} días.",
                    'confidence' => 0.9,
                    'intent' => 'consultar_vencimientos',
                    'data' => [
                        'productos' => [],
                        'total_count' => 0,
                        'dias_anticipacion' => $dias,
                        'status' => 'sin_alertas'
                    ],
                    'success' => true
                ];
            }

            $response = "🚨 **Productos Próximos a Vencer ({$dias} días)**\n\n";
            $response .= "Encontré {$productosProximosVencer->count()} productos que requieren atención:\n\n";

            foreach ($productosProximosVencer->take(5) as $producto) {
                $stockVencimiento = $producto->stockProximoVencerRelacion->first();
                $dias_restantes = now()->diffInDays($stockVencimiento->fecha_vencimiento);
                $response .= "• **{$producto->nombre}** (Lote: {$stockVencimiento->lote})\n";
                $response .= "  └ Vence: {$stockVencimiento->fecha_vencimiento->format('d/m/Y')} ({$dias_restantes} días)\n";
                $response .= "  └ Stock: {$stockVencimiento->cantidad} unidades - {$stockVencimiento->almacen->nombre}\n\n";
            }

            if ($productosProximosVencer->count() > 5) {
                $response .= "... y " . ($productosProximosVencer->count() - 5) . " productos más.";
            }

            return [
                'response' => $response,
                'confidence' => 0.95,
                'intent' => 'consultar_vencimientos',
                'data' => [
                    'type' => 'productos_vencimiento',
                    'title' => "Productos Próximos a Vencer ({$dias} días)",
                    'productos' => $productosProximosVencer->map(function($producto) {
                        return [
                            'nombre' => $producto->nombre,
                            'categoria' => $producto->categoria?->nombre ?? 'Sin categoría',
                            'lotes_vencimiento' => $producto->stockProximoVencerRelacion->map(function($stock) {
                                return [
                                    'lote' => $stock->lote,
                                    'fecha_vencimiento' => $stock->fecha_vencimiento->format('Y-m-d'),
                                    'dias_restantes' => now()->diffInDays($stock->fecha_vencimiento),
                                    'cantidad' => $stock->cantidad,
                                    'almacen' => $stock->almacen->nombre
                                ];
                            })->toArray()
                        ];
                    })->toArray(),
                    'total_count' => $productosProximosVencer->count(),
                    'dias_anticipacion' => $dias
                ],
                'success' => true
            ];
        }

        // Consulta de ayuda
        if (preg_match('/ayuda|help|comandos|qué puedes hacer/i', $query)) {
            return [
                'response' => "🤖 **Agente de Inventario (Modo Local)**\n\n**Comandos disponibles:**\n• Consultar stock bajo: 'productos con stock bajo'\n• Consultar producto: 'stock de [SKU]'\n• Productos próximos a vencer: 'productos próximos a vencer' o 'productos que vencen en 10 días'\n• Esta funcionalidad limitada está disponible mientras el agente principal no esté conectado.",
                'confidence' => 1.0,
                'intent' => 'ayuda_local',
                'data' => [
                    'available_features' => ['consultar_stock_bajo', 'consultar_producto_sku', 'consultar_vencimientos'],
                    'mode' => 'local_fallback'
                ],
                'success' => true
            ];
        }

        // Respuesta por defecto
        return [
            'response' => 'Lo siento, el agente de inventario no está disponible. Funcionalidad limitada activa. Usa "ayuda" para ver comandos disponibles.',
            'confidence' => 0.1,
            'intent' => 'consulta_desconocida',
            'data' => [
                'error' => 'Agent service unavailable',
                'fallback_mode' => true,
                'suggestions' => ['ayuda', 'stock bajo', 'stock de [SKU]']
            ],
            'success' => false
        ];
    }
}