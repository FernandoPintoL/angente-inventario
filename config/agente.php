<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Configuración del Agente de Inventario
    |--------------------------------------------------------------------------
    |
    | Configuración para la integración con el agente de inventario basado
    | en LANGCHAIN que gestiona consultas en lenguaje natural.
    |
    */

    'base_url' => env('AGENTE_INVENTARIO_URL', 'http://localhost:8000'),

    'timeout' => env('AGENTE_INVENTARIO_TIMEOUT', 30),

    'retry_attempts' => env('AGENTE_INVENTARIO_RETRY', 3),

    'enable_fallback' => env('AGENTE_INVENTARIO_FALLBACK', true),

    'log_queries' => env('AGENTE_INVENTARIO_LOG', true),

    'cache_responses' => env('AGENTE_INVENTARIO_CACHE', false),

    'cache_ttl' => env('AGENTE_INVENTARIO_CACHE_TTL', 300), // 5 minutos

    /*
    |--------------------------------------------------------------------------
    | Configuración del Chat
    |--------------------------------------------------------------------------
    */

    'chat' => [
        'max_messages_per_session' => 100,
        'session_timeout' => 3600, // 1 hora
        'enable_history' => true,
        'history_retention_days' => 30,
    ],

    /*
    |--------------------------------------------------------------------------
    | Permisos del Módulo
    |--------------------------------------------------------------------------
    */

    'permissions' => [
        'agente.use' => 'Usar agente de inventario',
        'agente.history' => 'Ver historial de conversaciones',
        'agente.admin' => 'Administrar configuración del agente',
    ],
];