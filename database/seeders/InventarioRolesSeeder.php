<?php
namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class InventarioRolesSeeder extends Seeder
{
    public function run(): void
    {
        // Limpiar caché de permisos
        app()->make('cache')->forget('spatie.permission.cache');

        // Definir todos los permisos necesarios
        $allPermissions = [
            // Productos
            'productos.index'                    => 'Ver listado de productos',
            'productos.create'                   => 'Crear nuevos productos',
            'productos.edit'                     => 'Editar productos',
            'productos.delete'                   => 'Eliminar productos',

            // Inventario Dashboard y Operaciones
            'inventario.dashboard'               => 'Ver dashboard de inventario',
            'inventario.stock-bajo'              => 'Ver productos con stock bajo',
            'inventario.proximos-vencer'         => 'Ver productos próximos a vencer',
            'inventario.vencidos'                => 'Ver productos vencidos',
            'inventario.movimientos'             => 'Ver movimientos de inventario',
            'inventario.ajuste.form'             => 'Acceder al formulario de ajuste',
            'inventario.ajuste.procesar'         => 'Procesar ajustes de inventario',
            'inventario.api.buscar-productos'    => 'Buscar productos vía API',
            'inventario.api.stock-producto'      => 'Consultar stock vía API',

            // Mermas
            'inventario.mermas.index'            => 'Ver listado de mermas',
            'inventario.mermas.registrar'        => 'Registrar nuevas mermas',
            'inventario.mermas.store'            => 'Guardar mermas',
            'inventario.mermas.show'             => 'Ver detalles de mermas',
            'inventario.mermas.aprobar'          => 'Aprobar mermas',
            'inventario.mermas.rechazar'         => 'Rechazar mermas',

            // Transferencias
            'inventario.transferencias.index'    => 'Ver listado de transferencias',
            'inventario.transferencias.crear'    => 'Crear transferencias',
            'inventario.transferencias.ver'      => 'Ver detalles de transferencias',
            'inventario.transferencias.edit'     => 'Editar transferencias',
            'inventario.transferencias.enviar'   => 'Enviar transferencias',
            'inventario.transferencias.recibir'  => 'Recibir transferencias',
            'inventario.transferencias.cancelar' => 'Cancelar transferencias',
            'inventario.transferencias.aprobar'  => 'Aprobar transferencias',

            // Reportes
            'reportes.inventario.stock-actual'   => 'Ver reporte de stock actual',
            'reportes.inventario.vencimientos'   => 'Ver reporte de vencimientos',
            'reportes.inventario.rotacion'       => 'Ver reporte de rotación',
            'reportes.inventario.movimientos'    => 'Ver reporte de movimientos',
            'reportes.inventario.export'         => 'Exportar reportes de inventario',
        ];

        // Crear permisos
        foreach ($allPermissions as $name => $description) {
            Permission::findOrCreate($name, 'web');
        }

        // Crear roles específicos de inventario si no existen
        $adminInventario    = Role::firstOrCreate(['name' => 'Administrador de Inventario']);
        $supervisorAlmacen  = Role::firstOrCreate(['name' => 'Supervisor de Almacén']);
        $operadorAlmacen    = Role::firstOrCreate(['name' => 'Operador de Almacén']);
        $auxiliarInventario = Role::firstOrCreate(['name' => 'Auxiliar de Inventario']);

        // Permisos para Administrador de Inventario
        $adminInventarioPerms = [
            // Gestión completa de productos
            'productos.index', 'productos.create', 'productos.edit', 'productos.delete',
            // Gestión de inventario
            'inventario.dashboard', 'inventario.stock-bajo', 'inventario.proximos-vencer',
            'inventario.vencidos', 'inventario.movimientos', 'inventario.ajuste.form',
            'inventario.ajuste.procesar', 'inventario.api.buscar-productos',
            'inventario.api.stock-producto', 'inventario.reportes',
            // Gestión de mermas
            'inventario.mermas.index', 'inventario.mermas.registrar', 'inventario.mermas.store',
            'inventario.mermas.show', 'inventario.mermas.aprobar', 'inventario.mermas.rechazar',
            // Transferencias
            'inventario.transferencias.index', 'inventario.transferencias.crear',
            'inventario.transferencias.ver', 'inventario.transferencias.edit',
            'inventario.transferencias.enviar', 'inventario.transferencias.recibir',
            'inventario.transferencias.cancelar',
            // Reportes completos
            'reportes.inventario.stock-actual', 'reportes.inventario.vencimientos',
            'reportes.inventario.rotacion', 'reportes.inventario.movimientos',
            'reportes.inventario.export',
        ];

        // Permisos para Supervisor de Almacén
        $supervisorAlmacenPerms = [
            'productos.index', 'productos.edit',
            'inventario.dashboard', 'inventario.stock-bajo', 'inventario.proximos-vencer',
            'inventario.movimientos', 'inventario.mermas.aprobar', 'inventario.mermas.show',
            'inventario.transferencias.ver', 'inventario.transferencias.aprobar',
            'reportes.inventario.stock-actual', 'reportes.inventario.movimientos',
        ];

        // Permisos para Operador de Almacén
        $operadorAlmacenPerms = [
            'productos.index',
            'inventario.dashboard', 'inventario.movimientos',
            'inventario.mermas.registrar', 'inventario.mermas.store',
            'inventario.transferencias.crear', 'inventario.transferencias.ver',
            'reportes.inventario.stock-actual',
        ];

        // Permisos para Auxiliar de Inventario
        $auxiliarInventarioPerms = [
            'productos.index',
            'inventario.dashboard',
            'inventario.movimientos',
            'reportes.inventario.stock-actual',
        ];

        // Asignar permisos a roles
        $adminInventario->syncPermissions($adminInventarioPerms);
        $supervisorAlmacen->syncPermissions($supervisorAlmacenPerms);
        $operadorAlmacen->syncPermissions($operadorAlmacenPerms);
        $auxiliarInventario->syncPermissions($auxiliarInventarioPerms);

        // Crear usuarios de ejemplo para cada rol
        $usuarios = [
            [
                'name'  => 'Admin Inventario',
                'email' => 'admin.inventario@paucara.test',
                'role'  => 'Administrador de Inventario',
            ],
            [
                'name'  => 'Supervisor Almacén',
                'email' => 'supervisor.almacen@paucara.test',
                'role'  => 'Supervisor de Almacén',
            ],
            [
                'name'  => 'Operador Almacén',
                'email' => 'operador.almacen@paucara.test',
                'role'  => 'Operador de Almacén',
            ],
            [
                'name'  => 'Auxiliar Inventario',
                'email' => 'auxiliar.inventario@paucara.test',
                'role'  => 'Auxiliar de Inventario',
            ],
        ];

        foreach ($usuarios as $usuario) {
            $user = User::firstOrCreate(
                ['email' => $usuario['email']],
                [
                    'name'     => $usuario['name'],
                    'usernick' => strtolower(str_replace(' ', '.', $usuario['name'])),
                    'password' => Hash::make('password'),
                ]
            );

            $user->assignRole($usuario['role']);
        }

        $this->command->info('Usuarios de inventario creados exitosamente:');
        foreach ($usuarios as $usuario) {
            $this->command->info("- {$usuario['name']}: {$usuario['email']}");
        }
        $this->command->info('Contraseña para todos: password');
    }
}
