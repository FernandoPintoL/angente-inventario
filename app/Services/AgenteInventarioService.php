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
            // Enriquecer el contexto con datos de inventario relevantes
            $enrichedContext = $this->enrichContext($context, $query);

            $response = Http::timeout($this->timeout)
                ->post("{$this->baseUrl}/api/v1/ask", [
                    'user_id' => $userId,
                    'query' => $query,
                    'context' => $enrichedContext
                ]);

            if ($response->successful()) {
                return $response->json();
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

            // Manejar ambos formatos de respuesta
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

                // Normalizar formato de respuesta - manejar formato actual del agente
                if (isset($data['component']) && $data['component'] === 'agent') {
                    return [
                        'status' => $data['status'] ?? 'unknown',
                        'service' => 'inventory-agent',
                        'version' => '2.0.0', // Asumir versión actual
                        'environment' => 'production',
                        'message' => $data['message'] ?? null,
                        'component' => $data['component']
                    ];
                }

                // Mantener formato original si ya está en el formato correcto
                return $data;
            }

            return [
                'status' => 'unhealthy',
                'service' => 'inventory-agent',
                'version' => 'unknown',
                'environment' => 'unknown',
                'error' => 'HTTP ' . $response->status()
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'unhealthy',
                'service' => 'inventory-agent',
                'version' => 'unknown',
                'environment' => 'unknown',
                'error' => $e->getMessage()
            ];
        }
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

        // Consulta de ayuda
        if (preg_match('/ayuda|help|comandos|qué puedes hacer/i', $query)) {
            return [
                'response' => "🤖 **Agente de Inventario (Modo Local)**\n\n**Comandos disponibles:**\n• Consultar stock bajo: 'productos con stock bajo'\n• Consultar producto: 'stock de [SKU]'\n• Esta funcionalidad limitada está disponible mientras el agente principal no esté conectado.",
                'confidence' => 1.0,
                'intent' => 'ayuda_local',
                'data' => [
                    'available_features' => ['consultar_stock_bajo', 'consultar_producto_sku'],
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