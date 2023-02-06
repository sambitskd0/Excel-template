import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";
 
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { Observable } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from "src/environments/environment";
import { ErrorHandler } from "src/app/core/helpers/error-handler";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageUserService } from '../user/services/manage-user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changepwdForm!: FormGroup;
  allLabel: string[] = ["Current Password","New Password", "Confirm New Password"];
  userPass : string = '';
  userConfPass : string = '';
  currPass : string = '';

  constructor(
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private auth: AuthenticationService,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private errorHandler: ErrorHandler,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ManageUserService: ManageUserService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }
  initializeForm() {
    this.changepwdForm = this.formBuilder.group({
      currPass: [this.currPass, [Validators.required]],
      userPass: [this.userPass, [Validators.required]],
      userConfPass: [this.userConfPass, [Validators.required]],
});
  }
  resetPwd(){
    const afterFormValidObserver = new Observable((observer) => {
      observer.next(
        this.customValidators.formValidationHandler(
          this.changepwdForm,
          this.allLabel
        ) 
      );
    });
    if(this.changepwdForm.controls["currPass"]?.value !='' && this.changepwdForm.controls["userPass"]?.value !=''){
      if(this.changepwdForm.controls["currPass"]?.value == this.changepwdForm.controls["userPass"]?.value) {
        this.alertHelper.viewAlert("error", "", "Current Password and New Password should Not Be same");
        return;
      } 
    }
    if(this.changepwdForm.controls["userPass"]?.value != this.changepwdForm.controls["userConfPass"]?.value) {
      this.alertHelper.viewAlert("error", "", "Password and Confirm Password should match");
      return;
    }
   
    
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
  validPassword(userPass:any,txtLbl:any)
  {
    var userPas=userPass.value;
    var pattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    
   if (userPas !='')
    {
        if (pattern.test(userPas))
            return true;
        else {          
          this.alertHelper.viewAlert("error", "", txtLbl + "  should be alphanumeric and consist of at least one upper case letter, special character and should be 8-15 characters long");
          return false;
        }
    } else
        return true;
}
  resetPassword() {
    this.ManageUserService.changePassword(this.changepwdForm.value).subscribe({
      next: (fpResponse: any) => {
        if (fpResponse.success == true) {
          if(fpResponse.data > 0){
            this.alertHelper
            .successAlert(
              "Saved!",
              fpResponse.msg,
              "success"
            )
            this.router.navigateByUrl("/Application/dashboardlanding");
          }else{
            this.alertHelper
            .successAlert(
              "Error!",
              fpResponse.msg,
              "error"
            )
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
