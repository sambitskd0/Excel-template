import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonFunctionHelper } from 'src/app/core/helpers/common-function-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { RegistrationService } from '../../services/registration.service';
import { ViewdetailsService } from '../../services/viewdetails.service';

@Component({
  selector: 'app-view-other-info',
  templateUrl: './view-other-info.component.html',
  styleUrls: ['./view-other-info.component.css']
})
export class ViewOtherInfoComponent implements OnInit {
  otherInfoForm!: FormGroup;
  teacherId: any = "";
  computerTraining: any = "";
  basicPay: any = "";
  nssIncharge: any = "";
  nccTrained: any = "";
  classesTaught: any = "";
  teacherAssociatedAs: any = "";
  recievedAward: any = "";
  awardType: any = "";
  langWorkingKnwldge: any = "";
  stdMathClassUpto: any = "";
  stdEnglishClassUpto: any = "";
  stdScienceClassUpto: any = "";
  trainer: any = "";
  appointedForLabel: any = "";
  mainSubTaught1: any = "";
  mainSubTaught2: any = "";
  socialStdUpto: any = "";
  trainedCWSN: any = "";
  langStudiedUpto: any = "";
  trainedComputer: any = "";
  daysNonTeachingAssignment: any = "";
  specialResourceCWSN: any = "";
  trainedSafetyandSecurity: any = "";
  trainingCybSecAndPsycoligical: any = "";
  trainingEarlyIdenAndClsSpt: any = "";
  knwldToCondtRmtClass: any = "";
  remoteClassCrntAcademic: any = "";
  avgHrOfICT: any = "";
  trainedInInnovative: any = "";
  trainedInInnovativeBRC: any = "";
  trainingNas: any = "";
  engStdWithNios: any = "";
  trainingFLN: any = "";
  recvActiHandbook: any = "";
  uploadedDiksha: any = "";
  involvedOnlineResource: any = "";
  recvTchManual: any = "";
  rescMaterialOwnLesson: any = "";
  devlopTLMfrClass: any = "";
  undertakingStdMothertounge: any = "";
  schoolCategoryChanged: boolean = false;
  schoolCategory: any = "";
  teacherLanguageChanged: boolean = false;
  teacherLanguage: any = "";
  teacherAssociateChanged: boolean = false;
  teacherAssociate: any = "";
  otherInfoData: any = "";
  classTaught:any =[];
  associatedAs:any =[];
  languageW:any =[];
  studyUpto:any =[];
  mainSub:any =[];
  classes:any='';
  associateds:any='';
  otherInfoDataEmpty :boolean =false;
  // config = new Constant();
  // academicYear: any = this.config.getAcademicCurrentYear();
  btnValue: boolean = false;
  draftStatus: boolean = false; 
  annextureResults: any;
  studyClass: any = "";
  teacherAppointSubject: any = "";
  trainingNeeded: any = "";
  trainingRecieved: any = "";
  trainingOn:any="";
  training:any =[];
  constructor(
    private formBuilder: FormBuilder,
    private registrationService: RegistrationService,
    private spinner: NgxSpinnerService,
    private viewDetailsService: ViewdetailsService,    
    private route: Router,
    private router: ActivatedRoute,   
    public commonFunctionHelper: CommonFunctionHelper,
    private commonserviceService: CommonserviceService,
  ) {}

