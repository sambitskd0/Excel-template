import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { trigger, style, animate, transition } from "@angular/animations";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { NgForm } from "@angular/forms";
import { ngxCsv } from "ngx-csv/ngx-csv";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { NgxSpinnerService } from "ngx-spinner";
import { DataTableDirective } from "angular-datatables";
import { InspectionMisService } from "../../services/inspection-mis.service";
import { MatTableExporterDirective } from "mat-table-exporter";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { formatDate } from "@angular/common";
import { environment } from "src/environments/environment";
import { ManageUserService } from "src/app/application/user/services/manage-user.service";

@Component({
  selector: "app-teacher-attendance",
  templateUrl: "./teacher-attendance.component.html",
  styleUrls: ["./teacher-attendance.component.css"],
  animations: [
    trigger("fadeSlideInOut", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(-10px)" }),
        animate("500ms", style({ opacity: 1, transform: "translateY(0)" })),
      ]),
      transition(":leave", [
        animate("500ms", style({ opacity: 0, transform: "translateY(-10px)" })),
      ]),
    ]),
  ],
})
export class TeacherAttendanceComponent implements OnInit {
  datatableElement!: DataTableDirective;
  @ViewChild("searchForm") searchForm!: NgForm;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() mode!: ProgressBarMode;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter!: MatTableExporterDirective;
  userProfile = this.commonService.getUserProfile();
  public fileUrl1 = environment.filePath;
  cardIsDisplayed = true;
  scDistrictId: any = "";
  scBlockId: any = "";
  scBlockLoading: boolean = false;
  scClusterLoading: boolean = false;

  scClusterId: any = "";
  schoolId: any = "";
  schoolType :any ="";
  scDisrtictChanged: boolean = false;
  scBlockChanged: boolean = false;
  scClusterChanged: boolean = false;
  scSchoolChanged: boolean = false;
  isNorecordFound: boolean = false;
  isInitAdmin: boolean = false;
  isLoading = false;
  sessionDistrictId: any =
    this.userProfile.district != 0 ? this.userProfile.district : "";
  sessionBlockId: any =
    this.userProfile.block != 0 ? this.userProfile.block : "";
  sessionClusterId: any =
    this.userProfile.cluster != 0 ? this.userProfile.cluster : "";
  sessionSchoolId: any =
    this.userProfile.school != 0 ? this.userProfile.school : "";
  districtData: any;
  blockData: any;
  clusterData: any;
  getSchoolData: any;
  pageIndex: any = 0;
  previousSize: any = 0;
  pageSize = 10;
  offset = 0;
  currentPage = 0;
  scDisrtictLoading: boolean = false;
  totalRows = 0;
  pageSizeOptions: number[] = [10, 25, 100];
  displayedColumns: string[] = ["slNo", "school_name", "teacher_type"]; // define mat table columns
  resultListData: any = [];
  dataSource = new MatTableDataSource(this.resultListData);
  resultData: any;
  pageLevel: any;
  totalSchoolSum: any;
  totalNoOfVistsSchools: any;
  totalPostedSum: any;
  totalNoOfVistsSum: any;
  totalPercentagePresent: any;
  totalPercentageLeave: any;
  totalPercentageAbsent: any;
  districtName: any;
  blockName: any;
  clusterName: any;
  schoolName: any;
  parVal: any;
  getDistrictBackId: any;
  getBlockBackId: any;
  getClusterBackId: any;
  getSchoolBackId: any;
  posts: any;
  startDate: any;
  endDate: any;
  maxDate: any = Date;
  getStartDate: any;
  getEndDate: any;
  totalPercentageOnDuty: any;
  csvoptions: any;
  csvData: any;
  totalPostedSumTechHM: any;

  totalPresentTechHMs: any;
  authorizedLeaveTechHMs: any;
  unAuthorizedLeaveTechHMs: any;
  onDutyTechHMs: any;

