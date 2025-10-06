# Instrucciones para Importar a Enterprise Architect

## Archivos Generados
- `productos_actualizado.xmi` - Archivo XMI compatible con Enterprise Architect
- `convert_to_eapx.py` - Script de conversión (opcional, para futuras conversiones)

## Método 1: Importar XMI en Enterprise Architect

### Pasos:
1. **Abre Enterprise Architect**
2. **Crea un nuevo proyecto** o abre uno existente
3. **Ve a**: `File` → `Import/Export` → `Import Package from XMI`
4. **Selecciona** el archivo `productos_actualizado.xmi`
5. **Configura la importación**:
   - Selecciona el paquete de destino
   - Marca "Import as new package"
   - Acepta las opciones por defecto
6. **Haz clic en "Import"**

### Resultado:
- Se creará un nuevo paquete llamado "Productos"
- Contendrá 17 clases (entidades de base de datos)
- Incluirá 18 relaciones entre las clases
- Podrás guardar el proyecto como archivo .eapx

## Método 2: Importar PlantUML directamente (si está disponible)

### Pasos:
1. **Abre Enterprise Architect**
2. **Ve a**: `Tools` → `Import` → `PlantUML`
3. **Selecciona** el archivo `productos_actualizado.puml`
4. **Sigue las instrucciones** del asistente de importación

## Método 3: Usar herramientas intermedias

### Opción A: ArgoUML
1. Descarga e instala ArgoUML
2. Importa el archivo .puml
3. Exporta como XMI
4. Importa el XMI en Enterprise Architect

### Opción B: StarUML
1. Descarga e instala StarUML
2. Importa el archivo .puml
3. Exporta como XMI
4. Importa el XMI en Enterprise Architect

## Verificación Post-Importación

Después de importar, verifica que:
- ✅ Todas las 17 entidades estén presentes
- ✅ Las relaciones se muestren correctamente
- ✅ Los nombres de campos estén preservados
- ✅ El diagrama sea visualmente correcto

## Entidades Incluidas:
- productos
- categorias
- marcas
- unidades_medida
- stock_productos
- movimientos_inventario
- tipo_mermas
- tipos_ajuste_inventario
- estado_mermas
- transferencia_inventarios
- detalle_transferencia_inventarios
- configuracion_ganancias
- precios_producto
- historial_precios
- imagenes_producto
- codigos_barra
- almacenes

## Notas Importantes:
- El archivo XMI generado es compatible con la mayoría de versiones de Enterprise Architect
- Si encuentras problemas, prueba con el método de PlantUML directo
- Después de importar, puedes ajustar manualmente el diagrama según tus necesidades
- El archivo .eapx se creará cuando guardes el proyecto en Enterprise Architect
