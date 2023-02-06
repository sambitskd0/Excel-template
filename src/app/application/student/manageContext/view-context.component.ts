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
import { ContextMasterService } from '../services/context-master.service';

@Component({
  selector: 'app-view-context',
  templateUrl: './view-context.component.html',
  styleUrls: ['./view-context.component.css']
})
export class ViewContextComponent implements OnInit {

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
  paramObj: any = '';
  userId: any = "";
  profileId: any = "";
  serviceType: string = "Search";
  contextName:any = '';
  public fileUrl = environment.filePath;

  resultListData: any = [];
  dataSource = new MatTableDataSource(this.resultListData);

  constructor(private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router: Router,
    public contextMasterService: ContextMasterService,
    public customValidators:CustomValidators,
    public commonService: CommonserviceService) {
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
  }

  ngOnInit(): void {
    this.displayedColumns = [
      "slNo",
      "Context name",
      'Action',
    ];
    this.loadContextData(this.getSearchParams());
  }
  ngAfterViewInit() {
    console.log('Before' + this.dataSource.paginator);
    console.log(this.paginator);
    console.log(this.dataSource);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    console.log('After' + this.dataSource.paginator);
    console.log(this.paginator);

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
    this.loadContextData(this.getSearchParams());
  }

  loadContextData(...params: any) {
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
      contextName: this.contextName,
    };
    this.isLoading = true;
    this.contextMasterService.viewContext(this.paramObj).subscribe({
      next: (res: any) => {
        console.log(this.paginator);

        this.resultListData.length = previousSize; // set current size
        this.resultListData.push(...res?.data); // merge with existing data
        this.resultListData.length = res?.totalRecord; // update length
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
        this.isLoading = false;
        this.isNorecordFound = this.resultListData.length ? false : true;
        this.spinner.hide();
        console.log(this.dataSource.paginator);

      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }
  deleteContextData(encId: any) {

    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.alertHelper
      .deleteAlert("Are you sure to delete?", "", "question", "Yes, delete it!")
      .then((result) => {
        if (result.value) {
          this.spinner.show();
          this.isLoading = true;
          this.contextMasterService
            .deleteContext(encId,this.userId,this.profileId)
            .subscribe({
              next: (res: any) => {
                if (res?.success === true) {
                  this.alertHelper.successAlert(
                    "Deleted!",
                    " Context deleted successfully",
                    "success"
                  );
                  this.loadContextData(this.getSearchParams());
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
  downloadContextList() {
    this.spinner.show();
    this.paramObj.serviceType = "Download";
    this.contextMasterService.viewContext(this.paramObj).subscribe({
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

  onSearch() {
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    this.loadContextData(this.getSearchParams());
  }

  //for print
  printPage() {
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }

}