  totalPresentStaffs: any;
  authorizedLeaveStaffs: any;
  unAuthorizedLeaveStaffs: any;
  onDutyStaffs: any;

  totalPercentagePresentTechHM: any;
  totalPercentageAbsentTechHM: any;
  totalPercentageLeaveTechHM: any;
  totalPercentageOnDutyTechHM: any;
  totalPostedSumStaff: any;
  totalPercentagePresentStaff: any;
  totalPercentageLeaveStaff: any;
  totalPercentageAbsentStaff: any;
  totalPercentageOnDutyStaff: any;
  loginLevel: any;
  backLevel: any;

  scDesignationId: any = "";
  scDesignationChanged: boolean = false;
  designationData: any;
  degLevel: any;
  sessionDegId: any = this.userProfile.designationId;

  totalPostedSumHM: any;
  totalPercentagePresentHM: any;
  totalPercentageLeaveHM: any;
  totalPercentageAbsentHM: any;
  totalPercentageOnDutyHM: any;
  totalPresentHMs: any;
  authorizedLeaveHMs: any;
  unAuthorizedLeaveHMs: any;
  onDutyHMs: any;

  totalPostedSumTech: any;
  totalPercentagePresentTech: any;
  totalPercentageLeaveTech: any;
  totalPercentageAbsentTech: any;
  totalPercentageOnDutyTech: any;
  totalPresentTechs: any;
  authorizedLeaveTechs: any;
  unAuthorizedLeaveTechs: any;
  onDutyTechs: any;
  officialsGroup: any = "";
  userLevelId: any = "0";
  stateUser: boolean = false;
	distUser: boolean = false;
	blkUser: boolean = false;

	distLvl: boolean = false;
	blkLvl: boolean = false;
	clusterLvl: boolean = false;

	desGrpSelect: boolean = true;
	desGrpLoading: boolean = true;
	DesignationGroupData: any = "";
  designationGroupId: any = "0";
  intDesignationId: any = "0";
  designationSelect: boolean = true;
	designationLoading: boolean = false;
  distLvl2: boolean = false;
  designationChanged: boolean = false;

  constructor(
    private commonService: CommonserviceService,
    private spinner: NgxSpinnerService,
    private InspectionMis: InspectionMisService,
    public ManageUserService: ManageUserService,
    private alertHelper: AlertHelper
  ) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    if (this.userProfile.userLevel == 5) {
			this.userLevelId = 5;
			this.loadSubDesignation(5);
		} else if (this.userProfile.userLevel == 4) {
			this.userLevelId = 4;
			this.stateUser = true;
			this.distUser = false;
			this.blkUser = false;
			this.loadSubDesignation(4);
		} else if (this.userProfile.userLevel == 3) {
			this.loadSubDesignation(2);
			this.stateUser = true;
			this.distUser = true;
			this.blkUser = true;
		} else if (this.userProfile.userLevel == "") {
			this.userLevelId = 0;
		}
    this.getDistrict();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  toggle() {
    this.cardIsDisplayed = !this.cardIsDisplayed;
  }

  loadSubDesignation(levelId: any) {
		if (levelId > 0) {
			this.getDesignationGroup(levelId);
		}
		if (levelId == 5) {
			this.distLvl = false;
			this.blkLvl = false;
			this.clusterLvl = false;
			this.distLvl2 = false;
		} else if (levelId == 4) {
			this.distLvl = true;
			this.distLvl2 = true;
			this.blkLvl = false;
			this.clusterLvl = false;
		} else if (levelId == 3) {
			this.distLvl = true;
			this.blkLvl = true;
			this.clusterLvl = false;
			this.distLvl2 = false;
		} else if (levelId == 2) {
			this.distLvl = true;
			this.blkLvl = true;
			this.clusterLvl = true;
			this.distLvl2 = false;
		}
	}

