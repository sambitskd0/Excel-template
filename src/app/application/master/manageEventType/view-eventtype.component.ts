import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {  Router } from "@angular/router";
import { ManageEventTypeService } from '../services/manage-event-type.service';
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


@Component({
  selector: 'app-view-eventtype',
  templateUrl: './view-eventtype.component.html',
  styleUrls: ['./view-eventtype.component.css']
})
export class ViewEventtypeComponent implements OnInit {
  public fileUrl = environment.filePath;
 EventTypeSearchForm!: FormGroup;
  eventType: any ="";
  description: any ="";
  eventTypeData: any;
  post: any;
  resData:any;
  descFullText:string = "";
  select_all = false;
  isEmpty: boolean = false;
  isLoading = false;
  userId: any="";
  profileId: any="";
  previousSize: any = 0;
  pageIndex: any = 0;
  isNorecordFound: boolean = false;
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
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
  displayedColumns: string[] = []; // define mat table columns

  resultListData: any = [];
  questionDetailsData!: any;
  dataSource = new MatTableDataSource(this.resultListData);
  
  //end
  paramObj: any; 
  serviceType: string = "Search";
  tabs: any = [];  //For shwoing tabs
  constructor(private manageEventtypeservice:ManageEventTypeService,
    private formBuilder: FormBuilder,
    public commonserviceService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService)
     
    { const pageUrl:any = this.router.url;  
      this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
      this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
      this.tabs = this.privilegeHelper.PrimaryLinkTabNames(pageUrl);  //For shwoing tabs 
      const users = this.commonserviceService.getUserProfile();
      this.userId = users?.userId;}

  ngOnInit(): void {
    this.spinner.show();
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
      this.displayedColumns = [
        "slNo",
        "EventType",
        "Description",
        "action",
      ]; 
    } else {
      this.displayedColumns = [
        "slNo",
        "EventType",
        "Description",
      ]; 
    }
    this.loadEventType(this.getSearchParams());
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
  this.loadEventType(this.getSearchParams());
}
onSearch() {
  // reset queryParams
  this.pageIndex = 0;    
  this.offset = 0;
  this.previousSize = 0;
  this.resultListData.splice(0, this.resultListData.length); // empty current data
  this.dataSource.paginator = this.paginator; // update paginator
  this.loadEventType(this.getSearchParams());
}

  loadEventType(...params: any)
  {
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
      userId: this.userId
    };
    this.isLoading = true;
    this.manageEventtypeservice.viewEventType(this.paramObj).subscribe({
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

  showDescription(descText: string){
    this.descFullText = descText;
  }
deleteEventType(id: number) {
  const users = this.commonserviceService.getUserProfile();
  this.userId = users?.userId;
  this.profileId = users?.profileId;
  this.alertHelper
    .deleteAlert("Are you sure to delete?", "", "question", "Yes, delete it!")
    .then((result) => {
      if (result.value) {
        this.spinner.show();
        this.isLoading = true;
        this.manageEventtypeservice
          .deleteEventType(id, this.userId,this.profileId)
          .subscribe({
            next: (res: any) => {
              if (res?.success === true) {
                this.alertHelper.successAlert(
                  "Deleted!",
                  "Eventtype deleted Successfully",
                  "success"
                );
                this.loadEventType(this.getSearchParams());
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
  downloadEventTypeList()
  {
    this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.manageEventtypeservice.viewEventType(this.paramObj).subscribe({
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
}



