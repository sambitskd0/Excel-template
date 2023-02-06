/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 15-06-2022
 * Description : Teacher salary info (appointed).
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

@Component({
  selector: "app-appointed",
  templateUrl: "./appointed.component.html",
  styleUrls: ["./appointed.component.css"],
})
export class AppointedComponent implements OnInit {
  @Input() annextureResults!: any;
  @Input() existingSalaryInfo!: any;
  @Input() teacherInfo!: any;

  appointedForm!: any;
  initialSalary!: number;
  presentBasicSalary!: number;
  appointmentLetterNumber!: string;
  dateOfPresentPostingJoining: any = "";
  paymentProcess: string = "";
  nameOfBank: string = "";
  otherBankName: string = "";
  nameOfBranch!: string;
  bankAccountNumber!: number;
  ifscCode!: string;
  pranGpf!: number;
  paymentProcessAnnextures: any;
  showBankFields: boolean = false;
  model!: any;
  isAppointed: boolean = true;
  maxDate: any = Date;
  allLabel: string[] = [
    "Initial salary",
    "Present basic salary",
    "Appointment letter number",
    "Pran / gpf / uan",
    "Payment process",
    "Name of bank",
    "Other bank name",
    "Name of branch",
    "Bank account number",
    "Ifsc code",
  ];
  constructor(
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private elementRef: ElementRef,
    private changeDetectRef: ChangeDetectorRef
  ) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.formSetupHandler();
    this.setAnnextureData();
  }
  formSetupHandler() {
    this.initializeForm();
    this.paymentProcessValidator();
    if (
      this.existingSalaryInfo !== undefined &&
      this.existingSalaryInfo?.appointmentType == 1
    )
      this.enableDisableHelper(false);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (
      parseInt(changes["existingSalaryInfo"]?.currentValue?.appointmentType) ===
      1
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
  initializeForm() {
    this.appointedForm = this.formBuilder.group({
      initialSalary: [
        this.initialSalary,
        [
          Validators.required,
          Validators.maxLength(8),
          Validators.pattern(/^[0-9]+$/),
          this.customValidators.firstCharValidatorRF,
        ],
      ],
      presentBasicSalary: [
        this.presentBasicSalary,
        [
          Validators.required,
          Validators.maxLength(8),
          Validators.pattern(/^[0-9]+$/),
          this.customValidators.firstCharValidatorRF,
        ],
      ],
      appointmentLetterNumber: [
        this.appointmentLetterNumber,
        [
          Validators.required,
          Validators.maxLength(32),
          Validators.pattern(/^[A-Za-z0-9 _./-]+$/),
          this.customValidators.firstCharValidatorRF,
        ],
      ],

      pranGpf: [
        this.pranGpf,
        [
          Validators.required,
          Validators.maxLength(12),
          Validators.pattern(/^[A-Za-z0-9_.]+$/),
          this.customValidators.firstCharValidatorRF,
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
            () => this.appointedForm?.get("paymentProcess")?.value,
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
            () => this.appointedForm?.get("nameOfBank")?.value,
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
          Validators.pattern(/^[a-zA-Z ]*$/),
          this.customValidators.firstCharValidatorRF,
          this.conditionalValidator(
            () => this.appointedForm?.get("paymentProcess")?.value,
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
            () => this.appointedForm?.get("paymentProcess")?.value,
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
            () => this.appointedForm?.get("paymentProcess")?.value,
            Validators.required,
            "conditionalValidation",
            "ifscCode"
          ),
        ],
      ],
      dateOfPresentPostingJoining: [
        this.dateOfPresentPostingJoining,
        [Validators.required],
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
    // remove treasure from payment process
    this.paymentProcessAnnextures =
      this.annextureResults?.data?.TEACHER_PAYMENT_PROCESS.filter(
        (item: any) => item.anxtValue != 3
      );
  }

  paymentProcessChangeHandler(value: number) {
    this.showBankFields = value === 2;
  }
  paymentProcessValidator() {
    this.appointedForm.get("paymentProcess").valueChanges.subscribe({
      next: (res: any) => {
        this.appointedForm.get("nameOfBank").updateValueAndValidity();
        this.appointedForm.get("nameOfBranch").updateValueAndValidity();
        this.appointedForm.get("bankAccountNumber").updateValueAndValidity();
        this.appointedForm.get("ifscCode").updateValueAndValidity();
      },
    });
  }
  validateForm() {
    const validationStatus = this.customValidators.formValidationHandler(
      this.appointedForm,
      this.allLabel,
      this.elementRef
    );
    return validationStatus;
  }
  fillFieldsWithExistingData() {
    this.initialSalary = this.existingSalaryInfo?.["initialSalary"];
    this.presentBasicSalary = this.existingSalaryInfo?.["presentBasicSalary"];
    this.appointmentLetterNumber =
      this.existingSalaryInfo?.["appointmentLetterNumber"];

    this.pranGpf = this.existingSalaryInfo?.["pranGpf"];
    this.paymentProcess = this.existingSalaryInfo?.["paymentProcessType"];

    this.paymentProcessChangeHandler(+this.paymentProcess);
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
  }
  enableDisableHelper(status: boolean) {
    if (status === true) {
      this.appointedForm?.enable();
    } else {
      this.appointedForm?.disable();
    }
  }
  // Get Other Bank Details when bankid = 12 for other Bank
  onBankChange() {
    this.appointedForm.patchValue({
      otherBankName: "",
    });
  }
  ngAfterContentChecked() {
    this.changeDetectRef.detectChanges();
  }
}
