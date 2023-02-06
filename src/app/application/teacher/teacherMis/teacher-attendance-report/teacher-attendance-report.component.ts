import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormBuilder, NgForm } from "@angular/forms";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { TeacherMisService } from "../../services/teacher-mis.service";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { environment } from "src/environments/environment";
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-teacher-attendance-report',
  templateUrl: './teacher-attendance-report.component.html',
  styleUrls: ['./teacher-attendance-report.component.css']
})
export class TeacherAttendanceReportComponent implements OnInit {


  public fileUrl1 = environment.filePath;
  userProfile = this.commonService.getUserProfile();
  @ViewChild("searchForm") searchForm!: NgForm;
  sps: any = /[^a-zA-Z0-9]/g
  scDisrtictSelect: boolean = false;
  scDisrtictLoading: boolean = false;
  scBlockSelect: boolean = false;
  scBlockLoading: boolean = false;
  scClusterSelect: boolean = false;
  scClusterLoading: boolean = false
  scSchoolSelect: boolean = false;
  teacherAppointmentChanged: boolean = false;
  teacherAppointmentTypeChanged: boolean = false;
  schoolManagementChanged: boolean = false;
  scSchoolLoading: boolean = false;
  isLoading: boolean = false;
  isNorecordFound: boolean = false;
  isInitAdmin: boolean = false;
  districtData: any = [];
  blockData: any = [];
  clusterData: any = [];
  schoolData: any = [];
  teacherAppointment: any = [];
  teacherAppointmentType: any = [];
  schoolManagement: any = [];
  schoolCatData: any = [];
  resultListData: any = [];
  teacherListModalResponse: any = [];
  teacherSocialCategory: any = [];
  sumData: any = [];
  getBackData: any = [];
  paramTeacherList: any = [];
  paramBack: any = [];
  scDistrictId: any = "";
  scBlockId: any = "";
  scClusterId: any = "";
  scSchoolId: any = "";
  searchNatureOfAppointmt: any = "";
  attendanceDate: any = "";
  selManagement: any = "";
  appointmtType: any = "";
  modalHeading: any = "";
  resultListDataLength: any = 0;
  schoolCatDataLegth: any = 0;
  colSpanTotal: any = 0;
  pageLevel: any = 0;
  paramVal: any
  sessionPageLvl: any
  loadDataParam: any
  paramDrillDown: any
  sumTotalTeacher: any
  maxDate: any = new Date;
  sumTotalSchool:any =0;
  sumTotalPresent:any =0;
  sumTotalAbsent:any =0;

  pageSize = 10;
  offset = 0;
  currentPage = 0;
  totalRows = 0;
  previousSize: any = 0;
  pageIndex: any = 0;
  constructor(
    private commonService: CommonserviceService,
    private teacherMisService: TeacherMisService,
    private spinner: NgxSpinnerService,
    private alertHelper: AlertHelper
  ) { }

  ngOnInit(): void {
    this.getDistrict();
    this.getAnnextureDataBySeq();
    this.getsessionPageLvl();
  }
  getsessionPageLvl() {
    if (this.userProfile.school != '' || this.userProfile.school != 0) {
      this.sessionPageLvl = 4;
    } else if (this.userProfile.cluster != '' || this.userProfile.cluster != 0) {
      this.sessionPageLvl = 3;
    } else if (this.userProfile.block != '' || this.userProfile.block != 0) {
      this.sessionPageLvl = 2;
    } else if (this.userProfile.district != '' || this.userProfile.district != 0) {
      this.sessionPageLvl = 1;
    } else {
      this.sessionPageLvl = 0;
    }
  }
  getDistrict() {
    this.scDisrtictSelect = true;
    this.scDisrtictLoading = true;
    this.commonService.getAllDistrict().subscribe((data: any) => {
      this.districtData = data;
      this.districtData = this.districtData.data;

      if (this.userProfile.district != 0 || this.userProfile.district != "") {
        this.districtData = this.districtData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        this.scDistrictId = this.userProfile.district;
        this.getBlock(this.userProfile.district);
      } else {
        this.districtData = this.districtData;
        this.scDisrtictSelect = false;
      }

      this.scBlockId = "";
      this.scDisrtictLoading = false;
    });
  }


