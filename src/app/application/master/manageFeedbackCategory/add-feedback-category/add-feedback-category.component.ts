import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import {CustomValidators} from 'src/app/shared/validations/custom-validators';
import { ManageFeedbackService } from '../../services/manage-feedback.service';
@Component({
  selector: 'app-add-feedback-category',
  templateUrl: './add-feedback-category.component.html',
  styleUrls: ['./add-feedback-category.component.css']
})
export class AddFeedbackCategoryComponent implements OnInit {
  addFeedbackForm!: FormGroup;
  allErrorMessages: string[] = [];
  allLabel: string[] = ["","","Category Name"];
  catName: any = "";
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  userId: any;
  profileId: any;
  adminPrivilege: boolean = false;

  constructor(
    private formBuilder:FormBuilder,
    private alertHelper:AlertHelper,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    public commonserviceService: CommonserviceService,
    public customValidator:CustomValidators,
    public manageFeedbackService:ManageFeedbackService,
    private spinner: NgxSpinnerService, public commonService:CommonserviceService,
    private el:ElementRef,
    ) { 
      const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For authorization
    }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.initializeForm();
    this.el.nativeElement.querySelector("[formControlName=catName]").focus();
  }
  initializeForm(){
    this.addFeedbackForm = this.formBuilder.group({
      userId:[this.userId],
      profileId:[this.profileId],
      catName: [
        this.catName,
        [Validators.required, Validators.maxLength(25),Validators.minLength(2),Validators.pattern(/^[a-zA-Z \s]+$/),this.customValidator.firstCharValidatorRF],
      ]
    })
  }
  get categoryFormControl() {
    return this.addFeedbackForm.controls;
  }

  onSubmit() {
   /*  this.customValidator.formValidationHandler(
      this.addFeedbackForm,
      this.allLabel
    ); */
    // if ("INVALID" === this.addFeedbackForm.status) {
    //   for (const key of Object.keys(this.addFeedbackForm.controls)) {
    //     if (this.addFeedbackForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidator.formValidationHandler(this.addFeedbackForm,this.allLabel);
    //       break;
    //     }
    //   }
    // }

    if (this.addFeedbackForm.invalid) {
      this.customValidator.formValidationHandler(this.addFeedbackForm, this.allLabel, this.el);
    }

    if (this.addFeedbackForm.invalid) {
      return;
    }

    if (this.addFeedbackForm.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          this.manageFeedbackService
            .createFeedback(this.addFeedbackForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Feedback created successfully.",
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
