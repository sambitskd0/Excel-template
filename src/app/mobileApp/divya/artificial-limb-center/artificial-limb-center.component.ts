import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { DivyaService } from '../services/divya.service';

@Component({
  selector: 'app-artificial-limb-center',
  templateUrl: './artificial-limb-center.component.html',
  styleUrls: ['./artificial-limb-center.component.css']
})
export class ArtificialLimbCenterComponent implements OnInit {
  artLimbForm!:FormGroup;

  noOfExpertPosted: any = '';
  noOfExpertPresent: any = '';
  noOfEvaluatedStd: any = '';
  noOfMadeStd: any = '';
  noOfDevicesRepaired: any = '';
  noOfDevicesReadyToDistribute: any = '';
  rawMatAvailability: any = '1';
  sufficientFurniture: any = '1';
  electricity: any = '1';
  lightFan: any = '1';
  sufficientEquipments: any = '1';
  cleanlinessStatus: any = '1';

  allLabel: string[] = [
    'How many experts are posted in the centre ',
    'How many experts are present during inspection ',
    'How many students are evaluated in present financial year ',
    'How many artificial limb of students are made in the present financial year ',
    'How many old artificial limb of students are repaired in the present financial year ',
    'How many artificial limbs and ingredients for distribution are ready ',
  ];
  tokenParams:any="";
  centerName:any="";
  userDetails!: any;
  constructor(
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private el: ElementRef,
    private spinner: NgxSpinnerService,
    private divyaService: DivyaService,
    private route: ActivatedRoute,
    private jwtHelper: JwtHelperService,
    private router: Router,
  ) { }
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
      this.artLimbForm = this.formBuilder.group({
        noOfExpertPosted:[this.noOfExpertPosted,[Validators.required,Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ],
        noOfExpertPresent:[this.noOfExpertPresent,[Validators.required,Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ],
        noOfEvaluatedStd:[this.noOfEvaluatedStd,[Validators.required,Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ],
        noOfMadeStd:[this.noOfMadeStd,[Validators.required,Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ],
        noOfDevicesRepaired:[this.noOfDevicesRepaired,[Validators.required,Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ],
        noOfDevicesReadyToDistribute:[this.noOfDevicesReadyToDistribute,[Validators.required,Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ],
        rawMatAvailability:[this.rawMatAvailability],
        sufficientFurniture:[this.sufficientFurniture],
        electricity:[this.electricity],
        lightFan:[this.lightFan],
        sufficientEquipments:[this.sufficientEquipments],
        cleanlinessStatus:[this.cleanlinessStatus],
    });
  }

  onSubmit(){
    if ("INVALID" === this.artLimbForm.status) {
      for (const key of Object.keys(this.artLimbForm.controls)) {
        if (this.artLimbForm.controls[key].status === "INVALID") {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + key + '"]'
          );
          invalidControl.focus();
          this.customValidators.formValidationHandler(
            this.artLimbForm,
            this.allLabel
          );
          break;
        }
      }
    }
    if (this.artLimbForm.invalid) {
      return;
    }
    if (this.artLimbForm.valid === true) {
      this.alertHelper.submitAlert().then((result: any) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.divyaService
            .saveArtificialLimb(this.artLimbForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Artificial Limb inspection data saved successfully.",
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

  maxLimitChk(maxLimitCntrl:string,compareCntrl:string,maxLimitCntrlLabel:string,compareCntrlLabel:string){
    let mlc = (this.artLimbForm.get(maxLimitCntrl)?.value > 0)?parseInt(this.artLimbForm.get(maxLimitCntrl)?.value):0;
    let cc = (this.artLimbForm.get(compareCntrl)?.value > 0)?parseInt(this.artLimbForm.get(compareCntrl)?.value): 0;
    if(cc>mlc){
      this.alertHelper.viewAlertHtml("error", "Invalid inputs", maxLimitCntrlLabel +" can not be empty " )
      .then((res: any) => {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="' + maxLimitCntrl + '"]'
        );
        this.artLimbForm.get(compareCntrl)?.patchValue("");
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
          this.artLimbForm.get(compareCntrl)?.patchValue("");
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
      this.artLimbForm.get(controlname)?.patchValue(event.target.value);
    }
    var charCode = event.which ? event.which : event.keyCode;

    if (charCode < 48 || charCode > 57) {
      event.target.value = event.target.value.replace(/[^\d]/g,'');
      this.artLimbForm.get(controlname)?.patchValue(event.target.value);
      return false;      
    } else {
      return true;
    }
  }

}
