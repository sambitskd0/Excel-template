import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { forkJoin, map } from "rxjs";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { ExcelService } from "../excel.service";
import { ManageGrantInfoService } from "../services/manage-grant-info.service";
import * as XLSX from "xlsx";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { NgxSpinnerService } from "ngx-spinner";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { Router } from "@angular/router";
import { Constant } from "src/app/shared/constants/constant";
import { SelectionModel } from "@angular/cdk/collections";
@Component({
  selector: "app-template",
  templateUrl: "./template.component.html",
  styleUrls: ["./template.component.css"],
})
export class TemplateComponent implements OnInit {
  list!: any;
  header!: Array<String>;
  grantTypes!: any;
  bankData!: any;
  excelData: any = [];
  //=========== member declaration
  plPrivilege: string = "view"; //For menu privilege
  tabs: any = []; //For shwoing tabs
  config = new Constant();
  adminPrivilege: boolean = false;
  tableData: any = [];
  grantReceiveFrom: any = [];
  formData = new FormData();

  // mat table
  @Input() mode!: ProgressBarMode;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter!: MatTableExporterDirective;

  matTable: any = {
    offset: 0,
    displayedColumns: [], // define mat table columns
    questionBankData: [],
    previousSize: 0,
    pageIndex: 0,
    isLoading: false,
    isNorecordFound: false,
    isSearched: false,
    totalRows: 0,
    currentPage: 0,
    pageSize: 1000,
    dataSource: new MatTableDataSource(this.tableData),
    selection: new SelectionModel(true, []),
  };

  constructor(
    private excelService: ExcelService,
    private manageGrantInfoService: ManageGrantInfoService,
    private commonFunctionHelper: CommonFunctionHelper,
    private commonService: CommonserviceService,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private spinner: NgxSpinnerService,
    private privilegeHelper: PrivilegeHelper, //For menu privilege,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.matTable.displayedColumns = this.header = this.getHeaders;
    this.initialSetup();
  }
  ngAfterViewInit() {
    this.matTable.dataSource.paginator = this.paginator;
    this.matTable.dataSource.sort = this.sort;
  }
  // ========== generate template
  initialSetup() {
    forkJoin({
      grantResponse: this.manageGrantInfoService?.getGrantName(3),
      annextureResponse: this.commonService.getCommonAnnexture(
        ["BANK", "Grant_Recieve_From_Type"],
        true
      ),
    })
      .pipe(
        map((response: any) => {
          const grantArr: any[] = [];
          const receiveFromArr: any[] = [];
          const bankArr: any[] = [];
          response.grantResponse?.data?.map((item: any) =>
            grantArr.push(item?.grantName)
          );
          response.annextureResponse?.data?.BANK?.map((item: any) =>
            bankArr.push(item?.anxtName)
          );
          response.annextureResponse?.data?.Grant_Recieve_From_Type?.map(
            (item: any) => receiveFromArr.push(item?.anxtName)
          );
          return {
            grantArr,
            receiveFromArr,
            bankArr,
          };
        })
      )
      .subscribe({
        next: (response: any) => {
          this.grantTypes = response?.grantArr;
          this.bankData = response?.bankArr;
          this.grantReceiveFrom = response?.receiveFromArr;
        },
      });
  }
  get getHeaders() {
    return [
      "slNo",
      "UDISE code",
      "School Name",
      "Unique Agency Name",
      "Bank Name",
      "Bank Account Number",
      "IFSC",
      "Grant Fund Name",
      "Amount",
      "Letter No / Ref. No",
    ];
  }
  generateExcel() {
    this.excelService.generateExcel(
      {
        grantTypes: this.grantTypes,
        bankData: this.bankData,
        grantReceiveFrom: this.grantReceiveFrom,
      },
      this.header
    );
  }
  // end

