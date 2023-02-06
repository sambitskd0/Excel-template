import { Component, Input, OnInit, ViewChild } from '@angular/core';
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
import { ManageFeedbackService } from '../services/manage-feedback.service';
import { ManageNotificationCategoryService } from '../services/manage-notification-category.service';

@Component({
  selector: 'app-view-notification-category',
  templateUrl: './view-notification-category.component.html',
  styleUrls: ['./view-notification-category.component.css']
})
export class ViewNotificationCategoryComponent implements OnInit {

  notificationCategorySearchForm!: FormGroup;
  // categoryName: any ="";
  notifyCatName: any = "";
  notifyCatDatas: any="";
  post: any;
  select_all = false;
  userId: any="";
  profileId: any="";
  isEmpty: boolean = false;
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();

  // ===============Material Table Variable and Decorators
  isLoading = false;
  isNorecordFound: boolean = false;
  pageIndex: any = 0;
  previousSize: any = 0;
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

  //end Material Table Variable and Decorators

  constructor(
    private formBuilder: FormBuilder,
    private manageNotificationCategoryService: ManageNotificationCategoryService,
    private alertHelper: AlertHelper,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    public customValidator: CustomValidators,
    private spinner: NgxSpinnerService,
    public commonService: CommonserviceService
  ) { 
    const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
  }

  ngOnInit(): void {
    this.spinner.show();
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
      this.displayedColumns = [
        "slNo",
        "notify_category_name",
        "created_on",
        "action",
      ]; 
    } else {
      this.displayedColumns = [
        "slNo",
        "notify_category_name",
        "created_on",
      ]; 
    }
    this.loadNotificationCategory(this.getSearchParams());
    this.initializeForm();
  }
   // ===========initialize Datasource after complete Component Load
   ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
    // ===========End Of initialize Datasource after complete Component Load

    // ===========initialize Form
  initializeForm() {
    this.notificationCategorySearchForm = this.formBuilder.group({
      notifyCatName: [this.notifyCatName],
    });
  }
    // ===========End Of initialize Form  
    // =============Delete Notification Category
   deleteNotificationCategory(id: number) {
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.alertHelper
      .deleteAlert("Are you sure to delete?", "", "question", "Yes, delete it!")
      .then((result) => {
        if (result.value) {
          this.spinner.show();
          this.isLoading = true;
          this.manageNotificationCategoryService
            .deleteNotificationCategory(id, this.userId,this.profileId)
            .subscribe({
              next: (res: any) => {
                if (res?.success === true) {
                  this.alertHelper.successAlert(
                    "Deleted!",
                    "Notification category deleted successfully",
                    "success"
                  );
                  this.loadNotificationCategory(this.getSearchParams());
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
        else{
          this.isLoading = false;
          this.spinner.hide();
        }
      });
    }
     // ============= End Of Delete Notification Category

    // ==============Get serch Parameters For Material Table
  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      notifyCatName: this.notificationCategorySearchForm?.get("notifyCatName")?.value,
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
    this.loadNotificationCategory(this.getSearchParams());
  }

  // =========For Filtering Data
  onSearch() {
    
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    this.loadNotificationCategory(this.getSearchParams());
  }

  //==============View Records Section
  loadNotificationCategory(...params: any) {
    this.spinner.show();
    const {
      previousSize,
      offset,
      pageSize,
      notifyCatName,
    } = params[0];

    const paramObj = {
      offset: offset,
      limit: pageSize,
      notifyCatName: notifyCatName,
    };
    this.isLoading = true;
    this.manageNotificationCategoryService.viewNotificationCategory(paramObj).subscribe({
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

}
