import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Input,
} from "@angular/core";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { MatTableExporterDirective } from "mat-table-exporter";
import { HttpParams } from "@angular/common/http";
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from "src/environments/environment";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { Router } from "@angular/router";
import { SchoolService } from "src/app/application/school/services/school.service";
import { QuestionBankService } from "../../services/question-bank.service";

@Component({
  selector: "app-all-result",
  templateUrl: "./all-result.component.html",
  styleUrls: ["./all-result.component.css"],
})
export class AllResultComponent implements OnInit {
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
  displayedColumns: string[] = []; // define mat table columns
  resultData: any = [];
  dataSource = new MatTableDataSource(this.resultData);
  //end

  // questionDetailsData!: any;
  // studentResponseData!: any;
  viewDetails!: any;
  assessmentDetails!: any;
  optionVal: any;
  optionstream: any;
  isLoading = false;
  isNorecordFound: boolean = false;
  classAnnexture!: any;
  annextureLoad: boolean = false;
  classWiseSubjects!: any;
  streamType!: any;
  isClassGreaterThanTen: boolean = false;
  subjectLoad: boolean = false;
  streamLoad: boolean = false;
  groupLoad: boolean = false;
  streamGroupTypeLoad: boolean = false;
  annextureData!: any;
  isScienceStreamSelected: boolean = false;
  streamGroupAnnexture!: any;
  selectedClass: any = "";
  selectedStream: any = "";
  selectedGroup: any = "";
  selectedSubject: any = "";
  selectedAssesmentType: any = "";
  selectedsetName: any = "";
  assessmentAnnexture!: any;
  pageIndex: any = 0;
  previousSize: any = 0;
  userProfile: any = 0;
  public fileUrl = environment.filePath;
  appearStatus: boolean = true; // true:disable,false:enable
  appearData: any;

  // Done by : Sailesh Mishra on 28-12-2022
  studentInput: any = "";
  // end

  demographyData: any = {
    districtData: [],
    blockData: [],
    clusterData: [],
    schoolData: [],
    disrtictChanged: false,
    blockChanged: false,
    clusterChanged: false,
    schoolChanged: false,
  };

  userInput: any = {
    studentCode: "",
    studentAadhaar: "",
    districtId: "",
    blockId: "",
    clusterId: "",
    schoolId: "",
    studentInput: "",
    fatherName: "",
    motherName: "",
    dob: "",
    gender: "",
    schoolCategory: "",
  };
  isSearched = true;
  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;

  userId: any = "";
  paramObj: any;
  serviceType: string = "Search";

