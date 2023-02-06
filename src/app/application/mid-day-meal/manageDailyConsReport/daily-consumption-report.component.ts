import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CommonFunctionHelper } from 'src/app/core/helpers/common-function-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageStockReportService } from '../services/manage-stock-report.service';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Constant } from 'src/app/shared/constants/constant';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { formatDate } from '@angular/common';
import { ManageDailyConsumptionreportService } from '../services/manage-daily-consumptionreport.service';

@Component({
  selector: 'app-daily-consumption-report',
  templateUrl: './daily-consumption-report.component.html',
  styleUrls: ['./daily-consumption-report.component.css']
})
export class DailyConsumptionReportComponent implements OnInit {

  dailyConsForm!: FormGroup;
  public fileUrl = environment.filePath;

  permissionDiv: boolean = false;
  divShow: boolean = false;
  isLoading: boolean = false;
  isNorecordFound: boolean = false;


  searchDistrictData: any   = [];
  districtData: any         = [];
  searchBlockData: any      = [];
  clusterData: any          = [];
  getSchoolData: any        = [];
  socialCategoryList: any   = [];
  managementList: any       = [];
  dailyConsuptionData: any  = [];


  searchfromDate: any       = "";
  searchtoDate: any         = "";
  management: any           = "";

  plPrivilege: string       = "";
  //
  district: any             = "";
  block: any                = "";
  cluster: any              = "";
  userName: any             = "";
  schoolId: any             = "";
  schoolEncId: any          = "";
  schoolCategory: any       = "";
  userId: any               = "";
  loginId: any              = "";

  districtName: any         = "";
  districtCode: any         = "";
  blockName: any            = "";
  blockCode: any            = "";
  clusterName: any          = "";
  clusterCode: any          = "";
  schoolUdiseCode: any      = "";

  scDisrtictSelect: boolean       = true;
  scDisrtictLoading: boolean      = false;
  scBlockSelect: boolean          = true;
  scBlockLoading: boolean         = false;
  scClusterSelect: boolean        = true;
  scClusterLoading: boolean       = false;
  scSchoolSelect: boolean         = true;
  scSchoolLoading: boolean        = false;
  isSearch: boolean               = false;

  //form control name initialization
  districtId: any                 = "";
  blockId: any                    = "";
  clusterId: any                  = "";
  managementId: any               = "";
  loginUserTypeId: any            = "";

  public show: boolean = true;
  public buttonName: any = 'Show';
  allLabel: string[]          = ["District name","Block name","Cluster name","School name","","From date","To date","Management"];
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
  previousSize: any = 0;
  pageIndex: any = 0;
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
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();
  maxDate: any = Date; 
  minDate: any = Date;

