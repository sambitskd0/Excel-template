import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PhysicalEquipmentsInfoService } from '../../../services/physical-equipments-info.service';
import { Constant } from "src/app/shared/constants/constant";
import { CommonserviceService } from 'src/app/core/services/commonservice.service';

@Component({
  selector: 'app-view-pei',
  templateUrl: './view-pei.component.html',
  styleUrls: ['./view-pei.component.css']
})

export class ViewPeiComponent implements OnInit { 
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
     private router : ActivatedRoute,
     private spinner : NgxSpinnerService,
     private formBuilder : FormBuilder,
     public customValidators: CustomValidators,
     private alertHelper: AlertHelper,
     private commonserviceService: CommonserviceService,
     private physicalEquipmentsInfoService: PhysicalEquipmentsInfoService,
     private el: ElementRef
     ) { }

  ngOnInit(): void {
 
    this.userProfile = this.commonserviceService.getUserProfile();
    this.userId = this.userProfile?.userId;
    this.encId = this.router.snapshot.params["encId"];
    this.editPhysicalEquipmentInfo(this.encId,this.academicYear);

  
  }
  editPhysicalEquipmentInfo(encId: string,academicYear:any){
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
 
      }
    });
  }

}

