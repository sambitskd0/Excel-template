import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { Router } from '@angular/router';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RaiseGrievanceService } from '../../services/raise-grievance.service';
import { FormGroup, NgForm } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { CommonGrievanceService } from '../../services/common-grievance.service';
import { Constant } from 'src/app/shared/constants/constant';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { formatDate } from '@angular/common';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CommonFunctionHelper } from 'src/app/core/helpers/common-function-helper';

@Component({
  selector: 'app-forwarded-grievance',
  templateUrl: './forwarded-grievance.component.html',
  styleUrls: ['./forwarded-grievance.component.css']
})
export class ForwardedGrievanceComponent implements OnInit {
  @ViewChild("searchForm") searchForm!: NgForm;
  public userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');
  public fileUrl = environment.filePath;
  public ApplicationURL = environment.APPURL;

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
    "actionHistory",
  ];

  paramObj: any; 
  serviceType: string = "Search";
  viewGrievance: any = [];
  dataSource = new MatTableDataSource(this.viewGrievance);
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

  searchDistrictData: any = [];
  searchBlockData: any = [];
  clusterData:any="";
  getSchoolData: any="";
  sessionBlockId: any = this.userProfile.block != 0 ? this.userProfile.block : "";
  
  show: boolean = true;
  buttonName: any = 'Show';
  grievanceSearchform!: FormGroup;

  descFullText: string = "";

  statusChanged: boolean = false;
  statusData: any = [];  

  grievanceDetails: any;
  showGrievanceTktNo = "";

  grievanceActionDetails: any;
  grievanceLogDetails: any;
  showGrievanceActionTktNo = "";

  demographyData: any = [];
  districtData: any = [];
  blockChanged: boolean = false;
  blockData: any = [];

  plPrivilege: string = "admin"; //For menu privilege
  config = new Constant();
  tabs: any = [];  //For shwoing tabs

  constructor(
    private router: Router,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    public commonService: CommonserviceService,
    private spinner: NgxSpinnerService,
    private raiseGrievanceService: RaiseGrievanceService,
    public customValidators: CustomValidators,
    private commonGrievanceService: CommonGrievanceService,  
    private alertHelper: AlertHelper, 
    private commonFunctionHelper: CommonFunctionHelper
  ) { 
    const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege   
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[3], this.config.privilege[1]);  // For view authorization
    this.tabs = this.privilegeHelper.PrimaryLinkTabs(pageUrl);  //For shwoing tabs  
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.viewGrievanceData(this.getSearchParams());
    this.getGrievanceStatus();
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

  getGrievanceStatus(){
    this.statusChanged = true;
    this.commonGrievanceService.getGrievanceStatus().subscribe((data:[])=>{
      this.statusData = data;
      this.statusData = this.statusData.data;
      this.statusChanged = false;
    });
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
      grievanceType: 3,
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
    this.showGrievanceActionTktNo = grievanceTktNo;
    this.raiseGrievanceService.viewActionHistory(encId, approvalId).subscribe({
      next: (response: any) => {
        this.grievanceActionDetails = response.data;
        this.grievanceLogDetails = response.logData;
      }
    });
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
