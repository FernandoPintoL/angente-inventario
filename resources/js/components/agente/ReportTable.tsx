import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  DownloadIcon,
  FileTextIcon,
  FileSpreadsheetIcon,
  Loader2Icon,
  SearchIcon,
  SortAscIcon,
  SortDescIcon,
  EyeIcon
} from 'lucide-react';

interface ReportColumn {
  key: string;
  label: string;
  sortable?: boolean;
  formatter?: (value: any, row: any) => React.ReactNode;
  width?: string;
}

interface ReportTableProps {
  title: string;
  data: any[];
  columns: ReportColumn[];
  className?: string;
  exportEndpoint?: string;
  searchable?: boolean;
  showExportOptions?: boolean;
  maxHeight?: string;
  onRowClick?: (row: any) => void;
}

type SortDirection = 'asc' | 'desc' | null;

export function ReportTable({
  title,
  data,
  columns,
  className,
  exportEndpoint,
  searchable = true,
  showExportOptions = true,
  maxHeight = '400px',
  onRowClick
}: ReportTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [exportLoading, setExportLoading] = useState<'pdf' | 'excel' | null>(null);

  // Filtrar datos basado en búsqueda
  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data;

    return data.filter(row =>
      columns.some(column => {
        const value = row[column.key];
        if (value == null) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns]);

  // Ordenar datos
  const sortedData = React.useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortDirection === 'asc' ? -1 : 1;
      if (bValue == null) return sortDirection === 'asc' ? 1 : -1;

      // Intentar conversión numérica
      const aNum = Number(aValue);
      const bNum = Number(bValue);

      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
      }

      // Comparación de strings
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }, [filteredData, sortColumn, sortDirection]);

  const handleSort = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    if (sortColumn === columnKey) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortColumn(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    if (!exportEndpoint) return;

    setExportLoading(format);

    try {
      const payload = {
        format,
        title,
        data: sortedData,
        columns: columns.map(col => ({
          key: col.key,
          label: col.label
        }))
      };

      const queryParams = new URLSearchParams({
        search: searchTerm,
        sort_column: sortColumn || '',
        sort_direction: sortDirection || ''
      });

      const response = await fetch(`${exportEndpoint}?${queryParams}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Error al exportar');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const extension = format === 'pdf' ? 'pdf' : 'xlsx';
      a.download = `${title.toLowerCase().replace(/\s+/g, '_')}_${timestamp}.${extension}`;

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exportando:', error);
      alert('Error al exportar el reporte');
    } finally {
      setExportLoading(null);
    }
  };

  const getSortIcon = (columnKey: string) => {
    if (sortColumn !== columnKey) return null;
    return sortDirection === 'asc' ?
      <SortAscIcon className="size-4 ml-1" /> :
      <SortDescIcon className="size-4 ml-1" />;
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        {/* Título */}
        <div className="flex items-center gap-2 mb-3">
          <EyeIcon className="size-5 text-primary" />
          <CardTitle className="text-base">{title}</CardTitle>
        </div>

        {/* Controles responsivos */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Buscador */}
          {searchable && (
            <div className="relative flex-1 max-w-sm">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring w-full"
              />
            </div>
          )}

          {/* Botones de exportación */}
          {showExportOptions && exportEndpoint && (
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('pdf')}
                disabled={exportLoading !== null || data.length === 0}
                className="flex items-center gap-1.5 text-xs px-3"
              >
                {exportLoading === 'pdf' ? (
                  <Loader2Icon className="size-3 animate-spin" />
                ) : (
                  <FileTextIcon className="size-3" />
                )}
                <span className="hidden sm:inline">PDF</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('excel')}
                disabled={exportLoading !== null || data.length === 0}
                className="flex items-center gap-1.5 text-xs px-3"
              >
                {exportLoading === 'excel' ? (
                  <Loader2Icon className="size-3 animate-spin" />
                ) : (
                  <FileSpreadsheetIcon className="size-3" />
                )}
                <span className="hidden sm:inline">Excel</span>
              </Button>
            </div>
          )}
        </div>

        {data.length > 0 && (
          <div className="text-xs text-muted-foreground mt-2 sm:mt-3">
            Mostrando {sortedData.length} de {data.length} registros
            {searchTerm && (
              <span className="block sm:inline sm:ml-1">
                (filtrado por "{searchTerm}")
              </span>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center p-6">
            <DownloadIcon className="size-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No hay datos para mostrar</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <div
              className="overflow-auto"
              style={{ maxHeight }}
            >
              <table className="w-full">
                <thead className="bg-muted/50 sticky top-0 z-10">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        className={cn(
                          "px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground border-b",
                          column.sortable && "cursor-pointer hover:text-foreground transition-colors",
                          column.width && `w-[${column.width}]`
                        )}
                        onClick={() => column.sortable && handleSort(column.key)}
                      >
                        <div className="flex items-center">
                          <span className="truncate">{column.label}</span>
                          {column.sortable && getSortIcon(column.key)}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((row, index) => (
                    <tr
                      key={row.id || index}
                      className={cn(
                        "border-b hover:bg-muted/30 transition-colors",
                        onRowClick && "cursor-pointer"
                      )}
                      onClick={() => onRowClick?.(row)}
                    >
                      {columns.map((column) => (
                        <td key={column.key} className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                          <div className="truncate max-w-[120px] sm:max-w-none">
                            {column.formatter
                              ? column.formatter(row[column.key], row)
                              : row[column.key] ?? '-'
                            }
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}