import React from 'react';
import { ReportTable } from './ReportTable';

interface DataFormatterProps {
  data: any;
  compact?: boolean; // Para indicar si estamos en modo compacto (chat flotante)
}

export function DataFormatter({ data, compact = false }: DataFormatterProps) {
  if (!data) return null;

  // Función helper para determinar si los datos justifican mostrar una tabla
  const shouldRenderTable = (tableData: any[], minRows: number = 1) => {
    return Array.isArray(tableData) && tableData.length >= minRows && tableData.length > 0;
  };

  // Manejar el nuevo formato structured_table del agente inteligente
  if (data.type === 'structured_table' && data.data && data.columns && shouldRenderTable(data.data)) {
    return (
      <div className="mt-3">
        <ReportTable
          title={data.title || 'Reporte'}
          data={data.data}
          columns={data.columns}
          exportEndpoint="/api/agente/export-report"
          maxHeight={compact ? "200px" : "300px"}
          className={compact ? "text-xs" : "text-xs"}
          searchable={!compact || data.data.length > 5} // Deshabilitar búsqueda en modo compacto si hay pocos datos
        />
        {data.sql_query && (
          <div className="mt-2 p-2 bg-muted/30 rounded text-xs font-mono text-muted-foreground">
            <div className="font-semibold mb-1">Consulta SQL generada:</div>
            <div className="overflow-x-auto">{data.sql_query}</div>
            {data.execution_time && (
              <div className="mt-1 text-right">
                Tiempo de ejecución: {(data.execution_time * 1000).toFixed(2)}ms
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Manejar raw_data del nuevo agente
  if (data.type === 'raw_data' && data.data) {
    // Si es un array de objetos, mostrar como tabla automática SOLO si tiene suficientes datos
    if (Array.isArray(data.data) && shouldRenderTable(data.data, 2) && typeof data.data[0] === 'object') {
      const columns = Object.keys(data.data[0]).map(key => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
        sortable: true
      }));

      return (
        <div className="mt-3">
          <ReportTable
            title="Datos del Agente"
            data={data.data}
            columns={columns}
            exportEndpoint="/api/agente/export-report"
            maxHeight={compact ? "200px" : "300px"}
            className={compact ? "text-xs" : "text-xs"}
            searchable={!compact || data.data.length > 5}
          />
          {data.sql_query && (
            <div className="mt-2 p-2 bg-muted/30 rounded text-xs font-mono text-muted-foreground">
              <div className="font-semibold mb-1">Consulta SQL generada:</div>
              <div className="overflow-x-auto">{data.sql_query}</div>
              {data.execution_time && (
                <div className="mt-1 text-right">
                  Tiempo de ejecución: {(data.execution_time * 1000).toFixed(2)}ms
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
  }

  // Verificar si es un reporte con datos y columnas para mostrar tabla (formato legacy)
  if (data.type === 'report' && data.data && data.columns) {
    return (
      <div className="mt-2">
        <ReportTable
          title={data.title || 'Reporte'}
          data={data.data}
          columns={data.columns}
          exportEndpoint="/api/agente/export-report"
          maxHeight={compact ? "200px" : "300px"}
          className={compact ? "text-xs" : "text-xs"}
          searchable={!compact || data.data.length > 5} // Deshabilitar búsqueda en modo compacto si hay pocos datos
        />
      </div>
    );
  }

  // Formato especial para productos con stock
  if (data.type === 'productos_stock' && Array.isArray(data.productos) && shouldRenderTable(data.productos)) {
    const columns = [
      { key: 'codigo', label: 'Código', sortable: true },
      { key: 'nombre', label: 'Producto', sortable: true },
      { key: 'stock_actual', label: 'Stock', sortable: true, formatter: (value: any) => <span className={value <= 0 ? 'text-red-600 font-bold' : value < 10 ? 'text-amber-600 font-semibold' : 'text-green-600'}>{value}</span> },
      { key: 'stock_minimo', label: 'Stock Mín.', sortable: true },
      { key: 'almacen', label: 'Almacén', sortable: true }
    ];

    return (
      <div className="mt-2">
        <ReportTable
          title="Productos con Stock"
          data={data.productos}
          columns={columns}
          exportEndpoint="/api/agente/export-report"
          maxHeight={compact ? "200px" : "300px"}
          className={compact ? "text-xs" : "text-xs"}
          searchable={!compact || data.productos.length > 5}
        />
      </div>
    );
  }

  // Formato especial para movimientos de inventario
  if (data.type === 'movimientos' && Array.isArray(data.movimientos) && shouldRenderTable(data.movimientos)) {
    const columns = [
      { key: 'fecha', label: 'Fecha', sortable: true },
      { key: 'tipo_movimiento', label: 'Tipo', sortable: true },
      { key: 'producto_codigo', label: 'Código', sortable: true },
      { key: 'producto_nombre', label: 'Producto', sortable: true },
      { key: 'cantidad', label: 'Cantidad', sortable: true, formatter: (value: any, row: any) => <span className={row.tipo_movimiento === 'SALIDA' ? 'text-red-600' : 'text-green-600'}>{row.tipo_movimiento === 'SALIDA' ? '-' : '+'}{value}</span> },
      { key: 'observaciones', label: 'Observaciones', sortable: false }
    ];

    return (
      <div className="mt-2">
        <ReportTable
          title="Movimientos de Inventario"
          data={data.movimientos}
          columns={columns}
          exportEndpoint="/api/agente/export-report"
          maxHeight={compact ? "200px" : "300px"}
          className={compact ? "text-xs" : "text-xs"}
          searchable={!compact || data.movimientos.length > 5}
        />
      </div>
    );
  }

  // Formato especial para ventas
  if (data.type === 'ventas' && Array.isArray(data.ventas) && shouldRenderTable(data.ventas)) {
    const columns = [
      { key: 'numero', label: 'Número', sortable: true },
      { key: 'fecha_venta', label: 'Fecha', sortable: true },
      { key: 'cliente_nombre', label: 'Cliente', sortable: true },
      { key: 'total', label: 'Total', sortable: true, formatter: (value: any) => <span className="font-semibold">Bs. {parseFloat(value).toFixed(2)}</span> },
      { key: 'estado', label: 'Estado', sortable: true, formatter: (value: any) => <span className={`px-2 py-1 rounded text-xs ${value === 'COMPLETADA' ? 'bg-green-100 text-green-800' : value === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>{value}</span> }
    ];

    return (
      <div className="mt-2">
        <ReportTable
          title="Ventas"
          data={data.ventas}
          columns={columns}
          exportEndpoint="/api/agente/export-report"
          maxHeight={compact ? "200px" : "300px"}
          className={compact ? "text-xs" : "text-xs"}
          searchable={!compact || data.ventas.length > 5}
        />
      </div>
    );
  }

  // Array de objetos - mostrar como tabla simple SOLO si tiene suficientes datos
  if (Array.isArray(data) && shouldRenderTable(data, 2) && typeof data[0] === 'object') {
    // Generar columnas automáticamente basado en las claves del primer objeto
    const columns = Object.keys(data[0]).map(key => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
      sortable: true
    }));

    return (
      <div className="mt-2">
        <ReportTable
          title="Datos"
          data={data}
          columns={columns}
          exportEndpoint="/api/agente/export-report"
          maxHeight={compact ? "200px" : "300px"}
          className={compact ? "text-xs" : "text-xs"}
          searchable={!compact || data.length > 5}
        />
      </div>
    );
  }

  // Array simple
  if (Array.isArray(data)) {
    return (
      <div className="mt-2 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="bg-muted/50 rounded-lg p-3 text-sm">
            {typeof item === 'object' ? (
              <div className="space-y-1">
                {Object.entries(item).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="font-medium capitalize">{key.replace('_', ' ')}:</span>
                    <span>{String(value)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span>{String(item)}</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Objeto simple
  if (typeof data === 'object') {
    return (
      <div className="mt-2 bg-muted/50 rounded-lg p-3 text-sm space-y-1">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="font-medium capitalize">{key.replace('_', ' ')}:</span>
            <span>{String(value)}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
}