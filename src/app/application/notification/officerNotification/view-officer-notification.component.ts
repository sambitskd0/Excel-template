import { formatDate } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CommonFunctionHelper } from 'src/app/core/helpers/common-function-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { environment } from 'src/environments/environment';
import { CommonNotificationServiceService } from '../services/common-notification-service.service';
import { ManageOfficerNotificationService } from '../services/manage-officer-notification.service';

@Component({
  selector: 'app-view-officer-notification',
  templateUrl: './view-officer-notification.component.html',
  styleUrls: ['./view-officer-notification.component.css']
})
export class ViewOfficerNotificationComponent implements OnInit {
  @ViewChild("searchForm") searchForm!: NgForm;
  public userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');
  public fileUrl = environment.filePath;

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
  ];

  paramObj: any; 
  serviceType: string = "Search";
  viewNotifications: any = [];
  dataSource = new MatTableDataSource(this.viewNotifications);  
  //end
  
  isLoading = false;
  pageIndex: any = 0;
  previousSize: any = 0;

  searchDistrictId:any  = "";
  searchBlockId:any     = "";
  searchClusterId:any   = "";
  searchGroup:any       = "";
  searchFromDate: any   = "";  
  searchToDate: any     = "";  
  searchCategory: any   = "";   
  searchComponent: any  = "";
  searchMode: any       = "";   
  searchType: any       = "";
  searchFromDateStr:any = ""
  searchToDateStr:any   = ""

  blockChanged: boolean     = false;  
  scDisrtictSelect:boolean  = true; 
  scDisrtictLoading:boolean = false; 
  scBlockSelect:boolean     = true; 
  scBlockLoading:boolean    = false; 
  scClusterSelect:boolean   = true;
  scClusterLoading:boolean  = false;
  showSpinnerCategory: boolean  =  false;
  showCompName: boolean     =  false;
  scCategorySelect: boolean = true; 
  scCategoryLoading: boolean= false;
  scComponentSelect: boolean= true; 
  scComponentLoading: boolean   = false;
  scDesignationSelect: boolean  = false;
  scDesignationLoading: boolean = true;
  showNotificationLoader:boolean = true;
  showNotificationDetails:boolean= false;

  notificationDetails: any= [];
  userDetails: any        = [];  
  districtData: any       = [];
  searchDistrictData: any = [];
  searchBlockData: any    = [];
  clusterData:any         = [];
  categoryData: any       = []; 
  componentData: any      = [];
  designationData: any    = [];

  public show:boolean = true;
  public buttonName:any = 'Show';

  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  maxDate:any =  Date;
  
  constructor(
    private commonFunctionHelper: CommonFunctionHelper,
    private manageOfficerNotificationService: ManageOfficerNotificationService, 
    private spinner: NgxSpinnerService, 
    public commonService: CommonserviceService, 
    public commonNotificationService: CommonNotificationServiceService, 
    private alertHelper: AlertHelper, 
    private router:Router, 
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
  ) { 
    const pageUrl:any = this.router.url;  
	  this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
	  this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]); // For admin authorization	
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    this.viewNotificationData(this.getSearchParams());    
    this.getDistrict();
    this.getDesignation();
    this.getNotificationCategory();    
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  toggle() {
    this.show = !this.show;
    if(this.show)  
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }

  getSearchParams() {
    if(this.searchFromDate != ""){
      this.searchFromDateStr = this.commonFunctionHelper.formatDateHelper(this.searchFromDate);
    } 
    if(this.searchToDate != ""){
      this.searchToDateStr = this.commonFunctionHelper.formatDateHelper(this.searchToDate);
    }
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(), 
      searchDistrictId: this.searchDistrictId,
      searchBlockId: this.searchBlockId,
      searchClusterId: this.searchClusterId, 
      searchGroup: this.searchGroup,
      searchFromDate: this.searchFromDateStr,
      searchToDate: this.searchToDateStr,
      searchCategory: this.searchCategory,
      searchComponent: this.searchComponent,
      searchMode: this.searchMode,
      searchType: this.searchType,
    };
  }

  viewNotificationData(...params: any){
    this.spinner.show();

    const {
      previousSize,
      offset,
      pageSize, 
      searchDistrictId,
      searchBlockId,
      searchClusterId, 
      searchGroup,
      searchFromDate,
      searchToDate,
      searchCategory,
      searchComponent,
      searchMode,
      searchType,
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      userId: this.userProfile.userId, 
      serviceType: this.serviceType, 
      searchDistrictId: searchDistrictId,
      searchBlockId: searchBlockId,
      searchClusterId: searchClusterId, 
      searchGroup: searchGroup,
      searchFromDate: searchFromDate,
      searchToDate: searchToDate,
      searchCategory: searchCategory,
      searchComponent: searchComponent,
      searchMode: searchMode,
      searchType: searchType,
    };

    this.isLoading = true;

    this.manageOfficerNotificationService.viewOfficerNotification(this.paramObj).subscribe({
      next: (res: any) => {
        this.viewNotifications.length = previousSize; // set current size
        this.viewNotifications.push(...res?.data); // merge with existing data
        this.viewNotifications.length = res?.totalRecord; // update length
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
    this.viewNotificationData(this.getSearchParams());
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
        this.searchForm.controls['searchDistrictId']?.patchValue(this.userProfile.district);
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
    this.searchForm.controls['searchBlockId']?.patchValue('');

    this.clusterData = [];
    this.searchForm.controls['searchClusterId']?.patchValue('');

    if(districtId !== ''){  
      this.commonService.getBlockByDistrictid(districtId).subscribe((res: any) => {      
        this.searchBlockData = res;
        this.searchBlockData = this.searchBlockData.data; 

        if(this.userProfile.block != 0 || this.userProfile.block != ""){
          this.searchBlockData = this.searchBlockData.filter((blo: any) => {
            return blo.blockId == this.userProfile.block;
          });
          this.searchForm.controls['searchBlockId']?.patchValue(this.userProfile.block);
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
    this.searchForm.controls['searchClusterId']?.patchValue('');

    if(blockId !== ''){  
      this.commonService.getClusterByBlockId(blockId).subscribe((res: any) => {      
        this.clusterData = res;
        this.clusterData = this.clusterData.data;
        
        if(this.userProfile.cluster != 0 || this.userProfile.cluster != ""){
          this.clusterData = this.clusterData.filter((clu: any) => {
            return clu.clusterId == this.userProfile.cluster;
          });
          this.searchForm.controls['searchClusterId']?.patchValue(this.userProfile.cluster);
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

  //Get Notification Category Name
  getNotificationCategory(){
    this.scCategorySelect = false;
    this.scCategoryLoading = true;

    this.commonNotificationService.getNotificationCategoryName().subscribe((data: any = []) => {
      this.categoryData = data?.data;

      this.scCategorySelect = true;
      this.scCategoryLoading = false;       
    });
  }
  //End Get Notification Category Name
  
  //Get Notification Component by Category
  getNotificationComponent(value:any){
    this.scComponentSelect = false;
    this.scComponentLoading = true;

    this.componentData = [];
    this.searchForm.controls['searchComponent']?.patchValue('');

    this.commonNotificationService.getNotificationComponentName(value).subscribe((data: any = []) => {
      this.componentData = data?.data;
      
      this.scComponentSelect = true; 
      this.scComponentLoading = false;
    });
  }
  //End Get Notification Component by Category

  getDesignation(){   
    this.scDesignationSelect = false;
    this.scDesignationLoading = true;

    this.commonService.getAuthorityDesignation().subscribe((data:any)=>{
      this.designationData = data?.data;

      this.scDesignationSelect = true; 
      this.scDesignationLoading = false;
    });
  }

  onSearch(){
    if(this.searchFromDate != "" && this.searchToDate!=""){
      if (formatDate(this.searchFromDate,'yyyy-MM-dd','en_US') > formatDate(this.searchToDate,'yyyy-MM-dd','en_US')){
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
    this.viewNotifications.splice(0, this.viewNotifications.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    this.viewNotificationData(this.getSearchParams());    
  }

  viewNotificationDetails(encId: any) {
    this.manageOfficerNotificationService.viewOfficerNotificationDetails(encId).subscribe({
      next: (response: any) => {
        this.notificationDetails  = response.data;
        this.userDetails          = response.users;

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
          this.manageOfficerNotificationService.deleteOfficerNotification(id, this.userProfile.userId,this.userProfile.profileId)
            .subscribe({
              next: (res: any) => {
                this.alertHelper.successAlert( "Deleted!", "Officer notification deleted successfully", "success" );
                this.viewNotificationData(this.getSearchParams());                
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

  downloadNotificationList(){
    this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.manageOfficerNotificationService.viewOfficerNotification(this.paramObj).subscribe({
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
  
  sendNotification(encId: string){
    this.alertHelper
    .submitAlert( "Are you sure to send notification?", "question", "Yes, send!", "Cancel" )
    .then((result) => {
      if (result.value) {
        this.spinner.show();
        this.manageOfficerNotificationService.sendOfficerNotification(encId, this.userProfile.userId)
        .subscribe({
          next: (res: any) => {
            this.alertHelper.successAlert( "Success", "Notification sent successfully", "success" );
            this.viewNotificationData(this.getSearchParams());  
            this.spinner.hide();
          },
          error: (error: any) => {
            this.spinner.hide(); 
          },
        });
      }
    });
  }


}
