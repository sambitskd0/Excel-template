import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,ValidatorFn,Validators } from '@angular/forms';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import {CustomValidators} from 'src/app/shared/validations/custom-validators';
import { NgxSpinnerService } from "ngx-spinner";
import { LibraryattendanceService } from '../../services/libraryattendance.service';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { Router } from '@angular/router';



@Component({
  selector: 'app-add-libraryattendance',
  templateUrl: './add-libraryattendance.component.html',
  styleUrls: ['./add-libraryattendance.component.css']
})
export class AddLibraryattendanceComponent implements OnInit {
  config = new Constant();
  libraryAttendanceForm!:FormGroup;
  allErrorMessages: string[] = [];
  academicYear: any = this.config.getAcademicCurrentYear();
  allLabel: string[] = 
  [
  "",
  "",
  "Is library open today",
  "Number of teacher who visited the library",
  "Number of teacher who returned the book",
  "Number of teacher who issued the book",
  "Number of student who visited the library",
  "Number of student who returned the book",
  "Number of student who issued the book",
  "Specify the reason why the library is closed",
  ""
  ];
  optionValue:any="";
  submitted = false;
  plPrivilege:string="view"; //For menu privilege
  adminPrivilege: boolean = false;
  userId:any="";
  profileId:any="";
  isLibraryOpen:any="0";
  teacherVisitedCount:any="";
  teacherReturnedCount:any="";
  teacherIssuedCount:any="";
  studentVisitedCount:any="";
  studentReturnedCount:any="";
  studentIssuedCount:any="";
  reason:any="";
  schoolId:any="";
  teacherCountData:any=[];
  techCount:any="";
  studCount:any="";

