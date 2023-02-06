import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
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
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute} from '@angular/router';
import { ManageProfileService } from "../services/manage-profile.service";
import { environment } from 'src/environments/environment';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';

@Component({
  selector: 'app-view-designation',
  templateUrl: './view-designation.component.html',
  styleUrls: ['./view-designation.component.css']
})
export class ViewDesignationComponent implements OnInit {
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
   "Designation Group",
   "Designation",
   "Level",
   "Description",  
 ]; 
 paramObj: any; 
 serviceType: string = "Search";
 // define mat table columns

 resultListData: any = [];
 questionDetailsData!: any;
 dataSource = new MatTableDataSource(this.resultListData);
 
 //end
 userId:any="";
 profileSearchform!: FormGroup;
 isNorecordFound: boolean = false;
 isLoading = false;
 previousSize: any = 0;
 pageIndex: any = 0;

 levelId : number = 0;
 designationName : string ='';




  public fileUrl = environment.filePath;
  imageUrlTeacher: any = "";
  isimageUrlTeacher: boolean = false;
  private apiURL = environment.profileAPI;
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    public commonService: CommonserviceService,
    public manageProfileService: ManageProfileService,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private route:Router,
    private router:ActivatedRoute,
    public customValidators: CustomValidators,

  ) { const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;}

  ngOnInit(): void {
    this.spinner.show();
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
this.profileSearchform = this.formBuilder.group({
      levelId: "0",designationName: "",
    });
    this.loadProfile(this.getSearchParams());
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
      levelId: this.levelId,
      designationName: this.designationName,      
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
    this.loadProfile(this.getSearchParams());
  }
  
  onSearch() {
    // reset queryParams
    this.pageIndex = 0;    
    this.offset = 0;
    this.previousSize = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    this.loadProfile(this.getSearchParams());
  }
    
  
    loadProfile(...params: any) {
      this.spinner.show();    
       
      const {
        previousSize,
        offset,
        pageSize,      
        levelId,
        designationName,
      } = params[0];
  
      this.paramObj = {
        offset: offset,
        limit: pageSize,
        levelId: levelId,
        designationName: designationName       
      };
  
      this.isLoading = true;
      this.manageProfileService
      .viewDesignation(this.paramObj).subscribe({
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


    filterRecord(): void {
      this.loadProfile();
    }


    downloadProfileList()
    {
      this.spinner.show();   
      this.paramObj.serviceType = "Download";
    
      this.manageProfileService
      .viewDesignation(this.paramObj).subscribe({
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
