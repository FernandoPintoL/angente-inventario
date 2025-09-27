<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AgentePermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Crear permisos para el agente de inventario
        $permissions = [
            'agente.use',
            'agente.history',
            'agente.admin',
        ];

        foreach ($permissions as $name) {
            Permission::firstOrCreate(['name' => $name]);
        }

        // Asignar permisos básicos del agente al rol administrador
        $adminRole = Role::where('name', 'administrador')->first();
        if ($adminRole) {
            $adminRole->givePermissionTo([
                'agente.use',
                'agente.history',
                'agente.admin'
            ]);
        }

        // Asignar permisos básicos del agente al rol gerente (si existe)
        $gerenteRole = Role::where('name', 'gerente')->first();
        if ($gerenteRole) {
            $gerenteRole->givePermissionTo([
                'agente.use',
                'agente.history'
            ]);
        }

        // Asignar permiso básico de uso al rol empleado (si existe)
        $empleadoRole = Role::where('name', 'empleado')->first();
        if ($empleadoRole) {
            $empleadoRole->givePermissionTo('agente.use');
        }

        $this->command->info('Permisos del agente de inventario creados y asignados exitosamente.');
    }
}