<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Programar verificación de alertas de inventario
// Para producción: ->hourly() o ->daily()
// Para desarrollo/demo: ->everyMinute() o ->everyFiveMinutes()
Schedule::command('inventario:verificar-alertas')
    ->everyFiveMinutes()
    ->withoutOverlapping()
    ->onOneServer();
