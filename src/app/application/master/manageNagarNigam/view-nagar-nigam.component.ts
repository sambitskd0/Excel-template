import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { MatTableExporterDirective } from "mat-table-exporter";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { Constant } from "src/app/shared/constants/constant";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { environment } from "src/environments/environment";
import { ManagenagarnigamService } from "../services/managenagarnigam.service";

@Component({
  selector: "app-view-nagar-nigam",
  templateUrl: "./view-nagar-nigam.component.html",
  styleUrls: ["./view-nagar-nigam.component.css"],
})
export class ViewNagarNigamComponent implements OnInit {
  public fileUrl = environment.filePath;
  nagarNigamSearchform!: FormGroup;
  nagarNigamDatas: any;
  distdata: any;
  panchayatName: any='';
  allDistrict: any;
  isEmpty: boolean = false;
  filterChanged: boolean = false;
  showSpinnerBlock: boolean = false;
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
  adminPrivilege: boolean = false;
  displayedColumns: string[] = []; // define mat table columns

  resultListData: any = [];
  questionDetailsData!: any;
  dataSource = new MatTableDataSource(this.resultListData);
  //end
  paramObj: any; 
  serviceType: string = "Search";
  constructor(
    private fb: FormBuilder,
    private managenagarnigamService: ManagenagarnigamService,
    public commonserviceService: CommonserviceService,
    public customValidators: CustomValidators, 
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router: Router,
    private alertHelper: AlertHelper,
    private el:ElementRef,
    private spinner: NgxSpinnerService
  ) { const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;}

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
      this.displayedColumns = [
        "slNo",
        "district",
        "block",
        "type",
        "muncipality_panchayatName",
        "muncipality_panchayatCode",
        "Action",
      ]; 
    } else {
      this.displayedColumns = [
        "slNo",
        "district",
        "block",
        "type",
        "muncipality_panchayatName",
        "muncipality_panchayatCode",
      ]; 
    }
    this.userProfile = this.commonserviceService.getUserProfile();
    this.loadNagarNigam(this.getSearchParams());
    this.getDistrict();
    this.initializeForm();
    this.el.nativeElement.querySelector("[formControlName=nagarType]").focus();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    //console.log(this.dataSource);
  }
  initializeForm() {
    this.nagarNigamSearchform = this.fb.group({
      nagarType: [""],
      districtId: [""],
      panchayatName: [this.panchayatName,[Validators.pattern('^[a-zA-Z \-\']+'),Validators.maxLength(40),Validators.minLength(2),this.customValidators.firstCharValidatorRF]]
    });
  }
  getDistrict() {
      this.commonserviceService.getAllDistrict().subscribe((data: []) => {
        this.distdata = data;
        this.allDistrict = this.distdata.data;
      });
  }
  loadNagarNigam(...params: any) {
    this.spinner.show(); // ==== show spinner
    const {
      previousSize,
      offset,
      pageSize,
      nagarType,
      districtId,
      panchayatName,
    } = params[0];

    this. paramObj = {
      offset: offset,
      limit: pageSize,
      nagarType: nagarType,
      districtId: districtId,
      panchayatName: panchayatName,
      serviceType: this.serviceType, 
      userId: this.userId
    };
    this.isLoading = true;
    this.managenagarnigamService.getAllNagarNigam(this.paramObj).subscribe({
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
  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      nagarType: this.nagarNigamSearchform?.get("nagarType")?.value,
      districtId: this.nagarNigamSearchform?.get("districtId")?.value,
      panchayatName: this.nagarNigamSearchform?.get("panchayatName")?.value,
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
    this.loadNagarNigam(this.getSearchParams());
  }
  onSearch() {
    // reset queryParams
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.previousSize = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    this.loadNagarNigam(this.getSearchParams());
  }
  deleteNagarnigam(id: number) {
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.alertHelper
      .deleteAlert("Are you sure to delete?", "", "question", "Yes, delete it!")
      .then((result) => {
        if (result.value) {
          this.spinner.show();
          this.isLoading = true;
          this.managenagarnigamService
            .deleteNagarnigam(id, this.userId,this.profileId)
            .subscribe({
              next: (res: any) => {
                if (res?.success === true) {
                  this.alertHelper.successAlert(
                    "Deleted!",
                    "Nagar nigam deleted successfully.",
                    "success"
                  );
                  this.initializeForm();
                  this.loadNagarNigam(this.getSearchParams());
                  
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
  downloadNagarNigamList()
  {
    this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.managenagarnigamService.getAllNagarNigam(this.paramObj).subscribe({
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
