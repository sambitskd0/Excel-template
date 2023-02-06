import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { ManageBlockService } from "../services/manage-block.service";
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from "src/environments/environment";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { Router } from "@angular/router";

@Component({
  selector: "app-view-block",
  templateUrl: "./view-block.component.html",
  styleUrls: ["./view-block.component.css"],
})
export class ViewBlockComponent implements OnInit {

  public fileUrl = environment.filePath;
  blockSearchform!: FormGroup;
  blocks: any;
  paramObj: any; 
  serviceType: string = "Search";
  distdata: any;
  allDistrict: any;
  isEmpty: boolean = false;
  districtId: any = "";
  blockName: any = "";
  blockCode: any = "";
  resData: any = "";
  userId: any;
  profileId: any;
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
  displayedColumns: string[] = []; //DisplayedColumns
  resultListData: any = [];
  dataSource = new MatTableDataSource(this.resultListData);
  descFullText: string = "";

  //end Material Table Variable and Decorators

  constructor(
    private formBuilder: FormBuilder,
    public commonserviceService: CommonserviceService,
    public manageBlockService: ManageBlockService,
    private alertHelper: AlertHelper,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private spinner: NgxSpinnerService,
    private el:ElementRef,


  ) { const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
     const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;}

  ngOnInit(): void {
    this.spinner.show();
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
      this.displayedColumns = [
        "slNo",
        "District",
        'Block_Name',
        'Block_Code',
        "action",
      ]; 
    } else {
      this.displayedColumns = [
        "slNo",
        "District",
        'Block_Name',
        'Block_Code',
      ]; 
    }

    this.initializeForm();
    this.el.nativeElement.querySelector("[formControlName=districtName]").focus();
    this.commonserviceService.getAllDistrict().subscribe((data: []) => {
      this.distdata = data;
      this.allDistrict = this.distdata.data;
    });
    this.loadBlock(this.getSearchParams());
  }

  initializeForm() {
    this.blockSearchform = this.formBuilder.group({
      districtName: "",
    });
  }
  // ===========initialize Datasource after complete Component Load
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  // ==============Get serch Parameters For Material Table
  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      districtName: this.blockSearchform?.get("districtName")?.value,
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
    this.loadBlock(this.getSearchParams());
  }
  // =========For Filtering Data
  filterBydistrict() {
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    this.loadBlock(this.getSearchParams());
  }

  loadBlock(...params: any) {
    const {
      previousSize,
      offset,
      pageSize,
      districtName,
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      districtId: districtName,
      serviceType: this.serviceType, 
      userId: this.userId
     
    };
    this.isLoading = true;
    this.manageBlockService.getAllBlock(this.paramObj).subscribe({
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

  deleteBlock(id: number) {

    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
      this.alertHelper
      .deleteAlert("Do you want to delete this record ?", "", "question", "Yes, delete it!")
      .then((result) => {
        if (result.value) {
          this.spinner.show();
          this.isLoading = true;
          this.manageBlockService
            .deleteBlock(id, this.userId,this.profileId)
            .subscribe({
              next: (res: any) => {
                if (res?.success === true) {
                  this.alertHelper.successAlert(
                    "Deleted!",
                    "Selected block record deleted",
                    "success"
                  );
                  this.loadBlock(this.getSearchParams());
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
  downloadBlockList()
  {
    this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.manageBlockService.getAllBlock(this.paramObj).subscribe({
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

