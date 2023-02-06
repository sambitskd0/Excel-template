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
  selector: 'app-edit-context-tagging',
  templateUrl: './edit-context-tagging.component.html',
  styleUrls: ['./edit-context-tagging.component.css']
})
export class EditContextTaggingComponent implements OnInit {
  @ViewChildren("checkboxes") checkboxes!: QueryList<ElementRef>
  editContextTaggingForm!: FormGroup;
  isSelected: boolean = true;
  editContextTaggingData:any="";

  allErrorMessages: string[]  = [];
  contextsNameDatas: any       = [];
  classArr: any               = [];

  allLabel: string[]          = ["","","Context name","Class"];

  submitted:boolean           = false;
  adminPrivilege: boolean     = false;
  classChanged:boolean        = false;
  contextChanged:boolean      = false;

  userId: any                 = "";
  profileId: any              = "";
  plPrivilege: string         = "";
  contextId: any              = "";
  schoolId: any               = "";
  classData: any              = "";
  id: number = 0;
  encId: any = "";
  classList: any = [];

  constructor(
    private el: ElementRef,
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private route:Router,
    private router: ActivatedRoute,
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
    this.id = this.router.snapshot.params["encId"];
    this.getContextList();
    this.initializeForm();
     this.el.nativeElement.querySelector("[formControlName=contextId]").focus();
     this.getContextTagging(this.id)
    this.spinner.hide();
  }
  initializeForm() {
    this.editContextTaggingForm = this.formBuilder.group({
      userId:[this.userId],
      profileId:[this.profileId],
      contextId: [
        this.contextId,
        [Validators.required,Validators.pattern('^[0-9]*$')],
      ],
      classArr: this.formBuilder.array(this.classArr),
      encId: [this.id],
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
  getContextTagging(id:any)
{
  this.Contexttaggingservice.getContextTagging(id).subscribe((res: any) => {
    
    this.editContextTaggingData = res?.data;
    this.contextId=this.editContextTaggingData.contextId;
    this.classArr=this.editContextTaggingData.classId;
    this.encId = this.editContextTaggingData.encId;
    this.initializeForm();
});

    
}
  onSubmit()
  {
    if (this.editContextTaggingForm.invalid) {
      this.customValidators.formValidationHandler(
        this.editContextTaggingForm,
        this.allLabel,
        this.el
      );
    }
    if (this.editContextTaggingForm.valid === true) {
      this.alertHelper.updateAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          this.Contexttaggingservice
            .updateContextTagging(this.editContextTaggingForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Context tagging updated successfully.",
                    "success"
                  )
                  .then(() => {
                    this.route.navigate(["../../view"], {
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
  resetFormArray() {
    let frmArray = this.editContextTaggingForm.get('classArr') as FormArray;   
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;   
      // frmArray.removeAt(i)   
    });
  }

  changeClass(event:any){
    const classArr: FormArray = this.editContextTaggingForm.get('classArr') as FormArray;
    let index = this.classArr.indexOf(event.target.value);
    if(event.target.checked){
      classArr.push(new FormControl(event.target.value));
    }else{
      const index = classArr.controls.findIndex(x => x.value === event.target.value);
      classArr.removeAt(index);
    }
  } 
  onCancel()
  {
    this.route.navigate(["../../view"], {
      relativeTo: this.router,
    }); 
  }

}
