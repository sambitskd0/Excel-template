import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { environment } from 'src/environments/environment';
import { ManageAssetItemService } from '../../services/manage-asset-item.service';
import { Router } from '@angular/router';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { Constant } from 'src/app/shared/constants/constant';
import { MatSort } from '@angular/material/sort';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-view-asset-item',
  templateUrl: './view-asset-item.component.html',
  styleUrls: ['./view-asset-item.component.css']
})
export class ViewAssetItemComponent implements OnInit {
  public fileUrl = environment.filePath;
  assetSearchForm!: FormGroup;
  assetType: any = "";
  assetName: string = "";
  assetDescription: any = "";
  assetItemDatas: any;
  anexType: any;
  annexData: any;
  anextureType: any;
  post: any;
  paramObj: any; 
  serviceType: string = "Search";
  select_all = false;
  isEmpty: boolean = false;

  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();
  tabs: any = [];  //For shwoing tabs
  userId: any;
  profileId: any;

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
  assetNameData: any;
  descFullText:string = ""; 

  //end Material Table Variable and Decorators

  constructor(private formBuilder: FormBuilder,
    private manageAssetItemService: ManageAssetItemService,
    private alertHelper: AlertHelper, public customValidator: CustomValidators,
    private spinner: NgxSpinnerService,
    public commonserviceService: CommonserviceService,
    private router: Router,
    private privilegeHelper: PrivilegeHelper  //For menu privilege
  ) {
    const pageUrl: any = this.router.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl, this.config.linkType[3]);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[3], this.config.privilege[1]);  // For authorization
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
        "Asset_Type",
        "Asset_Name",
        "Asset_ItemName",
        "Asset_ItemCode",
        "Movable",
        "Fixed",
        "Unit",
        "Description",
        "action",
      ]; 
    } else {
      this.displayedColumns = [
        "slNo",
        "Asset_Type",
        "Asset_Name",
        "Asset_ItemName",
        "Asset_ItemCode",
        "Movable",
        "Fixed",
        "Unit",
        "Description",
      ]; 
    }

    this.getAssetType();
    this.initializeForm();
    // this.loadAsset(this.getSearchParams());
    this.loadAssetItem(this.getSearchParams());
    //======modification Start=====  
  }

  // ===========initialize Datasource after complete Component Load
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAssetType() {
    this.anexType = "ASSET_TYPE";
    this.commonserviceService
      .getAnextureType(this.anexType)
      .subscribe((data: any = []) => {
        this.annexData = data;
        this.anextureType = this.annexData.data;
      });
  }
  
  initializeForm() {
    this.assetSearchForm = this.formBuilder.group({
      assetType: [this.assetType],
      assetName: [this.assetName],
    });
  }
  getAssetNamebyType(assetTypeId:any){
    this.assetSearchForm.patchValue({
      assetName :""
    })
    this.manageAssetItemService
      .getAssetnameByAssetId(assetTypeId)
      .subscribe((data: any = []) => {
        this.assetNameData = data.data;
      });
  }
  loadAssetItem(...params: any) {
    this.spinner.show();
    const {
      previousSize,
      offset,
      pageSize,
      assetType,
      assetName,
      
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      assetType: assetType,
      assetName: assetName,
      serviceType: this.serviceType, 
      userId: this.userId
    };
    this.isLoading = true;
    this.manageAssetItemService.viewAssetItemData(this.paramObj).subscribe({
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
  // ==============Get serch Parameters For Material Table
  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      assetType: this.assetSearchForm?.get("assetType")?.value,
      assetName: this.assetSearchForm?.get("assetName")?.value,
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
    this.loadAssetItem(this.getSearchParams());
  }
  onSearch() {
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    this.loadAssetItem(this.getSearchParams());
  }
  deleteAssetItemData(id: number) {
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
        this.manageAssetItemService
          .deleteAssetItemData(id, this.userId,this.profileId)
          .subscribe({
            next: (res: any) => {
              if (res?.success === true) {
                this.alertHelper.successAlert(
                  "Deleted!",
                  "Asset item deleted successfully.",
                  "success"
                );
                this.loadAssetItem(this.getSearchParams());
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
  downloadAssetItemList()
  {
    this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.manageAssetItemService.viewAssetItemData(this.paramObj).subscribe({
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
