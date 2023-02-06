import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { trigger, style, animate, transition } from '@angular/animations';
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { NgForm } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { NgxSpinnerService } from "ngx-spinner";
import { DataTableDirective } from "angular-datatables";
import { InspectionMisService } from "../../services/inspection-mis.service";
import { MatTableExporterDirective } from "mat-table-exporter";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { AlertHelper } from 'src/app/core/helpers/alert-helper';

@Component({
  selector: 'app-inspection-report',
  templateUrl: './inspection-report.component.html',
  styleUrls: ['./inspection-report.component.css'],
  animations: [
    trigger('fadeSlideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('500ms', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('500ms', style({ opacity: 0, transform: 'translateY(-10px)' })),
      ]),
    ]),
  ]
})
export class InspectionReportComponent implements OnInit {

  datatableElement!: DataTableDirective;
  @ViewChild("searchForm") searchForm!: NgForm;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() mode!: ProgressBarMode;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter!: MatTableExporterDirective;
  userProfile = this.commonService.getUserProfile();
  cardIsDisplayed = true;
  scDistrictId: any = "";
  scBlockId: any = "";
  scClusterId: any = "";
  schoolId: any = "";
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
  totalRows = 0;
  pageSizeOptions: number[] = [10, 25, 100];
  displayedColumns: string[] = [
    "slNo",
    "school_name",
    "teacher_type"
  ]; // define mat table columns
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
  datas: any;
	tatten: any;
	absentTeacherList: any;
	studentAttendence: any;
	questionList: any;
	answerList: any;
  tattenlength: boolean = false;

  constructor(
    private commonService: CommonserviceService,
    private spinner: NgxSpinnerService,
    private InspectionMis: InspectionMisService,
    private alertHelper: AlertHelper
  ) {

  }

