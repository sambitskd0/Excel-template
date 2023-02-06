/**
* Created By  : Deepti Ranjan
* Created On  : 21-06-2022
* Module Name : Grievance
* Description : Add raise grievance component.
**/
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ManageCategoryService } from '../../services/manage-category.service';
import { ManageSubCategoryService } from '../../services/manage-sub-category.service';
import { ManageSubjectService } from '../../services/manage-subject.service';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { NgxSpinnerService } from 'ngx-spinner';
import { RaiseGrievanceService } from '../../services/raise-grievance.service';

@Component({
  selector: 'app-add-grievance',
  templateUrl: './add-grievance.component.html',
  styleUrls: ['./add-grievance.component.css']
})
export class AddGrievanceComponent implements OnInit {

  grievanceForm!: FormGroup;
  submitted = false;

  grievanceFile: any = "";
  postGrievanceFile: any = "";
  grvncCatId: any = "";
  grvncSubCatId: any = "";
  subjectId: any = "";
  grievanceDescription: string = ""; 
  currGrievanceFile: any = "";

  categoryChanged:boolean = false; 
  subCategoryChanged:boolean = false; 
  subjectChanged:boolean = false; 
  subCatLoading:boolean = false; 
  catLoading:boolean = false; 
  subLoading:boolean = false; 
  showClear:boolean = false;
  categoryData: any= [];
  subCategoryData: any= [];
  subjectData: any= [];
  
  plPrivilege:string="admin"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  
  allLabel: string[] = ["", "Grievance document", "Category", "Sub category", "Subject", "Grievance description"];
  profileId:any = '';

  public userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');

  constructor(
    private router:Router,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    public commonService: CommonserviceService, 
    public formBuilder: FormBuilder, 
    private categoryService: ManageCategoryService, 
    private subCategoryService: ManageSubCategoryService, 
    private subjectService: ManageSubjectService, 
    public customValidators: CustomValidators, 
    private alertHelper: AlertHelper, 
    private spinner: NgxSpinnerService, 
    private el: ElementRef, 
    private raiseGrievanceService: RaiseGrievanceService,  
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
    this.el.nativeElement.querySelector('[formControlName=grievanceFile]').focus();  
  }

  initializeForm() {
    this.grievanceForm = this.formBuilder.group({
      profileId:[this.profileId],
      grievanceFile: [
        this.grievanceFile
      ],
      grvncCatId: [
        this.grvncCatId,
        [Validators.required, Validators.maxLength(10)],
      ],
      grvncSubCatId: [
        this.grvncSubCatId,
        [Validators.required, Validators.maxLength(10)],
      ],
      subjectId: [
        this.subjectId,
        [Validators.required, Validators.maxLength(10)],
      ],
      grievanceDescription: [
        this.grievanceDescription, [Validators.required, Validators.maxLength(250)],
      ],
    });
  }

  getCategory(){
    this.categoryChanged = true;
    this.catLoading = true;
    this.categoryService.getGrievanceCategory().subscribe((data:[])=>{
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
      this.subCategoryService.getGrievanceSubCategory(categoryId).subscribe((data:any)=>{
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
    this.subjectData = [];
    this.grievanceForm.patchValue({"grvncSubCatId":""});
    this.grievanceForm.get("subjectId")?.patchValue("");
  }

  getSubject(subCategoryId: any){
    this.subjectChanged = true;
    this.subLoading = true;
    if(subCategoryId !== ''){        
      this.subjectService.getGrievanceSubject(subCategoryId).subscribe((data:any)=>{
        this.subjectData = data;
        this.subjectData = this.subjectData.data;   
        this.subjectChanged = false;
        this.subLoading = false;
      });
    }else{
      this.subjectData = [];      
      this.subjectChanged = false;
      this.subLoading = false;
    }  
    this.grievanceForm.get("subjectId")?.patchValue("");
  }
  

  fileEvent(e: any) {
    const grievanceDoc = e.target.files[0];
    this.currGrievanceFile = '';
    if(grievanceDoc != null){
      if (grievanceDoc.type != 'image/png' && grievanceDoc.type != 'image/jpg' && grievanceDoc.type != 'image/jpeg'  && grievanceDoc.type != 'application/pdf') {
        this.alertHelper.viewAlertHtml(
          "error",
          "Error",
          '<i class="bi bi-arrow-right text-danger"></i> File type should be png, jpg, jpeg or pdf file'
        );
        this.grievanceForm.patchValue({ grievanceFile: '' });
        return;
      }

      if (grievanceDoc.size >= (1024 * 1024 * 2)) {      
        this.alertHelper.viewAlertHtml(
          "error",
          "Error",
          '<i class="bi bi-arrow-right text-danger"></i> File size should not be greater than 2 MB'
        );
        this.grievanceForm.patchValue({ grievanceFile: '' });
        return;
      }
      
      this.postGrievanceFile = e.target.files[0];
      this.showClear = true;

      // if (e.target.files && e.target.files[0]) {
      //   var reader = new FileReader();
      //   reader.readAsDataURL(e.target.files[0]); // read file as data url
      //   reader.onload = (e) => { // called once readAsDataURL is completed
      //     this.currGrievanceFile = reader.result;
      //   }
      // }
    }
  }

  clearFile(){
    this.grievanceForm.patchValue({ grievanceFile: '' });
    this.showClear = false;
  }

  submitGrievance() {
    this.submitted = true;

    // if ("INVALID" === this.grievanceForm.status) {
    //   for (const key of Object.keys(this.grievanceForm.controls)) {
    //     if (this.grievanceForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.grievanceForm,this.allLabel);
    //       break;
    //     }
    //   }
    // } 

    if(this.grievanceForm.invalid){
      // this.customValidators.formValidationHandler(this.grievanceForm,this.allLabel, this.el);
      this.customValidators.formValidationHandler(
        this.grievanceForm,
        this.allLabel,
        this.el,
        {
          required: {
            grvncCatId: "Please select grievance category",
            grvncSubCatId: "Please select grievance sub-category",
            subjectId: "Please select grievance subject",
            grievanceDescription: "Please enter grievance description",
          },
        }
      );
    }

    if(this.grievanceForm.valid == true){
      this.alertHelper.submitAlert().then((result) => {
        if(result.value){
          this.spinner.show();

          const formData = new FormData();
          formData.append('userId', this.userProfile.userId);
          formData.append('userCode', this.userProfile.loginId);
          formData.append('userType', this.userProfile.loginUserTypeId);
          formData.append('userName', this.userProfile.userName);
          formData.append('userEmail', this.userProfile.email);
          formData.append('userMobile', this.userProfile.mobile);
          formData.append('userDesgnId', this.userProfile.designationId);
          formData.append('distId', this.userProfile.district);
          formData.append('blockId', this.userProfile.block);
          formData.append('clusterId', this.userProfile.cluster);
          formData.append('schoolId', this.userProfile.school);
          formData.append('documentFile', this.postGrievanceFile);
          formData.append('catId', this.grievanceForm.get('grvncCatId')?.value);
          formData.append('subCatId', this.grievanceForm.get('grvncSubCatId')?.value);
          formData.append('subjectId', this.grievanceForm.get('subjectId')?.value);
          formData.append('grievanceDesc', this.grievanceForm.get('grievanceDescription')?.value);

          this.raiseGrievanceService.addGrievance(formData).subscribe({
            next: (res: any) => {
              this.spinner.hide();
              this.alertHelper.successAlert(
                "Saved!",
                "Grievance raised successfully.",
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
