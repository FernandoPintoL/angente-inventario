<?php

namespace App\Http\Controllers;

use App\Services\AgenteInventarioService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AgenteController extends Controller
{
    protected $agenteService;

    public function __construct(AgenteInventarioService $agenteService)
    {
        $this->agenteService = $agenteService;
        $this->middleware(['auth', 'verified']);
        $this->middleware('permission:agente.use');
    }

    public function index()
    {
        $user = Auth::user();

        $canUseAgent = $user->can('agente.use');
        $canViewHistory = $user->can('agente.history');

        // Verificar el estado del agente
        $agentHealth = [
            'status' => $this->agenteService->isHealthy() ? 'ok' : 'error',
            'message' => $this->agenteService->isHealthy()
                ? 'Agente de inventario conectado y funcionando'
                : 'Agente de inventario no disponible'
        ];

        return Inertia::render('agente/index', [
            'canUseAgent' => $canUseAgent,
            'canViewHistory' => $canViewHistory,
            'agentHealth' => $agentHealth,
        ]);
    }

    public function dashboard()
    {
        return redirect()->route('agente.index');
    }
}