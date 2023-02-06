import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';
import { Constant } from "src/app/shared/constants/constant";
import { SchoolService } from '../../../services/school.service';

@Component({
  selector: 'app-view-cad',
  templateUrl: './view-cad.component.html',
  styleUrls: ['./view-cad.component.css']
})
export class ViewCadComponent implements OnInit {
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
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.encId = this.router.snapshot.params["encId"];
    this.userProfile = this.commonserviceService.getUserProfile();
    this.userId = this.userProfile?.userId;
    this.getLabModel();
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
      this.getITCInstructorType();
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
      this.getSchoolCADInfo(this.encId,this.academicYear);
     });  
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
          this.model=this.labModelData.filter((item:any) => item.anxtValue === this.model)[0]['anxtValue'] + '-' + this.labModelData.filter((item:any) => item.anxtValue === this.model)[0]['anxtName'];

          this.ICTInstructorType=this.CADInfo.ICTInstructorType;             
          this.ICTInstructorType=this.ITCInstructorTypeData.filter((item:any) => item.anxtValue === this.ICTInstructorType)[0]['anxtValue'] + '-' + this.ITCInstructorTypeData.filter((item:any) => item.anxtValue === this.ICTInstructorType)[0]['anxtName'];

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
      this.getTeacherDetails(this.encId);     
      this.spinner.hide();
    })      
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
}
