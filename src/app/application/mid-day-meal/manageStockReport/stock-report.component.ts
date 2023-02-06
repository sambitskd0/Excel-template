import { formatDate } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CommonFunctionHelper } from 'src/app/core/helpers/common-function-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { environment } from 'src/environments/environment';
import { ManageStockReportService } from '../services/manage-stock-report.service';
import { SchoolService } from '../../school/services/school.service';

@Component({
  selector: 'app-stock-report',
  templateUrl: './stock-report.component.html',
  styleUrls: ['./stock-report.component.css']
})
export class StockReportComponent implements OnInit {
  stockReportForm!: FormGroup;
  public fileUrl = environment.filePath;
  
  public show:boolean = true;
  public buttonName:any = 'Show';
 
  permissionDiv: boolean    = false;
  divShow: boolean          = false;
  isLoading: boolean        = false;
  isNorecordFound: boolean  = false;
  isSearch: boolean         = false;


  searchDistrictData: any   = [];
  districtData: any         = [];
  searchBlockData: any      = [];
  clusterData: any          = [];
  getSchoolData: any        = [];
  socialCategoryList: any   = [];
  managementList: any       = [];
  dailyConsuptionData: any  = [];
  schoolCatData: any        = [];
  searchSchoolCatData: any  = [];

  scDisrtictSelect: boolean       = true;
  scDisrtictLoading: boolean      = false;
  scBlockSelect: boolean          = true;
  scBlockLoading: boolean         = false;
  scClusterSelect: boolean        = true;
  scClusterLoading: boolean       = false;
  scSchoolSelect: boolean         = true;
  scSchoolLoading: boolean        = false;
  scSchoolCatSelect: boolean         = true;
  scSchoolCatLoading: boolean        = false;
  
  
  plPrivilege: string       = "";

  //user profile variables
  district: any             = ""; 
  block: any                = "";
  cluster: any              = "";
  userName: any             = "";
  schoolId: any             = "";
  schoolCategory: any       = "";
  userId: any               = "";
  loginId: any              = "";

  districtName: any         = "";
  districtCode: any         = "";
  blockName: any            = "";
  blockCode: any            = "";
  clusterName: any          = "";
  clusterCode: any          = "";

  allLabel: string[]          = ["District name","Block name","Cluster name","School name","","Management","From date","To date","Category","Stock Report"];

  //form control name initialization
  districtId: any                 = "";
  blockId: any                    = "";
  clusterId: any                  = "";
  managementId: any               = "";
  loginUserTypeId: any            = "";
  searchfromDate: any             = "";
  searchtoDate: any               = "";
  management: any                 = "";
  category: any                   = "";
  stockReport: any                = "";
  schoolEncId: any                = "";
  
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
  public userProfile = this.commonService.getUserProfile();
  academicYear: any = this.config.getAcademicCurrentYear();
  maxDate: any = Date; 
  minDate: any = Date; 
  
