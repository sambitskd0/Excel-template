import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { DivyaService } from '../services/divya.service';

@Component({
  selector: 'app-camp',
  templateUrl: './camp.component.html',
  styleUrls: ['./camp.component.css']
})
export class CampComponent implements OnInit {
  campForm!:FormGroup
  campType:any="";
  campPlace:any="";
  benefitedCwsn:any="";
  campTypeChanged:boolean = false; 
  allCampType: any = []; 
  allLabel: string[] = [
    "Camp Type",
    "Place of Camp",
    "No of benefited CWSN",    
  ];

  constructor(private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private alertHelper: AlertHelper,
    private el: ElementRef,   
    private route: ActivatedRoute,   
    private router: Router,
    private spinner: NgxSpinnerService,
    private divyaService: DivyaService,
  ) { }

  ngOnInit(): void {
    this.getCampType();
    this.initializeForm();
  }
  
  getCampType(){
    this.campTypeChanged = true;
    this.divyaService.getAnextureType('DIVYA_CAMP_TYPE').subscribe((data: any)=>{
      this.allCampType = data;
      this.allCampType = this.allCampType.data;
      this.campTypeChanged = false;
    });
  }

  initializeForm() {
    this.campForm = this.formBuilder.group({
      campType: [this.campType,Validators.required], 
      campPlace: [this.campPlace,[Validators.required,Validators.maxLength(120),Validators.pattern(/^[a-zA-Z0-9 ,.'\-\s]+$/),this.customValidators.firstCharValidatorRF] ], 
      benefitedCwsn: [this.benefitedCwsn,[Validators.required,Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),this.customValidators.firstCharValidatorRF] ], 
    });
  }

  onSubmit(){
    if ("INVALID" === this.campForm.status) {
      for (const key of Object.keys(this.campForm.controls)) {
        if (this.campForm.controls[key].status === "INVALID") {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + key + '"]'
          );
          invalidControl.focus();
          this.customValidators.formValidationHandler(
            this.campForm,
            this.allLabel
          );
          break;
        }
      }
    }
    if (this.campForm.invalid) {
      return;
    }
    if (this.campForm.valid === true) {
      this.alertHelper.submitAlert().then((result: any) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.divyaService
            .saveCamp(this.campForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Camp visit data saved successfully.",
                    "success"
                  )
                  .then(() => {
                    this.router.navigate(["../success"], {
                      relativeTo: this.route,
                    });
                    this.initializeForm();
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
      this.campForm.get(controlname)?.patchValue(event.target.value);
    }
    var charCode = event.which ? event.which : event.keyCode;

    if (charCode < 48 || charCode > 57) {
      event.target.value = event.target.value.replace(/[^\d]/g,'');
      this.campForm.get(controlname)?.patchValue(event.target.value);
      return false;      
    } else {
      return true;
    }
  }

  resetForm(){
    this.initializeForm();
  }

}
