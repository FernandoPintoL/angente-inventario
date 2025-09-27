import React from 'react';
import { ReportTable } from './ReportTable';

interface DataFormatterProps {
  data: any;
}

export function DataFormatter({ data }: DataFormatterProps) {
  if (!data) return null;

  // Verificar si es un reporte con datos y columnas para mostrar tabla
  if (data.type === 'report' && data.data && data.columns) {
    return (
      <div className="mt-2">
        <ReportTable
          title={data.title || 'Reporte'}
          data={data.data}
          columns={data.columns}
          exportEndpoint="/api/agente/export-report"
          maxHeight="300px"
          className="text-xs"
        />
      </div>
    );
  }

  // Formato especial para productos con stock
  if (data.type === 'productos_stock' && Array.isArray(data.productos)) {
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
          maxHeight="300px"
          className="text-xs"
        />
      </div>
    );
  }

  // Formato especial para movimientos de inventario
  if (data.type === 'movimientos' && Array.isArray(data.movimientos)) {
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
          maxHeight="300px"
          className="text-xs"
        />
      </div>
    );
  }

  // Formato especial para ventas
  if (data.type === 'ventas' && Array.isArray(data.ventas)) {
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
          maxHeight="300px"
          className="text-xs"
        />
      </div>
    );
  }

  // Array de objetos - mostrar como tabla simple
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
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
          maxHeight="300px"
          className="text-xs"
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