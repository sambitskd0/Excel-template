import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {  Router } from "@angular/router";
import { ManageAppointSubjectService } from '../services/manage-appoint-subject.service';
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
import { CustomValidators } from "src/app/shared/validations/custom-validators";

@Component({
  selector: 'app-view-appoint-subject',
  templateUrl: './view-appoint-subject.component.html',
  styleUrls: ['./view-appoint-subject.component.css']
})
export class ViewAppointSubjectComponent implements OnInit {
  public fileUrl = environment.filePath;
  dataUrl: any = {};
  displayTable: boolean = false;
  appointSubjectSearchform!: FormGroup;
  posts: any;
  select_all = false;
  isEmpty: boolean = false; 
  subjectName: any = "";
  isLoading = false;
  previousSize: any = 0;
  descFullText:string = "";
  pageIndex: any = 0;
  isNorecordFound: boolean = false;
  userId:any="";
  profileId:any="";
  paramObj: any; 
  serviceType: string = "Search";
  plPrivilege:string="view"; //For menu privilege
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
   adminPrivilege: boolean = false;
   displayedColumns: string[] = []; // define mat table columns
 
   resultListData: any = [];
   questionDetailsData!: any;
   dataSource = new MatTableDataSource(this.resultListData);
   //end
 
  constructor(
    public manageAppointSubjectService: ManageAppointSubjectService,
    private formBuilder: FormBuilder,
    public commonserviceService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private el:ElementRef,
    public customValidators: CustomValidators,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService
  ) { const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization 
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;}

  ngOnInit(): void {
    this.spinner.show();
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
      this.displayedColumns = [
        "slNo",
        "Subject",
        "Description",
        "CreatedOn",
        "action",
      ]; 
    } else {
      this.displayedColumns = [
        "slNo",
        "Subject",
        "Description",
        "CreatedOn",
      ]; 
    }
    this.loadAppointSubject(this.getSearchParams());
    this.initializeForm();
    this.el.nativeElement.querySelector("[formControlName=subjectName]").focus();
 
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  initializeForm(){
    this.appointSubjectSearchform = this.formBuilder.group({
      subjectName: [this.subjectName,[Validators.maxLength(30),Validators.minLength(3)]],
    });
  }
  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      subjectName: this.appointSubjectSearchform?.get("subjectName")?.value,
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
    this.loadAppointSubject(this.getSearchParams());
  }
  onSearch() {
    // reset queryParams
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.previousSize = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    this.loadAppointSubject(this.getSearchParams());
  }


  loadAppointSubject(...params: any){
    this.spinner.show();
    const {
      previousSize,
      offset,
      pageSize,
      subjectName,
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      subjectName:subjectName,
      serviceType: this.serviceType, 
      userId: this.userId
     
    };
    this.isLoading = true;
    this.manageAppointSubjectService.viewAppointSubject(this.paramObj).subscribe({
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
deleteAppointSubject(id: number) {
  const users = this.commonserviceService.getUserProfile();
  this.userId = users?.userId;
  this.profileId = users?.profileId;
  this.alertHelper
    .deleteAlert("Are you sure to delete?", "", "question", "Yes, delete it!")
    .then((result) => {
      if (result.value) {
        this.spinner.show();
        this.isLoading = true;
        this.manageAppointSubjectService
          .deleteAppointSubject(id, this.userId,this.profileId)
          .subscribe({
            next: (res: any) => {
              if (res?.success === true) {
                this.alertHelper.successAlert(
                  "Deleted!",
                  "Appointsubject deleted Successfully",
                  "success"
                );
                this.loadAppointSubject(this.getSearchParams());
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
downloadAppSubjectList()
{
  this.spinner.show();   
  this.paramObj.serviceType = "Download";

  this.manageAppointSubjectService.viewAppointSubject(this.paramObj).subscribe({
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
