import { Component, Input, OnInit, ViewChild } from "@angular/core";
import {  FormGroup } from "@angular/forms";
import {  Router } from "@angular/router";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { NgxSpinnerService } from "ngx-spinner";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { environment } from "src/environments/environment";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { ManageIndicatorService } from "../services/manage-indicator.service";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { SchoolService } from "../../school/services/school.service";

@Component({
  selector: 'app-view-indicator',
  templateUrl: './view-indicator.component.html',
  styleUrls: ['./view-indicator.component.css']
})
export class ViewIndicatorComponent implements OnInit {
  public fileUrl = environment.filePath;
  isLoading = false;
  pageIndex: any = 0;
  isNorecordFound: boolean = false;
  previousSize: any = 0;
  paramObj: any; 
  serviceType: string = "Search";
  userId: any;
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
    "slNo",
    "Class",
    "Subject",
    "Indicator Name",
    "Action"
   ]; // define mat table columns
   tabs: any = [];  //For shwoing tabs
   resultListData: any = [];
   questionDetailsData!: any;
   classChanged: boolean = false;
   classList: any = [];
   classId:any = '';
   profileId:any = '';
   getSubjectLoading:boolean=false;
   subjectData: any;
   encId: any = "";
   subject:any = "";
   subjectId:any = "";
   userProfile:any = "";
   dataSource = new MatTableDataSource(this.resultListData);
   //end
   plPrivilege:string="view"; //For menu privilege
  

  constructor( public Manageindicatorservice:ManageIndicatorService,
    public commonserviceService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private schoolService: SchoolService,
    private spinner: NgxSpinnerService) 
  { 
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;
  }

  ngOnInit(): void {
    this.spinner.show();
    this.userProfile = this.commonserviceService.getUserProfile();
    this.getSchoolClasses();
    this.loadIndicator(this.getSearchParams());

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
    };
  }
 /*  getSchoolClasses(schoolEncId: string) {
    this.classChanged = true;
    if (schoolEncId !== "") {
      this.schoolService
        .getSchoolClasses(schoolEncId)
        .subscribe((res: any = []) => {
          this.classList = res.data;
          this.classChanged = false;
        });
    }
  } */
  getSchoolClasses()
  {
   this.classChanged = true;
   this.commonserviceService.getCommonAnnexture(['CLASS_TYPE'],true).subscribe((res: any) => {
     this.classList = res.data;
   this.classList = this.classList.CLASS_TYPE;
   this.classChanged = false;
  });
  }
  getSubject(classId:any) {
    this.spinner.show();
    this.getSubjectLoading = true;
    this.Manageindicatorservice.getSubject(classId).subscribe((res: any) => {
    this.subjectData = res;
    this.subjectData = this.subjectData.data;
    this.subject = this.subjectData.subjectId;
   this.encId = this.subjectData.encId;
    this.spinner.hide();
    this.getSubjectLoading = false;
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
    this.loadIndicator(this.getSearchParams());
  }
  onSearch() {
    // reset queryParams
    this.pageIndex = 0;    
    this.offset = 0;
    this.previousSize = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    this.loadIndicator(this.getSearchParams());
  }
  loadIndicator(...params: any){
    this.spinner.show();
    const {
      previousSize,
      offset,
      pageSize,
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      serviceType: this.serviceType, 
      userId: this.userId,
      classId:this.classId,
      subjectId:this.subjectId,
    };
    this.isLoading = true;
    this.Manageindicatorservice.viewIndicator(this.paramObj).subscribe({
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
  deleteIndicator(id: number) {
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.alertHelper
      .deleteAlert("Are you sure to delete?", "", "question", "Yes, delete it!")
      .then((result) => {
        if (result.value) {
          this.spinner.show();
          this.isLoading = true;
          this.Manageindicatorservice
            .deleteIndicator(id, this.userId,this.profileId)
            .subscribe({
              next: (res: any) => {
                if (res?.success === true) {
                  this.alertHelper.successAlert(
                    "Deleted!",
                    "Indicator deleted Successfully",
                    "success"
                  );
                  this.loadIndicator(this.getSearchParams());
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
  printPage()
  {
    let cloneTable 	= document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonserviceService.printPage(cloneTable, pageTitle);
  }
  downloadIndicatorList()
  {
    this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.Manageindicatorservice.viewIndicator(this.paramObj).subscribe({
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
