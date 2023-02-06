import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { NgxSpinnerService } from "ngx-spinner";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { Constant } from 'src/app/shared/constants/constant';
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { SetApprovalAuthorityService } from "../../services/set-approval-authority.service";

@Component({
  selector: 'app-view-approval-authority',
  templateUrl: './view-approval-authority.component.html',
  styleUrls: ['./view-approval-authority.component.css']
})
export class ViewApprovalAuthorityComponent implements OnInit {
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
  "Leave Type",
  "Teacher Type",
  "Nature of Appointment",
  "Appointing Authority",
  "Appointment Type",
  "No. of days",
  "Document Required",
  "Remarks",
  "Approval Process",
  "action",
]; // define mat table columns

resultListData: any = [];
questionDetailsData!: any;
dataSource = new MatTableDataSource(this.resultListData);

//end
paramObj: any; 
serviceType: string = "Search";
leaveTypeId:any="";
teacherType:any="";

leaveTypeSelect:boolean = true; 
leaveTypeLoading:boolean = false; 
natureOfAppointmtSelect:boolean = true; 
natureOfAppointmtLoading:boolean = false; 
appointingAuthSelect:boolean = true; 
appointingAuthLoading:boolean = false; 
appointmentTypeSelect:boolean = true; 
appointmentTypeLoading:boolean = false; 


userId:any="";
 private apiURL = environment.leaveAPI;
 isNorecordFound: boolean = false;
 isLoading = false;
 previousSize: any = 0;
 pageIndex: any = 0;
  leaveEntitlements: any;
  lEntSearchform!: FormGroup;
  allErrorMessages: string[] = [];
  submitted = false;
  posts: any; 
  resData: any = "";
  isResData: boolean = false;
  isEmpty: boolean = false;
  leaveTypeChanged: boolean = false;
  lvtype: any = "";
  leaveTypeData: any ='';
  leaveTypeData2 : any ='';
  levelNumber : number = 0;
  officeName : string = '';
  vchDesignationName: string = '';

  levelNumber2 : number = 0;
  officeName2 : string = '';
  vchDesignationName2: string = '';

  levelNumber3 : number = 0;
  officeName3 : string = '';
  vchDesignationName3 : string = '';

  teacherAppointmentChanged: boolean = false;
  teacherAppointment :any ='';

  natureOfAppointmt : any="";
  appointingAuthority: boolean = false;
  appointingAuth: any = "";
  appointingAuth2 : any = '';

  appointType: boolean = false;
  appointmentType: any = "";
  appointmentType2: any = "";
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  approvalAuthority1: any = '';
  approvalAuthority2: any = '';
  approvalAuthority3: any = '';
  constructor(
    private formBuilder: FormBuilder,
    public commonService: CommonserviceService,
    public SetApprovalAuthorityService: SetApprovalAuthorityService,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private route:Router,
    private router:ActivatedRoute,

  ) {const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization  
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;}

  ngOnInit(): void {
    this.spinner.show();
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
      this.displayedColumns = [
        "slNo",
        "Office",
        "Approval Officer",
        "action",
      ]; 
    } else {
      this.displayedColumns = [
        "slNo",
        "Office",
        "Approval Officer",
        "Approval Process",
      ]; 
    }
    this.loadProfile(this.getSearchParams());
   

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
    this.loadProfile();
  }
  onSearch() {
    // reset queryParams
    this.pageIndex = 0;    
    this.offset = 0;
    this.previousSize = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    this.loadProfile();
  }

 
  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      leaveTypeId: this.leaveTypeId,
      teacherType:this.teacherType,
      natureOfAppointmt:this.natureOfAppointmt,
      appointingAuth:this.appointingAuth,
      appointmentType:this.appointmentType,
    };
  }
  loadProfile(...params: any){
    this.spinner.show();    
    const {
      previousSize,
      offset,
      pageSize,
      
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize, 
      userId: this.userId
    };
    this.isLoading = true;
    this.SetApprovalAuthorityService.viewApprovalAuthority(this.paramObj).subscribe((res: any) => {
      console.log(res);
      this.approvalAuthority1 = res.data[0];
      this.approvalAuthority2 = res.data[1];
      this.approvalAuthority3 = res.data[2];
      this.levelNumber        = this.approvalAuthority1.levelNumber;
      this.officeName         = this.approvalAuthority1.officeName;
      this.vchDesignationName = this.approvalAuthority1.vchDesignationName;
      this.levelNumber2        = this.approvalAuthority2.levelNumber;
      this.officeName2         = this.approvalAuthority2.officeName;
      this.vchDesignationName2 = this.approvalAuthority2.vchDesignationName;
      this.levelNumber3        = this.approvalAuthority3.levelNumber;
      this.officeName3        = this.approvalAuthority3.officeName;
      this.vchDesignationName3 = this.approvalAuthority3.vchDesignationName;
      this.spinner.hide();
    });
  }


}