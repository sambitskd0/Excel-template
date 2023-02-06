import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { Constant } from "src/app/shared/constants/constant";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { RegistrationService } from "../../services/registration.service";
import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";
import { HeaderComponent } from "../header/header.component";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { Observable } from "rxjs";
@Component({
  selector: "app-other-info",
  templateUrl: "./other-info.component.html",
  styleUrls: ["./other-info.component.css"],
})
export class OtherInfoComponent implements OnInit {
  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;
  dropdownSettings:IDropdownSettings={};
  dropdownSettingTeacherAsso:IDropdownSettings={};
  dropdownSettingTeacherLang:IDropdownSettings={};
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
  trainedComputer: any = "";
  appointedForLabel: any = "";
  mainSubTaught1: any = "";
  mainSubTaught2: any = "";
  socialStdUpto: any = "";
  trainedCWSN: any = "";
  langStudiedUpto: any = "";
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
  schoolCategory: any = [];
  teacherLanguageChanged: boolean = false;
  teacherLanguage: any = "";
  teacherAssociateChanged: boolean = false;
  teacherAssociate: any = "";
  studyClassChanged: boolean = false;
  studyEngChanged: boolean = false;
  studySciChanged: boolean = false;
  studySocChanged: boolean = false;
  studyLangChanged: boolean = false;
  studyClass: any = "";
  teacherAppointSubjectChanged: boolean = false;
  teacherAppointSubject: any = "";
  otherInfoData: any = "";
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();
  btnValue: boolean = false;
  draftStatus: boolean = false;
  touchCntl:any="";
  public userProfile = JSON.parse(
    sessionStorage.getItem("userProfile") || "{}"
  );
  loginUserType = this.userProfile.loginUserTypeId;
  userDesignation = this.userProfile.designationId;
  allLabel: string[] = [
    "",
    "",
    "Computer training",
    // "Basic pay",
    "Nss incharge",
    "Ncc trained",
    "Training needed",
    "Training received",
    "Classes taught",
    "Languages in which the teacher is having working knowledge?",
    "Studied mathematics upto which class",
    "Studied english upto which class",
    "Studied science upto which class",
    "Social studies studied upto",
    "Language (as per schedule viii) studied upto",
    "Main subject taught 1",
    "Main subject taught 2",
    "Are you a trained teacher?",
    "Trained in computer for use and teaching",
    // "Teacher associated as",
    // "Received award",
    // "Award type",
    // "Appointed for level",
    "Trained for teaching cwsn",
    "No. Of working days spent on non- teaching assignments",
    "Whether using special resources for education of children with special needs (cwsn)?",
    "Whether trained in safety and security audit of school for ensuring child safety?",
    "Whether received training on cyber safety and psychosocial aspects?",
    "Whether received training in early identification support and classroom support of cwsn?",
    "Whether having ict training/ knowledge to conduct remote learning classes?",
    "Whether conducted remote learning classes in current academic session?",
    "Average number of hours of ict (computer, laptop, television, radio, other) used per week for teaching purposes?",
    "Whether trained in innovative pedagogy such as art art-integrated, sport-integrated, story-telling, experiential or toy-based?",
    "Whether using innovative pedagogy such as art-integrated, sport-integrated, story-telling, experiential and toy-based pedagogies, as evidenced from inspections by crc/brc?",
    "Whether received training after conduct of nas/ sas /other third party assessment at the school?",
    "Is the teacher engaged with teaching students registered with nios/ sios study centre of this school?",
    "Whether received training in fln-nishtha?",
    "Whether received activity handbook/ material/ resources?",
    "Whether developed e-content and uploaded on diksha?",
    "Whether involved in creating any other type of offline/online resources for teachers at cluster level, block level,district level, and state level?",
    "Whether received teachers manuals/handbooks/ resources for teaching children with disabilities/gifted children?",
    "Using resource materials for preparing their own lesson plans",
    "Developing own tlm for classroom transactions",
    "Whether undertaking classroom transactions by using student’s mother tongue as the link language?",
  ];
  selectedClasses: any = [];
  selectedTeacherAsso: any = [];
  selectedTeacherLang: any = [];
  trainingOn: any = "";
  trainingNeedChanged: boolean = false;
  trainingRecvChanged: boolean = false;
  trainingNeeded: any = "";
  trainingRecieved: any = "";
  dfSts :boolean =false;
  constructor(
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private spinner: NgxSpinnerService,
    private registrationService: RegistrationService,
    private alertHelper: AlertHelper,
    private route: Router,
    private router: ActivatedRoute,
    private el: ElementRef,
    public commonFunctionHelper: CommonFunctionHelper,
    private commonService: CommonserviceService,
    
  ) {}

