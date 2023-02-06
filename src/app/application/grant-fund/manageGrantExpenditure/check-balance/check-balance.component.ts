import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatTableExporterDirective } from "mat-table-exporter";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { Constant } from "src/app/shared/constants/constant";
import { environment } from "src/environments/environment";
import { ManageGrantExpenditureService } from "../../services/manage-grant-expenditure.service";

@Component({
  selector: "app-check-balance",
  templateUrl: "./check-balance.component.html",
  styleUrls: ["./check-balance.component.css"],
})
export class CheckBalanceComponent implements OnInit {
  paramObj: any;
  serviceType: string = "Search";
  public fileUrl = environment.filePath;
  public show: boolean = true;
  public buttonName: any = "Show";
  @ViewChild("searchForm") searchForm!: NgForm;
  public userProfile = JSON.parse(
    sessionStorage.getItem("userProfile") || "{}"
  );
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();
  searchAcademicYear: any = "";
  searchDistrictId: any = "";
  searchBlockId: any = "";
  searchClusterId: any = "";
  searchSchoolId: any = "";
  grantType: any = "";
  expenditureType: any = "";
  expenditureDate: any = "";
  fileDownloadUrl: any = "";

  recTotal: any =0;
  expTotal: any = 0;
  remaining: any = 0;


  scDisrtictSelect: boolean = true;
  scDisrtictLoading: boolean = false;
  scBlockSelect: boolean = true;
  scBlockLoading: boolean = false;
  scClusterSelect: boolean = true;
  scClusterLoading: boolean = false;
  scSchoolSelect: boolean = true;
  scSchoolLoading: boolean = false;
  grantTypeLoading: boolean = false;

  searchDistrictData: any = [];
  searchBlockData: any = [];

  districtData: any = [];
  clusterData: any = [];
  getSchoolData: any = [];
  grantBalanceData: any = [];
  grantTypeData: any = [];
  grantRcv: any = [];
  grantExp: any = [];
  isInitAdmin: boolean = false;
  userId: any = "";
  schoolId: any = "";
  grantNameForModal: any = "";
  // ===============Material Table Variable and Decorators
  isLoading = false;
  isNorecordFound: boolean = false;
  pageIndex: any = 0;
  previousSize: any = 0;
  // mat table
  @Input() mode!: ProgressBarMode;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter!: MatTableExporterDirective;
  pageSize = 10;
  offset = 0;
  currentPage = 0;
  totalRows = 0;
  pageSizeOptions: number[] = [10, 25, 100];
  // start define mat table reference columns
  displayedColumns: string[] = [
    "slNo",
    "Grant_Type",
    "receive",
    "expense",
    "balance",
    "action",
  ]; // end define mat table columns

  resultListData: any = [];
  dataSource = new MatTableDataSource(this.resultListData);
  constructor(
    private commonService: CommonserviceService,
    private spinner: NgxSpinnerService,
    private alertHelper: AlertHelper,
    public manageGrantExpenditureService: ManageGrantExpenditureService
  ) {}

