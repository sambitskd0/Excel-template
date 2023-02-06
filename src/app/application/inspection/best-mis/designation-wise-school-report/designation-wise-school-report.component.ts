import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormBuilder, NgForm } from "@angular/forms";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { NgxSpinnerService } from "ngx-spinner";
import { DataTableDirective } from "angular-datatables";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { ngxCsv } from "ngx-csv/ngx-csv";
import { InspectionMisService } from "../../services/inspection-mis.service";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { formatDate } from "@angular/common";
import { environment } from "src/environments/environment";
import { ManageUserService } from "src/app/application/user/services/manage-user.service";

declare const $: any;

@Component({
  selector: 'app-designation-wise-school-report',
  templateUrl: './designation-wise-school-report.component.html',
  styleUrls: ['./designation-wise-school-report.component.css']
})
export class DesignationWiseSchoolReportComponent implements OnInit {
  public fileUrl1 = environment.filePath;
   [x: string]: any;
  displayTable: boolean = false;
  questSearchform!: FormGroup;
  SearchformId!: FormGroup;
  isLoading = false;
  isNorecordFound: boolean = false;
  tattenlength: boolean = false;
  pageIndex: any = 0;
  previousSize: any = 0;
  // mat table
  @ViewChild("searchForm") searchForm!: NgForm;
  @Input() mode!: ProgressBarMode;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTableExporterDirective, { static: true })
  isimageUrlTeacher: boolean = false;
  imageUrlTeacher: any = "";
  public fileUrl = environment.filePath;

  exporter!: MatTableExporterDirective;
  pageSize = 10;
  offset = 0;
  currentPage = 0;
  totalRows = 0;
  // displayedColumns: string[] = [
  //   "slNo",
  //   "Udise",
  //   "school_name",
  //   "district_name",
  //   "block_name",
  //   "cluster_name",
  //   "inspected_date",
  //   "monitor_by",
  //   "mobile",
  //   "action",
  //   "status",
  // ]; // define mat table columns

  resultListData: any = [];
  questionDetailsData!: any;
  dataSource = new MatTableDataSource(this.resultListData);
  //end
  csvData: any;
  csvoptions: any;
  bodyData: any;
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  scDisrtictChanged: boolean = false;
  districtData: any;
  inspStatusId: number = 0;
  schoolStatusId: number = 0;
  userProfile = this.commonService.getUserProfile();
  userType = this.userProfile.userType;
  userLevel = this.userProfile.userLevel;
  userId = this.userProfile.userId;
  sessionDistrictId: any =
    this.userProfile.district != 0 ? this.userProfile.district : "";
  sessionBlockId: any =
    this.userProfile.block != 0 ? this.userProfile.block : "";
  sessionClusterId: any =
    this.userProfile.cluster != 0 ? this.userProfile.cluster : "";
  sessionSchoolId: any =
    this.userProfile.school != 0 ? this.userProfile.school : "";
  sessionDegId: any = this.userProfile.designationId;
  scBlockChanged: boolean = false;
  blockData: any;
  scClusterChanged: boolean = false;
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
  datas: any;
  tatten: any;
  absentTeacherList: any;
  studentAttendence: any;
  questionList: any;
  answerList: any;
  datasd: any;
  startDate: any;
  endDate: any;
  maxDate: any = Date;
  searchDistrictId: any = "";
  searchBlockId: any = "";
  searchClusterId: any = "";
  searchSchoolId: any = "";
  schoolUdiseCode: any = "";
  designationData: any;

  scDisrtictSelect: boolean = true;
  scDisrtictLoading: boolean = false;
  scBlockSelect: boolean = true;
  scBlockLoading: boolean = false;
  scClusterSelect: boolean = true;
  scClusterLoading: boolean = false;
  scSchoolSelect: boolean = true;
  scSchoolLoading: boolean = false;
  scDesignationChanged: boolean = false;
  reportLevelLoad: boolean = false;
  //reportLevelselect: boolean = false;
  dwUserLevel: any = "";

  searchDistrictData: any = [];
  searchBlockData: any = [];
  levelOfUser:any = [];
  blockChanged: boolean = false;
  posts: any;
  searchDesignationData: any;
  degLevel: any;
  loginLevel: any;
  str: any;
  numOfVisetedSchool:any;
  numOfVisit:any;
  colLevel:any;
  schoolType:any = "";
  scDesignationId:any = "";
  stateUser: boolean = false;
	distUser: boolean = false;
	blkUser: boolean = false;
	designationGroupId: any = "0";
  distLvl: boolean = false;
	blkLvl: boolean = false;
	clusterLvl: boolean = false;
  distLvl2: boolean = false;
  desGrpSelect: boolean = true;
	desGrpLoading: boolean = true;
	DesignationGroupData: any = "";
	designationChanged: boolean = false;
  designationLoading: boolean = false;
  designationSelect: boolean = true;
  designationHiseShow: boolean = false;
  stateHiseShow: boolean = false;
  districtHiseShow: boolean = false;
  blockHiseShow: boolean = false;
  clusterHiseShow: boolean = false;
  levelId:any;
  dis:boolean = true;
  bloc:boolean = true;
  clus:boolean = true;
  distShow:any;
  blockShow:any;
  userIdShow:any;

  constructor(
    private formBuilder: FormBuilder,
    public commonService: CommonserviceService,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private InspectionMis: InspectionMisService,
    public ManageUserService: ManageUserService,
  ) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    
    if (this.userProfile.userLevel == 5) {
      this.levelOfUser = [
        { id: "", level: "--All Designation--"},
        { id: 5, level: "State"},
        { id: 4, level: "District"},
        { id: 3, level: "Block"},
        { id: 2, level: "Cluster"},
      ];
			//this.loadSubDesignation(5);
		} else if (this.userProfile.userLevel == 4) {
      this.levelOfUser = [
        { id: "", level: "--All Designation--"},
        { id: 4, level: "District"},
        { id: 3, level: "Block"},
        { id: 2, level: "Cluster"},
      ];
			//this.loadSubDesignation(4);
		} else if (this.userProfile.userLevel == 3) {
      this.levelOfUser = [
        { id: "", level: "--All Designation--"},
        { id: 3, level: "Block"},
        { id: 2, level: "Cluster"},
      ];
			//this.loadSubDesignation(3);
		}else if (this.userProfile.userLevel == 2) {
      this.levelOfUser = [
        { id: "", level: "--All Designation--"},
        { id: 2, level: "Cluster"},
      ];
			//this.loadSubDesignation(2);
		} else if (this.userProfile.userLevel == "") {
			this.levelOfUser = [
        { id: "", level: "--All Designation--"},
        { id: 5, level: "State"},
        { id: 4, level: "District"},
        { id: 3, level: "Block"},
        { id: 2, level: "Cluster"},
      ];
		}
   this.getDistrict();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      userType: this.userProfile.userType,
      userId: this.userProfile.userId,
      dwUserLevel: this.searchForm.controls["dwUserLevel"].value,
      scDistrictId: this.searchForm.controls["scDistrictId"]?.value ? this.searchForm.controls["scDistrictId"]?.value : "",
      scBlockId: this.searchForm.controls["scBlockId"]?.value ? this.searchForm.controls["scBlockId"]?.value : "",
      scClusterId: this.searchForm.controls["scClusterId"]?.value ? this.searchForm.controls["scClusterId"]?.value : "",
      startDate: this.searchForm.controls["startDate"].value,
      endDate: this.searchForm.controls["endDate"].value,
      schoolType: this.searchForm.controls["schoolType"].value,
      scDesignationId: this.searchForm.controls["scDesignationId"]?.value ? this.searchForm.controls["scDesignationId"]?.value : "",
      designationGroupId: this.searchForm.controls["designationGroupId"]?.value ? this.searchForm.controls["designationGroupId"]?.value : "",
      
    };
  }

  onPageChange(event: any) {
    this.spinner.show();
    this.isLoading = true;
    // event: PageEvent
    this.pageSize = event.pageSize; // current page size ex: 10

    this.offset = event.pageIndex * event.pageSize;
    this.previousSize = this.pageSize * event.pageIndex; // set previous size
    this.pageIndex = event.pageIndex;
    this.loadData(this.getSearchParams());
  }
  onSearch() {
    this.pageIndex = 0;
    this.previousSize = 0;
    this.offset = 0;
    this.previousSize = 0;
    this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
    if (this.validateForm() === true) {
      this.loadData(this.getSearchParams());
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

    if (this.dwUserLevel === "4") {
      if (this.scDistrictId === "") {
        if (this.scDesignationId === "") {
          this.alertHelper.viewAlert(
            "error",
            "Required",
            "Please select either sub designation or district"
          );
          return false;
        }
      }
    }

    if (this.dwUserLevel === "3") {
     
        if (this.scBlockId === "") {
        if (this.scDesignationId === "") {
          this.alertHelper.viewAlert(
            "error",
            "Required",
            "Please select either sub designation or block"
          );
          return false;
        }
      }

      
    }

    if (this.dwUserLevel === "2") {
      if (this.scClusterId === "") {
        if (this.scDesignationId === "") {
          this.alertHelper.viewAlert(
            "error",
            "Required",
            "Please select either sub designation or cluster"
          );
          return false;
        }
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

  loadSubDesignation(levelId: any) {
		if (levelId > 0) {
      this.levelId = levelId;
      this.designationHiseShow = true;
			this.getDesignationGroup(levelId);
      this.designationGroupId = 0;
      this.scDesignationId = "";
      this.designationGroupId = 0;
      if(levelId == 5){
        this.dis = false;
        this.bloc = false;
        this.clus = false;
        this.scDistrictId = "";
        this.scBlockId = "";
        this.scClusterId = "";
      }
      if(levelId == 4){
        this.dis = true;
        this.bloc = false;
        this.clus = false;
        this.scBlockId = "";
        this.scClusterId = "";
      }
      if(levelId == 3){
        this.dis = true;
        this.bloc = true;
        this.clus = false;
        this.scClusterId = "";
      }
      if(levelId == 2){
        this.dis = true;
        this.bloc = true;
        this.clus = true;
      }
      // this.scDistrictId = "";
      // this.scBlockId = "";
      // this.scClusterId = "";
		}else{
      this.scDistrictId = "";
      this.searchBlockData = [];
      this.clusterData = [];
      this.scDesignationId = "";
      this.designationGroupId = 0;
      this.designationHiseShow = false;
      this.stateHiseShow = true;
      this.dis = true;
      this.bloc = true;
      this.clus = true;
    }
	}

	getDesignationGroup(levelId: any) {
    this.designationData = [];
		this.desGrpSelect = false;
		this.desGrpLoading = false;
		this.DesignationGroupData = [];
    this.scDesignationId = "";
    this.designationGroupId = 0;
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
			this.designationSelect = false;
      this.scDesignationId = "";
			this.designationData = [];
      
			this.designationLoading = true;
			this.ManageUserService.getSubDesignation(designtionId).subscribe(
				(res) => {
					this.posts = res;
					let data: any = res;
					for (let key of Object.keys(data["data"])) {
						this.designationData.push(data["data"][key]);
					}
					this.designationSelect = true;
					this.designationLoading = false;
				}
			);
		}else{
      this.scDesignationId = "";
			this.designationData = [];
    }
	}

  getLevelOfUser(){
    if(this.userLevel == 5){
      this.levelOfUser = [
        { id: "", level: "--Select--"},
        { id: 5, level: "State"},
        { id: 4, level: "District"},
        { id: 3, level: "Block"},
        { id: 2, level: "Cluster"},
      ];
      this.dwUserLevel = "5";
    }else if(this.userLevel == 4){
      this.levelOfUser = [
        { id: 4, level: "District"},
        { id: 3, level: "Block"},
        { id: 2, level: "Cluster"},
      ];
      this.dwUserLevel = "4";
    }else if(this.userLevel == 3){
      this.levelOfUser = [
        { id: 3, level: "Block"},
        { id: 2, level: "Cluster"},
      ];
      this.dwUserLevel = "3";
    }else if(this.userLevel == 2){
      this.levelOfUser = [
        { id: 2, level: "Cluster"},
      ];
      this.dwUserLevel = "2";
    }else{
      this.levelOfUser = [
        { id: "", level: "--Select--"},
        { id: 5, level: "State"},
        { id: 4, level: "District"},
        { id: 3, level: "Block"},
        { id: 2, level: "Cluster"},
      ];
    }
    
  }

  
  loadData(...params: any) {
    this.spinner.show();
    const { previousSize, offset, pageSize } = params[0];

    const paramObj = {
      offset: offset,
      limit: pageSize,
      dwUserLevel: this.dwUserLevel,
      scDistrictId: this.scDistrictId,
      scBlockId: this.scBlockId,
      scClusterId: this.scClusterId,
      scDesignationId: this.scDesignationId,
      userType: this.userProfile.userType,
      userId: this.userProfile.userId,
      schoolType : this.schoolType,
      startDate: this.startDate,
      endDate: this.endDate,
      
    };
    this.isLoading = true;
    this.InspectionMis.designationWiseResport(paramObj).subscribe({
      next: (res: any) => {
        //console.log(res);
        this.resultListData.length = previousSize; // set current size
        this.resultListData.push(...res?.data); // merge with existing data
        this.numOfVisetedSchool = res?.numOfVisetedSchool;
        this.numOfVisit = res?.numOfVisit;
        this.distShow = res?.distShow;
        this.blockShow = res?.blockShow;
        this.userIdShow = res?.userIdShow;
        this.isLoading = false;
        this.isNorecordFound = this.resultListData.length ? false : true;
        this.isInitAdmin = true;
        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }

  toggle() {
    const visible = $("#searchPanel").css("display");
    if (visible == "none") {
      $("#searchPanel").show(1000);
      $(".bi-caret-up-fill").show();
      $(".bi-caret-down-fill").hide();
    } else {
      $("#searchPanel").hide(400);
      $(".bi-caret-up-fill").hide();
      $(".bi-caret-down-fill").show();
    }
  }

  TakeAction(id: any) {
    this.SearchformId = this.formBuilder.group({
      encId: id,
    });
    this.spinner.show();

    this.InspectionMis.getInspectionById(this.SearchformId.value).subscribe(
      (res: any) => {
        this.datas = res?.data[0];
        this.tatten = res?.teacheratten;
        this.tattenlength = this.tatten.length ? false : true;
        this.absentTeacherList = res?.absentTeacherList;
        this.studentAttendence = res?.studentAttendence;
        this.questionList = res?.questionList;
        this.answerList = res?.answerList;
        this.spinner.hide();

        if (this.datas.inspectionPhoto !== "") {
          this.isimageUrlTeacher = true;
          this.str = this.datas.inspectionPhoto;
          const st = this.str;
          if (this.str) {
            var newstr = st?.replace(".", "~");
            this.imageUrlTeacher = this.fileUrl + newstr;
          } else {
            this.imageUrlTeacher = "";
          }
          // this.imageUrlTeacher= this.fileUrl+'uploads/inspection/bestApp/'+ newstr;
        }
      }
    );
  }

  getDistrict() {
    this.scDisrtictSelect = false;
    this.scDisrtictLoading = true;
    this.commonService.getAllDistrict().subscribe((data: any) => {
      this.districtData = data;
      this.districtData = this.districtData.data;

      if (this.userProfile.district != 0 || this.userProfile.district != "") {
        this.searchDistrictData = this.districtData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        this.searchForm.controls["scDistrictId"].patchValue(
          this.userProfile.district
        );
        this.getBlock(this.userProfile.district);
      } else {
        this.searchDistrictData = this.districtData;
        this.scDisrtictSelect = true;
      }

      this.searchBlockId = "";
      this.scDisrtictLoading = false;
    });
  }

  printPage() {
    let cloneTable = document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }

  excel() {
    this.spinner.show();
    this.csvData = this.getSearchParams();
    this.InspectionMis.downloadDesignationWiseReport(this.csvData).subscribe(
      (res: any) => {
        const data = res["data"];
        this.csvoptions = {
          fieldSeparator: ",",
          quoteStrings: '"',
          decimalseparator: ".",
          showLabels: true,
          type: "text/csv;charset=utf-8",
          useBom: true,
          headers: [
            "SLN#",
            "Designation Name",
            "Number of visited schools",
            "Number of visits",
          ],
        };
        
        new ngxCsv(data, "DesignationWiseSchoolReport", this.csvoptions);
        this.spinner.hide();
      }
    );
  }

  excelDeatils() {
    this.spinner.show();
    this.csvData = this.getSearchParams();
    this.csvData['schoolId'] = "";
    this.csvData['schoolUdiseCode'] = "";
    this.InspectionMis.downloadSchoolMonitoringReportDegWise(this.csvData).subscribe({
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

  getBlock(districtId: any) {
    this.scBlockSelect = false;
    this.scBlockLoading = true;
    this.scBlockId = "";
    this.scClusterId = "";
    if(districtId == ""){
      if(this.dwUserLevel == 3){
        this.searchBlockData = [];
        this.searchForm.controls["scBlockId"].patchValue("");
      }else if(this.dwUserLevel == 2){
        this.searchBlockData = [];
        this.searchForm.controls["scBlockId"].patchValue("");
        this.clusterData = [];
        this.searchForm.controls["scClusterId"].patchValue("");
      }else{
        this.searchBlockData = [];
        this.searchForm.controls["scBlockId"].patchValue("");
        this.clusterData = [];
        this.searchForm.controls["scClusterId"].patchValue("");
      }
    }else{
      if(this.dwUserLevel == 3){
        this.searchBlockData = [];
        this.searchForm.controls["scBlockId"].patchValue("");
      }
      if(this.dwUserLevel == 2){
        this.searchBlockData = [];
        this.searchForm.controls["scBlockId"].patchValue("");
        this.clusterData = [];
        this.searchForm.controls["scClusterId"].patchValue("");
      }
      
    }
    
    if (districtId !== "") {
      this.commonService
        .getBlockByDistrictid(districtId)
        .subscribe((res: any) => {
          this.searchBlockData = res;
          this.searchBlockData = this.searchBlockData.data;

          if (this.userProfile.block != 0 || this.userProfile.block != "") {
            this.searchBlockData = this.searchBlockData.filter((blo: any) => {
              return blo.blockId == this.userProfile.block;
            });
            this.searchForm.controls["scBlockId"].patchValue(
              this.userProfile.block
            );
            
            this.getCluster(this.userProfile.block);
          } else {
            this.scBlockSelect = true;
          }
          this.scBlockLoading = false;
        });
    } else {
      this.scBlockSelect = true;
      this.scBlockLoading = false;
    }
  }

  getCluster(blockId: any) {
    this.scClusterSelect = false;
    this.scClusterLoading = true;
    this.scClusterId = "";
      if(blockId == ""){
        if(this.dwUserLevel == 2){
          this.searchBlockData = [];
        this.searchForm.controls["scBlockId"].patchValue("");
        this.clusterData = [];
        this.searchForm.controls["scClusterId"].patchValue("");
        }else{
          this.searchBlockData = [];
        this.searchForm.controls["scBlockId"].patchValue("");
          this.clusterData = [];
          this.searchForm.controls["scClusterId"].patchValue("");
        }
      }
    if (blockId !== "") {
      this.commonService.getClusterByBlockId(blockId).subscribe((res: any) => {
        this.clusterData = res;
        this.clusterData = this.clusterData.data;

        if (this.userProfile.cluster != 0 || this.userProfile.cluster != "") {
          this.clusterData = this.clusterData.filter((clu: any) => {
            return clu.clusterId == this.userProfile.cluster;
          });
          this.searchForm.controls["scClusterId"].patchValue(
            this.userProfile.cluster
          );
          //this.getSchool(this.userProfile.cluster);
        } else {
          this.scClusterSelect = true;
        }
        this.scClusterLoading = false;
      });
    } else {
      this.scClusterSelect = true;
      this.scClusterLoading = false;
    }
  }

  getSchool(clusterId: any) {
    this.scSchoolSelect = false;
    this.scSchoolLoading = true;

    this.getSchoolData = [];
    this.searchForm.controls["schoolId"].patchValue("");

    if (clusterId !== "") {
      this.InspectionMis.getSchoolList(clusterId).subscribe((res: any) => {
        this.getSchoolData = res;
        this.getSchoolData = this.getSchoolData.data;

        if (
          this.userProfile.udiseCode != 0 ||
          this.userProfile.udiseCode != ""
        ) {
          this.getSchoolData = this.getSchoolData.filter((sch: any) => {
            return sch.schoolUdiseCode == this.userProfile.udiseCode;
          });
          this.searchForm.controls["schoolId"].patchValue(
            this.getSchoolData[0].schoolId
          );
        } else {
          this.scSchoolSelect = true;
        }
        this.scSchoolLoading = false;
      });
    } else {
      this.scSchoolSelect = true;
      this.scSchoolLoading = false;
    }
  }

  printModal() {
    let cloneTable = document.getElementById("printModal")?.innerHTML;
    const pageTitle = "School Monitoring Report Card";
    this.commonService.printPage(cloneTable, pageTitle);
  }

  // Material table pagination size options :: Sambit Kumar Dalai:: 10-11-2022
  get getPageSizeOptions(): number[] {
    return this.dataSource?.paginator &&
      this.dataSource?.paginator?.length > 200
      ? [10, 30, 50, 100, this.dataSource.paginator.length]
      : [10, 30, 50, 100,200 ];
  }
}
