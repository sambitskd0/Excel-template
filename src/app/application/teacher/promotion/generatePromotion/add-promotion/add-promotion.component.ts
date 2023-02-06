/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 26-12-2022
 * Module Name : Teacher
 * Description : Add teacher promotion.
 **/

import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { TeacherPromotionService } from "../../../services/teacher-promotion.service";
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

@Component({
  selector: "app-add-promotion",
  templateUrl: "./add-promotion.component.html",
  styleUrls: ["./add-promotion.component.css"],
})
export class AddPromotionComponent implements OnInit {
  //=========== member declaration
  plPrivilege: string = "view"; //For menu privilege
  tabs: any = []; //For shwoing tabs
  config = new Constant();
  adminPrivilege: boolean = false;

  filterData: any = {
    annextureData: [],
    userProfile: [],
    districtData: [],
    blockData: [],
    teacherList: [],
    loadResponse: [],
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

  // member declaration
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
      ];
    } else {
      this.matTable.displayedColumns = [
        "slNo",
        "teacherName",
        "teacherTitle",
        "teacherCode",
        "schoolName",
        "promotionCount",
        "lastPromotedOn",
      ];
    }
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
  onSearch() {
    if (this.validateFilter()) {
      this.spinner.show();
      // reset queryParams
      this.matTable.pageIndex = 0;
      this.matTable.previousSize = 0;
      this.matTable.offset = 0;
      this.matTable.isSearched = true;
      this.paginator.pageIndex = 0; // go to first page on every search
      this.loadData(this.getSearchParams());
    }
  }
  loadData(params: Object) {
    this.matTable.selection.clear(); // reset check box
    this.matTable.isLoading = true;
    this.teacherPromotionService.getTeacherListForPromotion(params).subscribe({
      next: (response: any) => {
        if (response?.success) {
          this.filterData.loadResponse = response; // keep backup of response
          this.filterData.teacherList.length = this.matTable.previousSize; // set current size
          this.filterData.teacherList.push(...response?.data); // merge with existing data
          this.filterData.teacherList.length = response?.totalRecord; // update length
          this.matTable.dataSource.paginator = this.paginator; // update paginator
          this.matTable.dataSource._updateChangeSubscription(); // update table
          this.matTable.isLoading = false;

          this.existingTeacherHandler();
        } else {
          this.filterData.teacherList.length = 0;
        }
        this.spinner.hide();
        this.matTable.isNorecordFound = this.filterData.teacherList.length
          ? false
          : true;
      },
      error: (error: any) => {
        this.matTable.isLoading = false;
        this.spinner.hide();
      },
    });
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
    if (+this.userInput.districtId) {
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
            }

            this.spinner.hide();
          },
        });
    }
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
    this.loadData(this.getSearchParams());
  }

  // Material table pagination size options :: Sambit Kumar Dalai:: 10-11-2022
  get getPageSizeOptions(): number[] {
    return this.matTable.dataSource?.paginator &&
      this.matTable.dataSource?.paginator?.length > 200
      ? [10, 30, 50, 100, this.matTable.dataSource.paginator.length]
      : [10, 30, 50, 100, 200];
  }

  /** Whether the number of selected elements matches the total number of rows. */
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

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.matTable.selection.clear()
      : this.matTable.dataSource.data.forEach((row: any) =>
          this.matTable.selection.select(row)
        );
  }

  onSubmit() {
    if (this.validationHandler()) {
      this.alertHelper
        .submitAlert("Do you want to prepare the list?")
        .then((result: any) => {
          if (result.value) {
            this.spinner.show();
            this.submitData({
              uerInput: this.userInput,
              selectedTeachers: this.matTable.selection.selected,
              userProfile: this.filterData.userProfile,
            });
          }
        });
    }
  }
  validationHandler() {
    if (!this.matTable.selection?.selected?.length) {
      this.alertHelper.viewAlert(
        "error",
        "",
        "Please select atleast one teacher."
      );
      return false;
    }
    return true;
  }
  submitData(params: any) {
    this.teacherPromotionService
      .submitTeacherListForPromotion(params)
      .subscribe({
        next: (response: any) => {
          if (response.success === true) {
            this.alertHelper
              .successAlert("Saved!", response?.msg, "success")
              .then(() => {
                // hide table
                this.filterData.teacherList.length = 0;
                this.matTable.isNorecordFound = true;
              });
          } else {
            this.alertHelper.viewAlert("error", "Invalid", response?.msg);
          }

          this.spinner.hide();
        },
        error: (error: any) => {
          this.matTable.isLoading = false;
          this.spinner.hide();
        },
      });
  }

  getCheckBoxStatus(row: any) {
    // (row?.isAllowed);

    // if it is selected or is already added for promotion list then return true
    // if (this.matTable.selection.isSelected(row)) return true;

    if (!row?.isAllowed) {
      this.matTable.selection.select(row);
      return true;
    }
    return false; // default false i.e uncheck
  }
  existingTeacherHandler() {
    this.filterData.teacherList?.map((item: any) => {
      if (item?.isAllowed === false) {
        this.matTable.selection.select(item);
      }
    });
  }
}
