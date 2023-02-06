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
  selector: "app-edit-self-training-request",
  templateUrl: "./edit-self-training-request.component.html",
  styleUrls: ["./edit-self-training-request.component.css"],
})
export class EditSelfTrainingRequestComponent implements OnInit {
  EditSelfRequest!: FormGroup;
  userProfile: any = [];
  createdBy: any = "";
  idselfTrainingRequest: any = "";
  trainingSubject: any = "";
  trainingName: any = "";
  trainingType: any = "";
  description: any = "";

  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();

  submitted = false;
  allErrorMessages: string[] = [];
  allLabel: string[] = [
    "",
    "",
    "Training Subject",
    "Training Name",
    "Description",
  ];
  loadingObj: any = {
    trainingLoads: false,
    subjectLoad: false,
    districtLoad: false,
    blockLoad: false,
  };

  data: any;
  res: any;
  id: any;
  training: any;
  trainingNames: any;
  trainingNameLoad: boolean = false;
  trainingId: any;
  preAndPastYear:any = [];
  constructor(
    private formBuilder: FormBuilder,

    private alertHelper: AlertHelper,

    private spinner: NgxSpinnerService,
    private el: ElementRef,
    public customValidators: CustomValidators,
    private route: Router,
    private router: ActivatedRoute,
    private TrainingTypeService: SelfTrainingRequestService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getPresentAndPastAcademicYear();
    this.id = this.router.snapshot.params["encId"];
    //console.log(this.id);
    this.editViewTraining(this.id);
    this.getSubjectList();
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
  }

  getTrainingName(ids: any) {
    //console.log(id);

    this.EditSelfRequest.get("trainingName")?.patchValue("");
    this.loadingObj.trainingLoads = true;

    this.TrainingTypeService.getTrainingDetails(ids).subscribe((data: any) => {
      if (data == null) {
        this.trainingNames = [];
        this.loadingObj.trainingLoads = false;
      } else {
        this.trainingName = "";
        this.trainingNames = data.data;
        //console.log(this.trainingNames);
        this.loadingObj.trainingLoads = false;
      }
    });
  }

  initializeForm() {
    this.EditSelfRequest = this.formBuilder.group({
      idselfTrainingRequest: [this.id],
      academicYear: [this.academicYear, [Validators.required]],
      trainingSubject: [this.trainingSubject, [Validators.required]],

      trainingName: [this.trainingId, [Validators.required]],

      description: [this.description],

      updatedBy:[this.userProfile.userId]
      //createdBy:[this.userProfile.userId]
    });
  }

  editViewTraining(id: any) {
    let paramList: any = { encId: this.id };
    this.spinner.show();
    this.TrainingTypeService.getSelfTrainingRequestDataById(
      paramList
    ).subscribe((resp: any) => {
      this.data = resp.data[0];
      this.idselfTrainingRequest = this.id;
      this.academicYear = this.data.academicYear;
      this.trainingSubject = this.data.trainingSubject;
      this.trainingId = this.data.trainingId;
      this.description = this.data.description;
      this.getTrainingName(this.trainingSubject);
      this.initializeForm();
      this.spinner.hide();
    });
  }

  onSubmit() {
    this.submitted = true;
    // if ("INVALID" === this.EditSelfRequest.status) {
    //   for (const key of Object.keys(this.EditSelfRequest.controls)) {
    //     if (this.EditSelfRequest.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(
    //         this.EditSelfRequest,
    //         this.allLabel
    //       );
    //       break;
    //     }
    //   }
    // }

    if(this.EditSelfRequest.invalid){
      this.customValidators.formValidationHandler(
                this.EditSelfRequest,
                this.allLabel,
                this.el
              );
    }

    if (this.EditSelfRequest.valid === true) {
      this.alertHelper.updateAlert().then((result) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.TrainingTypeService.updateSelfTrainingRequest(
            this.EditSelfRequest.value
          ).subscribe({
            next: (res: any) => {
              this.spinner.hide(); //==== hide spinner
              this.alertHelper
                .successAlert(
                  "Updated!",
                  "Self training request updated successfully .",
                  "success"
                )
                .then(() => {
                  this.route.navigate(["../../view"], {
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
