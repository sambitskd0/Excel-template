import { Component, OnInit, HostListener } from "@angular/core";

import { CommonserviceService } from "src/app/core/services/commonservice.service";
declare var $: any;
import { LocationStrategy } from "@angular/common";
import { QuestionBankService } from "../../services/question-bank.service";
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from "src/environments/environment";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";

@Component({
  selector: "app-assessment-question",
  templateUrl: "./assessment-question.component.html",
  styleUrls: ["./assessment-question.component.css"],
})
export class AssessmentQuestionComponent implements OnInit {
  // disable keyboard event
  @HostListener("document:keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    event.preventDefault();
  }
  public fileUrl = environment.filePath;

  encId: string | null;
  studentInfo!: any;
  questions!: any;
  questionText!: string;
  questionImg!: string;
  mark!: string;
  optionAText!: string;
  optionAImg!: string;
  optionBText!: string;
  optionBImg!: string;
  optionCText!: string;
  optionCImg!: string;
  optionDText!: string;
  optionDImg!: string;
  answer!: string;
  questionId!: string;
  duration!: number;
  durationInterval: any;
  questionSlNo: number = 1;
  curWindow: any;
  statusOne: number = 0;
  statusTwo: number = 0;
  statusThree: number = 0;
  statusFour: number = 0;
  statusFive: number = 0;
  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();
  constructor(
    private commonserviceService: CommonserviceService,
    private location: LocationStrategy,
    private activatedRoute: ActivatedRoute,
    private questionBankService: QuestionBankService,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
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
  }

  ngOnInit(): void {
    this.getQuestions();
  }
  pageRestrictionHandler() {
    const curThis = this;
    window.onbeforeunload = function (e) {
      localStorage.setItem("assessmentTimeLeft", curThis.duration.toString()); // sotre time
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

  getQuestions() {
    this.spinner.show();
    this.questionBankService.getQuestions(this.encId).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res?.success) {
          console.log(res);
          this.questions = res.questions;
          this.studentInfo = res.studentInfo;
        } else {
          this.commonserviceService.pageSetup(false); // remove side nav and header
          this.alertHelper
            .successAlert("Saved!", res?.msg, "success")
            .then((res: any) => {
              this.router.navigate(["../../"], {
                relativeTo: this.activatedRoute,
              });
            });
        }
        this.examDurationHander(res.duration);
      },
      error: (error: any) => {
        this.spinner.hide();
      },
    });
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
    const userProfile = this.commonserviceService.getUserProfile(); // get user profile
    if (userProfile?.school) {
      const dataObj = {
        encId: this.encId,
        studentResponse: this.questions,
        userId: userProfile?.school,
      };
      this.spinner.show();
      this.questionBankService.submitAssessment(dataObj).subscribe({
        next: (res: any) => {
          if (res?.success) {
            this.alertHelper.viewAlert("success", "", res?.msg).then(() => {
              window.onbeforeunload = () => undefined; // remove warning message while closing tab
              window.open("", "_self")?.close(); // close current tab
            });
          } else {
            this.alertHelper.viewAlert("error", "", res?.msg).then(() => {
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
    } else {
      // if not school login
      this.alertHelper.viewAlert(
        "error",
        "",
        "You are not allowed to perform this action."
      );
    }
  }
  // handle next and previous question
  onQuestionChange(type: string) {
    if (type === "next") this.questionSlNo += 1;
    if (type === "previous") this.questionSlNo -= 1;
    console.log();
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
          console.log("ok");

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
