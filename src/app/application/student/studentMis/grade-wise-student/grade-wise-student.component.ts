import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormBuilder, NgForm } from "@angular/forms";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { environment } from "src/environments/environment";
import { StudentMisService } from "../../services/student-mis.service";
import { StudentMisSecService } from "../../services/student-mis-sec.service";
import { Constant } from 'src/app/shared/constants/constant';

@Component({
  selector: 'app-grade-wise-student',
  templateUrl: './grade-wise-student.component.html',
  styleUrls: ['./grade-wise-student.component.css']
})
export class GradeWiseStudentComponent implements OnInit {
  public fileUrl1 = environment.filePath;
  userProfile = this.commonService.getUserProfile();
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();
  @ViewChild("searchForm") searchForm!: NgForm;
  scDisrtictSelect: boolean = false;
  scDisrtictLoading: boolean = false;
  scBlockSelect: boolean = false;
  scBlockLoading: boolean = false;
  scClusterSelect: boolean = false;
  scClusterLoading: boolean = false;
  scSchoolSelect: boolean = false;
  scSchoolLoading: boolean = false;
  scClassSelect: boolean = false;
  scClassLoading: boolean = false;
  scSubjectSelect: boolean = false;
  scSubjectLoading: boolean = false;
  scExamTypeSelect: boolean = false;
  scExamTypeLoading: boolean = false;
  scStreamSelect: boolean = false;
  scStreamLoading: boolean = false;
  scGroupSelect: boolean = false;
  scGroupLoading: boolean = false;
  streamSection: boolean = false;
  groupSection: boolean = false;
  isLoading: boolean = false;
  isNorecordFound: boolean = false;
  isInitAdmin: boolean = false;


  scDistrictId: any = "";
  scBlockId: any = "";
  scClusterId: any = "";
  scSchoolId: any = "";
  scClassId: any = "";
  scSubjectId: any = "";
  searchAcademicYear :any = "";
  scExamTypeId: any = "";
  scStreamId: any = "";
  scGroupId: any = "";
  resultListDataLength: any = 0;
  sessionPageLvl: any;
  pageLevel: any;
  colSpanTotal: any;

