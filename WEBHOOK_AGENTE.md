# 🔗 Sistema de Webhooks del Agente Externo

## Descripción

Este sistema permite que el **agente externo de inventario** envíe notificaciones en tiempo real a tu aplicación mediante webhooks. Las notificaciones aparecerán automáticamente en el frontend para todos los usuarios autorizados.

### 🎯 Estado del Sistema: ✅ COMPLETAMENTE FUNCIONAL

**Última actualización:** 2025-10-06
**Ambiente de prueba:** ✅ Validado en desarrollo local
**Producción:** ⏳ Pendiente de desplegar a Railway

### ⚡ Quick Start

```bash
# 1. Verificar conectividad
curl http://tu-dominio.com/api/webhooks/agente/ping \
  -H "X-Agente-Token: tu_token_secreto_aqui"

# 2. Enviar notificación
curl -X POST http://tu-dominio.com/api/webhooks/agente/notificacion \
  -H "Content-Type: application/json" \
  -H "X-Agente-Token: tu_token_secreto_aqui" \
  -d '{"tipo":"stock_bajo","titulo":"Test","mensaje":"Prueba"}'
```

---

## 📡 Endpoints Disponibles

### Base URL
```
http://tu-dominio.com/api/webhooks/agente
```

### 1. Enviar Notificación
**POST** `/api/webhooks/agente/notificacion`

Envía una notificación que se mostrará en el sistema.

#### Headers requeridos:
```
Content-Type: application/json
X-Agente-Token: tu_token_secreto_aqui
```

#### Cuerpo de la petición:
```json
{
  "tipo": "stock_bajo",
  "titulo": "Stock Bajo Detectado",
  "mensaje": "El producto X tiene stock bajo en almacén Central",
  "prioridad": "alta",
  "url": "/inventario/stock-bajo",
  "data": {
    "producto_id": 123,
    "almacen_id": 1,
    "cantidad_actual": 5
  },
  "usuarios": [1, 2, 3],
  "roles": ["admin", "gerente"]
}
```

#### Parámetros:

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `tipo` | string | ✅ | Tipo de notificación (ver tipos soportados) |
| `titulo` | string | ✅ | Título de la notificación |
| `mensaje` | string | ✅ | Mensaje descriptivo |
| `prioridad` | string | ❌ | `alta`, `media`, `baja` (default: `media`) |
| `url` | string | ❌ | URL interna para redirigir al hacer click |
| `data` | object | ❌ | Datos adicionales personalizados |
| `usuarios` | array | ❌ | IDs de usuarios específicos |
| `roles` | array | ❌ | Roles de usuarios a notificar |

#### Respuesta exitosa (201):
```json
{
  "success": true,
  "message": "Notificación procesada correctamente",
  "usuarios_notificados": 3
}
```

---

### 2. Verificar Conectividad
**GET** `/api/webhooks/agente/ping`

Verifica que el webhook esté activo y funcionando.

#### Respuesta (200):
```json
{
  "success": true,
  "message": "Webhook activo",
  "timestamp": "2025-10-06T21:30:00.000000Z",
  "request_ip": "192.168.1.1"
}
```

---

### 3. Ver Historial
**GET** `/api/webhooks/agente/historial?per_page=20`

Obtiene el historial de notificaciones enviadas por el agente.

#### Respuesta (200):
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [...],
    "total": 50
  }
}
```

---

## 🎯 Tipos de Notificaciones Soportados

| Tipo | Icono | Color | Destinatarios por defecto |
|------|-------|-------|---------------------------|
| `stock_bajo` | 📦 | Naranja | admin, gerente, encargado_inventario |
| `proximos_vencer` | ⚠️ | Rojo | admin, gerente, encargado_inventario |
| `alerta_general` | 🔔 | Amarillo | admin, gerente |
| `venta_aprobada` | ✅ | Verde | admin, gerente, vendedor |
| `compra_pendiente` | 📦 | Azul | admin, gerente, encargado_compras |
| `reporte_generado` | 📊 | Índigo | admin, gerente |
| `error_sistema` | ❌ | Rojo oscuro | admin |

**Nota:** Puedes agregar nuevos tipos en el futuro sin modificar código, solo se mostrarán con el ícono y color por defecto.

---

## 🔐 Configuración de Seguridad

### 1. Token de Autenticación (Recomendado)

Configura un token secreto compartido en el `.env`:

```env
AGENTE_WEBHOOK_TOKEN=tu_token_super_secreto_12345
```

El agente externo debe enviar este token en cada request:

```bash
curl -X POST http://tu-dominio.com/api/webhooks/agente/notificacion \
  -H "Content-Type: application/json" \
  -H "X-Agente-Token: tu_token_super_secreto_12345" \
  -d '{"tipo":"stock_bajo","titulo":"Test","mensaje":"Mensaje de prueba"}'
