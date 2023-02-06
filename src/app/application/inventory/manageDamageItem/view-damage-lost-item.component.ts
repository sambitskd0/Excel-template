import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonFunctionHelper } from 'src/app/core/helpers/common-function-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { environment } from 'src/environments/environment';
import { InventoryService } from '../services/inventory.service';

@Component({
  selector: 'app-view-damage-lost-item',
  templateUrl: './view-damage-lost-item.component.html',
  styleUrls: ['./view-damage-lost-item.component.css']
})
export class ViewDamageLostItemComponent implements OnInit {
  public fileUrl = environment.filePath;
  openingStock!: any;
  damageItemForm!: FormGroup;
  resData: any = "";
  assetNameS: any = "";
  assetNameChanged: boolean = false;
  
  assetData: any = [];
 
  assetFilterData: any[] = []; 
  viewDamage:any='';
  userProfile:any=[];
  isLoading = false;
  isNorecordFound: boolean = false;
  schoolId: any = ''; 
  pageIndex: any = 0;
  previousSize: any = 0; 
  public show:boolean = true;
  public buttonName:any = 'Show';
  @ViewChild(DataTableDirective, {static: false})
  datatableElement!: DataTableDirective ;
  dtOptions: DataTables.Settings = {};
  bodyData: any;
  dtTrigger: Subject<any> = new Subject<any>();
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
  userId:any="";
  paramObj: any; 
  serviceType: string = "Search";
  maxDate: any = Date;
  minDate:any = Date;
  incUnit: any = [];
  unitData: any = [];
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  constructor(private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private alertHelper: AlertHelper,
    private inventoryService: InventoryService,
    public customValidators: CustomValidators,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private commonFunctionHelper: CommonFunctionHelper,
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
        "damageDate",
        "assetType",
        "assetName",
        "assetItemName",
        "unit",
        "quantity",
        "reasonDamage",
        "remark",
        "Action"
      ]; 
    } else {
      this.displayedColumns = [
          "slNo",
          "damageDate",
          "assetType",
          "assetName",
          "assetItemName",
          "unit",
          "quantity",
          "reasonDamage",
          "remark",
      ]; 
    }
    this.userProfile = this.commonService.getUserProfile();
    this.schoolId = this.userProfile.school;
    this.viewDamageItem(this.getSearchParams());
    this.initializeForm();
    // this.viewDamageItem();
    this.getAssetType();
    this.getAnnextureData();
    // this.getTotalStock();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  
  initializeForm(){ 
    this.damageItemForm = this.formBuilder.group({ 
      damageFromDate:['',],
      damageToDate:['',],
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
      },
    });
  }
  filterAssetName(id: any) {    
    if (id !== "") {
      this.assetFilterData = this.assetData.filter((x: any) => {     
        this.damageItemForm.patchValue({
          assetName: ''
       }); 
        return x.assetType === parseInt(id);
      });
    } else {
      this.damageItemForm.patchValue({
        assetName: ''
     }); 
      this.assetFilterData = [];
    }
    
  }
  viewDamageItem(...params: any){
    this.spinner.show();
    const {
      previousSize,
      offset,
      pageSize,
      damageFromDate,
      damageToDate,
      
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      damageFromDate: damageFromDate,      
      damageToDate: damageToDate,      
      schoolId:this.userProfile.school,
      serviceType: this.serviceType, 
      userId: this.userId
      
    };
    this.isLoading = true;
    this.inventoryService.viewDamageItem(this.paramObj).subscribe({
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
      // damageFromDate: this.commonFunctionHelper.dateFormatHelper(this.damageItemForm?.get("damageFromDate")?.value), 
      // damageToDate: this.commonFunctionHelper.dateFormatHelper(this.damageItemForm?.get("damageToDate")?.value), 
      damageFromDate:this.damageItemForm?.get("damageFromDate")?.value,
      damageToDate:this.damageItemForm?.get("damageToDate")?.value,
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
    this.viewDamageItem(this.getSearchParams());
  }
  onSearch(){
    // reset queryParams
   this.pageIndex = 0;
   this.previousSize = 0;
   this.offset = 0;
   this.previousSize = 0;
   this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
   this.viewDamageItem(this.getSearchParams());
  }
  deleteDamageItem(encId:string,assetItemId:any){
    this.alertHelper
    .deleteAlert("Are you sure to delete?", "", "question", "Yes, delete it!")
    .then((result) => {
      if (result.value) {
        this.spinner.show(); // ==== show spinner
        //let paramList : any = { encId:encId, updatedBy : this.userProfile.userId };
        let paramList : any = { encId:encId,assetItemId:assetItemId, updatedBy : this.userProfile.userId , profileId : this.userProfile.profileId};
      
        this.inventoryService.deleteDamageItem(paramList).subscribe({
          next: (res: any) => {
            if (res?.success === true) {
              this.alertHelper.successAlert(
                "Deleted!",
                "Deleted successfully",
                "success"
              );
              this.viewDamageItem(this.getSearchParams());
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
  getAnnextureData() {
    this.commonService
      .getCommonAnnexture(["INCENTIVE_UNIT"])
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();         
          this.incUnit = res?.data?.INCENTIVE_UNIT;
          this.incUnit.forEach((value:any) => {
            this.unitData[value.anxtValue] = value.anxtName;                
        });  
        },
      });
  }
  printPage() {
    let cloneTable 	= document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }
  downloadDamageItemList()
  {
    this.spinner.show();   
    this.paramObj.serviceType = "Download";
 this.inventoryService.viewDamageItem(this.paramObj).subscribe({
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
