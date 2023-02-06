import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators, NgForm } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { MatTableExporterDirective } from "mat-table-exporter";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { Constant } from "src/app/shared/constants/constant";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { environment } from "src/environments/environment";
import { ManageStudentGradeService } from "../../master/services/manage-student-grade.service";
import { QuestionBankService } from "../../question-bank/services/question-bank.service";
import { SchoolService } from "../../school/services/school.service";
import { RemedialTrainningService } from "../services/remedial-trainning.service";

@Component({
  selector: "app-view-remedial-training",
  templateUrl: "./view-remedial-training.component.html",
  styleUrls: ["./view-remedial-training.component.css"],
})
export class ViewRemedialTrainingComponent implements OnInit {
  paramObj: any;
  serviceType: string = "Search";
  public fileUrl = environment.filePath;
  @ViewChild("searchForm") searchForm!: NgForm;
  public userProfile = JSON.parse(
    sessionStorage.getItem("userProfile") || "{}"
  );
  public show: boolean = true;
  public buttonName: any = "Show";
  isVisible: any;
  isSelected: boolean = true;
  isRemedialTrainingData: boolean = false;
  noDataFound: boolean = false;
  optionVal: any;
  optionstream: any;
  config = new Constant();
  loginUserType: any = "";
  clusterName: any = "";
  schoolName: any = "";
  blockName: any = "";
  districtName: any = "";
  villageName: any = "";
  schoolUdiseCode: any = "";
  schoolInfoData: any;
  academicYear: any = this.config.getAcademicCurrentYear();
  userId: any = "";
  profileId: any = "";
  schoolId: any;
  classId: any = "";
  streamId: any = "";
  groupId: any = "";
  examType: any = "";
  subjectId: any = "";
  grade: any = "";
  isCatchupClass: any = "2";
  classData: any;
  streamData: any;
  groupData: any;
  subjectData: any;
  gradeData: any;
  remedialTrainingData: any;
  classAnnextureData: any;
  submitted: boolean = false;
  remedialTrainingSearchForm!: FormGroup;
  classWiseSubjects!: any;
  isClassGreaterThanTen: boolean = false;
  allLabelForSearchForm: string[] = [
    "",
    "",
    "",
    "Exam Type",
    "Catchup Class",
    "Class",
    "Stream",
    "Group",
    "Subject",
    "Grade",
  ];

  subjectLoad: boolean = false;
  streamLoad: boolean = false;
  groupLoad: boolean = false;
  classLoad: boolean = false;

  isInitAdmin: boolean = false;

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
  // start define mat table reference columns
  displayedColumns: string[] = [
    "slNo",
    "Academic_Year",
    "Student_Code",
    "Name",
    "Exam_Term",
    "Class",
    "Stream",
    "Group",
    "Subject",
    "Grade",
    "Catchup_Class",
    "Remove_Student",
  ]; // end define mat table columns

  resultListData: any = [];
  dataSource = new MatTableDataSource(this.resultListData);

  //end Material Table Variable and Decorators

  searchAcademicYear: any = "";
  searchDistrictId: any = "";
  searchBlockId: any = "";
  searchClusterId: any = "";
  searchSchoolId: any = "";

  scDisrtictSelect: boolean = true;
  scDisrtictLoading: boolean = false;
  scBlockSelect: boolean = true;
  scBlockLoading: boolean = false;
  scClusterSelect: boolean = true;
  scClusterLoading: boolean = false;
  scSchoolSelect: boolean = true;
  scSchoolLoading: boolean = false;

