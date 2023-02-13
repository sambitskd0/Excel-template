import { Component, OnInit } from "@angular/core";
import { forkJoin, map } from "rxjs";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { ExcelService } from "../excel.service";
import { ManageGrantExpenditureService } from "../services/manage-grant-expenditure.service";
import { ManageGrantInfoService } from "../services/manage-grant-info.service";
import * as XLSX from "xlsx";

@Component({
  selector: "app-template",
  templateUrl: "./template.component.html",
  styleUrls: ["./template.component.css"],
})
export class TemplateComponent implements OnInit {
  name = "Angular";
  list!: any;
  header!: Array<String>;
  grantTypes!: any;
  expenditureTypes!: any;
  bankData!: any;
  excelData!: any;
  constructor(
    private excelService: ExcelService,
    private manageGrantInfoService: ManageGrantInfoService,
    private manageGrantExpenditureService: ManageGrantExpenditureService,
    private commonService: CommonserviceService
  ) {}

  ngOnInit(): void {
    this.header = this.getHeaders;
    this.initialSetup();
  }

  // ========== generate template
  initialSetup() {
    forkJoin({
      grantResponse: this.manageGrantInfoService?.getGrantName(3),
      expenditureResponse:
        this.manageGrantExpenditureService?.grantExpenditureType(),
      annextureResponse: this.commonService.getCommonAnnexture(["BANK"], true),
    })
      .pipe(
        map((response: any) => {
          const grantArr: any[] = [];
          const expenditureArr: any[] = [];
          const bankArr: any[] = [];
          response.grantResponse?.data?.map((item: any) =>
            grantArr.push(item?.grantName)
          );
          response.expenditureResponse?.data?.map((item: any) =>
            expenditureArr.push(item?.expenditureName)
          );
          response.annextureResponse?.data?.BANK?.map((item: any) =>
            bankArr.push(item?.anxtName)
          );
          return {
            grantArr,
            expenditureArr,
            bankArr,
          };
        })
      )
      .subscribe({
        next: (response: any) => {
          this.grantTypes = response?.grantArr;
          this.expenditureTypes = response?.expenditureArr;
          this.bankData = response?.bankArr;
        },
      });
  }
  get getHeaders() {
    return [
      "Sl#",
      "Disctrict",
      "Block",
      "School",
      "School type",
      "Grant type",
      "Expenditure type",
      "Bank name",
      "Othe Bank Name",
      "Bank acc",
      "Bank ifsc",
      "Grant receive from",
      "Receive date",
      "Letter No / Ref. No",
      "Amount",
    ];
  }
  generateExcel() {
    this.excelService.generateExcel(
      {
        grantTypes: this.grantTypes,
        expenditureTypes: this.expenditureTypes,
        bankData: this.bankData,
      },
      this.header
    );
  }
  // end
  onFileUpload(event: any) {


    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) throw new Error("Cannot use multiple files");

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.excelData = XLSX.utils.sheet_to_json(ws, { header: 1 });
    };
    reader.readAsBinaryString(target.files[0]);



  }
}