```

### 2. Whitelist de IPs (Opcional)

Restringe las IPs permitidas en el `.env`:

```env
AGENTE_ALLOWED_IPS=192.168.1.100,10.0.0.50
```

---

## 🚀 Ejemplos de Uso

### Ejemplo 1: Alerta de Stock Bajo
```bash
curl -X POST http://tu-dominio.com/api/webhooks/agente/notificacion \
  -H "Content-Type: application/json" \
  -H "X-Agente-Token: tu_token" \
  -d '{
    "tipo": "stock_bajo",
    "titulo": "Stock Crítico",
    "mensaje": "El producto Laptop HP tiene solo 2 unidades en almacén Central",
    "prioridad": "alta",
    "url": "/productos/123",
    "data": {
      "producto_id": 123,
      "producto_nombre": "Laptop HP",
      "almacen": "Central",
      "stock_actual": 2,
      "stock_minimo": 10
    }
  }'
```

### Ejemplo 2: Notificar a Usuarios Específicos
```bash
curl -X POST http://tu-dominio.com/api/webhooks/agente/notificacion \
  -H "Content-Type: application/json" \
  -H "X-Agente-Token: tu_token" \
  -d '{
    "tipo": "reporte_generado",
    "titulo": "Reporte Mensual Disponible",
    "mensaje": "El reporte de ventas de octubre está listo",
    "prioridad": "media",
    "url": "/reportes/ventas/octubre",
    "usuarios": [1, 5, 8]
  }'
```

### Ejemplo 3: Notificar por Roles
```bash
curl -X POST http://tu-dominio.com/api/webhooks/agente/notificacion \
  -H "Content-Type: application/json" \
  -H "X-Agente-Token: tu_token" \
  -d '{
    "tipo": "alerta_general",
    "titulo": "Mantenimiento Programado",
    "mensaje": "El sistema estará en mantenimiento el domingo a las 2 AM",
    "prioridad": "media",
    "roles": ["admin", "gerente"]
  }'
```

---

## 🔄 Flujo Completo

```
┌─────────────────┐      POST /api/webhooks/agente/notificacion      ┌──────────────────┐
│ Agente Externo  │ ───────────────────────────────────────────────> │  Tu Sistema      │
│  (Python/IA)    │                                                    │  (Laravel)       │
└─────────────────┘                                                    └──────────────────┘
                                                                               │
                                                                               │ Validar Token
                                                                               │ Determinar usuarios
                                                                               │ Guardar en BD
                                                                               │
                                                                               ▼
                                                                       ┌──────────────────┐
                                                                       │   Base de Datos  │
                                                                       │   (notifications)│
                                                                       └──────────────────┘
                                                                               │
                                                                               │ Frontend consulta
                                                                               │ cada 30 seg
                                                                               ▼
                                                                       ┌──────────────────┐
                                                                       │  Frontend React  │
                                                                       │  (Notificaciones)│
                                                                       └──────────────────┘
                                                                               │
                                                                               ▼
                                                                       👤 Usuario ve la
                                                                          notificación
```

---

## 🛠️ Configuración en el Agente Externo

Para que el agente externo pueda enviar notificaciones, debe configurar:

```python
# Ejemplo en Python
import requests

WEBHOOK_URL = "http://tu-dominio.com/api/webhooks/agente/notificacion"
WEBHOOK_TOKEN = "tu_token_secreto_aqui"

def enviar_notificacion(tipo, titulo, mensaje, prioridad="media", data=None):
    headers = {
        "Content-Type": "application/json",
        "X-Agente-Token": WEBHOOK_TOKEN
    }

    payload = {
        "tipo": tipo,
        "titulo": titulo,
        "mensaje": mensaje,
        "prioridad": prioridad,
        "data": data or {}
    }

    response = requests.post(WEBHOOK_URL, json=payload, headers=headers)
    return response.json()

