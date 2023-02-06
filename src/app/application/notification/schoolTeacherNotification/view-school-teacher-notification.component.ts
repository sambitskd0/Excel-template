import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ErrorHandler, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { environment } from 'src/environments/environment';
import { SchoolService } from '../../school/services/school.service';
import { CommonNotificationServiceService } from '../services/common-notification-service.service';
import { ManageSchoolTeacherService } from '../services/manage-school-teacher.service';
import { CommonFunctionHelper } from 'src/app/core/helpers/common-function-helper';

@Component({
  selector: 'app-view-school-teacher-notification',
  templateUrl: './view-school-teacher-notification.component.html',
  styleUrls: ['./view-school-teacher-notification.component.css']
})
export class ViewSchoolTeacherNotificationComponent implements OnInit {

  public show:boolean = true;
  public buttonName:any = 'Show';
  
  viewSchoolTeacherNotifyForm!:FormGroup;
  private apiURL = environment.notificationAPI;
  public fileUrl = environment.filePath;

  
  // Variables For Spinner Blocks
  showSpinnerBlock: boolean             = false;
  showSpinnerDist: boolean              = false;
  showSpinnerBlockByDistId: boolean     = false;
  showSpinnerClusterByBlockId: boolean  = false;
  showSpinnerSchoolName: boolean        = false;
  showSpinnerDesignationGroup:boolean   = false;
  showSpinnerCategory:boolean           = false;
  showSpinnerComponentName: boolean     = false;
  showSpinnerTeacherName: boolean       = false;
  showNotificationLoader:boolean        = true;
  showNotificationDetails:boolean       = false;
   // End Variables For Spinner Blocks

  // Section For userProfile variables
  userProfile: any  = "";
  schoolId: any     = "";
  userLevel: any    = "";
  districtId: any   = "";
  blockId: any      = "";
  clusterId: any    = "";
  userId: any       = "";
  submitted: boolean=false;
  // End Section For userProfile variables

  currentDistData: any    = "";
  currentBlockData: any   = "";
  currentClusterData: any = "";

  allDistrictData: any            = [];
  allBlockByDistIdData: any       = [];
  allClusterByBlockIdData: any    = [];
  allSchoolrByClusterIdData: any  = [];
  allDesignationData: any         = [];
  allTeacherBySchoolIdData:any    = [];
  notificationCatName: any        = [];
  notificationCompName: any       = [];

  schoolCatData: any              = [];
  notificationDetails: any        = [];
  userDetails: any                = []; 
  

  scDisrtictSelect: boolean     = false;
  scBlockSelect: boolean        = false;
  scClusterSelect: boolean      = false;
  scSchoolSelect: boolean       = false;
  scDesigSelect:boolean         = false;
  scCategorySelect:boolean      = false;
  scComponentSelect:boolean     = false;
  scTeacherSelect:boolean       = false;


  //FORM CONTROL NAMES
  district: any   = "";
  block: any      = "";
  cluster: any    = "";
  school: any     = "";
  frmDate: any    = "";
  toDate: any     = "";
  // grpName: any = "";
  teacher: any    = "";
  category: any   = "";
  component: any  = "";
  notificationMode: any = "";
  type: any       = "";
  maxDate: any    = Date; 
  //END OF FORM CONTROL NAMES

  // ===============Material Table Variable and Decorators
  isLoading = false;
  isNorecordFound: boolean = false;
  isInitAdmin: boolean=false;
  pageIndex: any = 0;
  previousSize: any = 0;
  paramObj: any; 
  serviceType: string = "Search";

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
  // start define mat table reference columns
  displayedColumns: string[] = [
    "slNo",
    "type",
    "notificationMode",
    "category",
    "component",
    "subject",
    "createdOn",
    "status", 
    "lastSent", 
    "sendNotification", 
    "action"
  ]; // end define mat table columns

  resultListData: any = [];
  dataSource = new MatTableDataSource(this.resultListData);
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;

  //end Material Table Variable and Decorators
  
