import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { CommonNotificationServiceService } from '../../services/common-notification-service.service';
import { ManageOfficerNotificationService } from '../../services/manage-officer-notification.service';

@Component({
  selector: 'app-add-officer-notification',
  templateUrl: './add-officer-notification.component.html',
  styleUrls: ['./add-officer-notification.component.css']
})
export class AddOfficerNotificationComponent implements OnInit {
  blockDropdown:IDropdownSettings={}; 
  clusterDropdown:IDropdownSettings={};
  userDropdown:IDropdownSettings={};
  addOfficerNotifyForm!:FormGroup;

  notificationMode: any = "1";
  category: any = "";
  component: any  = "";
  contentType: any  = "1";
  subject: any  = "";
  notificationContent: any  = "";
  typeOfAttachment: any = "1";
  uploadDocument: any = "";
  linkUrl: any  = "";
  noticeType: any = "3";
  district: any = "";
  block: any  = "";
  cluster: any  = "";
  selectUser:any  = "";

  notificationCatName: any  = "";   
  notificationCompName: any = "";
  allDistrictData: any  = [];
  districtData: any = [];
  allBlockByDistIdData: any = [];
  blockData: any = [];
  allClusterByBlockIdData: any  = [];
  clusterData: any = [];
  selectUserData: any = []; 
  blockIdArr: any = [];
  blockIdStr: any = "";
  clusterIdArr: any = [];
  clusterIdStr: any = "";
  userIdArr: any = [];
  userIdStr: any = "";
  selectedBlockItems: any = [];
  selectedClusterItems: any = [];
  levels: any = [];
  designationRes: any   = [];
  designationData: any  = [];
  designationUsers:any = [];
  designationUserIds:any = [];

  notificationModeSMS:boolean = true;  
  doumentDivShow:boolean = false;
  linkDivShow:boolean = false;
  submitted: boolean = false;
  selectUserDivShow: boolean  =  false;
  selectGroupDivShow: boolean  =  true;
  showSpinnerCategory: boolean  =  false;
  showCompName: boolean  =  false;
  showSpinnerDist: boolean = false;
  showSpinnerBlockByDistId: boolean = false;
  showSpinnerClusterByBlockId: boolean = false;
  showSpinnerUser: boolean = false;
  scDisrtictSelect:boolean  =  true; 
  blockDisable: boolean = false;
  clusterDisable: boolean = false; 
  showUserLoader: boolean = true;
  showUserDetails: boolean = false;

  allLevels: any = [];
  allLabel: string[] = ["Notification mode", "Category", "Component", "Content type", "Subject", "Notification content", "Types of attachment", "Upload document", "URL", "Notice type", "District", "Block", "Cluster", "User"];

