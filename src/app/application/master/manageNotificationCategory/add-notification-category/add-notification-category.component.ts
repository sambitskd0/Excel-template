import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageNotificationCategoryService } from '../../services/manage-notification-category.service';

@Component({
  selector: 'app-add-notification-category',
  templateUrl: './add-notification-category.component.html',
  styleUrls: ['./add-notification-category.component.css']
})
export class AddNotificationCategoryComponent implements OnInit {

  addNotificationCategoryForm!: FormGroup;
  allErrorMessages: string[] = [];
  allLabel: string[] = ["","","Category name"];
  notifyCatName: any = "";
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  userId: any;
  profileId: any;
  adminPrivilege: boolean = false;
  constructor(
    private el:ElementRef,
    private formBuilder:FormBuilder,
    private alertHelper:AlertHelper,
    public customValidator:CustomValidators,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    public manageNotificationCategoryService:ManageNotificationCategoryService,
    private spinner: NgxSpinnerService, 
    public commonService:CommonserviceService,
  ) { 
    const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For authorization
  }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.el.nativeElement.querySelector("[formControlName=notifyCatName]").focus();
    this.initializeForm();
  }
  initializeForm(){
    this.addNotificationCategoryForm = this.formBuilder.group({
      userId:[this.userId],
      profileId:[this.profileId],
      notifyCatName: [
        this.notifyCatName,
        [Validators.required, Validators.maxLength(50),Validators.minLength(2),Validators.pattern(/^[a-zA-Z ]+$/),this.customValidator.firstCharValidatorRF],
      ]
    })
  }
  get notificationCategoryFormControl() {
    return this.addNotificationCategoryForm.controls;
  }
  
  onSubmit() {
    
    // if ("INVALID" === this.addNotificationCategoryForm.status) {
    //   for (const key of Object.keys(this.addNotificationCategoryForm.controls)) {
    //     if (this.addNotificationCategoryForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidator.formValidationHandler(this.addNotificationCategoryForm,this.allLabel);
    //       break;
    //     }
    //   }
    // }
    if (this.addNotificationCategoryForm.invalid) {
      this.customValidator.formValidationHandler(this.addNotificationCategoryForm, this.allLabel, this.el);
    }
    if (this.addNotificationCategoryForm.invalid) {
      return;
    }

    if (this.addNotificationCategoryForm.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          this.manageNotificationCategoryService
            .createNotificationCategory(this.addNotificationCategoryForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Notification category created successfully.",
                    "success"
                  )
                  .then(() => {
                    this.initializeForm();
                  });
              },
              error: (error: any) => {
                this.spinner.hide();
              },
            });
        }
      });
    }
  }

}