  public userProfile = this.commonService.getUserProfile();
  constructor(
    private commonFunctionHelper: CommonFunctionHelper,
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    public customValidator: CustomValidators,
    private spinner: NgxSpinnerService,
    public commonService: CommonserviceService,
    public manageDailyConsumptionreportService: ManageDailyConsumptionreportService,
    public customValidators: CustomValidators,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private el: ElementRef,
  ) { 
    const pageUrl: any = this.router.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl); //For menu privilege
    this.commonService.verifyLinkPermission(
      pageUrl,
      this.config.linkType[2],
      this.config.privilege[4]
    ); // For authorization
    this.minDate = new Date();
  }

  ngOnInit(): void {
    if (this.plPrivilege == 'admin') {
      this.adminPrivilege = true;
      this.displayedColumns = [
        "slNo",
        "School_UDISE_Code",
        "District",
        "Block",
        "Cluster",
        "School",
        "Management",
        "MDM_date",
        "MDM_served_or_not"
      ]; 
    }else{
      this.displayedColumns = [
        "slNo",
        "School_UDISE_Code",
        "District",
        "Block",
        "Cluster",
        "School",
        "Management",
        "MDM_date",
        "MDM_served_or_not"
      ]; 
    }
    const userProfile = this.commonService.getUserProfile();

    this.schoolEncId = userProfile?.school;
    this.userId = userProfile?.userId;
    this.loginId = userProfile?.loginId;
    this.schoolCategory = userProfile?.schoolCategory;
    this.district = userProfile?.district;
    this.block = userProfile?.block;
    this.cluster = userProfile?.cluster;
    this.userName = userProfile?.userName;
    this.loginUserTypeId = userProfile?.loginUserTypeId;

    if (userProfile.loginUserTypeId != 3) {
      this.permissionDiv = true;
    } else {
      this.permissionDiv = false;
    }
    this.getDistrict();
    this.loadAnnexturesData();
    this.initializationForm();
    // this.loadDailyConsuptionData(this.getSearchParams()); 
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.el.nativeElement.querySelector("[formControlName=districtId]").focus();
  }

  toggle() {
    this.show = !this.show;
    if (this.show)
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }
  onSearch() {
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.previousSize = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current datails
    this.dataSource.paginator = this.paginator; // update paginator
   
    if (this.dailyConsForm.invalid) {
      this.customValidators.formValidationHandler(this.dailyConsForm,this.allLabel, this.el);
    }
    if(this.dailyConsForm.valid === true && this.loginUserTypeId!=2 && this.dailyConsForm?.get("schoolId")?.value==""){
      const invalidControl = this.el.nativeElement.querySelector(
        '[formControlName="schoolId"]');
        invalidControl.focus();
       this.alertHelper.viewAlert("error","Invalid","School required");
      return;
    }
    if(this.dailyConsForm.valid === true){
      let fromDate = this.dailyConsForm?.get("searchfromDate")?.value;
      let toDate =  this.dailyConsForm?.get("searchtoDate")?.value;
      if(fromDate != "" && toDate!= ""){
        
        if (formatDate(fromDate,'yyyy-MM-dd','en_US') > formatDate(toDate,'yyyy-MM-dd','en_US')){
          this.alertHelper.viewAlert(
            "error",
            "Invalid",
            "From date can not be greater than to date."
            ); 
            return;
          } 
        }
      this.spinner.show();
      this.isSearch=true;
      this.loadDailyConsumptionData(this.getSearchParams());
    }

  //   if(schoolId == ""){
  //     this.alertHelper.viewAlert(
  //       "error",
  //       "Invalid",
  //       "School is required."
  //     ); 
  //     this.isSearch=false;
  //     // this.el.nativeElement.querySelector("[formControlName=schoolId]").focus();
  //     return;
  // }
  // else{
  //   this.isSearch=true;
  // }
   /*  if(fromDate == "" && toDate == ""){
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Please provide from date and to date."
        ); 
        this.isSearch=false;
        // this.el.nativeElement.querySelector("[formControlName=fromDate]").focus();
        return;
    }
    else{
      this.isSearch=true;
    } */
    

  }
  /* validateForm(): Boolean {
    if (this.districtId === "") {
      this.alertHelper.successAlert("", "Please select district.", "error");
      return false;
    }
  */
  loadAnnexturesData() {
    const anxTypes = [
      "SCHOOL_MANAGEMENT",
      // "SCHOOL_CATEGORY_TYPE",
    ];
    // this.anxData = this.commonFunction.getAnnextureData(anxTypes);
    let annextureData!: [];
    this.commonService.getCommonAnnexture(anxTypes, true).subscribe({
      next: (res: any) => {
        annextureData = res?.data;
        this.managementList = res?.data?.SCHOOL_MANAGEMENT;
        // this.socialCategoryList = res?.data?.SCHOOL_CATEGORY_TYPE;
      },
    });
  }
  initializationForm() {
    this.dailyConsForm = this.formBuilder.group({
      districtId: [this.districtId, [Validators.required,Validators.pattern('^[0-9]*$')]],
      blockId: [this.blockId, [Validators.required,Validators.pattern('^[0-9]*$')]],
      clusterId: [this.clusterId, [Validators.required,Validators.pattern('^[0-9]*$')]],
      schoolId: [this.schoolId],
      schoolEncId: [this.schoolEncId],
      searchfromDate: [this.searchfromDate,[Validators.required]],
      searchtoDate: [this.searchfromDate,Validators.required],
      managementId: [this.managementId, [Validators.pattern('^[0-9]*$')]],
    })
  }
  getDistrict() {
    this.scDisrtictSelect = false;
    this.scDisrtictLoading = true;
    this.commonService.getAllDistrict().subscribe((data: any) => {
      this.districtData = data;
      this.districtData = this.districtData.data;

      if (this.userProfile.district != 0 || this.userProfile.district != "") {
        this.searchDistrictData = this.districtData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        this.dailyConsForm.controls["districtId"]?.patchValue(
          this.userProfile.district
        );
        this.getBlock(this.userProfile.district);
      } else {
        this.searchDistrictData = this.districtData;
        this.scDisrtictSelect = true;
      }

      this.blockId = "";
      this.scDisrtictLoading = false;
    });
  }
  getBlock(districtId: any) {
    this.scBlockSelect = false;
    this.scBlockLoading = true;

    this.searchBlockData = [];
    this.dailyConsForm.controls["blockId"]?.patchValue("");

    this.clusterData = [];
    this.dailyConsForm.controls["clusterId"]?.patchValue("");

    this.getSchoolData = [];
    this.dailyConsForm.controls["schoolId"]?.patchValue("");

    if (districtId !== "") {
      this.commonService
        .getBlockByDistrictid(districtId)
        .subscribe((res: any) => {
          this.searchBlockData = res;
          this.searchBlockData = this.searchBlockData.data;

          if (this.userProfile.block != 0 || this.userProfile.block != "") {
            this.searchBlockData = this.searchBlockData.filter((blo: any) => {
              return blo.blockId == this.userProfile.block;
            });
            this.dailyConsForm.controls["blockId"]?.patchValue(
              this.userProfile.block
            );
            this.getCluster(this.userProfile.block);
          } else {
            this.scBlockSelect = true;
          }
          this.scBlockLoading = false;
        });
    } else {
      this.scBlockSelect = true;
      this.scBlockLoading = false;
    }
  }
  getCluster(blockId: any) {
    this.scClusterSelect = false;
    this.scClusterLoading = true;

    this.clusterData = [];
    this.dailyConsForm.controls["clusterId"]?.patchValue("");

    this.getSchoolData = [];
    this.dailyConsForm.controls["schoolId"]?.patchValue("");

    if (blockId !== "") {
      this.commonService.getClusterByBlockId(blockId).subscribe((res: any) => {
        this.clusterData = res;
        this.clusterData = this.clusterData.data;

        if (this.userProfile.cluster != 0 || this.userProfile.cluster != "") {
          this.clusterData = this.clusterData.filter((clu: any) => {
            return clu.clusterId == this.userProfile.cluster;
          });
          this.dailyConsForm.controls["clusterId"]?.patchValue(
            this.userProfile.cluster
          );
          this.getSchool(this.userProfile.cluster);
        } else {
          this.scClusterSelect = true;
        }
        this.scClusterLoading = false;
      });
    } else {
      this.scClusterSelect = true;
      this.scClusterLoading = false;
    }
  }
  getSchool(clusterId: any) {
    this.scSchoolSelect = false;
    this.scSchoolLoading = true;

    this.getSchoolData = [];
    this.dailyConsForm.controls["schoolId"]?.patchValue("");

    if (clusterId !== "") {
      this.commonService.getSchoolList(clusterId).subscribe((res: any) => {
        this.getSchoolData = res;
        this.getSchoolData = this.getSchoolData.data;

        if (
          this.userProfile.udiseCode != 0 ||
          this.userProfile.udiseCode != ""
        ) {
          this.getSchoolData = this.getSchoolData.filter((sch: any) => {
            return sch.schoolUdiseCode == this.userProfile.udiseCode;
          });
          this.dailyConsForm.controls["schoolId"]?.patchValue(
            this.getSchoolData[0].schoolId
          );
        } else {
          this.scSchoolSelect = true;
        }
        this.scSchoolLoading = false;
      });
    } else {
      this.scSchoolSelect = true;
      this.scSchoolLoading = false;
    }
  }
  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
     
      fromDate: this.commonFunctionHelper.formatDateHelper(new Date(this.dailyConsForm?.controls['searchfromDate'].value)),
      toDate: this.commonFunctionHelper.formatDateHelper(new Date(this.dailyConsForm?.controls['searchtoDate'].value)),
      managementId:this.dailyConsForm.get('managementId')?.value,
      // category: this.dailyConsForm.get('category')?.value,
      clusterId: (this.cluster == 0) ? this.dailyConsForm.get('clusterId')?.value : this.cluster,
      districtId: (this.district == 0) ? this.dailyConsForm.get('districtId')?.value : this.district,
      blockId: (this.block == 0) ? this.dailyConsForm.get('blockId')?.value : this.block,
      schoolId:this.dailyConsForm.get('schoolId')?.value,
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
    // this.loadDailyConsuptionData(this.getSearchParams());
  }

  loadDailyConsumptionData(...params: any){
    // this.spinner.show();
    const {
      previousSize,
      offset,
      pageSize,
      managementId,
      districtId,
      blockId,
      clusterId,
      schoolId,
      fromDate,
      toDate,
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      managementId:managementId,
      districtId:districtId,
      blockId:blockId,
      clusterId:clusterId,
      schoolId:schoolId,
      fromDate:fromDate,
      toDate:toDate,
      serviceType: this.serviceType, 
      userId: this.userId,
      schoolEncId: this.schoolEncId,
      // clusterId:this.cluster
     
    };
    this.isLoading = true;
    this.manageDailyConsumptionreportService.loadDailyConsumptionData(this.paramObj).subscribe({
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
  downloadDailyConsuptionDetailList()
  {
    this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.manageDailyConsumptionreportService.loadDailyConsumptionData(this.paramObj).subscribe({
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

  printPage()
  {
    let cloneTable 	= document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }

  getStudentMdmReceived(schoolId:any,attendanceDate:Date,schoolUdiseCode:any){
this.schoolUdiseCode=schoolUdiseCode;
    this.manageDailyConsumptionreportService.getStudentMdmReceived(schoolId,attendanceDate,schoolUdiseCode,this.academicYear).subscribe({
      next: (res: any) => {       
      this.dailyConsuptionData = res?.data;
      },
    })
  }

}
