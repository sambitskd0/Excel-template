/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 26-12-2022
 * Module Name : Teacher
 * Description : Add teacher promotion.
 **/

import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { NgxSpinnerService } from "ngx-spinner";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { Router } from "@angular/router";
import { Constant } from "src/app/shared/constants/constant";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SelectionModel } from "@angular/cdk/collections";
import { TeacherPromotionService } from "../../services/teacher-promotion.service";
import { environment } from "src/environments/environment";
export interface Teacher {
  teacherName: string;
  teacherCode: string;
  des: string;
  apointType: string;
  schoolName: string;
  schlCatName: string;
  slNo: Number;
  encId: string;
  promotTitle: [];
  promotedTitle: string;
  teacherTitle: string;
}
@Component({
  selector: "app-view-promotion",
  templateUrl: "./view-promotion.component.html",
  styleUrls: ["./view-promotion.component.css"],
})
export class ViewPromotionComponent implements OnInit {
  //=========== member declaration
  plPrivilege: string = "view"; //For menu privilege
  tabs: any = []; //For shwoing tabs
  config = new Constant();
  adminPrivilege: boolean = false;
  public fileUrl = environment.filePath;
  @ViewChild("openModal") openModal!: ElementRef;
  // selection = new SelectionModel<Teacher>(true, []);
  filterData: any = {
    annextureData: [],
    userProfile: [],
    districtData: [],
    blockData: [],
    teacherList: [],
    promotionDetails: [],
  };
  userInput: any = {
    currentAcademicYear: "",
    designationId: "",
    appointmentId: "",
    socialCategoryId: "",
    yearOfService: "",
    districtId: "",
    blockId: "",
    checkAll: false,
  };
  // mat table
  @Input() mode!: ProgressBarMode;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter!: MatTableExporterDirective;
  promotedTeacher: Teacher[] = [];
  public show: boolean = false;
  public buttonName: any = "Show";
  matTable: any = {
    offset: 0,
    displayedColumns: [], // define mat table columns
    questionBankData: [],
    previousSize: 0,
    pageIndex: 0,
    isLoading: false,
    isNorecordFound: false,
    isSearched: false,
    totalRows: 0,
    currentPage: 0,
    pageSize: 10,
    dataSource: new MatTableDataSource(this.filterData.teacherList),
    selection: new SelectionModel(true, []),
  };
  constructor(
    private formBuilder: FormBuilder,
    private commonFunctionHelper: CommonFunctionHelper,
    private commonService: CommonserviceService,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private teacherPromotionService: TeacherPromotionService,
    private spinner: NgxSpinnerService,
    private privilegeHelper: PrivilegeHelper, //For menu privilege,
    private router: Router
  ) {
    const pageUrl: any = this.router.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl); //For menu privilege

