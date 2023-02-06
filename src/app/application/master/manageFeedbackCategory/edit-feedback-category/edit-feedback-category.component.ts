import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageFeedbackService } from '../../services/manage-feedback.service';

@Component({
  selector: 'app-edit-feedback-category',
  templateUrl: './edit-feedback-category.component.html',
  styleUrls: ['./edit-feedback-category.component.css']
})
export class EditFeedbackCategoryComponent implements OnInit {

  editFeedbackForm!:FormGroup;
  submitted = false;
  id: number = 0;
  categoryData: any;
  catName: any = "";
  encId: any = "";
  allErrorMessages: string[] = [];
  allLabel: any = ["","","Category Name",""];
  userId: any;
  profileId: any;
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  constructor(public customValidator:CustomValidators,
    private fb:FormBuilder,
    public manageFeedbackService:ManageFeedbackService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private route: Router,
    private router: ActivatedRoute,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    public commonService:CommonserviceService,
    private el:ElementRef,) { 
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
    this.initializeForm();
    this.editFeedback(this.id);
    this.el.nativeElement.querySelector("[formControlName=catName]").focus();
  
  }
  initializeForm() {
    this.editFeedbackForm = this.fb.group({
      userId:[this.userId],
      profileId:[this.profileId],
      catName: [
        this.catName,
        [Validators.required, Validators.maxLength(25),Validators.minLength(2),this.customValidator.firstCharValidatorRF,Validators.pattern(/^[a-zA-Z \s]+$/)],
      ],
      encId: [this.encId],
    });
  }

  editFeedback(id: any) {
    this.spinner.show();
    this.manageFeedbackService.getFeedbackData(this.id).subscribe((res: any) => {
    this.categoryData = res;
    this.categoryData = this.categoryData.data;
    this.catName = this.categoryData.catName;
    this.encId = this.categoryData.encId;
    this.initializeForm();
    this.spinner.hide();
    });
  }
 
  onSubmit() {
    
    // if ("INVALID" === this.editFeedbackForm.status) {
    //   for (const key of Object.keys(this.editFeedbackForm.controls)) {
    //     if (this.editFeedbackForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidator.formValidationHandler(this.editFeedbackForm,this.allLabel);
    //       break;
    //     }
    //   }
    // }

    if (this.editFeedbackForm.invalid) {
      this.customValidator.formValidationHandler(this.editFeedbackForm, this.allLabel, this.el);
    }

    if (this.editFeedbackForm.invalid) {
      return;
    }

    if (this.editFeedbackForm.valid === true) {
      this.alertHelper.updateAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          this.manageFeedbackService
            .updateFeedback(this.editFeedbackForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Feedback category updated successfully.",
                    "success"
                  )
                  .then(() => {
                    this.route.navigate(["../../viewFeedbackCategory"], {
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
    this.route.navigate(["../../viewFeedbackCategory"], {
      relativeTo: this.router,
    }); 
  }
}
