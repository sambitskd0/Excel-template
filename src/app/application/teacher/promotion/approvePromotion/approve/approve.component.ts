/**
 * Created By  : Srichandan Routray
 * Created On  : 27-12-2022
 * Module Name : Teacher
 * Description : Promoted Teacher list from Block.
 **/
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { TeacherPromotionService } from "src/app/application/teacher/services/teacher-promotion.service";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { NgxSpinnerService } from "ngx-spinner";
import { SelectionModel } from "@angular/cdk/collections";
import { MatTableDataSource } from "@angular/material/table";
import { FormBuilder } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { Router } from "@angular/router";
import { Constant } from "src/app/shared/constants/constant";

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
  selector: "app-approve",
  templateUrl: "./approve.component.html",
  styleUrls: ["./approve.component.css"],
})
export class ApproveComponent implements OnInit {
  plPrivilege: string = "view"; //For menu privilege
  tabs: any = []; //For shwoing tabs
  config = new Constant();
  adminPrivilege: boolean = false;
  promotedTeacher: Teacher[] = [];
  displayedColumns: string[] = [
    "select",
    "sl",
    "teacherName",
    "teacherCode",
    "des",
    "apointType",
    "schoolName",
    "schlCatName",
    "promotTitle",
  ];
  dataSource: MatTableDataSource<Teacher> = new MatTableDataSource(
    this.promotedTeacher
  );
  selection = new SelectionModel<Teacher>(true, []);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild("stdVerifyClose") stdVerifyClose!: any;
  filterData: any = {
    annextureData: [],
    userProfile: [],
    districtData: [],
    blockData: [],
  };
  public show: boolean = false;
  public buttonName: any = "Show";
  pageSizeOptions: number[] = [10, 25, 100];
  page: any = {
    limit: 10,
    offset: 0,
    currentPage: 0,
    totalRows: 0,
  };
  userInput: any = {
    currentAcademicYear: "",
    designationId: "",
    appointmentId: "",
    socialCategoryId: "",
    educationalQualificationId: "",
    yearOfService: "",
    districtId: "",
    blockId: "",
  };
  remarks: String = "";

  checkedData: any = {
    selected: [],
    userData: [],
  };

  rejectedData: any = {
    selected: [],
    remark: "",
    userData: [],
  };
  isLoading = false;
  isInitAdmin: boolean = false;
  isNorecordFound: boolean = false;
  // promotedTeacher : any = [];

  constructor(
    private teacherPromotion: TeacherPromotionService,
    private commonFunctionHelper: CommonFunctionHelper,
    private commonService: CommonserviceService,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
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
    // annexture
    this.getAnnextureData();
    this.userInput.currentAcademicYear =
      this.commonFunctionHelper.currentAcademicYear();
    this.filterData.userProfile = this.commonService.getUserProfile(); // get user profile
    this.getDistrict();
    this.isInitAdmin = true;
    // this.searchTeacher();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  // get annextures
  getAnnextureData() {
    this.commonService
      .getCommonAnnexture(
        [
          "TEACHER_TITLE",
          "TEACHER_SOCIAL_CATEGORY",
          "NATURE_OF_APPOINTMENT",
          "TEACHER_EDUCATIONAL_QUALIFICATION",
        ],
        true
      )
      .subscribe({
        next: (res: any) => {
          this.filterData.annextureData = res?.data;
        },
      });
  }
  toggle() {
    this.show = !this.show;
    if (this.show) this.buttonName = "Hide";
    else this.buttonName = "Show";
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
    } else if (!+this.userInput.designationId) {
      this.alertHelper.viewAlert(
        "error",
        "Invalid",
        "Teacher designation is required."
      );
      return false;
    } else {
      return true;
    }
  }

  getDistrict() {
    this.commonService.getAllDistrict().subscribe((response: any) => {
      // if district id of logged in user exist
      if (+this.filterData.userProfile.district) {
        this.filterData.districtData = response?.data.filter((item: any) => {
          return +item.districtId == +this.filterData.userProfile.district;
        });
        this.userInput.districtId = +this.filterData.userProfile.district;
        this.getBlock();
      }
    });
  }

