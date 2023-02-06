import { Component, Input, OnInit, ViewChild } from '@angular/core';
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
import { environment } from 'src/environments/environment';
import { ManageMdmAttendanceService } from '../services/manage-mdm-attendance.service';

@Component({
  selector: 'app-view-mdm-attendance',
  templateUrl: './view-mdm-attendance.component.html',
  styleUrls: ['./view-mdm-attendance.component.css']
})
export class ViewMdmAttendanceComponent implements OnInit {

  //global members
    public users = this.commonService.getUserProfile();
    public fileUrl = environment.filePath;

    schoolId = this.users?.school;
    schoolCategory = this.users?.schoolCategory;
     // ===============Material Table Variable and Decorators
     isLoading = false;
     isNorecordFound: boolean = false;
     pageIndex: any = 0;
     previousSize: any = 0;
     paramObj: any;
     serviceType: string = "Search";
     userId:any = "";

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
     displayedColumns: string[] = []; 
   
     resultListData: any = [];
     dataSource = new MatTableDataSource(this.resultListData);
     descFullText:string = ""; 
   
     //end Material Table Variable and Decorators
    
  constructor(
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    public manageMdmAttendanceService:ManageMdmAttendanceService, 
    public commonService:CommonserviceService
  ) {
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
   }

  ngOnInit(): void {
    this.displayedColumns = [
      "attendanceId",
      "schoolName",
      'academicYear',
      'attendanceDate',
      // 'schoolCategory',
      'class_group',
      'attendance',
    ];
    this.loadMdmAttendanceData(this.getSearchParams());
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
    this.loadMdmAttendanceData(this.getSearchParams());
  }
  loadMdmAttendanceData(...params: any){
    this.spinner.show();
    const {
      previousSize,
      offset,
      pageSize,
      assetType,
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      assetType: assetType,
      serviceType: this.serviceType, 
      userId: this.userId,
      schoolId: this.schoolId,
      schoolCategory: this.schoolCategory,
    };
    this.isLoading = true;
    this.manageMdmAttendanceService.viewMdmAttendance(this.paramObj).subscribe({
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

  downloadMdmAttendanceList()
  {
    this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.manageMdmAttendanceService.viewMdmAttendance(this.paramObj).subscribe({
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
