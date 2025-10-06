<?php
namespace Database\Seeders;

use App\Models\Producto;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductoStockMinimoSeeder extends Seeder
{
    public function run(): void
    {
        $productos = Producto::where('activo', true)
            ->where('controlar_stock', true)
            ->get();

        foreach ($productos as $producto) {
            // Definir stock mínimo basado en el tipo de producto
            // Los valores son ejemplos y deberían ajustarse según las necesidades reales
            $stockMinimo = match (true) {
                str_contains(strtolower($producto->descripcion), 'perecedero') => rand(15, 30),
                str_contains(strtolower($producto->descripcion), 'bebida')     => rand(20, 40),
                str_contains(strtolower($producto->descripcion), 'limpieza')   => rand(10, 20),
                default                                                        => rand(5, 15)
            };

            DB::table('productos')
                ->where('id', $producto->id)
                ->update([
                    'stock_minimo' => $stockMinimo,
                ]);
        }
    }
}
