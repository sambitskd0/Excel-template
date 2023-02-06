import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { ManageClusterService } from "../services/manage-cluster.service";
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
import { CustomValidators } from "src/app/shared/validations/custom-validators";
@Component({
  selector: "app-view-cluster",
  templateUrl: "./view-cluster.component.html",
  styleUrls: ["./view-cluster.component.css"],
})
export class ViewClusterComponent implements OnInit {
  public fileUrl = environment.filePath;
  clusterSearchform!: FormGroup;
  clusterDatas: any;
  post: any;
  distdata: any;
  allDistrict: any;
  showSpinnerBlock: boolean = false;
  blockData: any = [];
  districtId: any = "";
  clusterName: any="";
  blockId: any = "";
  select_all = false;
  isEmpty: boolean = false;
  filterChanged: boolean = false;
  userId: any;
  profileId: any;
  paramObj: any; 
  serviceType: string = "Search";
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
  displayedColumns: string[] = []; //Displayed Columns
  resultListData: any = [];
  dataSource = new MatTableDataSource(this.resultListData);
  //end Material Table Variable and Decorators

  constructor(
    private formBuilder: FormBuilder,
    private commonserviceService: CommonserviceService,
    public customValidators:CustomValidators,
    private manageClusterService: ManageClusterService,
    private alertHelper: AlertHelper,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private el:ElementRef,
    private spinner: NgxSpinnerService
  ) {const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId; }

  ngOnInit(): void {
    this.spinner.show(); // ==== show spinner
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
      this.displayedColumns = [
        "slNo",
        "district",
        "block_Name",
        "cluster_Name",
        "cluster_Code",
        "action",
      ]; 
    } else {
      this.displayedColumns = [
        "slNo",
        "district",
        "block_Name",
        "cluster_Name",
        "cluster_Code",
      ]; 
    }
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.commonserviceService.getAllDistrict().subscribe((data: []) => {
      this.distdata = data;
      this.allDistrict = this.distdata.data;
    });
    this.initializeForm();
    this.el.nativeElement.querySelector("[formControlName=districtId]").focus();
    this.loadCluster(this.getSearchParams());
  }
  // ===========initialize Datasource after complete Component Load
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // =============initializeForm Start
  initializeForm() {
    this.clusterSearchform = this.formBuilder.group({
      districtId: [this.districtId],
      blockId: [this.blockId],
      clusterName: [this.clusterName,[ Validators.required,
        Validators.pattern("^[a-zA-Z -']+"),
        Validators.maxLength(40),
        Validators.minLength(3),
        this.customValidators.firstCharValidatorRF]],
    });
  }

   // ==============Get serch Parameters For Material Table
   getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      districtId: this.clusterSearchform?.get("districtId")?.value,
      blockId: this.clusterSearchform?.get("blockId")?.value,
      clusterName: this.clusterSearchform?.get("clusterName")?.value,
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
    this.loadCluster(this.getSearchParams());
  }

  //=================For Filteration
  onSearch() {
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    this.loadCluster(this.getSearchParams());
  }

  loadCluster(...params: any) {
    this.spinner.show(); // ==== show spinner
    const {
      previousSize,
      offset,
      pageSize,
      districtId,
      blockId,
      clusterName,
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      districtId: districtId,
      blockId: blockId,
      clusterName: clusterName,
      serviceType: this.serviceType, 
      userId: this.userId
    };
    this.isLoading = true;
    this.manageClusterService.viewCluster(this.paramObj).subscribe({
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
  getBlock(id: any) {
    this.filterChanged = true;
    this.showSpinnerBlock = true;
    const districtId = id;
    
    this.blockData = [];
    this.clusterSearchform.patchValue({
      blockId:''
    });
    if (districtId !== "") {
      this.commonserviceService
        .getBlockByDistrictid(districtId)
        .subscribe((res) => {
          let data: any = res;
          for (let key of Object.keys(data["data"])) {
            this.blockData.push(data["data"][key]);
          }
          this.showSpinnerBlock = false;
          this.filterChanged = false;
        });
    } else {
      this.clusterSearchform = this.formBuilder.group({
        districtId: [""],
        blockId: [""],
        clusterName: [""],
      });
      this.filterChanged = false;
    }
  }

  deleteCluster(id: number) {

   
    this.alertHelper.deleteAlert(
      "Do you want to delete this record ?",
      "",
      "question",
      "Yes, delete it!"
    ).then((result) => {
      this.spinner.show();
      if (result.value) {
        this.spinner.show();
        this.isLoading = true;
        this.manageClusterService
          .deleteCluster(id,this.userId,this.profileId)
          .subscribe({
            next: (res: any) => {
              if (res) {
                this.alertHelper.successAlert(
                  "Deleted!",
                  "Selected cluster record deleted",
                  "success"
                );
                this.initializeForm();
                this.loadCluster(this.getSearchParams());
              
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
    })
  }
  downloadDistrictList()
  {
    this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.manageClusterService.viewCluster(this.paramObj).subscribe({
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