  getBlock() {
    if (+this.userInput.districtId) {
      this.commonService
        .getBlockByDistrictid(this.userInput.districtId)
        .subscribe((response: any) => {
          if (response.statusCode == 200) {
            this.filterData.blockData = response?.data;
          }
        });
    }
  }

  getSearchParams() {
    return {
      ...this.page,
      ...this.userInput,
      ...this.filterData,
    };
  }

  searchTeacher() {
    if (this.validateFilter()) {
      this.spinner.show();
      this.isLoading = true;
      this.teacherPromotion
        .getAllPromotedTeacher(this.getSearchParams())
        .subscribe((response) => {
          this.promotedTeacher = response?.data;
          this.dataSource = response?.data;
          this.page.totalRows = response?.totalRecord; // update length
          this.dataSource.paginator = this.paginator; // update paginator
          this.isNorecordFound = this.promotedTeacher.length ? false : true;
          this.isLoading = false;
          this.isInitAdmin = false;
          this.spinner.hide();
          this.selection.clear();
        });
    }
  }

  onPageChange(event: any) {
    this.page.limit = event.pageSize; // current page size ex: 10
    this.page.offset = event.pageIndex * event.pageSize;
    this.page.previousSize = this.page.limit * event.pageIndex; // set previous size
    this.page.pageIndex = event.pageIndex;
    this.searchTeacher();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.promotedTeacher?.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.promotedTeacher);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? "deselect" : "select"} all`;
    }
    return `${
      this.selection.isSelected(row) ? "deselect" : "select"
    } row ${10}`;
  }

  approvePromotion() {
    if (this.selection.selected.length < 1) {
      this.alertHelper.viewAlertHtml(
        "error",
        "Invalid",
        "Select atleast one record"
      );
      return;
    }
    for (var value of this.selection.selected) {
      if (!value.promotedTitle) {
        this.alertHelper.viewAlertHtml(
          "error",
          "Invalid",
          "Select promoted designation."
        );
        return;
      }
      if (value.promotedTitle == value.teacherTitle) {
        this.alertHelper.viewAlertHtml(
          "error",
          "Invalid",
          "Can not promote to same designation."
        );
        return;
      }
    }

    this.alertHelper.submitAlert("Do you want to promote ?").then((result) => {
      if (result.value) {
        this.checkedData.selected = this.selection.selected;
        this.checkedData.selected = this.selection.selected;
        this.checkedData.userData = this.commonService.getUserProfile();
        this.teacherPromotion
          .approvePromotion(this.checkedData)
          .subscribe((response) => {
            if ((response.statusCode = 200)) {
              this.alertHelper
                .successAlert(
                  "Approved!",
                  "Teacher(s) promoted successfully.",
                  "success"
                )
                .then(() => {
                  this.searchTeacher();
                });
            }
          });
      }
    });
  }

  setDesg(event: any, element?: any) {
    element.promotedTitle = event.target.value;
    this.promotedTeacher[this.promotedTeacher.indexOf(element)] = element;

    // this.promotedTeacher
  }
  rejectPromotion() {
    if (this.selection.selected.length < 1) {
      this.alertHelper.viewAlertHtml(
        "error",
        "Invalid",
        "Select atleast one record"
      );
      return;
    }
    this.alertHelper.submitAlert("Do you want to reject?").then((result) => {
      if (result.value) {
        this.rejectedData.selected = this.selection.selected;
        this.rejectedData.remark = this.remarks;
        this.rejectedData.userData = this.commonService.getUserProfile();
        this.teacherPromotion
          .rejectPromotion(this.rejectedData)
          .subscribe((response) => {
            this.alertHelper
              .successAlert(
                "Rejected!",
                "Teacher(s) promotion request rejected successfully.",
                "success"
              )
              .then(() => {
                this.stdVerifyClose.nativeElement.click();
                this.searchTeacher();
              });
          });
      }
    });
  }
}
