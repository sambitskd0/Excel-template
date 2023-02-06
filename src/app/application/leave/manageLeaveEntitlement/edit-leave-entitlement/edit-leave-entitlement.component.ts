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
	selector: "app-edit-leave-entitlement",
	templateUrl: "./edit-leave-entitlement.component.html",
	styleUrls: ["./edit-leave-entitlement.component.css"],
})
export class EditLeaveEntitlementComponent implements OnInit {
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
	appointingAuthData: any = "";
	appointTypChanged: boolean = false;
	appointmentType: any = "";
	appointmentTypeData: any = "";
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
		"",
		"",
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
	];
	encId: string = "";
	leaveEntData: any;
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
		this.encId = this.router.snapshot.params["encId"];
		this.editProfile(this.encId);
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
			userId:[this.userId],
			profileId:[this.profileId],
			leaveTypeId: [this.leaveTypeId, Validators.required],
			teacherType: [this.teacherType, Validators.required],
			natureOfAppointmt: [this.natureOfAppointmt, Validators.required],
			appointingAuth: [this.appointingAuth, Validators.required],
			appointmentType: [this.appointmentType, Validators.required],
			numberofDays: [this.numberofDays, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
			maxNumberofDays: [this.maxNumberofDays, Validators.pattern(/^[0-9]+$/)],
			entRemarks: [this.entRemarks, Validators.required],
			docRequired: [this.docRequired, Validators.required],
			officeId: [this.officeId, Validators.required],
			ATADesignation: [this.ATADesignation, Validators.required],
			officeId2: [this.officeId2, Validators.required],
			ATADesignation2: [this.ATADesignation2, Validators.required],
			encId: [this.encId],
			
		});
	}

	//updateLeaveEntitlement
	editProfile(encId: string) {
		this.spinner.show();
		this.leaveEntitlementService
			.readLeaveEntitlement(encId)
			.subscribe((res: any) => {
				this.leaveEntData = res.data[0];
				this.encId = this.leaveEntData.encId;
				this.leaveTypeId = this.leaveEntData.leaveTypeId;
				this.teacherType = this.leaveEntData.teacherType;
				this.natureOfAppointmt = this.leaveEntData.natureofAppointment;
				this.appointingAuth = this.leaveEntData.appointingAuthority;
				this.appointmentType = this.leaveEntData.appointmentType;
				this.numberofDays = this.leaveEntData.numberofDays;
				this.maxNumberofDays = this.leaveEntData.maxNumberofDays;
				this.entRemarks = this.leaveEntData.entRemarks;
				this.docRequired = this.leaveEntData.docRequired;

				this.officeId = this.leaveEntData.officeId;
				this.officeId2 = this.leaveEntData.officeId1;

				this.ATADesignation = this.leaveEntData.ATADesignation;
				this.ATADesignation2 = this.leaveEntData.ATADesignation1;

				if (this.leaveTypeId == 6) {
					this.isMedicalLeave = true;
				} else {
					this.isMedicalLeave = false;
				}

				this.getDesignation(this.officeId);
				this.getDesignation2(this.officeId2);

				this.initializeForm();
				this.spinner.hide();
			});
	}
	onCancel() {
		this.route.navigate(["../../viewLeaveEntitlement"], {
			relativeTo: this.router,
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
			if (this.leaveEntForm.controls["maxNumberofDays"]?.value == 0) {
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
				"Please check that 2nd level approval office must be greater than 1st level approval office",
				"error"
			);
			return;
		}

		if (this.leaveEntForm.valid === true) {
			this.alertHelper.submitAlert().then((result: any) => {
				if (result.value) {
					this.spinner.show(); // ==== show spinner
					this.leaveEntitlementService
						.updateLeaveEntitlement(this.leaveEntForm?.getRawValue())
						.subscribe({
							next: (res: any) => {
								this.spinner.hide(); //==== hide spinner
								this.alertHelper
									.successAlert(
										"Saved!",
										"Leave entitlement detail updated successfully.",
										"success"
									)
									.then(() => {
										this.route.navigate(["../../viewLeaveEntitlement"], {
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
		this.appointTypChanged = true;
		this.appointmentTypeData = [];
		this.appTypeLoading = true;
		this.registrationService.getAppointType().subscribe((res: any) => {
			let data: any = res;
			for (let key of Object.keys(data["data"])) {
				this.appointmentTypeData.push(data["data"][key]);
			}
			this.appointTypChanged = false;
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
		this.appointingAuthority = true;
		this.appointingAuthData = [];
		this.appointmentLoading = true;
		this.registrationService.getAppointingAuthority().subscribe((res: any) => {
			let data: any = res;
			for (let key of Object.keys(data["data"])) {
				this.appointingAuthData.push(data["data"][key]);
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
