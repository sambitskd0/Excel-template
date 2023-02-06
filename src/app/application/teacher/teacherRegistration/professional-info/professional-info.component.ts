/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 14-06-2022
 * Description : Teacher professional info.
 **/

 import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
 import { ActivatedRoute, Router } from "@angular/router";
 import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
 import { AlertHelper } from "src/app/core/helpers/alert-helper";
 import { CustomValidators } from "src/app/shared/validations/custom-validators";
 import { NgxSpinnerService } from "ngx-spinner";
 import { RegistrationService } from "../../services/registration.service";
 import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";
 import { HeaderComponent } from "../header/header.component";
 import { CommonserviceService } from "src/app/core/services/commonservice.service";
 
 @Component({
   selector: "app-professional-info",
   templateUrl: "./professional-info.component.html",
   styleUrls: ["./professional-info.component.css"],
 })
 export class ProfessionalInfoComponent implements OnInit,AfterViewInit {
   @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;
   @ViewChild("professionalQualificationTypeRef", { static: false }) professionalQualificationTypeRef!: ElementRef;
   // ======== member variable declaration
   teacherId: string | null = "";
   professionalInfoForm!: any;
   professionalQualificationTypes: Array<any> = [];
   sectionList: Array<any> = [{ sectionName: "", sectionNameOdia: "" }];
   newAttribute: any = {};
   allYears: Array<number> = [];
   disableFields: boolean = false;
   existingProfessionalInfo!: any;
   singleField: boolean = true; // single row will not have action column
   professionalQualificationType: string = "";
   yearOfPassing: string = "";
   schoolCollege: string = "";
   boardCouncilUniversity: string = "";
   subject: string = "";
   marksObtained!: number;
   fullMarks!: number;
   percentage!: number;
   professionalLabel: string[] = this.getCustomizedLabelName("");
   teacherDob: string = "";
   draftStatus: boolean = false;
   isEditted: boolean = false;
   public userProfile = JSON.parse(
     sessionStorage.getItem("userProfile") || "{}"
   );
   loginUserType = this.userProfile.loginUserTypeId;
   userDesignation = this.userProfile.designationId;
   constructor(
     private activatedRoute: ActivatedRoute,
     private router: Router,
     private registrationService: RegistrationService,
     private formBuilder: FormBuilder,
     private spinner: NgxSpinnerService,
     private alertHelper: AlertHelper,
     public customValidators: CustomValidators,
     public commonFunctionHelper: CommonFunctionHelper,
     private commonService: CommonserviceService,
     private el: ElementRef
   ) {
     // get teacher id
     this.teacherId = this.activatedRoute.snapshot.paramMap?.get("id");
   }
 
   ngOnInit(): void {
     this.professionalQualificationTypeRef?.nativeElement.focus();
     //this.el.nativeElement?.professionalQualificationTypeRef?.focus();
     this.spinner.show();
     this.initializeForm(); // initialize form
     this.getTeacherDetails();
     // this.getProfessionalQualificationType();
     this.getAnnextureData();
     this.getExistingProfessionalInfo();
   }
   ngAfterViewInit(): void {
     this.professionalQualificationTypeRef?.nativeElement.focus();
 }
   getAnnextureData() {
     this.commonService
       .getCommonAnnexture(["TCHR_PROFESSIONAL_QUALIFICATION"],true)
       .subscribe({
         next: (res: any) => {
           this.spinner.hide(); 
            this.professionalQualificationTypes = res?.data?.TCHR_PROFESSIONAL_QUALIFICATION;
          
         },
       });
   }
   getTeacherDetails() {
     this.registrationService.getTeacherDetails(this.teacherId).subscribe({
       next: (res: any) => {
         if (res.success === true) {
           this.draftStatus = res.draftSubmitted;
           this.headerComponent.disableNavHelper(res.draftSubmitted);
           this.teacherDob = res.data.dobYear;
 
           this.yearFieldSetup(); // set year field
           this.spinner.hide();
         }
       },
       error: (err: any) => {
         this.spinner.hide();
       },
     });
   }
   // ==== setup reactive form
   initialFormSetup() {
     if (!this.professionalInfo()?.length) {
       this.addRow(); // add row at first
     }
   }
   // ======  initialize preServiceForm
   initializeForm() {
     this.professionalInfoForm = this.formBuilder.group({
       professionalArray: this.formBuilder.array([]), // store all data in this array
     });
   }
   // ====== get customized label names
   getCustomizedLabelName(educationTypeName: string) {  
     return [
       `Professional qualification`,
       `${educationTypeName} :- Year of passing`,
       `${educationTypeName} :- Institution/college`,
       `${educationTypeName} :- Board/council/university`,
       `${educationTypeName} :- Marks obtained`,
       `${educationTypeName} :- Full marks`,
       `${educationTypeName} :- Percentage`,
     ];
   }
   // getProfessionalQualificationType() {
   //   this.registrationService.getProfessionalQualificationType().subscribe({
   //     next: (res: any) => {
   //       if (
   //         res.success === true &&
   //         this.professionalQualificationTypes.length === 0
   //       )
   //         this.professionalQualificationTypes = res.data;
   //     },
   //     error: (err: any) => {
   //       this.spinner.hide();
   //     },
   //   });
   // }
   // ======= get existing teacher educational ifo
   getExistingProfessionalInfo() {
     this.registrationService
       .getExistingProfessionalInfo(this.teacherId)
       .subscribe({
         next: (res: any) => {
           this.existingProfessionalInfo = res.professionalInfo;
           if (this.existingProfessionalInfo?.length) {
             this.disableFields = true;
             this.fillFieldsWithExistingData();
           } else {
             this.initialFormSetup();
           }
         },
         error: (err: any) => {
           this.spinner.hide();
         },
       });
   }
   // add row
   addRow() {
     let emptyRow: Boolean = false;
     this.professionalInfo()?.controls?.map((item: any, index: number) => {
       if (emptyRow === true) return;
       if (item?.invalid) {
         this.alertHelper.successAlert(
           "Invalid",
           "Empty/invalid professional qualification found",
           "error"
         );
         emptyRow = true;
       }
     });
     if (emptyRow === false) {
       this.professionalInfo().push(this.newEducation());
     }
     this.checkSingleField();
   }
   checkSingleField() {
     this.singleField = this.professionalInfo()?.length > 1 ? false : true;
     console.log(this.singleField);
     
   }
   yearFieldSetup() {
     /**
      * Teacher passing year should be Teacher dob + 18 year
      * */
     let currentYear = new Date().getFullYear();
     let validYear = parseInt(this.teacherDob) + 18;
 
     while (validYear < currentYear) {
       this.allYears.push(currentYear--);
     }
   }
   // show number of row according to preServiceEducationalInfoArray items
   professionalInfo(): FormArray {
     return this.professionalInfoForm.get("professionalArray") as FormArray;
   }
 
   // remove row
   removeRow(index: any) {
     this.professionalInfo().length > 1 &&
       this.professionalInfo().removeAt(index);
     this.checkSingleField();
   }
   enableFields() {
     this.isEditted = this.disableFields;
     this.disableFields = !this.disableFields;
     this.initializeForm(); // initialize form
     this.fillFieldsWithExistingData();
   }
   resetProfessionalForm() {
     this.initializeForm(); // initialize form
     this.initialFormSetup();
     this.disableFields = false;
   }
   calculatePercentage(marksObtained: any, fullMarks: any, formIndex: any) {
     if (parseInt(marksObtained.value) > parseInt(fullMarks?.value)) {
       this.alertHelper
         .successAlert(
           "Invalid",
           "Mark obtained can't be greater than full mark",
           "error"
         )
         .then((res: any) => {
           fullMarks.focus();
         });
     } else if (
       parseInt(marksObtained.value) >= 0 &&
       parseInt(fullMarks?.value) >= 0
     ) {
       let percent: string | number =
         (parseInt(marksObtained.value) / parseInt(fullMarks?.value)) * 100;
       percent = percent % 1 === 0 ? percent : percent.toFixed(2);
       this.professionalInfoForm?.controls?.professionalArray?.controls?.map(
         (res: any, curIndex: number) => {
           if (formIndex === curIndex) {
             res.patchValue({
               percentage: percent,
             });
           }
         }
       );
     } else {
       this.professionalInfoForm?.controls?.professionalArray?.controls?.map(
         (res: any, curIndex: number) => {
           if (formIndex === curIndex) {
             res.patchValue({
               percentage: "",
             });
           }
         }
       );
     }
   }
   // new row form data
   newEducation(): FormGroup {
     return this.formBuilder.group({
       professionalQualificationType: [
         this.professionalQualificationType,
         [Validators.required, Validators.pattern(/^[0-9]+$/)],
       ],
       yearOfPassing: [
         this.yearOfPassing,
         [Validators.required, Validators.pattern(/^[0-9]+$/)],
       ],
       institutionCollege: [
         this.schoolCollege,
         [Validators.required,Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/),this.customValidators.firstCharValidatorRF],
       ],
       boardCouncilUniversity: [
         this.boardCouncilUniversity,
         [Validators.required,Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/),this.customValidators.firstCharValidatorRF],
       ],
       marksObtained: [
         this.marksObtained,
         [Validators.required,Validators.maxLength(4), Validators.pattern(/^[0-9.]+$/),this.customValidators.firstCharValidatorRF],
       ],
       fullMarks: [
         this.fullMarks,
         [Validators.required,Validators.maxLength(4), Validators.pattern(/^[0-9.]+$/),this.customValidators.firstCharValidatorRF],
       ],
       percentage: [
         {
           value: this.percentage,
           disabled: true,
         },
         [Validators.required,Validators.maxLength(5),Validators.pattern(/^[0-9.]+$/),],
       ],
     });
   }
   saveAsDraft() {
     if (this.existingProfessionalInfo && this.disableFields === false) {
       this.validateProfessionalForm();
     } else {
       this.alertHelper.successAlert("No changes found.", " ", "info");
     }
     if (!this.existingProfessionalInfo) {
       this.validateProfessionalForm();
     }
   }
   validateProfessionalForm() {
     Promise.all([
       this.validateProfessionalData(),
       this.checkDuplicateQualificationType(),
     ]).then((value) => {
       const formErrors = value[0];
       const duplicateQualificationTypeError = value[1];
       if (duplicateQualificationTypeError === true) {
         this.alertHelper.successAlert(
           "Invalid",
           "Duplicate education type found",
           "error"
         );
       } else {
         let formInvalid: any = false;
         formErrors.map((item: any) => {
           if (item !== false) {
             formInvalid = true;
           }
         });
         formInvalid === false && this.completeSaveAsDraft();
       }
     });
   }
   checkDuplicateQualificationType(): any {
     let allValueArray: Array<number> = [];
 
     this.professionalInfoForm?.controls?.professionalArray?.value.map(
       async (item: any) => {
         allValueArray.push(parseInt(item?.professionalQualificationType));
       }
     );
     const uniqueSet = new Set(allValueArray);
     if (allValueArray.length != uniqueSet.size) {
       return true;
     } else {
       return false;
     }
   }
   validateProfessionalData(): any {
     let allErrors: any = [];
     this.professionalInfoForm?.controls?.professionalArray?.controls?.map(
       (professionalFormGroups: FormGroup, index: number): any => {
         this.professionalQualificationTypes?.map((item: any) => {
           if (
             item?.anxtValue ==
             professionalFormGroups?.controls?.["professionalQualificationType"]
               ?.value
           ) {
             this.professionalLabel = this.getCustomizedLabelName(
               item?.anxtName
             );
           }
         });
         let errors = this.customValidators.formValidationHandler(
           professionalFormGroups,
           this.professionalLabel
         );
         allErrors.push(errors);
       }
     );
     return allErrors;
   }
   completeSaveAsDraft() {
    console.log(this.professionalInfoForm);
    
     this.alertHelper.submitAlert().then((result) => {
       if (result.value) {
         this.spinner.show();
         this.registrationService
           .saveProfessionalInfAsDraft(
             this.teacherId,
             this.professionalInfoForm?.getRawValue()
           )
           .subscribe({
             next: (res: any) => {
               this.spinner.hide();
 
               if (res.status === "SUCCESS") {
                 this.alertHelper
                   .successAlert("Saved!", res?.msg, "success")
                   .then((res: any) => {
                     // this.ngOnInit();
                     this.spinner.show();
                     this.initializeForm();
                     this.getExistingProfessionalInfo();
                   });
               }
             },
             error: (error: any) => {
               
               this.spinner.hide(); //==== hide spinner
               // ==== convert object to array
               const result: any = Object.keys(error.error.msg).map((key) => [
                 error.error.msg[key],
               ]);
 
               let errorMessage: string = "";
               if (typeof error.error.msg === "string") {
                 errorMessage +=
                   '<i class="bi bi-arrow-right text-danger"></i> ' +
                   error.error.msg +
                   `<br>`;
               } else {
                 result.map(
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
           });
       }
     });
   }
   checkDuplicateType() {
     if (this.checkDuplicateQualificationType() === true) {
       this.alertHelper.successAlert(
         "Invalid",
         "Duplicate education type found",
         "error"
       );
     }
   }
   fillFieldsWithExistingData() {
     this.existingProfessionalInfo.map((item: any) => {
       this.professionalInfo().push(
         this.formBuilder.group({
           professionalQualificationType: [
             {
               value: item.professionalQualificationType,
               disabled: this.disableFields,
             },
             [Validators.required, Validators.pattern(/^[0-9]+$/)],
           ],
           yearOfPassing: [
             {
               value: item.yearOfPassing,
               disabled: this.disableFields,
             },
             [Validators.required, Validators.pattern(/^[0-9]+$/)],
           ],
           institutionCollege: [
             {
               value: item.institutionCollege,
               disabled: this.disableFields,
             },
             [
               Validators.required,
               this.customValidators.firstCharValidatorRF,
               Validators.maxLength(100),
               Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/),
             ],
           ],
           boardCouncilUniversity: [
             {
               value: item.boardCouncilUniversity,
               disabled: this.disableFields,
             },
             [
               Validators.required,
               this.customValidators.firstCharValidatorRF,
               Validators.maxLength(100),
               Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/),
             ],
           ],
 
           marksObtained: [
             {
               value: item.marksObtained,
               disabled: this.disableFields,
             },
             [
               Validators.required,
               this.customValidators.firstCharValidatorRF,
               Validators.maxLength(3), Validators.pattern(/^[0-9.]+$/)
             ],
           ],
           fullMarks: [
             {
               value: item.totalMark,
               disabled: this.disableFields,
             },
             [
               Validators.required,
               this.customValidators.firstCharValidatorRF,
               Validators.maxLength(3),
               Validators.pattern(/^[0-9.]+$/),
             ],
           ],
           percentage: [
             {
               value: item.percentage,
               disabled: true,
             },
             [Validators.required,Validators.maxLength(5),Validators.pattern(/^[0-9.]+$/)],
           ],
         })
       );
     });
     this.spinner.hide();
     this.checkSingleField();
   }
 
   pageChangeWarningHandler(path: string) {
     let isFormFilled: boolean = false;
     const professionalInfoObj =
       this.professionalInfoForm?.controls?.professionalArray?.value[0];   
     for (const property in professionalInfoObj) {
       if (professionalInfoObj[property]) {
         isFormFilled = true;
         break;
       }
     }
     if (isFormFilled === true ) { // && this.isEditted === true  add this if need in case of edit
       this.commonFunctionHelper.pageChangeWarningHandler(
         path,
         this.teacherId,
         this.activatedRoute
       );
     } else {
       this.router.navigate([path, this.teacherId], {
         relativeTo: this.activatedRoute,
       });
     }
   }
 }
 