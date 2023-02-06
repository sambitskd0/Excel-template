/**
* Created By  : Deepti Ranjan
* Created On  : 31-05-2022
* Module Name : Grievance
* Description : Edit Sub Category component.
**/

import { Component, OnInit, ElementRef } from '@angular/core';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ManageCategoryService } from '../../services/manage-category.service';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { NgxSpinnerService } from 'ngx-spinner';
import { ManageSubCategoryService } from '../../services/manage-sub-category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';


@Component({
  selector: 'app-edit-sub-category',
  templateUrl: './edit-sub-category.component.html',
  styleUrls: ['./edit-sub-category.component.css']
})
export class EditSubCategoryComponent implements OnInit {
  subCategoryForm!: FormGroup;
  submitted = false;
  grvncCatId: any = "";
  grvncSubCatName: string = "";
  grvncSubCatDescription: string = "";
  allCategory: any;
  id: string= "";
  subCategoryData: any = "";  
  encId: any = "";
  categoryChanged:boolean = false; 
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  catLoading:boolean=false;
  allLabel: string[] = ["", "Category", "Sub category", "Description"];
  profileId:any = '';
  
  constructor(
    public customValidators: CustomValidators, 
    private formBuilder: FormBuilder, 
    private categoryService: ManageCategoryService,
    private SubCategoryService: ManageSubCategoryService, 
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService, 
    private router: ActivatedRoute, 
    private route: Router, 
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
    this.getCategory();

    this.id = this.router.snapshot.params["encId"];
    this.subCategoryDetails(this.id);
    this.initializeForm();
    this.el.nativeElement.querySelector('[formControlName=grvncCatId]').focus(); 
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
      encId: [this.encId],
    });
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

  subCategoryDetails(id:any) {
    this.SubCategoryService.getSubCategoryDetails(id).subscribe((data: any) => {
      this.subCategoryData = data;
      this.subCategoryData = this.subCategoryData.data[0];
      this.grvncCatId      = this.subCategoryData.grvncCatId;
      this.grvncSubCatName = this.subCategoryData.grvncSubCatName;
      this.grvncSubCatDescription = this.subCategoryData.grvncSubCatDescription;
      this.encId = this.subCategoryData.encId;
      this.initializeForm();
      this.spinner.hide(); //==== hide spinner
    });
  }

  updateSubCategory(){
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

    if(this.subCategoryForm.invalid){
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
      this.alertHelper.updateAlert().then((result)=> {
        if (result.value) {
          this.spinner.show(); // show spinner
          this.SubCategoryService.updateSubCategory(this.subCategoryForm.value)
          .subscribe({
            next: (res: any) => {  
              this.spinner.hide();           
              this.alertHelper.successAlert(
                "Saved!",
                "Sub category updated successfully",
                "success"
              ).then(()=>{
                this.route.navigate(["../../viewSubCategory"], {
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
