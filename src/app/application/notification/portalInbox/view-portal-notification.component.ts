import { formatDate } from "@angular/common";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatTableExporterDirective } from "mat-table-exporter";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { environment } from "src/environments/environment";
import { PortalNotificationService } from "../services/portal-notification.service";

@Component({
  selector: "app-view-portal-notification",
  templateUrl: "./view-portal-notification.component.html",
  styleUrls: ["./view-portal-notification.component.css"],
})
export class ViewPortalNotificationComponent implements OnInit {
  @ViewChild("searchForm") searchForm!: NgForm;
  public userProfile = JSON.parse(
    sessionStorage.getItem("userProfile") || "{}"
  );
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
    "subject",
    "content",
    "document",
    "notificationBy",
    "notificationDate",
  ];

  paramObj: any;
  serviceType: string = "Search";
  viewNotifications: any = [];
  dataSource = new MatTableDataSource(this.viewNotifications);
  //end

  isLoading = false;
  pageIndex: any = 0;
  previousSize: any = 0;

  searchFromDate: any = "";
  searchToDate: any = "";
  notificationText: string = "";
  fromDate: any = "";
  toDate: any = "";
  fromDateStr: any = "";
  toDateStr: any = "";
  maxDate: any = Date;

  public show: boolean = true;
  public buttonName: any = "Show";

  constructor(
    private spinner: NgxSpinnerService,
    private portalNotificationService: PortalNotificationService,
    private alertHelper: AlertHelper,
    private commonFunctionHelper: CommonFunctionHelper,
    public commonService: CommonserviceService
  ) {
    this.maxDate = new Date();
    
  }

  ngOnInit(): void {
    this.viewNotificationData(this.getSearchParams());
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  toggle() {
    this.show = !this.show;
    if (this.show) this.buttonName = "Hide";
    else this.buttonName = "Show";
  }

  getSearchParams() {
    if (this.fromDate != "") {
      this.fromDateStr = this.commonFunctionHelper.formatDateHelper(
        this.fromDate
      );
    }
    if (this.toDate != "") {
      this.toDateStr = this.commonFunctionHelper.formatDateHelper(this.toDate);
    }

    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      fromDate: this.fromDateStr,
      toDate: this.toDateStr,
    };
  }

  viewNotificationData(...params: any) {
    this.spinner.show();

    const { previousSize, offset, pageSize, fromDate, toDate } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      userId: this.userProfile.userId,
      userType: this.userProfile.loginUserTypeId,
      serviceType: this.serviceType,
      fromDate: fromDate,
      toDate: toDate,
    };

    this.isLoading = true;

    this.portalNotificationService
      .getPortalNotifications(this.paramObj)
      .subscribe({
        next: (res: any) => {
          this.viewNotifications.length = previousSize; // set current size
          this.viewNotifications.push(...res?.data); // merge with existing data
          this.viewNotifications.length = res?.totalRecord; // update length
          this.dataSource.paginator = this.paginator; // update paginator
          this.dataSource._updateChangeSubscription(); // update table

          this.isLoading = false;
          this.spinner.hide();
          this.getHeaderNotifications(); // update notification in header
        },
        error: (error: any) => {
          this.isLoading = false;
          this.spinner.hide();
        },
      });
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
    this.viewNotificationData(this.getSearchParams());
  }

  showFullContent(notificationText: string) {
    this.notificationText = notificationText;
  }

  onSearch() {
    if (this.fromDate != "" && this.toDate != "") {
      if (
        formatDate(this.fromDate, "yyyy-MM-dd", "en_US") >
        formatDate(this.toDate, "yyyy-MM-dd", "en_US")
      ) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "From Date can not be greater than To Date."
        );
        return;
      }
    }

    this.offset = 0;
    this.previousSize = 0;
    this.pageIndex = 0;
    this.viewNotifications.splice(0, this.viewNotifications.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    this.viewNotificationData(this.getSearchParams());
  }

  downloadNotifications() {
    this.spinner.show();
    this.paramObj.serviceType = "Download";

    this.portalNotificationService
      .getPortalNotifications(this.paramObj)
      .subscribe({
        next: (res: any) => {
          let filepath = this.fileUrl + "/" + res.data.replace(".", "~");
          window.open(filepath);
          this.spinner.hide();
        },
        error: (error: any) => {
          this.spinner.hide();
        },
      });
  }

  printPage() {
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }
  getHeaderNotifications() {
    this.commonService.getHeaderNotifications().subscribe({
      next: (res: any) => {
        this.commonService.notificationCountObservable.next(res.unreadRecords);
      },
      error: (error: any) => {
        // this.spinner.hide();
      },
    });
  }
}
