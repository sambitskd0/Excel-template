import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { ManageLeaveTypeService } from "../../services/manage-leave-type.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { NgxSpinnerService } from "ngx-spinner";
import { ManageLeaveApplyService } from "../../services/manage-leave-apply.service";
import { ManageOpeningBalanceService } from "../../services/manage-opening-balance.service";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
@Component({
	selector: "app-add-opening-balance",
	templateUrl: "./add-opening-balance.component.html",
	styleUrls: ["./add-opening-balance.component.css"],
})
export class AddOpeningBalanceComponent implements OnInit {
	public userProfile = JSON.parse(
		sessionStorage.getItem("userProfile") || "{}"
	);

	leaveOBForm!: FormGroup;
	allErrorMessages: string[] = [];
	submitted = false;
	posts: any;
	leaveTypeChanged: boolean = false;
	lvtype: any = "";

	lvDataData: any = [];

	lvLifeEntitle: number = 0;
	lvLifeOccurance: string = "NA";
	yearlyEntitle: number = 0;

	leaveTypeId: number = 0;
	leaveEntitled: number = 0;
	leaveGranted: number = 0;
	leaveBalance: number = 0;
	lifeTimeBalance: number = 0;
	noOfTimesLeaveBalance: number = 0;
	isMedicalLeave: boolean = false;
	isOccuranceLeave: boolean = false;
	leaveModeChanged: boolean = false;
	schoolId: number = 0;
	teacherList: any = "";
	teacherId: number = 0;
	plPrivilege: string = "view"; //For menu privilege
	config = new Constant();
	academicYear: any = this.config.getAcademicCurrentYear();

	allLabel: string[] = [
		"Cluster name",
		"School name",
		"Teacher name",
		"Leave type",
		"Life time balance",
		"Leave occurrence balance",
		"Leave entitled",
		"Leave granted",
		"Leave balance",
	];

	clusterChanged: boolean = false;
	clusterData: any = [];
	scSchoolChanged: boolean = false;
	getSchoolData: any = [];
	blkLogin: boolean = false;
	hmType: number = 0;
	offclusterId: number = 0;
	adminPrivilege: boolean = false;