  // read frome excel
  onFileUpload(event: any) {
    if (event?.target?.files[0]) {
      this.formData.set("uploadedDoc", event.target.files[0]);
      // const uploadedImage = event.target.files[0];
      this.spinner.show();

      // reset
      this.tableData.length = 0;
      this.excelData.length = 0;
      this.loadData();
      // end

      /* wire up file reader */
      const target: DataTransfer = <DataTransfer>event.target;
      if (target.files.length !== 1)
        throw new Error("Cannot use multiple files");

      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, {
          type: "binary",
          cellDates: true,
          cellNF: false,
          cellText: false,
        });
        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        /* save data */
        this.excelData = XLSX.utils.sheet_to_json(ws, { header: 1 });

        this.prepareData(); // load table after read complete
      };
      reader.readAsBinaryString(target.files[0]);
    } else {
    }
  }

  prepareData() {
    console.log(this.excelData);

    //=== prepare data
    const dataArr: any = [];
    this.excelData.map((item: any, index: number) => {
      // skip header row
      if (index > 0) {
        const dataObject = this.objectFormat;
        dataObject.udiseCode = item[1];
        dataObject.schoolName = item[2];
        dataObject.agencyName = item[3];
        dataObject.bankName = item[4];
        dataObject.bankAcc = item[5];
        dataObject.ifsc = item[6];
        dataObject.grantFundName = item[7];
        dataObject.amount = item[8];
        dataObject.letterNo = item[9];
        dataArr.push(dataObject);
      }
    });
    this.tableData.push(...dataArr);
    this.loadData();
  }
  get objectFormat() {
    return {
      udiseCode: "",
      schoolName: "",
      agencyName: "",
      bankName: "",
      bankAcc: "",
      ifsc: "",
      grantFundName: "",
      amount: "",
      letterNo: "",
    };
  }
  onPageChange(event: any) {
    this.matTable.isLoading = true;
    // event: PageEvent
    this.matTable.pageSize = event.pageSize; // current page size ex: 10
    /**
     * pageIndex starts from 0
     * ex: if pageIndex = 0 then offset = 0 * 10 = 0 and if pageIndex =1 then 1*10 = 10
     */
    this.matTable.offset = event.pageIndex * event.pageSize;
    this.matTable.previousSize = this.matTable.pageSize * event.pageIndex; // set previous size
    this.matTable.pageIndex = event.pageIndex;
    this.matTable.isLoading = false;
  }
  // Material table pagination size options :: Sambit Kumar Dalai:: 10-11-2022
  get getPageSizeOptions(): number[] {
    return this.matTable.dataSource?.paginator &&
      this.matTable.dataSource?.paginator?.length > 200
      ? [10, 30, 50, 100, this.matTable.dataSource.paginator.length]
      : [10, 30, 50, 100, 200];
  }
  loadData() {
    this.matTable.pageIndex = 0;
    this.matTable.previousSize = 0;
    this.matTable.offset = 0;
    this.matTable.isSearched = true;
    this.paginator.pageIndex = 0; // go to first page on every search

    this.matTable.dataSource.paginator = this.paginator; // update paginator
    this.matTable.dataSource._updateChangeSubscription(); // update table
    this.matTable.isLoading = false;
    this.spinner.hide();
    this.matTable.isNorecordFound = this.excelData.length ? false : true;
  }

  onSubmit() {
    this.formData.set(
      "userDetails",
      JSON.stringify(this.commonService.getUserProfile())
    );
    this.formData.set("excelData", JSON.stringify(this.tableData));

    this.alertHelper.submitAlert().then((result: any) => {
      if (result.value) {
        this.spinner.show();

        this.excelService.bulkUpload(this.formData).subscribe({
          next: (response: any) => {
            this.tableData.length = 0;
            this.tableData.push(...response?.data);
            this.loadData();
          },
          complete: () => {
            this.spinner.hide();
          },
        });
      }
    });
  }
  getColorStatus(item: any): string {
    return "invalid" in item === true
      ? item.invalid === true
        ? "rgb(255 175 175)"
        : "rgb(167 255 167)"
      : "";
  }
}
