import {AfterViewInit,  Component, Input, OnInit, ViewChild ,ElementRef } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { IndustrialTrainingService } from '../../services/industrial-training.service';
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { NgxSpinnerService } from "ngx-spinner";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { environment } from "src/environments/environment";
import { Constant } from "src/app/shared/constants/constant";

@Component({
  selector: 'app-view-training-category',
  templateUrl: './view-training-category.component.html',
  styleUrls: ['./view-training-category.component.css']
})


export class ViewTrainingCategoryComponent implements AfterViewInit, OnInit {
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
  displayedColumns: string[] = []; // define mat table columns

  resultListData: any = [];
  questionDetailsData!: any;
  dataSource = new MatTableDataSource(this.resultListData);
  
  //end
  paramObj: any; 
  serviceType: string = "Search";

  userId:any="";
  trainingName:any="";
  isNorecordFound: boolean = false;
  pageIndex: any = 0;
  isLoading = false;
  previousSize: any = 0;
  trainingCategory!: FormGroup;
  trainingListData : any="";
  emptyCheck :boolean = false;
  descFullText:string = ""; 
  userProfile:any=[];
  plPrivilege:string="view"; //For menu privilege
	adminPrivilege: boolean = false;
  config = new Constant();

  constructor( private formBuilder: FormBuilder,
    private industrialTraining: IndustrialTrainingService,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private spinner: NgxSpinnerService,
    private el: ElementRef,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private commonService:CommonserviceService) 
    {  const pageUrl:any = this.router.url;  
      this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
      this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
      const users = this.commonService.getUserProfile();
      this.userId = users?.userId;
    }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
      this.displayedColumns = [
        "slNo",
        "Training Name",
        "Description",
        "action",
      ]; 
    } else {
      this.displayedColumns = [
        "slNo",
        "Training Name",
        "Description",
      ]; 
    }
    this.userProfile = this.commonService.getUserProfile();
    this.initializeForm();
    this.loadTrainingData(this.getSearchParams());
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      trainingName: this.trainingCategory?.get("trainingName")?.value,
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
    this.loadTrainingData(this.getSearchParams());
  }
  onSearch() {
    // reset queryParams
    this.pageIndex = 0;    
    this.offset = 0;
    this.previousSize = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    this.loadTrainingData(this.getSearchParams());
  }

  initializeForm(){  
    this.trainingCategory = this.formBuilder.group({
      trainingName:['',],     
    });
  }
  loadTrainingData(...params: any){
    this.spinner.show();
    const {
      previousSize,
      offset,
      pageSize,
      trainingName,
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      trainingName:trainingName,
      serviceType: this.serviceType, 
      userId: this.userId
    };
    this.isLoading = true;
    this.industrialTraining.viewTrainingCategory(this.paramObj).subscribe({
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
  

  deleteTraining(id: number) {
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.alertHelper
      .deleteAlert("Are you sure to delete?", "", "question", "Yes, delete it!")
      .then((result) => {
        if (result.value) {
          this.spinner.show();
          this.isLoading = true;
          this.industrialTraining.deleteTraining(id, this.userId)
            .subscribe({
              next: (res: any) => {
                if (res?.success === true) {
                  this.alertHelper.successAlert(
                    "Deleted!",
                    "Type of training deleted successfully",
                    "success"
                  );
                  this.loadTrainingData(this.getSearchParams());
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
    downloadTrainingCategoryList()
    {
      this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.industrialTraining.viewTrainingCategory(this.paramObj).subscribe({
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

  rerender(): void {
    // this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //   // Destroy the table first
    //   dtInstance.destroy();
    //   // Call the dtTrigger to rerender again
    //   this.dtTrigger.next(0);
    // });
  }
 
  showDescription(descText: string){
    this.descFullText = descText;
  }
  printPage() {
    let cloneTable 	= document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }
 
}
