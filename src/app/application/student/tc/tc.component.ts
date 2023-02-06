import { Component, ElementRef, ErrorHandler, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { environment } from 'src/environments/environment';
import * as converter from 'number-to-words';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { Constant } from 'src/app/shared/constants/constant';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentInformationService } from '../services/student-information.service';

@Component({
  selector: 'app-tc',
  templateUrl: './tc.component.html',
  styleUrls: ['./tc.component.css']
})
export class TcComponent implements OnInit {

 @Output("parentSrchFun") parentSrchFun: EventEmitter<any> = new EventEmitter();
 @ViewChild('generateTCModalClose') generateTCModalClose!:any;
 @Input() modalTCInfo: any = "";

 today = new Date();
 adDate = new Date();
 
 TCForm!: FormGroup;

 districtCode: any = '';
 blockCode: any = '';
 schoolCode: any = '';
 permanentAddress: any = '';
 noOfSchlDay: any = '';
 noAttendance: any = '';
 leavingDate: any = '';
 transferReason: any = '';
 stdCharacter: any = '';

 public filePath = environment.filePath;
 studentPhotoIDPath: any = '';

 stdEncId: any = '';
 schoolEncId: any = '';
 stdAcademicInfoId: any = '';

 config = new Constant();
 academicYear:any = this.config.getAcademicCurrentYear();

 allLabel: string[] = [
   // "District Code",
   // "Block Code",
   // "School Code",
   "Address",
   "No. of schooling days",
   "No. of attendance",
   "School leaving date",
   "Reason for leaving the school",
   "Student character",
 ]

 public userProfile = JSON.parse(
   sessionStorage.getItem("userProfile") || "{}"
 );

 constructor(
   private formBuilder: FormBuilder,
   public customValidators: CustomValidators,
   private el:ElementRef,
   private spinner: NgxSpinnerService,
   private alertHelper: AlertHelper,
   private errorHandler: ErrorHandler,
   private studentServices: StudentInformationService,
   private route:Router,
   private router:ActivatedRoute,
 ) { }

 // detect change in survey data
 ngOnChanges(changes: SimpleChanges): void {    
   if (changes["modalTCInfo"]?.firstChange === false) {
     this.modalTCInfo = changes["modalTCInfo"]?.currentValue;
     if(this.modalTCInfo.studentPhotoID !== null && this.modalTCInfo.studentPhotoID.length>0){
       var str = this.modalTCInfo.studentPhotoID;
       var newstr = str.replace('.','~'); 
       this.studentPhotoIDPath = this.filePath+'/'+newstr;   
     }
     this.modalTCInfo.cls  = converter.toOrdinal(this.modalTCInfo.class);
     this.modalTCInfo.dobD = converter.toWords(new Date(this.modalTCInfo.dob).getDate());
     this.modalTCInfo.dobY = converter.toWords(new Date(this.modalTCInfo.dob).getFullYear()).replace(',','');
     this.permanentAddress = this.modalTCInfo.permanentAddress;
     this.schoolCode = this.modalTCInfo.schoolUdiseCode;
     this.stdEncId = this.modalTCInfo.stdEncId;
     this.schoolEncId = this.modalTCInfo.schoolEncId;
     this.stdAcademicInfoId = this.modalTCInfo.stdAcademicInfoId;
     this.adDate = new Date(this.modalTCInfo.admissionDate)
     this.initTCForm();
     //this.el.nativeElement.querySelector('[formControlName="noOfSchlDay"]').focus();
   }
 }

 ngOnInit(): void {   
  //this.el.nativeElement.querySelector('[formControlName="noOfSchlDay"]').focus();
  this.initTCForm();
 }

