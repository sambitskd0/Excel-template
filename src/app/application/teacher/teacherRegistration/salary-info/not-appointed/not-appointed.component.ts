/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 15-06-2022
 * Description : Teacher salary info (notAppointed).
 **/

import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { FormBuilder, ValidatorFn, Validators } from "@angular/forms";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { AlertHelper } from "src/app/core/helpers/alert-helper";

@Component({
  selector: "app-not-appointed",
  templateUrl: "./not-appointed.component.html",
  styleUrls: ["./not-appointed.component.css"],
})
export class NotAppointedComponent implements OnInit {
  @Input() annextureResults: any = "";
  @Input() existingSalaryInfo!: any;
  @Input() teacherInfo!: any;

  paymentProcessAnnextures!: any;
  presentPayAnnextures!: any;
  notAppointedForm!: any;
  payMatrixLevel!: string;
  presentPayScale!: string;
  appointmentLetterNumber!: string;
  dateOfPresentPostingJoining: any = "";
  presentBasicPay!: string;
  presentGradePay!: string;
  presentPay: string = "";
  pranGpf!: string;
  paymentProcess: string = "";
  nameOfBank!: string;
  nameOfBranch!: string;
  bankAccountNumber!: string;
  ifscCode!: string;
  showBankFields: boolean = false;
  allLabel: string[] = [
    "Pay matrix level",
    "Present pay scale",
    "Appointment letter number",
    "Date of present posting / joining",
    "Present basic pay",
    "Present grade pay",
    "Present total pay",
    "Pran / gpf / uan",
    "Payment process",
    "Name of bank",
    "Other bank name",
    "Name of branch",
    "Bank account number",
    "Ifsc code",
  ];
  otherBankName: string = "";
  isAppointed: boolean = false;
  maxDate: any = Date;
  constructor(
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private elementRef: ElementRef,
    private changeDetectRef: ChangeDetectorRef,
    private alertHelper: AlertHelper
  ) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.setAnnextureData();
    this.formSetupHandler();
  }
  ngOnChanges(changes: SimpleChanges): void {
    // if not appointed
    if (
      parseInt(changes["existingSalaryInfo"]?.currentValue?.appointmentType) ===
      0
    ) {
      this.existingSalaryInfo = changes["existingSalaryInfo"]?.currentValue;
      this.fillFieldsWithExistingData();
    }
    if (changes["annextureResults"]) {
      this.annextureResults = changes["annextureResults"]?.currentValue;
      this.setAnnextureData();
    }
    if (changes["teacherInfo"]) {
      this.dateOfPresentPostingJoining = new Date(
        changes["teacherInfo"]?.currentValue?.joiningCurrentSchoolDt.toString()
      );
    }
  }
  formSetupHandler() {
    // this.notAppointedForm?.disable();
    this.initializeForm();
    this.paymentProcessValidator();
    if (
      this.existingSalaryInfo !== undefined &&
      this.existingSalaryInfo?.appointmentType == 0
    )
      this.enableDisableHelper(false);
  }
  initializeForm() {
    this.notAppointedForm = this.formBuilder.group({
      payMatrixLevel: [
        this.payMatrixLevel,
        [
          Validators.required,
          Validators.pattern(/^[A-Za-z0-9_./-]+$/),
          Validators.maxLength(11),
        ],
      ],
      presentPayScale: [
        this.presentPayScale,
        [
          Validators.required,
          Validators.maxLength(11),
          this.customValidators.firstCharValidatorRF,
          Validators.pattern(/^[0-9]+$/),
        ],
      ],
      appointmentLetterNumber: [
        this.appointmentLetterNumber,
        [
          Validators.required,
          Validators.maxLength(32),
          this.customValidators.firstCharValidatorRF,
          Validators.pattern(/^[A-Za-z0-9 _./-]+$/),
        ],
      ],

      dateOfPresentPostingJoining: [
        this.dateOfPresentPostingJoining,
        [Validators.required],
      ],
      presentBasicPay: [
        this.presentBasicPay,
        [Validators.required, Validators.pattern(/^[0-9]+$/)],
      ],
      presentGradePay: [
        this.presentGradePay,
        [Validators.required, Validators.pattern(/^[0-9]+$/)],
      ],
      presentPay: [
        this.presentPay,
        [Validators.required, Validators.pattern(/^[0-9]+$/)],
      ],

      pranGpf: [
        this.pranGpf,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(12),
          Validators.pattern(/^[A-Za-z0-9_.]+$/),
        ],
      ],

      paymentProcess: [
        this.paymentProcess,
        [Validators.required, Validators.pattern(/^[0-9]+$/)],
      ],
      nameOfBank: [
        this.nameOfBank,
        [
          this.conditionalValidator(
            () => this.notAppointedForm?.get("paymentProcess")?.value,
            Validators.required,
            "conditionalValidation",
            "nameOfBank"
          ),
        ],
      ],
      otherBankName: [
        this.otherBankName,
        [
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z ]*$/),
          this.customValidators.firstCharValidatorRF,
          this.conditionalValidator(
            () => this.notAppointedForm?.get("nameOfBank")?.value,
            Validators.required,
            "conditionalValidation",
            "otherBankName"
          ),
        ],
      ],
      nameOfBranch: [
        this.nameOfBranch,
        [
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-Z0-9 ]*$/),
          this.customValidators.firstCharValidatorRF,
          this.conditionalValidator(
            () => this.notAppointedForm?.get("paymentProcess")?.value,
            Validators.required,
            "conditionalValidation",
            "nameOfBranch"
          ),
        ],
      ],
      bankAccountNumber: [
        this.bankAccountNumber,
        [
          Validators.maxLength(100),
          Validators.pattern(/^[0-9]+$/),
          this.customValidators.firstCharValidatorRF,
          this.conditionalValidator(
            () => this.notAppointedForm?.get("paymentProcess")?.value,
            Validators.required,
            "conditionalValidation",
            "bankAccountNumber"
          ),
        ],
      ],

      ifscCode: [
        this.ifscCode,
        [
          Validators.pattern(/^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/),
          this.customValidators.firstCharValidatorRF,
          this.conditionalValidator(
            () => this.notAppointedForm?.get("paymentProcess")?.value,
            Validators.required,
            "conditionalValidation",
            "ifscCode"
          ),
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
      let parentValue = +predicate();

      // 1) if parent empty
      if (!formControl.parent) {
        return null;
      }

      let error = null;

      // validation logic for stream
      if (
        [
          "nameOfBank",
          "nameOfBranch",
          "bankAccountNumber",
          "ifscCode",
        ].includes(validationType) &&
        parentValue === 2
      ) {
        conditionStatus = true;
      }
      // validation logic for stream
      if (validationType === "otherBankName" && parentValue === 12) {
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
  setAnnextureData() {
    this.paymentProcessAnnextures =
      this.annextureResults?.data?.TEACHER_PAYMENT_PROCESS;
    const tempArr: any = [];
    for (const iterator in this.annextureResults?.data?.TEACHER_PAY_TYPE) {
      tempArr.push(this.annextureResults?.data?.TEACHER_PAY_TYPE[iterator]);
    }
    this.presentPayAnnextures = tempArr;
  }
  paymentProcessChangeHandler(value: any) {
    this.showBankFields = parseInt(value) === 2 ? true : false;
  }
  paymentProcessValidator() {
    this.notAppointedForm.get("paymentProcess").valueChanges.subscribe({
      next: (res: any) => {
        this.notAppointedForm.get("nameOfBank").updateValueAndValidity();
        this.notAppointedForm.get("nameOfBranch").updateValueAndValidity();
        this.notAppointedForm.get("bankAccountNumber").updateValueAndValidity();
        this.notAppointedForm.get("ifscCode").updateValueAndValidity();
      },
    });
  }

  validateForm() {
    let validationStatus = false;
    // validate form
    if (this.notAppointedForm?.invalid)
      validationStatus = this.customValidators.formValidationHandler(
        this.notAppointedForm,
        this.allLabel,
        this.elementRef
      );

    // custom validation
    if (
      validationStatus === false &&
      +this.notAppointedForm?.getRawValue()?.presentBasicPay >
        +this.notAppointedForm?.getRawValue()?.presentPay
    ) {
      this.alertHelper.viewAlert(
        "error",
        "Invalid",
        "Present basic pay should be less than present total pay."
      );
      return true; // false means validation failed
    }
    return validationStatus; // false means validation success
  }
  fillFieldsWithExistingData() {
    this.appointmentLetterNumber =
      this.existingSalaryInfo?.appointmentLetterNumber;
    this.pranGpf = this.existingSalaryInfo?.pranGpf;
    this.payMatrixLevel = this.existingSalaryInfo?.payMatrixLevel;
    this.presentPayScale = this.existingSalaryInfo?.presentPayScale;
    this.presentBasicPay = this.existingSalaryInfo?.presentBasicPay;
    this.presentGradePay = this.existingSalaryInfo?.presentGradePay;
    this.presentPay = this.existingSalaryInfo?.presentPay;
    this.paymentProcess = this.existingSalaryInfo?.paymentProcessType;
    this.nameOfBank = this.existingSalaryInfo?.nameOfBank;
    this.nameOfBranch = this.existingSalaryInfo?.nameOfBranch;
    this.bankAccountNumber = this.existingSalaryInfo?.bankAccountNumber;
    this.ifscCode = this.existingSalaryInfo?.ifscCode;

    this.paymentProcessChangeHandler(parseInt(this.paymentProcess));
    // if payment process is bank
    if (parseInt(this.paymentProcess) === 2) {
      this.nameOfBank = this.existingSalaryInfo?.["nameOfBank"];
      this.nameOfBranch = this.existingSalaryInfo?.["nameOfBranch"];
      this.otherBankName = this.existingSalaryInfo?.["otherBankName"];
      this.ifscCode = this.existingSalaryInfo?.["ifscCode"];
      this.bankAccountNumber = this.existingSalaryInfo?.["bankAccountNumber"];
    }

    this.formSetupHandler();
  }

  appointmentStatus(isAppointed: boolean) {
    this.isAppointed = isAppointed;
    if (this.isAppointed === false) {
      this.fillFieldsWithExistingData();
    }
  }
  enableDisableHelper(status: boolean) {
    if (status === true) {
      this.notAppointedForm?.enable();
    } else {
      this.notAppointedForm?.disable();
    }
  }
  onBankChange() {
    this.notAppointedForm.patchValue({
      otherBankName: "",
    });
  }
  ngAfterContentChecked() {
    this.changeDetectRef.detectChanges();
  }
}