	constructor(
		private formBuilder: FormBuilder,
		private alertHelper: AlertHelper,
		public customValidators: CustomValidators,
		private spinner: NgxSpinnerService,
		private commonService: CommonserviceService,
		private leaveTypeService: ManageLeaveTypeService,
		private privilegeHelper: PrivilegeHelper, //For menu privilege
		private route: Router,
		private router: ActivatedRoute,
		private el: ElementRef,
		private ManageLeaveApplyService: ManageLeaveApplyService,
		private ManageOpeningBalanceService: ManageOpeningBalanceService
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
		this.initializeForm();
		this.getLeaveType();
		if (this.userProfile.school != "0") {
			this.getTeachersList(0, this.userProfile.school);
			this.blkLogin = true;
		} else {
			this.blkLogin = false;
		}
		this.leaveOBForm.controls["leaveBalance"].disable();		
		if(this.userProfile.block > 0){
			this.getCluster();
			this.getSchool(0);
		}
	}
	initializeForm() {
		this.leaveOBForm = this.formBuilder.group({
			offclusterId: [""],
			schoolId: [""],
			teacherId: ["", Validators.required],
			leaveTypeId: ["", Validators.required],
			lifeTimeBalance: [this.lifeTimeBalance],
			noOfTimesLeaveBalance: [this.noOfTimesLeaveBalance],
			leaveEntitled: ["", [Validators.required, Validators.pattern(/^[0-9]+$/)]],
			leaveGranted: [this.leaveGranted, Validators.pattern(/^[0-9]+$/)],
			leaveBalance: [this.leaveBalance],
		});
	}
	onSubmit() {
		this.submitted = true;
		if (this.blkLogin == false) {
			if (this.leaveOBForm.controls["schoolId"]?.value == "") {
				const invalidControl = this.el.nativeElement.querySelector(
					'[formControlName="schoolId"]'
				);
				invalidControl.focus();
				this.alertHelper.successAlert(
					"Invalid",
					"Please select School",
					"error"
				);
				return;
			}
		}

		// this.customValidators.formValidationHandler(
		// 	this.leaveOBForm,
		// 	this.allLabel,
		// 	this.el
		// );

		this.customValidators.formValidationHandler(
			this.leaveOBForm,
			this.allLabel,
			this.el,
			{
			  required: {
				teacherId: "Please select teacher name ",
				leaveTypeId: "Please select leave type",
				leaveEntitled: "Please Enter leaver entitled",
			  },
			}
		  );

		let lvEntitled =
			this.leaveOBForm.controls["leaveEntitled"]?.value > 0
				? this.leaveOBForm.controls["leaveEntitled"]?.value
				: 0;
		let lvGranted =
			this.leaveOBForm.controls["leaveGranted"]?.value > 0
				? this.leaveOBForm.controls["leaveGranted"]?.value
				: 0;
		this.leaveBalance = lvEntitled - lvGranted;

		if (this.leaveBalance < 0) {
			const invalidControl = this.el.nativeElement.querySelector(
				'[formControlName="leaveGranted"]'
			);
			invalidControl.focus();
			this.alertHelper.successAlert(
				"Invalid",
				"Leave granted should not be grater than leave entitled",
				"error"
			);
			this.leaveBalance = 0;
			return;
		}


		

		if (this.leaveOBForm.valid === true) {
			this.alertHelper.submitAlert().then((result: any) => {
				if (result.value) {
					this.spinner.show(); // ==== show spinner
					this.ManageOpeningBalanceService.createOpeningBalance(
						this.leaveOBForm?.getRawValue()
					).subscribe({
						next: (res: any) => {
							this.spinner.hide(); //==== hide spinner
							this.alertHelper
								.successAlert("Saved!", "Opening balance added successfully", "success")
								.then(() => {
									this.route.navigate(["./../viewOpeningBalance"], {
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

	getLeaveBalance() {
		this.teacherId = this.leaveOBForm.controls["teacherId"].value;
		this.leaveTypeId = this.leaveOBForm.controls["leaveTypeId"].value;
		if (this.teacherId > 0 && this.leaveTypeId > 0) {
			this.ManageOpeningBalanceService.getLeaveEntitlement(
				this.leaveTypeId,
				this.teacherId
			).subscribe((res: any) => {
				this.yearlyEntitle = res.yearlyEntitle;

				if (this.leaveTypeId == 6) {
					this.lvLifeEntitle = res.lvLifeEntitle;
					this.lvLifeOccurance = "NA";
				} else if (
					this.leaveTypeId == 5 ||
					this.leaveTypeId == 10 ||
					this.leaveTypeId == 11
				) {
					this.lvLifeOccurance = "Twice";
					this.lvLifeEntitle = 0;
				} else {
					this.lvLifeOccurance = "NA";
					this.lvLifeEntitle = 0;
				}
			});
		} else {
			this.lvLifeEntitle = 0;
			this.lvLifeOccurance = "NA";
			this.yearlyEntitle = 0;
		}
	}

	getLeaveType() {
		this.leaveTypeChanged = true;
		this.lvtype = [];
		this.leaveTypeService.getLeaveType().subscribe((res: any) => {
			let data: any = res;
			for (let key of Object.keys(data["data"])) {
				this.lvtype.push(data["data"][key]);
			}
			this.leaveTypeChanged = false;
		});
	}

	getTeachersList(teaherId: any, schoolId: any) {
		this.leaveModeChanged = true;
		this.schoolId = schoolId;
		this.teacherList = [];
		if (this.userProfile.school != "0") {
			this.hmType = 0; //Teacher only
		} else {
			this.hmType = 2; //HM only
		}
		this.ManageLeaveApplyService.getTeachersList(
			this.schoolId,
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

	showhide(lvtype: any) {
		if (lvtype == 6) {
			this.isMedicalLeave = true;
		} else {
			this.isMedicalLeave = false;
		}

		if (lvtype == 5 || lvtype == 10 || lvtype == 11) {
			this.isOccuranceLeave = true;
		} else {
			this.isOccuranceLeave = false;
		}
	}
	autoCal() {
		let lvEntitled =
			this.leaveOBForm.controls["leaveEntitled"]?.value > 0
				? this.leaveOBForm.controls["leaveEntitled"]?.value
				: 0;
		let lvGranted =
			this.leaveOBForm.controls["leaveGranted"]?.value > 0
				? this.leaveOBForm.controls["leaveGranted"]?.value
				: 0;
		this.leaveBalance = lvEntitled - lvGranted;

		if (this.leaveBalance < 0) {
			this.alertHelper.successAlert(
				"Leave granted should not be grater than leave entitled",
				"",
				"error"
			);
			this.leaveBalance = 0;
			return;
		}
	}

	getCluster() {
		this.clusterChanged = true;
		this.leaveOBForm.patchValue({
			offclusterId: 0,
			intDesignationId: 0,
		});
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
				this.leaveOBForm.patchValue({
					schoolId: "",
				});
				this.scSchoolChanged = false;
			});
		} else {
			this.scSchoolChanged = false;
		}
	}
}