 initTCForm(){
  const invalidControl = this.el.nativeElement.querySelector(
    '[formControlName="noOfSchlDay"]'
  );
  invalidControl.focus();
  
   this.TCForm = this.formBuilder.group({

     // districtCode:[this.districtCode,Validators.required],
     // blockCode:[this.blockCode,Validators.required],
     // schoolCode:[this.schoolCode,Validators.required],

     permanentAddress: [
       this.permanentAddress,
       [
         Validators.required,
         Validators.maxLength(300),
         Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/),
         this.customValidators.firstCharValidatorRF,
       ],
     ],
     noOfSchlDay:[this.noOfSchlDay,Validators.required],
     noAttendance:[this.noAttendance,Validators.required],
     leavingDate:[this.leavingDate,Validators.required],
     transferReason:[
      this.transferReason,
      [
        Validators.required,
        Validators.maxLength(300),
        Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/),
        this.customValidators.firstCharValidatorRF,
      ],
    ],
     stdCharacter:[
      this.stdCharacter,
      [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/),
        this.customValidators.firstCharValidatorRF,
      ],
    ],

     stdEncId:[this.stdEncId],
     schoolEncId:[this.schoolEncId],
     stdAcademicInfoId:[this.stdAcademicInfoId],

     academicYear:[this.academicYear],

     createdBy: [this.userProfile.userId],
     sessionValue: [this.userProfile],
   });

 }

 compareDate() {
   let ad = this.TCForm.get("admissionDate")?.value;
   let leaving = this.TCForm.get("leavingDate")?.value;
   if (leaving != "" && ad != "") {
     if (new Date(leaving) > new Date(ad)) {
       const invalidControl = this.el.nativeElement.querySelector(
         '[formControlName="leavingDate"]'
       );
       invalidControl.focus();
       this.alertHelper.viewAlertHtml(
         "error",
         "Invalid inputs",
         "School leaving date should not be less than student admission date."
       );
       return false;
     } else {
       return true;
     }
   } else {
     return true;
   }
 }

 comparePresentDay(){
  console.log('inside compare');
  
   let schoolDay = this.TCForm.get("noOfSchlDay")?.value;
   let attendance = this.TCForm.get("noAttendance")?.value;
   //console.log(schoolDay,"bdbd",attendance)
   if (attendance != "" && schoolDay == "") {
     const invalidControl = this.el.nativeElement.querySelector(
       '[formControlName="noOfSchlDay"]'
     );
     invalidControl.focus();
     this.alertHelper.viewAlertHtml(
       "error",
       "Invalid inputs",
       "No of school days cannot be empty"
     );
     return false;
   }else if(attendance != "" && schoolDay != ""){
     if (parseInt(schoolDay) < parseInt(attendance)){
       const invalidControl = this.el.nativeElement.querySelector(
         '[formControlName="noAttendance"]'
       );
       invalidControl.focus();
       this.alertHelper.viewAlertHtml(
         "error",
         "Invalid inputs",
         "No of attendance should not be greater than total school days."
       );
         this.TCForm.patchValue({
           noAttendance: ''
       });
       return false;
     }
   }
   return true;
 }
 
 onSubmit(){
  //  if ("INVALID" === this.TCForm.status) {
  //    for (const key of Object.keys(this.TCForm.controls)) {
  //      if (this.TCForm.controls[key].status === "INVALID") {
  //        const invalidControl = this.el.nativeElement.querySelector(
  //          '[formControlName="' + key + '"]'
  //        );
  //        invalidControl.focus();
  //        this.customValidators.formValidationHandler(this.TCForm,this.allLabel);
  //        break;
  //      }
  //    }
  //  }
  if(this.TCForm.invalid){
    this.customValidators.formValidationHandler(this.TCForm,this.allLabel, this.el);
  }
   if (this.TCForm.valid === true && this.comparePresentDay()) {
     this.alertHelper.submitAlert().then((result: any) => {
       if (result.value) {
         this.spinner.show(); // ==== show spinner
         this.studentServices.generateTC(this.TCForm.value).subscribe({
           next: (res: any) => {
             this.spinner.hide(); //==== hide spinner
             this.alertHelper
               .successAlert(
                 "Saved!",
                 "TC generated successfully.",
                 "success"
               )
               .then(() => {
                 this.generateTCModalClose.nativeElement.click();
                 this.initTCForm();
                 this.parentSrchFun.emit();
                 //this.srchEvent.next('onSearch');
                 // this.route.navigate(["../../transfer/midSession"], {
                 //   relativeTo: this.router,
                 // });
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
           complete: () => console.log("done"),
         });
       }
     });
   }
 }

}
