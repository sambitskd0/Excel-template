import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { ManageLeaveEntitlementService } from "../../services/manage-leave-entitlement.service";
import { ManageLeaveTypeService } from "../../services/manage-leave-type.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { NgxSpinnerService } from "ngx-spinner";
import { RegistrationService } from "../../../teacher/services/registration.service";
import { ManageProfileService } from "../../../user/services/manage-profile.service";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";

@Component({
	selector: "app-add-leave-entitlement",
	templateUrl: "./add-leave-entitlement.component.html",
	styleUrls: ["./add-leave-entitlement.component.css"],
})
export class AddLeaveEntitlementComponent implements OnInit {
	leaveEntForm!: FormGroup;
	allErrorMessages: string[] = [];
	submitted = false;
	posts: any;
	leaveTypeChanged: boolean = false;
	lvtype: any = "";
	userId: any = "";
	profileId: any = "";

	leaveTypeId: number = 0;

	teacherAppointmentChanged: boolean = false;
	teacherAppointment: any = "";

	natureOfAppointmt: number = 0;
	appointingAuthority: boolean = false;
	appointingAuth: any = "";

	appointType: boolean = false;
	appointmentType: any = "";
	numberofDays: number = 0;
	teacherType: number = 0;
	isMedicalLeave: boolean = false;
	entRemarks: string = "";
	maxNumberofDays: number = 0;
	docRequired: number = 0;
	designationChanged: boolean = false;
	designationData: any = [];
	designationData2: any = [];
	designationChanged2: boolean = false;

	ATADesignation: number = 0;
	officeId: number = 0;
	officeId2: number = 0;

	ATADesignation2: number = 0;

	allLabel: string[] = [
		"Leave type",
		"Teacher type",
		"Nature of appointment",
		"Appointing authority",
		"Appointment type",
		"No. of days",
		"Maximun no. of days in a year",
		"Remarks",
		"Document required",
		"Office of 1st level approval",
		"Approval authority of 1st level approval",
		"Office of 2nd level approval",
		"Approval authority of 2nd level approval",
		"",
		"",
	];
	leaveTypeLoading: boolean = false;
	appointmentLoading: boolean = false;
	appAuthLoading: boolean = false;
	appTypeLoading: boolean = false;
	plPrivilege: string = "view"; //For menu privilege
	config = new Constant();
	adminPrivilege: boolean = false;
	constructor(
		private formBuilder: FormBuilder,
		private alertHelper: AlertHelper,
		public customValidators: CustomValidators,
		private spinner: NgxSpinnerService,
		private commonService: CommonserviceService,
		private leaveEntitlementService: ManageLeaveEntitlementService,
		private privilegeHelper: PrivilegeHelper, //For menu privilege
		private route: Router,
		private router: ActivatedRoute,
		private leaveTypeService: ManageLeaveTypeService,
		private registrationService: RegistrationService,
		private profileService: ManageProfileService,
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
		const users = this.commonService.getUserProfile();
		this.userId = users?.userId;
		this.profileId = users?.profileId;
		this.initializeForm();
		this.getLeaveType();
		this.getTeacherAppointment();
		this.getAppointingAuthority();
		this.getAppointType();
		this.el.nativeElement
			.querySelector("[formControlName=leaveTypeId]")
			.focus();
	}

