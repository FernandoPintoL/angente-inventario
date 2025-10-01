<?php

use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\EnvioController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (\Illuminate\Support\Facades\Auth::check()) {
        return Inertia::render('dashboard');
    }

    return redirect()->route('login');
})->name('home');

// Ruta de prueba para verificar CSRF token
Route::post('/test-csrf', function () {
    return response()->json(['message' => 'CSRF token is valid', 'success' => true]);
})->name('test.csrf');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    // API routes para el dashboard
    Route::prefix('api/dashboard')->group(function () {
        Route::get('metricas', [App\Http\Controllers\DashboardController::class, 'metricas'])->name('api.dashboard.metricas');
        Route::get('graficos', [App\Http\Controllers\DashboardController::class, 'graficos'])->name('api.dashboard.graficos');
        Route::get('productos-mas-comprados', [App\Http\Controllers\DashboardController::class, 'productosMasComprados'])->name('api.dashboard.productos-mas-comprados');
        Route::get('alertas-stock', [App\Http\Controllers\DashboardController::class, 'alertasStock'])->name('api.dashboard.alertas-stock');
    });

    Route::resource('categorias', CategoriaController::class)->middleware('permission:categorias.manage');
    Route::resource('marcas', \App\Http\Controllers\MarcaController::class)->middleware('permission:marcas.manage');
    Route::resource('almacenes', \App\Http\Controllers\AlmacenController::class)->middleware('permission:almacenes.manage');

    // Incluir rutas de configuración global
    require __DIR__ . '/configuracion.php';

    Route::resource('proveedores', \App\Http\Controllers\ProveedorController::class)->middleware('permission:proveedores.manage');
    Route::resource('productos', \App\Http\Controllers\ProductoController::class)->except(['show'])->middleware('permission:productos.manage');
    Route::get('productos/crear/moderno', [\App\Http\Controllers\ProductoController::class, 'createModerno'])->middleware('permission:productos.manage')->name('productos.create.moderno');
    Route::get('productos/{producto}/historial-precios', [\App\Http\Controllers\ProductoController::class, 'historialPrecios'])->middleware('permission:productos.manage')->name('productos.historial-precios');
    Route::resource('unidades', \App\Http\Controllers\UnidadMedidaController::class)->parameters(['unidades' => 'unidad'])->middleware('permission:unidades.manage');

    // Rutas para gestión de tipos de precio
    Route::resource('tipos-precio', \App\Http\Controllers\TipoPrecioController::class)->parameters(['tipos-precio' => 'tipoPrecio'])->middleware('permission:tipos-precio.manage');
    Route::patch('tipos-precio/{tipoPrecio}/toggle-activo', [\App\Http\Controllers\TipoPrecioController::class, 'toggleActivo'])->middleware('permission:tipos-precio.manage')->name('tipos-precio.toggle-activo');

    // Rutas para gestión de monedas
    Route::resource('monedas', \App\Http\Controllers\MonedaController::class)->middleware('permission:monedas.manage');
    Route::get('monedas/{moneda}/activas', [\App\Http\Controllers\MonedaController::class, 'activas'])->middleware('permission:monedas.manage')->name('monedas.activas');
    Route::post('monedas/convertir', [\App\Http\Controllers\MonedaController::class, 'convertir'])->middleware('permission:monedas.manage')->name('monedas.convertir');
    Route::patch('monedas/{moneda}/toggle-activo', [\App\Http\Controllers\MonedaController::class, 'toggleActivo'])->middleware('permission:monedas.manage')->name('monedas.toggle-activo');
    Route::patch('monedas/{moneda}/establecer-base', [\App\Http\Controllers\MonedaController::class, 'establecerBase'])->middleware('permission:monedas.manage')->name('monedas.establecer-base');

    // Rutas para gestión de módulos del sidebar
    Route::get('modulos-sidebar', [\App\Http\Controllers\ModuloSidebarController::class, 'index'])->name('modulos-sidebar.index');
    Route::get('modulos-sidebar/create', [\App\Http\Controllers\ModuloSidebarController::class, 'create'])->middleware('permission:admin.config')->name('modulos-sidebar.create');
    Route::post('modulos-sidebar', [\App\Http\Controllers\ModuloSidebarController::class, 'store'])->middleware('permission:admin.config')->name('modulos-sidebar.store');
    Route::get('modulos-sidebar/{moduloSidebar}', [\App\Http\Controllers\ModuloSidebarController::class, 'show'])->name('modulos-sidebar.show');
    Route::get('modulos-sidebar/{moduloSidebar}/edit', [\App\Http\Controllers\ModuloSidebarController::class, 'edit'])->middleware('permission:admin.config')->name('modulos-sidebar.edit');
    Route::match(['PUT', 'PATCH'], 'modulos-sidebar/{moduloSidebar}', [\App\Http\Controllers\ModuloSidebarController::class, 'update'])->middleware('permission:admin.config')->name('modulos-sidebar.update');
    Route::delete('modulos-sidebar/{moduloSidebar}', [\App\Http\Controllers\ModuloSidebarController::class, 'destroy'])->middleware('permission:admin.config')->name('modulos-sidebar.destroy');
    Route::get('api/modulos-sidebar', [\App\Http\Controllers\ModuloSidebarController::class, 'obtenerParaSidebar'])->name('api.modulos-sidebar');
    Route::post('modulos-sidebar/actualizar-orden', [\App\Http\Controllers\ModuloSidebarController::class, 'actualizarOrden'])->middleware('permission:admin.config')->name('modulos-sidebar.actualizar-orden');
    Route::patch('modulos-sidebar/{moduloSidebar}/toggle-activo', [\App\Http\Controllers\ModuloSidebarController::class, 'toggleActivo'])->middleware('permission:admin.config')->name('modulos-sidebar.toggle-activo');

    // Rutas para gestión de usuarios, roles y permisos
    Route::resource('usuarios', \App\Http\Controllers\UserController::class);
    Route::post('usuarios/{usuario}/assign-role', [\App\Http\Controllers\UserController::class, 'assignRole'])->name('usuarios.assign-role');
    Route::delete('usuarios/{usuario}/remove-role', [\App\Http\Controllers\UserController::class, 'removeRole'])->name('usuarios.remove-role');
    Route::post('usuarios/{usuario}/assign-permission', [\App\Http\Controllers\UserController::class, 'assignPermission'])->name('usuarios.assign-permission');
    Route::delete('usuarios/{usuario}/remove-permission', [\App\Http\Controllers\UserController::class, 'removePermission'])->name('usuarios.remove-permission');
    Route::patch('usuarios/{usuario}/toggle-status', [\App\Http\Controllers\UserController::class, 'toggleStatus'])->name('usuarios.toggle-status');

    Route::resource('roles', \App\Http\Controllers\RoleController::class);
    Route::post('roles/{role}/assign-permission', [\App\Http\Controllers\RoleController::class, 'assignPermission'])->name('roles.assign-permission');
    Route::delete('roles/{role}/remove-permission', [\App\Http\Controllers\RoleController::class, 'removePermission'])->name('roles.remove-permission');

    Route::resource('permissions', \App\Http\Controllers\PermissionController::class);

    // Rutas adicionales para módulo de compras (ANTES de resource para evitar conflictos)
    Route::prefix('compras')->name('compras.')->group(function () {
        // Gestión de Cuentas por Pagar
        Route::get('cuentas-por-pagar', [\App\Http\Controllers\CuentaPorPagarController::class, 'index'])->name('cuentas-por-pagar.index');
        Route::get('cuentas-por-pagar/export', [\App\Http\Controllers\CuentaPorPagarController::class, 'export'])->name('cuentas-por-pagar.export');
        Route::get('cuentas-por-pagar/{cuenta}/show', [\App\Http\Controllers\CuentaPorPagarController::class, 'show'])->name('cuentas-por-pagar.show');
        Route::patch('cuentas-por-pagar/{cuenta}/estado', [\App\Http\Controllers\CuentaPorPagarController::class, 'actualizarEstado'])->name('cuentas-por-pagar.actualizar-estado');

        // Sistema de Pagos
        Route::get('pagos', [\App\Http\Controllers\PagoController::class, 'index'])->name('pagos.index');
        Route::get('pagos/create', [\App\Http\Controllers\PagoController::class, 'create'])->name('pagos.create');
        Route::post('pagos', [\App\Http\Controllers\PagoController::class, 'store'])->name('pagos.store');
        Route::get('pagos/{pago}', [\App\Http\Controllers\PagoController::class, 'show'])->name('pagos.show');
        Route::delete('pagos/{pago}', [\App\Http\Controllers\PagoController::class, 'destroy'])->name('pagos.destroy');
        Route::get('pagos/export', [\App\Http\Controllers\PagoController::class, 'export'])->name('pagos.export');

        // Gestión de Lotes y Vencimientos
        Route::get('lotes-vencimientos', [\App\Http\Controllers\LoteVencimientoController::class, 'index'])->name('lotes-vencimientos.index');
        Route::patch('lotes-vencimientos/{lote}/actualizar-estado', [\App\Http\Controllers\LoteVencimientoController::class, 'actualizarEstado'])->name('lotes-vencimientos.actualizar-estado');
        Route::patch('lotes-vencimientos/{lote}/cantidad', [\App\Http\Controllers\LoteVencimientoController::class, 'actualizarCantidad'])->name('lotes-vencimientos.actualizar-cantidad');
        Route::get('lotes-vencimientos/export', [\App\Http\Controllers\LoteVencimientoController::class, 'export'])->name('lotes-vencimientos.export');

        // Reportes Específicos
        Route::get('reportes', [\App\Http\Controllers\ReporteComprasController::class, 'index'])->name('reportes.index');
        Route::get('reportes/export', [\App\Http\Controllers\ReporteComprasController::class, 'export'])->name('reportes.export');
        Route::get('reportes/export-pdf', [\App\Http\Controllers\ReporteComprasController::class, 'exportPdf'])->name('reportes.export-pdf');
    });

    // Rutas para gestión de compras (después de rutas específicas para evitar conflictos)
    Route::resource('compras', \App\Http\Controllers\CompraController::class)->except(['destroy']);

    // Keep nested details routes
    Route::resource('compras.detalles', \App\Http\Controllers\DetalleCompraController::class)->shallow();

    // Rutas para gestión de inventario
    Route::prefix('inventario')->name('inventario.')->group(function () {
        Route::get('/', [\App\Http\Controllers\InventarioController::class, 'dashboard'])->middleware('permission:inventario.dashboard')->name('index');
        Route::get('/dashboard', [\App\Http\Controllers\InventarioController::class, 'dashboard'])->middleware('permission:inventario.dashboard')->name('dashboard');
        Route::get('stock-bajo', [\App\Http\Controllers\InventarioController::class, 'stockBajo'])->middleware('permission:inventario.stock-bajo')->name('stock-bajo');
        Route::get('proximos-vencer', [\App\Http\Controllers\InventarioController::class, 'proximosVencer'])->middleware('permission:inventario.proximos-vencer')->name('proximos-vencer');
        Route::get('vencidos', [\App\Http\Controllers\InventarioController::class, 'vencidos'])->middleware('permission:inventario.vencidos')->name('vencidos');
        Route::get('movimientos', [\App\Http\Controllers\InventarioController::class, 'movimientos'])->middleware('permission:inventario.movimientos')->name('movimientos');
        Route::get('ajuste', [\App\Http\Controllers\InventarioController::class, 'ajusteForm'])->middleware('permission:inventario.ajuste.form')->name('ajuste.form');
        Route::post('ajuste', [\App\Http\Controllers\InventarioController::class, 'procesarAjuste'])->middleware('permission:inventario.ajuste.procesar')->name('ajuste.procesar');
        Route::get('reportes', [\App\Http\Controllers\InventarioController::class, 'reportes'])->middleware('permission:inventario.reportes')->name('reportes');

        // Rutas para manejo de mermas
        Route::prefix('mermas')->name('mermas.')->group(function () {
            Route::get('/', [\App\Http\Controllers\InventarioController::class, 'mermas'])->middleware('permission:inventario.mermas.index')->name('index');
            Route::get('registrar', [\App\Http\Controllers\InventarioController::class, 'formularioRegistrarMerma'])->middleware('permission:inventario.mermas.registrar')->name('registrar');
            Route::post('registrar', [\App\Http\Controllers\InventarioController::class, 'registrarMerma'])->middleware('permission:inventario.mermas.registrar')->name('store');
            Route::get('{merma}', [\App\Http\Controllers\InventarioController::class, 'verMerma'])->middleware('permission:inventario.mermas.ver')->name('show');
            Route::post('{merma}/aprobar', [\App\Http\Controllers\InventarioController::class, 'aprobarMerma'])->middleware('permission:inventario.mermas.aprobar')->name('aprobar');
            Route::post('{merma}/rechazar', [\App\Http\Controllers\InventarioController::class, 'rechazarMerma'])->middleware('permission:inventario.mermas.rechazar')->name('rechazar');
        });
    });

    // API routes para inventario
    Route::get('api/buscar-productos', [\App\Http\Controllers\InventarioController::class, 'buscarProductos'])->middleware('permission:inventario.api.buscar-productos')->name('api.buscar-productos');
    Route::get('api/stock-producto/{producto}', [\App\Http\Controllers\InventarioController::class, 'stockProducto'])->middleware('permission:inventario.api.stock-producto')->name('api.stock-producto');

    // API routes para autocompletado
    Route::get('api/proveedores/buscar', [\App\Http\Controllers\ProveedorController::class, 'buscarApi'])->name('api.proveedores.buscar');
    Route::get('api/productos/buscar', [\App\Http\Controllers\ProductoController::class, 'buscarApi'])->name('api.productos.buscar');

    // Rutas para reportes de precios
    Route::prefix('reportes')->name('reportes.')->group(function () {
        Route::get('precios', [\App\Http\Controllers\ReportePreciosController::class, 'index'])->middleware('permission:reportes.precios.index')->name('precios.index');
        Route::get('precios/export', [\App\Http\Controllers\ReportePreciosController::class, 'export'])->name('precios.export');
        Route::get('ganancias', [\App\Http\Controllers\ReportePreciosController::class, 'ganancias'])->name('ganancias.index');
        Route::get('ganancias/export', [\App\Http\Controllers\ReportePreciosController::class, 'exportGanancias'])->name('ganancias.export');

        // Reportes de inventario
        Route::prefix('inventario')->name('inventario.')->group(function () {
            Route::get('stock-actual', [\App\Http\Controllers\ReporteInventarioController::class, 'stockActual'])->name('stock-actual');
            Route::get('vencimientos', [\App\Http\Controllers\ReporteInventarioController::class, 'vencimientos'])->name('vencimientos');
            Route::get('rotacion', [\App\Http\Controllers\ReporteInventarioController::class, 'rotacion'])->name('rotacion');
            Route::get('movimientos', [\App\Http\Controllers\ReporteInventarioController::class, 'movimientos'])->name('movimientos');
            Route::get('export', [\App\Http\Controllers\ReporteInventarioController::class, 'export'])->name('export');
        });
    });

    // Rutas para el Agente de Inventario
    Route::prefix('agente')->name('agente.')->middleware('permission:agente.use')->group(function () {
        Route::get('/', [\App\Http\Controllers\AgenteController::class, 'index'])->name('index');
        Route::get('dashboard', [\App\Http\Controllers\AgenteController::class, 'dashboard'])->name('dashboard');
    });

    // Rutas API Web para el Agente de Inventario (usando auth:web)
    Route::prefix('api/agente')->name('api.agente.web.')->group(function () {
        Route::get('health', [\App\Http\Controllers\Api\AgenteInventarioController::class, 'health'])->name('health');
        Route::post('ask', [\App\Http\Controllers\Api\AgenteInventarioController::class, 'ask'])->middleware('permission:agente.use')->name('ask');
        Route::get('historial', [\App\Http\Controllers\Api\AgenteInventarioController::class, 'historial'])->middleware('permission:agente.history')->name('historial');
        Route::get('conversacion/{id}', [\App\Http\Controllers\Api\AgenteInventarioController::class, 'conversacion'])->middleware('permission:agente.history')->name('conversacion');
        Route::delete('historial', [\App\Http\Controllers\Api\AgenteInventarioController::class, 'eliminarHistorial'])->middleware('permission:agente.history')->name('eliminar-historial');
        Route::post('export-report', [\App\Http\Controllers\Api\AgenteInventarioController::class, 'exportReport'])->middleware('permission:agente.use')->name('export-report');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/test.php';