  constructor(
    private commonserviceService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper, //For menu privilege
    private router: Router,
    private questionBankService: QuestionBankService,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private schoolService: SchoolService
  ) {
    const pageUrl: any = this.router.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl); //For menu privilege
    this.commonserviceService.verifyLinkPermission(
      pageUrl,
      this.config.linkType[2],
      this.config.privilege[1]
    ); // For authorization
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;
  }

  ngOnInit(): void {
    if (this.plPrivilege == "admin") {
      this.adminPrivilege = true;
      this.displayedColumns = [
        "slNo",
        "assessmentMode",
        "studentName",
        "studentCode",
        "assessmentType",
        "class",
        "stream",
        "group",
        "subject",
        "totalMark",
        "markObtained",
      ];
    } else {
      this.displayedColumns = [
        "slNo",
        "assessmentMode",
        "studentName",
        "studentCode",
        "assessmentType",
        "class",
        "stream",
        "group",
        "subject",
        "totalMark",
        "markObtained",
      ];
    }
    this.userProfile = this.commonserviceService.getUserProfile(); // get user profile
    if (
      this.userProfile?.maxClass >= 9 ||
      this.userProfile?.loginId === "supAdmin"
    ) {
      this.spinner.show();
      this.getDistrict();
      this.getAnnextureData();
    }
  }
  // get annextures
  getAnnextureData() {
    this.annextureLoad = true;

    this.commonserviceService
      .getCommonAnnexture(
        ["ASSESSMENT_TYPE", "CLASS_TYPE", "STREAM_TYPE", "STREAM_GROUP_TYPE"],
        true
      )
      .subscribe({
        next: (res: any) => {
          this.annextureData = res?.data;

          this.assessmentAnnexture = res?.data?.ASSESSMENT_TYPE;
          this.classAnnexture = res?.data?.CLASS_TYPE.filter(
            (item: any): any => {
              return (
                +item.anxtValue >= 9 &&
                +item.anxtValue <= this.userProfile?.maxClass
              );
            }
          );

          this.streamType = this.annextureData?.STREAM_TYPE;
          this.annextureLoad = false;
          this.spinner.hide();
        },
      });
  }
  // ===== get class wise subjects
  getSubjects() {
    this.selectedSubject = "";
    this.classWiseSubjects = undefined;

    // 1) get subjects of the selected class
    // 2) if class greater than 10 show stream field
    if (this.selectedClass > 10) {
      this.isClassGreaterThanTen = true;
      this.isScienceStreamSelected = this.selectedStream == 3 ? true : false; // hide stream group
    } else {
      this.isClassGreaterThanTen = false; //else hide
    }

    const classStreamGroupObj = {
      selectedClassId: parseInt(this.selectedClass),
      selectedStreamId: parseInt(this.selectedStream),
      selectedGroupId: parseInt(this.selectedGroup),
    };
    if (
      classStreamGroupObj.selectedClassId > 10 &&
      classStreamGroupObj.selectedStreamId == 3
    ) {
      if (classStreamGroupObj.selectedGroupId > 0)
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
  // on stream change
  getStreamGroupType() {
    this.streamLoad = true;
    if (this.selectedStream == "") this.streamType = undefined;
    // // if science stream selected
    if (parseInt(this.selectedStream) === 3) {
      this.streamGroupAnnexture = this.annextureData?.STREAM_GROUP_TYPE.filter(
        (item: any) => item.anxtValue < 3
      );
      this.isScienceStreamSelected = true; // show stream group
      this.streamGroupTypeLoad = true;
    } else {
      this.isScienceStreamSelected = false; // hide  stream group
      this.streamGroupTypeLoad = false;
      this.selectedGroup = "";
      // reset stream previous group value
    }
    this.streamLoad = false;
    this.streamGroupTypeLoad = false;
  }
  // get calss wise subjects
  getSubjectsClassWise(classId: number) {
    this.subjectLoad = true;
    this.questionBankService.getSubjectsClassWise(classId).subscribe({
      next: (response: any) => {
        if (response?.success === true) {
          this.classWiseSubjects = response?.data;
          this.subjectLoad = false;
        }
      },
    });
  }
  onSearch() {
    // reset queryParams
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.previousSize = 0;

    if (this.validateForm() === true) {
      this.spinner.show();
      this.loadData(this.getSearchParams());
      this.isSearched = false;
    }
  }

  validateForm(): Boolean {
    if (this.selectedAssesmentType === "") {
      this.alertHelper.successAlert(
        "",
        "Please select assessment type.",
        "info"
      );
      return false;
    }
    if (this.selectedClass) {
      if (parseInt(this.selectedClass) >= 11) {
        if (!this.selectedStream) {
          this.spinner.hide();

          this.alertHelper.successAlert("", "Please select stream.", "info");
          return false;
        } else {
          if (parseInt(this.selectedStream) === 3 && !this.selectedGroup) {
            this.spinner.hide();
            this.alertHelper.successAlert("", "Please select group.", "info");
            return false;
          }
        }
      }
    } else {
      this.spinner.hide();
      this.alertHelper.successAlert("", "Please select class.", "info");
      return false;
    }

    return true;
  }
  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      classId: this.selectedClass,
      stream: this.selectedStream,
      group: this.selectedGroup,
      subject: this.selectedSubject,
      assesmentType: this.selectedAssesmentType,
      setId: this.selectedsetName,
      studentInput: this.studentInput,
    };
  }
  // loadData(searchParams: Object) {
  loadData(...params: any) {
    const {
      previousSize,
      offset,
      pageSize,
      classId,
      stream,
      group,
      subject,
      assesmentType,
      setId,
      studentInput,
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      classId: classId,
      stream: stream,
      group: group,
      subject: subject,
      assesmentType: assesmentType,
      schoolId: this.userProfile?.school,
      serviceType: this.serviceType,
      userId: this.userId,
      studentInput: studentInput,
    };
    this.isLoading = true;

    this.questionBankService.getAllResult(this.paramObj).subscribe({
      next: (res: any) => {
        this.resultData.length = previousSize; // set current size
        res?.success === true && this.resultData.push(...res?.data); // merge with existing data
        this.resultData.length = res?.totalRecord; // update length
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
        this.isLoading = false;
        this.isNorecordFound = this.resultData.length ? false : true;
        this.spinner.hide();
        console.log(this.resultData);
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }
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
    this.loadData(this.getSearchParams());
  }
  onDelete(questionId: string) {
    this.alertHelper.deleteAlert().then((result: any) => {
      if (result.value) {
        this.spinner.show();
        this.isLoading = true;
        this.questionBankService.deleteQuestion(questionId).subscribe({
          next: (res: any) => {
            if (res?.success === true) {
              this.loadData(this.getSearchParams());
            } else {
              this.alertHelper.viewAlert("info", res?.msg, "");
            }
            this.isLoading = false;
            this.spinner.show();
          },
          error: (error: any) => {
            this.isLoading = false;
            this.spinner.show();
          },
        });
      }
    });
  }
  onViewDetails(studentResultInfo: any) {
    this.spinner.show();
    const params = {
      studentId: studentResultInfo.studentId,
      questionBankId: studentResultInfo?.questionBankId,
    };
    this.questionBankService.getStudentResultDetails(params).subscribe({
      next: (res: any) => {
        if (res?.success === true) {
          this.viewDetails = res?.data;
        } else {
          this.alertHelper.viewAlert("info", res?.msg, "");
        }
        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }

  getDistrict() {
    this.resetSelection(1);
    this.demographyData.disrtictChanged = true;
    this.commonserviceService.getAllDistrict().subscribe((res: any) => {
      // if demography data present prefill
      if (+this.userProfile?.district) {
        this.getBlock(+this.userProfile.district); // get block
        this.demographyData.districtData = res.data.filter((item: any) => {
          if (+item.districtId === +this.userProfile.district) {
            this.userInput.districtId = item?.districtId;
            return true;
          } else {
            this.userInput.districtId = "";
            return false;
          }
        });
      } else {
        // else show all
        this.demographyData.districtData = res.data;
      }
      this.demographyData.disrtictChanged = false;
    });
  }
  getBlock(districtId: number) {
    this.resetSelection(2);
    if (districtId) {
      this.demographyData.blockChanged = true;
      this.commonserviceService
        .getBlockByDistrictid(districtId)
        .subscribe((res: any) => {
          // if demography data present prefill
          if (+this.userProfile?.block) {
            this.getCluster(+this.userProfile.block); // get cluster
            this.demographyData.blockData = res.data.filter((item: any) => {
              if (+item.blockId === +this.userProfile.block) {
                this.userInput.blockId = item?.blockId;
                return true;
              } else {
                this.userInput.blockId = "";
                return false;
              }
            });
          } else {
            // else show all
            this.demographyData.blockData = res.data;
          }
          this.demographyData.blockChanged = false;
        });
    }
  }
  getCluster(blockId: number) {
    this.resetSelection(3);
    if (blockId) {
      this.demographyData.clusterChanged = true;
      this.commonserviceService
        .getClusterByBlockId(blockId)
        .subscribe((res: any = []) => {
          // if demography data present prefill
          if (+this.userProfile?.cluster) {
            this.getSchool(+this.userProfile.cluster); // get school
            this.demographyData.clusterData = res.data.filter((item: any) => {
              if (+item.clusterId === +this.userProfile.cluster) {
                this.userInput.clusterId = item?.clusterId;
                return true;
              } else {
                this.userInput.clusterId = "";
                return false;
              }
            });
          } else {
            // else show all
            this.demographyData.clusterData = res.data;
          }
          this.demographyData.clusterChanged = false;
        });
    }
  }

  getSchool(clusterId: any) {
    this.demographyData.schoolChanged = true;
    if (clusterId) {
      this.schoolService
        .getSchoolList({ clusterId })
        .subscribe((res: any = []) => {
          // if school login then prefill
          if (+this.userProfile?.udiseCode) {
            this.demographyData.schoolData = res.data.filter((item: any) => {
              if (+item.schoolUdiseCode === +this.userProfile.udiseCode) {
                this.userInput.schoolId = item?.schoolId;
                return true;
              } else {
                this.userInput.clusterId = "";
                return false;
              }
            });
          } else {
            // else show all
            this.demographyData.schoolData = res.data;
          }
          this.demographyData.schoolChanged = false;
        });
    }
  }
  // Done by : Sailesh Mishra on 28-12-2022
  streamName(streamId: number): any {
    for (let key in this.streamType) {
      if (this.streamType[key]?.anxtValue === streamId)
        return this.streamType[key]?.anxtName;
    }
  }
  streamGroupName(streamId: number): any {
    for (let key in this.annextureData?.STREAM_GROUP_TYPE) {
      if (this.annextureData?.STREAM_GROUP_TYPE[key]?.anxtValue === streamId)
        return this.annextureData?.STREAM_GROUP_TYPE[key]?.anxtName;
    }
  }
  // end
  resetSelection(type: number) {
    switch (type) {
      case 1:
        this.demographyData.districtData = [];
        this.demographyData.blockData = [];
        this.demographyData.clusterData = [];
        this.demographyData.schoolData = [];
        this.userInput.districtId = "";
        this.userInput.blockId = "";
        this.userInput.clusterId = "";
        this.userInput.schoolId = "";
        this.userInput.studentName = "";
        this.userInput.fatherName = "";
        this.userInput.motherName = "";
        this.userInput.dob = "";
        this.userInput.gender = "";
        break;
      case 2:
        this.demographyData.blockData = [];
        this.demographyData.clusterData = [];
        this.demographyData.schoolData = [];
        this.userInput.blockId = "";
        this.userInput.clusterId = "";
        this.userInput.schoolId = "";
        break;
      case 3:
        this.demographyData.clusterData = [];
        this.demographyData.schoolData = [];
        this.userInput.clusterId = "";
        this.userInput.schoolId = "";
        break;
      case 4:
        this.demographyData.schoolData = [];
        this.userInput.schoolId = "";
        break;
      default:
        break;
    }
  }
  downloadAllAssessmentResultList() {
    this.spinner.show();
    this.paramObj.serviceType = "Download";

    this.questionBankService.getAllResult(this.paramObj).subscribe({
      next: (res: any) => {
        let filepath = this.fileUrl + "/" + res.data?.replace(".", "~");
        window.open(filepath);
        this.spinner.hide();
      },
      error: (error: any) => {
        this.spinner.hide();
      },
    });
  }
  printPage() {
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonserviceService.printPage(cloneTable, pageTitle);
  }
  classChangeHandler() {
    this.selectedStream = "";
    this.selectedGroup = "";
  }
}
