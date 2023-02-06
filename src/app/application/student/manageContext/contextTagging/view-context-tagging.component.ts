import { Component, Input, OnInit, ViewChild } from "@angular/core";
import {  FormGroup } from "@angular/forms";
import {  Router } from "@angular/router";
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
import { ContextTaggingService } from "../../services/context-tagging.service";



@Component({
  selector: 'app-view-context-tagging',
  templateUrl: './view-context-tagging.component.html',
  styleUrls: ['./view-context-tagging.component.css']
})
export class ViewContextTaggingComponent implements OnInit {
  public fileUrl = environment.filePath;
  isLoading = false;
  pageIndex: any = 0;
  isNorecordFound: boolean = false;
  previousSize: any = 0;
  paramObj: any; 
  serviceType: string = "Search";
  userId: any;
  profileId: any;

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
  displayedColumns: string[] = [
   "slNo",
   "ContextName",
   "ClassName",
   "Action"
  ]; // define mat table columns
  tabs: any = [];  //For shwoing tabs
  resultListData: any = [];
  questionDetailsData!: any;
  contextChanged:boolean = false;
  contextsNameDatas: any = [];
  contextId:any = '';
  dataSource = new MatTableDataSource(this.resultListData);
  //end

  constructor(
    public commonserviceService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private Contexttaggingservice: ContextTaggingService,
    
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService
  ) {
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;
   }

  ngOnInit(): void {
    this.spinner.show();
    this.getContextList();
    this.loadIndicator(this.getSearchParams());
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
    this.loadIndicator(this.getSearchParams());
  }
  getContextList(){
    this.contextChanged = true;
    this.Contexttaggingservice
        .getContextList()
        .subscribe((res: any = []) => {
          this.contextsNameDatas = res.data;
          this.contextChanged = false;
        });
  }
  onSearch() {
    // reset queryParams
    this.pageIndex = 0;    
    this.offset = 0;
    this.previousSize = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    this.loadIndicator(this.getSearchParams());
  }
  loadIndicator(...params: any){
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
      contextId: this.contextId,
    };
    this.isLoading = true;
    this.Contexttaggingservice.viewContextTagging(this.paramObj).subscribe({
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
  deleteContextTagging(id: number) {
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.alertHelper
      .deleteAlert("Are you sure to delete?", "", "question", "Yes, delete it!")
      .then((result) => {
        if (result.value) {
          this.spinner.show();
          this.isLoading = true;
          this.Contexttaggingservice
            .deleteContextTagging(id, this.userId,this.profileId)
            .subscribe({
              next: (res: any) => {
                if (res?.success === true) {
                  this.alertHelper.successAlert(
                    "Deleted!",
                    "Contexttagging deleted Successfully",
                    "success"
                  );
                  this.loadIndicator(this.getSearchParams());
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
  downloadContextTaggingList()
  {
    this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.Contexttaggingservice.viewContextTagging(this.paramObj).subscribe({
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
  
  printPage()
  {
    let cloneTable 	= document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonserviceService.printPage(cloneTable, pageTitle);
  }

}
