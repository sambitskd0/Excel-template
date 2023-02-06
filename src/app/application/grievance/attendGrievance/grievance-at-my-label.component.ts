import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Constant } from 'src/app/shared/constants/constant';
import { Router } from '@angular/router';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RaiseGrievanceService } from '../services/raise-grievance.service';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { CommonGrievanceService } from '../services/common-grievance.service';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { environment } from 'src/environments/environment';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { MatTableDataSource } from '@angular/material/table';
import { formatDate } from '@angular/common';
import { CommonFunctionHelper } from 'src/app/core/helpers/common-function-helper';

@Component({
  selector: 'app-grievance-at-my-label',
  templateUrl: './grievance-at-my-label.component.html',
  styleUrls: ['./grievance-at-my-label.component.css']
})
export class GrievanceAtMyLabelComponent implements OnInit {
  @ViewChild("searchForm") searchForm!: NgForm;
  public userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');
  public fileUrl = environment.filePath;
  public ApplicationURL = environment.APPURL;

  @ViewChild('closeModal') closeModal!: ElementRef;
  // mat table
  @Input() mode!: ProgressBarMode;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatTableExporterDirective, { static: true })
  exporter!: MatTableExporterDirective;
  pageSize = 10;
  offset = 0;
  currentPage = 0;
  totalRows = 0;
  pageSizeOptions: number[] = [10, 25, 100];
  displayedColumns: string[] = [
    "slNo",
    "token",
    "registrationDate",
    "school", 
    "location",
    "category",    
    "grievanceDetails",
    "actionTakenBy",
    "actionToBeTakenBy",
    "grievanceStatus",
    "takeAction", 
    "actionHistory",
  ];
  viewGrievance: any = [];
  dataSource = new MatTableDataSource(this.viewGrievance);
  paramObj: any; 
  serviceType: string = "Search";
  //end

  isLoading = false;
  pageIndex: any = 0;
  previousSize: any = 0;

  searchDistrictId:any = "";
  searchBlockId:any = "";
  searchClusterId:any = "";
  searchSchoolId:any = "";
  tokenNo:any = "";
  grievanceDescription:any = "";
  grvncStatus:any = "";
  fromDate:any = "";
  toDate:any = "";
  fromDateStr:any = "";
  toDateStr:any = "";
  maxDate: any = Date; 

  scDisrtictSelect:boolean = true; 
  scDisrtictLoading:boolean = false; 
  scBlockSelect:boolean = true; 
  scBlockLoading:boolean = false; 
  scClusterSelect:boolean = true;
  scClusterLoading:boolean = false;
  scSchoolSelect:boolean = true;
  scSchoolLoading:boolean = false;
  showClear:boolean = false;

  searchDistrictData: any = [];
  searchBlockData: any = [];
  clusterData:any="";
  getSchoolData: any="";
  sessionBlockId: any = this.userProfile.block != 0 ? this.userProfile.block : ""; 
  
  submitted = false;
  show: boolean = true;
  buttonName: any = 'Show';
  grievanceSearchform!: FormGroup;
  takeActionForm!: FormGroup;

  isVisible: any;
  isSelected: boolean = true;
  optionVal: any;
  optionstream: any;

  descFullText: string = "";

  viewGrievanceCount: any;
  pendingCount: Number = 0;
  resolvedCount: Number = 0;
  inProcessCount: Number = 0;
  onHoldCount: Number = 0;
  forwardCount: Number = 0;
  discardCount: Number = 0;

  statusChanged: boolean = false;
  statusData: any = [];
  actionStatusData: any = [];  

  grievanceDetails: any;
  showGrievanceTktNo = "";

  grievanceActionDetails: any;
  grievanceLogDetails: any;
  showGrievanceActionTktNo = "";

  forward: boolean = false;
  expResolveDate: boolean = false;
  blocklist: boolean = false;
  districtlist: boolean = false;
  showTakeActionTktNo = "";
  actionCompalainer: any = "";
  actionCompalainerCode: any = "";
  actionCategory: any = "";
  actionSubCategory: any = "";
  actionSubject: any = "";
  statusValue:any;

  takeActionStatus: any = "";
  actionTakenExpDate: any = "";
  actionTakenForward: any = "";
  actionTakenDistrict: any = "";
  actionTakenBlock: any = "";
  actionTakenDesignation: any = "";
  actionTakenAuthority: any = "";
  actionTakenDescription: any = "";
  actionTakenFile: any = "";
  
  demographyData: any = [];
  districtData: any = [];
  blockChanged: boolean = false;
  blockData: any = [];
  designationData: any = [];
  designationFilterData: any = []; 
  authorityChanged: boolean = false;
  authorityData: any = [];
  authorityParams: any;
  authorityLevel: any; 
  authorityDistrict: any;
  authorityBlock: any;
  authorityDesignation: any;
  postTakeActionFile: any="";
  takeActionEncId: any;
  takeActionApprovalEncId: any;  

  allLabel: string[] = ["Take action", "Expected resolve date", "Forward type", "District", "Block", "Designation", "Authority", "Action description", "Upload document"];
  
  plPrivilege: string = "admin"; //For menu privilege
  config = new Constant();
  tabs: any = [];  //For shwoing tabs

  constructor(
    private router: Router,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    public commonService: CommonserviceService,
    private spinner: NgxSpinnerService,
    private raiseGrievanceService: RaiseGrievanceService,
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private commonGrievanceService: CommonGrievanceService, 
    private alertHelper: AlertHelper, 
    private commonFunctionHelper: CommonFunctionHelper, 
    private el: ElementRef, 
  ) { 
    const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege   
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For view authorization
    this.tabs = this.privilegeHelper.PrimaryLinkTabs(pageUrl);  //For shwoing tabs      
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.viewGrievanceCountData();
    this.viewGrievanceData(this.getSearchParams());
    this.getGrievanceStatus();
    this.getDesignation();
    if(this.userProfile.loginUserTypeId == 1 || this.userProfile.loginUserTypeId==2 ){

      this.scDisrtictSelect = false;
      this.scDisrtictLoading = true;

      this.scBlockSelect = false;
      this.scBlockLoading = true;

      this.scClusterSelect = false;
      this.scClusterLoading = true;

      this.commonService.getDemographyByClusterId(this.userProfile.cluster).subscribe((res:any)=>{

        this.demographyData = res;
        this.demographyData = this.demographyData.data; 

        this.searchDistrictData = [this.demographyData.districtRes];
        this.searchForm.controls['searchDistrictId'].patchValue(this.userProfile.district);

        this.searchBlockData = [this.demographyData.blockRes];
        this.searchForm.controls['searchBlockId'].patchValue(this.userProfile.block);

        this.clusterData = [this.demographyData.clusterRes];
        this.searchForm.controls['searchClusterId'].patchValue(this.userProfile.cluster);

        this.getSchool(this.userProfile.cluster);
            
        this.scDisrtictLoading  = false;
        this.scBlockLoading     = false; 
        this.scClusterLoading = false;
      });
    } else {
      this.getDistrict();
    } 
    this.initializeTakeActionForm();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  toggle() {
    this.show = !this.show;
    if (this.show)
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }

  viewGrievanceData(...params: any) {
    this.spinner.show();

    const {
      previousSize,
      offset,
      pageSize, 
      searchDistrictId,
      searchBlockId,
      searchClusterId,
      searchSchoolId, 
      tokenNo,
      grievanceDescription,      
      fromDate,
      toDate,
      grvncStatus
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      grievanceType: 2,
      userId: this.userProfile.userId, 
      loginUserType: this.userProfile.loginUserTypeId, 
      searchDistrictId: searchDistrictId, 
      searchBlockId: searchBlockId, 
      searchClusterId: searchClusterId, 
      searchSchoolId: searchSchoolId, 
      tokenNo: tokenNo, 
      grievanceDescription: grievanceDescription, 
      fromDate: fromDate, 
      toDate: toDate, 
      grvncStatus: grvncStatus, 
      serviceType: this.serviceType
    };

    this.isLoading = true;

    this.raiseGrievanceService.viewGrievanceData(this.paramObj).subscribe({
      next: (res: any) => {
        this.viewGrievance.length = previousSize; // set current size
        this.viewGrievance.push(...res?.data); // merge with existing data
        this.viewGrievance.length = res?.totalRecord; // update length
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
        this.isLoading = false;

        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }

  viewGrievanceCountData() {
    this.spinner.show();
    this.raiseGrievanceService.viewGrievanceCount(2).subscribe({
      next: (data: any) => {
        this.viewGrievanceCount = data;
        this.viewGrievanceCount = this.viewGrievanceCount.data;
        this.pendingCount = this.viewGrievanceCount.Pending;
        this.resolvedCount = this.viewGrievanceCount.Resolved;
        this.inProcessCount = this.viewGrievanceCount.InProcess;
        this.onHoldCount = this.viewGrievanceCount.OnHold;
        this.forwardCount = this.viewGrievanceCount.Forward;
        this.discardCount = this.viewGrievanceCount.Discard;
        this.spinner.hide();
      },
      error: (error: any) => {
        this.spinner.hide();
      }
    });
  }

  viewGrievanceDetails(grievanceTktNo: any, encId: any) {
    this.showGrievanceTktNo = grievanceTktNo;
    this.raiseGrievanceService.viewGrievanceDetails(encId).subscribe({
      next: (response: any) => {
        this.grievanceDetails = response.data;
      }
    });
  }

  showDescription(descText: string) {
    this.descFullText = descText;
  }

  viewActionHistory(grievanceTktNo: any, encId: any, approvalId: any) {
    this.el.nativeElement.querySelector('[formControlName=takeActionStatus]').focus();  
    this.showGrievanceActionTktNo = grievanceTktNo;
    this.raiseGrievanceService.viewActionHistory(encId, approvalId).subscribe({
      next: (response: any) => {
        this.grievanceActionDetails = response.data;
        this.grievanceLogDetails = response.logData;
      }
    });
  }

  getGrievanceStatus(){
    this.statusChanged = true;
    this.commonGrievanceService.getGrievanceStatus().subscribe((data:[])=>{
      this.statusData = data;
      this.statusData = this.statusData.data;
      // this.statusData = this.statusData.data.filter((x: any) => {
      //   return x.statusCodeId !== 8
      // }); 
      this.statusChanged = false;
    });
  }

  resetTakeAction(){
    this.expResolveDate = false;
    this.forward        = false;
    this.districtlist   = false;
    this.blocklist      = false;
    this.takeActionForm.patchValue({ takeActionStatus: '' });
    this.takeActionForm.patchValue({ actionTakenExpDate: '' });
    this.takeActionForm.patchValue({ actionTakenForward: '' });    
    this.takeActionForm.patchValue({ actionTakenDistrict: '' });
    this.blockData = [];  
    this.takeActionForm.patchValue({ actionTakenBlock: '' });
    this.takeActionForm.patchValue({ actionTakenDesignation: '' });
    this.authorityData = []; 
    this.takeActionForm.patchValue({ actionTakenAuthority: '' });
    this.takeActionForm.patchValue({ actionTakenDescription: '' });
    this.takeActionForm.patchValue({ actionTakenFile: '' });
    //this.takeActionForm.patchValue({ takeActionEncId: '' });
    //this.takeActionForm.patchValue({ takeActionApprovalEncId: '' });
  }

  takeAction(takeActionTktNo: any, actionEncId: any, approvalEncId: any, userName: any, userCode: any, grvncCatName: any, grvncSubCatName: any, subjectName: any) {
    this.resetTakeAction();

    this.showTakeActionTktNo = takeActionTktNo;
    this.actionCompalainer = userName;
    this.actionCompalainerCode = userCode;
    this.actionCategory = grvncCatName;
    this.actionSubCategory = grvncSubCatName;
    this.actionSubject = subjectName;
    this.takeActionForm.patchValue({ takeActionEncId: actionEncId });
    this.takeActionForm.patchValue({ takeActionApprovalEncId: approvalEncId });

    this.actionStatusData = this.statusData.filter((x: any) => {
      return x.statusCodeId !== 1
    }); 
    //this.filterDesignation(5);    
  }

  initializeTakeActionForm(){
    this.takeActionForm = this.formBuilder.group({
      takeActionStatus: [this.takeActionStatus, [Validators.required, Validators.maxLength(10)]], 
      actionTakenExpDate: [this.actionTakenExpDate], 
      actionTakenForward: [this.actionTakenForward], 
      actionTakenDistrict: [this.actionTakenDistrict], 
      actionTakenBlock: [this.actionTakenBlock], 
      actionTakenDesignation: [this.actionTakenDesignation], 
      actionTakenAuthority: [this.actionTakenAuthority], 
      actionTakenDescription: [this.actionTakenDescription, [Validators.required, Validators.maxLength(250)]], 
      actionTakenFile: [this.actionTakenFile], 
      takeActionEncId: [this.takeActionEncId],
      takeActionApprovalEncId: [this.takeActionApprovalEncId],
    });
  }

  showStateRadio: boolean = true;
  showSection(statusVal: any){
    if(statusVal==3 || statusVal==4){
      this.forward        = false; 
      this.districtlist   = false;
      this.blocklist      = false;
      this.takeActionForm.patchValue({ actionTakenForward: '' });
      this.expResolveDate=true;
    }
    else if(statusVal==5){
      this.takeActionForm.patchValue({ actionTakenExpDate: '' });
      this.expResolveDate=false;
      this.forward=true;
      
      let actionId = this.takeActionForm.get('takeActionEncId')?.value;
      this.raiseGrievanceService.getForwardAuthority(actionId).subscribe((authorityData:any)=>{

        if(authorityData.data != null && authorityData.data !=""){
          
          let setForwardData = authorityData.data;

          this.showDemographySection(setForwardData.authLevelId);
          this.filterDesignation(setForwardData.authLevelId);             

          let authDistId = setForwardData.distId.toString();
          let authBlockId = setForwardData.blockId.toString();
          let authLevelId = setForwardData.authLevelId.toString();
          let authDesgnId = setForwardData.authDesgnId.toString();
          let authorityId = setForwardData.authorityId.toString();

          if((this.userProfile.block != 0 || this.userProfile.block != "" || authLevelId != 5) ){
            this.showStateRadio = false;
          }

          this.takeActionForm.get('actionTakenForward')?.patchValue(authLevelId);

          if(authLevelId = 3 ){
            this.takeActionForm.get('actionTakenDistrict')?.patchValue(authDistId);
            this.takeActionForm.get('actionTakenBlock')?.patchValue(authBlockId);
          }

          if(authLevelId = 4 ){
            this.takeActionForm.get('actionTakenDistrict')?.patchValue(authDistId);
          }
          
          this.takeActionForm.get('actionTakenDesignation')?.patchValue(authDesgnId);
          this.showAuthority();
          this.takeActionForm.get('actionTakenAuthority')?.patchValue(authorityId);          
        } else {
          if(this.userProfile.block != 0 || this.userProfile.block != ""){
            this.takeActionForm.patchValue({ actionTakenForward: '4' });
            this.showDemographySection(4);
            this.showStateRadio = false;
            this.filterDesignation(4);            
          } else {
            this.takeActionForm.patchValue({ actionTakenForward: '5' });
            this.showDemographySection(5);
            this.filterDesignation(5);            
          }      
        }
      });
    }
    else{
      this.expResolveDate = false;
      this.forward        = false;
      this.districtlist   = false;
      this.blocklist      = false;
      this.takeActionForm.patchValue({ actionTakenForward: '' });
      this.takeActionForm.patchValue({ actionTakenExpDate: '' });
    }
  }

  showDemographySection(forwardVal: any){
    if(forwardVal == 4){
      this.districtlist = true;
      this.blocklist    = false;
    }
    else if(forwardVal == 3){
      this.districtlist = true;
      this.blocklist    = true;
    }
    else{
      this.districtlist = false;
      this.blocklist    = false;
    }
  }

  getDistrict(){   
    this.scDisrtictSelect = false;
    this.scDisrtictLoading = true;
    this.commonService.getAllDistrict().subscribe((data:any)=>{
      this.districtData = data;
      this.districtData = this.districtData.data; 
      
      if(this.userProfile.district != 0 || this.userProfile.district != ""){
        this.searchDistrictData = this.districtData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        this.searchForm.controls['searchDistrictId'].patchValue(this.userProfile.district);
        this.getBlock(this.userProfile.district);
      }
      else{
        this.searchDistrictData = this.districtData;
        this.scDisrtictSelect = true;
      }

      this.searchBlockId='';      
      this.scDisrtictLoading = false;
    });
    
  }

  getBlock(districtId: any) { 
    this.scBlockSelect = false;
    this.scBlockLoading = true;

    this.searchBlockData = [];
    this.searchForm.controls['searchBlockId'].patchValue('');

    this.clusterData = [];
    this.searchForm.controls['searchClusterId'].patchValue('');

    this.getSchoolData = [];    
    this.searchForm.controls['searchSchoolId'].patchValue('');

    if(districtId !== ''){  
      this.commonService.getBlockByDistrictid(districtId).subscribe((res: any) => {      
        this.searchBlockData = res;
        this.searchBlockData = this.searchBlockData.data; 

        if(this.userProfile.block != 0 || this.userProfile.block != ""){
          this.searchBlockData = this.searchBlockData.filter((blo: any) => {
            return blo.blockId == this.userProfile.block;
          });
          this.searchForm.controls['searchBlockId'].patchValue(this.userProfile.block);
          this.getCluster(this.userProfile.block);
        }
        else{
          this.scBlockSelect = true; 
        }   
        this.scBlockLoading = false;         
      });
    } else{      
      this.scBlockSelect = true; 
      this.scBlockLoading = false;         
    }       
  }

  getCluster(blockId: any) {      
    this.scClusterSelect = false;
    this.scClusterLoading = true;

    this.clusterData = [];
    this.searchForm.controls['searchClusterId'].patchValue('');

    this.getSchoolData = [];    
    this.searchForm.controls['searchSchoolId'].patchValue('');

    if(blockId !== ''){  
      this.commonService.getClusterByBlockId(blockId).subscribe((res: any) => {      
        this.clusterData = res;
        this.clusterData = this.clusterData.data;
        
        if(this.userProfile.cluster != 0 || this.userProfile.cluster != ""){
          this.clusterData = this.clusterData.filter((clu: any) => {
            return clu.clusterId == this.userProfile.cluster;
          });
          this.searchForm.controls['searchClusterId'].patchValue(this.userProfile.cluster);
          this.getSchool(this.userProfile.cluster);
        }
        else{
          this.scClusterSelect = true; 
        }  
        this.scClusterLoading = false;
      });      
    }else{
      this.scClusterSelect = true; 
      this.scClusterLoading = false;
    }   
  }

  getSchool(clusterId:any){ 
    this.scSchoolSelect = false;
    this.scSchoolLoading = true;

    this.getSchoolData = [];  
    this.searchForm.controls['searchSchoolId'].patchValue('');
    if(clusterId !== ''){  
      this.commonService.getSchoolList(clusterId).subscribe((res:any) => {      
        this.getSchoolData = res;
        this.getSchoolData = this.getSchoolData.data;

        if(this.userProfile.udiseCode != 0 || this.userProfile.udiseCode != ""){
          this.getSchoolData = this.getSchoolData.filter((sch: any) => {
            return sch.schoolUdiseCode == this.userProfile.udiseCode;
          });
          this.searchForm.controls['searchSchoolId'].patchValue(this.getSchoolData[0].schoolId);
        }
        else{
          this.scSchoolSelect = true; 
        }  
        this.scSchoolLoading = false;
      });
    }else{
      this.scSchoolSelect = true; 
      this.scSchoolLoading = false;
    }
  }
  
  showBlock(id: any) {   
    this.blockChanged = true;
    this.blockData = [];    
    this.commonService.getBlockByDistrictid(id).subscribe((res: any) => {      
      this.blockData = res;
      this.blockData = this.blockData.data; 
      this.blockChanged = false;
    });
  }

  getDesignation(){   
    this.commonService.getAuthorityDesignation().subscribe((data:any)=>{
      this.designationData = data;
      this.designationData = this.designationData.data; 
    });
  }

  filterDesignation(levelId: any){
    this.designationFilterData = this.designationData.filter((desg: any) => {
      return desg.intLevelId === parseInt(levelId)
    });    
   
    this.takeActionForm.get("actionTakenDistrict")?.patchValue("");
    this.blockData = [];     
    this.takeActionForm.get("actionTakenBlock")?.patchValue("");

    this.takeActionForm.get("actionTakenDesignation")?.patchValue("");
    this.authorityData = [];     
    this.takeActionForm.get("actionTakenAuthority")?.patchValue("");
  }

  showAuthority(){   
    this.authorityChanged = true;
    this.authorityDesignation = this.takeActionForm.get("actionTakenDesignation")?.value;

    if(this.authorityDesignation !== '' || this.authorityDesignation != null){  
      this.authorityLevel     = this.takeActionForm.get("actionTakenForward")?.value;
      this.authorityDistrict  = this.takeActionForm.get("actionTakenDistrict")?.value;
      this.authorityBlock     = this.takeActionForm.get("actionTakenBlock")?.value;

      this.authorityParams = JSON.stringify({ 'authorityLevel':this.authorityLevel, 'designationId':this.authorityDesignation, 'authorityDistrict':this.authorityDistrict, 'authorityBlock':this.authorityBlock })

      this.commonService.getAuthority(this.authorityParams).subscribe((data:any)=>{
        this.authorityData = data;
        this.authorityData = this.authorityData.data; 
        this.authorityChanged = false;
      });
    } else {
      this.authorityData = [];           
      this.authorityChanged = false;
    }
    this.takeActionForm.get("actionTakenAuthority")?.patchValue(""); 
  }

  
  fileEvent(e: any) {
    const takeActionDoc = e.target.files[0];
    if(takeActionDoc != null){
      if (takeActionDoc.type != 'image/png' && takeActionDoc.type != 'image/jpg' && takeActionDoc.type != 'image/jpeg'  && takeActionDoc.type != 'application/pdf') {
        this.alertHelper.viewAlertHtml(
          "error",
          "Error",
          '<i class="bi bi-arrow-right text-danger"></i> File type should be png, jpg, jpeg or pdf file'
        );
        this.takeActionForm.patchValue({ actionTakenFile: '' });
        return;
      }

      if (takeActionDoc.size >= (1024 * 1024 * 2)) {      
        this.alertHelper.viewAlertHtml(
          "error",
          "Error",
          '<i class="bi bi-arrow-right text-danger"></i> File size should not be greater than 2 MB'
        );
        this.takeActionForm.patchValue({ actionTakenFile: '' });
        return;
      }
      
      this.postTakeActionFile = e.target.files[0];
      this.showClear = true;
    }
  }

  clearFile(){
    this.takeActionForm.patchValue({ actionTakenFile: '' });
    this.showClear = false;
  }

  submitTakeAction(){
    this.submitted = true;
    if(this.takeActionForm.invalid){
      // this.customValidators.formValidationHandler(this.takeActionForm, this.allLabel, this.el);
      this.customValidators.formValidationHandler(
        this.takeActionForm,
        this.allLabel,
        this.el,
        {
          required: {
            takeActionStatus: "Please select take action",
            actionTakenDescription: "Please enter action description",
          },
        }
      );
    }
    

    if(this.takeActionForm.get("takeActionStatus")?.value == 3 || this.takeActionForm.get("takeActionStatus")?.value == 4){
      if(this.takeActionForm.controls["actionTakenExpDate"]?.value == '' || this.takeActionForm.controls["actionTakenExpDate"]?.value == undefined) {
        this.alertHelper.viewAlertHtml("error", "Invalid", "Expected resolve date required");
        return;
      }
    }

    if(this.takeActionForm.get("takeActionStatus")?.value == 5){
      if(this.takeActionForm.controls["actionTakenForward"]?.value == '') {
        this.alertHelper.viewAlertHtml("error", "Invalid", "Forward type (State, District or Block) required");
        return;
      }else{

        if(this.takeActionForm.get("actionTakenForward")?.value == 3 || this.takeActionForm.get("actionTakenForward")?.value == 4){
          if(this.takeActionForm.controls["actionTakenDistrict"]?.value == '') {
            this.alertHelper.viewAlertHtml("error", "Invalid", "District required");
            return;
          }
        }

        if(this.takeActionForm.get("actionTakenForward")?.value == 3){
          if(this.takeActionForm.controls["actionTakenBlock"]?.value == '') {
            this.alertHelper.viewAlertHtml("error", "Invalid", "Block required");
            return;
          }
        }

        if(this.takeActionForm.controls["actionTakenDesignation"]?.value == '') {
          this.alertHelper.viewAlertHtml("error", "Invalid", "Designation required");
          return;
        }

        if(this.takeActionForm.controls["actionTakenAuthority"]?.value == '') {
          this.alertHelper.viewAlertHtml("error", "Invalid", "Authority required");
          return;
        }
      }
    }

    if(this.takeActionForm.valid == true){      
      this.alertHelper.submitAlert().then((result) => {
        if(result.value){
          this.spinner.show();

          let actionExpDate: any = this.takeActionForm?.getRawValue()?.actionTakenExpDate;
          if(actionExpDate != ""){
            actionExpDate = new Date(actionExpDate);
            actionExpDate = this.commonFunctionHelper.formatDateHelper(actionExpDate);
          }          

          const formData = new FormData();
          formData.append('userId', this.userProfile.userId);
          formData.append('takeActionEncId', this.takeActionForm.get('takeActionEncId')?.value);
          formData.append('takeActionApprovalEncId', this.takeActionForm.get('takeActionApprovalEncId')?.value);
          formData.append('takeActionStatus', this.takeActionForm.get('takeActionStatus')?.value);
          formData.append('actionTakenExpDate', actionExpDate);
          formData.append('actionTakenForward', this.takeActionForm.get('actionTakenForward')?.value);
          formData.append('actionTakenDistrict', this.takeActionForm.get('actionTakenDistrict')?.value);
          formData.append('actionTakenBlock', this.takeActionForm.get('actionTakenBlock')?.value);
          formData.append('actionTakenDesignation', this.takeActionForm.get('actionTakenDesignation')?.value);
          formData.append('actionTakenAuthority', this.takeActionForm.get('actionTakenAuthority')?.value);
          formData.append('actionTakenDescription', this.takeActionForm.get('actionTakenDescription')?.value);
          formData.append('takeActionFile', this.postTakeActionFile);

          this.raiseGrievanceService.takeAction(formData).subscribe({
            next: (res: any) => {
              this.spinner.hide();
              this.alertHelper.successAlert(
                "Saved!",
                "Action on grievance taken successfully",
                "success"
              ).then(()=>{
                this.resetTakeAction();
                this.initializeTakeActionForm();
                this.closeModal.nativeElement.click();
                this.viewGrievanceCountData();
                this.viewGrievanceData(this.getSearchParams());
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

  getSearchParams() {
    this.fromDateStr = "";
    this.toDateStr = "";

    if(this.fromDate != "" && this.fromDate != undefined){      
      this.fromDateStr = this.commonFunctionHelper.formatDateHelper(this.fromDate);
    }
    if(this.toDate != "" && this.toDate != undefined){
      this.toDateStr = this.commonFunctionHelper.formatDateHelper(this.toDate);
    }

    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(), 
      searchDistrictId: this.searchDistrictId,
      searchBlockId: this.searchBlockId,
      searchClusterId: this.searchClusterId,
      searchSchoolId: this.searchSchoolId,
      tokenNo: this.tokenNo.trim(),
      grievanceDescription: this.grievanceDescription.trim(),     
      fromDate: this.fromDateStr,
      toDate: this.toDateStr,
      grvncStatus: this.grvncStatus,
    };
  }

  onPageChange(event: any) {
    this.spinner.show();
    this.isLoading = true;
    // event: PageEvent
    this.pageSize = event.pageSize; // current page size ex: 10
    /**
     * pageIndex starts from 0
     * ex: if pageIndex = 0 then offset = 0 * 10 = 0 and if pageIndex =1 then 1*10 = 10
     */
    this.offset = event.pageIndex * event.pageSize;
    this.previousSize = this.pageSize * event.pageIndex; // set previous size
    this.pageIndex = event.pageIndex;
    this.viewGrievanceData(this.getSearchParams());
  }

  onSearch() {
    if(this.fromDate != "" && this.toDate!=""){
      if (formatDate(this.fromDate,'yyyy-MM-dd','en_US') > formatDate(this.toDate,'yyyy-MM-dd','en_US')){
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "From date can not be greater than to date."
        ); 
        return;
      }
    }
    
    this.offset = 0;
    this.previousSize = 0;
    this.pageIndex = 0;
    this.viewGrievance.splice(0, this.viewGrievance.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    this.viewGrievanceData(this.getSearchParams());
  }
  
  dateValidation(){
    let expDate = this.takeActionForm.controls['actionTakenExpDate'].value;
    if(expDate && expDate!=''){
      const newDate = new Date();    
      if (formatDate(expDate,'yyyy-MM-dd','en_US') < formatDate(newDate,'yyyy-MM-dd','en_US')){
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Expected resolve date should be greater than or equal to current date."
        );
        this.takeActionForm.patchValue({actionTakenExpDate: ''});      
      }
    }
  }

  downloadGrievanceList(){
    this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.raiseGrievanceService.viewGrievanceData(this.paramObj).subscribe({
      next: (res: any) => {       
        let filepath = this.fileUrl + '/' + res.data.replace('.', '~');
        window.open(filepath);
        this.spinner.hide();
      },
      error: (error: any) => {
        this.spinner.hide();
      },
    });
  }

  printPage() {
    let cloneTable 	= document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }

}