	initializeForm() {
		this.leaveEntForm = this.formBuilder.group({
			leaveTypeId: ["", Validators.required],
			teacherType: ["", Validators.required],
			natureOfAppointmt: ["", Validators.required],
			appointingAuth: ["", Validators.required],
			appointmentType: ["", Validators.required],
			numberofDays: ["",  [Validators.required, Validators.pattern(/^[0-9]+$/)]],
			maxNumberofDays: ["", Validators.pattern(/^[0-9]+$/)],
			entRemarks: [
				"",
				[
					Validators.required,
					Validators.maxLength(400),
					Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/),
					this.customValidators.firstCharValidatorRF,
				],
			],
			docRequired: ["", Validators.required],
			officeId: ["", Validators.required],
			ATADesignation: ["", Validators.required],
			officeId2: ["", Validators.required],
			ATADesignation2: ["", Validators.required],
			userId:[this.userId],
			profileId:[this.profileId],
		});
	}

	onSubmit() {
		this.submitted = true;
		// this.customValidators.formValidationHandler(
		// 	this.leaveEntForm,
		// 	this.allLabel,
		// 	this.el
		// );
		this.customValidators.formValidationHandler(
			this.leaveEntForm,
			this.allLabel,
			this.el,
			{
			  required: {
				leaveTypeId: "Please select leave type",
				teacherType: "Please select teacher type",
				natureOfAppointmt: "Please select nature of appointment",
				appointingAuth: "Please select appointing authority",
				appointmentType: "Please select appointment type",
				numberofDays: "Please enter number of days",
				entRemarks: "Please enter remarks",
				docRequired: "Please select document required option",
				officeId: "Please select 1st level approval office",
				ATADesignation: "Please select 1st level approval authority",
				officeId2: "Please select 2nd level approval office",
				ATADesignation2: "Please select 2nd level approval authority",
			  },
			}
		  );
		if (this.leaveEntForm.controls["leaveTypeId"]?.value == 6) {
			if (this.leaveEntForm.controls["maxNumberofDays"]?.value == "") {
				const invalidControl = this.el.nativeElement.querySelector(
					'[formControlName="maxNumberofDays"]'
				);
				invalidControl.focus();
				this.alertHelper.successAlert(
					"Invalid",
					"Maximun no. of days in a year is required",
					"error"
				);
				return;
			}
		}
		if (
			this.leaveEntForm.controls["officeId"]?.value >=
				this.leaveEntForm.controls["officeId2"]?.value &&
			this.leaveEntForm.controls["officeId2"]?.value > 0
		) {
			const invalidControl = this.el.nativeElement.querySelector(
				'[formControlName="officeId2"]'
			);
			invalidControl.focus();
			this.alertHelper.successAlert(
				"Invalid",
				"Please check that 2nd Level Approval office must be greater than 1st level Approval Office",
				"error"
			);
			return;
		}

		if (this.leaveEntForm.valid === true) {
			this.alertHelper.submitAlert().then((result: any) => {
				if (result.value) {
					this.spinner.show(); // ==== show spinner
					this.leaveEntitlementService
						.createLeaveEntitlement(this.leaveEntForm?.getRawValue())
						.subscribe({
							next: (res: any) => {
								this.spinner.hide(); //==== hide spinner
								this.alertHelper
									.successAlert(
										"Saved!",
										"Leave entitlement detail saved successfully.",
										"success"
									)
									.then(() => {
										this.route.navigate(["./../viewLeaveEntitlement"], {
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

	getDesignation(levelId: any) {
		this.designationChanged = true;
		this.designationData = [];
		this.leaveEntitlementService
			.getDesignationSingleUser(levelId)
			.subscribe((res) => {
				this.posts = res;
				let data: any = res;
				for (let key of Object.keys(data["data"])) {
					this.designationData.push(data["data"][key]);
				}
				this.designationChanged = false;
			});
	}

	getDesignation2(levelId: any) {
		this.designationChanged2 = true;
		this.designationData2 = [];
		this.leaveEntitlementService
			.getDesignationSingleUser(levelId)
			.subscribe((res) => {
				this.posts = res;
				let data: any = res;
				for (let key of Object.keys(data["data"])) {
					this.designationData2.push(data["data"][key]);
				}
				this.designationChanged2 = false;
			});
	}

	getAppointType() {
		this.appointType = true;
		this.appointmentType = [];
		this.appTypeLoading = true;
		this.registrationService.getAppointType().subscribe((res: any) => {
			let data: any = res;
			for (let key of Object.keys(data["data"])) {
				this.appointmentType.push(data["data"][key]);
			}
			this.appointType = false;
			this.appTypeLoading = false;
		});
	}

	showhide(lvtype: any) {
		if (lvtype == 6) {
			this.isMedicalLeave = true;
		} else {
			this.isMedicalLeave = false;
		}
	}

	getAppointingAuthority() {
		this.appAuthLoading = true;
		this.appointingAuth = [];
		this.appointmentLoading = true;
		this.registrationService.getAppointingAuthority().subscribe((res: any) => {
			let data: any = res;
			for (let key of Object.keys(data["data"])) {
				this.appointingAuth.push(data["data"][key]);
			}
			this.appointingAuthority = false;
			this.appointmentLoading = false;
		});
	}

	getTeacherAppointment() {
		this.teacherAppointmentChanged = true;
		this.teacherAppointment = [];
		this.appAuthLoading = true;
		this.registrationService.getTeacherAppointment().subscribe((res: any) => {
			let data: any = res;
			for (let key of Object.keys(data["data"])) {
				this.teacherAppointment.push(data["data"][key]);
			}
			this.teacherAppointmentChanged = false;
			this.appAuthLoading = false;
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