    this.commonService.verifyLinkPermission(
      pageUrl,
      this.config.linkType[2],
      this.config.privilege[1]
    ); // For authorization
    this.tabs = this.privilegeHelper.PrimaryLinkTabNames(pageUrl); //For shwoing tabs
  }

  ngOnInit(): void {
    this.spinner.show();
    // annexture
    this.getAnnextureData();
    //  Current acadmic year
    this.userInput.currentAcademicYear =
      this.commonFunctionHelper.currentAcademicYear();
    this.filterData.userProfile = this.commonService.getUserProfile(); // get user profile
    this.getDistrict();
    this.permissionHandler();
  }
  ngAfterViewInit() {
    this.matTable.dataSource.paginator = this.paginator;
    this.matTable.dataSource.sort = this.sort;
  }
  permissionHandler() {
    if (this.plPrivilege == "admin") {
      this.adminPrivilege = true;
      this.matTable.displayedColumns = [
        "select",
        "slNo",
        "teacherName",
        "teacherTitle",
        "teacherCode",
        "schoolName",
        "promotionCount",
        "lastPromotedOn",
        "promotionStatus",
        "action",
      ];
    } else {
      this.matTable.displayedColumns = [
        "slNo",
        "teacherName",
        "teacherTitle",
        "teacherCode",
        "schoolName",
        "promotionCount",
        "promotionStatus",
        "action",
      ];
    }
  }
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? "deselect" : "select"} all`;
    }
    return `${
      this.matTable.selection.isSelected(row) ? "deselect" : "select"
    } row ${10}`;
  }
  isAllSelected() {
    const numSelected = this.matTable.selection.selected.length;
    let numRows;
    // 1) if in first page then compare with selected record and min of (total record and page size)
    numRows = Math.min(
      this.matTable.dataSource.data.length,
      this.matTable?.pageSize
    );

    return (
      numSelected === numRows ||
      numSelected === this.matTable.dataSource.data.length
    );
  }
  masterToggle() {
    this.isAllSelected()
      ? this.matTable.selection.clear()
      : this.matTable.dataSource.data.forEach((row: any) =>
          this.matTable.selection.select(row)
        );
  }
  toggle() {
    this.show = !this.show;
    if (this.show) this.buttonName = "Hide";
    else this.buttonName = "Show";
  }
  sendToDeo() {
    if (this.matTable.selection.selected.length < 1) {
      this.alertHelper.viewAlertHtml(
        "error",
        "Invalid",
        "Select atleast one record"
      );
      return;
    }
    this.alertHelper.submitAlert("Do you want to forward?").then((result) => {
      if (result.value) {
        this.matTable.isLoading = true;
        // (this.matTable.selection.selected);
        this.teacherPromotionService
          .forwardToDeo({
            selectedTeachers: this.matTable.selection.selected,
            userDetails: {
              districtId: this.filterData.userProfile?.district,
              profileId: this.filterData.userProfile?.profileId,
              userId: this.filterData.userProfile?.userId,
              userName: this.filterData.userProfile?.userName,
            },
          })
          .subscribe({
            next: (response: any) => {
              if (response.success) {
                this.matTable.isLoading = false;
                this.alertHelper
                  .successAlert(
                    "Approved!",
                    "Teacher(s) promotion list forwarded successfully.",
                    "success"
                  )
                  .then(() => {
                    this.onSearch("VIEW");
                  });
              } else {
                this.alertHelper
                  .viewAlert(
                    "error",
                    "Invalid",
                    "Teacher(s) promotion list not forwarded."
                  )
                  .then(() => {
                    this.onSearch("VIEW");
                  });
              }
            },
            error: (error: any) => {
              this.matTable.isLoading = false;
              this.spinner.hide();
            },
          });
      }
    });
  }
  // get annextures
  getAnnextureData() {
    this.commonService
      .getCommonAnnexture(
        ["TEACHER_TITLE", "TEACHER_SOCIAL_CATEGORY", "NATURE_OF_APPOINTMENT"],
        true
      )
      .subscribe({
        next: (res: any) => {
          this.filterData.annextureData = res?.data;
        },
      });
  }
  // on search
  onSearch(searchType: String) {
    if (this.validateFilter()) {
      this.spinner.show();

      switch (searchType) {
        case "VIEW": // 1) if search is view type
          // reset queryParams
          this.matTable.pageIndex = 0;
          this.matTable.previousSize = 0;
          this.matTable.offset = 0;
          this.matTable.previousSize = 0;
          this.matTable.isSearched = true;
          this.loadData({
            ...this.getSearchParams(),
            searchType,
          });
          break;
        case "CSV": // 2) if search is csv export type
          this.loadData({
            ...this.getSearchParams(),
            searchType,
          });
          break;

        default:
          break;
      }
    }
  }
  validateFilter(): boolean {
    // filter validation
    if (this.userInput.currentAcademicYear === "") {
      this.alertHelper.viewAlert(
        "error",
        "Invalid",
        "Academic year is required."
      );
      return false;
    }
    if (!+this.userInput.designationId) {
      this.alertHelper.viewAlert(
        "error",
        "Invalid",
        "Teacher designation is required."
      );
      return false;
    }
    if (!+this.userInput.yearOfService) {
      this.alertHelper.viewAlert(
        "error",
        "Invalid",
        "Year of service is required."
      );
      return false;
    } else {
      if (+this.userInput.yearOfService >= 40) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Please search by maximum 40 year of service."
        );
        return false;
      }
      if (+this.userInput.yearOfService < 1) {
        ("Please search by minimum 1 year of service.");
      }
    }
    return true;
  }
  getDistrict() {
    this.commonService.getAllDistrict().subscribe({
      next: (response: any) => {
        // if district id of logged in user exist
        if (+this.filterData.userProfile.district) {
          this.filterData.districtData = response?.data.filter((item: any) => {
            return +item.districtId == +this.filterData.userProfile.district;
          });
          this.userInput.districtId = +this.filterData.userProfile.district;
          this.getBlock();
        } else {
          this.filterData.districtData = response?.data;
          this.spinner.hide();
        }
      },
    });
  }

  getBlock() {
    this.commonService
      .getBlockByDistrictid(this.userInput.districtId)
      .subscribe({
        next: (response: any) => {
          // if block id of logged in user exist
          if (+this.filterData.userProfile.block) {
            this.filterData.blockData = response?.data.filter((item: any) => {
              return item.blockId == this.filterData.userProfile.block;
            });
            this.userInput.blockId = +this.filterData.userProfile.block;
          } else {
            this.filterData.blockData = response?.data;
          }

          this.spinner.hide();
        },
      });
  }
  getSearchParams() {
    return {
      previousSize: this.matTable.previousSize,
      offset: this.matTable.offset.toString(),
      limit: this.matTable.pageSize.toString(),
      ...this.userInput,
      userId: this.filterData.userProfile?.userId,
    };
  }
  onPageChange(event: any) {
    this.spinner.show();
    this.matTable.isLoading = true;
    // event: PageEvent
    this.matTable.pageSize = event.pageSize; // current page size ex: 10
    /**
     * pageIndex starts from 0
     * ex: if pageIndex = 0 then offset = 0 * 10 = 0 and if pageIndex =1 then 1*10 = 10
     */
    this.matTable.offset = event.pageIndex * event.pageSize;
    this.matTable.previousSize = this.matTable.pageSize * event.pageIndex; // set previous size
    this.matTable.pageIndex = event.pageIndex;
    this.loadData({
      ...this.getSearchParams(),
      searchType: "VIEW",
    });
  }
  loadData(params: any) {
    this.matTable.selection.clear(); // reset check box
    this.matTable.isLoading = true;
    this.teacherPromotionService
      .getTeacherPrmotionGeneratedList(params)
      .subscribe({
        next: (response: any) => {
          response;
          switch (params?.searchType) {
            case "VIEW": // 1) if search is view type
              this.filterData.teacherList.length = this.matTable.previousSize; // set current size
              response?.success === true &&
                this.filterData.teacherList.push(...response?.data); // merge with existing data

              this.filterData.teacherList.length = response?.totalRecord; // update length
              this.matTable.dataSource.paginator = this.paginator; // update paginator
              this.matTable.dataSource._updateChangeSubscription(); // update table
              this.matTable.isLoading = false;
              this.matTable.isNorecordFound = this.filterData.teacherList.length
                ? false
                : true;
              this.spinner.hide();
              break;
            case "CSV": // 2) if search is csv export type
              this.spinner.hide();
              let filepath =
                this.fileUrl + "/" + response?.data?.replace(".", "~");
              this.matTable.isLoading = false;
              window.open(filepath);
              break;

            default:
              break;
          }
        },
        error: (error: any) => {
          this.matTable.isLoading = false;
          this.spinner.hide();
        },
      });
  }
  // Material table pagination size options :: Sambit Kumar Dalai:: 10-11-2022
  get getPageSizeOptions(): number[] {
    return this.matTable.dataSource?.paginator &&
      this.matTable.dataSource?.paginator?.length > 200
      ? [10, 30, 50, 100, this.matTable.dataSource.paginator.length]
      : [10, 30, 50, 100, 200];
  }
  onDelete(element: any) {
    // (element?.listId,this.userInput,this.filterData.userProfile);
    const paramObj = {
      userId: this.filterData.userProfile?.userId,
      profileId: this.filterData.userProfile?.profileId,
      listId: element?.listId,
    };
    this.alertHelper.deleteAlert().then((result: any) => {
      if (result.value) {
        this.spinner.show();
        this.matTable.isLoading = true;
        this.teacherPromotionService
          .deleteTeacherFromGeneratedList(paramObj)
          .subscribe({
            next: (res: any) => {
              if (res?.success === true) {
                this.alertHelper
                  .viewAlert("info", "", res?.msg)
                  .then(() => this.onSearch("VIEW"));
              } else {
                this.alertHelper.viewAlert("info", res?.msg, "");
              }
              this.matTable.isLoading = false;
              this.spinner.hide();
            },
            error: (error: any) => {
              this.matTable.isLoading = false;
              this.spinner.hide();
            },
          });
      }
    });
  }

  // ===== print
  printPage() {
    let cloneTable = document.getElementById("matTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }
  getPromotionDetails(element: any) {
    this.teacherPromotionService
      .getPromotionDetails(element?.teacherId)
      .subscribe({
        next: (response: any) => {
          if (response?.success) {
            this.filterData.promotionDetails = response.data;
            this.openModal.nativeElement.click();
          } else {
            this.filterData.promotionDetails = undefined;
          }
          this.openModal.nativeElement.click();
        },
      });
  }
}
