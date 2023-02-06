import { Component, ElementRef, OnInit } from "@angular/core";

import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";

import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { Observable } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from "src/environments/environment";
import { ErrorHandler } from "src/app/core/helpers/error-handler";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { AuthenticationService } from "src/app/core/services/authentication.service";

@Component({
  selector: "app-forgotpassword",
  templateUrl: "./forgotpassword.component.html",
  styleUrls: ["./forgotpassword.component.css"],
})
export class ForgotpasswordComponent implements OnInit {
  userId: string = "";
  // userType : number = 0;
  userType: any = "";
  forgotpwdForm!: FormGroup;
  captcha: any = "";
  captchaA: number = 0;
  captchaB: number = 0;
  allLabel: string[] = ["User type", "User ID", "Captcha"];
  customPlaceHolder: string = "User ID";

  constructor(
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private auth: AuthenticationService,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private errorHandler: ErrorHandler,
    private router: Router,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.buildCaptcha();
  }

  initializeForm() {
    this.forgotpwdForm = this.formBuilder.group({
      userType: [this.userType, [Validators.required]],
      userId: [
        this.userId,
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9._-\s]+$/),
          Validators.minLength(2),
          Validators.maxLength(32),
        ],
      ],
      captcha: [this.captcha, [Validators.required, Validators.minLength(1)]],
    });
  }
  /**
   * Created By   : Nitish Nanda
   * Created On   : 26-09-2022
   * Description  : Build captcha
   **/
  buildCaptcha() {
    this.captchaA = Math.floor(Math.random() * 9 + 1); // generate random number (1-9)
    this.captchaB = Math.floor(Math.random() * 9 + 1); // generate random number (1-9)
  }
  /**
   * Created By   : Nitish Nanda
   * Created On   : 26-09-2022
   * Description  : captcha validation handler
   **/
  captchaValidationHandler(): boolean {
    if (
      this.captchaA * this.captchaB !==
      +this.forgotpwdForm.controls["captcha"].value
    ) {
      this.alertHelper.viewAlert("error", "Captcha", `Wrong answer`);
      return false;
    }
    return true;
  }

  sendPwd() {
    if (this.forgotpwdForm.valid && this.captchaValidationHandler()) {
      this.sendEmailTempPwd();
    } else {
      this.customValidators.formValidationHandler(
        this.forgotpwdForm,
        this.allLabel,
        this.elementRef,
        {
          required: {
            userType:
              "You have not selected any user type. Please select the appropriate User Type.",
            userId: `Please enter your ${this.customPlaceHolder}.`,
          },
        }
      );
    }
  }

  sendEmailTempPwd() {
    this.auth
      .sendPwd(
        this.forgotpwdForm.value,
        this.forgotpwdForm.controls["userType"]?.value
      )
      .subscribe({
        next: (fpResponse: any) => {
          //console.log(fpResponse.statusCode);
          if (fpResponse.success == true) {
            if (fpResponse.statusCode == 200) {
              this.alertHelper.successAlert(
                "Verified!",
                "OTP has been sent to the registered email & mobile, Please login through it and reset your password.",
                "success"
              );
              this.spinner.hide();
              this.router.navigateByUrl("/login");
            } else {
              this.alertHelper.successAlert("Error!", fpResponse.msg, "error");
              this.spinner.hide();
            }
          } else {
            this.alertHelper.viewAlert("error", "", fpResponse.msg);
            this.spinner.hide();
          }
        },
        error: (err: any) => {
          //console.log('sssss'+err);
          this.errorHandler.serverSideErrorHandler(err); // server side error handler
          this.spinner.hide();
        },
      });
  }

  userTypeChangeHandler() {
    const userType: number = parseInt(
      this.forgotpwdForm?.getRawValue()?.userType
    );
    // 1) teacher
    if (userType === 1) this.customPlaceHolder = "Teacher Code / Login Code";
    // 2) school
    if (userType === 2) this.customPlaceHolder = "School UDISE Code";
    // 3) officials
    if (userType === 3) this.customPlaceHolder = "User ID";
  }
}
