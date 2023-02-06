import { formatDate } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataTableDirective } from 'angular-datatables';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { ngxCsv } from 'ngx-csv';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { environment } from 'src/environments/environment';
import { InspectionMisService } from '../../services/inspection-mis.service';
import { ManageUserService } from "src/app/application/user/services/manage-user.service";

@Component({
  selector: 'app-teacher-attendance-nagar-wise',
  templateUrl: './teacher-attendance-nagar-wise.component.html',
  styleUrls: ['./teacher-attendance-nagar-wise.component.css']
})
export class TeacherAttendanceNagarWiseComponent implements OnInit {
  public fileUrl1 = environment.filePath;
  datatableElement!: DataTableDirective;
  @ViewChild("searchForm") searchForm!: NgForm;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() mode!: ProgressBarMode;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter!: MatTableExporterDirective;
  userProfile = this.commonService.getUserProfile();
  cardIsDisplayed = true;
  scDistrictId: any = "";
  scBlockId: any = "";
  scBlockLoading: boolean = false;
  scClusterLoading: boolean = false;
  scNagarPanchayatId: any = "";

  scClusterId: any = "";
  schoolId: any = "";
  scDisrtictChanged: boolean = false;
  scBlockChanged: boolean = false;
  scClusterChanged: boolean = false;
  scSchoolChanged: boolean = false;
  isNorecordFound: boolean = false;
  isInitAdmin: boolean = false;
  isLoading = false;
  sessionDistrictId: any =
    this.userProfile.district != 0 ? this.userProfile.district : "";
  sessionBlockId: any =
    this.userProfile.block != 0 ? this.userProfile.block : "";
  sessionClusterId: any =
    this.userProfile.cluster != 0 ? this.userProfile.cluster : "";
  sessionSchoolId: any =
    this.userProfile.school != 0 ? this.userProfile.school : "";
  districtData: any;
  blockData: any;
  clusterData: any;
  getSchoolData: any;
  pageIndex: any = 0;
  previousSize: any = 0;
  pageSize = 10;
  offset = 0;
  currentPage = 0;
  scDisrtictLoading: boolean = false;
  totalRows = 0;
  pageSizeOptions: number[] = [10, 25, 100];
  displayedColumns: string[] = [
    "slNo",
    "school_name",
    "teacher_type"
  ]; // define mat table columns
  resultListData: any = [];
  dataSource = new MatTableDataSource(this.resultListData);
  resultData: any;
  pageLevel: any;
  totalSchoolSum: any;
  totalNoOfVistsSchools: any;
  totalPostedSum: any;
  totalNoOfVistsSum: any;
  totalPercentagePresent: any;
  totalPercentageLeave: any;
  totalPercentageAbsent: any;
  districtName: any;
  blockName: any;
  clusterName: any;
  schoolName: any;
  parVal: any;
  getDistrictBackId: any;
  getNagarngamBackId: any;
  getSchoolBackId: any;
  posts: any;
  startDate: any;
  endDate: any;
  maxDate: any = Date;
  getStartDate: any;
  getEndDate: any;
  totalPercentageOnDuty: any;
  csvoptions: any;
  csvData: any;
  totalPostedSumTechHM: any;
  scNagarPanchayatChanged: boolean = false;
  nagarPanchayat: boolean = true;
  nagarPanchayatData: any;
  nagarParm: any;
  getNagarPanchayatBackId: any;
  nagarnigamName: any;
  totalPresentTechHMs: any;
  authorizedLeaveTechHMs: any;
  unAuthorizedLeaveTechHMs: any;
  onDutyTechHMs: any;

  totalPresentStaffs: any;
  authorizedLeaveStaffs: any;
  unAuthorizedLeaveStaffs: any;
  onDutyStaffs: any;

  totalPercentagePresentTechHM: any;
  totalPercentageAbsentTechHM: any;
  totalPercentageLeaveTechHM: any;
  totalPercentageOnDutyTechHM: any;
  totalPostedSumStaff: any;
  totalPercentagePresentStaff: any;
  totalPercentageLeaveStaff: any;
  totalPercentageAbsentStaff: any;
  totalPercentageOnDutyStaff: any;
  loginLevel: any;
  backLevel: any;
  scDesignationId: any = "";
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
  officialsGroup: any = "";
  schoolType: any = "";

