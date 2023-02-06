import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { NgxSpinnerService } from 'ngx-spinner';
import { RaiseGrievanceService } from 'src/app/application/grievance/services/raise-grievance.service';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CommonFunctionHelper } from 'src/app/core/helpers/common-function-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { environment } from 'src/environments/environment';
import { LibraryService } from '../../services/library.service';

@Component({
  selector: 'app-view-book-opening-stock',
  templateUrl: './view-book-opening-stock.component.html',
  styleUrls: ['./view-book-opening-stock.component.css']
})
export class ViewBookOpeningStockComponent implements OnInit {
  public fileUrl = environment.filePath;
  public show:boolean = true;
  public buttonName:any = 'Show';
  bkType: any =[];
  bkTypeChanged: boolean = false;  
  annextureResults: any ="";
  @ViewChild("searchForm") searchForm!: NgForm;
  public userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');
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
  viewBookData: any = [];
  dataSource = new MatTableDataSource(this.viewBookData);
  //end
  userId:any="";
  paramObj: any; 
  serviceType: string = "Search";
  isLoading = false;
  pageIndex: any = 0;
  previousSize: any = 0;

  searchAcademicYear:any = "";
  searchDistrictId:any = "";
  searchBlockId:any = "";
  searchClusterId:any = "";
  searchSchoolId:any = "";
  searchFromDate:any = "";
  searchToDate:any = "";
  searchBillNo:any = "";

  
  scDisrtictSelect:boolean = true; 
  scDisrtictLoading:boolean = false; 
  scBlockSelect:boolean = true; 
  scBlockLoading:boolean = false; 
  scClusterSelect:boolean = true;
  scClusterLoading:boolean = false;
  scSchoolSelect:boolean = true;
  scSchoolLoading:boolean = false; 

  searchDistrictData: any = [];
  searchBlockData: any = [];
  clusterData:any="";
  getSchoolData: any="";
  sessionBlockId: any = this.userProfile.block != 0 ? this.userProfile.block : "";
 
  districtData: any = [];
  blockChanged: boolean = false;
  blockData: any = [];

  plPrivilege: string = "admin"; //For menu privilege  
  isNorecordFound: boolean = false;
  isInitAdmin: boolean = false;
  bookList:any =[];
  bookTypeData:any =[];
   maxDate: any = Date; 
   config = new Constant();
   adminPrivilege: boolean = false;
  academicYear: any = this.config.getAcademicCurrentYear();
  constructor(
    private el: ElementRef,
    private router: Router,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    public commonService: CommonserviceService,
    private spinner: NgxSpinnerService,
    private raiseGrievanceService: RaiseGrievanceService,
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private librararyService: LibraryService,
    private commonFunctionHelper: CommonFunctionHelper,
    private alertHelper: AlertHelper) { 
      const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization 
      this.maxDate = new Date();
      const users = this.commonService.getUserProfile();
      this.userId = users?.userId;}

