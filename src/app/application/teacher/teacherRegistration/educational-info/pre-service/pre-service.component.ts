/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 05-06-2022
 * Description : Teacher educational info (preservice).
 **/

import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CustomValidators } from "src/app/shared/validations/custom-validators";

@Component({
  selector: "app-pre-service",
  templateUrl: "./pre-service.component.html",
  styleUrls: ["./pre-service.component.css"],
})
export class PreServiceComponent implements OnInit {
  // decorators
  @ViewChild("qualificationTypeRef") qualificationTypeRef!: ElementRef;
  @Input() educationalQualificationTypes: any = "";
  @Input() existingPreServiceData: any = "";
  @Output() onFormFilled = new EventEmitter<any>();
  @Output() validationResult = new EventEmitter<any>();
  @Output() editStatusEmitter = new EventEmitter<any>();
  @Input() resetEvent!: Observable<void>;
  @Input() saveAsDraftEvent!: Observable<void>;
  // end
  // ======== member variable declaration
  resetEventSubscription!: Subscription;
  saveAsDraftEventSubscription!: Subscription;
  preServiceForm!: any;
  educationalQualificationType: string = "";
  yearOfPassing: string = "";
  schoolCollege: string = "";
  boardCouncilUniversity: string = "";
  subject: string = "";
  marksObtained!: number;
  fullMarks!: number;
  percentage!: number;
  disableFields: boolean = false;
  existingPreServiceDataAll!: any;
  singleField: boolean = true; // single row will not have action column
  preServiceLabel: string[] = this.getLabelNamesServiceWise("");
  allYears: Array<number> = [];
  teacherDob: string = "";
  // end

  constructor(
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private alertHelper: AlertHelper
  ) {
    this.yearFieldSetup();
  }

