/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 06-08-2022
 * Description : Survey work.
 **/

import { Component, ElementRef, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { DivyaService } from "../services/divya.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-survey-work",
  templateUrl: "./survey-work.component.html",
  styleUrls: ["./survey-work.component.css"],
})
export class SurveyWorkComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private alertHelper: AlertHelper,
    private el: ElementRef,
    private divyaService: DivyaService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  surveyForm!: FormGroup;

  schoolId: any = "";
  blindness: any = "";
  lowVision: any = "";
  hearingImpairment: any = "";
  speechLanguage: any = "";
  locomotorDisability: any = "";
  mentalIllness: any = "";
  specificLearning: any = "";
  cerebralPalsy: any = "";
  autismSpectrum: any = "";
  multipleDisablities: any = "";
  leprosy: any = "";
  dwarifism: any = "";
  intellectual: any = "";
  muscular: any = "";
  chronicNurological: any = "";
  multipleSclerosis: any = "";
  thalassemia: any = "";
  hemophilia: any = "";
  sickleCell: any = "";
  acidAttack: any = "";
  parkinson: any = "";
  noOf0to3Yrs: any = "";
  noOf3to6Yrs: any = "";
  noOf6to14Yrs: any = "";
  noOf14to18Yrs: any = "";
  noOfCertificate: any = "";
  noOfSurgery: any = "";
  noOfAssistiveDevices: any = "";
  noOfEscortAllowance: any = "";
  noOfTransportAllowance: any = "";
  noOfReaderAllowance: any = "";
  noOfSparshProgram: any = "";
  noOfNRTraining: any = "";
  noOfUnnamed: any = "";
  userDetails!: any;
  allLabel: string[] = [
    "",
    "How many children with disabilities - Blindness ",
    "How many children with disabilities - Low-Vision ",
    "How many children with disabilities - Hearing Impairment ",
    "How many children with disabilities - Speech and Language Disablity ",
    "How many children with disabilities - Locomotor Disability ",
    "How many children with disabilities - Mental Illness ",
    "How many children with disabilities - Specific Learning Disablities ",
    "How many children with disabilities - Cerebral Palsy ",
    "How many children with disabilities - Autism Spectrum Disorder ",
    "How many children with disabilities - Multiple Disablities including deaf blindness ",
    "How many children with disabilities - Leprosy Cured persons ",
    "How many children with disabilities - Dwarifism",
    "How many children with disabilities - Intellectual Disablity ",
    "How many children with disabilities - Muscular Dystrophy ",
    "How many children with disabilities - Chronic Nurological conditions ",
    "How many children with disabilities - Multiple Sclerosis ",
    "How many children with disabilities - Thalassemia ",
    "How many children with disabilities - Hemophilia ",
    "How many children with disabilities - Sickle Cell disease ",
    "How many children with disabilities - Acid Attack Victim ",
    "How many children with disabilities - Parkinson's disease ",

    "How many children identified disabilities in between 0-3 Years ",
    "How many children identified disabilities in between 3-6 Years	",
    "How many children identified disabilities in between 6-14 Years ",
    "How many children identified disabilities in between 14-18 Years	",

    "How many children with disabilities have been identified for making certificates",
    "How many disabled children have been identified for surgery",
    "How many children with disabilities have been identified for assistive devices",
    "How many children were identified for Escort Allowance",
    "How many children were identified for Transport Allowance",
    "How many children were marked for Reader Allowance",
    "How many children have been identified for the Sparsh program",
    "How many children have been identified for 90 days non-residential training",
    "How many children with disabilities have been marked unnamed so far",
  ];

  ngOnInit(): void {
    this.getUserDetails();
    this.initializeForm();
  }

  // get user details
  getUserDetails() {
    this.divyaService.getTokenDetails(this.route, this.router);
    this.divyaService.tokenEmitter.subscribe((res: any) => {
      this.userDetails = res;
      this.surveyForm.patchValue({
        schoolId: this.userDetails?.activityCenterId,
      });
    });
  }

  onSubmit() {
    const formValue = this.surveyForm.value;
    const disabilitySum =
      +formValue?.blindness +
      +formValue?.lowVision +
      +formValue?.hearingImpairment +
      +formValue?.speechLanguage +
      +formValue?.locomotorDisability +
      +formValue?.mentalIllness +
      +formValue?.specificLearning +
      +formValue?.cerebralPalsy +
      +formValue?.autismSpectrum +
      +formValue?.multipleDisablities +
      +formValue?.leprosy +
      +formValue?.dwarifism +
      +formValue?.intellectual +
      +formValue?.muscular +
      +formValue?.chronicNurological +
      +formValue?.multipleSclerosis +
      +formValue?.thalassemia +
      +formValue?.hemophilia +
      +formValue?.sickleCell +
      +formValue?.acidAttack +
      +formValue?.parkinson;

    const ageWieSum =
      +formValue?.noOf0to3Yrs +
      +formValue?.noOf3to6Yrs +
      +formValue?.noOf6to14Yrs +
      +formValue?.noOf14to18Yrs;

    if (disabilitySum === 0) {
      const invalidControl = this.el.nativeElement.querySelector(
        '[formControlName="blindness"]'
      );
      invalidControl.focus();
      this.alertHelper.viewAlert(
        "error",
        "Invalid",
        "How many children with disabilities have been found in the survey requried."
      );
    } else if (ageWieSum === 0) {
      const invalidControl = this.el.nativeElement.querySelector(
        '[formControlName="noOf0to3Yrs"]'
      );
      invalidControl.focus();
      this.alertHelper.viewAlert(
        "error",
        "Invalid",
        "Age-wise number of children identified in the survey requried."
      );
    } else if (this.surveyForm.invalid) {
      for (const key of Object.keys(this.surveyForm.controls)) {
        if (this.surveyForm.controls[key].status === "INVALID") {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + key + '"]'
          );

          invalidControl.focus();
          this.customValidators.formValidationHandler(
            this.surveyForm,
            this.allLabel
          );
          break;
        }
      }
    } else {
      this.alertHelper.submitAlert().then((result: any) => {
        if (result.value) {
          this.spinner.show();
          this.submitTheForm();
        }
      });
    }
  }
  submitTheForm() {
    this.divyaService.submitSurveyWork(this.surveyForm.value).subscribe({
      next: (response: any) => {
        this.spinner.hide(); // hide spinner
        if (response?.success === true) {
          this.alertHelper
            .successAlert("Saved!", response?.msg, "success")
            .then(() => {
              this.router.navigate(["../success"], {
                relativeTo: this.route,
              });
            });
          this.initializeForm();
        } else {
          this.alertHelper.viewAlert("error", "Invalid", response?.msg);
        }
      },
      error: (error: any) => {
        this.spinner.hide(); // hide spinner
        // console.log(error);
      },
    });
  }

  keyUpInputNumber(event: any, controlname: any, maxLength: number = 3) {
    if (event.target.value.length > maxLength) {
      event.target.value = event.target.value.substr(0, maxLength);
      this.surveyForm.get(controlname)?.patchValue(event.target.value);
    }
    var charCode = event.which ? event.which : event.keyCode;

    if (charCode < 48 || charCode > 57) {
      event.target.value = event.target.value.replace(/[^\d]/g, "");
      this.surveyForm.get(controlname)?.patchValue(event.target.value);
      return false;
    } else {
      return true;
    }
  }
  // form initialization
  initializeForm() {
    this.surveyForm = this.formBuilder.group({
      schoolId: [this.schoolId, [Validators.required]],
      blindness: [
        this.blindness,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]+$/)],
      ],
      lowVision: [
        this.lowVision,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]+$/)],
      ],
      hearingImpairment: [
        this.hearingImpairment,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]+$/)],
      ],
      speechLanguage: [
        this.speechLanguage,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]+$/)],
      ],
      locomotorDisability: [
        this.locomotorDisability,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]+$/)],
      ],
      mentalIllness: [
        this.mentalIllness,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]+$/)],
      ],
      specificLearning: [
        this.specificLearning,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]+$/)],
      ],
      cerebralPalsy: [
        this.cerebralPalsy,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]+$/)],
      ],
      autismSpectrum: [
        this.autismSpectrum,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]+$/)],
      ],
      multipleDisablities: [
        this.multipleDisablities,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]+$/)],
      ],
      leprosy: [
        this.leprosy,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]+$/)],
      ],
      dwarifism: [
        this.dwarifism,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]+$/)],
      ],
      intellectual: [
        this.intellectual,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]+$/)],
      ],
      muscular: [
        this.muscular,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]+$/)],
      ],
      chronicNurological: [
        this.chronicNurological,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]+$/)],
      ],
      multipleSclerosis: [
        this.multipleSclerosis,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]+$/)],
      ],
      thalassemia: [
        this.thalassemia,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]+$/)],
      ],
      hemophilia: [
        this.hemophilia,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]+$/)],
      ],
      sickleCell: [
        this.sickleCell,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]+$/)],
      ],
      acidAttack: [
        this.acidAttack,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]+$/)],
      ],
      parkinson: [
        this.parkinson,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]+$/)],
      ],
      noOf0to3Yrs: [
        this.noOf0to3Yrs,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]+$/)],
      ],
      noOf3to6Yrs: [
        this.noOf3to6Yrs,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]+$/)],
      ],
      noOf6to14Yrs: [
        this.noOf6to14Yrs,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]+$/)],
      ],
      noOf14to18Yrs: [
        this.noOf14to18Yrs,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]+$/)],
      ],
      noOfCertificate: [
        this.noOfCertificate,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]+$/),
        ],
      ],
      noOfSurgery: [
        this.noOfSurgery,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]+$/),
        ],
      ],
      noOfAssistiveDevices: [
        this.noOfAssistiveDevices,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]+$/),
        ],
      ],
      noOfEscortAllowance: [
        this.noOfEscortAllowance,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]+$/),
        ],
      ],
      noOfTransportAllowance: [
        this.noOfTransportAllowance,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]+$/),
        ],
      ],
      noOfReaderAllowance: [
        this.noOfReaderAllowance,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]+$/),
        ],
      ],
      noOfSparshProgram: [
        this.noOfSparshProgram,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]+$/),
        ],
      ],
      noOfNRTraining: [
        this.noOfNRTraining,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]+$/),
        ],
      ],
      noOfUnnamed: [
        this.noOfUnnamed,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]+$/),
        ],
      ],
    });
  }
  resetForm() {
    this.initializeForm();
  }
}