  constructor(private formBuilder:FormBuilder, 
    private alertHelper:AlertHelper,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege 
    public customValidators:CustomValidators,
    public libraryattendanceservice:LibraryattendanceService,
    private router:Router,
    public commonserviceService:CommonserviceService,
    private el:ElementRef,
    private spinner: NgxSpinnerService) 
    {
      const pageUrl:any = this.router.url;  
      this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
      this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization  
     }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.schoolId = users?.school;
    this.getTeacherCount(this.schoolId, this.academicYear);
    this.initializeForm();
  }
  getTeacherCount(schoolId: any, academicYear: any) {
    this.spinner.show();
    this.libraryattendanceservice
      .getTeacherCount(schoolId, academicYear)
      .subscribe((res: any) => {
        this.teacherCountData = res.data;
         this.techCount = this.teacherCountData?.teacherCnt;
         this.studCount = this.teacherCountData?.studentCnt;
         console.log(this.techCount,"dshd",this.studCount)
        this.spinner.hide();
      });
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

       // validation logic for teacherVisitedCount
       if (validationType === "teacherVisitedCount" && parentValue == 1) {
        conditionStatus = true;
      } 
      // validation logic for teacherReturnedCount
      if (validationType === "teacherReturnedCount" && parentValue == 1) {
        conditionStatus = true;
      } 
      // validation logic for teacherIssuedCount
      if (validationType === "teacherIssuedCount" && parentValue == 1) {
        conditionStatus = true;
      } 
      // validation logic for studentVisitedCount
      if (validationType === "studentVisitedCount" && parentValue == 1) {
        conditionStatus = true;
      } 
      // validation logic for studentReturnedCount
      if (validationType === "studentReturnedCount" && parentValue == 1) {
        conditionStatus = true;
      } 
      // validation logic for studentIssuedCount
      if (validationType === "studentIssuedCount" && parentValue == 1) {
        conditionStatus = true;
      } 
       // validation logic for reason
       if (validationType === "reason" && parentValue == 2) {
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
  teacherValidation(cntrlName:any,msg:any){
    let mlc = this.libraryAttendanceForm?.get(cntrlName)?.value;
    if(mlc > this.techCount ){
      this.alertHelper.viewAlert("error","Invalid",msg)
            .then((res: any) => {
              const invalidControl = this.el.nativeElement.querySelector(
                '[formControlName="' + cntrlName + '"]'
              );
              invalidControl.focus();
            }); 
        }
  }
  studentValidation(cntrlName:any,msg:any){
    let mlc = this.libraryAttendanceForm?.get(cntrlName)?.value;
    if(mlc > this.studCount ){
      this.alertHelper.viewAlert("error","Invalid",msg)
            .then((res: any) => {
              const invalidControl = this.el.nativeElement.querySelector(
                '[formControlName="' + cntrlName + '"]'
              );
              invalidControl.focus();
            }); 
        }
  }
  initializeForm(){
    this.libraryAttendanceForm = this.formBuilder.group({
      userId:[this.userId],
      profileId:[this.profileId],
      isLibraryOpen: [
        this.isLibraryOpen,
        [Validators.required],
      ],
      teacherVisitedCount: [
        this.teacherVisitedCount,
        [ 
          this.conditionalValidator(
          () => this.libraryAttendanceForm?.get("isLibraryOpen")?.value,
          Validators.required,
          "conditionalValidation",
          "teacherVisitedCount"
        ),
        Validators.pattern('^[0-9]*$'), 
        ],
        ],
      teacherReturnedCount: [
        this.teacherReturnedCount,
        [
          this.conditionalValidator(
          () => this.libraryAttendanceForm?.get("isLibraryOpen")?.value,
          Validators.required,
          "conditionalValidation",
          "teacherReturnedCount"
        ),
        Validators.pattern('^[0-9]*$'), 
        ],
        ],
      teacherIssuedCount: [
        this.teacherIssuedCount,
        [
          this.conditionalValidator(
          () => this.libraryAttendanceForm?.get("isLibraryOpen")?.value,
          Validators.required,
          "conditionalValidation",
          "teacherIssuedCount"
        ),
        Validators.pattern('^[0-9]*$'), 
        ],
        ],
      studentVisitedCount: [
        this.studentVisitedCount,
        [
          this.conditionalValidator(
          () => this.libraryAttendanceForm?.get("isLibraryOpen")?.value,
          Validators.required,
          "conditionalValidation",
          "studentVisitedCount"
        ),
        Validators.pattern('^[0-9]*$'), 
        ],
        ],
      studentReturnedCount: [
        this.studentReturnedCount,
        [ 
          this.conditionalValidator(
          () => this.libraryAttendanceForm?.get("isLibraryOpen")?.value,
          Validators.required,
          "conditionalValidation",
          "studentReturnedCount"
        ),
        Validators.pattern('^[0-9]*$'), 
        ],
        ],
      studentIssuedCount: [
        this.studentIssuedCount,
        [
          this.conditionalValidator(
          () => this.libraryAttendanceForm?.get("isLibraryOpen")?.value,
          Validators.required,
          "conditionalValidation",
          "studentIssuedCount"
        ),
        Validators.pattern('^[0-9]*$'), 
        ],
        ],
      reason: [
        this.reason,
        [ 
          this.conditionalValidator(
          () => this.libraryAttendanceForm?.get("isLibraryOpen")?.value,
          Validators.required,
          "conditionalValidation",
          "reason"
        ),
        ],
        ], 
        schoolId:[
          this.schoolId,
        ],           
    
    })
  }
  libraryRadioControl(val:any)
  {
    this.libraryAttendanceForm.patchValue({
      teacherVisitedCount: "",
    });
    this.libraryAttendanceForm.patchValue({
      teacherReturnedCount: "",
    });
    this.libraryAttendanceForm.patchValue({
      teacherIssuedCount: "",
    });
    this.libraryAttendanceForm.patchValue({
      studentVisitedCount: "",
    });
    this.libraryAttendanceForm.patchValue({
      studentReturnedCount: "",
    });
    this.libraryAttendanceForm.patchValue({
      studentIssuedCount: "",
    });
    this.libraryAttendanceForm.patchValue({
      reason: "",
    });

    for (const key of Object.keys(this.libraryAttendanceForm.controls)) {
      if (this.libraryAttendanceForm.controls[key].status === "INVALID") {
        this.libraryAttendanceForm.controls[key].setErrors(null);
      }
    }
  }
  onSubmit()
  {
    this.submitted = true;
    // if ("INVALID" === this.libraryAttendanceForm.status) {
    // for (const key of Object.keys(this.libraryAttendanceForm.controls)) {
    //     if (this.libraryAttendanceForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.libraryAttendanceForm,this.allLabel);
    //       break;
    //     }
    //   }
    // }
    if(this.libraryAttendanceForm.invalid){
      this.customValidators.formValidationHandler(this.libraryAttendanceForm, this.allLabel, this.el);
    }
    if (this.libraryAttendanceForm.invalid) {
      return;
    }
    if (this.libraryAttendanceForm.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show(); 
          this.libraryattendanceservice
            .addLibraryAttendance(this.libraryAttendanceForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
              this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Libraryattendance created successfully",
                    "success"
                  )
                  .then(() => {
                    this.initializeForm();
                  });
                  this.libraryAttendanceForm.patchValue({
                    isLibraryOpen: "",
                  })
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


