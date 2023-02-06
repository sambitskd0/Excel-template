import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Input,
  EventEmitter,
} from "@angular/core";
import { QuestionBankService } from "../services/question-bank.service";
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
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-view-question-bank",
  templateUrl: "./view-question-bank.component.html",
  styleUrls: ["./view-question-bank.component.css"],
})
export class ViewQuestionBankComponent implements OnInit, AfterViewInit {
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
  questionBankData: any = [];
  questionDetailsData!: any;
  dataSource = new MatTableDataSource(this.questionBankData);
  //end

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
  assessmentScheduleStatus: boolean = true;
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
  public fileUrl = environment.filePath;
  isSearched = true;
  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;

  userId: any = "";
  paramObj: any;
  serviceType: string = "Search";
  ratingArr: any = [];
  starCount: number = 3;
  snackBarDuration: number = 2000;
  ratingUpdated = new EventEmitter();
  rating: number = 0;

  constructor(
    private commonserviceService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper, //For menu privilege
    private router: Router,
    private questionBankService: QuestionBankService,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar
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
    this.spinner.show();
    if (this.plPrivilege == "admin") {
      this.adminPrivilege = true;
      this.displayedColumns = [
        "slNo",
        "question",
        "mark",
        "optionA",
        "optionB",
        "optionC",
        "optionD",
        "answer",
        "action",
      ];
    } else {
      this.displayedColumns = [
        "slNo",
        "question",
        "mark",
        "optionA",
        "optionB",
        "optionC",
        "optionD",
        "answer",
      ];
    }
    this.getAnnextureData();
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      classId: classId,
      stream: stream,
      group: group,
      subject: subject,
      assesmentType: assesmentType,
      setId: setId,
      serviceType: this.serviceType,
      userId: this.userId,
    };

    this.isLoading = true;

    this.questionBankService.getQuestionBankData(this.paramObj).subscribe({
      next: (res: any) => {
        this.questionBankData.length = previousSize; // set current size
        res?.success === true && this.questionBankData.push(...res?.data); // merge with existing data
        this.questionBankData.length = res?.totalRecord; // update length
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
        this.isLoading = false;
        this.isNorecordFound = this.questionBankData.length ? false : true;
        this.assessmentScheduleStatus = res?.assessmentScheduleStatus; // if assessmentScheduleStatus is false then edit,delete not allowed
        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
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
            (item: any) => item.anxtValue > 8 // show classes 9-12
          );

          this.streamType = this.annextureData?.STREAM_TYPE;
          this.annextureLoad = false;
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
    const questionDetails: Object = {
      questionId,
      ...this.getSearchParams(),
    };

    this.alertHelper.deleteAlert().then((result: any) => {
      if (result.value) {
        this.spinner.show();
        this.isLoading = true;
        this.questionBankService.deleteQuestion(questionDetails).subscribe({
          next: (res: any) => {
            if (res?.success === true) {
              this.alertHelper
                .viewAlert("info", "", res?.msg)
                .then(() => this.loadData(this.getSearchParams()));
            } else {
              this.alertHelper.viewAlert("info", "", res?.msg);
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
  // on stream change
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
  onSearch() {
    // reset queryParams
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.previousSize = 0;

    if (this.validateForm() === true) {
      this.isSearched = false;
      this.spinner.show();
      this.loadData(this.getSearchParams());
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

    if (this.selectedSubject === "") {
      this.alertHelper.successAlert("", "Please select subject.", "info");
      return false;
    }
    if (this.selectedsetName === "") {
      this.alertHelper.successAlert("", "Please select set name.", "info");
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
    };
  }
  exportExcel() {
    this.exporter.exportTable("xlsx", {
      fileName: "Question_bank",
      columnWidths: [5, 5, 3],
    });
  }
  // view question
  onViewQuestion(questionBankId: string) {
    this.spinner.show();
    this.questionBankService.getQuestionDetails(questionBankId).subscribe({
      next: (res: any) => {
        if (res?.success === true) {
          this.questionDetailsData = res?.data; // merge with existing data
        }
        this.spinner.hide();
      },
      error: (error: any) => {
        this.spinner.hide();
      },
    });
  }

  // for csv
  downloadQuestionBankList() {
    this.spinner.show();
    this.paramObj.serviceType = "Download";
    this.questionBankService.getQuestionBankData(this.paramObj).subscribe({
      next: (res: any) => {
        let filepath = this.fileUrl + "/" + res?.replace(".", "~");
        window.open(filepath);
        this.spinner.hide();
      },
      error: (error: any) => {
        this.spinner.hide();
      },
    });
  }

  //for print
  printPage() {
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonserviceService.printPage(cloneTable, pageTitle);
  }

  // star icon
  starIconHandler(index: number) {
    if (this.rating >= index + 1) {
      return "star";
    } else {
      return "star_border";
    }
  }
  // star count
  starCountHandler(rating: number) {
    this.rating = rating;
    console.log(rating);
  }
  // Material table pagination size options :: Sambit Kumar Dalai:: 10-11-2022
  get getPageSizeOptions(): number[] {
    return this.dataSource?.paginator &&
      this.dataSource?.paginator?.length > 200
      ? [10, 30, 50, 100, this.dataSource.paginator.length]
      : [10, 30, 50, 100, 200];
  }

  classChangeHandler() {
    this.selectedStream = "";
    this.selectedGroup = "";
  }
}
