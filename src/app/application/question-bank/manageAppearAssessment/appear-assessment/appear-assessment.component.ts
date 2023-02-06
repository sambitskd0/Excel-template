/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 30-06-2022
 * Module Name : Question Bank
 * Description : Appear assessment.
 **/

import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { QuestionBankService } from "../../services/question-bank.service";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-appear-assessment",
  templateUrl: "./appear-assessment.component.html",
  styleUrls: ["./appear-assessment.component.css"],
})
export class AppearAssessmentComponent implements OnInit {
  @ViewChild("userInputRef") userInputRef!: ElementRef;
  @HostListener("document:keyup", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    +event?.which === 13 && this.studentInputHanlder();
  }
  encId: string | null;
  assessmentData: any;
  isClickToStart: boolean = false;
  userInput!: string;
  currentWindow: any;
  userProfile: any = 0;
  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();

  constructor(
    public customValidators: CustomValidators,
    private questionBankService: QuestionBankService,
    private spinner: NgxSpinnerService,
    private alertHelper: AlertHelper,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private privilegeHelper: PrivilegeHelper, //For menu privilege
    private location: Location,
    private commonserviceService: CommonserviceService
  ) {
    const pageUrl: any = this.router.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl); //For menu privilege
    this.commonserviceService.verifyLinkPermission(
      pageUrl,
      this.config.linkType[2],
      this.config.privilege[4]
    ); // For authorization
    this.encId = this.activatedRoute.snapshot.paramMap?.get("encId");
  }

  ngOnInit(): void {
    this.spinner.show();
    this.getAssessmentDetails();
    this.userProfile = this.commonserviceService.getUserProfile(); // get user profile
  }
  ngAfterViewInit() {
    this.userInputRef?.nativeElement.focus();
  }
  getAssessmentDetails() {
    this.spinner.show();
    this.questionBankService.getAssessmentDetails(this.encId).subscribe({
      next: (res: any) => {
        if (!res.success) {
          this.alertHelper
            .successAlert("", res?.msg, "info")
            .then(() => this.location.back());
        } else {
          this.assessmentData = res.data;
        }

        this.spinner.hide();
      },
      error: (error: any) => {
        this.spinner.hide();
      },
    });
  }

  onClick(status: boolean) {
    this.isClickToStart = status;
  }
  studentInputHanlder() {
    if (!+this.userInput) {
      this.userInputRef?.nativeElement.focus();
      this.alertHelper.viewAlert(
        "error",
        "Invalid",
        "Please enter student code/aadhaar to search Student"
      );
    } else {
      this.spinner.show();
      this.questionBankService
        .validateStudent(this.userInput, this.userProfile?.school, this.encId)
        .subscribe({
          next: (res: any) => {
            this.spinner.hide();
            if (res.success) {
              const currentUrl = this.location.path(); // get current url
              // setup route fo assessment question question
              const pageUrl =
                environment.BASEURL +
                currentUrl.slice(0, currentUrl.indexOf("appear")) +
                "assessmentQuestion/" +
                res?.studentData?.encId;
              // open the assessment question
              this.currentWindow = window.open(
                pageUrl,
                "windowName",
                `height=${screen.height},width=${screen.width}`
              );
            } else {
              this.userInputRef?.nativeElement.focus();
              this.alertHelper.viewAlert("error", "", res?.msg);
            }
          },
          error: (error: any) => {
            this.spinner.hide();
          },
        });
    }
  }
  closeCurrentWindow() {
    this.currentWindow.close();
  }
}
