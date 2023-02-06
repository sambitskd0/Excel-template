import { Component, ElementRef, OnInit } from "@angular/core";
import {
  FormArray,
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
import { ActivatedRoute, Router } from "@angular/router";
import { AssessmentQuestionService } from "../../services/assessment-question.service";
import { SelfTrainingRequestService } from "../../services/self-training-request.service";

@Component({
  selector: "app-add-assesment-question",
  templateUrl: "./add-assesment-question.component.html",
  styleUrls: ["./add-assesment-question.component.css"],
})
export class AddAssesmentQuestionComponent implements OnInit {
  SelfAssesment!: FormGroup;
  userProfile: any = [];
  createdBy: any = "";
  trainingSubject: any = "";
  trainingName: any = "";
  assessmentType: any;
  question: any = "";
  optionA: any = "";
  optionB: any = "";
  optionC: any = "";
  optionD: any = "";
  answer: any = "";
  class: any = "";
  checkbox1: any;
  checkbox2: any;
  classArr: any = [];
  valu: any = [];
  classArrData: any = "";

  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();

  submitted = false;
  allErrorMessages: string[] = [];
  allLabel: string[] = [
    "",
    "Training Subject",
    "Training Name",
    "Assessment Type",
    "Question",
    "Mark",
    "Option A",
    "Option B",
    "Option C",
    "Option D",
    "Answer",
  ];
  empList: any = [];
  res: any;
  training: any;
  aatype: any;
  trainingNameLoad: boolean = false;
  checkb = [
    { id: 1, select: false, name: "Pre" },
    { id: 2, select: false, name: "Post" },
  ];
  loadingObj: any = {
    traiingLoading: false,
    subjectLoad: false,
    districtLoad: false,
    blockLoad: false,
  };
  mark: any;
  preAndPastYear:any = [];
  constructor(
    private formBuilder: FormBuilder,

    private alertHelper: AlertHelper,

    private spinner: NgxSpinnerService,
    private el: ElementRef,
    private commonserviceService: CommonserviceService,
    public customValidators: CustomValidators,
    private route: Router,
    private router: ActivatedRoute,
    private trainingTypeServices: AssessmentQuestionService,
    private trainingServices: SelfTrainingRequestService
  ) {}

  ngOnInit(): void {
    this.getPresentAndPastAcademicYear();
    //console.log(this.CreateSelfTraining.value);
    this.userProfile = this.commonserviceService.getUserProfile();
    this.spinner.show();
    this.initializeForm();
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
    this.trainingName = "";
    this.trainingSubject = "";
    this.loadingObj.subjectLoad = true;
    this.trainingServices.getSubject().subscribe((data: any) => {
      this.res = data.data;
      this.loadingObj.subjectLoad = false;
      this.spinner.hide();
    });
  }

  getTrainingName(id: any) {
    this.trainingName = "";
    this.SelfAssesment.get("trainingName")?.patchValue("");
    this.loadingObj.traiingLoading = true;
    this.trainingServices.getTrainingDetails(id).subscribe((data: any) => {
      if (data == null) {
        this.training = [];
        this.spinner.hide();
        this.loadingObj.traiingLoading = false;
      } else {
        this.training = data.data;
        this.spinner.hide();
        this.loadingObj.traiingLoading = false;
      }
    });
  }

  initializeForm() {
    this.SelfAssesment = this.formBuilder.group({
      academicYear: [this.academicYear],
      trainingSubject: [this.trainingSubject, [Validators.required]],
      trainingName: [this.trainingName, [Validators.required]],
      classArr: [this.classArr, [Validators.required]],

      question: [
        this.question,
        [Validators.required, this.customValidators.firstCharValidatorRF],
      ],
      mark: [
        this.mark,
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(/^[0-9]+$/),
          this.customValidators.firstCharValidatorRF,
          Validators.max(20),
        ],
      ],
      optionA: [
        this.optionA,
        [Validators.required, this.customValidators.firstCharValidatorRF],
      ],
      optionB: [
        this.optionB,
        [Validators.required, this.customValidators.firstCharValidatorRF],
      ],
      optionC: [
        this.optionC,
        [Validators.required, this.customValidators.firstCharValidatorRF],
      ],
      optionD: [
        this.optionD,
        [Validators.required, this.customValidators.firstCharValidatorRF],
      ],
      answer: [this.answer, [Validators.required]],

      createdBy: [this.userProfile.userId],
    });
    //console.log(this.SelfAssesment);
  }

  onSubmit() {
    this.submitted = true;
    // if ("INVALID" === this.SelfAssesment.status) {
    //   for (const key of Object.keys(this.SelfAssesment.controls)) {
    //     if (this.SelfAssesment.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(
    //         this.SelfAssesment,
    //         this.allLabel
    //       );
    //       break;
    //     }
    //   }
    // }
    if(this.SelfAssesment.invalid){
      this.customValidators.formValidationHandler(
                this.SelfAssesment,
                this.allLabel,
                this.el
              );
    }

    if (this.SelfAssesment.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.trainingTypeServices
            .saveTrainingAssesment(this.SelfAssesment.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner

                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Question assessment created successfully.",
                    "success"
                  )
                  .then(() => {
                    this.initializeForm();
                    this.route.navigate(["./../viewAssesmentQuestion"], {
                      relativeTo: this.router,
                    });
                  });
              },
              error: (error: any) => {
                this.spinner.hide(); //==== hide spinner
              },
              complete: () => console.log("done"),
            });
        }
      });
    }
  }

  changeClass(event: any) {
    let index = this.classArr.indexOf(event.target.value);
    if (index == -1) {
      this.classArr.push(event.target.value);
    } else {
      this.classArr.splice(index, 1);
    }

    this.classArr = this.classArr;
    this.SelfAssesment.get("classArr")?.patchValue(this.classArr);
    // this.initializeForm();
  }
}