  constructor(
    private commonFunctionHelper: CommonFunctionHelper,
    private spinner: NgxSpinnerService, 
    private manageSchoolTeacherService:ManageSchoolTeacherService, 
    private commonNotificationServiceService:CommonNotificationServiceService, 
    private alertHelper: AlertHelper,
    private formBuilder: FormBuilder,
    public commonserviceService: CommonserviceService,
    public customValidators: CustomValidators,
    private errorHandler: ErrorHandler,
    private httpClient: HttpClient,
    private router: ActivatedRoute,
    private route: Router,
    private schoolService:SchoolService,
    private el: ElementRef, 
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    ){ 
      const users = this.commonserviceService.getUserProfile();
      this.userId = users?.userId;
      this.maxDate = new Date();
      const pageUrl:any = this.route.url;  
	    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
	    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]); // For admin authorization	
    }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    this.userProfile = this.commonserviceService.getUserProfile();
    this.schoolId = this.userProfile.school;
    this.districtId = this.userProfile.district;
    this.blockId = this.userProfile.block;
    this.clusterId = this.userProfile.cluster;
    this.userLevel = this.userProfile.userLevel;
    this.initializeForm();
    this.getNotificationCatName();
    this.getDistrict();
    this.loadNotifySchoolTeacher(this.getSearchParams());
   
  }

  // ===========initialize Datasource after complete Component Load
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // this.el.nativeElement.querySelector('[formControlName=district]')?.focus(); 
  }

  // START OF INITIALIZE DATA
  initializeForm(){
    this.viewSchoolTeacherNotifyForm = this.formBuilder.group({
      district: [
        this.district,[Validators.required,Validators.pattern(/^[0-9]+$/)]
      ], 
      block: [
        this.block,[Validators.pattern(/^[0-9]+$/)]
      ],
      cluster: [
        this.cluster,[Validators.pattern(/^[0-9]+$/)]
      ], 
      school: [
        this.school,[Validators.pattern(/^[0-9]+$/)]
      ], 
      frmDate: [
        this.frmDate
      ],
      toDate: [
        this.toDate
      ],
      /* grpName: [
        this.grpName,[Validators.pattern(/^[0-9]+$/)]
      ], */
      teacher:[
        this.teacher,[Validators.pattern(/^[0-9]+$/)]
      ],
      category: [
        this.category,[Validators.pattern(/^[0-9]+$/)]
      ], 
      component: [
        this.component,[Validators.pattern(/^[0-9]+$/)]
      ], 
      notificationMode: [
        this.notificationMode,[Validators.pattern(/^[0-9]+$/)]
      ],
      type: [
        this.type,[Validators.pattern(/^[0-9]+$/)]
      ],
    })
  }
  // END OF INITIALIZE DATA

  // ==============Get serch Parameters For Material Table
  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      district: this.viewSchoolTeacherNotifyForm?.get("district")?.value,
      block: this.viewSchoolTeacherNotifyForm?.get("block")?.value,
      cluster: this.viewSchoolTeacherNotifyForm?.get("cluster")?.value,
      school: this.viewSchoolTeacherNotifyForm?.get("school")?.value,
      /* frmDate: this.viewSchoolTeacherNotifyForm?.get("frmDate")?.value,
      toDate: this.viewSchoolTeacherNotifyForm?.get("toDate")?.value, */
      frmDate:this.commonFunctionHelper.formatDateHelper(new Date(this.viewSchoolTeacherNotifyForm?.controls['frmDate'].value)),
      toDate:this.commonFunctionHelper.formatDateHelper(new Date(this.viewSchoolTeacherNotifyForm?.controls['toDate'].value)),
      teacher: this.viewSchoolTeacherNotifyForm?.get("teacher")?.value,
      category: this.viewSchoolTeacherNotifyForm?.get("category")?.value,
      component: this.viewSchoolTeacherNotifyForm?.get("component")?.value,
      notificationMode: this.viewSchoolTeacherNotifyForm?.get("notificationMode")?.value,
      type: this.viewSchoolTeacherNotifyForm?.get("type")?.value,
    };
  }

  // ===========For Updation Table If Page Changes
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
    this.loadNotifySchoolTeacher(this.getSearchParams());
  }

  schoolTeacherNotifySearch(){
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    if (this.validateForm() === true) {
      this.loadNotifySchoolTeacher(this.getSearchParams());
    }
  }

  loadNotifySchoolTeacher(...params: any) {
    this.spinner.show();
    const {
      previousSize,
      offset,
      pageSize,
      district,
      block,
      cluster,
      school,
      frmDate,
      toDate,
      teacher,
      category,
      component,
      notificationMode,
      type,
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      district: district,
      block: block,
      cluster: cluster,
      school: school, 
      frmDate: frmDate,
      toDate: toDate,
      teacher: teacher,
      category: category, 
      component: component,
      notificationMode: notificationMode,
      type: type,
      userId: this.userId
    };
    this.isLoading = true;
    this.manageSchoolTeacherService.viewNotificationSchoolTeacher(this.paramObj).subscribe({
      next: (res: any) => {
        this.resultListData.length = previousSize; // set current size
        this.resultListData.push(...res?.data); // merge with existing data
        this.resultListData.length = res?.totalRecord; // update length
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
        this.isLoading = false;
        this.isNorecordFound = this.resultListData.length ? false : true;
        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }

  //Get Notification Category Name=====================
  getNotificationCatName(){
    this.showSpinnerCategory = true;
    this.commonNotificationServiceService.getNotificationCategoryName().subscribe((data: any = []) => {
      this.notificationCatName = data?.data;
      this.scCategorySelect = true;
      this.showSpinnerCategory = false;
    });
  }
  //End Get Notification Category Name***********************

  //Get Notification Component by Changing Notification Category==============
  notificationCategoryChange(value:any){
    // alert("hi..");
    this.showSpinnerComponentName = true;
    this.commonNotificationServiceService.getNotificationComponentName(value).subscribe((data: any = []) => {
      this.notificationCompName = data?.data;
      this.scComponentSelect = true;
      this.showSpinnerComponentName = false;
    });
  }
  //End Get Notification Component by Changing Notification Category**************

  //GET ALL DEMOGRAPHY DATA
  getDistrict(){
    this.showSpinnerDist = true;

    this.currentBlockData=[];
    this.currentClusterData=[];
    this.allSchoolrByClusterIdData=[];
    this.allTeacherBySchoolIdData=[];

    this.viewSchoolTeacherNotifyForm.patchValue({
      block:''
    }); 
    this.viewSchoolTeacherNotifyForm.patchValue({
      cluster:''
    });
    this.viewSchoolTeacherNotifyForm.patchValue({
      school:''
    }); 
    this.viewSchoolTeacherNotifyForm.patchValue({
      teacher:''
    });

    this.commonserviceService.getAllDistrict().subscribe((data: any = []) => {
      this.allDistrictData = data?.data;

      if(this.userProfile.district != 0 || this.userProfile.district != ""){
        this.currentDistData = this.allDistrictData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        this.viewSchoolTeacherNotifyForm.controls['district'].patchValue(this.userProfile.district);
        this.getBlockByDistrictId(this.userProfile.district);
      }
      else{
        this.currentDistData = this.allDistrictData;
        this.scDisrtictSelect = true;
        this.scClusterSelect = true; 
        this.scBlockSelect = true; 
        this.scSchoolSelect = true; 
        this.scTeacherSelect = true; 
      }
      this.showSpinnerDist = false;
    });
  }
  getBlockByDistrictId(distId:any){

    this.showSpinnerBlockByDistId = true;

    this.currentClusterData=[];
    this.allTeacherBySchoolIdData=[];
    this.allSchoolrByClusterIdData=[];
    this.viewSchoolTeacherNotifyForm.patchValue({
      cluster:''
    }); 

    this.commonserviceService. getBlockByDistrictid(distId).subscribe((data: any = []) => {
    this.allBlockByDistIdData = data?.data;
    
      if(this.userProfile.block != 0 || this.userProfile.block != ""){
        this.currentBlockData = this.allBlockByDistIdData.filter((dis: any) => {
          return dis.blockId == this.userProfile.block;
        });
        this.viewSchoolTeacherNotifyForm.controls['block'].patchValue(this.userProfile.block);
        this.getClusterByBlockId(this.userProfile.block);
      }
      else{
        this.currentBlockData = this.allBlockByDistIdData;
        this.scBlockSelect = true; 
        this.scClusterSelect = true; 
        this.scSchoolSelect = true; 
        this.scTeacherSelect = true; 
      }
      this.showSpinnerBlockByDistId = false;
    })
  }
  getClusterByBlockId(selBlockId:any){
    this.showSpinnerClusterByBlockId = true;

    this.allSchoolrByClusterIdData=[];
    this.allTeacherBySchoolIdData=[];

    this.viewSchoolTeacherNotifyForm.patchValue({
      school:''
    }); 
    this.viewSchoolTeacherNotifyForm.patchValue({
      teacher:''
    }); 

    this.commonserviceService. getClusterByBlockId(selBlockId).subscribe((data: any = []) => {
    this.allClusterByBlockIdData = data?.data;
    
      if(this.userProfile.cluster != 0 || this.userProfile.cluster != ""){
        this.currentClusterData = this.allClusterByBlockIdData.filter((dis: any) => {
          return dis.clusterId == this.userProfile.cluster;
        });
        this.viewSchoolTeacherNotifyForm.controls['cluster'].patchValue(this.userProfile.cluster);
        this.getSchoolByClusterId(this.userProfile.cluster);
        this.scSchoolSelect = true; 
        this.scTeacherSelect = true; 
      }
      else{
        this.currentClusterData = this.allClusterByBlockIdData;
        this.scClusterSelect = true; 
        this.scSchoolSelect = true; 
        this.scTeacherSelect = true; 
      }
      this.showSpinnerClusterByBlockId = false;
    })
  }
  //END OF DEMOGRAPHY DATA

  //GET SCHOOL DATA
  getSchoolByClusterId(selClusterId:any){
    this.showSpinnerSchoolName=true;

    this.viewSchoolTeacherNotifyForm.patchValue({
      school:''
    }); 
    this.viewSchoolTeacherNotifyForm.patchValue({
      teacher:''
    }); 
    this.allSchoolrByClusterIdData=[];
    this.allTeacherBySchoolIdData=[];

    this.manageSchoolTeacherService. getSchoolByClusterId(selClusterId).subscribe((data: any = []) => {
      this.allSchoolrByClusterIdData = data?.data;
      this.showSpinnerSchoolName=false;
    })
  }

  // Get Teacher Name By School Id Data
  getTeacherBySchoolId(schoolId:any){
    this.showSpinnerTeacherName = true;
    this.allTeacherBySchoolIdData = [];  

    const params = {'schoolId':schoolId}
    this.manageSchoolTeacherService.getTeacherBySchoolId(params).subscribe((data: any = [])=>{
      
      this.allTeacherBySchoolIdData = data?.data;
      this.showSpinnerTeacherName = false;
      this.scTeacherSelect = true;
      });  
  }
  // End Of Teacher Name By School Id Data

  validateForm() :Boolean{

    let frmDate = new Date(this.viewSchoolTeacherNotifyForm.get('frmDate')?.value).getTime();
    let toDate = new Date(this.viewSchoolTeacherNotifyForm.get('toDate')?.value).getTime();

    if (frmDate > toDate ) {
      this.alertHelper.successAlert(
        "",
        "From date can not be greater than to date",
        "info"
      );
      this.viewSchoolTeacherNotifyForm.patchValue({toDate: '' });
      return false;
    }
     return true;
   }
   //SECTION FOR DOWNLOAD CSV
   downloadNotificationList(){
    this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.manageSchoolTeacherService.viewNotificationSchoolTeacher(this.paramObj).subscribe({
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
  //END OF SECTION FOR DOWNLOAD CSV
  
  // SECTION FOR PRINT
   printPage() {
    let cloneTable 	= document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonserviceService.printPage(cloneTable, pageTitle);
  }
  //END OF SECTION PRINT
  toggle() {
    this.show = !this.show;
    if(this.show)  
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }
  viewNotificationDetails(encId: any) {
    this.manageSchoolTeacherService.viewSchoolTeacherrNotificationDetails(encId).subscribe({
      next: (response: any) => {
        this.notificationDetails  = response.data;
       
        this.showNotificationDetails      = true;
        this.showNotificationLoader       = false;
      }
    });
  }

  deleteNotification(id: number) {
    this.alertHelper
      .deleteAlert("Do you want to delete the notification ?", "", "question", "Yes, delete it!")
      .then((result) => {
        if (result.value) {
          this.spinner.show();
          this.isLoading = true;
          this.manageSchoolTeacherService.deleteSchoolTeacherNotification(id, this.userProfile.userId,this.userProfile.profileId)
            .subscribe({
              next: (res: any) => {
                if(res.status === "SUCCESS"){
                  // console.log(res.msg);
                  this.alertHelper.viewAlertHtml(
                    "success",
                    "",
                    res.msg
                  );
                  // this.alertHelper.viewAlertHtml("info", res?.msg);
                }else{
                  this.alertHelper.viewAlertHtml(
                    "error",
                    "",
                    res.msg
                  );
                  // this.alertHelper.viewAlertHtml("info", res?.msg);
                }
                this.loadNotifySchoolTeacher(this.getSearchParams());
                this.isLoading = false;
                this.spinner.hide();
                
              },
              error: (error: any) => {
                this.isLoading = false;
                this.spinner.hide();
              },
            });
        }
        else{
          this.isLoading = false;
          this.spinner.hide();
        }
      });
  }

  sendNotification(encId: string){
    this.alertHelper
    .submitAlert( "Are you sure to send notification?", "question", "Yes, send!", "Cancel" )
    .then((result) => {
      if (result.value) {
        this.spinner.show();
        this.manageSchoolTeacherService.sendSchoolTeacherNotification(encId, this.userProfile.userId) 
        .subscribe({
          next: (res: any) => {
            this.alertHelper.successAlert( "Success", "Notification sent successfully", "success" );
            this.loadNotifySchoolTeacher(this.getSearchParams());  
            this.spinner.hide();
          },
          error: (error: any) => {
            this.spinner.hide(); 
          },
        });
      }
      else{
        this.spinner.hide(); 
      }
    });
  }

}
