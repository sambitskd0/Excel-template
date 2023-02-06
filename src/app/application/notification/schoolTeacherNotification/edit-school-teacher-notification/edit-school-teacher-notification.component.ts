import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { SchoolService } from 'src/app/application/school/services/school.service';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { environment } from 'src/environments/environment';
import { CommonNotificationServiceService } from '../../services/common-notification-service.service';
import { ManageSchoolTeacherService } from '../../services/manage-school-teacher.service';

@Component({
  selector: 'app-edit-school-teacher-notification',
  templateUrl: './edit-school-teacher-notification.component.html',
  styleUrls: ['./edit-school-teacher-notification.component.css']
})
export class EditSchoolTeacherNotificationComponent implements OnInit {

  editSchoolTeacherNotifyForm!:FormGroup;
  public fileUrl = environment.filePath;

  blockDropdown:IDropdownSettings         = {}; 
  clusterDropdown:IDropdownSettings       = {};
  managementDropdown:IDropdownSettings    = {};
  schoolCategoryDropdown:IDropdownSettings= {};
  schoolDropdown:IDropdownSettings        = {};
  natureAppointDropdown:IDropdownSettings = {};
  appointTypeDropdown:IDropdownSettings   = {};
  teacherDropdown:IDropdownSettings       = {};

  notificationMode: any   = "1";
  typeOfAttachment: any   = "1";
  noticeType: any         = "2";

  notificationModeSMS:boolean = true;
  linkDivShow:boolean         = false;
  doumentDivShow:boolean      = false;
  teacherDivShow:boolean      = false;

  blockDisable: boolean       = false;
  clusterDisable: boolean     = false;

  selectedBlockItems: any     = [];
  selectedClusterItems: any   = [];
  selectedManagementItems: any   = [];
  selectedSchoolCategoryItems: any   = [];
  selectedSchoolItems: any   = [];
  selectedTeacherItems: any   = [];

  // Variables For Spinner Blocks
  showSpinnerBlock: boolean             = false;
  showSpinnerDist: boolean              = false;
  showSpinnerBlockByDistId: boolean     = false;
  showSpinnerClusterByBlockId: boolean  = false;
  showSpinnerCategory: boolean          = false;
  showSpinnerCompName: boolean          = false;
  showSpinnerSchoolMgmt: boolean        = false;
  showSpinnerSchoolCatagory: boolean    = false;
  showSpinnerSchoolName: boolean        = false;
  showSpinnerTeacherName: boolean       = false;
  // End Variables For Spinner Blocks

  // Select Option
  showCompName: boolean              = false;
  showViewDocument: boolean          = false;
  //End Select Option
  
  scDisrtictSelect: boolean   = false;
  scBlockSelect: boolean      = false;

  currentDistData: any    = "";
  currentBlockData: any   = ""; 
  id: any                 = ""; 
  encId: any              = ""; 

  // FormControl Variables
  category: any             = "";
  component: any            = "";
  contentType: any          = "1";
  subject: any              = "";
  notificationContent: any  = "";
  uploadDocument: any       = "";
  url: any                  = "";
  stateSpecCategory: any    = "";
  school: any               = "";
  natureOfAppoint: any      = "";
  teacher: any              = "";
  appointType: any          = "";
  management: any           = "";
  cluster: any              = "";
  block: any                = "";
  district: any             = "";
  state: any                = "";
  schoolCategory: any       = "";
  previousDocument: any     = "";
  documentURL: any          = "";
   // END OF FormControl Variables

  // Section For userProfile variables
  userProfile: any  = "";
  schoolId: any     = "";
  userLevel: any    = "";
  districtId: any   = "";
  blockId: any      = "";
  clusterId: any    = "";
  userId: any       = "";
  loginUserTypeId: any = "";
  submitted: boolean=false;
  // End Section For userProfile variables

  notificationCatName: any  ="";
  notificationCompName: any ="";

  allDistrictData: any            = [];
  allBlockByDistIdData: any       = [];
  blockData: any                  = [];
  allClusterByBlockIdData: any    = [];
  clusterData: any                = [];
  schoolCatData: any              = [];
  schoolMgmtData:any              = [];
  schoolNameData: any             = [];
  natureOfAppointDatas: any       = [];
  appointTypeData: any            = [];
  teacherNameData: any            = [];
  notificationDetailsData:any     = [];

  blockIdArr: any       = [];
  clusterIdArr: any     = [];
  managementIdArr: any  = [];
  schoolCatIdArr: any   = [];
  schoolIdArr: any      = [];
  teacherIdArr: any     = [];

  blockIdStr: any       = "";
  clusterIdStr: any     = "";
  managementIdStr: any  = "";
  schoolCatIdStr: any   = "";
  schoolIdStr: any      = "";
  teacherIdStr: any     = "";  
 
