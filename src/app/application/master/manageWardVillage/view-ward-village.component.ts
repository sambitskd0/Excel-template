import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
import { environment } from 'src/environments/environment';
import { ManageWardVillageService } from '../services/manage-ward-village.service';

@Component({
  selector: 'app-view-ward-village',
  templateUrl: './view-ward-village.component.html',
  styleUrls: ['./view-ward-village.component.css']
})
export class ViewWardVillageComponent implements OnInit {
  public fileUrl = environment.filePath;
  wardVillageSearchform!: FormGroup;
  distdata: any;
  allDistrict: any;
  isEmpty: boolean = false;
  wardVillageDatas: any;
  filterChanged: boolean = false;
  showSpinnerBlock: boolean = false;
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  // ===============Material Table Variable and Decorators
  isLoading = false;
  isNorecordFound: boolean = false;
  pageIndex: any = 0;
  previousSize: any = 0;
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
  displayedColumns: string[] = [];

  resultListData: any = [];
  dataSource = new MatTableDataSource(this.resultListData);
  userId: any;
  profileId: any;

  //end Material Table Variable and Decorators
  paramObj: any; 
  serviceType: string = "Search";
  constructor(private formBuilder: FormBuilder, 
    public commonserviceService: CommonserviceService, 
    private alertHelper: AlertHelper, 
    private router:Router,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    public manageWardVillageService: ManageWardVillageService,
    private el:ElementRef,
    private spinner: NgxSpinnerService) { 
      const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
   
      const users = this.commonserviceService.getUserProfile();
      this.userId = users?.userId;}

  ngOnInit(): void {
   // this.spinner.show();
   if(this.plPrivilege=='admin'){
    this.adminPrivilege = true;
    this.displayedColumns = [
    "slNo",
    "District",
    "Block",
    "Panchayat/Municipalty",
    "Type",
    "Ward / Village Name",
    "Ward / Village Code",
    "action",
    ]; 
  } else {
    this.displayedColumns = [
    "slNo",
    "District",
    "Block",
    "Panchayat/Municipalty",
    "Type",
    "Ward / Village Name",
    "Ward / Village Code",
    ]; 
  }
    this.commonserviceService.getAllDistrict().subscribe((data: []) => {
      this.distdata = data;
      this.allDistrict = this.distdata.data;
    });
    this.initializeForm();
    this.el.nativeElement.querySelector("[formControlName=villageType]").focus();
    this.loadWardVillage(this.getSearchParams());
  }
  // ===========initialize Datasource after complete Component Load
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDistrict(id: any) {
    this.filterChanged = true;
    this.showSpinnerBlock = true;
    const villageType = id;
    if (villageType !== "") {
      this.commonserviceService.getAllDistrict().subscribe((data: []) => {
        this.distdata = data;
        this.allDistrict = this.distdata.data;

      });
      this.showSpinnerBlock = false;
      this.filterChanged = false;
    } else {
      this.wardVillageSearchform = this.formBuilder.group({
        villageType: ['',],
        districtId: ['',],

      });
      this.filterChanged = false;
    }

  }

  // =============initializeForm Start
  initializeForm() {
    this.wardVillageSearchform = this.formBuilder.group({
      villageType: ['',],
      districtId: ['',],
    });
  }

  // ==============Get serch Parameters For Material Table
  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      villageType: this.wardVillageSearchform?.get("villageType")?.value,
      districtId: this.wardVillageSearchform?.get("districtId")?.value,
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
    this.loadWardVillage(this.getSearchParams());
  }

   //=================For Filteration
   onSearch() {
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    this.loadWardVillage(this.getSearchParams());
  }

  loadWardVillage(...params: any) {

    this.spinner.show();
    const {
      previousSize,
      offset,
      pageSize,
      districtId,
      villageType
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      districtId: districtId,
      villageType: villageType,
      serviceType: this.serviceType, 
      userId: this.userId
    };
    this.isLoading = true;
    this.manageWardVillageService.viewWardVillage(this.paramObj).subscribe({
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
 
   deleteWardVillage(id: number) { 
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.alertHelper.deleteAlert(
      "Are you sure to delete?",
      "",
      "question",
      "Yes, delete it!"
    ).then((result) => {
      this.spinner.show();
      if (result.value) {
        this.spinner.show();
        this.isLoading = true;
        this.manageWardVillageService
          .deleteVillage(id, this.userId,this.profileId)
          .subscribe({
            next: (res: any) => {
              if (res?.success === true) {
                this.alertHelper.successAlert(
                  "Deleted!",
                  "Ward/village deleted successfully",
                  "success"
                );
                this.loadWardVillage(this.getSearchParams());
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
      else{
        this.spinner.hide();
      }
    })
  } 
  downloadWardVillageList()
  {
    this.spinner.show();   
    this.paramObj.serviceType = "Download";

    this.manageWardVillageService.viewWardVillage(this.paramObj).subscribe({
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


