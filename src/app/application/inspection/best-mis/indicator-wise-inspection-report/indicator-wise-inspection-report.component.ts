import { Component,OnInit, ViewChild,Input} from "@angular/core";
import { NgForm } from "@angular/forms";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { NgxSpinnerService } from "ngx-spinner";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { ngxCsv } from "ngx-csv/ngx-csv";
import { InspectionMisService } from "../../services/inspection-mis.service";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { formatDate } from "@angular/common";
import { ManageUserService } from "src/app/application/user/services/manage-user.service";
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-indicator-wise-inspection-report',
  templateUrl: './indicator-wise-inspection-report.component.html',
  styleUrls: ['./indicator-wise-inspection-report.component.css']
})
export class IndicatorWiseInspectionReportComponent implements OnInit {

  public show: boolean = true;
  public buttonName: any = "Show";
  public fileUrl1 = environment.filePath;
  displayTable: boolean = false;
  isLoading = false;
  isNorecordFound: boolean = false;
  tattenlength: boolean = false;
  pageIndex: any = 0;
  previousSize: any = 0;
  // mat table
  @Input() mode!: ProgressBarMode;
  @ViewChild("searchForm") searchForm!: NgForm;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter!: MatTableExporterDirective;
  pageSize = 10;
  offset = 0;
  currentPage = 0;
  totalRows = 0;
  pageSizeOptions: number[] = [10, 25, 100];

  resultListData: any = [];
  resultListDatas: any = [];
  questionDetailsData!: any;
  dataSource = new MatTableDataSource(this.resultListData);
  //end
  bodyData: any;
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  scDisrtictChanged: boolean = false;
  scDisrtictChangedload: boolean = true;
  districtData: any;
  userProfile = this.commonService.getUserProfile();
  userType = this.userProfile.userType;
  userId = this.userProfile.userId;
  sessionDistrictId: any =
    this.userProfile.district != 0 ? this.userProfile.district : "";
  sessionBlockId: any =
    this.userProfile.block != 0 ? this.userProfile.block : "";
  sessionClusterId: any =
    this.userProfile.cluster != 0 ? this.userProfile.cluster : "";
  sessionSchoolId: any =
    this.userProfile.school != 0 ? this.userProfile.school : "";
  scBlockChanged: boolean = false;
  blockData: any = [];
  scClusterChanged: boolean = false;
  desgNameChanged: boolean = false;
  scDesgChanged: boolean = false;
  clusterData: any;
  scSchoolChanged: boolean = false;
  getSchoolData: any;
  inspectionListData: any;
  emptyCheck: boolean = false;
  isInitAdmin: boolean = false;
  tev: boolean = false;
  scDistrictId: any = "";
  scBlockId: any = "";
  scClusterId: any = "";
  schoolId: any = "";
  schoolUdiseCode: any = "";
  desList: any = "";
  datas: any;
  tatten: any;
  absentTeacherList: any;
  studentAttendence: any;
  questionList: any;
  answerList: any;
  datasd: any;
  startDate: any;
  desgName: any;
  endDate: any;
  maxDate: any = Date;
  numOfVisetedSchool: any;
  numOfVisit: any;
  openPer: any;
  pageLevel: any;
  numCol: any = 2;
  totopensch: any;
  totclosedSch: any;

  scDisrtictSelect: boolean = true;
  scDisrtictLoading: boolean = false;
  scBlockSelect: boolean = true;
  scBlockLoading: boolean = false;
  scClusterSelect: boolean = true;
  scClusterLoading: boolean = false;
  scSchoolSelect: boolean = true;
  scSchoolLoading: boolean = false;
  closePer: any;
  totalSchool: any;
  parVal: any;
  districtName: any;
  blockName: any;
  clusterName: any;
  schoolName: any;
  getDistrictBackId: any;
  getBlockBackId: any;
  getClusterBackId: any;
  getSchoolBackId: any;
  csvData: any;
  csvoptions: any;
  getStartDate: any;
  getEndDate: any;
  loginLevel: any;
  backLevel: any;
  totMdmDone: any;
  totMdmNotDone: any;
  scDesignationId: any = "";
  scDesignationChanged: boolean = false;
  designationData: any;
  degLevel: any;
  posts: any;
  sessionDegId: any = this.userProfile.designationId;
  schoolType:any = "";
  indicator:any = "";
  indicatorList:any = [];
  indicatorChanged: boolean = false;
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
  optionData: any;
  resSum: any;

