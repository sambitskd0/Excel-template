import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { MatTableExporterDirective } from 'mat-table-exporter';
import { NgxSpinnerService } from 'ngx-spinner';

import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { environment } from 'src/environments/environment';

import { ManageMdmItemService } from '../services/manage-mdm-item.service';

@Component({
  selector: 'app-view-mdm-items',
  templateUrl: './view-mdm-items.component.html',
  styleUrls: ['./view-mdm-items.component.css']
})
export class ViewMdmItemsComponent implements OnInit {
  public fileUrl = environment.filePath;
  viewMDMMaster!: FormGroup;
  mdmItemeDatas: any;
  select_all = false;
  isEmpty: boolean = false;
  userId: any;
  profileId: any = "";
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
   displayedColumns: string[] = []; 
 
   resultListData: any = [];
   dataSource = new MatTableDataSource(this.resultListData);
   descFullText:string = ""; 
 
   //end Material Table Variable and Decorators
   paramObj: any; 
   serviceType: string = "Search";
  constructor(private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    public manageMdmItemService:ManageMdmItemService, 
    public commonService:CommonserviceService) {
      const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
      const users = this.commonService.getUserProfile();
      this.userId = users?.userId; }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
      this.displayedColumns = [
        "slNo",
        "itemName",
        'description',
        "action",
      ]; 
    } else {
      this.displayedColumns = [
        "slNo",
        "itemName",
        'description',
      ]; 
    }

    this.loadMdmItemDatas(this.getSearchParams());
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
  this.loadMdmItemDatas(this.getSearchParams());
}
 

  loadMdmItemDatas(...params: any){
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
    this.manageMdmItemService.viewMdmItem(this.paramObj).subscribe({
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
  deleteMdmItemDatas(id:any){
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.alertHelper.deleteAlert(
      "Do you want to delete the record ?",
      "",
      "question",
      "Yes, delete it!"
    ).then((result) => {
      this.spinner.show();
      if (result.value) {
        this.spinner.show();
        this.isLoading = true;
        this.manageMdmItemService
          .deleteMdmItem(id, this.userId, this.profileId)
          .subscribe({
            next: (res: any) => {
              if (res?.success === true) {
                this.alertHelper.successAlert(
                  "Deleted!",
                  "Mdm item deleted successfully",
                  "success"
                );
                this.loadMdmItemDatas(this.getSearchParams());
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
  downloadMdmItemList()
  {
    this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.manageMdmItemService.viewMdmItem(this.paramObj).subscribe({
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