  paramBack: any = [];
  districtData: any = [];
  blockData: any = [];
  clusterData: any = [];
  schoolData: any = [];
  classData: any = [];
  subjectData: any = [];
  examTypeData: any = [];
  streamData: any = [];
  groupData: any = [];
  paramVal: any = [];
  resultListData: any = [];
  sumData: any = [];
  getBackData: any = [];
  paramDrillDown: any = [];
  paramValLoadData: any = [];
  constructor(private commonService: CommonserviceService, private studentMis: StudentMisService, private studentMisSec: StudentMisSecService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.searchAcademicYear = this.academicYear;
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
    this.classData = [];
    this.scClassId = "";
    this.streamSection = false;
    this.scStreamId = "";
    this.groupSection = false;
    this.scGroupId = "";

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
    this.classData = [];
    this.scClassId = "";
    this.streamSection = false;
    this.scStreamId = "";
    this.groupSection = false;
    this.scGroupId = "";
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
    this.classData = [];
    this.scClassId = "";
    this.streamSection = false;
    this.scStreamId = "";
    this.groupSection = false;
    this.scGroupId = "";
    if (clusterId !== "") {
      var cluster = {
        clusterId: clusterId
      }
      this.commonService.getSchoolList(cluster).subscribe((res: any) => {
        this.schoolData = res;
        this.schoolData = this.schoolData.data;

        if (this.userProfile.udiseCode != 0 || this.userProfile.udiseCode != "") {
          this.schoolData = this.schoolData.filter((sch: any) => {

            return sch.schoolUdiseCode == this.userProfile.udiseCode;
          });
          this.scSchoolId = this.schoolData[0]['schoolId'];
          this.getClasses(this.scSchoolId);
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

  getClasses(schoolId: any) {
    this.scClassSelect = true;
    this.scClassLoading = true;
    this.studentMisSec.getClass(schoolId).subscribe((res: any) => {
      this.classData = res;
      this.classData = this.classData.data;
      this.scClassSelect = false;
      this.scClassLoading = false;
    });
  }
  getSubject(classId: any, stream: any, group: any) {
    // this.scStreamId = "";
    // this.scGroupId = "";
    this.scSubjectSelect = true;
    this.scSubjectLoading = true;
    this.studentMisSec.getSubject(classId, stream, group).subscribe((res: any) => {
      this.subjectData = res;
      this.subjectData = this.subjectData.data;
      this.scSubjectSelect = false;
      this.scSubjectLoading = false;
    });
  }

  getAnnextureDataBySeq() {
    this.scExamTypeSelect = true;
    this.scExamTypeLoading = true;
    this.scStreamSelect = true;
    this.scStreamLoading = true;
    this.scGroupSelect = true;
    this.scGroupLoading = true;
    this.spinner.show();
    this.commonService
      .getCommonAnnexture([
        "EXAM_TERM_TYPE", "STREAM_TYPE", "STREAM_GROUP_TYPE"
      ], true)
      .subscribe({
        next: (res: any) => {
          this.examTypeData = res?.data?.EXAM_TERM_TYPE
          this.streamData = res?.data?.STREAM_TYPE
          this.groupData = res?.data?.STREAM_GROUP_TYPE
          this.scExamTypeSelect = false;
          this.scExamTypeLoading = false;
          this.scStreamSelect = false;
          this.scStreamLoading = false;
          this.scGroupSelect = false;
          this.scGroupLoading = false;
          this.spinner.hide();
        },
      });
  }
  streamSec(classId: any) {
    this.scStreamId = "";
    this.scGroupId = "";
    this.streamSection = false;
    this.groupSection = false;
    if (classId > 10) {
      this.streamSection = true;
      this.scStreamId = "";
    } else {
      this.streamSection = false;
      this.scStreamId = "";
      this.groupSection = false;
      this.scGroupId = "";
    }


  }
  groupSec(val: any) {
    this.groupSection = false;
    this.scGroupId = "";
    this.groupSection = false;
    this.scGroupId = "";
    if (val == 3) {
      this.groupSection = true;
      this.scGroupId = "";
    } else {
      this.groupSection = false;
      this.scGroupId = "";
    }

  }
  onSearch() {
    this.paramVal = {
      scDistrictId: this.scDistrictId,
      scBlockId: this.scBlockId,
      scClusterId: this.scClusterId,
      scSchoolId: this.scSchoolId,
      scClassId: this.scClassId,
      scStreamId: this.scStreamId,
      scGroupId: this.scGroupId,
      scSubjectId: this.scSubjectId,
      scExamTypeId: this.scExamTypeId,
      searchAcademicYear: this.searchAcademicYear
    }
    this.loadData(this.paramVal);
  }
  loadData(params: any) {
    this.spinner.show();
    this.paramValLoadData = {
      scDistrictId: params.scDistrictId,
      scBlockId: params.scBlockId,
      scClusterId: params.scClusterId,
      scSchoolId: params.scSchoolId,
      scClassId: params.scClassId,
      scStreamId: params.scStreamId,
      scGroupId: params.scGroupId,
      scSubjectId: params.scSubjectId,
      scExamTypeId: params.scExamTypeId,
      searchAcademicYear: params.searchAcademicYear
    }
    this.studentMisSec.getGradeWiseReport(this.paramValLoadData).subscribe({
      next: (res: any) => {
        this.resultListDataLength = res?.length; // set current size
        this.resultListData = res?.data; // merge with existing data
        this.sumData = res?.sumTotal;
        this.pageLevel = res?.pageLevel
        this.getBackData = res?.getBackData
        this.colSpanTotal = res?.pageLevel + 2;
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

  drillDown(scDistrictId: any, scBlockId: any, scClusterId: any, scSchoolId: any, scClassId: any, scStreamId: any, scGroupId: any,scSubjectId :any, scExamTypeId: any,searchAcademicYear:any) {
    this.paramDrillDown = {
      scDistrictId: scDistrictId,
      scBlockId: scBlockId,
      scClusterId: scClusterId,
      scSchoolId: scSchoolId,
      scClassId: scClassId,
      scStreamId: scStreamId,
      scGroupId: scGroupId,
      scSubjectId: scSubjectId,
      scExamTypeId: scExamTypeId,
      searchAcademicYear: searchAcademicYear,
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
      this.getClasses(scSchoolId);

    }
    this.loadData(this.paramDrillDown);
  }

  printPage() {
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;

    console.log(cloneTable);
    this.commonService.printPage(cloneTable, pageTitle);
  }



  goBack(pglvl: any) {
    if (pglvl == 4) {
      this.paramBack = {
        scDistrictId: this.scDistrictId,
        scBlockId: this.scBlockId,
        scClusterId: this.scClusterId,
        scSchoolId: "",
        scClassId: this.scClassId,
        scStreamId: this.scStreamId,
        scGroupId: this.scGroupId,
        scSubjectId: this.scSubjectId,
        scExamTypeId: this.scExamTypeId,
        searchAcademicYear: this.searchAcademicYear,
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
        scClassId: this.scClassId,
        scStreamId: this.scStreamId,
        scGroupId: this.scGroupId,
        scSubjectId: this.scSubjectId,
        scExamTypeId: this.scExamTypeId,
        searchAcademicYear: this.searchAcademicYear,
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
        scClassId: this.scClassId,
        scStreamId: this.scStreamId,
        scGroupId: this.scGroupId,
        scSubjectId: this.scSubjectId,
        scExamTypeId: this.scExamTypeId,
        searchAcademicYear: this.searchAcademicYear,
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
        scClassId: this.scClassId,
        scStreamId: this.scStreamId,
        scGroupId: this.scGroupId,
        scSubjectId: this.scSubjectId,
        scExamTypeId: this.scExamTypeId,
        searchAcademicYear: this.searchAcademicYear,
        serviceType: "report"
      }
      this.blockData = []
      this.scDistrictId = '';
      this.loadData(this.paramBack);
    }
  }

}
