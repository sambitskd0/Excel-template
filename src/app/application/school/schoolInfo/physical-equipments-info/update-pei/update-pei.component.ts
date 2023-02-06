import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PhysicalEquipmentsInfoService } from '../../../services/physical-equipments-info.service';
import { Constant } from "src/app/shared/constants/constant";
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { CommonFunctionHelper } from 'src/app/core/helpers/common-function-helper';

@Component({
  selector: 'app-update-pei',
  templateUrl: './update-pei.component.html',
  styleUrls: ['./update-pei.component.css']
})

export class UpdatePeiComponent implements OnInit { 
  physicalEquipmentsInfoForm!: FormGroup;
  config = new Constant();
  academicYear:any = this.config.getAcademicCurrentYear();
    /* Initialize form controls */
  encId:any='';
  schoolId:any="";
  isRoomAvailForPrincipal:any="";
  isGirlsCommonRoomAvail:any=""; 
  isStaffRoomAvail:any="";
  isCocurricularRoomAvail:any="";
  isStaffQuarterAvail:any="";
  issciencelaboratoryAvail:any="";
  isSeparateLibraryRoomAvail:any="";
  isComputerRoomAvail:any="";
  isTinkeringLabAvail:any="";
  isSanitaryPadVendingAvail:any="";
  isLaboratoryAvailForPhysics:any="";
  physicsLabCondition:any="";
  isLaboratoryAvailForChemistry:any="";
  chemistryLabCondition:any="";
  isLaboratoryAvailForBiology:any="";
  biologyLabCondition:any="";
  isLaboratoryAvailForMathematics:any="";
  mathematicsLabCondition:any="";
  isLaboratoryAvailForLanguage:any="";
  languageLabCondition:any="";
  isLaboratoryAvailForGeography:any="";
  geographyLabCondition:any="";
  isLaboratoryAvailForHomescience:any="";
  homescienceLabCondition:any="";
  isLaboratoryAvailForPsychology:any="";
  psychologyLabCondition:any="";
  isAudioSystemAvail:any="";
  isScienceKitAvail:any="";
  isMathKitAvail:any="";
  isBiometricDeviceAvail:any="";
  draftStatus:any=1;

  physicalEquipmentInfoData:any="";
  allErrorMessages: string[] = [];
  submitted = false;
  userProfile: any = [];
  userId:any="";
  allLabel: string [] = [
    "",
    "",
    "",
    "Separate room for assistant head teacher/vice principal/head of the school/head teacher/ principal",
    "Separate common room for girls",
    "Staffroom for teachers",
    "Co-curricular activity room/arts and crafts room",
    "Staff quarters (including residential quarters for head teacher/principal and asst. head teacher/vice principal)",
    "Integrated science laboratory (integrated laboratory is the one in which physics, chemistry and biology practical are held) for secondary sections only",
    "Separate room for library",
    "Computer room",
    "Tinkering lab",
    "Sanitary pad vending machine (for co-ed and girls schools)","","","","","","","","","","","","","","","","","","","","","",];
  constructor(
    private router: ActivatedRoute,
    public route: Router,
     private spinner : NgxSpinnerService,
     private formBuilder : FormBuilder,
     public customValidators: CustomValidators,
     private alertHelper: AlertHelper,
     private commonserviceService: CommonserviceService,
     private physicalEquipmentsInfoService: PhysicalEquipmentsInfoService,
     private el: ElementRef,
     public commonFunctionHelper: CommonFunctionHelper,
     ) { }

