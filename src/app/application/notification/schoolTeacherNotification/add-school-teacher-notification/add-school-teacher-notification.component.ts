import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { SchoolService } from 'src/app/application/school/services/school.service';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { CommonNotificationServiceService } from '../../services/common-notification-service.service';
import { ManageSchoolTeacherService } from '../../services/manage-school-teacher.service';

@Component({
  selector: 'app-add-school-teacher-notification',
  templateUrl: './add-school-teacher-notification.component.html',
  styleUrls: ['./add-school-teacher-notification.component.css']
})
export class AddSchoolTeacherNotificationComponent implements OnInit {

  addSchoolTeacherNotifyForm!:FormGroup;

  blockDropdown:IDropdownSettings={}; 
  clusterDropdown:IDropdownSettings={};
  managementDropdown:IDropdownSettings={};
  schoolCategoryDropdown:IDropdownSettings={};
  schoolDropdown:IDropdownSettings={};
  natureAppointDropdown:IDropdownSettings={};
  appointTypeDropdown:IDropdownSettings={};
  teacherDropdown:IDropdownSettings={};

  notificationMode: any="1";
  typeOfAttachment: any="1";
  noticeType: any="2";

  notificationModeSMS:boolean=true;
  linkDivShow:boolean=false;
  doumentDivShow:boolean=false;
  teacherDivShow:boolean=false;

  blockDisable: boolean = false;
  clusterDisable: boolean = false;

  selectedBlockItems: any = [];
  selectedClusterItems: any = [];

  // Variables For Spinner Blocks
  showSpinnerBlock: boolean = false;
  showSpinnerDist: boolean=false;
  showSpinnerBlockByDistId: boolean=false;
  showSpinnerClusterByBlockId: boolean=false;
  showCompName: boolean = false;
  showSpinnerSchoolMgmt: boolean = false;
  showSpinnerSchoolCatagory: boolean = false;
  showSpinnerSchoolName: boolean = false;
  showSpinnerTeacherName: boolean = false;
  // End Variables For Spinner Blocks
  
  scDisrtictSelect: boolean = false;
  scBlockSelect: boolean = false;

  currentDistData: any="";
  currentBlockData: any="";  

  // FormControl Variables
  category: any="";
  component: any="";
  contentType: any="1";
  subject: any="";
  notificationContent: any="";
  uploadDocument: any="";
  url: any="";
  stateSpecCategory: any="";
  school: any="";
  natureOfAppoint: any="";
  teacher: any="";
  appointType: any="";
  management: any="";
  cluster: any="";
  block: any="";
  district: any="";
  state: any="";
  schoolCategory: any="";
   // End Of FormControl Variables

  // Section For userProfile variables
  userProfile: any = "";
  schoolId: any = "";
  userLevel: any = "";
  districtId: any = "";
  blockId: any = "";
  clusterId: any = "";
  userId: any = "";
  submitted: boolean=false;
  // End Section For userProfile variables

  notificationCatName: any="";
  notificationCompName: any="";

  allDistrictData: any=[];
  allBlockByDistIdData: any=[];
  blockData: any = [];
  allClusterByBlockIdData: any= [];
  clusterData: any = [];
  schoolCatData: any = [];
  schoolMgmtData:any = [];
  schoolNameData: any = [];
  natureOfAppointDatas: any =[];
  appointTypeData: any = [];
  teacherNameData: any= [];

  blockIdArr: any = [];
  clusterIdArr: any = [];
  managementIdArr: any = [];
  schoolCatIdArr: any = [];
  schoolIdArr: any = [];
  natureOfAppointIdArr: any = [];
  appointTypeIdArr: any = [];
  teacherIdArr: any = [];

  blockIdStr: any = "";
  clusterIdStr: any = "";
  managementIdStr: any = "";
  schoolCatIdStr: any = "";
  schoolIdStr: any = "";
  natureOfAppointIdStr: any = "";
  appointTypeIdStr: any = "";
  teacherIdStr: any = "";  
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
 
  allLabel: string[] = ["Notification mode","Category","Component","Content type","Subject","Notification content","Types of attachment","Upload document","URL","Notice type","District","Block","Cluster","Management","School category","School","Nature of appointment","Appointment type","Teacher"];
  
  constructor( 
    private spinner: NgxSpinnerService, 
    private manageSchoolTeacherService:ManageSchoolTeacherService, 
    private commonNotificationServiceService:CommonNotificationServiceService, 
    private alertHelper: AlertHelper,
    private formBuilder: FormBuilder,
    public commonserviceService: CommonserviceService,
    public customValidators: CustomValidators,
    private router: ActivatedRoute,
    private route: Router,
    private schoolService:SchoolService,
    private el: ElementRef, 
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    ) { 
      const pageUrl:any = this.route.url;  
	    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
	    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For admin authorization	
    }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    this.el.nativeElement.querySelector('[formControlName=category]')?.focus(); 
    this.userProfile = this.commonserviceService.getUserProfile();
    this.schoolId = this.userProfile.school;
    this.districtId = this.userProfile.district;
    this.blockId = this.userProfile.block;
    this.clusterId = this.userProfile.cluster;
    this.userLevel = this.userProfile.userLevel;

