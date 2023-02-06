import { Component, ElementRef, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { DivyaService } from "../services/divya.service";

@Component({
  selector: "app-school-survey-teacher",
  templateUrl: "./school-survey-teacher.component.html",
  styleUrls: ["./school-survey-teacher.component.css"],
})
export class SchoolSurveyTeacherComponent implements OnInit {
  token!: any;
  tokenParams: any = "";
  schoolSurveyTeacherForm!: FormGroup;

  totalCwsnVi: any = "";
  totalCwsnHi: any = "";
  totalCwsnOh: any = "";
  totalCwsnSi: any = "";
  totalCwsnId: any = "";
  totalCwsnCp: any = "";
  totalCwsnOthers: any = "";
  totalEnrolledCwsn: any = "";

  presentCwsnVi: any = "";
  presentCwsnHi: any = "";
  presentCwsnOh: any = "";
  presentCwsnSi: any = "";
  presentCwsnId: any = "";
  presentCwsnCp: any = "";
  presentCwsnOthers: any = "";
  totalPresentCwsn: any = "";

  iepCwsn: any = "";

  assistiveCwsnVi: any = "";
  assistiveCwsnHi: any = "";
  assistiveCwsnOh: any = "";
  assistiveCwsnSi: any = "";
  assistiveCwsnId: any = "";
  assistiveCwsnCp: any = "";
  assistiveCwsnOthers: any = "";
  totalAssistiveCwsn: any = "";

  educationalCwsnVi: any = "";
  educationalCwsnHi: any = "";
  educationalCwsnOh: any = "";
  educationalCwsnSi: any = "";
  educationalCwsnId: any = "";
  educationalCwsnCp: any = "";
  educationalCwsnOthers: any = "";
  totalEducationalCwsn: any = "";

  skillCwsnVi: any = "";
  skillCwsnHi: any = "";
  skillCwsnOh: any = "";
  skillCwsnSi: any = "";
  skillCwsnId: any = "";
  skillCwsnCp: any = "";
  skillCwsnOthers: any = "";
  totalSkillCwsn: any = "";

  individualTlmCwsn: any = "";
  peerSupportCwsn: any = "";
  userDetails!: any;
  allLabel: string[] = [
    "Enrolled CWSN in School VI",
    "Enrolled CWSN in School HI",
    "Enrolled CWSN in School OH",
    "Enrolled CWSN in School SI",
    "Enrolled CWSN in School ID",
    "Enrolled CWSN in School CP",
    "Enrolled CWSN in School Others",
    "Enrolled CWSN in School",
    "Present CWSN VI",
    "Present CWSN HI",
    "Present CWSN OH",
    "Present CWSN SI",
    "Present CWSN ID",
    "Present CWSN CP",
    "Present CWSN Others",
    "Present CWSN ",
    "How many CWSN have IEP",
    "How many CWSN were given assistive devices VI",
    "How many CWSN were given assistive devices HI",
    "How many CWSN were given assistive devices OH",
    "How many CWSN were given assistive devices SI",
    "How many CWSN were given assistive devices ID",
    "How many CWSN were given assistive devices CP",
    "How many CWSN were given assistive devices Others",
    "Total How many CWSN were given assistive devices?",
    "How many CWSN were given Educational Devices VI",
    "How many CWSN were given Educational Devices HI",
    "How many CWSN were given Educational Devices OH",
    "How many CWSN were given Educational Devices SI",
    "How many CWSN were given Educational Devices ID",
    "How many CWSN were given Educational Devices CP",
    "How many CWSN were given Educational Devices Others",
    "Total How many CWSN were given Educational Devices",
    "How many CWSN were given skill training VI",
    "How many CWSN were given skill training HI",
    "How many CWSN were given skill training OH",
    "How many CWSN were given skill training SI",
    "How many CWSN were given skill training ID",
    "How many CWSN were given skill training CP",
    "How many CWSN were given skill training Others",
    "Total How many CWSN were given skill training",
    "How many CWSN were given individual TLM",
    "How many CWSN were given peer support",
  ];

  constructor(
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private alertHelper: AlertHelper,
    private el: ElementRef,
    private spinner: NgxSpinnerService,
    private divyaService: DivyaService,
    private jwtHelper: JwtHelperService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getUserDetails();
    this.initializeForm();
  }
  // get user details
  getUserDetails() {
    this.divyaService.getTokenDetails(this.route, this.router);
    // check if side nav status
    this.divyaService.tokenEmitter.subscribe((res: any) => {
      this.userDetails = res;
    });
  }
  initializeForm() {
    this.schoolSurveyTeacherForm = this.formBuilder.group({
      totalCwsnVi: [
        this.totalCwsnVi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalCwsnHi: [
        this.totalCwsnHi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalCwsnOh: [
        this.totalCwsnOh,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalCwsnSi: [
        this.totalCwsnSi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalCwsnId: [
        this.totalCwsnId,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalCwsnCp: [
        this.totalCwsnCp,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalCwsnOthers: [
        this.totalCwsnOthers,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalEnrolledCwsn: [
        this.totalEnrolledCwsn,
        [Validators.required, Validators.pattern(/^[0-9]\d*$/)],
      ],

      presentCwsnVi: [
        this.presentCwsnVi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      presentCwsnHi: [
        this.presentCwsnHi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      presentCwsnOh: [
        this.presentCwsnOh,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      presentCwsnSi: [
        this.presentCwsnSi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      presentCwsnId: [
        this.presentCwsnId,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      presentCwsnCp: [
        this.presentCwsnCp,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      presentCwsnOthers: [
        this.presentCwsnOthers,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalPresentCwsn: [
        this.totalPresentCwsn,
        [Validators.required, Validators.pattern(/^[0-9]\d*$/)],
      ],
      iepCwsn: [
        this.iepCwsn,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]\d*$/),
        ],
      ],

      assistiveCwsnVi: [
        this.assistiveCwsnVi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      assistiveCwsnHi: [
        this.assistiveCwsnHi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      assistiveCwsnOh: [
        this.assistiveCwsnOh,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      assistiveCwsnSi: [
        this.assistiveCwsnSi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      assistiveCwsnId: [
        this.assistiveCwsnId,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      assistiveCwsnCp: [
        this.assistiveCwsnCp,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      assistiveCwsnOthers: [
        this.assistiveCwsnOthers,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalAssistiveCwsn: [
        this.totalAssistiveCwsn,
        [Validators.required, Validators.pattern(/^[0-9]\d*$/)],
      ],

      educationalCwsnVi: [
        this.educationalCwsnVi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      educationalCwsnHi: [
        this.educationalCwsnHi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      educationalCwsnOh: [
        this.educationalCwsnOh,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      educationalCwsnSi: [
        this.educationalCwsnSi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      educationalCwsnId: [
        this.educationalCwsnId,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      educationalCwsnCp: [
        this.educationalCwsnCp,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      educationalCwsnOthers: [
        this.educationalCwsnOthers,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalEducationalCwsn: [
        this.totalEducationalCwsn,
        [Validators.required, Validators.pattern(/^[0-9]\d*$/)],
      ],

      skillCwsnVi: [
        this.skillCwsnVi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      skillCwsnHi: [
        this.skillCwsnHi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      skillCwsnOh: [
        this.skillCwsnOh,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      skillCwsnSi: [
        this.skillCwsnSi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      skillCwsnId: [
        this.skillCwsnId,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      skillCwsnCp: [
        this.skillCwsnCp,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      skillCwsnOthers: [
        this.skillCwsnOthers,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalSkillCwsn: [
        this.totalSkillCwsn,
        [Validators.required, Validators.pattern(/^[0-9]\d*$/)],
      ],

      individualTlmCwsn: [
        this.individualTlmCwsn,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]\d*$/),
        ],
      ],
      peerSupportCwsn: [
        this.peerSupportCwsn,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]\d*$/),
        ],
      ],
    });
  }
  totalCalculation(
    valueOne: any,
    valueTwo: any,
    valueThree: any,
    valueFour: any,
    valueFive: any,
    valueSix: any,
    valueSeven: any,
    calculationFor: any
  ) {
    let vOne = 0;
    let vTwo = 0;
    let vThree = 0;
    let vFour = 0;
    let vFive = 0;
    let vSix = 0;
    let vSeven = 0;
    if (valueOne.value !== "") {
      vOne = parseInt(valueOne.value);
    }
    if (valueTwo.value !== "") {
      vTwo = parseInt(valueTwo.value);
    }
    if (valueThree.value !== "") {
      vThree = parseInt(valueThree.value);
    }
    if (valueFour.value !== "") {
      vFour = parseInt(valueFour.value);
    }
    if (valueFive.value !== "") {
      vFive = parseInt(valueFive.value);
    }
    if (valueSix.value !== "") {
      vSix = parseInt(valueSix.value);
    }
    if (valueSeven.value !== "") {
      vSeven = parseInt(valueSeven.value);
    }
    let total: string | number =
      vOne + vTwo + vThree + vFour + vFive + vSix + vSeven;
    //console.log(calculationFor);
    if (parseInt(calculationFor) == 1) {
      if (total == 0) {
        this.schoolSurveyTeacherForm.patchValue({
          totalEnrolledCwsn: "",
        });
      } else {
        this.schoolSurveyTeacherForm.patchValue({
          totalEnrolledCwsn: total,
        });
      }
    }
    if (parseInt(calculationFor) == 2) {
      if (total == 0) {
        this.schoolSurveyTeacherForm.patchValue({
          totalPresentCwsn: "",
        });
      } else {
        this.schoolSurveyTeacherForm.patchValue({
          totalPresentCwsn: total,
        });
      }
    }
    if (parseInt(calculationFor) == 3) {
      if (total == 0) {
        this.schoolSurveyTeacherForm.patchValue({
          totalAssistiveCwsn: "",
        });
      } else {
        this.schoolSurveyTeacherForm.patchValue({
          totalAssistiveCwsn: total,
        });
      }
    }
    if (parseInt(calculationFor) == 4) {
      if (total == 0) {
        this.schoolSurveyTeacherForm.patchValue({
          totalEducationalCwsn: "",
        });
      } else {
        this.schoolSurveyTeacherForm.patchValue({
          totalEducationalCwsn: total,
        });
      }
    }
    if (parseInt(calculationFor) == 5) {
      if (total == 0) {
        this.schoolSurveyTeacherForm.patchValue({
          totalSkillCwsn: "",
        });
      } else {
        this.schoolSurveyTeacherForm.patchValue({
          totalSkillCwsn: total,
        });
      }
    }
  }
  maxLimitChk(
    maxLimitCntrl: string,
    compareCntrl: string,
    maxLimitCntrlLabel: string,
    compareCntrlLabel: string
  ) {
    let mlc =
      this.schoolSurveyTeacherForm.get(maxLimitCntrl)?.value > 0
        ? parseInt(this.schoolSurveyTeacherForm.get(maxLimitCntrl)?.value)
        : 0;
    let cc =
      this.schoolSurveyTeacherForm.get(compareCntrl)?.value > 0
        ? parseInt(this.schoolSurveyTeacherForm.get(compareCntrl)?.value)
        : 0;
    if (cc > mlc) {
      this.alertHelper
        .viewAlertHtml(
          "error",
          "Invalid inputs",
          maxLimitCntrlLabel +
            " can not be empty. Please enter " +
            maxLimitCntrlLabel +
            " first."
        )
        .then((res: any) => {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + compareCntrl + '"]'
          );
          this.schoolSurveyTeacherForm.get(compareCntrl)?.patchValue("");
          invalidControl.focus();
        });
    }
    if (mlc > 0 && cc > 0) {
      if (mlc < cc) {
        this.alertHelper
          .viewAlertHtml(
            "error",
            "Invalid inputs",
            compareCntrlLabel + " can not be grater than " + maxLimitCntrlLabel
          )
          .then((res: any) => {
            const invalidControl = this.el.nativeElement.querySelector(
              '[formControlName="' + compareCntrl + '"]'
            );
            this.schoolSurveyTeacherForm.get(compareCntrl)?.patchValue("");
            invalidControl.focus();
          });
      }
    }
  }
  checkFromTotalElement(
    compareCntrl1: string,
    compareCntrl2: string,
    compareCntrl3: string,
    compareCntrl4: string,
    maxLimitCntrl: string,
    type: string
  ) {
    let mlc = this.schoolSurveyTeacherForm.get(maxLimitCntrl)?.value
      ? parseInt(this.schoolSurveyTeacherForm.get(maxLimitCntrl)?.value)
      : 0;
    let cc1 = this.schoolSurveyTeacherForm.get(compareCntrl1)?.value
      ? parseInt(this.schoolSurveyTeacherForm.get(compareCntrl1)?.value)
      : 0;
    let cc2 = this.schoolSurveyTeacherForm.get(compareCntrl2)?.value
      ? parseInt(this.schoolSurveyTeacherForm.get(compareCntrl2)?.value)
      : 0;
    let cc3 = this.schoolSurveyTeacherForm.get(compareCntrl3)?.value
      ? parseInt(this.schoolSurveyTeacherForm.get(compareCntrl3)?.value)
      : 0;
    let cc4 = this.schoolSurveyTeacherForm.get(compareCntrl4)?.value
      ? parseInt(this.schoolSurveyTeacherForm.get(compareCntrl4)?.value)
      : 0;

    if (mlc < cc1) {
      this.alertHelper
        .viewAlertHtml(
          "error",
          "Invalid inputs",
          "Total Registered CWSN " +
            type +
            " can not be Smaller than Present CWSN " +
            type +
            ""
        )
        .then((res: any) => {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + maxLimitCntrl + '"]'
          );
          invalidControl.focus();
        });
    }
    if (mlc < cc2) {
      this.alertHelper
        .viewAlertHtml(
          "error",
          "Invalid inputs",
          "Total Registered CWSN " +
            type +
            " can not be Smaller than Assistive devices CWSN" +
            type +
            ""
        )
        .then((res: any) => {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + maxLimitCntrl + '"]'
          );
          invalidControl.focus();
        });
    }
    if (mlc < cc3) {
      this.alertHelper
        .viewAlertHtml(
          "error",
          "Invalid inputs",
          "Total Registered CWSN " +
            type +
            " can not be Smaller than Educational devices CWSN" +
            type +
            ""
        )
        .then((res: any) => {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + maxLimitCntrl + '"]'
          );
          invalidControl.focus();
        });
    }
    if (mlc < cc4) {
      this.alertHelper
        .viewAlertHtml(
          "error",
          "Invalid inputs",
          "Total Registered CWSN " +
            type +
            " can not be Smaller than Skill training CWSN " +
            type +
            ""
        )
        .then((res: any) => {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + maxLimitCntrl + '"]'
          );
          invalidControl.focus();
        });
    }
  }

  onSubmit() {
    if ("INVALID" === this.schoolSurveyTeacherForm.status) {
      for (const key of Object.keys(this.schoolSurveyTeacherForm.controls)) {
        if (this.schoolSurveyTeacherForm.controls[key].status === "INVALID") {
          let invalidControl;
          switch (key) {
            case "totalEnrolledCwsn":
              invalidControl = this.el.nativeElement.querySelector(
                '[formControlName="totalCwsnVi"]'
              );
              break;
            case "totalPresentCwsn":
              invalidControl = this.el.nativeElement.querySelector(
                '[formControlName="presentCwsnVi"]'
              );
              break;
            case "totalAssistiveCwsn":
              invalidControl = this.el.nativeElement.querySelector(
                '[formControlName="assistiveCwsnVi"]'
              );
              break;
            case "totalEducationalCwsn":
              invalidControl = this.el.nativeElement.querySelector(
                '[formControlName="educationalCwsnVi"]'
              );
              break;
            case "totalSkillCwsn":
              invalidControl = this.el.nativeElement.querySelector(
                '[formControlName="skillCwsnVi"]'
              );
              break;
            default:
              invalidControl = this.el.nativeElement.querySelector(
                '[formControlName="' + key + '"]'
              );
              break;
          }
          invalidControl.focus();
          this.customValidators.formValidationHandler(
            this.schoolSurveyTeacherForm,
            this.allLabel
          );
          break;
        }
      }
    }
    if (this.schoolSurveyTeacherForm.invalid) {
      return;
    }
    if (this.schoolSurveyTeacherForm.valid === true) {
      this.alertHelper.submitAlert().then((result: any) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.divyaService
            .saveSchoolSurveyTeacher(this.schoolSurveyTeacherForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "School survey visit data saved successfully.",
                    "success"
                  )
                  .then(() => {
                    this.router.navigate(["../success"], {
                      relativeTo: this.route,
                    });
                    this.initializeForm();
                  });
              },
              error: (error: any) => {
                this.spinner.hide(); //==== hide spinner
                let errorMessage: string = "";
                if (typeof error.error.msg === "string") {
                  errorMessage +=
                    '<i class="bi bi-arrow-right text-danger"></i> ' +
                    error.error.msg +
                    `<br>`;
                } else {
                  error.error.msg.map(
                    (message: string) =>
                      (errorMessage +=
                        '<i class="bi bi-arrow-right text-danger"></i> ' +
                        message +
                        `<br>`)
                  );
                }
                this.alertHelper.viewAlertHtml(
                  "error",
                  "Invalid inputs",
                  errorMessage
                );
              },
              // complete: () => console.log("done"),
            });
        }
      });
    }
  }
  keyUpInputNumber(event: any, controlname: any, maxLength: number = 3) {
    if (event.target.value.length > maxLength) {
      event.target.value = event.target.value.substr(0, maxLength);
      this.schoolSurveyTeacherForm
        .get(controlname)
        ?.patchValue(event.target.value);
    }
    var charCode = event.which ? event.which : event.keyCode;

    if (charCode < 48 || charCode > 57) {
      event.target.value = event.target.value.replace(/[^\d]/g, "");
      this.schoolSurveyTeacherForm
        .get(controlname)
        ?.patchValue(event.target.value);
      return false;
    } else {
      return true;
    }
  }
  resetForm() {
    this.initializeForm();
  }
}
