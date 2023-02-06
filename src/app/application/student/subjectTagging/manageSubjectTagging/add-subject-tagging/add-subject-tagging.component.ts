import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SchoolService } from 'src/app/application/school/services/school.service';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { SubjectTaggingService } from '../../../services/subject-tagging.service';

@Component({
  selector: 'app-add-subject-tagging',
  templateUrl: './add-subject-tagging.component.html',
  styleUrls: ['./add-subject-tagging.component.css']
})
export class AddSubjectTaggingComponent implements OnInit {
  @ViewChildren("checkboxes") checkboxes!: QueryList<ElementRef>
  addSubjectTaggingForm!: FormGroup;
  isSelected: boolean = true;

  allErrorMessages: string[]  = [];
  subjectNameDatas: any       = [];
  classArr: any               = [];

  allLabel: string[]          = ["","","Subject name","Class"];

  submitted:boolean           = false;
  adminPrivilege: boolean     = false;
  classChanged:boolean        = false;
  subjectChanged:boolean      = false;

  userId: any                 = "";
  profileId: any                 = "";
  plPrivilege: string         = "";
  subjectId: any              = "";
  schoolId: any               = "";
  classData: any              = "";

  classList: any = [];
  
  constructor(
    private el: ElementRef,
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private spinner: NgxSpinnerService,
    public commonService:CommonserviceService,
    public subjectTaggingService:SubjectTaggingService,
    public schoolService:SchoolService,
    public activateRoute:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    const users = this.commonService.getUserProfile();
    
    this.userId = users?.userId;
    this.schoolId = users?.school;
    this.profileId = users?.profileId;
    this.getSchoolClasses();
    this.getSubject();
    this.initializeForm();
    this.el.nativeElement.querySelector("[formControlName=subjectId]").focus();
    this.spinner.hide();
    
  }
  initializeForm() {
    this.addSubjectTaggingForm = this.formBuilder.group({
      userId:[this.userId],
      profileId:[this.profileId],
      subjectId: [
        this.subjectId,
        [Validators.required,Validators.pattern('^[0-9]*$')],
      ],
      classArr: this.formBuilder.array([]),
     
    });
  }
  getSchoolClasses()
  {
   this.classChanged = true;
   this.commonService.getCommonAnnexture(['CLASS_TYPE'],true).subscribe((res: any) => {
     this.classList = res.data;
     this.classList = this.classList.CLASS_TYPE;
   this.classChanged = false;
  });
  }
  getSubject(){
    this.subjectChanged = true;
    this.subjectTaggingService
        .getSubjectList()
        .subscribe((res: any = []) => {
          this.subjectNameDatas = res.data;
          this.subjectChanged = false;
        });
  }

   onSubmit(){
    if (this.addSubjectTaggingForm.invalid) {
      this.customValidators.formValidationHandler(this.addSubjectTaggingForm,this.allLabel, this.el);
    }
    if (this.addSubjectTaggingForm.invalid) {
      return;
    }
    if(this.addSubjectTaggingForm.value.classArr.length==0){
      this.alertHelper.viewAlert("error","Invalid","Class is required");
      return;
    }
    if (this.addSubjectTaggingForm.valid === true) {
      this.alertHelper.submitAlert().then((result:any) => {
        if (result.value) {
          this.spinner.show();
          this.subjectTaggingService.addSubjectTagging(this.addSubjectTaggingForm.value).subscribe({
            next: (res: any) => {
              this.spinner.hide();
              this.alertHelper
                .successAlert(
                  "Saved!",
                  "Subject tagging created successfully.",
                  "success"
                )
                .then(() => {
                  this.initializeForm();
                   this.resetFormArray();
                  //  this.router.navigate(["./../viewIncentiveConfiguration"], {
                  //   relativeTo: this.activateRoute,
                  // }); 
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

  resetFormArray() {
    let frmArray = this.addSubjectTaggingForm.get('classArr') as FormArray;   
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;   
      // frmArray.removeAt(i)   
    });
  }

  changeClass(event:any){
    const classArr: FormArray = this.addSubjectTaggingForm.get('classArr') as FormArray;
    let index = this.classArr.indexOf(event.target.value);
    if(event.target.checked){
      classArr.push(new FormControl(event.target.value));
    }else{
      const index = classArr.controls.findIndex(x => x.value === event.target.value);
      classArr.removeAt(index);
    }
  } 

}
