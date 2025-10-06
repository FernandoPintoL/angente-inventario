<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateAgenteWebhook
{
    /**
     * Handle an incoming request.
     *
     * Valida que las peticiones al webhook provengan del agente externo
     * mediante un token de seguridad o validación de IP
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Opción 1: Validar por token en header
        $token = $request->header('X-Agente-Token');
        $expectedToken = config('services.agente_inventario.webhook_token');

        if ($expectedToken && $token !== $expectedToken) {
            return response()->json([
                'success' => false,
                'message' => 'Token de autenticación inválido'
            ], 401);
        }

        // Opción 2: Validar por IP del agente (opcional)
        $allowedIps = config('services.agente_inventario.allowed_ips', []);

        if (!empty($allowedIps) && !in_array($request->ip(), $allowedIps)) {
            \Log::warning('Intento de webhook desde IP no autorizada', [
                'ip' => $request->ip(),
                'url' => $request->fullUrl(),
            ]);

            // Opcional: retornar error si quieres bloquear IPs no autorizadas
            // return response()->json(['success' => false, 'message' => 'IP no autorizada'], 403);
        }

        return $next($request);
    }
}
