import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { ManageProfileService } from "../../services/manage-profile.service";
import { ManageUserService } from "../../services/manage-user.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { NgxSpinnerService } from "ngx-spinner";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";

@Component({
	selector: "app-add-user",
	templateUrl: "./add-user.component.html",
	styleUrls: ["./add-user.component.css"],
})
export class AddUserComponent implements OnInit {
	dropdownSettings: IDropdownSettings = {};
	userForm!: FormGroup;
	allErrorMessages: string[] = [];
	allLabel: string[] = [
		"Level of User",
		"Designation",
		"Sub-Designation",
		"District",
		"Block",
		"Cluster",
		"User",
		"Assign Employee",
		"Access Role",
		"Tag Multiple Office",
	];
	selectedItems: any[] = [];
	userProfile = this.commonService.getUserProfile();

	submitted = false;
	posts: any;
	districtData: any = [];
	blockData: any = [];
	clusterData: any = [];
	availabelProfileData: any = [];
	multiblockChanged: boolean = false;
	multiblockData: any[] = [];

	designationData: any = [];
	blankUserData: any = [];
	stateChanged: boolean = false;
	roleData: any = [];
	roleChanged: boolean = false;
	tagData: any = [];
	officeData: any = [];
	encId: string = "";
	districtId: number = 0;
	intEmpProfileId: number = 0;
	blockId: number = 0;
	offclusterId: number = 0;
	intDesignationId: number = 0;
	intProfileId: number = 0;
	intRoleId: number = 0;
	designationValue: number = 0;
	vchUserName: string = "";
	vchUserId: string = "";
	intRole: number = 0;
	intUserId: number = 0;
	encUserId: string = "";
	isDisabled: boolean = false;
	showprocessBtn: boolean = false;
	proceedClicked: boolean = false;
	showSpinnerBlock: boolean = false;
	scDisrtictSelect: boolean = false;
	scDisrtictLoading: boolean = false;
	scBlockSelect: boolean = true;
	scBlockLoading: boolean = false;
	clusterChanged: boolean = false;
	profileAvailableChanged: boolean = false;
	designationChanged: boolean = false;
	blkUserChanged: boolean = false;

	multiOfficelvl: boolean = false;
	multiUserlvl: boolean = false;

	distLvl: boolean = false;
	blkLvl: boolean = false;
	clusterLvl: boolean = false;
	stateUser:  boolean = false;
	distUser: boolean = false;
	blkUser: boolean = false;
	txtUserNameAuto: string = "";
	txtUserIdAuto: string = "";

	multiOfficeId: any[] = [];
	DesignationGroupData: any = "";
	blankUserId: string = "0";
	disabled = false;

