import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { NgxSpinnerService } from "ngx-spinner";
import { ProgressBarMode } from "@angular/material/progress-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableExporterDirective } from "mat-table-exporter";
import { MatTableDataSource } from "@angular/material/table";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { Constant } from "src/app/shared/constants/constant";
import { ManageLeaveTypeService } from "../services/manage-leave-type.service";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { ManageLeaveApplyService } from "../services/manage-leave-apply.service";

@Component({
	selector: "app-view-leave-apply",
	templateUrl: "./view-leave-apply.component.html",
	styleUrls: ["./view-leave-apply.component.css"],
})
export class ViewLeaveApplyComponent implements OnInit {
	public fileUrl1 = environment.filePath;
	public fileUrl = environment.filePath;

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
	displayedColumns: string[] = []; // define mat table columns

	resultListData: any = [];
	questionDetailsData!: any;
	dataSource = new MatTableDataSource(this.resultListData);

	//end
	paramObj: any;
	serviceType: string = "Search";
	leaveTypeId: any = "";
	profileId: any = "";

	leaveTypeSelect: boolean = true;
	leaveTypeLoading: boolean = false;
	userId: any = "";
	isNorecordFound: boolean = false;
	isLoading = false;
	previousSize: any = 0;
	pageIndex: any = 0;
	leaves: any;
	//public fileUrl = environment.filePath;

	lvSearchform!: FormGroup;
	allErrorMessages: string[] = [];
	submitted = false;
	posts: any;
	resData: any = "";
	isResData: boolean = false;
	isEmpty: boolean = false;
	leaveTypeChanged: boolean = false;
	lvtype: any = "";
	private apiURL = environment.leaveAPI;
	plPrivilege: string = "view"; //For menu privilege
	config = new Constant();
	adminPrivilege: boolean = false;
	constructor(
		private formBuilder: FormBuilder,
		public commonService: CommonserviceService,
		public ManageLeaveTypeService: ManageLeaveTypeService,
		public ManageLeaveApplyService: ManageLeaveApplyService,
		private alertHelper: AlertHelper,
		private spinner: NgxSpinnerService,
		private http: HttpClient,
		private privilegeHelper: PrivilegeHelper, //For menu privilege
		private route: Router,
		private router: ActivatedRoute
	) {
		const pageUrl: any = this.route.url;
		this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl); //For menu privilege
		this.commonService.verifyLinkPermission(
			pageUrl,
			this.config.linkType[2],
			this.config.privilege[1]
		); // For authorization
		const users = this.commonService.getUserProfile();
		this.userId = users?.userId;
	}

	ngOnInit(): void {
		if (this.plPrivilege == "admin") {
			this.adminPrivilege = true;
			this.displayedColumns = [
				"slNo",
				"Name",
				"Applied Date",
				"Date From",
				"Date To",
				"Leave Type",
				"No. of Days",
				"Document",
				"Reason",
				"Status",
				"Pending With/ Action Taken By",
				"Remarks",
				"Cancel Leave",
			];
		} else {
			this.displayedColumns = [
				"slNo",
				"Name",
				"Applied Date",
				"Date From",
				"Date To",
				"Leave Type",
				"No. of Days",
				"Document",
				"Reason",
				"Status",
				"Pending With/ Action Taken By",
				"Remarks",
			];
		}
		this.spinner.show();
		this.getLeaveType();

		this.lvSearchform = this.formBuilder.group({
			leaveTypeId: "0",
		});

		this.loadProfile(this.getSearchParams());
	}
	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
		//console.log(this.dataSource);
	}
	getSearchParams() {
		return {
			previousSize: this.previousSize,
			offset: this.offset.toString(),
			pageSize: this.pageSize.toString(),
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
		const { previousSize, offset, pageSize, leaveTypeId } = params[0];

		this.paramObj = {
			offset: offset,
			limit: pageSize,
			leaveTypeId: leaveTypeId,
			serviceType: this.serviceType,
			userId: this.userId,
		};
		this.isLoading = true;
		this.ManageLeaveApplyService.viewLeaveApply(this.paramObj).subscribe({
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

	filterRecord() {}

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
	downloadApplyLeaveList() {
		this.spinner.show();
		this.paramObj.serviceType = "Download";

		this.ManageLeaveApplyService.viewLeaveApply(this.paramObj).subscribe({
			next: (res: any) => {
				let filepath = this.fileUrl1 + "/" + res.data.replace(".", "~");
				console.log(filepath);

				window.open(filepath);
				this.spinner.hide();
			},
			error: (error: any) => {
				this.spinner.hide();
			},
		});
	}


	cancelLeave(id: number) {
		const users = this.commonService.getUserProfile();
		this.userId = users?.userId;
		this.profileId = users?.profileId;
		this.alertHelper
			.deleteAlert("Are you sure to delete?", "", "question", "Yes, delete it!")
			.then((result) => {
				if (result.value) {
					this.spinner.show();
					this.isLoading = true;
					this.ManageLeaveApplyService.cancelLeave(id, this.userId,this.profileId).subscribe({
						next: (res: any) => {
							if (res?.success === true) {
								this.alertHelper.successAlert(
									"Deleted!",
									"Deleted Successfully",
									"success"
								);
								this.loadProfile(this.getSearchParams());
							} else {
								this.alertHelper.viewAlert("info", res?.msg, "");
							}
							this.isLoading = false;
							this.spinner.hide();
						},
						error: (error: any) => {
							this.isLoading = false;
							this.spinner.hide();
						},
					});
				}
			});
	}

	printPage() {
		let cloneTable = document.getElementById("viewTable")?.innerHTML;
		const pageTitle = document.querySelector(".pageName")?.innerHTML;
		this.commonService.printPage(cloneTable, pageTitle);
	}
}
