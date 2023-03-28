import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
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
  @ViewChild("fileRef") fileRef!: ElementRef;
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
    this.spinner.show();
    this.matTable.displayedColumns = this.header = this.getHeaders;
    this.initialSetup();
  }
  ngAfterViewInit() {
    this.matTable.dataSource.paginator = this.paginator;
    this.matTable.dataSource.sort = this.sort;
  }
  // ========== generate template
  initialSetup() {
    this.manageGrantInfoService
      ?.getGrantName(3)
      .pipe(
        map((response: any) => {
          const grantArr: any[] = [];
          response?.data?.map((item: any) => grantArr.push(item?.grantName));
          return grantArr;
        })
      )
      .subscribe({
        next: (response: any) => {
          this.grantTypes = response;
          this.spinner.hide();
        },
      });
  }
  get getHeaders() {
    return [
      "slNo",
      "UDISE code",
      "Grant fund name",
      "Grant amount",
      "Letter No / Ref. No",
      "Date of payment",
    ];
  }
  generateExcel() {
    this.spinner.show();
    this.excelService.generateExcel(
      {
        grantTypes: this.grantTypes,
      },
      this.header
    );
    setTimeout(() => {
      this.spinner.hide();
    }, 1200);
  }
  // end
  // read frome excel
  onFileUpload(event: any) {
    
    if (event?.target?.files[0]) {
      this.formData.set("uploadedDoc", event.target.files[0]);
      // const uploadedImage = event.target.files[0];
      this.spinner.show();
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
    }
  }
  prepareData() {
    if (this.validateData() === true) {
      //=== prepare data
      const dataArr: any = [];
      // console.log(this.excelData, "this.excelData");
      this.excelData.map((item: any, index: number) => {
        // skip header row
        if (index > 0 && item.length) {
          const dataObject: any = this.objectFormat;
          dataObject.udiseCode = item[1];
          dataObject.grantFundName = item[2];
          dataObject.grantAmount = item[3];
          dataObject.letterNoRefNo = item[4];
          dataObject.dateOfPayment =
            this.commonFunctionHelper.formatDateHelperExcel(item[5]);
          dataArr.push(dataObject);
        }
      });
      this.tableData.push(...dataArr);
      this.loadData();
    }
  }
  get objectFormat() {
    return {
      udiseCode: "",
      grantFundName: "",
      grantAmount: "",
      letterNoRefNo: "",
      dateOfPayment: "",
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
  resetTable() {
    this.fileRef.nativeElement.value = "";
    // reset
    this.tableData.length = 0;
    this.excelData.length = 0;
    this.loadData();
  }
  validateData() {
    const isSame =
      this.excelData[0].length == this.getHeaders.length &&
      this.getHeaders.every((element: any, index: any) => {
        return element === this.excelData[0][index];
      });
    if (isSame === false) {
      this.spinner.hide();
      this.alertHelper.viewAlert(
        "error",
        "",
        "Please don't change the template structure."
      );
      return false;
    }

    return true;
  }
}