	districtLoading: boolean = false;
	blockLoading: boolean = false;
	clusterLoading: boolean = false;
	designationLoading: boolean = false;
	desGrpSelect: boolean = true;
	desGrpLoading: boolean = true;
	userLevelId: number = 0;
	designationGroupId: number = 0;
	plPrivilege: string = "view"; //For menu privilege
	config = new Constant();
	adminPrivilege: boolean = false;
	constructor(
		private formBuilder: FormBuilder,
		private alertHelper: AlertHelper,
		public customValidators: CustomValidators,
		private spinner: NgxSpinnerService,
		private commonService: CommonserviceService,
		private profileService: ManageProfileService,
		private privilegeHelper: PrivilegeHelper, //For menu privilege
		private route: Router,
		private router: ActivatedRoute,
		private ManageUserService: ManageUserService,
		private el: ElementRef
	) {
		const pageUrl: any = this.route.url;
		this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl); //For menu privilege
		this.commonService.verifyLinkPermission(
			pageUrl,
			this.config.linkType[2],
			this.config.privilege[4]
		); // For authorization
	}

	ngOnInit(): void {
		if (this.plPrivilege == "admin") {
			this.adminPrivilege = true;
		}

		this.dropdownSettings = {
			idField: "blockId",
			textField: "blockName",
			enableCheckAll: true,
			selectAllText: "Select All Blocks",
			unSelectAllText: "UnSelect All Blocks",
			noDataAvailablePlaceholderText: "No data available",
			allowSearchFilter: true,
			itemsShowLimit: 4,
		};

		this.initializeForm();
		this.getDistrict();

		if (this.userProfile.userLevel == 5) {
			this.userLevelId = 5;
		} else if (this.userProfile.userLevel == 4) {
			this.stateUser = true;
			this.userForm.get("userLevelId")?.patchValue(3);
			this.loadSubDesignation(3);
		} else if (this.userProfile.userLevel == 3) {
			this.userForm.get("userLevelId")?.patchValue(2);
			this.loadSubDesignation(2);
			this.stateUser = true;
			this.distUser = true;
			this.blkUser = true;
		} else if (this.userProfile.userLevel == "") {
			this.userLevelId = 0;
		}
	}
	get userFormControl() {
		return this.userForm.controls;
	}

	initializeForm() {
		this.userForm = this.formBuilder.group({
			userLevelId: [this.userLevelId, Validators.required],
			designationGroupId: [this.designationGroupId, Validators.required],
			intDesignationId: [this.intDesignationId, Validators.required],
			districtId: [this.districtId],
			blockId: [this.blockId],
			offclusterId: [this.offclusterId],
			vchUserName: [
				this.vchUserName,
				[Validators.required, Validators.maxLength(100)],
			],
			vchUserId: [
				this.vchUserId,
				[Validators.required, Validators.maxLength(50)],
			],
			intProfileId: [this.intProfileId, Validators.required],
			intRoleId: [this.intRoleId, Validators.required],
			intUserId: [this.intUserId],
			encUserId: [this.encUserId],
			blankUserId: [this.blankUserId],
			multiOfficeId: [this.selectedItems],
		});
	}

	onSubmit() {
		this.submitted = true;
		this.customValidators.formValidationHandler(this.userForm, this.allLabel);

		if (this.userForm.controls["intDesignationId"]?.value == "") {
			this.alertHelper.viewAlert("error","Invalid","Please select designation of the user");
			return;
		}
		if (this.userForm.controls["vchUserName"]?.value == "") {
			 this.alertHelper.viewAlert("error","Invalid","User name is required");
			return;
		}
		if (this.userForm.controls["vchUserId"]?.value == "") {
			 this.alertHelper.viewAlert("error","Invalid","User id is required");
			return;
		}

		if (
			this.userForm.controls["intProfileId"]?.value == "" ||
			this.userForm.controls["intProfileId"]?.value == 0
		) {
			 this.alertHelper.viewAlert("error","Invalid","Assign employee is required");
			return;
		}
		if (
			this.userForm.controls["intRoleId"]?.value == "" ||
			this.userForm.controls["intRoleId"]?.value == 0
		) {
			 this.alertHelper.viewAlert("error","Invalid","Access role is required");
			return;
		}

		if (this.userForm.valid === true) {
			this.alertHelper.submitAlert().then((result: any) => {
				if (result.value) {
					this.spinner.show(); // ==== show spinner
					this.ManageUserService.createUser(
						this.userForm?.getRawValue()
					).subscribe({
						next: (res: any) => {
							this.spinner.hide(); //==== hide spinner
							this.alertHelper
								.successAlert(
									"Saved!",
									"Record saved successfully",
									"success"
								)
								.then(() => {
									this.route.navigate(["./../viewUser"], {
										relativeTo: this.router,
									});
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
						complete: () => console.log("done"),
					});
				}
			});
		}
	}

	fetchTaggingInfo() {
		if (this.userForm.controls["userLevelId"]?.value == "") {
			this.alertHelper.viewAlert("error","Invalid","Please select level of the user");
			return;
		}
		if (this.userForm.controls["designationGroupId"]?.value == "") {
			 this.alertHelper.viewAlert("error","Invalid","Please select designation of the user");
			return;
		}

		if (this.userForm.controls["intDesignationId"]?.value == "") {
			 this.alertHelper.viewAlert("error","Invalid","Please select sub-designation of the user");
			return;
		}
		let userLevel = this.userForm.controls["userLevelId"]?.value;

		if (userLevel <= 4) {
			if (this.userForm.controls["districtId"]?.value == "") {
				 this.alertHelper.viewAlert("error","Invalid","Please select district");
				return;
			}
		}

		if (userLevel <= 3) {
			if (this.userForm.controls["blockId"]?.value == "") {
				 this.alertHelper.viewAlert("error","Invalid","Please select block");
				return;
			}
		}
		if (userLevel == 2) {
			if (this.userForm.controls["offclusterId"]?.value == "") {
				 this.alertHelper.viewAlert("error","Invalid","Please select cluster");
				return;
			}
		}

		if (this.multiUserlvl == true) {
			if (
				this.userForm.controls["blankUserId"]?.value == 0 ||
				this.userForm.controls["blankUserId"]?.value == "0"
			) {
			    this.alertHelper.viewAlert("error","Invalid","Users is required");
				return;
			}
		}

		this.viewTagInfo(
			this.userForm.get("intDesignationId")?.value,
			this.userForm.get("districtId")?.value,
			this.userForm.get("blockId")?.value,
			this.userForm.get("offclusterId")?.value,
			this.userForm.get("blankUserId")?.value
		);
		this.proceedClicked = true;
	}

	getDistrict() {
		this.scDisrtictSelect = true;
		this.scDisrtictLoading = true;
		this.userForm.patchValue({
			districtId: 0,
			blockId: 0,
			offclusterId: 0,
		});
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
		this.scBlockLoading = true;
		this.userForm.patchValue({
			blockId: 0,
			offclusterId: 0,
		});
		this.blockId = 0;
		this.offclusterId = 0;
		this.intDesignationId = 0;
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

	getBlockList(id: any) {
		this.multiblockChanged = true;
		const districtId = id;
		this.multiblockData = [];
		if (districtId !== "") {
			this.commonService.getBlockByDistrictid(districtId).subscribe((res) => {
				let data: any = res;
				for (let key of Object.keys(data["data"])) {
					this.multiblockData.push(data["data"][key]);
				}
				this.multiblockChanged = false;
			});
		} else {
			this.multiblockChanged = false;
		}
	}

	getCluster(id: any) {
		this.clusterChanged = true;
		this.userForm.patchValue({
			offclusterId: 0,
		});
		const blockId = id;
		this.clusterData = [];
		this.clusterLoading = true;
		if (blockId !== "") {
			this.commonService.getClusterByBlockId(blockId).subscribe((res) => {
				let data: any = res;
				for (let key of Object.keys(data["data"])) {
					this.clusterData.push(data["data"][key]);
				}
				this.clusterChanged = false;
				this.clusterLoading = false;
			});
		} else {
			this.clusterChanged = false;
		}
	}

	viewAvailableProfile(
		designationId: any,
		districtId: any,
		blockId: any,
		offclusterId: any,
		intProfileId: any
	) {
		this.profileAvailableChanged = true;
		this.availabelProfileData = [];
		this.ManageUserService.viewAvailableProfile(
			designationId,
			districtId,
			blockId,
			offclusterId,
			intProfileId
		).subscribe((res) => {
			let data: any = res;
			for (let key of Object.keys(data["data"])) {
				this.availabelProfileData.push(data["data"][key]);
			}
			this.profileAvailableChanged = false;
		});
	}

	hideUntag() {
		this.isDisabled = true;
		this.proceedClicked = false;
		this.showprocessBtn = false;
		this.distLvl = false;
		this.blkLvl = false;
		this.clusterLvl = false;
		this.multiUserlvl = false;
		this.userForm.controls["userLevelId"].enable();
		this.userForm.controls["designationGroupId"].enable();
		this.userForm.controls["intDesignationId"].enable();
		this.userForm.controls["districtId"].enable();
		this.userForm.controls["blockId"].enable();
		this.userForm.controls["offclusterId"].enable();
		this.userForm.controls["blankUserId"].enable();
		this.userForm.controls["vchUserId"].enable();
		this.userForm.controls["vchUserName"].enable();

		this.userForm.get("vchUserName")?.patchValue("");
		this.userForm.get("vchUserId")?.patchValue("");
		this.userForm.get("intRoleId")?.patchValue(0);
		this.userForm.get("intProfileId")?.patchValue("");
		this.userForm.get("multiOfficeId")?.patchValue("");
		this.userForm.get("intUserId")?.patchValue("");
		this.userForm.get("encUserId")?.patchValue("");

		this.userForm.get("districtId")?.patchValue("");
		this.userForm.get("blockId")?.patchValue("");
		this.userForm.get("offclusterId")?.patchValue("");

		this.userForm.get("userLevelId")?.patchValue(0);
		this.userForm.get("designationGroupId")?.patchValue(0);
		this.userForm.get("intDesignationId")?.patchValue(0);
	}

	viewTagInfo(
		designationId: any,
		districtId: any,
		blockId: any,
		offclusterId: any,
		blankUserId: any
	) {
		this.availabelProfileData = [];

		this.ManageUserService.viewTagInfo(
			designationId,
			districtId,
			blockId,
			offclusterId,
			blankUserId,
			this.userForm.get("userLevelId")?.value
		).subscribe((res: any) => {
			this.userForm.controls["userLevelId"].disable();
			this.userForm.controls["designationGroupId"].disable();
			this.userForm.controls["intDesignationId"].disable();
			this.userForm.controls["districtId"].disable();
			this.userForm.controls["blockId"].disable();
			this.userForm.controls["offclusterId"].disable();
			this.userForm.controls["blankUserId"].disable();
			this.userForm.controls["vchUserId"].disable();
			this.userForm.controls["vchUserName"].disable();

			if (res.data.length === 0 || blankUserId == "newuser") {
				this.userForm.get("vchUserId")?.patchValue(res.generatedUserid);
				this.userForm.get("vchUserName")?.patchValue(res.txtUserName);
				this.txtUserNameAuto = res.txtUserName;
				this.txtUserIdAuto = res.generatedUserid;
				this.isDisabled = true;
				let newuserid = 0;
				this.viewAvailableProfile(
					this.userForm.get("intDesignationId")?.value,
					this.userForm.get("districtId")?.value,
					this.userForm.get("blockId")?.value,
					this.userForm.get("offclusterId")?.value,
					0
				);
			} else {
				this.tagData = res.data[0];
				this.selectedItems = res.officeData;
				this.intUserId = this.tagData.intUserId;
				this.encUserId = this.tagData.encId;
				this.vchUserName = this.tagData.vchUserName;
				this.vchUserId = this.tagData.vchUserId;
				this.txtUserNameAuto = this.tagData.vchUserName;
				this.txtUserIdAuto = this.tagData.vchUserId;
				this.intRoleId = this.tagData.intAccessRole;
				this.viewAvailableProfile(
					this.userForm.get("intDesignationId")?.value,
					this.userForm.get("districtId")?.value,
					this.userForm.get("blockId")?.value,
					this.userForm.get("offclusterId")?.value,
					this.tagData.intEmpProfileId
				);
				this.intProfileId = this.tagData.intEmpProfileId;
				this.intDesignationId = this.userForm.get("intDesignationId")?.value;
				this.districtId = this.userForm.get("districtId")?.value;
				this.blockId = this.userForm.get("blockId")?.value;
				this.offclusterId = this.userForm.get("offclusterId")?.value;
				this.blankUserId = this.userForm.get("blankUserId")?.value;

				if (this.intProfileId > 0) {
					this.userForm.controls["intProfileId"].disable();
					this.isDisabled = false;
				} else {
					this.isDisabled = true;
				}

				this.userForm.get("vchUserName")?.patchValue(this.vchUserName);
				this.userForm.get("vchUserId")?.patchValue(this.vchUserId);
				this.userForm.get("intRoleId")?.patchValue(this.intRoleId);
				this.userForm.get("intProfileId")?.patchValue(this.intProfileId);
				this.userForm.get("multiOfficeId")?.patchValue(this.selectedItems);
				this.userForm.get("intUserId")?.patchValue(this.intUserId);
				this.userForm.get("encUserId")?.patchValue(this.encUserId);
			}
			this.showprocessBtn = true;
		});
	}

	getUserList() {
		let userLevelIdtxt = this.userForm.get("userLevelId")?.value;
		let districtIdtxt = this.userForm.get("districtId")?.value;
		let blockIdtxt = this.userForm.get("blockId")?.value;
		let offclusterIdtxt = this.userForm.get("offclusterId")?.value;

		if (
			userLevelIdtxt == 5 ||
			(userLevelIdtxt == 4 && districtIdtxt > 0) ||
			(userLevelIdtxt == 3 && districtIdtxt > 0 && blockIdtxt > 0) ||
			(userLevelIdtxt == 2 &&
				districtIdtxt > 0 &&
				blockIdtxt > 0 &&
				offclusterIdtxt > 0)
		) {
			this.blankUserData = [];
			this.userForm.patchValue({
				blankUserId: 0,
			});
			this.ManageUserService.getUserList(
				this.userForm.get("intDesignationId")?.value,
				this.userForm.get("districtId")?.value,
				this.userForm.get("blockId")?.value,
				this.userForm.get("offclusterId")?.value
			).subscribe((res: any) => {
				let data: any = res;
				if (res.tinMultipleOffice == 1 && userLevelIdtxt == 3) {
					//multi office
					this.multiOfficelvl = true;
				} else {
					this.multiOfficelvl = false;
				}
				if (res.tinDesgnType == 2) {
					//multi user
					this.multiUserlvl = true;
				} else {
					this.multiUserlvl = false;
				}
				for (let key of Object.keys(data["data"])) {
					this.blankUserData.push(data["data"][key]);
				}
				this.blkUserChanged = false;
			});
		}
	}

	unTagProfile() {
		this.encId = this.userForm.get("encUserId")?.value;
		this.alertHelper
			.confirmAlert("Do you want to untag this user ?")
			.then((result: any) => {
				if (result.value) {
					this.spinner.show();
					this.ManageUserService.unTagProfile(this.encId).subscribe((res) => {
						this.spinner.hide();
						this.alertHelper
							.successAlert("Untagged!", "User untagged successfully", "success")
							.then(() => {
								window.location.reload();
							});
					});
				}
			});
	}

	deleteProfile(encId: string) {
		this.alertHelper
			.deleteAlert(
				"Are you sure to delete?",
				" ",
				"question",
				"Yes, delete it!"
			)
			.then((result) => {
				if (result.value) {
					this.spinner.show();
					this.ManageUserService.deleteUser(encId).subscribe((res) => {
						this.spinner.hide();
						this.alertHelper
							.successAlert("Deleted!", "Deleted Successfully", "success")
							.then(() => {
								window.location.reload();
							});
					});
				}
			});
	}

	getSubDesignation(designtionId: any) {
		if (designtionId > 0) {
			this.userForm.patchValue({
				intDesignationId: 0,
				districtId:
					this.userProfile.district > 0 ? this.userProfile.district : 0,
				blockId: this.userProfile.block > 0 ? this.userProfile.block : 0,
				offclusterId: 0,
			});
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

	refresh(): void {
		window.location.reload();
	}

	getRole(levelId: any) {
		this.roleChanged = true;
		this.roleData = [];
		this.ManageUserService.getRole(levelId).subscribe((res) => {
			this.posts = res;
			let data: any = res;
			for (let key of Object.keys(data["data"])) {
				this.roleData.push(data["data"][key]);
			}
			this.roleChanged = false;
		});
	}

	getDesignationGroup(levelId: any) {
		this.userForm.patchValue({
			designationGroupId: 0,
			intDesignationId: 0,
			districtId: 0,
			blockId: 0,
			offclusterId: 0,
		});
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

	loadSubDesignation(levelId: any) {
		if (levelId > 0) {
			this.getDesignationGroup(levelId);
			this.getRole(levelId);
		}else{
			this.userForm.get("userLevelId")?.patchValue(0);
		}
		if (levelId == 5) {
			this.distLvl = false;
			this.blkLvl = false;
			this.clusterLvl = false;
		} else if (levelId == 4) {
			this.distLvl = true;
			this.blkLvl = false;
			this.clusterLvl = false;
		} else if (levelId == 3) {
			this.distLvl = true;
			this.blkLvl = true;
			this.clusterLvl = false;
		} else if (levelId == 2) {
			this.distLvl = true;
			this.blkLvl = true;
			this.clusterLvl = true;
		}
	}
}
