# 🗄️ Script para Poblar la Base de Datos

## 📋 Pasos para ejecutar el seeding

### 1️⃣ Limpiar la base de datos actual (OPCIONAL - solo si quieres empezar desde cero)

```bash
php artisan migrate:fresh
```

⚠️ **ADVERTENCIA**: Este comando eliminará TODOS los datos de tu base de datos actual.

### 2️⃣ Ejecutar las migraciones

Si no ejecutaste `migrate:fresh`, ejecuta solo las migraciones:

```bash
php artisan migrate
```

### 3️⃣ Poblar la base de datos

```bash
php artisan db:seed
```

O si quieres hacer todo en un solo comando (limpiar + migrar + poblar):

```bash
php artisan migrate:fresh --seed
```

---

## 📊 Datos que se crearán

### ✅ **Usuario Administrador**
- **Email**: `admin@paucara.test`
- **Contraseña**: `password`
- **Rol**: Admin (con todos los permisos)

### ✅ **Catálogos Base**
- 8 **Categorías** (Bebidas, Alimentos, Lácteos, Snacks, Limpieza, etc.)
- 8 **Marcas** (Coca Cola, PIL Andina, Pepsi, Arcor, Paceña, etc.)
- 3 **Almacenes** (Central, Sucursal Norte, Depósito)
- 5 **Proveedores** (Distribuidoras reales de Bolivia)
- **Monedas** (BOB como base, USD, EUR)
- **Tipos de Precio** (Costo, Venta Mayor, Venta Menor, etc.)

### ✅ **Productos** (17 productos de ejemplo)
- **Bebidas**: Coca Cola 2L, Sprite, Paceña, Pepsi
- **Lácteos**: Leche PIL, Yogurt, Mantequilla, Queso
- **Snacks**: Chocolates, Caramelos, Papas fritas
- **Alimentos**: Arroz, Aceite, Fideos
- **Panadería**: Pan marraqueta, Pan integral

Cada producto incluye:
- ✅ Precio de costo
- ✅ Precio de venta (30% de ganancia)
- ✅ Stock inicial en los 3 almacenes
- ✅ Movimientos de inventario

### ✅ **Compras** (5 compras de ejemplo)
- Fechas entre los últimos 30 días
- Entre 3 y 8 productos por compra
- **Cuentas por pagar** creadas automáticamente
- Números de compra: `COM20251001XXXX`

### ✅ **Stock e Inventario**
- Stock distribuido en los 3 almacenes
- Movimientos de inventario registrados
- Cantidades entre stock mínimo y máximo

---

## 🎯 Comandos Útiles Adicionales

### Ver estado de migraciones
```bash
php artisan migrate:status
```

### Revertir última migración
```bash
php artisan migrate:rollback
```

### Ejecutar solo un seeder específico
```bash
php artisan db:seed --class=InventarioComprasSeeder
```

### Limpiar caché de configuración
```bash
php artisan config:clear
php artisan cache:clear
```

---

## 🔍 Verificar los Datos

Después de ejecutar el seeding, puedes verificar los datos:

### Contar registros
```bash
php artisan tinker
```

Luego en tinker:
```php
\App\Models\Producto::count();      // Debería retornar 17
\App\Models\Proveedor::count();     // Debería retornar 5
\App\Models\Categoria::count();     // Debería retornar 8
\App\Models\Compra::count();        // Debería retornar 5
\App\Models\StockProducto::count(); // Debería retornar 51 (17 productos × 3 almacenes)
```

---

## 🚀 Iniciar el servidor de desarrollo

Después de poblar la base de datos:

```bash
composer run dev
```

O ejecutar individualmente:
```bash
# Terminal 1: Servidor Laravel
php artisan serve

# Terminal 2: Queue Worker
php artisan queue:listen --tries=1

# Terminal 3: Vite Dev Server
npm run dev
```

---

## 🔐 Acceso al Sistema

1. Abre tu navegador en: `http://localhost:8000`
2. Inicia sesión con:
   - **Email**: `admin@paucara.test`
   - **Password**: `password`

---

## ✨ ¿Qué puedes hacer ahora?

Con los datos de prueba podrás:
- ✅ Ver el **Dashboard** con métricas de compras e inventario
- ✅ Navegar por el **listado de productos** con stock
- ✅ Ver las **compras realizadas** con sus detalles
- ✅ Revisar las **cuentas por pagar** pendientes
- ✅ Consultar el **inventario** por almacén
- ✅ Ver **alertas de stock bajo**
- ✅ Consultar **movimientos de inventario**
- ✅ Gestionar **proveedores**
- ✅ Crear **nuevas compras**

---

## 🆘 Solución de Problemas

### Error: "Class 'Database\Seeders\InventarioComprasSeeder' not found"
```bash
composer dump-autoload
php artisan db:seed
```

### Error: "SQLSTATE[23000]: Integrity constraint violation"
Probablemente ya tienes datos. Ejecuta:
```bash
php artisan migrate:fresh --seed
```

### Error: "Table already exists"
```bash
php artisan migrate:fresh
php artisan db:seed
```

---

## 📝 Notas Importantes

- 🔴 **NUNCA** ejecutes `migrate:fresh` en producción
- 🟢 Los datos son de **prueba** y pueden ser modificados
- 🟡 Las compras generadas tienen fechas aleatorias de los últimos 30 días
- 🔵 Los precios son aleatorios entre 5 Bs y 50 Bs
- 🟣 El stock inicial es aleatorio entre stock_minimo y stock_maximo

---

¡Listo! Tu base de datos estará poblada con datos realistas para empezar a trabajar. 🎉