  ngOnInit(): void {
    this.teacherId = this.router.snapshot.params["id"]; 
    this.viewTeacherOtherInfo(this.teacherId);
    this.getAnnextureData();
    this.getAppointSubject();
  }
  viewTeacherOtherInfo(encId: any) {
    this.spinner.show();
    this.viewDetailsService
      .viewTeacherOtherInfo(encId)
      .subscribe((res: any) => {
        this.otherInfoData = res.data[0];
        if (res.data != "") {
          this.computerTraining = this.otherInfoData.computerTraining;
          this.basicPay = this.otherInfoData.basicPay;
          this.nssIncharge = this.otherInfoData.nssIncharge;
          this.nccTrained = this.otherInfoData.nccTrained;
          this.trainingNeeded = this.otherInfoData.trainingNeeded;
          this.trainingRecieved = this.otherInfoData.trainingRecieved;
          this.classesTaught = this.otherInfoData.classesTaught;
          this.teacherAssociatedAs = this.otherInfoData.teacherAssociatedAs;
          this.recievedAward = this.otherInfoData.recievedAward;
          this.awardType = this.otherInfoData.awardType;
          this.langWorkingKnwldge = this.otherInfoData.langWorkingKnwldge;
          this.stdMathClassUpto = this.otherInfoData.stdMathClassUpto;
          this.stdEnglishClassUpto = this.otherInfoData.stdEnglishClassUpto;
          this.stdScienceClassUpto = this.otherInfoData.stdScienceClassUpto;
          this.trainedComputer = this.otherInfoData.trainedComputer;
          this.trainer = this.otherInfoData.trainer;
          this.appointedForLabel = this.otherInfoData.appointedForLabel;
          this.mainSubTaught1 = this.otherInfoData.mainSubTaught1;
          this.mainSubTaught2 = this.otherInfoData.mainSubTaught2;
          this.socialStdUpto = this.otherInfoData.socialStdUpto;
          this.trainedCWSN = this.otherInfoData.trainedCWSN;
          this.langStudiedUpto = this.otherInfoData.langStudiedUpto;
          this.daysNonTeachingAssignment =
            this.otherInfoData.daysNonTeachingAssignment;
          this.specialResourceCWSN = this.otherInfoData.specialResourceCWSN;
          this.trainedSafetyandSecurity =
            this.otherInfoData.trainedSafetyandSecurity;
          this.trainingCybSecAndPsycoligical =
            this.otherInfoData.trainingCybSecAndPsycoligical;
          this.trainingEarlyIdenAndClsSpt =
            this.otherInfoData.trainingEarlyIdenAndClsSpt;
          this.knwldToCondtRmtClass = this.otherInfoData.knwldToCondtRmtClass;
          this.remoteClassCrntAcademic =
            this.otherInfoData.remoteClassCrntAcademic;
          this.avgHrOfICT = this.otherInfoData.avgHrOfICT;
          this.trainedInInnovative = this.otherInfoData.trainedInInnovative;
          this.trainedInInnovativeBRC =
            this.otherInfoData.trainedInInnovativeBRC;
          this.trainingNas = this.otherInfoData.trainingNas;
          this.engStdWithNios = this.otherInfoData.engStdWithNios;
          this.trainingFLN = this.otherInfoData.trainingFLN;
          this.recvActiHandbook = this.otherInfoData.recvActiHandbook;
          this.uploadedDiksha = this.otherInfoData.uploadedDiksha;
          this.involvedOnlineResource =
            this.otherInfoData.involvedOnlineResource;
          this.recvTchManual = this.otherInfoData.recvTchManual;
          this.rescMaterialOwnLesson = this.otherInfoData.rescMaterialOwnLesson;
          this.devlopTLMfrClass = this.otherInfoData.devlopTLMfrClass;
          this.undertakingStdMothertounge =
            this.otherInfoData.undertakingStdMothertounge;
          this.btnValue = true;         
          this.spinner.hide();
          this.otherInfoDataEmpty = true;
        } else {
          this.btnValue = false;        
          this.spinner.hide();
          this.otherInfoDataEmpty = false;
        }
      });
  }
  // getAnnextureData() {
  //   this.commonserviceService
  //     .getCommonAnnexture(["SCHOOL_TYPE", "TEACHER_ASSOCIATED_AS"])
  //     .subscribe({
  //       next: (res: any) => {          
  //         this.spinner.hide();
  //         this.annextureResults = res;
  //         res.data.SCHOOL_TYPE.forEach((val:any) => {          
  //           this.classTaught[val.anxtValue] = val.anxtName;
  //         });
  //       const tassociate = Object.keys(res.data.TEACHER_ASSOCIATED_AS).map(function(anx){
  //         let data = res.data.TEACHER_ASSOCIATED_AS[anx];          
  //         return data;
  //       });
  //         tassociate.forEach((value:any) => {          
  //           this.associatedAs[value.anxtValue] = value.anxtName;
  //         });          
         
  //       },
  //     });
  // }
  getAppointSubject() {   
    this.teacherAppointSubject = [];
    this.registrationService.getAppointSubject().subscribe((res: any) => {
      let data: any = res;
      for (let key of Object.keys(data["data"])) {
        this.teacherAppointSubject.push(data["data"][key]);
      }   
      this.teacherAppointSubject.forEach((val:any) => {        
        this.mainSub[val.subjectId] = val.subject;
      });      
    });
    
    
  }
  getAnnextureData() {
    this.spinner.show();
    this.commonserviceService
      .getCommonAnnexture([
        "CLASSES_TAUGHT_TEACHER",
        "MEDIUM_OF_INSTRUCTION",
        "TEACHER_ASSOCIATED_AS",
        "TEACHER_EDUCATIONAL_QUALIFICATION",
        "TRAINING_ON"          
       ])
      .subscribe({
        next: (res: any) => { 
          this.spinner.hide();
          this.schoolCategory = res?.data?.CLASSES_TAUGHT_TEACHER; 
          this.teacherLanguage = res?.data?.MEDIUM_OF_INSTRUCTION; 
          // this.teacherAssociate = res?.data?.TEACHER_ASSOCIATED_AS.sort((a: any, b: any) => (a.anxtName.toLowerCase() < b.anxtName.toLowerCase()) ? -1 : ((b.anxtName.toLowerCase() > a.anxtName.toLowerCase()) ? 1 : 0)); 
          this. studyClass = res?.data?.TEACHER_EDUCATIONAL_QUALIFICATION;
          this.trainingOn = res?.data?.TRAINING_ON;  
          if((this.trainingOn !='') ||( this.trainingOn != null)){
            this.trainingOn.forEach((val:any) => {
              this.training[val.anxtValue] = val.anxtName;
            });
          }
      if((this.schoolCategory !='') ||( this.schoolCategory != null)){
        this.schoolCategory.forEach((val:any) => {
          this.classTaught[val.anxtValue] = val.anxtName;
        });
      }
         
      if((this.teacherLanguage !='') ||( this.teacherLanguage != null)){
        this.teacherLanguage.forEach((val:any) => {
          this.languageW[val.anxtValue] = val.anxtName;
        });
      }

      if((this.studyClass !='') ||( this.studyClass != null)){
        this.studyClass.forEach((val:any) => {
          this.studyUpto[val.anxtValue] = val.anxtName;
        });
      }
          
          this.spinner.hide();
        },
      });
  }
}
