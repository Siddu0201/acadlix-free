import ExcelJS from "exceljs";
import { Buffer } from "buffer";

export const useExcelImport = (defaultColumns = []) => {
  const importData = async (file, options = {}) => {
    if (!file) return [];

    const workbook = new ExcelJS.Workbook();
    const extension = file.name.split('.').pop().toLowerCase();
    const columns = options.columns || defaultColumns;

    try {
      let worksheet;

      if (extension === 'xlsx') {
        const buffer = await file.arrayBuffer();
        await workbook.xlsx.load(buffer);
        worksheet = workbook.getWorksheet(1);
      } else {
        throw new Error("Unsupported format");
      }
      // console.log(worksheet);
      return parseWorksheet(worksheet, columns);
    } catch (error) {
      console.error("Import Error:", error);
      throw error;
    }
  };

  return importData;
};

/** Helper to map cells to keys */
function parseWorksheet(worksheet, columnConfig) {
  const data = [];
  const headerRow = worksheet.getRow(1);
  const colMapping = {};

  // Map columns based on Header names
  columnConfig.forEach(config => {
    headerRow.eachCell((cell, colNumber) => {
      if (cell.value?.toString().trim().toLowerCase() === config.header.toLowerCase()) {
        colMapping[config.key] = colNumber;
      }
    });
  });

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    const rowData = {};
    columnConfig.forEach(config => {
      const colIndex = colMapping[config.key];
      const cell = colIndex ? row.getCell(colIndex) : null;

      // Extract the actual value (handling formulas/objects)
      let value = cell?.value;
      if (value && typeof value === 'object') {
        value = value.result ?? value.text ?? JSON.stringify(value);
      }

      rowData[config.key] = value;
    });
    data.push(rowData);
  });

  return data;
}