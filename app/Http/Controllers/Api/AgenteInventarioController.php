<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ConversacionAgente;
use App\Services\AgenteInventarioService;
use App\Services\ReportExportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AgenteInventarioController extends Controller
{
    protected $agenteService;
    protected $exportService;

    public function __construct(AgenteInventarioService $agenteService, ReportExportService $exportService)
    {
        $this->agenteService = $agenteService;
        $this->exportService = $exportService;
    }

    public function health()
    {
        // Verificar estado del agente externo
        $agentStatus = $this->agenteService->getHealthStatus();

        return response()->json([
            'status' => 'healthy',
            'service' => 'inventory-agent-proxy',
            'version' => '2.0.0',
            'environment' => config('app.env'),
            'external_agent' => $agentStatus,
            'timestamp' => now()->toISOString()
        ]);
    }

    public function ask(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'sometimes|string|max:255',
            'query' => 'required|string|max:1000',
            'context' => 'sometimes|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'response' => 'Datos de entrada inválidos. Por favor verifica tu consulta.',
                'confidence' => 0.0,
                'intent' => 'validation_error',
                'data' => [
                    'errors' => $validator->errors(),
                    'received_fields' => array_keys($request->all())
                ],
                'success' => false
            ], 422);
        }

        try {
            $user = Auth::user();
            $query = $request->input('query');
            $context = $request->input('context', []);

            // Usar user_id del request si está presente, sino usar el ID del usuario autenticado
            $userId = $request->input('user_id', $user->id);

            // Guardar conversación en el historial
            $conversacion = ConversacionAgente::create([
                'user_id' => $user->id,
                'query' => $query,
                'context' => $context,
                'session_id' => $request->session()->getId()
            ]);

            // Enviar consulta al agente externo
            $response = $this->agenteService->ask($userId, $query, $context);

            // Actualizar conversación con la respuesta
            $conversacion->update([
                'response' => $response,
                'status' => 'completed'
            ]);

            return response()->json($response);

        } catch (\Exception $e) {
            Log::error('Error en consulta al agente de inventario', [
                'user_id' => $user->id ?? null,
                'query' => $query ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Actualizar estado de error en conversación si existe
            if (isset($conversacion)) {
                $conversacion->update([
                    'status' => 'failed',
                    'error_message' => $e->getMessage()
                ]);
            }

            return response()->json([
                'response' => 'Lo siento, ocurrió un error al procesar tu consulta. Intente nuevamente.',
                'confidence' => 0.0,
                'intent' => 'error',
                'data' => [
                    'error' => config('app.debug') ? $e->getMessage() : 'Error interno del servidor',
                    'error_type' => 'internal_server_error'
                ],
                'success' => false
            ], 500);
        }
    }

    public function historial(Request $request)
    {
        $user = Auth::user();

        $conversaciones = ConversacionAgente::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get()
            ->map(function ($conversacion) {
                return [
                    'id' => $conversacion->id,
                    'query' => $conversacion->query,
                    'response' => $conversacion->response,
                    'created_at' => $conversacion->created_at->toISOString(),
                    'status' => $conversacion->status
                ];
            });

        return response()->json([
            'historial' => $conversaciones
        ]);
    }

    public function conversacion($id)
    {
        $user = Auth::user();

        $conversacion = ConversacionAgente::where('user_id', $user->id)
            ->where('id', $id)
            ->firstOrFail();

        return response()->json([
            'conversacion' => [
                'id' => $conversacion->id,
                'query' => $conversacion->query,
                'response' => $conversacion->response,
                'context' => $conversacion->context,
                'created_at' => $conversacion->created_at->toISOString(),
                'status' => $conversacion->status,
                'error_message' => $conversacion->error_message
            ]
        ]);
    }

    public function eliminarHistorial(Request $request)
    {
        $user = Auth::user();

        $deleted = ConversacionAgente::where('user_id', $user->id)->delete();

        return response()->json([
            'message' => "Se eliminaron {$deleted} conversaciones del historial"
        ]);
    }

    public function exportReport(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'format' => 'required|in:pdf,excel',
                'title' => 'required|string|max:255',
                'data' => 'required|array',
                'columns' => 'required|array'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Datos de entrada inválidos',
                    'errors' => $validator->errors()
                ], 422);
            }

            $format = $request->input('format');
            $title = $request->input('title');
            $data = $request->input('data');
            $columns = $request->input('columns');

            // Aplicar filtros si están presentes
            $filteredData = $this->applyFilters($data, $request->query());

            if ($format === 'pdf') {
                $content = $this->exportService->exportToPdf($filteredData, $columns, $title);
                $filename = $this->generateFileName($title, 'pdf');

                return response($content, 200, [
                    'Content-Type' => 'application/pdf',
                    'Content-Disposition' => 'attachment; filename="' . $filename . '"'
                ]);
            } else {
                $content = $this->exportService->exportToExcel($filteredData, $columns, $title);
                $filename = $this->generateFileName($title, 'xlsx');

                return response($content, 200, [
                    'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'Content-Disposition' => 'attachment; filename="' . $filename . '"'
                ]);
            }

        } catch (\Exception $e) {
            Log::error('Error exportando reporte', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error al exportar el reporte',
                'error' => config('app.debug') ? $e->getMessage() : 'Error interno del servidor'
            ], 500);
        }
    }

    private function applyFilters(array $data, array $filters): array
    {
        $filteredData = $data;

        // Aplicar filtro de búsqueda
        if (isset($filters['search']) && !empty($filters['search'])) {
            $searchTerm = strtolower($filters['search']);
            $filteredData = array_filter($filteredData, function ($row) use ($searchTerm) {
                foreach ($row as $value) {
                    if ($value && stripos($value, $searchTerm) !== false) {
                        return true;
                    }
                }
                return false;
            });
        }

        // Aplicar ordenamiento
        if (isset($filters['sort_column']) && !empty($filters['sort_column']) &&
            isset($filters['sort_direction']) && !empty($filters['sort_direction'])) {

            $sortColumn = $filters['sort_column'];
            $sortDirection = $filters['sort_direction'];

            usort($filteredData, function ($a, $b) use ($sortColumn, $sortDirection) {
                $aValue = $a[$sortColumn] ?? '';
                $bValue = $b[$sortColumn] ?? '';

                // Intentar conversión numérica
                if (is_numeric($aValue) && is_numeric($bValue)) {
                    $result = $aValue <=> $bValue;
                } else {
                    $result = strcasecmp($aValue, $bValue);
                }

                return $sortDirection === 'desc' ? -$result : $result;
            });
        }

        return array_values($filteredData); // Reindexar el array
    }

    private function generateFileName(string $title, string $extension): string
    {
        $sanitizedTitle = preg_replace('/[^a-zA-Z0-9\s]/', '', $title);
        $sanitizedTitle = preg_replace('/\s+/', '_', trim($sanitizedTitle));
        $timestamp = now()->format('Y-m-d_H-i-s');

        return strtolower($sanitizedTitle) . '_' . $timestamp . '.' . $extension;
    }
}