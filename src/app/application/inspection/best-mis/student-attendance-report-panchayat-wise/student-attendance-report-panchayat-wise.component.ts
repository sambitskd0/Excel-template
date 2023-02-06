import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { NgForm } from "@angular/forms";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { ngxCsv } from "ngx-csv/ngx-csv";
import { InspectionMisService } from "../../services/inspection-mis.service";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { formatDate } from "@angular/common";
import { environment } from "src/environments/environment";
import { ManageUserService } from "src/app/application/user/services/manage-user.service";


@Component({
  selector: "app-student-attendance-report-panchayat-wise",
  templateUrl: "./student-attendance-report-panchayat-wise.component.html",
  styleUrls: ["./student-attendance-report-panchayat-wise.component.css"],
})
export class StudentAttendanceReportPanchayatWiseComponent implements OnInit {
  public fileUrl1 = environment.filePath;
  @ViewChild("searchForm") searchForm!: NgForm;
  public show: boolean = true;
  public buttonName: any = "Show";
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  scDistrictId: any = "";
  scBlockId: any = "";
  schoolId: any = "";
  scPanchayatId: any = "";
  pageLevel: any;
  maxDate: any;
  blockData: any;
  getSchoolData: any;
  districtData: any;
  nagarParm: any;
  panchayatData: any;
  scDisrtictSelect: boolean = false;
  scBlockChanged: boolean = false;
  scPanchayatChanged: boolean = false;
  scSchoolChanged: boolean = false;
  userProfile = this.commonService.getUserProfile();
  sessionDistrictId: any =
    this.userProfile.district != 0 ? this.userProfile.district : "";
  sessionBlockId: any =
    this.userProfile.block != 0 ? this.userProfile.block : "";
  sessionSchoolId: any =
    this.userProfile.school != 0 ? this.userProfile.school : "";
  startDate: any;
  endDate: any;
  isNorecordFound: boolean = false;
  isInitAdmin: boolean = false;
  isLoading: boolean = false;
  resultListDatas: any;
  numOfVisetedSchool: any;
  numOfVisit: any;
  totalEnrolledBoys: any;
  attendanceOnRegisterBoys: any;
  actualPresentBoys: any;
  totalEnrolledGirls: any;
  attendanceOnRegisterGirls: any;
  actualPresentGirls: any;
  totalEnrolledTransgender: any;
  attendanceOnRegisterTransgender: any;
  actualPresentTransgender: any;
  getDistrictBackId: any;
  getBlockBackId: any;
  getClusterBackId: any;
  getSchoolBackId: any;
  getStartDate: any;
  getEndDate: any;
  resultListData: any = [];
  dataSource = new MatTableDataSource(this.resultListData);
  parVal: any;
  getPanchayatBackId: any;
  csvoptions: any;
  csvData: any;

  loginLevel: any;
  backLevel: any;
  scDesignationId: any = "";
  scDesignationChanged: boolean = false;
  designationData: any;
  degLevel: any;
  posts: any;
  sessionDegId: any = this.userProfile.designationId;
  scClassGroup: any = "";
  actualPresentTransgenderPer: any;
  attendanceOnRegisterTransgenderPer: any;
  actualPresentGirlsPer: any;
  attendanceOnRegisterGirlsPer: any;
  actualPresentBoysPer: any;
  attendanceOnRegisterBoysPer: any;
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

  constructor(
    public commonService: CommonserviceService,
    private alertHelper: AlertHelper,
    private InspectionMis: InspectionMisService,
    private spinner: NgxSpinnerService,
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
        this.getBlock(this.userProfile.district);
      } else {
        this.districtData = this.districtData;
        this.scDisrtictSelect = false;
      }

