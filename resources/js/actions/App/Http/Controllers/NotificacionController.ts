import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\NotificacionController::index
 * @see app/Http/Controllers/NotificacionController.php:13
 * @route '/api/notificaciones'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/notificaciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\NotificacionController::index
 * @see app/Http/Controllers/NotificacionController.php:13
 * @route '/api/notificaciones'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionController::index
 * @see app/Http/Controllers/NotificacionController.php:13
 * @route '/api/notificaciones'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\NotificacionController::index
 * @see app/Http/Controllers/NotificacionController.php:13
 * @route '/api/notificaciones'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\NotificacionController::index
 * @see app/Http/Controllers/NotificacionController.php:13
 * @route '/api/notificaciones'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\NotificacionController::index
 * @see app/Http/Controllers/NotificacionController.php:13
 * @route '/api/notificaciones'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\NotificacionController::index
 * @see app/Http/Controllers/NotificacionController.php:13
 * @route '/api/notificaciones'
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
* @see \App\Http\Controllers\NotificacionController::noLeidas
 * @see app/Http/Controllers/NotificacionController.php:30
 * @route '/api/notificaciones/no-leidas'
 */
export const noLeidas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: noLeidas.url(options),
    method: 'get',
})

noLeidas.definition = {
    methods: ["get","head"],
    url: '/api/notificaciones/no-leidas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\NotificacionController::noLeidas
 * @see app/Http/Controllers/NotificacionController.php:30
 * @route '/api/notificaciones/no-leidas'
 */
noLeidas.url = (options?: RouteQueryOptions) => {
    return noLeidas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionController::noLeidas
 * @see app/Http/Controllers/NotificacionController.php:30
 * @route '/api/notificaciones/no-leidas'
 */
noLeidas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: noLeidas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\NotificacionController::noLeidas
 * @see app/Http/Controllers/NotificacionController.php:30
 * @route '/api/notificaciones/no-leidas'
 */
noLeidas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: noLeidas.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\NotificacionController::noLeidas
 * @see app/Http/Controllers/NotificacionController.php:30
 * @route '/api/notificaciones/no-leidas'
 */
    const noLeidasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: noLeidas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\NotificacionController::noLeidas
 * @see app/Http/Controllers/NotificacionController.php:30
 * @route '/api/notificaciones/no-leidas'
 */
        noLeidasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: noLeidas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\NotificacionController::noLeidas
 * @see app/Http/Controllers/NotificacionController.php:30
 * @route '/api/notificaciones/no-leidas'
 */
        noLeidasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: noLeidas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    noLeidas.form = noLeidasForm
/**
* @see \App\Http\Controllers\NotificacionController::contarNoLeidas
 * @see app/Http/Controllers/NotificacionController.php:49
 * @route '/api/notificaciones/count'
 */
export const contarNoLeidas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contarNoLeidas.url(options),
    method: 'get',
})

contarNoLeidas.definition = {
    methods: ["get","head"],
    url: '/api/notificaciones/count',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\NotificacionController::contarNoLeidas
 * @see app/Http/Controllers/NotificacionController.php:49
 * @route '/api/notificaciones/count'
 */
contarNoLeidas.url = (options?: RouteQueryOptions) => {
    return contarNoLeidas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionController::contarNoLeidas
 * @see app/Http/Controllers/NotificacionController.php:49
 * @route '/api/notificaciones/count'
 */
contarNoLeidas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contarNoLeidas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\NotificacionController::contarNoLeidas
 * @see app/Http/Controllers/NotificacionController.php:49
 * @route '/api/notificaciones/count'
 */
contarNoLeidas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: contarNoLeidas.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\NotificacionController::contarNoLeidas
 * @see app/Http/Controllers/NotificacionController.php:49
 * @route '/api/notificaciones/count'
 */
    const contarNoLeidasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: contarNoLeidas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\NotificacionController::contarNoLeidas
 * @see app/Http/Controllers/NotificacionController.php:49
 * @route '/api/notificaciones/count'
 */
        contarNoLeidasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: contarNoLeidas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\NotificacionController::contarNoLeidas
 * @see app/Http/Controllers/NotificacionController.php:49
 * @route '/api/notificaciones/count'
 */
        contarNoLeidasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: contarNoLeidas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    contarNoLeidas.form = contarNoLeidasForm
/**
* @see \App\Http\Controllers\NotificacionController::marcarComoLeida
 * @see app/Http/Controllers/NotificacionController.php:62
 * @route '/api/notificaciones/{id}/marcar-leida'
 */
export const marcarComoLeida = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: marcarComoLeida.url(args, options),
    method: 'post',
})