  constructor(
    private commonFunctionHelper: CommonFunctionHelper,
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    public customValidator: CustomValidators,
    private spinner: NgxSpinnerService,
    public commonService: CommonserviceService,
    public manageStockReportService: ManageStockReportService,
    public schoolService: SchoolService,
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
        "District",
        "Block",
        "Cluster",
        "School",
        "Management",
        "RiceStock",
      ]; 
    }else{
      this.displayedColumns = [
        "slNo",
        "District",
        "Block",
        "Cluster",
        "School",
        "Management",
        "RiceStock",
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
    this.loginUserTypeId = userProfile?.loginUserTypeId;

    // if (userProfile.loginUserTypeId != 3) {
    //   this.permissionDiv = true;
    // } else {
    //   this.permissionDiv = false;
    // }
    this.getDistrict();
    // this.getLoginUserDetails(this.cluster);
    this.loadAnnexturesData();
    this.initializationForm();
    this.getSchCategory();
    if(this.loginUserTypeId == 2){
    this.loadStockDatas(this.getSearchParams()); 
    this.isSearch = true;
    }
  }

  ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.el.nativeElement.querySelector("[formControlName=districtId]").focus();  
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
        this.stockReportForm.controls["districtId"]?.patchValue(
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
    this.stockReportForm.controls["blockId"]?.patchValue("");

    this.clusterData = [];
    this.stockReportForm.controls["clusterId"]?.patchValue("");

    this.getSchoolData = [];
    this.stockReportForm.controls["schoolId"]?.patchValue("");

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
            this.stockReportForm.controls["blockId"]?.patchValue(
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
    this.stockReportForm.controls["clusterId"]?.patchValue("");

    this.getSchoolData = [];
    this.stockReportForm.controls["schoolId"]?.patchValue("");

    if (blockId !== "") {
      this.commonService.getClusterByBlockId(blockId).subscribe((res: any) => {
        this.clusterData = res;
        this.clusterData = this.clusterData.data;

        if (this.userProfile.cluster != 0 || this.userProfile.cluster != "") {
          this.clusterData = this.clusterData.filter((clu: any) => {
            return clu.clusterId == this.userProfile.cluster;
          });
          this.stockReportForm.controls["clusterId"]?.patchValue(
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
    this.stockReportForm.controls["schoolId"]?.patchValue("");

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
          this.stockReportForm.controls["schoolId"]?.patchValue(
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
  getSchCategory() {
    this.scSchoolCatSelect = false;
    this.scSchoolCatLoading = true;
    this.schoolService.getSchoolCategory().subscribe((res: any) => {
      // this.schoolCatData = data;
      this.schoolCatData = res?.data;

      if (this.userProfile.schoolCategory != 0 || this.userProfile.schoolCategory != "") {
        this.searchSchoolCatData = this.schoolCatData.filter((dis: any) => {
          return dis.schlCatId == this.userProfile.schoolCategory;
        });
        this.stockReportForm.controls["category"]?.patchValue(
          this.userProfile.category
        );
        // this.getBlock(this.userProfile.district);
      } else {
        this.searchSchoolCatData = this.schoolCatData;
        this.scSchoolCatSelect = true;
      }
      this.blockId = "";
      this.scSchoolCatLoading = false;
    });
  }

  loadAnnexturesData() {
  const anxTypes = [
    "SCHOOL_MANAGEMENT",
    "SCHOOL_CATEGORY_TYPE",
  ];
  // this.anxData = this.commonFunction.getAnnextureData(anxTypes);
  let annextureData!: [];
  this.commonService.getCommonAnnexture(anxTypes,true).subscribe({
    next: (res: any) => {
      annextureData = res?.data;
      this.managementList = res?.data?.SCHOOL_MANAGEMENT;
      this.socialCategoryList = res?.data?.SCHOOL_CATEGORY_TYPE;
    },
  });
}
/* getSchoolCategory(){
  this.schoolService.getSchoolCategory().subscribe({
    next: (res: any) => {
      this.schoolCatData = res?.data;
      
    }
  });
} */
  initializationForm(){
    this.stockReportForm = this.formBuilder.group({
      districtId: [this.districtId, [Validators.required,Validators.pattern('^[0-9]*$')]],
      blockId: [this.blockId, [Validators.required,Validators.pattern('^[0-9]*$')]],
      clusterId: [this.clusterId, [Validators.required,Validators.pattern('^[0-9]*$')]],
      schoolId: [this.schoolId],
      schoolEncId: [this.schoolEncId],
      management:[this.management,[Validators.pattern('^[0-9]*$')],],
      searchfromDate:[this.searchfromDate],
      searchtoDate:[this.searchfromDate],
      category:[this.category,[Validators.pattern('^[0-9]*$')]],
      stockReport:[this.stockReport,[Validators.pattern('^[0-9]*$')]],
    })
  }
  toggle() {
    console.log("hi");
    this.show = !this.show;
    if (this.show)
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }

  /* getLoginUserDetails(clusterId:any){
    this.spinner.show();
    this.manageStockReportService.getLoginUserDetails(clusterId).subscribe((data: any) => {
     this.clusterData = data?.data                    
     this.districtName = this.clusterData?.districtName;
     this.districtCode = this.clusterData?.districtCode;
     this.blockName = this.clusterData?.blockName;
     this.blockCode = this.clusterData?.blockCode;
     this.clusterName = this.clusterData?.clusterName;
     this.clusterCode = this.clusterData?.clusterCode;
      this.initializationForm();
      this.spinner.hide();
    });
  } */
  
  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),

      districtId: (this.district == 0) ? this.stockReportForm.get('districtId')?.value : this.district,
      blockId: (this.block == 0) ? this.stockReportForm.get('blockId')?.value : this.block,
      clusterId: (this.cluster == 0) ? this.stockReportForm.get('clusterId')?.value : this.cluster,
      schoolId:this.stockReportForm.get('schoolId')?.value,
      fromDate: this.commonFunctionHelper.formatDateHelper(new Date(this.stockReportForm?.controls['searchfromDate'].value)),
      toDate: this.commonFunctionHelper.formatDateHelper(new Date(this.stockReportForm?.controls['searchtoDate'].value)),
      management:this.stockReportForm.get('management')?.value,
      category: this.stockReportForm.get('category')?.value,
      stockReport: this.stockReportForm.get('stockReport')?.value,
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
    this.loadStockDatas(this.getSearchParams());
  }
  onSubmit(){
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.previousSize = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
   
    if (this.stockReportForm.invalid) {
      // this.customValidators.formValidationHandler(this.stockReportForm,this.allLabel, this.el);
      this.customValidators.formValidationHandler(
        this.stockReportForm,
        this.allLabel,
        this.el,
        {
          required: {
            districtId: "Please select district",
            blockId: "Please select block",
            clusterId: "Please select cluster",
          },
        }
      );
    }
    // if(this.stockReportForm.valid === true && this.loginUserTypeId!=2 && this.stockReportForm?.get("schoolId")?.value==""){
    //   const invalidControl = this.el.nativeElement.querySelector(
    //     '[formControlName="schoolId"]');
    //     invalidControl.focus();
    //    this.alertHelper.viewAlert("error","Invalid","School is required");
    //   return;
    // }
    if(this.stockReportForm.valid === true){
      let fromDate = this.stockReportForm?.get("searchfromDate")?.value;
      let toDate =  this.stockReportForm?.get("searchtoDate")?.value;
      if (fromDate != "" && toDate== ""){
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Choose  to date."
          ); 
          return;
        }else if (fromDate == "" && toDate!= ""){
          this.alertHelper.viewAlert(
            "error",
            "Invalid",
            "Choose From  date."
            ); 
            return;
          }else if(fromDate != "" && toDate!= ""){
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
       this.loadStockDatas(this.getSearchParams());
    }
 }
  loadStockDatas(...params: any){
    this.spinner.show();
    const {
      previousSize,
      offset,
      pageSize,
      districtId,
      blockId,
      clusterId,
      schoolId,
      management,
      fromDate,
      toDate,
      category,
      stockReport,
      academicYear
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      districtId:districtId,
      blockId:blockId,
      clusterId:clusterId,
      schoolId:schoolId,
      management:management,
      fromDate:fromDate,
      toDate:toDate,
      category:category,
      stockReport:stockReport,
      serviceType: this.serviceType, 
      userId: this.userId,
      schoolEncId: this.schoolEncId,
      academicYear: this.academicYear,
     
    };
    this.isLoading = true;
    this.manageStockReportService.loadStockDatas(this.paramObj).subscribe({
      next: (res: any) => {
        //  console.log(res?.data);
        
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
  downloadStockDetailList()
  {
    this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.manageStockReportService.loadStockDatas(this.paramObj).subscribe({
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