      this.scBlockId = "";
      this.scDisrtictSelect = false;
    });
  }

  getBlock(districtId: any) {
    this.scBlockId = "";
    this.schoolId = "";
    this.scPanchayatId = "";
    this.blockData = [];
    this.getSchoolData = [];
    this.panchayatData = [];

    this.scBlockChanged = true;
    if (districtId !== "") {
      this.commonService
        .getBlockByDistrictid(districtId)
        .subscribe((res: any) => {
          this.blockData = res;
          this.blockData = this.blockData?.data;

          if (this.userProfile.block != 0 || this.userProfile.block != "") {
            this.blockData = this.blockData.filter((blo: any) => {
              return blo.blockId == this.userProfile.block;
            });

            this.scBlockId = this.userProfile.block;
            this.getNagarPanchayat(
              this.userProfile.district,
              this.userProfile.block,
              2
            );
            this.scBlockChanged = false;
          } else {
            this.scBlockChanged = false;
          }
          this.scBlockChanged = false;
        });
    } else {
      this.scBlockChanged = false;
    }
  }

  getNagarPanchayat(districtId: any, blockId: any, type: any) {
    this.scPanchayatId = "";
    this.schoolId = "";
    this.getSchoolData = [];
    this.panchayatData = [];
    if (districtId != "") {
      this.scPanchayatChanged = true;
      this.nagarParm = {
        scDistrictId: districtId,
        scBlockId: blockId,
        scType: type,
      };

      this.InspectionMis.getNagarPanchayat(this.nagarParm).subscribe(
        (res: any) => {
          this.panchayatData = res;
          this.panchayatData = this.panchayatData?.data;
          this.scPanchayatChanged = false;
        }
      );
    } else {
      this.panchayatData = [];
      this.scPanchayatId = "";
      this.scPanchayatChanged = false;
    }
  }
  getSchool(nagarId: any) {
    this.schoolId = "";
    this.getSchoolData = [];
    this.scSchoolChanged = true;
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
  getSearchParams() {
    return {
      scDistrictId: this.searchForm.controls["scDistrictId"].value,
      scBlockId: this.searchForm.controls["scBlockId"].value,
      scPanchayatId: this.searchForm.controls["scPanchayatId"].value,
      schoolId: this.searchForm.controls["schoolId"].value,
      startDate: this.searchForm.controls["startDate"].value,
      endDate: this.searchForm.controls["endDate"].value,
      designationGroupId: this.searchForm.controls["designationGroupId"].value,
      scDesignationId: this.searchForm.controls["scDesignationId"].value,
      scClassGroup: this.searchForm.controls["scClassGroup"].value,
      schoolType: this.searchForm.controls["schoolType"].value,
    };
  }

  onSearch() {
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
  loadData(params: any) {
    this.spinner.show();
    const paramObj = {
      scDistrictId: params.scDistrictId,
      scBlockId: params.scBlockId,
      scPanchayatId: params.scPanchayatId,
      schoolId: params.schoolId,
      startDate: params.startDate,
      endDate: params.endDate,
      scDesignationId: this.scDesignationId,
      scClassGroup: this.scClassGroup,
      schoolType : this.schoolType,
    };
    this.isLoading = true;

    if (paramObj.schoolId != "") {
      this.pageLevel = 4;
    } else if (paramObj.scPanchayatId != "") {
      this.pageLevel = 3;
    } else if (paramObj.scBlockId != "") {
      this.pageLevel = 2;
    } else if (paramObj.scDistrictId != "") {
      this.pageLevel = 1;
    } else {
      this.pageLevel = 0;
    }

    this.InspectionMis.studentAttendencePanchBest(paramObj).subscribe({
      next: (res: any) => {
        // this.resultListData.length = previousSize; // set current size
        this.resultListData = res?.data; // merge with existing data
        this.resultListDatas = res?.totalSchool;
        this.numOfVisetedSchool = res?.numOfVisetedSchool;
        this.numOfVisit = res?.numOfVisit;
        this.totalEnrolledBoys = res?.totalEnrolledBoys;
        this.attendanceOnRegisterBoys = res?.attendanceOnRegisterBoys;
        this.attendanceOnRegisterBoysPer = res?.attendanceOnRegisterBoysPer;
        this.actualPresentBoys = res?.actualPresentBoys;
        this.actualPresentBoysPer = res?.actualPresentBoysPer;
        this.totalEnrolledGirls = res?.totalEnrolledGirls;
        this.attendanceOnRegisterGirls = res?.attendanceOnRegisterGirls;
        this.attendanceOnRegisterGirlsPer = res?.attendanceOnRegisterGirlsPer;
        this.actualPresentGirls = res?.actualPresentGirls;
        this.actualPresentGirlsPer = res?.actualPresentGirlsPer;

        this.totalEnrolledTransgender = res?.totalEnrolledTransgender;
        this.attendanceOnRegisterTransgender = res?.attendanceOnRegisterTransgender;
        this.attendanceOnRegisterTransgenderPer = res?.attendanceOnRegisterTransgenderPer;
        this.actualPresentTransgender = res?.actualPresentTransgender;
        this.actualPresentTransgenderPer = res?.actualPresentTransgenderPer;
        this.getDistrictBackId = res?.getDistrictBackId;
        this.getBlockBackId = res?.getBlockBackId;
        this.getPanchayatBackId = res?.getPanchayatBackId;
        this.getSchoolBackId = res?.getSchoolBackId;
        this.getStartDate = res?.startDate;
        this.getEndDate = res?.endDate;
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
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

  goBack(
    distId: any,
    blkId: any,
    panId: any,
    sclId: any,
    level: any,
    startDate: any,
    endDate: any
  ) {
    if (level == 1) {
      this.parVal = {
        scDistrictId: "",
        scBlockId: "",
        scPanchayatId: "",
        schoolId: "",
        scDesignationId: this.scDesignationId,
        scClassGroup: this.scClassGroup,
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
        scBlockId: "",
        scPanchayatId: "",
        schoolId: "",
        scDesignationId: this.scDesignationId,
        scClassGroup: this.scClassGroup,
        startDate: startDate,
        endDate: endDate,
      };

      this.searchForm.controls["scDistrictId"].patchValue(distId);
      this.getBlock(distId);
      this.searchForm.controls["scBlockId"].patchValue("");
      this.loadData(this.parVal);
    }

    if (level == 3) {
      this.parVal = {
        scDistrictId: distId,
        scBlockId: blkId,
        scPanchayatId: "",
        schoolId: "",
        scDesignationId: this.scDesignationId,
        scClassGroup: this.scClassGroup,
        startDate: startDate,
        endDate: endDate,
      };

      this.getNagarPanchayat(distId, blkId, 2);
      this.searchForm.controls["scDistrictId"].patchValue(distId);
      this.searchForm.controls["scBlockId"].patchValue(blkId);
      this.searchForm.controls["scPanchayatId"].patchValue("");

      this.loadData(this.parVal);
    }

    if (level == 4) {
      this.parVal = {
        scDistrictId: distId,
        scBlockId: blkId,
        scPanchayatId: panId,
        schoolId: "",
        scDesignationId: this.scDesignationId,
        scClassGroup: this.scClassGroup,
        startDate: startDate,
        endDate: endDate,
      };

      this.getSchool(panId);
      this.searchForm.controls["scDistrictId"].patchValue(distId);
      this.searchForm.controls["scBlockId"].patchValue(blkId);
      this.searchForm.controls["scPanchayatId"].patchValue(panId);
      this.searchForm.controls["schoolId"].patchValue("");
      this.loadData(this.parVal);
    }
  }

  getData(
    dist: any,
    blk: any,
    pan: any,
    schl: any,
    level: any,
    startDate: any,
    endDate: any
  ) {
    if (blk != "") {
      this.backLevel = 3;
    } else if (dist != "") {
      this.backLevel = 4;
    } else {
      this.backLevel = 5;
    }
    if (this.backLevel != this.loginLevel) {
      if (level == 1) {
        this.parVal = {
          scDistrictId: dist,
          scBlockId: "",
          scPanchayatId: "",
          schoolId: "",
          scDesignationId: this.scDesignationId,
          scClassGroup: this.scClassGroup,
          startDate: startDate,
          endDate: endDate,
        };
        this.scDistrictId = dist;
        this.getBlock(dist);
      }

      if (level == 2) {
        this.parVal = {
          scDistrictId: dist,
          scBlockId: blk,
          scPanchayatId: "",
          schoolId: "",
          scDesignationId: this.scDesignationId,
          scClassGroup: this.scClassGroup,
          startDate: startDate,
          endDate: endDate,
        };
        this.scDistrictId = dist;
        this.scBlockId = blk;
        this.getNagarPanchayat(dist, blk, 2);
      }

      if (level == 3) {
        this.scDistrictId = dist;
        this.scBlockId = blk;
        this.scPanchayatId = pan;
        this.getSchool(pan);
        this.parVal = {
          scDistrictId: dist,
          scBlockId: blk,
          scPanchayatId: pan,
          schoolId: "",
          scDesignationId: this.scDesignationId,
          scClassGroup: this.scClassGroup,
          startDate: startDate,
          endDate: endDate,
        };
      }
      if (level == 4) {
        this.scBlockId = blk;
        this.scPanchayatId = pan;
        this.schoolId = schl;
        this.parVal = {
          scDistrictId: dist,
          scBlockId: blk,
          scPanchayatId: pan,
          schoolId: schl,
          scDesignationId: this.scDesignationId,
          scClassGroup: this.scClassGroup,
          startDate: startDate,
          endDate: endDate,
        };
      }
      this.loadData(this.parVal);
    }
  }

  excel(level: any) {
    this.spinner.show();
    this.csvData = this.getSearchParams();
    this.InspectionMis.studentAttendanceInpPanchCsv(this.csvData).subscribe(
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
              "SL#",
              "District",
              "Numbers Of Schools",
              "Number of visited schools",
              "Number of visits",
              "Enrolled Boys",
              "Present Boys On Register",
              "Present Boys On Register(%)",
              "Actual Boys Present",
              "Actual Boys Present(%)",
              "Enrolled Girls",
              "Present Girls On Register",
              "Present Girls On Register(%)",
              "Actual Girls Present",
              "Actual Girls Present(%)",
              "Enrolled Transgender",
              "Present Transgender On Register",
              "Present Transgender On Register(%)",
              "Actual Transgender Present",
              "Actual Transgender Present(%)"
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
              "SL#",
              "District",
              "Block",
              "Numbers Of Schools",
              "Number of visited schools",
              "Number of visits",
              "Enrolled Boys",
              "Present Boys On Register",
              "Present Boys On Register(%)",
              "Actual Boys Present",
              "Actual Boys Present(%)",
              "Enrolled Girls",
              "Present Girls On Register",
              "Present Girls On Register(%)",
              "Actual Girls Present",
              "Actual Girls Present(%)",
              "Enrolled Transgender",
              "Present Transgender On Register",
              "Present Transgender On Register(%)",
              "Actual Transgender Present",
              "Actual Transgender Present(%)"
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
              "SL#",
              "District",
              "Block",
              "Panchayat",
              "Numbers Of Schools",
              "Number of visited schools",
              "Number of visits",
              "Enrolled Boys",
              "Present Boys On Register",
              "Present Boys On Register(%)",
              "Actual Boys Present",
              "Actual Boys Present(%)",
              "Enrolled Girls",
              "Present Girls On Register",
              "Present Girls On Register(%)",
              "Actual Girls Present",
              "Actual Girls Present(%)",
              "Enrolled Transgender",
              "Present Transgender On Register",
              "Present Transgender On Register(%)",
              "Actual Transgender Present",
              "Actual Transgender Present(%)"
            ],
          };
        }
        if (level == 3 || level == 4) {
          this.csvoptions = {
            fieldSeparator: ",",
            quoteStrings: '"',
            decimalseparator: ".",
            showLabels: true,
            useBom: true,
            headers: [
              "SL#",
              "District",
              "Block",
              "Panchayat",
              "School",
              "Number of visits",
              "Enrolled Boys",
              "Present Boys On Register",
              "Present Boys On Register(%)",
              "Actual Boys Present",
              "Actual Boys Present(%)",
              "Enrolled Girls",
              "Present Girls On Register",
              "Present Girls On Register(%)",
              "Actual Girls Present",
              "Actual Girls Present(%)",
              "Enrolled Transgender",
              "Present Transgender On Register",
              "Present Transgender On Register(%)",
              "Actual Transgender Present",
              "Actual Transgender Present(%)"
            ],
          };
        }

        new ngxCsv(data, "StudentAttendenceInspectionReport", this.csvoptions);
        this.spinner.hide();
      }
    );
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
    if ((this.sessionBlockId = "")) {
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
      scClassGroup: this.scClassGroup,
      schoolUdiseCode: "",
      typeWise: "panWise",
      schoolType:this.schoolType
    };

    this.InspectionMis.exportStuAttenInspectionReport(paramObj).subscribe({
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
