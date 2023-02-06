/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 29-06-2022
 * Module Name : Question Bank
 * Description : Add question bank.
 **/

import { Component, ElementRef, HostListener, OnInit } from "@angular/core";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { FormBuilder, ValidatorFn, Validators } from "@angular/forms";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { QuestionBankService } from "../../services/question-bank.service";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable } from "rxjs";
import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { Router } from "@angular/router";

@Component({
  selector: "app-add-assessment-schedule",
  templateUrl: "./add-assessment-schedule.component.html",
  styleUrls: ["./add-assessment-schedule.component.css"],
})
export class AddAssessmentScheduleComponent implements OnInit {
  @HostListener("document:keyup", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    +event?.which === 13 && this.onSubmit();
  }
  ngxTimepicker!: any;
  // member variables
  assessmentScheduleForm!: any;
  optionVal: any;
  optionstream: any;
  annextureData!: any;
  classAnnexture!: any;
  assessmentAnnexture!: any;
  streamGroupAnnexture!: any;
  assessmentType: string = "";
  class: string = "";
  stream: string = "";
  group: string = "";
  subject: string = "";
  setName: string = "";
  dateOfExam: any = new Date();
  startTime: string = "";
  duration: string = "";

  classWiseSubjects!: any;
  isClassGreaterThanTen: boolean = false;
  isScienceStreamSelected: boolean = false;
  annextureLoad: boolean = false;
  subjectLoad: boolean = false;
  streamLoad: boolean = false;
  groupLoad: boolean = false;
  streamGroupTypeLoad: boolean = false;
  allLabel: string[] = [
    "Assessment type",
    "Class",
    "Stream",
    "Group",
    "Subject",
    "Date of exam",
    "Start time",
    "Duration",
  ];
  currentAcademicYear!: string;
  minDOB = new Date(new Date().setFullYear(new Date().getFullYear() - 5));
  // end
  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;

  newValidationMsg = {
    required: {
      assessmentType:"Please select assessment type",
      class: `Please select class`,
      subject: `Please select subject`,
      startTime: `Please enter the assessment start time`,
      duration: `Please enter the assessment duration`,
    },
    
    conditionalValidation: {
      stream: "Please select stream",
      group: "Please select group",
    },
  }

