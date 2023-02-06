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
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from "src/environments/environment";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { Router } from "@angular/router";
import { SchoolService } from "src/app/application/school/services/school.service";
import { TeacherTrainingAssessmentService } from "../../services/teacher-training-assessment.service";
@Component({
  selector: "app-assessment-result",
  templateUrl: "./assessment-result.component.html",
  styleUrls: ["./assessment-result.component.css"],
})
export class AssessmentResultComponent implements OnInit {
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
  assessmentAnnexture!: any;
  pageIndex: any = 0;
  previousSize: any = 0;
  userProfile: any = 0;
  public fileUrl = environment.filePath;
  appearStatus: boolean = true; // true:disable,false:enable
  appearData: any;

  demographyData: any = {
    districtData: [],
    blockData: [],
    clusterData: [],
    schoolData: [],
    disrtictChanged: false,
    blockChanged: false,
    clusterChanged: false,
    schoolChanged: false,
    subjectLoad: false,
  };

  userInput: any = {
    districtId: "",
    blockId: "",
    clusterId: "",
    schoolId: "",
    schoolCategory: "",
    subjectId: "",
    assessmentType: "",
  };
  isSearched = true;
  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  subjects: any = [];
  userType: number = 0;
  BASEURL!: string;
  correctImg!:string;
  wrongImg!:string;


  constructor(
    private commonserviceService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper, //For menu privilege
    private router: Router,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private schoolService: SchoolService,
    private teacherTrainingAssessment: TeacherTrainingAssessmentService
  ) {
    const pageUrl: any = this.router.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl); //For menu privilege
    this.commonserviceService.verifyLinkPermission(
      pageUrl,
      this.config.linkType[2],
      this.config.privilege[1]
    ); // For authorization
    this.BASEURL = this.commonserviceService.BASEURL;
    this.correctImg = this.BASEURL+'/assets/img/tick.png';
    this.wrongImg = this.BASEURL+'/assets/img/close.png';
  }

  ngOnInit(): void {
    if (this.plPrivilege == "admin") {
      this.adminPrivilege = true;
      this.displayedColumns = [
        "slNo",
        "traineeName",
        "subject",
        "totalMark",
        "markObtained",
        "action",
      ];
    } else {
      this.displayedColumns = [
        "slNo",
        "traineeName",
        "subject",
        "totalMark",
        "markObtained",
        "action",
      ];
    }
    this.userProfile = this.commonserviceService.getUserProfile(); // get user profile
    this.spinner.show();
    this.getDistrict();
    this.getAnnextureData();
    this.getSubjects(); // get subjects
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
  // get annextures
  getAnnextureData() {
    this.annextureLoad = true;

    this.commonserviceService
      .getCommonAnnexture([
        "ASSESSMENT_TYPE",
        "CLASS_TYPE",
        "STREAM_TYPE",
        "STREAM_GROUP_TYPE",
      ])
      .subscribe({
        next: (res: any) => {
          this.annextureData = res?.data;

          this.assessmentAnnexture = res?.data?.ASSESSMENT_TYPE;
          this.classAnnexture = res?.data?.CLASS_TYPE.filter(
            (item: any): any => {
              if ([2, 3, 6].includes(this.userProfile?.schoolCategory)) {
                return +item.anxtValue > 8; // show classes 9-12
              } else if ([7, 8].includes(this.userProfile?.schoolCategory)) {
                return +item.anxtValue > 8 && +item.anxtValue < 11; // show classes 9-10
              } else if (+this.userProfile?.schoolCategory === 9) {
                return +item.anxtValue > 10 && +item.anxtValue < 12; // show classes 11-12
              }
            }
          );

          this.streamType = this.annextureData?.STREAM_TYPE;
          this.annextureLoad = false;
          this.spinner.hide();
        },
      });
  }
  // get all subjects
  getSubjects() {
    this.demographyData.subjectLoad = true;
    this.teacherTrainingAssessment.getSubject().subscribe({
      next: (response: any) => {
        if (response?.status) {
          this.subjects = response?.data;
        } else {
          this.subjects = [];
        }
        this.demographyData.subjectLoad = false;
      },
    });
  }
  onSearch() {
    // validate
    if (!this.userInput?.assessmentType) {
      this.alertHelper.viewAlert("info", "", "Please select assessment Type.");
      return;
    }
    // reset queryParams
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.previousSize = 0;
    this.spinner.show();
    this.loadData(this.getSearchParams());
    this.isSearched = false;
  }
  loadData(params: Object) {
    this.isLoading = true;
    this.teacherTrainingAssessment.getResult(params).subscribe({
      next: (res: any) => {
        this.resultData.length = this.previousSize; // set current size
        res?.success === true && this.resultData.push(...res?.data); // merge with existing data
        this.resultData.length = res?.totalRecord; // update length
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
        this.isLoading = false;
        this.isNorecordFound = this.resultData.length ? false : true;
        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }
  getSearchParams() {
    if (+this.userProfile?.loginUserTypeId === 1) this.userType = 1; // teacher
    if (+this.userProfile?.loginUserTypeId === 3) this.userType = 2; // officer
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      ...this.userInput,
      userId: this.userProfile?.userId,
      userType: this.userType,
    };
  }
  onViewDetails(traineeResultInfo: any) {
    this.spinner.show();
    this.teacherTrainingAssessment
      .getResultDetails({
        allEncId: traineeResultInfo?.allEncId,
        userType: this.userType,
        assessmentType: this.userInput.assessmentType,
      })
      .subscribe({
        next: (res: any) => {
          if (res?.success === true) {
            this.viewDetails = res?.data;
            console.log(this.viewDetails);
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
  printModal() {
    let cloneTable = document.getElementById("printModal")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonserviceService.printPage(cloneTable, pageTitle);
  }
}
