import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, NgForm, FormGroup } from '@angular/forms';
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
import { SchoolService } from '../../school/services/school.service';
import { HolidayService } from '../services/holiday.service';



@Component({
  selector: 'app-view-holiday',
  templateUrl: './view-holiday.component.html',
  styleUrls: ['./view-holiday.component.css']
})
export class ViewHolidayComponent implements OnInit {
  public fileUrl = environment.filePath;
  public show: boolean = true;
  public buttonName: any = 'Show';
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
  viewHolidayData: any = [];
  dataSource = new MatTableDataSource(this.viewHolidayData);
  //end
  paramObj: any;
  serviceType: string = "Search";
  isLoading = false;
  userId: any = "";
  pageIndex: any = 0;
  previousSize: any = 0;
  isNorecordFound: boolean = false;
  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();
  constructor(
    private router: Router,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    public commonService: CommonserviceService,
    private schoolService: SchoolService,
    private holidayService: HolidayService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private alertHelper: AlertHelper
  ) {
    const pageUrl: any = this.router.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
  }

  isEmpty: boolean = false;
  select_all = false;
  holidayListData: any = [];

  holidaySearchForm!: FormGroup
  allErrorMessages: string[] = [];
  submitted = false;
  posts: any = [];
  createdBy: any = "";


  districtData: any = [];
  blockData: any = [];
  schoolCatData: any = [];
  schoolData: any = [];

  disrtictChanged: boolean = false;
  blockChanged: boolean = false;
  schoolCatagoryChanged: boolean = false;
  schoolChanged: boolean = false;

  searchDistrictId: any = "";
  searchBlockId: any = "";
  searchSchoolCategoryId: any = "";
  searchSchoolId: any = "";




  scDisrtictSelect: boolean = true;
  scDisrtictLoading: boolean = false;
  scBlockSelect: boolean = true;
  scBlockLoading: boolean = false;
  scSchoolCategorySelect: boolean = true;
  scSchoolCategoryLoading: boolean = false;
  scSchoolSelect: boolean = true;
  scSchoolLoading: boolean = false;


