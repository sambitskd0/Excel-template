import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { DivyaService } from '../services/divya.service';

@Component({
  selector: 'app-kgbv',
  templateUrl: './kgbv.component.html',
  styleUrls: ['./kgbv.component.css']
})
export class KgbvComponent implements OnInit {
  
  kgbvForm!:FormGroup;
  showHi: boolean = true;
  KGVBOption:any="1";

  totalCwsnGirls:any="";
  presentCwsnGirls:any="";
  efficiencyType:any="1";
  taggedTeacherCome:any="1";
  TLMAvailable:any="1";

  hearingAid:any="";
  wordBook:any="";
  articulationBook:any="";
  storyBook:any="";
  puzzle:any="";
  mirror:any="";
  groupHearingAid:any="";
  speechTrainerMachine:any="";
  extraBattery:any="";
  TLMHI:any="";

  brailler:any="";
  brailleSlate:any="";
  abacus:any="";
  tellerFrame:any="";
  stick:any="";
  soundBall:any="";
  chess:any="";
  geometryKit:any="";
  tactileMap:any="";
  tactileGlobe:any="";
  braillePaper:any="";
  brailleBooks:any="";
  TLMVI:any="";
  allLabel: string[] = [
  "Type of CWSN Category",
  "Total Enrolled CWSN Girls (It should be maximum 25)",
  "Present CWSN Girls",
  "What is the condition of class relative efficiency of CWSN Girls",
  "Is tagged specific teacher are coming daily or according to roster",
  "Is there TLM for girl child use",
  "Hearing Aid","Word book","Articulation Book","Story Book","Puzzle","Mirror","Group Hearing Aid","Speech Trainer Machine","Extra battery for hearing aid","TLM",
  
  "Brailler","Braille Slate","Abacus","Teller Frame","Stick (White Cane)","Sound Ball","Chess","Geometry Kit","Tactile Map","Tactile Globe","Braille Paper","Braille Books","TLM"           ];
  centerName:any="";
  userDetails!: any;
  
  constructor(private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private alertHelper: AlertHelper,
    private divyaService: DivyaService,
    private spinner: NgxSpinnerService,    
    private route: ActivatedRoute,
    private router: Router,
    private el: ElementRef) { }
  
  ngOnInit(): void {
    this.getUserDetails();
    this.initializeForm();
  }

  getUserDetails() {
    this.divyaService.getTokenDetails(this.route, this.router);
    // check if side nav status
    this.divyaService.tokenEmitter.subscribe((res: any) => {
      this.userDetails = res;
      this.centerName=this.userDetails.activityCenterName;
    });
  }

