/**
* Created By  : Deepti Ranjan
* Created On  : 16-06-2022
* Module Name : Grievance
* Description : Set authority component.
**/
import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ManageSubCategoryService } from '../../services/manage-sub-category.service';
import { ManageCategoryService } from '../../services/manage-category.service';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { ManageSubjectService } from '../../services/manage-subject.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SetAuthorityService } from '../../services/set-authority.service';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { Router } from '@angular/router';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { Constant } from 'src/app/shared/constants/constant';

@Component({
  selector: 'app-add-set-authority',
  templateUrl: './add-set-authority.component.html',
  styleUrls: ['./add-set-authority.component.css']
})
export class AddSetAuthorityComponent implements OnInit {

  authorityForm!: FormGroup;
  submitted = false;

  grvncCatId: any = "";
  grvncSubCatId: any = "";
  subjectId: any = "";
  stageId: any = "";
  authorityId: any = "";
  timesla: any = "";
  arrLength: number = 0;

  categoryChanged:boolean = false; 
  subCategoryChanged:boolean = false; 
  subjectChanged:boolean = false; 
  stageChanged:boolean = false; 
  showLevel:boolean = false; 

  categoryData: any= [];
  subCategoryData: any= [];
  subjectData: any= [];
  stageData: any= [];
  authorityData: any= []; 
  authorityFilterData: any[] = []; 
  existingAuthorityData: any;

  plPrivilege:string="admin"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;

  authorityLabels: string[] = this.getCustomizedLabelName("");
  subCatLoading:boolean = false; 
  catLoading:boolean = false; 
  subLoading:boolean = false; 
  allLabel: string[] = ["", "Category", "Sub category", "Subject"];
  profileId:any = '';

  constructor(
    private formBuilder: FormBuilder, 
    private categoryService: ManageCategoryService, 
    private subCategoryService: ManageSubCategoryService, 
    private subjectService: ManageSubjectService, 
    public customValidators: CustomValidators, 
    public commonService: CommonserviceService, 
    private spinner: NgxSpinnerService, 
    private el: ElementRef,
    private setAuthorityService: SetAuthorityService , 
    private alertHelper: AlertHelper, 
    private router:Router,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege

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
    this.getStage();
    this.getAuthority();
    this.el.nativeElement.querySelector('[formControlName=grvncCatId]').focus();   
  }

  initializeForm() {
    this.authorityForm = this.formBuilder.group({
      profileId:[this.profileId],
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
      authorityLevels: this.formBuilder.array([])
    });
  }

  initialFormSetup() {
    if (!this.authorityLevelsArr()?.length) {
      this.showLevel = true;
      this.addRow(0); // add row at first
    }
  }

  resetFormArray(){
    (this.authorityForm.get('authorityLevels') as FormArray).clear();
  }

  resetForm(){
    this.resetFormArray();
    this.showLevel = false;
  }

  initAuthorityLevels()  {
    return this.formBuilder.group({
      stageId:[this.stageId, [Validators.required, Validators.pattern(/^[0-9]+$/)],],
      authorityId:[this.authorityId, [Validators.required, Validators.pattern(/^[0-9]+$/)],],
      timesla:[this.timesla, [Validators.required, Validators.pattern(/^[0-9]+$/)],]
    });
  }

  authorityLevelsArr() {
    return this.authorityForm.get('authorityLevels') as FormArray;
  }

  // add row
  addRow(index: any) {

    let emptyRow: Boolean = false;
    this.authorityLevelsArr()?.controls?.map((item: any, index: number) => {
      if (emptyRow === true) return;
      
      if (item?.invalid) {
        this.alertHelper.successAlert(
          "Invalid",
          "Level "+(index+1)+": All the fields are mandatory.",
          "error"
        );
        emptyRow = true;
      }
      else if(item.controls.timesla.value == null || parseInt(item.controls.timesla.value) < 1){        
        this.alertHelper.successAlert(
          "Invalid",
          "Level "+(index+1)+": Invalid value entered in time SLA (days).",
          "error"
        );
        emptyRow = true;
      }
    });

    if (emptyRow === false) {
      if(this.authorityLevelsArr().length < 3){
        this.authorityLevelsArr().insert(index+1, this.initAuthorityLevels());
      }
      else{
        this.alertHelper.successAlert(
          "Invalid",
          "Maximum 3 level can be added.",
          "error"
        );
      }
    }
  }

