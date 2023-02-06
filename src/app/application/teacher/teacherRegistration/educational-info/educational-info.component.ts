/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 05-06-2022
 * Description : Teacher educational info.
 **/

import {
  Component,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { RegistrationService } from "../../services/registration.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { Subject } from "rxjs";
import { PreServiceComponent } from "./pre-service/pre-service.component";
import { InServiceComponent } from "./in-service/in-service.component";
import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";
import { HeaderComponent } from "../header/header.component";
@Component({
  selector: "app-educational-info",
  templateUrl: "./educational-info.component.html",
  styleUrls: ["./educational-info.component.css"],
})
export class EducationalInfoComponent implements OnInit {
  @HostListener("document:keyup", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    +event?.which === 13 && this.saveAsDraft();
  }

  @ViewChild(PreServiceComponent) preServiceComponent!: PreServiceComponent;
  @ViewChild(InServiceComponent) inServiceComponent!: InServiceComponent;
  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;
  public userProfile = JSON.parse(
    sessionStorage.getItem("userProfile") || "{}"
  );
  parentEventSubject: Subject<void> = new Subject<void>();
  preServiceValidationStart: Subject<void> = new Subject<void>(); // preService validation observer
  inServiceValidationStart: Subject<void> = new Subject<void>(); // inService validation observer

  teacherId: string | null;
  existingPreServiceData: any;
  existingInServiceData: any;
  allSrviceValidation: any = {
    preService: false,
    inService: false,
  };
  teacherDob: string = "";
  draftStatus: boolean = false; // true means submitted false means drafter
  isEditted: boolean = false;
  public userData = JSON.parse(
    sessionStorage.getItem("userProfile") || "{}"
  );
  loginUserType = this.userData.loginUserTypeId;
  userDesignation = this.userData.designationId;
  constructor(
    private registrationService: RegistrationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    public commonFunctionHelper: CommonFunctionHelper
  ) {
    // get teacher id
    this.teacherId = this.activatedRoute.snapshot.paramMap?.get("id");
    this.getEducationalQualificationType();
    this.getExistingEducationalInfo();
  }

  educationalQualificationTypes: Array<any> = [];
  preServiceForm: any;
  inServiceForm: any;
  ngOnInit(): void {
    this.spinner.show();
    this.getTeacherDetails();
  }
  getTeacherDetails() {
    this.registrationService.getTeacherDetails(this.teacherId).subscribe({
      next: (res: any) => {
        if (res.success === true) {
          this.draftStatus = res.draftSubmitted;
          this.headerComponent.disableNavHelper(res.draftSubmitted);
          this.teacherDob = res.data.dobYear;

          this.preServiceComponent.teacherDob = this.teacherDob;
          this.preServiceComponent.yearFieldSetup();

          this.inServiceComponent.teacherDob = this.teacherDob;
          this.inServiceComponent.yearFieldSetup();
        }
      },
      error: (err: any) => {
        this.spinner.hide();
      },
    });
  }
  getEducationalQualificationType() {
    this.registrationService.getEducationalQualificationType().subscribe({
      next: (res: any) => {
        if (
          res.success === true &&
          this.educationalQualificationTypes.length === 0
        )
          this.educationalQualificationTypes.push(res.data);
      },
      error: (err: any) => {
        this.spinner.hide();
      },
    });
  }
  preServiceFormDataHandle(eventData: any) {
    this.preServiceForm = eventData;
  }
  inServiceFormDataHandlee(eventData: any) {
    this.inServiceForm = eventData;
  }

  // ===== save as draft
  saveAsDraft() {
    if (
      (this.existingPreServiceData &&
        this.preServiceComponent.disableFields === false) ||
      (this.existingInServiceData &&
        this.inServiceComponent.disableFields === false)
    ) {
      this.preServiceValidationStart.next();
    } else {
      this.alertHelper.successAlert("No changes found.", " ", "info");
    }

    if (!this.existingPreServiceData && !this.existingPreServiceData) {
      this.preServiceValidationStart.next();
    }
  }

  // ======= get existing teacher educational ifo
  getExistingEducationalInfo() {
    this.registrationService
      .getExistingEducationalInfo(this.teacherId)
      .subscribe({
        next: (res: any) => {
          this.existingPreServiceData = res.preServiceEducationalIfo;
          this.existingInServiceData = res.inServiceEducationalIfo;
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        },
        error: (err: any) => {
          this.spinner.hide();
        },
      });
  }
  resetAll() {
    this.parentEventSubject.next();
  }
  preServiceValidationRes(validationRes: any) {
    let inServiceFormFilled: boolean = false;
    const inServiceObj =
      this.inServiceForm?.controls?.inServiceEducationalInfoArray?.controls[0]
        ?.value;
    /**
     * validationRes false means preService form is valid
     * so emit event to start inService form validation
     */

    // validationRes === false && this.inServiceValidationStart.next();
    if (validationRes === false) {
      for (const property in inServiceObj) {
        if (inServiceObj[property]) {
          inServiceFormFilled = true;
          break;
        }
      }
      if (inServiceFormFilled === true) {
        this.inServiceValidationStart.next();
      } else {
        this.completeSaveAsDraft(false);
      }
    }
  }
  inServiceValidationRes(validationRes: any) {
    /**
     * validationRes false means inService form is valid
     * so save as draft
     */
    validationRes === false && this.completeSaveAsDraft(true);
  }
  completeSaveAsDraft(inServiceFormFilled: boolean) {
    const duplicateError = this.checkDuplicateEducationType();

    if (
      typeof duplicateError === "object" &&
      duplicateError?.educationType === true
    ) {
      this.alertHelper.successAlert(
        "Invalid",
        "Duplicate education type found.",
        "error"
      );
    } else if (
      typeof duplicateError === "object" &&
      duplicateError?.yearOfPassing === true
    ) {
      this.alertHelper.successAlert(
        "Invalid",
        "Duplicate year of passing found.",
        "error"
      );
    } else {
      let arrCntrl = [];
      for (const key of Object.keys(this.preServiceForm.controls)) {
        if (this.preServiceForm.controls[key].touched === true) {
          arrCntrl.push(key);
        }
      }
  
      // this.existingPreServiceData,this.existingInServiceData

      const alert =
        this.existingPreServiceData?.length ||
        this.existingInServiceData?.length
          ? this.alertHelper.updateAlert()
          : this.alertHelper.submitAlert();
      alert.then((result: any) => {
        if (result.value) {
          this.spinner.show();
          this.registrationService
            .saveEducationalInfAsDraft(
              this.teacherId,
              inServiceFormFilled,
              this.preServiceForm?.getRawValue(),
              this.inServiceForm?.getRawValue()
            )
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();

                if (res.status === "SUCCESS") {
                  this.alertHelper
                    .successAlert("Saved!", res?.msg, "success")
                    .then((res: any) => {
                      this.spinner.show();
                      this.preServiceComponent?.initializeForm();
                      this.inServiceComponent?.initialFormSetup();
                      this.getExistingEducationalInfo();
                    });
                } else {
                  this.alertHelper.viewAlert("error", "Invalid", res?.msg);
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
  }
  pageChangeWarningHandler(path: string) {
    console.log(1);
    
    let preServiceFormFilled: boolean = false;
    let inServiceFormFilled: boolean = false;

    //  1) preService form filled check
    const preServiceObj =
      this.preServiceForm?.controls?.preServiceEducationalInfoArray?.controls[0]
        ?.value;

    for (const property in preServiceObj) {
      if (preServiceObj[property]) {
        preServiceFormFilled = true;
        break;
      }
    }

    // 2) inservice form filled check
    const inServiceObj =
      this.inServiceForm?.controls?.inServiceEducationalInfoArray?.controls[0]
        ?.value;
    for (const property in inServiceObj) {
      if (inServiceObj[property]) {
        inServiceFormFilled = true;
        break;
      }
    }
    const conditionArr = [
      [preServiceFormFilled, inServiceFormFilled].includes(true) ,
      !this.existingPreServiceData?.length &&
        [preServiceFormFilled, inServiceFormFilled].includes(true),
    ]; // &&  this.isEditted will be add in preServiceFormFilled when needed
   

    if (conditionArr.includes(true)) {
      this.commonFunctionHelper.pageChangeWarningHandler(
        path,
        this.teacherId,
        this.activatedRoute
      );
    } else {
      this.router.navigate([path, this.teacherId], {
        relativeTo: this.activatedRoute,
      });
    }
  }
  getEditStatus(eventData: any) {
    if (eventData?.preService === true || eventData?.inService === true) {
      this.isEditted = true;
    } else {
      this.isEditted = false;
    }
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
    this.inServiceForm?.controls?.inServiceEducationalInfoArray?.value.map(
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
}
