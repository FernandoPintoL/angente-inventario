<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // =====================================================
        // SEEDERS ESENCIALES - Sistema Base
        // =====================================================
        $this->call(CoreCatalogSeeder::class);
        $this->call(AlmacenesUbicacionSeeder::class);

        // Roles y Permisos
        $this->call(AgentePermissionsSeeder::class);
        $this->call(RolesAndPermissionsSeeder::class);
        $this->call(EmpleadoRolesSeeder::class);

        // Catálogos Base
        $this->call(EstadoDocumentoSeeder::class);
        $this->call(EstadoMermaSeeder::class);
        $this->call(ModuloSidebarSeeder::class);
        $this->call(MonedaSeeder::class);
        $this->call(TipoAjustInventarioSeeder::class);
        $this->call(TipoDocumentoSeeder::class);
        $this->call(TipoMermaSeeder::class);
        $this->call(TiposPrecioSeeder::class);

        // =====================================================
        // SEEDERS DESHABILITADOS - Módulos eliminados
        // =====================================================
        // $this->call(CajaSeeder::class);                  // ❌ Caja eliminada
        // $this->call(ClienteTestSeeder::class);           // ❌ Clientes eliminados
        // $this->call(CuentaContableSeeder::class);        // ❌ Contabilidad eliminada
        // $this->call(EmpleadosTestSeeder::class);         // ❌ Empleados eliminados
        // $this->call(EmpleadosSinUsuarioSeeder::class);   // ❌ Empleados eliminados
        // $this->call(SupervisoresSeeder::class);          // ❌ Empleados eliminados
        // $this->call(ImpuestoSeeder::class);              // ❌ Impuestos eliminados
        // $this->call(ProformaAppExternaSeeder::class);    // ❌ Proformas eliminadas
        // $this->call(TipoOperacionCajaSeeder::class);     // ❌ Caja eliminada
        // $this->call(VehiculoSeeder::class);              // ❌ Logística eliminada
        // $this->call(ProductosEjemploSeeder::class);      // ⚠️  Reemplazado por InventarioComprasSeeder
        // $this->call(CategoriaClienteSeeder::class);      // ❌ Clientes eliminados
        // $this->call(LocalidadSeeder::class);             // ❌ Localidades eliminadas

        // =====================================================
        // USUARIO ADMINISTRADOR
        // =====================================================
        $admin = User::query()->where('email', 'admin@paucara.test')->first();
        if (! $admin) {
            $admin = User::factory()->create([
                'name' => 'Administrador',
                'usernick' => 'admin',
                'email' => 'admin@paucara.test',
                'password' => Hash::make('password'),
            ]);
        } else {
            // Ensure usernick is set for legacy records
            if (empty($admin->usernick)) {
                $admin->forceFill(['usernick' => 'admin'])->save();
            }
        }

        // Asignar rol de Admin
        $admin->assignRole('Admin');

        // Asegurar que el rol Admin tenga todos los permisos
        $adminRole = Role::where('name', 'Admin')->first();
        if ($adminRole) {
            $adminRole->syncPermissions(Permission::all());
        }
        // =====================================================
        // SEEDERS DE DATOS DE PRUEBA - Inventario y Compras
        // =====================================================
        $this->call(InventarioComprasSeeder::class);
        
        $this->command->info('✅ Base de datos poblada exitosamente!');
        $this->command->info('📧 Usuario: admin@paucara.test');
        $this->command->info('🔑 Contraseña: password');
    }
}
