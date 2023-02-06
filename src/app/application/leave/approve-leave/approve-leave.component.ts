import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
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
import { ApproveLeaveService } from "../services/approve-leave.service";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
@Component({
	selector: "app-approve-leave",
	templateUrl: "./approve-leave.component.html",
	styleUrls: ["./approve-leave.component.css"],
})
export class ApproveLeaveComponent implements OnInit {
	public fileUrl = environment.filePath;
	public fileUrl1 = environment.filePath;
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
	displayedColumns: string[] = []; // define mat table columns

	resultListData: any = [];
	questionDetailsData!: any;
	dataSource = new MatTableDataSource(this.resultListData);

	//end
	userId: any = "";
	paramObj: any;
	serviceType: string = "Search";
	leaveTypeSelect: boolean = true;
	leaveTypeLoading: boolean = false;
	isNorecordFound: boolean = false;
	fowardlvstatus: boolean = false;
	isLoading = false;
	previousSize: any = 0;
	pageIndex: any = 0;
	leaves: any;

	lvApproveform!: FormGroup;
	allErrorMessages: string[] = [];
	submitted = false;
	posts: any;
	resData: any = "";
	isResData: boolean = false;
	isEmpty: boolean = false;
	leaveTypeChanged: boolean = false;
	lvtype: any = "";

	teacherName: string = "";
	leaveFromDate: string = "";
	leaveToDate: string = "";
	leaveTypeName: string = "";
	noOfDaysApplied: string = "";
	lvReason: string = "";
	teacherId: string = "";
	leaveApplyId: string = "";
	takeActionForm!: FormGroup;
	hdnLeaveId: number = 0;
	allLabel: string[] = ["Remark"];
	actionTakenDescription: any = "";
	hdnteacherId: number = 0;
	leaveTypeId: any = "";
	hdnleaveTypeId: number = 0;
	leaveStatus: number = 0;
	plPrivilege: string = "view"; //For menu privilege
	config = new Constant();

	constructor(
		private formBuilder: FormBuilder,
		public commonService: CommonserviceService,
		public ManageLeaveTypeService: ManageLeaveTypeService,
		public ApproveLeaveService: ApproveLeaveService,
		private alertHelper: AlertHelper,
		private spinner: NgxSpinnerService,
		private httpClient: HttpClient,
		private privilegeHelper: PrivilegeHelper, //For menu privilege
		private route: Router,
		private router: ActivatedRoute,
		public customValidators: CustomValidators
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
		this.spinner.show();
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
				"Take Action",
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
			];
		}
		this.getLeaveType();
		this.initializeTakeActionForm();
		this.getAnnextureData();
		this.lvApproveform = this.formBuilder.group({
			leaveTypeId: "0",
			leaveStatus: "0",
		});

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
			leaveTypeId: this.leaveTypeId,
			leaveStatus: this.leaveStatus,
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
			leaveTypeId,
			leaveStatus,
		} = params[0];

		this.paramObj = {
			offset: offset,
			limit: pageSize,
			leaveTypeId: leaveTypeId,
			serviceType: this.serviceType,
			userId: this.userId,
			leaveStatus: leaveStatus,
		};
		this.isLoading = true;
		this.ApproveLeaveService.viewLeavesList(this.paramObj).subscribe({
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

	getAnnextureData() {
		this.commonService.getCommonAnnexture(["LEAVE_TYPE"]).subscribe({
			next: (res: any) => {
				this.spinner.hide();
				this.lvtype = res?.data?.LEAVE_TYPE;
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

	showDetails(
		teacherName: any,
		leaveFromDate: any,
		leaveToDate: any,
		leaveTypeName: any,
		noOfDaysApplied: any,
		lvReason: any,
		teacherId: any,
		leaveApplyId: any,
		leaveTypeId: any,
		leaveStatus: any
	) {
		this.teacherName = teacherName;
		this.leaveFromDate = leaveFromDate;
		this.leaveToDate = leaveToDate;
		this.leaveTypeName = leaveTypeName;
		this.noOfDaysApplied = noOfDaysApplied;
		this.lvReason = lvReason;
		this.teacherId = teacherId;
		this.leaveApplyId = leaveApplyId;
		this.leaveTypeId = leaveTypeId;
		this.takeActionForm.patchValue({ hdnLeaveId: leaveApplyId });
		this.takeActionForm.patchValue({ hdnteacherId: teacherId });
		this.takeActionForm.patchValue({ hdnleaveTypeId: leaveTypeId });
		if (leaveStatus == 2) {
			this.fowardlvstatus = true;
		} else {
			this.fowardlvstatus = false;
		}
	}

	initializeTakeActionForm() {
		this.takeActionForm = this.formBuilder.group({
			actionTakenDescription: [
				this.actionTakenDescription,
				[Validators.required, Validators.maxLength(250)],
			],
			hdnLeaveId: [this.hdnLeaveId],
			hdnteacherId: [this.hdnteacherId],
			hdnleaveTypeId: [this.hdnleaveTypeId],
			leaveStatus: [this.leaveStatus],
		});
	}
	submitTakeAction(typeId: any) {
		this.submitted = true;
		this.customValidators.formValidationHandler(
			this.takeActionForm,
			this.allLabel
		);

		if (this.takeActionForm.controls["actionTakenDescription"]?.value == "") {
			this.alertHelper.viewAlertHtml("error", "Invalid", "Remark Required");
			return;
		}
		if (this.takeActionForm.valid == true) {
			this.alertHelper.submitAlert().then((result: any) => {
				if (result.value) {
					this.spinner.show();
					this.ApproveLeaveService.leaveTakeAction(
						this.takeActionForm.getRawValue(),
						typeId
					).subscribe({
						next: (res: any) => {
							this.spinner.hide();
							this.alertHelper
								.successAlert("Saved!", "Action taken successfully.", "success")
								.then(() => {
									window.location.reload();
								});
						},
						error: (error: any) => {
							this.spinner.hide(); //==== hide spinner
							let errorMessage: string = "";
							if (typeof error.error.msg === "string") {
								errorMessage +=
									'<i class="bi bi-arrow-right text-danger"></i> ' +
									error.error.msg +
									`<br>`;
							} else {
								error.error.msg.map(
									(message: string) =>
										(errorMessage +=
											'<i class="bi bi-arrow-right text-danger"></i> ' +
											message +
											`<br>`)
								);
							}
							this.alertHelper.viewAlertHtml(
								"error",
								"Invalid inputs",
								errorMessage
							);
						},
					});
				}
			});
		}
	}
	downloadApproveLeaveList() {
		this.spinner.show();
		this.paramObj.serviceType = "Download";

		this.ApproveLeaveService.viewLeavesList(this.paramObj).subscribe({
			next: (res: any) => {
				let filepath = this.fileUrl1 + "/" + res.data.replace(".", "~");

				window.open(filepath);
				this.spinner.hide();
			},
			error: (error: any) => {
				this.spinner.hide();
			},
		});
	}
	printPage() {
		let cloneTable = document.getElementById("viewTable")?.innerHTML;
		const pageTitle = document.querySelector(".pageName")?.innerHTML;
		this.commonService.printPage(cloneTable, pageTitle);
	}
}
