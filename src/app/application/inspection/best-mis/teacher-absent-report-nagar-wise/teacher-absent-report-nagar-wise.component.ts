import { formatDate } from "@angular/common";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormGroup, NgForm } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { DataTableDirective } from "angular-datatables";
import { MatTableExporterDirective } from "mat-table-exporter";
import { ngxCsv } from "ngx-csv";
import { NgxSpinnerService } from "ngx-spinner";
import { Subject } from "rxjs";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { environment } from "src/environments/environment";
import { InspectionMisService } from "../../services/inspection-mis.service";
import { ManageUserService } from "src/app/application/user/services/manage-user.service";

@Component({
  selector: "app-teacher-absent-report-nagar-wise",
  templateUrl: "./teacher-absent-report-nagar-wise.component.html",
  styleUrls: ["./teacher-absent-report-nagar-wise.component.css"],
})
export class TeacherAbsentReportNagarWiseComponent implements OnInit {
  public show: boolean = true;
  public buttonName: any = "Show";
  public fileUrl1 = environment.filePath;

  displayTable: boolean = false;
  questSearchform!: FormGroup;
  SearchformId!: FormGroup;
  isLoading = false;
  isNorecordFound: boolean = false;
  tattenlength: boolean = false;
  pageIndex: any = 0;
  previousSize: any = 0;
  // mat table
  @Input() mode!: ProgressBarMode;
  @ViewChild("searchForm") searchForm!: NgForm;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter!: MatTableExporterDirective;
  pageSize = 10;
  offset = 0;
  currentPage = 0;
  totalRows = 0;
  //pageSizeOptions: number[] = [10, 25, 100];
  displayedColumns: string[] = [
    "slNo",
    "udise",
    "school_name",
    "teacherName",
    "teacherDesg",
    "monitorOn",
    "monitor_by",
    "actionTaken",
    "Comment",
  ]; // define mat table columns

  resultListData: any = [];
  resultListDatas: any = [];
  questionDetailsData!: any;
  dataSource = new MatTableDataSource(this.resultListData);
  //end
  bodyData: any;
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  scDisrtictChanged: boolean = false;
  districtData: any;
  userProfile = this.commonService.getUserProfile();
  userType = this.userProfile.userType;
  userId = this.userProfile.userId;
  sessionDistrictId: any =
    this.userProfile.district != 0 ? this.userProfile.district : "";
  sessionBlockId: any =
    this.userProfile.block != 0 ? this.userProfile.block : "";
  sessionClusterId: any =
    this.userProfile.cluster != 0 ? this.userProfile.cluster : "";
  sessionSchoolId: any =
    this.userProfile.school != 0 ? this.userProfile.school : "";
  scBlockChanged: boolean = false;
  blockData: any = [];
  scClusterChanged: boolean = false;
  desgNameChanged: boolean = false;
  scDesgChanged: boolean = false;
  clusterData: any;
  scSchoolChanged: boolean = false;
  getSchoolData: any;
  inspectionListData: any;
  emptyCheck: boolean = false;
  isInitAdmin: boolean = false;
  tev: boolean = false;
  scDistrictId: any = "";
  // scBlockId: any = "";
  // scClusterId: any = "";
  schoolId: any = "";
  schoolUdiseCode: any = "";
  desList: any = "";
  datas: any;
  tatten: any;
  absentTeacherList: any;
  studentAttendence: any;
  questionList: any;
  answerList: any;
  datasd: any;
  startDate: any;
  desgName: any;
  endDate: any;
  maxDate: any = Date;
  numOfVisetedSchool: any;
  numOfVisit: any;
  openPer: any;
  pageLevel: any;
  totalAbsentTeacher: any;
  noActionTaken: any;
  eskAsk: any;
  eskSatis: any;
  salaryDed: any;
  eskNoRec: any;
  scDisrtictSelect: boolean = true;
  scDisrtictLoading: boolean = false;
  scBlockSelect: boolean = true;
  scBlockLoading: boolean = false;
  scClusterSelect: boolean = true;
  scClusterLoading: boolean = false;
  scSchoolSelect: boolean = true;
  scSchoolLoading: boolean = false;
  absentTeacherLists: any;
  getDistrictBackId: any;
  getBlockBackId: any;
  getClusterBackId: any;
  getSchoolBackId: any;
  parVal: any;
  getEndDate: any;
  getStartDate: any;
  csvoptions: any;
  csvData: any;

