@echo off
echo ====================================
echo  SETUP DATABASE - Sistema Inventario
echo ====================================
echo.

:menu
echo Selecciona una opcion:
echo.
echo 1. Limpiar y poblar base de datos (BORRA TODO)
echo 2. Solo ejecutar seeders (mantiene datos existentes)
echo 3. Solo ejecutar migraciones
echo 4. Verificar estado de migraciones
echo 5. Salir
echo.
set /p option="Ingresa el numero de opcion: "

if "%option%"=="1" goto fresh
if "%option%"=="2" goto seed
if "%option%"=="3" goto migrate
if "%option%"=="4" goto status
if "%option%"=="5" goto end
echo Opcion invalida
goto menu

:fresh
echo.
echo ⚠️  ADVERTENCIA: Esto ELIMINARA todos los datos de la base de datos
set /p confirm="¿Estas seguro? (S/N): "
if /i "%confirm%" NEQ "S" goto menu
echo.
echo 🗑️  Limpiando base de datos...
php artisan migrate:fresh --seed
if %errorlevel% neq 0 (
    echo ❌ Error al ejecutar migrate:fresh
    pause
    goto menu
)
echo.
echo ✅ Base de datos poblada exitosamente!
echo.
echo 📧 Usuario: admin@paucara.test
echo 🔑 Contraseña: password
echo.
pause
goto menu

:seed
echo.
echo 🌱 Ejecutando seeders...
php artisan db:seed
if %errorlevel% neq 0 (
    echo ❌ Error al ejecutar seeders
    echo.
    echo Intenta ejecutar: composer dump-autoload
    pause
    goto menu
)
echo.
echo ✅ Seeders ejecutados exitosamente!
echo.
pause
goto menu

:migrate
echo.
echo 📦 Ejecutando migraciones...
php artisan migrate
if %errorlevel% neq 0 (
    echo ❌ Error al ejecutar migraciones
    pause
    goto menu
)
echo.
echo ✅ Migraciones ejecutadas exitosamente!
echo.
pause
goto menu

:status
echo.
echo 📊 Estado de las migraciones:
echo.
php artisan migrate:status
echo.
pause
goto menu

:end
echo.
echo 👋 Saliendo...
exit /b 0