  ngOnInit(): void {
    this.getDistrict();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  toggle() {
    this.cardIsDisplayed = !this.cardIsDisplayed;
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
      this.districtData = res;
      this.districtData = this.districtData.data;

      if (this.sessionDistrictId != "") {
        this.searchForm.controls['scDistrictId'].patchValue(this.sessionDistrictId);
        this.getBlock(this.sessionDistrictId);
      }

      this.scDisrtictChanged = false;
    });
  }

  getBlock(id: any) {
    this.scBlockId = "";
    this.scClusterId = "";
    this.schoolId = "";
    this.scBlockChanged = true;
    const districtId = id;
    this.blockData = [];
    this.clusterData = [];
    this.getSchoolData = [];
    if (districtId !== "") {
      this.commonService
        .getBlockByDistrictid(districtId)
        .subscribe((res: any) => {
          let data: any = res;
          for (let key of Object.keys(data["data"])) {
            this.blockData.push(data["data"][key]);
          }
          if (this.sessionBlockId != '') {
            this.searchForm.controls['scBlockId'].patchValue(this.sessionBlockId);
            this.getCluster(this.sessionBlockId);
          }

          this.scBlockChanged = false;
        });
    } else {
      this.scBlockChanged = false;
    }
  }

  getCluster(id: any) {
    this.scClusterId = "";
    this.schoolId = "";
    this.scClusterChanged = true;
    this.clusterData = [];
    this.getSchoolData = [];
    if (id != "") {
      this.commonService.getClusterByBlockId(id).subscribe((res: any) => {
        let data: any = res;
        for (let key of Object.keys(data["data"])) {
          this.clusterData.push(data["data"][key]);
        }

        if (this.sessionClusterId != '') {
          this.searchForm.controls['scClusterId'].patchValue(this.sessionClusterId);
          this.getSchool(this.sessionClusterId);
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

    if (clusterId !== '') {
      this.commonService.getSchoolList(clusterId).subscribe((res: any) => {
        this.getSchoolData = res;
        this.getSchoolData = this.getSchoolData.data;

        if (this.sessionSchoolId != '') {

          this.searchForm.controls['schoolId'].patchValue(this.sessionSchoolId);
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
    this.loadViewData(this.getSearchParams())

  }

  onPageChange(event: any) {
    this.spinner.show();
    this.isLoading = true;
    // event: PageEvent
    this.pageSize = event.pageSize; // current page size ex: 10

    this.offset = event.pageIndex * event.pageSize;
    this.previousSize = this.pageSize * event.pageIndex; // set previous size
    this.pageIndex = event.pageIndex;
    this.loadViewData(this.getSearchParams());
  }
  getSearchParams() {

    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      userType: this.userProfile.userType,
      userId: this.userProfile.userId,
      scDistrictId: this.searchForm.controls['scDistrictId'].value,
      scBlockId: this.searchForm.controls['scBlockId'].value,
      scClusterId: this.searchForm.controls['scClusterId'].value,
      schoolId: this.searchForm.controls['schoolId'].value,
    };

  }

  loadViewData(params: any) {
    this.spinner.show();
    const paramObj = {

      scDistrictId: params.scDistrictId,
      scBlockId: params.scBlockId,
      scClusterId: params.scClusterId,
      schoolId: params.schoolId


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
    this.InspectionMis.getInspectionReport(paramObj).subscribe({
      next: (res: any) => {
        console.log(res);
        // this.resultListData.length = params.previousSize; // set current size
        this.resultListData.push(...res?.data); // merge with existing data
        this.resultData = res.data;
        this.totalSchoolSum = res.totalSchoolSum;
        this.totalNoOfVistsSum = res.totalNoOfVistsSum;
        this.totalNoOfVistsSchools = res.totalNoOfVistsSchools;
        
        this.resultListData.length = res?.totalRecord; // update length
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table
        this.isLoading = false;
        this.isNorecordFound = this.resultListData.length ? false : true;
        this.isInitAdmin = true;
        this.spinner.hide();
        
        if(this.pageLevel == 3)
        {
          this.districtName = res.districtName;
          this.blockName = res.blockName;
          this.clusterName = res.clusterName;
        }
        if(this.pageLevel == 4){
          this.districtName = res.districtName;
          this.blockName = res.blockName;
          this.clusterName = res.clusterName;
          this.schoolName = res.schoolName;
        }

      }, error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      }

    });

  }

  TakeAction(id: any) {
		this.spinner.show();
    let paramList = {encId: id};
		this.InspectionMis
			.getInspectionById(paramList)
			.subscribe((res: any) => {
				this.datas = res?.data[0];
				this.tatten = res?.teacheratten;
				this.tattenlength = this.tatten.length ? false : true;
				this.absentTeacherList = res?.absentTeacherList;
				this.studentAttendence = res?.studentAttendence;
				this.questionList = res?.questionList;
				this.answerList = res?.answerList;
				this.spinner.hide();
				//console.log(res);

			});
	}

  drillDown(district: any, block: any, cluster: any, school: any) {
    this.spinner.show();
    const pramsVal = {
      scDistrictId: district,
      scBlockId: block,
      scClusterId: cluster,
      schoolId: school,
    }

    if (pramsVal.schoolId != '') {
      this.searchForm.controls['schoolId'].patchValue(pramsVal.schoolId);
    } else if (pramsVal.scClusterId != '') {
      this.searchForm.controls['scClusterId'].patchValue(pramsVal.scClusterId);
      this.getSchool(pramsVal.scClusterId);
    } else if (pramsVal.scBlockId != '') {

      this.searchForm.controls['scBlockId'].patchValue(pramsVal.scBlockId);
      this.getCluster(pramsVal.scBlockId);
    } else if (pramsVal.scDistrictId != '') {
      this.searchForm.controls['scDistrictId'].patchValue(pramsVal.scDistrictId);
      this.getBlock(pramsVal.scDistrictId);
    }
    this.spinner.hide();
    this.loadViewData(pramsVal);
  }

}
