/**
 * Created By   : Sambit Kumar Dalai
 * Created On   : 14-Aug-2022
 * Description  : View self assessment
 **/

import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table"; 
import { NgxSpinnerService } from "ngx-spinner";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { Constant } from "src/app/shared/constants/constant";
import { SelfTrainingRequestService } from "../../services/self-training-request.service";
import { TeacherTrainingAssessmentService } from "../../services/teacher-training-assessment.service";
import { Location } from "@angular/common";
import { environment } from "src/environments/environment";
import { formatDate } from '@angular/common';

@Component({
  selector: "app-view-assessment",
  templateUrl: "./view-assessment.component.html",
  styleUrls: ["./view-assessment.component.css"],
})
export class ViewAssessmentComponent extends Constant implements OnInit {
  show: boolean = true;
  buttonName: any = "Show";
  currentDate :any = new Date()
  loadingObj: any = {
    trainingLoad: false,
    subjectLoad: false,
    districtLoad: false,
    blockLoad: false,
    annextureLoad: false,
  };
  userInput: any = {
    academicYear: this.getAcademicCurrentYear(),
    trainingSubjectId: "",
    trainingId: "",
    districtId: "",
    blockId: "",
    trainingLevel: "",
  };
  allDataObj: any = {
    trainingData: [],
    districtData: [],
    blockData: [],
    asssessmentData: [],
    subjects: [],
    userProfile: [],
    levelData: [],
  };
  // mat table
  @Input() mode!: ProgressBarMode;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  matTableObj: any = {
    pageSize: 10,
    offset: 0,
    currentPage: 0,
    totalRows: 0,
    pageSizeOptions: [10, 25, 100],
    displayedColumns: [
      "slNo",
      "academicYear",
      "subject",
      "trainingName",
      "traininglvl",
      "preAssessmentDate",
      "preAssessmentStartTime",
      "postAssessmentDate",
      "postAssessmentStartTime",
      "duration",
      "action",
    ],
    dataSource: new MatTableDataSource(),
    isSearched: false,
    isNorecordFound: false,
    previousSize: 0,
    isLoading: false,
  };
  // end
  constructor(
    private teacherTrainingAssessment: TeacherTrainingAssessmentService,
    private spinner: NgxSpinnerService,
    public selfTrainingRequestService: SelfTrainingRequestService,
    private commonserviceService: CommonserviceService,
    private alertHelper: AlertHelper,
    private location: Location
  ) {
    super();
  }

  ngOnInit(): void {
   
    this.currentDate = formatDate(  this.currentDate, 'yyyy-MM-dd', 'en_US') ;
    this.spinner.show();
    this.allDataObj.userProfile = this.commonserviceService.getUserProfile(); // get user profile
    this.getSubjects(); // get subjects
    this.getDistrict(); // get district
    this.matTableObj.dataSource = new MatTableDataSource(
      this.allDataObj.asssessmentData
    ); // assign assessmentdata to  datasource
    this.getAnnextureData(); // get annextures
  }
  // get annextures
  getAnnextureData() {
    this.loadingObj.annextureLoad = true;
    this.commonserviceService.getCommonAnnexture(["LVL"]).subscribe({
      next: (res: any) => {
        this.allDataObj.levelData = res?.data?.LVL.filter(
          (item: any) => item.anxtValue > 2 // show classes 9-12
        );
        this.loadingObj.annextureLoad = false;
        this.spinner.hide();
      },
    });
  }
  // get all subjects
  getSubjects() {
    this.loadingObj.subjectLoad = true;
    this.teacherTrainingAssessment.getSubject().subscribe({
      next: (response: any) => {
        if (response?.status) {
          this.allDataObj.subjects = response?.data;
        } else {
          this.allDataObj.subjects = [];
        }
        this.loadingObj.subjectLoad = false;
      },
    });
  }
  toggle() {
    this.show = !this.show;
    if (this.show) this.buttonName = "Hide";
    else this.buttonName = "Show";
  }

  getDistrict() {
    this.loadingObj.districtLoad = true;
    this.commonserviceService.getAllDistrict().subscribe({
      next: (res: any) => {
        this.loadingObj.districtLoad = true;
        // if demography data present prefill
        if (+this.allDataObj.userProfile?.district) {
          this.getBlock(+this.allDataObj.userProfile.district); // get block
          this.allDataObj.districtData = res.data.filter((item: any) => {
            if (+item.districtId === +this.allDataObj.userProfile.district) {
              this.userInput.districtId = item?.districtId;
              return true;
            }
            return false;
          });
        } else {
          // else show all
          this.allDataObj.districtData = res.data;
        }
        this.loadingObj.districtLoad = false;
        this.spinner.hide();
      },
      error: (error: any) => {
        this.spinner.hide();
      },
    });
  }
  getBlock(districtId: number) {
    // reset existing data and selection
    this.allDataObj.blockData = [];
    this.userInput.blockId = "";
    //end
    this.loadingObj.blockLoad = true;
    if (districtId) {
      this.allDataObj.blockChanged = true;
      this.commonserviceService.getBlockByDistrictid(districtId).subscribe({
        next: (res: any) => {
          // if demography data present prefill
          if (+this.allDataObj.userProfile?.block) {
            this.allDataObj.blockData = res.data.filter((item: any) => {
              if (+item.blockId === +this.allDataObj.userProfile.block) {
                this.userInput.blockId = item?.blockId;
                return true;
              }
              return false;
            });
          } else {
            // else show all
            this.allDataObj.blockData = res.data;
          }
          this.loadingObj.blockLoad = false;
        },
      });
    } else {
      this.loadingObj.blockLoad = false;
    }
  }

