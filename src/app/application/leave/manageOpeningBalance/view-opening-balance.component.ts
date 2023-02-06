import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { ManageLeaveTypeService } from "../services/manage-leave-type.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Subject } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { ManageOpeningBalanceService } from "../services/manage-opening-balance.service";
import { ManageLeaveApplyService } from "../services/manage-leave-apply.service";

import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";

@Component({
	selector: "app-view-opening-balance",
	templateUrl: "./view-opening-balance.component.html",
	styleUrls: ["./view-opening-balance.component.css"],
})
export class ViewOpeningBalanceComponent implements OnInit {
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
	adminPrivilege: boolean = false;
	displayedColumns: string[] = [];
	paramObj: any;
	serviceType: string = "Search";
	// define mat table columns

	resultListData: any = [];
	questionDetailsData!: any;
	dataSource = new MatTableDataSource(this.resultListData);

	//end
	offclusterId: any = "";
	schoolId: any = "";
	teacherId: any = "";
	leaveTypeId: any = "";
	isNorecordFound: boolean = false;
	isLoading = false;
	previousSize: any = 0;
	pageIndex: any = 0;
	userId: any = "";
	plPrivilege: string = "view"; //For menu privilege
	config = new Constant();

	public userProfile = JSON.parse(
		sessionStorage.getItem("userProfile") || "{}"
	);
	datatableElement: any = DataTableDirective;
	dtOptions: any = {};
	dtTrigger: Subject<any> = new Subject<any>();

	private apiURL = environment.leaveAPI;
	schId: number = 0;
	teacherList: any = "";
	leaveTypes: any;
	leaveModeChanged: boolean = false;
	allErrorMessages: string[] = [];
	submitted = false;
	posts: any;
	resData: any = "";
	isResData: boolean = false;
	isEmpty: boolean = false;
	leaveTypeChanged: boolean = false;
	lvtype: any = "";

