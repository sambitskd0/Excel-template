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
import { ErrorHandler } from 'src/app/core/helpers/error-handler';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { environment } from 'src/environments/environment';
import { CommitteeMemberService } from '../services/committee-member.service';

@Component({
  selector: 'app-view-smc-member',
  templateUrl: './view-smc-member.component.html',
  styleUrls: ['./view-smc-member.component.css']
})
export class ViewSmcMemberComponent implements OnInit {
  public fileUrl = environment.filePath;
  public show: boolean = true;
  public buttonName: any = 'Show';
  memberType: any = "";
  committeeType: any = "";
  memberData: any = "";

  viewMemberSearchform!: FormGroup;
  isInitAdmin: boolean      = false;
  permissionDiv: boolean    = false;
  isEmpty: boolean          = false;
  committeeTypeData: any    = "";
  memberTypeData: any       = "";
  
  userId: any               = "";
  profileId: any            = "";
  memberDatas: any          = "";
  schoolId: any             = "";
 
  // ===============Material Table Variable and Decorators
  isLoading                 = false;
  isNorecordFound: boolean  = false;
  pageIndex: any            = 0;
  previousSize: any         = 0;
  paramObj: any             = ""; 
  serviceType: string       = "Search";
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
  // start define mat table reference columns
  displayedColumns: string[] = []; // end define mat table columns

  resultListData: any = [];
  dataSource = new MatTableDataSource(this.resultListData);

  //end Material Table Variable and Decorators
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  constructor(
    private spinner: NgxSpinnerService,
    private committeeMemberService: CommitteeMemberService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private alertHelper: AlertHelper, private formBuilder: FormBuilder,
    public commonserviceService: CommonserviceService,
    public customValidators: CustomValidators,
    private errorHandler: ErrorHandler) { 
      const pageUrl:any = this.router.url;  
      this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
      this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
      const users = this.commonserviceService.getUserProfile();
      this.userId = users?.userId;
      this.profileId = users?.profileId;
      this.schoolId = users?.school;
    }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
      this.displayedColumns = [
        "slNo",
        "name",
        "mobile",
        "email",
        "gender",
        "position",
        "committeeType",
        "memberType",
        "category",
        "action",
      ]; 
    } else {
      this.displayedColumns = [
        "slNo",
        "name",
        "mobile",
        "email",
        "gender",
        "position",
        "committeeType",
        "memberType",
        "category",
      ]; 
    }
    const userProfile = this.commonserviceService.getUserProfile();
    this.commonserviceService
      .getCommonAnnexture(["COMMITTEE_TYPE", "MEMBER_TYPE"])
      .subscribe((data: any = []) => {
        this.committeeTypeData = data?.data?.COMMITTEE_TYPE;
        this.memberTypeData = data?.data?.MEMBER_TYPE;
        
      });
      if(userProfile.loginUserTypeId == 2){
        this.loadMemberData(this.getSearchParams());
      }else{
        this.isInitAdmin = true;
        this.spinner.hide();
      }
  }
  // ===========initialize Datasource after complete Component Load
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  toggle() {
    this.show = !this.show;
    if (this.show)
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }

  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      schoolId: this.schoolId,
      committeeType: this.committeeType,
      memberType: this.memberType,
      memberData: this.memberData,
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
    this.loadMemberData(this.getSearchParams());
  }

  //=================For Filteration
  memberSearch() {
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    
    if (this.validateForm() === true) {
      this.spinner.show();
      this.loadMemberData(this.getSearchParams());
    }
    else{
      this.isNorecordFound= true;
    }

  }
  loadMemberData(...params: any) {

    this.spinner.show();
    const {
      previousSize,
      offset,
      pageSize,
      committeeType,
      memberType,
      memberData,
      schoolId
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      committeeType: committeeType,
      memberType: memberType,
      memberData: memberData,
      schoolId: schoolId,
      serviceType: this.serviceType, 
      userId: this.userId
    };
    this.isLoading = true;
    this.committeeMemberService.viewMembers(this.paramObj).subscribe({
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
  deleteMemeber(id: any) {
    this.alertHelper.deleteAlert(
      "Do you want to delete the selected record ?",
      "",
      "question",
      "Yes, delete it!"
    ).then((result) => {
      this.spinner.show();
      if (result.value) {
        this.spinner.show();
        this.isLoading = true;
        this.committeeMemberService
          .deleteMember(id, this.userId,this.schoolId,this.profileId)
          .subscribe({
            next: (res: any) => {
              if (res?.success === true) {
                this.alertHelper.successAlert(
                  "Deleted!",
                  "Committee member deleted successfully",
                  "success"
                );
                this.loadMemberData(this.getSearchParams());
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
      }else{
        this.spinner.hide();
      }
    })
  }
  downloadCommMemberList()
  {
    this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.committeeMemberService.viewMembers(this.paramObj).subscribe({
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
  validateForm() :Boolean{
    
    if (this.committeeType === "") {
      this.alertHelper.successAlert(
        "",
        "Please select Committee Type.",
        "info"
      );
      return false;
    }
     return true;
   }
   printPage() {
    let cloneTable 	= document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonserviceService.printPage(cloneTable, pageTitle);
  }

}
