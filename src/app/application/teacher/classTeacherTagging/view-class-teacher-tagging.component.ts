import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { environment } from 'src/environments/environment';
import { ClassWiseTeacherTaggedService } from '../services/class-wise-teacher-tagged.service';

@Component({
  selector: 'app-view-class-teacher-tagging',
  templateUrl: './view-class-teacher-tagging.component.html',
  styleUrls: ['./view-class-teacher-tagging.component.css']
})
export class ViewClassTeacherTaggingComponent implements OnInit {

  public fileUrl = environment.filePath;

  viewClassTeacherTaggingform!: FormGroup;

  userId: any             = "";
  schoolId: any           = "";
  loginUserTypeId: any    = "";
  teacherName:any         = "";
  userProfile: any = [];
  
  isLoading:boolean         = false;
  isNorecordFound: boolean  = false;
  pageIndex: any    = 0;
  previousSize: any = 0;
  plPrivilege:string  = "view"; //For menu privilege
  config = new Constant(); 

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

  resultListData: any = [];
  questionDetailsData!: any;
  dataSource = new MatTableDataSource(this.resultListData);
  //end
  paramObj: any; 
  serviceType: string = "Search";
  teacherListData: any = [];
  permissionDiv: boolean = false;

  constructor(
    public customValidators: CustomValidators,
    private formBuilder: FormBuilder,
    private classWiseTeacherTaggedService:ClassWiseTeacherTaggedService,
    private router:Router,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    public commonserviceService: CommonserviceService,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private el:ElementRef,
  ) { 
    /* const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId; */
  }

  ngOnInit(): void {
    this.spinner.show();
    const userProfile = this.commonserviceService.getUserProfile();
    this.schoolId = userProfile?.school;
    this.userId   = userProfile?.userId;
    this.loginUserTypeId   = userProfile?.loginUserTypeId;
    this.displayedColumns = ["slNo","school_name","class_name","stream_name","group_name","section_name","teacher_name","action"]; 
    if (userProfile.loginUserTypeId != 3) {
      this.permissionDiv = true;
      this.getTeacherList(this.schoolId);
      this.loadClassTeacherTagging(this.getSearchParams());
    } else {
      this.permissionDiv = false;
    }
    
    this.initializeForm(); 
    // this.el.nativeElement.querySelector("[formControlName=teacherName]").focus();   
    this.spinner.hide();
  }
  
  getTeacherList(schoolId:any){
    if (schoolId !== "") {
      this.classWiseTeacherTaggedService.getTeacherList(schoolId).subscribe((res: any = []) => {
          this.teacherListData = res.data;
          
        });
    }
  }
  initializeForm(){
    this.viewClassTeacherTaggingform = this.formBuilder.group({
      teacherName: [this.teacherName,[Validators.maxLength(3),Validators.minLength(30),this.customValidators.firstCharValidatorRF]],
    });
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
      teacherName: this.viewClassTeacherTaggingform?.get("teacherName")?.value,
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
    this.loadClassTeacherTagging(this.getSearchParams());
  }
  onSearch(){
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.previousSize = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    this.loadClassTeacherTagging(this.getSearchParams());
  }

  loadClassTeacherTagging(...params: any) {
    this.spinner.show();
    const {
      previousSize,
      offset,
      pageSize,
      teacherName,
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      teacherName: teacherName,
      serviceType: this.serviceType, 
      userId: this.userId,schoolId:this.schoolId
    };
    this.isLoading = true;
    this.classWiseTeacherTaggedService.viewClassTeacherTagged(this.paramObj).subscribe({
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
    this.spinner.hide();
  }

  deleteClassTeacherTagged(id: number) { 
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;
    this.alertHelper.deleteAlert("Are you sure to delete?", "", "question", "Yes, delete it!").then((result) => {
      if (result.value) {
        this.spinner.show();
        this.isLoading = true;
        this.classWiseTeacherTaggedService
          .deleteClassTeacherTagged(id, this.userId)
          .subscribe({
            next: (res: any) => {
              if (res?.success === true) {
                this.alertHelper.successAlert(
                  "Deleted!",
                  "Class teacher tagged deleted successfully.",
                  "success"
                );
                this.loadClassTeacherTagging(this.getSearchParams());
              } else {
                this.alertHelper.viewAlert("info",res?.msg);
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
  downloadClassTeacherTaggedList()
  {
    this.spinner.show();   
    this.paramObj.serviceType = "Download";
    this.classWiseTeacherTaggedService.viewClassTeacherTagged(this.paramObj).subscribe({
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