# Uso
enviar_notificacion(
    tipo="stock_bajo",
    titulo="Stock Crítico Detectado",
    mensaje="El producto X tiene stock muy bajo",
    prioridad="alta",
    data={"producto_id": 123, "stock": 2}
)
```

---

## 📋 Checklist de Implementación

- [x] Controlador webhook creado
- [x] Middleware de validación configurado
- [x] Rutas API registradas
- [x] Frontend actualizado para mostrar notificaciones
- [x] Configuración en `.env`
- [x] Configurar `AGENTE_WEBHOOK_TOKEN` con un token seguro
- [x] Probar conectividad con endpoint `/ping`
- [x] Enviar notificación de prueba
- [x] Verificar que aparece en el frontend
- [ ] Coordinar con el equipo del agente externo para compartir el token
- [ ] Desplegar en producción (Railway)
- [ ] Actualizar URL del webhook en el agente externo

---

## 🐛 Troubleshooting

### Las notificaciones no llegan

1. Verificar conectividad:
```bash
curl http://tu-dominio.com/api/webhooks/agente/ping
```

2. Revisar logs:
```bash
tail -f storage/logs/laravel.log | grep "Notificación recibida"
```

3. Verificar token en `.env`:
```bash
php artisan config:clear
```

### Error 401 - Token inválido

- Verificar que el token en `.env` coincide con el que envía el agente
- Revisar que el header se llama `X-Agente-Token`

### Error 400 - No se encontraron usuarios

- Verificar que existen usuarios con los roles especificados
- Asegurarse de que hay al menos un usuario admin en el sistema

---

## 📞 Soporte

Para más información o problemas, revisar:
- Logs: `storage/logs/laravel.log`
- Controlador: `app/Http/Controllers/Api/AgenteWebhookController.php`
- Frontend: `resources/js/components/notifications-dropdown.tsx`

---

## ✅ Pruebas Realizadas

### Fecha: 2025-10-06

**Ambiente:** Desarrollo local (127.0.0.1:8000)

#### Pruebas Exitosas:

1. ✅ **Ping Endpoint:**
   ```bash
   curl http://127.0.0.1:8000/api/webhooks/agente/ping \
     -H "X-Agente-Token: tu_token_secreto_aqui"
   ```
   **Resultado:** `{"success":true,"message":"Webhook activo"}`

2. ✅ **Notificación de Stock Bajo:**
   - Enviada correctamente
   - 2 usuarios notificados
   - Apareció en el frontend con prioridad alta (borde rojo)

3. ✅ **Notificación de Vencimientos:**
   - Enviada correctamente
   - 2 usuarios notificados
   - Icono de alerta roja visible

4. ✅ **Notificación de Reporte:**
   - Enviada correctamente
   - 2 usuarios notificados
   - Icono índigo con prioridad media

5. ✅ **Notificación de Alerta General:**
   - Enviada correctamente
   - 2 usuarios notificados
   - Icono amarillo con prioridad baja

**Total de notificaciones de prueba:** 4 notificaciones × 2 usuarios = 8 registros en BD

#### Validaciones de Seguridad:

- ✅ Token requerido: Peticiones sin token rechazan con 401
- ✅ Token correcto: Peticiones con token válido aceptan con 201
- ✅ Logs generados: Todas las notificaciones registradas en logs

#### Frontend:

- ✅ Badge de contador actualizado correctamente
- ✅ Notificaciones visibles en dropdown
- ✅ Iconos y colores por tipo funcionando
- ✅ Click en notificación marca como leída
- ✅ Botón "Marcar todas" funcional

---

## 🎓 Notas de Implementación

### Sistema Escalable
El sistema está diseñado para:
- ✅ Aceptar nuevos tipos de notificaciones sin cambios en código
- ✅ Enrutar automáticamente según roles
- ✅ Soportar datos personalizados en campo `data`
- ✅ Funcionar tanto con usuarios específicos como con roles

### Seguridad Implementada
- ✅ Token de autenticación en header
- ✅ Opción de whitelist de IPs
- ✅ Logs de auditoría completos
- ✅ Validación de estructura de datos

### Integración con Frontend
- ✅ Actualización automática cada 30 segundos
- ✅ Notificaciones en tiempo real
- ✅ UI responsive y accesible
- ✅ Soporte para múltiples tipos de notificación

---

## 🚢 Despliegue a Producción (Railway)

### Pasos para desplegar:

1. **Commit de cambios:**
   ```bash
   git add .
   git commit -m "feat: sistema de webhooks para agente externo"
   git push origin main
   ```

2. **Railway detectará automáticamente:**
   - Nuevas migraciones (tabla `notifications`)
   - Nuevas rutas API
   - Nuevas variables de entorno requeridas

3. **Configurar variables en Railway:**
   - Ve a tu proyecto en Railway
   - Settings → Variables
   - Agregar:
     ```
     AGENTE_WEBHOOK_TOKEN=genera_un_token_aleatorio_seguro_aqui
     AGENTE_ALLOWED_IPS=  (dejar vacío o agregar IPs)
     ```

4. **URL del webhook en producción:**
   ```
   https://tu-app.up.railway.app/api/webhooks/agente/notificacion
   ```

5. **Probar en producción:**
   ```bash
   curl https://tu-app.up.railway.app/api/webhooks/agente/ping \
     -H "X-Agente-Token: tu_token_de_produccion"
   ```

### Notas importantes:
- ✅ Las migraciones se ejecutan automáticamente en Railway
- ✅ El middleware ya está registrado
- ✅ Las rutas no requieren CSRF (ya configuradas)
- ⚠️ Genera un token DIFERENTE para producción (más seguro)
- ⚠️ Comparte el nuevo token con el equipo del agente externo
