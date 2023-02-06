import { Component, OnInit } from "@angular/core";
import { ExcelService } from "./excel.service";
import { ManageGrantInfoService } from "./services/manage-grant-info.service";
import { ManageGrantExpenditureService } from "./services/manage-grant-expenditure.service";
import { forkJoin, map } from "rxjs";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
@Component({
  selector: "app-grant-fund",
  templateUrl: "./grant-fund.component.html",
  styleUrls: ["./grant-fund.component.css"],
})
export class GrantFundComponent implements OnInit {
  name = "Angular";
  list!: any;
  header!: Array<String>;
  grantTypes!: any;
  expenditureTypes!: any;
  bankData!: any;

  constructor(
    private excelService: ExcelService,
    private manageGrantInfoService: ManageGrantInfoService,
    private manageGrantExpenditureService: ManageGrantExpenditureService,
    private commonService: CommonserviceService
  ) {}

  ngOnInit() {
    this.header = this.headers;
    this.initialSetup();
  }
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
  get headers() {
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
}
