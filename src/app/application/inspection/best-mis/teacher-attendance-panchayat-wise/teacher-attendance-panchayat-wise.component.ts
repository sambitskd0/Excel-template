import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { trigger, style, animate, transition } from "@angular/animations";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { NgForm } from "@angular/forms";
import { ngxCsv } from "ngx-csv/ngx-csv";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { NgxSpinnerService } from "ngx-spinner";
import { DataTableDirective } from "angular-datatables";
import { InspectionMisService } from "../../services/inspection-mis.service";
import { MatTableExporterDirective } from "mat-table-exporter";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { formatDate } from "@angular/common";
import { environment } from "src/environments/environment";
import { ManageUserService } from "src/app/application/user/services/manage-user.service";


@Component({
  selector: "app-teacher-attendance-panchayat-wise",
  templateUrl: "./teacher-attendance-panchayat-wise.component.html",
  styleUrls: ["./teacher-attendance-panchayat-wise.component.css"],
  animations: [
    trigger("fadeSlideInOut", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(-10px)" }),
        animate("500ms", style({ opacity: 1, transform: "translateY(0)" })),
      ]),
      transition(":leave", [
        animate("500ms", style({ opacity: 0, transform: "translateY(-10px)" })),
      ]),
    ]),
  ],
})
export class TeacherAttendancePanchayatWiseComponent implements OnInit {
  public fileUrl1 = environment.filePath;
  maxDate: any = Date;
  nagarParm: any;
  panchayatData: any;
  pageLevel: any;
  parVal: any;

  constructor(
    private commonService: CommonserviceService,
    private spinner: NgxSpinnerService,
    private InspectionMis: InspectionMisService,
    private alertHelper: AlertHelper,
    private manageUserService: ManageUserService
  ) {
    this.maxDate = new Date();
  }
  @ViewChild("searchForm") searchForm!: NgForm;
  @ViewChild(MatSort) sort!: MatSort;
  @Input() mode!: ProgressBarMode;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter!: MatTableExporterDirective;
  resultListData: any = [];
  dataSource = new MatTableDataSource(this.resultListData);
  userProfile = this.commonService.getUserProfile();
  scDistrictId: any = "";
  scBlockId: any = "";
  scPanchayatId: any = "";
  schoolId: any = "";
  districtData: any;
  blockData: any;
  getSchoolData: any;
  scDisrtictChanged: boolean = false;
  scBlockChanged: boolean = false;
  scPanchayatChanged: boolean = false;
  scSchoolChanged: boolean = false;
  isNorecordFound: boolean = false;
  isInitAdmin: boolean = false;
  isLoading = false;
  sessionDistrictId: any =
    this.userProfile.district != 0 ? this.userProfile.district : "";
  sessionBlockId: any =
    this.userProfile.block != 0 ? this.userProfile.block : "";
  sessionSchoolId: any =
    this.userProfile.school != 0 ? this.userProfile.school : "";
  posts: any;
  startDate: any;
  endDate: any;
  cardIsDisplayed = true;
  resultData: any;
  totalSchoolSum: any;
  totalNoOfVistsSum: any;
  totalNoOfVistsSchools: any;
  totalPostedSumTechHM: any;
  totalPercentagePresentTechHM: any;
  totalPercentageLeaveTechHM: any;
  totalPercentageAbsentTechHM: any;
  totalPercentageOnDutyTechHM: any;
  totalPresentTechHMs: any;
  authorizedLeaveTechHMs: any;
  unAuthorizedLeaveTechHMs: any;
  onDutyTechHMs: any;
  totalPresentStaffs: any;
  authorizedLeaveStaffs: any;
  unAuthorizedLeaveStaffs: any;
  onDutyStaffs: any;
  totalPostedSumStaff: any;
  totalPercentagePresentStaff: any;
  totalPercentageLeaveStaff: any;
  totalPercentageAbsentStaff: any;
  totalPercentageOnDutyStaff: any;
  getDistrictBackId: any;
  getBlockBackId: any;
  getPanchayatBackId: any;
  getSchoolBackId: any;
  getStartDate: any;
  getEndDate: any;
  districtName: any;
  blockName: any;
  panchayatName: any;
  schoolName: any;
  csvoptions: any;
  csvData: any;
  loginLevel: any;
  backLevel: any;
  scDesignationId: any = "";
  scDesignationChanged: boolean = false;
  designationData: any;
  degLevel: any;
  sessionDegId: any = this.userProfile.designationId;
  