  constructor(
    private commonserviceService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper, //For menu privilege
    private router: Router,
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private questionBankService: QuestionBankService,
    private spinner: NgxSpinnerService,
    private alertHelper: AlertHelper,
    private elementRef: ElementRef,
    private commonFunctionHelper: CommonFunctionHelper
  ) {
    const pageUrl: any = this.router.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl); //For menu privilege
    this.commonserviceService.verifyLinkPermission(
      pageUrl,
      this.config.linkType[2],
      this.config.privilege[4]
    ); // For authorization
    this.getCurrentAcademicYear();
  }

  ngOnInit(): void {
    this.spinner.show();
    if (this.plPrivilege == "admin") {
      this.adminPrivilege = true;
    }
    this.getAnnextureData();
    this.initializeForm();
    this.conditionalValidationObserver();
  }
  getCurrentAcademicYear() {
    this.commonserviceService.getCurrentAcademicYear().subscribe({
      next: (res: any) => {
        this.currentAcademicYear = res?.academicYear;
        this.spinner.hide();
      },
    });
  }
  // get annextures
  getAnnextureData() {
    this.annextureLoad = true;
    this.commonserviceService
      .getCommonAnnexture(
        ["ASSESSMENT_TYPE", "CLASS_TYPE", "STREAM_TYPE", "STREAM_GROUP_TYPE"],
        true
      )
      .subscribe({
        next: (res: any) => {
          this.annextureData = res?.data;
          this.assessmentAnnexture = res?.data?.ASSESSMENT_TYPE;
          this.classAnnexture = res?.data?.CLASS_TYPE.filter(
            (item: any) => item.anxtValue > 8 // show classes 9-12
          );
          this.annextureLoad = false;
        },
      });
  }
  // ===== get class wise subjects
  getSubjects() {
    this.assessmentScheduleForm.patchValue({
      subject: "",
    });
    this.classWiseSubjects = undefined;
    const classStreamGroupObj = {
      selectedClassId: parseInt(
        this.assessmentScheduleForm.getRawValue()?.class
      ),
      selectedStreamId: parseInt(
        this.assessmentScheduleForm.getRawValue()?.stream
      ),
      selectedGroupId: parseInt(
        this.assessmentScheduleForm.getRawValue()?.group
      ),
    };

    // 1) get subjects of the selected class
    // 2) if class greater than 10 show stram field
    if (classStreamGroupObj.selectedClassId > 10) {
      this.isClassGreaterThanTen = true;
    } else {
      this.isClassGreaterThanTen = false; //else hide
    }
    if (classStreamGroupObj.selectedClassId < 11) {
      // reset stream and group previous stream value
      this.assessmentScheduleForm.patchValue({
        stream: "",
      });
      this.assessmentScheduleForm.patchValue({
        group: "",
      });
    }

    if (
      classStreamGroupObj.selectedClassId > 10 &&
      classStreamGroupObj.selectedStreamId == 3
    ) {
      if (classStreamGroupObj.selectedGroupId > 0)
        this.getSubjectsClassStreamGroupWise(classStreamGroupObj);
    } else if (
      classStreamGroupObj.selectedClassId > 10 &&
      classStreamGroupObj.selectedStreamId > 0
    ) {
      this.getSubjectsClassStreamGroupWise(classStreamGroupObj);
    } else if (
      classStreamGroupObj.selectedClassId > 0 &&
      classStreamGroupObj.selectedClassId < 11
    ) {
      this.getSubjectsClassStreamGroupWise(classStreamGroupObj);
    } else {
      this.classWiseSubjects = undefined;
    }
  }
  // get calss wise subjects
  getSubjectsClassStreamGroupWise(classStreamGroupObj: object) {
    this.subjectLoad = true;
    this.questionBankService
      .getSubjectsClassStreamGroupWise(classStreamGroupObj)
      .subscribe({
        next: (response: any) => {
          if (response?.success === true) {
            this.classWiseSubjects = response?.data;
          }
          this.subjectLoad = false;
        },
      });
  }
  // get calss wise subjects
  getSubjectsClassWise(classId: number) {
    this.subjectLoad = true;
    this.questionBankService.getSubjectsClassWise(classId).subscribe({
      next: (response: any) => {
        if (response?.success === true) {
          this.classWiseSubjects = response?.data;
          this.subjectLoad = false;
        }
      },
    });
  }
  // on stream change
  getStreamGroupType() {
    this.streamLoad = true;

    // if science stream selected
    if (parseInt(this.assessmentScheduleForm.getRawValue()?.stream) === 3) {
      this.streamGroupAnnexture = this.annextureData?.STREAM_GROUP_TYPE.filter(
        (item: any) => item.anxtValue < 3
      );
      this.isScienceStreamSelected = true; // show stream group
      this.streamGroupTypeLoad = true;
    } else {
      this.isScienceStreamSelected = false; // hide  stream group
      this.streamGroupTypeLoad = false;
      // reset stream previous group value
      this.assessmentScheduleForm.patchValue({
        group: "",
      });
    }
    this.streamLoad = false;
    this.streamGroupTypeLoad = false;
  }
  // initialize reactive form
  initializeForm() {
    this.assessmentScheduleForm = this.formBuilder.group({
      assessmentType: [
        this.assessmentType,
        [Validators.required, Validators.pattern(/^[0-9]+$/)],
      ],
      class: [
        this.class,
        [Validators.required, Validators.pattern(/^[0-9]+$/), ,],
      ],
      stream: [
        this.stream,
        [
          Validators.pattern(/^[0-9]+$/),
          this.conditionalValidator(
            () => this.assessmentScheduleForm?.get("class")?.value,
            Validators.required,
            "conditionalValidation",
            "stream"
          ),
        ],
      ],
      group: [
        this.group,
        [
          Validators.pattern(/^[0-9]+$/),
          this.conditionalValidator(
            () => this.assessmentScheduleForm?.get("stream")?.value,
            Validators.required,
            "conditionalValidation",
            "group"
          ),
        ],
      ],

      subject: [
        this.subject,
        [Validators.required, Validators.pattern(/^[0-9]+$/)],
      ],

      dateOfExam: [this.dateOfExam, [Validators.required]],
      startTime: [this.startTime, [Validators.required]],
      duration: [
        this.duration,
        [
          Validators.required,
          Validators.pattern(/^[0-9]+$/),
          this.customValidators.firstCharValidatorRF,
        ],
      ],
    });
  }
  // conditional validation
  conditionalValidator(
    predicate: any,
    validator: ValidatorFn,
    errorNamespace: string,
    validationType: string
  ): ValidatorFn {
    return (formControl: any) => {
      let conditionStatus = false;

      let parentValue = parseInt(predicate());
      // 1) if parent empty
      if (!formControl.parent) {
        return null;
      }
      let error = null;

      // validation logic for stream
      if (validationType === "stream" && parentValue >= 11) {
        conditionStatus = true;
      }

      // validation logic for group
      if (validationType === "group" && parentValue === 3) {
        conditionStatus = true;
      }
      // 2) check childs direct parent field
      if (conditionStatus) {
        error = validator(formControl); // validate
      } else {
        error = null;
      }

      // 3) set conditional validation
      if (errorNamespace && error) {
        const customError: any = {}; // custom error property
        customError[errorNamespace] = error;
        error = customError;
      }
      return error;
    };
  }
  conditionalValidationObserver() {
    // 1) class change observer
    this.assessmentScheduleForm.get("class").valueChanges.subscribe({
      next: (res: any) => {
        this.assessmentScheduleForm.get("stream").updateValueAndValidity();
      },
    });
    // stream change observer
    this.assessmentScheduleForm.get("stream").valueChanges.subscribe({
      next: (res: any) => {
        this.assessmentScheduleForm.get("group").updateValueAndValidity();
      },
    });
  }
  onSubmit() {
    // 1) validate form
    const afterFormValidObserver = new Observable((observer) => {
      observer.next(this.validateForm());
    });
    afterFormValidObserver.subscribe({
      next: (isValid: any) => {
        if (isValid === false) {
          this.alertHelper.submitAlert().then((result: any) => {
            if (result.value) {
              this.spinner.show();
              this.submitTheForm();
            }
          });
        }
      },
    });
  }
  // 1) validate form

  validateForm() {
    let validationStatus = this.customValidators.formValidationHandler(
      this.assessmentScheduleForm,
      this.allLabel,
      this.elementRef,
      this.newValidationMsg
    );
    // if form is valid and date is today then validate start time
    if (validationStatus === false) {
      let curTime: any = new Date(); // get current time
      const dateOfExam = this.assessmentScheduleForm?.getRawValue()?.dateOfExam;
      const curtDate =
        curTime.getDate() +
        "-" +
        curTime.getMonth() +
        "-" +
        curTime.getFullYear();
      const enterdDate =
        dateOfExam.getDate() +
        "-" +
        dateOfExam.getMonth() +
        "-" +
        dateOfExam.getFullYear();

      // if date is today then validate start time
      if (enterdDate === curtDate) {
        // entered hour
        const enteredHr = +this.assessmentScheduleForm
          ?.getRawValue()
          ?.startTime?.split(":")[0];
        // entered minute
        const enteredMin = +this.assessmentScheduleForm
          ?.getRawValue()
          ?.startTime?.split(":")[1];
        if (
          enteredHr < +curTime.getHours() ||
          (enteredHr === +curTime.getHours() &&
            enteredMin <= +curTime.getMinutes())
        ) {
          validationStatus = true; // make form validation invalid

          // focus on error field
          this.elementRef?.nativeElement
            .querySelector("[formControlName=startTime]")
            ?.focus();
          this.alertHelper.viewAlert(
            "error",
            "Invalid",
            "Start time should be greater than current time."
          );
        }
      }

      // check duration
      if (
        +this.assessmentScheduleForm?.value?.duration <
        this.config.questionBank.minDuration
      ) {
        validationStatus = true; // make form validation invalid
        // focus on error field
        this.elementRef?.nativeElement
          .querySelector("[formControlName=duration]")
          ?.focus();
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          `Minimum assessment duration should be ${this.config.questionBank.minDuration} minutes.`
        );
      }
      if (
        +this.assessmentScheduleForm?.value?.duration >
        this.config.questionBank.maxDuration
      ) {
        validationStatus = true; // make form validation invalid
        // focus on error field
        this.elementRef?.nativeElement
          .querySelector("[formControlName=duration]")
          ?.focus();
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          `Maximum assessment duration should be ${this.config.questionBank.maxDuration} minutes.`
        );
      } //end
    }
    return validationStatus;
  }
  // 2) submit form
  submitTheForm() {
    // get date value
    let dateOfExam: any = new Date(
      this.assessmentScheduleForm?.getRawValue()?.dateOfExam
    );
    // convert date
    dateOfExam = this.commonFunctionHelper.formatDateHelper(dateOfExam);
    const formDataObj = {
      ...this.assessmentScheduleForm?.getRawValue(),
      dateOfExam,
    };

    const userProfile = this.commonserviceService.getUserProfile(); // get user profile
    this.questionBankService
      .addAssessmentSchedule(formDataObj, userProfile?.userId)
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          if (res.success === true) {
            this.alertHelper.successAlert("Saved!", res?.msg, "success");
            this.assessmentScheduleForm.reset(); // reset form
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

  get minDateGetter() {
    return new Date();
  }
  classChangeHandler() {
    this.assessmentScheduleForm.patchValue({
      stream: "",
      group: "",
    });
  }
}