  stateUser: boolean = false;
  distUser: boolean = false;
  blkUser: boolean = false;
  cluUser: boolean = false;
  userLevelId: any = 0;
  scDesignationChanged: boolean = false;
  scDesignationLoading: boolean = false;
  desGrpLoading: boolean = false;
  desGrpSelect: boolean = false;
  DesignationGroupData: any = [];
  designationGroupId:any = "";
  constructor(
    private commonService: CommonserviceService,
    private spinner: NgxSpinnerService,
    private InspectionMis: InspectionMisService,
    private alertHelper: AlertHelper,
    private manageUserService: ManageUserService
  ) {
    this.maxDate = new Date;
  }

  ngOnInit(): void {
    this.getDistrict();
    this.userLevel();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  toggle() {
    this.cardIsDisplayed = !this.cardIsDisplayed;
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

  getDesignationGroup(lvl: any) {
    this.desGrpSelect = true;
    this.desGrpLoading = true;
    this.DesignationGroupData = [];
    this.designationData = [];
    this.manageUserService.getDesignationGroup(lvl).subscribe((res: any) => {
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
        (res: any) => {
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
    this.clusterData = [];
    this.getSchoolData = [];
    this.scBlockId = "";
    this.scClusterId = "";
    this.schoolId = "";

    this.scDisrtictChanged = true;
    this.commonService.getAllDistrict().subscribe((res: []) => {
      this.posts = res;
      this.districtData = this.posts.data;
      if (this.userProfile.district != 0 || this.userProfile.district != "") {
        this.districtData = this.districtData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        this.scDistrictId = this.userProfile.district;
        this.getNagarPanchayat(this.userProfile.district, '', 1);
        this.scDisrtictChanged = false;
      }
      else {
        this.districtData = this.districtData;
        this.scDisrtictChanged = false;
      }
      this.scDisrtictChanged = false;
    });
  }



  getSchool(nagarId: any) {
    this.schoolId = "";
    this.scSchoolChanged = true;

    this.getSchoolData = [];

    if (nagarId != '') {
      this.InspectionMis.getSchoolListNagarWise(nagarId).subscribe((res: any) => {
        this.getSchoolData = res;
        if (this.getSchoolData == null) {
          this.getSchoolData = [];
        } else {

          this.getSchoolData = this.getSchoolData?.data;
        }

        this.scSchoolChanged = false;
      });
    } else {

      this.scSchoolChanged = false;
    }
  }


  onSearch() {
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.previousSize = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    if (this.validateForm() === true) {
      this.loadViewData(this.getSearchParams())
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
      if (formatDate(this.endDate, 'yyyy-MM-dd', 'en_US') < formatDate(this.startDate, 'yyyy-MM-dd', 'en_US')) {
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


  getSearchParams() {

    return {
      scDistrictId: this.searchForm.controls['scDistrictId'].value,
      scNagarPanchayatId: this.searchForm.controls['scNagarPanchayatId'].value,
      schoolId: this.searchForm.controls['schoolId'].value,
      startDate: this.searchForm.controls['startDate'].value,
      endDate: this.searchForm.controls['endDate'].value,
      designationGroupId: this.searchForm.controls["designationGroupId"].value,
      scDesignationId: this.searchForm.controls["scDesignationId"].value,
      officialsGroup: this.searchForm.controls["officialsGroup"].value,
      schoolType: this.searchForm.controls["schoolType"].value,
    };

  }

  loadViewData(params: any) {
    this.spinner.show();
    const paramObj = {

      scDistrictId: params.scDistrictId,
      scNagarPanchayatId: params.scNagarPanchayatId,
      schoolType: this.schoolType,
      schoolId: params.schoolId,
      startDate: params.startDate,
      endDate: params.endDate,
      officialsGroup: params.officialsGroup,
      scDesignationId: this.scDesignationId,

    };
    this.isLoading = true;

    if (paramObj.schoolId != '') {
      this.pageLevel = 3;
    } else if (paramObj.scNagarPanchayatId != '') {
      this.pageLevel = 2;
    } else if (paramObj.scDistrictId != '') {
      this.pageLevel = 1;
    } else {
      this.pageLevel = 0;
    }
    this.InspectionMis.getTeacherAttendanceInspectionNN(paramObj).subscribe({
      next: (res: any) => {
        // this.resultListData.length = params.previousSize; // set current size
        this.resultListData.push(...res?.data); // merge with existing data
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
        // this.getBlockBackId = res?.getBlockBackId;
        this.getNagarngamBackId = res?.getNagarngamBackId;
        this.getSchoolBackId = res?.getSchoolBackId;
        this.getStartDate = res?.startDate;
        this.getEndDate = res?.endDate;
        if (this.pageLevel == 2) {
          this.districtName = res?.districtName;
          this.nagarnigamName = res?.nagarnigamName;
        }
        if (this.pageLevel == 3) {
          this.districtName = res?.districtName;
          this.nagarnigamName = res?.nagarnigamName;
          this.schoolName = res?.schoolName;
        }

      }, error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      }

    });

  }
  printPage() {
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }

  drillDown(district: any, scNagarPanchayatId: any, school: any, startDate: any, endDate: any) {
    this.spinner.show();
    const pramsVal = {
      scDistrictId: district,
      scNagarPanchayatId: scNagarPanchayatId,
      schoolId: school,
      startDate: startDate,
      endDate: endDate,
      officialsGroup: this.officialsGroup,
      scDesignationId: this.scDesignationId,
    }

    if (pramsVal.schoolId != '') {
      this.searchForm.controls['schoolId'].patchValue(pramsVal.schoolId);
    } else if (pramsVal.scNagarPanchayatId != '') {
      this.searchForm.controls['scNagarPanchayatId'].patchValue(pramsVal.scNagarPanchayatId);
      this.getSchool(pramsVal.scNagarPanchayatId);
    } else if (pramsVal.scDistrictId != '') {
      this.searchForm.controls['scDistrictId'].patchValue(pramsVal.scDistrictId);
      this.getNagarPanchayat(pramsVal.scDistrictId, '', 1);

    }
    this.spinner.hide();
    this.loadViewData(pramsVal);
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
        scType: type
      };

      this.InspectionMis.getNagarPanchayat(this.nagarParm).subscribe((res: any) => {
        this.nagarPanchayatData = res;
        this.nagarPanchayatData = this.nagarPanchayatData?.data;
        this.scNagarPanchayatChanged = false;

      });

    } else {
      this.nagarPanchayatData = [];
      this.scNagarPanchayatId = "";
      this.scNagarPanchayatChanged = false;
    }


  }

  goBack(distId: any, scNagarPanchayatId: any, sclId: any, level: any, startDate: any, endDate: any) {
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
          officialsGroup: this.officialsGroup,
          scDesignationId: this.scDesignationId,
        }
        this.getDistrict();
        this.searchForm.controls['scDistrictId'].patchValue('');
        this.loadViewData(this.parVal);
      }

      if (level == 2) {
        this.parVal = {
          scDistrictId: distId,
          scNagarPanchayatId: "",
          schoolId: "",
          startDate: startDate,
          endDate: endDate,
          officialsGroup: this.officialsGroup,
          scDesignationId: this.scDesignationId,
        }

        this.searchForm.controls['scDistrictId'].patchValue(distId);
        this.getNagarPanchayat(distId, '', 1);
        this.searchForm.controls['scNagarPanchayatId'].patchValue('');
        this.loadViewData(this.parVal);

      }

      if (level == 3) {
        this.parVal = {
          scDistrictId: distId,
          scNagarPanchayatId: scNagarPanchayatId,
          schoolId: "",
          startDate: startDate,
          endDate: endDate,
          officialsGroup: this.officialsGroup,
          scDesignationId: this.scDesignationId,
        }
        this.getSchool(scNagarPanchayatId);
        this.searchForm.controls['scDistrictId'].patchValue(distId);
        this.searchForm.controls['scNagarPanchayatId'].patchValue(scNagarPanchayatId);
        this.searchForm.controls['schoolId'].patchValue('');
        this.loadViewData(this.parVal);
      }
    }
  }

  excel(level: any) {

    this.spinner.show();
    this.csvData = this.getSearchParams();
    this.InspectionMis.downloadTeacherAttendanceInpNNCsv(
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
            "Nagarnigam",
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
            "School Name",
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



      new ngxCsv(data, "StaffAttendenceInspectionReport", this.csvoptions);
      this.spinner.hide();
    });
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
