import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
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
import { ActivatedRoute } from "@angular/router";
import { ManageProfileService } from "../services/manage-profile.service";
import { environment } from "src/environments/environment";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { ManageUserService } from "../services/manage-user.service";

@Component({
	selector: "app-view-profile",
	templateUrl: "./view-profile.component.html",
	styleUrls: ["./view-profile.component.css"],
})
export class ViewProfileComponent implements OnInit {
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
	displayedColumns: string[] = [];
	paramObj: any;
	serviceType: string = "Search";
	// define mat table columns

	resultListData: any = [];
	questionDetailsData!: any;
	dataSource = new MatTableDataSource(this.resultListData);

	//end

	public fileUrl = environment.filePath;
	public fileUrl1 = environment.filePath;
	imageUrlTeacher: any = "";
	isimageUrlTeacher: boolean = false;
	private apiURL = environment.profileAPI;

	//POP UP
	txtName: string = "";
	GenderName: string = "";
	DesignationName: string = "";
	designationGroupName: string = "";
	districtName: string = "";
	blcokName: string = "";
	clusterName: string = "";
	blockId: any = "0";
	clusterId: any = "0";
	mobileNo: any = "";
	hmdistrictName: string = "";
	hmblockName: string = "";
	vchImage: string = "";
	designationData: any = [];
	designationChanged: boolean = false;
	intDesignationId: any = "0";

	dtDOB: string = "";
	panchayatName: string = "";
	villageName: string = "";
	vchMobileNo: string = "";
	vchEmailId: string = "";
	vchContactAddress: string = "";

	fileSource: any = "";

	vchOfficePhoneNo: string = "";
	userId: any = "";
	isNorecordFound: boolean = false;
	isLoading = false;
	previousSize: any = 0;
	pageIndex: any = 0;

	scDisrtictSelect: boolean = true;
	scDisrtictLoading: boolean = false;
	scBlockSelect: boolean = true;
	scBlockLoading: boolean = false;
	scClusterSelect: boolean = true;
	scClusterLoading: boolean = false;
	designationSelect: boolean = true;
	designationLoading: boolean = false;

	profileSearchform!: FormGroup;
	profiles: any;
	distdata: any;
	allDistrict: any;
	isEmpty: boolean = false;
	districtId: any = "0";
	blockName: any = "";
	blockCode: any = "";
	resData: any = "";
	posts: any;
	districtData: any = [];
	blockData: any = [];
	clusterData: any = [];
	showSpinnerBlock: boolean = false;
	disrtictChanged: boolean = false;
	clusterChanged: boolean = false;
	blockChanged: boolean = false;
	isResData: boolean = false;
	userProfile = this.commonService.getUserProfile();
	distLvl2: boolean = false;
	blkUser: boolean = false;

	stateUser: boolean = false;
	distUser: boolean = false;
	distLvl: boolean = false;
	blkLvl: boolean = false;
	clusterLvl: boolean = false;

	desGrpSelect: boolean = true;
	desGrpLoading: boolean = true;
	DesignationGroupData: any = "";
	userLevelId: any = "0";
	designationGroupId: any = "0";
	plPrivilege: string = "view"; //For menu privilege
	config = new Constant();