  // remove row
  removeRow(index: any) {
    this.authorityFilterData.splice(index, 1);
    this.authorityLevelsArr().length > 1 && this.authorityLevelsArr().removeAt(index);
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
      this.subCategoryService.getSubCategoryByCatId(categoryId).subscribe((data:any)=>{
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
    this.authorityForm.patchValue({"grvncSubCatId":""});
    this.authorityForm.get("subjectId")?.patchValue("");
    this.showLevel = false;
    this.resetFormArray();
  }

  getSubject(subCategoryId: any){
    this.subjectChanged = true;
    this.subLoading = true;
    if(subCategoryId !== ''){        
      this.subjectService.getSubjectBySubCatId(subCategoryId).subscribe((data:any)=>{
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
    this.authorityForm.get("subjectId")?.patchValue("");
    this.showLevel = false;
    this.resetFormArray();
  }

  getAuthorityLevel(subjectId: any){
    this.spinner.show();
    
    if(subjectId !== ''){     
      let selCatId = this.authorityForm.controls['grvncCatId'].value;
      let selSubCatId = this.authorityForm.controls['grvncSubCatId'].value;   
      const postData = {'catId':selCatId, 'subCatId':selSubCatId, 'subjectId':subjectId};

      this.setAuthorityService.getAuthorityLevel(postData).subscribe({
        next: (data:any)=> {
          this.existingAuthorityData = data;
          this.existingAuthorityData = this.existingAuthorityData.data;
          this.resetFormArray();
          if (this.existingAuthorityData?.length) {
            this.fillFieldsWithExistingData();
          } else {
            this.initialFormSetup();
          }
        },
        error: (err: any) => {
          this.spinner.hide();
        },
      });
      this.spinner.hide();
    } else {
      this.showLevel = false;
      this.resetFormArray();
      this.spinner.hide();
    }
  }

  fillFieldsWithExistingData(){
    this.showLevel = true;
    this.existingAuthorityData.map((item: any, index:any) => {
      
      this.authorityLevelsArr().push(
        this.formBuilder.group({
          stageId:[item.levelId, [Validators.required, Validators.pattern(/^[0-9]+$/)],],
          authorityId:[this.authorityId, [Validators.required, Validators.pattern(/^[0-9]+$/)],],
          timesla:[item.timeLine, [Validators.required, Validators.pattern(/^[0-9]+$/)],]
        })
      );

      let levelControl = <FormArray>this.authorityForm.controls['authorityLevels'];
      this.filterAuthority(item.levelId, index);
      levelControl.at(index).get('authorityId')?.setValue(item.authDesgnId);
    });
  }

  getStage(){
    this.stageChanged = true;
    this.commonService.getStage().subscribe((data:any) => {
      this.stageData = data;
      this.stageData = this.stageData.data;
      this.stageChanged = false;
    });    
  }

  getAuthority(){   
    this.commonService.getAuthorityDesignation().subscribe((data:any)=>{
      this.authorityData = data;
      this.authorityData = this.authorityData.data; 
    });
  }

  filterAuthority(stageId: any, index:number){
    let levelControl = <FormArray>this.authorityForm.controls['authorityLevels'];
    if(stageId !== ''){   
      this.authorityFilterData[index] = this.authorityData.filter((x: any) => {
        return x.intLevelId === parseInt(stageId)
      });
    }
    else{
      this.authorityFilterData[index] = [];
    } 
    levelControl.at(index).get('authorityId')?.patchValue("");
  }

  // ====== get customized label names
  getCustomizedLabelName(levelName: string) {
    return [
      `${levelName} :- Stage`,
      `${levelName} :- Approval authority`,
      `${levelName} :- Time SLA (days)`
    ];
  }

  validateSubmitAuthority(){
    Promise.all([
      this.validateAuthorityForm(), 
      this.checkDuplicateLevel(),
    ]).then((value) => {
      const formErrors = value[0];
      const checkDuplicateLevelError = value[1];

      if (checkDuplicateLevelError === true) {
        this.alertHelper.successAlert(
          "Invalid",
          "Duplicate stage can not be selected !!!",
          "error"
        );
      } else {
        let formInvalid: any = false;
        formErrors.map((item: any) => {
          if (item !== false) {
            formInvalid = true;
          }
        });

        // if (this.authorityForm.status === "INVALID") {              
        //   for (const key of Object.keys(this.authorityForm.controls)) {
        //     if (this.authorityForm.controls[key].status === "INVALID") {
        //       const invalidControl = this.el.nativeElement.querySelector(
        //         '[formControlName="' + key + '"]'
        //       );
        //       invalidControl.focus();
        //       this.customValidators.formValidationHandler(this.authorityForm,this.allLabel);
        //       break;
        //     }
        //   }
        // } 

        if(this.authorityForm.invalid){
          // this.customValidators.formValidationHandler(this.authorityForm,this.allLabel, this.el);
          this.customValidators.formValidationHandler(
            this.authorityForm,
            this.allLabel,
            this.el,
            {
              required: {
                grvncCatId: "Please select grievance category",
                grvncSubCatId: "Please select grievance sub-category",
                subjectId: "Please select grievance subject",
              },
            }
          );
        }
        
        formInvalid === false && this.submitAuthority();
      }
    });
  }

  checkDuplicateLevel(): any{
    let allValueArray: Array<number> = [];

    let authorityLevelsArr = <FormArray>this.authorityForm.controls['authorityLevels'];
    authorityLevelsArr.controls?.map(
      async (item:any,  index: number) =>{
        allValueArray.push(parseInt(item?.controls.stageId.value));
      }
    );

    const uniqueSet = new Set(allValueArray);
    if (allValueArray.length != uniqueSet.size) {
      return true;
    } else {
      return false;
    }    
  }

  validateAuthorityForm(){
    let allErrors: any = [];
    
    let authorityLevelsArr = <FormArray>this.authorityForm.controls['authorityLevels'];
    authorityLevelsArr.controls?.map(
      (item:any,  index: number) =>{
        this.authorityLabels = this.getCustomizedLabelName("Level "+(index+1));
        let errors = this.customValidators.formValidationHandler(item, this.authorityLabels);
        allErrors.push(errors);
      }      
    );

    let staticErrors = this.customValidators.formValidationHandler(this.authorityForm, this.allLabel);
    allErrors.push(staticErrors);
    
    return allErrors;
  }

  submitAuthority(){
    this.submitted = true;    

    if(this.authorityForm.valid == true){
      this.alertHelper.submitAlert().then((result) => {
        if(result.value){
          this.spinner.show();
          this.setAuthorityService.setAuthority(this.authorityForm.value).subscribe({
            next: (res: any) => {
              this.spinner.hide();
              this.alertHelper.successAlert(
                "Saved!",
                "Authority set successfully.",
                "success"
              ).then(()=>{
                this.initializeForm();
                this.resetFormArray();
                this.showLevel = false;                
              });
            },
            error: (error: any) => {
              this.spinner.hide();               
            }
          });   
        }            
      });
    }

  }


}
