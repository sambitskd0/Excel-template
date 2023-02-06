import { Component, OnInit } from "@angular/core";

import {
	FormBuilder,
	FormGroup,
	ValidatorFn,
	Validators,
} from "@angular/forms";

import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { Observable } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from "src/environments/environment";
import { ErrorHandler } from "src/app/core/helpers/error-handler";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "src/app/core/services/authentication.service";
import { CustomValidators } from "src/app/shared/validations/custom-validators";

@Component({
	selector: "app-resetpassword",
	templateUrl: "./resetpassword.component.html",
	styleUrls: ["./resetpassword.component.css"],
})
export class ResetpasswordComponent implements OnInit {
	encId: string | null = "";
	showPassword: boolean = false;
	showPassword1: boolean = false;
	resetpwdForm!: FormGroup;
	captchaA: number = 0;
	captchaB: number = 0;
	captcha: any = "";
	allLabel: string[] = ["Password", "Confirm Password", "Captcha"];
	userPass: string = "";
	userConfPass: string = "";

	constructor(
		private formBuilder: FormBuilder,
		public customValidators: CustomValidators,
		private auth: AuthenticationService,
		private alertHelper: AlertHelper,
		private spinner: NgxSpinnerService,
		private errorHandler: ErrorHandler,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.encId = this.activatedRoute.snapshot.paramMap?.get("id");
		//console.log(this.encId);
		this.buildCaptcha();
		this.initializeForm();
	}

	initializeForm() {
		this.resetpwdForm = this.formBuilder.group({
			userPass: [this.userPass, [Validators.required]],
			userConfPass: [this.userConfPass, [Validators.required]],
			captcha: [this.captcha, [Validators.required, Validators.minLength(1)]],
		});
	}
	showPasword() {
		this.showPassword = !this.showPassword;
	}
	showPasword1() {
		this.showPassword1 = !this.showPassword1;
	}
	validPassword(userPass: any, txtLbl: any) {
		var userPas = userPass.value;
		var pattern = new RegExp(
			"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
		);

		if (userPas != "") {
			if (pattern.test(userPas)) return true;
			else {				
				this.alertHelper.viewAlert("error", "", txtLbl + "  should be alphanumeric and consist of at least one upper case letter, special character and should be 8-15 characters long");
				return false;
			}
		} else return true;
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
			+this.resetpwdForm.controls["captcha"].value
		) {
			this.alertHelper.viewAlert("error", "Captcha", `Wrong answer`);
			return false;
		}
		return true;
	}

	resetPwd() {
		const afterFormValidObserver = new Observable((observer) => {
			observer.next(
				this.customValidators.formValidationHandler(
					this.resetpwdForm,
					this.allLabel
				)
			);
		});

		if (
			this.resetpwdForm.controls["userPass"]?.value !=
			this.resetpwdForm.controls["userConfPass"]?.value
		) {
			this.alertHelper.viewAlert("error", "", "Password and Confirm Password should match");
			return;
		}
		if (this.captchaValidationHandler()) {
			afterFormValidObserver.subscribe({
				next: (res: any) => {
					this.spinner.show();
					if (res === false) {
						this.resetPassword();
					} else {
						this.spinner.hide();
					}
				},
			});
		}
	}

	resetPassword() {
		this.auth.resetPassword(this.resetpwdForm.value, this.encId).subscribe({
			next: (fpResponse: any) => {
				if (fpResponse.success == true) {
					if (fpResponse.data > 0) {
						this.alertHelper.successAlert("Saved!", fpResponse.msg, "success");
						this.router.navigateByUrl("/login");
					} else {
						this.alertHelper.successAlert("Error!", fpResponse.msg, "error");
						this.router.navigateByUrl("/login");
					}
				} else {
					this.alertHelper.viewAlert("error", "", "Invalid Userid");
				}
				this.spinner.hide();
			},
			error: (err: any) => {
				this.errorHandler.serverSideErrorHandler(err); // server side error handler
				this.spinner.hide();
			},
		});
	}
}