	submitted = false;
	takeActionForm!: FormGroup;
	allLabel: string[] = ["Change Status", "Remark"];
	userStatus: number = 0;
	activeStatus: string = "";
	intProfileId: string = "";
	hdnProfileId: string = "";
	actionTakenDescription: string = "";
	adminPrivilege: boolean = false;
	constructor(
		private formBuilder: FormBuilder,
		public commonService: CommonserviceService,
		public manageProfileService: ManageProfileService,
		private alertHelper: AlertHelper,
		private spinner: NgxSpinnerService,
		private privilegeHelper: PrivilegeHelper, //For menu privilege
		private http: HttpClient,
		private route: Router,
		private router: ActivatedRoute,
		public customValidators: CustomValidators,
		public ManageUserService: ManageUserService
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
				"Gender",
				"Designation",
				"District",
				"Block",
				"Cluster",
				"Employee Information",
				"Created On",
				"action",
			];
		} else {
			this.displayedColumns = [
				"slNo",
				"Name",
				"Gender",
				"Designation",
				"District",
				"Block",
				"Cluster",
				"Employee Information",
				"Created On",
			];
		}
		this.getDistrict();

		if (this.userProfile.userLevel == 5) {
			this.userLevelId = 5;
			this.loadSubDesignation(5);
		} else if (this.userProfile.userLevel == 4) {
			this.loadSubDesignation(4);
			this.userLevelId = 4;
			this.stateUser = true;
			this.distUser = false;
			this.blkUser = false;
		} else if (this.userProfile.userLevel == 3) {
			this.loadSubDesignation(2);
			this.stateUser = true;
			this.distUser = true;
			this.blkUser = true;
		} else if (this.userProfile.userLevel == "") {
			this.userLevelId = 0;
		}
		this.profileSearchform = this.formBuilder.group({
			districtId: "0",
			blockId: "0",
			clusterId: "0",
			mobileNo: "",
			intDesignationId: "0",
			userLevelId: "0",
			designationGroupId: "0",
		});
		this.loadProfile(this.getSearchParams());
		this.initializeTakeActionForm();
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
			districtId:
				this.userProfile.district > 0
					? this.userProfile.district
					: this.districtId,
			blockId:
				this.userProfile.block > 0 ? this.userProfile.block : this.blockId,
			clusterId: this.clusterId,
			mobileNo: this.mobileNo,
			intDesignationId: this.intDesignationId,
			userLevelId: this.userLevelId,
			designationGroupId: this.designationGroupId,
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
			districtId,
			blockId,
			clusterId,
			mobileNo,
			intDesignationId,
			userLevelId,
			designationGroupId,
		} = params[0];

		this.paramObj = {
			offset: offset,
			limit: pageSize,
			districtId: districtId,
			blockId: blockId,
			clusterId: clusterId,
			mobileNo: mobileNo,
			intDesignationId: intDesignationId,
			userLevelId: userLevelId,
			designationGroupId: designationGroupId,
			serviceType: this.serviceType,
			userId: this.userId,
		};

		this.isLoading = true;
		this.manageProfileService.viewProfile(this.paramObj).subscribe({
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
	filterRecord(): void {
		this.loadProfile();
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

	getBlock(districtId: any) {
		this.scBlockSelect = false;
		this.blockChanged = true;

		this.blockId = 0;
		this.clusterId = 0;
		this.blockData = [];
		this.scBlockLoading = true;
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

	getCluster(id: any) {
		this.clusterChanged = true;
		const blockId = id;
		this.profileSearchform.patchValue({
			clusterId: 0,
		});
		this.clusterId = 0;
		this.clusterData = [];
		this.scClusterLoading = true;
		if (blockId !== "") {
			this.commonService.getClusterByBlockId(blockId).subscribe((res) => {
				let data: any = res;
				for (let key of Object.keys(data["data"])) {
					this.clusterData.push(data["data"][key]);
				}
				this.clusterChanged = false;
				this.scClusterLoading = false;
			});
		} else {
			this.clusterChanged = false;
		}
	}

	showDetails(
		vchfullName: string,
		vchGender: string,
		vchDesignationName: string,
		districtName: string,
		blockName: string,
		clusterName: string,
		dtmDOB: string,
		hmdistrictName: string,
		hmblockName: string,
		panchayatName: string,
		villageName: string,
		vchMobileNo: string,
		vchEmailId: string,
		vchContactAddress: string,
		vchOfficePhoneNo: string,
		vchImage: string,
		designationGroupName: string
	) {
		this.txtName = vchfullName;
		this.GenderName = vchGender;
		this.DesignationName = vchDesignationName;
		this.districtName = districtName;
		this.blockName = blockName;
		this.clusterName = clusterName;
		this.dtDOB = dtmDOB;
		this.hmdistrictName = hmdistrictName;
		this.hmblockName = hmblockName;

		this.panchayatName = panchayatName;
		this.villageName = villageName;
		this.vchMobileNo = vchMobileNo;
		this.vchEmailId = vchEmailId;
		this.vchContactAddress = vchContactAddress;
		this.vchOfficePhoneNo = vchOfficePhoneNo;
		this.designationGroupName = designationGroupName;
		//this.vchImage = vchImage;

		if (vchImage !== "") {
			this.isimageUrlTeacher = true;
			var str = vchImage;
			var newstr = str.replace(".", "~");
			this.imageUrlTeacher = this.fileUrl + "/uploads/userProfiles/" + newstr;
			this.vchImage = vchImage;
		}
	}

	deleteProfile(encId: string) {
		this.alertHelper
			.deleteAlert(
				"Do you want to delete the selected record ?",
				" ",
				"question",
				"Yes, delete it!"
			)
			.then((result) => {
				if (result.value) {
					this.spinner.show();
					this.manageProfileService.deleteProfile(encId).subscribe((res) => {
						this.spinner.hide();
						this.alertHelper
							.successAlert("Deleted!", "Selected record deleted successfully", "success")
							.then(() => {
								window.location.reload();
							});
					});
				}
			});
	}

	downloadProfileList() {
		this.spinner.show();
		this.paramObj.serviceType = "Download";

		this.manageProfileService.viewProfile(this.paramObj).subscribe({
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
		// this.userForm.patchValue({
		//   designationGroupId :0,
		//   intDesignationId :0,
		//   districtId: 0,
		//   blockId: 0,
		//   offclusterId: 0,
		// });
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
				}
			);
		}
	}

	/**Change User Status to active/inactive**/
	submitTakeAction() {
		this.submitted = true;
		this.customValidators.formValidationHandler(
			this.takeActionForm,
			this.allLabel
		);

		if (this.takeActionForm.controls["actionTakenDescription"]?.value == "") {
			this.alertHelper.viewAlertHtml("error", "Invalid", "Please enter Remarks");
			return;
		}
		if (this.userStatus == this.takeActionForm.controls["userStatus"]?.value) {
			this.alertHelper.viewAlertHtml(
				"error",
				"Invalid",
				"Please change the Status"
			);
			return;
		}
		if (this.takeActionForm.valid == true) {
			this.alertHelper.submitAlert().then((result: any) => {
				if (result.value) {
					this.spinner.show();
					this.manageProfileService
						.updateStatus(this.takeActionForm.getRawValue())
						.subscribe({
							next: (res: any) => {
								this.spinner.hide();
								this.alertHelper
									.successAlert(
										"Saved!",
										"Status changed successfully.",
										"success"
									)
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

	loadCurrentStatus(activeStatusn: any, intProfilen: any) {
		this.activeStatus = activeStatusn == 1 ? "Inactive" : "Active";
		this.userStatus = activeStatusn;
		this.hdnProfileId = intProfilen;
		this.initializeTakeActionForm();
	}

	initializeTakeActionForm() {
		this.takeActionForm = this.formBuilder.group({
			actionTakenDescription: [this.actionTakenDescription],
			hdnProfileId: [this.hdnProfileId],
			userStatus: [this.userStatus],
		});
	}
}
