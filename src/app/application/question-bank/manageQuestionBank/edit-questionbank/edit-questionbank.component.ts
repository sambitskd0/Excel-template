/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 28-06-2022
 * Module Name : Question Bank
 * Description : Edit question bank.
 **/

import { Component, ElementRef, HostListener, OnInit } from "@angular/core";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { FormBuilder, ValidatorFn, Validators } from "@angular/forms";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { QuestionBankService } from "../../services/question-bank.service";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { ErrorHandler } from "src/app/core/helpers/error-handler";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";

@Component({
  selector: "app-edit-questionbank",
  templateUrl: "./edit-questionbank.component.html",
  styleUrls: ["./edit-questionbank.component.css"],
})
export class EditQuestionbankComponent implements OnInit {
  @HostListener("document:keyup", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    +event?.which === 13 && this.onSubmit();
  }
  private schoolAPI = environment.schoolAPI;

  // member variables
  questionBankForm!: any;
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
  mark: string = "";
  questionText: string = "";
  optionAText: string = "";
  optionBText: string = "";
  optionCText: string = "";
  optionDText: string = "";
  answer: string = "";
  classWiseSubjects!: any;
  isClassGreaterThanTen: boolean = false;
  isScienceStreamSelected: boolean = false;
  annextureLoad: boolean = false;
  subjectLoad: boolean = false;
  streamLoad: boolean = false;
  groupLoad: boolean = false;
  streamGroupTypeLoad: boolean = false;
  public fileUrl = environment.filePath;

  allLabel: string[] = [
    "Assessment type",
    "Class",
    "Stream",
    "Group",
    "Subject",
    "Set name",
    "Question",
    "Question",
    "Mark",
    "Option A",
    "Option A",
    "Option B",
    "Option B",
    "Option C",
    "Option C",
    "Option D",
    "Option D",
    "Answer",
  ];
  questionId: string | null;
  questionDetails: any = [];
  isQuestionText: boolean = true;
  isOptionAText: boolean = true;
  isOptionBText: boolean = true;
  isOptionCText: boolean = true;
  isOptionDText: boolean = true;
  questionImgUrl!: any;
  optionAImgUrl!: any;
  optionBImgUrl!: any;
  optionCImgUrl!: any;
  optionDImgUrl!: any;
  questionImg!: File;
  optionAImg!: File;
  optionBImg!: File;
  optionCImg!: File;
  optionDImg!: File;
  formData = new FormData();
  currentAcademicYear!: string;

  // end
  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;

  newValidationMsg = {
    required: {
      assessmentType: "Please select assessment type",
      class: `Please select class`,
      subject: `Please select subject`,
      setName: `Please select set name`,
      mark: `Please enter marks for the question`,
      answer: `Please select answer option `,
    },
    conditionalValidation: {
      stream: "Please select stream",
      group: "Please select group",
      optionAText: "Please enter option A",
      optionAImg: "Please upload option A",
      optionBText: "Please enter option B",
      optionBImg: "Please upload option B",
      optionCText: "Please enter option C",
      optionCImg: "Please upload option C",
      optionDText: "Please enter option D",
      optionDImg: "Please upload option D",
    },
  };

