import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\AgenteController::index
 * @see app/Http/Controllers/AgenteController.php:21
 * @route '/agente'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/agente',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AgenteController::index
 * @see app/Http/Controllers/AgenteController.php:21
 * @route '/agente'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgenteController::index
 * @see app/Http/Controllers/AgenteController.php:21
 * @route '/agente'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AgenteController::index
 * @see app/Http/Controllers/AgenteController.php:21
 * @route '/agente'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AgenteController::index
 * @see app/Http/Controllers/AgenteController.php:21
 * @route '/agente'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AgenteController::index
 * @see app/Http/Controllers/AgenteController.php:21
 * @route '/agente'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AgenteController::index
 * @see app/Http/Controllers/AgenteController.php:21
 * @route '/agente'
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
* @see \App\Http\Controllers\AgenteController::dashboard
 * @see app/Http/Controllers/AgenteController.php:43
 * @route '/agente/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/agente/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AgenteController::dashboard
 * @see app/Http/Controllers/AgenteController.php:43
 * @route '/agente/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgenteController::dashboard
 * @see app/Http/Controllers/AgenteController.php:43
 * @route '/agente/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AgenteController::dashboard
 * @see app/Http/Controllers/AgenteController.php:43
 * @route '/agente/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AgenteController::dashboard
 * @see app/Http/Controllers/AgenteController.php:43
 * @route '/agente/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AgenteController::dashboard
 * @see app/Http/Controllers/AgenteController.php:43
 * @route '/agente/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AgenteController::dashboard
 * @see app/Http/Controllers/AgenteController.php:43
 * @route '/agente/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
const agente = {
    index,
dashboard,
}

export default agente