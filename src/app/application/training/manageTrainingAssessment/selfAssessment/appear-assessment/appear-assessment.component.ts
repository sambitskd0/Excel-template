import { Component, HostListener, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { TeacherTrainingAssessmentService } from "../../../services/teacher-training-assessment.service";
import { LocationStrategy } from "@angular/common";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { Constant } from "src/app/shared/constants/constant";
import { environment } from "src/environments/environment";
@Component({
  selector: "app-appear-assessment",
  templateUrl: "./appear-assessment.component.html",
  styleUrls: ["./appear-assessment.component.css"],
})
export class AppearAssessmentComponent implements OnInit {
  // disable keyboard event
  @HostListener("document:keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    event.preventDefault();
  }
  encId: any;
  assessmentType: any;
  question!: string;
  questions!: any;
  optionA!: string;
  optionB!: string;
  optionC!: string;
  optionD!: string;
  answer!: string;
  questionSlNo: number = 1;
  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();
  duration!: number;
  durationInterval!: any;
  traineeInfo!: any;

  constructor(
    private commonserviceService: CommonserviceService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private alertHelper: AlertHelper,
    private teacherTrainingAssessment: TeacherTrainingAssessmentService,
    private location: LocationStrategy,
    private privilegeHelper: PrivilegeHelper, //For menu privilege
    private router: Router
  ) {
    const pageUrl: any = this.router.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl); //For menu privilege
    this.commonserviceService.verifyLinkPermission(
      pageUrl,
      this.config.linkType[2],
      this.config.privilege[4]
    ); // For authorization
    this.pageRestrictionHandler();
    this.commonserviceService.pageSetup(true); // remove side nav and header
    this.encId = this.activatedRoute.snapshot.paramMap?.get("encId");
    this.assessmentType =
      this.activatedRoute.snapshot.paramMap?.get("assessmentType");
  }

  ngOnInit(): void {
    this.getQuestions();
  }
  getQuestions() {
    this.spinner.show();
    this.teacherTrainingAssessment
      .getQuestions({
        encId: this.encId,
        assessmentType: this.assessmentType,
      })
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          if (res?.success) {
            this.questions = res.questions;
            this.traineeInfo = res.traineeInfo;
          } else {
            this.commonserviceService.pageSetup(false); // remove side nav and header
            this.alertHelper
              .successAlert("Saved!", res?.msg, "success")
              .then((res: any) => {
                window.open("", "_self")?.close(); // close current tab
              });
          }
          this.examDurationHander(res.duration);
        },
        error: (error: any) => {
          this.spinner.hide();
        },
      });
  }
  // handle next and previous question
  onQuestionChange(type: string) {
    if (type === "next") this.questionSlNo += 1;
    if (type === "previous") this.questionSlNo -= 1;
  }

  onSubmit() {
    let answerCount = 0;
    let questionCount = 0;
    Promise.all(
      this.questions.map((item: any) => {
        +item?.answer > 0 && answerCount++;
        questionCount++;
      })
    ).then(() => {
      this.alertHelper
        .submitAlert(
          `You have answered ${answerCount} question out of a total of ${questionCount} questions. Are you sure to submit ?`,
          "",
          "Submit",
          "Cancel"
        )
        .then((res: any) => res?.value && this.submitAssessment());
    });
  }
  submitAssessment() {
    const dataObj = {
      allEncId: this.encId,
      answers: this.questions,
      assessmentType: this.assessmentType,
    };
    this.spinner.show();
    this.teacherTrainingAssessment.submitAssessment(dataObj).subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.alertHelper.viewAlert("success", "", res?.msg).then(() => {
            window.onbeforeunload = () => undefined; // remove warning message while closing tab
            window.open("", "_self")?.close(); // close current tab

          });
        } else {
          this.alertHelper.viewAlert("warning", "", res?.msg).then(() => {
            window.onbeforeunload = () => undefined; // remove warning message while closing tab
            window.open("", "_self")?.close(); // close current tab
          });
        }
        this.spinner.hide();
      },
      error: (error: any) => {
        this.spinner.hide();
      },
    });

  }
  pageRestrictionHandler() {
    const curThis = this;
    window.onbeforeunload = function (e) {
      // localStorage.setItem("assessmentTimeLeft", curThis.duration.toString()); // sotre time

      // Cancel the event
      e.preventDefault();
      // Chrome requires returnValue to be set
      e.returnValue = "Really want to quit the game?";
    };
    window.addEventListener("keyup", this.disableF5);
    window.addEventListener("keydown", this.disableF5);
    document.addEventListener("contextmenu", (event) => event.preventDefault());
    // restrict going back
    history.pushState(null, "", window.location.href);
    this.location.onPopState(() => {
      history.pushState(null, "", window.location.href);
    });
  }
  disableF5(event: any): any {
    if (event.ctrlKey) {
      event.preventDefault();
    }
    if (event.which == 27) {
      event.preventDefault();
      return false;
    }
    if ((event.which || event.keyCode) == 116) event.preventDefault();
  }
  examDurationHander(duration: number) {
    // if duration not exist
    if (!this.duration) this.duration = duration * 60 * 1000;
    // this.duration = 3000; NOTE:for testing
    const curThis = this;
    this.durationInterval = setInterval(() => {
      // if assessment not end
      if (curThis.duration > 0) {
        curThis.duration = curThis.duration - 1000; // decrease time
        if (
          curThis.duration < 1 ||
          curThis.duration > this.config.questionBank.maxDuration * 60 * 1000
        ) {
          curThis.duration = 0;
          clearInterval(curThis.durationInterval);
          this.submitAssessment();
        }
      } else {
        // if assessment end
        clearInterval(curThis.durationInterval);
        this.submitAssessment();
      }
    }, 1000);
  }
  set showQuestionByNumber(questionNo: number) {
    this.questionSlNo = questionNo;
  }
  ngOnDestroy(): void {
    clearInterval(this.durationInterval);
  }
}
