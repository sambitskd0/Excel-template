/**
* Created By  : Deepti Ranjan
* Created On  : 30-05-2022
* Module Name : Grievance
* Description : Edit Category component.
**/

import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageCategoryService } from '../../services/manage-category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {
  categoryForm!: FormGroup;
  submitted = false;
  grvncCatName: any = "";
  grvncCatDescription: any = "";  
  id: string= "";
  categoryData: any = "";  
  encId: any = "";
  allLabel: string[] = ["", "Category", "Description"];

  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  profileId:any = '';

  constructor(
    public customValidators: CustomValidators,
    private router: ActivatedRoute, 
    private categoryService: ManageCategoryService,
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    private route: Router,
    private spinner: NgxSpinnerService, 
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private commonService: CommonserviceService, 
    private el: ElementRef 
  ) { 
    const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization
  }

  ngOnInit(): void {
    this.spinner.show();  // ==== show spinner
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    const users = this.commonService.getUserProfile();
    this.profileId = users?.profileId;
    this.id = this.router.snapshot.params["encId"];
    this.categoryDetails(this.id);
    this.initializeForm();
    this.el.nativeElement.querySelector('[formControlName=grvncCatName]').focus();
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
      encId: [this.encId],
    });
  }

   categoryDetails(id: any) {
    this.categoryService.getCategoryDetails(id).subscribe((data: any) => {
      this.categoryData = data;
      this.categoryData = this.categoryData.data[0];
      this.grvncCatName = this.categoryData.grvncCatName;
      this.grvncCatDescription = this.categoryData.grvncCatDescription;
      this.encId = this.categoryData.encId;
      this.initializeForm();
      this.spinner.hide(); //==== hide spinner
    });
  }

  updateCategory(){
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
      this.alertHelper.updateAlert().then((result)=> {
        if (result.value) {
          this.spinner.show(); // show spinner
          this.categoryService.updateCategory(this.categoryForm.value)
          .subscribe({
            next: (res: any) => {  
              this.spinner.hide();           
              this.alertHelper.successAlert(
                "Saved!",
                "Category updated successfully.",
                "success"
              ).then(()=>{
                this.route.navigate(["../../viewCategory"], {
                  relativeTo: this.router,
                });
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