	getDesignationGroup(levelId: any) {
		this.desGrpSelect = false;
		this.desGrpLoading = false;
		this.DesignationGroupData = [];
		this.ManageUserService.getDesignationGroup(levelId).subscribe((res) => {
			this.posts = res;
			let data: any = res;
			for (let key of Object.keys(data["data"])) {
				this.DesignationGroupData.push(data["data"][key]);
			}
			this.desGrpSelect = true;
			this.desGrpLoading = true;
		});
	}

	getSubDesignation(designtionId: any) {
		if (designtionId > 0) {
			this.designationChanged = true;
      this.designationSelect = false;
			this.designationData = [];
      this.scDesignationId = "";
			this.designationLoading = true;
			this.ManageUserService.getSubDesignation(designtionId).subscribe(
				(res) => {
					this.posts = res;
					let data: any = res;
					for (let key of Object.keys(data["data"])) {
						this.designationData.push(data["data"][key]);
					}
					this.designationChanged = false;
					this.designationLoading = false;
          this.designationSelect = true;
				}
			);
		}else{
      this.scDesignationId = "";
    }
	}

  getDistrict() {
    this.blockData = [];
    this.clusterData = [];
    this.getSchoolData = [];
    this.scBlockId = "";
    this.scClusterId = "";
    this.schoolId = "";

    this.scDisrtictChanged = true;
    this.commonService.getAllDistrict().subscribe((res: []) => {
      this.posts = res;
      this.districtData = this.posts.data;
      if (this.userProfile.district != 0 || this.userProfile.district != "") {
        this.districtData = this.districtData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        this.scDistrictId = this.userProfile.district;
        this.getBlock(this.userProfile.district);
        this.scDisrtictChanged = false;
      } else {
        this.districtData = this.districtData;
        this.scDisrtictChanged = false;
      }
      this.scDisrtictChanged = false;
    });
  }

  getBlock(districtId: any) {
    this.scBlockId = "";
    this.scClusterId = "";
    this.schoolId = "";
    this.blockData = [];
    this.clusterData = [];
    this.getSchoolData = [];

    this.scBlockChanged = true;
    if (districtId !== "") {
      this.commonService
        .getBlockByDistrictid(districtId)
        .subscribe((res: any) => {
          this.blockData = res;
          this.blockData = this.blockData?.data;

          if (this.userProfile.block != 0 || this.userProfile.block != "") {
            this.blockData = this.blockData.filter((blo: any) => {
              return blo.blockId == this.userProfile.block;
            });

            this.scBlockId = this.userProfile.block;
            this.getCluster(this.userProfile.block);
            this.scBlockChanged = false;
          } else {
            this.scBlockChanged = false;
          }
          this.scBlockChanged = false;
        });
    } else {
      this.scBlockChanged = false;
    }
  }

  getCluster(blockId: any) {
    this.scClusterChanged = true;
    this.scClusterId = "";
    this.schoolId = "";
    this.clusterData = [];
    this.getSchoolData = [];

    if (blockId !== "") {
      this.commonService.getClusterByBlockId(blockId).subscribe((res: any) => {
        this.clusterData = res;
        this.clusterData = this.clusterData?.data;

        if (this.userProfile.cluster != 0 || this.userProfile.cluster != "") {
          this.clusterData = this.clusterData.filter((clu: any) => {
            return clu.clusterId == this.userProfile.cluster;
          });
          this.searchForm.controls["scClusterId"].patchValue(
            this.userProfile.cluster
          );
          this.getSchool(this.userProfile.cluster);
        } else {
          this.scClusterChanged = false;
        }
        this.scClusterChanged = false;
      });
    } else {
      this.scClusterChanged = false;
    }
  }
  getSchool(clusterId: any) {
    this.schoolId = "";
    this.scSchoolChanged = true;

    this.getSchoolData = [];

    if (clusterId !== "") {
      
      this.InspectionMis.getSchoolList(clusterId).subscribe((res: any) => {
        this.getSchoolData = res;
        this.getSchoolData = this.getSchoolData?.data;

        if (this.sessionSchoolId != "") {
          this.searchForm.controls["schoolId"].patchValue(this.sessionSchoolId);
        }

        this.scSchoolChanged = false;
      });
    } else {
      this.scSchoolChanged = false;
    }
  }

