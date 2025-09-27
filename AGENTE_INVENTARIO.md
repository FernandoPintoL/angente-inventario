# Integración del Agente de Inventario

Este documento explica la implementación completa del módulo de Agente de Inventario integrado con LANGCHAIN en el sistema de gestión de ventas Laravel + React.

## Resumen de la Implementación

Se ha implementado un sistema completo de chatbot inteligente que permite a los usuarios consultar información de inventario mediante lenguaje natural. El agente externo (desarrollado con LANGCHAIN) se ejecuta en `http://localhost:8000` y se comunica con nuestro sistema Laravel a través de APIs REST.

## Arquitectura

### Backend (Laravel)

#### 1. Modelo de Datos
- **ConversacionAgente**: Almacena el historial de conversaciones entre usuarios y el agente
  - Ubicación: `app/Models/ConversacionAgente.php`
  - Tabla: `conversaciones_agente`
  - Campos: user_id, session_id, query, response, context, status, error_message, response_time

#### 2. Servicios
- **AgenteInventarioService**: Servicio principal para comunicación con el agente externo
  - Ubicación: `app/Services/AgenteInventarioService.php`
  - Funciones: envío de consultas, manejo de errores, fallback local, enriquecimiento de contexto

#### 3. Controladores
- **AgenteController**: Controlador web para renderizar páginas
  - Ubicación: `app/Http/Controllers/AgenteController.php`
  - Rutas: `/agente`, `/agente/dashboard`

- **AgenteInventarioController**: Controlador API para comunicación con el frontend
  - Ubicación: `app/Http/Controllers/Api/AgenteInventarioController.php`
  - Endpoints: `/api/agente/ask`, `/api/agente/historial`, `/api/agente/health`

#### 4. Configuración
- **config/agente.php**: Archivo de configuración del módulo
- Variables de entorno:
  - `AGENTE_INVENTARIO_URL`: URL del agente externo
  - `AGENTE_INVENTARIO_TIMEOUT`: Timeout de las peticiones
  - `AGENTE_INVENTARIO_FALLBACK`: Habilitar respuestas de fallback

### Frontend (React + TypeScript)

#### 1. Componentes
- **ChatBot**: Componente principal del chat
  - Ubicación: `resources/js/components/agente/ChatBot.tsx`
  - Funcionalidades: envío de mensajes, historial de conversación, estados de carga

- **ChatHistory**: Componente para mostrar historial de conversaciones
  - Ubicación: `resources/js/components/agente/ChatHistory.tsx`
  - Funcionalidades: búsqueda, filtrado, paginación

#### 2. Páginas
- **Página Principal del Agente**: Interface principal del chatbot
  - Ubicación: `resources/js/pages/agente/index.tsx`
  - Características: chat interactivo, ejemplos de uso, información de estado

## Funcionalidades Implementadas

### 1. Chat Interactivo
- Interface de chat moderno con mensajes en tiempo real
- Soporte para consultas en lenguaje natural en español
- Indicadores de estado (enviando, completado, error)
- Manejo de aclaraciones cuando el agente necesita más información

### 2. Gestión de Contexto
- Enriquecimiento automático del contexto con datos de inventario
- Detección automática de SKUs en las consultas
- Información de productos asociada automáticamente

### 3. Fallback Local
- Respuestas locales cuando el agente externo no está disponible
- Consultas básicas de stock y productos con datos locales
- Manejo graceful de errores de conectividad

### 4. Historial de Conversaciones
- Almacenamiento persistente de todas las conversaciones
- Búsqueda en historial por contenido de mensaje
- Filtrado por estado (completado, error, pendiente)
- Limpieza de historial por usuario

### 5. Sistema de Permisos
- `agente.use`: Permiso básico para usar el agente
- `agente.history`: Permiso para ver historial de conversaciones
- `agente.admin`: Permiso para administrar configuración del agente

## Rutas Implementadas

### Rutas Web
```php
Route::prefix('agente')->name('agente.')->middleware('permission:agente.use')->group(function () {
    Route::get('/', [AgenteController::class, 'index'])->name('index');
    Route::get('dashboard', [AgenteController::class, 'dashboard'])->name('dashboard');
});
```

