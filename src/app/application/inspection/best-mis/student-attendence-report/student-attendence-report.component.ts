import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ElementRef, Input } from "@angular/core";
import { NgForm } from "@angular/forms";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { NgxSpinnerService } from "ngx-spinner";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { ngxCsv } from "ngx-csv/ngx-csv";
import { InspectionMisService } from "../../services/inspection-mis.service";
import { RegistrationService } from "src/app/application/teacher/services/registration.service";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { formatDate } from '@angular/common';
import { environment } from "src/environments/environment";
import { ManageUserService } from "src/app/application/user/services/manage-user.service";

@Component({
  selector: 'app-student-attendence-report',
  templateUrl: './student-attendence-report.component.html',
  styleUrls: ['./student-attendence-report.component.css']
})
export class StudentAttendenceReportComponent implements OnInit {
  @ViewChild("searchForm") searchForm!: NgForm;
  public show: boolean = true;
  public buttonName: any = 'Show';
  public fileUrl1 = environment.filePath;
  csvoptions: any;
  csvData: any;

  displayTable: boolean = false;
  isLoading = false;
  isNorecordFound: boolean = false;
  tattenlength: boolean = false;
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
  displayedColumns: string[] = [
    "slNo",
    "District_Name",
    "block_code",
    "block_name",

    "Num_of_schools",
    "Num_of_visited_schools",
    "Num_of_visits",
    "Open",
    "close",
  ]; // define mat table columns

  resultListData: any = [];
  resultListDatas: any = [];
  questionDetailsData!: any;
  dataSource = new MatTableDataSource(this.resultListData);
  //end
  bodyData: any; @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  scDisrtictChanged: boolean = false;
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
  label: any;
  totalEnrolledBoys: any;
  actualPresentGirls: any;
  attendanceOnRegisterGirls: any;
  totalEnrolledGirls: any;
  actualPresentBoys: any;
  attendanceOnRegisterBoys: any;
  totalEnrolledTransgender: any;
  attendanceOnRegisterTransgender: any;
  actualPresentTransgender: any;
  scDisrtictSelect: boolean = true;
  scDisrtictLoading: boolean = false;
  scBlockSelect: boolean = true;
  scBlockLoading: boolean = false;
  scClusterSelect: boolean = true;
  scClusterLoading: boolean = false;
  scSchoolSelect: boolean = true;
  scSchoolLoading: boolean = false;
  pageLevel: any;
  getDistrictBackId: any;
  getBlockBackId: any;
  getClusterBackId: any;
  getSchoolBackId: any;
  getStartDate: any;
  getEndDate: any;
  parVal: any;
  loginLevel: any;
  backLevel:any;
  scDesignationId: any = "";
  scDesignationChanged: boolean = false;
  designationData: any;
  degLevel: any;
  posts: any;
  scClassGroup: any = "";
  sessionDegId: any = this.userProfile.designationId;
  attendanceOnRegisterBoysPer : any;
  actualPresentBoysPer:any;
  attendanceOnRegisterGirlsPer:any;
  actualPresentGirlsPer:any;
  attendanceOnRegisterTransgenderPer:any;
  actualPresentTransgenderPer:any;
  schoolType:any = "";
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
    public commonService: CommonserviceService,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private route: Router,
    private router: ActivatedRoute,
    private registrationService: RegistrationService,
    public ManageUserService: ManageUserService,
    private InspectionMis: InspectionMisService,
    private el: ElementRef,
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

  getSearchParams() {
    return {
      scDistrictId: this.searchForm.controls['scDistrictId'].value,
      scBlockId: this.searchForm.controls['scBlockId'].value,
      scClusterId: this.searchForm.controls['scClusterId'].value,
      schoolId: this.searchForm.controls['schoolId'].value,
      designationGroupId: this.searchForm.controls["designationGroupId"].value,
      scDesignationId: this.searchForm.controls['scDesignationId'].value,
      scClassGroup: this.searchForm.controls['scClassGroup'].value,
      startDate: this.searchForm.controls['startDate'].value,
      endDate: this.searchForm.controls['endDate'].value,
      schoolType: this.searchForm.controls["schoolType"].value,
    };

  }

