import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { forkJoin, map } from "rxjs";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { ExcelService } from "../excel.service";
import { ManageGrantExpenditureService } from "../services/manage-grant-expenditure.service";
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
import { FormBuilder } from "@angular/forms";
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
  expenditureTypes!: any;
  bankData!: any;
  excelData: any = [];
  //=========== member declaration
  plPrivilege: string = "view"; //For menu privilege
  tabs: any = []; //For shwoing tabs
  config = new Constant();
  adminPrivilege: boolean = false;
  tableData:any=[];
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
    pageSize: 10,
    dataSource: new MatTableDataSource(this.tableData),
    selection: new SelectionModel(true, []),
  };

  constructor(
    private excelService: ExcelService,
    private manageGrantInfoService: ManageGrantInfoService,
    private manageGrantExpenditureService: ManageGrantExpenditureService,
    private formBuilder: FormBuilder,
    private commonFunctionHelper: CommonFunctionHelper,
    private commonService: CommonserviceService,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private spinner: NgxSpinnerService,
    private privilegeHelper: PrivilegeHelper, //For menu privilege,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.header = this.getHeaders;
    this.initialSetup();
    this.matTable.displayedColumns = [
      "select",
      "slNo",
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
      "Letter No / Ref. No	Amount",
    ];
  }
  ngAfterViewInit() {
    this.matTable.dataSource.paginator = this.paginator;
    this.matTable.dataSource.sort = this.sort;
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

  // read frome excel
  onFileUpload(event: any) {
    this.tableData.length=0;
    this.loadData();
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

      this.prepareData(); // load table after read complete
    };
    reader.readAsBinaryString(target.files[0]);
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
  }
  // Material table pagination size options :: Sambit Kumar Dalai:: 10-11-2022
  get getPageSizeOptions(): number[] {
    return this.matTable.dataSource?.paginator &&
      this.matTable.dataSource?.paginator?.length > 200
      ? [10, 30, 50, 100, this.matTable.dataSource.paginator.length]
      : [10, 30, 50, 100, 200];
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.matTable.selection.clear()
      : this.matTable.dataSource.data.forEach((row: any) =>
          this.matTable.selection.select(row)
        );
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.matTable.selection.selected.length;
    let numRows;
    // 1) if in first page then compare with selected record and min of (total record and page size)
    numRows = Math.min(
      this.matTable.dataSource.data.length,
      this.matTable?.pageSize
    );

    return (
      numSelected === numRows ||
      numSelected === this.matTable.dataSource.data.length
    );
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
    console.log(this.matTable.dataSource);
    
  }

  prepareData() {
    //=== prepare data
    const dataArr: any = [];
    this.excelData.map((item: any, index: number) => {
      // skip header row
      if (index > 0) {
        const dataObject = this.objectFormat;
        dataObject.slNo = item[0];
        dataObject.district = item[1];
        dataObject.block = item[2];
        dataObject.school = item[3];
        dataObject.schoolType = item[4];
        dataObject.grantType = item[5];
        dataObject.expenditureType = item[6];
        dataObject.bankName = item[7];
        dataObject.otherBankName = item[8];
        dataObject.bankAcc = item[9];
        dataObject.ifsc = item[10];
        dataObject.grantReceiveFrom = item[11];
        dataObject.receiveDate = item[12];
        dataObject.amount = item[13];
        dataArr.push(dataObject);
      }
    });
    this.tableData.push(...dataArr); 
    this.loadData();
    
  }
  get objectFormat() {
    return {
      slNo: "",
      district: "",
      block: "",
      school: "",
      schoolType: "",
      grantType: "",
      expenditureType: "",
      bankName: "",
      otherBankName: "",
      bankAcc: "",
      ifsc: "",
      grantReceiveFrom: "",
      receiveDate: "",
      amount: "",
    };
  }
}
