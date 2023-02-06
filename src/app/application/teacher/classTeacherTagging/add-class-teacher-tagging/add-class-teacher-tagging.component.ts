import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SchoolService } from 'src/app/application/school/services/school.service';
import { SmartClassService } from 'src/app/application/student/services/smart-class.service';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ClassWiseTeacherTaggedService } from '../../services/class-wise-teacher-tagged.service';

@Component({
  selector: 'app-add-class-teacher-tagging',
  templateUrl: './add-class-teacher-tagging.component.html',
  styleUrls: ['./add-class-teacher-tagging.component.css']
})
export class AddClassTeacherTaggingComponent implements OnInit,AfterViewInit {

  addClassTeacherTaggedForm !:FormGroup;
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();
  // FormControl variable
  className:any         = "";
  sectionName:any       = "";
  streamName:any        = "";
  groupName:any         = "";
  teacherName:any       = "";
  

  allErrorMessages: string[]  = [];
  classData: any              = [];
  sectionData: any            = [];
  streamList: any             = [];
  groupList: any              = [];
  teacherListData: any        = [];
  streamListModal :any        = [];
  groupListModal:any          = [];
  
  allLabel: string[] = ["Teacher name","Class name","Stream name","Group name","Section name","","",""];

  adminPrivilege: boolean = false;
  classChanged: boolean   = false;
  permissionDiv: boolean  = false;


  userProfile: any        = "";
  schoolId: any           = "";
  userId: any             = "";
  loginUserTypeId:any     = ""

  plPrivilege:string="view"; //For menu privilege
  
  
  constructor(
    private formBuilder: FormBuilder,
    private commonserviceService:CommonserviceService,
    private smartClassService:SmartClassService,
    private classWiseTeacherTaggedService:ClassWiseTeacherTaggedService,
    private schoolService: SchoolService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private alertHelper: AlertHelper ,
    private router:Router,
    public customValidators:CustomValidators,
    private el:ElementRef,
    private spinner: NgxSpinnerService
  ) { 
    /* const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For authorization  */
  }

