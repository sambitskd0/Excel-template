/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 30-06-2022
 * Module Name : Question Bank
 * Description : Assessment schedule.
 **/
import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { QuestionBankService } from "../services/question-bank.service";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { MatTableExporterDirective } from "mat-table-exporter";
import { NgxSpinnerService } from "ngx-spinner";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-view-assessment-schedule",
  templateUrl: "./view-assessment-schedule.component.html",
  styleUrls: ["./view-assessment-schedule.component.css"],
})
export class ViewAssessmentScheduleComponent implements OnInit {
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
  // pageSizeOptions: number[] = [10, 25, 100];
  pageSizeOptions: number[] = [10, 25, 100];
  displayedColumns: string[] = [];
  questionBankData: any = [];
  dataSource = new MatTableDataSource(this.questionBankData);
  //end

  optionVal: any;
  optionstream: any;
  isLoading = false;

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
  assessmentAnnexture!: any;
  pageIndex: any = 0;
  previousSize: any = 0;
  isSearched = true;
  isNorecordFound: boolean = false;
  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;

  userId: any = '';
  paramObj: any;
  serviceType: string = "Search";
  public fileUrl = environment.filePath;

  constructor(
    private commonserviceService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper, //For menu privilege
    private router: Router,
    private questionBankService: QuestionBankService,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService
  ) {
    const pageUrl: any = this.router.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl); //For menu privilege
    this.commonserviceService.verifyLinkPermission(
      pageUrl,
      this.config.linkType[2],
      this.config.privilege[1],
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
        "assessmentType",
        "classId",
        "stream",
        "group",
        "subject",
        "dateOfExam",
        "startTime",
        "duration",
        "action",
      ];
    } else {
      this.displayedColumns = [
        "slNo",
        "assessmentType",
        "classId",
        "stream",
        "group",
        "subject",
        "dateOfExam",
        "startTime",
        "duration",
      ];
    }
    this.getAnnextureData();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
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
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      classId: classId,
      stream: stream,
      group: group,
      subject: subject,
      assesmentType: assesmentType,
      serviceType: this.serviceType,
      userId: this.userId
    };
    this.isLoading = true;

    this.questionBankService.getAssessmentScheduleData(this.paramObj).subscribe({
      next: (res: any) => {
        this.questionBankData.length = previousSize; // set current size
        res?.success === true && this.questionBankData.push(...res?.data); // merge with existing data
        this.questionBankData.length = res?.totalRecord; // update length
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
        this.isLoading = false;
        this.isNorecordFound = this.questionBankData.length ? false : true;
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
      .getCommonAnnexture([
        "ASSESSMENT_TYPE",
        "CLASS_TYPE",
        "STREAM_TYPE",
        "STREAM_GROUP_TYPE",
      ], true)
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
  onDelete(element: any) {
    this.alertHelper.deleteAlert().then((result: any) => {
      if (result.value) {
        this.spinner.show();
        this.isLoading = true;
        this.questionBankService
          .deleteAssessmentSchedule(element?.assessmentScheduleId)
          .subscribe({
            next: (res: any) => {
              if (res?.success === true) {
                this.alertHelper
                  .viewAlert("info", "", res?.msg)
                  .then(() => this.loadData(this.getSearchParams()));
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
  // ===== get class wise subjects
  getSubjects() {
    this.selectedSubject = "";
    this.isScienceStreamSelected = false; // hide  stream group
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
    } else {
      this.classWiseSubjects = undefined;
    }

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
  onSearch() {
    this.spinner.show();

    if (this.selectedClass) {
      // reset queryParams
      this.pageIndex = 0;
      this.previousSize = 0;
      this.offset = 0;
      this.questionBankData.splice(0, this.questionBankData.length); // empty current data
      this.dataSource.paginator = this.paginator; // update paginator

      if (parseInt(this.selectedClass) >= 11) {
        if (!this.selectedStream) {
          this.spinner.hide();

          this.alertHelper.successAlert("", "Please select stream.", "info");
          return;
        } else {
          if (parseInt(this.selectedStream) === 3 && !this.selectedGroup) {
            this.spinner.hide();
            this.alertHelper.successAlert("", "Please select group.", "info");
            return;
          }
        }
      }
    } else {
      this.spinner.hide();
      this.alertHelper.successAlert("", "Please select class.", "info");
      return;
    }
    this.isSearched = false;
    this.loadData(this.getSearchParams());
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
    };
  }
  exportExcel() {
    this.exporter.exportTable("xlsx", {
      fileName: "Question_bank",
      columnWidths: [5, 5, 3],
    });
  }
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
  convertTime(time: number): any {
    console.log(time);
  }

  downloadAssessmentScheduleList() {
    this.spinner.show();
    this.paramObj.serviceType = "Download";
    this.questionBankService.getAssessmentScheduleData(this.paramObj).subscribe({
      next: (res: any) => {
        let filepath = this.fileUrl + '/' + res.data?.replace('.', '~');
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
