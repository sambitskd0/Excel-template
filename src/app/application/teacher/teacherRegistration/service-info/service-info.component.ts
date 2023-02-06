/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 20-06-2022
 * Description : Teacher service info.
 **/

import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { NgxSpinnerService } from "ngx-spinner";
import { RegistrationService } from "../../services/registration.service";
import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { formatDate } from "@angular/common";
import { Observable } from "rxjs";

@Component({
  selector: "app-service-info",
  templateUrl: "./service-info.component.html",
  styleUrls: ["./service-info.component.css"],
})
export class ServiceInfoComponent implements OnInit {
  @HostListener("document:keyup", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    +event?.which === 13 && this.submitForm();
  }
  serviceInfoForm!: any;
  teacherEncryptedId!: string | null;
  singleField: boolean = true; // single row will not have action column
  nameOfSchool!: string;
  designation!: string;
  fromServicePeriod!: string;
  toServicePeriod!: string;
  subjectsTaught!: string;
  disableFields: boolean = false;
  existingServiceInfo!: any;
  isEditted: boolean = false;
  serviceLabel: string[] = this.getCustomizedLabelName("");
  teacherInfo!: any;
  public userProfile = JSON.parse(
    sessionStorage.getItem("userProfile") || "{}"
  );
  loginUserType = this.userProfile.loginUserTypeId;
  schoolFillUpData: boolean = false;
  id: any = "";
  maxDate: any = Date;
  minDate: any = Date;
  frmDate: any = [];
  toDate: any = [];
  @ViewChild("schoolName") schoolName!: ElementRef;
  verificationStatus:any="";
  verificationSts:any="";
  changeReqStatus:any="";
  constructor(
    private activatedRoute: ActivatedRoute,
    private registrationService: RegistrationService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    public commonFunctionHelper: CommonFunctionHelper,
    private commonserviceService: CommonserviceService,
    private route: Router,
    private router: ActivatedRoute
  ) {
    this.teacherEncryptedId = this.activatedRoute.snapshot.paramMap?.get("id");
    this.maxDate = new Date();
    this.minDate = new Date();
  }

  ngOnInit(): void {
    this.spinner.show();
    this.id = this.router.snapshot.params["id"];
    this.initializeForm(); // initialize form
    this.getExistingServiceInfo();
    this.getTeacherRegistrationInfo(this.teacherEncryptedId);
    this.onChangeOfDates();
    this.schoolName?.nativeElement.focus();
  }

