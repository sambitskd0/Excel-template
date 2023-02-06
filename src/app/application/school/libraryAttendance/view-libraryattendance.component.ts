import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {  Router } from "@angular/router";
import { LibraryattendanceService } from '../services/libraryattendance.service';
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { NgxSpinnerService } from "ngx-spinner";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { environment } from "src/environments/environment";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";

@Component({
  selector: 'app-view-libraryattendance',
  templateUrl: './view-libraryattendance.component.html',
  styleUrls: ['./view-libraryattendance.component.css']
})
export class ViewLibraryattendanceComponent implements OnInit {
  public fileUrl = environment.filePath;
  libraryForm!: FormGroup;
  public show:boolean = true;
  public buttonName:any = 'Show';
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  previousSize: any = 0;
  pageIndex: any = 0;
  isNorecordFound: boolean = false;
  isLoading = false;
  userId: any="";
  schoolId: any="";
  paramObj: any; 
  serviceType: string = "Search";
  userProfile:any=[];


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
   adminPrivilege: boolean = false;
   displayedColumns: string[] = 
   [
    "slNo",
    "Attendance Date",
    "Number of Teacher Who Visited The Library",
    "Number of Teacher Who Returned The Book",
    "Number of Teacher Who Issued The Book",
    "Number of Student Who Visited The Library",
    "Number of Student Who Returned The Book",
    "Number of Student Who Issued The Book",
    "Specify the reason why the library is closed"
    ]; // define mat table columns
 
   resultListData: any = [];
   questionDetailsData!: any;
   dataSource = new MatTableDataSource(this.resultListData);
   maxDate: any = Date;
   //end
  constructor(private libraryattendanceservice:LibraryattendanceService,
    private formBuilder: FormBuilder,
    public commonserviceService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private commonFunctionHelper: CommonFunctionHelper) 
    { 
      this.maxDate = new Date();
      const pageUrl:any = this.router.url;  
      this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
      this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
      const users = this.commonserviceService.getUserProfile();
      this.userId = users?.userId;
      this.schoolId = users?.school;
    }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    this.loadLibraryAttendance(this.getSearchParams());
    this.initializeForm();
  }

  initializeForm()
  {
    this.libraryForm = this.formBuilder.group({  
      libraryFromDate:['',],  
      libraryToDate:['',],  
      sessionValue:[this.userProfile],
    }); 
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
      libraryFromDate: (this.libraryForm?.get("libraryFromDate")?.value) ? this.commonFunctionHelper.formatDateHelper(this.libraryForm?.get("libraryFromDate")?.value):this.libraryForm?.get("libraryFromDate")?.value,
      libraryToDate: (this.libraryForm?.get("libraryToDate")?.value) ? this.commonFunctionHelper.formatDateHelper(this.libraryForm?.get("libraryToDate")?.value):this.libraryForm?.get("libraryToDate")?.value,
      schoolId: this.schoolId,
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
    this.loadLibraryAttendance(this.getSearchParams());
  }
  onSearch() {
    // reset queryParams
    this.pageIndex = 0;    
    this.offset = 0;
    this.previousSize = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    this.loadLibraryAttendance(this.getSearchParams());
  }
  
    loadLibraryAttendance(...params: any)
    {
      this.spinner.show();
      const {
        previousSize,
        offset,
        pageSize,
        schoolId,
        libraryFromDate,
        libraryToDate,
      } = params[0];
  
      this.paramObj = {
        offset: offset,
        limit: pageSize,
        schoolId:schoolId,
        libraryFromDate: libraryFromDate,
        libraryToDate: libraryToDate,
        serviceType: this.serviceType, 
        userId: this.userId
      };
      this.isLoading = true;
      this.libraryattendanceservice.viewLibraryAttendance(this.paramObj).subscribe({
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
    downloadLibraryAttendanceList()
  {
    this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.libraryattendanceservice.viewLibraryAttendance(this.paramObj).subscribe({
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

  toggle() {
    this.show = !this.show;
    if(this.show)  
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }

}