  getBlock(districtId: any) {
    this.scBlockSelect = true;
    this.scBlockLoading = true;

    this.blockData = [];
    this.scBlockId = "";
    this.clusterData = [];
    this.scClusterId = "";
    this.schoolData = [];
    this.scSchoolId = "";

    if (districtId !== "") {
      this.commonService
        .getBlockByDistrictid(districtId)
        .subscribe((res: any) => {
          this.blockData = res;
          this.blockData = this.blockData.data;

          if (this.userProfile.block != 0 || this.userProfile.block != "") {
            this.blockData = this.blockData.filter((blo: any) => {
              return blo.blockId == this.userProfile.block;
            });
            this.scBlockId = this.userProfile.block;
            this.getCluster(this.userProfile.block);
          } else {
            this.scBlockSelect = false;
          }
          this.scBlockLoading = false;
        });
    } else {
      this.scBlockSelect = false;
      this.scBlockLoading = false;
    }
  }

  getCluster(blockId: any) {
    this.scClusterSelect = true;
    this.scClusterLoading = true;
    this.clusterData = [];
    this.scClusterId = "";
    this.schoolData = [];
    this.scSchoolId = "";
    if (blockId !== "") {
      this.commonService.getClusterByBlockId(blockId).subscribe((res: any) => {
        this.clusterData = res;
        this.clusterData = this.clusterData.data;

        if (this.userProfile.cluster != 0 || this.userProfile.cluster != "") {
          this.clusterData = this.clusterData.filter((clu: any) => {
            return clu.clusterId == this.userProfile.cluster;
          });
          this.scClusterId = this.userProfile.cluster
          this.getSchool(this.userProfile.cluster);
        } else {
          this.scClusterSelect = false;
        }
        this.scClusterLoading = false;
      });
    } else {
      this.scClusterSelect = false;
      this.scClusterLoading = false;
    }
  }