  ngOnInit(): void {
    
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    const userProfile       = this.commonserviceService.getUserProfile();
    this.schoolId           = userProfile.school;
    this.userId             = userProfile?.userId;
    this.loginUserTypeId    = userProfile?.loginUserTypeId;

    if (userProfile.loginUserTypeId != 3) {
      this.permissionDiv = true;
      this.getClass(this.schoolId);
      this.getTeacherList(this.schoolId);
    } else {
      this.permissionDiv = false;
    }
    // this.loadAnnexturesData();
   
    this.initializeForm();
  }
  ngAfterViewInit(){
    this.el.nativeElement.querySelector("[formControlName=teacherName]").focus();
  }
  // conditional validation
  conditionalValidator(
    
    predicate: any,
    validator: ValidatorFn,
    errorNamespace: string,
    validationType: string
  ): ValidatorFn {
    
    return (formControl: any) => {
      let conditionStatus = false;
      let parentValue = parseInt(predicate());

      // 1) if parent empty
      if (!formControl.parent) {
        return null;
      }

      let error = null;
      // validation logic for stream
      if (validationType === "stream" && parentValue >= 11) {
        conditionStatus = true;
      }
      // validation logic for group
      if (validationType === "group" && parentValue === 3) {
        conditionStatus = true;
      }

      // 2) check childs direct parent field
      if (conditionStatus) {
        error = validator(formControl); // validate
      } else {
        error = null;
      }

      // 3) set conditional validation
      if (errorNamespace && error) {
        const customError: any = {}; // custom error property
        customError[errorNamespace] = error;
        error = customError;
      }
      return error;
    };
  }
  initializeForm() {
    this.addClassTeacherTaggedForm = this.formBuilder.group({
      teacherName: [
        this.teacherName,
      [Validators.required,Validators.pattern('^[0-9]+')],],
      className: [
        this.className,
      [Validators.required,Validators.pattern('^[0-9]+')],],
     
     /*  streamName: [
        this.streamName,
      [Validators.required,Validators.pattern('^[0-9]+')],],
      groupName: [
        this.groupName,
      [Validators.required,Validators.pattern('^[0-9]+')],], */
      streamName: [
        this.streamName,
        [
          Validators.pattern(/^[0-9]+$/),
          this.conditionalValidator(
            () => this.addClassTeacherTaggedForm?.get("className")?.value,
            Validators.required,
            "conditionalValidation",
            "stream"
          ),
        ],
      ],
      //group:[this.group],
      groupName: [
        this.groupName,
        [
          Validators.pattern(/^[0-9]+$/),
          this.conditionalValidator(
            () => this.addClassTeacherTaggedForm?.get("streamName")?.value,
            Validators.required,
            "conditionalValidation",
            "group"
          ),
        ],
      ],
      sectionName: [
        this.sectionName,
      [Validators.required,Validators.pattern('^[0-9]+')],],
      
      userId:[this.userId],
      schoolId:[this.schoolId],
      acdemicYear:this.academicYear,
    });
  }
  //GET ANNEXTURE DATA
  loadAnnexturesData() {
    const anxTypes = ["STREAM_TYPE", "STREAM_GROUP_TYPE"];
    // this.anxData = this.commonFunction.getAnnextureData(anxTypes);
    let annextureData!: [];
    this.commonserviceService.getCommonAnnexture(anxTypes).subscribe({
      next: (res: any) => {
        annextureData = res?.data;
        this.streamList = res?.data?.STREAM_TYPE;
        this.groupList = res?.data?.STREAM_GROUP_TYPE;
        this.streamList.forEach((value:any) => {
          this.streamListModal[value.anxtValue] = value.anxtName;                
        });
        this.groupList.forEach((value:any) => {
          this.groupListModal[value.anxtValue] = value.anxtName;                
        });
      },
    });
  }
//ON CLASS CHANGE
  classChange(val: any) {
    this.addClassTeacherTaggedForm.patchValue({ streamName: "" });
    this.addClassTeacherTaggedForm.patchValue({ groupName: "" });
    this.addClassTeacherTaggedForm.patchValue({ sectionName: "" });
    this.className = val;
    if (this.className !== "") {
      this.getSection(this.className, this.schoolId, this.academicYear);
      if (this.className == 11 || this.className == 12) {
        //this.getStream();
        this.loadAnnexturesData();
      }
    }
  }
  //GET CLASS 
  getClass(schoolEncId: string) {
    if (schoolEncId !== "") {
      this.schoolService.getSchoolClasses(schoolEncId).subscribe((res: any = []) => {
          this.classData = res.data;
        });
    }
  }
  //GET SECTION 
  getSection(classId: any, schoolId: any, academicYear: any) {
   // this.sectionLoad = true;
    this.smartClassService
      .getSection(classId, schoolId, academicYear)
      .subscribe((data: any = []) => {
        this.sectionData = data;
        this.sectionData = this.sectionData.data["sections"];
      });
  }

  streamControlChange(val: any) {
    this.streamName = val;
  }
  getTeacherList(schoolId:any){
    if (schoolId !== "") {
      this.classWiseTeacherTaggedService.getTeacherList(schoolId).subscribe((res: any = []) => {
          this.teacherListData = res.data;
          
        });
    }
  }
  onSubmit(){
    if (this.addClassTeacherTaggedForm.invalid) {
      this.customValidators.formValidationHandler(this.addClassTeacherTaggedForm, this.allLabel, this.el);
    }
    if (this.addClassTeacherTaggedForm.invalid) {
      return;
    }
    
    this.alertHelper.submitAlert().then((result) => {
      if (result.value) {
        this.spinner.show(); // ==== show spinner
        this.classWiseTeacherTaggedService
          .addClassTeacherTagged(this.addClassTeacherTaggedForm.value)
          .subscribe({
            next: (res: any) => {
              this.spinner.hide(); //==== hide spinner
              this.alertHelper
                .successAlert(
                  "Saved!",
                  "Class teacher tagging created successfully.",
                  "success"
                )
                .then(() => {
                  this.initializeForm();
                  this.addClassTeacherTaggedForm.patchValue({'className':''});
                  this.addClassTeacherTaggedForm.patchValue({'streamName':''});
                  this.addClassTeacherTaggedForm.patchValue({'teacherName':''});
                  this.classChange('');
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
