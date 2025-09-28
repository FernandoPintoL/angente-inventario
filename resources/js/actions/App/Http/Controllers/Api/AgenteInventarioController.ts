import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\AgenteInventarioController::health
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:25
 * @route '/api/agente/health'
 */
export const health = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: health.url(options),
    method: 'get',
})

health.definition = {
    methods: ["get","head"],
    url: '/api/agente/health',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AgenteInventarioController::health
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:25
 * @route '/api/agente/health'
 */
health.url = (options?: RouteQueryOptions) => {
    return health.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AgenteInventarioController::health
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:25
 * @route '/api/agente/health'
 */
health.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: health.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AgenteInventarioController::health
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:25
 * @route '/api/agente/health'
 */
health.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: health.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\AgenteInventarioController::health
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:25
 * @route '/api/agente/health'
 */
    const healthForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: health.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\AgenteInventarioController::health
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:25
 * @route '/api/agente/health'
 */
        healthForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: health.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\AgenteInventarioController::health
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:25
 * @route '/api/agente/health'
 */
        healthForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: health.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    health.form = healthForm
/**
* @see \App\Http\Controllers\Api\AgenteInventarioController::ask
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:40
 * @route '/api/agente/ask'
 */
export const ask = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ask.url(options),
    method: 'post',
})

ask.definition = {
    methods: ["post"],
    url: '/api/agente/ask',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AgenteInventarioController::ask
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:40
 * @route '/api/agente/ask'
 */
ask.url = (options?: RouteQueryOptions) => {
    return ask.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AgenteInventarioController::ask
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:40
 * @route '/api/agente/ask'
 */
ask.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ask.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\AgenteInventarioController::ask
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:40
 * @route '/api/agente/ask'
 */
    const askForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: ask.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\AgenteInventarioController::ask
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:40
 * @route '/api/agente/ask'
 */
        askForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: ask.url(options),
            method: 'post',
        })
    
    ask.form = askForm
/**
* @see \App\Http\Controllers\Api\AgenteInventarioController::historial
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:117
 * @route '/api/agente/historial'
 */
export const historial = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historial.url(options),
    method: 'get',
})

historial.definition = {
    methods: ["get","head"],
    url: '/api/agente/historial',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AgenteInventarioController::historial
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:117
 * @route '/api/agente/historial'
 */
historial.url = (options?: RouteQueryOptions) => {
    return historial.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AgenteInventarioController::historial
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:117
 * @route '/api/agente/historial'
 */
historial.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historial.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AgenteInventarioController::historial
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:117
 * @route '/api/agente/historial'
 */
historial.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: historial.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\AgenteInventarioController::historial
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:117
 * @route '/api/agente/historial'
 */
    const historialForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: historial.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\AgenteInventarioController::historial
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:117
 * @route '/api/agente/historial'
 */
        historialForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: historial.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\AgenteInventarioController::historial
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:117
 * @route '/api/agente/historial'
 */
        historialForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: historial.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    historial.form = historialForm
/**
* @see \App\Http\Controllers\Api\AgenteInventarioController::conversacion
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:140
 * @route '/api/agente/conversacion/{id}'
 */
export const conversacion = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: conversacion.url(args, options),
    method: 'get',
})

conversacion.definition = {
    methods: ["get","head"],
    url: '/api/agente/conversacion/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AgenteInventarioController::conversacion
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:140
 * @route '/api/agente/conversacion/{id}'
 */
conversacion.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return conversacion.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AgenteInventarioController::conversacion
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:140
 * @route '/api/agente/conversacion/{id}'
 */
conversacion.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: conversacion.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AgenteInventarioController::conversacion
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:140
 * @route '/api/agente/conversacion/{id}'
 */
conversacion.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: conversacion.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\AgenteInventarioController::conversacion
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:140
 * @route '/api/agente/conversacion/{id}'
 */
    const conversacionForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: conversacion.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\AgenteInventarioController::conversacion
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:140
 * @route '/api/agente/conversacion/{id}'
 */
        conversacionForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: conversacion.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\AgenteInventarioController::conversacion
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:140
 * @route '/api/agente/conversacion/{id}'
 */
        conversacionForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: conversacion.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    conversacion.form = conversacionForm
/**
* @see \App\Http\Controllers\Api\AgenteInventarioController::eliminarHistorial
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:161
 * @route '/api/agente/historial'
 */
export const eliminarHistorial = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: eliminarHistorial.url(options),
    method: 'delete',
})

eliminarHistorial.definition = {
    methods: ["delete"],
    url: '/api/agente/historial',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\AgenteInventarioController::eliminarHistorial
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:161
 * @route '/api/agente/historial'
 */
eliminarHistorial.url = (options?: RouteQueryOptions) => {
    return eliminarHistorial.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AgenteInventarioController::eliminarHistorial
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:161
 * @route '/api/agente/historial'
 */
eliminarHistorial.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: eliminarHistorial.url(options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\AgenteInventarioController::eliminarHistorial
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:161
 * @route '/api/agente/historial'
 */
    const eliminarHistorialForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: eliminarHistorial.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\AgenteInventarioController::eliminarHistorial
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:161
 * @route '/api/agente/historial'
 */
        eliminarHistorialForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: eliminarHistorial.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    eliminarHistorial.form = eliminarHistorialForm
/**
* @see \App\Http\Controllers\Api\AgenteInventarioController::exportReport
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:172
 * @route '/api/agente/export-report'
 */
export const exportReport = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: exportReport.url(options),
    method: 'post',
})

exportReport.definition = {
    methods: ["post"],
    url: '/api/agente/export-report',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AgenteInventarioController::exportReport
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:172
 * @route '/api/agente/export-report'
 */
exportReport.url = (options?: RouteQueryOptions) => {
    return exportReport.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AgenteInventarioController::exportReport
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:172
 * @route '/api/agente/export-report'
 */
exportReport.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: exportReport.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\AgenteInventarioController::exportReport
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:172
 * @route '/api/agente/export-report'
 */
    const exportReportForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: exportReport.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\AgenteInventarioController::exportReport
 * @see app/Http/Controllers/Api/AgenteInventarioController.php:172
 * @route '/api/agente/export-report'
 */
        exportReportForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: exportReport.url(options),
            method: 'post',
        })
    
    exportReport.form = exportReportForm
const AgenteInventarioController = { health, ask, historial, conversacion, eliminarHistorial, exportReport }

export default AgenteInventarioController