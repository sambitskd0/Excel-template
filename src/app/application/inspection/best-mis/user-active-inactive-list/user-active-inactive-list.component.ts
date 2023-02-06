import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormBuilder, NgForm } from "@angular/forms";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { NgxSpinnerService } from "ngx-spinner";
import { DataTableDirective } from "angular-datatables";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { ngxCsv } from "ngx-csv/ngx-csv";
import { InspectionMisService } from "../../services/inspection-mis.service";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { formatDate } from "@angular/common";
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-user-active-inactive-list',
  templateUrl: './user-active-inactive-list.component.html',
  styleUrls: ['./user-active-inactive-list.component.css']
})
export class UserActiveInactiveListComponent implements OnInit {

  public fileUrl1 = environment.filePath;
   [x: string]: any;
  displayTable: boolean = false;
  questSearchform!: FormGroup;
  SearchformId!: FormGroup;
  isLoading = false;
  isNorecordFound: boolean = false;
  tattenlength: boolean = false;
  pageIndex: any = 0;
  previousSize: any = 0;
  // mat table
  @ViewChild("searchForm") searchForm!: NgForm;
  @Input() mode!: ProgressBarMode;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTableExporterDirective, { static: true })
  isimageUrlTeacher: boolean = false;
  imageUrlTeacher: any = "";
  public fileUrl = environment.filePath;

  exporter!: MatTableExporterDirective;
  pageSize = 10;
  offset = 0;
  currentPage = 0;
  totalRows = 0;
  resultListData: any = [];
  questionDetailsData!: any;
  dataSource = new MatTableDataSource(this.resultListData);
  //end
  csvData: any;
  csvoptions: any;
  bodyData: any;
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  scDisrtictChanged: boolean = false;
  districtData: any;
  inspStatusId: number = 0;
  schoolStatusId: number = 0;
  userProfile = this.commonService.getUserProfile();
  userType = this.userProfile.userType;
  userLevel = this.userProfile.userLevel;
  userId = this.userProfile.userId;
  sessionDistrictId: any =
    this.userProfile.district != 0 ? this.userProfile.district : "";
  sessionBlockId: any =
    this.userProfile.block != 0 ? this.userProfile.block : "";
  sessionClusterId: any =
    this.userProfile.cluster != 0 ? this.userProfile.cluster : "";
  sessionSchoolId: any =
    this.userProfile.school != 0 ? this.userProfile.school : "";
  sessionDegId: any = this.userProfile.designationId;
  scBlockChanged: boolean = false;
  blockData: any;
  scClusterChanged: boolean = false;
  clusterData: any;
  scSchoolChanged: boolean = false;
  getSchoolData: any;
  inspectionListData: any;
  emptyCheck: boolean = false;
  isInitAdmin: boolean = false;
  tev: boolean = false;
  scDistrictId: any = "";
  scBlockId: any = "";
  scClusterId: any = "";
  schoolId: any = "";
  datas: any;
  tatten: any;
  absentTeacherList: any;
  studentAttendence: any;
  questionList: any;
  answerList: any;
  datasd: any;
  startDate: any;
  endDate: any;
  maxDate: any = Date;
  searchDistrictId: any = "";
  searchBlockId: any = "";
  searchClusterId: any = "";
  searchSchoolId: any = "";
  schoolUdiseCode: any = "";
  designationData: any;

  scDisrtictSelect: boolean = true;
  scDisrtictLoading: boolean = false;
  scBlockSelect: boolean = true;
  scBlockLoading: boolean = false;
  scClusterSelect: boolean = true;
  scClusterLoading: boolean = false;
  scSchoolSelect: boolean = true;
  scSchoolLoading: boolean = false;
  scDesignationChanged: boolean = false;
  reportLevelLoad: boolean = false;
  //reportLevelselect: boolean = false;
  reportStatus: any = "";

  searchDistrictData: any = [];
  searchBlockData: any = [];
  levelOfUser:any = [];
  blockChanged: boolean = false;
  posts: any;
  pageLevel:any;
  allUsers:any;
  allActiveUsers:any;
  allInactiveUsers:any;
  blockOption: boolean = false;
  district: boolean = false;
  

  constructor(
    private formBuilder: FormBuilder,
    public commonService: CommonserviceService,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private InspectionMis: InspectionMisService,
  ) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    if(this.userLevel == 5){
      this.levelOfUser = [
        { id: "", level: "--Select--"},
        { id: 5, level: "State"},
        { id: 4, level: "District"},
      ];
      this.reportStatus = "";
      this.district = true;
    }else if(this.userLevel == 4){
      this.levelOfUser = [
        { id: 3, level: "Block"},
      ];
      this.reportStatus = "3";
      this.getDistrict();
    }else{
      this.levelOfUser = [
        { id: "", level: "--Select--"},
        { id: 5, level: "State"},
        { id: 4, level: "District"},
        { id: 3, level: "Block"},
      ];
      this.reportStatus = "";
      this.getDistrict();
    }
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      userType: this.userProfile.userType,
      userId: this.userProfile.userId,
      reportStatus: this.searchForm.controls["reportStatus"].value,
      scDistrictId: this.searchForm.controls["scDistrictId"]?.value ? this.searchForm.controls["scDistrictId"]?.value : "",
      
    };
  }

  onPageChange(event: any) {
    this.spinner.show();
    this.isLoading = true;
    // event: PageEvent
    this.pageSize = event.pageSize; // current page size ex: 10

    this.offset = event.pageIndex * event.pageSize;
    this.previousSize = this.pageSize * event.pageIndex; // set previous size
    this.pageIndex = event.pageIndex;
    this.loadData(this.getSearchParams());
  }
  onSearch() {
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.previousSize = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    if (this.validateForm() === true) {
      this.loadData(this.getSearchParams());
    }
  }

  validateForm() {

    if (this.reportStatus === "") {
      this.alertHelper.viewAlert(
        "error",
        "Required",
        "Please select report status"
      );
      return false;
    }
    return true;
  }

  

  
  loadData(...params: any) {
    this.spinner.show();
    const { previousSize, offset, pageSize } = params[0];

    const paramObj = {
      offset: offset,
      limit: pageSize,
      reportStatus: this.reportStatus,
      scDistrictId: this.scDistrictId,
    };
    this.isLoading = true;
    this.InspectionMis.getActiveInactiveUserList(paramObj).subscribe({
      next: (res: any) => {
        this.resultListData.length = previousSize; // set current size
        this.resultListData.push(...res?.data); // merge with existing data
        this.allUsers = res?.allUsers;
        this.allActiveUsers = res?.allActiveUsers;
        this.allInactiveUsers = res?.allInactiveUsers;
        this.pageLevel = res?.pageLevel;
        this.isLoading = false;
        this.isNorecordFound = this.resultListData.length ? false : true;
        this.isInitAdmin = true;
        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }

  toggle() {
    const visible = $("#searchPanel").css("display");
    if (visible == "none") {
      $("#searchPanel").show(1000);
      $(".bi-caret-up-fill").show();
      $(".bi-caret-down-fill").hide();
    } else {
      $("#searchPanel").hide(400);
      $(".bi-caret-up-fill").hide();
      $(".bi-caret-down-fill").show();
    }
  }

  

  getDistrict() {
    this.scDisrtictSelect = false;
    this.scDisrtictLoading = true;
    this.commonService.getAllDistrict().subscribe((data: any) => {
      this.districtData = data;
      this.districtData = this.districtData.data;

      if (this.userProfile.district != 0 || this.userProfile.district != "") {
        this.districtData = this.districtData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        this.searchForm.controls["scDistrictId"].patchValue(
          this.userProfile.district
        );
        this.scDisrtictLoading = false;
        //this.getBlock(this.userProfile.district);
      } else {
        this.searchDistrictData = this.districtData;
        this.scDisrtictSelect = true;
      }

      this.searchBlockId = "";
      this.scDisrtictLoading = false;
    });
  }

  printPage() {
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }

  excel() {
    this.spinner.show();
    this.csvData = this.getSearchParams();
    //console.log(this.pageLevel);
    this.InspectionMis.downloadActiveInactiveUser(this.csvData).subscribe(
      (res: any) => {
        const data = res["data"];
        if(this.pageLevel == 1){
          this.csvoptions = {
            fieldSeparator: ",",
            quoteStrings: '"',
            decimalseparator: ".",
            showLabels: true,
            useBom: true,
            headers: [
              "SLN#",
              "Total Users",
              "Total Logged-in Users",
              "Total Not Logged-in Users",
            ],
          };

        }else if(this.pageLevel == 2){
          this.csvoptions = {
            fieldSeparator: ",",
            quoteStrings: '"',
            decimalseparator: ".",
            showLabels: true,
            useBom: true,
            headers: [
              "SLN#",
              "District Name",
              "Total Users",
              "Total Logged-in Users",
              "Total Not Logged-in Users",
            ],
          };
        }else if(this.pageLevel == 3){
          this.csvoptions = {
            fieldSeparator: ",",
            quoteStrings: '"',
            decimalseparator: ".",
            showLabels: true,
            useBom: true,
            headers: [
              "SLN#",
              "District Name",
              "Block Name",
              "Total Users",
              "Total Logged-in Users",
              "Total Not Logged-in Users",
            ],
          };
        }
        
        new ngxCsv(data, "activeIncativeUserCsv", this.csvoptions);
        this.spinner.hide();
      }
    );
  }

  excelDeatils() {
    this.spinner.show();
    this.csvData = this.getSearchParams();
    this.csvData['schoolId'] = "";
    this.csvData['schoolUdiseCode'] = "";
    this.InspectionMis.downloadSchoolMonitoringReportDegWise(this.csvData).subscribe({
      next: (res: any) => {
        let filepath = this.fileUrl1 + '/' + res.data.replace('.', '~');
        window.open(filepath);
        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }

  getBlock(districtId: any) {
    this.scBlockSelect = false;
    this.scBlockLoading = true;

    this.searchBlockData = [];
    this.searchForm.controls["scBlockId"].patchValue("");

    this.clusterData = [];
    this.searchForm.controls["scClusterId"].patchValue("");

    
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
            this.searchForm.controls["scBlockId"].patchValue(
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
    this.searchForm.controls["scClusterId"].patchValue("");

    

    if (blockId !== "") {
      this.commonService.getClusterByBlockId(blockId).subscribe((res: any) => {
        this.clusterData = res;
        this.clusterData = this.clusterData.data;

        if (this.userProfile.cluster != 0 || this.userProfile.cluster != "") {
          this.clusterData = this.clusterData.filter((clu: any) => {
            return clu.clusterId == this.userProfile.cluster;
          });
          this.searchForm.controls["scClusterId"].patchValue(
            this.userProfile.cluster
          );
          //this.getSchool(this.userProfile.cluster);
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
    this.searchForm.controls["schoolId"].patchValue("");

    if (clusterId !== "") {
      this.InspectionMis.getSchoolList(clusterId).subscribe((res: any) => {
        this.getSchoolData = res;
        this.getSchoolData = this.getSchoolData.data;

        if (
          this.userProfile.udiseCode != 0 ||
          this.userProfile.udiseCode != ""
        ) {
          this.getSchoolData = this.getSchoolData.filter((sch: any) => {
            return sch.schoolUdiseCode == this.userProfile.udiseCode;
          });
          this.searchForm.controls["schoolId"].patchValue(
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

  printModal() {
    let cloneTable = document.getElementById("printModal")?.innerHTML;
    const pageTitle = "School Monitoring Report Card";
    this.commonService.printPage(cloneTable, pageTitle);
  }

 
}