marcarComoLeida.definition = {
    methods: ["post"],
    url: '/api/notificaciones/{id}/marcar-leida',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\NotificacionController::marcarComoLeida
 * @see app/Http/Controllers/NotificacionController.php:62
 * @route '/api/notificaciones/{id}/marcar-leida'
 */
marcarComoLeida.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return marcarComoLeida.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionController::marcarComoLeida
 * @see app/Http/Controllers/NotificacionController.php:62
 * @route '/api/notificaciones/{id}/marcar-leida'
 */
marcarComoLeida.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: marcarComoLeida.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\NotificacionController::marcarComoLeida
 * @see app/Http/Controllers/NotificacionController.php:62
 * @route '/api/notificaciones/{id}/marcar-leida'
 */
    const marcarComoLeidaForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: marcarComoLeida.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NotificacionController::marcarComoLeida
 * @see app/Http/Controllers/NotificacionController.php:62
 * @route '/api/notificaciones/{id}/marcar-leida'
 */
        marcarComoLeidaForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: marcarComoLeida.url(args, options),
            method: 'post',
        })
    
    marcarComoLeida.form = marcarComoLeidaForm
/**
* @see \App\Http\Controllers\NotificacionController::marcarTodasComoLeidas
 * @see app/Http/Controllers/NotificacionController.php:80
 * @route '/api/notificaciones/marcar-todas-leidas'
 */
export const marcarTodasComoLeidas = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: marcarTodasComoLeidas.url(options),
    method: 'post',
})

marcarTodasComoLeidas.definition = {
    methods: ["post"],
    url: '/api/notificaciones/marcar-todas-leidas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\NotificacionController::marcarTodasComoLeidas
 * @see app/Http/Controllers/NotificacionController.php:80
 * @route '/api/notificaciones/marcar-todas-leidas'
 */
marcarTodasComoLeidas.url = (options?: RouteQueryOptions) => {
    return marcarTodasComoLeidas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionController::marcarTodasComoLeidas
 * @see app/Http/Controllers/NotificacionController.php:80
 * @route '/api/notificaciones/marcar-todas-leidas'
 */
marcarTodasComoLeidas.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: marcarTodasComoLeidas.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\NotificacionController::marcarTodasComoLeidas
 * @see app/Http/Controllers/NotificacionController.php:80
 * @route '/api/notificaciones/marcar-todas-leidas'
 */
    const marcarTodasComoLeidasForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: marcarTodasComoLeidas.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NotificacionController::marcarTodasComoLeidas
 * @see app/Http/Controllers/NotificacionController.php:80
 * @route '/api/notificaciones/marcar-todas-leidas'
 */
        marcarTodasComoLeidasForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: marcarTodasComoLeidas.url(options),
            method: 'post',
        })
    
    marcarTodasComoLeidas.form = marcarTodasComoLeidasForm
/**
* @see \App\Http\Controllers\NotificacionController::eliminar
 * @see app/Http/Controllers/NotificacionController.php:93
 * @route '/api/notificaciones/{id}'
 */
export const eliminar = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: eliminar.url(args, options),
    method: 'delete',
})

eliminar.definition = {
    methods: ["delete"],
    url: '/api/notificaciones/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\NotificacionController::eliminar
 * @see app/Http/Controllers/NotificacionController.php:93
 * @route '/api/notificaciones/{id}'
 */
eliminar.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return eliminar.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionController::eliminar
 * @see app/Http/Controllers/NotificacionController.php:93
 * @route '/api/notificaciones/{id}'
 */
eliminar.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: eliminar.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\NotificacionController::eliminar
 * @see app/Http/Controllers/NotificacionController.php:93
 * @route '/api/notificaciones/{id}'
 */
    const eliminarForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: eliminar.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NotificacionController::eliminar
 * @see app/Http/Controllers/NotificacionController.php:93
 * @route '/api/notificaciones/{id}'
 */
        eliminarForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: eliminar.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    eliminar.form = eliminarForm
/**
* @see \App\Http\Controllers\NotificacionController::eliminarLeidas
 * @see app/Http/Controllers/NotificacionController.php:111
 * @route '/api/notificaciones/leidas/eliminar'
 */
export const eliminarLeidas = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: eliminarLeidas.url(options),
    method: 'delete',
})

eliminarLeidas.definition = {
    methods: ["delete"],
    url: '/api/notificaciones/leidas/eliminar',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\NotificacionController::eliminarLeidas
 * @see app/Http/Controllers/NotificacionController.php:111
 * @route '/api/notificaciones/leidas/eliminar'
 */
eliminarLeidas.url = (options?: RouteQueryOptions) => {
    return eliminarLeidas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionController::eliminarLeidas
 * @see app/Http/Controllers/NotificacionController.php:111
 * @route '/api/notificaciones/leidas/eliminar'
 */
eliminarLeidas.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: eliminarLeidas.url(options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\NotificacionController::eliminarLeidas
 * @see app/Http/Controllers/NotificacionController.php:111
 * @route '/api/notificaciones/leidas/eliminar'
 */
    const eliminarLeidasForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: eliminarLeidas.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NotificacionController::eliminarLeidas
 * @see app/Http/Controllers/NotificacionController.php:111
 * @route '/api/notificaciones/leidas/eliminar'
 */
        eliminarLeidasForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: eliminarLeidas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    eliminarLeidas.form = eliminarLeidasForm
const NotificacionController = { index, noLeidas, contarNoLeidas, marcarComoLeida, marcarTodasComoLeidas, eliminar, eliminarLeidas }

export default NotificacionController