  ngOnInit(): void {
    this.initialFormSetup(); //setup reactive form
    this.saveAsDraftEventSubscribe(); // draft click event
    this.resetEventSubscribe(); // reset click event
    this.qualificationTypeRef?.nativeElement.focus();
  }
  ngOnChanges(changes: SimpleChanges): void {
    // ======= prefill existing data
    if (
      changes["existingPreServiceData"]?.firstChange === false &&
      changes["existingPreServiceData"]?.currentValue?.length
    ) {
      this.disableFields = true;
      this.initializeForm(); // initialize form
      this.existingPreServiceDataAll =
        changes["existingPreServiceData"]?.currentValue;
      this.fillFieldsWithExistingData();
    }
  }
  // ==== setup reactive form
  initialFormSetup() {
    this.initializeForm(); // initialize form
    if (!this.educationalInfo()?.length) {
      this.addRow(); // add row at first
    }
  }
  yearFieldSetup() {
    /**
     * Teacher passing year should be Teacher dob + 18 year
     * */
    let currentYear = new Date().getFullYear();
    let validYear = parseInt(this.teacherDob) + 18;

    while (validYear < currentYear) {
      this.allYears.push(currentYear--);
    }
  }
  // ====== get customized label names
  getLabelNamesServiceWise(educationTypeName: string) {
    return [
      `Pre-service education type`,
      `Pre-service (${educationTypeName}):- year of passing`,
      `Pre-service (${educationTypeName}):- school/college`,
      `Pre-service (${educationTypeName}):- board/council/university`,
      `Pre-service (${educationTypeName}):- subject`,
      `Pre-service (${educationTypeName}):- marks obtained`,
      `Pre-service (${educationTypeName}):- full marks`,
      `Pre-service (${educationTypeName}):- percentage`,
    ];
  }
  resetEventSubscribe() {
    // ======= reset event subscription
    this.resetEventSubscription = this.resetEvent.subscribe(() =>
      this.resetPreServiceForm()
    );
  }
  saveAsDraftEventSubscribe() {
    // ====== save as draft click subscription
    this.saveAsDraftEventSubscription = this.saveAsDraftEvent.subscribe({
      next: (res: any) => {
        Promise.all([
          this.validatePreServiceData(),
          this.checkDuplicateEducationType(),
        ]).then((value) => {
          const formErrors = value[0];
          const duplicateError = value[1];
          if (
            typeof duplicateError === "object" &&
            duplicateError?.educationType === true
          ) {
            this.alertHelper.successAlert(
              "Invalid",
              "Duplicate education type found in pre-service !!!",
              "error"
            );
          } else if (
            typeof duplicateError === "object" &&
            duplicateError?.yearOfPassing === true
          ) {
            this.alertHelper.successAlert(
              "Invalid",
              "Duplicate year of passing found in pre-service !!!",
              "error"
            );
          } else {
            let formInvalid: any = false;
            formErrors.map((item: any) => {
              if (item !== false) {
                formInvalid = true;
              }
            });
            if (formInvalid === true) {
              this.validationResult.emit(true);
            } else {
              this.validationResult.emit(false);
            }
          }
        });
      },
    });
  }
  fillFieldsWithExistingData() {
    this.existingPreServiceDataAll.map((item: any) => {
      this.educationalInfo().push(
        this.formBuilder.group({
          educationalQualificationType: [
            {
              value: item.educationalQualificationType,
              disabled: this.disableFields,
            },
            [Validators.required, Validators.pattern(/^[0-9]+$/)],
          ],
          yearOfPassing: [
            {
              value: item.yearOfPassing,
              disabled: this.disableFields,
            },
            [Validators.required, Validators.pattern(/^[0-9]+$/)],
          ],
          schoolCollege: [
            {
              value: item.schoolCollege,
              disabled: this.disableFields,
            },
            [
              Validators.required,
              this.customValidators.firstCharValidatorRF,
              Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/),
            ],
          ],
          boardCouncilUniversity: [
            {
              value: item.boardCouncilUniversity,
              disabled: this.disableFields,
            },
            [
              Validators.required,
              this.customValidators.firstCharValidatorRF,
              Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/),
            ],
          ],
          subject: [
            {
              value: item.subject,
              disabled: this.disableFields,
            },
            [
              Validators.required,
              this.customValidators.firstCharValidatorRF,
              Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/),
            ],
          ],
          marksObtained: [
            {
              value: item.marksObtained,
              disabled: this.disableFields,
            },
            [Validators.required, Validators.pattern(/^[0-9]+$/)],
          ],
          fullMarks: [
            {
              value: item.totalMark,
              disabled: this.disableFields,
            },
            [Validators.required, Validators.pattern(/^[0-9]+$/)],
          ],
          percentage: [
            {
              value: item.percentage,
              disabled: true,
            },
            [Validators.required],
          ],
        })
      );
    });
    this.emitChangeEventToParent();
  }
  // ======  initialize preServiceForm
  initializeForm() {
    this.preServiceForm = this.formBuilder.group({
      preServiceEducationalInfoArray: this.formBuilder.array([]), // store all data in this array
    });
  }
  // show number of row according to preServiceEducationalInfoArray items
  educationalInfo(): FormArray {
    return this.preServiceForm.get(
      "preServiceEducationalInfoArray"
    ) as FormArray;
  }
  // new row form data
  newEducation(): FormGroup {
    return this.formBuilder.group({
      educationalQualificationType: [
        this.educationalQualificationType,
        [Validators.required, Validators.pattern(/^[0-9]+$/)],
      ],
      yearOfPassing: [
        this.yearOfPassing,
        [Validators.required, Validators.pattern(/^[0-9]+$/)],
      ],
      schoolCollege: [
        this.schoolCollege,
        [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/)],
      ],
      boardCouncilUniversity: [
        this.boardCouncilUniversity,
        [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/)],
      ],
      subject: [
        this.subject,
        [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/)],
      ],
      marksObtained: [
        this.marksObtained,
        [Validators.required, Validators.pattern(/^[0-9]+$/)],
      ],
      fullMarks: [
        this.fullMarks,
        [Validators.required, Validators.pattern(/^[0-9]+$/)],
      ],
      percentage: [
        {
          value: this.percentage,
          disabled: true,
        },
        [Validators.required],
      ],
    });
  }
  // add row
  addRow() {
    let emptyRow: Boolean = false;
    this.educationalInfo()?.controls?.map((item: any, index: number) => {
      if (emptyRow === true) return;
      if (item?.invalid) {
        this.alertHelper.successAlert(
          "Invalid",
          "Empty/invalid educational qualification found in pre-service !!!",
          "error"
        );
        emptyRow = true;
      }
    });
    if (emptyRow === false) {
      this.educationalInfo().push(this.newEducation());
      this.emitChangeEventToParent();
    }
  }
  // remove row
  removeRow(index: any) {
    this.educationalInfo().length > 1 && this.educationalInfo().removeAt(index);
    this.emitChangeEventToParent();
  }
  emitChangeEventToParent() {
    this.singleField = this.educationalInfo()?.length > 1 ? false : true;
    this.onFormFilled.emit(this.preServiceForm);
  }
  enableFields() {
    // ===== form edit status emit to parent
    this.editStatusEmitter.emit({ preService: this.disableFields });

    this.disableFields = !this.disableFields;
    this.initializeForm(); // initialize form
    this.fillFieldsWithExistingData();
  }
  resetPreServiceForm() {
    this.initialFormSetup();
    this.disableFields = false;
  }
  calculatePercentage(marksObtained: any, fullMarks: any, formIndex: any) {
    if (parseInt(marksObtained.value) > parseInt(fullMarks?.value)) {
      this.alertHelper
        .successAlert(
          "Invalid",
          "Mark obtained can't be greater than full mark!!!",
          "error"
        )
        .then((res: any) => {
          fullMarks.focus();
        });
    } else if (
      parseInt(marksObtained.value) >= 0 &&
      parseInt(fullMarks?.value) >= 0
    ) {
      let percent: string | number =
        (parseInt(marksObtained.value) / parseInt(fullMarks?.value)) * 100;
      percent = percent % 1 === 0 ? percent : percent.toFixed(2);
      this.preServiceForm?.controls?.preServiceEducationalInfoArray?.controls?.map(
        (res: any, curIndex: number) => {
          if (formIndex === curIndex) {
            res.patchValue({
              percentage: percent,
            });
          }
        }
      );
    } else {
      this.preServiceForm?.controls?.preServiceEducationalInfoArray?.controls?.map(
        (res: any, curIndex: number) => {
          if (formIndex === curIndex) {
            res.patchValue({
              percentage: "",
            });
          }
        }
      );
    }
    this.emitChangeEventToParent();
  }
  validatePreServiceData(): any {
    let allErrors: any = [];
    this.preServiceForm?.controls?.preServiceEducationalInfoArray?.controls?.map(
      (preServiceFormGroups: FormGroup, index: number): any => {
        this.educationalQualificationTypes?.map((item: any) => {
          if (
            item?.anxtValue ==
            preServiceFormGroups?.controls?.["educationalQualificationType"]
              ?.value
          ) {
            this.preServiceLabel = this.getLabelNamesServiceWise(
              item?.anxtName
            );
          }
        });
        let errors = this.customValidators.formValidationHandler(
          preServiceFormGroups,
          this.preServiceLabel
        );
        allErrors.push(errors);
      }
    );
    return allErrors;
  }
  checkDuplicateEducationType(): any {
    let educationalQualificationTypeArr: Array<number> = [],
      yearOfPassingArr: Array<number> = [];

    this.preServiceForm?.controls?.preServiceEducationalInfoArray?.value.map(
      async (item: any) => {
        educationalQualificationTypeArr.push(
          +item?.educationalQualificationType
        );
        yearOfPassingArr.push(+item?.yearOfPassing);
      }
    );
    const educationUniqueSet = new Set(educationalQualificationTypeArr);
    const yearUniqueSet = new Set(yearOfPassingArr);

    if (educationalQualificationTypeArr.length != educationUniqueSet.size) {
      return {
        educationType: true,
      };
    } else if (yearOfPassingArr.length != yearUniqueSet.size) {
      return {
        yearOfPassing: true,
      };
    } else {
      return false;
    }
  }
  ngOnDestroy() {
    this.resetEventSubscription.unsubscribe();
    this.saveAsDraftEventSubscription.unsubscribe();
  }
}
