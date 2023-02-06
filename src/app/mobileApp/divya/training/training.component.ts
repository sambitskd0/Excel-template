import { Component, ElementRef, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { DivyaService } from "../services/divya.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-training",
  templateUrl: "./training.component.html",
  styleUrls: ["./training.component.css"],
})
export class TrainingComponent implements OnInit {
  trainingForm!: FormGroup;
  submitted = false;
  trainingTypeChanged: boolean = false;
  allTrainingType: any = [];
  trainingTypeId: any = "";
  trainingName: any = "";
  trainingDuration: any = "";
  startDateCon: any = "";
  startDate: any = "";
  registeredParticipants: any = "";
  presentParticipants: any = "";
  registeredTrainers: any = "";
  presentTrainers: any = "";
  trainingType: any = "1";
  materialAvailability: any = "1";
  maxDate: any = Date;
  allErrorMessages: string[] = [];

  allLabel: string[] = [
    "Training Type",
    "Name of the Training",
    "Duration of Training",
    "Training Start Date",
    "No. of Participants Registered",
    "No. of Participants Present",
    "No. of Trainers Registered",
    "No. of Trainers Present",
    "Type of training",
    "Availability of Training materials",
  ];
  constructor(
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private el: ElementRef,
    private alertHelper: AlertHelper,
    private divyaServices: DivyaService,
    private spinner: NgxSpinnerService,

    private route: ActivatedRoute,
    private router: Router
  ) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.getTrainingType();
    this.initializeForm();
  }

  getTrainingType() {
    this.trainingTypeChanged = true;
    this.divyaServices
      .getAnextureType("DIVYA_TRAINING_TYPE")
      .subscribe((data: any) => {
        this.allTrainingType = data;
        this.allTrainingType = this.allTrainingType.data;
        this.trainingTypeChanged = false;
      });
  }

  submitTraining() {
    this.submitted = true;
    if (this.trainingForm.valid == true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          this.divyaServices.submitTraining(this.trainingForm.value).subscribe({
            next: (response: any) => {
              // console.log(response);

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
              this.spinner.hide(); //==== hide spinner
            },
          });
        }
      });
    } else {
      for (const key of Object.keys(this.trainingForm.controls)) {
        if (this.trainingForm.controls[key].status === "INVALID") {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + key + '"]'
          );
          invalidControl.focus();
          this.customValidators.formValidationHandler(
            this.trainingForm,
            this.allLabel
          );
          break;
        }
      }
      if (this.trainingForm.invalid) {
        return;
      }
    }
  }
  keyUpInputNumber(event: any, controlname: any, maxLength: number = 3) {
    if (event.target.value.length > maxLength) {
      event.target.value = event.target.value.substr(0, maxLength);
      this.trainingForm.get(controlname)?.patchValue(event.target.value);
    }
    var charCode = event.which ? event.which : event.keyCode;

    if (charCode < 48 || charCode > 57) {
      event.target.value = event.target.value.replace(/[^\d]/g, "");
      this.trainingForm.get(controlname)?.patchValue(event.target.value);
      return false;
    } else {
      return true;
    }
  }
  maxLimitChk(
    maxLimitCntrl: string,
    compareCntrl: string,
    maxLimitCntrlLabel: string,
    compareCntrlLabel: string
  ) {
    let mlc =
      this.trainingForm.get(maxLimitCntrl)?.value > 0
        ? parseInt(this.trainingForm.get(maxLimitCntrl)?.value)
        : 0;
    let cc =
      this.trainingForm.get(compareCntrl)?.value > 0
        ? parseInt(this.trainingForm.get(compareCntrl)?.value)
        : 0;
    if (cc > mlc) {
      this.alertHelper
        .viewAlertHtml(
          "error",
          "Invalid inputs",
          maxLimitCntrlLabel + " can not be empty "
        )
        .then((res: any) => {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + maxLimitCntrl + '"]'
          );
          this.trainingForm.get(compareCntrl)?.patchValue("");
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
            this.trainingForm.get(compareCntrl)?.patchValue("");
            invalidControl.focus();
          });
      }
    }
  }
  initializeForm() {
    this.trainingForm = this.formBuilder.group({
      trainingTypeId: [this.trainingTypeId, [Validators.required]],
      trainingName: [
        this.trainingName,
        [
          Validators.required,
          Validators.maxLength(120),
          Validators.pattern(/^[a-zA-Z0-9 ,.'\-\s]+$/),
          this.customValidators.firstCharValidatorRF,
        ],
      ],
      trainingDuration: [
        this.trainingDuration,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]+$/),
        ],
      ],
      startDate: [this.startDate, [Validators.required]],
      registeredParticipants: [
        this.registeredParticipants,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]+$/),
        ],
      ],
      presentParticipants: [
        this.presentParticipants,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]+$/),
        ],
      ],
      registeredTrainers: [
        this.registeredTrainers,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]+$/),
        ],
      ],
      presentTrainers: [
        this.presentTrainers,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]+$/),
        ],
      ],
      trainingType: [this.trainingType, [Validators.required]],
      materialAvailability: [this.materialAvailability, [Validators.required]],
    });
  }
  resetForm() {
    this.initializeForm();
  }
}
