import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\AgenteWebhookController::recibirNotificacion
 * @see app/Http/Controllers/Api/AgenteWebhookController.php:19
 * @route '/api/webhooks/agente/notificacion'
 */
export const recibirNotificacion = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recibirNotificacion.url(options),
    method: 'post',
})

recibirNotificacion.definition = {
    methods: ["post"],
    url: '/api/webhooks/agente/notificacion',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AgenteWebhookController::recibirNotificacion
 * @see app/Http/Controllers/Api/AgenteWebhookController.php:19
 * @route '/api/webhooks/agente/notificacion'
 */
recibirNotificacion.url = (options?: RouteQueryOptions) => {
    return recibirNotificacion.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AgenteWebhookController::recibirNotificacion
 * @see app/Http/Controllers/Api/AgenteWebhookController.php:19
 * @route '/api/webhooks/agente/notificacion'
 */
recibirNotificacion.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recibirNotificacion.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\AgenteWebhookController::recibirNotificacion
 * @see app/Http/Controllers/Api/AgenteWebhookController.php:19
 * @route '/api/webhooks/agente/notificacion'
 */
    const recibirNotificacionForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: recibirNotificacion.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\AgenteWebhookController::recibirNotificacion
 * @see app/Http/Controllers/Api/AgenteWebhookController.php:19
 * @route '/api/webhooks/agente/notificacion'
 */
        recibirNotificacionForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: recibirNotificacion.url(options),
            method: 'post',
        })
    
    recibirNotificacion.form = recibirNotificacionForm
/**
* @see \App\Http\Controllers\Api\AgenteWebhookController::ping
 * @see app/Http/Controllers/Api/AgenteWebhookController.php:101
 * @route '/api/webhooks/agente/ping'
 */
export const ping = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ping.url(options),
    method: 'get',
})

ping.definition = {
    methods: ["get","head"],
    url: '/api/webhooks/agente/ping',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AgenteWebhookController::ping
 * @see app/Http/Controllers/Api/AgenteWebhookController.php:101
 * @route '/api/webhooks/agente/ping'
 */
ping.url = (options?: RouteQueryOptions) => {
    return ping.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AgenteWebhookController::ping
 * @see app/Http/Controllers/Api/AgenteWebhookController.php:101
 * @route '/api/webhooks/agente/ping'
 */
ping.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ping.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AgenteWebhookController::ping
 * @see app/Http/Controllers/Api/AgenteWebhookController.php:101
 * @route '/api/webhooks/agente/ping'
 */
ping.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ping.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\AgenteWebhookController::ping
 * @see app/Http/Controllers/Api/AgenteWebhookController.php:101
 * @route '/api/webhooks/agente/ping'
 */
    const pingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ping.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\AgenteWebhookController::ping
 * @see app/Http/Controllers/Api/AgenteWebhookController.php:101
 * @route '/api/webhooks/agente/ping'
 */
        pingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ping.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\AgenteWebhookController::ping
 * @see app/Http/Controllers/Api/AgenteWebhookController.php:101
 * @route '/api/webhooks/agente/ping'
 */
        pingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ping.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ping.form = pingForm
/**
* @see \App\Http\Controllers\Api\AgenteWebhookController::historial
 * @see app/Http/Controllers/Api/AgenteWebhookController.php:160
 * @route '/api/webhooks/agente/historial'
 */
export const historial = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historial.url(options),
    method: 'get',
})

historial.definition = {
    methods: ["get","head"],
    url: '/api/webhooks/agente/historial',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AgenteWebhookController::historial
 * @see app/Http/Controllers/Api/AgenteWebhookController.php:160
 * @route '/api/webhooks/agente/historial'
 */
historial.url = (options?: RouteQueryOptions) => {
    return historial.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AgenteWebhookController::historial
 * @see app/Http/Controllers/Api/AgenteWebhookController.php:160
 * @route '/api/webhooks/agente/historial'
 */
historial.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historial.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AgenteWebhookController::historial
 * @see app/Http/Controllers/Api/AgenteWebhookController.php:160
 * @route '/api/webhooks/agente/historial'
 */
historial.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: historial.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\AgenteWebhookController::historial
 * @see app/Http/Controllers/Api/AgenteWebhookController.php:160
 * @route '/api/webhooks/agente/historial'
 */
    const historialForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: historial.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\AgenteWebhookController::historial
 * @see app/Http/Controllers/Api/AgenteWebhookController.php:160
 * @route '/api/webhooks/agente/historial'
 */
        historialForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: historial.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\AgenteWebhookController::historial
 * @see app/Http/Controllers/Api/AgenteWebhookController.php:160
 * @route '/api/webhooks/agente/historial'
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
const AgenteWebhookController = { recibirNotificacion, ping, historial }

export default AgenteWebhookController