    this.initializeForm();
    this.getNotificationCatName();
    this.getSchoolManagement();
    this.getSchoolCategory();
    this.getDistrict();

    this.blockDropdown = {      
      idField: 'blockId',
      textField: 'showBlock',
      enableCheckAll: true,
      selectAllText: "Select All Block",
      unSelectAllText: "UnSelect All Block",
      noDataAvailablePlaceholderText: "No block available",
      allowSearchFilter: true,
      itemsShowLimit: 3,
    };  
    this.clusterDropdown = {
      idField: 'clusterId',
      textField: 'showCluster',
      enableCheckAll: true,
      selectAllText: "Select All Cluster",
      unSelectAllText: "UnSelect All Cluster",
      noDataAvailablePlaceholderText: "No cluster available",
      allowSearchFilter: true,
      itemsShowLimit: 3,
    }; 

    this.managementDropdown = {
      idField: 'anxtValue',
      textField: 'showManagement',
      enableCheckAll: true,
      selectAllText: "Select All Management",
      unSelectAllText: "UnSelect All Management",
      noDataAvailablePlaceholderText: "No Management available",
      allowSearchFilter: true,
      itemsShowLimit: 3,
    }; 

    this.schoolCategoryDropdown = {
      idField: 'schlCatId',
      textField: 'schlCatName',
      enableCheckAll: true,
      selectAllText: "Select All SchoolCategory",
      unSelectAllText: "UnSelect All SchoolCategory",
      noDataAvailablePlaceholderText: "No SchoolCategory available",
      allowSearchFilter: true,
      itemsShowLimit: 3,
    }; 
    
    this.schoolDropdown = {
      idField: 'schoolId',
      textField: 'showSchool',
      enableCheckAll: true,
      selectAllText: "Select All School",
      unSelectAllText: "UnSelect All School",
      noDataAvailablePlaceholderText: "No School available",
      allowSearchFilter: true,
      itemsShowLimit: 3,
    }; 
    this.teacherDropdown = {
      idField: 'tId',
      textField: 'showTeacher',
      enableCheckAll: true,
      selectAllText: "Select All Teacher",
      unSelectAllText: "UnSelect All Teacher",
      noDataAvailablePlaceholderText: "No Teacher available",
      allowSearchFilter: true,
      itemsShowLimit: 3,
    }; 
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

       // validation logic for NotificationContent
       if (validationType === "notificationContent" && parentValue == 1) {
        conditionStatus = true;
      } 

       // validation logic for TypeOfAttachment
       if (validationType === "typeOfAttachment" && parentValue == 1) {
        conditionStatus = true;
      }  

      // validation logic for Upload Document
      if (validationType === "uploadDocument" && parentValue == 2) {
        conditionStatus = true;
      }  

