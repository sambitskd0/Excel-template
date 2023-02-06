/**
* Created By  : Deepti Ranjan
* Created On  : 31-05-2022
* Module Name : Grievance
* Description : Add Sub Category component.
**/

import { Component, OnInit, ElementRef } from '@angular/core';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ManageCategoryService } from '../../services/manage-category.service';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { NgxSpinnerService } from 'ngx-spinner';
import { ManageSubCategoryService } from '../../services/manage-sub-category.service';
import { Router } from '@angular/router';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';

@Component({
  selector: 'app-add-sub-category',
  templateUrl: './add-sub-category.component.html', 
  styleUrls: ['./add-sub-category.component.css']
})
export class AddSubCategoryComponent implements OnInit {

  subCategoryForm!: FormGroup;
  submitted = false;
  grvncCatId: any = "";
  grvncSubCatName: string = "";
  grvncSubCatDescription: string = "";
  allCategory: any = [];
  categoryChanged:boolean = false; 
  catLoading:boolean=false;
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;

  allLabel: string[] = ["", "Category", "Sub category", "Description"];
  profileId:any = '';

  constructor(
    public customValidators: CustomValidators, 
    private formBuilder: FormBuilder, 
    private categoryService: ManageCategoryService,
    private SubCategoryService: ManageSubCategoryService, 
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService, 
    private router:Router,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private commonService: CommonserviceService, 
    private el: ElementRef 
  ) { 
    const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization
  }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    const users = this.commonService.getUserProfile();
    this.profileId = users?.profileId;
    this.getCategory();
    this.initializeForm(); 
    this.el.nativeElement.querySelector('[formControlName=grvncCatId]').focus();   
  }

  getCategory(){
    this.categoryChanged = true;
    this.catLoading = true;
    this.categoryService.getAllCategory().subscribe((data:[])=>{
      this.allCategory = data;
      this.allCategory = this.allCategory.data;
      this.categoryChanged = false;
      this.catLoading = false;
    });
  }

  initializeForm() {
    this.subCategoryForm = this.formBuilder.group({
      profileId:[this.profileId],
      grvncCatId: [
        this.grvncCatId,
        [Validators.required, Validators.maxLength(10)],
      ],
      grvncSubCatName: [
        this.grvncSubCatName,
        [Validators.required, Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9 ,.()'_\-\s]+$/), this.customValidators.firstCharValidatorRF],
      ],
      grvncSubCatDescription: [
        this.grvncSubCatDescription, [Validators.maxLength(500)],
      ],
    });
  }

  submitSubCategory() {
    this.submitted = true;

    // if ("INVALID" === this.subCategoryForm.status) {
    //   for (const key of Object.keys(this.subCategoryForm.controls)) {
    //     if (this.subCategoryForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.subCategoryForm,this.allLabel);
    //       break;
    //     }
    //   }
    // } 

    if(this.subCategoryForm.valid){
      // this.customValidators.formValidationHandler(this.subCategoryForm,this.allLabel, this.el);
      this.customValidators.formValidationHandler(
        this.subCategoryForm,
        this.allLabel,
        this.el,
        {
          required: {
            grvncCatId: "Please select grievance category",
            grvncSubCatName: "Please enter grievance sub-category",
          },
        }
      );
    }

    if(this.subCategoryForm.valid == true){
      this.alertHelper.submitAlert().then((result) => {
        if(result.value){
          this.spinner.show();

          this.SubCategoryService.addSubCategory(this.subCategoryForm.value).subscribe({
            next: (res: any) => {
              this.spinner.hide();
              this.alertHelper.successAlert(
                "Saved!",
                "Sub category saved successfully",
                "success"
              ).then(()=>{
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
