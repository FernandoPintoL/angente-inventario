# 📢 Sistema de Notificaciones - Resumen Ejecutivo

## 🎯 Objetivo

Implementar un sistema completo de notificaciones que permita:
1. **Notificaciones internas**: Alertas automáticas de stock bajo y vencimientos
2. **Notificaciones del agente externo**: Recibir alertas en tiempo real del agente IA mediante webhooks

---

## ✅ Estado del Proyecto: COMPLETADO

**Fecha de implementación:** 2025-10-06
**Estado:** ✅ Funcional en desarrollo
**Próximo paso:** Desplegar a producción (Railway)

---

## 📦 Componentes Implementados

### 1. Backend (Laravel)

#### Notificaciones Internas
- **Models:**
  - `User` con trait `Notifiable`

- **Notifications:**
  - `StockBajoNotification` - Alerta de stock bajo
  - `ProductoProximoVencerNotification` - Productos por vencer

- **Jobs:**
  - `VerificarStockBajoJob` - Revisa stock cada N minutos
  - `VerificarVencimientosJob` - Revisa vencimientos

- **Commands:**
  - `php artisan inventario:verificar-alertas` - Ejecuta verificaciones manualmente

#### Webhooks del Agente Externo
- **Controllers:**
  - `Api\AgenteWebhookController` - Recibe notificaciones del agente
  - `NotificacionController` - Maneja notificaciones del usuario

- **Middleware:**
  - `ValidateAgenteWebhook` - Seguridad con token y whitelist de IPs

- **Rutas API:**
  ```
  POST /api/webhooks/agente/notificacion
  GET  /api/webhooks/agente/ping
  GET  /api/webhooks/agente/historial

  GET  /api/notificaciones
  GET  /api/notificaciones/no-leidas
  GET  /api/notificaciones/count
  POST /api/notificaciones/{id}/marcar-leida
  POST /api/notificaciones/marcar-todas-leidas
  DELETE /api/notificaciones/{id}
  ```

#### Base de Datos
- **Tabla:** `notifications` (creada con migración estándar de Laravel)
- **Campos:** id, type, notifiable_type, notifiable_id, data, read_at, created_at, updated_at

### 2. Frontend (React + TypeScript)

#### Componentes
- **`NotificationsDropdown`**: Dropdown con:
  - Badge de contador en tiempo rojo
  - Lista de notificaciones con scroll
  - Íconos por tipo de notificación
  - Colores de prioridad (rojo, naranja, azul)
  - Tiempo relativo ("Hace 5m")
  - Botón "Marcar todas como leídas"
  - Botón de eliminar individual

- **`ScrollArea`**: Componente UI de Radix para scroll suave

#### Integración
- Integrado en `app-sidebar-header.tsx`
- Actualización automática cada 30 segundos
- Click en notificación marca como leída y redirige

### 3. Configuración

#### Variables de Entorno (.env)
```env
# Mailtrap
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=462cc76ca7a96b
MAIL_PASSWORD=07323d9c5169c9
MAIL_FROM_ADDRESS="alertas@distribuidorapaucara.com"

# Anti-spam de alertas (en horas)
ALERT_SPAM_INTERVAL_HOURS=0.0833  # 5 min para demo, 24 para producción

# Webhook del agente
AGENTE_WEBHOOK_TOKEN=tu_token_secreto_aqui
AGENTE_ALLOWED_IPS=*
```

#### Scheduler (routes/console.php)
```php
Schedule::command('inventario:verificar-alertas')
    ->everyFiveMinutes()  // Cambiar a ->daily() en producción
    ->withoutOverlapping()
    ->onOneServer();
```

### 4. Deployment (Railway)

#### Procfile
```
web: php artisan serve --host=0.0.0.0 --port=$PORT
worker: php artisan queue:work --tries=3 --timeout=180 --sleep=3
scheduler: while true; do php artisan schedule:run --verbose --no-interaction & sleep 60; done
```

**Nota:** Se requieren **3 servicios** en Railway (web, worker, scheduler)

---

## 🎨 Tipos de Notificaciones Soportados

| Tipo | Origen | Icono | Color | Destinatarios |
|------|--------|-------|-------|---------------|
| `stock_bajo` | Interno/Agente | 📦 | Naranja | admin, gerente, encargado_inventario |
| `proximos_vencer` | Interno/Agente | ⚠️ | Rojo | admin, gerente, encargado_inventario |
| `alerta_general` | Agente | 🔔 | Amarillo | admin, gerente |
| `venta_aprobada` | Agente | ✅ | Verde | admin, gerente, vendedor |
| `compra_pendiente` | Agente | 📦 | Azul | admin, gerente, encargado_compras |
| `reporte_generado` | Agente | 📊 | Índigo | admin, gerente |
| `error_sistema` | Agente | ❌ | Rojo oscuro | admin |

**Sistema extensible:** Cualquier nuevo tipo se mostrará con icono y color por defecto.

---

## 🔐 Seguridad

### Autenticación del Webhook
1. **Token en Header:** `X-Agente-Token`
2. **Whitelist de IPs:** Opcional, configurable en `.env`
3. **CSRF Excluido:** Rutas webhook excluidas de CSRF automáticamente
4. **Logs de Auditoría:** Todas las peticiones registradas

