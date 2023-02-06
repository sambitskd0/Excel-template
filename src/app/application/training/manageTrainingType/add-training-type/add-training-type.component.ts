import { Component, ElementRef, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { Constant } from "src/app/shared/constants/constant";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { formatDate } from "@angular/common";
import { TrainingTypeService } from "../../services/training-type.service";
import { RouterLink } from "@angular/router";
import {
  ActivatedRoute,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { post } from "jquery";

@Component({
  selector: "app-add-training-type",
  templateUrl: "./add-training-type.component.html",
  styleUrls: ["./add-training-type.component.css"],
})
export class AddTrainingTypeComponent implements OnInit {
  CreateTraining!: FormGroup;
  userProfile: any = [];
  createdBy: any = "";
  trainingSubject: any = "";
  trainingName: any = "";
  trainingType: any = "";
  description: any = "";
  lastDateTraining: any = "";
  trainingMode: any = "";

  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();

  submitted = false;
  allErrorMessages: string[] = [];
  allLabel: string[] = [
    "",
    "Training Subject",
    "Training Name",
    "Training Type",
    "Description",
    "Mode of Training",
  ];

  trainingModeChanged = false;
  trainingSubjectChanged = false;
  trainingTypeChanged = true;

  data: any;
  res: any;
  strIntoObj: any;
  preAndPastYear:any = [];
  constructor(
    private formBuilder: FormBuilder,

    private alertHelper: AlertHelper,
    private route: Router,
    private router: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private el: ElementRef,
    private commonserviceService: CommonserviceService,
    public customValidators: CustomValidators,
    private trainingTypeServices: TrainingTypeService
  ) {}

  ngOnInit(): void {
    this.getPresentAndPastAcademicYear();
    this.userProfile = this.commonserviceService.getUserProfile();
    this.spinner.show();
    this.initializeForm();
    this.trainingTypeServices.getSubject().subscribe((data: any) => {
      this.res = data.data;
      this.spinner.hide();
    });
  }

  ngAfterViewInit(){
    this.el.nativeElement.querySelector("[formControlName=trainingSubject]").focus();
  }

  getPresentAndPastAcademicYear(){
    var splitted = this.academicYear.split("-", 2);
    var y1 = splitted[0] - 1;
    var y2 = splitted[1] - 1;
    var y3 = y1+"-"+y2;
    const spilit = this.academicYear+","+y3;
    this.preAndPastYear = spilit.split(",");
  }

  initializeForm() {
    this.CreateTraining = this.formBuilder.group({
      academicYear: [this.academicYear],
      trainingSubject: [this.trainingSubject, [Validators.required]],

      trainingName: [
        this.trainingName,
        [
          Validators.required,
          this.customValidators.firstCharValidatorRF,
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z0-9._-\s-]*$/),
        ],
      ],
      trainingType: [this.trainingType, [Validators.required]],
      description: [""],
      //lastDateTraining: [this.lastDateTraining,[Validators.required]],
      trainingMode: [this.trainingMode, [Validators.required]],
      createdBy: [this.userProfile.userId],
    });
  }

  checkTrainingDate(e: any) {
    let paramList = { lTDate: e };
    this.trainingTypeServices
      .checkTrainingDate(paramList)
      .subscribe((resp: any) => {
        let checkDateData = resp.success;
        if (checkDateData == true) {
          this.alertHelper.viewAlert(
            "error",
            "Invalid",
            "This Date is Already Booked for other Training!"
          );
        }
      });
  }

  onSubmit() {
    this.submitted = true;
    // if ("INVALID" === this.CreateTraining.status) {
    //   for (const key of Object.keys(this.CreateTraining.controls)) {
    //     if (this.CreateTraining.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(
    //         this.CreateTraining,
    //         this.allLabel
    //       );
    //       break;
    //     }
    //   }
    // }

    if(this.CreateTraining.invalid){
      // this.customValidators.formValidationHandler(
      //   this.CreateTraining,
      //   this.allLabel,
      //   this.el
      // );
      this.customValidators.formValidationHandler(
        this.CreateTraining,
        this.allLabel,
        this.el,
        {
          required: {
            trainingSubject: "Please select Training Subject",
            trainingName: "Please enter Training Name",
            trainingType: "Please select Training Type",
            trainingMode: "Please select Mode of Training",
          },
        }
      );
    }

    if (this.CreateTraining.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.trainingTypeServices
            .saveTraining(this.CreateTraining.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner

                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Teacher Training details saved successfully",
                    "success"
                  )
                  .then(() => {
                    this.route.navigate(["./../viewTrainingType"], {
                      relativeTo: this.router,
                    });
                    //this.initializeForm();
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
              complete: () => console.log("done"),
            });
        }
      });
    }
  }

  futuredateCheck() {
    let visitDate = this.CreateTraining.controls["lastDateTraining"].value;
    const newDate = new Date();
    if (visitDate !== "")
      if (
        formatDate(visitDate, "yyyy-MM-dd", "en_US") <
        formatDate(newDate, "yyyy-MM-dd", "en_US")
      ) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Last Date of Training must be above from today's date"
        );
        this.CreateTraining.patchValue({
          lastDateTraining: "",
        });
      }
  }
}