### Rutas API
```php
Route::middleware(['auth:sanctum'])->prefix('agente')->name('api.agente.')->group(function () {
    Route::get('health', [AgenteInventarioController::class, 'health'])->name('health');
    Route::post('ask', [AgenteInventarioController::class, 'ask'])->middleware('permission:agente.use');
    Route::get('historial', [AgenteInventarioController::class, 'historial'])->middleware('permission:agente.history');
    Route::get('conversacion/{id}', [AgenteInventarioController::class, 'conversacion'])->middleware('permission:agente.history');
    Route::delete('historial', [AgenteInventarioController::class, 'eliminarHistorial'])->middleware('permission:agente.history');
});
```

## Instalación y Configuración

### 1. Migración de Base de Datos
```bash
php artisan migrate
```

### 2. Seeders
```bash
php artisan db:seed --class=AgentePermissionsSeeder
php artisan db:seed --class=ModuloSidebarSeeder
```

### 3. Variables de Entorno
Agregar al archivo `.env`:
```env
AGENTE_INVENTARIO_URL=http://localhost:8000
AGENTE_INVENTARIO_TIMEOUT=30
AGENTE_INVENTARIO_FALLBACK=true
AGENTE_INVENTARIO_LOG=true
```

### 4. Permisos de Usuario
Asignar permisos a los roles correspondientes:
- Administrador: todos los permisos del agente
- Gerente: `agente.use`, `agente.history`
- Empleado: `agente.use`

## Navegación

El módulo se integra automáticamente en el sidebar con:
- **Título**: "Agente IA"
- **Icono**: Bot
- **Categoría**: Inventario
- **Ruta**: `/agente`

## Ejemplos de Uso

### Consultas Soportadas
1. **Stock de productos**: "¿Cuál es el stock del producto ABC-123?"
2. **Stock bajo**: "Muéstrame los productos con poco stock"
3. **Movimientos**: "¿Cuáles fueron los últimos movimientos de inventario?"
4. **Vencimientos**: "¿Qué productos están próximos a vencer?"

### Formato de Respuesta del Agente Externo
```json
{
  "message": "El producto ABC-123 tiene 25 unidades en stock.",
  "data": {
    "sku": "ABC-123",
    "name": "Teclado mecánico",
    "stock": 25,
    "location": "Almacén A"
  },
  "clarification": null
}
```

### Respuesta con Aclaración
```json
{
  "message": "Necesito más información para ayudarte.",
  "data": null,
  "clarification": {
    "needs_clarification": true,
    "question": "¿De qué producto específico quieres conocer el stock?"
  }
}
```

## Monitoreo y Logs

- Todas las consultas se registran en la base de datos
- Errores de comunicación con el agente se loguean en Laravel
- Métricas de tiempo de respuesta almacenadas
- Estado de salud del agente verificable en tiempo real

## Seguridad

- Todas las rutas protegidas con middleware de autenticación
- Sistema de permisos granular con Spatie Permission
- Validación de entrada en todas las APIs
- Sanitización de datos de respuesta

## Escalabilidad

- Servicio preparado para múltiples agentes
- Cache configurable para respuestas frecuentes
- Separación clara entre lógica de negocio y comunicación
- Arquitectura preparada para microservicios

## Próximas Mejoras

1. **Cache de Respuestas**: Implementar cache para consultas frecuentes
2. **Métricas Avanzadas**: Dashboard de estadísticas de uso
3. **Configuración Dinámica**: Interface para configurar el agente desde el panel
4. **Múltiples Agentes**: Soporte para diferentes tipos de agentes especializados
5. **Webhooks**: Notificaciones automáticas del agente
6. **Exportación**: Exportar conversaciones a PDF/Excel

## Troubleshooting

### Agente No Disponible
- Verificar que el servicio en `http://localhost:8000` esté ejecutándose
- Revisar logs de Laravel para errores de conectividad
- El sistema funcionará con respuestas de fallback local

### Permisos
- Verificar que el usuario tenga el permiso `agente.use`
- Ejecutar seeders si los permisos no existen

### Frontend
- Limpiar cache de navegador si hay problemas de interfaz
- Verificar que el token CSRF esté configurado correctamente

## Contacto y Soporte

Este módulo está completamente integrado en el sistema existente y sigue las mismas convenciones de código y arquitectura del proyecto principal.