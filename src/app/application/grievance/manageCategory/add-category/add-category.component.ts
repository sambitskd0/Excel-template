/**
* Created By  : Deepti Ranjan
* Created On  : 26-05-2022
* Module Name : Grievance
* Description : Add Category component.
**/

import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageCategoryService } from '../../services/manage-category.service';
import { Router } from '@angular/router';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {
 
  categoryForm!: FormGroup;
  submitted = false;
  grvncCatName: any = "";
  grvncCatDescription: any = "";
  allLabel: string[] = ["", "Category", "Description"];

  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  profileId:any = "";

  constructor(
    public customValidators: CustomValidators,
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService, 
    private categoryService: ManageCategoryService, 
    private router:Router,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private commonService: CommonserviceService, 
    private el: ElementRef 
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
    this.profileId = users?.profileId;
    this.el.nativeElement.querySelector('[formControlName=grvncCatName]').focus();
    this.initializeForm();
  }

  initializeForm() {
    this.categoryForm = this.formBuilder.group({
      profileId:[this.profileId],
      grvncCatName: [
        this.grvncCatName,
        [Validators.required, Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9 ,.()'_\-\s]+$/), this.customValidators.firstCharValidatorRF],        
      ],
      grvncCatDescription: [
        this.grvncCatDescription, [Validators.maxLength(500)],
      ],
    });
  }

  submitCategory() {
    this.submitted = true;

    // if ("INVALID" === this.categoryForm.status) {
    //   for (const key of Object.keys(this.categoryForm.controls)) {
    //     if (this.categoryForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.categoryForm,this.allLabel);
    //       break;
    //     }
    //   }
    // } 
    if(this.categoryForm.invalid){
      // this.customValidators.formValidationHandler(this.categoryForm,this.allLabel, this.el);
      this.customValidators.formValidationHandler(
        this.categoryForm,
        this.allLabel,
        this.el,
        {
          required: {
            grvncCatName: "Please enter grievance category",
          },
        }
      );
    }

    if(this.categoryForm.valid == true){
      this.alertHelper.submitAlert().then((result) => {
        if(result.value){
          this.spinner.show();
          this.categoryService.addCategory(this.categoryForm.value).subscribe({
            next: (res: any) => {
              this.spinner.hide();
              this.alertHelper.successAlert(
                "Saved!",
                "Category created successfully.",
                "success"
              ).then(()=>{
                this.initializeForm();
              });
            },
            error: (error: any) => {
              this.spinner.hide(); //==== hide spinner
            },
          });
        }
      });
    }
  }


}
