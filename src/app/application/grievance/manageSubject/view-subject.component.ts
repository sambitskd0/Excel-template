/**
* Created By  : Deepti Ranjan
* Created On  : 01-06-2022
* Module Name : Grievance
* Description : View Subject component.
**/
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
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
import { ManageSubjectService } from "../services/manage-subject.service";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-subject',
  templateUrl: './view-subject.component.html',
  styleUrls: ['./view-subject.component.css']
})
export class ViewSubjectComponent implements OnInit {
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
  paramObj: any; 
  serviceType: string = "Search";
  displayedColumns: string[] = [];
  adminPrivilege: boolean = false;
  // define mat table columns
 
  resultListData: any = [];
  questionDetailsData!: any;
  dataSource = new MatTableDataSource(this.resultListData);

  //end
  searchCategoryId:any="";
  searchSubCategoryId:any="";

  scCategorySelect:boolean = true; 
  scCategoryLoading:boolean = false; 
  scSubCategorySelect:boolean = true; 
  scSubCategoryLoading:boolean = false; 

  userId:any="";
  isLoading = false;
  previousSize: any = 0;
  pageIndex: any = 0;
  isNorecordFound: boolean = false;

  viewSubjects:any;
  resData: any = "";
  descFullText:string = "";
  subjectSearchform!: FormGroup;

  categoryChanged:boolean = false; 
  subCategoryChanged:boolean = false; 

  categoryData: any= [];
  subCategoryData: any= [];

  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  profileId:any = '';

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: ManageCategoryService, 
    private subCategoryService: ManageSubCategoryService, 
    private SubjectService: ManageSubjectService, 
    private spinner: NgxSpinnerService, 
    private alertHelper: AlertHelper,
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
        "Subject",
        "Description",
        "CreatedOn",
        "action",
      ]; 
    } else {
      this.displayedColumns = [
        "slNo",
        "Category",
        "SubCategory",
        "Subject",
        "Description",
        "CreatedOn"
      ]; 
    }
    this.subjectSearchform = this.formBuilder.group({
      grvncCatId: "", 
      grvncSubCatId: ""
    });
   this.getCategory();
    this.viewSubjectData(this.getSearchParams());
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
    this.viewSubjectData(this.getSearchParams());
  }

  onSearch() {
    // reset queryParams
    this.pageIndex = 0;    
    this.offset = 0;
    this.previousSize = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    this.viewSubjectData(this.getSearchParams());
  }

  getCategory(){
    this.categoryChanged = true;
    this.categoryService.getAllCategory().subscribe((data:[])=>{
      this.categoryData = data;
      this.categoryData = this.categoryData.data;   
      this.categoryChanged = false;
    });
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
    this.subjectSearchform.patchValue({"grvncSubCatId":""});
  }

  viewSubjectData(...params: any){
    this.spinner.show();    
    const {
      previousSize,
      offset,
      pageSize,
      searchCategoryId,
      searchSubCategoryId,
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      searchCategoryId:searchCategoryId,
      searchSubCategoryId:searchSubCategoryId,
      serviceType: this.serviceType, 
      userId: this.userId
    };
    this.isLoading = true;
    this.SubjectService.viewSubject(this.paramObj).subscribe({
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

  deleteSubject(id: number) {
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.alertHelper
      .deleteAlert("Do you want to delete the selected record ?", "", "question", "Yes, delete it!")
      .then((result) => {
        if (result.value) {
          this.spinner.show();
          this.isLoading = true;
          this.SubjectService.deleteSubject(id, this.userId, this.profileId)
            .subscribe({
              next: (res: any) => {
                if (res?.success === true) {
                  this.alertHelper.successAlert(
                    "Deleted!",
                    "Grievance subject deleted successfully",
                    "success"
                  );
                  this.viewSubjectData(this.getSearchParams());
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

  downloadSubjectList(){
    this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.SubjectService.viewSubject(this.paramObj).subscribe({
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