  public userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');

  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private alertHelper: AlertHelper, 
    private manageOfficerNotificationService:ManageOfficerNotificationService, 
    public commonserviceService: CommonserviceService, 
    public commonNotificationService: CommonNotificationServiceService,
    private el: ElementRef, 
    private spinner: NgxSpinnerService,   
    private router:Router, 
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
  ) { 
    const pageUrl:any = this.router.url;  
	  this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
	  this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For admin authorization	
  }

  ngOnInit(): void {
    this.spinner.show();
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    this.setLevels(5);
    this.initializeForm();
    this.getNotificationCatName();
    this.getDistrict();
    this.getUserDesignation();
    this.el.nativeElement.querySelector('[formControlName=category]')?.focus(); 

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

    this.userDropdown = {
      idField: 'intUserId',
      textField: 'vchUserName',
      enableCheckAll: true,
      selectAllText: "Select All User",
      unSelectAllText: "UnSelect All User",
      noDataAvailablePlaceholderText: "No user available",
      allowSearchFilter: true,
      itemsShowLimit: 3,
    };
  }

  // Initialize Reactive Form
  initializeForm() {
    this.addOfficerNotifyForm = this.formBuilder.group({
      notificationMode: [
        this.notificationMode,
        [Validators.required, Validators.pattern(/^[0-9]+$/)]
      ],    
      category: [
        this.category,
        [Validators.required, Validators.pattern(/^[0-9]+$/)]
      ], 
      component: [
        this.component,
        [Validators.pattern(/^[0-9]+$/)]
      ],
      contentType: [
        this.contentType,
        [Validators.required, Validators.pattern(/^[0-9]+$/)]
      ],
      subject: [
        this.subject,
        [
          Validators.required, Validators.maxLength(200), 
          // Validators.pattern(/^[a-zA-Z0-9 ,.'\-\s]+$/), 
          this.customValidators.firstCharValidatorRF
        ]
      ],
      notificationContent: [
        this.notificationContent,
        [
          this.conditionalValidator(
            () => this.addOfficerNotifyForm?.get("notificationMode")?.value,
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
            () => this.addOfficerNotifyForm?.get("notificationMode")?.value,
            Validators.required,
            "conditionalValidation",
            "typeOfAttachment"
          ),
          Validators.pattern(/^[0-9]+$/)
        ],
      ],      
      uploadDocument: [
        this.uploadDocument,  
        [
          this.conditionalValidator(
            () => this.addOfficerNotifyForm?.get("typeOfAttachment")?.value,
            Validators.required,
            "conditionalValidation",
            "uploadDocument"
          ),
        ],      
      ],
      linkUrl: [
        this.linkUrl,  
        [
          this.conditionalValidator(
            () => this.addOfficerNotifyForm?.get("typeOfAttachment")?.value,
            Validators.required,
            "conditionalValidation",
            "linkUrl"
          ),
        ],      
      ],
      noticeType: [
        this.noticeType,
        [Validators.required, Validators.pattern(/^[0-9]+$/)]
      ],
      district: [
        this.district, 
        [Validators.pattern(/^[0-9]+$/)]
      ],
      block: [
        this.block
      ],
      cluster: [
        this.cluster
      ], 
      selectUser: [
        this.selectUser,
        [
          this.conditionalValidator(
            () => this.addOfficerNotifyForm?.get("noticeType")?.value,
            Validators.required,
            "conditionalValidation",
            "selectUser"
          ),
        ],   
      ],
    })
  }
  // End Of Initialization

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
      if (validationType === "linkUrl" && parentValue == 3) {
        conditionStatus = true;
      }  

      // validation logic for User
      if (validationType === "selectUser" && parentValue == 4) {
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

  //Change Notification Content and Type Of Attachment Based On Notification Mode (SMS,Portal)
  notificationTypeChange(value:any){
    if(value == 1){     //FOR PORTAL
      this.notificationModeSMS=true;
    }
    if(value == 2){         //FOR SMS
      this.notificationModeSMS= false;
      this.doumentDivShow     = false;
      this.linkDivShow        = false;
      this.typeOfAttachment   = "1";
      this.uploadDocument     = "";
      this.addOfficerNotifyForm?.patchValue({ notificationContent: '' });
      this.addOfficerNotifyForm?.patchValue({ typeOfAttachment: '1' });
      this.addOfficerNotifyForm?.patchValue({ uploadDocument: '' });
      this.addOfficerNotifyForm?.patchValue({ linkUrl: '' });
    }    
  }

  //Change Of Document Div and Url Div Based On Types of Attachment
  attachmentType(value:any){
    if(value == 1){     //FOR Choose Nothing
      this.doumentDivShow=false;
      this.linkDivShow=false;
      this.addOfficerNotifyForm?.patchValue({ uploadDocument: '' });
      this.uploadDocument = "";
      this.addOfficerNotifyForm?.patchValue({ linkUrl: '' });
    }
    if(value == 2){     //FOR Document
      this.doumentDivShow=true;
      this.linkDivShow=false;
      this.addOfficerNotifyForm?.patchValue({ linkUrl: '' });
    }
    if(value == 3){     //FOR URL
      this.linkDivShow=true;
      this.doumentDivShow=false;
      this.addOfficerNotifyForm?.patchValue({ uploadDocument: '' });
      this.uploadDocument = "";
    }
  }
  //End Of Changing Of Document Div and Url Div Based On Types of Attachment

  // Notice Type Change
  noticeTypeChange(value:any){
    this.selectUserData = [];  
    this.addOfficerNotifyForm?.patchValue({ selectUser:'' });

    if(value == 3){   //For Officer
      this.selectGroupDivShow=true;
      this.selectUserDivShow=false;
      this.userIdArr = [];
      this.userIdStr = "";
      this.addOfficerNotifyForm?.patchValue({ selectUser:'' });
      this.getUserDesignation();
    }
    if(value == 4){   //For Individual  
      this.selectUserDivShow=true;
      this.selectGroupDivShow=false;
      this.designationUserIds =[];
      this.getNotificationAuthority();
    }
  }
  // End Of Notice Type Change

  //Set all levels
  setLevels(levelStage: number = 5){
    this.levels[5] = "State";
    this.levels[4] = "District";
    this.levels[3] = "Block";
    this.levels[2] = "Cluster";

    if(levelStage == 5){
      this.allLevels= [{'id':5, 'level':'State'}, {'id':4, 'level':'District'}, {'id':3, 'level':'Block'}, {'id':2, 'level':'Cluster'}];
    } else if(levelStage == 4){
      this.allLevels= [{'id':4, 'level':'District'}, {'id':3, 'level':'Block'}, {'id':2, 'level':'Cluster'}];
    } else if(levelStage == 3){
      this.allLevels= [{'id':3, 'level':'Block'}, {'id':2, 'level':'Cluster'}];
    } else if(levelStage == 2){
      this.allLevels= [{'id':2, 'level':'Cluster'}];
    } else {
      this.allLevels= [];
    }    
  }
  //End Set all levels

  //Get get user list for individual notification
  getNotificationAuthority(){
    this.selectUserData = [];
    this.userIdArr = [];
    this.userIdStr = "";
    this.addOfficerNotifyForm?.patchValue({ selectUser:'' });

    let districtVal = this.addOfficerNotifyForm.get('district')?.value;
    districtVal = (this.userProfile.district != 0 || this.userProfile.district != "")?this.userProfile.district:(districtVal != '')? districtVal: 0;
    
    let blockVal = (this.userProfile.block != 0 || this.userProfile.block != "")?this.userProfile.block:(this.blockIdStr != '')? this.blockIdStr: 0;
    let clusterVal = (this.userProfile.cluster != 0 || this.userProfile.cluster != "")?this.userProfile.cluster:(this.clusterIdStr != '')? this.clusterIdStr: 0;

    this.showSpinnerUser = true;
    this.manageOfficerNotificationService.getNotificationAuthority(districtVal, blockVal, clusterVal).subscribe((res: any = []) => {
      this.selectUserData = res?.data;
      this.showSpinnerUser = false;
    });
  }
  //End get user list for individual notification

  //Get get user list for Officer Notice 
  getUserDesignation(){
    this.designationUserIds =[];
    let districtVal = this.addOfficerNotifyForm.get('district')?.value;
    districtVal = (this.userProfile.district != 0 || this.userProfile.district != "")?this.userProfile.district:(districtVal != '')? districtVal: 0;
    
    let blockVal = (this.userProfile.block != 0 || this.userProfile.block != "")?this.userProfile.block:(this.blockIdStr != '')? this.blockIdStr: 0;
    let clusterVal = (this.userProfile.cluster != 0 || this.userProfile.cluster != "")?this.userProfile.cluster:(this.clusterIdStr != '')? this.clusterIdStr: 0;

    this.manageOfficerNotificationService.getDesignationUserCount(districtVal, blockVal, clusterVal).subscribe((res: any = []) => {
      this.designationRes = res?.data;
      this.getFilterDesignation(0);
      this.spinner.hide();
    });
  }

  getFilterDesignation(levelType: number = 0){
    this.designationUserIds =[];
    this.designationRes = this.designationRes.map((desRes: any) => ({...desRes, isChecked: false}));
    if(levelType > 0 ){
      this.designationData = this.designationRes.filter((designation: any) => {
        return designation.intLevelId == levelType;
      });
    } else {
      this.designationData = this.designationRes;
    }
  }
  //End get user list for Officer Notice
  
  //show view all button on clicking to checkbox   
  showDesignationUsers(designationId:any, i: any){
    const desgUserIds = this.designationUserIds.filter(function(item: any){ return item.desgId == designationId });  
    let desgUserArr = desgUserIds[0].userId.split(",");

    let districtVal = this.addOfficerNotifyForm.get('district')?.value;
    districtVal = (this.userProfile.district != 0 || this.userProfile.district != "")?this.userProfile.district:(districtVal != '')? districtVal: 0;
    
    let blockVal = (this.userProfile.block != 0 || this.userProfile.block != "")?this.userProfile.block:(this.blockIdStr != '')? this.blockIdStr: 0;
    let clusterVal = (this.userProfile.cluster != 0 || this.userProfile.cluster != "")?this.userProfile.cluster:(this.clusterIdStr != '')? this.clusterIdStr: 0;

    this.manageOfficerNotificationService.getDesignationUser(designationId, districtVal, blockVal, clusterVal).subscribe((res: any = []) => {
      this.designationUsers = res?.data;
      this.designationUsers.forEach((desRes: any) => {
        if(desgUserArr.includes(desRes.intUserId.toString())) {
          desRes.isChecked = true;
        } else {
          desRes.isChecked = false;
        }
      }); 

      this.showUserLoader   = false;
      this.showUserDetails  = true;
    });
  }

  //show view all button on clicking to checkbox
  onCheckboxChange(e:any, i: any) {
    if (e.target.checked) {       
      this.designationUserIds.push({'desgId':e.target.value, 'userId':document.getElementById('desgUsers_'+i)?.getAttribute('value')});
      document.getElementById('btn_'+i)?.setAttribute("style", "visibility: visible;");
    } else {
      this.designationUserIds = this.designationUserIds.filter(function(item: any){ return item.desgId != e.target.value });  
      document.getElementById('btn_'+i)?.setAttribute("style", "visibility: hidden;");
    }  
  }

  onUserChange(e:any, i: any, chkDesgId:any): any{
    const desgUserIds = this.designationUserIds.filter(function(item: any){ return item.desgId == chkDesgId });  
    let desgUserArr = desgUserIds[0].userId.split(",");
    if (e.target.checked) {       
      desgUserArr.push(e.target.value);
    } else {      
      if(desgUserArr.length == 1){
        this.alertHelper.viewAlertHtml("error", "Invalid", "All records can not be unchecked.");
        e.target.checked = true;
        return;
      } else {
        desgUserArr = desgUserArr.filter(function(item: any){ return item != e.target.value });           
      }      
    }  
    desgUserArr = desgUserArr.filter( (item: any) => item);
    let desgUserStr = desgUserArr.join(',');
    this.designationUserIds.forEach((desRes: any) => {
      if(desRes.desgId == chkDesgId) {
        desRes.userId = desgUserStr;
      }
    });   
  }

  //Get Notification Category Name
  getNotificationCatName(){
    this.showSpinnerCategory = true;
    this.commonNotificationService.getNotificationCategoryName().subscribe((data: any = []) => {
      this.notificationCatName = data?.data;
      this.showSpinnerCategory = false;
    });
  }
  //End Get Notification Category Name
  
  //Get Notification Component by Changing Notification Category
  notificationCategoryChange(value:any){
    this.showCompName = true;
    this.notificationCompName = [];
    this.addOfficerNotifyForm?.patchValue({ component:'' });
    if(value!=''){
      this.commonNotificationService.getNotificationComponentName(value).subscribe((data: any = []) => {
        this.notificationCompName = data?.data;
        this.showCompName = false;
      });
    }else{
      this.notificationCompName = [];
      this.addOfficerNotifyForm?.patchValue({ component:'' });
    }
    this.showCompName = false;
  }
  //End Get Notification Component by Changing Notification Category**************

  //Get All Demography Data
  getDistrict(){
    this.showSpinnerDist = true;
    this.commonserviceService.getAllDistrict().subscribe((data: any = []) => {
      this.districtData = data?.data;

      if(this.userProfile.district != 0 || this.userProfile.district != ""){
        this.scDisrtictSelect= false;
        this.allDistrictData = this.districtData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        this.addOfficerNotifyForm.controls['district']?.patchValue(this.userProfile.district);
        this.getBlockByDistrictId(this.userProfile.district);
      }
      else{
        this.allDistrictData = this.districtData;

      }
      this.showSpinnerDist = false;
    });
  }

  getBlockByDistrictId(distId:any){    
    this.showSpinnerBlockByDistId = true;

    this.blockIdArr = [];
    this.blockIdStr = "";

    this.clusterIdArr = [];
    this.clusterIdStr = "";

    this.userIdArr = [];
    this.userIdStr = "";

    this.allBlockByDistIdData = [];
    this.addOfficerNotifyForm?.patchValue({ block:'' });

    this.allClusterByBlockIdData = [];
    this.addOfficerNotifyForm?.patchValue({ cluster:'' });

    this.selectUserData = [];  
    this.addOfficerNotifyForm?.patchValue({ selectUser:'' });

    this.blockIdArr = [];
    if(distId != ""){
      this.commonserviceService. getBlockByDistrictid(distId).subscribe((data: any = []) => {
        this.blockData = data?.data;

        if(this.userProfile.block != 0 || this.userProfile.block != ""){

          this.allBlockByDistIdData = this.blockData.filter((blo: any) => {
            return blo.blockId == this.userProfile.block;
          });          
          
          this.allBlockByDistIdData.forEach((bloData: any) => {
            bloData.showBlock = bloData.blockCode + " - " + bloData.blockName;            
          });
          
          this.allBlockByDistIdData.forEach((blokData: any) => {         
            this.selectedBlockItems.push({
              blockId: blokData.blockId,
              showBlock: blokData.showBlock
            });
          });

          this.addOfficerNotifyForm.controls['block']?.patchValue(this.selectedBlockItems);
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
      this.setLevels(4);
    } else {
      this.showSpinnerBlockByDistId = false;
      this.setLevels(5);
    }

    let noticeTypeVal = this.addOfficerNotifyForm.get('noticeType')?.value;    
    if(noticeTypeVal == 3){
      this.getUserDesignation();
    }       
    if(noticeTypeVal == 4){
      this.getNotificationAuthority();
    }
  }

  getClusterByBlockId(selBlockId:any){
    this.showSpinnerClusterByBlockId = true;

    this.clusterIdArr = [];
    this.clusterIdStr = "";

    this.userIdArr = [];
    this.userIdStr = "";

    this.allClusterByBlockIdData = [];
    this.addOfficerNotifyForm?.patchValue({ cluster:'' });

    this.selectUserData = [];  
    this.addOfficerNotifyForm?.patchValue({ selectUser:'' });

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
          
          this.addOfficerNotifyForm.controls['cluster']?.patchValue(this.selectedClusterItems);
          this.clusterIdStr = this.userProfile.cluster;
          this.clusterDisable = true;

          let noticeTypeVal = this.addOfficerNotifyForm.get('noticeType')?.value;
          if(noticeTypeVal == 3){
            this.getUserDesignation();
          } 
          if(noticeTypeVal == 4){
            this.getNotificationAuthority();
          }
          this.setLevels(2);
        }
        else{
          this.allClusterByBlockIdData = this.clusterData;
          this.allClusterByBlockIdData.forEach((clustData: any) => {
            clustData.showCluster = clustData.clusterCode + " - " + clustData.clusterName;
          });
          this.setLevels(3);
        }
        this.showSpinnerClusterByBlockId = false;
      });      
    } else {
      this.showSpinnerClusterByBlockId = false;
      this.setLevels(4);
    }
  }
  //End Of Getting All Demography Data

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

    let noticeTypeVal = this.addOfficerNotifyForm.get('noticeType')?.value;
    if(noticeTypeVal == 3){
      this.getUserDesignation();
    } 
    if(noticeTypeVal == 4){
      this.getNotificationAuthority();
    }
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

    let noticeTypeVal = this.addOfficerNotifyForm.get('noticeType')?.value;
    if(noticeTypeVal == 3){
      this.getUserDesignation();
    } 
    if(noticeTypeVal == 4){
      this.getNotificationAuthority();
    }
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

    let noticeTypeVal = this.addOfficerNotifyForm.get('noticeType')?.value;
    if(noticeTypeVal == 3){
      this.getUserDesignation();
    } 
    if(noticeTypeVal == 4){
      this.getNotificationAuthority();
    }

    this.setLevels(2);
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

    let noticeTypeVal = this.addOfficerNotifyForm.get('noticeType')?.value;
    if(noticeTypeVal == 3){
      this.getUserDesignation();
    } 
    if(noticeTypeVal == 4){
      this.getNotificationAuthority();
    }
    this.setLevels(3);
  }

  addUserId(selUserId:any, selectType: number = 1){
    if(selectType == 2){
      selUserId.forEach((element: any)=>{
        this.userIdArr.push(element.intUserId);
      });
    } else{
      this.userIdArr.push(selUserId.intUserId);
    }    
    this.userIdStr = this.userIdArr.join(','); 
  }

  removeUserId(selUserId:any, selectType: number = 1){
    if(selectType == 2){
      this.userIdArr = [];
    } else{
      this.userIdArr.forEach((element: any, index: any)=>{
        if(element==selUserId.intUserId) this.userIdArr.splice(index,1);
      });
    }  

    this.userIdStr = this.userIdArr.join(','); 
  }

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
        this.addOfficerNotifyForm?.patchValue({ uploadDocument: '' });
        return;
      }

      if (notificationDoc.size >= (1024 * 1024 * 2)) {      
        this.alertHelper.viewAlertHtml(
          "error",
          "Error",
          '<i class="bi bi-arrow-right text-danger"></i> File size should not be greater than 2 MB'
        );
        this.addOfficerNotifyForm?.patchValue({ uploadDocument: '' });
        return;
      }
      
      this.uploadDocument = event.target.files[0];
    }
  }
  // End Of file upload validation

  //Reset the form
  resetForm(){
    this.addOfficerNotifyForm?.patchValue({ notificationMode: '1' });
    this.notificationTypeChange('1');

    this.addOfficerNotifyForm?.patchValue({ category: '' });
    this.addOfficerNotifyForm?.patchValue({ component: '' });
    this.addOfficerNotifyForm?.patchValue({ contentType: '1' });
    this.addOfficerNotifyForm?.patchValue({ subject: '' });
    this.addOfficerNotifyForm?.patchValue({ notificationContent: '' });
    this.addOfficerNotifyForm?.patchValue({ typeOfAttachment: '1' });
    this.attachmentType(1);

    this.addOfficerNotifyForm?.patchValue({ noticeType: '3' });    

    let setResetLevel = 5;
    if(this.userProfile.district != 0 || this.userProfile.district != ""){
      this.addOfficerNotifyForm.controls['district']?.patchValue(this.userProfile.district);
      setResetLevel = 4;
    } else {
      this.addOfficerNotifyForm?.patchValue({ district: '' });
    }

    if(this.userProfile.block != 0 || this.userProfile.block != ""){
      this.addOfficerNotifyForm.controls['block']?.patchValue(this.selectedBlockItems);
      setResetLevel = 3;
    } else {
      this.blockIdArr   = [];
      this.blockIdStr   = "";
      this.allBlockByDistIdData = [];
      this.addOfficerNotifyForm?.patchValue({ block: '' });
    }

    if(this.userProfile.cluster != 0 || this.userProfile.cluster != ""){
      this.addOfficerNotifyForm.controls['cluster']?.patchValue(this.selectedClusterItems);
      setResetLevel = 2;
    } else {
      this.clusterIdArr = [];
      this.clusterIdStr = "";
      this.allClusterByBlockIdData = [];
      this.addOfficerNotifyForm?.patchValue({ cluster: '' });
    }    
    
    this.userIdArr    = [];
    this.userIdStr    = "";    
    this.selectUserData = [];
    this.addOfficerNotifyForm?.patchValue({ selectUser:'' });
    this.designationUserIds = [];

    this.noticeTypeChange('3');
    this.setLevels(setResetLevel);
  }

  //Submit notification form
  submitNotification(){
    this.submitted = true;

    // if ("INVALID" === this.addOfficerNotifyForm.status) {
    //   for (const key of Object.keys(this.addOfficerNotifyForm.controls)) {
    //     if (this.addOfficerNotifyForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.addOfficerNotifyForm, this.allLabel);
    //       break;
    //     }
    //   }
    // } 

    if(this.addOfficerNotifyForm.invalid){
      // this.customValidators.formValidationHandler(this.addOfficerNotifyForm, this.allLabel, this.el);
      this.customValidators.formValidationHandler(
        this.addOfficerNotifyForm,
        this.allLabel,
        this.el,
        {
          required: {
            notificationMode: "Please select notification mode",
            category: "Please select notification category",
            contentType: "Please select content type",
            subject: "Please select subject",
            noticeType: "Please enter content for notification",
          },
        }
      );
    }

    if(this.addOfficerNotifyForm.get('noticeType')?.value == 3 && this.designationUserIds.length < 1){
      this.alertHelper.viewAlertHtml("error", "Invalid", "Please enter group name");
      this.el.nativeElement.querySelector('[formControlName=selectUser]')?.focus(); 
      return;
    }

    if(this.addOfficerNotifyForm.valid == true){
      this.alertHelper.submitAlert().then((result) => {
        if(result.value){
          this.spinner.show();

          const formData = new FormData();
          formData.append('userId', this.userProfile.userId);
          formData.append('profileId', this.userProfile.profileId);

          formData.append('notificationMode', this.addOfficerNotifyForm.get('notificationMode')?.value);
          formData.append('category', this.addOfficerNotifyForm.get('category')?.value);
          formData.append('component', this.addOfficerNotifyForm.get('component')?.value); 

          formData.append('contentType', this.addOfficerNotifyForm.get('contentType')?.value);
          formData.append('subject', this.addOfficerNotifyForm.get('subject')?.value);
          formData.append('notificationContent', this.addOfficerNotifyForm.get('notificationContent')?.value);

          formData.append('typeOfAttachment', this.addOfficerNotifyForm.get('typeOfAttachment')?.value);
          formData.append('uploadDocument', this.uploadDocument);
          formData.append('linkUrl', this.addOfficerNotifyForm.get('linkUrl')?.value);

          formData.append('noticeType', this.addOfficerNotifyForm.get('noticeType')?.value);
          formData.append('district', this.addOfficerNotifyForm.get('district')?.value);
          formData.append('block', this.blockIdStr);
          formData.append('cluster', this.clusterIdStr);
          formData.append('selectUser', this.userIdStr);
          formData.append('disignationUsers', JSON.stringify(this.designationUserIds));

          this.manageOfficerNotificationService.addOfficerNotification(formData).subscribe({
            next: (res: any) => {
              this.spinner.hide();
              this.alertHelper.successAlert(
                "Saved!",
                "Officer notification created successfully.",
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

}
