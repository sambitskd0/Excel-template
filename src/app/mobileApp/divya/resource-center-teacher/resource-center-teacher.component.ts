import { Component, ElementRef, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Data, Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { DivyaService } from "../services/divya.service";

@Component({
  selector: "app-resource-center-teacher",
  templateUrl: "./resource-center-teacher.component.html",
  styleUrls: ["./resource-center-teacher.component.css"],
})
export class ResourceCenterTeacherComponent implements OnInit {
  resourceCenterTeacherForm!: FormGroup;
  noOfRegisteredCwsnVi: any = "";
  noOfRegisteredCwsnHi: any = "";
  noOfRegisteredCwsnOh: any = "";
  noOfRegisteredCwsnSi: any = "";
  noOfRegisteredCwsnId: any = "";
  noOfRegisteredCwsnCp: any = "";
  noOfRegisteredCwsnOthers: any = "";
  noOfRegisteredCwsnTotal: any = "";

  noOfPresentCwsnVi: any = "";
  noOfPresentCwsnHi: any = "";
  noOfPresentCwsnOh: any = "";
  noOfPresentCwsnSi: any = "";
  noOfPresentCwsnId: any = "";
  noOfPresentCwsnCp: any = "";
  noOfPresentCwsnOthers: any = "";
  noOfPresentCwsnTotal: any = "";

  noOfIEPOrITPPrepared: any = "";

  noOfAssistiveDevicesVi: any = "";
  noOfAssistiveDevicesHi: any = "";
  noOfAssistiveDevicesOh: any = "";
  noOfAssistiveDevicesSi: any = "";
  noOfAssistiveDevicesId: any = "";
  noOfAssistiveDevicesCp: any = "";
  noOfAssistiveDevicesOthers: any = "";
  noOfAssistiveDevicesTotal: any = "";

  noOfEducationalCwsnVi: any = "";
  noOfEducationalCwsnHi: any = "";
  noOfEducationalCwsnOh: any = "";
  noOfEducationalCwsnSi: any = "";
  noOfEducationalCwsnId: any = "";
  noOfEducationalCwsnCp: any = "";
  noOfEducationalCwsnOthers: any = "";
  noOfEducationalCwsnTotal: any = "";

  noOfSkillCwsnVi: any = "";
  noOfSkillCwsnHi: any = "";
  noOfSkillCwsnOh: any = "";
  noOfSkillCwsnSi: any = "";
  noOfSkillCwsnId: any = "";
  noOfSkillCwsnCp: any = "";
  noOfSkillCwsnOthers: any = "";
  noOfSkillCwsnTotal: any = "";

  noOfSpeechTherapy: any = "";
  noOfPhysiotherapy: any = "";
  noOfOccupationalTherapy: any = "";
  noOfTLM: any = "";
  centerName: any = "";
  noOfDisabilityCertificate: any = "";
  allErrorMessages: string[] = [];
  allLabel: string[] = [
    "Registered CWSN VI",
    "Registered CWSN Hi",
    "Registered CWSN OH",
    "Registered CWSN SI",
    "Registered CWSN ID",
    "Registered CWSN CP",
    "Registered CWSN OTHERS",
    "Registered CWSN ",

    "Present CWSN VI",
    "Present CWSN HI",
    "Present CWSN OH",
    "Present CWSN SI",
    "Present CWSN ID",
    "Present CWSN CP",
    "Present CWSN OTHERS",
    "Present CWSN ",

    "How many IEP / ITP of CWSN were prepared",

    "Assistive CWSN devices VI",
    "Assistive CWSN devices HI",
    "Assistive CWSN devices OH",
    "Assistive CWSN devices SI",
    "Assistive CWSN devices ID",
    "Assistive CWSN devices CP",
    "Assistive CWSN devices OTHERS",
    "Assistive CWSN devices ",

    "Educational CWSN devices VI",
    "Educational CWSN devices HI",
    "Educational CWSN devices OH",
    "Educational CWSN devices SI",
    "Educational CWSN devices ID",
    "Educational CWSN devices CP",
    "Educational CWSN devices OTHERS",
    "Educational CWSN devices ",

    "Skill training CWSN device VI",
    "Skill training CWSN device HI",
    "Skill training CWSN device OH",
    "Skill training CWSN device SI",
    "Skill training CWSN device ID",
    "Skill training CWSN device CP",
    "Skill training CWSN device OTHERS",
    "Skill training CWSN ",

    "Speech Therapy",
    "Physiotherapy",
    "Occupational Therapy",
    "How many Children were given individual TLM",
    "How many CWSN were assessed for Disability Certificate",
  ];

  userDetails!: any;
  tokenParams: any = "";
  constructor(
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private el: ElementRef,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private divyaService: DivyaService,
    private route: ActivatedRoute,
    private jwtHelper: JwtHelperService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserDetails();
    this.initializeForm();
  }
  getUserDetails() {
    this.divyaService.getTokenDetails(this.route, this.router);
    this.divyaService.tokenEmitter.subscribe((res: any) => {
      this.userDetails = res;
      this.centerName = this.userDetails.activityCenterName;
    });
  }
  initializeForm() {
    this.resourceCenterTeacherForm = this.formBuilder.group({
      noOfRegisteredCwsnVi: [
        this.noOfRegisteredCwsnVi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfRegisteredCwsnHi: [
        this.noOfRegisteredCwsnHi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfRegisteredCwsnOh: [
        this.noOfRegisteredCwsnOh,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfRegisteredCwsnSi: [
        this.noOfRegisteredCwsnSi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfRegisteredCwsnId: [
        this.noOfRegisteredCwsnId,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfRegisteredCwsnCp: [
        this.noOfRegisteredCwsnCp,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfRegisteredCwsnOthers: [
        this.noOfRegisteredCwsnOthers,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfRegisteredCwsnTotal: [
        this.noOfRegisteredCwsnTotal,
        [Validators.required, Validators.pattern(/^[0-9]\d*$/)],
      ],

      noOfPresentCwsnVi: [
        this.noOfPresentCwsnVi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfPresentCwsnHi: [
        this.noOfPresentCwsnHi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfPresentCwsnOh: [
        this.noOfPresentCwsnOh,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfPresentCwsnSi: [
        this.noOfPresentCwsnSi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfPresentCwsnId: [
        this.noOfPresentCwsnId,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfPresentCwsnCp: [
        this.noOfPresentCwsnCp,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfPresentCwsnOthers: [
        this.noOfPresentCwsnOthers,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfPresentCwsnTotal: [
        this.noOfPresentCwsnTotal,
        [Validators.required, Validators.pattern(/^[0-9]\d*$/)],
      ],

      noOfIEPOrITPPrepared: [
        this.noOfIEPOrITPPrepared,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]\d*$/),
        ],
      ],

      noOfAssistiveDevicesVi: [
        this.noOfAssistiveDevicesVi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfAssistiveDevicesHi: [
        this.noOfAssistiveDevicesHi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfAssistiveDevicesOh: [
        this.noOfAssistiveDevicesOh,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfAssistiveDevicesSi: [
        this.noOfAssistiveDevicesSi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfAssistiveDevicesId: [
        this.noOfAssistiveDevicesId,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfAssistiveDevicesCp: [
        this.noOfAssistiveDevicesCp,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfAssistiveDevicesOthers: [
        this.noOfAssistiveDevicesOthers,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfAssistiveDevicesTotal: [
        this.noOfAssistiveDevicesTotal,
        [Validators.required, Validators.pattern(/^[0-9]\d*$/)],
      ],

      noOfEducationalCwsnVi: [
        this.noOfEducationalCwsnVi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfEducationalCwsnHi: [
        this.noOfEducationalCwsnHi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfEducationalCwsnOh: [
        this.noOfEducationalCwsnOh,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfEducationalCwsnSi: [
        this.noOfEducationalCwsnSi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfEducationalCwsnId: [
        this.noOfEducationalCwsnId,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfEducationalCwsnCp: [
        this.noOfEducationalCwsnCp,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfEducationalCwsnOthers: [
        this.noOfEducationalCwsnOthers,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfEducationalCwsnTotal: [
        this.noOfEducationalCwsnTotal,
        [Validators.required, Validators.pattern(/^[0-9]\d*$/)],
      ],

      noOfSkillCwsnVi: [
        this.noOfSkillCwsnVi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfSkillCwsnHi: [
        this.noOfSkillCwsnHi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfSkillCwsnOh: [
        this.noOfSkillCwsnOh,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfSkillCwsnSi: [
        this.noOfSkillCwsnSi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfSkillCwsnId: [
        this.noOfSkillCwsnId,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfSkillCwsnCp: [
        this.noOfSkillCwsnCp,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfSkillCwsnOthers: [
        this.noOfSkillCwsnOthers,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfSkillCwsnTotal: [
        this.noOfSkillCwsnTotal,
        [Validators.required, Validators.pattern(/^[0-9]\d*$/)],
      ],

      noOfSpeechTherapy: [
        this.noOfSpeechTherapy,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfPhysiotherapy: [
        this.noOfPhysiotherapy,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfOccupationalTherapy: [
        this.noOfOccupationalTherapy,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfTLM: [
        this.noOfTLM,
        [Validators.pattern(/^[0-9]\d*$/), Validators.maxLength(3)],
      ],
      noOfDisabilityCertificate: [
        this.noOfDisabilityCertificate,
        [Validators.pattern(/^[0-9]\d*$/), Validators.maxLength(3)],
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
    if (parseInt(calculationFor) == 1) {
      if (total == 0) {
        this.resourceCenterTeacherForm.patchValue({
          noOfRegisteredCwsnTotal: "",
        });
      } else {
        this.resourceCenterTeacherForm.patchValue({
          noOfRegisteredCwsnTotal: total,
        });
      }
    }
    if (parseInt(calculationFor) == 2) {
      if (total == 0) {
        this.resourceCenterTeacherForm.patchValue({
          noOfPresentCwsnTotal: "",
        });
      } else {
        this.resourceCenterTeacherForm.patchValue({
          noOfPresentCwsnTotal: total,
        });
      }
    }
    if (parseInt(calculationFor) == 3) {
      if (total == 0) {
        this.resourceCenterTeacherForm.patchValue({
          noOfAssistiveDevicesTotal: "",
        });
      } else {
        this.resourceCenterTeacherForm.patchValue({
          noOfAssistiveDevicesTotal: total,
        });
      }
    }
    if (parseInt(calculationFor) == 4) {
      if (total == 0) {
        this.resourceCenterTeacherForm.patchValue({
          noOfEducationalCwsnTotal: "",
        });
      } else {
        this.resourceCenterTeacherForm.patchValue({
          noOfEducationalCwsnTotal: total,
        });
      }
    }
    if (parseInt(calculationFor) == 5) {
      if (total == 0) {
        this.resourceCenterTeacherForm.patchValue({
          noOfSkillCwsnTotal: "",
        });
      } else {
        this.resourceCenterTeacherForm.patchValue({
          noOfSkillCwsnTotal: total,
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
      this.resourceCenterTeacherForm.get(maxLimitCntrl)?.value > 0
        ? parseInt(this.resourceCenterTeacherForm.get(maxLimitCntrl)?.value)
        : 0;
    let cc =
      this.resourceCenterTeacherForm.get(compareCntrl)?.value > 0
        ? parseInt(this.resourceCenterTeacherForm.get(compareCntrl)?.value)
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
          this.resourceCenterTeacherForm.get(compareCntrl)?.patchValue("");
          invalidControl.focus();
        });
    }
    if (mlc > 0 && cc > 0) {
      if (mlc < cc) {
        this.alertHelper
          .viewAlertHtml(
            "error",
            "Invalid inputs",
            compareCntrlLabel + " can not be greater than " + maxLimitCntrlLabel
          )
          .then((res: any) => {
            const invalidControl = this.el.nativeElement.querySelector(
              '[formControlName="' + compareCntrl + '"]'
            );
            this.resourceCenterTeacherForm.get(compareCntrl)?.patchValue("");
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
    let mlc = this.resourceCenterTeacherForm.get(maxLimitCntrl)?.value
      ? parseInt(this.resourceCenterTeacherForm.get(maxLimitCntrl)?.value)
      : 0;
    let cc1 = this.resourceCenterTeacherForm.get(compareCntrl1)?.value
      ? parseInt(this.resourceCenterTeacherForm.get(compareCntrl1)?.value)
      : 0;
    let cc2 = this.resourceCenterTeacherForm.get(compareCntrl2)?.value
      ? parseInt(this.resourceCenterTeacherForm.get(compareCntrl2)?.value)
      : 0;
    let cc3 = this.resourceCenterTeacherForm.get(compareCntrl3)?.value
      ? parseInt(this.resourceCenterTeacherForm.get(compareCntrl3)?.value)
      : 0;
    let cc4 = this.resourceCenterTeacherForm.get(compareCntrl4)?.value
      ? parseInt(this.resourceCenterTeacherForm.get(compareCntrl4)?.value)
      : 0;

    if (mlc < cc1) {
      this.alertHelper
        .viewAlertHtml(
          "error",
          "Invalid inputs",
          "Registered CWSN " +
            type +
            " can not be Smaller than CWSN Present " +
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
          "Registered CWSN " +
            type +
            " can not be Smaller than CWSN Assistive devices " +
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
          "Registered CWSN " +
            type +
            " can not be Smaller than CWSN Educational devices " +
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
          "Registered CWSN " +
            type +
            " can not be Smaller than CWSN Skill training " +
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
    if ("INVALID" === this.resourceCenterTeacherForm.status) {
      for (const key of Object.keys(this.resourceCenterTeacherForm.controls)) {
        if (this.resourceCenterTeacherForm.controls[key].status === "INVALID") {
          let invalidControl;
          switch (key) {
            case "noOfRegisteredCwsnTotal":
              invalidControl = this.el.nativeElement.querySelector(
                '[formControlName="noOfRegisteredCwsnVi"]'
              );
              break;
            case "noOfPresentCwsnTotal":
              invalidControl = this.el.nativeElement.querySelector(
                '[formControlName="noOfPresentCwsnVi"]'
              );
              break;
            case "noOfAssistiveDevicesTotal":
              invalidControl = this.el.nativeElement.querySelector(
                '[formControlName="noOfAssistiveDevicesVi"]'
              );
              break;
            case "noOfEducationalCwsnTotal":
              invalidControl = this.el.nativeElement.querySelector(
                '[formControlName="noOfEducationalCwsnVi"]'
              );
              break;
            case "noOfEducationalCwsnTotal":
              invalidControl = this.el.nativeElement.querySelector(
                '[formControlName="noOfEducationalCwsnVi"]'
              );
              break;
            case "noOfSkillCwsnTotal":
              invalidControl = this.el.nativeElement.querySelector(
                '[formControlName="noOfSkillCwsnVi"]'
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
            this.resourceCenterTeacherForm,
            this.allLabel
          );
          break;
        }
      }
    }
    if (this.resourceCenterTeacherForm.invalid) {
      return;
    }
    //  therapy validation------------start
    let speachtherapy = this.resourceCenterTeacherForm.controls[
      "noOfSpeechTherapy"
    ]?.value
      ? parseInt(
          this.resourceCenterTeacherForm.controls["noOfSpeechTherapy"]?.value
        )
      : 0;
    let physiotherapy = this.resourceCenterTeacherForm.controls[
      "noOfPhysiotherapy"
    ]?.value
      ? parseInt(
          this.resourceCenterTeacherForm.controls["noOfPhysiotherapy"]?.value
        )
      : 0;
    let occupationaltherapy = this.resourceCenterTeacherForm.controls[
      "noOfOccupationalTherapy"
    ]?.value
      ? parseInt(
          this.resourceCenterTeacherForm.controls["noOfOccupationalTherapy"]
            ?.value
        )
      : 0;
    let therapyTotal = speachtherapy + physiotherapy + occupationaltherapy;
    let focusCntrl = "noOfSpeechTherapy";
    if (therapyTotal < 1) {
      const invalidControl = this.el.nativeElement.querySelector(
        '[formControlName="' + focusCntrl + '"]'
      );
      invalidControl.focus();

      this.alertHelper.viewAlertHtml(
        "error",
        "Invalid inputs",
        "Please enter atleast one CWSN  benefited with Therapy"
      );
      return;
    }
    //  therapy validation------------end
    //  TLM validation------------start
    let noOfTLM = this.resourceCenterTeacherForm.controls["noOfTLM"]?.value
      ? parseInt(this.resourceCenterTeacherForm.controls["noOfTLM"]?.value)
      : -1;
    let focusCntrl1 = "noOfTLM";
    if (noOfTLM < 0) {
      const invalidControl = this.el.nativeElement.querySelector(
        '[formControlName="' + focusCntrl1 + '"]'
      );
      invalidControl.focus();
      this.alertHelper.viewAlertHtml(
        "error",
        "Invalid inputs",
        "How many Children were given individual TLM Required"
      );
      return;
    }
    //  TLM validation------------end
    //  Disability Certificate validation------------start
    let noOfDisabilityCertificate = this.resourceCenterTeacherForm.controls[
      "noOfDisabilityCertificate"
    ]?.value
      ? parseInt(
          this.resourceCenterTeacherForm.controls["noOfDisabilityCertificate"]
            ?.value
        )
      : -1;
    let focusCntrl2 = "noOfDisabilityCertificate";
    if (noOfDisabilityCertificate < 0) {
      const invalidControl = this.el.nativeElement.querySelector(
        '[formControlName="' + focusCntrl2 + '"]'
      );
      invalidControl.focus();
      this.alertHelper.viewAlertHtml(
        "error",
        "Invalid inputs",
        "How many CWSN were assessed for Disability Certificate Required"
      );
      return;
    }
    //  Disability Certificate validation------------end

    if (this.resourceCenterTeacherForm.valid === true) {
      this.alertHelper.submitAlert().then((result: any) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.divyaService
            .saveResourceCenterTeacher(this.resourceCenterTeacherForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Resourse Center inspection data saved successfully.",
                    "success"
                  )
                  .then(() => {
                    this.router.navigate(["../success"], {
                      relativeTo: this.route,
                    });
                  });
                this.initializeForm();
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
      this.resourceCenterTeacherForm
        .get(controlname)
        ?.patchValue(event.target.value);
    }
    var charCode = event.which ? event.which : event.keyCode;

    if (charCode < 48 || charCode > 57) {
      event.target.value = event.target.value.replace(/[^\d]/g, "");
      this.resourceCenterTeacherForm
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
