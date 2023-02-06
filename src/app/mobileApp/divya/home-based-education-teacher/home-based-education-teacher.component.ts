import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { DivyaService } from '../services/divya.service';

@Component({
  selector: 'app-home-based-education-teacher',
  templateUrl: './home-based-education-teacher.component.html',
  styleUrls: ['./home-based-education-teacher.component.css']
})
export class HomeBasedEducationTeacherComponent implements OnInit {
  homeBasedEducationTeacherForm!:FormGroup;
  cwsnName:any="";
  disabilityType:any="";
  parentName:any="";
  parentMobile:any="";
  teacherVisited:any="";
  enrollmentStatus:any="1";
  schoolName:any="";
  iepItpPrepared:any="1";
  iepItpUpdated:any="1";
  disabilityTypeChanged:boolean = false; 
  allDisabilityType: any = []; 
  showSchoolName: boolean = true;
  allLabel: string[] = [
    "Name of CWSN",
    "Type of Disability",
    "Name of Father / Parent",
    "Mobile no of CWSN / Father/parent",
    "No. of visits in current financial year",
    "Enrollment Status",
    "Name of school",
    "Whether IEP/ITP has been prepared ",
    "Whether IEP/ITP has been updated "];
    
  constructor(
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private alertHelper: AlertHelper,
    private el: ElementRef,
    private divyaServices: DivyaService, 
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.getDisabilityType();
    this.initializeForm();
  }
  getDisabilityType(){
    this.disabilityTypeChanged = true;
    this.divyaServices.getAnextureType('DISABILITY_TYPE').subscribe((data: any)=>{
      this.allDisabilityType = data;
      this.allDisabilityType = this.allDisabilityType.data;
      this.disabilityTypeChanged = false;
    });
  }
  onEnrollmentStatusChange(val: any) {
    this.homeBasedEducationTeacherForm.patchValue({
      schoolName: "",
    });
    this.enrollmentStatus = val;
    if(this.enrollmentStatus==1){
      this.showSchoolName = true;
    }else{
      this.showSchoolName = false;
    }
}
  initializeForm() {
    this.homeBasedEducationTeacherForm = this.formBuilder.group({
      cwsnName: [this.cwsnName,[Validators.required,Validators.pattern(/^[a-zA-Z0-9 ,.'\-\s]+$/),this.customValidators.firstCharValidatorRF,Validators.maxLength(100)] ], 
      disabilityType: [this.disabilityType,[Validators.required] ], 
      parentName: [this.parentName,[Validators.required,Validators.pattern('[-_a-zA-Z0-9 ]*'),Validators.maxLength(100)] ], 
      parentMobile: [this.parentMobile,[Validators.required,Validators.maxLength(10),Validators.pattern(/^[0-9]\d*$/)] ], 
      teacherVisited: [this.teacherVisited,[Validators.required,Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ],  
      enrollmentStatus: [this.enrollmentStatus,[Validators.required] ], 
      schoolName: [this.schoolName,[Validators.maxLength(250),Validators.pattern(/^[a-zA-Z0-9 ,.'\-\s]+$/),this.customValidators.firstCharValidatorRF,this.conditionalValidator(() => this.homeBasedEducationTeacherForm?.get("enrollmentStatus")?.value,Validators.required,"conditionalValidation","schoolName")]], 
      iepItpPrepared: [this.iepItpPrepared,[Validators.required] ], 
      iepItpUpdated: [this.iepItpUpdated,[Validators.required] ], 
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

      // validation logic for schoolName
      if (validationType === "schoolName" && parentValue == 1) {
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
    
  onSubmit(){
    if ("INVALID" === this.homeBasedEducationTeacherForm.status) {
      for (const key of Object.keys(this.homeBasedEducationTeacherForm.controls)) {
        if (this.homeBasedEducationTeacherForm.controls[key].status === "INVALID") {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + key + '"]'
          );
          invalidControl.focus();
          this.customValidators.formValidationHandler(this.homeBasedEducationTeacherForm,this.allLabel);
          break;
        }
      }
    }
    if (this.homeBasedEducationTeacherForm.invalid) {
      return;
    }
    if (this.homeBasedEducationTeacherForm.valid === true) {
      this.alertHelper.submitAlert().then((result: any) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.divyaServices
            .saveHomeBasedEducationTeacher(this.homeBasedEducationTeacherForm.getRawValue())
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Home based education visit data saved successfully.",
                    "success"
                  )
                  .then(() => {
                    this.router.navigate(["../success"], {
                      relativeTo: this.route,
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
              // complete: () => console.log('done'),
            });
        }
      });
    } 
  }

  iepItpPreparedHandle(val:any){
    this.iepItpPrepared = val;
    if(val==2){
      this.homeBasedEducationTeacherForm.get("iepItpUpdated")?.patchValue(val);
      this.homeBasedEducationTeacherForm?.get('iepItpUpdated')?.disable();
    }else{
      this.homeBasedEducationTeacherForm?.get('iepItpUpdated')?.enable(); 
    }
  }


  keyUpInputNumber(event: any, controlname:any, maxLength: number=3) {
    if(event.target.value.length > maxLength){
      event.target.value=event.target.value.substr(0, maxLength);
      this.homeBasedEducationTeacherForm.get(controlname)?.patchValue(event.target.value);
    }
    var charCode = event.which ? event.which : event.keyCode;

    if (charCode < 48 || charCode > 57) {
      event.target.value = event.target.value.replace(/[^\d]/g,'');
      this.homeBasedEducationTeacherForm.get(controlname)?.patchValue(event.target.value);
      return false;      
    } else {
      return true;
    }
  }

  resetForm(){
    this.enrollmentStatus='1';
    this.onEnrollmentStatusChange(this.enrollmentStatus);
    this.iepItpPrepared = '1';
    this.iepItpPreparedHandle(this.iepItpPrepared);
    this.initializeForm();
  }

}