  onSearch() {
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.previousSize = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    if (this.validateForm() === true) {
      this.loadViewData(this.getSearchParams());
    }
  }

  validateForm() {
    if (this.designationGroupId != 0) {
      if (this.scDesignationId === "") {
        this.alertHelper.viewAlert(
          "error",
          "Required",
          "Please select sub designation"
        );
        return false;
      }
  }
  
    if (this.startDate === undefined) {
      this.alertHelper.viewAlert(
        "error",
        "Required",
        "Please select Start Date."
      );
      return false;
    }

    if (this.endDate === undefined) {
      this.alertHelper.viewAlert(
        "error",
        "Required",
        "Please select End Date."
      );
      return false;
    }

    if (this.startDate != undefined && this.endDate != undefined) {
      if (
        formatDate(this.endDate, "yyyy-MM-dd", "en_US") <
        formatDate(this.startDate, "yyyy-MM-dd", "en_US")
      ) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "End Date should not be smaller than Start Date"
        );
        this.endDate = undefined;
        return false;
      }
    }
    return true;
  }

  getSearchParams() {
    return {
      scDistrictId: this.searchForm.controls["scDistrictId"]?.value,
      scBlockId: this.searchForm.controls["scBlockId"]?.value,
      scClusterId: this.searchForm.controls["scClusterId"]?.value,
      schoolId: this.searchForm.controls["schoolId"]?.value,
      startDate: this.searchForm.controls["startDate"]?.value,
      endDate: this.searchForm.controls["endDate"]?.value,
      designationGroupId: this.searchForm.controls["designationGroupId"].value,
      scDesignationId: this.searchForm.controls["scDesignationId"]?.value,
      officialsGroup: this.searchForm.controls["officialsGroup"]?.value,
      schoolType: this.searchForm.controls["schoolType"]?.value
    };
  }

  loadViewData(params: any) {
    console.log(params);
    this.spinner.show();
    const paramObj = {
      scDistrictId: params.scDistrictId,
      scBlockId: params.scBlockId,
      scClusterId: params.scClusterId,
      schoolId: params.schoolId,
      startDate: params.startDate,
      endDate: params.endDate,
      scDesignationId: params.scDesignationId,
      officialsGroup: params.officialsGroup,
      schoolType: params.schoolType
    };
    this.isLoading = true;

    if (paramObj.schoolId != "") {
      this.pageLevel = 4;
    } else if (paramObj.scClusterId != "") {
      this.pageLevel = 3;
    } else if (paramObj.scBlockId != "") {
      this.pageLevel = 2;
    } else if (paramObj.scDistrictId != "") {
      this.pageLevel = 1;
    } else {
      this.pageLevel = 0;
    }
    this.InspectionMis.getTeacherAttendanceInspection(paramObj).subscribe({
      next: (res: any) => {
        // this.resultListData.length = params.previousSize; // set current size
        this.resultListData.push(...res?.data); // merge with existing data
        this.resultData = res?.data;
        this.totalSchoolSum = res?.totalSchoolSum;
        this.totalNoOfVistsSum = res?.totalNoOfVistsSum;
        this.totalNoOfVistsSchools = res?.totalNoOfVistsSchools;
        /**hm & teacher */
        this.totalPostedSumTechHM = res?.totalPostedSumTechHM;
        this.totalPercentagePresentTechHM = res?.totalPercentagePresentTechHM;
        this.totalPercentageLeaveTechHM = res?.totalPercentageLeaveTechHM;
        this.totalPercentageAbsentTechHM = res?.totalPercentageAbsentTechHM;
        this.totalPercentageOnDutyTechHM = res?.totalPercentageOnDutyTechHM;
        this.totalPresentTechHMs = res?.totalPresentTechHMs;
        this.authorizedLeaveTechHMs = res?.authorizedLeaveTechHMs;
        this.unAuthorizedLeaveTechHMs = res?.unAuthorizedLeaveTechHMs;
        this.onDutyTechHMs = res?.onDutyTechHMs;
        /**hm */
        this.totalPostedSumHM = res?.totalPostedSumHM;
        this.totalPercentagePresentHM = res?.totalPercentagePresentHM;
        this.totalPercentageLeaveHM = res?.totalPercentageLeaveHM;
        this.totalPercentageAbsentHM = res?.totalPercentageAbsentHM;
        this.totalPercentageOnDutyHM = res?.totalPercentageOnDutyHM;
        this.totalPresentHMs = res?.totalPresentHMs;
        this.authorizedLeaveHMs = res?.authorizedLeaveHMs;
        this.unAuthorizedLeaveHMs = res?.unAuthorizedLeaveHMs;
        this.onDutyHMs = res?.onDutyHMs;
        /**teacher */
        this.totalPostedSumTech = res?.totalPostedSumTech;
        this.totalPercentagePresentTech = res?.totalPercentagePresentTech;
        this.totalPercentageLeaveTech = res?.totalPercentageLeaveTech;
        this.totalPercentageAbsentTech = res?.totalPercentageAbsentTech;
        this.totalPercentageOnDutyTech = res?.totalPercentageOnDutyTech;
        this.totalPresentTechs = res?.totalPresentTechs;
        this.authorizedLeaveTechs = res?.authorizedLeaveTechs;
        this.unAuthorizedLeaveTechs = res?.unAuthorizedLeaveTechs;
        this.onDutyTechs = res?.onDutyTechs;
        /**staf */
        this.totalPresentStaffs = res?.totalPresentStaffs;
        this.authorizedLeaveStaffs = res?.authorizedLeaveStaffs;
        this.unAuthorizedLeaveStaffs = res?.unAuthorizedLeaveStaffs;
        this.onDutyStaffs = res?.onDutyStaffs;
        this.totalPostedSumStaff = res?.totalPostedSumStaff;
        this.totalPercentagePresentStaff = res?.totalPercentagePresentStaff;
        this.totalPercentageLeaveStaff = res?.totalPercentageLeaveStaff;
        this.totalPercentageAbsentStaff = res?.totalPercentageAbsentStaff;
        this.totalPercentageOnDutyStaff = res?.totalPercentageOnDutyStaff;

        this.resultListData.length = res?.totalRecord; // update length
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
        this.isLoading = false;
        this.isNorecordFound = this.resultListData.length ? false : true;
        this.isInitAdmin = true;
        this.spinner.hide();
        this.getDistrictBackId = res?.getDistrictBackId;
        this.getBlockBackId = res?.getBlockBackId;
        this.getClusterBackId = res?.getClusterBackId;
        this.getSchoolBackId = res?.getSchoolBackId;
        this.getStartDate = res?.startDate;
        this.getEndDate = res?.endDate;
        if (this.pageLevel == 3) {
          this.districtName = res?.districtName;
          this.blockName = res?.blockName;
          this.clusterName = res?.clusterName;
        }
        if (this.pageLevel == 4) {
          this.districtName = res?.districtName;
          this.blockName = res?.blockName;
          this.clusterName = res?.clusterName;
          this.schoolName = res?.schoolName;
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }
  printPage() {
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }

  drillDown(
    district: any,
    block: any,
    cluster: any,
    school: any,
    startDate: any,
    endDate: any
  ) {
    this.spinner.show();
    const pramsVal = {
      scDistrictId: district,
      scBlockId: block,
      scClusterId: cluster,
      schoolId: school,
      startDate: startDate,
      endDate: endDate,
      officialsGroup: this.officialsGroup,
      scDesignationId: this.scDesignationId,
      schoolType: this.schoolType,
    };

    if (pramsVal.schoolId != "") {
      this.searchForm.controls["schoolId"].patchValue(pramsVal.schoolId);
    } else if (pramsVal.scClusterId != "") {
      this.searchForm.controls["scClusterId"].patchValue(pramsVal.scClusterId);
      this.getSchool(pramsVal.scClusterId);
    } else if (pramsVal.scBlockId != "") {
      this.searchForm.controls["scBlockId"].patchValue(pramsVal.scBlockId);
      this.getCluster(pramsVal.scBlockId);
    } else if (pramsVal.scDistrictId != "") {
      this.searchForm.controls["scDistrictId"].patchValue(
        pramsVal.scDistrictId
      );
      this.getBlock(pramsVal.scDistrictId);
    }
    this.spinner.hide();
    this.loadViewData(pramsVal);
  }

  goBack(
    distId: any,
    blkId: any,
    cluId: any,
    sclId: any,
    level: any,
    startDate: any,
    endDate: any
  ) {
    if (cluId != "") {
      this.backLevel = 2;
    } else if (blkId != "") {
      this.backLevel = 3;
    } else if (distId != "") {
      this.backLevel = 4;
    } else {
      this.backLevel = 5;
    }
    if (this.backLevel != this.loginLevel) {
      if (level == 1) {
        this.parVal = {
          scDistrictId: "",
          scBlockId: "",
          scClusterId: "",
          schoolId: "",
          startDate: startDate,
          endDate: endDate,
          scDesignationId: this.scDesignationId,
          officialsGroup: this.officialsGroup,
          schoolType: this.schoolType
        };
        this.getDistrict();
        this.searchForm.controls["scDistrictId"].patchValue("");
        this.loadViewData(this.parVal);
      }

      if (level == 2) {
        this.parVal = {
          scDistrictId: distId,
          scBlockId: "",
          scClusterId: "",
          schoolId: "",
          startDate: startDate,
          endDate: endDate,
          scDesignationId: this.scDesignationId,
          officialsGroup: this.officialsGroup,
          schoolType: this.schoolType
        };

        this.searchForm.controls["scDistrictId"].patchValue(distId);
        this.getBlock(distId);
        this.searchForm.controls["scBlockId"].patchValue("");
        this.loadViewData(this.parVal);
      }

      if (level == 3) {
        this.parVal = {
          scDistrictId: distId,
          scBlockId: blkId,
          scClusterId: "",
          schoolId: "",
          startDate: startDate,
          endDate: endDate,
          scDesignationId: this.scDesignationId,
          officialsGroup: this.officialsGroup,
          schoolType: this.schoolType
        };

        this.getCluster(blkId);
        this.searchForm.controls["scDistrictId"].patchValue(distId);
        this.searchForm.controls["scBlockId"].patchValue(blkId);
        this.searchForm.controls["scClusterId"].patchValue("");

        this.loadViewData(this.parVal);
      }

      if (level == 4) {
        this.parVal = {
          scDistrictId: distId,
          scBlockId: blkId,
          scClusterId: cluId,
          schoolId: "",
          startDate: startDate,
          endDate: endDate,
          scDesignationId: this.scDesignationId,
          officialsGroup: this.officialsGroup,
          schoolType: this.schoolType
        };

        this.getSchool(cluId);
        this.searchForm.controls["scDistrictId"].patchValue(distId);
        this.searchForm.controls["scBlockId"].patchValue(blkId);
        this.searchForm.controls["scClusterId"].patchValue(cluId);
        this.searchForm.controls["schoolId"].patchValue("");
        this.loadViewData(this.parVal);
      }
    }
  }

  excel(level: any) {
    this.spinner.show();
    this.csvData = this.getSearchParams();
    this.InspectionMis.downloadTeacherAttendanceInpCsv(this.csvData).subscribe(
      (res: any) => {
        const data = res["data"];
        if (level == 0) {
          this.csvoptions = {
            fieldSeparator: ",",
            quoteStrings: '"',
            decimalseparator: ".",
            showLabels: true,
            useBom: true,
            headers: [
              "SLN#",
              "District",
              "Numbers Of Schools",
              "Number of visited schools",
              "Number of visits",

              "Total Posted Head-Master",
              "Present Head-Master (No.)",
              "Present Head-Master (%)",
              "Leave Head-Master (No.)",
              "Leave Head-Master (%)",
              "Absent Head-Master (No.)",
              "Absent Head-Master (%)",
              "On Office Work Head-Master (No.)",
              "On Office Work Head-Master (%)",

              "Total Posted Teacher",
              "Present Teacher (No.)",
              "Present Teacher (%)",
              "Leave Teacher (No.)",
              "Leave Teacher (%)",
              "Absent Teacher (No.)",
              "Absent Teacher (%)",
              "On Office Work Teacher (No.)",
              "On Office Work Teacher (%)",

              "Total Posted Teacher & Head-Master",
              "Present Teacher & Head-Master (No.)",
              "Present Teacher & Head-Master (%)",
              "Leave Teacher & Head-Master (No.)",
              "Leave Teacher & Head-Master (%)",
              "Absent Teacher & Head-Master (No.)",
              "Absent Teacher & Head-Master (%)",
              "On Office Work Teacher & Head-Master (No.)",
              "On Office Work Teacher & Head-Master (%)",

              "Total Posted Staff",
              "Present Staff (No.)",
              "Present Staff (%)",
              "Leave Staff (No.)",
              "Leave Staff (%)",
              "Absent Staff (No.)",
              "Absent Staff (%)",
              "On Office Work Staff (No.)",
              "On Office Work Staff (%)",
            ],
          };
        }
        if (level == 1) {
          this.csvoptions = {
            fieldSeparator: ",",
            quoteStrings: '"',
            decimalseparator: ".",
            showLabels: true,
            useBom: true,
            headers: [
              "SLN#",
              "District",
              "Block",
              "Numbers Of Schools",
              "Number of visited schools",
              "Number of visits",

              "Total Posted Head-Master",
              "Present Head-Master (No.)",
              "Present Head-Master (%)",
              "Leave Head-Master (No.)",
              "Leave Head-Master (%)",
              "Absent Head-Master (No.)",
              "Absent Head-Master (%)",
              "On Office Work Head-Master (No.)",
              "On Office Work Head-Master (%)",

              "Total Posted Teacher",
              "Present Teacher (No.)",
              "Present Teacher (%)",
              "Leave Teacher (No.)",
              "Leave Teacher (%)",
              "Absent Teacher (No.)",
              "Absent Teacher (%)",
              "On Office Work Teacher (No.)",
              "On Office Work Teacher (%)",

              "Total Posted Teacher & Head-Master",
              "Present Teacher & Head-Master (No.)",
              "Present Teacher & Head-Master (%)",
              "Leave Teacher & Head-Master (No.)",
              "Leave Teacher & Head-Master (%)",
              "Absent Teacher & Head-Master (No.)",
              "Absent Teacher & Head-Master (%)",
              "On Office Work Teacher & Head-Master (No.)",
              "On Office Work Teacher & Head-Master (%)",

              "Total Posted Staff",
              "Present Staff (No.)",
              "Present Staff (%)",
              "Leave Staff (No.)",
              "Leave Staff (%)",
              "Absent Staff (No.)",
              "Absent Staff (%)",
              "On Office Work Staff (No.)",
              "On Office Work Staff (%)",
            ],
          };
        }
        if (level == 2) {
          this.csvoptions = {
            fieldSeparator: ",",
            quoteStrings: '"',
            decimalseparator: ".",
            showLabels: true,
            useBom: true,
            headers: [
              "SLN#",
              "District",
              "Block",
              "Cluster",
              "Numbers Of Schools",
              "Number of visited schools",
              "Number of visits",

              "Total Posted Head-Master",
              "Present Head-Master (No.)",
              "Present Head-Master (%)",
              "Leave Head-Master (No.)",
              "Leave Head-Master (%)",
              "Absent Head-Master (No.)",
              "Absent Head-Master (%)",
              "On Office Work Head-Master (No.)",
              "On Office Work Head-Master (%)",

              "Total Posted Teacher",
              "Present Teacher (No.)",
              "Present Teacher (%)",
              "Leave Teacher (No.)",
              "Leave Teacher (%)",
              "Absent Teacher (No.)",
              "Absent Teacher (%)",
              "On Office Work Teacher (No.)",
              "On Office Work Teacher (%)",

              "Total Posted Teacher & Head-Master",
              "Present Teacher & Head-Master (No.)",
              "Present Teacher & Head-Master (%)",
              "Leave Teacher & Head-Master (No.)",
              "Leave Teacher & Head-Master (%)",
              "Absent Teacher & Head-Master (No.)",
              "Absent Teacher & Head-Master (%)",
              "On Office Work Teacher & Head-Master (No.)",
              "On Office Work Teacher & Head-Master (%)",

              "Total Posted Staff",
              "Present Staff (No.)",
              "Present Staff (%)",
              "Leave Staff (No.)",
              "Leave Staff (%)",
              "Absent Staff (No.)",
              "Absent Staff (%)",
              "On Office Work Staff (No.)",
              "On Office Work Staff (%)",
            ],
          };
        }
        if (level == 3 || level == 4) {
          this.csvoptions = {
            fieldSeparator: ",",
            quoteStrings: '"',
            decimalseparator: ".",
            showLabels: true,
            useBom: true,
            headers: [
              "SLN#",
              "District",
              "Block",
              "Cluster",
              "school",
              "Number of visits",

              "Total Posted Head-Master",
              "Present Head-Master (No.)",
              "Present Head-Master (%)",
              "Leave Head-Master (No.)",
              "Leave Head-Master (%)",
              "Absent Head-Master (No.)",
              "Absent Head-Master (%)",
              "On Office Work Head-Master (No.)",
              "On Office Work Head-Master (%)",

              "Total Posted Teacher",
              "Present Teacher (No.)",
              "Present Teacher (%)",
              "Leave Teacher (No.)",
              "Leave Teacher (%)",
              "Absent Teacher (No.)",
              "Absent Teacher (%)",
              "On Office Work Teacher (No.)",
              "On Office Work Teacher (%)",

              "Total Posted Teacher & Head-Master",
              "Present Teacher & Head-Master (No.)",
              "Present Teacher & Head-Master (%)",
              "Leave Teacher & Head-Master (No.)",
              "Leave Teacher & Head-Master (%)",
              "Absent Teacher & Head-Master (No.)",
              "Absent Teacher & Head-Master (%)",
              "On Office Work Teacher & Head-Master (No.)",
              "On Office Work Teacher & Head-Master (%)",

              "Total Posted Staff",
              "Present Staff (No.)",
              "Present Staff (%)",
              "Leave Staff (No.)",
              "Leave Staff (%)",
              "Absent Staff (No.)",
              "Absent Staff (%)",
              "On Office Work Staff (No.)",
              "On Office Work Staff (%)",
            ],
          };
        }

        new ngxCsv(data, "StaffAttendenceInspectionReport", this.csvoptions);
        this.spinner.hide();
      }
    );
  }

  
  exportSchoolList(district: any, block: any, cluster: any, school: any, startDate: any, endDate: any, deg: any, officialsGroup:any) {
    this.spinner.show();
    const paramObj = {
      scDistrictId: district,
      scBlockId: block,
      scClusterId: cluster,
      schoolId: school,
      startDate: startDate,
      endDate: endDate,
      scDesignationId: deg,
      schoolUdiseCode: "",
      officialsGroup:officialsGroup,
      typeWise: "clusterWise",
      schoolType: this.schoolType
    };

    this.InspectionMis.exportTeacherAttenInspectionReport(paramObj).subscribe({
      next: (res: any) => {
        let filepath = this.fileUrl1 + '/' + res.data.replace('.', '~');
        window.open(filepath);
        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }
}
