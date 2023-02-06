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
import {
  ActivatedRoute,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { TrainingTypeService } from "../../services/training-type.service";
import { state } from "@angular/animations";

@Component({
  selector: "app-edit-training-type",
  templateUrl: "./edit-training-type.component.html",
  styleUrls: ["./edit-training-type.component.css"],
})
export class EditTrainingTypeComponent implements OnInit {
  [x: string]: any;
  CreateTraining!: FormGroup;
  userProfile: any = [];
  createdBy: any = "";
  teacherTraningid: any = "";
  trainingSubject: any = "";
  trainingName: any = "";
  trainingType: any = "";
  description: any = "";
  lastDateTraining: any = "";
  trainingMode: any = "";

  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();
  preAndPastYear:any = [];
  submitted = false;
  allErrorMessages: string[] = [];
  allLabel: string[] = [
    "",
    "Academic Year",
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
  //router: any;
  id: any;
  constructor(
    private formBuilder: FormBuilder,

    private alertHelper: AlertHelper,

    private spinner: NgxSpinnerService,
    private el: ElementRef,
    private commonserviceService: CommonserviceService,
    public customValidators: CustomValidators,
    private route: Router,
    private router: ActivatedRoute,
    private trainingTypeServices: TrainingTypeService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getPresentAndPastAcademicYear();
    this.id = this.router.snapshot.params["encId"];

    this.editViewTraining(this.id);
    this.trainingTypeServices.getSubject().subscribe((data: any) => {
      this.res = data.data;
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
      teacherTraningid: [this.id],
      academicYear: [this.academicYear, [Validators.required]],
      trainingSubject: [this.trainingSubject, [Validators.required]],

      trainingName: [
        this.trainingName,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z0-9._-\s-]*$/),
        ],
      ],
      trainingType: [this.trainingType, [Validators.required]],
      description: [this.description, [Validators.maxLength(500)]],
      //lastDateTraining: [this.lastDateTraining,[Validators.required]],
      trainingMode: [this.trainingMode, [Validators.required]],
      //createdBy:[this.userProfile.userId]
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

  editViewTraining(id: any) {
    this.spinner.show();
    let paramList: any = { encId: id };
    this.trainingTypeServices
      .readTrainingData(paramList)
      .subscribe((resp: any) => {
        this.data = resp.data[0];
        this.teacherTraningid = this.id;
        this.academicYear = this.data.academicYear;
        this.trainingSubject = this.data.trainingSubject;
        this.trainingName = this.data.trainingName;
        this.trainingType = this.data.trainingType.toString();
        this.description = this.data.description;
        //this.lastDateTraining = this.data.lastDateTraining;
        this.trainingMode = this.data.trainingMode;
        this.initializeForm();
        this.spinner.hide();
      });
  }

  onSubmit() {
    this.submitted = true;
    //console.log(this.CreateTraining.value);
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
      this.alertHelper.updateAlert().then((result) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.trainingTypeServices
            .updateTrainingData(this.CreateTraining.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Updated!",
                    "Teacher Training details updated successfully",
                    "success"
                  )
                  .then(() => {
                    this.route.navigate(["../../viewTrainingType"], {
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
