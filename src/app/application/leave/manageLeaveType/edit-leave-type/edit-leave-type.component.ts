import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { ManageLeaveTypeService } from "../../services/manage-leave-type.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { NgxSpinnerService } from "ngx-spinner";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";

@Component({
	selector: "app-edit-leave-type",
	templateUrl: "./edit-leave-type.component.html",
	styleUrls: ["./edit-leave-type.component.css"],
})
export class EditLeaveTypeComponent implements OnInit {
	leaveTypeForm!: FormGroup;
	allErrorMessages: string[] = [];
	submitted = false;
	posts: any;
	leaveTypeChanged: boolean = false;
	lvtype: any = "";

	leaveTypeId: number = 0;
	radioEntitlement: number = 0;
	radioCarryForward: number = 0;
	radioEncashable: number = 0;
	radioIncludeHoliday: number = 0;
	radioApplicableTo: number = 0;
	radioApplicableFor: number = 0;
	// radioAllowNegative : number = 0;
	lvEntitlementYear: number = 0;
	lvDescription: string = "";
	leaveTypeLoading: boolean = false;
	encId: string = "";
	leaveTypeData: any;
	userId: any="";
	profileId: any="";
	adminPrivilege: boolean = false;

	allLabel: string[] = [
		"",
		"",
		"Leave type",
		"Entitlement",
		"Carry forward",
		"Encashable",
		"Include holiday",
		"Applicable to (exclude first 3 years of service)",
		"Applicable for (gender specific)",
		"Entitlement year",
		"Description",
	];

	plPrivilege: string = "view"; //For menu privilege
	config = new Constant();
	constructor(
		private formBuilder: FormBuilder,
		private alertHelper: AlertHelper,
		public customValidators: CustomValidators,
		private spinner: NgxSpinnerService,
		private commonService: CommonserviceService,
		private leaveTypeService: ManageLeaveTypeService,
		private privilegeHelper: PrivilegeHelper, //For menu privilege
		private route: Router,
		private el: ElementRef,
		private router: ActivatedRoute
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
		const users = this.commonService.getUserProfile();
		this.userId = users?.userId;
		this.profileId = users?.profileId;
		this.encId = this.router.snapshot.params["encId"];
		this.editProfile(this.encId);
		this.initializeForm();
		this.getLeaveType();
	}

	resetField() {
		if (this.leaveTypeForm.controls["leaveTypeId"]?.value == 0) {
			this.leaveTypeForm.patchValue({
				leaveTypeId: "",
			});
		}
	}
	initializeForm() {
		this.leaveTypeForm = this.formBuilder.group({
			userId:[this.userId],
			profileId:[this.profileId],
			leaveTypeId: [this.leaveTypeId, Validators.required],
			radioEntitlement: [this.radioEntitlement, Validators.required],
			radioCarryForward: [this.radioCarryForward, Validators.required],
			radioEncashable: [this.radioEncashable, Validators.required],
			radioIncludeHoliday: [this.radioIncludeHoliday, Validators.required],
			radioApplicableTo: [this.radioApplicableTo, Validators.required],
			radioApplicableFor: [this.radioApplicableFor, Validators.required],
			lvEntitlementYear: [this.lvEntitlementYear, Validators.required],
			lvDescription: [
				this.lvDescription,
				[
					Validators.required,
					Validators.maxLength(400),
					Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/),
					this.customValidators.firstCharValidatorRF,
				],
			],
			encId: [this.encId],
		});
	}
	editProfile(encId: string) {
		this.spinner.show();
		this.leaveTypeService.readLeaveType(encId).subscribe((res: any) => {
			this.leaveTypeData = res.data[0];
			this.encId = this.leaveTypeData.encId;
			this.leaveTypeId = this.leaveTypeData.leaveTypeId;
			this.radioEntitlement = this.leaveTypeData.entitlementType;
			this.radioCarryForward = this.leaveTypeData.carryForward;
			this.radioEncashable = this.leaveTypeData.encashable;
			this.radioIncludeHoliday = this.leaveTypeData.includeHoliday;
			this.radioApplicableTo = this.leaveTypeData.applicableTo;
			this.radioApplicableFor = this.leaveTypeData.applicableFor;
			this.lvEntitlementYear =
				this.leaveTypeData.entitlementYearType > 0
					? this.leaveTypeData.entitlementYearType
					: "";
			this.lvDescription = this.leaveTypeData.lvTypeDescription;
			this.leaveTypeForm.controls["leaveTypeId"].disable();
			this.initializeForm();
			this.spinner.hide();
		});
	}

	onSubmit() {
		this.submitted = true;
		// this.customValidators.formValidationHandler(
		// 	this.leaveTypeForm,
		// 	this.allLabel,
		// 	this.el
		// );

		this.customValidators.formValidationHandler(
			this.leaveTypeForm,
			this.allLabel,
			this.el,
			{
			  required: {
				leaveTypeId: "Please select leave type",
				radioEntitlement: "Please select entitlement",
				radioCarryForward: "Please select carry forward",
				radioEncashable: "Please select encashable",
				radioIncludeHoliday: "Please select include holidays",
				radioApplicableTo: "Please select applicable to (exclude first 3 years of service) ",
				radioApplicableFor: "Please select applicable For (gender specific)",
				lvEntitlementYear: "Please select entitlement year",
				lvDescription: "Please enter leave description",
			  },
			}
		  );

		if (this.leaveTypeForm.valid === true) {
			this.alertHelper.submitAlert().then((result: any) => {
				if (result.value) {
					this.spinner.show(); // ==== show spinner
					this.leaveTypeService
						.updateLeaveType(this.leaveTypeForm.value)
						.subscribe({
							next: (res: any) => {
								this.spinner.hide(); //==== hide spinner
								this.alertHelper
									.successAlert(
										"Saved!",
										"Leave type updated successfully.",
										"success"
									)
									.then(() => {
										this.route.navigate(["../../viewLeaveType"], {
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

	onCancel() {
		this.route.navigate(["../../viewLeaveType"], {
			relativeTo: this.router,
		});
	}

	getLeaveType() {
		this.leaveTypeChanged = true;
		this.lvtype = [];
		this.leaveTypeLoading = true;
		this.leaveTypeService.getLeaveType().subscribe((res: any) => {
			let data: any = res;
			for (let key of Object.keys(data["data"])) {
				this.lvtype.push(data["data"][key]);
			}
			this.leaveTypeChanged = false;
			this.leaveTypeLoading = false;
		});
	}
}