  ngOnInit(): void {
    this.getDistrict();
    this.searchAcademicYear = this.academicYear;
    const userProfile = this.commonService.getUserProfile();
    this.userId = userProfile?.userId;
    this.schoolId = userProfile?.school;
    if (userProfile.loginUserTypeId == 2) {
      this.getGrantType(0, this.schoolId);
      this.viewCheckBalance(this.getSearchParams());
      this.spinner.hide();
    } else {
      this.isInitAdmin = true;
      this.spinner.hide();
    }
  }
  getGrantType(schoolNormalId: any, schoolEncId: any) {
    this.grantTypeLoading = true;
    this.manageGrantExpenditureService
      .getGrantType(schoolNormalId, schoolEncId)
      .subscribe((res: any) => {
        this.grantTypeData = res;
        this.grantTypeData = this.grantTypeData.data;
        this.grantTypeLoading = false;
      });
  }
  validateForm(): Boolean {
    if (this.searchDistrictId === "") {
      this.alertHelper.successAlert("", "Please select District.", "info");
      return false;
    }
    if (this.searchBlockId === "") {
      this.alertHelper.successAlert("", "Please select Block.", "info");
      return false;
    }
    if (this.searchClusterId === "") {
      this.alertHelper.successAlert("", "Please select Cluster.", "info");
      return false;
    }
    if (this.searchSchoolId === "") {
      this.alertHelper.successAlert("", "Please select School.", "info");
      return false;
    }
    return true;
  }
  getDistrict() {
    this.scDisrtictSelect = false;
    this.scDisrtictLoading = true;
    this.commonService.getAllDistrict().subscribe((data: any) => {
      this.districtData = data;
      this.districtData = this.districtData.data;

      if (this.userProfile.district != 0 || this.userProfile.district != "") {
        this.searchDistrictData = this.districtData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        this.searchForm.controls["searchDistrictId"]?.patchValue(
          this.userProfile.district
        );
        this.getBlock(this.userProfile.district);
      } else {
        this.searchDistrictData = this.districtData;
        this.scDisrtictSelect = true;
      }

      this.searchBlockId = "";
      this.scDisrtictLoading = false;
    });
  }
  getBlock(districtId: any) {
    this.scBlockSelect = false;
    this.scBlockLoading = true;

    this.searchBlockData = [];
    this.searchForm.controls["searchBlockId"]?.patchValue("");

    this.clusterData = [];
    this.searchForm.controls["searchClusterId"]?.patchValue("");

    this.getSchoolData = [];
    this.searchForm.controls["searchSchoolId"]?.patchValue("");

    if (districtId !== "") {
      this.commonService
        .getBlockByDistrictid(districtId)
        .subscribe((res: any) => {
          this.searchBlockData = res;
          this.searchBlockData = this.searchBlockData.data;

          if (this.userProfile.block != 0 || this.userProfile.block != "") {
            this.searchBlockData = this.searchBlockData.filter((blo: any) => {
              return blo.blockId == this.userProfile.block;
            });
            this.searchForm.controls["searchBlockId"]?.patchValue(
              this.userProfile.block
            );
            this.getCluster(this.userProfile.block);
          } else {
            this.scBlockSelect = true;
          }
          this.scBlockLoading = false;
        });
    } else {
      this.scBlockSelect = true;
      this.scBlockLoading = false;
    }
  }
  getCluster(blockId: any) {
    this.scClusterSelect = false;
    this.scClusterLoading = true;

    this.clusterData = [];
    this.searchForm.controls["searchClusterId"]?.patchValue("");

    this.getSchoolData = [];
    this.searchForm.controls["searchSchoolId"]?.patchValue("");

    if (blockId !== "") {
      this.commonService.getClusterByBlockId(blockId).subscribe((res: any) => {
        this.clusterData = res;
        this.clusterData = this.clusterData.data;

        if (this.userProfile.cluster != 0 || this.userProfile.cluster != "") {
          this.clusterData = this.clusterData.filter((clu: any) => {
            return clu.clusterId == this.userProfile.cluster;
          });
          this.searchForm.controls["searchClusterId"]?.patchValue(
            this.userProfile.cluster
          );
          this.getSchool(this.userProfile.cluster);
        } else {
          this.scClusterSelect = true;
        }
        this.scClusterLoading = false;
      });
    } else {
      this.scClusterSelect = true;
      this.scClusterLoading = false;
    }
  }
  getSchool(clusterId: any) {
    this.scSchoolSelect = false;
    this.scSchoolLoading = true;

    this.getSchoolData = [];
    this.searchForm.controls["searchSchoolId"]?.patchValue("");

    if (clusterId !== "") {
      this.commonService.getSchoolList(clusterId).subscribe((res: any) => {
        this.getSchoolData = res;
        this.getSchoolData = this.getSchoolData.data;

        if (
          this.userProfile.udiseCode != 0 ||
          this.userProfile.udiseCode != ""
        ) {
          this.getSchoolData = this.getSchoolData.filter((sch: any) => {
            return sch.schoolUdiseCode == this.userProfile.udiseCode;
          });
          this.searchForm.controls["searchSchoolId"]?.patchValue(
            this.getSchoolData[0].schoolId
          );
        } else {
          this.scSchoolSelect = true;
        }
        this.scSchoolLoading = false;
      });
    } else {
      this.scSchoolSelect = true;
      this.scSchoolLoading = false;
    }
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // console.log(this.dataSource);
  }
  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      searchAcademicYear: this.searchAcademicYear,
      searchDistrictId: this.searchDistrictId,
      searchBlockId: this.searchBlockId,
      searchClusterId: this.searchClusterId,
      searchSchoolId: this.searchSchoolId,
      grantType: this.grantType,
    };
  }
  onPageChange(event: any) {
    this.spinner.show();
    this.isLoading = true;
    this.pageSize = event.pageSize; // current page size ex: 10
    this.offset = event.pageIndex * event.pageSize;
    this.previousSize = this.pageSize * event.pageIndex; // set previous size
    this.pageIndex = event.pageIndex;
    this.viewCheckBalance(this.getSearchParams());
  }
  onsearch() {
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    if (this.validateForm() === true) {
      this.spinner.show();
      this.viewCheckBalance(this.getSearchParams());
      this.isInitAdmin = false;
    }
  }
  viewCheckBalance(...params: any) {
    this.spinner.show();
    const {
      previousSize,
      offset,
      pageSize,
      searchDistrictId,
      searchBlockId,
      searchClusterId,
      searchSchoolId,
      searchAcademicYear,
      grantType,
    } = params[0];
    this.paramObj = {
      offset: offset,
      limit: pageSize,
      searchDistrictId: searchDistrictId,
      searchBlockId: searchBlockId,
      searchClusterId: searchClusterId,
      searchSchoolId: searchSchoolId,
      searchAcademicYear: searchAcademicYear,
      grantType: grantType,
      userId: this.userId,
      serviceType: this.serviceType,
      schoolId: this.schoolId,
    };
    this.isLoading = true;
    this.manageGrantExpenditureService
      .viewCheckBalance(this.paramObj)
      .subscribe({
        next: (res: any) => {
          //console.log(res);
          this.resultListData.length = previousSize; // set current size
          this.resultListData.push(...res?.data); // merge with existing data
          this.resultListData.length = res?.totalRecord; // update length
          // console.log(this.resultListData.length);
          this.dataSource.paginator = this.paginator; // update paginator
          this.dataSource._updateChangeSubscription(); // update table
          this.isLoading = false;
          this.isNorecordFound = this.resultListData.length ? false : true;
          // console.log(this.isNorecordFound);
          this.spinner.hide();
        },
        error: (error: any) => {
          this.isLoading = false;
          this.spinner.hide();
        },
      });
  }
  viewDetails(schoolId: any,academicYear: any,grantType: any,grantName: any) {
    this.recTotal =0;
    this.expTotal = 0;
    this.remaining = 0;
    this.grantNameForModal = grantName;
    this.manageGrantExpenditureService
      .viewDetails(schoolId, academicYear, grantType)
      .subscribe((res: any) => {
        this.grantBalanceData = res;
        this.grantExp = this.grantBalanceData.data["grantExp"];
        this.grantRcv = this.grantBalanceData.data["grantRcv"];
        this.grantRcv.forEach((item: any) => {
          this.recTotal=parseFloat(this.recTotal)+parseFloat(item.amount);
        });
        this.grantExp.forEach((items: any) => {
          this.expTotal=parseFloat(this.expTotal)+parseFloat(items.amount);
        });
        // console.log(this.expTotal,"exp");
        this.remaining= (this.recTotal- this.expTotal).toFixed(2);
        //console.log( this.expTotal,"exp rec", this.recTotal); 
        this.spinner.hide();
      });
  }
  toggle() {
    this.show = !this.show;
    if (this.show) this.buttonName = "Hide";
    else this.buttonName = "Show";
  }
  printPages() {
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }
  printModal() {
    let cloneTable = document.getElementById("printModal")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }
  downLoadCheckBalanceList() {
    this.spinner.show();
    this.paramObj.serviceType = "Download";
    // console.log(  this.paramObj.serviceType);
    this.manageGrantExpenditureService
      .viewCheckBalance(this.paramObj)
      .subscribe({
        next: (res: any) => {
          let filepath = this.fileUrl + "/" + res.data.replace(".", "~");
          window.open(filepath);
          this.spinner.hide();
        },
        error: (error: any) => {
          this.spinner.hide();
        },
      });
  }
}
