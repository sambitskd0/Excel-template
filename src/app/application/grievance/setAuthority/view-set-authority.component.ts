/**
* Created By  : Deepti Ranjan
* Created On  : 20-06-2022
* Module Name : Grievance
* Description : View Set authority component.
**/
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, NgForm } from "@angular/forms";
import { ManageCategoryService } from '../services/manage-category.service';
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
import { ManageSubjectService } from "../services/manage-subject.service";
import { SetAuthorityService } from "../services/set-authority.service";
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';


@Component({
  selector: 'app-view-set-authority',
  templateUrl: './view-set-authority.component.html',
  styleUrls: ['./view-set-authority.component.css']
})
export class ViewSetAuthorityComponent implements OnInit {
  public fileUrl = environment.filePath;
  @ViewChild("searchForm") searchForm!: NgForm;
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
  displayedColumns: string[] = [
    "slNo",
    "Category",
    "SubCategory",
    "Subject",
    "Stage",
    "Approval Authority",
    "Time SLA(days)",
    "CreatedOn",    
  ]; 
  adminPrivilege: boolean = false;
  // define mat table columns

  paramObj: any; 
  serviceType: string = "Search";
  resultListData: any = [];
  questionDetailsData!: any;
  dataSource = new MatTableDataSource(this.resultListData);  
  //end

  userId:any="";
  searchCategoryId:any="";
  searchSubCategoryId:any="";
  searchSubjectId:any="";

  scCategorySelect:boolean = true; 
  scCategoryLoading:boolean = false; 
  scSubCategorySelect:boolean = true; 
  scSubCategoryLoading:boolean = false;
  scSubjectSelect:boolean = true; 
  scSubjectLoading:boolean = false; 

  isLoading = false;
  previousSize: any = 0;
  pageIndex: any = 0;
  isNorecordFound: boolean = false;
  viewAuthority:any;
  resData: any = "";

  categoryChanged:boolean = false; 
  subCategoryChanged:boolean = false; 
  subjectChanged:boolean = false; 

  categoryData: any= [];
  subCategoryData: any= [];
  subjectData: any= [];

  plPrivilege:string="view"; //For menu privilege
  config = new Constant(); 

  constructor(
    private spinner: NgxSpinnerService, 
    private setAuthorityService: SetAuthorityService , 
    private categoryService: ManageCategoryService, 
    private subCategoryService: ManageSubCategoryService, 
    private subjectService: ManageSubjectService,
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
  }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }

    this.getCategory();
    this.viewSetAuthority(this.getSearchParams());    
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
      searchSubCategoryId: this.searchSubCategoryId,    
      searchSubjectId: this.searchSubjectId  
    };
  }

  getCategory(){
    this.categoryChanged = true;
    this.categoryService.getAllCategory().subscribe((data:[])=>{
      this.categoryData = data;
      this.categoryData = this.categoryData.data;   
      this.categoryChanged = false;
    });
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
    this.viewSetAuthority(this.getSearchParams());
  }
  onSearch() {
    // reset queryParams
    this.pageIndex = 0;    
    this.offset = 0;
    this.previousSize = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    this.viewSetAuthority(this.getSearchParams());
  }

  getSubCategory(categoryId: any){
    this.subCategoryChanged = true;
    if(categoryId !== ''){        
        this.subCategoryService.getSubCategoryByCatId(categoryId).subscribe((data:any)=>{
        this.subCategoryData = data;
        this.subCategoryData = this.subCategoryData.data;   
        this.subCategoryChanged = false;
      });
    }else{
      this.subCategoryData = [];
      this.subCategoryChanged = false;
    }  
    this.subjectData = [];
    this.searchForm.controls['searchSubCategoryId'].patchValue('');
    this.searchForm.controls['searchSubjectId'].patchValue('');
  }

  getSubject(subCategoryId: any){
    this.subjectChanged = true;
    if(subCategoryId !== ''){        
        this.subjectService.getSubjectBySubCatId(subCategoryId).subscribe((data:any)=>{
        this.subjectData = data;
        this.subjectData = this.subjectData.data;   
        this.subjectChanged = false;
      });
    }else{
      this.subjectData = [];      
      this.subjectChanged = false;
    }  
    this.searchForm.controls['searchSubjectId'].patchValue('');
  }

  viewSetAuthority(...params: any){
    this.spinner.show();
    const {
      previousSize,
      offset,
      pageSize,
      searchCategoryId,
      searchSubCategoryId,
      searchSubjectId
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      searchCategoryId:searchCategoryId,
      searchSubCategoryId:searchSubCategoryId,
      searchSubjectId:searchSubjectId,
      serviceType: this.serviceType, 
      userId: this.userId
    };
    this.isLoading = true;
    this.setAuthorityService.viewSetAuthority(this.paramObj).subscribe({
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

  downloadSetAuthorityList(){
    this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.setAuthorityService.viewSetAuthority(this.paramObj).subscribe({
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
