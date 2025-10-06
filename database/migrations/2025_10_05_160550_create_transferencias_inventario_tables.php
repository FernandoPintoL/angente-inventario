<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transferencia_inventarios', function (Blueprint $table) {
            $table->id();
            $table->timestamp('fecha');
            $table->foreignId('almacen_origen_id')->constrained('almacenes');
            $table->foreignId('almacen_destino_id')->constrained('almacenes');
            $table->string('estado');
            $table->text('observaciones')->nullable();
            $table->timestamp('fecha_envio')->nullable();
            $table->foreignId('vehiculo_id')->nullable();
            $table->integer('total_productos')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('detalle_transferencia_inventarios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transferencia_id')->constrained('transferencia_inventarios')->onDelete('cascade');
            $table->foreignId('producto_id')->constrained('productos');
            $table->string('lote')->nullable();
            $table->date('fecha_vencimiento')->nullable();
            $table->text('observaciones')->nullable();
            $table->integer('cantidad')->default(1);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detalle_transferencia_inventarios');
        Schema::dropIfExists('transferencia_inventarios');
    }
};
