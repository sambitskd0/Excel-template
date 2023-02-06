import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageAssetCategoryService } from '../services/manage-asset-category.service';
import { Router } from '@angular/router';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { Constant } from 'src/app/shared/constants/constant';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-asset-category',
  templateUrl: './view-asset-category.component.html',
  styleUrls: ['./view-asset-category.component.css']
})
export class ViewAssetCategoryComponent implements OnInit {
  public fileUrl = environment.filePath;
  assetSearchForm!: FormGroup;
  assetType: any = "";
  assetName: string = "";
  assetDescription: any = "";
  assetDatas: any;
  post: any;
  anexType: any;
  anextureType: any;
  annexData: any;
  select_all = false;
  isEmpty: boolean = false;

  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();
  tabs: any = [];  //For shwoing tabs
  userId: any;
  profileId: any;
  descFullText:string = ""; 

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
  displayedColumns: string[] = [
   
  ]; 

  resultListData: any = [];
  dataSource = new MatTableDataSource(this.resultListData);

  //end Material Table Variable and Decorators
  paramObj: any; 
  serviceType: string = "Search";
  constructor(
    private formBuilder: FormBuilder,
    private manageAssetCategoryService: ManageAssetCategoryService,
    private alertHelper: AlertHelper,
    public customValidator: CustomValidators,
    public commonserviceService: CommonserviceService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege 
  ) {
    const pageUrl: any = this.router.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
    this.tabs = this.privilegeHelper.PrimaryLinkTabNames(pageUrl);  //For shwoing tabs      
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;      
  }

  ngOnInit(): void {
    this.spinner.show();
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
      this.displayedColumns = [
        "slNo",
        "asset_Type",
        "asset_Name",
        "asset_Code",
        "asset_description",
        "action",
      ]; 
    } else {
      this.displayedColumns = [
        "slNo",
        "asset_Type",
        "asset_Name",
        "asset_Code",
        "asset_description",
      ]; 
    }
    this.getAssetType();
    this.initializeForm();
    this.loadAsset(this.getSearchParams());
  }
  // ===========initialize Datasource after complete Component Load
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  // =============For get AssetType
  getAssetType() {
    this.anexType = "ASSET_TYPE";
    this.commonserviceService
      .getAnextureType(this.anexType)
      .subscribe((data: any = []) => {
        this.annexData = data;
        this.anextureType = this.annexData.data;
      });
  }
  // =============initializeForm Start
  initializeForm() {
    this.assetSearchForm = this.formBuilder.group({
      assetType: [this.assetType,[Validators.pattern(/^[0-9]+$/)]],
      assetName: [this.assetName,[Validators.pattern(/^[a-zA-Z ]+$/)]],
      assetDescription: [this.assetDescription],
    });
  }

  // ==============Get serch Parameters For Material Table
  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      assetType: this.assetSearchForm?.get("assetType")?.value,
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
    this.loadAsset(this.getSearchParams());
  }

  //=================For Filteration
  onSearch() {
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    this.loadAsset(this.getSearchParams());
  }
  
  //==============View AssetData
  loadAsset(...params: any) {
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
      userId: this.userId
    };
    this.isLoading = true;
    this.manageAssetCategoryService.viewAssetData(this.paramObj).subscribe({
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


  deleteAssetCategory(id: number) {
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.alertHelper.deleteAlert(
      "Are you sure to delete?",
      "",
      "question",
      "Yes, delete it!"
    ).then((result) => {
      this.spinner.show();
      if (result.value) {
        this.spinner.show();
        this.isLoading = true;
        this.manageAssetCategoryService
          .deleteAsset(id, this.userId,this.profileId)
          .subscribe({
            next: (res: any) => {
              if (res?.success === true) {
                this.alertHelper.successAlert(
                  "Deleted!",
                  "Asset category deleted successfully.",
                  "success"
                );
                this.loadAsset(this.getSearchParams());
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
    })
  }

showDescription(descText: string){
    this.descFullText = descText;
  }
  downloadAssetCatList()
  {
    this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.manageAssetCategoryService.viewAssetData(this.paramObj).subscribe({
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
