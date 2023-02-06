import { formatDate } from "@angular/common";
import { Component, ElementRef, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { SchoolService } from "src/app/application/school/services/school.service";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { Constant } from "src/app/shared/constants/constant";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { ManageGrantInfoService } from "../../services/manage-grant-info.service";
import { ManageGrantReceiveService } from "../../services/manage-grant-receive.service";

@Component({
  selector: "app-add-grant-receive",
  templateUrl: "./add-grant-receive.component.html",
  styleUrls: ["./add-grant-receive.component.css"],
})
export class AddGrantReceiveComponent implements OnInit {
  public permissionForAdd: boolean = false;
  loginUserType: any = "";
  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();
  clusterName: any = "";
  schoolName: any = "";
  blockName: any = "";
  districtName: any = "";
  villageName: any = "";
  schoolUdiseCode: any = "";
  schoolInfoData: any;
  schoolCategory: any = "";
  grantTypeData: any = [];
  grantReceivedFromData: any = [];
  grantTypeLoading: boolean = false;
  submitted: boolean = false;
  adminPrivilege: boolean = false;
  addGrantReceiveForm!: FormGroup;
  schoolId: any = "";
  userId: any = "";
  grantReceiveFrom: any = "";
  grantType: any = "";
  receiveDate: any = "";
  letterNumber: any = "";
  amount: any = "0.00";
  academicYear: any = this.config.getAcademicCurrentYear();
  allLabel: string[] = [
    "",
    "",
    "",
    "",
    "Grant receive from",
    "Grant type",
    "Receive date",
    "Letter No / Ref. No",
    "Amount (₹)",
  ];
  maxDate: any = Date;
  profileId: any = "";
  constructor(
    private commonFunctionHelper: CommonFunctionHelper,
    private schoolService: SchoolService,
    private commonService: CommonserviceService,
    public customValidators: CustomValidators,
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    public manageGrantInfoService: ManageGrantInfoService,
    private privilegeHelper: PrivilegeHelper, //For menu privilege
    private router: Router,
    public manageGrantReceiveService: ManageGrantReceiveService,
    private el: ElementRef,
  ) {
    const pageUrl: any = this.router.url;
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
    const userProfile = this.commonService.getUserProfile();
    this.schoolId = userProfile?.school;
    this.userId = userProfile?.userId;
    this.profileId = userProfile?.profileId;
    this.schoolCategory = userProfile?.schoolCategory;
    this.loginUserType = userProfile?.loginUserType;
    if (this.loginUserType == "SCHOOL") {
      this.permissionForAdd = true;
      this.getGrantName(this.schoolCategory);
    } else {
      this.permissionForAdd = false;
    }
    if (this.schoolId !== 0 && this.schoolId !== "") {
      this.getSchoolInfo(this.schoolId, this.academicYear);
    }
    this.grantReceivedFrom();
    this.initializeform();
   
  }
  ngAfterViewInit() {
    this.el.nativeElement.querySelector("[formControlName=grantReceiveFrom]").focus();
  }
  getSchoolInfo(schoolId: any, academicYear: any) {
    this.spinner.show();
    this.schoolService
      .getSchoolInfo(schoolId, academicYear)
      .subscribe((res: any) => {
        this.schoolInfoData = res.data[0];
        this.districtName = this.schoolInfoData?.districtName;
        this.blockName = this.schoolInfoData?.blockName;
        this.clusterName = this.schoolInfoData?.clusterName;
        this.villageName = this.schoolInfoData?.villageName;
        this.schoolName = this.schoolInfoData?.schoolName;
        this.schoolUdiseCode = this.schoolInfoData?.schoolUdiseCode;
        this.spinner.hide();
      });
  }
  initializeform() {
    this.addGrantReceiveForm = this.formBuilder.group({
      userId: [this.userId],
      profileId: [this.profileId],
      schoolId: [this.schoolId],
      academicYear: [this.academicYear],
      grantReceiveFrom: [this.grantReceiveFrom, [Validators.required]],
      grantType: [this.grantType, [Validators.required]],
      receiveDate: [this.receiveDate, [Validators.required]],
      letterNumber: [
        this.letterNumber,
        [Validators.required, Validators.maxLength(30),this.customValidators.firstCharValidatorRF],
      ],
      amount: [
        this.amount,
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.min(1),
          Validators.max(9999999.99),
          Validators.pattern(/^\d{0,7}(\.\d{1,2})?$/),
        ],
      ],
    });
  }
  getGrantName(schoolCategory: any) {
    this.spinner.show();
    this.grantTypeLoading = true;
    this.manageGrantInfoService
      .getGrantName(schoolCategory)
      .subscribe((res: any) => {
        this.grantTypeData = res;
        this.grantTypeData = this.grantTypeData.data;
        this.spinner.hide();
        this.grantTypeLoading = false;
      });
  }
  grantReceivedFrom() {
    this.commonService
      .getCommonAnnexture(["Grant_Recieve_From_Type"])
      .subscribe((data: any = []) => {
        //this.grantReceivedFromData = data?.data?.Grant_Recieve_From_Type;
        this.grantReceivedFromData = data?.data?.Grant_Recieve_From_Type.sort(
          (a: any, b: any) =>
            a.anxtName.toLowerCase() < b.anxtName.toLowerCase()
              ? -1
              : b.anxtName.toLowerCase() > a.anxtName.toLowerCase()
              ? 1
              : 0
        );
      });
  }
  dateValidation() {
    let receiveDate = this.addGrantReceiveForm.controls["receiveDate"].value;
    const newDate = new Date();
    if (
      formatDate(receiveDate, "yyyy-MM-dd", "en_US") >
      formatDate(newDate, "yyyy-MM-dd", "en_US")
    ) {
      this.alertHelper.viewAlert(
        "error",
        "Invalid",
        "Date must not be above today's date"
      );
      this.addGrantReceiveForm.patchValue({
        receiveDate: "",
      });
    }
  }
  onSubmit() {
    this.submitted = true;
    // if ("INVALID" === this.addGrantReceiveForm.status) {
    //   for (const key of Object.keys(this.addGrantReceiveForm.controls)) {
    //     if (this.addGrantReceiveForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(
    //         this.addGrantReceiveForm,
    //         this.allLabel
    //       );
    //       break;
    //     }
    //   }
    // }
    if (this.addGrantReceiveForm.invalid) {
      // this.customValidators.formValidationHandler(this.addGrantReceiveForm, this.allLabel, this.el);
      this.customValidators.formValidationHandler(
        this.addGrantReceiveForm,
        this.allLabel,
        this.el,
        {
          required: {
            grantReceiveFrom: "Please select grant received from",
            grantType: "Please select grant type",
            receiveDate: "Please enter Ggant receive date",
            letterNumber: "Please enter letter no. / reference no.",
            amount: "Please enter valid grant amount ",
          },
        }
      );
    }
    if (this.addGrantReceiveForm.valid == true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          let receiveDateStr =  this.commonFunctionHelper.formatDateHelper(this.addGrantReceiveForm.get("receiveDate")?.value);
          this.addGrantReceiveForm.patchValue({
            receiveDate: receiveDateStr,
          });
          this.manageGrantReceiveService
            .addGrantReceive(this.addGrantReceiveForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Grant receive created successfully.",
                    "success"
                  )
                  .then(() => {
                    this.initializeform();
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
}