  onSearch() {
    // validate
    if (!this.userInput?.academicYear) {
      this.alertHelper.viewAlert("info", "", "Please select academic year.");
      return;
    }
    if (!+this.userInput?.trainingSubjectId) {
      this.alertHelper.viewAlert("info", "", "Please select training subject.");
      return;
    }
    if (!+this.userInput?.trainingId) {
      this.alertHelper.viewAlert("info", "", "Please select training name.");
      return;
    }
    if (!+this.userInput?.districtId) {
      this.alertHelper.viewAlert("info", "", "Please select district.");
      return;
    }
    if (!+this.userInput?.blockId) {
      this.alertHelper.viewAlert("info", "", "Please select block.");
      return;
    }
    // validation end

    // if validation success load data
    this.matTableObj.isSearched = true;
    this.loadData(this.getSearchParams());
  }
  onPageChange(event: any) {
    this.spinner.show();
    this.matTableObj.isLoading = true;
    // event: PageEvent
    this.matTableObj.pageSize = event.pageSize; // current page size ex: 10
    /**
     * pageIndex starts from 0
     * ex: if pageIndex = 0 then offset = 0 * 10 = 0 and if pageIndex =1 then 1*10 = 10
     */
    this.matTableObj.offset = event.pageIndex * event.pageSize;
    this.matTableObj.previousSize = this.matTableObj.pageSize * event.pageIndex; // set previous size
    this.matTableObj.pageIndex = event.pageIndex;
    this.loadData(this.getSearchParams());
  }
  getSearchParams() {
    let userType = 0;
    if (+this.allDataObj.userProfile?.loginUserTypeId === 1) userType = 1; // teacher
    if (+this.allDataObj.userProfile?.loginUserTypeId === 3) userType = 2; // officer

    return {
      previousSize: this.matTableObj.previousSize,
      offset: this.matTableObj.offset.toString(),
      limit: this.matTableObj.pageSize.toString(),
      ...this.userInput,
      userId: this.allDataObj.userProfile?.userId,
      userType,
    };
  }
  loadData(params: Object) {
    this.spinner.show();
    this.matTableObj.isLoading = true;
    this.teacherTrainingAssessment.getAssessments(params).subscribe({
      next: (response: any) => {
        this.allDataObj.asssessmentData.length = this.matTableObj.previousSize; // set current size
        if (response?.success === true) {
          this.allDataObj.asssessmentData.push(...response?.data); // merge with existing data
          this.allDataObj.asssessmentData.length = response?.totalRecord; // update length
        } else {
          this.alertHelper.viewAlert("info", "", response?.msg);
        }

        this.matTableObj.dataSource.paginator = this.paginator; // update paginator
        this.matTableObj?.dataSource?._updateChangeSubscription(); // update table
        this.matTableObj.isLoading = false;
        this.matTableObj.isNorecordFound = this.allDataObj.asssessmentData
          .length
          ? false
          : true;
        this.spinner.hide();
      },
    });
  }
  // get trainings based on subject
  getTrainings() {
    if (+this.userInput.trainingSubjectId) {
      this.loadingObj.trainingLoad = true;
      this.selfTrainingRequestService
        .getTrainingDetails(+this.userInput.trainingSubjectId)
        .subscribe((response: any) => {
          this.allDataObj.trainingData = response?.data;
          this.loadingObj.trainingLoad = false;
        });
    } else {
      this.allDataObj.trainingData = [];
    }
  }
  appearAssessment(allEncId: string, assessmentType: number) {
    this.spinner.show();
    // validate
    this.selfTrainingRequestService
      .validateTrainee({
        allEncId,
        assessmentType,
      })
      .subscribe((response: any) => {
        if (response?.success) {
          this.spinner.hide();
          const currentUrl = this.location.path(); // get current url
          const pageUrl = environment.BASEURL + currentUrl.slice(0, currentUrl.indexOf("view")) + "appear/" + allEncId + "/" + assessmentType;
          // open the assessment question
          window.open(pageUrl, "windowName", `height=${screen.height},width=${screen.width}` );
        } else {
          this.spinner.hide();
          this.alertHelper.viewAlert("warning", "", response?.msg);
        }
      });
  }
}
