import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {  Router } from "@angular/router";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { NgxSpinnerService } from "ngx-spinner";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { ManageIncentiveConfigurationService } from "../services/manage-incentive-configuration.service";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { environment } from "src/environments/environment";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";

@Component({
  selector: 'app-view-incentive-configuration',
  templateUrl: './view-incentive-configuration.component.html',
  styleUrls: ['./view-incentive-configuration.component.css']
})
export class ViewIncentiveConfigurationComponent implements OnInit {
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
  adminPrivilege: boolean = false;
  displayedColumns: string[] = [
    "slNo",
    "Incentive Type",
    "Class",
    "Gender",
    "Caste",
    // "Age",
    "Belongs to BPL",
    "Type of disability",
    "action",
  ]; // define mat table columns

  resultListData: any = [];
  questionDetailsData!: any;
  dataSource = new MatTableDataSource(this.resultListData);
  //end
  paramObj: any; 
  serviceType: string = "Search";
  isNorecordFound: boolean = false;
  isLoading = false;
  previousSize: any = 0;
  pageIndex: any = 0;
  incentiveNameData:any = "";
  viewIncentiveConfigMaster!: FormGroup;
  incentiveDatas: any;
  incentiveConfigDataList: any;
  incentiveId: any="";
  select_all = false;
  isEmpty: boolean = false;
  userId:any="";

  incentiveConfigSelect:boolean = true;
  incentiveConfigLoading:boolean = false;
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  profileId:any = '';
  
   
  constructor( private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private spinner: NgxSpinnerService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    public manageIncentiveConfigurationService: ManageIncentiveConfigurationService,
    public commonService: CommonserviceService,
   private formBuilder: FormBuilder
    ) {const pageUrl:any = this.router.url;  
      this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
      this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
      const users = this.commonService.getUserProfile();
      this.userId = users?.userId; 
      this.profileId = users?.profileId; 
    }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
      this.displayedColumns = [
        "slNo",
        "Incentive Type",
        "Class",
        "Gender",
        "Caste",
        // "Age",
        "Belongs to BPL",
        "Type of disability",
        "action",
      ]; 
    } else {
      this.displayedColumns = [
        "slNo",
        "Incentive Type",
        "Class",
        "Gender",
        "Caste",
        // "Age",
        "Belongs to BPL",
        "Type of disability",
      ]; 
    }
    this.viewIncentiveConfigMaster = this.formBuilder.group({
      incentiveId: [this.incentiveId],
    });
    this.manageIncentiveConfigurationService.getIncentiveName().subscribe((res: any) => {
      this.incentiveNameData = res.data;
    });
   this.loadIncentiveConfigDatas(this.getSearchParams());
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
      incentiveId: this.incentiveId,
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
    this.loadIncentiveConfigDatas(this.getSearchParams());
  }
  onSearch() {
    // reset queryParams
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.previousSize = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    this.loadIncentiveConfigDatas(this.getSearchParams());
  }

  loadIncentiveConfigDatas(...params: any){
    this.spinner.show();
    const {
      previousSize,
      offset,
      pageSize,
      incentiveId,
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      incentiveId:incentiveId,
      serviceType: this.serviceType, 
      userId: this.userId
     
    };
    this.isLoading = true;
    this.manageIncentiveConfigurationService.viewIncentiveConfig(this.paramObj).subscribe({
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
  filterIncentiveConfigName(){

  }

  deleteIncentiveConfig(id: number) {
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.alertHelper
      .deleteAlert("Do you want to delete the selected record ?", "", "question", "Yes, delete it!")
      .then((result) => {
        if (result.value) {
          this.spinner.show();
          this.isLoading = true;
          this.manageIncentiveConfigurationService
            .deleteIncentiveConfigMaster(id, this.userId, this.profileId)
            .subscribe({
              next: (res: any) => {
                if (res?.success === true) {
                  this.alertHelper.successAlert(
                    "Deleted!",
                    "Selected record deleted successfully",
                    "success"
                  );
                  this.loadIncentiveConfigDatas(this.getSearchParams());
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
          this.spinner.hide();
        }
      });
  }
  downloadIncentiveCfgList()
  {
    this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.manageIncentiveConfigurationService.viewIncentiveConfig(this.paramObj).subscribe({
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
