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
import { Subject } from 'rxjs';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { environment } from 'src/environments/environment';

import { InspectionMisService } from '../../services/inspection-mis.service';
import { ManageUserService } from "src/app/application/user/services/manage-user.service";

@Component({
  selector: 'app-student-attendance-report-nagar-wise',
  templateUrl: './student-attendance-report-nagar-wise.component.html',
  styleUrls: ['./student-attendance-report-nagar-wise.component.css']
})
export class StudentAttendanceReportNagarWiseComponent implements OnInit {

  @ViewChild("searchForm") searchForm!: NgForm;
  public show: boolean = true;
  public buttonName: any = 'Show';

  csvoptions: any;
  csvData: any;

  displayTable: boolean = false;
  isLoading = false;
  isNorecordFound: boolean = false;
  tattenlength: boolean = false;
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
  displayedColumns: string[] = [
    "slNo",
    "District_Name",
    "block_code",
    "block_name",

    "Num_of_schools",
    "Num_of_visited_schools",
    "Num_of_visits",
    "Open",
    "close",
  ]; // define mat table columns
  public fileUrl1 = environment.filePath;
  resultListData: any = [];
  resultListDatas: any = [];
  questionDetailsData!: any;
  dataSource = new MatTableDataSource(this.resultListData);
  //end
  bodyData: any; @ViewChild(DataTableDirective, { static: false })
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
  scBlockId: any = "";
  scClusterId: any = "";
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
  label: any;
  totalEnrolledBoys: any;
  actualPresentGirls: any;
  attendanceOnRegisterGirls: any;
  totalEnrolledGirls: any;
  actualPresentBoys: any;
  attendanceOnRegisterBoys: any;
  totalEnrolledTransgender: any;
  attendanceOnRegisterTransgender: any;
  actualPresentTransgender: any;
  scDisrtictSelect: boolean = true;
  scDisrtictLoading: boolean = false;
  scBlockSelect: boolean = true;
  scBlockLoading: boolean = false;
  scClusterSelect: boolean = true;
  scClusterLoading: boolean = false;
  scSchoolSelect: boolean = true;
  scSchoolLoading: boolean = false;
  pageLevel: any;
  getDistrictBackId: any;
  getBlockBackId: any;
  getClusterBackId: any;
  getSchoolBackId: any;
  getStartDate: any;
  getEndDate: any;
  parVal: any;


  scNagarPanchayatId: any = "";

  scNagarPanchayatChanged: boolean = false;
  nagarPanchayat: boolean = true;
  nagarPanchayatData: any;
  nagarParm: any;
  getNagarPanchayatBackId: any;
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
  scClassGroup: any = "";
  actualPresentTransgenderPer: any;
  attendanceOnRegisterTransgenderPer: any;
  actualPresentGirlsPer: any;
  attendanceOnRegisterGirlsPer: any;
  actualPresentBoysPer: any;
  attendanceOnRegisterBoysPer: any;
  schoolType: any = "";

  designationGroupId: any = 0;
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

