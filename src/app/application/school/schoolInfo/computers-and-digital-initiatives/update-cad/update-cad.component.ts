import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';
import { Constant } from "src/app/shared/constants/constant";
import { SchoolService } from '../../../services/school.service';
import { CommonFunctionHelper } from 'src/app/core/helpers/common-function-helper';

@Component({
  selector: 'app-update-cad',
  templateUrl: './update-cad.component.html',
  styleUrls: ['./update-cad.component.css']
})
export class UpdateCadComponent implements OnInit {
  addharaCount:any = 0;
  permanentTecherCount:any =0;
  contractTecherCount:any = 0;
  partTimeTecherCount:any =0;
  teacherData : any = [];
  encId:string='';
  CADForm! : FormGroup;
  CADInfo : any = [];
  submitted:boolean = false;
  posts: any = []; 
  allLabel:any = [
    "", 
    "", 
    "Is CAL Lab available in the school",
    "Is ICT Lab available in the school", 
    "Year of implementation", 
    "Whether the ICT Lab is functional or not",
    "Which model is implemented in the school", 
    "Type of the ICT Instructor in the school", 
    "Desktop/PCs ",
    "",
    "",
    "Laptop/Notebook",
    "",
    "",
    "Tablets",
    "", 
    "", 
    "PCs with Integrated Teaching Learning Devices",
    "", 
    "",
    "Digital Boards with Content Management Systems and solutions (CMS)/ Learning Management System / Learning Management System ",
    "",
    "",
    "Projector ",
    "",
    "", 
    "Printer",
    "",
    "", 
    "Scanner",
    "",
    "",
    "Server",
    "",
    "",
    "Web Camera",
    "",
    "",
    "Smart TV",
    "",
    "",
    "Smart Class rooms used for teaching with digital boards/ smart boards/ virtual classrooms/ smart TV ",
    "",
    "",
    "Mobile phone used for teaching",
    "",
    "",
    "Radio used for teaching",
    "",
    "",
    "Generator/Invertors/Power Backup/Big UPS",
    "",
    "",
    "Internet facility",
    "",
    "DTH-TV channels",
    "E-content and digital resources for I-XII / I-XII",
    "Assistive tech-based solutions for CWSN / CWSN", 
    "Computer lab for students",
    "Whether ICT based tools are used for teaching",
    "",
    "Does the School have Digital Library",
    "","","","","","","","","","",
  ];

  /* Initialize form controls for dynamic data binding :: Start */
  labModelChanged : boolean = true;
  labModelData : any = [];  
  ITCInstructorTypeChanged : any = true;
  ITCInstructorTypeData : any = [];  
  /* Initialize form controls for dynamic data binding :: End  */

  /* Initialize form controls :: Start  */
    CADInfoId:any = "";
    schoolId:any = "";
    config = new Constant(); 
    academicYear:any = this.config.getAcademicCurrentYear();
    isCALLab:any = "";
    isICTLab:any = "";
    ICTLabYear:any = "";
    isICTLabFunc:any = "";
    model:any = "";
    ICTInstructorType:any = "";
    isLaptop:any = "";
    isTablets:any = "";
    isDesktop:any = "";
    isPCIntegrated:any = "";
    isDigBoard:any = "";
    isServer:any = "";
    isProjector:any = "";
    isSmartTV:any = "";
    isSmartClsRoom:any = "";
    isMobileUsed:any = "";
    isRadioUsed:any = "";
    isGenerator:any = "";
    isPrinter:any = "";
    isScanner:any = "";
    isWebCamera:any = "";
    isInternetFacility:any = "";
    isDTH:any = "";
    isEContent:any = "";
    isCWSN:any = "";
    totLaptop:any = "";
    totFnLaptop:any = "";
    totTablets:any = "";
    totFnTablets:any = "";
    totDesktop:any = "";
    totFnDesktop:any = "";
    totPCIntegrated:any = "";
    totFnPCIntegrated:any = "";
    totDigBoard:any = "";
    totFnDigBoard:any = "";
    totServer:any = "";
    totFnServer:any = "";
    totProjector:any = "";
    totFnProjector:any = "";
    totSmartTV:any = "";
    totFnSmartTV:any = "";
    totSmartClsRoom:any = "";
    totFnSmartClsRoom:any = "";
    totMobileUsed:any = "";
    totFnMobileUsed:any = "";
    totRadioUsed:any = "";
    totFnRadioUsed:any = "";
    totGenerator:any = "";
    totFnGenerator:any = "";
    totPrinter:any = "";
    totFnPrinter:any = "";
    totScanner:any = "";
    totFnScanner:any = "";
    totWebCamera:any = "";
    totFnWebCamera:any = "";
    internetConnectivty:any = "";
    isComLabForStd:any = "";
    isICTTools:any = "";
    noOfHours:any = "";
    hvDigiLib:any = "";
    noOfEBooks:any="";
    accountant:any = "";
    libraryAsst:any = "";
    labAsst:any = "";
    UDC:any = "";
    LDC:any = "";
    peon:any = "";
    watchman:any = "";
    draftStatus:any = 1;
  /* Initialize form controls :: End */
  userProfile: any = [];
  userId:any="";
  constructor(
    private router: ActivatedRoute,
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    public schoolService : SchoolService,
    private alertHelper : AlertHelper,
    private spinner : NgxSpinnerService,
    private commonserviceService : CommonserviceService,
    private route:Router,
    private el: ElementRef,
    public commonFunctionHelper: CommonFunctionHelper,
  ) { }

