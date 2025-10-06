<?php
namespace Database\Seeders;

use App\Models\Almacen;
use App\Models\Producto;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TransferenciaInventarioSeeder extends Seeder
{
    public function run(): void
    {
        // Obtener IDs de almacenes
        $almacenes = Almacen::where('activo', true)->get();
        if ($almacenes->count() < 2) {
            throw new \Exception('Se necesitan al menos 2 almacenes activos para crear transferencias');
        }

        // Obtener algunos productos para las transferencias
        $productos = Producto::where('activo', true)
            ->where('controlar_stock', true)
            ->limit(5)
            ->get();

        // Crear algunas transferencias de ejemplo
        $estados = ['pendiente', 'en_transito', 'completada'];

        for ($i = 0; $i < 3; $i++) {
            $almacenOrigen  = $almacenes->random();
            $almacenDestino = $almacenes->where('id', '!=', $almacenOrigen->id)->random();

            $transferencia = [
                'fecha'              => now()->subDays(rand(1, 30)),
                'almacen_origen_id'  => $almacenOrigen->id,
                'almacen_destino_id' => $almacenDestino->id,
                'estado'             => $estados[rand(0, 2)],
                'observaciones'      => 'Transferencia de prueba #' . ($i + 1),
                'fecha_envio'        => now()->subDays(rand(0, 29)),
                'total_productos'    => rand(1, 3),
                'created_at'         => now(),
            ];

            $transferenciaId = DB::table('transferencia_inventarios')->insertGetId($transferencia);

            // Crear detalles de la transferencia
            foreach ($productos->random(rand(1, 3)) as $producto) {
                $cantidad = rand(1, 10);
                DB::table('detalle_transferencia_inventarios')->insert([
                    'transferencia_id'  => $transferenciaId,
                    'producto_id'       => $producto->id,
                    'lote'              => 'LOTE-' . strtoupper(substr(md5(rand()), 0, 8)),
                    'cantidad'          => $cantidad,
                    'fecha_vencimiento' => now()->addMonths(rand(1, 12)),
                    'observaciones'     => 'Detalle de transferencia',
                    'created_at'        => now(),
                ]);
            }
        }
    }
}