  getSchool(clusterId: any) {

    this.scSchoolSelect = true;
    this.scSchoolLoading = true;

    this.schoolData = [];
    this.scSchoolId = "";
    if (clusterId !== "") {
      var cluster = {
        clusterId: clusterId
      }
      this.teacherMisService.getschool(cluster).subscribe((res: any) => {
        this.schoolData = res;
        this.schoolData = this.schoolData.data;

        if (this.userProfile.udiseCode != 0 || this.userProfile.udiseCode != "") {
          this.schoolData = this.schoolData.filter((sch: any) => {

            return sch.schoolUdiseCode == this.userProfile.udiseCode;
          });
          this.scSchoolId = this.schoolData[0]['schoolId'];
        } else {
          this.scSchoolSelect = false;
        }
        this.scSchoolLoading = false;
      });
    } else {
      this.scSchoolSelect = false;
      this.scSchoolLoading = false;
    }
  }
  getAnnextureDataBySeq() {
    this.teacherAppointmentChanged = true;
    this.teacherAppointmentTypeChanged = true;
    this.schoolManagementChanged = true;
    this.spinner.show();
    this.commonService
      .getCommonAnnexture([
        "NATURE_OF_APPOINTMENT", "APPOINTMENT_TYPE", "SCHOOL_MANAGEMENT", "TEACHER_SOCIAL_CATEGORY"
      ], true)
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          this.teacherAppointment = res?.data?.NATURE_OF_APPOINTMENT;
          this.teacherAppointmentType = res?.data?.APPOINTMENT_TYPE;
          this.schoolManagement = res?.data?.SCHOOL_MANAGEMENT;
          this.teacherSocialCategory = res?.data?.TEACHER_SOCIAL_CATEGORY;
          this.teacherAppointmentChanged = false;
          this.teacherAppointmentTypeChanged = false;
          this.schoolManagementChanged = false;
        },
      });
  }

  printPage() {
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }
  onSearch() {
    if (this.attendanceDate === "") {
      this.alertHelper.viewAlert(
        "error",
        "Required",
        "Please select attendance date."
      );
      return;
    }
    this.paramVal = {
      scDistrictId: this.scDistrictId,
      scBlockId: this.scBlockId,
      scClusterId: this.scClusterId,
      scSchoolId: this.scSchoolId,
      searchNatureOfAppointmt: this.searchNatureOfAppointmt,
      appointmtType: this.appointmtType,
      selManagement: this.selManagement,
      attendanceDate: formatDate(this.attendanceDate, 'yyyy-MM-dd', 'en_US'),
      serviceType: "report"
    }


    this.loadData(this.paramVal);
  }
  loadData(params: any) {
    this.loadDataParam = {
      scDistrictId: params.scDistrictId,
      scBlockId: params.scBlockId,
      scClusterId: params.scClusterId,
      scSchoolId: params.scSchoolId,
      searchNatureOfAppointmt: params.searchNatureOfAppointmt,
      appointmtType: params.appointmtType,
      selManagement: params.selManagement,
      attendanceDate: params.attendanceDate,
      serviceType: "report"
    }
    this.spinner.show();
    this.teacherMisService.loadTeacherAttendanceData(this.loadDataParam).subscribe({
      next: (res: any) => {
        this.resultListDataLength = res?.length; // set current size
        this.resultListData = res?.data; // merge with existing data
        this.pageLevel = res?.pageLevel
        this.getBackData = res?.getBackData
        this.colSpanTotal = res?.pageLevel + 2;
        this.sumTotalTeacher = res?.sumTotalTeacher;
        this.sumTotalSchool = res?.sumTotalSchool;
        this.sumTotalPresent = res?.sumTotalPresent;
        this.sumTotalAbsent = res?.sumTotalAbsent;
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


  teacherList(scDistrictId: any = "", scBlockId: any = "", scClusterId: any = "", scSchoolId: any = "", searchNatureOfAppointmt: any = "", appointmtType: any = "",selManagement:any = "",attendanceDate:any="",type:any) {
    this.spinner.show();
    this.teacherListModalResponse = [];
    this.paramTeacherList = {
      scDistrictId: scDistrictId,
      scBlockId: scBlockId,
      scClusterId: scClusterId,
      scSchoolId: scSchoolId,
      searchNatureOfAppointmt: searchNatureOfAppointmt,
      appointmtType: appointmtType,
      selManagement: selManagement,
      attendanceDate: attendanceDate,
      type:type
    }
    
    
      this.teacherMisService.teacherList(this.paramTeacherList).subscribe({
        next: (res: any) => {
          this.teacherListModalResponse = res?.data;
          if(type == 1){//totalTeacherList
          this.modalHeading = "Total Teacher List";
          }else if(type == 2){
            this.modalHeading = "Total Present Teacher List";
          }else if(type == 3){
            this.modalHeading = "Total Absent Teacher List";
          }
          this.spinner.hide();
        },
        error: (error: any) => {
          this.isLoading = false;
          this.spinner.hide();
        },
  
      });
    
  }
  drillDown(scDistrictId: any, scBlockId: any, scClusterId: any, scSchoolId: any, searchNatureOfAppointmt: any, appointmtType: any,selManagement:any,attendanceDate:any) {
    this.paramDrillDown = {
      scDistrictId: scDistrictId,
      scBlockId: scBlockId,
      scClusterId: scClusterId,
      scSchoolId: scSchoolId,
      searchNatureOfAppointmt: searchNatureOfAppointmt,
      appointmtType: appointmtType,
      selManagement: selManagement,
      attendanceDate: attendanceDate,
      serviceType: "report"
    }
    if (scDistrictId != '') {
      this.scDistrictId = scDistrictId;
      this.getBlock(scDistrictId);
    }
    if (scBlockId != '') {
      this.scBlockId = scBlockId;
      this.getCluster(scBlockId);
    }
    if (scClusterId != '') {
      this.scClusterId = scClusterId;
      this.getSchool(scClusterId);
    }
    if (scSchoolId != '') {
      this.scSchoolId = scSchoolId;

    }
    this.loadData(this.paramDrillDown);
  }

  goBack(pglvl: any) {
 
    if (pglvl == 4) {
      this.paramBack = {
        scDistrictId: this.scDistrictId,
        scBlockId: this.scBlockId,
        scClusterId: this.scClusterId,
        scSchoolId: "",

        searchNatureOfAppointmt: this.searchNatureOfAppointmt,
        appointmtType: this.appointmtType,
        selManagement: this.selManagement,
        attendanceDate: formatDate(this.attendanceDate, 'yyyy-MM-dd', 'en_US'),
        serviceType: "report"
      }
      this.scSchoolId = '';
      this.loadData(this.paramBack);
    } else if (pglvl == 3) {
      this.paramBack = {
        scDistrictId: this.scDistrictId,
        scBlockId: this.scBlockId,
        scClusterId: '',
        scSchoolId: '',

        searchNatureOfAppointmt: this.searchNatureOfAppointmt,
        appointmtType: this.appointmtType,
        selManagement: this.selManagement,
        attendanceDate: formatDate(this.attendanceDate, 'yyyy-MM-dd', 'en_US'),
        serviceType: "report"
      }
      this.scClusterId = ''
      this.schoolData = [];
      this.loadData(this.paramBack);
    } else if (pglvl == 2) {
      this.paramBack = {
        scDistrictId: this.scDistrictId,
        scBlockId: '',
        scClusterId: '',
        scSchoolId: '',
        searchNatureOfAppointmt: this.searchNatureOfAppointmt,
        appointmtType: this.appointmtType,
        selManagement: this.selManagement,
        attendanceDate: formatDate(this.attendanceDate, 'yyyy-MM-dd', 'en_US'),
        serviceType: "report"
      }
      this.clusterData = [];
      this.scBlockId = '';
      this.loadData(this.paramBack);
    } else if (pglvl == 1) {
      this.paramBack = {
        scDistrictId: '',
        scBlockId: '',
        scClusterId: '',
        scSchoolId: '',

        searchNatureOfAppointmt: this.searchNatureOfAppointmt,
        appointmtType: this.appointmtType,
        selManagement: this.selManagement,
        attendanceDate: formatDate(this.attendanceDate, 'yyyy-MM-dd', 'en_US'),
        serviceType: "report"
      }
      this.blockData = []
      this.scDistrictId = '';
      this.loadData(this.paramBack);
    }
  }

  exportTeacherReport() {
    if (this.scDistrictId == '') {
      this.alertHelper.viewAlert(
        "error",
        "Required",
        "Please select district."
      );
      return;
    }
    this.spinner.show();
    this.paramVal = {
      scDistrictId: this.scDistrictId,
      scBlockId: this.scBlockId,
      scClusterId: this.scClusterId,
      scSchoolId: this.scSchoolId,
      searchNatureOfAppointmt: this.searchNatureOfAppointmt,
      appointmtType: this.appointmtType,
      serviceType: "excel"
    };

    this.teacherMisService.exportTeacherReport(this.paramVal).subscribe({
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
  execl() {
    this.spinner.show();
    this.paramVal = {
      scDistrictId: this.scDistrictId,
      scBlockId: this.scBlockId,
      scClusterId: this.scClusterId,
      scSchoolId: this.scSchoolId,
      searchNatureOfAppointmt: this.searchNatureOfAppointmt,
      appointmtType: this.appointmtType,
      selManagement: this.selManagement,
      attendanceDate: formatDate(this.attendanceDate, 'yyyy-MM-dd', 'en_US'),
      serviceType: "excel"
    }
    this.teacherMisService.exportTeacherAttendanceData(this.paramVal).subscribe({
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