  getSearchParams() {
    return {
      scDistrictId: this.searchForm.controls['scDistrictId'].value,
      scNagarPanchayatId: this.searchForm.controls['scNagarPanchayatId'].value,
      schoolId: this.searchForm.controls['schoolId'].value,
      startDate: this.searchForm.controls['startDate'].value,
      endDate: this.searchForm.controls['endDate'].value,
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
    if (this.designationGroupId !== "0") {
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

  loadData(params: any) {
    this.spinner.show();
    const paramObj = {
      scDistrictId: params.scDistrictId,
      scNagarPanchayatId: params.scNagarPanchayatId,
      schoolId: params.schoolId,
      startDate: params.startDate,
      endDate: params.endDate,
      scDesignationId: this.scDesignationId,
      scClassGroup: this.scClassGroup,
      schoolType: this.schoolType,
    };
    if (paramObj.schoolId != '') {
      this.pageLevel = 3;
    } else if (paramObj.scNagarPanchayatId != '') {
      this.pageLevel = 2;
    } else if (paramObj.scDistrictId != '') {
      this.pageLevel = 1;
    } else {
      this.pageLevel = 0;
    }
    this.isLoading = true;
    this.InspectionMis.attendanceNigamWiseReport(paramObj).subscribe({
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
        this.getClusterBackId = res?.getClusterBackId;
        this.getSchoolBackId = res?.getSchoolBackId;
        this.getNagarPanchayatBackId = res?.getNagarPanchayatBackId;
        this.getStartDate = res?.startDate;
        this.getEndDate = res?.endDate;
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
        this.isLoading = false;
        this.isNorecordFound = this.resultListData.length ? false : true;
        this.isInitAdmin = true;
        if (this.pageLevel == 2 || this.pageLevel == 3) {
          this.districtName = res?.districtName;
          this.nagarnigamName = res?.nagarnigamName;
          this.schoolName = res?.schoolName;
        }
        this.spinner.hide();


      }, error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      }

    });

  }

  getData(distId: any, scNagarPanchayatId: any, sclId: any, level: any, startDate: any, endDate: any) {

    if (level == 1) {
      this.scDistrictId = distId;
      this.getNagarPanchayat(distId, '', 1);
      this.parVal = {
        scDistrictId: distId,
        scNagarPanchayatId: "",
        schoolId: "",
        scClassGroup: this.scClassGroup,
        startDate: startDate,
        endDate: endDate
      }
    }



    if (level == 2) {
      this.scDistrictId = distId;
      this.scNagarPanchayatId = scNagarPanchayatId;
      this.getSchool(scNagarPanchayatId);
      this.parVal = {
        scDistrictId: distId,
        scNagarPanchayatId: scNagarPanchayatId,
        schoolId: "",
        scClassGroup: this.scClassGroup,
        startDate: startDate,
        endDate: endDate
      }
    }
    if (level == 3) {
      this.scDistrictId = distId;
      this.scNagarPanchayatId = scNagarPanchayatId;
      this.schoolId = sclId;
      this.parVal = {
        scDistrictId: distId,
        scNagarPanchayatId: scNagarPanchayatId,
        schoolId: sclId,
        scClassGroup: this.scClassGroup,
        startDate: startDate,
        endDate: endDate
      }
    }

    this.loadData(this.parVal);

  }

  goBack(distId: any, blkId: any, scNagarPanchayatId: any, sclId: any, level: any, startDate: any, endDate: any) {
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
          scClassGroup: this.scClassGroup,
          startDate: startDate,
          endDate: endDate
        }
        this.getDistrict();
        this.searchForm.controls['scDistrictId'].patchValue('');
        this.loadData(this.parVal);
      }

      if (level == 2) {
        this.parVal = {
          scDistrictId: distId,
          scNagarPanchayatId: "",
          schoolId: "",
          scClassGroup: this.scClassGroup,
          startDate: startDate,
          endDate: endDate
        }
        this.getNagarPanchayat(distId, '', 1);
        this.searchForm.controls['scDistrictId'].patchValue(distId);
        this.searchForm.controls['scNagarPanchayatId'].patchValue(scNagarPanchayatId);
        this.loadData(this.parVal);
      }

      if (level == 3) {
        this.parVal = {
          scDistrictId: distId,
          scNagarPanchayatId: scNagarPanchayatId,
          schoolId: "",
          scClassGroup: this.scClassGroup,
          startDate: startDate,
          endDate: endDate
        }
        this.getSchool(scNagarPanchayatId);
        this.searchForm.controls['scDistrictId'].patchValue(distId);
        this.searchForm.controls['scNagarPanchayatId'].patchValue(scNagarPanchayatId);
        this.searchForm.controls['schoolId'].patchValue('');
        this.loadData(this.parVal);
      }
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
        this.searchForm.controls['scDistrictId'].patchValue(this.userProfile.district);
        this.getNagarPanchayat(this.userProfile.district, '', 1);
      }
      else {
        this.districtData = this.districtData;
        this.scDisrtictSelect = false;
      }

      this.scNagarPanchayatId = '';
      this.scDisrtictSelect = false;
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

  printPage() {
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }
  toggle() {
    this.show = !this.show;
    if (this.show)
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }


  excel(level: any) {

    this.spinner.show();
    this.csvData = this.getSearchParams();
    this.InspectionMis.attendanceNigamWiseReportCsv(
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
            "Nagar Nigam Name",
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

      if (level == 2 || level == 3) {
        this.csvoptions = {
          fieldSeparator: ",",
          quoteStrings: '"',
          decimalseparator: ".",
          showLabels: true,
          useBom: true,
          headers: [
            "SL#",
            "District",
            "Nagarnigam Name",
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
    });
  }

  getNagarPanchayat(districtId: any, blockId: any, type: any) {
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
      scClassGroup: this.scClassGroup,
      startDate: startDate,
      endDate: endDate,
      scDesignationId: deg,
      schoolUdiseCode: "",
      typeWise: "nagarWise",
      schoolType: this.schoolType
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
