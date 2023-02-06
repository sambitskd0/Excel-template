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
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { NgxSpinnerService } from "ngx-spinner";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { Router } from "@angular/router";
import { Constant } from "src/app/shared/constants/constant";
import { FormBuilder } from "@angular/forms";
import { SelectionModel } from "@angular/cdk/collections";
import { TeacherPromotionService } from "../../services/teacher-promotion.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-school-view",
  templateUrl: "./school-view.component.html",
  styleUrls: ["./school-view.component.css"],
})
export class SchoolViewComponent implements OnInit {
  //=========== member declaration
  plPrivilege: string = "view"; //For menu privilege
  tabs: any = []; //For shwoing tabs
  config = new Constant();
  adminPrivilege: boolean = false;
  public fileUrl = environment.filePath;

  filterData: any = {
    annextureData: [],
    userProfile: [],
    districtData: [],
    blockData: [],
    clusterData: [],
    schoolData: [],
    schoolCategoryData: [],
    teacherList: [],
  };
  userInput: any = {
    currentAcademicYear: "",
    districtId: "",
    blockId: "",
    clusterId: "",
    schoolId: "",
    schoolCategory: "",
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
  constructor(
    private formBuilder: FormBuilder,
    private commonFunctionHelper: CommonFunctionHelper,
    private commonService: CommonserviceService,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private teacherPromotionService: TeacherPromotionService,
    private spinner: NgxSpinnerService,
    private privilegeHelper: PrivilegeHelper, //For menu privilege,
    private router: Router,

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
        "slNo",
        "teacherName",
        "teacherCode",
        "currentDesignation",
        "promotedDesignation",
        "lastPromotedOn",
      ];
    } else {
      this.matTable.displayedColumns = [
        "slNo",
        "teacherName",
        "teacherCode",
        "currentDesignation",
        "promotedDesignation",
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
  onSearch(searchType: String) {
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
              this.getCluster();
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
    this.loadData({
      ...this.getSearchParams(),
      searchType: "VIEW",
    });
  }
  loadData(params: any) {
    this.matTable.isLoading = true;
    this.teacherPromotionService
      .getTeacherPrmotedListSchoolWise(params)
      .subscribe({
        next: (response: any) => {
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
                  .then(() => this.loadData(this.getSearchParams()));
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
  getCluster() {
    if (+this.userInput.blockId) {
      this.commonService
        .getClusterByBlockId(this.filterData.userProfile.block)
        .subscribe({
          next: (response: any) => {
            this.filterData.clusterData = response?.data.filter((item: any) => {
              return item.clusterId == this.filterData.userProfile.cluster;
            });
            this.userInput.clusterId = +this.filterData.userProfile.cluster;
            this.spinner.hide();
            this.getSchool();
          },
        });
    }
  }
  getSchool() {
    if (+this.userInput.clusterId) {
      this.commonService
        .getSchoolList(this.filterData.userProfile.cluster)
        .subscribe({
          next: (response: any) => {
            this.filterData.schoolData = response?.data.filter((item: any) => {
              return (
                item.schoolUdiseCode == this.filterData.userProfile.udiseCode
              );
            });
            this.userInput.schoolId = this.filterData.userProfile.school;
            this.spinner.hide();
            this.getSchoolCategory();
          },
        });
    }
  }
  getSchoolCategory() {
    if (this.filterData.userProfile?.schoolCategory) {
      this.commonService.getSchoolCategory().subscribe({
        next: (response: any) => {
          this.filterData.schoolCategoryData = response?.data.filter(
            (item: any) => {
              return +item.code == +this.filterData.userProfile?.schoolCategory;
            }
          );
          setTimeout(() => {
            this.userInput.schoolCategory =
              this.filterData.userProfile?.schoolCategory;
          });
          this.spinner.hide();
        },
      });
    }
  }
}