      // validation logic for URL
      if (validationType === "url" && parentValue == 3) {
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

  //Get Notification Category Name=====================
  getNotificationCatName(){
    this.showSpinnerBlock = true;
    // this.notificationCatName = [];
    this.commonNotificationServiceService.getNotificationCategoryName().subscribe((data: any = []) => {
      this.notificationCatName = data?.data;
      this.showSpinnerBlock = false;
    });
  }
  //End Get Notification Category Name***********************
  
  //Get Notification Component by Changing Notification Category==============
  notificationCategoryChange(value:any){
    this.showCompName = true;
    this.notificationCompName = [];
    this.addSchoolTeacherNotifyForm?.patchValue({ component:'' });
    if(value!=''){
      this.commonNotificationServiceService.getNotificationComponentName(value).subscribe((data: any = []) => {
        this.notificationCompName = data?.data;
      });
    }else{
      this.notificationCompName = [];
      this.addSchoolTeacherNotifyForm?.patchValue({ component:'' });
    }

      this.showCompName = false;
   
  }
  //End Get Notification Component by Changing Notification Category**************

  initializeForm() {
    this.addSchoolTeacherNotifyForm = this.formBuilder.group({
      notificationMode: [
        this.notificationMode,[Validators.required,Validators.pattern(/^[0-9]+$/)]
      ], 
      category: [
        this.category,[Validators.required,Validators.pattern(/^[0-9]+$/)]
      ], 
      component: [
        this.component,[Validators.pattern(/^[0-9]+$/)]
      ],
      contentType: [
        this.contentType,[Validators.required,Validators.pattern(/^[0-9]+$/)]
      ],
      subject: [
        // this.subject,[Validators.required,Validators.maxLength(200),Validators.pattern(/^[a-zA-Z0-9 ]+$/),this.customValidators.firstCharValidatorRF]
        this.subject,[Validators.required,Validators.maxLength(200),this.customValidators.firstCharValidatorRF]
      ],
      notificationContent: [
        this.notificationContent,
        [
          this.conditionalValidator(
            () => this.addSchoolTeacherNotifyForm?.get("notificationMode")?.value,
            Validators.required,
            "conditionalValidation",
            "notificationContent"
          ),
          Validators.maxLength(500), 
          // Validators.pattern(/^[a-zA-Z0-9 ,.'\-\s]+$/), 
          this.customValidators.firstCharValidatorRF 
        ],
      ],
      typeOfAttachment: [
        this.typeOfAttachment,
        [
          this.conditionalValidator(
            () => this.addSchoolTeacherNotifyForm?.get("notificationMode")?.value,
            Validators.required,
            "conditionalValidation",
            "typeOfAttachment"
          ), Validators.pattern(/^[0-9]+$/)
        ],
      ],
      uploadDocument: [
        this.uploadDocument,
        [
          this.conditionalValidator(
            () => this.addSchoolTeacherNotifyForm?.get("typeOfAttachment")?.value,
            Validators.required,
            "conditionalValidation",
            "uploadDocument"
          ),
        ],
      ],
      url: [
        this.url,
        [
          this.conditionalValidator(
            () => this.addSchoolTeacherNotifyForm?.get("typeOfAttachment")?.value,
            Validators.required,
            "conditionalValidation",
            "url"
          ),
        ],
      ],
      noticeType: [
        this.noticeType,[Validators.required,Validators.pattern(/^[0-9]+$/)]
      ],
      /* state: [
        this.state,[Validators.required]
      ], */
      district: [
        this.district,[Validators.required,Validators.pattern(/^[0-9]+$/)]
      ],
      block: [
        this.block,
      ],
      cluster: [
        this.cluster,
      ],
      management: [
        this.management,
      ],
      schoolCategory: [
        this.schoolCategory,
      ],
      school: [
        this.school,
      ],
     natureOfAppoint: [
        this.natureOfAppoint,[Validators.pattern(/^[0-9]+$/)]
      ],
      appointType: [
        this.appointType,[Validators.pattern(/^[0-9]+$/)]
      ],
       teacher: [
        this.teacher,
      ],
    });
  }

  //Change Notification Content and Type Of Attachment Based On Notification Mode (SMS,Portal)==============
  notificationTypeChange(value:any){
    if(value == 1){     //FOR PORTAL
      this.notificationModeSMS=true;
    }
    if(value == 2){         //FOR SMS
      this.notificationModeSMS=false;
      this.doumentDivShow     = false;
      this.linkDivShow        = false;
      this.typeOfAttachment   = "1";
      this.uploadDocument     = "";
      this.addSchoolTeacherNotifyForm?.patchValue({notificationContent: '' });
      this.addSchoolTeacherNotifyForm?.patchValue({typeOfAttachment: '1' });
      this.addSchoolTeacherNotifyForm?.patchValue({uploadDocument: '' });
      this.addSchoolTeacherNotifyForm?.patchValue({url: '' });
    }
  }
  // End Of Changing Notification Content and Type Of Attachment Based On Notification Mode=============

  //Change Of Document Div and Url Div Based On Types of Attachment=================
  attachmentType(value:any){
    if(value == 1){     //FOR Choose Nothing
      this.doumentDivShow=false;
      this.linkDivShow=false;
      this.addSchoolTeacherNotifyForm?.patchValue({uploadDocument: '' });
      this.uploadDocument = "";
      this.addSchoolTeacherNotifyForm?.patchValue({url: '' });
    }
    if(value == 2){     //FOR Document
      this.doumentDivShow=true;
      this.linkDivShow=false;
      this.addSchoolTeacherNotifyForm?.patchValue({url: '' });
    }
    if(value == 3){     //FOR URL
      this.linkDivShow=true;
      this.doumentDivShow=false;
      this.addSchoolTeacherNotifyForm?.patchValue({uploadDocument: '' });
      this.uploadDocument = "";
    }
  }
  //End Of Changing Of Document Div and Url Div Based On Types of Attachment==========

  // Notice Type Change FOR SCHOOL AND TEACHER==========================
  noticeTypeChange(value:any){
    if(value == 2){       //FOR SCHOOL TYPE
      this.teacherDivShow=false;
      this.teacherNameData = []; 
      this.teacherIdArr = [];
      this.teacherIdStr = "";
      this.addSchoolTeacherNotifyForm?.patchValue({teacher: '' });
      this.addSchoolTeacherNotifyForm?.patchValue({natureOfAppoint: '' });
      this.addSchoolTeacherNotifyForm?.patchValue({appointType: '' });
    }
    if(value == 1){     //FOR TEACHER TYPE
      this.teacherDivShow=true;
      this.loadAnnexturesData();
      if(this.schoolIdArr != ''){
        this.getTeacherName();
      }
    }
  }
  // End Of Notice Type Change===========

  // file upload validation
  fileUploadHandler(event: any) {
    const notificationDoc = event.target.files[0];
    if(notificationDoc != null){
      if (notificationDoc.type != 'application/vnd.ms-excel' && notificationDoc.type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&  notificationDoc.type != 'application/msword' && notificationDoc.type != 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && notificationDoc.type != 'image/jpg' && notificationDoc.type != 'image/jpeg' && notificationDoc.type != 'image/png' && notificationDoc.type != 'image/gif' && notificationDoc.type != 'application/pdf') {
        this.alertHelper.viewAlertHtml(
          "error",
          "Error",
          '<i class="bi bi-arrow-right text-danger"></i> File type should be xls, xlsx, doc, docx, jpg, jpeg, png, gif or pdf file'
        );
        this.addSchoolTeacherNotifyForm?.patchValue({ uploadDocument: '' });
        return;
      }

      if (notificationDoc.size >= (1024 * 1024 * 2)) {      
        this.alertHelper.viewAlertHtml(
          "error",
          "Error",
          '<i class="bi bi-arrow-right text-danger"></i> File size should not be greater than 2 MB'
        );
        this.addSchoolTeacherNotifyForm?.patchValue({ uploadDocument: '' });
        return;
      }
      
      this.uploadDocument = event.target.files[0];
    }
  }
  // End Of file upload validation

  //Get All Demography Data
 
  getDistrict(){
    this.showSpinnerDist = true;

    this.blockIdArr = [];
    this.blockIdStr = "";
    this.allBlockByDistIdData = [];
    this.addSchoolTeacherNotifyForm?.patchValue({ block:'' });

    this.clusterIdArr = [];
    this.clusterIdStr = "";
    this.allClusterByBlockIdData = [];
    this.addSchoolTeacherNotifyForm?.patchValue({ cluster:'' });

    this.schoolIdArr = [];
    this.schoolIdStr = "";
    this.schoolNameData = []; 
    this.addSchoolTeacherNotifyForm?.patchValue({ school:'' });

    this.teacherIdArr = [];
    this.teacherIdStr = "";
    this.teacherNameData = []; 
    this.addSchoolTeacherNotifyForm?.patchValue({ teacher:'' });

    this.commonserviceService.getAllDistrict().subscribe((data: any = []) => {
      this.allDistrictData = data?.data;

      if(this.userProfile.district != 0 || this.userProfile.district != ""){
        this.currentDistData = this.allDistrictData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        this.addSchoolTeacherNotifyForm.controls['district']?.patchValue(this.userProfile.district);
        this.getBlockByDistrictId(this.userProfile.district);
      }
      else{
        this.currentDistData = this.allDistrictData;
        this.scDisrtictSelect = true;
        this.scBlockSelect = true; 

      }
      this.showSpinnerDist = false;
    });
  }
  getBlockByDistrictId(distId:any){

    this.showSpinnerBlockByDistId = true;

    this.blockIdArr = [];
    this.blockIdStr = "";
    this.allBlockByDistIdData = [];
    this.addSchoolTeacherNotifyForm?.patchValue({ block:'' });

    this.clusterIdArr = [];
    this.clusterIdStr = "";
    this.allClusterByBlockIdData = [];
    this.addSchoolTeacherNotifyForm?.patchValue({ cluster:'' });
     
    this.schoolIdArr = [];
    this.schoolIdStr = "";
    this.schoolNameData = []; 
    this.addSchoolTeacherNotifyForm?.patchValue({ school:'' });

    this.teacherIdArr = [];
    this.teacherIdStr = "";
    this.teacherNameData = []; 
    this.addSchoolTeacherNotifyForm?.patchValue({ teacher:'' });
    
    if(distId != ''){  
      this.commonserviceService. getBlockByDistrictid(distId).subscribe((data: any = []) => {
          this.blockData = data?.data;
          
        if(this.userProfile.block != 0 || this.userProfile.block != ""){
        
          this.allBlockByDistIdData = this.blockData.filter((blo: any) => {
            return blo.blockId == this.userProfile.block;            
          });          
          
          this.allBlockByDistIdData.forEach((bloData: any) => {
            bloData.showBlock = bloData.blockCode + " - " + bloData.blockName;            
          });

          this.allBlockByDistIdData.forEach((blockData: any) => {         
            this.selectedBlockItems.push({
              blockId: blockData.blockId,
              showBlock: blockData.showBlock
            });
          });
          
          this.addSchoolTeacherNotifyForm.controls['block']?.patchValue(this.selectedBlockItems);
          this.blockIdStr = this.userProfile.block;
          this.blockDisable = true;
          this.getClusterByBlockId(this.blockIdStr);
        } else {
          this.allBlockByDistIdData = this.blockData;
          this.allBlockByDistIdData.forEach((blockData: any) => {
            blockData.showBlock = blockData.blockCode + " - " + blockData.blockName;
          });
        }

        this.showSpinnerBlockByDistId = false;
      });
    }
    else{
      this.showSpinnerBlockByDistId = false;
    }
  }
  getClusterByBlockId(selBlockId:any){
    this.showSpinnerClusterByBlockId = true;

    this.clusterIdArr = [];
    this.clusterIdStr = "";
    this.allClusterByBlockIdData = [];
    this.addSchoolTeacherNotifyForm?.patchValue({ cluster:'' });

    this.schoolIdArr = [];
    this.schoolIdStr = "";
    this.schoolNameData = []; 
    this.addSchoolTeacherNotifyForm?.patchValue({ school:'' });

    this.teacherIdArr = [];
    this.teacherIdStr = "";
    this.teacherNameData = []; 
    this.addSchoolTeacherNotifyForm?.patchValue({ teacher:'' });
    

    if(selBlockId != ""){
      this.commonserviceService. getClusterByBlockId(selBlockId).subscribe((data: any = []) => {
        this.clusterData = data?.data;

        if(this.userProfile.cluster != 0 || this.userProfile.cluster != ""){          
          
          this.allClusterByBlockIdData = this.clusterData.filter((clu: any) => {
            return clu.clusterId == this.userProfile.cluster;
          });

          this.allClusterByBlockIdData.forEach((clustData: any) => {
            clustData.showCluster = clustData.clusterCode + " - " + clustData.clusterName;
          });
          
          this.allClusterByBlockIdData.forEach((clData: any) => {         
            this.selectedClusterItems.push({
              clusterId: clData.clusterId,
              showCluster: clData.showCluster
            });
          });
          
          this.addSchoolTeacherNotifyForm.controls['cluster']?.patchValue(this.selectedClusterItems);
          this.clusterIdStr = this.userProfile.cluster;
          this.clusterDisable = true;

          this.getSchoolName();
        }
        else{
          this.allClusterByBlockIdData = this.clusterData;
          this.allClusterByBlockIdData.forEach((clustData: any) => {
            clustData.showCluster = clustData.clusterCode + " - " + clustData.clusterName;
          });
        }
        this.showSpinnerClusterByBlockId = false;
      });
    } else {
      this.showSpinnerClusterByBlockId = false;
    }
  }
  //End Of Getting All Demography Data

  // Get Management Data
  getSchoolManagement(){
    this.showSpinnerSchoolMgmt = true;

    this.schoolMgmtData = []; 
    this.schoolCatData = []; 

    this.schoolIdStr = "";
    this.schoolIdArr = [];
    this.schoolNameData = [];
    this.addSchoolTeacherNotifyForm?.patchValue({ school:'' });

    this.teacherIdStr = "";
    this.teacherIdArr = [];
    this.teacherNameData = [];
    this.addSchoolTeacherNotifyForm?.patchValue({ teacher:'' });

    this.commonserviceService.getSchoolManagement().subscribe((data: any = [])=>{
      this.schoolMgmtData = data?.data;

      this.schoolMgmtData.forEach((managementData: any) => {
        managementData.showManagement = managementData.anxtValue + " - " + managementData.anxtName;
      });

      this.showSpinnerSchoolMgmt = false;
     });  
     
  }
  // End Management Data

   // Get School Category Data
   getSchoolCategory(){
    this.showSpinnerSchoolCatagory = true;

    this.schoolCatData = [];  

    this.schoolIdStr = "";
    this.schoolIdArr = [];
    this.schoolNameData = []; 
    this.addSchoolTeacherNotifyForm?.patchValue({ school:'' });

    this.teacherIdStr = "";
    this.teacherIdArr = [];
    this.teacherNameData = [];
    this.addSchoolTeacherNotifyForm?.patchValue({ teacher:'' });

    this.schoolService.getSchoolCategory().subscribe((data: any = [])=>{
     
      this.schoolCatData = data?.data;
      this.schoolCatData.forEach((schoolCat: any) => {
       
        schoolCat.showSchoolCategory = schoolCat.schlCatId + " - " + schoolCat.schlCatName;
      });
      this.showSpinnerSchoolCatagory = false;
     });  
  }
  // End School Category Data

  // Add/Remove Action For Multiselect

  addBlockId(selBlockId:any, selectType: number = 1){
    if(selectType == 2){
      selBlockId.forEach((element: any)=>{
        this.blockIdArr.push(element.blockId);
      });
    } else{
      this.blockIdArr.push(selBlockId.blockId);
    }    
    this.blockIdStr = this.blockIdArr.join(','); 
    this.getClusterByBlockId(this.blockIdStr);    
  }

  removeBlockId(selBlockId:any, selectType: number = 1){
    if(selectType == 2){
      this.blockIdArr = [];
    } else{
      this.blockIdArr.forEach((element: any, index: any)=>{
        if(element==selBlockId.blockId) this.blockIdArr.splice(index,1);
      });
    }  
    this.blockIdStr = this.blockIdArr.join(','); 
    this.getClusterByBlockId(this.blockIdStr);    
  }

  addClusterId(selClusterId:any, selectType: number = 1){
    if(selectType == 2){
      selClusterId.forEach((element: any)=>{
        this.clusterIdArr.push(element.clusterId);
      });
    } else{
      this.clusterIdArr.push(selClusterId.clusterId);
    }    
    this.clusterIdStr = this.clusterIdArr.join(','); 
    this.getSchoolName();
  }

  removeClusterId(selClusterId:any, selectType: number = 1){
    if(selectType == 2){
      this.clusterIdArr = [];
    } else{
      this.clusterIdArr.forEach((element: any, index: any)=>{
        if(element==selClusterId.clusterId) this.clusterIdArr.splice(index,1);
      });
    }  

    this.clusterIdStr = this.clusterIdArr.join(','); 
    this.getSchoolName();
  }

  addManagementId(selmanagementId:any, selectType: number = 1){
    if(selectType == 2){
      selmanagementId.forEach((element: any)=>{
        this.managementIdArr.push(element.anxtValue);
      });
    } else{
      this.managementIdArr.push(selmanagementId.anxtValue);
    }    
    this.managementIdStr = this.managementIdArr.join(','); 

    if(this.clusterIdArr != '' && this.schoolNameData != '' ){
      this.getSchoolName();
    }
  }

  removeManagementId(selmanagementId:any, selectType: number = 1){
    if(selectType == 2){
      this.managementIdArr = [];
    } else{
      this.managementIdArr.forEach((element: any, index: any)=>{
        if(element==selmanagementId.anxtValue) this.managementIdArr.splice(index,1);
      });
    }  
    this.managementIdStr = this.managementIdArr.join(','); 
    if(this.clusterIdArr != '' && this.schoolNameData != '' ){
      this.getSchoolName();
    }
  }

  addSchoolCategoryId(selschoolcatId:any, selectType: number = 1){
    if(selectType == 2){
      selschoolcatId.forEach((element: any)=>{
        this.schoolCatIdArr.push(element.schlCatId);
      });
    } else{
      this.schoolCatIdArr.push(selschoolcatId.schlCatId);
    }    
    this.schoolCatIdStr = this.schoolCatIdArr.join(','); 

    if(this.clusterIdArr != '' && this.schoolNameData != ''){
      this.getSchoolName();
    }
  }

  removeSchoolCategoryId(selschoolcatId:any, selectType: number = 1){
    if(selectType == 2){
      this.schoolCatIdArr = [];
    } else{
      this.schoolCatIdArr.forEach((element: any, index: any)=>{
        if(element==selschoolcatId.schlCatId) this.schoolCatIdArr.splice(index,1);
      });
    }  
    this.schoolCatIdStr = this.schoolCatIdArr.join(','); 
    if(this.clusterIdArr != '' && this.schoolNameData != ''){
      this.getSchoolName();
    }
  }

   //  SCHOOL ADD/REMOVE

  addSchoolId(selschoolId:any, selectType: number = 1){
    if(selectType == 2){
      selschoolId.forEach((element: any)=>{
        this.schoolIdArr.push(element.schoolId);
      });
    } else{
      this.schoolIdArr.push(selschoolId.schoolId);
    }    
    this.schoolIdStr = this.schoolIdArr.join(','); 

    let noticeTypeVal = this.addSchoolTeacherNotifyForm.get('noticeType')?.value;
    if(noticeTypeVal == 1){
      this.getTeacherName();
    }
      
  }

  removeSchoolId(selschoolId:any, selectType: number = 1){
    if(selectType == 2){
      this.schoolIdArr = [];
    } else{
      this.schoolIdArr.forEach((element: any, index: any)=>{
        if(element==selschoolId.schoolId) this.schoolIdArr.splice(index,1);
      });
    }  
    this.schoolIdStr = this.schoolIdArr.join(','); 

    let noticeTypeVal = this.addSchoolTeacherNotifyForm.get('noticeType')?.value;
    if(noticeTypeVal == 1){
      this.getTeacherName();
    }
  }

  //  END OF SCHOOL ADD/REMOVE 
  //  TEACHER ADD/REMOVE 
  
  addTeachereId(teacherId:any, selectType: number = 1){
    if(selectType == 2){
      teacherId.forEach((element: any)=>{
        this.teacherIdArr.push(element.tId);
      });
    } else{
      this.teacherIdArr.push(teacherId.tId);
    }    
    this.teacherIdStr = this.teacherIdArr.join(','); 
  }

  removeTeacherId(teacherId:any, selectType: number = 1){
    if(selectType == 2){
      this.teacherIdArr = [];
    } else{
      this.teacherIdArr.forEach((element: any, index: any)=>{
        if(element==teacherId.tId) this.teacherIdArr.splice(index,1);
      });
    }  
    this.teacherIdStr = this.teacherIdArr.join(',');   
  }
  //  END OF TEACHER ADD/REMOVE 

  // End Add/Remove Action For Multiselect

  //Get School
  getSchoolName(){
    this.showSpinnerSchoolName = true;

    this.schoolIdArr= [];
    this.schoolIdStr = ""
    this.schoolNameData = []; 
    this.addSchoolTeacherNotifyForm?.patchValue({ school:'' }); 

    this.teacherIdArr= [];
    this.teacherIdStr = ""
    this.teacherNameData = []; 
    this.addSchoolTeacherNotifyForm?.patchValue({ teacher:'' });
    
    let districtVal = this.addSchoolTeacherNotifyForm.get('district')?.value;
    districtVal = (this.userProfile.district != 0 || this.userProfile.district != "")?this.userProfile.district:(districtVal != '')? districtVal: 0;

    let blockVal = (this.userProfile.block != 0 || this.userProfile.block != "")?this.userProfile.block:(this.blockIdStr != '')? this.blockIdStr: 0;
    let clusterVal = (this.userProfile.cluster != 0 || this.userProfile.cluster != "")?this.userProfile.cluster:(this.clusterIdStr != '')? this.clusterIdStr: 0;
    let managementVal = (this.managementIdArr != '')? this.managementIdStr: 0;
    let schoolCategoryVal = (this.schoolCatIdArr != '')? this.schoolCatIdStr: 0;

    if(clusterVal != 0 && this.clusterIdStr != ''){
      this.manageSchoolTeacherService.getSchoolName(districtVal, blockVal, clusterVal,managementVal,schoolCategoryVal).subscribe((data: any = [])=>{
        this.schoolNameData = data?.data;
  
        this.schoolNameData.forEach((school: any) => {  
          school.showSchool = school.schoolUdiseCode + " - " + school.schoolName;
        });
        this.showSpinnerSchoolName = false;
      });  
    }
    else{
      this.schoolIdArr =[];
      this.schoolIdStr ="";
      this.showSpinnerSchoolName = false;
    }
  }
  //End Of School

  //Get Teacher

  getTeacherName(){
    this.showSpinnerTeacherName = true;

    this.teacherIdArr = [];
    this.teacherNameData = [];
    this.teacherIdStr = "";
    this.addSchoolTeacherNotifyForm?.patchValue({ teacher:'' }); 

    let schoolVal = (this.schoolIdArr != '')? this.schoolIdStr: 0;
    let appointTypeVal = (this.addSchoolTeacherNotifyForm.get('appointType')?.value) ? (this.addSchoolTeacherNotifyForm.get('appointType')?.value):0;
    let natureOfAppointVal = (this.addSchoolTeacherNotifyForm.get('natureOfAppoint')?.value) ? (this.addSchoolTeacherNotifyForm.get('natureOfAppoint')?.value):0;

    if(schoolVal != 0 && this.schoolIdStr != ''){
      this.manageSchoolTeacherService.getTeacherName(schoolVal,appointTypeVal,natureOfAppointVal).subscribe((data: any = [])=>{
        this.teacherNameData = data?.data;
  
        this.teacherNameData.forEach((teacher: any) => {  
          teacher.showTeacher = (teacher.teacherCode) ? teacher.teacherCode + " - " + teacher.teacherName :  teacher.teacherName;
        });
        this.showSpinnerTeacherName = false;
      });  
    }
    else{
      this.teacherIdArr = [];
      this.teacherIdStr = "";
      this.addSchoolTeacherNotifyForm?.patchValue({ teacher:'' })
      this.showSpinnerTeacherName = false;
    }
  }

  //End Of Get Teacher
 
  // Get Annexture Data
  loadAnnexturesData() {
    const anxTypes = ['NATURE_OF_APPOINTMENT','APPOINTMENT_TYPE'];
  
    let annextureData! : [];
    this.commonserviceService
      .getCommonAnnexture(anxTypes)
      .subscribe({
        next: (res: any) => {
          annextureData = res?.data;
          this.natureOfAppointDatas = res?.data?.NATURE_OF_APPOINTMENT;
          this.appointTypeData = res?.data?.APPOINTMENT_TYPE;
        },
      });
  }

  //Form Submit===================
  onSubmit(){
    this.submitted = true;
    
    // if ("INVALID" === this.addSchoolTeacherNotifyForm.status) {
    //   for (const key of Object.keys(this.addSchoolTeacherNotifyForm.controls)) {
    //     if (this.addSchoolTeacherNotifyForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.addSchoolTeacherNotifyForm,this.allLabel);
    //       break;
    //     }
    //   }
    // } 
    if(this.addSchoolTeacherNotifyForm.invalid){
      // this.customValidators.formValidationHandler(this.addSchoolTeacherNotifyForm, this.allLabel, this.el);
      this.customValidators.formValidationHandler(
        this.addSchoolTeacherNotifyForm,
        this.allLabel,
        this.el,
        {
          required: {
            notificationMode: "Please select notification mode",
            category: "Please select notification category",
            contentType: "Please select content type",
            subject: "Please select subject",
            notificationContent: "Please enter content for notification",
            noticeType: "Please select notification type",
            district: "Please select district",
          },
        }
      );
    } 

    const users = this.commonserviceService.getUserProfile();
    
    if (this.addSchoolTeacherNotifyForm.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show();

          const formData = new FormData();
          formData.append('userId',users?.userId);
          formData.append('profileId',users?.profileId);
          formData.append('loginId',users?.loginId);
          formData.append('notificationMode',this.addSchoolTeacherNotifyForm.get('notificationMode')?.value);
          formData.append('category',this.addSchoolTeacherNotifyForm.get('category')?.value);
          formData.append('component',this.addSchoolTeacherNotifyForm.get('component')?.value);
          
          formData.append('contentType',this.addSchoolTeacherNotifyForm.get('contentType')?.value);
          formData.append('subject',this.addSchoolTeacherNotifyForm.get('subject')?.value);
          formData.append('notificationContent', this.addSchoolTeacherNotifyForm.get('notificationContent')?.value);

          formData.append('typeOfAttachment',this.addSchoolTeacherNotifyForm.get('typeOfAttachment')?.value);
          formData.append('uploadDocument', this.uploadDocument);
          formData.append('url', this.addSchoolTeacherNotifyForm.get('url')?.value);
          
          formData.append('noticeType',this.addSchoolTeacherNotifyForm.get('noticeType')?.value);
          formData.append('district',this.addSchoolTeacherNotifyForm.get('district')?.value);
          formData.append('block', this.blockIdStr);
          formData.append('cluster', this.clusterIdStr);
          
          formData.append('management', this.managementIdStr);
          formData.append('schoolCategory', this.schoolCatIdStr);
          formData.append('school', this.schoolIdStr);
          
          formData.append('natureOfAppoint', this.addSchoolTeacherNotifyForm.get('natureOfAppoint')?.value);
          formData.append('appointType',this.addSchoolTeacherNotifyForm.get('appointType')?.value);

          formData.append('teacher',this.teacherIdStr);
        
          this.manageSchoolTeacherService.addTeacherSchoolNotification(formData).subscribe({
            next: (res: any) => {
              this.spinner.hide();
              this.alertHelper.successAlert(
                "Saved!",
                "Teacher school notification created successfully.",
                "success"
              ).then(()=>{                
                this.resetForm();
              });
            },
            error: (error: any) => {
              this.spinner.hide(); //==== hide spinner              
            },
          });
        }
      });
    } 
  }
  //End Of Form Submit================

  //Reset the form
  resetForm(){
    this.addSchoolTeacherNotifyForm?.patchValue({ notificationMode: '1' });
    this.notificationTypeChange('1');
    this.addSchoolTeacherNotifyForm?.patchValue({ category: '' });
    this.addSchoolTeacherNotifyForm?.patchValue({ component: '' });
    this.addSchoolTeacherNotifyForm?.patchValue({ contentType: '1' });
    this.addSchoolTeacherNotifyForm?.patchValue({ subject: '' });
    this.addSchoolTeacherNotifyForm?.patchValue({ notificationContent: '' });
    this.addSchoolTeacherNotifyForm?.patchValue({ typeOfAttachment: '1' });
    this.attachmentType('1');
    this.addSchoolTeacherNotifyForm?.patchValue({ noticeType: '2' });

    if(this.userProfile.district != 0 || this.userProfile.district != ""){
      this.addSchoolTeacherNotifyForm.controls['district']?.patchValue(this.userProfile.district);
    } else {
      this.addSchoolTeacherNotifyForm?.patchValue({ district: '' });
    }

    if(this.userProfile.block != 0 || this.userProfile.block != ""){
      this.addSchoolTeacherNotifyForm.controls['block']?.patchValue(this.selectedBlockItems);
    } else {
      this.blockIdArr   = [];
      this.blockIdStr   = "";
      this.allBlockByDistIdData = [];
      this.addSchoolTeacherNotifyForm?.patchValue({ block: '' });
    }

    if(this.userProfile.cluster != 0 || this.userProfile.cluster != ""){
      this.addSchoolTeacherNotifyForm.controls['cluster']?.patchValue(this.selectedClusterItems);
    } else {
      this.clusterIdArr = [];
      this.clusterIdStr = "";
      this.allClusterByBlockIdData = [];
      this.addSchoolTeacherNotifyForm?.patchValue({ cluster: '' });
    }   
    
    this.managementIdArr = [];
    this.managementIdStr = "";
    this.addSchoolTeacherNotifyForm?.patchValue({ management: '' });

    this.schoolCatIdArr = [];
    this.schoolCatIdStr = "";
    this.addSchoolTeacherNotifyForm?.patchValue({ schoolCategory: '' });

    this.schoolIdArr = [];
    this.schoolIdArr = "";
    this.schoolNameData = []; 
    this.addSchoolTeacherNotifyForm?.patchValue({ school: '' });

    this.addSchoolTeacherNotifyForm?.patchValue({ natureOfAppoint: '' });

    this.addSchoolTeacherNotifyForm?.patchValue({ appointType: '' });

    this.teacherIdArr = [];
    this.teacherIdStr = "";
    this.teacherNameData = []; 
    this.addSchoolTeacherNotifyForm?.patchValue({ teacher: '' });
  }
  //End of Reset the form
}