	clusterChanged: boolean = false;
	clusterData: any = [];
	scSchoolChanged: boolean = false;
	getSchoolData: any = [];
	hmType: number = 0;
	blkLogin: boolean = false;
	userSchoolid: string = "";
	constructor(
		private formBuilder: FormBuilder,
		public commonService: CommonserviceService,
		public ManageLeaveTypeService: ManageLeaveTypeService,
		public ManageOpeningBalanceService: ManageOpeningBalanceService,
		private ManageLeaveApplyService: ManageLeaveApplyService,
		private alertHelper: AlertHelper,
		private spinner: NgxSpinnerService,
		private http: HttpClient,
		private route: Router,
		private router: ActivatedRoute,

		private privilegeHelper: PrivilegeHelper //For menu privilege
	) {
		const pageUrl: any = this.route.url;
		this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl); //For menu privilege
		this.commonService.verifyLinkPermission(
			pageUrl,
			this.config.linkType[2],
			this.config.privilege[1]
		); // For authorization
	}

	ngOnInit(): void {
		this.spinner.show();
		if (this.plPrivilege == "admin") {
			this.adminPrivilege = true;
			this.displayedColumns = [
				"slNo",
				"Teacher Name",
				"Teacher Type",
				"Leave Type",
				"Leave Entitled",
				"Leave Granted",
				"Leave Balance",
				"Life Time Balance",
				"No. of Times Leave Balance",
				"Action",
			];
		} else {
			this.displayedColumns = [
				"slNo",
				"Teacher Name",
				"Teacher Type",
				"Leave Type",
				"Leave Entitled",
				"Leave Granted",
				"Leave Balance",
				"Life Time Balance",
				"No. of Times Leave Balance",
			];
		}
		this.getLeaveType();
		if (this.userProfile.school != "0") {
			this.getTeachersList(0, this.userProfile.school);
			this.blkLogin = true;
		} else {
			this.blkLogin = false;
			if(this.userProfile.block > 0){
				this.getSchool(0);
				this.getCluster();
			}
		}
		this.userSchoolid = this.userProfile.school;
		this.schId = this.userProfile.school;

		
		this.loadProfile(this.getSearchParams());
		
		
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
			offclusterId: this.offclusterId,
			schoolId: this.schoolId,
			teacherId: this.teacherId,
			leaveTypeId: this.leaveTypeId,
		};
	}

	onPageChange(event: any) {
		this.spinner.show();
		this.isLoading = true;
		// event: PageEvent
		this.pageSize = event.pageSize; // current page size ex: 10
		/**
		 * pageIndex starts from 0
		 * ex: if pageIndex = 0 then offset = 0 * 10 = 0 and if pageIndex =1 then 1*10 = 10
		 */
		this.offset = event.pageIndex * event.pageSize;
		this.previousSize = this.pageSize * event.pageIndex; // set previous size
		this.pageIndex = event.pageIndex;
		this.loadProfile(this.getSearchParams());
	}

	onSearch() {
		// reset queryParams
		this.pageIndex = 0;
		this.offset = 0;
		this.previousSize = 0;
		this.resultListData.splice(0, this.resultListData.length); // empty current data
		this.dataSource.paginator = this.paginator; // update paginator
		this.loadProfile(this.getSearchParams());
	}

	loadProfile(...params: any) {
		this.spinner.show();
		const {
			previousSize,
			offset,
			pageSize,
			offclusterId,
			schoolId,
			teacherId,
			leaveTypeId,
		} = params[0];

		this.paramObj = {
			offset: offset,
			limit: pageSize,
			offclusterId: offclusterId,
			schoolId: this.schoolId,
			teacherId: this.teacherId,
			leaveTypeId: leaveTypeId,
		};

		this.isLoading = true;
		this.ManageOpeningBalanceService.viewOpeningBalance(
			this.paramObj
		).subscribe({
			next: (res: any) => {
				this.resultListData.length = previousSize; // set current size
				this.resultListData.push(...res?.data); // merge with existing data
				this.resultListData.length = res?.totalRecord; // update length
				this.dataSource.paginator = this.paginator; // update paginator
				this.dataSource._updateChangeSubscription(); // update table
				this.isLoading = false;
				this.isNorecordFound = this.resultListData.length ? false : true;
				this.spinner.hide();
			},
			error: (error: any) => {
				this.isLoading = false;
				this.spinner.hide();
			},
		});
	}

	getLeaveType() {
		this.leaveTypeChanged = true;
		this.lvtype = [];
		this.ManageLeaveTypeService.getLeaveType().subscribe((res: any) => {
			let data: any = res;
			for (let key of Object.keys(data["data"])) {
				this.lvtype.push(data["data"][key]);
			}
			this.leaveTypeChanged = false;
		});
	}

	getTeachersList(teaherId: any, schoolId: any) {
		this.teacherId = "";
		this.leaveModeChanged = true;
		this.teacherList = [];
		if (this.userSchoolid != "0") {
			this.hmType = 0; //Teacher only
		} else {
			this.hmType = 2; //HM only
		}
		this.ManageLeaveApplyService.getTeachersList(
			schoolId,
			teaherId,
			this.hmType
		).subscribe((res: any) => {
			let data: any = res;
			for (let key of Object.keys(data["data"])) {
				this.teacherList.push(data["data"][key]);
			}
			this.leaveModeChanged = false;
		});
	}

	getCluster() {
		this.schoolId = "";
		this.teacherId = "";
		this.clusterChanged = true;
		const blockId = this.userProfile.block;
		this.clusterData = [];
		if (blockId !== "") {
			this.commonService.getClusterByBlockId(blockId).subscribe((res) => {
				let data: any = res;
				for (let key of Object.keys(data["data"])) {
					this.clusterData.push(data["data"][key]);
				}
				this.clusterChanged = false;
			});
		} else {
			this.clusterChanged = false;
		}
	}

	getSchool(post: any) {
		this.scSchoolChanged = true;

		const clusterId = post;
		this.getSchoolData = [];
		if (clusterId !== "") {
			this.ManageOpeningBalanceService.getSchool(post).subscribe((res: any) => {
				let data: any = res;
				for (let key of Object.keys(data["data"])) {
					this.getSchoolData.push(data["data"][key]);
				}
				this.scSchoolChanged = false;
			});
		} else {
			this.scSchoolChanged = false;
		}
	}
}
