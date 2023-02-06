import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { NgxSpinnerService } from 'ngx-spinner';
import { DivyaService } from '../services/divya.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-artificial-limb-center-teacher',
  templateUrl: './artificial-limb-center-teacher.component.html',
  styleUrls: ['./artificial-limb-center-teacher.component.css']
})
export class ArtificialLimbCenterTeacherComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private el: ElementRef,
    private alertHelper: AlertHelper, 
    private spinner: NgxSpinnerService,
    private divyaService: DivyaService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  artLimbTeacherForm!:FormGroup;

  noOfRegisteredCwsn: any = '';
  noOfPresentCwsn: any = '';
  noOfAssessedCwsn: any = '';
  noOfMeasuredCwsn: any = '';
  noOfDevicesPrepared: any = '';
  noOfDevicesRepaired: any = '';
  rawMatAvailability: any = '1';
  noOfDevicesReadyToDistribute: any = '';

  allLabel: string[] = [
    'Registered CWSN in current financial year ',
    'Present CWSN ',
    'Total no of CWSN were assessed for P&O purposes in current financial year ',
    'Total no of CWSN were measured for P&O in current financial year ',
    'Number of devices prepared in current financial year ',
    'How many old devices were repaired ',
    'Availability of raw materials',
    'How many devices were ready to be distribution'
  ];
  centerName:any="";
  userDetails!: any;
  ngOnInit(): void {
    this.getUserDetails() ;
    this.initializeForm();    
  }
  getUserDetails() {
    this.divyaService.getTokenDetails(this.route, this.router);
    this.divyaService.tokenEmitter.subscribe((res: any) => {
      this.userDetails = res;
      this.centerName=this.userDetails.activityCenterName;
    });
  }
  initializeForm() {
      this.artLimbTeacherForm = this.formBuilder.group({
        noOfRegisteredCwsn:[this.noOfRegisteredCwsn,[Validators.required,Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ],
        noOfPresentCwsn:[this.noOfPresentCwsn,[Validators.required,Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ],
        noOfAssessedCwsn:[this.noOfAssessedCwsn,[Validators.required,Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ],
        noOfMeasuredCwsn:[this.noOfMeasuredCwsn,[Validators.required,Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ],
        noOfDevicesPrepared:[this.noOfDevicesPrepared,[Validators.required,Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ],
        noOfDevicesRepaired:[this.noOfDevicesRepaired,[Validators.required,Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ],
        rawMatAvailability:[this.rawMatAvailability,[Validators.required,Validators.pattern(/^[0-9]\d*$/)]],
        noOfDevicesReadyToDistribute:[this.noOfDevicesReadyToDistribute,[Validators.required,Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ],        
    });
  }

  onSubmit(){   
    if ("INVALID" === this.artLimbTeacherForm.status) {
      for (const key of Object.keys(this.artLimbTeacherForm.controls)) {
        if (this.artLimbTeacherForm.controls[key].status === "INVALID") {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + key + '"]'
          );
          invalidControl.focus();
          this.customValidators.formValidationHandler(this.artLimbTeacherForm,this.allLabel);
          break;
        }
      }
    }
    if (this.artLimbTeacherForm.invalid) {
      return;
    }

    if (this.artLimbTeacherForm.valid === true) {
      this.alertHelper.submitAlert().then((result: any) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.divyaService
            .saveArtificialLimbCenterTeacher(this.artLimbTeacherForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Artificial Limb Inspection data saved successfully.",
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
              }
            });
        }
      });
    }
  }
  maxLimitChk(maxLimitCntrl:string,compareCntrl:string,maxLimitCntrlLabel:string,compareCntrlLabel:string){
    let mlc = (this.artLimbTeacherForm.get(maxLimitCntrl)?.value > 0)?parseInt(this.artLimbTeacherForm.get(maxLimitCntrl)?.value):0;
    let cc = (this.artLimbTeacherForm.get(compareCntrl)?.value > 0)?parseInt(this.artLimbTeacherForm.get(compareCntrl)?.value): 0;
    if(cc>mlc){
      this.alertHelper.viewAlertHtml("error", "Invalid inputs", maxLimitCntrlLabel +" can not be empty " )
      .then((res: any) => {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="' + maxLimitCntrl + '"]'
        );
        this.artLimbTeacherForm.get(compareCntrl)?.patchValue("");
        invalidControl.focus();
      }); 
    }
    if(mlc > 0 && cc > 0){
      if(mlc < cc){
        this.alertHelper.viewAlertHtml("error", "Invalid inputs", compareCntrlLabel+" can not be greater than "+maxLimitCntrlLabel)
        .then((res: any) => {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + compareCntrl + '"]'
          );
          this.artLimbTeacherForm.get(compareCntrl)?.patchValue("");
          invalidControl.focus();
        }); 
      }
    }
  }
  
  resetForm(){
    this.initializeForm();
  }
  
  keyUpInputNumber(event: any, controlname:any, maxLength: number=3) {
    if(event.target.value.length > maxLength){
      event.target.value=event.target.value.substr(0, maxLength);
      this.artLimbTeacherForm.get(controlname)?.patchValue(event.target.value);
    }
    var charCode = event.which ? event.which : event.keyCode;

    if (charCode < 48 || charCode > 57) {
      event.target.value = event.target.value.replace(/[^\d]/g,'');
      this.artLimbTeacherForm.get(controlname)?.patchValue(event.target.value);
      return false;      
    } else {
      return true;
    }
  }

}
