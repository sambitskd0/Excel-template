import { Component, ElementRef, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { SchoolCategoryService } from '../../services/school-category.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {
  schoolCategoryForm!: FormGroup;
  anextureType:any;
  posts:any;
  anexType:any; 
  userId:any; 
  profileId:any; 
  schoolCategoryName:any="";  
  schoolTaggingArray:any=[];  
  submitted = false;
  allErrorMessages: string[] = [];
  allLabel: string[] = ["School category","School type tagging","",""];
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  constructor( public commonserviceService: CommonserviceService,  private formBuilder: FormBuilder, private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private spinner: NgxSpinnerService,
    private schoolCategoryService:SchoolCategoryService ,
    private route: Router,
    private el:ElementRef,
    private router: ActivatedRoute ) {
      const pageUrl:any = this.route.url;  
      this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
      this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For authorization
     }
  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
      this.anexType="SCHOOL_TAGGING_TYPE";
      this.commonserviceService.getAnextureType(this.anexType).subscribe((data:any=[]) => {
      this.anextureType = data;
      this.anextureType = this.anextureType.data;
    }); 
     this.el.nativeElement.querySelector("[formControlName=schoolCategoryName]").focus();
    this.initializeForm();
  }
  ngAfterViewInit(){
    this.el.nativeElement.querySelector("[formControlName=schoolCategoryName]").focus();
  }
  initializeForm() {
    this.schoolCategoryForm = this.formBuilder.group({
      schoolCategoryName: [this.schoolCategoryName, [Validators.required,Validators.maxLength(50),Validators.minLength(1),Validators.pattern(/^[a-zA-Z0-9 -./]*$/)]],
      schoolTaggingArray: this.formBuilder.array(this.schoolTaggingArray,[Validators.required]),
      userId:[this.userId],
      profileId:[this.profileId],
    });
  }
  onCheckboxChange(e:any) {
    const schoolTaggingArray: FormArray = this.schoolCategoryForm.get('schoolTaggingArray') as FormArray;
    if (e.target.checked) {
      schoolTaggingArray.push(new FormControl(e.target.value));
    } else {
       const index = schoolTaggingArray.controls.findIndex(x => x.value === e.target.value);
       schoolTaggingArray.removeAt(index);
    }
  }
  resetForm(){
    const schoolTaggingArray: FormArray = this.schoolCategoryForm.get('schoolTaggingArray') as FormArray;
    schoolTaggingArray.controls.map(x => x.patchValue(false));
  }
   formCancel(){
    (this.schoolCategoryForm.get("schoolTaggingArray") as FormArray).clear();
  }
  onSubmit(){
    this.submitted = true;
    if (this.schoolCategoryForm.get("schoolCategoryName")?.value =="") {
      this.el.nativeElement.querySelector("[formControlName=schoolCategoryName]").focus();
    }
    if(this.schoolCategoryForm.invalid){
      this.customValidators.formValidationHandler(
        this.schoolCategoryForm,
        this.allLabel,
        this.el
      );
    }
    this.customValidators.formValidationHandler(
      this.schoolCategoryForm,
      this.allLabel
    );
    if (this.schoolCategoryForm.valid === true) {
      this.alertHelper.submitAlert().then((result:any) => {
        if (result.value) {
          this.spinner.show();
          this.schoolCategoryService.addSchoolCategory(this.schoolCategoryForm.value).subscribe({
            next: (res: any) => {
              this.spinner.hide();
              this.alertHelper
                .successAlert(
                  "Saved!",
                  "School category created successfully.",
                  "success"
                )
                .then(() => {
                  this.route.navigate(["./../viewCategory"], {
                    relativeTo: this.router,
                  });
                });
            }, 
            error: (error: any) => {
              this.spinner.hide(); //==== hide spinner
              let errorMessage: string = "";
              if (typeof error.error.msg === "string") {
                errorMessage +=
                  '<i class="bi bi-arrow-right text-danger"></i> ' +
                  error.error.msg +
                  `<br>`;
              } else {
                error.error.msg.map(
                  (message: string) =>
                    (errorMessage +=
                      '<i class="bi bi-arrow-right text-danger"></i> ' +
                      message +
                      `<br>`)
                );
              }
              this.alertHelper.viewAlertHtml(
                "error",
                "Invalid inputs",
                errorMessage
              );
            },
          });
        }
      });
    }
 }
}
