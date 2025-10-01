import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DetalleCompraController::index
 * @see app/Http/Controllers/DetalleCompraController.php:22
 * @route '/compras/{compra}/detalles'
 */
export const index = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/compras/{compra}/detalles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DetalleCompraController::index
 * @see app/Http/Controllers/DetalleCompraController.php:22
 * @route '/compras/{compra}/detalles'
 */
index.url = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { compra: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    compra: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        compra: args.compra,
                }

    return index.definition.url
            .replace('{compra}', parsedArgs.compra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DetalleCompraController::index
 * @see app/Http/Controllers/DetalleCompraController.php:22
 * @route '/compras/{compra}/detalles'
 */
index.get = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DetalleCompraController::index
 * @see app/Http/Controllers/DetalleCompraController.php:22
 * @route '/compras/{compra}/detalles'
 */
index.head = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DetalleCompraController::index
 * @see app/Http/Controllers/DetalleCompraController.php:22
 * @route '/compras/{compra}/detalles'
 */
    const indexForm = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DetalleCompraController::index
 * @see app/Http/Controllers/DetalleCompraController.php:22
 * @route '/compras/{compra}/detalles'
 */
        indexForm.get = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DetalleCompraController::index
 * @see app/Http/Controllers/DetalleCompraController.php:22
 * @route '/compras/{compra}/detalles'
 */
        indexForm.head = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\DetalleCompraController::create
 * @see app/Http/Controllers/DetalleCompraController.php:0
 * @route '/compras/{compra}/detalles/create'
 */
export const create = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/compras/{compra}/detalles/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DetalleCompraController::create
 * @see app/Http/Controllers/DetalleCompraController.php:0
 * @route '/compras/{compra}/detalles/create'
 */
create.url = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { compra: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    compra: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        compra: args.compra,
                }

    return create.definition.url
            .replace('{compra}', parsedArgs.compra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DetalleCompraController::create
 * @see app/Http/Controllers/DetalleCompraController.php:0
 * @route '/compras/{compra}/detalles/create'
 */
create.get = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DetalleCompraController::create
 * @see app/Http/Controllers/DetalleCompraController.php:0
 * @route '/compras/{compra}/detalles/create'
 */
create.head = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DetalleCompraController::create
 * @see app/Http/Controllers/DetalleCompraController.php:0
 * @route '/compras/{compra}/detalles/create'
 */
    const createForm = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DetalleCompraController::create
 * @see app/Http/Controllers/DetalleCompraController.php:0
 * @route '/compras/{compra}/detalles/create'
 */
        createForm.get = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DetalleCompraController::create
 * @see app/Http/Controllers/DetalleCompraController.php:0
 * @route '/compras/{compra}/detalles/create'
 */
        createForm.head = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\DetalleCompraController::store
 * @see app/Http/Controllers/DetalleCompraController.php:36
 * @route '/compras/{compra}/detalles'
 */
export const store = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/compras/{compra}/detalles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DetalleCompraController::store
 * @see app/Http/Controllers/DetalleCompraController.php:36
 * @route '/compras/{compra}/detalles'
 */
store.url = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { compra: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    compra: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        compra: args.compra,
                }

    return store.definition.url
            .replace('{compra}', parsedArgs.compra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DetalleCompraController::store
 * @see app/Http/Controllers/DetalleCompraController.php:36
 * @route '/compras/{compra}/detalles'
 */
store.post = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DetalleCompraController::store
 * @see app/Http/Controllers/DetalleCompraController.php:36
 * @route '/compras/{compra}/detalles'
 */
    const storeForm = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DetalleCompraController::store
 * @see app/Http/Controllers/DetalleCompraController.php:36
 * @route '/compras/{compra}/detalles'
 */
        storeForm.post = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\DetalleCompraController::show
 * @see app/Http/Controllers/DetalleCompraController.php:29
 * @route '/detalles/{detalle}'
 */
export const show = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/detalles/{detalle}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DetalleCompraController::show
 * @see app/Http/Controllers/DetalleCompraController.php:29
 * @route '/detalles/{detalle}'
 */
show.url = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { detalle: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    detalle: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        detalle: args.detalle,
                }

    return show.definition.url
            .replace('{detalle}', parsedArgs.detalle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DetalleCompraController::show
 * @see app/Http/Controllers/DetalleCompraController.php:29
 * @route '/detalles/{detalle}'
 */
show.get = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DetalleCompraController::show
 * @see app/Http/Controllers/DetalleCompraController.php:29
 * @route '/detalles/{detalle}'
 */
show.head = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DetalleCompraController::show
 * @see app/Http/Controllers/DetalleCompraController.php:29
 * @route '/detalles/{detalle}'
 */
    const showForm = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DetalleCompraController::show
 * @see app/Http/Controllers/DetalleCompraController.php:29
 * @route '/detalles/{detalle}'
 */
        showForm.get = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DetalleCompraController::show
 * @see app/Http/Controllers/DetalleCompraController.php:29
 * @route '/detalles/{detalle}'
 */
        showForm.head = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\DetalleCompraController::edit
 * @see app/Http/Controllers/DetalleCompraController.php:0
 * @route '/detalles/{detalle}/edit'
 */
export const edit = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/detalles/{detalle}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DetalleCompraController::edit
 * @see app/Http/Controllers/DetalleCompraController.php:0
 * @route '/detalles/{detalle}/edit'
 */
edit.url = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { detalle: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    detalle: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        detalle: args.detalle,
                }

    return edit.definition.url
            .replace('{detalle}', parsedArgs.detalle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DetalleCompraController::edit
 * @see app/Http/Controllers/DetalleCompraController.php:0
 * @route '/detalles/{detalle}/edit'
 */
edit.get = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DetalleCompraController::edit
 * @see app/Http/Controllers/DetalleCompraController.php:0
 * @route '/detalles/{detalle}/edit'
 */
edit.head = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DetalleCompraController::edit
 * @see app/Http/Controllers/DetalleCompraController.php:0
 * @route '/detalles/{detalle}/edit'
 */
    const editForm = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DetalleCompraController::edit
 * @see app/Http/Controllers/DetalleCompraController.php:0
 * @route '/detalles/{detalle}/edit'
 */
        editForm.get = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DetalleCompraController::edit
 * @see app/Http/Controllers/DetalleCompraController.php:0
 * @route '/detalles/{detalle}/edit'
 */
        editForm.head = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\DetalleCompraController::update
 * @see app/Http/Controllers/DetalleCompraController.php:44
 * @route '/detalles/{detalle}'
 */
export const update = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/detalles/{detalle}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\DetalleCompraController::update
 * @see app/Http/Controllers/DetalleCompraController.php:44
 * @route '/detalles/{detalle}'
 */
update.url = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { detalle: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    detalle: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        detalle: args.detalle,
                }

    return update.definition.url
            .replace('{detalle}', parsedArgs.detalle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DetalleCompraController::update
 * @see app/Http/Controllers/DetalleCompraController.php:44
 * @route '/detalles/{detalle}'
 */
update.put = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\DetalleCompraController::update
 * @see app/Http/Controllers/DetalleCompraController.php:44
 * @route '/detalles/{detalle}'
 */
update.patch = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\DetalleCompraController::update
 * @see app/Http/Controllers/DetalleCompraController.php:44
 * @route '/detalles/{detalle}'
 */
    const updateForm = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DetalleCompraController::update
 * @see app/Http/Controllers/DetalleCompraController.php:44
 * @route '/detalles/{detalle}'
 */
        updateForm.put = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\DetalleCompraController::update
 * @see app/Http/Controllers/DetalleCompraController.php:44
 * @route '/detalles/{detalle}'
 */
        updateForm.patch = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\DetalleCompraController::destroy
 * @see app/Http/Controllers/DetalleCompraController.php:53
 * @route '/detalles/{detalle}'
 */
export const destroy = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/detalles/{detalle}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\DetalleCompraController::destroy
 * @see app/Http/Controllers/DetalleCompraController.php:53
 * @route '/detalles/{detalle}'
 */
destroy.url = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { detalle: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    detalle: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        detalle: args.detalle,
                }

    return destroy.definition.url
            .replace('{detalle}', parsedArgs.detalle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DetalleCompraController::destroy
 * @see app/Http/Controllers/DetalleCompraController.php:53
 * @route '/detalles/{detalle}'
 */
destroy.delete = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\DetalleCompraController::destroy
 * @see app/Http/Controllers/DetalleCompraController.php:53
 * @route '/detalles/{detalle}'
 */
    const destroyForm = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DetalleCompraController::destroy
 * @see app/Http/Controllers/DetalleCompraController.php:53
 * @route '/detalles/{detalle}'
 */
        destroyForm.delete = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const DetalleCompraController = { index, create, store, show, edit, update, destroy }

export default DetalleCompraController