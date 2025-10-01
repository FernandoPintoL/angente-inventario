import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import compras from './compras'
import ventas from './ventas'
import productos from './productos'
import proveedores from './proveedores'
import agente from './agente'
import dashboard from './dashboard'
/**
* @see \App\Http\Controllers\ModuloSidebarController::modulosSidebar
 * @see app/Http/Controllers/ModuloSidebarController.php:173
 * @route '/api/modulos-sidebar'
 */
export const modulosSidebar = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: modulosSidebar.url(options),
    method: 'get',
})

modulosSidebar.definition = {
    methods: ["get","head"],
    url: '/api/modulos-sidebar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::modulosSidebar
 * @see app/Http/Controllers/ModuloSidebarController.php:173
 * @route '/api/modulos-sidebar'
 */
modulosSidebar.url = (options?: RouteQueryOptions) => {
    return modulosSidebar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::modulosSidebar
 * @see app/Http/Controllers/ModuloSidebarController.php:173
 * @route '/api/modulos-sidebar'
 */
modulosSidebar.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: modulosSidebar.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuloSidebarController::modulosSidebar
 * @see app/Http/Controllers/ModuloSidebarController.php:173
 * @route '/api/modulos-sidebar'
 */
modulosSidebar.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: modulosSidebar.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ModuloSidebarController::modulosSidebar
 * @see app/Http/Controllers/ModuloSidebarController.php:173
 * @route '/api/modulos-sidebar'
 */
    const modulosSidebarForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: modulosSidebar.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ModuloSidebarController::modulosSidebar
 * @see app/Http/Controllers/ModuloSidebarController.php:173
 * @route '/api/modulos-sidebar'
 */
        modulosSidebarForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: modulosSidebar.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ModuloSidebarController::modulosSidebar
 * @see app/Http/Controllers/ModuloSidebarController.php:173
 * @route '/api/modulos-sidebar'
 */
        modulosSidebarForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: modulosSidebar.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    modulosSidebar.form = modulosSidebarForm
/**
* @see \App\Http\Controllers\InventarioController::buscarProductos
 * @see app/Http/Controllers/InventarioController.php:547
 * @route '/api/buscar-productos'
 */
export const buscarProductos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscarProductos.url(options),
    method: 'get',
})

buscarProductos.definition = {
    methods: ["get","head"],
    url: '/api/buscar-productos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::buscarProductos
 * @see app/Http/Controllers/InventarioController.php:547
 * @route '/api/buscar-productos'
 */
buscarProductos.url = (options?: RouteQueryOptions) => {
    return buscarProductos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::buscarProductos
 * @see app/Http/Controllers/InventarioController.php:547
 * @route '/api/buscar-productos'
 */
buscarProductos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscarProductos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::buscarProductos
 * @see app/Http/Controllers/InventarioController.php:547
 * @route '/api/buscar-productos'
 */
buscarProductos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: buscarProductos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::buscarProductos
 * @see app/Http/Controllers/InventarioController.php:547
 * @route '/api/buscar-productos'
 */
    const buscarProductosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: buscarProductos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::buscarProductos
 * @see app/Http/Controllers/InventarioController.php:547
 * @route '/api/buscar-productos'
 */
        buscarProductosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscarProductos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::buscarProductos
 * @see app/Http/Controllers/InventarioController.php:547
 * @route '/api/buscar-productos'
 */
        buscarProductosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscarProductos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    buscarProductos.form = buscarProductosForm
/**
* @see \App\Http\Controllers\InventarioController::stockProducto
 * @see app/Http/Controllers/InventarioController.php:573
 * @route '/api/stock-producto/{producto}'
 */
export const stockProducto = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stockProducto.url(args, options),
    method: 'get',
})

stockProducto.definition = {
    methods: ["get","head"],
    url: '/api/stock-producto/{producto}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::stockProducto
 * @see app/Http/Controllers/InventarioController.php:573
 * @route '/api/stock-producto/{producto}'
 */
stockProducto.url = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { producto: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { producto: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    producto: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        producto: typeof args.producto === 'object'
                ? args.producto.id
                : args.producto,
                }

    return stockProducto.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::stockProducto
 * @see app/Http/Controllers/InventarioController.php:573
 * @route '/api/stock-producto/{producto}'
 */
stockProducto.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stockProducto.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::stockProducto
 * @see app/Http/Controllers/InventarioController.php:573
 * @route '/api/stock-producto/{producto}'
 */
stockProducto.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stockProducto.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::stockProducto
 * @see app/Http/Controllers/InventarioController.php:573
 * @route '/api/stock-producto/{producto}'
 */
    const stockProductoForm = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: stockProducto.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::stockProducto
 * @see app/Http/Controllers/InventarioController.php:573
 * @route '/api/stock-producto/{producto}'
 */
        stockProductoForm.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stockProducto.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::stockProducto
 * @see app/Http/Controllers/InventarioController.php:573
 * @route '/api/stock-producto/{producto}'
 */
        stockProductoForm.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stockProducto.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    stockProducto.form = stockProductoForm
const api = {
    modulosSidebar,
compras,
ventas,
productos,
proveedores,
agente,
dashboard,
buscarProductos,
stockProducto,
}

export default api