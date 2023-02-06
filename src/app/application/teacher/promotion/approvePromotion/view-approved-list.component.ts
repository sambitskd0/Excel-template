/**
 * Created By  : Srichandan Routray
 * Created On  : 27-12-2022
 * Module Name : Teacher
 * Description : Promoted Teacher list By District Officer.
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
import { environment } from "src/environments/environment";
import {
  NgForm,
  FormGroup,
  FormBuilder,
  FormArray,
  FormControl,
  Validators,
} from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { Constant } from "src/app/shared/constants/constant";
import { Router } from "@angular/router";

export interface Teacher {
  teacherName: string;
  des: string;
  apointType: string;
  schoolName: string;
  schlCatName: string;
  slNo: Number;
  encId: string;
  promotTitle: [];
  promotedTitle: string;
  teacherTitle: string;
  listId: Number;
  rejectRemark: string;
}
@Component({
  selector: "app-view-approved-list",
  templateUrl: "./view-approved-list.component.html",
  styleUrls: ["./view-approved-list.component.css"],
})
export class ViewApprovedListComponent implements OnInit {
  //=========== member declaration
  plPrivilege: string = "view"; //For menu privilege
  tabs: any = []; //For shwoing tabs
  config = new Constant();
  adminPrivilege: boolean = false;
  promotedTeacher: Teacher[] = [];
  displayedColumns: string[] = [
    "sl",
    "teacherName",
    "teacherCode",
    "des",
    "apointType",
    "schoolName",
    "schlCatName",
    "promotionStatus",
  ];
  dataSource: MatTableDataSource<Teacher> = new MatTableDataSource(
    this.promotedTeacher
  );
  selection = new SelectionModel<Teacher>(true, []);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public fileUrl = environment.filePath;

  serviceType: string = "Search";
  public show: boolean = false;
  public buttonName: any = "Show";
  filterData: any = {
    annextureData: [],
    userProfile: [],
    districtData: [],
    blockData: [],
    serviceType: this.serviceType,
  };

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

  checkedData: any = {
    selected: [],
    userData: [],
  };
  isLoading = false;
  isInitAdmin: boolean = false;
  isNorecordFound: boolean = false;
  remarks: string = "";

  constructor(
    private teacherPromotion: TeacherPromotionService,
    private commonFunctionHelper: CommonFunctionHelper,
    private commonService: CommonserviceService,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
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
    this.getAnnextureData();
    this.userInput.currentAcademicYear =
      this.commonFunctionHelper.currentAcademicYear();
    this.filterData.userProfile = this.commonService.getUserProfile(); // get user profile
    this.getDistrict();
    this.isInitAdmin = true;
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
  toggle() {
    this.show = !this.show;
    if (this.show) this.buttonName = "Hide";
    else this.buttonName = "Show";
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

  getRejectRemark(listIds: any) {
    for (let teacherId of this.promotedTeacher) {
      if (teacherId.listId == listIds) {
        this.remarks = teacherId.rejectRemark;
      }
    }
  }

  getSearchParams() {
    return {
      ...this.page,
      ...this.userInput,
      ...this.filterData,
    };
  }

  searchApprovedTeacher() {
    this.spinner.show();
    this.isLoading = true;
    this.teacherPromotion
      .getApprovedPromotion(this.getSearchParams())
      .subscribe((response) => {
        this.promotedTeacher = response?.data;
        this.dataSource = response?.data;
        this.page.totalRows = response?.totalRecord; // update length
        this.dataSource.paginator = this.paginator; // update paginator
        this.isNorecordFound = this.promotedTeacher.length ? false : true;
        this.isLoading = false;
        this.isInitAdmin = false;
        this.spinner.hide();
      });
  }

  onPageChange(event: any) {
    this.page.limit = event.pageSize; // current page size ex: 10
    this.page.offset = event.pageIndex * event.pageSize;
    this.page.previousSize = this.page.limit * event.pageIndex; // set previous size
    this.page.pageIndex = event.pageIndex;
    this.searchApprovedTeacher();
  }

  printPage() {
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }

  downloadPromotedTeacher() {
    this.spinner.show();
    this.filterData.serviceType = "Download";
    this.teacherPromotion
      .getApprovedPromotion(this.getSearchParams())
      .subscribe({
        next: (res: any) => {
          let filepath = this.fileUrl + "/" + res.data.replace(".", "~");
          window.open(filepath);
          this.spinner.hide();
        },
        error: (error: any) => {
          this.spinner.hide();
        },
      });
  }
}
