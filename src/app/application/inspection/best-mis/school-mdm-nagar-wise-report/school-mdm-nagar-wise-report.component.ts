import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { NgForm } from "@angular/forms";
import { CommonserviceService } from "src/app/core/services/commonservice.service";

import { NgxSpinnerService } from "ngx-spinner";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
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
import { ManageUserService } from "src/app/application/user/services/manage-user.service";

@Component({
  selector: 'app-school-mdm-nagar-wise-report',
  templateUrl: './school-mdm-nagar-wise-report.component.html',
  styleUrls: ['./school-mdm-nagar-wise-report.component.css']
})
export class SchoolMdmNagarWiseReportComponent implements OnInit {
  public fileUrl1 = environment.filePath;
  public show: boolean = true;
  public buttonName: any = "Show";

  displayTable: boolean = false;
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
  pageSizeOptions: number[] = [10, 25, 100];

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
  scDisrtictChangedload: boolean = true;
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
  scBlockId: any = "";
  scClusterId: any = "";
  schoolId: any = "";
  schoolUdiseCode: any = "";
  scNagarPanchayatId: any = "";
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
  numCol: any = 2;
  totopensch: any;
  totclosedSch: any;

  scDisrtictSelect: boolean = true;
  scDisrtictLoading: boolean = false;
  scNagarPanchayatChanged: boolean = false;
  nagarPanchayat: boolean = true;
  scBlockSelect: boolean = true;
  scBlockLoading: boolean = false;
  scClusterSelect: boolean = true;
  scClusterLoading: boolean = false;
  scSchoolSelect: boolean = true;
  scSchoolLoading: boolean = false;
  closePer: any;
  totalSchool: any;
  parVal: any;
  districtName: any;
  blockName: any;
  clusterName: any;
  schoolName: any;
  getDistrictBackId: any;
  getBlockBackId: any;
  getClusterBackId: any;
  getSchoolBackId: any;
  csvData: any;
  csvoptions: any;
  getStartDate: any;
  getEndDate: any;
  nagarPanchayatData: any;
  nagarParm: any;
  getNagarPanchayatBackId: any;
  nagarnigamName: any;
  backLevel: any;
  loginLevel: any;
  scDesignationId: any = "";
  scDesignationChanged: boolean = false;
  designationData: any;
  degLevel: any;
  posts: any;
  sessionDegId: any = this.userProfile.designationId;
  totMdmDone: any;
  totMdmNotDone: any;
  schoolType:any = "";
  designationGroupId: any = "";
  userLevelId: any = 0;
  stateUser: boolean = false;
  distUser: boolean = false;
  blkUser: boolean = false;
  cluUser: boolean = false;
  scDesignationLoading: boolean = false;
  desGrpLoading: boolean = false;
  desGrpSelect: boolean = false;
  DesignationGroupData: any = [];
  mdmAvgDone: any;
  mdmAvgNotDone: any;
  constructor(
    public commonService: CommonserviceService,
    private spinner: NgxSpinnerService,
    private InspectionMis: InspectionMisService,
    private alertHelper: AlertHelper,
    private manageUserService: ManageUserService
  ) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {
   
    this.getDistrict();this.userLevel();
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
    if (this.validateForm() === true) {
      this.loadDataRes(this.getSearchParams());
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

  loadDataRes(params: any) {
    this.spinner.show();
    const paramObj = {
      scDistrictId: params.scDistrictId,
      scNagarPanchayatId: params.scNagarPanchayatId,
      schoolId: params.schoolId,
      startDate: params.startDate,
      endDate: params.endDate,
      scDesignationId: this.scDesignationId,
      schoolType : this.schoolType,
    };

    if (paramObj.schoolId != "") {
      this.pageLevel = 3;
    } else if (paramObj.scNagarPanchayatId != "") {
      this.pageLevel = 2;
    } else if (paramObj.scDistrictId != "") {
      this.pageLevel = 1;
    } else {
      this.pageLevel = 0;
    }
    this.isLoading = true;
    this.InspectionMis.mdmReportNagarWise(paramObj).subscribe({
      next: (res: any) => {
        this.resultListData = res?.data; // merge with existing data
        this.totalSchool = res?.totalSchool;
        this.numOfVisetedSchool = res?.numOfVisetedSchool;
        this.numOfVisit = res?.numOfVisit;
        this.openPer = res?.openPer;
        this.closePer = res?.closePer;
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
        this.isLoading = false;
        this.isNorecordFound = this.resultListData.length ? false : true;
        this.isInitAdmin = true;
        this.spinner.hide();
        this.getDistrictBackId = res?.getDistrictBackId;
        this.getNagarPanchayatBackId = res?.getNagarPanchayatBackId;
        this.getSchoolBackId = res?.getSchoolBackId;
        this.getStartDate = res?.startDate;
        this.getEndDate = res?.endDate;
        this.totopensch = res?.totopensch;
        this.totclosedSch = res?.totclosedSch;
        this.totMdmDone = res?.totMdmDone;
        this.totMdmNotDone = res?.totMdmNotDone;
        this.mdmAvgDone = res?.mdmAvgDone;
        this.mdmAvgNotDone = res?.mdmAvgNotDone;
        if (this.pageLevel == 2 || this.pageLevel == 3) {
          this.districtName = res?.districtName;
          this.nagarnigamName = res?.nagarnigamName;
          this.schoolName = res?.schoolName;
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }

  getDrillDownData(
    distId: any,
    scNagarPanchayatId: any,
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
        scNagarPanchayatId: "",
        schoolId: "",
        startDate: startDate,
        endDate: endDate,
      };
    }

    if (level == 2) {
      this.scDistrictId = distId;
      this.scNagarPanchayatId = scNagarPanchayatId;
      this.getSchool(scNagarPanchayatId);
      this.parVal = {
        scDistrictId: distId,
        scNagarPanchayatId: scNagarPanchayatId,
        schoolId: "",
        startDate: startDate,
        endDate: endDate,
      };
    }
    if (level == 3) {
      this.scDistrictId = distId;
      this.scNagarPanchayatId = scNagarPanchayatId;
      this.schoolId = sclId;
      this.parVal = {
        scDistrictId: distId,
        scNagarPanchayatId: scNagarPanchayatId,
        schoolId: sclId,
        startDate: startDate,
        endDate: endDate,
      };
    }

    this.loadDataRes(this.parVal);
  }

  getDistrict() {
    this.scDisrtictSelect = false;
    this.scDisrtictLoading = true;
    this.nagarPanchayatData = [];
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
        this.scDisrtictSelect = true;
      }

      this.scDisrtictLoading = false;
    });
  }
  getNagarPanchayat(districtId: any, blockId: any, type: any) {
    this.scNagarPanchayatId = "";
    this.schoolId = "";
    this.nagarPanchayatData = [];
    this.getSchoolData = [];
    if (districtId != "") {
      this.scNagarPanchayatChanged = true;
      this.nagarParm = {
        scDistrictId: districtId,
        scBlockId: "",
        scType: type,
      };

      this.InspectionMis.getNagarPanchayat(this.nagarParm).subscribe(
        (res: any) => {
          this.nagarPanchayatData = res;
          this.nagarPanchayatData = this.nagarPanchayatData?.data;
          this.scNagarPanchayatChanged = false;
        }
      );
    } else {
      this.nagarPanchayatData = [];
      this.scNagarPanchayatId = "";
      this.scNagarPanchayatChanged = false;
    }
  }

  getSchool(nagarId: any) {
    this.schoolId = "";
    this.scSchoolChanged = true;

    this.getSchoolData = [];

    if (nagarId != "") {
      this.InspectionMis.getSchoolListNagarWise(nagarId).subscribe(
        (res: any) => {
          this.getSchoolData = res;
          if (this.getSchoolData == null) {
            this.getSchoolData = [];
          } else {
            this.getSchoolData = this.getSchoolData?.data;
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

  goBack(
    distId: any,
    blkId: any,
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
        this.loadDataRes(this.parVal);
      }

      if (level == 2) {
        this.parVal = {
          scDistrictId: distId,
          scNagarPanchayatId: "",
          schoolId: "",
          startDate: startDate,
          endDate: endDate,
        };
        this.getNagarPanchayat(distId, "", 1);
        this.searchForm.controls["scDistrictId"].patchValue(distId);
        this.searchForm.controls["scNagarPanchayatId"].patchValue("");
        this.loadDataRes(this.parVal);
      }

      if (level == 3) {
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
        this.loadDataRes(this.parVal);
      }
    }
  }
  printPage() {
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }

  excel(level: any) {
    this.spinner.show();
    this.csvData = this.getSearchParams();
    this.InspectionMis.downloadMdmNNCsv(this.csvData).subscribe(
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
              "District",
              "Numbers of Schools",
              "Number of visited schools (unique)",
              "Number of visits",
              "Mdm done count",
              "Mdm not done count",
              "%Mdm done",
              "%Mdm not done",
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
              "District",
              "Nagarnigam",
              "Numbers of Schools",
              "Number of visited schools (unique)",
              "Number of visits",
              "Mdm done count",
              "Mdm not done count",
              "%Mdm done",
              "%Mdm not done",
            ],
          };
        }
        if (level == 3 || level == 2) {
          this.csvoptions = {
            fieldSeparator: ",",
            quoteStrings: '"',
            decimalseparator: ".",
            showLabels: true,
            useBom: true,
            headers: [
              "SLN#",
              "District",
              "Block",
              "Cluster",
              "School Name",
              "School Open Status",
              "Mdm Status",
              "Monitoring Date",
            ],
          };
        }

        new ngxCsv(data, "mdmNagarNigamWiseReport", this.csvoptions);
        this.spinner.hide();
      }
    );
  }

  toggle() {
    this.show = !this.show;
    if (this.show) this.buttonName = "Hide";
    else this.buttonName = "Show";
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

  exportSchoolList(district: any, block: any, nagar: any, school: any, startDate: any, endDate: any, deg: any) {
    this.spinner.show();
    const paramObj = {
      scDistrictId: district,
      scBlockId: block,
      scClusterId: '',
      scNagarId: nagar,
      schoolId: school,
      startDate: startDate,
      endDate: endDate,
      scDesignationId: deg,
      schoolUdiseCode: "",
      typeWise: "nagarWise",
      schoolType:this.schoolType,
      mdm:true
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
