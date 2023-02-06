import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SchoolService } from 'src/app/application/school/services/school.service';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ContextTaggingService } from "../../../services/context-tagging.service";

@Component({
  selector: 'app-add-context-tagging',
  templateUrl: './add-context-tagging.component.html',
  styleUrls: ['./add-context-tagging.component.css']
})
export class AddContextTaggingComponent implements OnInit {
  @ViewChildren("checkboxes") checkboxes!: QueryList<ElementRef>
  addContextTaggingForm!: FormGroup;
  isSelected: boolean = true;

  allErrorMessages: string[]  = [];
  contextsNameDatas: any       = [];
  classArr: any               = [];

  allLabel: string[]          = ["","","Context name","Class"];

  submitted:boolean           = false;
  adminPrivilege: boolean     = false;
  classChanged:boolean        = false;
  contextChanged:boolean      = false;

  userId: any                 = "";
  profileId: any                 = "";
  plPrivilege: string         = "";
  contextId: any              = "";
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
    private Contexttaggingservice: ContextTaggingService,
    private spinner: NgxSpinnerService,
    public commonService:CommonserviceService,
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
    this.profileId = users?.profileId;
    this.schoolId = users?.school;
    this.getSchoolClasses();
    this.getContextList();
    this.initializeForm();
     this.el.nativeElement.querySelector("[formControlName=contextId]").focus();
    this.spinner.hide();
    
  }
  initializeForm() {
    this.addContextTaggingForm = this.formBuilder.group({
      userId:[this.userId],
      profileId:[this.profileId],
      contextId: [
        this.contextId,
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
  getContextList(){
    this.contextChanged = true;
    this.Contexttaggingservice
        .getContextList()
        .subscribe((res: any = []) => {
          this.contextsNameDatas = res.data;
          this.contextChanged = false;
        });
  }
  onSubmit()
  {
    if (this.addContextTaggingForm.invalid) {
      this.customValidators.formValidationHandler(this.addContextTaggingForm,this.allLabel, this.el);
    }
    if (this.addContextTaggingForm.invalid) {
      return;
    }
    if(this.addContextTaggingForm.value.classArr.length==0){
      this.alertHelper.viewAlert("error","Invalid","Class is required");
      return;
    }
    if (this.addContextTaggingForm.valid === true) {
      this.alertHelper.submitAlert().then((result:any) => {
        if (result.value) {
          this.spinner.show();
          this.Contexttaggingservice.addContextTagging(this.addContextTaggingForm.value).subscribe({
            next: (res: any) => {
              this.spinner.hide();
              this.alertHelper
                .successAlert(
                  "Saved!",
                  "Context tagging created successfully.",
                  "success"
                )
                .then(() => {
                  this.initializeForm();
                   this.resetFormArray();
                 
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
    let frmArray = this.addContextTaggingForm.get('classArr') as FormArray;   
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;   
      // frmArray.removeAt(i)   
    });
  }

  changeClass(event:any){
    const classArr: FormArray = this.addContextTaggingForm.get('classArr') as FormArray;
    let index = this.classArr.indexOf(event.target.value);
    if(event.target.checked){
      classArr.push(new FormControl(event.target.value));
    }else{
      const index = classArr.controls.findIndex(x => x.value === event.target.value);
      classArr.removeAt(index);
    }
  } 

}
