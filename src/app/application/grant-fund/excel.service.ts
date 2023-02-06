import { Injectable } from "@angular/core";
import fileSaver from "file-saver";
import { Workbook } from "exceljs";

@Injectable({
  providedIn: "root",
})
export class ExcelService {
  workbook = new Workbook();
  worksheet = this.workbook.addWorksheet("Template"); // sheet tab name
  rowData!: any;
  async generateExcel(params: any, header: any) {
    this.rowDataSetup(header); // header and row setup
    this.columnHeaderWidthHandler(); // column header width
    this.dataValidationHandler({
      F: params.grantTypes?.toString(),
      G: params.expenditureTypes?.toString(),
      H: params.bankData?.toString(),
    }); // setup drop down
    this.generateExcelFile(); //Generate Excel File with given name
  }

  async rowDataSetup(header: any) {
    const totalRow = 100;
    this.rowData = new Array(totalRow).fill(''); // 100 row of empty cells
    //Create workbook and worksheet
    let headerRow = this.worksheet.addRow(header); //Add Header Row
    this.rowData.forEach((d: any) => this.worksheet.addRow(d)); // add empty rows
    //end

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" },
        bgColor: { argb: "FF0000FF" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  }
  // Header width
  async columnHeaderWidthHandler() {
    this.worksheet.columns.forEach(function (column: any, i: any) {
      let maxLength = 0;
      column["eachCell"](
        { includeEmpty: true },
        function (cell: {
          value: { toString: () => { (): any; new (): any; length: any } };
        }) {
          let columnLength = cell.value ? cell.value.toString().length + 2 : 10;
          maxLength = Math.max(columnLength, maxLength);
        }
      );
      column.width = maxLength < 10 ? 10 : maxLength;
    });
  }

  // data validation
  async dataValidationHandler(dataObject: any) {
    for (const prop in dataObject) {
      this.worksheet
        .getColumn(prop)
        .eachCell({ includeEmpty: true }, (cell, rowNumber) => {
          if (rowNumber != 1) {
            cell.dataValidation = {
              type: "list",
              allowBlank: true,
              formulae: ['"' + dataObject[prop] + '"'],
            };
          }
        });
    }
  }

  // Generate Excel File with given name
  async generateExcelFile() {
    this.workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      fileSaver.saveAs(blob, "Grant Fund Template.xlsx");
    });
  }
}
