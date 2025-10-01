import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:18
 * @route '/dashboard'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:18
 * @route '/dashboard'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:18
 * @route '/dashboard'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:18
 * @route '/dashboard'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:18
 * @route '/dashboard'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:18
 * @route '/dashboard'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:18
 * @route '/dashboard'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\DashboardController::metricas
 * @see app/Http/Controllers/DashboardController.php:39
 * @route '/api/dashboard/metricas'
 */
export const metricas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: metricas.url(options),
    method: 'get',
})

metricas.definition = {
    methods: ["get","head"],
    url: '/api/dashboard/metricas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::metricas
 * @see app/Http/Controllers/DashboardController.php:39
 * @route '/api/dashboard/metricas'
 */
metricas.url = (options?: RouteQueryOptions) => {
    return metricas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::metricas
 * @see app/Http/Controllers/DashboardController.php:39
 * @route '/api/dashboard/metricas'
 */
metricas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: metricas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::metricas
 * @see app/Http/Controllers/DashboardController.php:39
 * @route '/api/dashboard/metricas'
 */
metricas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: metricas.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::metricas
 * @see app/Http/Controllers/DashboardController.php:39
 * @route '/api/dashboard/metricas'
 */
    const metricasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: metricas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::metricas
 * @see app/Http/Controllers/DashboardController.php:39
 * @route '/api/dashboard/metricas'
 */
        metricasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: metricas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::metricas
 * @see app/Http/Controllers/DashboardController.php:39
 * @route '/api/dashboard/metricas'
 */
        metricasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: metricas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    metricas.form = metricasForm
/**
* @see \App\Http\Controllers\DashboardController::graficos
 * @see app/Http/Controllers/DashboardController.php:52
 * @route '/api/dashboard/graficos'
 */
export const graficos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: graficos.url(options),
    method: 'get',
})

graficos.definition = {
    methods: ["get","head"],
    url: '/api/dashboard/graficos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::graficos
 * @see app/Http/Controllers/DashboardController.php:52
 * @route '/api/dashboard/graficos'
 */
graficos.url = (options?: RouteQueryOptions) => {
    return graficos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::graficos
 * @see app/Http/Controllers/DashboardController.php:52
 * @route '/api/dashboard/graficos'
 */
graficos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: graficos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::graficos
 * @see app/Http/Controllers/DashboardController.php:52
 * @route '/api/dashboard/graficos'
 */
graficos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: graficos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::graficos
 * @see app/Http/Controllers/DashboardController.php:52
 * @route '/api/dashboard/graficos'
 */
    const graficosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: graficos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::graficos
 * @see app/Http/Controllers/DashboardController.php:52
 * @route '/api/dashboard/graficos'
 */
        graficosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: graficos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::graficos
 * @see app/Http/Controllers/DashboardController.php:52
 * @route '/api/dashboard/graficos'
 */
        graficosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: graficos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    graficos.form = graficosForm
/**
* @see \App\Http\Controllers\DashboardController::productosMasComprados
 * @see app/Http/Controllers/DashboardController.php:71
 * @route '/api/dashboard/productos-mas-comprados'
 */
export const productosMasComprados = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productosMasComprados.url(options),
    method: 'get',
})

productosMasComprados.definition = {
    methods: ["get","head"],
    url: '/api/dashboard/productos-mas-comprados',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::productosMasComprados
 * @see app/Http/Controllers/DashboardController.php:71
 * @route '/api/dashboard/productos-mas-comprados'
 */
productosMasComprados.url = (options?: RouteQueryOptions) => {
    return productosMasComprados.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::productosMasComprados
 * @see app/Http/Controllers/DashboardController.php:71
 * @route '/api/dashboard/productos-mas-comprados'
 */
productosMasComprados.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productosMasComprados.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::productosMasComprados
 * @see app/Http/Controllers/DashboardController.php:71
 * @route '/api/dashboard/productos-mas-comprados'
 */
productosMasComprados.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: productosMasComprados.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::productosMasComprados
 * @see app/Http/Controllers/DashboardController.php:71
 * @route '/api/dashboard/productos-mas-comprados'
 */
    const productosMasCompradosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: productosMasComprados.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::productosMasComprados
 * @see app/Http/Controllers/DashboardController.php:71
 * @route '/api/dashboard/productos-mas-comprados'
 */
        productosMasCompradosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: productosMasComprados.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::productosMasComprados
 * @see app/Http/Controllers/DashboardController.php:71
 * @route '/api/dashboard/productos-mas-comprados'
 */
        productosMasCompradosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: productosMasComprados.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    productosMasComprados.form = productosMasCompradosForm
/**
* @see \App\Http\Controllers\DashboardController::alertasStock
 * @see app/Http/Controllers/DashboardController.php:84
 * @route '/api/dashboard/alertas-stock'
 */
export const alertasStock = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: alertasStock.url(options),
    method: 'get',
})

alertasStock.definition = {
    methods: ["get","head"],
    url: '/api/dashboard/alertas-stock',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::alertasStock
 * @see app/Http/Controllers/DashboardController.php:84
 * @route '/api/dashboard/alertas-stock'
 */
alertasStock.url = (options?: RouteQueryOptions) => {
    return alertasStock.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::alertasStock
 * @see app/Http/Controllers/DashboardController.php:84
 * @route '/api/dashboard/alertas-stock'
 */
alertasStock.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: alertasStock.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::alertasStock
 * @see app/Http/Controllers/DashboardController.php:84
 * @route '/api/dashboard/alertas-stock'
 */
alertasStock.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: alertasStock.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::alertasStock
 * @see app/Http/Controllers/DashboardController.php:84
 * @route '/api/dashboard/alertas-stock'
 */
    const alertasStockForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: alertasStock.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::alertasStock
 * @see app/Http/Controllers/DashboardController.php:84
 * @route '/api/dashboard/alertas-stock'
 */
        alertasStockForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: alertasStock.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::alertasStock
 * @see app/Http/Controllers/DashboardController.php:84
 * @route '/api/dashboard/alertas-stock'
 */
        alertasStockForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: alertasStock.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    alertasStock.form = alertasStockForm
const DashboardController = { index, metricas, graficos, productosMasComprados, alertasStock }

export default DashboardController