### Autenticación de Usuarios
- **Web:** Autenticación por sesión (middleware `auth:web`)
- **API Externa:** Autenticación Sanctum (middleware `auth:sanctum`)
- **Dual:** Rutas soportan ambos tipos (`auth:sanctum,web`)

---

## 📊 Flujo de Datos

### Notificaciones Internas
```
Scheduler (cada 5 min)
    │
    ▼
Command: inventario:verificar-alertas
    │
    ├─> VerificarStockBajoJob
    │       │
    │       ├─> Consulta productos con stock bajo
    │       ├─> Crea notificaciones en BD
    │       └─> Envía emails (Mailtrap)
    │
    └─> VerificarVencimientosJob
            │
            ├─> Consulta productos próximos a vencer
            ├─> Crea notificaciones en BD
            └─> Envía emails (Mailtrap)
```

### Notificaciones del Agente
```
Agente Externo (Python/IA)
    │
    │ POST /api/webhooks/agente/notificacion
    │ Header: X-Agente-Token
    │
    ▼
ValidateAgenteWebhook (Middleware)
    │
    ├─ Valida token ✓
    ├─ Valida IP (opcional) ✓
    │
    ▼
AgenteWebhookController
    │
    ├─> Valida estructura de datos
    ├─> Determina usuarios destinatarios (por ID, rol o tipo)
    ├─> Crea notificación en BD para cada usuario
    └─> Retorna éxito + contador de usuarios notificados
```

### Frontend
```
Usuario carga página
    │
    ▼
NotificationsDropdown monta
    │
    ├─> GET /api/notificaciones/count (cada 30 seg)
    │       └─> Actualiza badge
    │
    └─> Usuario hace click en campana
            │
            ▼
        GET /api/notificaciones/no-leidas
            │
            ├─> Muestra lista de notificaciones
            │
            └─> Usuario hace click en notificación
                    │
                    ├─> POST /api/notificaciones/{id}/marcar-leida
                    └─> Redirige a URL (si existe)
```

---

## ✅ Pruebas Realizadas

### Ambiente: Desarrollo Local
**Fecha:** 2025-10-06

1. ✅ **Ping Endpoint:** Conectividad validada
2. ✅ **4 Notificaciones de prueba enviadas:**
   - Stock bajo (alta prioridad)
   - Vencimientos (alta prioridad)
   - Reporte generado (media prioridad)
   - Alerta general (baja prioridad)
3. ✅ **8 Registros en BD:** 4 tipos × 2 usuarios
4. ✅ **Frontend:** Badge, dropdown, iconos, colores funcionando
5. ✅ **Seguridad:** Token validado, logs generados

---

## 📋 Checklist de Producción

- [x] Sistema implementado y probado en desarrollo
- [x] Documentación completa creada
- [x] Configuración de seguridad implementada
- [ ] **Deploy a Railway**
- [ ] **Configurar variables en Railway:**
  - `AGENTE_WEBHOOK_TOKEN` (generar token nuevo y seguro)
  - `ALERT_SPAM_INTERVAL_HOURS=24`
  - Actualizar scheduler a `->daily()`
- [ ] **Crear 3 servicios en Railway:**
  - Servicio Web (principal)
  - Servicio Worker (procesa colas)
  - Servicio Scheduler (ejecuta comandos programados)
- [ ] **Compartir con agente externo:**
  - URL del webhook en producción
  - Token de producción
  - Documentación `WEBHOOK_AGENTE.md`
- [ ] **Pruebas en producción:**
  - Verificar ping endpoint
  - Enviar notificación de prueba
  - Validar que aparece en frontend

---

## 📚 Documentación

- **`WEBHOOK_AGENTE.md`**: Guía completa de integración del webhook
- **`SISTEMA_NOTIFICACIONES_RESUMEN.md`**: Este documento (resumen ejecutivo)
- **`CLAUDE.md`**: Instrucciones generales del proyecto

---

## 🔧 Comandos Útiles

```bash
# Limpiar cachés
php artisan config:clear
php artisan route:clear

# Ejecutar verificación manual
php artisan inventario:verificar-alertas

# Procesar cola
php artisan queue:work

# Ver logs
tail -f storage/logs/laravel.log | grep "Notificación"

# Probar webhook
curl http://127.0.0.1:8000/api/webhooks/agente/ping \
  -H "X-Agente-Token: tu_token_secreto_aqui"
```

---

## 💡 Características Destacadas

✅ **Dual Origin:** Notificaciones internas Y del agente externo
✅ **Tiempo Real:** Actualización cada 30 segundos
✅ **Escalable:** Nuevos tipos sin cambios de código
✅ **Seguro:** Token + logs + whitelist
✅ **Smart Routing:** Enrutamiento automático por roles
✅ **Anti-Spam:** Intervalo configurable entre alertas
✅ **Responsive UI:** Funciona en mobile y desktop
✅ **Auditable:** Historial completo en BD + logs

---

## 📞 Contacto y Soporte

Para dudas o problemas:
- **Logs:** `storage/logs/laravel.log`
- **Documentación:** Ver archivos `.md` en raíz del proyecto
- **Código:**
  - Backend: `app/Http/Controllers/Api/AgenteWebhookController.php`
  - Frontend: `resources/js/components/notifications-dropdown.tsx`
  - Jobs: `app/Jobs/Verificar*.php`

---

**🎉 Sistema completamente funcional y listo para producción!**
