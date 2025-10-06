<?php

namespace App\Console\Commands;

use App\Jobs\VerificarStockBajoJob;
use App\Jobs\VerificarVencimientosJob;
use Illuminate\Console\Command;

class VerificarInventarioScheduled extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'inventario:verificar-alertas';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verifica stock bajo y productos próximos a vencer y envía notificaciones';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔍 Iniciando verificación de alertas de inventario...');

        // Despachar job de stock bajo
        $this->info('📦 Verificando stock bajo...');
        VerificarStockBajoJob::dispatch();

        // Despachar job de productos próximos a vencer
        $this->info('📅 Verificando productos próximos a vencer...');
        VerificarVencimientosJob::dispatch();

        $this->info('✅ Jobs despachados correctamente. Las notificaciones se procesarán en la cola.');

        return Command::SUCCESS;
    }
}
