import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { RaiseGrievanceService } from '../services/raise-grievance.service';
import { Router } from '@angular/router';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { FormGroup, NgForm } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { CommonGrievanceService } from '../services/common-grievance.service';
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
  selector: 'app-view-grievance',
  templateUrl: './view-grievance.component.html',
  styleUrls: ['./view-grievance.component.css']
})
export class ViewGrievanceComponent implements OnInit {
  public userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');
  public loginUserTypeId = this.userProfile.loginUserTypeId;
  public fileUrl = environment.filePath;
  @ViewChild("searchForm") searchForm!: NgForm;
  
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
  displayedColumns: string[] =[];
  viewGrievance: any = [];
  dataSource = new MatTableDataSource(this.viewGrievance);
  paramObj: any; 
  serviceType: string = "Search";
  //end

  isLoading = false;
  pageIndex: any = 0;
  previousSize: any = 0;

  tokenNo:any = "";
  grievanceDescription:any = "";
  grvncStatus:any = "";
  fromDate:any = "";
  toDate:any = "";
  fromDateStr:any = "";
  toDateStr:any = "";
  maxDate: any = Date; 
  
  show:boolean = true;
  buttonName:any = 'Show';
  grievanceSearchform!: FormGroup;

  //viewGrievance:any;
  descFullText:string = "";

  statusChanged:boolean = false; 
  statusData: any= [];

  grievanceDetails:any;
  showGrievanceTktNo  = ""; 

  grievanceActionDetails:any;
  grievanceLogDetails: any;
  showGrievanceActionTktNo  = "";

  plPrivilege:string="admin"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  
  constructor(
    private router:Router,
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
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    this.viewGrievanceData(this.getSearchParams());
    this.getGrievanceStatus();

    if(this.loginUserTypeId == 3){
      this.displayedColumns = [
        "slNo",
        "token",
        "registrationDate",
        "location",
        "category",  
        "grievanceDetails",
        "actionTakenBy",
        "actionToBeTakenBy",
        "grievanceStatus",
        "actionHistory",
      ];
    } else{
      this.displayedColumns = [
        "slNo",
        "token",
        "registrationDate",
        "category",  
        "grievanceDetails",
        "actionTakenBy",
        "actionToBeTakenBy",
        "grievanceStatus",
        "actionHistory",
      ];
    }  
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

  viewGrievanceData(...params: any){
    this.spinner.show();    
    const {
      previousSize,
      offset,
      pageSize, 
      tokenNo,
      grievanceDescription,      
      fromDate,
      toDate,
      grvncStatus
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      grievanceType: 1,
      userId: this.userProfile.userId, 
      loginUserType: this.userProfile.loginUserTypeId, 
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

  viewGrievanceDetails(grievanceTktNo:any, encId:any){
    this.showGrievanceTktNo = grievanceTktNo;
    this.raiseGrievanceService.viewGrievanceDetails(encId).subscribe({
      next: (response: any) => {
        this.grievanceDetails = response.data;
      }
    });
  }

  showDescription(descText: string){
    this.descFullText = descText;
  }

  viewActionHistory(grievanceTktNo:any, encId:any, approvalId: any){
    this.showGrievanceActionTktNo = grievanceTktNo;
    this.raiseGrievanceService.viewActionHistory(encId, approvalId).subscribe({
      next: (response: any) => {
        this.grievanceActionDetails = response.data;
        this.grievanceLogDetails = response.logData;
      }
    });
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
      tokenNo: this.tokenNo,
      grievanceDescription: this.grievanceDescription,     
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
