<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class AgenteWebhookController extends Controller
{
    /**
     * Recibir notificación del agente externo
     *
     * Endpoint flexible que acepta cualquier tipo de notificación
     * y la distribuye a los usuarios correspondientes
     */
    public function recibirNotificacion(Request $request)
    {
        try {
            // Validar estructura básica
            $validated = $request->validate([
                'tipo' => 'required|string',
                'titulo' => 'required|string',
                'mensaje' => 'required|string',
                'prioridad' => 'sometimes|string|in:alta,media,baja',
                'url' => 'nullable|string',
                'data' => 'nullable|array',
                'usuarios' => 'nullable|array',
                'roles' => 'nullable|array',
            ]);

            // Determinar destinatarios
            $usuarios = $this->determinarDestinatarios(
                $validated['usuarios'] ?? null,
                $validated['roles'] ?? null,
                $validated['tipo']
            );

            if ($usuarios->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se encontraron usuarios destinatarios'
                ], 400);
            }

            // Crear notificación en base de datos para cada usuario
            foreach ($usuarios as $usuario) {
                $usuario->notifications()->create([
                    'id' => \Illuminate\Support\Str::uuid(),
                    'type' => 'App\\Notifications\\AgenteExternoNotification',
                    'data' => [
                        'tipo' => $validated['tipo'],
                        'titulo' => $validated['titulo'],
                        'mensaje' => $validated['mensaje'],
                        'prioridad' => $validated['prioridad'] ?? 'media',
                        'url' => $validated['url'] ?? null,
                        'origen' => 'agente_externo',
                        'data_adicional' => $validated['data'] ?? [],
                    ],
                    'read_at' => null,
                ]);
            }

            // Log para auditoría
            Log::info('Notificación recibida del agente externo', [
                'tipo' => $validated['tipo'],
                'usuarios_notificados' => $usuarios->count(),
                'request_ip' => $request->ip(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Notificación procesada correctamente',
                'usuarios_notificados' => $usuarios->count(),
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Datos inválidos',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error al procesar notificación del agente', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al procesar notificación',
            ], 500);
        }
    }

    /**
     * Endpoint de prueba para verificar conectividad
     */
    public function ping(Request $request)
    {
        return response()->json([
            'success' => true,
            'message' => 'Webhook activo',
            'timestamp' => now()->toIso8601String(),
            'request_ip' => $request->ip(),
        ]);
    }

    /**
     * Determinar usuarios destinatarios basado en criterios
     */
    private function determinarDestinatarios($usuariosIds, $roles, $tipo)
    {
        // Si se especificaron usuarios específicos
        if (!empty($usuariosIds)) {
            return User::whereIn('id', $usuariosIds)->get();
        }

        // Si se especificaron roles
        if (!empty($roles)) {
            return User::whereHas('roles', function ($q) use ($roles) {
                $q->whereIn('name', $roles);
            })->get();
        }

        // Destinatarios por defecto según tipo de notificación
        return $this->obtenerDestinatariosPorTipo($tipo);
    }

    /**
     * Obtener destinatarios por defecto según tipo de notificación
     */
    private function obtenerDestinatariosPorTipo($tipo)
    {
        // Mapeo de tipos de notificación a roles
        $mapaRoles = [
            'stock_bajo' => ['admin', 'gerente', 'encargado_inventario'],
            'proximos_vencer' => ['admin', 'gerente', 'encargado_inventario'],
            'alerta_general' => ['admin', 'gerente'],
            'venta_aprobada' => ['admin', 'gerente', 'vendedor'],
            'compra_pendiente' => ['admin', 'gerente', 'encargado_compras'],
            'reporte_generado' => ['admin', 'gerente'],
            'error_sistema' => ['admin'],
        ];

        $rolesDestino = $mapaRoles[$tipo] ?? ['admin', 'gerente'];

        return User::whereHas('roles', function ($q) use ($rolesDestino) {
            $q->whereIn('name', $rolesDestino);
        })
        ->orWhere('email', 'like', '%admin%') // Fallback
        ->get();
    }

    /**
     * Obtener historial de notificaciones del agente
     */
    public function historial(Request $request)
    {
        $perPage = $request->input('per_page', 20);

        $notificaciones = \DB::table('notifications')
            ->where('type', 'App\\Notifications\\AgenteExternoNotification')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $notificaciones,
        ]);
    }
}