  searchDistrictData: any = [];
  searchBlockData: any = [];
  districtData: any = [];
  getSchoolData: any = [];
  clusterData: any = [];
  examTypeData: any = [];
  classChanged: boolean = false;
  plPrivilege: string = "view"; //For menu privilege
  adminPrivilege: boolean = false;
  constructor(
    private commonService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper, //For menu privilege
    private router: Router,
    private schoolService: SchoolService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private managestudentgradeservice: ManageStudentGradeService,
    public customValidators: CustomValidators,
    private remedialTrainningService: RemedialTrainningService,
    private alertHelper: AlertHelper,
    private questionBankService: QuestionBankService
  ) {
    const pageUrl: any = this.router.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl); //For menu privilege
    this.commonService.verifyLinkPermission(
      pageUrl,
      this.config.linkType[2],
      this.config.privilege[1]
    ); // For authorization
  }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    this.getExamTypeData();
    this.searchAcademicYear = this.academicYear;
    const userProfile = this.commonService.getUserProfile();
    this.getDistrict();
    this.schoolId = userProfile?.school;
    this.userId = userProfile?.userId;
    this.loginUserType = userProfile?.loginUserType;
    if (this.schoolId !== 0 && this.schoolId !== "") {
      this.getSchoolInfo(this.schoolId, this.academicYear);
    }
    this.getStudentGrade();
    this.initializeFormForSearch();
    if (userProfile.loginUserTypeId == 2) {
      this.getSchoolClasses(this.schoolId);
      this.getSchoolInfo(this.schoolId, this.academicYear);
      this.viewRemedialTraining(this.getSearchParams());
      this.isRemedialTrainingData = true;
      this.spinner.hide();
    } else {
      this.isInitAdmin = true;
      this.isRemedialTrainingData = false;
      this.spinner.hide();
    }
  }
  // ===========initialize Datasource after complete Component Load
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  getExamTypeData() {
    this.commonService
      .getCommonAnnexture(["EXAM_TERM_TYPE"])
      .subscribe((data: any = []) => {
        this.examTypeData = data?.data?.EXAM_TERM_TYPE
      });
  }
  // ==============Get serch Parameters For Material Table
  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      schoolId: this.schoolId,
      searchAcademicYear: this.searchAcademicYear,
      searchDistrictId: this.searchDistrictId,
      searchBlockId: this.searchBlockId,
      searchClusterId: this.searchClusterId,
      searchSchoolId: this.searchSchoolId,
      examType: this.examType,
      isCatchupClass: this.isCatchupClass,
      classId: this.classId,
      streamId: this.streamId,
      groupId: this.groupId,
      subjectId: this.subjectId,
      grade: this.grade,
    };
  }
  // ===========For Updation Table If Page Changes
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
    this.viewRemedialTraining(this.getSearchParams());
  }
  onSearch() {
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    this.viewRemedialTraining(this.getSearchParams());
    this.isInitAdmin = false;
    this.isRemedialTrainingData = true;
  }
  getSchoolInfo(schoolId: any, academicYear: any) {
    this.spinner.show();
    this.schoolService
      .getSchoolInfo(schoolId, academicYear)
      .subscribe((res: any) => {
        this.schoolInfoData = res.data[0];
        this.districtName = this.schoolInfoData?.districtName;
        this.blockName = this.schoolInfoData?.blockName;
        this.clusterName = this.schoolInfoData?.clusterName;
        this.villageName = this.schoolInfoData?.villageName;
        this.schoolName = this.schoolInfoData?.schoolName;
        this.schoolUdiseCode = this.schoolInfoData?.schoolUdiseCode;
        this.spinner.hide();
      });
  }
  initializeFormForSearch() {
    this.remedialTrainingSearchForm = this.formBuilder.group({
      userId: [this.userId],
      schoolId: [this.schoolId],
      academicYear: [this.academicYear],
      examType: [this.examType, Validators.required],
      isCatchupClass: [this.isCatchupClass],
      classId: [this.classId, Validators.required],
      streamId: [this.streamId],
      groupId: [this.groupId],
      subjectId: [this.subjectId, Validators.required],
      grade: [this.grade],
    });
  }
  examTypeChange(val: any) {
    this.remedialTrainingSearchForm?.patchValue({
      streamId: "",
    });
    this.remedialTrainingSearchForm?.patchValue({
      groupId: "",
    });
    this.remedialTrainingSearchForm?.patchValue({
      classId: "",
    });
    this.classId = "";
    this.classData = [];
    this.streamData = [];
    this.groupData = [];
    this.classWiseSubjects = [];
    this.examType = val;
    if (this.examType !== "") {
      this.getClassName(this.examType);
    } else {
      this.remedialTrainingSearchForm?.patchValue({
        classId: "",
      });
      this.remedialTrainingSearchForm?.patchValue({
        streamId: "",
      });
      this.remedialTrainingSearchForm?.patchValue({
        groupId: "",
      });
    }
  }
  getSchoolClasses(schoolEncId: string) {
    if (schoolEncId !== "") {
      this.schoolService
        .getSchoolClasses(schoolEncId)
        .subscribe((res: any = []) => {
          this.classAnnextureData = res.data;
        });
    }
  }
  getSchoolWiseClasses(schoolId: any) {
    this.remedialTrainingSearchForm?.patchValue({
      examType: "",
    });
    this.remedialTrainingSearchForm?.patchValue({
      streamId: "",
    });
    this.remedialTrainingSearchForm?.patchValue({
      groupId: "",
    });
    this.remedialTrainingSearchForm?.patchValue({
      sectionId: "",
    });
    this.classData = [];
    this.classId = "";
    this.examType = "";
    if (schoolId !== "") {
      this.schoolService
        .getSchoolWiseClasses(schoolId)
        .subscribe((res: any = []) => {
          this.classAnnextureData = res.data;
        });
    }
  }
  getClassName(examinationTypeId: any) {
    this.classLoad = true;
    this.commonService
      .getClassByTermId(examinationTypeId)
      .subscribe((data: any = []) => {
        this.classData = data?.data[0]?.classId;
        const classArr = this.classAnnextureData.filter((item: any) =>
          this.classData.includes(item?.classId)
        );
        this.classData = classArr; 
      });
      this.classLoad = false;
  }
  classChange(val: any) {
    this.remedialTrainingSearchForm?.patchValue({
      streamId: "",
    });
    this.remedialTrainingSearchForm?.patchValue({
      groupId: "",
    });
    this.classId = val;
    this.streamId = "";
    if (this.classId !== "") {
      if (this.classId == 11 || this.classId == 12) {
        this.getStream();
      }
    } else {
      this.remedialTrainingSearchForm?.patchValue({
        classId: "",
      });
      this.remedialTrainingSearchForm?.patchValue({
        streamId: "",
      });
    }
  }
  streamChange(val: any) {
    this.remedialTrainingSearchForm?.patchValue({
      groupId: "",
    });
    this.streamId = val;
    if (this.streamId == 3) {
      this.getGroup();
    } else {
      this.groupId = "";
    }
  }
  getStream() {
    this.streamLoad = true;
    this.commonService
      .getCommonAnnexture(["STREAM_TYPE"])
      .subscribe((data: any = []) => {
        this.streamData = data?.data?.STREAM_TYPE;
      });
      this.streamLoad = false;
  }
  getGroup() {
    this.groupLoad = true;
    this.commonService
      .getCommonAnnexture(["STREAM_GROUP_TYPE"])
      .subscribe((data: any = []) => {
        this.groupData = data?.data?.STREAM_GROUP_TYPE;
      });
      this.groupLoad = false;
  }
  // ===== get class wise subjects
  getSubjects() {
    this.subjectId = "";
    const classStreamGroupObj = {
      selectedClassId: parseInt(this.classId),
      selectedStreamId: parseInt(this.streamId),
      selectedGroupId: parseInt(this.groupId),
    };
    if (
      classStreamGroupObj.selectedClassId > 10 &&
      classStreamGroupObj.selectedStreamId == 3 &&
      classStreamGroupObj.selectedGroupId > 0
    ) {
      this.getSubjectsClassStreamGroupWise(classStreamGroupObj);
    } else if (
      classStreamGroupObj.selectedClassId > 10 &&
      classStreamGroupObj.selectedStreamId > 0
    ) {
      this.getSubjectsClassStreamGroupWise(classStreamGroupObj);
    } else if (
      classStreamGroupObj.selectedClassId > 0 &&
      classStreamGroupObj.selectedClassId < 11
    ) {
      this.getSubjectsClassStreamGroupWise(classStreamGroupObj);
    } else {
      this.classWiseSubjects = undefined;
    }
    // 1) get subjects of the selected class
    // 2) if class greater than 10 show stram field
    if (classStreamGroupObj.selectedClassId > 10) {
      this.isClassGreaterThanTen = true;
    } else {
      this.isClassGreaterThanTen = false; //else hide
    }
    if (classStreamGroupObj.selectedClassId < 11) {
      // reset stream and group previous stream value
      this.remedialTrainingSearchForm?.patchValue({
        streamId: "",
      });
      this.remedialTrainingSearchForm?.patchValue({
        groupId: "",
      });
    }
  }
  // get calss wise subjects
  getSubjectsClassStreamGroupWise(classStreamGroupObj: object) {
    this.subjectLoad = true;
    this.questionBankService
      .getSubjectsClassStreamGroupWise(classStreamGroupObj)
      .subscribe({
        next: (response: any) => {
          if (response?.success === true) {
            this.classWiseSubjects = response?.data;
          }
          this.subjectLoad = false;
        },
      });
  }
  getStudentGrade() {
    this.managestudentgradeservice
      .viewStudentGradeMaster()
      .subscribe((data: any) => {
        this.gradeData = data.data;
      });
  }
  //  View Remedial Training Data
  viewRemedialTraining(...params: any) {
    this.submitted = true;
    this.spinner.show(); // ==== show spinner
    const {
      previousSize,
      offset,
      pageSize,
      searchAcademicYear,
      searchDistrictId,
      searchBlockId,
      searchClusterId,
      searchSchoolId,
      examType,
      isCatchupClass,
      classId,
      streamId,
      groupId,
      subjectId,
      grade,
      schoolId,
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      searchAcademicYear: searchAcademicYear,
      searchDistrictId: searchDistrictId,
      searchBlockId: searchBlockId,
      searchClusterId: searchClusterId,
      searchSchoolId: searchSchoolId,
      examType: examType,
      isCatchupClass: isCatchupClass,
      classId: classId,
      streamId: streamId,
      groupId: groupId,
      subjectId: subjectId,
      grade: grade,
      schoolId: schoolId,
      serviceType:this.serviceType,
      userId:this.userId
    };
    this.isLoading = true;
    this.remedialTrainningService.viewRemedialTraining(this.paramObj).subscribe({
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
  printPage() {
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }
  downLoadRemedialTrainingList() {
    this.spinner.show();
    this.paramObj.serviceType = "Download";
    this.remedialTrainningService.viewRemedialTraining(this.paramObj).subscribe({
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
  isCatchupClassControl(val: any) {
    this.examType= "",
    this.classId= "",
    this.streamId= "",
    this.groupId= "";
    this.subjectId= "",
    this.grade= "",
    this.classData=[];
    this.examTypeData=[];
    this.classWiseSubjects=[];
    this.isCatchupClass = val;
    if(this.isCatchupClass==1){
      this.classData=this.classAnnextureData;
    }else{
      this.getExamTypeData();
      this.getStudentGrade();
    }
  }
  // Delete RemadialTraning Data
  removeStudentFromRemedialTraining(id: any) {
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.alertHelper
      .deleteAlert("Are you sure to delete?", "", "question", "Yes, delete it!")
      .then((result) => {
        if (result.value) {
          this.spinner.show();
          this.isLoading = true;
          this.remedialTrainningService
            .removeStudentFromRemedialTraining(id, this.userId,this.profileId)
            .subscribe({
              next: (res: any) => {
                if (res?.success === true) {
                  this.alertHelper.successAlert(
                    "Deleted!",
                    "Deleted Successfully",
                    "success"
                  );
                  this.viewRemedialTraining(this.getSearchParams());
                } else {
                  this.alertHelper.viewAlert("info", res?.msg, "");
                }
                this.isLoading = false;
                this.spinner.hide();
              },
              error: (error: any) => {
                this.isLoading = false;
                this.spinner.hide();
              },
            });
        }
      });
  }
  toggle() {
    this.show = !this.show;
    if (this.show) this.buttonName = "Hide";
    else this.buttonName = "Show";
  }
}
