import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SchoolService } from 'src/app/application/school/services/school.service';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageIndicatorService } from '../../services/manage-indicator.service';

@Component({
  selector: 'app-edit-indicator',
  templateUrl: './edit-indicator.component.html',
  styleUrls: ['./edit-indicator.component.css']
})
export class EditIndicatorComponent implements OnInit {
  indicatorForm!: FormGroup;
  id: number = 0;
  indicatorData: any;
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
    public customValidator:CustomValidators,
    private formBuilder:FormBuilder,
    public Manageindicatorservice:ManageIndicatorService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private route: Router,
    private router: ActivatedRoute,
    private schoolService: SchoolService,
    private el:ElementRef,
    public commonserviceService:CommonserviceService,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    this.userProfile = this.commonserviceService.getUserProfile();
    this.userId = this.userProfile.userId;
    this.profileId = this.userProfile.profileId;
    this.schoolId = this.userProfile.school;
   this.getSchoolClasses();
   this.id = this.router.snapshot.params["encId"];
   //this.getSubject();
    this.initializeForm();
    this.el.nativeElement.querySelector("[formControlName=classId]").focus();
    this.getIndicator(this.id);
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
          [Validators.required,Validators.maxLength(300),this.customValidator.firstCharValidatorRF],
          ],
          encId: [this.encId],
    
    })
  }
  /* getSchoolClasses(schoolEncId: string) {
    this.classChanged = true;
    if (schoolEncId !== "") {
      this.schoolService
        .getSchoolClasses(schoolEncId)
        .subscribe((res: any = []) => {
          this.classList = res.data;
          this.classChanged = false;
        });
    }
  } */
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
  getIndicator(id: any) {
    this.spinner.show();
    this.Manageindicatorservice.getIndicator(this.id).subscribe((res: any) => {
    this.indicatorData = res;
    this.indicatorData = this.indicatorData.data;
    this.classId = this.indicatorData.classId;
    this.subjectId = this.indicatorData.subjectId;
    this.indicator = this.indicatorData.indicator;
   this.encId = this.indicatorData.encId;
   this.getSubject(this.classId);
    this.initializeForm();
    this.spinner.hide();
    });
  }
  onSubmit()
  {
    if (this.indicatorForm.invalid) {
      this.customValidator.formValidationHandler(this.indicatorForm, this.allLabel, this.el);
    }

    if (this.indicatorForm.invalid) {
      return;
    }

    if (this.indicatorForm.valid === true) {
      this.alertHelper.updateAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          this.Manageindicatorservice
            .updateIndicator(this.indicatorForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Indicator updated successfully",
                    "success"
                  )
                  .then(() => {
                    this.route.navigate(["../../view"], {
                      relativeTo: this.router,
                    });
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
  onCancel()
  {
    this.route.navigate(["../../view"], {
      relativeTo: this.router,
    }); 
  }
  }

