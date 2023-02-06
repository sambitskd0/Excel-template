import { Component, ErrorHandler, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { environment } from 'src/environments/environment';
import { CommitteeBankDetailsService } from '../services/committee-bank-details.service';
import { CommitteeMemberService } from '../services/committee-member.service';
import { CommonFunctionHelper } from 'src/app/core/helpers/common-function-helper';

@Component({
  selector: 'app-view-committee-bank-details',
  templateUrl: './view-committee-bank-details.component.html',
  styleUrls: ['./view-committee-bank-details.component.css']
})
export class ViewCommitteeBankDetailsComponent implements OnInit {
  public fileUrl = environment.filePath;
  viewCommitteeBankDetails!:FormGroup;
  maxDate: any = Date;
  public show:boolean             = true;
  public permissionDiv:boolean    = false;
  isInitAdmin: boolean            = false;
  
  schoolId: any                   = "";
  userId: any                     = "";
  
  public buttonName:any           = 'Show';
  committeeTypeData: any          = "";
  committeeType:any               = ""

  // ===============Material Table Variable and Decorators
  isLoading                 = false;
  isNorecordFound: boolean  = false;
  pageIndex: any            = 0;
  previousSize: any         = 0;
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
  displayedColumns: string[] = []; // end define mat table columns

  resultListData: any = [];
  maxDateForEdit:any ="";
  dataSource = new MatTableDataSource(this.resultListData);
 

  //end Material Table Variable and Decorators
  paramObj: any; 
  serviceType: string = "Search";
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  constructor(
    private spinner: NgxSpinnerService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private committeeMemberService: CommitteeMemberService,
    private committeeBankDetailsService: CommitteeBankDetailsService,
    private alertHelper: AlertHelper, 
    private formBuilder: FormBuilder,
    public commonserviceService: CommonserviceService,
    public customValidators: CustomValidators,
    private commonFunctionHelper: CommonFunctionHelper,
    private errorHandler: ErrorHandler) {
      const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization

    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;
    this.maxDate = new Date(); }

  ngOnInit(): void {
    this.spinner.show();
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
      this.maxDateForEdit =  this.commonFunctionHelper.formatDateHelper(this.maxDate);
      this.displayedColumns = [
        "slNo",
        "Committee_Type",
        "Date_Of_Reconstitution",
        "Date_Of_Expire",
        "Account_Holder_Name",
        "Bank_Name",
        "Account_No",
        "IFSC_Code",
        "Branch_Name",
        "action",
      ]; 
    } else {
      this.displayedColumns = [
        "slNo",
        "Committee_Type",
        "Date_Of_Reconstitution",
        "Date_Of_Expire",
        "Account_Holder_Name",
        "Bank_Name",
        "Account_No",
        "IFSC_Code",
        "Branch_Name",
        "action",
      ]; 
    }
    const userProfile = this.commonserviceService.getUserProfile();
    this.schoolId = userProfile?.school;
    this.userId = userProfile?.userId;

    if (userProfile.loginUserTypeId != 3) {
      this.permissionDiv = true;
    } else {
      this.permissionDiv = false;
    }

    this.commonserviceService.getCommonAnnexture(["COMMITTEE_TYPE", "MEMBER_TYPE"]).subscribe((data: any = []) => {
      this.committeeTypeData = data?.data?.COMMITTEE_TYPE;
    });
    
    if(userProfile.loginUserTypeId ==2){
      this.loadCommitteeBankDtlData(this.getSearchParams());
    }else{
      this.spinner.hide();
    }
  }
  // ===========initialize Datasource after complete Component Load
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

   // ==============Get serch Parameters For Material Table
   getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      schoolId: this.schoolId,
      committeeType: this.committeeType,
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
    this.loadCommitteeBankDtlData(this.getSearchParams());
  }

  //=================For Filteration
  onSearch() {
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    
    if (this.validateForm() === true) {
      this.spinner.show();
      this.loadCommitteeBankDtlData(this.getSearchParams());
    }
    else{
      this.isNorecordFound= true;
    }

  }
  // =============initializeForm Start
 /*  initializeForm() {
    this.viewCommitteeBankDetails = this.formBuilder.group({
      committeeType: [this.committeeType],
    
    });
  } */
  loadCommitteeBankDtlData(...params: any){
    this.spinner.show();
    const {
      previousSize,
      offset,
      pageSize,
      committeeType,
      
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      committeeType: committeeType,
      serviceType: this.serviceType, 
      userId: this.userId,
      schoolId: this.schoolId,
    };
    this.isLoading = true;
    this.committeeBankDetailsService.viewCommitteeBankDetails(this.paramObj).subscribe({
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
  downloadCommitteeBankingList()
  {
    this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.committeeBankDetailsService.viewCommitteeBankDetails(this.paramObj).subscribe({
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

  toggle() {
    this.show = !this.show;
    if(this.show)  
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }
  validateForm() :Boolean{
    
    if (this.committeeType === "") {
      this.alertHelper.successAlert(
        "",
        "Please select Committee Type.",
        "info"
      );
      return false;
    }
    return true;
  }
  printPage() {
    let cloneTable 	= document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonserviceService.printPage(cloneTable, pageTitle);
  }

}