  constructor(
    private commonserviceService: CommonserviceService,
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private questionBankService: QuestionBankService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private privilegeHelper: PrivilegeHelper, //For menu privilege
    private alertHelper: AlertHelper,
    private router: Router,
    private errorHandler: ErrorHandler,
    private elementRef: ElementRef
  ) {
    const pageUrl: any = this.router.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl); //For menu privilege
    this.commonserviceService.verifyLinkPermission(
      pageUrl,
      this.config.linkType[2],
      this.config.privilege[4]
    ); // For authorization
    this.questionId = this.activatedRoute.snapshot.paramMap?.get("encId");
    this.getCurrentAcademicYear();
  }

  ngOnInit(): void {
    this.spinner.show();
    if (this.plPrivilege == "admin") {
      this.adminPrivilege = true;
    }
    this.getAnnextureData();
    this.initializeForm();
  }
  getCurrentAcademicYear() {
    this.commonserviceService.getCurrentAcademicYear().subscribe({
      next: (res: any) => {
        this.currentAcademicYear = res?.academicYear;
        this.spinner.hide();
      },
    });
  }

  getQuestionBankDetails() {
    this.questionBankService.getQuestionBankDetails(this.questionId).subscribe({
      next: (response: any) => {
        if (response?.success) {
          this.questionDetails = response?.data;
          this.fillTheForm();
        } else {
          this.alertHelper.viewAlert("error", "", response?.msg);
        }
        // if (response?.success === true) {
        //   this.classWiseSubjects = response?.data;
        //   this.subjectLoad = false;
        // }
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
          this.getQuestionBankDetails();
        },
      });
  }
  // ===== get class wise subjects
  getSubjects() {
    this.questionBankForm.patchValue({
      subject: "",
    });

    const classStreamGroupObj = {
      selectedClassId: parseInt(this.questionBankForm.getRawValue()?.class),
      selectedStreamId: parseInt(this.questionBankForm.getRawValue()?.stream),
      selectedGroupId: parseInt(this.questionBankForm.getRawValue()?.group),
    };

    if (
      classStreamGroupObj.selectedClassId > 10 &&
      classStreamGroupObj.selectedStreamId == 3 &&
      classStreamGroupObj.selectedGroupId > 0
    ) {
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
    // 1) get subjects of the selected class
    // 2) if class greater than 10 show stram field
    if (classStreamGroupObj.selectedClassId > 10) {
      this.isClassGreaterThanTen = true;
    } else {
      this.isClassGreaterThanTen = false; //else hide
    }
    if (classStreamGroupObj.selectedClassId < 11) {
      // reset stream and group previous stream value
      this.questionBankForm.patchValue({
        stream: "",
      });
      this.questionBankForm.patchValue({
        group: "",
      });
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
  // on stream change
  getStreamGroupType() {
    this.streamLoad = true;
    // if science stream selected
    if (
      parseInt(this.questionBankForm.getRawValue()?.stream) === 3 ||
      parseInt(this.stream) === 3
    ) {
      this.streamGroupAnnexture = this.annextureData?.STREAM_GROUP_TYPE.filter(
        (item: any) => item.anxtValue < 3
      );

      this.isScienceStreamSelected = true; // show stream group
      this.streamGroupTypeLoad = true;
    } else {
      this.isScienceStreamSelected = false; // hide  stream group
      this.streamGroupTypeLoad = false;
      // reset stream previous group value
      this.questionBankForm.patchValue({
        group: "",
      });
    }
    this.streamLoad = false;
    this.streamGroupTypeLoad = false;
    this.spinner.hide();
  }
  // on form submit
  onSubmit() {
    // 1) validate form
    const afterFormValidObserver = new Observable((observer) => {
      observer.next(this.validateForm());
    });
    afterFormValidObserver.subscribe({
      next: (isValid: any) => {
        if (isValid === false) {
          this.alertHelper.updateAlert().then((result: any) => {
            if (result.value) {
              this.spinner.show();
              this.prepareFormData();
            }
          });
        }
      },
    });
  }
  // 1) validate form
  validateForm() {
    // 1.a) custom validation for question
    if (
      !this.questionBankForm?.value?.questionText.length &&
      !this.questionBankForm?.value?.questionImg?.length
    ) {
      this.alertHelper.viewAlert("error", "Invalid", "Please enter a Question");
      return true;
    } //end

    // 1.b) Duplicate option valdiation
    const optionTextArr = [];
    this.formValue?.optionAText?.length &&
      optionTextArr.push(this.formValue?.optionAText);
    this.formValue?.optionBText?.length &&
      optionTextArr.push(this.formValue?.optionBText);
    this.formValue?.optionCText?.length &&
      optionTextArr.push(this.formValue?.optionCText);
    this.formValue?.optionDText?.length &&
      optionTextArr.push(this.formValue?.optionDText);

    if (new Set(optionTextArr).size !== optionTextArr.length) {
      this.alertHelper.viewAlert("error", "", "Duplicate option not allowed.");
      return true;
    } //end

    // 1.c) Reactive form validation
    const validationStatus = this.customValidators.formValidationHandler(
      this.questionBankForm,
      this.allLabel,
      this.elementRef,
      this.newValidationMsg
    );
    return validationStatus;
    //end
  }
  // 2) submit form
  prepareFormData() {
    const userProfile = this.commonserviceService.getUserProfile(); // get user profile
    if (this.formData.get("questionImg") === "") {
      this.formData.set(
        "questionImg",
        this.questionBankForm.get("questionImg")?.value
      );
    }

    if (!this.formData.get("optionAImg")) {
      this.formData.set(
        "optionAImg",
        this.questionBankForm.get("optionAImg")?.value
      );
    }
    if (!this.formData.get("optionBImg")) {
      this.formData.set(
        "optionBImg",
        this.questionBankForm.get("optionBImg")?.value
      );
    }
    if (!this.formData.get("optionCImg")) {
      this.formData.set(
        "optionCImg",
        this.questionBankForm.get("optionCImg")?.value
      );
    }
    if (!this.formData.get("optionDImg")) {
      this.formData.set(
        "optionDImg",
        this.questionBankForm.get("optionDImg")?.value
      );
    }
    this.formData.set("userId", userProfile?.userId);
    this.formData.set("questionBankId", this.questionDetails?.questionBankId);
    this.formData.set("questionId", this.questionDetails?.questionId);

    this.formData.set(
      "assessmentType",
      this.questionBankForm.get("assessmentType")?.value
    );
    this.formData.set("class", this.questionBankForm.get("class")?.value);
    this.formData.set("stream", this.questionBankForm.get("stream")?.value);
    this.formData.set("group", this.questionBankForm.get("group")?.value);
    this.formData.set("subject", this.questionBankForm.get("subject")?.value);
    this.formData.set("setName", this.questionBankForm.get("setName")?.value);
    this.formData.set(
      "questionText",
      this.questionBankForm.get("questionText")?.value
    );
    this.formData.set("mark", this.questionBankForm.get("mark")?.value);
    this.formData.set(
      "optionAText",
      this.questionBankForm.get("optionAText")?.value
    );
    this.formData.set(
      "optionBText",
      this.questionBankForm.get("optionBText")?.value
    );
    this.formData.set(
      "optionCText",
      this.questionBankForm.get("optionCText")?.value
    );
    this.formData.set(
      "optionDText",
      this.questionBankForm.get("optionDText")?.value
    );
    this.formData.set("answer", this.questionBankForm.get("answer")?.value);

    this.submitTheForm();
  }
  // 2) submit form
  submitTheForm() {
    this.questionBankService.updateQuestionBank(this.formData).subscribe({
      next: (res: any) => {
        if (res.success === true) {
          this.spinner.hide();
          this.alertHelper
            .successAlert("Saved!", res?.msg, "success")
            .then((res: any) => {
              this.router.navigate(["../../"], {
                relativeTo: this.activatedRoute,
              });
            });
        } else {
          this.spinner.hide();
          this.alertHelper.viewAlert("error", "", res?.msg);
        }
      },
      error: (error: any) => {
        this.spinner.hide(); //==== hide spinner
        this.errorHandler.serverSideErrorHandler(error); // server side error handler
      },
    });
  }

  // initialize reactive form
  initializeForm() {
    this.questionBankForm = this.formBuilder.group({
      assessmentType: [
        {
          value: this.assessmentType,
          disabled: true,
        },
        [Validators.required, Validators.pattern(/^[0-9]+$/)],
      ],
      class: [
        {
          value: this.class,
          disabled: true,
        },

        [Validators.required, Validators.pattern(/^[0-9]+$/), ,],
      ],
      stream: [
        {
          value: this.stream,
          disabled: true,
        },

        [
          Validators.pattern(/^[0-9]+$/),
          this.conditionalValidator(
            () => this.questionBankForm?.get("class")?.value,
            Validators.required,
            "conditionalValidation",
            "stream"
          ),
        ],
      ],
      group: [
        {
          value: this.group,
          disabled: true,
        },

        [
          Validators.pattern(/^[0-9]+$/),
          this.conditionalValidator(
            () => this.questionBankForm?.get("stream")?.value,
            Validators.required,
            "conditionalValidation",
            "group"
          ),
        ],
      ],

      subject: [
        {
          value: this.subject,
          disabled: true,
        },

        [Validators.required, Validators.pattern(/^[0-9]+$/)],
      ],

      setName: [
        {
          value: this.setName,
          disabled: true,
        },

        [Validators.required, Validators.pattern(/^[0-9]+$/)],
      ],
      questionText: [
        this.questionText,
        [this.customValidators.firstCharValidatorRF, Validators.maxLength(500)],
      ],
      questionImg: [this.questionImg, []],
      mark: [
        this.mark,
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(/^[0-9]+$/),
          this.customValidators.firstCharValidatorRF,
        ],
      ],
      optionAText: [
        this.optionAText,
        [
          this.customValidators.firstCharValidatorRF,
          Validators.maxLength(500),
          this.conditionalValidator(
            () => this.questionBankForm?.get("optionAImg")?.value,
            Validators.required,
            "conditionalValidation",
            "optionAText"
          ),
        ],
      ],
      optionAImg: [
        this.optionAImg,
        [
          this.conditionalValidator(
            () => this.questionBankForm?.get("optionAText")?.value,
            Validators.required,
            "conditionalValidation",
            "optionAImg"
          ),
        ],
      ],
      optionBText: [
        this.optionBText,
        [
          this.customValidators.firstCharValidatorRF,
          Validators.maxLength(500),
          this.conditionalValidator(
            () => this.questionBankForm?.get("optionBImg")?.value,
            Validators.required,
            "conditionalValidation",
            "optionBText"
          ),
        ],
      ],
      optionBImg: [
        this.optionBImg,
        [
          this.conditionalValidator(
            () => this.questionBankForm?.get("optionBText")?.value,
            Validators.required,
            "conditionalValidation",
            "optionBImg"
          ),
        ],
      ],
      optionCText: [
        this.optionCText,
        [
          this.customValidators.firstCharValidatorRF,
          Validators.maxLength(500),
          this.conditionalValidator(
            () => this.questionBankForm?.get("optionCImg")?.value,
            Validators.required,
            "conditionalValidation",
            "optionCText"
          ),
        ],
      ],
      optionCImg: [
        this.optionCImg,
        [
          this.conditionalValidator(
            () => this.questionBankForm?.get("optionCText")?.value,
            Validators.required,
            "conditionalValidation",
            "optionCImg"
          ),
        ],
      ],
      optionDText: [
        this.optionDText,
        [
          this.customValidators.firstCharValidatorRF,
          Validators.maxLength(500),
          this.conditionalValidator(
            () => this.questionBankForm?.get("optionDImg")?.value,
            Validators.required,
            "conditionalValidation",
            "optionDText"
          ),
        ],
      ],
      optionDImg: [
        this.optionDImg,
        [
          this.conditionalValidator(
            () => this.questionBankForm?.get("optionDText")?.value,
            Validators.required,
            "conditionalValidation",
            "optionDImg"
          ),
        ],
      ],
      answer: [
        this.answer,
        [Validators.required, Validators.pattern(/^[0-9]+$/)],
      ],
    });
    this.formData.set("questionImg", "");
    this.formData.set("optionAImg", "");
    this.formData.set("optionBImg", "");
    this.formData.set("optionCImg", "");
    this.formData.set("optionDImg", "");
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

      // optionA
      if (this.isOptionAText === true && validationType === "optionAText") {
        conditionStatus = true;
      }
      if (this.isOptionAText === false && validationType === "optionAImg") {
        conditionStatus = true;
      }

      // optionB
      if (this.isOptionBText && validationType === "optionBText") {
        conditionStatus = true;
      }
      if (this.isOptionBText === false && validationType === "optionBImg") {
        conditionStatus = true;
      }

      // optionC
      if (this.isOptionCText && validationType === "optionCText") {
        conditionStatus = true;
      }
      if (this.isOptionCText === false && validationType === "optionCImg") {
        conditionStatus = true;
      }

      // optionD
      if (this.isOptionDText && validationType === "optionDText") {
        conditionStatus = true;
      }
      if (this.isOptionDText === false && validationType === "optionDImg") {
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
    this.questionBankForm.get("class").valueChanges.subscribe({
      next: (res: any) => {
        this.questionBankForm.get("stream").updateValueAndValidity();
      },
    });
    // stream change observer
    this.questionBankForm.get("stream").valueChanges.subscribe({
      next: (res: any) => {
        this.questionBankForm.get("group").updateValueAndValidity();
      },
    });
  }
  fillTheForm() {
    this.assessmentType = this.questionDetails?.assessmentType;
    this.stream = this.questionDetails?.streamType.toString();
    this.group = this.questionDetails?.streamGroupType.toString();
    this.subject = this.questionDetails?.subjectId.toString();
    this.mark = this.questionDetails?.mark.toString();
    this.answer = this.questionDetails?.answer.toString();
    this.class = this.questionDetails?.classId.toString();
    this.setName = this.questionDetails?.setId.toString();

    this.questionText = this.questionDetails?.questionText;
    this.questionImg = this.questionDetails?.questionImg;
    this.optionAText = this.questionDetails?.optionAText;
    this.optionAImg = this.questionDetails?.optionAImg;
    this.optionBText = this.questionDetails?.optionBText;
    this.optionBImg = this.questionDetails?.optionBImg;
    this.optionCText = this.questionDetails?.optionCText;
    this.optionCImg = this.questionDetails?.optionCImg;
    this.optionDText = this.questionDetails?.optionDText;
    this.optionDImg = this.questionDetails?.optionDImg;

    if (this.questionImg) {
      this.isQuestionText = false;
      this.questionImgUrl =
        this.fileUrl +
        "/" +
        this.questionDetails?.questionImg.replace(".", "~");
    }
    if (this.optionAImg) {
      this.isOptionAText = false;
      this.optionAImgUrl =
        this.fileUrl + "/" + this.questionDetails?.optionAImg.replace(".", "~");
    }
    if (this.optionBImg) {
      this.isOptionBText = false;
      this.optionBImgUrl =
        this.fileUrl + "/" + this.questionDetails?.optionBImg.replace(".", "~");
    }
    if (this.optionCImg) {
      this.isOptionCText = false;
      this.optionCImgUrl =
        this.fileUrl + "/" + this.questionDetails?.optionCImg.replace(".", "~");
    }
    if (this.optionDImg) {
      this.isOptionDText = false;
      this.optionDImgUrl =
        this.fileUrl + "/" + this.questionDetails?.optionDImg.replace(".", "~");
    }

    const classStreamGroupObj = {
      selectedClassId: parseInt(this.class),
      selectedStreamId: parseInt(this.stream),
      selectedGroupId: parseInt(this.group),
    };

    if (parseInt(this.class) > 0)
      this.getSubjectsClassStreamGroupWise(classStreamGroupObj);
    // 1) get subjects of the selected class
    // 2) if class greater than 10 show stram field
    if (parseInt(this.class) > 10) {
      this.isClassGreaterThanTen = true;
    } else {
      this.isClassGreaterThanTen = false; //else hide
    }
    this.getStreamGroupType();
    this.initializeForm();
    this.conditionalValidationObserver();
  }
  resetImage(controlName: string) {
    switch (controlName) {
      case "question":
        this.questionBankForm.patchValue({ questionImg: "" });
        break;
      case "optionA":
        this.questionBankForm.patchValue({ optionAImg: "" });
        break;
      case "optionB":
        this.questionBankForm.patchValue({ optionBImg: "" });
        break;
      case "optionC":
        this.questionBankForm.patchValue({ optionCImg: "" });
        break;
      case "optionD":
        this.questionBankForm.patchValue({ optionDImg: "" });
        break;
      default:
        break;
    }
  }
  resetTextField(controlName: string) {
    switch (controlName) {
      case "question":
        this.questionBankForm.patchValue({ questionText: "" });
        break;
      case "optionA":
        this.questionBankForm.patchValue({ optionAText: "" });
        break;
      case "optionB":
        this.questionBankForm.patchValue({ optionBText: "" });
        break;
      case "optionC":
        this.questionBankForm.patchValue({ optionCText: "" });
        break;
      case "optionD":
        this.questionBankForm.patchValue({ optionDText: "" });
        break;
      default:
        break;
    }
  }
  toggleTextImage(type: string) {
    if (type === "question") {
      this.isQuestionText = !this.isQuestionText;
      this.questionImgUrl = undefined;
      this.formData.set("questionImg", "");
    }
    if (type === "optionA") {
      this.isOptionAText = !this.isOptionAText;
      this.optionAImgUrl = undefined;
      this.formData.set("optionAImg", "");
    }
    if (type === "optionB") {
      this.isOptionBText = !this.isOptionBText;
      this.optionBImgUrl = undefined;
      this.formData.set("optionBImg", "");
    }
    if (type === "optionC") {
      this.isOptionCText = !this.isOptionCText;
      this.optionCImgUrl = undefined;
      this.formData.set("optionCImg", "");
    }
    if (type === "optionD") {
      this.isOptionDText = !this.isOptionDText;
      this.optionDImgUrl = undefined;
      this.formData.set("optionDImg", "");
    }
  }
  imageUploadHandler(event: any, controlName: string) {
    const uploadedImage = event.target.files[0];
    if (uploadedImage != null) {
      if (
        uploadedImage.type != "image/png" &&
        uploadedImage.type != "image/jpg" &&
        uploadedImage.type != "image/jpeg"
      ) {
        event.target.value = "";
        this.resetImage(controlName);
        this.questionBankForm.patchValue({ question: "" });
        this.alertHelper.viewAlertHtml(
          "error",
          "Error",
          '<i class="bi bi-arrow-right text-danger"></i> File type should be png, jpg or jpeg file'
        );
        return;
      }
      // max 300kb allowed
      if (uploadedImage.size >= 1024 * 300) {
        event.target.value = "";
        this.resetImage(controlName);
        this.alertHelper.viewAlertHtml(
          "error",
          "Error",
          '<i class="bi bi-arrow-right text-danger"></i> Image size should not be greater than 300 KB'
        );
        return;
      }

      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.setImage(reader.result, controlName, uploadedImage);
        };
      }
    }
  }
  // preview image and patch field
  setImage(image: any, controlName: string, uploadedImage: any) {
    switch (controlName) {
      case "question":
        this.formData.set("questionImg", uploadedImage);
        this.questionImgUrl = image;
        this.questionBankForm.patchValue({ questionImg: image });
        break;
      case "optionA":
        this.formData.set("optionAImg", uploadedImage);
        this.optionAImgUrl = image;
        this.questionBankForm.patchValue({ optionAImg: image });
        break;
      case "optionB":
        this.formData.set("optionBImg", uploadedImage);
        this.optionBImgUrl = image;
        this.questionBankForm.patchValue({ optionBImg: image });
        break;
      case "optionC":
        this.formData.set("optionCImg", uploadedImage);
        this.optionCImgUrl = image;
        this.questionBankForm.patchValue({ optionCImg: image });
        break;
      case "optionD":
        this.formData.set("optionDImg", uploadedImage);
        this.optionDImgUrl = image;
        this.questionBankForm.patchValue({ optionDImg: image });
        break;
      default:
        break;
    }
  }
  typeHandler(type: string) {
    this.toggleTextImage(type);
    this.resetTextField(type);
    this.resetImage(type); // reset field
  }
  resetPreview() {
    this.isQuestionText = true;
    this.isOptionAText = true;
    this.isOptionBText = true;
    this.isOptionCText = true;
    this.isOptionDText = true;

    this.questionImgUrl = undefined;
    this.optionAImgUrl = undefined;
    this.optionBImgUrl = undefined;
    this.optionCImgUrl = undefined;
    this.optionDImgUrl = undefined;
  }
  onCancel() {
    this.router.navigate(["../../"], {
      relativeTo: this.activatedRoute,
    });
  }
  get formValue() {
    return this.questionBankForm?.getRawValue();
  }
}
