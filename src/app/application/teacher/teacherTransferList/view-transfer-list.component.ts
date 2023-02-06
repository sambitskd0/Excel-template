import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormGroup, NgForm, FormBuilder, Validators, RequiredValidator } from "@angular/forms";
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
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { TeacherTransferService } from "../services/teacher-transfer.service";
import { formatDate } from "@angular/common";

@Component({
	selector: 'app-view-transfer-list',
	templateUrl: './view-transfer-list.component.html',
	styleUrls: ['./view-transfer-list.component.css']
})
export class ViewTransferListComponent implements OnInit {
	@ViewChild("teacherSearchForm") teacherSearchForm!: NgForm;

	@Input() mode!: ProgressBarMode;
	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatTableExporterDirective, { static: true })
	exporter!: MatTableExporterDirective;
	public fileUrl = environment.filePath;
	takeActionForm!: FormGroup;
	takeDeleteActionForm! : FormGroup;
	pageSize = 10;
	offset = 0;
	currentPage = 0;
	totalRows = 0;
	pageSizeOptions: number[] = [10, 25, 100];
	displayedColumns: string[] = [
		"slNo",
		"teacherName",
		"school",
		"Status",
		"actions",
	];
	paramObj: any;
	serviceType: string = "Search";
	// define mat table columns

	resultListData: any = [];
	questionDetailsData!: any;
	dataSource = new MatTableDataSource(this.resultListData);

	isNorecordFound: boolean = false;
	isLoading = false;
	previousSize: any = 0;
	pageIndex: any = 0;
	isInitAdmin: boolean = false;

	public show: boolean = true;
	public buttonName: any = 'Show';
	plPrivilege: string = "view"; //For menu privilege
	config = new Constant();
	adminPrivilege: boolean = false;

	userId: any = "";

	submitted = false;
	posts: any;
	districtData: any = [];
	blockData: any = [];
	clusterData: any = [];
	getSchoolData: any = "";

	scDisrtictSelect: boolean = false;
	scDisrtictLoading: boolean = false;
	scBlockSelect: boolean = true;
	scBlockLoading: boolean = false;

	scClusterSelect: boolean = true;
	scClusterLoading: boolean = false;
	scSchoolSelect: boolean = true;
	scSchoolLoading: boolean = false;
	startDate: any;
    endDate: any;
    maxDate: any = Date;
	districtId: any = "0";
	blockId: any = "0";
	clusterId: any = "0";
	searchSchoolId: any = "";
	statusId: number = 1;
	userProfile = this.commonService.getUserProfile();
	apdistrictId: any = '';
	apblockId: any = '';
	apclusterId: any = '';
	apSchoolId: any = '';
	relievingDate: any = '';
    createdBy: any = '';
	apblockData: any = [];
	apscBlockSelect: boolean = true;
	apscBlockLoading: boolean = false;

	apclusterData: any = [];
	apscClusterLoading: boolean = false;
	apscClusterSelect: boolean = true;

	apscSchoolSelect: boolean = true;
	apscSchoolLoading: boolean = false;
	apgetSchoolData: any = "";
	actionTakenDescription : string ='';

	allLabel: string[] = ["District","Block","Cluster","School Name","Relieving Date", "Remark"];
	allDeleteLabel: string[] = ["Remark"];
	transnferRequestId : any = '';
	tId : any = '';
	constructor(
		private formBuilder: FormBuilder,
		public commonService: CommonserviceService,
		private alertHelper: AlertHelper,
		private spinner: NgxSpinnerService,
		private http: HttpClient,
		private privilegeHelper: PrivilegeHelper, //For menu privilege
		private route: Router,
		private router: ActivatedRoute,
		public customValidators: CustomValidators,
		private transferService: TeacherTransferService,
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
		// this.maxDate = new Date();

		
	}

	ngOnInit(): void {
		if (this.plPrivilege == "admin") {
			this.adminPrivilege = true;
			this.displayedColumns = [
				"slNo",
				"teacherName",
				"district",
				"block",
				"school",
				"Status",
				"actions",
			];
		}
		this.getDistrict();
		this.loadTeacherList(this.getSearchParams());
		this.apdistrictId = this.userProfile.district > 0 ? this.userProfile.district : this.apdistrictId;
		this.apblockId = this.userProfile.block > 0 ? this.userProfile.block : this.apblockId;

		if (this.userProfile.district != 0 || this.userProfile.district != "") {
			this.getBlockap(this.userProfile.district);
		}		

		this.initializeviewTableForm();
		this.initializeDeleteviewTableForm();

	}

	submitTakeAction(typeId: any) {
		this.submitted = true;
		if(typeId == 1){
			this.customValidators.formValidationHandler(
				this.takeActionForm,
				this.allLabel
			);	
		}
		if ((this.takeActionForm.valid == true && typeId == 1) || typeId == 2){
			this.alertHelper.submitAlert().then((result: any) => {
				if (result.value) {
					this.spinner.show();
					this.transferService.transferTakeAction(
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



	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	initializeviewTableForm() {
		this.takeActionForm = this.formBuilder.group({
			apdistrictId: [this.apdistrictId, Validators.required],
			apblockId: [this.apblockId, Validators.required],
			apclusterId: [this.apclusterId, Validators.required],
			apSchoolId: [this.apSchoolId, Validators.required],
			relievingDate: ["", Validators.required],
			actionTakenDescription: ["", Validators.required],
			transnferRequestId: [this.transnferRequestId],
			tId: [this.tId],
			
		});
	}
	initializeDeleteviewTableForm() {
		this.takeDeleteActionForm = this.formBuilder.group({
			actionTakenRemark: ["", Validators.required],
			transnferRequestId: [this.transnferRequestId],
			tId: [this.tId],
			
		});
	}

	getSearchParams() {
		return {
			previousSize: this.previousSize,
			offset: this.offset.toString(),
			pageSize: this.pageSize.toString(),
			districtId:
				this.userProfile.district > 0
					? this.userProfile.district
					: this.districtId,
			blockId:
				this.userProfile.block > 0 ? this.userProfile.block : this.blockId,
			clusterId: this.clusterId,
			searchSchoolId: this.searchSchoolId,
			statusId: this.statusId,
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
		this.loadTeacherList(this.getSearchParams());
	}


	onSearch() {
		this.pageIndex = 0;
		this.offset = 0;
		this.previousSize = 0;
		this.spinner.show();
		this.resultListData.splice(0, this.resultListData.length); // empty current data
		this.dataSource.paginator = this.paginator; // update paginator
		this.loadTeacherList(this.getSearchParams());
		this.isInitAdmin = false;
	}


	loadTeacherList(...params: any) {
		this.spinner.show();
		const {
			previousSize,
			offset,
			pageSize,
			districtId,
			blockId,
			clusterId, searchSchoolId,
			statusId,
		} = params[0];

		this.paramObj = {
			offset: offset,
			limit: pageSize,
			districtId: districtId,
			blockId: blockId,
			clusterId: clusterId,
			searchSchoolId: searchSchoolId,
			statusId: statusId,
			userId: this.userId,
		};

		this.isLoading = true;
		this.transferService.transferList(this.paramObj).subscribe({
			next: (res: any) => {
				this.resultListData.length = previousSize; // set current size
				this.resultListData.push(...res?.data); // merge with existing data
				this.resultListData.length = res?.totalRecord; // update length
				this.dataSource.paginator = this.paginator; // update paginator
				this.dataSource._updateChangeSubscription(); // update table
				this.isLoading = false;
				this.isNorecordFound = this.resultListData.length ? false : true;
				this.createdBy = res?.createdBy;
				this.spinner.hide();
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


	getDistrict() {
		this.scDisrtictSelect = true;
		this.scDisrtictLoading = true;
		this.commonService.getAllDistrict().subscribe((res: []) => {
			this.posts = res;
			this.districtData = this.posts.data;

			if (this.userProfile.district != 0 || this.userProfile.district != "") {
				this.districtData = this.districtData.filter((dis: any) => {
					return dis.districtId == this.userProfile.district;
				});
				this.districtId = this.userProfile.district;
				this.getBlock(this.userProfile.district);
				this.scDisrtictSelect = false;
			} else {
				this.districtData = this.districtData;
				this.scDisrtictSelect = true;
			}
			this.scDisrtictLoading = false;
		});
	}

	getBlock(distId: any) {
		this.scBlockSelect = false;

		this.blockId = 0;
		this.clusterId = 0;
		this.searchSchoolId = '';
		this.blockData = [];
		this.scBlockLoading = true;
		if (distId !== "") {
			this.commonService
				.getBlockByDistrictid(distId)
				.subscribe((res: any) => {
					this.blockData = res;
					this.blockData = this.blockData.data;

					if (this.userProfile.block != 0 || this.userProfile.block != "") {
						this.blockData = this.blockData.filter((blo: any) => {
							return blo.blockId == this.userProfile.block;
						});

						this.blockId = this.userProfile.block;
						this.getCluster(this.userProfile.block);
						this.scBlockSelect = false;
					} else {
						this.scBlockSelect = true;
					}
					this.scBlockLoading = false;
				});
		} else {
			this.scBlockLoading = false;
		}
	}

	getBlockap(distId: any) {
		this.apscBlockSelect = false;
		this.apclusterId = 0;
		this.apblockData = [];
		this.apscBlockLoading = true;
		if (distId !== "" && distId > 0) {
			this.commonService
				.getBlockByDistrictid(distId)
				.subscribe((res: any) => {
					this.apblockData = res;
					this.apblockData = this.apblockData.data;

					if (this.userProfile.block != 0 || this.userProfile.block != "") {
						this.apblockData = this.apblockData.filter((blo: any) => {
							return blo.blockId == this.userProfile.block;
						});

						this.getClusterap(this.userProfile.block);
						this.apscBlockSelect = false;
					} else {
						this.apscBlockSelect = true;
					}
					this.apscBlockLoading = false;
				});
		} else {
			this.takeActionForm.patchValue({ 
				apdistrictId: "", 
				apblockId: "",  
				apclusterId: "", 
				apSchoolId: "", 
			});
			this.apscBlockLoading = false;
			this.apscBlockSelect = true;
		}
	}

	getCluster(id: any) {
		this.scClusterSelect = false;
		const blockId = id;
		this.clusterData = [];
		this.clusterId = 0;
		this.searchSchoolId = '';
		this.scClusterLoading = true;
		if (blockId !== "" && blockId > 0) {
			this.commonService.getClusterByBlockId(blockId).subscribe((res) => {
				let data: any = res;
				for (let key of Object.keys(data["data"])) {
					this.clusterData.push(data["data"][key]);
				}
				this.scClusterSelect = true;
				this.scClusterLoading = false;
			});
		} else {			
			this.scClusterSelect = true;
			this.scClusterLoading = false;
		}
	}

	getClusterap(id: any) {
		this.apscClusterSelect = false;
		const blockId = id;
		this.clusterId = 0;
		this.apclusterData = [];
		this.apscClusterLoading = true;
		if (blockId !== "" && blockId > 0) {
			this.commonService.getClusterByBlockId(blockId).subscribe((res) => {
				let data: any = res;
				for (let key of Object.keys(data["data"])) {
					this.apclusterData.push(data["data"][key]);
				}
				this.apscClusterSelect = true;
				this.apscClusterLoading = false;
			});
		} else {
			this.takeActionForm.patchValue({ 
				apblockId: "",  
				apclusterId: "", 
				apSchoolId: "", 
			});
			this.apscClusterSelect = true;
			this.apscClusterLoading = false;
		}
	}

	getSchool(clusterId: any) {
		this.scSchoolSelect = false;
		this.scSchoolLoading = true;
		this.searchSchoolId = '';
		this.getSchoolData = [];

		if (clusterId !== "" && clusterId>0) {
			this.commonService.getSchoolList(clusterId).subscribe((res: any) => {
				this.getSchoolData = res;
				this.getSchoolData = this.getSchoolData.data;
				this.scSchoolSelect = true;
				this.scSchoolLoading = false;
			});
		} else {
			this.scSchoolSelect = true;
			this.scSchoolLoading = false;
		}
	}

	getSchoolap(clusterId: any) {
		this.apscSchoolSelect = false;
		this.apscSchoolLoading = true;

		this.apgetSchoolData = [];

		if (clusterId !== "" && clusterId > 0) {
			this.commonService.getSchoolList(clusterId).subscribe((res: any) => {
				this.apgetSchoolData = res;
				this.apgetSchoolData = this.apgetSchoolData.data;
				this.apscSchoolSelect = true;
				this.apscSchoolLoading = false;
			});
		} else {
			this.takeActionForm.patchValue({ 
				apclusterId: "", 
				apSchoolId: "", 
			});
			this.apscSchoolSelect = true;
			this.apscSchoolLoading = false;
		}
	}


	showDetails(encId: any, tId: any, transferDistrict: any, transferBlock: any, transferCluster: any, transferSchool: any) {
		this.takeActionForm.patchValue({ 
			transnferRequestId: encId,
			tId: tId,
			apdistrictId : this.userProfile.district > 0 ? this.userProfile.district : '',
		    apblockId : this.userProfile.block > 0 ? this.userProfile.block : '',
			apclusterId: "", 
			apSchoolId: "",
			actionTakenDescription: '',
			relievingDate:'',
		});
	}
	onDelete(encId: any, tId: any) {
		this.takeDeleteActionForm.patchValue({ 
			transnferRequestId: encId,
			tId: tId,
			apdistrictId : this.userProfile.district > 0 ? this.userProfile.district : '',
		    apblockId : this.userProfile.block > 0 ? this.userProfile.block : '',
			apclusterId: "", 
			apSchoolId: "",
			actionTakenRemark: '',
		});
	}



	submitTakeDeleteAction() {
		this.submitted = true;
		
			this.customValidators.formValidationHandler(
				this.takeDeleteActionForm,
				this.allDeleteLabel
			);	
		
		if (this.takeDeleteActionForm.valid == true){
			this.alertHelper.submitAlert().then((result: any) => {
				if (result.value) {
					this.spinner.show();
					this.transferService.transferTakeDeleteAction(
						this.takeDeleteActionForm.getRawValue()
					).subscribe({
						next: (res: any) => {
							if (res.success === true) {
								this.alertHelper.successAlert("Saved!", res?.msg, "success").then(() => {
								  window.location.reload();
								});
							  } else {
								this.alertHelper.viewAlert("error", "Invalid", res?.msg);
							  }
							this.spinner.hide();							
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
	toggle() {
		const visible = $("#searchbox").css("display");
		if (visible == "none") {
			$("#searchbox").show(1000);
			$(".bi-caret-up-fill").show();
			$(".bi-caret-down-fill").hide();
		} else {
			$("#searchbox").hide(400);
			$(".bi-caret-up-fill").hide();
			$(".bi-caret-down-fill").show();
		}
	}

}
