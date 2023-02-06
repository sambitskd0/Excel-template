/**
* Created By  : Deepti Ranjan
* Created On  : 01-06-2022
* Module Name : Grievance
* Description : Edit Subject component.
**/
import { Component, OnInit, ElementRef } from '@angular/core';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ManageCategoryService } from '../../services/manage-category.service';
import { ManageSubCategoryService } from '../../services/manage-sub-category.service';
import { ManageSubjectService } from '../../services/manage-subject.service';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';


@Component({
  selector: 'app-edit-subject',
  templateUrl: './edit-subject.component.html',
  styleUrls: ['./edit-subject.component.css']
})
export class EditSubjectComponent implements OnInit {
  subjectForm!: FormGroup;
  submitted = false;
  
  grvncCatId: any = "";
  grvncSubCatId: any = "";
  subjectName: string = "";
  subjectDescription: string = ""; 
  id: string= "";
  encId: any = "";  
  subjectData: any = "";  

  categoryChanged:boolean = false; 
  subCategoryChanged:boolean = false; 

  categoryData: any= [];
  subCategoryData: any= [];
  catLoading:boolean=false;
  subCatLoading:boolean=false;
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;

  allLabel: string[] = ["", "Category", "Sub category", "Subject", "Description"];
  profileId:any = '';

  constructor(
    public customValidators: CustomValidators, 
    private categoryService: ManageCategoryService, 
    private SubCategoryService: ManageSubCategoryService, 
    private SubjectService: ManageSubjectService, 
    private formBuilder: FormBuilder, 
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

    this.id = this.router.snapshot.params["encId"];
    this.subjectDetails(this.id);
    this.getCategory();
    this.initializeForm();   
    this.el.nativeElement.querySelector('[formControlName=grvncCatId]').focus();    
  }

  initializeForm() {
    this.subjectForm = this.formBuilder.group({
      profileId:[this.profileId],
      grvncCatId: [
        this.grvncCatId,
        [Validators.required, Validators.maxLength(10)],
      ],
      grvncSubCatId: [
        this.grvncSubCatId,
        [Validators.required, Validators.maxLength(10)],
      ],
      subjectName: [
        this.subjectName,
        [Validators.required, Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9 ,.()'_\-\s]+$/), this.customValidators.firstCharValidatorRF],
      ],
      subjectDescription: [
        this.subjectDescription, [Validators.maxLength(500)],
      ],
      encId: [this.encId],
    });
  }

  getCategory(){
    this.categoryChanged = true;
    this.catLoading = true;
    this.categoryService.getAllCategory().subscribe((data:[])=>{
      this.categoryData = data;
      this.categoryData = this.categoryData.data;   
      this.categoryChanged = false;
      this.catLoading = false;
    });
  }

  getSubCategory(categoryId: any){
    this.subCategoryChanged = true;
    this.subCatLoading = true;
    if(categoryId !== ''){        
      this.SubCategoryService.getSubCategoryByCatId(categoryId).subscribe((data:any)=>{
        this.subCategoryData = data;
        this.subCategoryData = this.subCategoryData.data;   
        this.subCategoryChanged = false;
        this.subCatLoading = false;
      });
    }else{
      this.subCategoryData = [];
      this.subCategoryChanged = false;
      this.subCatLoading = false;
    }  
    this.subjectForm.patchValue({"grvncSubCatId":""}); 
  }

  subjectDetails(id:any) {
    this.SubjectService.getSubjectDetails(id).subscribe((data: any) => {
      this.subjectData = data;
      this.subjectData = this.subjectData.data[0];

      this.grvncCatId      = this.subjectData.grvncCatId;
      this.getSubCategory(this.grvncCatId);

      this.grvncSubCatId      = this.subjectData.grvncSubCatId;
      this.subjectName = this.subjectData.subjectName;
      this.subjectDescription = this.subjectData.subjectDescription;
      this.encId = this.subjectData.encId;
      this.initializeForm();
      this.spinner.hide(); //==== hide spinner
    });
  }

  updateSubject(){
    this.submitted = true;
    
    // if ("INVALID" === this.subjectForm.status) {
    //   for (const key of Object.keys(this.subjectForm.controls)) {
    //     if (this.subjectForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.subjectForm,this.allLabel);
    //       break;
    //     }
    //   }
    // } 

    if(this.subjectForm.invalid){
      // this.customValidators.formValidationHandler(this.subjectForm,this.allLabel, this.el);
      this.customValidators.formValidationHandler(
        this.subjectForm,
        this.allLabel,
        this.el,
        {
          required: {
            grvncCatId: "Please select grievance category",
            grvncSubCatId: "Please select grievance sub-category",
            subjectName: "Please enter subject of grievance",
          },
        }
      );
    }
    
    if(this.subjectForm.valid == true){
      this.alertHelper.updateAlert().then((result)=> {
        if (result.value) {
          this.spinner.show(); // show spinner
          this.SubjectService.updateSubject(this.subjectForm.value)
          .subscribe({
            next: (res: any) => {  
              this.spinner.hide();           
              this.alertHelper.successAlert(
                "Saved!",
                "Grievance subject updated successfully.",
                "success"
              ).then(()=>{
                this.route.navigate(["../../viewSubject"], {
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