  scNagarPanchayatChanged: boolean = false;
  nagarPanchayat: boolean = true;
  nagarPanchayatData: any;
  nagarParm: any;
  getNagarPanchayatBackId: any;
  scNagarPanchayatId: any = "";
  districtName: any;
  schoolName: any;
  nagarnigamName: any;
  loginLevel: any;
  backLevel: any;

  scDesignationId: any = "";
  scDesignationChanged: boolean = false;
  designationData: any;
  degLevel: any;
  posts: any;
  sessionDegId: any = this.userProfile.designationId;
  schoolType: any = "";

  userLevelId: any = 0;
  stateUser: boolean = false;
  distUser: boolean = false;
  blkUser: boolean = false;
  cluUser: boolean = false;
  scDesignationLoading: boolean = false;
  desGrpLoading: boolean = false;
  desGrpSelect: boolean = false;
  DesignationGroupData: any = [];
  designationGroupId: any = "";
  constructor(
    public commonService: CommonserviceService,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private InspectionMis: InspectionMisService,
    private manageUserService: ManageUserService
  ) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {
   
    this.getDistrict();
    this.userLevel();

  }

  userLevel() {
    if (this.userProfile.userLevel == 5) {
        this.userLevelId = 5;
        this.getDesignationGroup(5);
    } else if (this.userProfile.userLevel == 4) {
        this.userLevelId = 4;
        this.stateUser = true;
        this.distUser = false;
        this.blkUser = false;
        this.cluUser = false;
        this.getDesignationGroup(4);
    } else if (this.userProfile.userLevel == 3) {
        this.userLevelId = 3;
        this.getDesignationGroup(3);
        this.stateUser = true;
        this.distUser = true;
        this.blkUser = false;
        this.cluUser = false;
    } else if (this.userProfile.userLevel == 2) {
        this.userLevelId = 2;
        this.stateUser = true;
        this.distUser = true;
        this.blkUser = true;
        this.cluUser = false;
        this.getDesignationGroup(2);
    } else if (this.userProfile.userLevel == "") {
        this.userLevelId = 0;
    }
}
getDesignationGroup(lvl:any){
  this.desGrpSelect = true;
  this.desGrpLoading = true;
this.DesignationGroupData = [];
this.designationData = [];
this.manageUserService.getDesignationGroup(lvl).subscribe((res:any) => {
this.posts = res;
let data: any = res;
for (let key of Object.keys(data["data"])) {
  this.DesignationGroupData.push(data["data"][key]);
}
      this.desGrpSelect = false;
      this.desGrpLoading = false;
});
}
getSubDesignation(data: any) {
  if (data > 0) {
    this.scDesignationChanged = true;
    this.designationData = [];
    this.scDesignationId = "";
    this.scDesignationLoading = true;
    this.manageUserService.getSubDesignation(data).subscribe(
      (res:any) => {
        this.posts = res;
        let data: any = res;
        for (let key of Object.keys(data["data"])) {
          this.designationData.push(data["data"][key]);
        }
        this.scDesignationChanged = false;
        this.scDesignationLoading = false;
      }
    );
  }else{
    this.scDesignationId = "";
  }
}
  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      userType: this.userProfile.userType,
      userId: this.userProfile.userId,
      scDistrictId: this.searchForm.controls["scDistrictId"].value,
      scNagarPanchayatId: this.searchForm.controls["scNagarPanchayatId"].value,
      schoolId: this.searchForm.controls["schoolId"].value,
      startDate: this.searchForm.controls["startDate"].value,
      endDate: this.searchForm.controls["endDate"].value,
      designationGroupId: this.searchForm.controls["designationGroupId"].value,
      scDesignationId: this.searchForm.controls["scDesignationId"].value,
      schoolType: this.searchForm.controls["schoolType"].value,
    };
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
    if (this.designationGroupId != "") {
      if (this.scDesignationId === "") {
        this.alertHelper.viewAlert(
          "error",
          "Required",
          "Please select sub designation"
        );
        return false;
      }
  }

    if (this.scDistrictId == "") {
      this.alertHelper.viewAlert(
        "error",
        "Required",
        "Please select District."
      );
      return false;
    }

    if (this.startDate === undefined) {
      this.alertHelper.viewAlert(
        "error",
        "Required",
        "Please select Start Date."
      );
      return false;
    }

    if (this.endDate === undefined) {
      this.alertHelper.viewAlert(
        "error",
        "Required",
        "Please select End Date."
      );
      return false;
    }

    if (this.startDate != undefined && this.endDate != undefined) {
      if (
        formatDate(this.endDate, "yyyy-MM-dd", "en_US") <
        formatDate(this.startDate, "yyyy-MM-dd", "en_US")
      ) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "End Date should not be smaller than Start Date"
        );
        this.endDate = undefined;
        return false;
      }
    }

    return true;
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

  loadData(...params: any) {
    this.spinner.show();
    const { previousSize, offset, pageSize } = params[0];
    const paramObj = {
      scDistrictId: this.scDistrictId,
      // scBlockId: params.scBlockId,
      // scClusterId: params.scClusterId,
      scNagarPanchayatId: this.scNagarPanchayatId,
      schoolId: this.schoolId,
      startDate: this.startDate,
      endDate: this.endDate,
      scDesignationId: this.scDesignationId,
      schoolType: this.schoolType,
    };

    if (paramObj.schoolId != "") {
      this.pageLevel = 3;
      this.displayedColumns = [
        "slNo",
        "dis",
        "nagar",
        "udise",
        "school_name",
        "teacherName",
        "teacherDesg",
        "monitorOn",
        "monitor_by",
        "actionTaken",
        "Comment",
      ];
    } else if (paramObj.scNagarPanchayatId != "") {
      this.pageLevel = 2;
      this.displayedColumns = [
        "slNo",
        "dis",
        "nagar",
        "udise",
        "school_name",
        "teacherName",
        "teacherDesg",
        "monitorOn",
        "monitor_by",
        "actionTaken",
        "Comment",
      ];
    } else if (paramObj.scDistrictId != "") {
      this.pageLevel = 1;
      this.displayedColumns = [
        "slNo",
        "dis",
        "udise",
        "school_name",
        "teacherName",
        "teacherDesg",
        "monitorOn",
        "monitor_by",
        "actionTaken",
        "Comment",
      ];
    } else {
      this.pageLevel = 0;
    }

    this.isLoading = true;
    this.InspectionMis.absentNagarNigamWiseReport(paramObj).subscribe({
      next: (res: any) => {
        this.resultListData.length = previousSize; // set current size
        this.resultListData.push(...res?.data); // merge with existing data
        this.resultListData.length = res?.totalRecord; // update length
        //this.pageLevel = res?.pageLevel; // Page Level

        this.getStartDate = res?.startDate;
        this.getEndDate = res?.endDate;
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
        this.isLoading = false;
        this.isNorecordFound = this.resultListData.length ? false : true;
        this.isInitAdmin = true;
        // if (this.pageLevel == 3) {
        //   this.districtName = res?.districtName;
        //   this.nagarnigamName = res?.nagarnigamName;
        //   this.schoolName = res?.schoolName;
        // }
        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }

  excel(level: any) {
    this.spinner.show();
    this.csvData = this.getSearchParams();
    this.InspectionMis.downloadabsentNagarNigamWiseCsv(this.csvData).subscribe(
      (res: any) => {
        const data = res["data"];
        if (level == 0) {
          this.csvoptions = {
            fieldSeparator: ",",
            quoteStrings: '"',
            decimalseparator: ".",
            showLabels: true,
            useBom: true,
            headers: [
              "SLN#",
              "UDISE Code",
              "School Name",
              "Teacher Name",
              "Teacher Designation",
              "Monitoring Date",
              "Monitored By",
              "Designation",
              "Mobile. No",
            ],
          };
        }
        if (level == 1) {
          this.csvoptions = {
            fieldSeparator: ",",
            quoteStrings: '"',
            decimalseparator: ".",
            showLabels: true,
            useBom: true,
            headers: [
              "SLN#",
              "District Name",
              "UDISE Code",
              "School Name",
              "Teacher Name",
              "Teacher Designation",
              "Monitoring Date",
              "Monitored By",
              "Designation",
              "Mobile. No",
            ],
          };
        }
        if (level == 2) {
          this.csvoptions = {
            fieldSeparator: ",",
            quoteStrings: '"',
            decimalseparator: ".",
            showLabels: true,
            useBom: true,
            headers: [
              "SLN#",
              "District Name",
              "NagarNigam Name",
              "UDISE Code",
              "School Name",
              "Teacher Name",
              "Teacher Designation",
              "Monitoring Date",
              "Monitored By",
              "Designation",
              "Mobile. No",
            ],
          };
        }

        if (level == 3) {
          this.csvoptions = {
            fieldSeparator: ",",
            quoteStrings: '"',
            decimalseparator: ".",
            showLabels: true,
            useBom: true,
            headers: [
              "SLN#",
              "District Name",
              "NagarNigam Name",
              "UDISE Code",
              "School Name",
              "Teacher Name",
              "Teacher Designation",
              "Monitoring Date",
              "Monitored By",
              "Designation",
              "Mobile. No",
            ],
          };
        }
        new ngxCsv(data, "AbsentStaffInspectionReport", this.csvoptions);
        this.spinner.hide();
      }
    );
  }

  excelDeatils() {
    this.spinner.show();
    this.csvData = this.getSearchParams();
    this.csvData['scBlockId'] = "";
    this.csvData['scClusterId'] = "";
    this.csvData['schoolId'] = "";
    this.csvData['schoolUdiseCode'] = "";
    this.InspectionMis.downloadSchoolMonitoringReport(this.csvData).subscribe(
      (res: any) => {
        const data = res["data"];
        this.csvoptions = {
          fieldSeparator: ",",
          quoteStrings: '"',
          decimalseparator: ".",
          showLabels: true,
          useBom: true,
          headers: [
            "SLN#",
            "UDISE Code",
            "School Name",
            "District Name",
            "Block Name",
            "Cluster Name",
            "Monitoring Date",
            "Monitored By",
            "Designation",
            "Mobile No",
            "School status",
            "Status",
          ],
        };
        new ngxCsv(data, "schoolMonitoringReport", this.csvoptions);
        this.spinner.hide();
      }
    );
  }

  goBack(
    distId: any,
    scNagarPanchayatId: any,
    sclId: any,
    level: any,
    startDate: any,
    endDate: any
  ) {
    if (distId != "") {
      this.backLevel = 4;
    } else {
      this.backLevel = 5;
    }
    if (this.backLevel != this.loginLevel) {
      if (level == 1) {
        this.parVal = {
          scDistrictId: "",
          scNagarPanchayatId: "",
          schoolId: "",
          startDate: startDate,
          endDate: endDate,
        };
        this.getDistrict();
        this.searchForm.controls["scDistrictId"].patchValue("");
        this.loadData(this.parVal);
      }
      if (level == 2) {
        this.parVal = {
          scDistrictId: distId,
          scNagarPanchayatId: "",
          schoolId: "",
          startDate: startDate,
          endDate: endDate,
        };
        this.searchForm.controls["scDistrictId"].patchValue(distId);
        this.searchForm.controls["scNagarPanchayatId"].patchValue("");
        this.loadData(this.parVal);
      }

      if (level == 3) {
        this.parVal = {
          scDistrictId: distId,
          scNagarPanchayatId: scNagarPanchayatId,
          schoolId: "",
          startDate: startDate,
          endDate: endDate,
        };
        this.getNagarPanchayat(distId, "", 1);
        this.searchForm.controls["scDistrictId"].patchValue(distId);
        this.searchForm.controls["scNagarPanchayatId"].patchValue(
          scNagarPanchayatId
        );
        this.loadData(this.parVal);
      }

      if (level == 4) {
        this.parVal = {
          scDistrictId: distId,
          scNagarPanchayatId: scNagarPanchayatId,
          schoolId: "",
          startDate: startDate,
          endDate: endDate,
        };

        this.getSchool(scNagarPanchayatId);
        this.searchForm.controls["scDistrictId"].patchValue(distId);
        this.searchForm.controls["scNagarPanchayatId"].patchValue(
          scNagarPanchayatId
        );
        this.searchForm.controls["schoolId"].patchValue("");
        this.loadData(this.parVal);
      }
    }
  }

  getData(
    distId: any,
    scNagarPanchayatId: any,
    cluId: any,
    sclId: any,
    startDate: any,
    endDate: any,
    level: any
  ) {
    if (level == 1) {
      this.scDistrictId = distId;
      this.getNagarPanchayat(distId, "", 1);
      this.parVal = {
        scDistrictId: distId,
        // scBlockId: "",
        // scClusterId: "",
        scNagarPanchayatId: "",
        schoolId: "",
        startDate: startDate,
        endDate: endDate,
      };
    }

    // if (level == 2) {

    //   this.scDistrictId = distId;
    //         this.scNagarPanchayatId = scNagarPanchayatId;
    //         this.getSchool(scNagarPanchayatId);
    //   this.parVal = {
    //     scDistrictId: distId,
    //     // scBlockId: blkId,
    //     // scClusterId: "",
    //     scNagarPanchayatId: scNagarPanchayatId,
    //     schoolId: "",
    //     startDate: startDate,
    //     endDate: endDate
    //   }
    // }

    if (level == 2) {
      this.scDistrictId = distId;
      // this.scBlockId = blkId;
      // this.scClusterId = cluId;
      this.scNagarPanchayatId = scNagarPanchayatId;
      this.getSchool(scNagarPanchayatId);
      this.parVal = {
        scDistrictId: distId,
        // scBlockId: blkId,
        // scClusterId: cluId,
        scNagarPanchayatId: scNagarPanchayatId,
        schoolId: "",
        startDate: startDate,
        endDate: endDate,
      };
    }
    if (level == 3) {
      this.scDistrictId = distId;
      // this.scBlockId = blkId;
      // this.scClusterId = cluId;
      this.scNagarPanchayatId = scNagarPanchayatId;
      this.schoolId = sclId;
      this.parVal = {
        scDistrictId: distId,
        // scBlockId: blkId,
        // scClusterId: cluId,
        scNagarPanchayatId: scNagarPanchayatId,
        schoolId: sclId,
        startDate: startDate,
        endDate: endDate,
      };
    }

    this.loadData(this.parVal);
  }

  getDistrict() {
    this.scDisrtictSelect = true;
    this.commonService.getAllDistrict().subscribe((data: any) => {
      this.districtData = data;
      this.districtData = this.districtData?.data;

      if (this.userProfile.district != 0 || this.userProfile.district != "") {
        this.districtData = this.districtData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        this.searchForm.controls["scDistrictId"].patchValue(
          this.userProfile.district
        );
        this.getNagarPanchayat(this.userProfile.district, "", 1);
      } else {
        this.districtData = this.districtData;
        this.scDisrtictSelect = false;
      }

      this.scNagarPanchayatId = "";
      this.scDisrtictSelect = false;
    });
  }

  getSchool(nagarId: any) {
    this.schoolId = "";
    this.scSchoolChanged = true;

    this.getSchoolData = [];

    if (nagarId !== "") {
      this.InspectionMis.getSchoolListNagarWise(nagarId).subscribe(
        (res: any) => {
          this.getSchoolData = res;
          this.getSchoolData = this.getSchoolData?.data;

          if (this.sessionSchoolId != "") {
            this.searchForm.controls["schoolId"].patchValue(
              this.sessionSchoolId
            );
          }

          this.scSchoolChanged = false;
        }
      );
    } else {
      this.scSchoolChanged = false;
    }
  }

  desginationList() {
    this.InspectionMis.DesignationList().subscribe((res: any) => {
      this.desList = res?.data;
    });
  }

  noOfAbsente(inspectionId: any) {
    this.spinner.show();
    let paramList = { encId: inspectionId };
    this.InspectionMis.noOfAbsentee(paramList).subscribe((res: any) => {
      this.absentTeacherLists = res?.data;
      this.spinner.hide();
    });
  }

  printPage() {
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }

  toggle() {
    this.show = !this.show;
    if (this.show) this.buttonName = "Hide";
    else this.buttonName = "Show";
  }
  getNagarPanchayat(districtId: any, blockId: any, type: any) {
    this.scNagarPanchayatChanged = true;
    this.scNagarPanchayatId = "";
    this.schoolId = "";
    this.nagarPanchayatData = [];
    this.nagarParm = {
      scDistrictId: districtId,
      // scBlockId: blockId,
      scType: type,
    };
    if (type == 1) {
      this.nagarPanchayat = true;
    } else if (type == 2) {
      this.nagarPanchayat = false;
    } else {
      this.nagarPanchayat = false;
      this.nagarPanchayatData = [];
    }
    if (this.scDistrictId != "") {
      this.InspectionMis.getNagarPanchayat(this.nagarParm).subscribe(
        (res: any) => {
          this.nagarPanchayatData = res;
          this.nagarPanchayatData = this.nagarPanchayatData?.data;
          this.scNagarPanchayatChanged = false;
        }
      );
    } else {
      this.nagarPanchayatData = [];
      this.scNagarPanchayatChanged = false;
    }
  }

  // Material table pagination size options :: Sambit Kumar Dalai:: 10-11-2022
  get getPageSizeOptions(): number[] {
    return this.dataSource?.paginator &&
      this.dataSource?.paginator?.length > 200
      ? [10, 30, 50, 100, this.dataSource.paginator.length]
      : [10, 30, 50, 100, 200];
  }
  getDesignations(dist: any, blk: any, clus: any, level: any) {
    this.scDesignationChanged = true;
    this.scDesignationId = "";
    if (clus != "") {
      this.degLevel = 2;
    } else if (blk != "") {
      this.degLevel = 3;
    } else if (dist != "") {
      this.degLevel = 4;
    } else {
      this.degLevel = 5;
    }
    if (this.sessionClusterId != "") {
      this.loginLevel = 2;
    } else if ((this.sessionBlockId = "")) {
      this.loginLevel = 3;
    } else if (this.sessionDistrictId != "") {
      this.loginLevel = 4;
    } else {
      this.loginLevel = 5;
    }

    const levelPrm = {
      level: this.degLevel,
    };

    this.InspectionMis.getDesignation(levelPrm).subscribe((res: any) => {
      this.posts = res;
      if (this.posts == null) {
        this.designationData = [];
        this.scDesignationId = "";
        this.scDesignationChanged = false;
      } else {
        this.designationData = this.posts.data;

        if (this.sessionDegId != "") {
          this.scDesignationChanged = true;
          if (this.loginLevel == this.degLevel) {
            this.designationData = this.designationData.filter((deg: any) => {
              return deg.intDesignationId == this.userProfile.designationId;
            });

            this.searchForm.controls["scDesignationId"].patchValue(
              this.userProfile.designationId
            );
          }
          this.scDesignationChanged = false;
        }
      }

      this.scDesignationChanged = false;
    });
  }
  exportSchoolList(district: any, nagar: any, school: any, startDate: any, endDate: any, deg: any) {
    this.spinner.show();
    const paramObj = {
      scDistrictId: district,
      scBlockId: '',
      scClusterId: '',
      scNagarId: nagar,
      schoolId: school,
      startDate: startDate,
      endDate: endDate,
      scDesignationId: deg,
      schoolUdiseCode: "",
      typeWise: "nagarWise",
      schoolType: this.schoolType
    };

    this.InspectionMis.exportSchoolReport(paramObj).subscribe({
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
}
