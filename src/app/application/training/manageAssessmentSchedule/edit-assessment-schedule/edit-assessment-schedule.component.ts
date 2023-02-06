import { Component, ElementRef, HostListener, OnInit } from "@angular/core";
import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";
import { NgxSpinnerService } from "ngx-spinner";
import { SelfTrainingRequestService } from "../../services/self-training-request.service";
import { TeacherTrainingAssessmentService } from "../../services/teacher-training-assessment.service";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { Constant } from "src/app/shared/constants/constant";
import { formatDate } from '@angular/common';

@Component({
  selector: "app-edit-assessment-schedule",
  templateUrl: "./edit-assessment-schedule.component.html",
  styleUrls: ["./edit-assessment-schedule.component.css"],
})
export class EditAssessmentScheduleComponent implements OnInit {
  @HostListener("document:keyup", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    +event?.which === 13 && this.onSubmit();
  }
  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();
  scheduleId: string | null;

  constructor(
    private commonFunctionHelper: CommonFunctionHelper,
    private spinner: NgxSpinnerService,
    public selfTrainingRequestService: SelfTrainingRequestService,
    private teacherTrainingAssessment: TeacherTrainingAssessmentService,
    public customValidators: CustomValidators,
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    private commonserviceService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper, //For menu privilege
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private el: ElementRef
  ) {
    const pageUrl: any = this.router.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl); //For menu privilege
    this.commonserviceService.verifyLinkPermission(
      pageUrl,
      this.config.linkType[2],
      this.config.privilege[4]
    ); // For authorization
    this.scheduleId = this.activatedRoute.snapshot.paramMap?.get("encId");
  }
  userInput: any = {
    academicYear: this.commonFunctionHelper.currentAcademicYear(),
    suject: "",
    training: "",
    trainingStartDate: "",
    trainingEndDate: "",
    stateTrainingStartDate: "",
    stateTrainingEndDate: "",
    districtTrainingStartDate: "",
    districtTrainingEndDate: "",
    blockTrainingStartDate: "",
    blockTrainingEndDate: "",
    statePreAssessmentDate: "",
    statePreStartTime: "",
    statePostAssessmentDate: "",
    statePostStartTime: "",
    districtPreAssessmentDate: "",
    districtPreStartTime: "",
    districtPostAssessmentDate: "",
    districtPostStartTime: "",
    blockPreAssessmentDate: "",
    blockPreStartTime: "",
    blockPostAssessmentDate: "",
    blockPostStartTime: "",
    duration: ""
  };
  allDataObj: any = {
    trainingData: [],
    assessmentScheduleDetails: [],
    allLabel: [
      "Academic year",
      "Training subject",
      "Training name",
      "Training start date",
      "Training end date",
      "State Training start date",
      "State Training end date",
      "District Training start date",
      "District Training end date",
      "Block Training start date",
      "Block Training end date",
      "Pre assessment date",
      "Pre assessment start time",
      "Post assessment date",
      "Post assessment start time",
      "Duration",
    ],
  };
  loadingObj: any = {
    trainingLoad: false,
    subjectLoad: false,
  };
  assessmentScheduleForm!: FormGroup;
  ngOnInit(): void {
    this.getSubjects(); // get subjects
    this.initializeForm();
    this.getAssessmentScheduleDetails();
    this.spinner.show();
  }
  ngAfterViewInit() {
    this.el.nativeElement.querySelector("[formControlName=suject]").focus();
  }

  getAssessmentScheduleDetails() {
    this.teacherTrainingAssessment
      .getAssessmentSchedules({
        scheduleId: this.scheduleId,
      })
      .subscribe({
        next: (response: any) => {
          if (response?.success) {
            this.allDataObj.assessmentScheduleDetails = response?.data;
            this.fillTheForm();
          } else {
            this.alertHelper.viewAlert("error", "", response?.msg);
          }
        },
      });
  }
  // get trainings based on subject
  getTrainings(subjectId: number) {
    this.loadingObj.trainingLoad = true;
    if (subjectId) {
      this.selfTrainingRequestService
        .getTrainingDetails(subjectId)
        .subscribe((response: any) => {
          this.loadingObj.trainingLoad = false;
          this.allDataObj.trainingData = response?.data;
        });
    } else {
      this.loadingObj.trainingLoad = false;
      this.allDataObj.trainingData = [];
    }
  }
  // get all subjects
  getSubjects() {
    this.loadingObj.subjectLoad = true;
    this.teacherTrainingAssessment.getSubject().subscribe({
      next: (response: any) => {
        if (response?.status) {
          this.allDataObj.subjects = response?.data;
        } else {
          this.allDataObj.subjects = [];
        }
        this.loadingObj.subjectLoad = false;
      },
    });
  }
  get minDateGetter() {
    return new Date();
  }
  // initialize reactive form
  initializeForm() {
    this.assessmentScheduleForm = this.formBuilder.group({
      academicYear: [this.userInput.academicYear, [Validators.required]],
      suject: [
        this.userInput.suject,
        [Validators.required, Validators.pattern(/^[0-9]+$/)],
      ],
      training: [
        this.userInput.training,
        [Validators.required, Validators.pattern(/^[0-9]+$/)],
      ],
      trainingStartDate: [
        this.userInput.trainingStartDate,
        [Validators.required],
      ],
      trainingEndDate: [this.userInput.trainingEndDate, [Validators.required]],

      stateTrainingStartDate: [
        this.userInput.stateTrainingStartDate,
        [Validators.required],
      ],
      stateTrainingEndDate: [this.userInput.stateTrainingEndDate, [Validators.required]],

      districtTrainingStartDate: [
        this.userInput.districtTrainingStartDate,
        [Validators.required],
      ],
      districtTrainingEndDate: [this.userInput.districtTrainingEndDate, [Validators.required]],

      blockTrainingStartDate: [
        this.userInput.blockTrainingStartDate,
        [Validators.required],
      ],
      blockTrainingEndDate: [this.userInput.blockTrainingEndDate, [Validators.required]],


      statePreAssessmentDate: [
        this.userInput.statePreAssessmentDate,
        [Validators.required],
      ],
      statePreStartTime: [this.userInput.statePreStartTime, [Validators.required]],
      statePostAssessmentDate: [
        this.userInput.statePostAssessmentDate,
        [Validators.required],
      ],
      statePostStartTime: [this.userInput.statePostStartTime, [Validators.required]],

      districtPreAssessmentDate: [
        this.userInput.districtPreAssessmentDate,
        [Validators.required],
      ],
      districtPreStartTime: [this.userInput.districtPreStartTime, [Validators.required]],
      districtPostAssessmentDate: [
        this.userInput.districtPostAssessmentDate,
        [Validators.required],
      ],
      districtPostStartTime: [this.userInput.districtPostStartTime, [Validators.required]],


      blockPreAssessmentDate: [
        this.userInput.blockPreAssessmentDate,
        [Validators.required],
      ],
      blockPreStartTime: [this.userInput.blockPreStartTime, [Validators.required]],
      blockPostAssessmentDate: [
        this.userInput.blockPostAssessmentDate,
        [Validators.required],
      ],
      blockPostStartTime: [this.userInput.blockPostStartTime, [Validators.required]],


      duration: [
        this.userInput.duration,
        [
          Validators.required,
          Validators.pattern(/^[0-9]+$/),
          this.customValidators.firstCharValidatorRF,
        ],
      ],
    });
  }
  onSubmit() {
    if (
      this.validateForm(this.assessmentScheduleForm?.getRawValue()) === false
    ) {
      const allValue = this.assessmentScheduleForm?.getRawValue();
      this.alertHelper.updateAlert().then((result: any) => {
        if (result.value) {
          this.spinner.show();
          this.teacherTrainingAssessment
            .submitAssessmentSchedule(this.getFormValue(allValue))
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                if (res.success === true) {
                  this.alertHelper
                    .successAlert("Saved!", res?.msg, "success")
                    .then(() => {
                      this.router.navigate(["../../"], {
                        relativeTo: this.activatedRoute,
                      });
                    });
                  this.assessmentScheduleForm.reset();
                  this.initializeForm();
                } else {
                  this.alertHelper.viewAlert("error", "Invalid", res?.msg);
                }
              },
              error: (error: any) => {
                this.spinner.hide(); //==== hide spinner
              },
            });
        }
      });
    }
  }
  getFormValue(allValue: any) {
    return {
      ...allValue,
      trainingStartDate: formatDate( allValue?.trainingStartDate, 'yyyy-MM-dd', 'en_US') ,
            trainingEndDate: formatDate( allValue?.trainingEndDate, 'yyyy-MM-dd', 'en_US'),
            stateTrainingStartDate: formatDate( allValue?.stateTrainingStartDate, 'yyyy-MM-dd', 'en_US'),
            stateTrainingEndDate:formatDate( allValue?.stateTrainingEndDate, 'yyyy-MM-dd', 'en_US'),
            districtTrainingStartDate:formatDate( allValue?.districtTrainingStartDate, 'yyyy-MM-dd', 'en_US'),
            districtTrainingEndDate:formatDate( allValue?.districtTrainingEndDate, 'yyyy-MM-dd', 'en_US'),
            blockTrainingStartDate: formatDate( allValue?.blockTrainingStartDate, 'yyyy-MM-dd', 'en_US'),
            blockTrainingEndDate: formatDate( allValue?.blockTrainingEndDate, 'yyyy-MM-dd', 'en_US') ,
            statePreAssessmentDate:formatDate( allValue?.statePreAssessmentDate, 'yyyy-MM-dd', 'en_US'),
            statePostAssessmentDate: formatDate( allValue?.statePostAssessmentDate, 'yyyy-MM-dd', 'en_US'),
            districtPreAssessmentDate: formatDate( allValue?.districtPreAssessmentDate, 'yyyy-MM-dd', 'en_US') ,
            districtPostAssessmentDate: formatDate( allValue?.districtPostAssessmentDate, 'yyyy-MM-dd', 'en_US'),
            blockPreAssessmentDate:formatDate( allValue?.blockPreAssessmentDate, 'yyyy-MM-dd', 'en_US') ,
            blockPostAssessmentDate:formatDate( allValue?.blockPostAssessmentDate, 'yyyy-MM-dd', 'en_US') ,
      userId: this.commonserviceService.getUserProfile().userId,
      scheduleId: this.scheduleId,
    };
  }

  // 1) validate form
  validateForm(formValue: any) {
    let validationStatus = this.customValidators.formValidationHandler(
      this.assessmentScheduleForm,
      this.allDataObj.allLabel,
      this.el
    );

    // if form is valid and date is today then validate start time
    if (validationStatus === false) {
      //date validation is for state, district and block start and end date
      if (formValue?.trainingStartDate?.getTime() > formValue?.stateTrainingStartDate?.getTime()) {
        this.alertHelper.viewAlert(
          "error", "", "State training start date should be greater than training start date."
        );
        return true;
      }

      if (formValue?.trainingEndDate?.getTime() < formValue?.stateTrainingEndDate?.getTime()) {
        this.alertHelper.viewAlert("error", "", "State training end date should be less than training end date."
        );
        return true;
      }

      if (formValue?.trainingEndDate?.getTime() < formValue?.districtTrainingEndDate?.getTime()) {
        this.alertHelper.viewAlert("error", "", "Dstrict training end date should be less than training end date."
        );
        return true;
      }

      if (formValue?.trainingEndDate?.getTime() < formValue?.blockTrainingEndDate?.getTime()) {
        this.alertHelper.viewAlert("error", "", "Block training end date should be less than training end date."
        );
        return true;
      }

      if (formValue?.stateTrainingEndDate?.getTime() > formValue?.districtTrainingStartDate?.getTime()) {
        this.alertHelper.viewAlert(
          "error", "", "Distict training start date should be greater than state training start date."
        );
        return true;
      }
      if (formValue?.districtTrainingStartDate?.getTime() > formValue?.blockTrainingStartDate?.getTime()) {
        this.alertHelper.viewAlert(
          "error", "", "Block training start date should be greater than district training start date."
        );
        return true;
      }

      if (formValue?.stateTrainingStartDate?.getTime() >= formValue?.stateTrainingEndDate?.getTime()) {
        this.alertHelper.viewAlert("error", "", "State training start date should be less than state training end date.");
        return true;
      }

      if (formValue?.districtTrainingStartDate?.getTime() >= formValue?.districtTrainingEndDate?.getTime()) {
        this.alertHelper.viewAlert("error", "", "District training start date should be less than district training end date.");
        return true;
      }
      if (formValue?.blockTrainingStartDate?.getTime() >= formValue?.blockTrainingEndDate?.getTime()) {
        this.alertHelper.viewAlert("error", "", "Block training start date should be less than block training end date.");
        return true;
      }

      // 1) check training start and end date
      if (formValue?.trainingStartDate?.getTime() >= formValue?.trainingEndDate?.getTime()) {
        this.alertHelper.viewAlert(
          "error",
          "",
          "Training start date should be less than training end date."
        );
        return true;
      } else if (formValue?.statePreAssessmentDate?.getTime() > formValue?.stateTrainingStartDate?.getTime()) {
        // 2) Check pre assessment date should be less than equal to training start date
        this.alertHelper.viewAlert(
          "error",
          "",
          "State Pre assessment date should be less than training start date."
        );
        return true;
      } else if (formValue?.statePostAssessmentDate?.getTime() <= formValue?.stateTrainingEndDate?.getTime()) {
        // 3) Check post assessment date should be greater than equal to training training end date
        this.alertHelper.viewAlert(
          "error",
          "",
          "State Post assessment date should be greater than training end date."
        );
        return true;
      } else if (formValue?.districtPreAssessmentDate?.getTime() > formValue?.districtTrainingStartDate?.getTime()) {
        // 2) Check pre assessment date should be less than equal to training start date
        this.alertHelper.viewAlert(
          "error",
          "",
          "District Pre assessment date should be less than training start date."
        );
        return true;
      } else if (formValue?.districtPostAssessmentDate?.getTime() <= formValue?.districtTrainingEndDate?.getTime()) {
        // 3) Check post assessment date should be greater than equal to training training end date
        this.alertHelper.viewAlert(
          "error",
          "",
          "District Post assessment date should be greater than training end date."
        );
        return true;
      } else if (formValue?.blockPreAssessmentDate?.getTime() > formValue?.blockTrainingStartDate?.getTime()) {
        // 2) Check pre assessment date should be less than equal to training start date
        this.alertHelper.viewAlert(
          "error",
          "",
          "Block Pre assessment date should be less than training start date."
        );
        return true;
      } else if (formValue?.blockPostAssessmentDate?.getTime() <= formValue?.blockTrainingEndDate?.getTime()) {
        // 3) Check post assessment date should be greater than equal to training training end date
        this.alertHelper.viewAlert(
          "error",
          "",
          "Block Post assessment date should be greater than training end date."
        );
        return true;
      }

      // 4) State pre assessment date and time validation
      const statepreResult = this.validateDates(
        formValue?.statePreAssessmentDate,
        +this.assessmentScheduleForm
          ?.getRawValue()
          ?.statePreStartTime?.split(":")[0],
        +formValue?.statePreStartTime?.split(":")[1]
      );
      if (statepreResult) {
        this.alertHelper.viewAlert(
          "error",
          "",
          "State Pre assessment start time should be greater than current time."
        );
        return true;
      }
      // 5) state post assessment date and time validation
      const statepostResult = this.validateDates(
        formValue?.statePostAssessmentDate,
        +this.assessmentScheduleForm
          ?.getRawValue()
          ?.statePostStartTime?.split(":")[0],
        +this.assessmentScheduleForm
          ?.getRawValue()
          ?.statePostStartTime?.split(":")[1]
      );
      if (statepostResult) {
        this.alertHelper.viewAlert(
          "error",
          "",
          "State Post assessment start time should be greater than current time."
        );
        return true;
      }

      // 6) district pre assessment date and time validation
      const districtpreResult = this.validateDates(
        formValue?.districtPreAssessmentDate,
        +this.assessmentScheduleForm
          ?.getRawValue()
          ?.districtPreStartTime?.split(":")[0],
        +formValue?.districtPreStartTime?.split(":")[1]
      );
      if (districtpreResult) {
        this.alertHelper.viewAlert(
          "error",
          "",
          "district Pre assessment start time should be greater than current time."
        );
        return true;
      }
      // 7) district post assessment date and time validation
      const districtpostResult = this.validateDates(
        formValue?.districtPostAssessmentDate,
        +this.assessmentScheduleForm
          ?.getRawValue()
          ?.districtPostStartTime?.split(":")[0],
        +this.assessmentScheduleForm
          ?.getRawValue()
          ?.districtPostStartTime?.split(":")[1]
      );
      if (districtpostResult) {
        this.alertHelper.viewAlert(
          "error",
          "",
          "district Post assessment start time should be greater than current time."
        );
        return true;
      }

      // 8) block pre assessment date and time validation
      const blockpreResult = this.validateDates(
        formValue?.blockPreAssessmentDate,
        +this.assessmentScheduleForm
          ?.getRawValue()
          ?.blockPreStartTime?.split(":")[0],
        +formValue?.blockPreStartTime?.split(":")[1]
      );
      if (blockpreResult) {
        this.alertHelper.viewAlert(
          "error",
          "",
          "block Pre assessment start time should be greater than current time."
        );
        return true;
      }
      // 9) block post assessment date and time validation
      const blockpostResult = this.validateDates(
        formValue?.blockPostAssessmentDate,
        +this.assessmentScheduleForm
          ?.getRawValue()
          ?.blockPostStartTime?.split(":")[0],
        +this.assessmentScheduleForm
          ?.getRawValue()
          ?.blockPostStartTime?.split(":")[1]
      );
      if (blockpostResult) {
        this.alertHelper.viewAlert(
          "error",
          "",
          "block Post assessment start time should be greater than current time."
        );
        return true;
      }
      // check duration
      if (
        +this.assessmentScheduleForm?.value?.duration <
        this.config.questionBank.minDuration
      ) {
        this.alertHelper.viewAlert(
          "error",
          "",
          `Minimum Assessment duration should be ${this.config.questionBank.minDuration} minutes.`
        );
        return true;
      }
      if (
        +this.assessmentScheduleForm?.value?.duration >
        this.config.questionBank.maxDuration
      ) {
        this.alertHelper.viewAlert(
          "error",
          "",
          `Maximum assessment duration should be ${this.config.questionBank.maxDuration} minutes.`
        );
        return true;
      } //end
      return false;
    }
    return validationStatus;
  }

  validateDates(date: Date, hour: number, min: number) {
    let curTime: any = new Date(); // get current time
    const curtDate =
      curTime.getDate() +
      "-" +
      curTime.getMonth() +
      "-" +
      curTime.getFullYear();

    const enterdDate =
      date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();

    // if date is today then validate start time
    if (
      enterdDate === curtDate &&
      (hour < +curTime.getHours() ||
        (hour === +curTime.getHours() && min <= +curTime.getMinutes()))
    ) {
      return true;
    }

    return false;
  }

  fillTheForm() {
    this.userInput.training =
      this.allDataObj.assessmentScheduleDetails?.trainingId;
    this.userInput.suject =
      this.allDataObj.assessmentScheduleDetails?.subjectId;

    this.userInput.trainingStartDate = new Date(
      this.allDataObj.assessmentScheduleDetails?.trainingStartDate.toString()
    );
    this.userInput.trainingEndDate = new Date(
      this.allDataObj.assessmentScheduleDetails?.trainingEndDate.toString()
    );

    this.userInput.stateTrainingStartDate = new Date(
      this.allDataObj.assessmentScheduleDetails?.stateTrainingStartDate.toString()
    );
    this.userInput.stateTrainingEndDate = new Date(
      this.allDataObj.assessmentScheduleDetails?.stateTrainingEndDate.toString()
    );

    this.userInput.districtTrainingStartDate = new Date(
      this.allDataObj.assessmentScheduleDetails?.districtTrainingStartDate.toString()
    );
    this.userInput.districtTrainingEndDate = new Date(
      this.allDataObj.assessmentScheduleDetails?.districtTrainingEndDate.toString()
    );

    this.userInput.blockTrainingStartDate = new Date(
      this.allDataObj.assessmentScheduleDetails?.blockTrainingStartDate.toString()
    );
    this.userInput.blockTrainingEndDate = new Date(
      this.allDataObj.assessmentScheduleDetails?.blockTrainingEndDate.toString()
    );


    this.userInput.statePreAssessmentDate = new Date(
      this.allDataObj.assessmentScheduleDetails?.statePreAssessmentDate.toString()
    );

    this.userInput.statePreStartTime =
      this.allDataObj.assessmentScheduleDetails?.statePreAssessmentStartTime.slice(
        0,
        -3
      );

    this.userInput.statePostAssessmentDate = new Date(
      this.allDataObj.assessmentScheduleDetails?.statePostAssessmentDate.toString()
    );
    this.userInput.statePostStartTime =
      this.allDataObj.assessmentScheduleDetails?.statePostAssessmentStartTime.slice(
        0,
        -3
      );

    this.userInput.districtPreAssessmentDate = new Date(
      this.allDataObj.assessmentScheduleDetails?.districtPreAssessmentDate.toString()
    );

    this.userInput.districtPreStartTime =
      this.allDataObj.assessmentScheduleDetails?.districtPreAssessmentStartTime.slice(
        0,
        -3
      );

    this.userInput.districtPostAssessmentDate = new Date(
      this.allDataObj.assessmentScheduleDetails?.districtPostAssessmentDate.toString()
    );
    this.userInput.districtPostStartTime =
      this.allDataObj.assessmentScheduleDetails?.districtPostAssessmentStartTime.slice(
        0,
        -3
      );

    this.userInput.blockPreAssessmentDate = new Date(
      this.allDataObj.assessmentScheduleDetails?.blockPreAssessmentDate.toString()
    );

    this.userInput.blockPreStartTime =
      this.allDataObj.assessmentScheduleDetails?.blockPreAssessmentStartTime.slice(
        0,
        -3
      );

    this.userInput.blockPostAssessmentDate = new Date(
      this.allDataObj.assessmentScheduleDetails?.blockPostAssessmentDate.toString()
    );
    this.userInput.blockPostStartTime =
      this.allDataObj.assessmentScheduleDetails?.blockPostAssessmentStartTime.slice(
        0,
        -3
      );

    this.userInput.duration =
      this.allDataObj.assessmentScheduleDetails?.duration;
    this.getTrainings(+this.userInput.suject);
    this.initializeForm();
    this.spinner.hide();
  }
  onCancel() {
    this.router.navigate(["../../"], {
      relativeTo: this.activatedRoute,
    });
  }
}
