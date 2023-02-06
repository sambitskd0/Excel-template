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
import { ManageLeaveApplyService } from "../../services/manage-leave-apply.service";
import { ManageLeaveTypeService } from "../../services/manage-leave-type.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { NgxSpinnerService } from "ngx-spinner";
import { RegistrationService } from "../../../teacher/services/registration.service";
import { ManageProfileService } from "../../../user/services/manage-profile.service";
import { formatDate } from "@angular/common";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";

@Component({
	selector: "app-add-leave-apply",
	templateUrl: "./add-leave-apply.component.html",
	styleUrls: ["./add-leave-apply.component.css"],
})
export class AddLeaveApplyComponent implements OnInit, AfterViewInit {
	maxDate: any = Date;

	optionLeave: any;
	public userProfile = JSON.parse(
		sessionStorage.getItem("userProfile") || "{}"
	);
	leaveTypeChanged: boolean = false;
	leaveApplyForm!: FormGroup;
	allErrorMessages: string[] = [];
	submitted = false;
	showClear: boolean = false;
	posts: any;
	lvtype: any = "";
	teacherId: number = 0;
	leaveTypeId: number = 0;
	leaveFromDate: string = "";
	leaveFromDtType: number = 1;
	leaveToDate: string = "";
	leaveToDtType: number = 1;
	noOfDaysApplied: number = 0;
	lvDocument: string = "";
	lvReason: string = "";
	radioSelfOther: number = 1;
	teacherImageChange: boolean = false;
	lvdocRequired: boolean = false;
	fileToUploadTeacher: any = "";
	lvDataData: any = [];
	ifHMLogin: boolean = true;
	leaveModeChanged: boolean = true;
	leaveEntitled: number = 0;
	leaveApplied: number = 0;
	leaveGranted: number = 0;
	leaveBalance: number = 0;
	lifeTimeBalance: string = "NA";
	schoolId: number = 0;
	allLabel: string[] = [
		"Select Type",
		"Name of person",
		"Leave type",
		"Leave From date",
		"Leave From date day type",
		"Leave To date",
		"Leave To date day type",
		"No. of days applied",
		"Upload document",
		"Reason",
	];
	teacherList: any = "";
	leaveTypeLoading: boolean = false;
	personLoading: boolean = false;
	plPrivilege: string = "view"; //For menu privilege
	config = new Constant();
	adminPrivilege: boolean = false;
	dobSubscription!: any;
	dobSubscription1!: any;
	userId:any="";
	constructor(
		private formBuilder: FormBuilder,
		private alertHelper: AlertHelper,
		public customValidators: CustomValidators,
		private spinner: NgxSpinnerService,
		private commonService: CommonserviceService,
		private ManageLeaveApplyService: ManageLeaveApplyService,
		private privilegeHelper: PrivilegeHelper, //For menu privilege
		private route: Router,
		private router: ActivatedRoute,
		private leaveTypeService: ManageLeaveTypeService,
		private registrationService: RegistrationService,
		private profileService: ManageProfileService,
		private el: ElementRef,
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
		if (this.plPrivilege == "admin") {
			this.adminPrivilege = true;
		}
		const users = this.commonService.getUserProfile();
		this.userId = users?.userId;

		this.initializeForm();
		this.getLeaveType();
		this.onChangeOfDates();

		if (
			this.userProfile.designationId == 1 ||
			this.userProfile.designationId == 6
		) {
			this.ifHMLogin = false;
		} else {
			this.ifHMLogin = true;
		}
		this.getTeachersList(this.userId);
		this.el.nativeElement.querySelector("[formControlName=teacherId]").focus();
	}
	onChangeOfDates() {
		this.dobSubscription = this.leaveApplyForm
			?.get("leaveFromDate")
			?.valueChanges.subscribe((value: any) => {
				this.calculateDays();
			});
		this.dobSubscription1 = this.leaveApplyForm
			?.get("leaveToDate")
			?.valueChanges.subscribe((value: any) => {
				this.calculateDays();
			});
	}
	ngAfterViewInit(): void {
		this.maxDate = new Date();
	}
	initializeForm() {
		this.leaveApplyForm = this.formBuilder.group({
			radioSelfOther: [this.radioSelfOther],
			teacherId: ["", Validators.required],
			leaveTypeId: ["", Validators.required],
			leaveFromDate: [this.leaveFromDate, Validators.required],
			leaveFromDtType: [this.leaveFromDtType, Validators.required],
			leaveToDate: [this.leaveToDate, Validators.required],
			leaveToDtType: [this.leaveToDtType, Validators.required],
			noOfDaysApplied: [this.noOfDaysApplied, Validators.required],
			lvDocument: [this.lvDocument],
			lvReason: [
				"",
				[
					Validators.required,
					Validators.maxLength(400),
					Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/),
					this.customValidators.firstCharValidatorRF,
				],
			],
			fileSource: [""],
		});
	}

	clearFile() {
		this.leaveApplyForm.patchValue({ lvDocument: "" });
		this.showClear = false;
	}

	getFormValue(allValue: any) {
		return {
			...allValue,
			leaveFromDate: this.commonFunctionHelper.formatDateHelper(
				allValue?.leaveFromDate
			),
			leaveToDate: this.commonFunctionHelper.formatDateHelper(
				allValue?.leaveToDate
			),
		};
	}
	onSubmit() {
		this.submitted = true;
		// this.customValidators.formValidationHandler(
		// 	this.leaveApplyForm,
		// 	this.allLabel,
		// 	this.el
		// );
		this.customValidators.formValidationHandler(
			this.leaveApplyForm,
			this.allLabel,
			this.el,
			{
			  required: {
				teacherId: "Please provide name of the person",
				leaveTypeId: "Please select leave type",
				leaveFromDate: "Please enter leave start date",
				leaveToDate: "Please enter leave end date",
				lvReason: "Please enter leave reason",
			  },
			}
		  );

		let leaveFromDate = this.leaveApplyForm.controls["leaveFromDate"].value;
		let leaveToDate = this.leaveApplyForm.controls["leaveToDate"].value;

		if (leaveFromDate != "" && leaveToDate != "") {
			if (
				formatDate(leaveToDate, "yyyy-MM-dd", "en_US") <
				formatDate(leaveFromDate, "yyyy-MM-dd", "en_US")
			) {
				const invalidControl = this.el.nativeElement.querySelector(
					'[formControlName="leaveToDate"]'
				);
				invalidControl.focus();
				this.alertHelper.viewAlert(
					"error",
					"Invalid",
					"Leave To date should not be smaller than leave from date"
				);
				this.leaveApplyForm.patchValue({
					leaveToDate: "",
				});
			}
		}

		if (this.leaveApplyForm.controls["noOfDaysApplied"]?.value < 0) {
			const invalidControl = this.el.nativeElement.querySelector(
				'[formControlName="noOfDaysApplied"]'
			);
			invalidControl.focus();
			this.alertHelper.successAlert(
				"Invalid",
				"No. of days applied should be grater than zero",
				"error"
			);
			return;
		}

		if (
			this.leaveBalance < this.leaveApplyForm.controls["noOfDaysApplied"]?.value
		) {
			const invalidControl = this.el.nativeElement.querySelector(
				'[formControlName="noOfDaysApplied"]'
			);
			invalidControl.focus();
			this.alertHelper.successAlert(
				"Invalid",
				"The number of remaining leaves is not sufficient for this leave type. Please also check the leaves waiting for validation. ",
				"error"
			);
			return;
		}

		if (
			this.leaveApplyForm.controls["leaveTypeId"]?.value == 7 &&
			this.leaveApplyForm.controls["noOfDaysApplied"]?.value > 2
		) {
			const invalidControl = this.el.nativeElement.querySelector(
				'[formControlName="noOfDaysApplied"]'
			);
			invalidControl.focus();
			this.alertHelper.successAlert(
				"Invalid",
				"Special leave (female) can not be applied more than 2 days",
				"error"
			);
			return;
		}

		if (this.leaveApplyForm.valid === true) {
			this.alertHelper.submitAlert().then((result: any) => {
				if (result.value) {
					const allValue = this.leaveApplyForm.value;
					this.spinner.show(); // ==== show spinner
					this.ManageLeaveApplyService.createLeaveApply(
						this.getFormValue(allValue)
					).subscribe({
						next: (res: any) => {
							this.spinner.hide(); //==== hide spinner
							this.alertHelper
								.successAlert(
									"Saved!",
									"Leave applied successfully.",
									"success"
								)
								.then(() => {
									this.route.navigate(["./../viewLeaveApply"], {
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
		this.teacherId = this.leaveApplyForm.controls["teacherId"].value;
		this.leaveTypeId = this.leaveApplyForm.controls["leaveTypeId"].value;

		if (this.teacherId > 0 && this.leaveTypeId > 0) {
			this.ManageLeaveApplyService.getLeaveBalance(
				this.leaveTypeId,
				this.teacherId
			).subscribe((res: any) => {
				if (res.data.length === 0) {
					this.leaveEntitled = 0;
					this.leaveApplied = 0;
					this.leaveGranted = 0;
					this.leaveBalance = 0;
					this.lifeTimeBalance = "NA";
					this.alertHelper.successAlert(
						"Invalid",
						"Leave not entitled yet for this leave type, Please contact administrator",
						"error"
					);
					return;
				} else {
					this.lvDataData = res.data[0];
					this.leaveEntitled = this.lvDataData.leaveEntitled;
					this.leaveApplied = this.lvDataData.leaveApplied;
					this.leaveGranted = this.lvDataData.leaveGranted;
					this.leaveBalance = this.lvDataData.leaveBalance;
					if (this.leaveTypeId == 6) {
						//noOfTimesLeaveBalance
						this.lifeTimeBalance = this.lvDataData.lifeTimeBalance;
					} else if (
						this.leaveTypeId == 5 ||
						this.leaveTypeId == 10 ||
						this.leaveTypeId == 11
					) {
						if (this.lvDataData.noOfTimesLeaveBalance == 1) {
							this.lifeTimeBalance = "Once";
						} else if (this.lvDataData.noOfTimesLeaveBalance == 2) {
							this.lifeTimeBalance = "Twice";
						} else {
							this.lifeTimeBalance = "0";
						}
					} else {
						this.lifeTimeBalance = "NA";
					}

					if (this.lvDataData.docRequired == 1) {
						this.lvdocRequired = true;
					} else {
						this.lvdocRequired = false;
					}
				}
			});
		} else {
			this.leaveEntitled = 0;
			this.leaveApplied = 0;
			this.leaveGranted = 0;
			this.leaveBalance = 0;
		}
	}

	calculateDays() {
		let leaveFromDt = new Date(
			this.leaveApplyForm.controls["leaveFromDate"].value
		);
		let leaveToDt = new Date(this.leaveApplyForm.controls["leaveToDate"].value);

		let lvFromDtType = this.leaveApplyForm.controls["leaveFromDtType"].value;
		let lvToDtType = this.leaveApplyForm.controls["leaveToDtType"].value;

		if (
			this.leaveApplyForm.controls["leaveFromDate"]?.value != "" &&
			this.leaveApplyForm.controls["leaveToDate"]?.value != ""
		) {
			let totDays = Math.floor(
				(Date.UTC(
					leaveToDt.getFullYear(),
					leaveToDt.getMonth(),
					leaveToDt.getDate()
				) -
					Date.UTC(
						leaveFromDt.getFullYear(),
						leaveFromDt.getMonth(),
						leaveFromDt.getDate()
					)) /
					(1000 * 60 * 60 * 24)
			);
			let dtdiff = totDays;

			if (lvFromDtType == 1 && lvToDtType == 1) {
				totDays = totDays + 1;
			} else if (lvFromDtType > 1 && lvToDtType > 1) {
				if (dtdiff > 0) {
					totDays = totDays;
				} else {
					totDays = totDays + 0.5;
				}
			} else if (lvFromDtType > 1 || lvToDtType > 1) {
				totDays = totDays + 0.5;
			}
			this.noOfDaysApplied = totDays;
		} else {
			this.noOfDaysApplied = 0;
		}
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

	loadTchList(lvMode: any) {
		if (lvMode == 1) {
			this.getTeachersList(this.userId);
		} else {
			this.getTeachersList(0);
		}
	}

	getTeachersList(teaherId: any) {
		this.leaveModeChanged = true;
		this.schoolId = this.userProfile.school;
		this.teacherList = [];
		this.personLoading = true;
		this.ManageLeaveApplyService.getTeachersList(
			this.schoolId,
			teaherId,
			0
		).subscribe((res: any) => {
			let data: any = res;
			for (let key of Object.keys(data["data"])) {
				this.teacherList.push(data["data"][key]);
			}
			this.leaveModeChanged = false;
			this.personLoading = false;
		});
	}

	handleFileInputTeacher(e: any) {
		let file = e.target.files;
		this.teacherImageChange = true;
		if (this.teacherImageChange == true) {
			this.leaveApplyForm.controls["lvDocument"].setValidators([
				Validators.required,
			]);
			this.leaveApplyForm.controls["lvDocument"].updateValueAndValidity();
		}

		var ext = file[0].name.substring(file[0].name.lastIndexOf(".") + 1);

		if (
			ext == "pdf" ||
			ext == "jpg" ||
			ext == "png" ||
			ext == "jpeg" ||
			ext == "PDF" ||
			ext == "JPG" ||
			ext == "PNG" ||
			ext == "JPEG"
		) {
			const fileSize = file[0].size;

			const fileSizeInKB = Math.round(fileSize / 1024);
			if (fileSizeInKB > 2048) {
				this.alertHelper.viewAlert(
					"error",
					"Invalid",
					"Upload document must be 2MB"
				);
				this.leaveApplyForm.patchValue({
					lvDocument: "",
				});
				return;
			} else {
				this.fileToUploadTeacher = file.item(0);
				//Show image preview
				let reader = new FileReader();
				reader.onload = (event: any) => {
					this.leaveApplyForm.patchValue({
						fileSource: event.target.result,
					});
				};
				reader.readAsDataURL(this.fileToUploadTeacher);
				this.showClear = true;
			}
		} else {
			this.alertHelper.viewAlert("error", "Invalid", "Inavlid file format");
			this.leaveApplyForm.patchValue({
				fileSource: "",
				lvDocument: "",
			});
		}
	}
}