  constructor(
    public commonService: CommonserviceService,
    private spinner: NgxSpinnerService,
    private InspectionMis: InspectionMisService,
    public ManageUserService: ManageUserService,
    private alertHelper: AlertHelper
  ) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.getDistrict();
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
		}
	}

  getSearchParams() {
    return {
      scDistrictId: this.searchForm.controls["scDistrictId"].value,
      scBlockId: this.searchForm.controls["scBlockId"].value,
      scClusterId: this.searchForm.controls["scClusterId"].value,
      schoolId: this.searchForm.controls["schoolId"].value,
      scDesignationId: this.searchForm.controls["scDesignationId"].value,
      startDate: this.searchForm.controls["startDate"].value,
      endDate: this.searchForm.controls["endDate"].value,
      schoolType: this.searchForm.controls["schoolType"].value,
      indicator: this.searchForm.controls["indicator"].value,
    };
  }

  getIndicators(e:any){
    if(e != ""){
      this.indicatorChanged = true;
      this.InspectionMis.getIndicatorsList({schType:e}).subscribe((res:any)=>{
        this.indicatorList = res.data;
        this.indicatorChanged = false;
      })
    }else{
      this.indicatorList = [];
      this.searchForm.controls["indicator"].patchValue("");
        this.indicatorChanged = false;
    }
  }

  onSearch() {
    if (this.validateForm() === true) {
      this.loadDataRes(this.getSearchParams());
    }
  }

  validateForm() {
    if (this.indicator == "") {
      this.alertHelper.viewAlert("error", "Required", "Please select indicator.");
      return false;
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

  loadDataRes(params: any) {
    this.spinner.show();
    const paramObj = {
      scDistrictId: params.scDistrictId,
      scBlockId: params.scBlockId,
      scClusterId: params.scClusterId,
      schoolId: params.schoolId,
      scDesignationId: this.scDesignationId,
      startDate: params.startDate,
      endDate: params.endDate,
      schoolType : this.schoolType,
      indicator : this.indicator,
    };

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
    this.isLoading = true;
    this.InspectionMis.indicatorReport(paramObj).subscribe({
      next: (res: any) => {
        this.resultListData = res?.data; // merge with existing data
        this.optionData = res?.optionValue;
        this.resSum = res?.resSum;
        this.totalSchool = res?.totalSchool;
        this.numOfVisetedSchool = res?.numOfVisetedSchool;
        this.numOfVisit = res?.numOfVisit;
        this.openPer = res?.openPer;
        this.closePer = res?.closePer;
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
        this.totopensch = res?.totopensch;
        this.totclosedSch = res?.totclosedSch;
        this.totMdmDone = res?.totMdmDone;
        this.totMdmNotDone = res?.totMdmNotDone;
        if (this.pageLevel == 3 || this.pageLevel == 4) {
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

  getDrillDownData(distId: any, blkId: any, cluId: any, sclId: any, startDate: any, endDate: any, level: any) {
    if (level == 1) {
      this.scDistrictId = distId;
      this.getBlock(distId);
      this.parVal = {
        scDistrictId: distId,
        scBlockId: "",
        scClusterId: "",
        schoolId: "",
        startDate: startDate,
        endDate: endDate,
      };
    }

    if (level == 2) {
      this.scDistrictId = distId;
      this.scBlockId = blkId;
      this.getCluster(blkId);
      this.parVal = {
        scDistrictId: distId,
        scBlockId: blkId,
        scClusterId: "",
        schoolId: "",
        startDate: startDate,
        endDate: endDate,
      };
    }

    if (level == 3) {
      this.scDistrictId = distId;
      this.scBlockId = blkId;
      this.scClusterId = cluId;
      this.getSchool(cluId);
      this.parVal = {
        scDistrictId: distId,
        scBlockId: blkId,
        scClusterId: cluId,
        schoolId: "",
        startDate: startDate,
        endDate: endDate,
      };
    }

    this.loadDataRes(this.parVal);
  }

  getDistrict() {
    this.scDisrtictSelect = false;
    this.scDisrtictLoading = true;
    this.commonService.getAllDistrict().subscribe((data: any) => {
      this.districtData = data;
      this.districtData = this.districtData.data;

      if (this.userProfile.district != 0 || this.userProfile.district != "") {
        this.districtData = this.districtData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        this.searchForm.controls["scDistrictId"].patchValue(
          this.userProfile.district
        );
        this.getBlock(this.userProfile.district);
      } else {
        this.districtData = this.districtData;
        this.scDisrtictSelect = true;
      }

      this.scBlockId = "";
      this.scDisrtictLoading = false;
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
          this.blockData = this.blockData.data;

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
        this.clusterData = this.clusterData.data;
        this.scClusterChanged = false;

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
        this.getSchoolData = this.getSchoolData.data;

        if (this.sessionSchoolId != "") {
          this.searchForm.controls["schoolId"].patchValue(this.sessionSchoolId);
        }

        this.scSchoolChanged = false;
      });
    } else {
      this.scSchoolChanged = false;
    }
  }

  desginationList() {
    this.InspectionMis.DesignationList().subscribe((res: any) => {
      this.desList =res?.data;
    });
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
        };
        this.getDistrict();
        this.searchForm.controls["scDistrictId"].patchValue("");
        this.loadDataRes(this.parVal);
      }

      if (level == 2) {
        this.parVal = {
          scDistrictId: distId,
          scBlockId: "",
          scClusterId: "",
          schoolId: "",
          startDate: startDate,
          endDate: endDate,
        };

        this.searchForm.controls["scDistrictId"].patchValue(distId);
        this.getBlock(distId);
        this.searchForm.controls["scBlockId"].patchValue("");
        this.loadDataRes(this.parVal);
      }

      if (level == 3) {
        this.parVal = {
          scDistrictId: distId,
          scBlockId: blkId,
          scClusterId: "",
          schoolId: "",
          startDate: startDate,
          endDate: endDate,
        };

        this.getCluster(blkId);
        this.searchForm.controls["scDistrictId"].patchValue(distId);
        this.searchForm.controls["scBlockId"].patchValue(blkId);
        this.searchForm.controls["scClusterId"].patchValue("");

        this.loadDataRes(this.parVal);
      }

      if (level == 4) {
        this.parVal = {
          scDistrictId: distId,
          scBlockId: blkId,
          scClusterId: cluId,
          schoolId: "",
          startDate: startDate,
          endDate: endDate,
        };

        this.getSchool(cluId);
        this.searchForm.controls["scDistrictId"].patchValue(distId);
        this.searchForm.controls["scBlockId"].patchValue(blkId);
        this.searchForm.controls["scClusterId"].patchValue(cluId);
        this.searchForm.controls["schoolId"].patchValue("");
        this.loadDataRes(this.parVal);
      }
    }
  }
  printPage() {
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }

  excel(level: any) {
    this.spinner.show();
    this.csvData = this.getSearchParams();
    this.InspectionMis.downloadIndicatorReport(this.csvData).subscribe({
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

  excelDetails() {
    this.spinner.show();
    this.csvData = this.getSearchParams();
    this.csvData['schoolId'] = "";
    this.csvData['schoolUdiseCode'] = "";
    this.InspectionMis.downloadSchoolMonitoringReport(this.csvData).subscribe(
      (res: any) => {
        const data = res["data"];
        this.csvoptions = {
          fieldSeparator: ",",
          quoteStrings: '"',
          decimalseparator: ".",
          showLabels: true,
          useBom: true,
          headers: [
            "SLN#",
            "UDISE Code",
            "School Name",
            "District Name",
            "Block Name",
            "Cluster Name",
            "Monitoring Date",
            "Monitored By",
            "Designation",
            "Mobile No",
            "School status",
            "Status",
          ],
        };
        new ngxCsv(data, "schoolMonitoringReport", this.csvoptions);
        this.spinner.hide();
      }
    );
  }

  toggle() {
    this.show = !this.show;
    if (this.show) this.buttonName = "Hide";
    else this.buttonName = "Show";
  }

  

  
}