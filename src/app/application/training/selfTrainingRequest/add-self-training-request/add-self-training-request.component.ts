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
import { SelfTrainingRequestService } from "../../services/self-training-request.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-add-self-training-request",
  templateUrl: "./add-self-training-request.component.html",
  styleUrls: ["./add-self-training-request.component.css"],
})
export class AddSelfTrainingRequestComponent implements OnInit {
  CreateSelfTraining!: FormGroup;
  userProfile: any = [];
  createdBy: any = "";
  trainingSubject: any = "";
  trainingName: any = "";

  description: any = "";
  trainingNameChanged: boolean = false;
  trainingNameLoad: boolean = true;

  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();

  submitted = false;
  allErrorMessages: string[] = [];
  allLabel: string[] = ["", "Training Subject", "Training Name", "Description"];

  res: any;
  training: any;
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
    public TrainingTypeService: SelfTrainingRequestService
  ) {}

  ngOnInit(): void {
    this.getPresentAndPastAcademicYear();
    this.userProfile = this.commonserviceService.getUserProfile();
    this.spinner.show();
    this.initializeForm();
    this.getSubjectList();

    //alert(this.userProfile.userId);
    //console.warn(this.userProfile.userId);
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

  getSubjectList() {
    this.TrainingTypeService.getSubject().subscribe((data: any) => {
      this.res = data.data;
      this.spinner.hide();
    });
    this.training = [];
  }

  getTrainName(id: any) {
    this.training = [];
    this.trainingName = "";
    this.CreateSelfTraining.get("trainingName")?.patchValue("");
    this.trainingNameLoad = false;
    this.TrainingTypeService.getTrainingDetails(id).subscribe((data: any) => {
      if (data == null) {
        this.training = [];
        this.CreateSelfTraining.get("trainingName")?.patchValue("");
        this.trainingNameLoad = true;
      } else {
        this.trainingName = "";
        this.training = data.data;
        this.trainingNameLoad = true;
      }
    });
  }

  initializeForm() {
    this.CreateSelfTraining = this.formBuilder.group({
      academicYear: [this.academicYear],
      trainingSubject: [this.trainingSubject, [Validators.required]],
      trainingName: [this.trainingName, [Validators.required]],
      description: [""],
      createdBy: [this.userProfile.userId],
    });
  }

  onSubmit() {
    this.submitted = true;
    // if ("INVALID" === this.CreateSelfTraining.status) {
    //   for (const key of Object.keys(this.CreateSelfTraining.controls)) {
    //     if (this.CreateSelfTraining.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(
    //         this.CreateSelfTraining,
    //         this.allLabel
    //       );
    //       break;
    //     }
    //   }
    // }
    if(this.CreateSelfTraining.invalid){
      this.customValidators.formValidationHandler(
                this.CreateSelfTraining,
                this.allLabel,
                this.el
              );
    }

    if (this.CreateSelfTraining.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.TrainingTypeService.saveSelfTrainingRequest(
            this.CreateSelfTraining.value
          ).subscribe({
            next: (res: any) => {
              this.spinner.hide(); //==== hide spinner

              this.alertHelper
                .successAlert(
                  "Saved!",
                  "Training request created successfully.",
                  "success"
                )
                .then(() => {
                  this.initializeForm();
                  this.route.navigate(["./../view"], {
                    relativeTo: this.router,
                  });
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
}
