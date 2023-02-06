/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 15-06-2022
 * Description : Teacher salary info .
 **/

import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { RegistrationService } from "../../services/registration.service";
import { AppointedComponent } from "./appointed/appointed.component";
import { NotAppointedComponent } from "./not-appointed/not-appointed.component";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { ThisReceiver } from "@angular/compiler";
import { Subject } from "rxjs";

@Component({
  selector: "app-salary-info",
  templateUrl: "./salary-info.component.html",
  styleUrls: ["./salary-info.component.css"],
})
export class SalaryInfoComponent implements OnInit {
  @HostListener("document:keyup", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    +event?.which === 13 && this.formSubmit();
  }

  subject = new Subject();

  id: any = "";
  @ViewChild(AppointedComponent) appointedComponent!: AppointedComponent;
  @ViewChild(NotAppointedComponent)
  notAppointedComponent: NotAppointedComponent | any;
  isAppointed!: boolean;
  showComponents: boolean = false;
  disableFields: boolean = false;
  editStatus: boolean = true;
  annextureResults: any;
  teacherEncryptedId: string | null;
  existingSalaryInfo!: any;
  teacherInfo!: any;
  public userProfile = this.commonserviceService.getUserProfile();
  loginUserType = this.userProfile.loginUserTypeId;
  userDesignation = this.userProfile.designationId;
  schoolFillUpData: boolean = false;
  verificationStatus: any = "";
  changeReqStatus: any = "";
  constructor(
    private registrationService: RegistrationService,
    private commonserviceService: CommonserviceService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private alertHelper: AlertHelper,
    private router: Router
  ) {
    this.teacherEncryptedId = this.activatedRoute.snapshot.paramMap?.get("id");
  }

  ngOnInit(): void {
    this.spinner.show();
    this.id = this.activatedRoute.snapshot.params["id"];
    this.getAnnextureData();
    this.getTeacherRegistrationInfo(this.teacherEncryptedId);

    this.subject.subscribe((val) => {
      // get salary info after getting registration info to avoid date issue in child components
      this.getExistingSalaryInfo();
      this.subject.complete();
    });
  }
  getTeacherRegistrationInfo(encId: any) {
    this.spinner.show();
    this.registrationService.registrationInfo(encId).subscribe((res: any) => {
      this.subject.next("");
      this.teacherInfo = res?.data;
    });
  }
  getExistingSalaryInfo() {
    this.spinner.show();
    this.registrationService
      .getExistingSalaryInfo(this.teacherEncryptedId)
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          this.verificationStatus = res?.verificationStatus;
          this.changeReqStatus = res?.changeRequestStatus;
          if (res?.salaryStatus === 1) {
            this.schoolFillUpData = true;
            
          } else if ((res?.salaryStatus === 0) && this.loginUserType == 1) {
            this.schoolFillUpData = true;
           
          } else {
            this.verificationStatus = 0;
            if (this.loginUserType == 3) {
              this.schoolFillUpData = true;
            } else {
              this.schoolFillUpData = false;
            }
          }
          // 1) if data exists
          if (res?.success === true && res?.salaryInfo) {
            this.existingSalaryInfo = res?.salaryInfo;

            if (res?.salaryInfo?.appointmentType) {
              this.isAppointed = true;
              this.appointedStatus(true);
            } else {
              this.appointedStatus(false);
              this.isAppointed = false;
            }
          }
        },
        error: (err: any) => {
          this.spinner.hide();
        },
      });
  }

  appointedStatus(status: boolean) {
    this.showComponents = true;

    if (status === true) {
      this.isAppointed = true;
    } else {
      this.isAppointed = false;
    }
    if (this.existingSalaryInfo?.appointmentType == this.isAppointed)
      this.editStatus = true;
    // this.enableDisableHelper()
  }
  getAnnextureData() {
    this.commonserviceService
      .getCommonAnnexture([
        "TEACHER_PAY_TYPE",
        "TEACHER_PAYMENT_PROCESS",
        "BANK",
      ])
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          this.annextureResults = res;
        },
      });
  }
  formSubmit() {
    if (this.isAppointed === true) {
      const component = "appointedComponent";
      Promise.all([this.appointedComponent?.validateForm()]).then(
        (res: any) => {
          if (res[0] === false) {
            this.confirmFormSubmit();
          } else {
            this.spinner.hide();
          }
        }
      );
    } else {
      Promise.all([this.notAppointedComponent?.validateForm()]).then(
        (res: any) => {
          if (res[0] === false) {
            this.confirmFormSubmit();
          } else {
            this.spinner.hide();
          }
        }
      );
    }
  }
  confirmFormSubmit() {
    const alert =
      this.existingSalaryInfo != undefined
        ? this.alertHelper.updateAlert()
        : this.alertHelper.submitAlert();
    alert.then((result) => {
      if (result.value) {
        this.spinner.show();
        this.completeFormSubmition();
      }
    });
  }
  completeFormSubmition() {
    const userProfile = this.commonserviceService.getUserProfile();
    let formValues: any;
    if (this.isAppointed) {
      formValues = this.appointedComponent?.appointedForm.getRawValue();
    } else {
      formValues = this.notAppointedComponent?.notAppointedForm.getRawValue();
    }

    this.registrationService
      .saveSalaryInfo(
        this.teacherEncryptedId,
        formValues,
        this.isAppointed,
        userProfile?.userId
      )
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          if (res.status === "SUCCESS") {
            this.alertHelper
              .successAlert(
                "Saved!",
                `${
                  this.existingSalaryInfo != undefined
                    ? "Teacher salary info updated successfully."
                    : res?.msg
                }`,
                "success"
              )
              .then((res: any) => {
                this.router.navigate(["../../"], {
                  relativeTo: this.activatedRoute,
                });
              });
          } else {
            this.spinner.hide();
            this.alertHelper.viewAlert(
              "error",
              "Invalid",
              "Something went wrong."
            );
          }
        },
        error: (error: any) => {
          this.spinner.hide(); //==== hide spinner
        },
      });
  }
  resetForm() {
    this.appointedComponent?.ngOnInit();
    this.notAppointedComponent?.ngOnInit();
  }
  enableDisableHelper() {
    if (this.isAppointed) {
      this.appointedComponent?.enableDisableHelper(this.editStatus);
    } else {
      this.notAppointedComponent?.enableDisableHelper(this.editStatus);
    }
    this.editStatus = !this.editStatus;
  }
  ngOnDestroy() {
    this.subject.unsubscribe();
  }
}
