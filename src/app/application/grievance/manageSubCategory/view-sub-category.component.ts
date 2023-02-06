/**
* Created By  : Deepti Ranjan
* Created On  : 31-05-2022
* Module Name : Grievance
* Description : View Sub Category component.
**/
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { ManageCategoryService } from '../services/manage-category.service';
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { NgxSpinnerService } from "ngx-spinner";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { Constant } from 'src/app/shared/constants/constant';
import { ManageSubCategoryService } from "../services/manage-sub-category.service";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-sub-category',
  templateUrl: './view-sub-category.component.html',
  styleUrls: ['./view-sub-category.component.css']
})
export class ViewSubCategoryComponent implements OnInit {
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
  displayedColumns: string[] = [];
  adminPrivilege: boolean = false;
  // define mat table columns

  paramObj: any; 
  serviceType: string = "Search";
  resultListData: any = [];
  questionDetailsData!: any;
  dataSource = new MatTableDataSource(this.resultListData);
  
  //end
  searchCategoryId:any = "";
  scCategorySelect:boolean = true; 
  scCategoryLoading:boolean = false; 

  userId:any="";
  isNorecordFound: boolean = false;
  isLoading = false;
  previousSize: any = 0;
  pageIndex: any = 0;
  subCategories:any;
  resData:boolean = false;
  descFullText:string = "";
  allCategory: any;
  categorySearchform!: FormGroup;
  categoryChanged:boolean = false; 

  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  profileId:any = '';
  
  constructor(
    private spinner: NgxSpinnerService,
    private subCategoryService: ManageSubCategoryService,
    private alertHelper: AlertHelper,
    private categoryService: ManageCategoryService, 
    private formBuilder: FormBuilder, 
    private router:Router,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private commonService: CommonserviceService 
  ) {
    const pageUrl:any = this.router.url;  
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
        "Category",
        "SubCategory",
        "Description",
        "CreatedOn",
        "action",
      ]; 
    } else {
      this.displayedColumns = [
        "slNo",
        "Category",
        "SubCategory",
        "Description",
        "CreatedOn"
      ]; 
    }
    
    this.getCategory();
    this.viewSubCategory(this.getSearchParams());
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
      searchCategoryId: this.searchCategoryId,
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
    this.viewSubCategory(this.getSearchParams());
  }

  onSearch() {
    // reset queryParams
    this.pageIndex = 0;    
    this.offset = 0;
    this.previousSize = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    this.viewSubCategory(this.getSearchParams());
  }

  getCategory(){
    this.categoryChanged = true;
    this.categoryService.getAllCategory().subscribe((data:[])=>{
      this.allCategory = data;
      this.allCategory = this.allCategory.data;
      this.categoryChanged = false;
    });
  }

  viewSubCategory(...params: any){
    this.spinner.show();    
     
    const {
      previousSize,
      offset,
      pageSize,
      searchCategoryId,
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      searchCategoryId: searchCategoryId,
      serviceType: this.serviceType, 
      userId: this.userId
    };

    this.isLoading = true;
    this.subCategoryService.viewSubCategory(this.paramObj).subscribe({
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
 
  deleteSubCategory(id: number) {    
    this.alertHelper
      .deleteAlert("Do you want to delete the selected record ?", "", "question", "Yes, delete it!")
      .then((result) => {
        if (result.value) {
          this.spinner.show();
          this.isLoading = true;
          this.subCategoryService.deleteSubCategory(id, this.userId, this.profileId)
            .subscribe({
              next: (res: any) => {
                if (res?.success === true) {
                  this.alertHelper.successAlert(
                    "Deleted!",
                    "Grievance sub category deleted successfully",
                    "success"
                  );
                  this.viewSubCategory(this.getSearchParams());
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

  downloadSubCategoryList(){
    this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.subCategoryService.viewSubCategory(this.paramObj).subscribe({
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