  totalPostedSumHM: any;
  totalPercentagePresentHM: any;
  totalPercentageLeaveHM: any;
  totalPercentageAbsentHM: any;
  totalPercentageOnDutyHM: any;
  totalPresentHMs: any;
  authorizedLeaveHMs: any;
  unAuthorizedLeaveHMs: any;
  onDutyHMs: any;

  totalPostedSumTech: any;
  totalPercentagePresentTech: any;
  totalPercentageLeaveTech: any;
  totalPercentageAbsentTech: any;
  totalPercentageOnDutyTech: any;
  totalPresentTechs: any;
  authorizedLeaveTechs: any;
  unAuthorizedLeaveTechs: any;
  onDutyTechs: any;
  officialsGroup:any="";
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
    this.blockData = [];
    this.getSchoolData = [];
    this.panchayatData = [];
    this.scBlockId = "";
    this.schoolId = "";
    this.scPanchayatId = "";

    this.scDisrtictChanged = true;
    this.commonService.getAllDistrict().subscribe((res: []) => {
      this.posts = res;
      this.districtData = this.posts.data;
      if (this.userProfile.district != 0 || this.userProfile.district != "") {
        this.districtData = this.districtData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        this.scDistrictId = this.userProfile.district;
        this.getBlock(this.userProfile.district);
        this.scDisrtictChanged = false;
      } else {
        this.districtData = this.districtData;
        this.scDisrtictChanged = false;
      }
      this.scDisrtictChanged = false;
    });
  }

  getBlock(districtId: any) {
    this.scBlockId = "";
    this.scPanchayatId = "";
    this.schoolId = "";
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
            this.getNagarPanchayat(
              this.userProfile.district,
              this.userProfile.block,
              2
            );
            this.scBlockId = this.userProfile.block;
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
    this.panchayatData = [];
    this.getSchoolData = [];
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

  toggle() {
    this.cardIsDisplayed = !this.cardIsDisplayed;
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
      officialsGroup: this.searchForm.controls["officialsGroup"].value,
      schoolType: this.searchForm.controls["schoolType"].value,
    };
  }

  onSearch() {
    if (this.validateForm() === true) {
      this.loadViewData(this.getSearchParams());
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

  drillDown(
    district: any,
    block: any,
    scPanchayatId: any,
    school: any,
    startDate: any,
    endDate: any
  ) {
    this.spinner.show();
    const pramsVal = {
      scDistrictId: district,
      scBlockId: block,
      scPanchayatId: scPanchayatId,
      schoolId: school,
      startDate: startDate,
      endDate: endDate,
      scDesignationId: this.scDesignationId,
      officialsGroup: this.officialsGroup,
      schoolType : this.schoolType,
    };

    if (pramsVal.schoolId != "") {
      this.searchForm.controls["schoolId"].patchValue(pramsVal.schoolId);
    } else if (pramsVal.scPanchayatId != "") {
      this.searchForm.controls["scPanchayatId"].patchValue(
        pramsVal.scPanchayatId
      );
      this.getSchool(pramsVal.scPanchayatId);
    } else if (pramsVal.scBlockId != "") {
      this.searchForm.controls["scBlockId"].patchValue(pramsVal.scBlockId);
      this.getNagarPanchayat(pramsVal.scDistrictId, pramsVal.scBlockId, 2);
    } else if (pramsVal.scDistrictId != "") {
      this.searchForm.controls["scDistrictId"].patchValue(
        pramsVal.scDistrictId
      );
      this.getBlock(pramsVal.scDistrictId);
    }
    this.spinner.hide();
    this.loadViewData(pramsVal);
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
    if (blkId != "") {
      this.backLevel = 3;
    } else if (distId != "") {
      this.backLevel = 4;
    } else {
      this.backLevel = 5;
    }
    if (this.backLevel != this.loginLevel) {
      if (level == 1) {
        this.parVal = {
          scDistrictId: "",
          scBlockId: "",
          scPanchayatId: "",
          schoolId: "",
          startDate: startDate,
          endDate: endDate,
          scDesignationId: this.scDesignationId,
          officialsGroup: this.officialsGroup
        };
        this.getDistrict();
        this.searchForm.controls["scDistrictId"].patchValue("");
        this.loadViewData(this.parVal);
      }

      if (level == 2) {
        this.parVal = {
          scDistrictId: distId,
          scBlockId: "",
          scPanchayatId: "",
          schoolId: "",
          startDate: startDate,
          endDate: endDate,
          scDesignationId: this.scDesignationId,
          officialsGroup: this.officialsGroup
        };

        this.searchForm.controls["scDistrictId"].patchValue(distId);
        this.getBlock(distId);
        this.searchForm.controls["scBlockId"].patchValue("");
        this.loadViewData(this.parVal);
      }

      if (level == 3) {
        this.parVal = {
          scDistrictId: distId,
          scBlockId: blkId,
          scPanchayatId: "",
          schoolId: "",
          startDate: startDate,
          endDate: endDate,
          scDesignationId: this.scDesignationId,
          officialsGroup: this.officialsGroup
        };

        this.getNagarPanchayat(distId, blkId, 2);
        this.searchForm.controls["scDistrictId"].patchValue(distId);
        this.searchForm.controls["scBlockId"].patchValue(blkId);
        this.searchForm.controls["scPanchayatId"].patchValue("");

        this.loadViewData(this.parVal);
      }

      if (level == 4) {
        this.parVal = {
          scDistrictId: distId,
          scBlockId: blkId,
          scPanchayatId: panId,
          schoolId: "",
          startDate: startDate,
          endDate: endDate,
          scDesignationId: this.scDesignationId,
          officialsGroup: this.officialsGroup
        };

        this.getSchool(panId);
        this.searchForm.controls["scDistrictId"].patchValue(distId);
        this.searchForm.controls["scBlockId"].patchValue(blkId);
        this.searchForm.controls["scPanchayatId"].patchValue(panId);
        this.searchForm.controls["schoolId"].patchValue("");
        this.loadViewData(this.parVal);
      }
    }
  }

  loadViewData(params: any) {
    this.spinner.show();
    const paramObj = {
      scDistrictId: params.scDistrictId,
      scBlockId: params.scBlockId,
      scPanchayatId: params.scPanchayatId,
      schoolId: params.schoolId,
      startDate: params.startDate,
      endDate: params.endDate,
      scDesignationId: params.scDesignationId,
      officialsGroup: params.officialsGroup,
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
    this.InspectionMis.getTeacherAttendancePanchayatInspection(
      paramObj
    ).subscribe({
      next: (res: any) => {
        // this.resultListData.length = params.previousSize; // set current size
        // this.resultListData=res?.data; // merge with existing data
        this.resultData = res?.data;
        this.totalSchoolSum = res?.totalSchoolSum;
        this.totalNoOfVistsSum = res?.totalNoOfVistsSum;
        this.totalNoOfVistsSchools = res?.totalNoOfVistsSchools;
        /**hm & teacher */
        this.totalPostedSumTechHM = res?.totalPostedSumTechHM;
        this.totalPercentagePresentTechHM = res?.totalPercentagePresentTechHM;
        this.totalPercentageLeaveTechHM = res?.totalPercentageLeaveTechHM;
        this.totalPercentageAbsentTechHM = res?.totalPercentageAbsentTechHM;
        this.totalPercentageOnDutyTechHM = res?.totalPercentageOnDutyTechHM;
        this.totalPresentTechHMs = res?.totalPresentTechHMs;
        this.authorizedLeaveTechHMs = res?.authorizedLeaveTechHMs;
        this.unAuthorizedLeaveTechHMs = res?.unAuthorizedLeaveTechHMs;
        this.onDutyTechHMs = res?.onDutyTechHMs;
        /**hm */
        this.totalPostedSumHM = res?.totalPostedSumHM;
        this.totalPercentagePresentHM = res?.totalPercentagePresentHM;
        this.totalPercentageLeaveHM = res?.totalPercentageLeaveHM;
        this.totalPercentageAbsentHM = res?.totalPercentageAbsentHM;
        this.totalPercentageOnDutyHM = res?.totalPercentageOnDutyHM;
        this.totalPresentHMs = res?.totalPresentHMs;
        this.authorizedLeaveHMs = res?.authorizedLeaveHMs;
        this.unAuthorizedLeaveHMs = res?.unAuthorizedLeaveHMs;
        this.onDutyHMs = res?.onDutyHMs;
        /**teacher */
        this.totalPostedSumTech = res?.totalPostedSumTech;
        this.totalPercentagePresentTech = res?.totalPercentagePresentTech;
        this.totalPercentageLeaveTech = res?.totalPercentageLeaveTech;
        this.totalPercentageAbsentTech = res?.totalPercentageAbsentTech;
        this.totalPercentageOnDutyTech = res?.totalPercentageOnDutyTech;
        this.totalPresentTechs = res?.totalPresentTechs;
        this.authorizedLeaveTechs = res?.authorizedLeaveTechs;
        this.unAuthorizedLeaveTechs = res?.unAuthorizedLeaveTechs;
        this.onDutyTechs = res?.onDutyTechs;
        /**staf */
        this.totalPresentStaffs = res?.totalPresentStaffs;
        this.authorizedLeaveStaffs = res?.authorizedLeaveStaffs;
        this.unAuthorizedLeaveStaffs = res?.unAuthorizedLeaveStaffs;
        this.onDutyStaffs = res?.onDutyStaffs;
        this.totalPostedSumStaff = res?.totalPostedSumStaff;
        this.totalPercentagePresentStaff = res?.totalPercentagePresentStaff;
        this.totalPercentageLeaveStaff = res?.totalPercentageLeaveStaff;
        this.totalPercentageAbsentStaff = res?.totalPercentageAbsentStaff;
        this.totalPercentageOnDutyStaff = res?.totalPercentageOnDutyStaff;

        this.resultListData.length = res?.totalRecord; // update length
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
        this.isLoading = false;
        this.isNorecordFound = this.resultListData.length ? false : true;
        this.isInitAdmin = true;
        this.spinner.hide();
        this.getDistrictBackId = res?.getDistrictBackId;
        this.getBlockBackId = res?.getBlockBackId;
        this.getPanchayatBackId = res?.getPanchayatBackId;
        this.getSchoolBackId = res?.getSchoolBackId;
        this.getStartDate = res?.startDate;
        this.getEndDate = res?.endDate;
        if (this.pageLevel == 3) {
          this.districtName = res?.districtName;
          this.blockName = res?.blockName;
          this.panchayatName = res?.panchayatName;
        }
        if (this.pageLevel == 4) {
          this.districtName = res?.districtName;
          this.blockName = res?.blockName;
          this.panchayatName = res?.panchayatName;
          this.schoolName = res?.schoolName;
        }
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
    this.InspectionMis.downloadTeacherAttendanceInpPanchCsv(
      this.csvData
    ).subscribe((res: any) => {
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
            "Numbers Of Schools",
            "Number of visited schools",
            "Number of visits",
            
            "Total Posted Head-Master",
            "Present Head-Master (No.)",
            "Present Head-Master (%)",
            "Leave Head-Master (No.)",
            "Leave Head-Master (%)",
            "Absent Head-Master (No.)",
            "Absent Head-Master (%)",
            "On Office Work Head-Master (No.)",
            "On Office Work Head-Master (%)",

            "Total Posted Teacher",
            "Present Teacher (No.)",
            "Present Teacher (%)",
            "Leave Teacher (No.)",
            "Leave Teacher (%)",
            "Absent Teacher (No.)",
            "Absent Teacher (%)",
            "On Office Work Teacher (No.)",
            "On Office Work Teacher (%)",

            "Total Posted Teacher & Head-Master",
            "Present Teacher & Head-Master (No.)",
            "Present Teacher & Head-Master (%)",
            "Leave Teacher & Head-Master (No.)",
            "Leave Teacher & Head-Master (%)",
            "Absent Teacher & Head-Master (No.)",
            "Absent Teacher & Head-Master (%)",
            "On Office Work Teacher & Head-Master (No.)",
            "On Office Work Teacher & Head-Master (%)",

            "Total Posted Staff",
            "Present Staff (No.)",
            "Present Staff (%)",
            "Leave Staff (No.)",
            "Leave Staff (%)",
            "Absent Staff (No.)",
            "Absent Staff (%)",
            "On Office Work Staff (No.)",
            "On Office Work Staff (%)",
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
            "Block",
            "Numbers Of Schools",
            "Number of visited schools",
            "Number of visits",
            
            "Total Posted Head-Master",
            "Present Head-Master (No.)",
            "Present Head-Master (%)",
            "Leave Head-Master (No.)",
            "Leave Head-Master (%)",
            "Absent Head-Master (No.)",
            "Absent Head-Master (%)",
            "On Office Work Head-Master (No.)",
            "On Office Work Head-Master (%)",

            "Total Posted Teacher",
            "Present Teacher (No.)",
            "Present Teacher (%)",
            "Leave Teacher (No.)",
            "Leave Teacher (%)",
            "Absent Teacher (No.)",
            "Absent Teacher (%)",
            "On Office Work Teacher (No.)",
            "On Office Work Teacher (%)",

            "Total Posted Teacher & Head-Master",
            "Present Teacher & Head-Master (No.)",
            "Present Teacher & Head-Master (%)",
            "Leave Teacher & Head-Master (No.)",
            "Leave Teacher & Head-Master (%)",
            "Absent Teacher & Head-Master (No.)",
            "Absent Teacher & Head-Master (%)",
            "On Office Work Teacher & Head-Master (No.)",
            "On Office Work Teacher & Head-Master (%)",

            "Total Posted Staff",
            "Present Staff (No.)",
            "Present Staff (%)",
            "Leave Staff (No.)",
            "Leave Staff (%)",
            "Absent Staff (No.)",
            "Absent Staff (%)",
            "On Office Work Staff (No.)",
            "On Office Work Staff (%)",
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
            "District",
            "Block",
            "Panchayat",
            "Numbers Of Schools",
            "Number of visited schools",
            "Number of visits",
            
            "Total Posted Head-Master",
            "Present Head-Master (No.)",
            "Present Head-Master (%)",
            "Leave Head-Master (No.)",
            "Leave Head-Master (%)",
            "Absent Head-Master (No.)",
            "Absent Head-Master (%)",
            "On Office Work Head-Master (No.)",
            "On Office Work Head-Master (%)",

            "Total Posted Teacher",
            "Present Teacher (No.)",
            "Present Teacher (%)",
            "Leave Teacher (No.)",
            "Leave Teacher (%)",
            "Absent Teacher (No.)",
            "Absent Teacher (%)",
            "On Office Work Teacher (No.)",
            "On Office Work Teacher (%)",

            "Total Posted Teacher & Head-Master",
            "Present Teacher & Head-Master (No.)",
            "Present Teacher & Head-Master (%)",
            "Leave Teacher & Head-Master (No.)",
            "Leave Teacher & Head-Master (%)",
            "Absent Teacher & Head-Master (No.)",
            "Absent Teacher & Head-Master (%)",
            "On Office Work Teacher & Head-Master (No.)",
            "On Office Work Teacher & Head-Master (%)",

            "Total Posted Staff",
            "Present Staff (No.)",
            "Present Staff (%)",
            "Leave Staff (No.)",
            "Leave Staff (%)",
            "Absent Staff (No.)",
            "Absent Staff (%)",
            "On Office Work Staff (No.)",
            "On Office Work Staff (%)",
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
            "SLN#",
            "District",
            "Block",
            "Panchayat",
            "school",
            "Number of visits",
           
            "Total Posted Head-Master",
            "Present Head-Master (No.)",
            "Present Head-Master (%)",
            "Leave Head-Master (No.)",
            "Leave Head-Master (%)",
            "Absent Head-Master (No.)",
            "Absent Head-Master (%)",
            "On Office Work Head-Master (No.)",
            "On Office Work Head-Master (%)",

            "Total Posted Teacher",
            "Present Teacher (No.)",
            "Present Teacher (%)",
            "Leave Teacher (No.)",
            "Leave Teacher (%)",
            "Absent Teacher (No.)",
            "Absent Teacher (%)",
            "On Office Work Teacher (No.)",
            "On Office Work Teacher (%)",

            "Total Posted Teacher & Head-Master",
            "Present Teacher & Head-Master (No.)",
            "Present Teacher & Head-Master (%)",
            "Leave Teacher & Head-Master (No.)",
            "Leave Teacher & Head-Master (%)",
            "Absent Teacher & Head-Master (No.)",
            "Absent Teacher & Head-Master (%)",
            "On Office Work Teacher & Head-Master (No.)",
            "On Office Work Teacher & Head-Master (%)",

            "Total Posted Staff",
            "Present Staff (No.)",
            "Present Staff (%)",
            "Leave Staff (No.)",
            "Leave Staff (%)",
            "Absent Staff (No.)",
            "Absent Staff (%)",
            "On Office Work Staff (No.)",
            "On Office Work Staff (%)",
          ],
        };
      }

      new ngxCsv(
        data,
        "TeacherHmAttendenceInspectionPanchayatWiseReport",
        this.csvoptions
      );
      this.spinner.hide();
    });
  }

  printPage() {
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
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
      if (!res?.data?.length) {
        this.designationData = [];
        this.scDesignationId = "";
        this.scDesignationChanged = false;
      } else {
        this.designationData = res?.data;

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
  exportSchoolList(district:any,block:any,nagar:any,school:any,startDate:any,endDate:any,deg:any)
  {
    this.spinner.show();
    const paramObj = {
      scDistrictId: district,
      scBlockId: block,
      scClusterId: '',
      scNagarId:nagar,
      schoolId: school,
      startDate: startDate,
      endDate: endDate,
      scDesignationId:deg,
      schoolUdiseCode:"",
      typeWise:"panWise",
      schoolType:this.schoolType
    };

    this.InspectionMis.exportTeacherAttenInspectionReport(paramObj).subscribe({
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