  districtId: any = "";
  blockId: any = "";
  schlCatId: any = "";
  schoolId: any = "";
  holidayName: any = "";
  startDate: any = "";
  endDate: any = "";
  adminPrivilege: boolean = false;
  ngOnInit(): void {
    if (this.plPrivilege == 'admin') {
      this.adminPrivilege = true;
      this.displayedColumns = [
        "slNo",
        "District",
        "Block",
        "SchoolCategory",
        "School",
        "HolidayName",
        "StartDate",
        "EndDate",
        "Action",
      ];
    } else {
      this.displayedColumns = [
        "slNo",
        "District",
        "Block",
        "SchoolCategory",
        "School",
        "HolidayName",
        "StartDate",
        "EndDate",
      ];
    }
    this.userProfile = this.commonService.getUserProfile();
    if (this.userProfile.district != 0 || this.userProfile.district != "") {
      this.districtId = this.userProfile.district;
      this.getBlock(this.userProfile.district);
    }
    if (this.userProfile.block != 0 && this.userProfile.block != "") {
      this.blockId = this.userProfile.block;
    }

    //this.initializeForm();
    this.loadHolidayData(this.getSearchParams());
    this.getDistrict();
    this.getSchoolCategory();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDistrict() {
    this.disrtictChanged = true;
    this.commonService.getAllDistrict().subscribe((res: []) => {
      this.posts = res;
      this.districtData = this.posts.data;
      if (this.userProfile.district != 0 || this.userProfile.district != "") {
        this.districtData = this.districtData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        this.searchForm.controls['searchDistrictId'].patchValue(this.userProfile.district);
        this.getBlock(this.userProfile.district);
      }
      else {
        this.districtData = this.districtData;
        this.scDisrtictSelect = true;
      }
      this.searchBlockId = '';
      this.scDisrtictLoading = false;
      //this.disrtictChanged = false;
    });
  }

  getBlock(districtId: any) {
    this.blockChanged = true;
    this.districtId = districtId;
    this.blockData = [];
    this.schoolData = [];
    this.blockId = null;
    if (districtId !== '') {
      this.commonService.getBlockByDistrictid(districtId).subscribe((res) => {
        let data: any = res;
        this.blockId = null;
        for (let key of Object.keys(data['data'])) {
          this.blockData.push(data['data'][key]);
        }
        if (this.userProfile.block != 0 || this.userProfile.block != "") {
          this.blockData = this.blockData.filter((blo: any) => {
            return blo.blockId == this.userProfile.block;
          });

        }
        else {
          this.scBlockSelect = true;
        }
        this.scBlockLoading = false;
        //this.blockChanged = false;
      });
    } else {
      this.scBlockSelect = true;
      this.scBlockLoading = false;
      // this.blockChanged = false;
    }
  }

  getSchoolCategory() {
    this.schoolCatagoryChanged = true;
    this.schoolCatData = [];
    this.schoolData = [];
    this.schoolService.getSchoolCategory().subscribe((res) => {
      this.posts = res;
      let data: any = res;
      for (let key of Object.keys(data['data'])) {
        this.schoolCatData.push(data['data'][key]);
      }
      this.schoolCatagoryChanged = false;
    });
  }

  getSchoolList() {
    this.schoolChanged = true;
    this.schoolData = [];
    this.districtId = this.searchDistrictId;
    this.blockId = this.searchBlockId;
    this.schlCatId = this.searchSchoolCategoryId;
    let paramList: any = { districtId: this.districtId, blockId: this.blockId, schoolCategoryId: this.schlCatId };
    if (this.blockId > 0) {
      this.schoolService.getSchoolList(paramList).subscribe((res) => {
        this.posts = res;
        let data: any = res;
        for (let key of Object.keys(data['data'])) {
          this.schoolData.push(data['data'][key]);
        }
        this.schoolChanged = false;
      });
    }

  }
  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      searchDistrictId: this.searchDistrictId,
      searchBlockId: this.searchBlockId,
      searchSchoolCategoryId: this.searchSchoolCategoryId,
      searchSchoolId: this.searchSchoolId
    };
  }

  loadHolidayData(...params: any) {
    this.spinner.show();
    const {
      previousSize,
      offset,
      pageSize,
      searchDistrictId,
      searchBlockId,
      searchSchoolCategoryId,
      searchSchoolId,

    } = params[0];
    this.paramObj = {
      offset: offset,
      limit: pageSize,
      //userId:this.userProfile.userId,
      loginUserType: this.userProfile.loginUserType,
      schoolId: this.userProfile.school,
      searchDistrictId: searchDistrictId,
      searchBlockId: searchBlockId,
      searchSchoolCategoryId: searchSchoolCategoryId,
      searchSchoolId: searchSchoolId,
      serviceType: this.serviceType,
      userId: this.userId,
      sessionValue: this.userProfile
    };
    this.isLoading = true;

    this.holidayService.viewHoliday(this.paramObj).subscribe({
      next: (res: any) => {
        console.log(this.paginator);
        this.viewHolidayData.length = previousSize; // set current size
        this.viewHolidayData.push(...res?.data); // merge with existing data
        this.viewHolidayData.length = res?.totalRecord; // update length
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
        this.isLoading = false;
        this.isNorecordFound = this.viewHolidayData.length ? false : true;
        this.spinner.hide();
        console.log(this.dataSource.paginator);
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },

    });

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
    this.loadHolidayData(this.getSearchParams());
  }
  onSearch() {
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    if (this.validateForm() === true) {
      this.spinner.show();
      this.loadHolidayData(this.getSearchParams());

    }

  }
  validateForm(): Boolean {

    // if (this.searchDistrictId === "") {
    //   this.alertHelper.successAlert(
    //     "",
    //     "Please select District.",
    //     "info"
    //   );
    //   return false;
    // }
    // if (this.searchBlockId === "") {
    //   this.alertHelper.successAlert(
    //     "",
    //     "Please select Block.",
    //     "info"
    //   );
    //   return false;
    // }
    return true;

  }

  deleteHoliday(encId: string) {
    this.alertHelper
      .deleteAlert("Do you want to delete the selected holiday ?", "", "question", "Yes, delete it!")
      .then((result) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          let paramList: any = { encId: encId, updatedBy: this.userProfile.userId, profileId: this.userProfile.profileId };
          this.spinner.show();
          this.isLoading = true;
          this.holidayService.deleteHoliday(paramList).subscribe({
            next: (res: any) => {
              if (res?.success === true) {
                this.alertHelper.successAlert(
                  "Deleted!",
                  "Selected holiday deleted successfully",
                  "success"
                );
                this.loadHolidayData(this.getSearchParams());
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

  rerender(): void {
    //  this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //     // Destroy the table first
    //     dtInstance.destroy();
    //     // Call the dtTrigger to rerender again
    //     this.dtTrigger.next(0);
    //   });
  }

  downloadHolidayList() {
    this.spinner.show();
    this.paramObj.serviceType = "Download";

    this.holidayService.viewHoliday(this.paramObj).subscribe({
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
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }
}
