import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { DivyaService } from '../services/divya.service';

@Component({
  selector: 'app-kgbv-teacher',
  templateUrl: './kgbv-teacher.component.html',
  styleUrls: ['./kgbv-teacher.component.css']
})
export class KgbvTeacherComponent implements OnInit {
  
  token!: any;
  kgbvTeacherForm!:FormGroup;
  showHi: boolean = true;

  KGVBOption:any="1";

  totalCwsnGirls:any="";
  presentCwsnGirls:any="";
  noOfIEP:any="";
  noOfAssistiveDevices:any="";
  noOfEducationalDevices:any="";
  noOfTLM:any="";

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

    "Total Enrolled CWSN Girls",
    "Total Present",

    "How many CWSN Girls have IEP",
    "How many CWSN Girls have Assistive Devices",
    "How many CWSN Girls have Educational Devices",
    "How many CWSN Girls were given Individual TLM",

    "Hearing Aid","Word book","Articulation Book","Story Book","Puzzle","Mirror","Group Hearing Aid","Speech Trainer Machine","Extra battery for hearing aid","TLM",
    
    "Brailler","Braille Slate","Abacus","Teller Frame","Stick (White Cane)","Sound Ball","Chess","Geometry Kit","Tactile Map","Tactile Globe","Braille Paper","Braille Books","TLM"  

  ];
  centerName:any="";
  userDetails!: any;
  constructor(private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private alertHelper: AlertHelper,
    private route: ActivatedRoute,
    private router: Router,
    private divyaService: DivyaService,
    private spinner: NgxSpinnerService,
    private el: ElementRef) { }

  ngOnInit(): void {
    this.getToken();
    this.getUserDetails();
    this.initializeForm();
  }

  getToken() {
    this.divyaService.getTokenDetails(this.route, this.router);
    // check if side nav status
    this.divyaService.tokenEmitter.subscribe((res: any) => {
      this.token = res;
    });
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
    this.kgbvTeacherForm = this.formBuilder.group({
      KGVBOption: [this.KGVBOption,[Validators.required,] ], 
      totalCwsnGirls: [this.totalCwsnGirls,[Validators.required,Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ], 
      presentCwsnGirls: [this.presentCwsnGirls,[Validators.required,Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ], 
      noOfIEP: [this.noOfIEP,[Validators.required,Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ], 
      noOfAssistiveDevices: [this.noOfAssistiveDevices,[Validators.required,Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ], 
      noOfEducationalDevices: [this.noOfEducationalDevices,[Validators.required,Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ], 
      noOfTLM: [this.noOfTLM,[Validators.required,Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)] ], 

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
      // createdBy:[this.userProfile.userId]
    });
  }

  cwsnCategoryChange(val: any) {
      this.KGVBOption = val;
      if(this.KGVBOption==2){
        this.showHi = false;
        this.kgbvTeacherForm.patchValue({
          hearingAid: "",
        });
        this.kgbvTeacherForm.patchValue({
          wordBook: "",
        });
        this.kgbvTeacherForm.patchValue({
          articulationBook: "",
        });
        this.kgbvTeacherForm.patchValue({
          storyBook: "",
        });
        this.kgbvTeacherForm.patchValue({
          puzzle: "",
        });
        this.kgbvTeacherForm.patchValue({
          mirror: "",
        });
        this.kgbvTeacherForm.patchValue({
          groupHearingAid: "",
        });
        this.kgbvTeacherForm.patchValue({
          speechTrainerMachine: "",
        });
        this.kgbvTeacherForm.patchValue({
          extraBattery: "",
        });
        this.kgbvTeacherForm.patchValue({
          TLMHI: "",
        });
        
      }else{
        this.showHi = true;
        this.kgbvTeacherForm.patchValue({
          brailler: "",
        });
        this.kgbvTeacherForm.patchValue({
          brailleSlate: "",
        });
        this.kgbvTeacherForm.patchValue({
          abacus: "",
        });
        this.kgbvTeacherForm.patchValue({
          tellerFrame: "",
        });
        this.kgbvTeacherForm.patchValue({
          stick: "",
        });
        this.kgbvTeacherForm.patchValue({
          soundBall: "",
        });
        this.kgbvTeacherForm.patchValue({
          chess: "",
        });
        this.kgbvTeacherForm.patchValue({
          geometryKit: "",
        });
        this.kgbvTeacherForm.patchValue({
          tactileMap: "",
        });
        this.kgbvTeacherForm.patchValue({
          tactileGlobe: "",
        });
        this.kgbvTeacherForm.patchValue({
          braillePaper: "",
        });
        this.kgbvTeacherForm.patchValue({
          brailleBooks: "",
        });
        this.kgbvTeacherForm.patchValue({
          TLMVI: "",
        });
      }
  }

  onSubmit(){
    if ("INVALID" === this.kgbvTeacherForm.status) {
      for (const key of Object.keys(this.kgbvTeacherForm.controls)) {
        if (this.kgbvTeacherForm.controls[key].status === "INVALID") {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + key + '"]'
          );
          invalidControl.focus();
          this.customValidators.formValidationHandler(this.kgbvTeacherForm,this.allLabel);
          break;
        }
      }
    }
    if (this.kgbvTeacherForm.invalid) {
      return;
    }
    if (this.kgbvTeacherForm.valid === true) {
      if(this.checkMaxLimitForAll() && this.checkAppliances()){
        this.alertHelper.submitAlert().then((result: any) => {
          if (result.value) {
            this.spinner.show(); // ==== show spinner
            this.divyaService
              .saveKGBVTeacher(this.kgbvTeacherForm.value)
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

  checkMaxLimitForAll(){    
    let totalCwsnGirls = (this.kgbvTeacherForm.get('totalCwsnGirls')?.value)?parseInt(this.kgbvTeacherForm.get('totalCwsnGirls')?.value):0;
    let presentCwsnGirls = (this.kgbvTeacherForm.get('presentCwsnGirls')?.value)?parseInt(this.kgbvTeacherForm.get('presentCwsnGirls')?.value):0;
    let noOfIEP = (this.kgbvTeacherForm.get('noOfIEP')?.value)?parseInt(this.kgbvTeacherForm.get('noOfIEP')?.value):0;
    let noOfAssistiveDevices = (this.kgbvTeacherForm.get('noOfAssistiveDevices')?.value)?parseInt(this.kgbvTeacherForm.get('noOfAssistiveDevices')?.value):0;
    let noOfEducationalDevices = (this.kgbvTeacherForm.get('noOfEducationalDevices')?.value)?parseInt(this.kgbvTeacherForm.get('noOfEducationalDevices')?.value):0;
    let noOfTLM = (this.kgbvTeacherForm.get('noOfTLM')?.value)?parseInt(this.kgbvTeacherForm.get('noOfTLM')?.value):0;
    let errMsg = '';
    if(totalCwsnGirls < presentCwsnGirls){
      errMsg = 'No. of present CWSN girls can not be greater than enrolled CWSN girls.';
    }else if(totalCwsnGirls < noOfIEP){
      errMsg = 'No. of IEP have CWSN girls can not be greater than enrolled CWSN girls.';
    }else if(totalCwsnGirls < noOfAssistiveDevices){
      errMsg = 'No. of assistive devices have CWSN girls can not be greater than enrolled CWSN girls.';
    }else if(totalCwsnGirls < noOfEducationalDevices){
      errMsg = 'No. of  educational devices have CWSN girls can not be greater than enrolled CWSN girls.';
    }else if(totalCwsnGirls < noOfTLM){
      errMsg = 'No. of given individual TLM can not be greater than enrolled CWSN girls.';
    }
    if(errMsg!=''){
      this.alertHelper.viewAlertHtml("error", "Invalid inputs", errMsg).then((res: any) => {
        const invalidControl = this.el.nativeElement.querySelector('[formControlName="totalCwsnGirls"]');
        invalidControl.focus();
        return false;
      }); 
      return false;
    }else{
      return true;
    }
  }

  maxLimitChk(maxLimitCntrl:string,compareCntrl:string,errMsg:string){

    let mlc = (this.kgbvTeacherForm.get(maxLimitCntrl)?.value)?parseInt(this.kgbvTeacherForm.get(maxLimitCntrl)?.value):0;
    let cc  = (this.kgbvTeacherForm.get(compareCntrl)?.value)?parseInt(this.kgbvTeacherForm.get(compareCntrl)?.value):0;

    if(mlc == 0 && cc > 0){
      this.alertHelper.viewAlertHtml("error", "Invalid inputs", "Please enter total enrolled CWSN girls first.").then((res: any) => {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="' + maxLimitCntrl + '"]'
        );
        this.kgbvTeacherForm.get(compareCntrl)?.patchValue("");
        invalidControl.focus();
        return false;
      }); 
    }

    // if(mlc > 25){
    //   this.alertHelper.successAlert('Total Enrolled CWSN Girls should be maximum 25',"","error")
    //   .then((res: any) => {
    //     const invalidControl = this.el.nativeElement.querySelector(
    //       '[formControlName="' + maxLimitCntrl + '"]'
    //     );
    //     invalidControl.focus();
    //     return false;
    //   }); 
    // }

    if(mlc > 0 && cc > 0){
      if(mlc < cc){
        this.alertHelper.viewAlertHtml("error", "Invalid inputs", errMsg)
        .then((res: any) => {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + compareCntrl + '"]'
          );
          this.kgbvTeacherForm.get(compareCntrl)?.patchValue("");
          invalidControl.focus();
          return false;
        }); 
      }
    }
  }

  checkAppliances(){
    let sum = 0; let focusCntrl = '';
    if(this.kgbvTeacherForm.get('KGVBOption')?.value == 1){
      focusCntrl = 'hearingAid';
      let hearingAid = (this.kgbvTeacherForm.get('hearingAid')?.value > 0)?parseInt(this.kgbvTeacherForm.get('hearingAid')?.value):0;
      let wordBook = (this.kgbvTeacherForm.get('wordBook')?.value > 0)?parseInt(this.kgbvTeacherForm.get('wordBook')?.value):0;
      let articulationBook = (this.kgbvTeacherForm.get('articulationBook')?.value > 0)?parseInt(this.kgbvTeacherForm.get('articulationBook')?.value):0;
      let storyBook = (this.kgbvTeacherForm.get('storyBook')?.value > 0)?parseInt(this.kgbvTeacherForm.get('storyBook')?.value):0;
      let puzzle = (this.kgbvTeacherForm.get('puzzle')?.value > 0)?parseInt(this.kgbvTeacherForm.get('puzzle')?.value):0;
      let mirror = (this.kgbvTeacherForm.get('mirror')?.value > 0)?parseInt(this.kgbvTeacherForm.get('mirror')?.value):0;
      let groupHearingAid = (this.kgbvTeacherForm.get('groupHearingAid')?.value > 0)?parseInt(this.kgbvTeacherForm.get('groupHearingAid')?.value):0;
      let speechTrainerMachine = (this.kgbvTeacherForm.get('speechTrainerMachine')?.value > 0)?parseInt(this.kgbvTeacherForm.get('speechTrainerMachine')?.value):0;
      let extraBattery = (this.kgbvTeacherForm.get('extraBattery')?.value > 0)?parseInt(this.kgbvTeacherForm.get('extraBattery')?.value):0;
      let TLMHI = (this.kgbvTeacherForm.get('TLMHI')?.value > 0)?parseInt(this.kgbvTeacherForm.get('TLMHI')?.value):0;

      sum = (hearingAid+wordBook+articulationBook+storyBook+puzzle+mirror+groupHearingAid+speechTrainerMachine+extraBattery+TLMHI);

    }else{
      focusCntrl = 'brailler';
      let brailler = (this.kgbvTeacherForm.get('brailler')?.value > 0)?parseInt(this.kgbvTeacherForm.get('brailler')?.value):0;
      let brailleSlate = (this.kgbvTeacherForm.get('brailleSlate')?.value > 0)?parseInt(this.kgbvTeacherForm.get('brailleSlate')?.value):0;
      let abacus = (this.kgbvTeacherForm.get('abacus')?.value > 0)?parseInt(this.kgbvTeacherForm.get('abacus')?.value):0;
      let tellerFrame = (this.kgbvTeacherForm.get('tellerFrame')?.value > 0)?parseInt(this.kgbvTeacherForm.get('tellerFrame')?.value):0;
      let stick = (this.kgbvTeacherForm.get('stick')?.value > 0)?parseInt(this.kgbvTeacherForm.get('stick')?.value):0;
      let soundBall = (this.kgbvTeacherForm.get('soundBall')?.value > 0)?parseInt(this.kgbvTeacherForm.get('soundBall')?.value):0;
      let chess = (this.kgbvTeacherForm.get('chess')?.value > 0)?parseInt(this.kgbvTeacherForm.get('chess')?.value):0;
      let geometryKit = (this.kgbvTeacherForm.get('geometryKit')?.value > 0)?parseInt(this.kgbvTeacherForm.get('geometryKit')?.value):0;
      let tactileMap = (this.kgbvTeacherForm.get('tactileMap')?.value > 0)?parseInt(this.kgbvTeacherForm.get('tactileMap')?.value):0;
      let tactileGlobe = (this.kgbvTeacherForm.get('tactileGlobe')?.value > 0)?parseInt(this.kgbvTeacherForm.get('tactileGlobe')?.value):0;
      let braillePaper = (this.kgbvTeacherForm.get('braillePaper')?.value > 0)?parseInt(this.kgbvTeacherForm.get('braillePaper')?.value):0;
      let brailleBooks = (this.kgbvTeacherForm.get('brailleBooks')?.value > 0)?parseInt(this.kgbvTeacherForm.get('brailleBooks')?.value):0;
      let TLMVI = (this.kgbvTeacherForm.get('TLMVI')?.value > 0)?parseInt(this.kgbvTeacherForm.get('TLMVI')?.value):0;

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
      this.kgbvTeacherForm.get(controlname)?.patchValue(event.target.value);
    }
    var charCode = event.which ? event.which : event.keyCode;

    if (charCode < 48 || charCode > 57) {
      event.target.value = event.target.value.replace(/[^\d]/g,'');
      this.kgbvTeacherForm.get(controlname)?.patchValue(event.target.value);
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
