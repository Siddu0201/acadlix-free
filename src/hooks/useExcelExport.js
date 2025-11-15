import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const useExcelExport = (
    defaultColumns = [],
    defaultData = [],
    defaultOptions = {}
) => {

    const exportExcel = async (fileName = "export.xlsx", override = {}) => {
        const workbook = new ExcelJS.Workbook();

        const options = {
            getCellStyle: () => ({}),
            sheets: null,
            ...defaultOptions,
            ...override.options,
        };

        /** Multi-sheet mode */
        if (options.sheets) {
            for (const sheet of options.sheets) {
                createSheet({
                    workbook,
                    sheetName: sheet.sheetName || "Sheet",
                    columns: sheet.columns || [],
                    data: sheet.data || [],
                    getCellStyle: sheet.getCellStyle || options.getCellStyle,
                    filters: sheet.filters || [],
                });
            }
        } else {
            /** Single-sheet fallback */
            createSheet({
                workbook,
                sheetName: options.sheetName || "Report",
                columns: override.columns || defaultColumns,
                data: override.data || defaultData,
                getCellStyle: options.getCellStyle,
                filters: options.filters || [],
            });
        }

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(
            new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }),
            fileName
        );
    };


    return exportExcel;
};


function createSheet({
    workbook,
    sheetName,
    columns,
    data,
    getCellStyle,
    filters,
}) {
    const ws = workbook.addWorksheet(sheetName);

    let rowPointer = 1;

    /** Set columns & create header */
    ws.columns = columns.map(col => ({
        header: col.header,
        key: col.key,
        width: col.width || 20,
    }));

    /** STYLE HEADER ROW */
    const headerRow = ws.getRow(rowPointer);
    headerRow.eachCell(cell => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: "center" };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFEFEFEF" },
        };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };
    });

    /** Add data rows */
    data.forEach(item => ws.addRow(item));

    /** Style data rows */
    ws.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header

        row.eachCell((cell, colNumber) => {
            const col = columns[colNumber - 1];
            const style = getCellStyle({
                col,
                value: cell.value,
                rowNumber,
                colNumber,
                cell,
            });

            if (style.font) cell.font = style.font;
            if (style.fill) cell.fill = style.fill;
            if (style.alignment) cell.alignment = style.alignment;
            if (style.border) cell.border = style.border;
        });
    });

    /** Apply filter ONLY for specific columns */
    if (filters && Array.isArray(filters) && filters.length > 0) {
        const colIndexes = filters
            .map(key => columns.findIndex(c => c.key === key) + 1)
            .filter(i => i > 0);

        if (colIndexes.length > 0) {
            ws.autoFilter = {
                from: { row: 1, column: Math.min(...colIndexes) },
                to: { row: 1, column: Math.max(...colIndexes) },
            };
        }
    }

    /** Freeze header */
    ws.views = [{ state: "frozen", ySplit: 1 }];

}
