/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 30-06-2022
 * Module Name : Training
 * Description : View training assessment schedule.
 **/
import {
  Component,
  OnInit,
  ViewChild,
  Input,
  HostListener,
} from "@angular/core";
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
import { SelfTrainingRequestService } from "../services/self-training-request.service";
import { TeacherTrainingAssessmentService } from "../services/teacher-training-assessment.service";
import { formatDate } from '@angular/common';

@Component({
  selector: "app-view-assessment-schedule",
  templateUrl: "./view-assessment-schedule.component.html",
  styleUrls: ["./view-assessment-schedule.component.css"],
})
export class ViewAssessmentScheduleComponent
  extends Constant
  implements OnInit
{
  @HostListener("document:keyup", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    +event?.which === 13 && this.onSearch();
  }
  plPrivilege: string = "view"; //For menu privilege
  loadingObj: any = {
    trainingLoad: false,
    subjectLoad: false,
  };

  trainingData: any = [];
  scheduleData: any = [];
  subjects: any = [];
  userProfile!: any;

  userInput: any = {
    subjectId: "",
    trainingId: "",
    academicYear: this.getAcademicCurrentYear(),
  };
  // mat table
  @Input() mode!: ProgressBarMode;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSize = 10;
  pageIndex = 0;
  offset = 0;
  currentPage = 0;
  totalRows = 0;
  pageSizeOptions = [10, 25, 100];
  displayedColumns = [
    "slNo",
    "academicYear",
    "subject",
    "trainingName",
    "trainingStartDate",
    "trainingEndDate",
    // "preAssessmentDate",
    // "preAssessmentStartTime",
    // "postAssessmentDate",
    // "postAssessmentStartTime",
    "duration",
    "action",
  ];
  dataSource = new MatTableDataSource(this.scheduleData);
  isSearched = false;
  isNorecordFound = false;
  previousSize = 0;
  isLoading = false;
  currentDate :any = new Date();

  // end
  constructor(
    private commonserviceService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper, //For menu privilege
    private router: Router,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    public selfTrainingRequestService: SelfTrainingRequestService,
    private teacherTrainingAssessment: TeacherTrainingAssessmentService
  ) {
    super();
    const pageUrl: any = this.router.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl); //For menu privilege
    this.commonserviceService.verifyLinkPermission(
      pageUrl,
      this.linkType[2],
      this.privilege[1]
    ); // For authorization
  }

  ngOnInit(): void {
    this.currentDate = formatDate(this.currentDate, 'yyyy-MM-dd', 'en_US'),
    this.getSubjects(); // get subjects
    this.userProfile = this.commonserviceService.getUserProfile(); // get user profile
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  // get trainings based on subject
  getTrainings(subjectId: number) {
    this.loadingObj.trainingLoad = true;
    if (subjectId) {
      this.selfTrainingRequestService
        .getTrainingDetails(subjectId)
        .subscribe((response: any) => {
          this.loadingObj.trainingLoad = false;
          this.trainingData = response?.data;
        });
    } else {
      this.loadingObj.trainingLoad = false;
      this.trainingData = [];
    }
  }
  // get all subjects
  getSubjects() {
    this.loadingObj.subjectLoad = true;
    this.teacherTrainingAssessment.getSubject().subscribe({
      next: (response: any) => {
        if (response?.status) {
          this.subjects = response?.data;
        } else {
          this.subjects = [];
        }
        this.loadingObj.subjectLoad = false;
      },
    });
  }

  onSearch() {
    if (!+this.userInput.subjectId) {
      this.alertHelper.viewAlert("info", "", "Please select training subject.");
    } else if (!+this.userInput.trainingId) {
      this.alertHelper.viewAlert("info", "", "Please select training name.");
    } else {
      this.loadData(this.getSearchParams());
      this.isSearched = true;
    }
  }
  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      limit: this.pageSize.toString(),
      ...this.userInput,
      userId: this.userProfile?.userId,
    };
  }
  loadData(params: Object) {
    this.spinner.show();
    this.isLoading = true;
    this.teacherTrainingAssessment.getAssessmentSchedules(params).subscribe({
      next: (response: any) => {
        this.spinner.hide();
        if (response?.success === true) {
          this.scheduleData.push(...response?.data); // merge with existing data
        }
        this.scheduleData.length = response?.totalRecord || 0; // update length
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource.data = response?.data;
        this.isLoading = false;
        this.isNorecordFound = this.scheduleData.length ? false : true;
      },
    });
  }
  onDelete(element: any) {
    this.alertHelper.deleteAlert().then((result: any) => {
      if (result.value) {
        // return
        this.spinner.show();
        this.isLoading = true;
        this.teacherTrainingAssessment
          .deleteAssessmentSchedule(element?.scheduleId)
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
}
