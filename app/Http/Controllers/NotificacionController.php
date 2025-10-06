<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificacionController extends Controller
{
    /**
     * Obtener notificaciones del usuario autenticado
     */
    public function index(Request $request)
    {
        $usuario = Auth::user();

        $notificaciones = $usuario->notifications()
            ->latest()
            ->paginate($request->input('per_page', 10));

        return response()->json([
            'success' => true,
            'data' => $notificaciones
        ]);
    }

    /**
     * Obtener notificaciones no leídas
     */
    public function noLeidas(Request $request)
    {
        $usuario = Auth::user();

        $notificaciones = $usuario->unreadNotifications()
            ->latest()
            ->take($request->input('limit', 10))
            ->get();

        return response()->json([
            'success' => true,
            'data' => $notificaciones,
            'total' => $usuario->unreadNotifications()->count()
        ]);
    }

    /**
     * Contar notificaciones no leídas
     */
    public function contarNoLeidas()
    {
        $count = Auth::user()->unreadNotifications()->count();

        return response()->json([
            'success' => true,
            'count' => $count
        ]);
    }

    /**
     * Marcar una notificación como leída
     */
    public function marcarComoLeida($id)
    {
        $notificacion = Auth::user()
            ->notifications()
            ->where('id', $id)
            ->firstOrFail();

        $notificacion->markAsRead();

        return response()->json([
            'success' => true,
            'message' => 'Notificación marcada como leída'
        ]);
    }

    /**
     * Marcar todas las notificaciones como leídas
     */
    public function marcarTodasComoLeidas()
    {
        Auth::user()->unreadNotifications->markAsRead();

        return response()->json([
            'success' => true,
            'message' => 'Todas las notificaciones marcadas como leídas'
        ]);
    }

    /**
     * Eliminar una notificación
     */
    public function eliminar($id)
    {
        $notificacion = Auth::user()
            ->notifications()
            ->where('id', $id)
            ->firstOrFail();

        $notificacion->delete();

        return response()->json([
            'success' => true,
            'message' => 'Notificación eliminada'
        ]);
    }

    /**
     * Eliminar todas las notificaciones leídas
     */
    public function eliminarLeidas()
    {
        Auth::user()->readNotifications()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Notificaciones leídas eliminadas'
        ]);
    }
}
