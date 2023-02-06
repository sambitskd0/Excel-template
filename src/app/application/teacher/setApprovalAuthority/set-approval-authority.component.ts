import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { SetApprovalAuthorityService } from "../../teacher/services/set-approval-authority.service";
import { ManageLeaveTypeService } from "../../leave/services/manage-leave-type.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { NgxSpinnerService } from "ngx-spinner";
import { RegistrationService } from "../../teacher/services/registration.service";
import { ManageProfileService } from "../../user/services/manage-profile.service";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { empty } from "rxjs";

@Component({
  selector: 'app-set-approval-authority',
  templateUrl: './set-approval-authority.component.html',
  styleUrls: ['./set-approval-authority.component.css']
})
export class SetApprovalAuthorityComponent implements OnInit {
	approvalAuthForm!: FormGroup;
	allErrorMessages: string[] = [];
	submitted = false;
	posts: any;	
	designationChanged: boolean = false;
	designationData: any = [];
	designationData2: any = [];
	designationChanged2: boolean = false;
  	designationData3: any = [];
  	designationChanged3: boolean = false;	
	officeId: number = 0;
	officeId2: number = 0;
	officeId3: number = 0;
	ATADesignation: number = 0;
	ATADesignation2: number = 0;
  	ATADesignation3: number = 0;
  	ApprovalAuthorityData: any;
  	edit: boolean = false;
	allLabel: string[] = [
		"Office of 1st level approval",
		"Approval authority of 1st level approval",
		"Office of 2nd level approval",
		"Approval authority of 2nd level approval",
    "Office of 3rd level approval",
		"Approval authority of 3rd level approval",
	];
	plPrivilege: string = "view"; //For menu privilege
	config = new Constant();
	adminPrivilege: boolean = false;
	constructor(
		private formBuilder: FormBuilder,
		private alertHelper: AlertHelper,
		public customValidators: CustomValidators,
		private spinner: NgxSpinnerService,
		private commonService: CommonserviceService,
		private setApprovalAuthorityService: SetApprovalAuthorityService,
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
		this.editProfile();
		this.initializeForm();		
	}
	editProfile() {
		this.setApprovalAuthorityService
			.readApprovalAuthority()
			.subscribe((res: any) => {
				this.ApprovalAuthorityData = res.data[0];
				
				this.officeId = this.ApprovalAuthorityData.officeId;
				this.officeId2 = this.ApprovalAuthorityData.officeId1;
				this.officeId3 = this.ApprovalAuthorityData.officeId2 ? this.ApprovalAuthorityData.officeId2 : '';

				this.ATADesignation = this.ApprovalAuthorityData.ATADesignation;
				this.ATADesignation2 = this.ApprovalAuthorityData.ATADesignation1;
				this.ATADesignation3= this.ApprovalAuthorityData.ATADesignation2 ? this.ApprovalAuthorityData.ATADesignation2 : '';

				this.getDesignation(this.officeId);
				this.getDesignation2(this.officeId2);
				this.getDesignation3(this.officeId3);
				this.edit = this.ApprovalAuthorityData.edit;
				if(this.edit===true){
					this.initializeUpdateForm();
				}else{
					this.initializeForm();
				}
				
				this.spinner.hide();
			});
	}
	initializeForm() {
		this.approvalAuthForm = this.formBuilder.group({
			officeId: ["", Validators.required],
			ATADesignation: ["", Validators.required],
			officeId2: ["", Validators.required],
			ATADesignation2: ["", Validators.required],
            officeId3: [""],
			ATADesignation3: [""],
		});
	}

	initializeUpdateForm() {
		this.approvalAuthForm = this.formBuilder.group({
			officeId: [this.officeId, Validators.required],
			ATADesignation: [this.ATADesignation, Validators.required],
			officeId2: [this.officeId2, Validators.required],
			ATADesignation2: [this.ATADesignation2, Validators.required],
            officeId3: [this.officeId3 ? this.officeId3 : ''],
			ATADesignation3: [this.ATADesignation3 ? this.ATADesignation3 : ''],
		});
	}

	onSubmit() {
		this.submitted = true;
		this.customValidators.formValidationHandler(
			this.approvalAuthForm,
			this.allLabel,
			this.el
		);		
		if (
			this.approvalAuthForm.controls["officeId"]?.value >=
				this.approvalAuthForm.controls["officeId2"]?.value &&
			this.approvalAuthForm.controls["officeId2"]?.value > 0
		) {
			const invalidControl = this.el.nativeElement.querySelector(
				'[formControlName="officeId2"]'
			);
			invalidControl.focus();
			this.alertHelper.successAlert(
				"Invalid",
				"Office of 2nd level approval should be higher than 1st",
				"error"
			);
			return;
		}
    if (
			this.approvalAuthForm.controls["officeId2"]?.value >=
				this.approvalAuthForm.controls["officeId3"]?.value &&
			this.approvalAuthForm.controls["officeId3"]?.value > 0
		) {
			const invalidControl = this.el.nativeElement.querySelector(
				'[formControlName="officeId3"]'
			);
			invalidControl.focus();
			this.alertHelper.successAlert(
				"Invalid",
				"Office of 3rd level approval should be higher than 2nd",
				"error"
			);
			return;
		}

		if (this.approvalAuthForm.valid === true) {
			this.alertHelper.submitAlert().then((result: any) => {
				if (result.value) {
					this.spinner.show(); // ==== show spinner
					this.setApprovalAuthorityService
						.setApprovalAuthority(this.approvalAuthForm?.getRawValue())
						.subscribe({
							next: (res: any) => {
								this.spinner.hide(); //==== hide spinner
								if(this.edit === true){
									this.alertHelper
									.successAlert(
										"Saved!",
										"Approved Authority Updated Successfully.",
										"success"
									)
									.then(() => {
										this.route.navigate(["./../setApprovalAuthority"], {
											relativeTo: this.router,
										});
									});									
								}else{
									this.alertHelper
									.successAlert(
										"Saved!",
										"Set Approved Authority Successfully.",
										"success"
									)
									.then(() => {
										this.route.navigate(["./../setApprovalAuthority"], {
											relativeTo: this.router,
										});
									});
								}
								this.edit = true;								
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
		this.setApprovalAuthorityService
			.getDesignationSingleUser(levelId)
			.subscribe((res) => {
				console.log(res);
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
		this.setApprovalAuthorityService
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

	getDesignation3(levelId: any) {
		this.designationChanged3 = true;
		this.designationData3 = [];
		this.setApprovalAuthorityService
			.getDesignationSingleUser(levelId)
			.subscribe((res) => {
				this.posts = res;
				let data: any = res;
				for (let key of Object.keys(data["data"])) {
					this.designationData3.push(data["data"][key]);
				}
				this.designationChanged3 = false;
			});
	}
}