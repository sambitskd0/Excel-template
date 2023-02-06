import { formatDate } from '@angular/common';
import { Component, ErrorHandler, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { environment } from 'src/environments/environment';
import { CommitteeMeetingService } from '../services/committee-meeting.service';
import { CommitteeMemberService } from '../services/committee-member.service';

@Component({
  selector: 'app-view-committee-meeting',
  templateUrl: './view-committee-meeting.component.html',
  styleUrls: ['./view-committee-meeting.component.css']
})
export class ViewCommitteeMeetingComponent implements OnInit {
  public fileUrl = environment.filePath;
  config = new Constant();
  // maxDate: any = Date;
 
  viewMemberAttenSearchform!: FormGroup;
  public show:boolean = true;
  public buttonName:any       = 'Show';
  committeeTypeData: any      = "";
  memberTypeData: any         = "";
  committeeType:any           = "";
  fromDate: any               = "";
  toDate: any                 = "";
  fromDateStr: any                 = "";
 
  meetingAttendedMemberData: any  = "";
  meetingMemberData: any          = "";

  modalshow:boolean             = false;
  allLabel: string[]            = ["Committee type","",""];
  descFullText: string          = "";
  fileDownloadUrl: string       = "";

  academicYear: any = this.config.getAcademicCurrentYear();
  
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
  dataSource = new MatTableDataSource(this.resultListData);
  schoolId: any         = "";
  userId: any           = "";
  permissionDiv: boolean    = false;
  

  //end Material Table Variable and Decorators
  paramObj: any; 
  serviceType: string = "Search";
  plPrivilege:string="view"; //For menu privilege
  adminPrivilege: boolean = false;
  toDateStr: any="";
  searchfromDate: any="";
  searchtoDate: any="";
  maxDate: any = Date; 
  constructor(
    private commonFunctionHelper: CommonFunctionHelper,
    private spinner: NgxSpinnerService, 
    private committeeMemberService:CommitteeMemberService, 
    private alertHelper: AlertHelper,
    private formBuilder: FormBuilder,
    public commonserviceService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    public customValidators: CustomValidators,
    private committeeMeetingService:CommitteeMeetingService, 

  ) {const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization 
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
      this.displayedColumns = [
        "slNo",
        "meetingDate",
        "totalMemberAttended",
        "proceedingFile",
        "meetingDiscussion",
      ]; 
    } else {
      this.displayedColumns = [
        "slNo",
        "meetingDate",
        "totalMemberAttended",
        "proceedingFile",
        "meetingDiscussion",
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
      this.memberTypeData = data?.data?.MEMBER_TYPE;
    });
    
    if(userProfile.loginUserTypeId ==2){
      this.loadMemberData(this.getSearchParams());
    }
      // this.searchfromDate = new Date();
      // this.searchtoDate = new Date();
    this.initializationForm();
  }
  initializationForm(){
    this.viewMemberAttenSearchform = this.formBuilder.group({
      committeeType:[this.committeeType,[Validators.required]],
      searchfromDate:[this.searchfromDate],
      searchtoDate:[this.searchtoDate],
    })
  }
    toggle() {
    this.show = !this.show;
    if(this.show)  
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }
  // ==============Get serch Parameters For Material Table
  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      committeeType: this.viewMemberAttenSearchform?.get("committeeType")?.value,
      schoolId:this.schoolId,
      academicYear:this.academicYear,
      fromDate: this.commonFunctionHelper.formatDateHelper(new Date(this.viewMemberAttenSearchform?.controls['searchfromDate'].value)),
      toDate:  this.commonFunctionHelper.formatDateHelper(new Date(this.viewMemberAttenSearchform?.controls['searchtoDate'].value)),
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
    this.loadMemberData(this.getSearchParams());
  }

  //=================For Filteration
  attendMemberSearch(){
   let fromDate = this.viewMemberAttenSearchform?.get("searchfromDate")?.value;
   let toDate =  this.viewMemberAttenSearchform?.get("searchtoDate")?.value;
  if(fromDate != "" && toDate!= ""){
    
    if (formatDate(fromDate,'yyyy-MM-dd','en_US') > formatDate(toDate,'yyyy-MM-dd','en_US')){
      this.alertHelper.viewAlert(
        "error",
        "Invalid",
        "From date can not be greater than to date."
      ); 
      return;
    } 
  }
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    this.loadMemberData(this.getSearchParams());
   
  }
  loadMemberData(...params: any){
    this.spinner.show(); // ==== show spinner
    const {
      previousSize,
      offset,
      pageSize,
      committeeType,
      fromDate,
      toDate,
      schoolId,
      academicYear,
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      committeeType: committeeType,
      fromDate: fromDate,
      toDate: toDate,
      serviceType: this.serviceType, 
      userId: this.userId,
      schoolId:this.schoolId,
      acdemicYear:this.academicYear
    };
    this.isLoading = true;
    this.committeeMeetingService.viewMeetingMember(this.paramObj).subscribe({
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
  getMemberAttended(id:any){
    this.committeeMeetingService
      .getMemberAttended(id)
      .subscribe((data: any) => {
        this.meetingAttendedMemberData = data.data;
        this.modalshow = true;
        this.spinner.hide(); 
      });
  }
  // VALIDATION TO CHECK 
  /* fromDateCheck(fromDate:any,toDate:any)
  { 
    if((fromDate.value =="" || fromDate.value == null) && toDate.value != "")
    {
      this.alertHelper.successAlert("Provide From Date For Filteration","","error").then((res: any)=>{
        this.viewMemberAttenSearchform.patchValue({
          toDate:""
        });
        fromDate.focus();
      });  
    }
  } */
  downloadCommitteeMettingList()
  {
    this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.committeeMeetingService.viewMeetingMember(this.paramObj).subscribe({
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
    this.commonserviceService.printPage(cloneTable, pageTitle);
  }

  showDescription(descText: string){
    this.descFullText = descText;
  }

  downloadFile(downUrl: string){
    var str = downUrl;
    var newstr = str.replace('.','~'); 
    this.fileDownloadUrl= this.fileUrl+'/'+newstr; 
  }
}

