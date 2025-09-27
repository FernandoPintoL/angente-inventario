<?php

namespace App\Services;

use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Facades\Excel;

class ReportExportService
{
    public function exportToPdf(array $data, array $columns, string $title): string
    {
        $options = new Options();
        $options->set('defaultFont', 'Arial');
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isPhpEnabled', true);

        $dompdf = new Dompdf($options);

        $html = $this->generatePdfHtml($data, $columns, $title);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'landscape');
        $dompdf->render();

        return $dompdf->output();
    }

    public function exportToExcel(array $data, array $columns, string $title): string
    {
        // Usar PHPExcel en lugar de PhpSpreadsheet debido a la versión instalada
        $excel = new \PHPExcel();
        $sheet = $excel->getActiveSheet();

        // Configurar título
        $sheet->setTitle($title);

        // Encabezados
        $columnIndex = 0;
        foreach ($columns as $column) {
            $sheet->setCellValueByColumnAndRow($columnIndex, 1, $column['label']);
            $sheet->getStyleByColumnAndRow($columnIndex, 1)->getFont()->setBold(true);
            $sheet->getColumnDimensionByColumn($columnIndex)->setAutoSize(true);
            $columnIndex++;
        }

        // Datos
        $rowIndex = 2;
        foreach ($data as $row) {
            $columnIndex = 0;
            foreach ($columns as $column) {
                $value = $row[$column['key']] ?? '';

                // Formatear valores especiales
                if (is_numeric($value) && strpos($column['key'], 'precio') !== false) {
                    $value = number_format($value, 2);
                } elseif (is_bool($value)) {
                    $value = $value ? 'Sí' : 'No';
                } elseif (is_null($value)) {
                    $value = '-';
                }

                $sheet->setCellValueByColumnAndRow($columnIndex, $rowIndex, $value);
                $columnIndex++;
            }
            $rowIndex++;
        }

        // Crear el archivo Excel
        $writer = new \PHPExcel_Writer_Excel2007($excel);

        $tempFile = tempnam(sys_get_temp_dir(), 'excel_export_');
        $writer->save($tempFile);

        $content = file_get_contents($tempFile);
        unlink($tempFile);

        return $content;
    }

    private function generatePdfHtml(array $data, array $columns, string $title): string
    {
        $html = '<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>' . htmlspecialchars($title) . '</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    font-size: 12px;
                    margin: 20px;
                }
                h1 {
                    text-align: center;
                    color: #333;
                    margin-bottom: 30px;
                    font-size: 18px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                    font-size: 11px;
                }
                th {
                    background-color: #f5f5f5;
                    font-weight: bold;
                    color: #333;
                }
                tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
                .footer {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    font-size: 10px;
                    color: #666;
                }
                .meta {
                    text-align: center;
                    margin-bottom: 20px;
                    font-size: 10px;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <h1>' . htmlspecialchars($title) . '</h1>
            <div class="meta">
                Generado el: ' . now()->format('d/m/Y H:i:s') . ' | Total de registros: ' . count($data) . '
            </div>

            <table>
                <thead>
                    <tr>';

        foreach ($columns as $column) {
            $html .= '<th>' . htmlspecialchars($column['label']) . '</th>';
        }

        $html .= '</tr>
                </thead>
                <tbody>';

        foreach ($data as $row) {
            $html .= '<tr>';
            foreach ($columns as $column) {
                $value = $row[$column['key']] ?? '';

                // Formatear valores especiales
                if (is_numeric($value) && strpos($column['key'], 'precio') !== false) {
                    $value = number_format($value, 2);
                } elseif (is_bool($value)) {
                    $value = $value ? 'Sí' : 'No';
                } elseif (is_null($value)) {
                    $value = '-';
                }

                $html .= '<td>' . htmlspecialchars($value) . '</td>';
            }
            $html .= '</tr>';
        }

        $html .= '</tbody>
            </table>

            <div class="footer">
                Distribuidora Paucara - Sistema de Inventario
            </div>
        </body>
        </html>';

        return $html;
    }
}