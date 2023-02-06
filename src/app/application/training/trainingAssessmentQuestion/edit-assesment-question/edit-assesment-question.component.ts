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
import {
  ActivatedRoute,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { state } from "@angular/animations";
import { AssessmentQuestionService } from "../../services/assessment-question.service";
import { SelfTrainingRequestService } from "../../services/self-training-request.service";

@Component({
  selector: "app-edit-assesment-question",
  templateUrl: "./edit-assesment-question.component.html",
  styleUrls: ["./edit-assesment-question.component.css"],
})
export class EditAssesmentQuestionComponent implements OnInit {
  formId!: FormGroup;
  SelfAssesment!: FormGroup;
  userProfile: any = [];
  createdBy: any = "";
  trainingSubject: any = "";
  trainingName: any = "";
  question: any = "";
  optionA: any = "";
  optionB: any = "";
  optionC: any = "";
  optionD: any = "";
  answer: any = "";
  class: any = "";
  checkbox1: any;
  checkbox2: any;
  lengths: any;
  checks = false;

  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();

  submitted = false;
  allErrorMessages: string[] = [];
  allLabel: string[] = [
    "",
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
  classArr: any = [];
  classArrData: any = "";
  res: any;
  training: any;
  aatype: any = [];
  id: any;
  data: any;
  assessmentId: any;
  assessmentType: any;
  myArray: any;
  isChecked: any;
  aatype1: any;
  pre: any;
  post: any;
  prechecks = false;
  postchecks = false;
  trainingNameLoad: boolean = false;
  //pre: boolean;
  checkb = [
    { id: 1, select: false, name: "Pre" },
    { id: 2, select: false, name: "Post" },
  ];
  checkboxStatus: boolean = false;
  arrayElements: any;
  teacherTraningid: any = "";
  loadingObj: any = {
    traiingLoading: false,
    subjectLoad: false,
    districtLoad: false,
    blockLoad: false,
  };
  trainingId: any;
  mark: any;
  classArr1: any;
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
    private TrainingTypeServices: AssessmentQuestionService,
    private trainingServices: SelfTrainingRequestService
  ) {}

  ngOnInit(): void {
    this.getPresentAndPastAcademicYear();
    this.userProfile = this.commonserviceService.getUserProfile();
    this.id = this.router.snapshot.params["encId"];
    this.getSubjectList();
    this.editSelfAssesment(this.id);
    this.initializeForm();
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
    });
  }

  getTrainingName(id: any) {
    //this.SelfAssesment.get("trainingId")?.patchValue('');

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
      assessmentId: [this.assessmentId],
      academicYear: [this.academicYear],
      trainingSubject: [this.trainingSubject, [Validators.required]],
      trainingName: [this.trainingId, [Validators.required]],
      //classArr: [this.classArr, [Validators.required]],
      classArr: this.formBuilder.array(this.classArr, [Validators.required]),
      question: [this.question, [Validators.required]],
      mark: [this.mark, 
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(/^[0-9]+$/),
          this.customValidators.firstCharValidatorRF,
          Validators.max(20),
        ],],
      optionA: [this.optionA, [Validators.required]],
      optionB: [this.optionB, [Validators.required]],
      optionC: [this.optionC, [Validators.required]],
      optionD: [this.optionD, [Validators.required]],
      answer: [this.answer, [Validators.required]],

      updatedBy: [this.userProfile.userId],
    });
  }

  editSelfAssesment(id: any) {
    this.formId = this.formBuilder.group({
      encId: [this.id],
    });
    this.spinner.show();
    this.TrainingTypeServices.readTrainingAssesment(
      this.formId.value
    ).subscribe((resp: any) => {
      this.data = resp.data[0];
      this.assessmentId = this.id;
      this.academicYear = this.data.academicYear;
      this.trainingSubject = this.data.trainingSubject;
      this.trainingId = this.data.trainingId;
      this.assessmentType = this.data.assessmentType;
      this.question = this.data.question;
      this.mark = this.data.mark;
      this.optionA = this.data.optionA;
      this.optionB = this.data.optionB;
      this.optionC = this.data.optionC;
      this.optionD = this.data.optionD;
      this.answer = this.data.answer.toString();
      if(this.checkboxStatus == false){
        this.classArr = [this.assessmentType.toString()];
      }
      
      this.spinner.hide();
      this.getTrainingName(this.trainingSubject);
      if (this.assessmentType == 3) {
        this.checkb = [
          { id: 1, select: true, name: "Pre" },
          { id: 2, select: true, name: "Post" },
        ];
        this.myArray = ['1','2'];
      }

      if (this.assessmentType == 2) {
        this.checkb = [
          { id: 1, select: false, name: "Pre" },
          { id: 2, select: true, name: "Post" },
        ];
        this.myArray = [this.assessmentType.toString()];
      }
      if (this.assessmentType == 1) {
        this.checkb = [
          { id: 1, select: true, name: "Pre" },
          { id: 2, select: false, name: "Post" },
        ];
        this.myArray = [this.assessmentType.toString()];
      }
      this.initializeForm();
    });
  }

  onSubmit() {
    this.submitted = true;
    if(this.SelfAssesment.value.classArr.length === 0){
      this.alertHelper.viewAlertHtml(
        "error",
        "Invalid inputs",
        'Assesment Type is Mandatory'
      );
    }
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
      this.alertHelper.updateAlert().then((result) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.TrainingTypeServices.updateTrainingAssesment(
            this.SelfAssesment.value
          ).subscribe({
            next: (res: any) => {
              this.spinner.hide(); //==== hide spinner
              this.alertHelper
                .successAlert(
                  "Updated!",
                  "Assessment question updated sucessfully.",
                  "success"
                )
                .then(() => {
                  this.route.navigate(["../../viewAssesmentQuestion"], {
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

  OnChangeClass(event: any) {
    this.checkboxStatus = true;
    let index = this.myArray.indexOf(event.target.value);
    
      if (index == -1) {
        this.myArray.push(event.target.value);
      } else {
        this.myArray.splice(index, 1);
      }
    
    this.classArr = this.myArray;
    this.initializeForm();
    //this.SelfAssesment.get("classArr")?.patchValue(this.classArr);
  }
}
