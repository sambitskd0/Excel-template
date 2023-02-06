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
import { ManageLeaveTypeService } from "../services/manage-leave-type.service";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { ManageLeaveEntitlementService } from "../services/manage-leave-entitlement.service";
import { RegistrationService } from "../../teacher/services/registration.service";



@Component({
  selector: 'app-view-leave-entitlement',
  templateUrl: './view-leave-entitlement.component.html',
  styleUrls: ['./view-leave-entitlement.component.css']
})
export class ViewLeaveEntitlementComponent implements OnInit {
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
profileId:any="";
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
  constructor(
    private formBuilder: FormBuilder,
    public commonService: CommonserviceService,
    public ManageLeaveTypeService: ManageLeaveTypeService,
    public LeaveEntitlementService: ManageLeaveEntitlementService,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private route:Router,
    private router:ActivatedRoute,
    private registrationService: RegistrationService,

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
      ]; 
    } else {
      this.displayedColumns = [
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
      ]; 
    } 
    this.getLeaveType();
    this.getAppointType();
    this.getAppointingAuthority();
    this.getTeacherAppointment();
    this.lEntSearchform = this.formBuilder.group({
      leaveTypeId: "0", teacherType : "0", natureOfAppointmt : "0", appointingAuth : "0", appointmentType : "0"
    });
    this.loadProfile(this.getSearchParams());
   

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
    this.loadProfile(this.getSearchParams());
  }
  onSearch() {
    // reset queryParams
    this.pageIndex = 0;    
    this.offset = 0;
    this.previousSize = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    this.loadProfile(this.getSearchParams());
  }

 

  loadProfile(...params: any){
    this.spinner.show();    
    const {
      previousSize,
      offset,
      pageSize,
      leaveTypeId,
      teacherType,
      natureOfAppointmt,
      appointingAuth,
      appointmentType,
      
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      leaveTypeId:leaveTypeId,
      teacherType:teacherType,
      natureOfAppointmt:natureOfAppointmt,
      appointingAuth:appointingAuth,
      appointmentType:appointmentType,
      serviceType: this.serviceType, 
      userId: this.userId
    };
    this.isLoading = true;
    this.LeaveEntitlementService
    .viewLeaveEntitlement(this.paramObj).subscribe({
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


  viewLvApprovalProcess(encId: string){
    this.spinner.show();
    this.LeaveEntitlementService.viewLvApprovalProcess(encId).subscribe((res: any) => {
      this.leaveTypeData = res.data[0];
      this.leaveTypeData2 = res.data[1];
      this.levelNumber        = this.leaveTypeData.levelNumber;
      this.officeName         = this.leaveTypeData.officeName;
      this.vchDesignationName = this.leaveTypeData.vchDesignationName;
      this.levelNumber2        = this.leaveTypeData2.levelNumber;
      this.officeName2         = this.leaveTypeData2.officeName;
      this.vchDesignationName2 = this.leaveTypeData2.vchDesignationName;
      // this.initializeForm();
      this.spinner.hide();
    });
  }

  getAppointType() {
    this.appointType = true;
    this.appointmentType2 = [];
    this.registrationService.getAppointType().subscribe((res: any) => {
      let data: any = res;
      for (let key of Object.keys(data["data"])) {
        this.appointmentType2.push(data["data"][key]);
      }
      this.appointType = false;
    });
  }

  getAppointingAuthority() {
    this.appointingAuthority = true;
    this.appointingAuth2 = [];
    this.registrationService.getAppointingAuthority().subscribe((res: any) => {
      let data: any = res;
      for (let key of Object.keys(data["data"])) {
        this.appointingAuth2.push(data["data"][key]);
      }
      this.appointingAuthority = false;
    });
  }

  getTeacherAppointment() {
    this.teacherAppointmentChanged = true;
    this.teacherAppointment = [];
    this.registrationService.getTeacherAppointment().subscribe((res: any) => {
      let data: any = res;
      for (let key of Object.keys(data["data"])) {
        this.teacherAppointment.push(data["data"][key]);
      }
      this.teacherAppointmentChanged = false;
    });
  }


  getLeaveType(){
    this.leaveTypeChanged = true;
    this.lvtype = [];
    this.ManageLeaveTypeService.getLeaveType().subscribe((res: any) => {
      let data: any = res;
      for (let key of Object.keys(data["data"])) {
        this.lvtype.push(data["data"][key]);
      }
      this.leaveTypeChanged = false;
    }); 
  }


  deleteLeaveEntitlement(id: number) {
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.alertHelper
      .deleteAlert("Do you want to delete the selected record ?", "", "question", "Yes, delete it!")
      .then((result) => {
        if (result.value) {
          this.spinner.show();
          this.isLoading = true;
          this.LeaveEntitlementService.deleteLeaveEntitlement(id, this.userId,this.profileId)
            .subscribe({
              next: (res: any) => {
                if (res?.success === true) {
                  this.alertHelper.successAlert(
                    "Deleted!",
                    "Selected record deleted successfully ",
                    "success"
                  );
                  this.loadProfile(this.getSearchParams());
                } else {
                  this.alertHelper.viewAlert("info", res?.msg, "");
                }
                this.isLoading = false;
                this.spinner.hide();
              },
              error: (error: any) => {
                this.isLoading = false;
                this.spinner.hide();
              },
            });
        }
      });

}
downloadLeaveEntitlementList()
{
this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.LeaveEntitlementService
    .viewLeaveEntitlement(this.paramObj).subscribe({
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
