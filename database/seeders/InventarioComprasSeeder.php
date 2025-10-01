<?php

namespace Database\Seeders;

use App\Models\Almacen;
use App\Models\Categoria;
use App\Models\Compra;
use App\Models\CuentaPorPagar;
use App\Models\DetalleCompra;
use App\Models\Marca;
use App\Models\Moneda;
use App\Models\MovimientoInventario;
use App\Models\PrecioProducto;
use App\Models\Producto;
use App\Models\Proveedor;
use App\Models\StockProducto;
use App\Models\TipoPrecio;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InventarioComprasSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            $this->command->info('🌱 Iniciando seeding de Inventario y Compras...');

            // 1. Categorías
            $this->command->info('📦 Creando categorías...');
            $categorias = $this->createCategorias();

            // 2. Marcas
            $this->command->info('🏷️  Creando marcas...');
            $marcas = $this->createMarcas();

            // 3. Almacenes
            $this->command->info('🏢 Creando almacenes...');
            $almacenes = $this->createAlmacenes();

            // 4. Proveedores
            $this->command->info('🤝 Creando proveedores...');
            $proveedores = $this->createProveedores();

            // 5. Productos
            $this->command->info('🛍️  Creando productos...');
            $productos = $this->createProductos($categorias, $marcas, $proveedores);

            // 6. Tipos de Precio y Precios
            $this->command->info('💰 Creando precios de productos...');
            $this->createPrecios($productos);

            // 7. Stock Inicial
            $this->command->info('📊 Creando stock inicial...');
            $this->createStockInicial($productos, $almacenes);

            // 8. Compras
            $this->command->info('🛒 Creando compras de ejemplo...');
            $this->createCompras($proveedores, $productos);

            $this->command->info('✅ Seeding completado exitosamente!');
        });
    }

    private function createCategorias(): array
    {
        $categorias = [
            ['nombre' => 'Bebidas', 'descripcion' => 'Bebidas refrescantes y alcohólicas', 'activo' => true],
            ['nombre' => 'Alimentos', 'descripcion' => 'Productos alimenticios', 'activo' => true],
            ['nombre' => 'Lácteos', 'descripcion' => 'Productos lácteos y derivados', 'activo' => true],
            ['nombre' => 'Snacks', 'descripcion' => 'Golosinas y aperitivos', 'activo' => true],
            ['nombre' => 'Limpieza', 'descripcion' => 'Productos de limpieza', 'activo' => true],
            ['nombre' => 'Higiene Personal', 'descripcion' => 'Productos de higiene personal', 'activo' => true],
            ['nombre' => 'Panadería', 'descripcion' => 'Pan y productos de panadería', 'activo' => true],
            ['nombre' => 'Carnes', 'descripcion' => 'Carnes y embutidos', 'activo' => true],
        ];

        $result = [];
        foreach ($categorias as $cat) {
            $result[] = Categoria::create($cat);
        }

        return $result;
    }

    private function createMarcas(): array
    {
        $marcas = [
            ['nombre' => 'Coca Cola', 'descripcion' => 'Bebidas carbonatadas', 'activo' => true],
            ['nombre' => 'Pil Andina', 'descripcion' => 'Productos lácteos', 'activo' => true],
            ['nombre' => 'Pepsi', 'descripcion' => 'Bebidas y snacks', 'activo' => true],
            ['nombre' => 'Arcor', 'descripcion' => 'Golosinas y chocolates', 'activo' => true],
            ['nombre' => 'Paceña', 'descripcion' => 'Cerveza boliviana', 'activo' => true],
            ['nombre' => 'Stege', 'descripcion' => 'Lácteos', 'activo' => true],
            ['nombre' => 'Minerva', 'descripcion' => 'Aceites y conservas', 'activo' => true],
            ['nombre' => 'Sofía', 'descripcion' => 'Panadería', 'activo' => true],
        ];

        $result = [];
        foreach ($marcas as $marca) {
            $result[] = Marca::create($marca);
        }

        return $result;
    }

    private function createAlmacenes(): array
    {
        $almacenes = [
            [
                'nombre' => 'Almacén Central',
                'direccion' => 'Av. Principal #123, La Paz',
                'responsable' => 'Juan Pérez',
                'telefono' => '71234567',
                'activo' => true,
            ],
            [
                'nombre' => 'Almacén Sucursal Norte',
                'direccion' => 'Zona Norte, El Alto',
                'responsable' => 'María García',
                'telefono' => '72345678',
                'activo' => true,
            ],
            [
                'nombre' => 'Almacén Depósito',
                'direccion' => 'Carretera a Oruro Km 5',
                'responsable' => 'Carlos Mamani',
                'telefono' => '73456789',
                'activo' => true,
            ],
        ];

        $result = [];
        foreach ($almacenes as $almacen) {
            $result[] = Almacen::create($almacen);
        }

        return $result;
    }

    private function createProveedores(): array
    {
        $proveedores = [
            [
                'nombre' => 'Distribuidora Coca Cola Bolivia',
                'razon_social' => 'The Coca Cola Company Bolivia S.A.',
                'nit' => '1234567890',
                'telefono' => '22334455',
                'email' => 'ventas@cocacola.com.bo',
                'direccion' => 'Zona Industrial, La Paz',
                'contacto' => 'Roberto Sánchez',
                'activo' => true,
            ],
            [
                'nombre' => 'PIL Andina S.A.',
                'razon_social' => 'Productores Industriales de Leche Andina S.A.',
                'nit' => '0987654321',
                'telefono' => '22445566',
                'email' => 'ventas@pil.com.bo',
                'direccion' => 'Av. Industrial, Cochabamba',
                'contacto' => 'Ana Flores',
                'activo' => true,
            ],
            [
                'nombre' => 'Cervecería Boliviana Nacional',
                'razon_social' => 'CBN S.A.',
                'nit' => '1122334455',
                'telefono' => '22556677',
                'email' => 'ventas@cbn.com.bo',
                'direccion' => 'Zona Sur, La Paz',
                'contacto' => 'Luis Quispe',
                'activo' => true,
            ],
            [
                'nombre' => 'Arcor Bolivia',
                'razon_social' => 'Arcor de Bolivia S.R.L.',
                'nit' => '5544332211',
                'telefono' => '22667788',
                'email' => 'ventas@arcor.com.bo',
                'direccion' => 'Parque Industrial, Santa Cruz',
                'contacto' => 'Patricia López',
                'activo' => true,
            ],
            [
                'nombre' => 'Productos Alimenticios SAMA',
                'razon_social' => 'SAMA S.R.L.',
                'nit' => '9988776655',
                'telefono' => '22778899',
                'email' => 'ventas@sama.com.bo',
                'direccion' => 'Zona Industrial, El Alto',
                'contacto' => 'Jorge Condori',
                'activo' => true,
            ],
        ];

        $result = [];
        foreach ($proveedores as $proveedor) {
            $result[] = Proveedor::create($proveedor);
        }

        return $result;
    }

    private function createProductos($categorias, $marcas, $proveedores): array
    {
        $productos = [
            // Bebidas
            ['nombre' => 'Coca Cola 2L', 'descripcion' => 'Bebida gaseosa Coca Cola 2 litros', 'categoria' => 'Bebidas', 'marca' => 'Coca Cola', 'peso' => 2.1, 'stock_minimo' => 20, 'stock_maximo' => 200, 'proveedor' => 'Distribuidora Coca Cola Bolivia'],
            ['nombre' => 'Coca Cola 500ml', 'descripcion' => 'Bebida gaseosa Coca Cola 500ml', 'categoria' => 'Bebidas', 'marca' => 'Coca Cola', 'peso' => 0.55, 'stock_minimo' => 50, 'stock_maximo' => 500, 'proveedor' => 'Distribuidora Coca Cola Bolivia'],
            ['nombre' => 'Sprite 2L', 'descripcion' => 'Bebida gaseosa Sprite 2 litros', 'categoria' => 'Bebidas', 'marca' => 'Coca Cola', 'peso' => 2.1, 'stock_minimo' => 15, 'stock_maximo' => 150, 'proveedor' => 'Distribuidora Coca Cola Bolivia'],
            ['nombre' => 'Paceña Pilsener 620ml', 'descripcion' => 'Cerveza Paceña botella 620ml', 'categoria' => 'Bebidas', 'marca' => 'Paceña', 'peso' => 0.7, 'stock_minimo' => 100, 'stock_maximo' => 1000, 'proveedor' => 'Cervecería Boliviana Nacional'],
            ['nombre' => 'Pepsi 2L', 'descripcion' => 'Bebida gaseosa Pepsi 2 litros', 'categoria' => 'Bebidas', 'marca' => 'Pepsi', 'peso' => 2.1, 'stock_minimo' => 15, 'stock_maximo' => 150, 'proveedor' => 'Distribuidora Coca Cola Bolivia'],

            // Lácteos
            ['nombre' => 'Leche PIL Entera 1L', 'descripcion' => 'Leche entera PIL 1 litro', 'categoria' => 'Lácteos', 'marca' => 'Pil Andina', 'peso' => 1.05, 'stock_minimo' => 30, 'stock_maximo' => 300, 'proveedor' => 'PIL Andina S.A.'],
            ['nombre' => 'Yogurt PIL Frutilla 1L', 'descripcion' => 'Yogurt PIL sabor frutilla 1 litro', 'categoria' => 'Lácteos', 'marca' => 'Pil Andina', 'peso' => 1.1, 'stock_minimo' => 20, 'stock_maximo' => 200, 'proveedor' => 'PIL Andina S.A.'],
            ['nombre' => 'Mantequilla Stege 250g', 'descripcion' => 'Mantequilla Stege 250 gramos', 'categoria' => 'Lácteos', 'marca' => 'Stege', 'peso' => 0.27, 'stock_minimo' => 15, 'stock_maximo' => 150, 'proveedor' => 'PIL Andina S.A.'],
            ['nombre' => 'Queso Mozzarella 500g', 'descripcion' => 'Queso Mozzarella 500 gramos', 'categoria' => 'Lácteos', 'marca' => 'Stege', 'peso' => 0.52, 'stock_minimo' => 10, 'stock_maximo' => 100, 'proveedor' => 'PIL Andina S.A.'],

            // Snacks
            ['nombre' => 'Chocolate Shot 25g', 'descripcion' => 'Chocolate Arcor Shot 25g', 'categoria' => 'Snacks', 'marca' => 'Arcor', 'peso' => 0.03, 'stock_minimo' => 50, 'stock_maximo' => 500, 'proveedor' => 'Arcor Bolivia'],
            ['nombre' => 'Caramelos Butter Toffee 700g', 'descripcion' => 'Caramelos Arcor Butter Toffee bolsa 700g', 'categoria' => 'Snacks', 'marca' => 'Arcor', 'peso' => 0.72, 'stock_minimo' => 20, 'stock_maximo' => 200, 'proveedor' => 'Arcor Bolivia'],
            ['nombre' => 'Papas Lays Clásicas 150g', 'descripcion' => 'Papas fritas Lays clásicas 150g', 'categoria' => 'Snacks', 'marca' => 'Pepsi', 'peso' => 0.16, 'stock_minimo' => 30, 'stock_maximo' => 300, 'proveedor' => 'Arcor Bolivia'],

            // Alimentos
            ['nombre' => 'Arroz Extra 1kg', 'descripcion' => 'Arroz extra calidad 1 kilogramo', 'categoria' => 'Alimentos', 'marca' => 'Minerva', 'peso' => 1.02, 'stock_minimo' => 50, 'stock_maximo' => 500, 'proveedor' => 'Productos Alimenticios SAMA'],
            ['nombre' => 'Aceite Minerva 1L', 'descripcion' => 'Aceite vegetal Minerva 1 litro', 'categoria' => 'Alimentos', 'marca' => 'Minerva', 'peso' => 0.95, 'stock_minimo' => 30, 'stock_maximo' => 300, 'proveedor' => 'Productos Alimenticios SAMA'],
            ['nombre' => 'Fideos Maravilla 500g', 'descripcion' => 'Fideos tipo spaguetti 500g', 'categoria' => 'Alimentos', 'marca' => 'Minerva', 'peso' => 0.52, 'stock_minimo' => 40, 'stock_maximo' => 400, 'proveedor' => 'Productos Alimenticios SAMA'],

            // Panadería
            ['nombre' => 'Pan Marraqueta', 'descripcion' => 'Pan marraqueta tradicional', 'categoria' => 'Panadería', 'marca' => 'Sofía', 'peso' => 0.08, 'stock_minimo' => 100, 'stock_maximo' => 1000, 'proveedor' => 'Productos Alimenticios SAMA'],
            ['nombre' => 'Pan Integral 500g', 'descripcion' => 'Pan integral rebanado 500g', 'categoria' => 'Panadería', 'marca' => 'Sofía', 'peso' => 0.52, 'stock_minimo' => 20, 'stock_maximo' => 200, 'proveedor' => 'Productos Alimenticios SAMA'],
        ];

        $result = [];
        foreach ($productos as $prod) {
            $categoria = collect($categorias)->firstWhere('nombre', $prod['categoria']);
            $marca = collect($marcas)->firstWhere('nombre', $prod['marca']);
            $proveedor = collect($proveedores)->firstWhere('nombre', $prod['proveedor']);

            $producto = Producto::create([
                'nombre' => $prod['nombre'],
                'descripcion' => $prod['descripcion'],
                'peso' => $prod['peso'],
                'stock_minimo' => $prod['stock_minimo'],
                'stock_maximo' => $prod['stock_maximo'],
                'activo' => true,
                'categoria_id' => $categoria?->id,
                'marca_id' => $marca?->id,
                'proveedor_id' => $proveedor?->id,
            ]);

            $result[] = $producto;
        }

        return $result;
    }

    private function createPrecios($productos): void
    {
        // Obtener tipos de precio
        $tipoCosto = TipoPrecio::where('codigo', 'COSTO')->first();
        $tipoVentaMayor = TipoPrecio::where('codigo', 'VENTA_MAYOR')->first() ?? TipoPrecio::where('es_precio_base', true)->first();

        foreach ($productos as $producto) {
            // Generar precio de costo aleatorio
            $precioCosto = rand(500, 5000) / 100; // Entre 5 Bs y 50 Bs

            // Precio de costo
            if ($tipoCosto) {
                PrecioProducto::create([
                    'producto_id' => $producto->id,
                    'tipo_precio_id' => $tipoCosto->id,
                    'nombre' => 'Precio de Costo',
                    'precio' => $precioCosto,
                    'margen_ganancia' => 0,
                    'porcentaje_ganancia' => 0,
                    'es_precio_base' => true,
                    'activo' => true,
                ]);
            }

            // Precio de venta (30% de ganancia)
            if ($tipoVentaMayor) {
                $precioVenta = $precioCosto * 1.30;
                PrecioProducto::create([
                    'producto_id' => $producto->id,
                    'tipo_precio_id' => $tipoVentaMayor->id,
                    'nombre' => 'Precio de Venta',
                    'precio' => round($precioVenta, 2),
                    'margen_ganancia' => round($precioVenta - $precioCosto, 2),
                    'porcentaje_ganancia' => 30.00,
                    'es_precio_base' => false,
                    'activo' => true,
                ]);
            }
        }
    }

    private function createStockInicial($productos, $almacenes): void
    {
        $usuario = User::first();

        foreach ($productos as $producto) {
            foreach ($almacenes as $almacen) {
                // Cantidad aleatoria entre stock mínimo y máximo
                $cantidad = rand($producto->stock_minimo, $producto->stock_maximo);

                $stock = StockProducto::create([
                    'producto_id' => $producto->id,
                    'almacen_id' => $almacen->id,
                    'cantidad' => $cantidad,
                    'cantidad_disponible' => $cantidad,
                    'cantidad_reservada' => 0,
                ]);

                // Crear movimiento de inventario inicial
                MovimientoInventario::create([
                    'stock_producto_id' => $stock->id,
                    'cantidad_anterior' => 0,
                    'cantidad' => $cantidad,
                    'cantidad_posterior' => $cantidad,
                    'tipo' => 'ENTRADA_INICIAL',
                    'observacion' => 'Stock inicial del sistema',
                    'user_id' => $usuario->id,
                ]);
            }
        }
    }

    private function createCompras($proveedores, $productos): void
    {
        $usuario = User::first();
        $moneda = Moneda::where('es_moneda_base', true)->first() ?? Moneda::first();
        $almacen = Almacen::first();

        // Obtener estado documento "COMPLETADO" o el primero disponible
        $estadoDocumento = \App\Models\EstadoDocumento::where('codigo', 'COMPLETADO')->first()
            ?? \App\Models\EstadoDocumento::first();

        if (!$estadoDocumento) {
            $this->command->warn('⚠️  No se encontró ningún estado de documento. Creando uno por defecto...');
            $estadoDocumento = \App\Models\EstadoDocumento::create([
                'codigo' => 'COMPLETADO',
                'nombre' => 'Completado',
                'descripcion' => 'Documento completado',
                'color' => '#10B981',
                'permite_edicion' => false,
                'permite_anulacion' => true,
                'es_estado_final' => true,
                'activo' => true,
            ]);
        }

        // Crear 5 compras de ejemplo
        for ($i = 1; $i <= 5; $i++) {
            $proveedor = $proveedores[array_rand($proveedores)];
            $fecha = now()->subDays(rand(1, 30));

            $compra = Compra::create([
                'numero' => 'COM' . now()->format('Ymd') . str_pad($i, 4, '0', STR_PAD_LEFT),
                'proveedor_id' => $proveedor->id,
                'fecha' => $fecha,
                'subtotal' => 0,
                'descuento' => 0,
                'impuesto' => 0,
                'total' => 0,
                'observaciones' => 'Compra de prueba #' . $i,
                'moneda_id' => $moneda->id,
                'usuario_id' => $usuario->id,
                'estado_documento_id' => $estadoDocumento->id,
            ]);

            // Agregar entre 3 y 8 productos por compra
            $numProductos = rand(3, 8);
            $productosAleatorios = collect($productos)->random($numProductos);
            $subtotal = 0;

            foreach ($productosAleatorios as $producto) {
                $cantidad = rand(5, 50);
                $precioCosto = PrecioProducto::where('producto_id', $producto->id)
                    ->where('es_precio_base', true)
                    ->first();

                $precioUnitario = $precioCosto ? $precioCosto->precio : rand(500, 5000) / 100;
                $subtotalLinea = $cantidad * $precioUnitario;
                $subtotal += $subtotalLinea;

                DetalleCompra::create([
                    'compra_id' => $compra->id,
                    'producto_id' => $producto->id,
                    'cantidad' => $cantidad,
                    'precio_unitario' => $precioUnitario,
                    'subtotal' => $subtotalLinea,
                ]);
            }

            // Actualizar totales de la compra
            $compra->update([
                'subtotal' => $subtotal,
                'total' => $subtotal,
            ]);

            // Crear cuenta por pagar
            CuentaPorPagar::create([
                'compra_id' => $compra->id,
                'monto_original' => $subtotal,
                'saldo_pendiente' => $subtotal,
                'fecha_vencimiento' => $fecha->copy()->addDays(30),
                'dias_vencido' => 0,
                'estado' => 'PENDIENTE',
            ]);
        }
    }
}
