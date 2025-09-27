<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('conversaciones_agente', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('session_id')->nullable();
            $table->text('query');
            $table->json('response')->nullable();
            $table->json('context')->nullable();
            $table->enum('status', ['pending', 'completed', 'failed'])->default('pending');
            $table->text('error_message')->nullable();
            $table->integer('response_time')->nullable()->comment('Tiempo de respuesta en milisegundos');
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
            $table->index(['session_id']);
            $table->index(['status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conversaciones_agente');
    }
};
