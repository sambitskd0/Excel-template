import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { NgxSpinnerService } from "ngx-spinner";
import { Constant } from 'src/app/shared/constants/constant';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { Router } from '@angular/router';
import { SchoolService } from 'src/app/application/school/services/school.service';
import { ManageIndicatorService } from '../../services/manage-indicator.service';


@Component({
  selector: 'app-add-indicator',
  templateUrl: './add-indicator.component.html',
  styleUrls: ['./add-indicator.component.css']
})
export class AddIndicatorComponent implements OnInit {
  indicatorForm!: FormGroup;
  submitted = false;
  posts: any; 
  showSpinnerBlock: boolean = false;
  allErrorMessages: string[] = [];
  allLabel: string[] = ["","","Class","Subject", "Indicator name"];
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  userId: any;
  classId: any = "";
  profileId: any = "";
  indicator: any = "";
  adminPrivilege: boolean = false;
  classChanged: boolean = false;
  classList: any = [];
  userProfile: any = [];
  schoolId: any = "";
  getSubjectLoading:boolean=false;
  subjectData: any;
  encId: any = "";
  subjectId:any = "";
  subject:any = "";
  constructor(
    private formBuilder: FormBuilder,
    private commonserviceService:CommonserviceService,
    public Manageindicatorservice:ManageIndicatorService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private alertHelper: AlertHelper ,
    private route:Router,
    private schoolService: SchoolService,
    public customValidators:CustomValidators,
    private el:ElementRef,
    private spinner: NgxSpinnerService
  ) 
  { 
  
  }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    this.userProfile = this.commonserviceService.getUserProfile();
    this.userId = this.userProfile.userId;
    this.profileId = this.userProfile.profileId;
    this.schoolId = this.userProfile.school;
   this.getSchoolClasses();
  //  this.getSubject(this.classId);
    this.initializeForm();
     this.el.nativeElement.querySelector("[formControlName=classId]").focus();
  }
  initializeForm(){

    this.indicatorForm = this.formBuilder.group({
      userId:[this.userId],
      profileId:[this.profileId],
      classId: [
        this.classId,
        [Validators.required],
      ],
      subjectId: [
        this.subjectId,
        [Validators.required],
        ],
        indicator: [
          this.indicator,
          [Validators.required,Validators.maxLength(300),this.customValidators.firstCharValidatorRF],
          ],

    
    })
  }
  // getSchoolClasses(schoolEncId: string) {
  //   this.classChanged = true;
  //   if (schoolEncId !== "") {
  //     this.schoolService
  //       .getSchoolClasses(schoolEncId)
  //       .subscribe((res: any = []) => {
  //         this.classList = res.data;
  //         this.classChanged = false;
  //       });
  //   }
  // }
  getSchoolClasses()
   {
    this.classChanged = true;
    this.commonserviceService.getCommonAnnexture(['CLASS_TYPE'],true).subscribe((res: any) => {
      this.classList = res.data;
    this.classList = this.classList.CLASS_TYPE;
    this.classChanged = false;
   });
   }
  getSubject(classId:any) {
    this.spinner.show();
    this.getSubjectLoading = true;
    this.Manageindicatorservice.getSubject(classId).subscribe((res: any) => {
    this.subjectData = res;
    this.subjectData = this.subjectData.data;
    this.subject = this.subjectData.subjectId;
   this.encId = this.subjectData.encId;
    this.spinner.hide();
    this.getSubjectLoading = false;
    });
  }
  onSubmit()
  {
    if (this.indicatorForm.invalid) {
      this.customValidators.formValidationHandler(this.indicatorForm, this.allLabel, this.el);
    }

    if (this.indicatorForm.invalid) {
      return;
    }

    if (this.indicatorForm.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show(); 
          this.Manageindicatorservice
            .addIndicator(this.indicatorForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
              this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Indicator created successfully",
                    "success"
                  )
                  .then(() => {
                    this.initializeForm();
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