  onChangeOfDates() {
    // this.dobSubscription = this.teacherForm
    //   ?.get("DOB")
    //   ?.valueChanges.subscribe((value: any) => {
    //     this.teacherAgeCalculate(
    //       value,
    //       this.teacherForm.getRawValue()?.serviceJoiningDt
    //     );
    //   });
    // this.serviceJoining = this.teacherForm
    //   ?.get("serviceJoiningDt")
    //   ?.valueChanges.subscribe((value: any) => {
    //     this.teacherAgeCalculate(this.teacherForm.getRawValue()?.DOB, value);
    //   });
  }
  // ==== setup reactive form
  initialFormSetup() {
    if (!this.serviceInfo()?.length) {
      this.addRow(); // add row at first
    }
  }
  getTeacherRegistrationInfo(encId: any) {
    this.registrationService.registrationInfo(encId).subscribe((res: any) => {
      this.teacherInfo = res?.data;
      this.minDate = new Date(this.teacherInfo?.serviceJoiningDt?.toString());
    });
    
  }
  // ======  initialize preServiceForm
  initializeForm() {
    this.serviceInfoForm = this.formBuilder.group({
      serviceInfoArray: this.formBuilder.array([]), // store all data in this array
    });
  }
  // show number of row according to serviceInfoArray items
  serviceInfo(): FormArray {
    return this.serviceInfoForm.get("serviceInfoArray") as FormArray;
  }
  // add row
  addRow() {
    this.schoolName?.nativeElement.focus();
    let emptyRow: Boolean = false;
    this.serviceInfo()?.controls?.map((item: any, index: number) => {
      if (emptyRow === true) return;
      if (item?.invalid) {
        this.alertHelper.successAlert(
          "Invalid",
          "Empty/invalid service found !!!",
          "error"
        );
        emptyRow = true;
      }
    });
    if (emptyRow === false) {
      this.serviceInfo().push(this.newEducation());
    }
    this.checkSingleField();
  }
  checkSingleField() {
    this.singleField = this.serviceInfo()?.length > 1 ? false : true;
  }
  // new row form data
  newEducation(): FormGroup {
    return this.formBuilder.group({
      nameOfSchool: [
        this.nameOfSchool,
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-Z0-9 ,.()'\-\s]+$/),
          this.customValidators.firstCharValidatorRF,
        ],
      ],
      designation: [
        this.designation,
        [Validators.required,this.customValidators.firstCharValidatorRF, Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/)],
      ],
      fromServicePeriod: [this.fromServicePeriod, [Validators.required]],
      toServicePeriod: [this.toServicePeriod,],
      subjectsTaught: [
        this.subjectsTaught,
        [Validators.required,this.customValidators.firstCharValidatorRF, Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/)],
      ],
    });
  }
  // remove row
  removeRow(index: any) {
    this.serviceInfo().length > 1 && this.serviceInfo().removeAt(index);
    this.checkSingleField();
  }
  enableFields() {
    this.isEditted = this.disableFields;
    this.disableFields = !this.disableFields;
    this.initializeForm(); // initialize form
    this.fillFieldsWithExistingData();
  }
  resetServiceForm() {
    this.initializeForm(); // initialize form
    this.initialFormSetup();
    this.disableFields = false;
  }
  // ====== get customized label names
  getCustomizedLabelName(serviceTypeName: string) {
    return [
      `Name of the school`,
      `${serviceTypeName} :- Designation`,
      `${serviceTypeName} :- From service period`,
      `${serviceTypeName} :- To service period`,
      `${serviceTypeName} :- Subject(s) taught`,
    ];
  }
  // ======= get existing teacher educational ifo
  getExistingServiceInfo() {
    this.registrationService
      .getExistingServiceInfo(this.teacherEncryptedId)
      .subscribe({
        next: (res: any) => {
         
          if (res?.serviceStatus === 1) {
            this.verificationStatus = res?.serviceInfo?.verificationStatus;
            this.verificationSts = res?.verificationStatus;         
            this.changeReqStatus = res?.changeRequestStatus; 
            this.schoolFillUpData = true;
          } else if(res?.serviceStatus === 0 && this.loginUserType == 1){
            this.schoolFillUpData = true;
          }else {
            this.verificationStatus = 0;
            if (this.loginUserType == 3) {
              this.schoolFillUpData = true;
            } else {
              this.schoolFillUpData = false;
            }
          }
          if (res?.serviceInfo?.length) {
            this.existingServiceInfo = res.serviceInfo;
            this.disableFields = true;
            this.fillFieldsWithExistingData();
          } else {
            this.initialFormSetup();
            this.spinner.hide();
          }
        },
        error: (err: any) => {
          this.spinner.hide();
        },
      });
  }

  fillFieldsWithExistingData() {
    this.existingServiceInfo.map((item: any) => {
      this.serviceInfo().push(
        this.formBuilder.group({
          nameOfSchool: [
            {
              value: item.schoolName,
              disabled: this.disableFields,
            },
            [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/)],
          ],
          designation: [
            {
              value: item.designation,
              disabled: this.disableFields,
            },
            [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/)],
          ],
          fromServicePeriod: [
            {
              value: new Date(item.fromServiceDate.toString()),
              disabled: this.disableFields,
            },
            [Validators.required],
          ],
          toServicePeriod: [
            {
              value: (item.toServiceDate) ? new Date(item.toServiceDate.toString()):'',
              disabled: this.disableFields,
            },
          ],
          subjectsTaught: [
            {
              value: item.subjectsTaught,
              disabled: this.disableFields,
            },
            [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/)],
          ],
        })
      );
    });
    this.spinner.hide();
    this.checkSingleField();
  }
  submitForm() {
    const afterFormValidObserver = new Observable((observer) => {
      observer.next(this.validateServiceDates());
    });
    afterFormValidObserver.subscribe({
      next: (isValid: any) => {
        isValid === true && this.validateServiceForm();
      },
    });
  }
  validateServiceForm() {
    Promise.all([this.validateServiceFormData()]).then((value) => {
      const formErrors = value[0];
      let formInvalid: any = false;
      formErrors.map((item: any) => {
        if (item !== false) {
          formInvalid = true;
        }
      });
      formInvalid === false && this.completeFormSubmition();
    });
  }
  validateServiceFormData(): any {
    let allErrors: any = [];
    this.serviceInfoForm?.controls?.serviceInfoArray?.controls?.some(
      (serviceInfoGroup: FormGroup, index: number): any => {
        this.serviceLabel = this.getCustomizedLabelName(
          serviceInfoGroup?.value?.nameOfSchool
        );
        let errors = this.customValidators.formValidationHandler(
          serviceInfoGroup,
          this.serviceLabel
        );
        allErrors.push(errors);
        if (errors?.length) {
          return true;
        }
      }
    );
    return allErrors;
  }
  validateServiceDates(): boolean {
    const dob = new Date(this.teacherInfo?.DOB);
    const year = new Date(dob).getFullYear();
    const month = new Date(dob).getMonth();
    const day = new Date(dob).getDate();
    let validDate = formatDate(
      new Date(year + 18, month, day),
      "yyyy-MM-dd",
      "en_US"
    );
    let isServiceDatesValid: boolean = true;
    const formValueObj = this.serviceInfoForm?.getRawValue()?.serviceInfoArray;
    formValueObj?.forEach((item: any, index: number, arr: any): any => {
      // from service period of current service must be greater than to service of previous
      // console.log(item?.fromServicePeriod,item?.toServicePeriod);
      if(item?.fromServicePeriod != null && item?.toServicePeriod != null){
        if (item?.fromServicePeriod && item?.toServicePeriod) {
          // 1) fromServicePeriod should be less than toServicePeriod
          if (item?.fromServicePeriod > item?.toServicePeriod) {
            this.alertHelper.viewAlert(
              "error",
              "Invalid",
              `${item?.nameOfSchool} :- From service period must be less than To service period.`
            );
            isServiceDatesValid = false;
          }

          // 2) must be greater than DOB + 18 year
          if (item?.fromServicePeriod < validDate) {
            this.alertHelper.viewAlert(
              "error",
              "Invalid",
              `${item?.nameOfSchool} :- From service period must be above 18 years.`
            );
            isServiceDatesValid = false;
          }
          if (item?.toServicePeriod < validDate) {
            this.alertHelper.viewAlert(
              "error",
              "Invalid",
              `${item?.nameOfSchool} :- To service period must be above 18 years.`
            );
            isServiceDatesValid = false;
          } //end
          // 3) check next school fromService must be greater than toService
          if (
            index > 0 &&
            item?.fromServicePeriod <= arr[index - 1]?.toServicePeriod
          ) {
            this.alertHelper.viewAlert(
              "error",
              "Invalid",
              `  From service period of ${
                item?.nameOfSchool
              } must be greater than To service period of ${
                arr[index - 1]?.nameOfSchool
              }.`
            );
            isServiceDatesValid = false;
          }
        }
      }
    });
    return isServiceDatesValid;
  }
  getFormValue(serviceInfoArray: any) {
    let arr: any = [];
    serviceInfoArray.map((item: any, index: number) => {
      console.log(item);
      
      arr.push({
        ...serviceInfoArray[index],
        fromServicePeriod: this.commonFunctionHelper.formatDateHelper(
          item?.fromServicePeriod
        ),
        // toServicePeriod: this.commonFunctionHelper.formatDateHelper(
        //   item?.toServicePeriod
        // ),
        //  toServicePeriod: (this.commonFunctionHelper.formatDateHelper(item?.toServicePeriod))?
        //  (this.commonFunctionHelper.formatDateHelper(item?.toServicePeriod)):'',
      
        //  toServicePeriod: (this.commonFunctionHelper.formatDateHelper(item?.toServicePeriod) == '')?
        //  null:(this.commonFunctionHelper.formatDateHelper(item?.toServicePeriod)),
         toServicePeriod: (item?.toServicePeriod != null)?
         (this.commonFunctionHelper.formatDateHelper(item?.toServicePeriod)):null,
      });
    });
    return arr;
  }
  completeFormSubmition() {
    const userProfile = this.commonserviceService.getUserProfile();
    const allValue = this.serviceInfoForm?.getRawValue();
    const alert =
      this.existingServiceInfo && this.existingServiceInfo?.length
        ? this.alertHelper.updateAlert()
        : this.alertHelper.submitAlert();

    alert.then((result) => {
      if (result.value) {
        this.spinner.show();
        this.registrationService
          .saveServiceInfo({
            teacherEncryptedId: this.teacherEncryptedId,
            serviceInfo: this.getFormValue(
              this.serviceInfoForm?.getRawValue()?.serviceInfoArray
            ),
            userId: userProfile?.userId,
          })
          .subscribe({
            next: (res: any) => {
              this.spinner.hide();

              if (res.status === "SUCCESS") {
                this.alertHelper
                  .successAlert(
                    "Saved!",

                    `${
                      this.existingServiceInfo &&
                      this.existingServiceInfo?.length
                        ? "Teacher service info updated successfully."
                        : res?.msg
                    }`,

                    "success"
                  )
                  .then((res: any) => {
                    // this.ngOnInit();
                    this.spinner.show();
                    this.initializeForm();
                    this.getExistingServiceInfo();
                  });
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
  dateValidator(
    fromServicePeriod: string | any,
    toServicePeriod: string | any
  ): boolean {
    let isServiceDatesInvalid: boolean = false;
    const dob = new Date(this.teacherInfo?.DOB);
    const year = new Date(dob).getFullYear();
    const month = new Date(dob).getMonth();
    const day = new Date(dob).getDate();
    let validDate = formatDate(
      new Date(year + 18, month, day),
      "yyyy-MM-dd",
      "en_US"
    );
    if (fromServicePeriod != null && toServicePeriod != null) {
      // 1) fromServicePeriod should be less than toServicePeriod
      if (fromServicePeriod > toServicePeriod) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "From service period must be less than To service period."
        );
        return false;
      }
      // 2) must be greater than DOB + 18 year
      if (fromServicePeriod < validDate) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "From service period must be above 18 years."
        );
        return false;
      }
      if (toServicePeriod < validDate) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "To service period must be above 18 years."
        );
        return false;
      }
    }
    return true;
  }
}