  ngOnInit(): void {
    this.encId = this.router.snapshot.params["encId"];
    this.userProfile = this.commonserviceService.getUserProfile();
    this.userId = this.userProfile?.userId;
    this.initializeForm();
    this.getLabModel();
    this.getITCInstructorType();
    this.getSchoolCADInfo(this.encId,this.academicYear);
  }
  ngAfterViewInit(){
    this.el.nativeElement.querySelector("[formControlName=isCALLab]").focus();
  }


  totVsFunCheck(totalItem:any,functionalItem:any,focusTarget:any){
    if(totalItem.value !=="" && functionalItem.value !==""  &&  (parseInt(functionalItem.value) > parseInt(totalItem.value)) ){
      // this.alertHelper.successAlert("Invalid","Total units can't be smaller than functional no of units.","error")
      this.alertHelper.viewAlert("error","Invalid","Total units can't be smaller than functional no of units.")
        .then((res: any) => {
          if(focusTarget==1){
            totalItem.focus();
          }else{
            functionalItem.focus();
          }
        }); 
     }else if(totalItem.value == 0 || totalItem.value=='' ){
      // this.alertHelper.successAlert("Invalid","Total units can't be blank or 0 .","error")
      this.alertHelper.viewAlert("error","Invalid","Total units can't be blank or 0.")

        .then((res: any) => {
            totalItem.focus();
        }); 
     }
  }

  getLabModel(){
    this.labModelChanged = true;
    this.labModelData = [];  
    this.schoolService.getLabModel().subscribe((res)=>{
      let data: any = res;
      for (let key of Object.keys(data['data'])) {
        this.labModelData.push(data['data'][key]);
      } 
      this.labModelChanged = false;
     });  
  }

  getITCInstructorType(){
    this.ITCInstructorTypeChanged = true;
    this.ITCInstructorTypeData = [];  
    this.schoolService.getITCInstructorType().subscribe((res)=>{
      let data: any = res;
      for (let key of Object.keys(data['data'])) {
        this.ITCInstructorTypeData.push(data['data'][key]);
      } 
      this.ITCInstructorTypeChanged = false;
     });  
  }

