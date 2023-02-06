import { Component, ElementRef, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { Constant } from "src/app/shared/constants/constant";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { ManageMdmAttendanceService } from "../../services/manage-mdm-attendance.service";

@Component({
  selector: "app-add-mdm-attendance",
  templateUrl: "./add-mdm-attendance.component.html",
  styleUrls: ["./add-mdm-attendance.component.css"],
})
export class AddMdmAttendanceComponent implements OnInit {
  MdmAttendanceForm!: FormGroup;

  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  allLabel: string[] = ["", "", "", "Attendance"];

  studentType: any = "";
  attendance: any = "";

  userId: any = "";
  schoolId: any = "";
  clusterId: any = "";
  schoolCategory: any = "";
  permissionDiv: boolean = false;
  academicYear: any = this.config.getAcademicCurrentYear();
  attendanceLabel: any = "";
  studentTypeLabel: any = "";
  schoolType: any = "";
  schoolTypeData: any = "";
  schoolTypeArr: any = [];
  publicUser: any = "";

  readonly: any = "";
  disable: any = "";

  constructor(
    public customValidators: CustomValidators,
    private formBuilder: FormBuilder,
    private privilegeHelper: PrivilegeHelper, //For menu privilege
    private router: Router,
    private activateRoute:ActivatedRoute,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    public commonService: CommonserviceService,
    private el: ElementRef,
    private attendanceService: ManageMdmAttendanceService
  ) {
    const pageUrl: any = this.router.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl); //For menu privilege
    this.commonService.verifyLinkPermission(
      pageUrl,
      this.config.linkType[2],
      this.config.privilege[4]
    ); // For authorization
  }

  ngOnInit(): void {
    const users = this.commonService.getUserProfile();
    this.publicUser = users;
    if (users.loginUserTypeId == 2) {
      this.schoolId = users?.school;
      this.schoolCategory = users?.schoolCategory;
      this.initializeForm();
      this.checkCategory();
      this.checkTodayEntry();
      this.permissionDiv = true;
    } else {
      this.permissionDiv = false;
    }
  }

  checkTodayEntry() {
    this.attendanceService
      .checkTodayEntry(this.schoolId)
      .subscribe((res: any) => {
        if (res.msg == 1) {
          
          this.readonly = false;
          this.disable = false;
        } else {
          this.alertHelper.viewAlert("error","Invalid","Already attendance created for this date");
          this.readonly = true;
          this.disable = true;
        }
      });
  }

  ngAfterViewInit() {
    if (this.publicUser.loginUserTypeId == 2) {
      this.el.nativeElement
        .querySelector("[formControlName=attendance]")
        .focus();
    }
  }

  checkCategory() {
    this.attendanceService
      .getSchoolCategory(this.schoolCategory)
      .subscribe((res: any) => {
        this.schoolType = res?.data;
        let schoolTypeCheck = ["2"];
        if (this.schoolType.length == 1) {
          this.schoolTypeData = this.schoolType.filter((item: any) => {
            if (schoolTypeCheck.includes(item.schoolType)) {
              this.schoolTypeArr = [{ id: 1, studentType: "Primary" }];
              this.studentTypeLabel = true;
              this.attendanceLabel = false;
            } else {
              this.schoolTypeArr = [{ id: 1, studentType: "upperPrimary" }];
              this.studentTypeLabel = false;
              this.attendanceLabel = true;
            }
          });
        } else {
          this.schoolTypeArr = [{ id: 1, studentType: "upperPrimary" }];
          this.studentTypeLabel = false;
          this.attendanceLabel = true;
        }
      });
  }

  initializeForm() {
    this.MdmAttendanceForm = this.formBuilder.group({
      schoolId: [this.schoolId],
      academicYear: [this.academicYear],
      studentType: [this.schoolCategory, [Validators.required]],
      attendance: [this.attendance, [Validators.required, Validators.pattern('^[0-9.]*$'), Validators.maxLength(3), this.customValidators.firstCharValidatorRF]],
    });
  }
  get mdmAttendanceFormControl() {
    return this.MdmAttendanceForm.controls;
  }

  onSubmit() {
    // if ("INVALID" === this.MdmAttendanceForm.status) {
    //   for (const key of Object.keys(this.MdmAttendanceForm.controls)) {
    //     if (this.MdmAttendanceForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(
    //         this.MdmAttendanceForm,
    //         this.allLabel
    //       );
    //       break;
    //     }
    //   }
    // }
    if (this.MdmAttendanceForm.invalid) {
      this.customValidators.formValidationHandler(this.MdmAttendanceForm,this.allLabel, this.el);
    }
    if (this.MdmAttendanceForm.invalid) {
      return;
    }
    if (this.MdmAttendanceForm.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.attendanceService
            .createAttendance(this.MdmAttendanceForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Mdm Attendance created successfully.",
                    "success"
                  )
                  .then(() => {
                    this.initializeForm();
                    this.router.navigate(['./../viewMdmAttendance'],{
                      relativeTo: this.activateRoute,
                    });
                  });
              },
              error: (error: any) => {
                this.spinner.hide(); //==== hide spinner
              },
            });
        }
        // this.router.navigateByUrl('./../viewMdmAttendance');
      });
    }
  }
}