  initializeForm() {
    this.kgbvForm = this.formBuilder.group({
      KGVBOption: [this.KGVBOption,[Validators.required,] ], 
      totalCwsnGirls: [this.totalCwsnGirls,[Validators.required,Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ], 
      presentCwsnGirls: [this.presentCwsnGirls,[Validators.required,Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ], 
      efficiencyType: [this.efficiencyType,[Validators.required,Validators.required] ], 
      taggedTeacherCome: [this.taggedTeacherCome,[Validators.required,] ], 
      TLMAvailable: [this.TLMAvailable,[Validators.required,] ], 
      hearingAid: [this.hearingAid,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ], 
      wordBook: [this.wordBook,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ], 
      articulationBook: [this.articulationBook,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ], 
      storyBook: [this.storyBook,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ], 
      puzzle: [this.puzzle,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ], 
      mirror: [this.mirror,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ], 
      groupHearingAid: [this.groupHearingAid,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ], 
      speechTrainerMachine: [this.speechTrainerMachine,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ], 
      extraBattery: [this.extraBattery,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ], 
      TLMHI: [this.TLMHI,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ], 
      brailler: [this.brailler,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ], 
      brailleSlate: [this.brailleSlate,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ], 
      abacus: [this.abacus,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ], 
      tellerFrame: [this.tellerFrame,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ], 
      stick: [this.stick,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ], 
      soundBall: [this.soundBall,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ], 
      chess: [this.chess,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ], 
      geometryKit: [this.geometryKit,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ], 
      tactileMap: [this.tactileMap,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ], 
      tactileGlobe: [this.tactileGlobe,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ], 
      braillePaper: [this.braillePaper,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ], 
      brailleBooks: [this.brailleBooks,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ], 
      TLMVI: [this.TLMVI,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ],  
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

      // validation logic for hearingAid
      if (validationType === "hearingAid" && parentValue == 1) {
        conditionStatus = true;
      }  
      // validation logic for wordBook
      if (validationType === "wordBook" && parentValue == 1) {
        conditionStatus = true;
      }  
      // validation logic for articulationBook
      if (validationType === "articulationBook" && parentValue == 1) {
        conditionStatus = true;
      }  
      // validation logic for storyBook
      if (validationType === "storyBook" && parentValue == 1) {
        conditionStatus = true;
      }  
      // validation logic for puzzle
      if (validationType === "puzzle" && parentValue == 1) {
        conditionStatus = true;
      }  
      // validation logic for mirror
      if (validationType === "mirror" && parentValue == 1) {
        conditionStatus = true;
      }  
      // validation logic for groupHearingAid
      if (validationType === "groupHearingAid" && parentValue == 1) {
        conditionStatus = true;
      }  
      // validation logic for speechTrainerMachine
      if (validationType === "speechTrainerMachine" && parentValue == 1) {
        conditionStatus = true;
      }  
      // validation logic for extraBattery
      if (validationType === "extraBattery" && parentValue == 1) {
        conditionStatus = true;
      }  
      // validation logic for TLMHI
      if (validationType === "TLMHI" && parentValue == 1) {
        conditionStatus = true;
      }  


      // validation logic for brailler
      if (validationType === "brailler" && parentValue == 2) {
        conditionStatus = true;
      }  
      // validation logic for brailleSlate
      if (validationType === "brailleSlate" && parentValue == 2) {
        conditionStatus = true;
      }  
      // validation logic for abacus
      if (validationType === "abacus" && parentValue == 2) {
        conditionStatus = true;
      }  
      // validation logic for tellerFrame
      if (validationType === "tellerFrame" && parentValue == 2) {
        conditionStatus = true;
      }  
      // validation logic for stick
      if (validationType === "stick" && parentValue == 2) {
        conditionStatus = true;
      }  
      // validation logic for soundBall
      if (validationType === "soundBall" && parentValue == 2) {
        conditionStatus = true;
      }  
      // validation logic for chess
      if (validationType === "chess" && parentValue == 2) {
        conditionStatus = true;
      }  
      // validation logic for geometryKit
      if (validationType === "geometryKit" && parentValue == 2) {
        conditionStatus = true;
      }  
      // validation logic for tactileMap
      if (validationType === "tactileMap" && parentValue == 2) {
        conditionStatus = true;
      }  
      // validation logic for tactileGlobe
      if (validationType === "tactileGlobe" && parentValue == 2) {
        conditionStatus = true;
      }  
      // validation logic for braillePaper
      if (validationType === "braillePaper" && parentValue == 2) {
        conditionStatus = true;
      }  
      // validation logic for brailleBooks
      if (validationType === "brailleBooks" && parentValue == 2) {
        conditionStatus = true;
      }  
      // validation logic for TLMVI
      if (validationType === "TLMVI" && parentValue == 2) {
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
    
  cwsnCategoryChange(val: any) {
      this.KGVBOption = val;
      if(this.KGVBOption==2){
        this.showHi = false;
        this.kgbvForm.patchValue({
          hearingAid: "",
        });
        this.kgbvForm.patchValue({
          wordBook: "",
        });
        this.kgbvForm.patchValue({
          articulationBook: "",
        });
        this.kgbvForm.patchValue({
          storyBook: "",
        });
        this.kgbvForm.patchValue({
          puzzle: "",
        });
        this.kgbvForm.patchValue({
          mirror: "",
        });
        this.kgbvForm.patchValue({
          groupHearingAid: "",
        });
        this.kgbvForm.patchValue({
          speechTrainerMachine: "",
        });
        this.kgbvForm.patchValue({
          extraBattery: "",
        });
        this.kgbvForm.patchValue({
          TLMHI: "",
        });
        
      }else{
        this.showHi = true;
        this.kgbvForm.patchValue({
          brailler: "",
        });
        this.kgbvForm.patchValue({
          brailleSlate: "",
        });
        this.kgbvForm.patchValue({
          abacus: "",
        });
        this.kgbvForm.patchValue({
          tellerFrame: "",
        });
        this.kgbvForm.patchValue({
          stick: "",
        });
        this.kgbvForm.patchValue({
          soundBall: "",
        });
        this.kgbvForm.patchValue({
          chess: "",
        });
        this.kgbvForm.patchValue({
          geometryKit: "",
        });
        this.kgbvForm.patchValue({
          tactileMap: "",
        });
        this.kgbvForm.patchValue({
          tactileGlobe: "",
        });
        this.kgbvForm.patchValue({
          braillePaper: "",
        });
        this.kgbvForm.patchValue({
          brailleBooks: "",
        });
        this.kgbvForm.patchValue({
          TLMVI: "",
        });
      }
  }

  onSubmit(){
    if ("INVALID" === this.kgbvForm.status) {
      for (const key of Object.keys(this.kgbvForm.controls)) {
        if (this.kgbvForm.controls[key].status === "INVALID") {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + key + '"]'
          );
          invalidControl.focus();
          this.customValidators.formValidationHandler(this.kgbvForm,this.allLabel);
          break;
        }
      }
    }
    if (this.kgbvForm.invalid) {
      return;
    }
    if (this.kgbvForm.valid === true) {
      if(this.checkAppliances()){
        this.alertHelper.submitAlert().then((result: any) => {
          if (result.value) {
            this.spinner.show(); // ==== show spinner
            this.divyaService
              .saveKGBV(this.kgbvForm.value)
              .subscribe({
                next: (res: any) => {
                  this.spinner.hide(); //==== hide spinner
                  this.alertHelper
                    .successAlert(
                      "Saved!",
                      "KGBV inspection data saved successfully.",
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
  }

  maxLimitChk(maxLimitCntrl:string,compareCntrl:string,errMsg:string){

    let mlc = (this.kgbvForm.get(maxLimitCntrl)?.value)?parseInt(this.kgbvForm.get(maxLimitCntrl)?.value):0;
    let cc  = (this.kgbvForm.get(compareCntrl)?.value)?parseInt(this.kgbvForm.get(compareCntrl)?.value):0;

    if(mlc > 25){
      this.alertHelper.viewAlertHtml("error", "Invalid inputs", "Total Enrolled CWSN Girls should be maximum 25")
      .then((res: any) => {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="' + maxLimitCntrl + '"]'
        );
        invalidControl.focus();
      }); 
    }
    if(mlc > 0 && cc > 0){
      if(mlc < cc){
        this.alertHelper.viewAlertHtml("error", "Invalid inputs", errMsg)
        .then((res: any) => {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + compareCntrl + '"]'
          );
          this.kgbvForm.get(compareCntrl)?.patchValue("");
          invalidControl.focus();
        }); 
      }
    }

  }

  checkAppliances(){
    let sum = 0; let focusCntrl = '';
    if(this.kgbvForm.get('KGVBOption')?.value == 1){
      focusCntrl = 'hearingAid';
      let hearingAid = (this.kgbvForm.get('hearingAid')?.value > 0)?parseInt(this.kgbvForm.get('hearingAid')?.value):0;
      let wordBook = (this.kgbvForm.get('wordBook')?.value > 0)?parseInt(this.kgbvForm.get('wordBook')?.value):0;
      let articulationBook = (this.kgbvForm.get('articulationBook')?.value > 0)?parseInt(this.kgbvForm.get('articulationBook')?.value):0;
      let storyBook = (this.kgbvForm.get('storyBook')?.value > 0)?parseInt(this.kgbvForm.get('storyBook')?.value):0;
      let puzzle = (this.kgbvForm.get('puzzle')?.value > 0)?parseInt(this.kgbvForm.get('puzzle')?.value):0;
      let mirror = (this.kgbvForm.get('mirror')?.value > 0)?parseInt(this.kgbvForm.get('mirror')?.value):0;
      let groupHearingAid = (this.kgbvForm.get('groupHearingAid')?.value > 0)?parseInt(this.kgbvForm.get('groupHearingAid')?.value):0;
      let speechTrainerMachine = (this.kgbvForm.get('speechTrainerMachine')?.value > 0)?parseInt(this.kgbvForm.get('speechTrainerMachine')?.value):0;
      let extraBattery = (this.kgbvForm.get('extraBattery')?.value > 0)?parseInt(this.kgbvForm.get('extraBattery')?.value):0;
      let TLMHI = (this.kgbvForm.get('TLMHI')?.value > 0)?parseInt(this.kgbvForm.get('TLMHI')?.value):0;

      sum = (hearingAid+wordBook+articulationBook+storyBook+puzzle+mirror+groupHearingAid+speechTrainerMachine+extraBattery+TLMHI);

    }else{
      focusCntrl = 'brailler';
      let brailler = (this.kgbvForm.get('brailler')?.value > 0)?parseInt(this.kgbvForm.get('brailler')?.value):0;
      let brailleSlate = (this.kgbvForm.get('brailleSlate')?.value > 0)?parseInt(this.kgbvForm.get('brailleSlate')?.value):0;
      let abacus = (this.kgbvForm.get('abacus')?.value > 0)?parseInt(this.kgbvForm.get('abacus')?.value):0;
      let tellerFrame = (this.kgbvForm.get('tellerFrame')?.value > 0)?parseInt(this.kgbvForm.get('tellerFrame')?.value):0;
      let stick = (this.kgbvForm.get('stick')?.value > 0)?parseInt(this.kgbvForm.get('stick')?.value):0;
      let soundBall = (this.kgbvForm.get('soundBall')?.value > 0)?parseInt(this.kgbvForm.get('soundBall')?.value):0;
      let chess = (this.kgbvForm.get('chess')?.value > 0)?parseInt(this.kgbvForm.get('chess')?.value):0;
      let geometryKit = (this.kgbvForm.get('geometryKit')?.value > 0)?parseInt(this.kgbvForm.get('geometryKit')?.value):0;
      let tactileMap = (this.kgbvForm.get('tactileMap')?.value > 0)?parseInt(this.kgbvForm.get('tactileMap')?.value):0;
      let tactileGlobe = (this.kgbvForm.get('tactileGlobe')?.value > 0)?parseInt(this.kgbvForm.get('tactileGlobe')?.value):0;
      let braillePaper = (this.kgbvForm.get('braillePaper')?.value > 0)?parseInt(this.kgbvForm.get('braillePaper')?.value):0;
      let brailleBooks = (this.kgbvForm.get('brailleBooks')?.value > 0)?parseInt(this.kgbvForm.get('brailleBooks')?.value):0;
      let TLMVI = (this.kgbvForm.get('TLMVI')?.value > 0)?parseInt(this.kgbvForm.get('TLMVI')?.value):0;

      sum = (brailler+brailleSlate+abacus+tellerFrame+stick+soundBall+chess+geometryKit+tactileMap+tactileGlobe+braillePaper+brailleBooks+TLMVI);

    }
    if(sum==0){
      const invalidControl = this.el.nativeElement.querySelector(
        '[formControlName="'+focusCntrl+'"]'
      );
      invalidControl.focus();
  
      this.alertHelper.viewAlertHtml(
        "error",
        "Invalid inputs",
        "Please enter atleast one available appliances count."
      );
      return false;
    }else{
      return true;
    }  
  }

  keyUpInputNumber(event: any, controlname:any, maxLength: number=3) {
    if(event.target.value.length > maxLength){
      event.target.value=event.target.value.substr(0, maxLength);
      this.kgbvForm.get(controlname)?.patchValue(event.target.value);
    }
    var charCode = event.which ? event.which : event.keyCode;

    if (charCode < 48 || charCode > 57) {
      event.target.value = event.target.value.replace(/[^\d]/g,'');
      this.kgbvForm.get(controlname)?.patchValue(event.target.value);
      return false;      
    } else {
      return true;
    }
  }

  resetForm(){
    this.KGVBOption = '1';
    this.cwsnCategoryChange(this.KGVBOption);
    this.initializeForm();
  }

}