  initializeForm(){
    this.CADForm = this.formBuilder.group({
      encId:[this.encId],
      academicYear:[this.academicYear],
      isCALLab:[this.isCALLab,Validators.required],
      isICTLab:[this.isICTLab,Validators.required],
      ICTLabYear:[this.ICTLabYear,[
        Validators.required,
        Validators.min(1800),
        Validators.max(new Date().getFullYear()),
        Validators.minLength(4),
        Validators.maxLength(4),
        Validators.pattern(/^[0-9]\d*$/)]
      ],
      isICTLabFunc:[this.isICTLabFunc,Validators.required],
      model:[this.model,Validators.required],
      ICTInstructorType:[this.ICTInstructorType,Validators.required],
      isDesktop:[this.isDesktop,Validators.required],
      totDesktop:[this.totDesktop,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1),]],
      totFnDesktop:[this.totFnDesktop,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1),]],
     
      isLaptop:[this.isLaptop,Validators.required],
      totLaptop:[this.totLaptop,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1),]],
      // totLaptop:[this.totLaptop,[
      //   Validators.maxLength(3),
      //   Validators.pattern(/^[0-9]\d*$/),
      //   this.conditionalValidator(
      //     () => this.CADForm.get("isLaptop")?.value,
      //     Validators.required,
      //     "conditionalValidation"
      //   ),
      // ]],
      totFnLaptop:[this.totFnLaptop,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)]],
      isTablets:[this.isTablets,Validators.required],
      totTablets:[this.totTablets,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1),]],
      totFnTablets:[this.totFnTablets,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1),]],
      isPCIntegrated:[this.isPCIntegrated,Validators.required],
      totPCIntegrated:[this.totPCIntegrated,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1),]],
      totFnPCIntegrated:[this.totFnPCIntegrated,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1),]],
      isDigBoard:[this.isDigBoard,Validators.required],
      totDigBoard:[this.totDigBoard,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1),]],
      totFnDigBoard:[this.totFnDigBoard,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1),]],
      isProjector:[this.isProjector,Validators.required],
      totProjector:[this.totProjector,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1),]],
      totFnProjector:[this.totFnProjector,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1),]],
      isPrinter:[this.isPrinter,Validators.required],
      totPrinter:[this.totPrinter,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1),]],
      totFnPrinter:[this.totFnPrinter,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1),]],
      isScanner:[this.isScanner,Validators.required],
      totScanner:[this.totScanner,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1),]],
      totFnScanner:[this.totFnScanner,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1),]],
      isServer:[this.isServer,Validators.required],
      totServer:[this.totServer,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1),]],
      totFnServer:[this.totFnServer,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1),]],
      isWebCamera:[this.isWebCamera,Validators.required],
      totWebCamera:[this.totWebCamera,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1),]],
      totFnWebCamera:[this.totFnWebCamera,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1),]],
      isSmartTV:[this.isSmartTV,Validators.required],
      totSmartTV:[this.totSmartTV,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1),]],
      totFnSmartTV:[this.totFnSmartTV,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1),]],
      isSmartClsRoom:[this.isSmartClsRoom,Validators.required],
      totSmartClsRoom:[this.totSmartClsRoom,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1),]],
      totFnSmartClsRoom:[this.totFnSmartClsRoom,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1),]],
      isMobileUsed:[this.isMobileUsed,Validators.required],
      totMobileUsed:[this.totMobileUsed,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1),]],
      totFnMobileUsed:[this.totFnMobileUsed,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1),]],
      isRadioUsed:[this.isRadioUsed,Validators.required],
      totRadioUsed:[this.totRadioUsed,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1),]],
      totFnRadioUsed:[this.totFnRadioUsed,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1),]],
      isGenerator:[this.isGenerator,Validators.required],
      totGenerator:[this.totGenerator,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1),]],
      totFnGenerator:[this.totFnGenerator,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1),]],
      isInternetFacility:[this.isInternetFacility,Validators.required],
      internetConnectivty:[this.internetConnectivty],
      isDTH:[this.isDTH,Validators.required],
      isEContent:[this.isEContent,Validators.required],
      isCWSN:[this.isCWSN,Validators.required],
      isComLabForStd:[this.isComLabForStd,Validators.required],
      isICTTools:[this.isICTTools,Validators.required],
      noOfHours:[this.noOfHours,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1)]],
      hvDigiLib:[this.hvDigiLib,[Validators.required,Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1)]],
      noOfEBooks:[this.noOfEBooks,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1)]],
      accountant:[this.accountant,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1)]],
      libraryAsst:[this.libraryAsst,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1)]],
      labAsst:[this.labAsst,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1)]],
      UDC:[this.UDC,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1)]],
      LDC:[this.LDC,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1)]],
      peon:[this.peon,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1)]],
      watchman:[this.watchman,[Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/),Validators.min(1)]],
      draftStatus:[this.draftStatus],
      userId: [this.userId],
    });
  }
 
  // conditional validation
  conditionalValidator(
      predicate: any,
      validator: ValidatorFn,
      errorNamespace?: string
    ): ValidatorFn {
      return (formControl) => {
        // 1) if parent empty
        if (!formControl.parent) {
          return null;
        }
        let error = null;
        // 2) check childs direct parent field
  
        if (predicate()) {
          error = validator(formControl); // validate
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
    
  draft(){
    console.log(this.CADForm.value,'draft value');
    
    //this.customValidators.customFormValidationHandler(this.CADForm);
    // if ("INVALID" === this.CADForm.status) {
    //   for (const key of Object.keys(this.CADForm.controls)) {
    //     if (this.CADForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.customFormValidationHandler(this.CADForm);
    //       break;
    //     }
    //   }
    // }

    if(this.CADForm.invalid){
      this.customValidators.formValidationHandler(this.CADForm, this.allLabel, this.el);
    }

    if (this.CADForm.valid === true) {
      this.CADForm = this.formBuilder.group({...this.CADForm.value,
        draftStatus:[1],
      });
      this.formSubmit();
    }else{
      for(const control of Object.keys(this.CADForm.controls)) {
        this.CADForm.controls[control].markAsTouched();
        // console.log(this.CADForm.controls[control]);
        // console.log(this.CADForm.controls[control].errors);
      }
    }
  }

  finalSubmit(){
   // this.customValidators.customFormValidationHandler(this.CADForm);
  //  if ("INVALID" === this.CADForm.status) {
  //   for (const key of Object.keys(this.CADForm.controls)) {
  //     if (this.CADForm.controls[key].status === "INVALID") {
  //       const invalidControl = this.el.nativeElement.querySelector(
  //         '[formControlName="' + key + '"]'
  //       );
  //       invalidControl.focus();
  //       this.customValidators.customFormValidationHandler(this.CADForm);
  //       break;
  //     }
  //   }
  // }

  if(this.CADForm.invalid){
    this.customValidators.formValidationHandler(this.CADForm, this.allLabel, this.el);
  }

    if (this.CADForm.valid === true) {
      this.CADForm = this.formBuilder.group({...this.CADForm.value,
        draftStatus:[2],
      });
      this.formSubmit();
    }else{
      for(const control of Object.keys(this.CADForm.controls)) {
        this.CADForm.controls[control].markAsTouched();
        // console.log(this.CADForm.controls[control]);
        // console.log(this.CADForm.controls[control].errors);
      }
    }
  }
  getTeacherDetails(schoolId:any){
    this.schoolService.getTeacherDetails(schoolId).subscribe((res:any)=>{
      this.addharaCount=res.data['countOfAddhara'];
      this.addharaCount=(this.addharaCount[0]?.noOfTeacher)?this.addharaCount[0]?.noOfTeacher:0;
      this.teacherData=res.data['natureData'];
      this.teacherData?.map((item: any) => { 
        if(item.natureOfAppointmt==1){
          this.permanentTecherCount=item?.noOfTeacher;
          }
        if(item.natureOfAppointmt==2){
          this.contractTecherCount=item?.noOfTeacher;
          }
        });
     })   
  }
  formSubmit(){
    this.submitted = true;
    if (this.CADForm.invalid) {
      this.customValidators.formValidationHandler(this.CADForm, this.allLabel, this.el);
    }
    if (this.CADForm.invalid) {
      return;
    }
    // this.customValidators.customFormValidationHandler(this.CADForm);
    /* Depedency Validation */
    if (this.CADForm.get("isDesktop")?.value == 1){
      if(this.CADForm.controls["totDesktop"]?.value == '' || this.CADForm.controls["totDesktop"]?.value == 0) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totDesktop"]');
          invalidControl.focus();
        // this.alertHelper.successAlert("Invalid", "Total no. of units for desktop/pcs	can not be blank or zero", "error");
        this.alertHelper.viewAlert("error","Invalid","Total no. of units for desktop/pcs	can not be blank or zero");
        return;
        }
        if(this.CADForm.controls["totDesktop"]?.value != '') {
          if(this.CADForm.controls["totFnDesktop"]?.value == ''){
            const invalidControl = this.el.nativeElement.querySelector(
              '[formControlName="totFnDesktop"]');
              invalidControl.focus();
            // this.alertHelper.successAlert("Invalid", "Total no. of functional units for desktop/pcs	can not be blank or zero", "error");
            this.alertHelper.viewAlert("error","Invalid","Total no. of functional units for desktop/pcs	can not be blank");
            return;
          }
       
          }
    }
    if (this.CADForm.get("isLaptop")?.value == 1){
      if(this.CADForm.controls["totLaptop"]?.value == '' || this.CADForm.controls["totLaptop"]?.value == 0) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totLaptop"]');
          invalidControl.focus();
        // this.alertHelper.successAlert("Invalid", "Total no. of  units for laptop/notebook can not be blank or zero", "error");
         this.alertHelper.viewAlert("error","Invalid","Total no. of  units for laptop/notebook can not be blank or zero");
        return;
        }
        if(this.CADForm.controls["totLaptop"]?.value != '') {
          if(this.CADForm.controls["totFnLaptop"]?.value == ''){
            const invalidControl = this.el.nativeElement.querySelector(
              '[formControlName="totFnLaptop"]');
              invalidControl.focus();
            // this.alertHelper.successAlert("Invalid", "Total no. of functional units for laptop/notebook can not be blank or zero", "error");
             this.alertHelper.viewAlert("error","Invalid","Total no. of functional units for laptop/notebook can not be blank");
            return;
          }
       
          }
    }
    if (this.CADForm.get("isTablets")?.value == 1){
      if(this.CADForm.controls["totTablets"]?.value == '' || this.CADForm.controls["totTablets"]?.value == 0) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totTablets"]');
          invalidControl.focus();
        // this.alertHelper.successAlert("Invalid", "Total no. of  units for tablets can not be blank  or zero", "error");
         this.alertHelper.viewAlert("error","Invalid","Total no. of  units for tablets can not be blank  or zero");
        return;
        }
        if(this.CADForm.controls["totTablets"]?.value != '') {
          if(this.CADForm.controls["totFnTablets"]?.value == ''){
            const invalidControl = this.el.nativeElement.querySelector(
              '[formControlName="totFnTablets"]');
              invalidControl.focus();
            // this.alertHelper.successAlert("Invalid", "Total no. of functional units for tablets can not be blank or zero", "error");
             this.alertHelper.viewAlert("error","Invalid","Total no. of functional units for tablets can not be blank");
            return;
          }
       
          }
    }
    if (this.CADForm.get("isPCIntegrated")?.value == 1){
      if(this.CADForm.controls["totPCIntegrated"]?.value == ''|| this.CADForm.controls["totPCIntegrated"]?.value == 0) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totPCIntegrated"]');
          invalidControl.focus();
        // this.alertHelper.successAlert("Invalid", "Total no. of  units for pcs with integrated teaching learning devices	can not be blank or zero", "error");
         this.alertHelper.viewAlert("error","Invalid","Total no. of  units for pcs with integrated teaching learning devices	can not be blank or zero");
        return;
        }
        if(this.CADForm.controls["totPCIntegrated"]?.value != '') {
          if(this.CADForm.controls["totFnPCIntegrated"]?.value == ''){
            const invalidControl = this.el.nativeElement.querySelector(
              '[formControlName="totFnPCIntegrated"]');
              invalidControl.focus();
            // this.alertHelper.successAlert("Invalid", "Total no. of functional units for pcs with integrated teaching learning devices can not be blank or zero", "error");
             this.alertHelper.viewAlert("error","Invalid","Total no. of functional units for pcs with integrated teaching learning devices can not be blank");
            return;
          }
       
          }
    }
    if (this.CADForm.get("isDigBoard")?.value == 1){
      if(this.CADForm.controls["totDigBoard"]?.value == '' || this.CADForm.controls["totDigBoard"]?.value == 0) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totDigBoard"]');
          invalidControl.focus();
        // this.alertHelper.successAlert("Invalid", "Total no. of  units for digital boards with content management systems and solutions (CMS)/ learning management system	can not be blank  or zero", "error");
         this.alertHelper.viewAlert("error","Invalid","Total no. of  units for digital boards with content management systems and solutions (CMS)/ learning management system	can not be blank  or zero");
        return;
        }
        if(this.CADForm.controls["totDigBoard"]?.value != '') {
          if(this.CADForm.controls["totFnDigBoard"]?.value == ''){
            const invalidControl = this.el.nativeElement.querySelector(
              '[formControlName="totFnDigBoard"]');
              invalidControl.focus();
            // this.alertHelper.successAlert("Invalid", "Total no. of functional units for digital boards with content management systems and solutions (CMS)/ learning management system	can not be blank  or zero", "error");
             this.alertHelper.viewAlert("error","Invalid","Total no. of functional units for digital boards with content management systems and solutions (CMS)/ learning management system	can not be blank");
            return;
          }
       
          }
    }
    if (this.CADForm.get("isProjector")?.value == 1){
      if(this.CADForm.controls["totProjector"]?.value == '' || this.CADForm.controls["totProjector"]?.value == 0) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totProjector"]');
          invalidControl.focus();
        // this.alertHelper.successAlert("Invalid", "Total no. of  units for projector	can not be blank  or zero", "error");
         this.alertHelper.viewAlert("error","Invalid","Total no. of  units for projector	can not be blank  or zero");
        return;
        }
        if(this.CADForm.controls["totProjector"]?.value != '') {
          if(this.CADForm.controls["totFnProjector"]?.value == ''){
            const invalidControl = this.el.nativeElement.querySelector(
              '[formControlName="totFnProjector"]');
              invalidControl.focus();
            // this.alertHelper.successAlert("Invalid", "Total no. of functional units for projector	can not be blank  or zero", "error");
             this.alertHelper.viewAlert("error","Invalid","Total no. of functional units for projector	can not be blank");
            return;
          }
       
          }
    }
    if (this.CADForm.get("isPrinter")?.value == 1){
      if(this.CADForm.controls["totPrinter"]?.value == '' || this.CADForm.controls["totPrinter"]?.value == 0) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totPrinter"]');
          invalidControl.focus();
        // this.alertHelper.successAlert("Invalid", "Total no. of  units for printer	can not be blank  or zero", "error");
         this.alertHelper.viewAlert("error","Invalid","Total no. of  units for printer	can not be blank  or zero");
        return;
        }
        if(this.CADForm.controls["totPrinter"]?.value != '') {
          if(this.CADForm.controls["totFnPrinter"]?.value == ''){
            const invalidControl = this.el.nativeElement.querySelector(
              '[formControlName="totFnPrinter"]');
              invalidControl.focus();
            // this.alertHelper.successAlert("Invalid", "Total no. of functional units for printer	can not be blank  or zero", "error");
             this.alertHelper.viewAlert("error","Invalid","Total no. of functional units for printer	can not be blank ");
            return;
          }
       
          }
    }
    if (this.CADForm.get("isScanner")?.value == 1){
      if(this.CADForm.controls["totScanner"]?.value == '' || this.CADForm.controls["totScanner"]?.value == 0) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totScanner"]');
          invalidControl.focus();
        // this.alertHelper.successAlert("Invalid", "Total no. of  units for scanner	can not be blank  or zero", "error");
         this.alertHelper.viewAlert("error","Invalid","Total no. of  units for scanner	can not be blank  or zero");
        return;
        }
        if(this.CADForm.controls["totScanner"]?.value != '') {
          if(this.CADForm.controls["totFnScanner"]?.value == ''){
            const invalidControl = this.el.nativeElement.querySelector(
              '[formControlName="totFnScanner"]');
              invalidControl.focus();
            // this.alertHelper.successAlert("Invalid", "Total no. of functional units for scanner	can not be blank  or zero", "error");
             this.alertHelper.viewAlert("error","Invalid","Total no. of functional units for scanner	can not be blank ");
            return;
          }
       
          }
    }
    if (this.CADForm.get("isServer")?.value == 1){
      if(this.CADForm.controls["totServer"]?.value == '' || this.CADForm.controls["totServer"]?.value == 0) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totServer"]');
          invalidControl.focus();
        // this.alertHelper.successAlert("Invalid", "Total no. of  units for server	can not be blank  or zero", "error");
         this.alertHelper.viewAlert("error","Invalid","Total no. of  units for server	can not be blank  or zero");
        return;
        }
        if(this.CADForm.controls["totServer"]?.value != '') {
          if(this.CADForm.controls["totFnServer"]?.value == ''){
            const invalidControl = this.el.nativeElement.querySelector(
              '[formControlName="totFnServer"]');
              invalidControl.focus();
            // this.alertHelper.successAlert("Invalid", "Total no. of functional units for server can not be blank or zero", "error");
             this.alertHelper.viewAlert("error","Invalid","Total no. of functional units for server can not be blank");
            return;
          }
       
          }
    }
    if (this.CADForm.get("isWebCamera")?.value == 1){
      if(this.CADForm.controls["totWebCamera"]?.value == '' || this.CADForm.controls["totWebCamera"]?.value == 0) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totWebCamera"]');
          invalidControl.focus();
        // this.alertHelper.successAlert("Invalid", "Total no. of  units for web camera	can not be blank  or zero", "error");
         this.alertHelper.viewAlert("error","Invalid","Total no. of  units for web camera	can not be blank  or zero");
        return;
        }
        if(this.CADForm.controls["totWebCamera"]?.value != '') {
          if(this.CADForm.controls["totFnWebCamera"]?.value == ''){
            const invalidControl = this.el.nativeElement.querySelector(
              '[formControlName="totFnWebCamera"]');
              invalidControl.focus();
            // this.alertHelper.successAlert("Invalid", "Total no. of functional units for web camera can not be blank  or zero", "error");
             this.alertHelper.viewAlert("error","Invalid","Total no. of functional units for web camera can not be blank");
            return;
          }
       
          }
    }
    if (this.CADForm.get("isSmartTV")?.value == 1){
      if(this.CADForm.controls["totSmartTV"]?.value == ''|| this.CADForm.controls["totSmartTV"]?.value == 0) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totSmartTV"]');
          invalidControl.focus();
        // this.alertHelper.successAlert("Invalid", "Total no. of  units for smart tv	can not be blank  or zero", "error");
         this.alertHelper.viewAlert("error","Invalid","Total no. of  units for smart tv	can not be blank  or zero");
        return;
        }
        if(this.CADForm.controls["totSmartTV"]?.value != '') {
          if(this.CADForm.controls["totFnSmartTV"]?.value == ''){
            const invalidControl = this.el.nativeElement.querySelector(
              '[formControlName="totFnSmartTV"]');
              invalidControl.focus();
            // this.alertHelper.successAlert("Invalid", "Total no. of functional units for smart tv	can not be blank  or zero", "error");
             this.alertHelper.viewAlert("error","Invalid","Total no. of functional units for smart tv	can not be blank");
            return;
          }
       
          }
    }
    if (this.CADForm.get("isSmartClsRoom")?.value == 1){
      if(this.CADForm.controls["totSmartClsRoom"]?.value == ''|| this.CADForm.controls["totSmartClsRoom"]?.value == 0) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totSmartClsRoom"]');
          invalidControl.focus();
        // this.alertHelper.successAlert("Invalid", "Total no. of  units for smart class rooms used for teaching with digital boards/ smart boards/ virtual classrooms/ smart tv	can not be blank  or zero", "error");
         this.alertHelper.viewAlert("error","Invalid","Total no. of  units for smart class rooms used for teaching with digital boards/ smart boards/ virtual classrooms/ smart tv	can not be blank  or zero");
        return;
        }
        if(this.CADForm.controls["totSmartClsRoom"]?.value != '') {
          if(this.CADForm.controls["totFnSmartClsRoom"]?.value == ''){
            const invalidControl = this.el.nativeElement.querySelector(
              '[formControlName="totFnSmartClsRoom"]');
              invalidControl.focus();
            // this.alertHelper.successAlert("Invalid", "Total no. of functional units for smart class rooms used for teaching with digital boards/ smart boards/ virtual classrooms/ smart tv	can not be blank  or zero", "error");
             this.alertHelper.viewAlert("error","Invalid","Total no. of functional units for smart class rooms used for teaching with digital boards/ smart boards/ virtual classrooms/ smart tv	can not be blank");
            return;
          }
       
          }
    }
    if (this.CADForm.get("isMobileUsed")?.value == 1){
      if(this.CADForm.controls["totMobileUsed"]?.value == ''|| this.CADForm.controls["totMobileUsed"]?.value == 0) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totMobileUsed"]');
          invalidControl.focus();
        // this.alertHelper.successAlert("Invalid", "Total no. of  units for mobile phone used for teaching	can not be blank  or zero", "error");
         this.alertHelper.viewAlert("error","Invalid","Total no. of  units for mobile phone used for teaching	can not be blank  or zero");
        return;
        }
        if(this.CADForm.controls["totMobileUsed"]?.value != '') {
          if(this.CADForm.controls["totFnMobileUsed"]?.value == ''){
            const invalidControl = this.el.nativeElement.querySelector(
              '[formControlName="totFnMobileUsed"]');
              invalidControl.focus();
            // this.alertHelper.successAlert("Invalid", "Total no. of functional units for mobile phone used for teaching	can not be blank  or zero", "error");
             this.alertHelper.viewAlert("error","Invalid","Total no. of functional units for mobile phone used for teaching	can not be blank");
            return;
          }
       
          }
    }

    if (this.CADForm.get("isRadioUsed")?.value == 1){
      if(this.CADForm.controls["totRadioUsed"]?.value == ''|| this.CADForm.controls["totRadioUsed"]?.value == 0) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totRadioUsed"]');
          invalidControl.focus();
        // this.alertHelper.successAlert("Invalid", "Total no. of  units for radio used for teaching	can not be blank or zero", "error");
         this.alertHelper.viewAlert("error","Invalid","Total no. of  units for radio used for teaching	can not be blank or zero");
        return;
        }
        if(this.CADForm.controls["totRadioUsed"]?.value != '') {
          if(this.CADForm.controls["totFnRadioUsed"]?.value == ''){
            const invalidControl = this.el.nativeElement.querySelector(
              '[formControlName="totFnRadioUsed"]');
              invalidControl.focus();
            // this.alertHelper.successAlert("Invalid", "Total no. of functional units for radio used for teaching	can not be blank  or zero", "error");
             this.alertHelper.viewAlert("error","Invalid","Total no. of functional units for radio used for teaching	can not be blank");
            return;
          }
       
          }
    }
    if (this.CADForm.get("isGenerator")?.value == 1){
      if(this.CADForm.controls["totGenerator"]?.value == ''|| this.CADForm.controls["totGenerator"]?.value == 0) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="totGenerator"]');
          invalidControl.focus();
        // this.alertHelper.successAlert("Invalid", "Total no. of  units for generator/invertors/power backup/big ups	can not be blank  or zero", "error");
         this.alertHelper.viewAlert("error","Invalid","Total no. of  units for generator/invertors/power backup/big ups	can not be blank  or zero");
        return;
        }
        if(this.CADForm.controls["totGenerator"]?.value != '') {
          if(this.CADForm.controls["totFnGenerator"]?.value == ''){
            const invalidControl = this.el.nativeElement.querySelector(
              '[formControlName="totFnGenerator"]');
              invalidControl.focus();
            // this.alertHelper.successAlert("Invalid", "Total no. of functional units for generator/invertors/power backup/big ups	can not be blank  or zero", "error");
             this.alertHelper.viewAlert("error","Invalid","Total no. of functional units for generator/invertors/power backup/big ups	can not be blank");
            return;
          }
       
          }
    }
    if (this.CADForm.get("isInternetFacility")?.value == 1){
      if(this.CADForm.controls["internetConnectivty"]?.value == ''|| this.CADForm.controls["internetConnectivty"]?.value == 0) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="internetConnectivty"]');
          invalidControl.focus();
        // this.alertHelper.successAlert("Invalid", "Internet facility Type	can not be blank", "error");
         this.alertHelper.viewAlert("error","Invalid","Internet facility Type	can not be blank");
        return;
        }
    }
    if (this.CADForm.get("isICTTools")?.value == 1){
      if(this.CADForm.controls["noOfHours"]?.value == ''|| this.CADForm.controls["noOfHours"]?.value == 0) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="noOfHours"]');
          invalidControl.focus();
        // this.alertHelper.successAlert("Invalid", "Number of hours spent/week can not be blank  or zero", "error");
         this.alertHelper.viewAlert("error","Invalid","Number of hours spent/week can not be blank  or zero");
        return;
        }
    }
    if (this.CADForm.get("hvDigiLib")?.value == 1){
      if(this.CADForm.controls["noOfEBooks"]?.value == ''|| this.CADForm.controls["noOfEBooks"]?.value == 0) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="noOfEBooks"]');
          invalidControl.focus();
        // this.alertHelper.successAlert("Invalid", "Number of e-Books/e-Contents available can not be blank  or zero", "error");
         this.alertHelper.viewAlert("error","Invalid","Number of e-Books/e-Contents available can not be blank  or zero");
        return;
        }
    }
     /* Depedency Validation */
    if (this.CADForm.valid === true) {
      this.alertHelper.submitAlert().then((result: any) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.schoolService
            .schoolCADInfoUpdate(this.CADForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "School computers and digital initiatives info data saved successfully.",
                    "success"
                  )
                  .then(() => {
                    this.route.navigate(["../../../schoolRegistration/viewSchool"], {
                      relativeTo: this.router,
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
                  "Error",
                  errorMessage
                );
              },
            });
        }
      });
    }
  }

  isDesktopRdControl(e:any){
    this.isDesktop = e.target.value;
    if(e.target.value !== 1){
      this.CADForm.controls['totDesktop'].patchValue('');
      this.CADForm.controls['totFnDesktop'].patchValue('');
    }
  }
  isLaptopRdControl(e:any){
    this.isLaptop = e.target.value;
    if(e.target.value !== 1){
      this.CADForm.controls['totLaptop'].patchValue('');
      this.CADForm.controls['totFnLaptop'].patchValue('');
    }
  }
  isTabletsRdControl(e:any){
    this.isTablets = e.target.value;
    if(e.target.value !== 1){
      this.CADForm.controls['totTablets'].patchValue('');
      this.CADForm.controls['totFnTablets'].patchValue('');
    }
  }
  isPCIntegratedRdControl(e:any){
    this.isPCIntegrated = e.target.value;
    if(e.target.value !== 1){
      this.CADForm.controls['totPCIntegrated'].patchValue('');
      this.CADForm.controls['totFnPCIntegrated'].patchValue('');
    }
  }
  isDigBoardRdControl(e:any){
    this.isDigBoard = e.target.value;
    if(e.target.value !== 1){
      this.CADForm.controls['totDigBoard'].patchValue('');
      this.CADForm.controls['totFnDigBoard'].patchValue('');
    }
  }
  isServerRdControl(e:any){
    this.isServer = e.target.value;
    if(e.target.value !== 1){
      this.CADForm.controls['totServer'].patchValue('');
      this.CADForm.controls['totFnServer'].patchValue('');
    }
  }
  isPrinterRdControl(e:any){
    this.isPrinter = e.target.value;
    if(e.target.value !== 1){
      this.CADForm.controls['totPrinter'].patchValue('');
      this.CADForm.controls['totFnPrinter'].patchValue('');
    }
  }
  isScannerRdControl(e:any){
    this.isScanner = e.target.value;
    if(e.target.value !== 1){
      this.CADForm.controls['totScanner'].patchValue('');
      this.CADForm.controls['totFnScanner'].patchValue('');
    }
  }
  isProjectorRdControl(e:any){
    this.isProjector = e.target.value;
    if(e.target.value !== 1){
      this.CADForm.controls['totProjector'].patchValue('');
      this.CADForm.controls['totFnProjector'].patchValue('');
    }
  }
  isSmartTVRdControl(e:any){
    this.isSmartTV = e.target.value;
    if(e.target.value !== 1){
      this.CADForm.controls['totSmartTV'].patchValue('');
      this.CADForm.controls['totFnSmartTV'].patchValue('');
    }
  }
  isSmartClsRoomRdControl(e:any){
    this.isSmartClsRoom = e.target.value;
    if(e.target.value !== 1){
      this.CADForm.controls['totPrinter'].patchValue('');
      this.CADForm.controls['totFnPrinter'].patchValue('');
    }
  }
  isMobileUsedRdControl(e:any){
    this.isMobileUsed = e.target.value;
    if(e.target.value !== 1){
      this.CADForm.controls['totMobileUsed'].patchValue('');
      this.CADForm.controls['totFnMobileUsed'].patchValue('');
    }
  }
  isRadioUsedRdControl(e:any){
    this.isRadioUsed = e.target.value;
    if(e.target.value !== 1){
      this.CADForm.controls['totRadioUsed'].patchValue('');
      this.CADForm.controls['totFnRadioUsed'].patchValue('');
    }
  }
  isGeneratorRdControl(e:any){
    this.isGenerator = e.target.value;
    if(e.target.value !== 1){
      this.CADForm.controls['totGenerator'].patchValue('');
      this.CADForm.controls['totFnGenerator'].patchValue('');
    }
  }
  isWebCameraRdControl(e:any){
    this.isWebCamera = e.target.value;
    if(e.target.value !== 1){
      this.CADForm.controls['totWebCamera'].patchValue('');
      this.CADForm.controls['totFnWebCamera'].patchValue('');
    }
  }
  isInternetFacilityRdControl(e:any){
    this.isInternetFacility = e.target.value;
  }
  isICTToolsRdControl(e:any){
    this.isICTTools = e.target.value;
    this.CADForm.controls['noOfHours'].patchValue('');
  }
  hvDigiLibRdControl(e:any){
    this.hvDigiLib = e.target.value;
    this.CADForm.controls['noOfEBooks'].patchValue('');
  }
  getSchoolCADInfo(encId: any,academicYear:any){
    this.spinner.show();
    this.schoolService.getSchoolCADInfo(encId,academicYear).subscribe((res:any)=>{
      if(res.data.length>0){
          this.CADInfo = res.data[0];
          //console.log(this.CADInfo);
          this.isCALLab=this.CADInfo.isCALLab;
          this.isICTLab=this.CADInfo.isICTLab;
          this.ICTLabYear=this.CADInfo.ICTLabYear;
          this.isICTLabFunc=this.CADInfo.isICTLabFunc;
          this.model=this.CADInfo.model;
          this.ICTInstructorType=this.CADInfo.ICTInstructorType;
          this.isLaptop=this.CADInfo.isLaptop;
          this.isTablets=this.CADInfo.isTablets;
          this.isDesktop=this.CADInfo.isDesktop;
          this.isPCIntegrated=this.CADInfo.isPCIntegrated;
          this.isDigBoard=this.CADInfo.isDigBoard;
          this.isServer=this.CADInfo.isServer;
          this.isProjector=this.CADInfo.isProjector;
          this.isSmartTV=this.CADInfo.isSmartTV;
          this.isSmartClsRoom=this.CADInfo.isSmartClsRoom;
          this.isMobileUsed=this.CADInfo.isMobileUsed;
          this.isRadioUsed=this.CADInfo.isRadioUsed;
          this.isGenerator=this.CADInfo.isGenerator;
          this.isPrinter=this.CADInfo.isPrinter;
          this.isScanner=this.CADInfo.isScanner;
          this.isWebCamera=this.CADInfo.isWebCamera;
          this.isInternetFacility=this.CADInfo.isInternetFacility;
          this.isDTH=this.CADInfo.isDTH;
          this.isEContent=this.CADInfo.isEContent;
          this.isCWSN=this.CADInfo.isCWSN;
          this.totLaptop=this.CADInfo.totLaptop;
          this.totFnLaptop=this.CADInfo.totFnLaptop;
          this.totTablets=this.CADInfo.totTablets;
          this.totFnTablets=this.CADInfo.totFnTablets;
          this.totDesktop=this.CADInfo.totDesktop;
          this.totFnDesktop=this.CADInfo.totFnDesktop;
          this.totPCIntegrated=this.CADInfo.totPCIntegrated;
          this.totFnPCIntegrated=this.CADInfo.totFnPCIntegrated;
          this.totDigBoard=this.CADInfo.totDigBoard;
          this.totFnDigBoard=this.CADInfo.totFnDigBoard;
          this.totServer=this.CADInfo.totServer;
          this.totFnServer=this.CADInfo.totFnServer;
          this.totProjector=this.CADInfo.totProjector;
          this.totFnProjector=this.CADInfo.totFnProjector;
          this.totSmartTV=this.CADInfo.totSmartTV;
          this.totFnSmartTV=this.CADInfo.totFnSmartTV;
          this.totSmartClsRoom=this.CADInfo.totSmartClsRoom;
          this.totFnSmartClsRoom=this.CADInfo.totFnSmartClsRoom; 
          this.totMobileUsed=this.CADInfo.totMobileUsed;
          this.totFnMobileUsed=this.CADInfo.totFnMobileUsed;
          this.totRadioUsed=this.CADInfo.totRadioUsed;
          this.totFnRadioUsed=this.CADInfo.totFnRadioUsed;
          this.totGenerator=this.CADInfo.totGenerator;
          this.totFnGenerator=this.CADInfo.totFnGenerator;
          this.totPrinter=this.CADInfo.totPrinter;
          this.totFnPrinter=this.CADInfo.totFnPrinter;
          this.totScanner=this.CADInfo.totScanner;
          this.totFnScanner=this.CADInfo.totFnScanner;
          this.totWebCamera=this.CADInfo.totWebCamera;
          this.totFnWebCamera=this.CADInfo.totFnWebCamera;
          this.internetConnectivty=this.CADInfo.internetConnectivty;
          this.isComLabForStd=this.CADInfo.isComLabForStd;
          this.isICTTools=this.CADInfo.isICTTools;
          this.noOfHours=this.CADInfo.noOfHours;
          this.hvDigiLib=this.CADInfo.hvDigiLib;
          this.noOfEBooks=this.CADInfo.noOfEBooks;
          this.accountant=this.CADInfo.accountant;
          this.libraryAsst=this.CADInfo.libraryAsst;
          this.labAsst=this.CADInfo.labAsst;
          this.UDC=this.CADInfo.UDC;
          this.LDC=this.CADInfo.LDC;
          this.peon=this.CADInfo.peon;
          this.watchman=this.CADInfo.watchman;
          this.draftStatus=this.CADInfo.draftStatus;
      }      
      this.initializeForm();
      this.getTeacherDetails(this.encId);     
      this.spinner.hide();
    })      
  }
  pageChangeWarningHandler(path: string) {
    let isFormFilled: boolean = false;
    const otherInfoObj = this.CADForm?.value; 
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
