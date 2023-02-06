import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageNotificationCategoryService } from '../../services/manage-notification-category.service';

@Component({
  selector: 'app-edit-notification-category',
  templateUrl: './edit-notification-category.component.html',
  styleUrls: ['./edit-notification-category.component.css']
})
export class EditNotificationCategoryComponent implements OnInit {
  editNotificationCategoryForm!:FormGroup;
  submitted = false;
  id: number = 0;
  categoryData: any;
  notifyCatName: any = "";
  encId: any = "";
  profileId: any = "";
  allErrorMessages: string[] = [];
  allLabel: any = ["","","Category name",""];
  userId: any;
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  constructor( 
    public customValidator:CustomValidators,
    private fb:FormBuilder,
    public manageNotificationCategoryService:ManageNotificationCategoryService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private route: Router,
    private router: ActivatedRoute,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    public commonService:CommonserviceService,
    private el:ElementRef,
  ) { 
    const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization

  }

  ngOnInit(): void {
    this.spinner.show();
    
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.id = this.router.snapshot.params["encId"];
    this.el.nativeElement.querySelector("[formControlName=notifyCatName]").focus();
    this.initializeForm();
    this.editNotificationCategory(this.id);
  }
  initializeForm() {
    this.editNotificationCategoryForm = this.fb.group({
      userId:[this.userId],
      profileId:[this.profileId],
      notifyCatName: [
        this.notifyCatName,
        [Validators.required, Validators.maxLength(50),Validators.minLength(2),Validators.pattern(/^[a-zA-Z ]+$/),this.customValidator.firstCharValidatorRF],
      ],
      encId: [this.encId],
    });
  }

  editNotificationCategory(id: any) {
    this.spinner.show();
    this.manageNotificationCategoryService.getNotificationCategoryData(this.id).subscribe((res: any) => {
    this.categoryData = res;
    
    this.categoryData = this.categoryData.data;
    this.notifyCatName = this.categoryData.categoryName;
    this.encId = this.categoryData.encId;
    this.initializeForm();
    this.spinner.hide();
    });
  }

  
  
  onSubmit() {  
  // if ("INVALID" === this.editNotificationCategoryForm.status) {
  //   for (const key of Object.keys(this.editNotificationCategoryForm.controls)) {
  //     if (this.editNotificationCategoryForm.controls[key].status === "INVALID") {
  //       const invalidControl = this.el.nativeElement.querySelector(
  //         '[formControlName="' + key + '"]'
  //       );
  //       invalidControl.focus();
  //       this.customValidator.formValidationHandler(this.editNotificationCategoryForm,this.allLabel);
  //       break;
  //     }
  //   }
  // }
  if (this.editNotificationCategoryForm.invalid) {
    this.customValidator.formValidationHandler(this.editNotificationCategoryForm, this.allLabel, this.el);
  }
  if (this.editNotificationCategoryForm.invalid) {
    return;
  }

  if (this.editNotificationCategoryForm.valid === true) {
    this.alertHelper.updateAlert().then((result) => {
      if (result.value) {
        this.spinner.show();
        this.manageNotificationCategoryService
          .updateNotificationCategory(this.editNotificationCategoryForm.value)
          .subscribe({
            next: (res: any) => {
              this.spinner.hide();
              this.alertHelper
                .successAlert(
                  "Saved!",
                  "Notification category updated successfully",
                  "success"
                )
                .then(() => {
                  this.route.navigate(["../../viewNotificationCategory"], {
                    relativeTo: this.router,
                  });
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
onCancel()
  {
    this.route.navigate(["../../viewNotificationCategory"], {
      relativeTo: this.router,
    }); 
  }

}
