/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 15-06-2022
 * Description : Teacher training info .
 **/

import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormArray,
  FormBuilder,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { NgxSpinnerService } from "ngx-spinner";
import { RegistrationService } from "../../services/registration.service";
import { DatePipe } from "@angular/common";
import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
@Component({
  selector: "app-training-and-language-info",
  templateUrl: "./training-and-language-info.component.html",
  styleUrls: ["./training-and-language-info.component.css"],
})
export class TrainingAndLanguageInfoComponent implements OnInit, AfterViewInit {
  trainingAndLanguageInfoForm!: any;
  placeOfTraining: string = "";
  nameOfTraining: string = "";
  numberOfDaysTrained: string = "";
  trainingRecved: string = "";
  passedTetRadio: string = "";
  yearOfPassing: string = "";
  rollNo: string = "";
  marksObtained: string = "";
  subject: string = "";
  brpCrccRadio: string = "";
  brp: string = "";
  crcc: string = "";
  languageUpto: string = "";
  languageHavingKnowlede: string = "";
  language1: string = "";
  language2: string = "";
  place: any = "";
  placeDate: any = "";
  allPlaceOfTraining!: any;
  allLabel: string[] = [
    "Whether appointment based on teacher eligiblity test?",
    "Exam passed",
    "Year of passing",
    "Roll no.",
    "Marks obtained",
    "Subjects",
    "Have you ever worked or are working as brp/crcc?",
    "Brp",
    "Crcc",
    "Place",
    "Date",
  ];
  allYears: Array<number> = [];
  existingtrainingAndLanguageInfo!: any;
  existingtrainingAndLanguageInfoChild!: any;
  draftStatus: boolean = false;
  teacherDetails: any = {};
  disableFields: boolean = false;
  isChecked: boolean = false;
  currentDate: any;
  teacherName: string = "";
  touchCntl: any = "";

  singleField: boolean = true;
  trainingLabels: string[] = this.getCustomizedLabelName("");
  teacherExamPassed: any = "";
  teacherExamPassedChanged: boolean = false;
  examPassed: any = "";
  maxDate: any = Date;
  public userProfile = JSON.parse(
    sessionStorage.getItem("userProfile") || "{}"
  );
  loginUserType = this.userProfile.loginUserTypeId;
  userDesignation = this.userProfile.designationId;
  constructor(
    private activatedRoute: ActivatedRoute,
    private registrationService: RegistrationService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private router: Router,
    public datepipe: DatePipe,
    private el: ElementRef,
    private commonService: CommonserviceService,
    public commonFunctionHelper: CommonFunctionHelper
  ) {
    this.teacherId = this.activatedRoute.snapshot.paramMap?.get("id");
    this.maxDate = new Date();

    this.currentDate = this.datepipe.transform(new Date(), "dd-MM-yyyy");
  }
  teacherId: string | null = "";
  tetStatus: boolean = false;
  brpCrccStatus: boolean = false;
  isDisabled: boolean = false;
  ngOnInit(): void {
    this.placeDate=this.maxDate;
    this.getAnnextureData();
    this.getTeacherDetails();
    this.getPlaceOfTraining();
    this.getExistingtrainingAndLanguageInfo();
    //this.el.nativeElement.querySelector("[formControlName=placeOfTraining]").focus();
    this.initializeForm();
    this.addRow(0);
    this.spinner.show();
  }

  ngAfterViewInit() {
    this.el.nativeElement
      .querySelector("[formControlName=placeOfTraining]")
      .focus();
  }

