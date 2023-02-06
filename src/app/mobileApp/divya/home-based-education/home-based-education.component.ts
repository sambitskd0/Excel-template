import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { DivyaService } from '../services/divya.service';

@Component({
  selector: 'app-home-based-education',
  templateUrl: './home-based-education.component.html',
  styleUrls: ['./home-based-education.component.css']
})
export class HomeBasedEducationComponent implements OnInit {
  homeBasedEducationForm!:FormGroup;
  cwsnName:any="";
  gaonTolaMuhalla:any="";
  block="";
  district:any="";
  disabilityType:any="";
  enrollmentStatus:any="1";
  schoolName:any="";
  teacherVisited:any="";
  lastVisitDate:any="";

  allDisabilityType: any = [];  
  disabilityTypeChanged:boolean = false; 

  allLabel: string[] = [
    "Name of CWSN",
    "Gaon / Tola / Muhalla",
    "Name of District",
    "Name of Block",    
    "Type of Disability",
    "Enrollment Status",
    "Name of school",
    "How many times visited by tagged Special Teacher",
    "Date of last visit by Resource teacher / Rehabilitation Professionals"];
    showSchoolName: boolean = true;
    filterChangedBlock: boolean = false;
    districtData:any="";
    blockData:any="";
    maxDate:any =Date;

  constructor(
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private alertHelper: AlertHelper,
    private el: ElementRef,
    private commonserviceService:CommonserviceService,
    private divyaService: DivyaService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.maxDate =new Date();
   }
  ngOnInit(): void {
    this.initializeForm();
    this.getAllDistrict();
    this.getDisabilityType();
  }

  initializeForm() {
    this.homeBasedEducationForm = this.formBuilder.group({
      cwsnName: [this.cwsnName,[Validators.required,Validators.pattern(/^[a-zA-Z0-9 ,.'\-\s]+$/),this.customValidators.firstCharValidatorRF,Validators.maxLength(120)]],
      gaonTolaMuhalla: [this.gaonTolaMuhalla,[Validators.required,Validators.maxLength(120),Validators.pattern('[-_a-zA-Z0-9 ]*')]],
      district: [this.district,[Validators.required]],
      block: [this.block,[Validators.required,]],      
      disabilityType: [this.disabilityType,[Validators.required]],
      enrollmentStatus: [this.enrollmentStatus,[Validators.required]], 
      schoolName: [this.schoolName,[Validators.maxLength(250),Validators.pattern(/^[a-zA-Z0-9 ,.'\-\s]+$/),this.customValidators.firstCharValidatorRF,this.conditionalValidator(() => this.homeBasedEducationForm?.get("enrollmentStatus")?.value,Validators.required,"conditionalValidation","schoolName")]],
      teacherVisited: [this.teacherVisited,[Validators.required,Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)]],
      lastVisitDate: [this.lastVisitDate,[Validators.required]],
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
    
  getAllDistrict(){
    this.divyaService.getAllDistrict().subscribe((data:[])=>{
      this.districtData = data;
      this.districtData = this.districtData.data;     
     }); 
  }

  getBlock(id: any) {
    this.filterChangedBlock = true;
    this.homeBasedEducationForm.patchValue({
      block: "",
    });
    
    const districtId = id;
    this.blockData = [];
    if (districtId !== "") {
      this.divyaService.getBlockByDistrictid(districtId).subscribe((res: any)=> {
        let data: any = res;
        for (let key of Object.keys(data["data"])) {
          this.blockData.push(data["data"][key]);
        }
        this.filterChangedBlock = false;
      });
    } else {
      this.homeBasedEducationForm.patchValue({
        block: "",
      });
      this.filterChangedBlock = false;
    }
  }

  getDisabilityType(){
    this.disabilityTypeChanged = true;
    this.divyaService.getAnextureType('DISABILITY_TYPE').subscribe((data: any)=>{
      this.allDisabilityType = data;
      this.allDisabilityType = this.allDisabilityType.data;
    this.disabilityTypeChanged = false;
    });
  }
  onEnrollmentStatusChange(val: any) {
    this.homeBasedEducationForm.patchValue({
      schoolName: "",
    });
    this.enrollmentStatus = val;
    if(this.enrollmentStatus==1){
      this.showSchoolName = true;
    }else{
      this.showSchoolName = false;
    }
}
  onSubmit(){
    if ("INVALID" === this.homeBasedEducationForm.status) {
      for (const key of Object.keys(this.homeBasedEducationForm.controls)) {
        if (this.homeBasedEducationForm.controls[key].status === "INVALID") {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + key + '"]'
          );
          invalidControl.focus();
          this.customValidators.formValidationHandler(this.homeBasedEducationForm,this.allLabel);
          break;
        }
      }
    }
    if (this.homeBasedEducationForm.invalid) {
      return;
    }
    if (this.homeBasedEducationForm.valid === true) {
      this.alertHelper.submitAlert().then((result: any) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.divyaService
            .saveHomeBasedEducation(this.homeBasedEducationForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Home Based Education inspection data saved successfully.",
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

  keyUpInputNumber(event: any, controlname:any, maxLength: number=3) {
    if(event.target.value.length > maxLength){
      event.target.value=event.target.value.substr(0, maxLength);
      this.homeBasedEducationForm.get(controlname)?.patchValue(event.target.value);
    }
    var charCode = event.which ? event.which : event.keyCode;

    if (charCode < 48 || charCode > 57) {
      event.target.value = event.target.value.replace(/[^\d]/g,'');
      this.homeBasedEducationForm.get(controlname)?.patchValue(event.target.value);
      return false;      
    } else {
      return true;
    }
  }

  resetForm(){
    this.enrollmentStatus="1";
    this.onEnrollmentStatusChange(this.enrollmentStatus);
    this.initializeForm();
  }

}
