/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 25-05-2022
 * Description : User Login.
 **/

import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthenticationService } from "../core/services/authentication.service";
import { CustomValidators } from "../shared/validations/custom-validators";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { NgxSpinnerService } from "ngx-spinner";
import jwt_decode from "jwt-decode";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  @HostListener("document:keyup", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    +event?.which === 13 && this.signIn();
  }
  @ViewChild("userTypeRef") userTypeRef!: ElementRef;
  showPassword: boolean = false;
  showsign: boolean = true;
  showOtpone: boolean = true;
  public buttonName: any = "Show";
  timeLeft: number = 120;
  interval: any;
  loginForm!: FormGroup;
  userType: any = "";
  userId: any = "";
  captcha: any = "";
  captchaA: number = 0;
  captchaB: number = 0;
  allLabel: string[] = ["User type", "User id", "Password", "Captcha"];
  isOtpGenerated: boolean = false;
  signingIn: boolean = false;
  isReadOnly: boolean = false;
  otp: any = "";
  curObject = this;
  decodedToken!: any;
  customPlaceHolder: string = "User ID";
  password: any = "";

  // intervalSubscription: any;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private auth: AuthenticationService,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private elementRef: ElementRef
  ) {
    // clear storage
    this.clearStorage();
  }

  ngOnInit(): void {
    this.initializeForm(); //initialize form
    this.buildCaptcha(); // set captcha
    this.userTypeRef?.nativeElement.focus();
  }

  /**
   * Created By   : Sambit Kumar Dalai
   * Created On   : 25-05-2022
   * Description  : Build captcha
   **/
  buildCaptcha() {
    this.captchaA = Math.floor(Math.random() * 9 + 1); // generate random number (1-9)
    this.captchaB = Math.floor(Math.random() * 9 + 1); // generate random number (1-9)
  }

  /**
   * Created By   : Sambit Kumar Dalai
   * Created On   : 25-05-2022
   * Description  : initialize form
   **/
  initializeForm() {
    this.loginForm = this.formBuilder.group({
      userType: [this.userType, [Validators.required]],
      userId: [
        this.userId,
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9_\s]+$/),
          Validators.minLength(2),
          Validators.maxLength(15),
        ],
      ],
      password: [
        this.password,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
        ],
      ],
      captcha: [this.captcha, [Validators.required, Validators.minLength(1)]],
    });
  }

  /**
   * Created By   : Sambit Kumar Dalai
   * Created On   : 25-05-2022
   * Description  : Sigin in user
   **/
  signIn() {
    this.spinner.show();
    // if form valid and captch correct
    if (this.loginForm.valid && this.captchaValidationHandler()) {
      this.auth.login(this.loginForm.value).subscribe({
        next: (response: any) => {
          if (response.data > 0) {
            //reset password case
            this.spinner.hide();
            this.router.navigateByUrl("/resetPwd/" + response.encId);
          } else {
            // if login success set storage data and navigate to application page
            if (response.success) {
              this.decodedToken = jwt_decode(response.token);
              sessionStorage.setItem("jwtToken", response.token);
              sessionStorage.setItem("access_token", response.access_token);
              sessionStorage.setItem("refresh_token", response.refresh_token);
              sessionStorage.setItem("expires_in", response.expires_in);
              sessionStorage.setItem("userProfile", response.userProfile);
              sessionStorage.setItem("userMenus", response.userMenus);
              // // this.startRefreshInterval(allData);
              this.router.navigateByUrl("/Application");
            } else {
              this.alertHelper.viewAlert("error", "Invalid", response?.message);
            }
            this.spinner.hide();
          }
        },
      });
    } else {
      this.spinner.hide();
      // if form invalid
      this.customValidators.formValidationHandler(
        this.loginForm,
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

  /**
   * Created By   : Sambit Kumar Dalai
   * Created On   : 25-05-2022
   * Description  : captcha validation handler
   **/
  captchaValidationHandler(): boolean {
    if (
      this.captchaA * this.captchaB !==
      +this.loginForm.controls["captcha"].value
    ) {
      this.alertHelper.viewAlert("error", "Captcha", `Wrong answer`);
      return false;
    }
    return true;
  }

  /**
   * Created By   : Sambit Kumar Dalai
   * Created On   : 25-05-2022
   * Description  : user type wise place holer
   **/
  userTypeChangeHandler() {
    const userType: number = parseInt(this.loginForm?.getRawValue()?.userType);
    // 1) teacher
    if (userType === 1) this.customPlaceHolder = "Teacher Code / Login Code";
    // 2) school
    if (userType === 2) this.customPlaceHolder = "School UDISE Code";
    // 3) officials
    if (userType === 3) this.customPlaceHolder = "User ID";
  }

  /**
   * Created By   : Sambit Kumar Dalai
   * Created On   : 25-05-2022
   * Description  : show/hide password
   **/
  showPasword() {
    this.showPassword = !this.showPassword;
  }

  /**
   * Created By   : Sambit Kumar Dalai
   * Created On   : 25-05-2022
   * Description  : clear storage data
   **/
  clearStorage() {
    this.spinner.hide();
    sessionStorage.clear();
    localStorage.clear();
  }
}
