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
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { environment } from 'src/environments/environment';
import { SubjectMasterService } from '../services/subject-master.service';


@Component({
  selector: 'app-view-subject',
  templateUrl: './view-subject.component.html',
  styleUrls: ['./view-subject.component.css']
})
export class ViewSubjectComponent implements OnInit {

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
  isLoading = false;
  isNorecordFound: boolean = false;
  pageIndex: any = 0;
  previousSize: any = 0;
  adminPrivilege: boolean = false;
  displayedColumns: string[] = []; 
  paramObj:any = '';
  userId: any = "";
  profileId: any = "";
  serviceType: string = "Search";
  public fileUrl = environment.filePath;
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  resultListData: any = [];
  subjectName:any = '';
  dataSource = new MatTableDataSource(this.resultListData);

  constructor(private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    public subjectMaster:SubjectMasterService, 
    public customValidators:CustomValidators,
    public commonService:CommonserviceService) 
    {
      const users = this.commonService.getUserProfile();
      this.userId = users?.userId;
     }

  ngOnInit(): void {
    this.displayedColumns = [
      "slNo",
      "Subject name",
      'Action',
    ];
    this.loadSubjectData(this.getSearchParams());
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
      this.loadSubjectData(this.getSearchParams());
    }

  loadSubjectData(...params: any){
    this.spinner.show();
    const {
      previousSize,
      offset,
      pageSize,
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      serviceType: this.serviceType,
      userId: this.userId,
      subjectName: this.subjectName,
    };
    this.isLoading = true;
    this.subjectMaster.viewSubject(this.paramObj).subscribe({
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
  deleteSubjectData(encId: any) {

    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
      this.alertHelper
      .deleteAlert("Are you sure to delete?", "", "question", "Yes, delete it!")
      .then((result) => {
        if (result.value) {
          this.spinner.show();
          this.isLoading = true;
          this.subjectMaster
            .deleteSubject(encId,this.userId,this.profileId)
            .subscribe({
              next: (res: any) => {
                if (res?.success === true) {
                  this.alertHelper.successAlert(
                    "Deleted!",
                    " Subject deleted successfully",
                    "success"
                  );
                  this.loadSubjectData(this.getSearchParams());
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

    // for csv
    downloadSubjectList() {
      this.spinner.show();
      this.paramObj.serviceType = "Download";
      this.subjectMaster.viewSubject(this.paramObj).subscribe({
        next: (res: any) => {
          let filepath = this.fileUrl + "/" + res?.data?.replace(".", "~");
          window.open(filepath);
          this.spinner.hide();
        },
        error: (error: any) => {
          this.spinner.hide();
        },
      });
    }
  
    //for print
    printPage() {
      let cloneTable = document.getElementById("viewTable")?.innerHTML;
      const pageTitle = document.querySelector(".pageName")?.innerHTML;
      this.commonService.printPage(cloneTable, pageTitle);
    }

    onSearch() {
      this.pageIndex = 0;
      this.previousSize = 0;
      this.offset = 0;
      this.resultListData.splice(0, this.resultListData.length); // empty current data
      this.dataSource.paginator = this.paginator; // update paginator
      this.loadSubjectData(this.getSearchParams());
    }



}