  ngOnInit(): void {
    
    this.el.nativeElement.querySelector("[formControlName=computerTraining]").focus();
    this.teacherId = this.router.snapshot.params["id"];       
    this.initializeForm();
    this. getAnnextureData();    
    this. getAnnextureDataBySeq();    
    //  this.getTeacherOtherInfo();       
    this.getTeacherDetails();
   
    this.dropdownSettings = {      
      idField: 'anxtValue',
      textField: 'anxtName',
      enableCheckAll: true,
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      noDataAvailablePlaceholderText: "No data available",
      allowSearchFilter: true,
      itemsShowLimit: 3,
    };
    this.dropdownSettingTeacherAsso = {      
      idField: 'anxtValue',
      textField: 'anxtName',
      enableCheckAll: true,
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      noDataAvailablePlaceholderText: "No data available",
      allowSearchFilter: true,
      itemsShowLimit: 3,
    };
    this.dropdownSettingTeacherLang = {      
      idField: 'anxtValue',
      textField: 'anxtName',
      enableCheckAll: true,
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      noDataAvailablePlaceholderText: "No data available",
      allowSearchFilter: true,
      itemsShowLimit: 3,
    };
   
  }
  getAnnextureData() {
    this.spinner.show();
    this.commonService
      .getCommonAnnexture([
        "CLASSES_TAUGHT_TEACHER",
        "MEDIUM_OF_INSTRUCTION",
        "TEACHER_ASSOCIATED_AS",
        "TEACHER_EDUCATIONAL_QUALIFICATION" ,
        
        // "TRAINING_ON"       
       ])
      .subscribe({
        next: (res: any) => { 
          this.spinner.hide();
          this.schoolCategory = res?.data?.CLASSES_TAUGHT_TEACHER; 
          this.teacherLanguage = res?.data?.MEDIUM_OF_INSTRUCTION; 
          this.teacherAssociate = res?.data?.TEACHER_ASSOCIATED_AS; 
          this.studyClass = res?.data?.TEACHER_EDUCATIONAL_QUALIFICATION;           
                    
          // this.trainingOn = res?.data?.TRAINING_ON;           
          // this.getAppointSubject();
          this.teacherInfo();
          this.spinner.hide();
        },
      });
  }
  getAnnextureDataBySeq() {
    this.spinner.show();
    this.commonService
      .getCommonAnnexture([
        "TRAINING_ON" ,
        "APPOINTED_SUBJECT"      
       ],true)
      .subscribe({
        next: (res: any) => { 
          this.spinner.hide();
          this.trainingOn = res?.data?.TRAINING_ON;  
          this.teacherAppointSubject = res?.data?.APPOINTED_SUBJECT;          
          // this.getAppointSubject();
          this.teacherInfo();
          this.spinner.hide();
        },
      });
  }
  getAppointSubject() {
    this.teacherAppointSubjectChanged = true;
    this.teacherAppointSubject = [];
    this.registrationService.getAppointSubject().subscribe((res: any) => {
      let data: any = res;
      for (let key of Object.keys(data["data"])) {
       // this.teacherAppointSubject.push(data["data"][key]);
      }
      this.teacherAppointSubjectChanged = false;
    });
  }
  initializeForm() {
    this.otherInfoForm = this.formBuilder.group({
      academicYear: [this.academicYear],
      tId: [this.teacherId],
      computerTraining: [this.computerTraining, Validators.required],
      // basicPay: [
      //   this.basicPay,
      //   [
      //     Validators.required,
      //     Validators.maxLength(10),  
      //     Validators.pattern(/^[0-9.]*$/),
      //   ],
      // ],
      nssIncharge: [this.nssIncharge, Validators.required],
      nccTrained: [this.nccTrained, Validators.required],
      trainingNeeded: [this.trainingNeeded, Validators.required],
      trainingRecieved: [this.trainingRecieved, Validators.required],
      classesTaught: [this.selectedClasses, Validators.required],
      //teacherAssociatedAs: [this.selectedTeacherAsso, Validators.required],
      //recievedAward: [this.recievedAward, Validators.required],
     // awardType: [this.awardType, Validators.required],
      langWorkingKnwldge: [this.selectedTeacherLang, Validators.required],
      stdMathClassUpto: [
        this.stdMathClassUpto,
        [
          Validators.required,
          // Validators.maxLength(20),
          // Validators.pattern(/^[a-zA-Z0-9., ]*$/),
        ],
      ],
      stdEnglishClassUpto: [
        this.stdEnglishClassUpto,
        [
          Validators.required,
          // Validators.maxLength(20),
          // Validators.pattern(/^[a-zA-Z0-9., ]*$/),
        ],
      ],
      stdScienceClassUpto: [
        this.stdScienceClassUpto,
        [
          Validators.required,
          // Validators.maxLength(20),
          // Validators.pattern(/^[a-zA-Z0-9., ]*$/),
        ],
      ], 
      socialStdUpto: [
        this.socialStdUpto,
        [
          Validators.required,
          // Validators.maxLength(90),
          // Validators.pattern(/^[a-zA-Z0-9. ]*$/),
        ],
      ],
      langStudiedUpto: [
        this.langStudiedUpto,
        [
          Validators.required,
          // Validators.maxLength(90),
          // Validators.pattern(/^[a-zA-Z0-9., ]*$/),
        ],
      ],     
      //appointedForLabel: [this.appointedForLabel], //Validators.required
      mainSubTaught1: [
        this.mainSubTaught1,
        [
          Validators.required,
          // Validators.maxLength(90),
          // Validators.pattern(/^[a-zA-Z0-9., ]*$/),
        ],
      ],
      mainSubTaught2: [this.mainSubTaught2],
      trainer: [this.trainer, Validators.required],
      trainedComputer: [this.trainedComputer, Validators.required],
      trainedCWSN: [this.trainedCWSN, Validators.required],
     
      daysNonTeachingAssignment: [
        this.daysNonTeachingAssignment,
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern(/^[a-zA-Z0-9., ]*$/),
          this.customValidators.firstCharValidatorRF
        ],
      ],
      specialResourceCWSN: [this.specialResourceCWSN, Validators.required],
      trainedSafetyandSecurity: [
        this.trainedSafetyandSecurity,
        Validators.required,
      ],
      trainingCybSecAndPsycoligical: [
        this.trainingCybSecAndPsycoligical,
        Validators.required,
      ],
      trainingEarlyIdenAndClsSpt: [
        this.trainingEarlyIdenAndClsSpt,
        Validators.required,
      ],
      knwldToCondtRmtClass: [this.knwldToCondtRmtClass, Validators.required],
      remoteClassCrntAcademic: [
        this.remoteClassCrntAcademic,
        Validators.required,
      ],
      avgHrOfICT: [
        this.avgHrOfICT,
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern(/^[a-zA-Z0-9., ]*$/),
          this.customValidators.firstCharValidatorRF
        ],
      ],
      trainedInInnovative: [this.trainedInInnovative, Validators.required],
      trainedInInnovativeBRC: [
        this.trainedInInnovativeBRC,
        Validators.required,
      ],
      trainingNas: [this.trainingNas, Validators.required],
      engStdWithNios: [this.engStdWithNios, Validators.required],
      trainingFLN: [this.trainingFLN, Validators.required],
      recvActiHandbook: [this.recvActiHandbook, Validators.required],
      uploadedDiksha: [this.uploadedDiksha, Validators.required],
      involvedOnlineResource: [
        this.involvedOnlineResource,
        Validators.required,
      ],
      recvTchManual: [this.recvTchManual, Validators.required],
      rescMaterialOwnLesson: [this.rescMaterialOwnLesson, Validators.required],
      devlopTLMfrClass: [this.devlopTLMfrClass, Validators.required],
      undertakingStdMothertounge: [
        this.undertakingStdMothertounge,
        Validators.required,
      ],
      touchCntl:['']
    });
  }

  teacherInfo(){   
    this.spinner.show(); 
    this.registrationService
      .getTeacherOtherInfo(this.teacherId)
      .subscribe((res: any) => {
        this.otherInfoData = res.data[0];  
       
        if (res.data != "") {
          this.dfSts = true;
          this.computerTraining = this.otherInfoData.computerTraining;
          this.basicPay = this.otherInfoData.basicPay;
          this.nssIncharge = this.otherInfoData.nssIncharge;
          this.nccTrained = this.otherInfoData.nccTrained;
          this.trainingNeeded = this.otherInfoData.trainingNeeded;
          this.trainingRecieved = this.otherInfoData.trainingRecieved;
          this.selectedClasses =[];
          // this.classesTaught = this.otherInfoData.classesTaught;
          this.schoolCategory.forEach((val: any, key: any) => { 
            if(this.otherInfoData.classesTaught !="") {
              if (this.otherInfoData.classesTaught.find((x: any) => x == val.anxtValue)) {              
                this.selectedClasses.push({
                  anxtValue: val.anxtValue,
                  anxtName: val.anxtName,
                });
              }
            }
            
          });   
          // this.teacherAssociate.forEach((val: any, key: any) => {  
          //   // console.log(this.otherInfoData.teacherAssociatedAs);
            
          //   if (this.otherInfoData.teacherAssociatedAs.find((y: any) => y == val.anxtValue)) {
          //     this.selectedTeacherAsso.push({
          //       anxtValue: val.anxtValue,
          //       anxtName: val.anxtName,
          //     });
          //   }
          // });
          
          
          // this.teacherAssociatedAs = this.otherInfoData.teacherAssociatedAs;
          this.recievedAward = this.otherInfoData.recievedAward;
          this.awardType = this.otherInfoData.awardType;
          // this.langWorkingKnwldge = this.otherInfoData.langWorkingKnwldge;
          this.selectedTeacherLang = [];
          this.teacherLanguage.forEach((val: any, key: any) => { 
            if(this.otherInfoData.langWorkingKnwldge !=""){
              
              if (this.otherInfoData.langWorkingKnwldge.find((z: any) => z == val.anxtValue)) {
                this.selectedTeacherLang.push({
                  anxtValue: val.anxtValue,
                  anxtName: val.anxtName,
                });
              }
            }
            
          });  
          this.stdMathClassUpto = this.otherInfoData.stdMathClassUpto;
          this.stdEnglishClassUpto = this.otherInfoData.stdEnglishClassUpto;
          this.stdScienceClassUpto = this.otherInfoData.stdScienceClassUpto;
          this.trainer = this.otherInfoData.trainer;
          this.trainedComputer = this.otherInfoData.trainedComputer;
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
          // this.initializeForm();
          this.otherInfoForm.get("computerTraining")?.patchValue(this.computerTraining);
          this.otherInfoForm.get("basicPay")?.patchValue(this.basicPay);
          this.otherInfoForm.get("nssIncharge")?.patchValue(this.nssIncharge);
          this.otherInfoForm.get("nccTrained")?.patchValue(this.nccTrained);
          this.otherInfoForm.get("trainingNeeded")?.patchValue(this.trainingNeeded);
          this.otherInfoForm.get("trainingRecieved")?.patchValue(this.trainingRecieved);
          this.otherInfoForm.get("classesTaught")?.patchValue(this.selectedClasses);  
          this.otherInfoForm.get("teacherAssociatedAs")?.patchValue(this.selectedTeacherAsso);
          this.otherInfoForm.get("recievedAward")?.patchValue(this.recievedAward);
          this.otherInfoForm.get("awardType")?.patchValue(this.awardType);
          this.otherInfoForm.get("langWorkingKnwldge")?.patchValue(this.selectedTeacherLang);
          this.otherInfoForm.get("stdMathClassUpto")?.patchValue(this.stdMathClassUpto);  
          this.otherInfoForm.get("stdEnglishClassUpto")?.patchValue(this.stdEnglishClassUpto);
          this.otherInfoForm.get("stdScienceClassUpto")?.patchValue(this.stdScienceClassUpto);
          this.otherInfoForm.get("trainer")?.patchValue(this.trainer);
          this.otherInfoForm.get("trainedComputer")?.patchValue(this.trainedComputer);
          this.otherInfoForm.get("appointedForLabel")?.patchValue(this.appointedForLabel);
          this.otherInfoForm.get("mainSubTaught1")?.patchValue(this.mainSubTaught1);  
          this.otherInfoForm.get("mainSubTaught2")?.patchValue(this.mainSubTaught2);
          this.otherInfoForm.get("socialStdUpto")?.patchValue(this.socialStdUpto);
          this.otherInfoForm.get("trainedCWSN")?.patchValue(this.trainedCWSN);
          this.otherInfoForm.get("langStudiedUpto")?.patchValue(this.langStudiedUpto);
          this.otherInfoForm.get("daysNonTeachingAssignment")?.patchValue(this.daysNonTeachingAssignment);  
          this.otherInfoForm.get("specialResourceCWSN")?.patchValue(this.specialResourceCWSN);
          this.otherInfoForm.get("trainedSafetyandSecurity")?.patchValue(this.trainedSafetyandSecurity);
          this.otherInfoForm.get("trainingCybSecAndPsycoligical")?.patchValue(this.trainingCybSecAndPsycoligical);
          this.otherInfoForm.get("trainingEarlyIdenAndClsSpt")?.patchValue(this.trainingEarlyIdenAndClsSpt);
          this.otherInfoForm.get("knwldToCondtRmtClass")?.patchValue(this.knwldToCondtRmtClass);
          this.otherInfoForm.get("remoteClassCrntAcademic")?.patchValue(this.remoteClassCrntAcademic);
          this.otherInfoForm.get("avgHrOfICT")?.patchValue(this.avgHrOfICT);
          this.otherInfoForm.get("trainedInInnovative")?.patchValue(this.trainedInInnovative);
          this.otherInfoForm.get("trainedInInnovativeBRC")?.patchValue(this.trainedInInnovativeBRC);
          this.otherInfoForm.get("trainingNas")?.patchValue(this.trainingNas);
          this.otherInfoForm.get("engStdWithNios")?.patchValue(this.engStdWithNios);
          this.otherInfoForm.get("trainingFLN")?.patchValue(this.trainingFLN);
          this.otherInfoForm.get("recvActiHandbook")?.patchValue(this.recvActiHandbook);
          this.otherInfoForm.get("uploadedDiksha")?.patchValue(this.uploadedDiksha);
          this.otherInfoForm.get("involvedOnlineResource")?.patchValue(this.involvedOnlineResource);
          this.otherInfoForm.get("recvTchManual")?.patchValue(this.recvTchManual);
          this.otherInfoForm.get("rescMaterialOwnLesson")?.patchValue(this.rescMaterialOwnLesson);
          this.otherInfoForm.get("devlopTLMfrClass")?.patchValue(this.devlopTLMfrClass);
          this.otherInfoForm.get("undertakingStdMothertounge")?.patchValue(this.undertakingStdMothertounge);        
          this.spinner.hide();
        } else {
          this.btnValue = false;
          // this.initializeForm();          
          this.spinner.hide();
        }
      });
  }
  
  getTeacherOtherInfo() {
    this.spinner.show();
    const afterFormValidObserver = new Observable((observer) => {
      observer.next(this.getAnnextureData());
    });
    afterFormValidObserver.subscribe({
      next: () => {
        this.teacherInfo()
      },
    });
    
  }
  onSubmit() {
    // this.customValidators.customFormValidationHandler(this.otherInfoForm);
    // console.log(this.otherInfoForm);
   
    let arrCntrl = [];
    for (const key of Object.keys(this.otherInfoForm.controls)) {
      if (this.otherInfoForm.controls[key].touched === true) {
        arrCntrl.push(key);
      }
    }
    this.otherInfoForm.patchValue({
     touchCntl : arrCntrl
    });
    if ("INVALID" === this.otherInfoForm.status) {
      for (const key of Object.keys(this.otherInfoForm.controls)) {
        if (this.otherInfoForm.controls[key].status === "INVALID") {          
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + key + '"]'
          );
          invalidControl.focus();          
          this.customValidators.formValidationHandler(
            this.otherInfoForm,
            this.allLabel
          );
          break;
        }
      }
    }
    if (this.otherInfoForm.invalid) {
      return;
    }
    if (this.otherInfoForm.valid === true) {
      this.alertHelper.submitAlert().then((result: any) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.registrationService
            .saveOtherInfoAsDraft(this.otherInfoForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Other information. saved successfully.",
                    "success"
                  )
                  .then(() => { 
                           
                    this.otherInfoForm.get("computerTraining")?.patchValue(this.computerTraining);
                    this.otherInfoForm.get("basicPay")?.patchValue(this.basicPay);
                    this.otherInfoForm.get("nssIncharge")?.patchValue(this.nssIncharge);
                    this.otherInfoForm.get("nccTrained")?.patchValue(this.nccTrained);
                    this.otherInfoForm.get("trainingNeeded")?.patchValue(this.trainingNeeded);
                    this.otherInfoForm.get("trainingRecieved")?.patchValue(this.trainingRecieved);
                    this.otherInfoForm.get("classesTaught")?.patchValue(this.selectedClasses);  
                    this.otherInfoForm.get("teacherAssociatedAs")?.patchValue(this.selectedTeacherAsso);
                    this.otherInfoForm.get("recievedAward")?.patchValue(this.recievedAward);
                    this.otherInfoForm.get("awardType")?.patchValue(this.awardType);
                    this.otherInfoForm.get("langWorkingKnwldge")?.patchValue(this.selectedTeacherLang);
                    this.otherInfoForm.get("stdMathClassUpto")?.patchValue(this.stdMathClassUpto);  
                    this.otherInfoForm.get("stdEnglishClassUpto")?.patchValue(this.stdEnglishClassUpto);
                    this.otherInfoForm.get("stdScienceClassUpto")?.patchValue(this.stdScienceClassUpto);
                    this.otherInfoForm.get("trainer")?.patchValue(this.trainer);
                    this.otherInfoForm.get("trainedComputer")?.patchValue(this.trainedComputer);
                    this.otherInfoForm.get("appointedForLabel")?.patchValue(this.appointedForLabel);
                    this.otherInfoForm.get("mainSubTaught1")?.patchValue(this.mainSubTaught1);  
                    this.otherInfoForm.get("mainSubTaught2")?.patchValue(this.mainSubTaught2);
                    this.otherInfoForm.get("socialStdUpto")?.patchValue(this.socialStdUpto);
                    this.otherInfoForm.get("trainedCWSN")?.patchValue(this.trainedCWSN);
                    this.otherInfoForm.get("langStudiedUpto")?.patchValue(this.langStudiedUpto);
                    this.otherInfoForm.get("daysNonTeachingAssignment")?.patchValue(this.daysNonTeachingAssignment);  
                    this.otherInfoForm.get("specialResourceCWSN")?.patchValue(this.specialResourceCWSN);
                    this.otherInfoForm.get("trainedSafetyandSecurity")?.patchValue(this.trainedSafetyandSecurity);
                    this.otherInfoForm.get("trainingCybSecAndPsycoligical")?.patchValue(this.trainingCybSecAndPsycoligical);
                    this.otherInfoForm.get("trainingEarlyIdenAndClsSpt")?.patchValue(this.trainingEarlyIdenAndClsSpt);
                    this.otherInfoForm.get("knwldToCondtRmtClass")?.patchValue(this.knwldToCondtRmtClass);
                    this.otherInfoForm.get("remoteClassCrntAcademic")?.patchValue(this.remoteClassCrntAcademic);
                    this.otherInfoForm.get("avgHrOfICT")?.patchValue(this.avgHrOfICT);
                    this.otherInfoForm.get("trainedInInnovative")?.patchValue(this.trainedInInnovative);
                    this.otherInfoForm.get("trainedInInnovativeBRC")?.patchValue(this.trainedInInnovativeBRC);
                    this.otherInfoForm.get("trainingNas")?.patchValue(this.trainingNas);
                    this.otherInfoForm.get("engStdWithNios")?.patchValue(this.engStdWithNios);
                    this.otherInfoForm.get("trainingFLN")?.patchValue(this.trainingFLN);
                    this.otherInfoForm.get("recvActiHandbook")?.patchValue(this.recvActiHandbook);
                    this.otherInfoForm.get("uploadedDiksha")?.patchValue(this.uploadedDiksha);
                    this.otherInfoForm.get("involvedOnlineResource")?.patchValue(this.involvedOnlineResource);
                    this.otherInfoForm.get("recvTchManual")?.patchValue(this.recvTchManual);
                    this.otherInfoForm.get("rescMaterialOwnLesson")?.patchValue(this.rescMaterialOwnLesson);
                    this.otherInfoForm.get("devlopTLMfrClass")?.patchValue(this.devlopTLMfrClass);
                    this.otherInfoForm.get("undertakingStdMothertounge")?.patchValue(this.undertakingStdMothertounge);                     
                    this.getTeacherOtherInfo();
                    this.selectedTeacherLang =    this.otherInfoForm.get("langWorkingKnwldge")?.value;                
                    this.selectedClasses =    this.otherInfoForm.get("classesTaught")?.value;        
                    
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
             
            });
        }
      });
    }
  }
  getTeacherDetails() {
    this.registrationService
      .getTeacherDetails(this.teacherId)
      .subscribe({
        next: (res: any) => {
          if (res.success === true) {            
            this.draftStatus = res.draftSubmitted;
            this.headerComponent.disableNavHelper(res.draftSubmitted);
            this.spinner.hide();
          }
        },
        error: (err: any) => {
          this.spinner.hide();
        },
      });
  }
  pageChangeWarningHandler(path: string) {
    let isFormFilled: boolean = false;
    const otherInfoObj = this.otherInfoForm?.value; 
    
    for (const property in otherInfoObj) {
      if (otherInfoObj[property]) {
        isFormFilled = true;
        break;
      }
    }
    if (isFormFilled === true) {
      this.commonFunctionHelper.pageChangeWarningHandler(
        path,
        this.teacherId,
        this.router
      );
    } else {
      this.route.navigate([path, this.teacherId], {
        relativeTo: this.router,
      });
    }
  }
}