  allLabel: string[] = ["Notification mode","Category","Component","Content type","Subject","Notification Content","Types of attachment","Upload document","URL","Notice type","District","Block","Cluster","Management","School category","School","Nature of appointment","Appointment type","Teacher"];
  
 
  constructor(
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private alertHelper: AlertHelper, 
    private manageSchoolTeacherService:ManageSchoolTeacherService, 
    private commonNotificationService:CommonNotificationServiceService, 
    public commonserviceService: CommonserviceService, 
    private el: ElementRef, 
    private spinner: NgxSpinnerService,   
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private schoolService:SchoolService,
    ) { }

  ngOnInit(): void {
    this.userProfile = this.commonserviceService.getUserProfile();
    this.schoolId = this.userProfile.school;
    this.districtId = this.userProfile.district;
    this.blockId = this.userProfile.block;
    this.clusterId = this.userProfile.cluster;
    this.userLevel = this.userProfile.userLevel;
    this.loginUserTypeId = this.userProfile.loginUserTypeId;
    this.id = this.activatedRoute.snapshot.params["encId"];
    this.loadAnnexturesData();
    this.initializeForm();
    this.getSchoolTeacherNotificationDetails(this.id); 

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

  // CONDITIONAL VALIDATION
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

  //GET NOTIFICATION BY CATEGORY NAME========================
  getNotificationCatName(categoryId:any = ""){
    this.showSpinnerCategory = true;
    this.commonNotificationService.getNotificationCategoryName().subscribe((data: any = []) => {
      this.notificationCatName = data?.data;

      if(categoryId != ""){ 
        this.editSchoolTeacherNotifyForm?.patchValue({ category: this.notificationDetailsData.notifyCategoryId });
      }     

      this.showSpinnerCategory = false;
    });
  }
  //End GET NOTIFICATION BY CATEGORY NAME====================
  
  // GET NOTIFICATION COMPONENT BY CHANGING NOTIFICATION CATEGORY===============================
  notificationCategoryChange(value:any, componentId:any = ""){

    // this.showCompName = true;
    this.showSpinnerCompName = true;
    this.showCompName = true;
    this.notificationCompName = [];
    this.editSchoolTeacherNotifyForm?.patchValue({ component:'' });
    if(value!=''){
      this.commonNotificationService.getNotificationComponentName(value).subscribe((data: any = []) => {
        this.notificationCompName = data?.data;
        if(componentId != ""){ 
          this.editSchoolTeacherNotifyForm?.patchValue({ component: componentId });
        }
        this.showSpinnerCompName = false;
      });
    }else{
      this.notificationCompName = [];
      this.editSchoolTeacherNotifyForm?.patchValue({ component:'' });
      this.showSpinnerCompName = false;
    }
  }
  //END GET NOTIFICATION COMPONENT BY CHANGING NOTIFICATION CATEGORY============================

  //INTIALIZE FORM STARTS======================
  initializeForm() {
    this.editSchoolTeacherNotifyForm = this.formBuilder.group({
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
        this.subject,[Validators.required,Validators.maxLength(240),this.customValidators.firstCharValidatorRF]
      ],
      notificationContent: [
        this.notificationContent,
        [
          this.conditionalValidator(
            () => this.editSchoolTeacherNotifyForm?.get("notificationMode")?.value,
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
            () => this.editSchoolTeacherNotifyForm?.get("notificationMode")?.value,
            Validators.required,
            "conditionalValidation",
            "typeOfAttachment"
          ), Validators.pattern(/^[0-9]+$/)
        ],
      ],
      uploadDocument: [this.uploadDocument],
      url: [
        this.url,
        [
          this.conditionalValidator(
            () => this.editSchoolTeacherNotifyForm?.get("typeOfAttachment")?.value,
            Validators.required,
            "conditionalValidation",
            "url"
          ),
        ],
      ],
      noticeType: [
        this.noticeType,[Validators.required,Validators.pattern(/^[0-9]+$/)]
      ],
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
  //END INTIALIZE FORM STARTS==================

  // CHANGE NOTIFICATION CONTENT AND TYPE OF ATTACHMENT BASED ON NOTIFY MODE(SMS,PORTAL)====================
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
      this.editSchoolTeacherNotifyForm?.patchValue({notificationContent: '' });
      this.editSchoolTeacherNotifyForm?.patchValue({typeOfAttachment: '1' });
      this.editSchoolTeacherNotifyForm?.patchValue({uploadDocument: '' });
      this.editSchoolTeacherNotifyForm?.patchValue({url: '' });
    }
  }
  // END OF CHANGE NOTIFICATION CONTENT AND TYPE OF ATTACHMENT BASED ON NOTIFY MODE(SMS,PORTAL)=============

  //CHANGE OF DOCUMENT DIV AND URL DIV HIDE SHOW BASED ON ATTACHMENT TYPE=================
  attachmentType(value:any){
    if(value == 1){     //FOR Choose Nothing
      this.doumentDivShow=false;
      this.linkDivShow=false;
      this.editSchoolTeacherNotifyForm?.patchValue({uploadDocument: '' });
      this.uploadDocument = "";
      this.editSchoolTeacherNotifyForm?.patchValue({url: '' });
    }
    if(value == 2){     //FOR Document
      this.doumentDivShow=true;
      this.linkDivShow=false;
      this.editSchoolTeacherNotifyForm?.patchValue({url: '' });
    }
    if(value == 3){     //FOR URL
      this.linkDivShow=true;
      this.doumentDivShow=false;
      this.editSchoolTeacherNotifyForm?.patchValue({uploadDocument: '' });
      this.uploadDocument = "";
    }
  }
  //END OF CHANGE OF DOCUMENT DIV AND URL DIV HIDE SHOW BASED ON ATTACHMENT TYPE==========

  // NOTICE TYPE CHANGE FOR SCHOOL AND TEACHER==========================
  noticeTypeChange(value:any){
    if(value == 2){       //FOR SCHOOL TYPE
      this.teacherDivShow=false;
      this.teacherNameData = []; 
      this.teacherIdArr = [];
      this.teacherIdStr = "";
      this.editSchoolTeacherNotifyForm?.patchValue({teacher: '' });
      this.editSchoolTeacherNotifyForm?.patchValue({natureOfAppoint: '' });
      this.editSchoolTeacherNotifyForm?.patchValue({appointType: '' });
    }
    if(value == 1){     //FOR TEACHER TYPE
      this.teacherDivShow=true;
      this.loadAnnexturesData();
      if(this.schoolIdArr != ''){
        this.getTeacherName();
      }
    }
  }
  // END OF NOTICE TYPE CHANGE===========

  //  FILE UPLOAD VALIDATION====================
  fileUploadHandler(event: any) {
    const notificationDoc = event.target.files[0];
    if(notificationDoc != null){
      if (notificationDoc.type != 'application/vnd.ms-excel' && notificationDoc.type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&  notificationDoc.type != 'application/msword' && notificationDoc.type != 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && notificationDoc.type != 'image/jpg' && notificationDoc.type != 'image/jpeg' && notificationDoc.type != 'image/png' && notificationDoc.type != 'image/gif' && notificationDoc.type != 'application/pdf') {
        this.alertHelper.viewAlertHtml(
          "error",
          "Error",
          '<i class="bi bi-arrow-right text-danger"></i> File type should be xls, xlsx, doc, docx, jpg, jpeg, png, gif or pdf file'
        );
        this.editSchoolTeacherNotifyForm?.patchValue({ uploadDocument: '' });
        return;
      }

      if (notificationDoc.size >= (1024 * 1024 * 2)) {      
        this.alertHelper.viewAlertHtml(
          "error",
          "Error",
          '<i class="bi bi-arrow-right text-danger"></i> File size should not be greater than 2 MB'
        );
        this.editSchoolTeacherNotifyForm?.patchValue({ uploadDocument: '' });
        return;
      }
      
      this.uploadDocument = event.target.files[0];
    }
  }
  // END OF FILE UPLOAD VALIDATION==============

  // GETTING ALL DEMOGRAPHY DATA========================
 
  getDistrict(distId:any = ""){
    this.showSpinnerDist = true;

    this.blockIdArr = [];
    this.blockIdStr = "";
    this.allBlockByDistIdData = [];
    this.editSchoolTeacherNotifyForm?.patchValue({ block:'' });

    this.clusterIdArr = [];
    this.clusterIdStr = "";
    this.allClusterByBlockIdData = [];
    this.editSchoolTeacherNotifyForm?.patchValue({ cluster:'' });

    this.schoolIdArr = [];
    this.schoolIdStr = "";
    this.schoolNameData = []; 
    this.editSchoolTeacherNotifyForm?.patchValue({ school:'' });

    this.teacherIdArr = [];
    this.teacherIdStr = "";
    this.teacherNameData = []; 
    this.editSchoolTeacherNotifyForm?.patchValue({ teacher:'' });

    this.commonserviceService.getAllDistrict().subscribe((data: any = []) => {
      this.allDistrictData = data?.data;
      this.scDisrtictSelect= false;
      if(this.userProfile.district != 0 || this.userProfile.district != ""){
        this.currentDistData = this.allDistrictData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        this.editSchoolTeacherNotifyForm.controls['district']?.patchValue(this.userProfile.district);
        this.getBlockByDistrictId(this.userProfile.district);
      }
      else{
        this.currentDistData = this.allDistrictData;
        this.scDisrtictSelect = true;
        this.scBlockSelect = true; 
        if(distId != "" && distId != null) { 
          this.editSchoolTeacherNotifyForm?.patchValue({ district: distId });
        }

      }
      this.showSpinnerDist = false;
    });
  }
  getBlockByDistrictId(distId:any, blockId:any = ""){
    this.showSpinnerBlockByDistId = true;

    this.blockIdArr = [];
    this.blockIdStr = "";
    this.allBlockByDistIdData = [];
    this.editSchoolTeacherNotifyForm?.patchValue({ block:'' });

    this.clusterIdArr = [];
    this.clusterIdStr = "";
    this.allClusterByBlockIdData = [];
    this.editSchoolTeacherNotifyForm?.patchValue({ cluster:'' });
     
    this.schoolIdArr = [];
    this.schoolIdStr = "";
    this.schoolNameData = []; 
    this.editSchoolTeacherNotifyForm?.patchValue({ school:'' });

    this.teacherIdArr = [];
    this.teacherIdStr = "";
    this.teacherNameData = []; 
    this.editSchoolTeacherNotifyForm?.patchValue({ teacher:'' });
    
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
          
          this.editSchoolTeacherNotifyForm.controls['block']?.patchValue(this.selectedBlockItems);
          this.blockIdStr = this.userProfile.block;
          this.blockDisable = true;
          this.getClusterByBlockId(this.blockIdStr);
        } else {
          this.allBlockByDistIdData = this.blockData;
          this.allBlockByDistIdData.forEach((blockData: any) => {
            blockData.showBlock = blockData.blockCode + " - " + blockData.blockName;
          });
          if(blockId != "" && blockId != null) { 
            this.blockIdStr = blockId;
            this.blockIdArr = blockId.split(",");
            let selectedBlockId = this.allBlockByDistIdData.filter((blo: any) => {
              return this.blockIdArr.includes(blo.blockId.toString()); 
            }); 

            selectedBlockId.forEach((blokData: any) => {         
              this.selectedBlockItems.push({
                blockId: blokData.blockId,
                showBlock: blokData.showBlock
              });
            });
  
            this.editSchoolTeacherNotifyForm.controls['block']?.patchValue(this.selectedBlockItems);
            this.blockIdStr = blockId;
          }  
        }

        this.showSpinnerBlockByDistId = false;
      });
    }
    else{
      this.showSpinnerBlockByDistId = false;
    }
  }
  getClusterByBlockId(selBlockId:any, clusterId:any = ""){
    this.showSpinnerClusterByBlockId = true;

    this.clusterIdArr = [];
    this.clusterIdStr = "";
    this.allClusterByBlockIdData = [];
    this.editSchoolTeacherNotifyForm?.patchValue({ cluster:'' });

    this.schoolIdArr = [];
    this.schoolIdStr = "";
    this.schoolNameData = []; 
    this.editSchoolTeacherNotifyForm?.patchValue({ school:'' });

    this.teacherIdArr = [];
    this.teacherIdStr = "";
    this.teacherNameData = []; 
    this.editSchoolTeacherNotifyForm?.patchValue({ teacher:'' });
    

    if(selBlockId != ""  && selBlockId != null){
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
          
          this.editSchoolTeacherNotifyForm.controls['cluster']?.patchValue(this.selectedClusterItems);
          this.clusterIdStr = this.userProfile.cluster;
          this.clusterDisable = true;
          this.getSchoolName();
        }
        else{
          this.allClusterByBlockIdData = this.clusterData;
          this.allClusterByBlockIdData.forEach((clustData: any) => {
            clustData.showCluster = clustData.clusterCode + " - " + clustData.clusterName;
          });
          if(clusterId != "" && clusterId != null) {             
            
            this.clusterIdStr = clusterId;
            this.clusterIdArr = clusterId.split(",");
            let selectedClusterId = this.allClusterByBlockIdData.filter((clu: any) => {
              return this.clusterIdArr.includes(clu.clusterId.toString()); 
            });  
            selectedClusterId.forEach((clData: any) => {         
              this.selectedClusterItems.push({
                clusterId: clData.clusterId,
                showCluster: clData.showCluster
              });
            });

            this.editSchoolTeacherNotifyForm.controls['cluster']?.patchValue(this.selectedClusterItems);
            this.clusterIdStr = clusterId;
          }
        }
        this.showSpinnerClusterByBlockId = false;
      });
    } else {
      this.showSpinnerClusterByBlockId = false;
    }
  }
  // END OF GETTING ALL DEMOGRAPHY DATA========================

  // GET MANAGEMENT DATA========================
  getSchoolManagement(managementId:any = ""){
    this.showSpinnerSchoolMgmt = true;

    this.schoolMgmtData = []; 
    this.schoolCatData = []; 

    this.schoolIdStr = "";
    this.schoolIdArr = [];
    this.schoolNameData = [];
    this.editSchoolTeacherNotifyForm?.patchValue({ school:'' });

    this.teacherIdStr = "";
    this.teacherIdArr = [];
    this.teacherNameData = [];
    this.editSchoolTeacherNotifyForm?.patchValue({ teacher:'' });

    this.commonserviceService.getSchoolManagement().subscribe((data: any = [])=>{
    this.schoolMgmtData = data?.data;
    
    this.schoolMgmtData.forEach((managementData: any) => {
      managementData.showManagement = managementData.anxtValue + " - " + managementData.anxtName;
    });
   
      if(managementId != '' && managementId != null){

        this.managementIdArr = managementId;
        this.managementIdArr = managementId.split(",");
        let selectedManagementId = this.schoolMgmtData.filter((clu: any) => {
          return this.managementIdArr.includes(clu.anxtValue.toString()); 
        });  
       
        selectedManagementId.forEach((managementData: any) => {         
          this.selectedManagementItems.push({
            anxtValue: managementData.anxtValue,
            showManagement: managementData.showManagement
          });
        });
        this.editSchoolTeacherNotifyForm.controls['management']?.patchValue(this.selectedManagementItems);
        this.managementIdStr = managementId;
      }
        this.showSpinnerSchoolMgmt = false;
    })
  }
  // END OF MANAGEMENT DATA======================

   // GET SCHOOL CATEGORY DATA======================
   getSchoolCategory(schoolCategoryId:any = ""){
    this.showSpinnerSchoolCatagory = true;

    this.schoolCatData = [];  

    this.schoolIdStr = "";
    this.schoolIdArr = [];
    this.schoolNameData = []; 
    this.editSchoolTeacherNotifyForm?.patchValue({ school:'' });

    this.teacherIdStr = "";
    this.teacherIdArr = [];
    this.teacherNameData = [];
    this.editSchoolTeacherNotifyForm?.patchValue({ teacher:'' });

    this.schoolService.getSchoolCategory().subscribe((data: any = [])=>{
     
      this.schoolCatData = data?.data;

      this.schoolCatData.forEach((schoolCat: any) => {
        schoolCat.showSchoolCategory = schoolCat.schlCatId + " - " + schoolCat.schlCatName;
      });

      if(schoolCategoryId != '' && schoolCategoryId != null){

        this.schoolCatIdArr = schoolCategoryId;
        this.schoolCatIdArr = schoolCategoryId.split(",");
        let selectedSchoolCategoryId = this.schoolCatData.filter((sc: any) => {
          return this.schoolCatIdArr.includes(sc.schlCatId.toString()); 
        });  
        


        selectedSchoolCategoryId.forEach((categoryData: any) => {         
          this.selectedSchoolCategoryItems.push({
            schlCatId: categoryData.schlCatId,
            schlCatName: categoryData.showSchoolCategory
          });
        });
        this.editSchoolTeacherNotifyForm.controls['schoolCategory']?.patchValue(this.selectedSchoolCategoryItems);
        this.schoolCatIdStr = schoolCategoryId;
      }
      this.showSpinnerSchoolCatagory = false;
     });  
  }
  //  END OF SCHOOL CATEGORY DATA========================

  //  ADD/REMOVE ACTION FOR MULTISELECT===================

  addBlockId(selBlockId:any, selectType: number = 1){
    if(selectType == 2){
      this.blockIdArr = [];
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
      this.clusterIdArr = [];
      this.schoolIdArr = [];
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
      this.schoolIdArr = [];
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
      this.managementIdArr = [];
      selmanagementId.forEach((element: any)=>{
        this.managementIdArr.push(element.anxtValue);
      });
    } else{
      this.managementIdArr.push(selmanagementId.anxtValue);
    }    
    this.managementIdStr = this.managementIdArr.join(','); 
      this.getSchoolName();
    
  }

  removeManagementId(selmanagementId:any, selectType: number = 1){
    if(selectType == 2){
      this.managementIdArr = [];
    } else{
      // 
      this.managementIdArr.forEach((element: any, index: any)=>{
        if(element==selmanagementId.anxtValue) this.managementIdArr.splice(index,1);
      });
    }  
    this.managementIdStr = this.managementIdArr.join(','); 
    this.getSchoolName();
    
    
  }

  addSchoolCategoryId(selschoolcatId:any, selectType: number = 1){
    if(selectType == 2){
      this.schoolCatIdArr = [];
      selschoolcatId.forEach((element: any)=>{
        this.schoolCatIdArr.push(element.schlCatId);
      });
    } else{
      this.schoolCatIdArr.push(selschoolcatId.schlCatId);
    }    
    this.schoolCatIdStr = this.schoolCatIdArr.join(','); 
      this.getSchoolName();
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
      this.getSchoolName();
  }

   //  SCHOOL ADD/REMOVE*********************
  addSchoolId(selschoolId:any, selectType: number = 1){
    if(selectType == 2){
      selschoolId.forEach((element: any)=>{
        this.schoolIdArr.push(element.schoolId);
      });
    } else{
      this.schoolIdArr.push(selschoolId.schoolId);
    }    
    this.schoolIdStr = this.schoolIdArr.join(','); 

    let noticeTypeVal = this.editSchoolTeacherNotifyForm.get('noticeType')?.value;
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

    let noticeTypeVal = this.editSchoolTeacherNotifyForm.get('noticeType')?.value;
    if(noticeTypeVal == 1){
      this.getTeacherName();
    }
  }
  //  END OF SCHOOL ADD/REMOVE*************** 

  //  TEACHER ADD/REMOVE============================== 
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
  //  END OF TEACHER ADD/REMOVE========================

  // END OF ADD/REMOVE ACTION FOR MULTISELECT===================

  // School GET SCHOOL==================
  getSchoolName(districtId:any = "", blockId:any = "", clusterId:any = "", managementId:any = "",categoryId:any = "",schoolId:any="" ){
    
    this.showSpinnerSchoolName = true;
    this.schoolIdArr= [];
    this.schoolIdStr = ""
    this.schoolNameData = []; 
    this.editSchoolTeacherNotifyForm?.patchValue({ school:'' }); 

    this.teacherIdArr= [];
    this.teacherIdStr = ""
    this.teacherNameData = []; 
    this.editSchoolTeacherNotifyForm?.patchValue({ teacher:'' });

    let districtVal: any = 0;
    if(districtId != "" && districtId != null) { 
      districtVal = districtId;
    } else{
      districtVal = this.editSchoolTeacherNotifyForm.get('district')?.value;
      districtVal = (this.userProfile.district != 0 || this.userProfile.district != "")?this.userProfile.district:(districtVal != '')? districtVal: 0;
    }    
    
    let blockVal: any = 0;
    if(blockId != "" && blockId != null) { 
      blockVal = blockId;
    } else{
      blockVal = (this.userProfile.block != 0 || this.userProfile.block != "")?this.userProfile.block:(this.blockIdStr != '')? this.blockIdStr: 0;
    } 
    
    let clusterVal: any = 0;
    if(clusterId != "" && clusterId != null) { 
      clusterVal = clusterId;
     
    } else{
      clusterVal = (this.userProfile.cluster != 0 || this.userProfile.cluster != "")?this.userProfile.cluster:(this.clusterIdStr != '')? this.clusterIdStr: 0;
    }   
    let managementVal: any = 0;
    if(managementId != "" && managementId != null) { 
      managementVal = managementId;
    } else{
      managementVal = (this.managementIdStr != '' )? this.managementIdStr: 0;
    }   

    let schoolCategoryVal: any = 0;
    if(categoryId != "" && categoryId != null) { 
      schoolCategoryVal = categoryId;
    } else{
      schoolCategoryVal = (this.schoolCatIdStr != '')? this.schoolCatIdStr: 0;
    }   

    if(clusterVal != 0 ){
      this.manageSchoolTeacherService.getSchoolName(districtVal, blockVal, clusterVal,managementVal,schoolCategoryVal).subscribe((data: any = [])=>{
        this.schoolNameData = data?.data;
      
        this.schoolNameData.forEach((school: any) => {  
          school.showSchool = school.schoolUdiseCode + " - " + school.schoolName;
        });
        if(schoolId != "" && schoolId != null) { 
          this.schoolIdArr = schoolId.split(",");
          let selectedUserId = this.schoolNameData.filter((usr: any) => {
            return this.schoolIdArr.includes(usr.schoolId.toString()); 
          }); 
  
          let selectedSchoolItems: any = [];
          selectedUserId.forEach((schoolData: any) => {         
            selectedSchoolItems.push({
              schoolId: schoolData.schoolId,
              showSchool: schoolData.showSchool
            });
            
          });
  
          this.editSchoolTeacherNotifyForm.controls['school']?.patchValue(selectedSchoolItems);
          this.schoolIdStr = schoolId;
        }
        this.showSpinnerSchoolName = false;
      });  
    }
    else{
      this.schoolIdArr =[];
      this.schoolIdStr ="";
      this.showSpinnerSchoolName = false;
    }
  }
  // END OF GET SCHOOL==================

  // GET TEACHER================
  getTeacherName(schoolId:any="",typeOfAppointId:any="",natureOfAppointId:any="",teacherId:any=""){
    this.showSpinnerTeacherName = true;
    this.teacherIdArr = [];
    this.teacherNameData = [];
    this.teacherIdStr = "";
    this.editSchoolTeacherNotifyForm?.patchValue({ teacher:'' }); 
  
    let schoolVal: any = 0;
    if(schoolId != "" && schoolId != null) { 
      schoolVal = schoolId;
    } else{
      schoolVal = (this.schoolIdStr != '')? this.schoolIdStr: 0;
    }  

    let appointTypeVal: any = 0;
    if(typeOfAppointId != "" && typeOfAppointId != null) { 
      appointTypeVal = typeOfAppointId;
    } else{
      appointTypeVal = (this.editSchoolTeacherNotifyForm.get('appointType')?.value) ? (this.editSchoolTeacherNotifyForm.get('appointType')?.value):0;
    }  

    let natureOfAppointVal: any = 0;
    if(natureOfAppointId != "" && natureOfAppointId != null) { 
      natureOfAppointVal = natureOfAppointId;
    } else{
      natureOfAppointVal = (this.editSchoolTeacherNotifyForm.get('natureOfAppoint')?.value) ? (this.editSchoolTeacherNotifyForm.get('natureOfAppoint')?.value):0;
    }  
    
    if(schoolVal != ''){
      this.manageSchoolTeacherService.getTeacherName(schoolVal,appointTypeVal,natureOfAppointVal).subscribe((data: any = [])=>{
        this.teacherNameData = data?.data;
  
        this.teacherNameData.forEach((teacher: any) => {  
          teacher.showTeacher = (teacher.teacherCode) ? teacher.teacherCode + " - " + teacher.teacherName :  teacher.teacherName;
        });

        if(teacherId != "" && teacherId != null) { 
          let teacherArr = teacherId.split(",");
          let selectedTeacherId = this.teacherNameData.filter((usr: any) => {
            return teacherArr.includes(usr.tId.toString()); 
          }); 

          let selectedTeacherItems: any = [];
          selectedTeacherId.forEach((teacherData: any) => {         
            selectedTeacherItems.push({
              tId: teacherData.tId,
              showTeacher: teacherData.showTeacher
            });
            this.teacherIdArr.push(teacherData.tId);
          });
          this.editSchoolTeacherNotifyForm.controls['teacher']?.patchValue(selectedTeacherItems);
          this.teacherIdStr = this.teacherIdArr.join(','); 
        }

        this.showSpinnerTeacherName = false;
      });  
    }
    else{
      this.teacherIdArr = [];
      this.teacherIdStr = "";
      this.editSchoolTeacherNotifyForm?.patchValue({ teacher:'' })
      this.showSpinnerTeacherName = false;
    }
  }
  //END OF GET TEACHER
 
  // GET ANNEXTURE DATA==================
  loadAnnexturesData(appointType:any="",natureOfAppointment:any="") {
    
    const anxTypes = ['NATURE_OF_APPOINTMENT','APPOINTMENT_TYPE'];
  
    let annextureData! : [];
    this.commonserviceService
      .getCommonAnnexture(anxTypes)
      .subscribe({
        next: (res: any) => {
          annextureData = res?.data;
          this.natureOfAppointDatas = res?.data?.NATURE_OF_APPOINTMENT;
          this.appointTypeData = res?.data?.APPOINTMENT_TYPE;
          if(natureOfAppointment != ''){ 
            let selectedUserId = this.natureOfAppointDatas.filter((item: any) => {
              item.anxtValue = natureOfAppointment;
            });
          }
        },
      });
  }
  // END OF GET ANNEXTURE DATA==================

  getSchoolTeacherNotificationDetails(encId: any){
    this.manageSchoolTeacherService.getSchoolTeacherNotificationDetails(encId).subscribe({
      next: (response: any) => {
        this.notificationDetailsData  = response.data[0];
        this.encId = this.notificationDetailsData.encId;
        this.editSchoolTeacherNotifyForm?.patchValue({ notificationMode: this.notificationDetailsData.notifyMode.toString() });
        if(this.notificationDetailsData.notifyMode == 1){ //FOR PORTAL
          this.notificationModeSMS=true;
        }
        if(this.notificationDetailsData.notifyMode == 2){ //FOR SMS
          this.notificationModeSMS=false;
        } 
        this.getNotificationCatName(this.notificationDetailsData.notifyCategoryId);
        this.notificationCategoryChange(this.notificationDetailsData.notifyCategoryId, this.notificationDetailsData.notifyComponentId);
        this.editSchoolTeacherNotifyForm?.patchValue({ contentType: this.notificationDetailsData.contentType.toString() });
        this.editSchoolTeacherNotifyForm?.patchValue({ subject: this.notificationDetailsData.subject });
        this.editSchoolTeacherNotifyForm?.patchValue({ notificationContent: this.notificationDetailsData.notifyContent });
        this.editSchoolTeacherNotifyForm?.patchValue({ typeOfAttachment: (this.notificationDetailsData.typeOfAttachment.toString())?this.notificationDetailsData.typeOfAttachment.toString() : 1 });  

        if(this.notificationDetailsData.typeOfAttachment == 2){     //FOR Document
          this.doumentDivShow = true;
          this.linkDivShow = false;
          this.editSchoolTeacherNotifyForm?.patchValue({ uploadDocument: '' });
          this.showViewDocument = true;
          this.previousDocument = this.notificationDetailsData.document;
          this.documentURL      = this.fileUrl + '/' +this.previousDocument.replace('.', '~');
        }
        if(this.notificationDetailsData.typeOfAttachment == 3){     //FOR URL
          this.linkDivShow=true;
          this.doumentDivShow=false;
          this.editSchoolTeacherNotifyForm?.patchValue({url: this.notificationDetailsData.LinkUrl });
        }
        
        this.editSchoolTeacherNotifyForm?.patchValue({ noticeType: this.notificationDetailsData.noticeType.toString() });

        this.getDistrict(this.notificationDetailsData.distId);
        if( this.loginUserTypeId == 3){
          this.getBlockByDistrictId(this.notificationDetailsData.distId, this.notificationDetailsData.blocks);
          this.getClusterByBlockId(this.notificationDetailsData.blocks, this.notificationDetailsData.clusters);
        }
        this.getSchoolManagement(this.notificationDetailsData.managements);
        this.getSchoolCategory(this.notificationDetailsData.schoolCategories);        

        if(this.notificationDetailsData.noticeType == 2){ //FOR SCHOOL
          this.teacherDivShow=false;

          this.teacherNameData = []; 
          this.teacherIdArr = [];
          this.teacherIdStr = "";
          this.editSchoolTeacherNotifyForm?.patchValue({teacher: '' });
          this.editSchoolTeacherNotifyForm?.patchValue({natureOfAppoint: '' });
          this.editSchoolTeacherNotifyForm?.patchValue({appointType: '' });
          this.getSchoolName(this.notificationDetailsData.distId, this.notificationDetailsData.blocks,this.notificationDetailsData.clusters,this.notificationDetailsData.managements,this.notificationDetailsData.schoolCategories,this.notificationDetailsData.schools); 
        }

        if(this.notificationDetailsData.noticeType == 1){ //FOR TEACHER
          this.teacherDivShow=true;
          this.editSchoolTeacherNotifyForm?.patchValue({ natureOfAppoint: this.notificationDetailsData?.natureOfAppointment });
          this.editSchoolTeacherNotifyForm?.patchValue({ appointType: this.notificationDetailsData?.appointmentType });
          this.getSchoolName(this.notificationDetailsData.distId, this.notificationDetailsData.blocks,this.notificationDetailsData.clusters,this.notificationDetailsData.managements,this.notificationDetailsData.schoolCategories,this.notificationDetailsData.schools);
          
          this.getTeacherName(this.notificationDetailsData.schools,this.notificationDetailsData.appointmentType,this.notificationDetailsData.natureOfAppointment,this.notificationDetailsData.teachers);
        }

      }
    });
  }
  //FORM SUBMIT============================
  submitSchoolTeacherNotification(){

    this.submitted = true;
    
    // if ("INVALID" === this.editSchoolTeacherNotifyForm.status) {
    //   for (const key of Object.keys(this.editSchoolTeacherNotifyForm.controls)) {
    //     if (this.editSchoolTeacherNotifyForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.editSchoolTeacherNotifyForm,this.allLabel);
    //       break;
    //     }
    //   }
    // }
    if(this.editSchoolTeacherNotifyForm.invalid){
      // this.customValidators.formValidationHandler(this.editSchoolTeacherNotifyForm, this.allLabel, this.el);
      this.customValidators.formValidationHandler(
        this.editSchoolTeacherNotifyForm,
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
    if(this.editSchoolTeacherNotifyForm.get('notificationMode')?.value==1 && this.editSchoolTeacherNotifyForm.get('typeOfAttachment')?.value == 2 && this.uploadDocument=="" && (this.previousDocument == null || this.previousDocument == "")){
      this.alertHelper.viewAlertHtml("error", "Invalid", "Upload document required");
      return;
    }

    const users = this.commonserviceService.getUserProfile();
    
    if (this.editSchoolTeacherNotifyForm.valid === true) {
      this.alertHelper.updateAlert(
        "Do you want to update the notification ?",
        "question",
        "Yes, update it!",
        "No, keep it"
        ).then((result) => {
        if (result.value) {
          this.spinner.show();
          
          const formData = new FormData();
          formData.append('userId',users?.userId);
          formData.append('profileId',users?.profileId);
          formData.append('loginId',users?.loginId);
          formData.append('notificationId', this.id);
          formData.append('notificationMode',this.editSchoolTeacherNotifyForm.get('notificationMode')?.value);
          formData.append('category',this.editSchoolTeacherNotifyForm.get('category')?.value);
          formData.append('component',this.editSchoolTeacherNotifyForm.get('component')?.value);
          
          formData.append('contentType',this.editSchoolTeacherNotifyForm.get('contentType')?.value);
          formData.append('subject',this.editSchoolTeacherNotifyForm.get('subject')?.value);
          formData.append('notificationContent', this.editSchoolTeacherNotifyForm.get('notificationContent')?.value);

          formData.append('typeOfAttachment',this.editSchoolTeacherNotifyForm.get('typeOfAttachment')?.value);
          formData.append('uploadDocument', this.uploadDocument);
          formData.append('previousDocument', this.previousDocument);
          formData.append('url', this.editSchoolTeacherNotifyForm.get('url')?.value);
          
          formData.append('noticeType',this.editSchoolTeacherNotifyForm.get('noticeType')?.value);
          formData.append('district',this.editSchoolTeacherNotifyForm.get('district')?.value);
          formData.append('block', this.blockIdStr);
          formData.append('cluster', this.clusterIdStr);
          
          formData.append('management', this.managementIdStr);
          formData.append('schoolCategory', this.schoolCatIdStr);
          formData.append('school', this.schoolIdStr);
          
          formData.append('natureOfAppoint', this.editSchoolTeacherNotifyForm.get('natureOfAppoint')?.value);
          formData.append('appointType',this.editSchoolTeacherNotifyForm.get('appointType')?.value);

          formData.append('teacher',this.teacherIdStr);
        
          this.manageSchoolTeacherService.updateSchoolTeacherNotification(formData).subscribe({
            next: (res: any) => {
              this.spinner.hide();
              this.alertHelper.successAlert(
                "Saved!",
                "Teacher school notification updated successfully.",
                "success"
              ).then(()=>{                
                this.router.navigate(["../../viewSchoolTeacherNotification"], {
                  relativeTo: this.activatedRoute,
                });
                
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
  onCancel()
  {
    this.router.navigate(["../../viewSchoolTeacherNotification"], {
      relativeTo: this.activatedRoute,
    }); 
  }
}
