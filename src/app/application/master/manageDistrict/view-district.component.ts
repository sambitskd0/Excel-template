import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {  Router } from "@angular/router";
import { ManageDistrictService } from "../services/manage-district.service";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { NgxSpinnerService } from "ngx-spinner";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { environment } from 'src/environments/environment';
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { CustomValidators } from "src/app/shared/validations/custom-validators";

@Component({
  selector: "app-view-district",
  templateUrl: "./view-district.component.html",
  styleUrls: ["./view-district.component.css"],
})
export class ViewDistrictComponent implements OnInit {
  public fileUrl = environment.filePath;
  displayTable: boolean = false;
  districtSearchform!: FormGroup;
  districts: any;
  district: any;
  select_all = false;
  isEmpty: boolean = false;
  districtName: any = "";
  districtCode: any = "";
  userId: any;
  profileId: any;
  userProfile: any = [];
  isLoading = false;
  isNorecordFound: boolean = false;
  pageIndex: any = 0;
  previousSize: any = 0;
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
  displayedColumns: string[] = [];
  adminPrivilege: boolean = false;
  // define mat table columns

  resultListData: any = [];
  questionDetailsData!: any;
  dataSource = new MatTableDataSource(this.resultListData);
  //end
  paramObj: any; 
  serviceType: string = "Search";
  constructor(
    public manageDistrictService: ManageDistrictService,
    public customValidators: CustomValidators,
    private formBuilder: FormBuilder,
    private router:Router,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    public commonserviceService: CommonserviceService,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private el:ElementRef,
  ) {  
    const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;
    
  }

  ngOnInit(): void {
    this.spinner.show();
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
      this.displayedColumns = [
        "slNo",
        "district_name",
        "district_code",
        "action",
      ]; 
    } else {
      this.displayedColumns = [
        "slNo",
        "district_name",
        "district_code"
      ]; 
    }

    this.loadDistrict(this.getSearchParams());
    this.initializeForm(); 
    this.el.nativeElement.querySelector("[formControlName=districtName]").focus();   
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  initializeForm(){
    this.districtSearchform = this.formBuilder.group({
      districtName: [this.districtName,[Validators.maxLength(3),Validators.minLength(25),this.customValidators.firstCharValidatorRF]],
      districtCode: [this.districtCode,[Validators.maxLength(4),Validators.minLength(1),this.customValidators.firstCharValidatorRF]],
    });
  }
  deleteDist(id: number) {
      const users = this.commonserviceService.getUserProfile();
      this.userId = users?.userId;
      this.profileId = users?.profileId;
      this.alertHelper
        .deleteAlert("Do you want to delete this record ?", "", "question", "Yes, delete it!")
        .then((result) => {
          if (result.value) {
            this.spinner.show();
            this.isLoading = true;
            this.manageDistrictService
              .deleteDistrict(id, this.userId,this.profileId)
              .subscribe({
                next: (res: any) => {
                  if (res?.success === true) {
                    this.alertHelper.successAlert(
                      "Deleted!",
                      "Selected district record deleted.",
                      "success"
                    );
                    this.loadDistrict(this.getSearchParams());
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
  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      districtName: this.districtSearchform?.get("districtName")?.value,
      districtCode: this.districtSearchform?.get("districtCode")?.value,
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
    this.loadDistrict(this.getSearchParams());
  }
  onSearch() {
    // reset queryParams
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.previousSize = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    this.loadDistrict(this.getSearchParams());
  }
  loadDistrict(...params: any) {
    this.spinner.show();
    const {
      previousSize,
      offset,
      pageSize,
      districtName,
      districtCode,
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      districtName: districtName,
      districtCode: districtCode,
      serviceType: this.serviceType, 
      userId: this.userId
     
    };
    this.isLoading = true;
    this.manageDistrictService.viewDistrict(this.paramObj).subscribe({
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
  downloadDistrictList()
  {
    this.spinner.show();   
    this.paramObj.serviceType = "Download";
 this.manageDistrictService.viewDistrict(this.paramObj).subscribe({
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

