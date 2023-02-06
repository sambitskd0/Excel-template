import {
	Component,
	OnInit,
	ElementRef,
	ViewChild,
	AfterViewInit,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { ManageProfileService } from "../../services/manage-profile.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { NgxSpinnerService } from "ngx-spinner";
import { ManageUserService } from "../../services/manage-user.service";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";

@Component({
	selector: "app-add-profile",
	templateUrl: "./add-profile.component.html",
	styleUrls: ["./add-profile.component.css"],
})
export class AddProfileComponent implements OnInit, AfterViewInit {
	@ViewChild("vchImage")
	maxDate: any = "";
	teacherProfileImage!: ElementRef;
	teacherImageChange: boolean = false;
	allLabel: string[] = [
		"Name",
		"Gender",
		"Moblie Number",
		"Email Id",
		"DOB",
		"Upload Photo",
		"Level of User",
		"Designation",
		"Sub-Designation",
		"Office District",
		"Office Block",
		"Office Cluster",
	];
	profileForm!: FormGroup;
	allErrorMessages: string[] = [];
	submitted = false;
	posts: any;
	showAge: any = "";
	distLvl: boolean = false;
	blkLvl: boolean = false;
	clusterLvl: boolean = false;
	desGrpSelect: boolean = true;
	desGrpLoading: boolean = true;
	districtData: any = [];
	offdistrictData: any = [];
	districtId: number = 0;
	blockData: any = [];
	offblockData: any = [];
	DesignationGroupData: any = "";
	designationLoading: boolean = false;
	offdistrictId: number = 0;
	intDesignationId: number = 0;
	clusterData: any = [];
	panchayatData: any = [];
	villageData: any = [];
	designationData: any = [];
	showSpinnerBlock: boolean = false;
	disrtictChanged: boolean = false;
	offdisrtictChanged: boolean = false;
	scBlockSelect: boolean = false;
	scDisrtictLoading: boolean = false;
	blockChanged: boolean = false;
	offblockChanged: boolean = false;
	designationChanged: boolean = false;
	clusterChanged: boolean = false;
	panchayatChanged: boolean = false;
	villageChanged: boolean = false;
	vilaageView: boolean = false;
	fileToUploadTeacher: any = "";
	imageUrlTeacher: any = "";
	vchImage: any = "";
	locateId: any = "";
	nagarnigamId: any = 0;
	blockId: any = 0;
	locateIdWV: any = "";
	isimageUrlTeacher: boolean = false;
	municipalityChanged: boolean = false;
	muncipalityView: boolean = false;
	panchayatView: boolean = false;
	municipalityData: any = [];
	userProfile = this.commonService.getUserProfile();
	userLevelId: number = 0;
	designationGroupId: number = 0;
	stateUser: boolean = false;
	distUser: boolean = false;
	blkUser: boolean = false;
	plPrivilege: string = "view"; //For menu privilege
	config = new Constant();
	adminPrivilege: boolean = false;
	dobSubscription!: any;
	parval: any;
	date: any;

	constructor(
		private formBuilder: FormBuilder,
		private privilegeHelper: PrivilegeHelper, //For menu privilege
		private alertHelper: AlertHelper,
		public customValidators: CustomValidators,
		private spinner: NgxSpinnerService,
		private commonService: CommonserviceService,
		private profileService: ManageProfileService,
		private route: Router,
		private router: ActivatedRoute,
		private ManageUserService: ManageUserService,
		private commonFunctionHelper: CommonFunctionHelper
	) {
		const pageUrl: any = this.route.url;
		this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl); //For menu privilege
		this.commonService.verifyLinkPermission(
			pageUrl,
			this.config.linkType[2],
			this.config.privilege[4]
		); // For authorization
		this.maxDate = new Date();
	}

	ngOnInit(): void {
		this.date = new Date();
		if (this.plPrivilege == "admin") {
			this.adminPrivilege = true;
		}
		this.initializeForm();
		this.getDistrict();
		this.getoffDistrict();
		this.onChangeOfDates();

		if (this.userProfile.userLevel == 5) {
			this.userLevelId = 5;
		} else if (this.userProfile.userLevel == 4) {
			this.stateUser = true;
			this.profileForm.get("userLevelId")?.patchValue(3);
			this.loadSubDesignation(3);
		} else if (this.userProfile.userLevel == 3) {
			this.profileForm.get("userLevelId")?.patchValue(2);
			this.loadSubDesignation(2);
			this.stateUser = true;
			this.distUser = true;
			this.blkUser = true;
		} else if (this.userProfile.userLevel == "") {
			this.userLevelId = 0;
		}
	}
	ngAfterViewInit(): void {}

	onChangeOfDates() {
		this.dobSubscription = this.profileForm
			?.get("dtDOB")
			?.valueChanges.subscribe((value: any) => {
				this.ageValidation();
			});
	}
	// ngOnDestroy() {
	//   this.dobSubscription.unsubscribe();
	// }

	get profileFormControl() {
		return this.profileForm.controls;
	}

	handleFileInputTeacher(e: any) {
		let file = e.target.files;

		this.teacherImageChange = true;
		if (this.teacherImageChange == true) {
			this.profileForm.controls["vchImage"].setValidators([
				// Validators.required,
				// this.customValidators.requiredFileType(["jpg", "png", "jpeg"]),
				// this.customValidators.fileSizeValidator(file, 300),
			]);
			this.profileForm.controls["vchImage"].updateValueAndValidity();
		}

		var ext = file[0].name.substring(file[0].name.lastIndexOf(".") + 1);

		if (ext == "jpg" || ext == "png" || ext == "jpeg") {
			const fileSize = file[0].size;
			const fileSizeInKB = Math.round(fileSize / 1024);
			if (fileSizeInKB > 300) {
				this.alertHelper.viewAlert(
					"error",
					"Invalid",
					"Upload Image must be 300KB"
				);
				return;
			} else {
				this.fileToUploadTeacher = file.item(0);

				//Show image preview
				let reader = new FileReader();
				reader.onload = (event: any) => {
					this.imageUrlTeacher = event.target.result;
					this.profileForm.patchValue({
						fileSource: this.imageUrlTeacher,
					});
				};
				reader.readAsDataURL(this.fileToUploadTeacher);
				this.isimageUrlTeacher = true;
			}
		} else {
			this.alertHelper.viewAlert("error", "Invalid", "Inavlid file format");
			this.imageUrlTeacher = "";
			this.fileToUploadTeacher = Blob;
			this.isimageUrlTeacher = false;
		}
	}

	ageValidation() {
		let ageVal = this.profileForm.controls["dtDOB"].value;
		if (ageVal && ageVal != "") {
			const convertAge = new Date(ageVal);
			const timeDiff = Math.abs(Date.now() - convertAge.getTime());
			this.showAge = Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
			if (this.showAge < 18) {
				this.alertHelper.viewAlert(
					"error",
					"Invalid",
					"Age Should not be below 18 Years"
				);
				this.profileForm.patchValue({
					dtDOB: "",
				});
			}
			if (this.showAge > 70) {
				this.alertHelper.viewAlert(
					"error",
					"Invalid",
					"Age Should not be above 70 Years"
				);
				this.profileForm.patchValue({
					dtDOB: "",
				});
			}
		}
	}
	getFormValue(allValue: any) {
		return {
			...allValue,
			dtDOB: this.commonFunctionHelper.formatDateHelper(allValue?.dtDOB),
		};
	}

	onSubmit() {
		this.submitted = true;
		// this.customValidators.formValidationHandler(
		//     this.profileForm,
		//     this.allLabel
		// );
		if (this.profileForm.controls["txtName"]?.value == "") {
			this.alertHelper.viewAlert("error","Invalid","Please enter user Name");
			return;
		}

		if (this.profileForm.controls["radioGender"]?.value == "") {
			this.alertHelper.viewAlert("error","Invalid","Please select gender");
			return;
		}

		if (this.profileForm.controls["txtMobile"]?.value == "") {
			this.alertHelper.viewAlert("error","Invalid","Please enter mobile number");
			return;
		}
		if (this.profileForm.controls["txtMobile"]?.value.length != 10) {
			this.alertHelper.viewAlert("error","Invalid","Mobile number should be of 10 digits");
			return;
		}
		if (this.profileForm.controls["txtEmail"]?.value == "") {
			this.alertHelper.viewAlert("error","Invalid","Please enter email id");
			return;
		}
		if (
			!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
				this.profileForm.controls["txtEmail"]?.value
			)
		) {
			this.alertHelper.viewAlert("error","Invalid","Email format is wrong");
			return;
		}
		if (this.profileForm.controls["userLevelId"]?.value == "") {
			this.alertHelper.viewAlert("error","Invalid","Please select level of user");
			return;
		}
		if (this.profileForm.controls["designationGroupId"]?.value == 0) {
			this.alertHelper.viewAlert("error","Invalid","Please select designation");
			return;
		}

		if (this.profileForm.controls["intDesignationId"]?.value == 0) {
			this.alertHelper.viewAlert("error","Invalid","Please select sub-designation");
			return;
		}
		let userLevel = this.profileForm.controls["userLevelId"]?.value;
		if (userLevel == 0) {
			this.alertHelper.viewAlert("error","Invalid","Please select level of user");
			return;
		}
		if (userLevel <= 4) {
			if (this.profileForm.controls["offdistrictId"]?.value == 0) {
				this.alertHelper.viewAlert("error","Invalid","Please select district");
				return;
			}
		}
		if (userLevel <= 3) {
			if (this.profileForm.controls["offblockId"]?.value == 0) {
				this.alertHelper.viewAlert("error","Invalid","Please select block");
				return;
			}
		}
		if (userLevel <= 2) {
			if (this.profileForm.controls["offclusterId"]?.value == 0) {
				this.alertHelper.viewAlert("error","Invalid","Please select cluster");
				return;
			}
		}

		// if (this.profileForm.valid === true) {

		this.alertHelper.submitAlert().then((result: any) => {
			if (result.value) {
				const allValue = this.profileForm.value;
				this.spinner.show(); // ==== show spinner
				this.profileService.createProfile(allValue).subscribe({
					next: (res: any) => {
						this.spinner.hide(); //==== hide spinner
						this.alertHelper
							.successAlert(
								"Saved!",
								"Profile created successfully.",
								"success"
							)
							.then(() => {
								this.route.navigate(["./../viewProfile"], {
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

	initializeForm() {
		this.profileForm = this.formBuilder.group({
			txtName: ["", [Validators.required, Validators.maxLength(64)]],
			radioGender: ["", Validators.required],
			txtMobile: [
				"",
				[
					Validators.pattern("^[0-9]*$"),
					Validators.min(1),
					Validators.minLength(10),
					Validators.maxLength(10),
				],
			],
			txtEmail: [
				"",
				[
					Validators.required,
					Validators.email,
					Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}"),
				],
			],
			dtDOB: [""],
			vchImage: [""],
			userLevelId: [this.userLevelId, Validators.required],
			designationGroupId: [this.designationGroupId, Validators.required],
			intDesignationId: [this.intDesignationId, Validators.required],
			offdistrictId: [this.offdistrictId],
			offblockId: [""],
			offclusterId: [""],
			locateId: [this.locateId, Validators.required],
			vchOfficePhoneNo: [""],

			districtId: [this.districtId],
			nagarnigamId: [""],
			blockId: [""],
			villageId: [""],
			txtAddress: ["", [Validators.maxLength(500)]],
			fileSource: [""],
		});
	}

	removeTeacherImage() {
		this.imageUrlTeacher = "";
		this.fileToUploadTeacher = Blob;
		this.isimageUrlTeacher = false;
		this.profileForm.patchValue({
			imageUrlTeacher: "",
			vchImage: "",
		});
	}
	getDistrict() {
		this.disrtictChanged = true;
		this.commonService.getAllDistrict().subscribe((res: []) => {
			this.posts = res;
			this.districtData = this.posts.data;
			this.disrtictChanged = false;
		});
	}

	getoffDistrict() {
		this.offdisrtictChanged = true;
		this.scDisrtictLoading = true;
		this.commonService.getAllDistrict().subscribe((res: []) => {
			this.posts = res;
			this.offdistrictData = this.posts.data;

			if (this.userProfile.district != 0 || this.userProfile.district != "") {
				this.offdistrictData = this.offdistrictData.filter((dis: any) => {
					return dis.districtId == this.userProfile.district;
				});
				this.getOffBlock(this.userProfile.district);
				this.offdisrtictChanged = true;
			} else {
				this.offdisrtictChanged = false;
			}
			this.scDisrtictLoading = false;
		});
	}

	getBlock(id: any) {
		this.blockChanged = true;
		const districtId = id;
		this.blockData = [];
		this.panchayatData = [];
		this.villageData = [];
		this.profileForm.patchValue({ blockId: "" });
		this.profileForm.patchValue({ nagarnigamId: "" });
		this.profileForm.patchValue({ villageId: "" });
		let locateId = this.profileForm.get("locateId")?.value;
		if (districtId !== "") {
			this.profileForm.patchValue({ nagarnigamId: "" });
			if (districtId && locateId == 1) {
				this.getMunicipality(this.districtId);
			}
			this.commonService.getBlockByDistrictid(districtId).subscribe((res) => {
				let data: any = res;
				for (let key of Object.keys(data["data"])) {
					this.blockData.push(data["data"][key]);
				}
				this.blockChanged = false;
			});
		} else {
			this.blockChanged = false;
		}
	}

	getOffBlock(districtId: any) {
		this.offblockChanged = true;

		this.offblockData = [];
		this.scBlockSelect = true;
		if (districtId !== "") {
			this.commonService
				.getBlockByDistrictid(districtId)
				.subscribe((res: any) => {
					this.offblockData = res;
					this.offblockData = this.offblockData.data;

					if (this.userProfile.block != 0 || this.userProfile.block != "") {
						this.offblockData = this.offblockData.filter((blo: any) => {
							return blo.blockId == this.userProfile.block;
						});

						this.getCluster(this.userProfile.block);
						this.scBlockSelect = false;
						this.offblockChanged = true;
					} else {
						this.offblockChanged = false;
						this.scBlockSelect = false;
					}
				});
		} else {
			this.scBlockSelect = false;
		}
	}

	getCluster(id: any) {
		this.clusterChanged = true;
		const blockId = id;
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

	getPanchayat(blockId: any) {
		this.panchayatChanged = true;

		this.panchayatData = [];
		this.villageData = [];
		this.profileForm.patchValue({ nagarnigamId: "" });
		this.profileForm.patchValue({ villageId: "" });
		if (blockId !== "") {
			this.commonService.getPanchayatByBlockId(blockId).subscribe((res) => {
				let data: any = res;
				for (let key of Object.keys(data["data"])) {
					this.panchayatData.push(data["data"][key]);
				}
				this.panchayatChanged = false;
			});
		} else {
			this.panchayatChanged = false;
		}
	}
	getMunicipality(districtId: any) {
		this.municipalityChanged = true;
		this.districtId = districtId;
		this.municipalityData = [];
		this.villageData = [];
		this.profileForm.patchValue({ nagarnigamId: "" });
		this.profileForm.patchValue({ villageId: "" });
		if (districtId !== "") {
			this.commonService
				.getMunicipalityByDistrictId(districtId)
				.subscribe((res) => {
					let data: any = res;
					for (let key of Object.keys(data["data"])) {
						this.municipalityData.push(data["data"][key]);
					}
					this.municipalityChanged = false;
				});
		} else {
			this.municipalityChanged = false;
		}
	}

	getVillage(panchayatId: any, locId: any) {
		this.villageChanged = true;
		this.villageData = [];
		this.nagarnigamId = panchayatId;
		if (panchayatId !== "") {
			if (locId == 1) {
				this.commonService
					.getWardByMunicipalityId(panchayatId)
					.subscribe((res) => {
						let data: any = res;
						for (let key of Object.keys(data["data"])) {
							this.villageData.push(data["data"][key]);
						}
						this.villageChanged = false;
					});
			} else if (locId == 2) {
				this.commonService
					.getVillageByPanchayatId(panchayatId)
					.subscribe((res) => {
						let data: any = res;
						for (let key of Object.keys(data["data"])) {
							this.villageData.push(data["data"][key]);
						}
						this.villageChanged = false;
					});
			}
			// this.villageChanged = false;
		} else {
			this.villageChanged = false;
		}
	}

	loadSubDesignation(levelId: any) {
		if (levelId > 0) {
			this.getDesignationGroup(levelId);
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

	getDesignationGroup(levelId: any) {
		this.profileForm.patchValue({
			designationGroupId: 0,
			intDesignationId: 0,
			districtId: 0,
			blockId: 0,
			offclusterId: 0,
		});
		this.desGrpSelect = false;
		this.desGrpLoading = false;
		this.DesignationGroupData = [];
		this.ManageUserService.getDesignationGroup(levelId).subscribe(
			(res: any) => {
				this.posts = res;
				let data: any = res;
				for (let key of Object.keys(data["data"])) {
					this.DesignationGroupData.push(data["data"][key]);
				}
				this.desGrpSelect = true;
				this.desGrpLoading = true;
			}
		);
	}

	locateRadioControl(val: any, dist: any) {
		this.muncipalityView = false;
		this.panchayatView = false;
		this.vilaageView = false;
		this.panchayatData = [];
		this.profileForm.patchValue({ blockId: "" });
		this.profileForm.patchValue({ nagarnigamId: "" });
		if (dist == 0) {
			this.alertHelper.viewAlert("info", "Invalid", "District is Required");
			this.profileForm.patchValue({ locateId: "" });
			return;
		}

		if (val == 1) {
			this.muncipalityView = true;
			this.vilaageView = true;
			this.getMunicipality(dist);
			this.locateIdWV = val;
		} else if (val == 2) {
			this.panchayatView = true;
			this.vilaageView = true;
			this.getBlock(dist);
			this.locateIdWV = val;
		}
	}

	getSubDesignation(designtionId: any) {
		if (designtionId > 0) {
			this.profileForm.patchValue({
				intDesignationId: 0,
				offdistrictId:
					this.userProfile.district > 0 ? this.userProfile.district : 0,
				offblockId: this.userProfile.block > 0 ? this.userProfile.block : 0,
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
}