  getAnnextureData() {
    this.commonService.getCommonAnnexture(["EXAM_PASSED"]).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.teacherExamPassed = res?.data?.EXAM_PASSED;
        this.teacherExamPassedChanged = false;
      },
    });
  }
  initializeForm() {
    this.trainingAndLanguageInfoForm = this.formBuilder.group({
      passedTetRadio: [this.passedTetRadio],
      examPassed: [
        this.examPassed,
        [ 
          this.conditionalValidator(
            () => this.trainingAndLanguageInfoForm.get("passedTetRadio")?.value,
            Validators.required,
            "conditionalValidation"
          ),
        ],
      ],
      yearOfPassing: [
        this.yearOfPassing,
        [
          Validators.maxLength(4),
          Validators.pattern(/^[0-9]+$/),
          this.conditionalValidator(
            () => this.trainingAndLanguageInfoForm.get("passedTetRadio")?.value,
            Validators.required,
            "conditionalValidation"
          ),
        ],
      ],
      rollNo: [
        this.rollNo,
        [
          Validators.maxLength(20),
          this.customValidators.firstCharValidatorRF,
          Validators.pattern(/^[a-zA-Z0-9]+$/),
          this.conditionalValidator(
            () => this.trainingAndLanguageInfoForm.get("passedTetRadio")?.value,
            Validators.required,
            "conditionalValidation"
          ),
        ],
      ],
      marksObtained: [
        this.marksObtained,
        [
          Validators.maxLength(5),
          Validators.pattern(/^[0-9.]+$/),
          this.conditionalValidator(
            () => this.trainingAndLanguageInfoForm.get("passedTetRadio")?.value,
            Validators.required,
            "conditionalValidation"
          ),
        ],
      ],
      subject: [
        this.subject,
        [
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/),
          this.conditionalValidator(
            () => this.trainingAndLanguageInfoForm.get("passedTetRadio")?.value,
            Validators.required,
            "conditionalValidation"
          ),
        ],
      ],
      brpCrccRadio: [this.brpCrccRadio],

      brp: [
        this.brp,
        [
          Validators.pattern(/^[0-9]+$/),
          this.conditionalValidator(
            () => this.trainingAndLanguageInfoForm.get("brpCrccRadio")?.value,
            Validators.required,
            "conditionalValidation"
          ),
        ],
      ],
      crcc: [
        this.crcc,
        [
          Validators.pattern(/^[0-9]+$/),
          this.conditionalValidator(
            () => this.trainingAndLanguageInfoForm.get("brpCrccRadio")?.value,
            Validators.required,
            "conditionalValidation"
          ),
        ],
      ],
      // languageUpto: [
      //   this.languageUpto,
      //   [
      //     Validators.required,
      //     Validators.maxLength(248),
      //     Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/),
      //   ],
      // ],
      // languageHavingKnowlede: [
      //   this.languageHavingKnowlede,
      //   [
      //     Validators.required,
      //     Validators.maxLength(248),
      //     Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/),
      //   ],
      // ],
      // language1: [
      //   this.language1,
      //   [
      //     Validators.required,
      //     Validators.maxLength(248),
      //     Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/),
      //   ],
      // ],
      // language2: [
      //   this.language2,
      //   [
      //     Validators.required,
      //     Validators.maxLength(248),
      //     Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/),
      //   ],
      // ],
      place: [
        this.place,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/),
        ],
      ],
      placeDate: [this.placeDate],
      touchCntl: [""],
      inServiceTrainingArray: this.formBuilder.array([]),
    });
  }
  inServiceTrainingInfo() {
    return this.trainingAndLanguageInfoForm.get(
      "inServiceTrainingArray"
    ) as FormArray;
  }
  disableHelper() {
    this.trainingAndLanguageInfoForm?.disable();
    this.disableFields = true;
  }
  enableHelper() {
    this.trainingAndLanguageInfoForm?.enable();
    this.disableFields = false;
  }
  // ======= get existing teacher educational ifo
  getExistingtrainingAndLanguageInfo() {
    this.registrationService
      .getExistingtrainingAndLanguageInfo(this.teacherId)
      .subscribe({
        next: (res: any) => {
          if (res?.success === true && res?.trainingAndLanguageInfo) {
            this.existingtrainingAndLanguageInfo = res?.trainingAndLanguageInfo;
            // this.existingtrainingAndLanguageInfoChild =
            //   res?.trainingAndLanguageInfoChild;
            this.fillFieldsWithExistingData();
            this.isChecked = true;
            this.isDisabled = true;
          } else {
            this.initializeForm();
            this.addRow(0);
            this.passedTetRadioConditionalValidator();
            this.brpCrccRadioConditionalValidator();
          }
        },
        error: (err: any) => {
          this.spinner.hide();
        },
      });
  }
  fillFieldsWithExistingData() {
    const {
      examPassed,
      yearOfPassing,
      rollNo,
      marksObtained,
      subject,
      brp,
      crcc,
      languageUpto,
      languageHavingKnowlede,
      language1,
      language2,
      tetStatus,
      brpCrccStatus,
      place,
      placeDate,
    } = this.existingtrainingAndLanguageInfo[0];
    this.examPassed = examPassed ? examPassed : "";
    this.yearOfPassing = yearOfPassing ? yearOfPassing : "";
    this.rollNo = rollNo;
    this.marksObtained = marksObtained;
    this.subject = subject;
    this.brp = brp;
    this.crcc = crcc;
    this.languageUpto = languageUpto;
    this.languageHavingKnowlede = languageHavingKnowlede;
    this.language1 = language1;
    this.language2 = language2;
    this.place = place;
    this.placeDate = placeDate ? new Date(placeDate.toString()) : placeDate;
    if(this.placeDate === null || this.placeDate === ''){
      this.placeDate = this.maxDate;
    }
    if (tetStatus) {
      this.passedTetRadio = "1";
      this.showHelper("showTet");
    } else {
      this.passedTetRadio = "";
    }
    if (brpCrccStatus) {
      this.brpCrccRadio = "1";
      this.showHelper("showBrpCrcc");
    } else {
      this.brpCrccRadio = "";
    }

    this.disableFields = true;
    // this.disableHelper(); // disable all fields
    this.initializeForm();
    this.existingtrainingAndLanguageInfo.map((item: any) => {
      
      this.inServiceTrainingInfo().push(
        this.formBuilder.group({
          placeOfTraining: [item.placeOfTraining, [Validators.required]],
          nameOfTraining: [
            item.nameOfTraining,
            [
              Validators.required,
              Validators.maxLength(100),
              this.customValidators.firstCharValidatorRF,
              Validators.pattern(/^[a-zA-Z0-9 ,.'/()\-\s]+$/),
            ],
          ],
          trainingRecved: [item.trainingRecved, [Validators.required]],
          numberOfDaysTrained: [
            item.numberOfDaysTrained,
            [
              Validators.required,
              Validators.maxLength(3),
              this.customValidators.firstCharValidatorRF,
              Validators.pattern(/^[0-9]+$/),
            ],
          ],
        })
      );
    });

    // this.addRow(0);
    this.passedTetRadioConditionalValidator();
    this.brpCrccRadioConditionalValidator();
    // this.disableHelper(); // disable conditional validated fields
  }
  yearFieldSetup() {
    /**
     * Teacher passing year should be Teacher dob + 18 year
     * */
    let currentYear = new Date().getFullYear();
    let validYear = parseInt(this.teacherDetails.dobYear) + 18;

    while (validYear < currentYear) {
      this.allYears.push(currentYear--);
    }
  }
  // conditional validation
  conditionalValidator(
    predicate: any,
    validator: ValidatorFn,
    errorNamespace?: string
  ): ValidatorFn {
    return (formControl) => {
      // 1) if parent empty
      if (!formControl.parent) {
        return null;
      }
      let error = null;
      // 2) check childs direct parent field

      if (predicate()) {
        error = validator(formControl); // validate
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

  passedTetRadioConditionalValidator() {
    this.trainingAndLanguageInfoForm
      .get("passedTetRadio")
      .valueChanges.subscribe({
        next: (res: any) => {
          this.trainingAndLanguageInfoForm
            .get("examPassed")
            .updateValueAndValidity();
          this.trainingAndLanguageInfoForm
            .get("yearOfPassing")
            .updateValueAndValidity();
          this.trainingAndLanguageInfoForm
            .get("rollNo")
            .updateValueAndValidity();
          this.trainingAndLanguageInfoForm
            .get("marksObtained")
            .updateValueAndValidity();
          this.trainingAndLanguageInfoForm
            .get("subject")
            .updateValueAndValidity();
        },
      });
  }
  brpCrccRadioConditionalValidator() {
    this.trainingAndLanguageInfoForm
      .get("brpCrccRadio")
      .valueChanges.subscribe({
        next: (res: any) => {
          this.trainingAndLanguageInfoForm.get("brp").updateValueAndValidity();
          this.trainingAndLanguageInfoForm.get("crcc").updateValueAndValidity();
        },
      });
  }
  showHelper(type: string) {
    if (type == "showBrpCrcc") {
      this.brpCrccStatus = true;
    }
    if (type == "showTet") {
      this.tetStatus = true;
    }
  }
  hideHelper(type: string) {
    if (type == "hideBrpCrcc") {
      this.brpCrccStatus = false;
    }
    if (type == "hideTet") {
      this.tetStatus = false;
    }
  }

  getPlaceOfTraining() {
    this.registrationService.getPlaceOfTraining().subscribe({
      next: (res: any) => {
        if (res.success === true) this.allPlaceOfTraining = res.data;
        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
      },
    });
  }
  getTeacherDetails() {
    this.registrationService.getTeacherDetails(this.teacherId).subscribe({
      next: (res: any) => {
        if (res.success === true) {
          this.draftStatus = res.draftSubmitted;
          this.teacherDetails = res.data;
          this.teacherName = res.data.teacherName;
          this.yearFieldSetup(); // set year field
        }
      },
      error: (err: any) => {
        this.spinner.hide();
      },
    });
  }

  // resetForm() {
  //   this.placeOfTraining = "";
  //   this.nameOfTraining = "";
  //   this.numberOfDaysTrained = "";
  //   this.examPassed = "";
  //   this.yearOfPassing = "";
  //   this.rollNo = "";
  //   this.marksObtained = "";
  //   this.subject = " ";
  //   this.brp = "";
  //   this.crcc = "";
  //   this.languageUpto = "";
  //   this.languageHavingKnowlede = "";
  //   this.language1 = "";
  //   this.language2 = "";
  //   this.place = "";
  //   this.placeDate = "";
  //   this.initializeForm();
  // }
  enableDisableHelper() {
    if (this.disableFields == true) {
      this.enableHelper();
      this.disableFields = false;
    } else {
      this.disableHelper();
      this.disableFields = true;
    }
  }
  getFormValue(allValue: any) {
    //console.log(this.trainingAndLanguageInfoForm.get("placeDate")?.value,"test")
    let placeDate =  this.commonFunctionHelper.formatDateHelper(this.trainingAndLanguageInfoForm.get("placeDate")?.value);
   // console.log(placeDate,"test date")

    return {
      ...allValue,
      placeDate: this.commonFunctionHelper.formatDateHelper(
        allValue?.placeDate
      ),
    };
  }
  onSubmit() {
    this.enableHelper(); // enable fields for validation

    const validationStatus = this.customValidators.formValidationHandler(
      this.trainingAndLanguageInfoForm,
      this.allLabel
    );

    if (validationStatus === false) {
      if (this.isChecked === false) {
        document.getElementById("submitButtonId")?.blur();
        this.alertHelper
          .viewAlert(
            "error",
            "Invalid",
            "Please confirm the filled up in this format are true."
          )
          .then(() => {
            document.getElementById("checkBoxId")?.focus();
          });
      } else {
        this.submitForm();
      }
    }
  }
  submitForm() {
    let arrCntrl = [];
    for (const key of Object.keys(this.trainingAndLanguageInfoForm.controls)) {
      if (this.trainingAndLanguageInfoForm.controls[key].touched === true) {
        arrCntrl.push(key);
      }
    }
    this.trainingAndLanguageInfoForm.patchValue({
      touchCntl: arrCntrl,
    });

    this.alertHelper.submitAlert().then((result: any) => {
      if (result.value) {
        const allValue = this.trainingAndLanguageInfoForm?.getRawValue();
        this.spinner.show();
        this.registrationService
          .saveTrainingAndLanguageInfoAndSubmitAllDraft(
            this.teacherId,
            this.getFormValue(allValue)
          )
          .subscribe({
            next: (res: any) => {
              this.spinner.hide();
              if (res.status === "SUCCESS") {
                this.alertHelper
                  .successAlert("Saved!", res?.msg, "success")
                  .then((res: any) => {
                    this.isChecked = false;
                    this.spinner.show();
                    this.router.navigate(["../../"], {
                      relativeTo: this.activatedRoute,
                    });
                  });
              } else {
                this.alertHelper.viewAlert(
                  "error",
                  "Invalid",
                  "Something went wrong."
                );
              }
            },
            error: (error: any) => {
              this.spinner.hide(); //==== hide spinner
              // ==== convert object to array
              const result: any = Object.keys(error.error.msg).map((key) => [
                error.error.msg[key],
              ]);

              let errorMessage: string = "";
              if (typeof error.error.msg === "string") {
                errorMessage +=
                  '<i class="bi bi-arrow-right text-danger"></i> ' +
                  error.error.msg +
                  `<br>`;
              } else {
                result.map(
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
          });
      }
    });
  }
  changeCheckStatus() {
    this.isChecked = this.isChecked ? false : true;
  }
  pageChangeWarningHandler(path: string) {
    this.commonFunctionHelper.pageChangeWarningHandler(
      path,
      this.teacherId,
      this.activatedRoute
    );
  }

  newTrainingAdd() {
    return this.formBuilder.group({
      placeOfTraining: [this.placeOfTraining, [Validators.required]],
      nameOfTraining: [
        this.nameOfTraining,
        [
          Validators.required,
          Validators.maxLength(100),
          this.customValidators.firstCharValidatorRF,
          Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/),
        ],
      ],
      trainingRecved: [this.trainingRecved, [Validators.required]],
      numberOfDaysTrained: [
        this.numberOfDaysTrained,
        [
          Validators.required,
          Validators.maxLength(3),
          this.customValidators.firstCharValidatorRF,
          Validators.pattern(/^[0-9]+$/),
        ],
      ],
    });
  }
  addRow(index: any) {
    let emptyRow: Boolean = false;
    this.inServiceTrainingInfo()?.controls?.map((item: any, index: number) => {
      if (emptyRow === true) return;
      if (item?.invalid) {
        this.alertHelper.successAlert(
          "Invalid",
          "All the fields are mandatory.",
          "error"
        );
        emptyRow = true;
      }
    });
    if (emptyRow === false) {
      this.inServiceTrainingInfo().insert(index + 1, this.newTrainingAdd());
    }
  }
  // remove row
  removeRow(index: any) {
    // this.assetFilterData.splice(index, 1);
    if (this.inServiceTrainingInfo().length === 1) {
      this.resetForm();
    }
    this.inServiceTrainingInfo().length > 1 &&
      this.inServiceTrainingInfo().removeAt(index);
    this.checkSingleField();
  }
  checkSingleField() {
    this.singleField = this.inServiceTrainingInfo()?.length > 1 ? false : true;
  }
  resetFormArray() {
    (
      this.trainingAndLanguageInfoForm.get(
        "inServiceTrainingArray"
      ) as FormArray
    ).clear();
  }
  resetForm() {
    this.examPassed = "";
    this.yearOfPassing = "";
    this.rollNo = "";
    this.marksObtained = "";
    this.subject = " ";
    this.brp = "";
    this.crcc = "";
    this.languageUpto = "";
    this.languageHavingKnowlede = "";
    this.language1 = "";
    this.language2 = "";
    this.place = "";
    this.placeDate = "";
    this.initializeForm();
    this.resetFormArray();
    this.addRow(0);
  }
  getCustomizedLabelName(levelName: string) {
    return [
      `${levelName}  :- Place of training`,
      `${levelName}  :- Name of training`,
      `${levelName}  :- Training needed/received`,
      `${levelName}  :- No. of days trained `,
    ];
  }
  validateSubmitTraining() {
    Promise.all([this.validateTrainingForm(), this.checkDuplicateLevel()]).then(
      (value) => {
        const formErrors = value[0];
        const checkDuplicateLevelError = value[1];
        if (checkDuplicateLevelError === true) {
          this.alertHelper.successAlert(
            "Invalid",
            "Duplicate training can not be selected !!!",
            "error"
          );
        } else {
          let formInvalid: any = false;
          formErrors.map((item: any) => {
            if (item !== false) {
              formInvalid = true;
            }
          });
          formInvalid === false && this.onSubmit();
        }
      }
    );
  }
  checkDuplicateLevel(): any {
    let allValueArray: Array<number> = [];
    let trainingLevelsArr = <FormArray>(
      this.trainingAndLanguageInfoForm.controls["inServiceTrainingArray"]
    );
    trainingLevelsArr.controls?.map(async (item: any, index: number) => {
      allValueArray.push(parseInt(item?.controls.placeOfTraining.value));
    });

    const uniqueSet = new Set(allValueArray);
    if (allValueArray.length != uniqueSet.size) {
      return true;
    } else {
      return false;
    }
  }
  validateTrainingForm() {
    let allErrors: any = [];
    let trainingLevelsArr = <FormArray>(
      this.trainingAndLanguageInfoForm.controls["inServiceTrainingArray"]
    );
    trainingLevelsArr.controls?.map((item: any, index: number) => {
      this.trainingLabels = this.getCustomizedLabelName("SlNo. " + (index + 1));
      let errors = this.customValidators.formValidationHandler(
        item,
        this.trainingLabels
      );
      allErrors.push(errors);
    });
    return allErrors;
  }
}
