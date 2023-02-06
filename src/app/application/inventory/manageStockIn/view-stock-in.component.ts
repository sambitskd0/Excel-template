import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { InventoryService } from '../services/inventory.service';
import { formatDate } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Constant } from 'src/app/shared/constants/constant';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { Router } from '@angular/router';
@Component({
  selector: 'app-view-stock-in',
  templateUrl: './view-stock-in.component.html',
  styleUrls: ['./view-stock-in.component.css']
})
export class ViewStockInComponent implements AfterViewInit,OnInit {
  public fileUrl = environment.filePath; 
  stockInForm!: FormGroup;
  resData: any = "";
  assetNameS: any = "";
  assetNameChanged: boolean = false;
  assetData: any = [];
  assetFilterData: any[] = []; 
  stockInData:any='';
  userProfile:any=[];
  assetTypeData:any =[];
  assetNameData:any =[];
  assetList:any =[];
  totalAmount:any ="";
  isLoading = false;
  isNorecordFound: boolean = false;
  schoolId: any = ''; 
  pageIndex: any = 0;
  previousSize: any = 0; 
  public show:boolean = true;
  public buttonName:any = 'Show';
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
  displayedColumns: string[] = []; // define mat table columns

  resultListData: any = [];
  questionDetailsData!: any;
  dataSource = new MatTableDataSource(this.resultListData);
  //end
  paramObj: any; 
  serviceType: string = "Search";
  userId:any="";
  maxDate: any = Date;
  invoiceFromDateFormat:any="";
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  constructor(private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private alertHelper: AlertHelper,
    private inventoryService: InventoryService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    public customValidators: CustomValidators,
    private commonService: CommonserviceService) {
      const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
      this.maxDate = new Date();
      const users = this.commonService.getUserProfile();
      this.userId = users?.userId;
     }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
      this.displayedColumns = [
        "slNo",
        "invoiceDate",
        "invoiceNo",
        "invoiceAmount",
        "approvalBy",
        "details",
        "Action"
      ]; 
    } else {
      this.displayedColumns = [
        "slNo",
        "invoiceDate",
        "invoiceNo",
        "invoiceAmount",
        "approvalBy",
        "details",
      ]; 
    }
    this.userProfile = this.commonService.getUserProfile();
    this.schoolId = this.userProfile.school;
    this.viewStockIn(this.getSearchParams());
    this.initializeForm();
    // this.viewStockIn();
    this.getAssetType();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

 
  initializeForm(){     
    this.stockInForm = this.formBuilder.group({ 
      approvalBy:['',],     
      invoiceNo:['',],     
      invoiceFromDate:['',],  
      invoiceToDate:['',],  
      sessionValue:[this.userProfile],
    }); 
    
  }
  getAssetType() {    
    this.assetNameChanged = true;
    this.spinner.show();
    this.inventoryService.getAssetType().subscribe({
      next: (data: any) => {
        this.assetData = data;
        this.assetData = this.assetData.data;        
        this.assetNameChanged = false;
        this.spinner.hide();
        this.assetData.forEach((value:any) => { 
            this.assetTypeData[value.assetType] = value.anexture.anxtName;
            this.assetNameData[value.assetCatId] = value.assetName;        
        });      
      },
    });
  }
  filterAssetName(id: any) {    
    if (id !== "") {
      this.assetFilterData = this.assetData.filter((x: any) => {     
        this.stockInForm.patchValue({
          assetName: ''
       }); 
        return x.assetType === parseInt(id);
      });
    } else {
      this.stockInForm.patchValue({
        assetName: ''
     }); 
      this.assetFilterData = [];
    }
    
  }
  viewStockIn(...params: any){
    
    const {
      previousSize,
      offset,
      pageSize,
      approvalBy,
      invoiceNo,
      invoiceFromDate,
      invoiceToDate,
      
    } = params[0];
    
    this.paramObj = {
      offset: offset,
      limit: pageSize,
      approvalBy: approvalBy,
      invoiceNo: invoiceNo,
      invoiceFromDate: invoiceFromDate,
      invoiceToDate: invoiceToDate,
      schoolId:this.userProfile.school,
      serviceType: this.serviceType, 
      userId: this.userId
      
    };

    this.isLoading = true;

    this.inventoryService.viewStockIn(this.paramObj).subscribe({
      next: (res: any) => {
        this.resultListData.length = previousSize; // set current size
        res?.success === true && this.resultListData.push(...res?.data); // merge with existing data
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
  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      approvalBy: this.stockInForm?.get("approvalBy")?.value,
      invoiceNo: this.stockInForm?.get("invoiceNo")?.value,
      invoiceFromDate: this.stockInForm?.get("invoiceFromDate")?.value,
      invoiceToDate: this.stockInForm?.get("invoiceToDate")?.value,
      
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
    this.viewStockIn(this.getSearchParams());
  }
  onSearch(){
    // reset queryParams
   this.pageIndex = 0;
   this.previousSize = 0;
   this.offset = 0;
   this.previousSize = 0;
   this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
   this.viewStockIn(this.getSearchParams());
  }
  toggle() {
    this.show = !this.show;
    if(this.show)  
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }
  // showAssetList(encId:string,schoolId:string,invoiceAmount:any){    
  //   this.spinner.show();
  //   this.inventoryService.getStockInList(encId,schoolId).subscribe({
  //     next: (resp: any) => {
  //       this.assetList = resp?.data;
  //       this.totalAmount = invoiceAmount;
  //       this.spinner.hide();
  //     },
  //   });
  // }
  showAssetList(encId:string){    
    this.spinner.show();
    this.inventoryService.getStockInList(encId,this.schoolId).subscribe({
      next: (resp: any) => {
        this.assetList = resp?.data;
        // this.totalAmount = invoiceAmount;
        this.spinner.hide();
      },
    });
  }
  deleteStockIn(encId:string){
    this.alertHelper
    .deleteAlert("Are you sure to delete?", "", "question", "Yes, delete it!")
    .then((result) => {
      if (result.value) {
        this.spinner.show(); // ==== show spinner
        let paramList : any = { encId:encId, updatedBy : this.userProfile.userId, profileId : this.userProfile.profileId };
        this.inventoryService.deleteStockIn(paramList).subscribe({
          next: (res: any) => {
            if (res?.success === true) {
              this.alertHelper.successAlert(
                "Deleted!",
                "Deleted successfully",
                "success"
              );
              this.viewStockIn(this.getSearchParams());
            } else {
              this.alertHelper.viewAlert("info", res?.msg);
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
  printPage() {
    let cloneTable 	= document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }
  downloadStockInList()
  {
    this.spinner.show();   
    this.paramObj.serviceType = "Download";
 this.inventoryService.viewStockIn(this.paramObj).subscribe({
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
  
}