  onSearch() {
    if (this.validateForm() === true) {
      this.loadDistrict(this.getSearchParams());
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
      if (formatDate(this.endDate, 'yyyy-MM-dd', 'en_US') < formatDate(this.startDate, 'yyyy-MM-dd', 'en_US')) {
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

  loadDistrict(params: any) {
    this.spinner.show();
    const paramObj = {

      scDistrictId: params.scDistrictId,
      scBlockId: params.scBlockId,
      scClusterId: params.scClusterId,
      schoolId: params.schoolId,
      scClassGroup: params.scClassGroup,
      startDate: params.startDate,
      endDate: params.endDate,
      scDesignationId: this.scDesignationId,
      schoolType : this.schoolType,
    };
    this.isLoading = true;

    if (paramObj.schoolId != '') {
      this.pageLevel = 4;
    } else if (paramObj.scClusterId != '') {
      this.pageLevel = 3;
    } else if (paramObj.scBlockId != '') {
      this.pageLevel = 2;
    } else if (paramObj.scDistrictId != '') {
      this.pageLevel = 1;
    } else {
      this.pageLevel = 0;
    }

    this.InspectionMis.studentAttendenceBest(paramObj).subscribe({
      next: (res: any) => {

        // this.resultListData.length = previousSize; // set current size
        this.resultListData = res?.data; // merge with existing data
        this.resultListDatas = res?.totalSchool;
        this.numOfVisetedSchool = res?.numOfVisetedSchool;
        this.numOfVisit = res?.numOfVisit;
        this.totalEnrolledBoys = res?.totalEnrolledBoys;
        this.attendanceOnRegisterBoys = res?.attendanceOnRegisterBoys;
        this.attendanceOnRegisterBoysPer = res?.attendanceOnRegisterBoysPer;
        this.actualPresentBoys = res?.actualPresentBoys;
        this.actualPresentBoysPer = res?.actualPresentBoysPer;
        this.totalEnrolledGirls = res?.totalEnrolledGirls;
        this.attendanceOnRegisterGirls = res?.attendanceOnRegisterGirls;
        this.attendanceOnRegisterGirlsPer = res?.attendanceOnRegisterGirlsPer;
        this.actualPresentGirls = res?.actualPresentGirls;
        this.actualPresentGirlsPer = res?.actualPresentGirlsPer;

        this.totalEnrolledTransgender = res?.totalEnrolledTransgender;
        this.attendanceOnRegisterTransgender = res?.attendanceOnRegisterTransgender;
        this.attendanceOnRegisterTransgenderPer = res?.attendanceOnRegisterTransgenderPer;
        this.actualPresentTransgender = res?.actualPresentTransgender;
        this.actualPresentTransgenderPer = res?.actualPresentTransgenderPer;
        this.getDistrictBackId = res?.getDistrictBackId;
        this.getBlockBackId = res?.getBlockBackId;
        this.getClusterBackId = res?.getClusterBackId;
        this.getSchoolBackId = res?.getSchoolBackId;
        this.getStartDate = res?.startDate;
        this.getEndDate = res?.endDate;
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
        this.isLoading = false;
        this.isNorecordFound = this.resultListData.length ? false : true;
        this.isInitAdmin = true;
        this.spinner.hide();


      }, error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      }

    });

  }

  getData(dist: any, blk: any, clus: any, schl: any, level: any, startDate: any, endDate: any) {

    if (level == 1) {

      this.parVal = {
        scDistrictId: dist,
        scBlockId: "",
        scClusterId: "",
        schoolId: "",
        scClassGroup: this.scClassGroup,
        startDate: startDate,
        endDate: endDate
      }
      this.scDistrictId = dist;
      this.getBlock(dist);
    }

    if (level == 2) {

      this.parVal = {
        scDistrictId: dist,
        scBlockId: blk,
        scClusterId: "",
        schoolId: "",
        scClassGroup: this.scClassGroup,
        startDate: startDate,
        endDate: endDate
      }
      this.scDistrictId = dist;
      this.scBlockId = blk;
      this.getCluster(blk);
    }

    if (level == 3) {
      this.scDistrictId = dist;
      this.scBlockId = blk;
      this.scClusterId = clus;
      this.getSchool(clus);
      this.parVal = {
        scDistrictId: dist,
        scBlockId: blk,
        scClusterId: clus,
        schoolId: "",
        scClassGroup: this.scClassGroup,
        startDate: startDate,
        endDate: endDate
      }
    }
    this.loadDistrict(this.parVal);

  }

  goBack(distId: any, blkId: any, cluId: any, sclId: any, level: any, startDate: any, endDate: any) {
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
          scClassGroup: this.scClassGroup,
          startDate: startDate,
          endDate: endDate
        }
        this.getDistrict();
        this.searchForm.controls['scDistrictId'].patchValue('');
        this.loadDistrict(this.parVal);
      }

      if (level == 2) {
        this.parVal = {
          scDistrictId: distId,
          scBlockId: "",
          scClusterId: "",
          schoolId: "",
          scClassGroup: this.scClassGroup,
          startDate: startDate,
          endDate: endDate
        }

        this.searchForm.controls['scDistrictId'].patchValue(distId);
        this.getBlock(distId);
        this.searchForm.controls['scBlockId'].patchValue('');
        this.loadDistrict(this.parVal);

      }

      if (level == 3) {
        this.parVal = {
          scDistrictId: distId,
          scBlockId: blkId,
          scClusterId: "",
          schoolId: "",
          scClassGroup: this.scClassGroup,
          startDate: startDate,
          endDate: endDate
        }

        this.getCluster(blkId);
        this.searchForm.controls['scDistrictId'].patchValue(distId);
        this.searchForm.controls['scBlockId'].patchValue(blkId);
        this.searchForm.controls['scClusterId'].patchValue('');

        this.loadDistrict(this.parVal);
      }

      if (level == 4) {
        this.parVal = {
          scDistrictId: distId,
          scBlockId: blkId,
          scClusterId: cluId,
          schoolId: "",
          scClassGroup: this.scClassGroup,
          startDate: startDate,
          endDate: endDate
        }

        this.getSchool(cluId);
        this.searchForm.controls['scDistrictId'].patchValue(distId);
        this.searchForm.controls['scBlockId'].patchValue(blkId);
        this.searchForm.controls['scClusterId'].patchValue(cluId);
        this.searchForm.controls['schoolId'].patchValue('');
        this.loadDistrict(this.parVal);
      }
    }
  }


  getDistrict() {
    this.scDisrtictSelect = true;
    this.commonService.getAllDistrict().subscribe((data: any) => {
      this.districtData = data;
      this.districtData = this.districtData?.data;

      if (this.userProfile.district != 0 || this.userProfile.district != "") {
        this.districtData = this.districtData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        this.searchForm.controls['scDistrictId'].patchValue(this.userProfile.district);
        this.getBlock(this.userProfile.district);
      }
      else {
        this.districtData = this.districtData;
        this.scDisrtictSelect = false;
      }

      this.scBlockId = '';
      this.scDisrtictSelect = false;
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
    if (districtId !== '') {
      this.commonService.getBlockByDistrictid(districtId).subscribe((res: any) => {
        this.blockData = res;
        this.blockData = this.blockData?.data;

        if (this.userProfile.block != 0 || this.userProfile.block != "") {
          this.blockData = this.blockData.filter((blo: any) => {
            return blo.blockId == this.userProfile.block;
          });

          this.scBlockId = this.userProfile.block;
          this.getCluster(this.userProfile.block);
          this.scBlockChanged = false;
        }
        else {
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

    if (blockId !== '') {
      this.commonService.getClusterByBlockId(blockId).subscribe((res: any) => {
        this.clusterData = res;
        this.clusterData = this.clusterData?.data;

        if (this.userProfile.cluster != 0 || this.userProfile.cluster != "") {
          this.clusterData = this.clusterData.filter((clu: any) => {
            return clu.clusterId == this.userProfile.cluster;
          });
          this.searchForm.controls['scClusterId'].patchValue(this.userProfile.cluster);
        }
        else {
          this.scClusterChanged = false;
        }
        this.scClusterChanged = false;
      });
    } else {
      this.scClusterChanged = false;
    }
  }

  getSchool(clusterId: any) {
    this.scSchoolChanged = true;
    this.schoolId = "";
    this.getSchoolData = [];

    if (clusterId !== '') {
      this.InspectionMis.getSchoolList(clusterId).subscribe((res: any) => {
        this.getSchoolData = res;
        this.getSchoolData = this.getSchoolData?.data;

        if (this.sessionSchoolId != '') {

          this.searchForm.controls['schoolId'].patchValue(this.sessionSchoolId);
        }

        this.scSchoolChanged = false;
      });
    } else {

      this.scSchoolChanged = false;
    }
  }

  printPage() {
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }
  toggle() {
    this.show = !this.show;
    if (this.show)
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }


  excel(level: any) {

    this.spinner.show();
    this.csvData = this.getSearchParams();
    this.InspectionMis.studentAttendanceInpCsv(
      this.csvData
    ).subscribe((res: any) => {
      const data = res["data"];
      if (level == 0) {
        this.csvoptions = {
          fieldSeparator: ",",
          quoteStrings: '"',
          decimalseparator: ".",
          showLabels: true,
          useBom: true,
          headers: [
            "SL#",
            "District",
            "Numbers Of Schools",
            "Number of visited schools",
            "Number of visits",
            "Enrolled Boys",
            "Present Boys On Register",
            "Present Boys On Register(%)",
            "Actual Boys Present",
            "Actual Boys Present(%)",
            "Enrolled Girls",
            "Present Girls On Register",
            "Present Girls On Register(%)",
            "Actual Girls Present",
            "Actual Girls Present(%)",
            "Enrolled Transgender",
            "Present Transgender On Register",
            "Present Transgender On Register(%)",
            "Actual Transgender Present",
            "Actual Transgender Present(%)"
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
            "SL#",
            "District",
            "Block",
            "Numbers Of Schools",
            "Number of visited schools",
            "Number of visits",
            "Enrolled Boys",
            "Present Boys On Register",
            "Present Boys On Register(%)",
            "Actual Boys Present",
            "Actual Boys Present(%)",
            "Enrolled Girls",
            "Present Girls On Register",
            "Present Girls On Register(%)",
            "Actual Girls Present",
            "Actual Girls Present(%)",
            "Enrolled Transgender",
            "Present Transgender On Register",
            "Present Transgender On Register(%)",
            "Actual Transgender Present",
            "Actual Transgender Present(%)"
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
            "SL#",
            "District",
            "Block",
            "Cluster",
            "Numbers Of Schools",
            "Number of visited schools",
            "Number of visits",
            "Enrolled Boys",
            "Present Boys On Register",
            "Present Boys On Register(%)",
            "Actual Boys Present",
            "Actual Boys Present(%)",
            "Enrolled Girls",
            "Present Girls On Register",
            "Present Girls On Register(%)",
            "Actual Girls Present",
            "Actual Girls Present(%)",
            "Enrolled Transgender",
            "Present Transgender On Register",
            "Present Transgender On Register(%)",
            "Actual Transgender Present",
            "Actual Transgender Present(%)"
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
            "SL#",
            "District",
            "Block",
            "Cluster",
            "School",
            "Number of visits",
            "Enrolled Boys",
            "Present Boys On Register",
            "Present Boys On Register(%)",
            "Actual Boys Present",
            "Actual Boys Present(%)",
            "Enrolled Girls",
            "Present Girls On Register",
            "Present Girls On Register(%)",
            "Actual Girls Present",
            "Actual Girls Present(%)",
            "Enrolled Transgender",
            "Present Transgender On Register",
            "Present Transgender On Register(%)",
            "Actual Transgender Present",
            "Actual Transgender Present(%)"
          ],
        };
      }


      new ngxCsv(data, "StudentAttendenceInspectionReport", this.csvoptions);
      this.spinner.hide();
    });
  }

  
  exportSchoolList(district:any,block:any,cluster:any,school:any,startDate:any,endDate:any,deg:any)
  {
    this.spinner.show();
    const paramObj = {
      scDistrictId: district,
      scBlockId: block,
      scClusterId: cluster,
      schoolId: school,
      scClassGroup: this.scClassGroup,
      startDate: startDate,
      endDate: endDate,
      scDesignationId:deg,
      schoolUdiseCode:"",
      typeWise:"clusterWise",
      schoolType:this.schoolType
    };

    this.InspectionMis.exportStuAttenInspectionReport(paramObj).subscribe({
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