  ngOnInit(): void {
    // this.spinner.show();
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
      this.displayedColumns = [
        "slNo",
        "academicYear",
        "receivedFrom",
        "billNo", 
        "recvDate",
        "details",
        "Action",  
      ]; 
    } else {
      this.displayedColumns = [
        "slNo",
        "academicYear",
        "receivedFrom",
        "billNo", 
        "recvDate",
        "details",
      ]; 
    }
    this.searchAcademicYear=this.academicYear;
    if(this.userProfile.loginUserTypeId != 3){
      this.viewBookOpeningStockData(this.getSearchParams());
    }else{
      this.isInitAdmin = true;
    }
    this.getDistrict();  
    this.getAnnextureData(); 
    
  }
  ngAfterViewInit() {
    // this.el.nativeElement.querySelector("[formControlName=searchBillNo]")?.focus();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
 
  getAnnextureData() {
    this.commonService
      .getCommonAnnexture(["BOOK_TYPE"])
      .subscribe({
        next: (res: any) => {          
          this.spinner.hide();
          this.annextureResults = res;
          this.bkType = res?.data?.BOOK_TYPE; 
          this.bkType.forEach((value:any) => {       
           
            this.bookTypeData[value.anxtValue] = value.anxtName;                
        });                   
        },
      });
  }
  getDistrict(){   
    this.scDisrtictSelect = false;
    this.scDisrtictLoading = true;
    this.commonService.getAllDistrict().subscribe((data:any)=>{
      this.districtData = data;
      this.districtData = this.districtData.data; 
      
      if(this.userProfile.district != 0 || this.userProfile.district != ""){
        this.searchDistrictData = this.districtData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        this.searchForm.controls['searchDistrictId']?.patchValue(this.userProfile.district);
        this.getBlock(this.userProfile.district);
      }
      else{
        this.searchDistrictData = this.districtData;
        this.scDisrtictSelect = true;
      }

      this.searchBlockId='';      
      this.scDisrtictLoading = false;
    });
    
  }

  getBlock(districtId: any) { 
    this.scBlockSelect = false;
    this.scBlockLoading = true;

    this.searchBlockData = [];
    this.searchForm.controls['searchBlockId']?.patchValue('');

    this.clusterData = [];
    this.searchForm.controls['searchClusterId']?.patchValue('');

    this.getSchoolData = [];    
    this.searchForm.controls['searchSchoolId']?.patchValue('');

    if(districtId !== ''){  
      this.commonService.getBlockByDistrictid(districtId).subscribe((res: any) => {      
        this.searchBlockData = res;
        this.searchBlockData = this.searchBlockData.data; 

        if(this.userProfile.block != 0 || this.userProfile.block != ""){
          this.searchBlockData = this.searchBlockData.filter((blo: any) => {
            return blo.blockId == this.userProfile.block;
          });
          this.searchForm.controls['searchBlockId']?.patchValue(this.userProfile.block);
          this.getCluster(this.userProfile.block);
        }
        else{
          this.scBlockSelect = true; 
        }   
        this.scBlockLoading = false;         
      });
    } else{      
      this.scBlockSelect = true; 
      this.scBlockLoading = false;         
    }       
  }

  getCluster(blockId: any) {      
    this.scClusterSelect = false;
    this.scClusterLoading = true;

    this.clusterData = [];
    this.searchForm.controls['searchClusterId']?.patchValue('');

    this.getSchoolData = [];    
    this.searchForm.controls['searchSchoolId']?.patchValue('');   

    if(blockId !== ''){  
      this.commonService.getClusterByBlockId(blockId).subscribe((res: any) => {      
        this.clusterData = res;
        this.clusterData = this.clusterData.data;
        
        if(this.userProfile.cluster != 0 || this.userProfile.cluster != ""){
          this.clusterData = this.clusterData.filter((clu: any) => {
            return clu.clusterId == this.userProfile.cluster;
          });
          this.searchForm.controls['searchClusterId']?.patchValue(this.userProfile.cluster);
          this.getSchool(this.userProfile.cluster);
        }
        else{
          this.scClusterSelect = true; 
        }  
        this.scClusterLoading = false;
      });      
    }else{
      this.scClusterSelect = true; 
      this.scClusterLoading = false;
    }   
  }

  getSchool(clusterId:any){ 
    this.scSchoolSelect = false;
    this.scSchoolLoading = true;

    this.getSchoolData = [];    
    this.searchForm.controls['searchSchoolId']?.patchValue('');

    if(clusterId !== ''){  
      this.commonService.getSchoolList(clusterId).subscribe((res:any) => {      
        this.getSchoolData = res;
        this.getSchoolData = this.getSchoolData.data;

        if(this.userProfile.udiseCode != 0 || this.userProfile.udiseCode != ""){
          this.getSchoolData = this.getSchoolData.filter((sch: any) => {
            return sch.schoolUdiseCode == this.userProfile.udiseCode;
          });
          this.searchForm.controls['searchSchoolId']?.patchValue(this.getSchoolData[0].schoolId);
        }
        else{
          this.scSchoolSelect = true; 
        }  
        this.scSchoolLoading = false;
      });
    }else{
      this.scSchoolSelect = true; 
      this.scSchoolLoading = false;
    }
  }
  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(), 
      searchAcademicYear: this.searchAcademicYear,
      searchDistrictId: this.searchDistrictId,
      searchBlockId: this.searchBlockId,
      searchClusterId: this.searchClusterId,
      searchSchoolId: this.searchSchoolId, 
      searchFromDate: (this.searchFromDate) ? this.commonFunctionHelper.formatDateHelper(this.searchFromDate):this.searchFromDate,
      searchToDate: (this.searchToDate)?this.commonFunctionHelper.formatDateHelper(this.searchToDate):this.searchToDate,
      searchBillNo: this.searchBillNo, 

    };
  }
  viewBookOpeningStockData(...params: any) {
    
    const {
      previousSize,
      offset,
      pageSize, 
      searchDistrictId,
      searchBlockId,
      searchClusterId,
      searchSchoolId,
      searchAcademicYear,
      searchFromDate,
      searchToDate,
      searchBillNo
    } = params[0];
    this.paramObj = {
      offset: offset,
      limit: pageSize,
      //userId:this.userProfile.userId,
      loginUserType:this.userProfile.loginUserType,
      schoolId:this.userProfile.school,
      searchDistrictId:searchDistrictId,
      searchBlockId:searchBlockId,
      searchClusterId:searchClusterId,
      searchSchoolId:searchSchoolId,
      searchAcademicYear:searchAcademicYear,
      searchFromDate:searchFromDate,
      searchToDate:searchToDate,
      searchBillNo:searchBillNo,
      serviceType: this.serviceType, 
      userId: this.userId
     
      
    };
   
    if(this.compareDate()){
    this.isLoading = true;
    this.spinner.show();
    this.librararyService.viewBookOpeningStockData(this.paramObj).subscribe({
      next: (res: any) => {
        this.viewBookData.length = previousSize; // set current size
        this.viewBookData.push(...res?.data); // merge with existing data
        this.viewBookData.length = res?.totalRecord; // update length
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
        this.isNorecordFound = this.viewBookData.length ? false : true;
        this.isLoading = false;
        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
      
    });
  }
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
    this.viewBookOpeningStockData(this.getSearchParams());
  }
  onSearch(){
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.previousSize = 0;   
      if (this.validateForm() === true) {
        // this.spinner.show();
        this.viewBookOpeningStockData(this.getSearchParams());
        this.isInitAdmin = false;
      }
    
  }
  validateForm() :Boolean{
    
    if (this.searchDistrictId === "") {
      this.alertHelper.successAlert(
        "",
        "Please select District.",
        "info"
      );
      return false;
    }
    if (this.searchBlockId === "") {
      this.alertHelper.successAlert(
        "",
        "Please select Block.",
        "info"
      );
      return false;
    }
   /*  if (this.searchClusterId === "") {
      this.alertHelper.successAlert(
        "",
        "Please select Cluster.",
        "info"
      );
      return false;
    } */
    if (this.searchSchoolId === "") {
      this.alertHelper.successAlert(
        "",
        "Please select School.",
        "info"
      );
      return false;
    }
    
    return true;
    
  }
  toggle() {
    this.show = !this.show;
    if (this.show)
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }
  onDelete(encId: string) {   
    this.alertHelper
    .deleteAlert("Are you sure to delete?", "", "question", "Yes, delete it!")
    .then((result) => {
      if (result.value) {
        this.spinner.show(); // ==== show spinner
        let paramList : any = { encId:encId, updatedBy : this.userProfile?.userId,schoolId:this.userProfile?.school, profileId : this.userProfile?.profileId};
        this.spinner.show();
        this.isLoading = true;
        this.librararyService.deleteBookOpeningStock(paramList).subscribe({
          next: (res: any) => {
            if (res?.success === true) {
              this.alertHelper.successAlert(
                "Deleted!",
                "Opening stock deleted successfully",
                "success"
              );
              this.viewBookOpeningStockData(this.getSearchParams());
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
  showAssetList(encId:string,schoolId:string){    
    this.spinner.show();
    this.librararyService.getOpeningStockList(encId,schoolId).subscribe({
      next: (resp: any) => {
        this.bookList = resp.data;
        this.spinner.hide();
      },
    });
  }
  printPage() {
    let cloneTable 	= document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }
  downloadBookOpeningStockList()
  {
    this.spinner.show();   
    this.paramObj.serviceType = "Download";
 this.librararyService.viewBookOpeningStockData(this.paramObj).subscribe({
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
  compareDate() {
    let sd = this.searchFromDate;
    let ed = this.searchToDate;
    if (sd != "" && ed != "") {
      if (new Date(ed) < new Date(sd)) {
        // const invalidControl = this.el.nativeElement.querySelector(
        //   '[formControlName="endDate"]'
        // );
        // invalidControl.focus();
        this.alertHelper.viewAlertHtml(
          "error",
          "Invalid inputs",
          "From date should not be less than To date."
        );
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
  
}
