import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { DivyaService } from '../services/divya.service';

@Component({
  selector: 'app-training-teacher',
  templateUrl: './training-teacher.component.html',
  styleUrls: ['./training-teacher.component.css']
})
export class TrainingTeacherComponent implements OnInit {
  trainingTeacherForm!:FormGroup;
  trainingTypeId:any="";
  trainingPlace:any="";
  trainingDuration:any=""; 
  registeredParticipants:any="";
  presentParticipants:any="";
  registeredTrainers:any="";
  presentTrainers:any="";
  trainingType:any="1";
  materialAvailability:any="1";
  allErrorMessages: string[] = [];
  allLabel: string[] = ["Training Type",
  "Name of Training Place",
  "Duration of Training (in Days)",
  "Type of Training",
  "No. of Trainers Registered", 
  "No. of Trainers Present", 
  "No. of Participants Registered", 
  "No. of Participants Present",                                   
   ];
   centerName:any="";
   userDetails!: any;
  trainingTypeChanged: boolean = false;
  allTrainingType: any = [];
  constructor(private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private el: ElementRef,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private divyaService: DivyaService,
    private route: ActivatedRoute,
    private router: Router,) { }

  ngOnInit(): void {
    this.getTrainingType();
    this.getUserDetails() ;
    this.initializeForm();
  }
  getTrainingType() {
    this.trainingTypeChanged = true;
    this.divyaService
      .getAnextureType("DIVYA_TRAINING_TYPE")
      .subscribe((data: any) => {
        this.allTrainingType = data;
        this.allTrainingType = this.allTrainingType.data;
        this.trainingTypeChanged = false;
      });
  }
  getUserDetails() {
    this.divyaService.getTokenDetails(this.route, this.router);
    this.divyaService.tokenEmitter.subscribe((res: any) => {
      this.userDetails = res;
      this.centerName=this.userDetails.activityCenterName;
    });
  }
  initializeForm() {   
    this.trainingTeacherForm = this.formBuilder.group({
      trainingTypeId: [this.trainingTypeId,[Validators.required,] ], 
      trainingPlace: [this.trainingPlace,[Validators.required,Validators.maxLength(100),Validators.pattern(/^[a-zA-Z0-9 ,.'\-\s]+$/),this.customValidators.firstCharValidatorRF] ], 
      trainingDuration: [this.trainingDuration,[Validators.required,Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ],
      trainingType: [this.trainingType,[Validators.required,]],       
      registeredTrainers: [this.registeredTrainers,[Validators.required,Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ], 
      presentTrainers: [this.presentTrainers,[Validators.required,Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)], ],      
      registeredParticipants: [this.registeredParticipants,[Validators.required,Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ], 
      presentParticipants: [this.presentParticipants,[Validators.required,Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ], 
    });
  }
  maxLimitChk(maxLimitCntrl:string,compareCntrl:string,maxLimitCntrlLabel:string,compareCntrlLabel:string){
    let mlc = (this.trainingTeacherForm.get(maxLimitCntrl)?.value > 0)?parseInt(this.trainingTeacherForm.get(maxLimitCntrl)?.value):0;
    let cc = (this.trainingTeacherForm.get(compareCntrl)?.value > 0)?parseInt(this.trainingTeacherForm.get(compareCntrl)?.value): 0;
    if(cc>mlc){
      this.alertHelper.viewAlertHtml("error", "Invalid inputs ", maxLimitCntrlLabel +" can not be empty " )
      .then((res: any) => {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="' + maxLimitCntrl + '"]'
        );
        this.trainingTeacherForm.get(compareCntrl)?.patchValue("");
        invalidControl.focus();
      }); 
    }
    if(mlc > 0 && cc > 0){
      if(mlc < cc){
        this.alertHelper.viewAlertHtml("error", "Invalid inputs ", compareCntrlLabel+" can not be greater than "+maxLimitCntrlLabel)
        .then((res: any) => {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + compareCntrl + '"]'
          );
          this.trainingTeacherForm.get(compareCntrl)?.patchValue("");
          invalidControl.focus();
        }); 
      }
    }
  }

  keyUpInputNumber(event: any, controlname:any, maxLength: number=3) {
    if(event.target.value.length > maxLength){
      event.target.value=event.target.value.substr(0, maxLength);
      this.trainingTeacherForm.get(controlname)?.patchValue(event.target.value);
    }
    var charCode = event.which ? event.which : event.keyCode;

    if (charCode < 48 || charCode > 57) {
      event.target.value = event.target.value.replace(/[^\d]/g,'');
      this.trainingTeacherForm.get(controlname)?.patchValue(event.target.value);
      return false;      
    } else {
      return true;
    }
  }
  onSubmit(){
    // console.log(this.trainingTeacherForm);
    if ("INVALID" === this.trainingTeacherForm.status) {
      for (const key of Object.keys(this.trainingTeacherForm.controls)) {
        if (this.trainingTeacherForm.controls[key].status === "INVALID") {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + key + '"]'
          );
          invalidControl.focus();
          this.customValidators.formValidationHandler(
            this.trainingTeacherForm,
            this.allLabel
          );
          break;
        }
      }
    }
    if (this.trainingTeacherForm.invalid) {
      return;
    }
    if (this.trainingTeacherForm.valid === true) {
      this.alertHelper.submitAlert().then((result: any) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.divyaService
            .saveTrainingDataByTeacher(this.trainingTeacherForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Training visit data saved successfully.",
                    "success"
                  )
                  .then(() => {
                    this.router.navigate(["../success"], {
                      relativeTo: this.route,
                    });
                  });
                this.initializeForm();
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

  resetForm(){
    this.initializeForm();  
  }
}