  ngOnInit(): void {
    this.spinner.show(); 
    this.userProfile = this.commonserviceService.getUserProfile();
    this.userId = this.userProfile?.userId;
    this.encId = this.router.snapshot.params["encId"];
    this.editPhysicalEquipmentInfo(this.encId,this.academicYear);
    this.spinner.hide(); 
    this.initializeForm(); 
  }
  ngAfterViewInit(){
    this.el.nativeElement.querySelector("[formControlName=isRoomAvailForPrincipal]").focus();
  } 
  initializeForm(){
  this.physicalEquipmentsInfoForm = this.formBuilder.group({ 
    encId: [this.encId],
    userId: [this.userId],
    academicYear:[this.academicYear],
    isRoomAvailForPrincipal:[this.isRoomAvailForPrincipal,[Validators.required,Validators.pattern('^[0-9]*$'),]],
    isGirlsCommonRoomAvail:[this.isGirlsCommonRoomAvail,[Validators.required,Validators.pattern('^[0-9]*$'),]],
    isStaffRoomAvail:[this.isStaffRoomAvail,[Validators.required,Validators.pattern('^[0-9]*$'),]],
    isCocurricularRoomAvail:[this.isCocurricularRoomAvail,[Validators.required,Validators.pattern('^[0-9]*$'),]],
    isStaffQuarterAvail:[this.isStaffQuarterAvail,[Validators.required,Validators.pattern('^[0-9]*$'),]],
    issciencelaboratoryAvail:[this.issciencelaboratoryAvail,[Validators.required,Validators.pattern('^[0-9]*$'),]],
    isSeparateLibraryRoomAvail:[this.isSeparateLibraryRoomAvail,[Validators.required,Validators.pattern('^[0-9]*$'),]],
    isComputerRoomAvail:[this.isComputerRoomAvail,[Validators.required,Validators.pattern('^[0-9]*$'),]],
    isTinkeringLabAvail:[this.isTinkeringLabAvail,[Validators.required,Validators.pattern('^[0-9]*$'),]],
    isSanitaryPadVendingAvail:[this.isSanitaryPadVendingAvail,[Validators.required,Validators.pattern('^[0-9]*$'),]],
    isLaboratoryAvailForPhysics:[this.isLaboratoryAvailForPhysics,[Validators.pattern('^[0-9]*$'),]],
    physicsLabCondition:[this.physicsLabCondition,[Validators.pattern('^[0-9]*$'),]],
    isLaboratoryAvailForChemistry:[this.isLaboratoryAvailForChemistry,[Validators.pattern('^[0-9]*$'),]],
    chemistryLabCondition:[this.chemistryLabCondition,[Validators.pattern('^[0-9]*$'),]],
    isLaboratoryAvailForBiology:[this.isLaboratoryAvailForBiology,[Validators.pattern('^[0-9]*$'),]],
    biologyLabCondition:[this.biologyLabCondition,[Validators.pattern('^[0-9]*$'),]],
    isLaboratoryAvailForMathematics:[this.isLaboratoryAvailForMathematics,[Validators.pattern('^[0-9]*$'),]],
    mathematicsLabCondition:[this.mathematicsLabCondition,[Validators.pattern('^[0-9]*$'),]],
    isLaboratoryAvailForLanguage:[this.isLaboratoryAvailForLanguage,[Validators.pattern('^[0-9]*$'),]],
    languageLabCondition:[this.languageLabCondition,[Validators.pattern('^[0-9]*$'),]],
    isLaboratoryAvailForGeography:[this.isLaboratoryAvailForGeography,[Validators.pattern('^[0-9]*$'),]],
    geographyLabCondition:[this.geographyLabCondition,[Validators.pattern('^[0-9]*$'),]],
    isLaboratoryAvailForHomescience:[this.isLaboratoryAvailForHomescience,[Validators.pattern('^[0-9]*$'),]],
    homescienceLabCondition:[this.homescienceLabCondition,[Validators.pattern('^[0-9]*$'),]],
    isLaboratoryAvailForPsychology:[this.isLaboratoryAvailForPsychology,[Validators.pattern('^[0-9]*$'),]],
    psychologyLabCondition:[this.psychologyLabCondition,[Validators.pattern('^[0-9]*$'),]],
    isAudioSystemAvail:[this.isAudioSystemAvail,[Validators.pattern('^[0-9]*$'),]],
    isScienceKitAvail:[this.isScienceKitAvail,[Validators.pattern('^[0-9]*$'),]],
    isMathKitAvail:[this.isMathKitAvail,[Validators.pattern('^[0-9]*$'),]],
    isBiometricDeviceAvail:[this.isBiometricDeviceAvail,[Validators.pattern('^[0-9]*$'),]] ,
    draftStatus:[this.draftStatus, ]
    })
  }
  isLabAvailForPhysics(val:number){
    this.isLaboratoryAvailForPhysics=val;
    this.physicalEquipmentsInfoForm.patchValue({
      physicsLabCondition: ""
    });
  }
  isLabAvailForChemistry(val:number){
    this.isLaboratoryAvailForChemistry=val;
    this.physicalEquipmentsInfoForm.patchValue({
      chemistryLabCondition: ""
    });
  }
  isLabAvailForBiology(val:number){
    this.isLaboratoryAvailForBiology=val;
    this.physicalEquipmentsInfoForm.patchValue({
      biologyLabCondition: ""
    });
  }
  isLabAvailForMathematics(val:number){
    this.isLaboratoryAvailForMathematics=val;
    this.physicalEquipmentsInfoForm.patchValue({
      mathematicsLabCondition: ""
    });
  }
  isLabAvailForLanguage(val:number){
    this.isLaboratoryAvailForLanguage=val;
    this.physicalEquipmentsInfoForm.patchValue({
      languageLabCondition: ""
    });
  }
  isLabAvailForGeography(val:number){
    this.isLaboratoryAvailForGeography=val;
    this.physicalEquipmentsInfoForm.patchValue({
      geographyLabCondition: ""
    });
  }
  isLabAvailForHomescience(val:number){
    this.isLaboratoryAvailForHomescience=val;
    this.physicalEquipmentsInfoForm.patchValue({
      homescienceLabCondition: ""
    });
  }
  isLabAvailForPsychology(val:number){
    this.isLaboratoryAvailForPsychology=val;
    this.physicalEquipmentsInfoForm.patchValue({
      psychologyLabCondition: ""
    });
  }
  editPhysicalEquipmentInfo(encId: string,academicYear:any){
    this.spinner.show();
    this.physicalEquipmentsInfoService.getPhysicalEquipmentInfo(encId,academicYear).subscribe((res: any) => {
      if(res.data.length>0){
      this.physicalEquipmentInfoData = res.data[0];
      //console.log(this.physicalEquipmentInfoData);
      this.encId=this.physicalEquipmentInfoData?.encId;
      this.academicYear=this.physicalEquipmentInfoData?.academicYear;
      this.isRoomAvailForPrincipal=this.physicalEquipmentInfoData?.isRoomAvailForPrincipal;
      this.isGirlsCommonRoomAvail=this.physicalEquipmentInfoData?.isGirlsCommonRoomAvail;
      this.isStaffRoomAvail=this.physicalEquipmentInfoData?.isStaffRoomAvail;
      this.isCocurricularRoomAvail=this.physicalEquipmentInfoData?.isCocurricularRoomAvail;
      this.isStaffQuarterAvail=this.physicalEquipmentInfoData?.isStaffQuarterAvail;
      this.issciencelaboratoryAvail=this.physicalEquipmentInfoData?.issciencelaboratoryAvail;
      this.isSeparateLibraryRoomAvail=this.physicalEquipmentInfoData.isSeparateLibraryRoomAvail;
      this.isComputerRoomAvail=this.physicalEquipmentInfoData?.isComputerRoomAvail;
      this.isTinkeringLabAvail=this.physicalEquipmentInfoData?.isTinkeringLabAvail;
      this.isSanitaryPadVendingAvail=this.physicalEquipmentInfoData?.isSanitaryPadVendingAvail;
      this.isLaboratoryAvailForPhysics=this.physicalEquipmentInfoData?.isLaboratoryAvailForPhysics;
      this.physicsLabCondition=this.physicalEquipmentInfoData?.physicsLabCondition;
      this.isLaboratoryAvailForChemistry=this.physicalEquipmentInfoData?.isLaboratoryAvailForChemistry;
      this.chemistryLabCondition=this.physicalEquipmentInfoData?.chemistryLabCondition;
      this.isLaboratoryAvailForBiology=this.physicalEquipmentInfoData?.isLaboratoryAvailForBiology;
      this.biologyLabCondition=this.physicalEquipmentInfoData?.biologyLabCondition;
      this.isLaboratoryAvailForMathematics=this.physicalEquipmentInfoData?.isLaboratoryAvailForMathematics;
      this.mathematicsLabCondition=this.physicalEquipmentInfoData?.mathematicsLabCondition;
      this.isLaboratoryAvailForLanguage=this.physicalEquipmentInfoData?.isLaboratoryAvailForLanguage;
      this.languageLabCondition=this.physicalEquipmentInfoData?.languageLabCondition;
      this.isLaboratoryAvailForGeography=this.physicalEquipmentInfoData?.isLaboratoryAvailForGeography;
      this.geographyLabCondition=this.physicalEquipmentInfoData?.geographyLabCondition;
      this.isLaboratoryAvailForHomescience=this.physicalEquipmentInfoData?.isLaboratoryAvailForHomescience;
      this.homescienceLabCondition=this.physicalEquipmentInfoData?.homescienceLabCondition;
      this.isLaboratoryAvailForPsychology=this.physicalEquipmentInfoData?.isLaboratoryAvailForPsychology;
      this.psychologyLabCondition=this.physicalEquipmentInfoData?.psychologyLabCondition;
      this.isAudioSystemAvail=this.physicalEquipmentInfoData?.isAudioSystemAvail;
      this.isScienceKitAvail=this.physicalEquipmentInfoData?.isScienceKitAvail;
      this.isMathKitAvail=this.physicalEquipmentInfoData?.isMathKitAvail;
      this.isBiometricDeviceAvail=this.physicalEquipmentInfoData?.isBiometricDeviceAvail;
      this.draftStatus=this.physicalEquipmentInfoData?.draftStatus;
      this.initializeForm();
      this.spinner.hide();
      }
    });
  }
  onSubmit(){
    this.submitted = true;
    if (this.physicalEquipmentsInfoForm.invalid) {
      this.customValidators.formValidationHandler(this.physicalEquipmentsInfoForm, this.allLabel, this.el);
    }
    if (this.physicalEquipmentsInfoForm.invalid) {
      return;
    }
    if (this.physicalEquipmentsInfoForm.get("isLaboratoryAvailForPhysics")?.value == 1){
      if(this.physicalEquipmentsInfoForm.controls["physicsLabCondition"]?.value == '') {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="physicsLabCondition"]');
          invalidControl.focus();
         this.alertHelper.viewAlert("error","Invalid","Physics lab condition required");
        return;
        }
    }
    if (this.physicalEquipmentsInfoForm.get("isLaboratoryAvailForChemistry")?.value == 1){
      if(this.physicalEquipmentsInfoForm.controls["chemistryLabCondition"]?.value == '') {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="chemistryLabCondition"]');
          invalidControl.focus();
        // this.alertHelper.successAlert( "Invalid", "Chemistry lab condition required", "error");
        this.alertHelper.viewAlert("error","Invalid","Chemistry lab condition required");
        return;
        }
    }
    if (this.physicalEquipmentsInfoForm.get("isLaboratoryAvailForBiology")?.value == 1){
      if(this.physicalEquipmentsInfoForm.controls["biologyLabCondition"]?.value == '') {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="biologyLabCondition"]');
          invalidControl.focus();
        // this.alertHelper.successAlert("Invalid", "Biology lab condition required", "error");
        this.alertHelper.viewAlert("error","Invalid","Biology lab condition required");
        return;
        }
    }
    if (this.physicalEquipmentsInfoForm.get("isLaboratoryAvailForMathematics")?.value == 1){
      if(this.physicalEquipmentsInfoForm.controls["mathematicsLabCondition"]?.value == '') {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="mathematicsLabCondition"]');
          invalidControl.focus();
        // this.alertHelper.successAlert("Invalid", "Mathematics lab condition required", "error");
        this.alertHelper.viewAlert("error","Invalid","Mathematics lab condition required");

        return;
        }
    }
    if (this.physicalEquipmentsInfoForm.get("isLaboratoryAvailForLanguage")?.value == 1){
      if(this.physicalEquipmentsInfoForm.controls["languageLabCondition"]?.value == '') {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="languageLabCondition"]');
          invalidControl.focus();
        // this.alertHelper.successAlert("Invalid", "Language lab condition required", "error");
        this.alertHelper.viewAlert("error","Invalid","Language lab condition required");

        return;
        }
    }
    if (this.physicalEquipmentsInfoForm.get("isLaboratoryAvailForGeography")?.value == 1){
      if(this.physicalEquipmentsInfoForm.controls["geographyLabCondition"]?.value == '') {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="geographyLabCondition"]');
          invalidControl.focus();
        // this.alertHelper.successAlert("Invalid", "Geography lab condition required", "error");
        this.alertHelper.viewAlert("error","Invalid","Geography lab condition required");

        return;
        }
    }
    if (this.physicalEquipmentsInfoForm.get("isLaboratoryAvailForHomescience")?.value == 1){
      if(this.physicalEquipmentsInfoForm.controls["homescienceLabCondition"]?.value == '') {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="homescienceLabCondition"]');
          invalidControl.focus();
        // this.alertHelper.successAlert("Invalid", "Homescience lab condition required", "error");
        this.alertHelper.viewAlert("error","Invalid","Homescience lab condition required");
        return;
        }
    }
    if (this.physicalEquipmentsInfoForm.get("isLaboratoryAvailForPsychology")?.value == 1){
      if(this.physicalEquipmentsInfoForm.controls["psychologyLabCondition"]?.value == '') {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="psychologyLabCondition"]');
          invalidControl.focus();
        // this.alertHelper.successAlert("Invalid", "Psychology lab condition required", "error");
        this.alertHelper.viewAlert("error","Invalid","Psychology lab condition required");

        return;
        }
    }
    if (this.physicalEquipmentsInfoForm.valid === true) {
      if(this.draftStatus==1){
        this.alertHelper.submitAlert().then((result: any) => {
          if (result.value) {
            this.spinner.show();
            this.physicalEquipmentsInfoService
              .physicalEquipmentInfoUpdate(this.physicalEquipmentsInfoForm.value)
              .subscribe({
                next: (res: any) => {
                  this.spinner.hide(); 
                  this.alertHelper
                    .successAlert(
                      "Saved!",
                      "Physical equipment information saved successfully.",
                      "success"
                    )
                    .then(() => {
                     // this.initializeForm();
                    });
                },
                error: (error: any) => {
                  this.spinner.hide();
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
              });
          }
        });
      }else{
        this.alertHelper.updateAlert().then((result: any) => {
          if (result.value) {
            this.spinner.show();
            this.physicalEquipmentsInfoService
              .physicalEquipmentInfoUpdate(this.physicalEquipmentsInfoForm.value)
              .subscribe({
                next: (res: any) => {
                  this.spinner.hide(); 
                  this.alertHelper
                    .successAlert(
                      "Saved!",
                      "Physical equipment information updated successfully.",
                      "success"
                    )
                    .then(() => {
                     // this.initializeForm();
                    });
                },
                error: (error: any) => {
                  this.spinner.hide();
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
              });
          }
        });
      }
     
    }
  }
  pageChangeWarningHandler(path: string) {
    let isFormFilled: boolean = false;
    const otherInfoObj = this.physicalEquipmentsInfoForm?.value; 
    for (const property in otherInfoObj) {
      if (otherInfoObj[property]) {
        isFormFilled = true;
        break;
      }
    }
    if (isFormFilled === true) {
      this.commonFunctionHelper.pageChangeWarningHandler(
        path,
        this.encId,
        this.router
      );
    } else {
      this.route.navigate([path, this.encId], {
        relativeTo: this.router,
      });
    }
  }
}
