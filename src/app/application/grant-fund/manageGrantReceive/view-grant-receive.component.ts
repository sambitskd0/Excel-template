import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { MatTableExporterDirective } from "mat-table-exporter";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { Constant } from "src/app/shared/constants/constant";
import { environment } from "src/environments/environment";
import { ManageGrantExpenditureService } from "../services/manage-grant-expenditure.service";
import { ManageGrantReceiveService } from "../services/manage-grant-receive.service";

@Component({
  selector: "app-view-grant-receive",
  templateUrl: "./view-grant-receive.component.html",
  styleUrls: ["./view-grant-receive.component.css"],
})
export class ViewGrantReceiveComponent implements OnInit {
  paramObj: any;
  serviceType: string = "Search";
  public show:boolean = true;
  public buttonName:any = 'Show';
  public fileUrl = environment.filePath;
  @ViewChild("searchForm") searchForm!: NgForm;
  public userProfile = JSON.parse(
    sessionStorage.getItem("userProfile") || "{}"
  );
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();
  searchAcademicYear: any = "";
  searchDistrictId: any = "";
  searchBlockId: any = "";
  searchClusterId: any = "";
  searchSchoolId: any = "";
  grantType: any = "";
  grantReceiveFrom: any = "";

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
  grantReceivedFromData: any = [];
  grantTypeData: any = [];

  isInitAdmin: boolean = false;
  userId: any = "";
  schoolId: any = "";
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
  adminPrivilege: boolean = false;
  displayedColumns: string[] = []; 
  resultListData: any = [];
  dataSource = new MatTableDataSource(this.resultListData);
  //end Material Table Variable and Decorators
  maxDate: any = Date;
  profileId: any = "";
  constructor(
    private commonFunctionHelper: CommonFunctionHelper,
    private commonService: CommonserviceService,
    private spinner: NgxSpinnerService,
    private alertHelper: AlertHelper,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    public manageGrantReceiveService: ManageGrantReceiveService,
    public manageGrantExpenditureService: ManageGrantExpenditureService
  ) {
    const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
    this.maxDate = new Date();
  }
  ngOnInit(): void {
    this.spinner.show();
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
      this.displayedColumns = [
        "slNo",
        "Grant_Agency",
        "Grant_Name",
        "Receive_Date",
        "Letter_No",
        "Amount",
        "action",
      ]; 
    } else {
      this.displayedColumns = [
        "slNo",
        "Grant_Agency",
        "Grant_Name",
        "Receive_Date",
        "Letter_No",
        "Amount",
      ]; 
    }
    this.getDistrict();
    this.grantReceivedFrom();
    this.searchAcademicYear = this.academicYear;
    const userProfile = this.commonService.getUserProfile();
    this.userId = userProfile?.userId;
    this.profileId = userProfile?.profileId;
    this.schoolId = userProfile?.school;
    if (userProfile.loginUserTypeId ==2) {
      this.getGrantType(0, this.schoolId);
      this.viewGrantReceive(this.getSearchParams());
    } else {
      this.isInitAdmin = true;
    }
    this.spinner.hide();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
  grantReceivedFrom() {
    this.commonService
      .getCommonAnnexture(["Grant_Recieve_From_Type"])
      .subscribe((data: any = []) => {
       // this.grantReceivedFromData = data?.data?.Grant_Recieve_From_Type;
        this.grantReceivedFromData = data?.data?.Grant_Recieve_From_Type.sort((a: any, b: any) => (a.anxtName.toLowerCase() < b.anxtName.toLowerCase()) ? -1 : ((b.anxtName.toLowerCase() > a.anxtName.toLowerCase()) ? 1 : 0));
      });
  }
  // ==============Get serch Parameters For Material Table
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
      grantReceiveFrom: this.grantReceiveFrom,
    };
  }
  onPageChange(event: any) {
    this.spinner.show();
    this.isLoading = true;
    // event: PageEvent
    this.pageSize = event.pageSize; // current page size ex: 10
    /**
     * pageIndex starts from 0
     * ex: if pageIndex = 0 then offset = 0 * 10 = 0 and if pageIndex =1 then 1*10 = 10
     */
    this.offset = event.pageIndex * event.pageSize;
    this.previousSize = this.pageSize * event.pageIndex; // set previous size
    this.pageIndex = event.pageIndex;
    this.viewGrantReceive(this.getSearchParams());
  }
  onsearch() {
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    //this.viewGrantReceive(this.getSearchParams());
    //this.isInitAdmin = false;
    if (this.validateForm() === true) {
      this.spinner.show();
      this.viewGrantReceive(this.getSearchParams());
      this.isInitAdmin = false;
    }
  }
  viewGrantReceive(...params: any) {
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
      grantReceiveFrom,
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
      grantReceiveFrom: grantReceiveFrom,
      userId: this.userId,
      serviceType: this.serviceType,
      schoolId: this.schoolId,
    };
    this.isLoading = true;
    this.manageGrantReceiveService.viewGrantReceive(this.paramObj).subscribe({
      next: (res: any) => {
        this.resultListData.length = previousSize; // set current size
        this.resultListData.push(...res?.data); // merge with existing data
        this.resultListData.length = res?.totalRecord; // update length
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
        this.isLoading = false;
        this.isNorecordFound = this.resultListData.length ? false : true;
        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
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
  deleteGrantReceive(id: any) {
    this.alertHelper
      .deleteAlert("Do you want to delete the selected record ?", "", "question", "Yes, delete it!")
      .then((result) => {
        if (result.value) {
          this.spinner.show();
          this.isLoading = true;
          this.manageGrantReceiveService
            .deleteGrantReceive(id, this.userId, this.profileId)
            .subscribe({
              next: (res: any) => {
                if (res?.success === true) {
                  this.alertHelper.successAlert(
                    "Deleted!",
                    "Grant receive detail deleted successfully",
                    "success"
                  );
                  this.viewGrantReceive(this.getSearchParams());
                } else {
                  this.alertHelper.viewAlert("info", res?.msg, "");
                }
                this.isLoading = false;
                this.spinner.hide();
              },
              error: (error: any) => {
                this.isLoading = false;
              },
            });
            this.spinner.hide();
        }
      });
     
  }
  toggle() {
    this.show = !this.show;
    if (this.show)
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }
  printPage() {
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }
  downLoadReceiveList() {
    this.spinner.show();
    this.paramObj.serviceType = "Download";
    this.manageGrantReceiveService.viewGrantReceive(this.paramObj).subscribe({
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
