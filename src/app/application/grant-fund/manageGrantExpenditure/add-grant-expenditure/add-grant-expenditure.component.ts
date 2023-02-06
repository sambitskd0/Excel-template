import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SchoolService } from 'src/app/application/school/services/school.service';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CommonFunctionHelper } from 'src/app/core/helpers/common-function-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { environment } from 'src/environments/environment';
import { ManageGrantExpenditureService } from '../../services/manage-grant-expenditure.service';
import { ManageGrantInfoService } from '../../services/manage-grant-info.service';

@Component({
  selector: "app-add-grant-expenditure",
  templateUrl: "./add-grant-expenditure.component.html",
  styleUrls: ["./add-grant-expenditure.component.css"],
})
export class AddGrantExpenditureComponent implements OnInit {
  private apiURL = environment.grantAPI;
  public permissionForAdd: boolean = false;
  
  loginUserType: any = "";
  plPrivilege:string="view"; //For menu privilege
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
  grantExpenditureTypeData: any = [];
  grantBalanceData: any = [];
  grantTypeLoading: boolean = false;
  submitted: boolean = false;
  adminPrivilege: boolean = false;
  addGrantExpenditureForm!: FormGroup;
  schoolId: any = "";
  userId: any = "";
  grantType: any = "";
  expenditureType: any = "";
  expenditureDate: any = "";
  invoiceImage: any = "";
  amount: any = "0.00";
  balance: any = "";
  description: any = "";
  totalAmount: any = "";
  academicYear: any = this.config.getAcademicCurrentYear();
  allLabel: string[] = [
    "",
    "",
    "",
    "",
    "Grant type",
    "Expenditure type",
    "Expenditure date",
    "Amount (₹)",
    "Balance",
    "Invoice",
    "Description",
  ];
  maxDate: any = Date;
  minDate: any = Date;
  grantRcvDate: any = "";
  profileId: any = "";
  constructor(
    private commonFunctionHelper: CommonFunctionHelper,
    private schoolService: SchoolService,
    private commonService: CommonserviceService,
    public customValidators: CustomValidators,
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private spinner: NgxSpinnerService,
    public manageGrantInfoService: ManageGrantInfoService,
    public manageGrantExpenditureService: ManageGrantExpenditureService,
    private el: ElementRef,
    private router: ActivatedRoute,
    private route: Router,
  ) {
    const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For authorization
    this.maxDate = new Date();
    this.minDate = new Date();
   }
  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
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
    this.grantExpenditureType();
    this.initializeform();
    
  }
  ngAfterViewInit() {
    this.el.nativeElement.querySelector("[formControlName=grantType]").focus();
  }
  initializeform() {
    this.addGrantExpenditureForm = this.formBuilder.group({
      userId: [this.userId],
      profileId: [this.profileId],
      schoolId: [this.schoolId],
      academicYear: [this.academicYear],
      grantType: [this.grantType, [Validators.required]],
      expenditureType: [this.expenditureType, [Validators.required]],
      expenditureDate: [this.expenditureDate, [Validators.required]],
      amount: [
        this.amount,
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern(/^\d{0,7}(\.\d{1,2})?$/),
          Validators.min(1),
          Validators.max(9999999.99)
        ],
      ],
      balance: [this.balance],
      invoiceImage: [this.invoiceImage, [Validators.required]],
      description: [
        this.description,
        [Validators.required, Validators.maxLength(500),this.customValidators.firstCharValidatorRF],
      ],
    });
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
  grantExpenditureType() {
    this.manageGrantExpenditureService
      .grantExpenditureType()
      .subscribe((data: any = []) => {
        this.grantExpenditureTypeData = data?.data;
      });
  }
  grantTypeChange(val: any) {
    this.addGrantExpenditureForm.patchValue({
      balance: "",
    });
    this.grantType = val;
    if (this.grantType !== "") {
      this.getBalance(this.grantType, this.schoolId, this.academicYear);
      this.getGrantReceiveDate(this.grantType, this.schoolId, this.academicYear);
    }
  }
  getGrantReceiveDate(grantType: any, schoolId: any, academicYear: any){
    this.manageGrantExpenditureService
      .getGrantReceiveDate(grantType, schoolId, academicYear)
      .subscribe((res: any) => {
         this.grantRcvDate = new Date(
          res.data['receivedDate']?.toString()
        );
         this.minDate=this.grantRcvDate;
      });
  }
  getBalance(grantType: any, schoolId: any, academicYear: any) {
    this.grantTypeLoading = true;
    this.manageGrantExpenditureService
      .getBalance(grantType, schoolId, academicYear)
      .subscribe((res: any) => {
        this.grantBalanceData = res;
        this.grantBalanceData = this.grantBalanceData.data[0];
        this.totalAmount = this.grantBalanceData.totalAmount;
        this.addGrantExpenditureForm.patchValue({
          balance: (this.totalAmount).toFixed(2),
        });
        this.spinner.hide();
        this.grantTypeLoading = false;
      });
  }
  checkBalance(balance: any, amount: any) {
    let mlc =
      this.addGrantExpenditureForm.get(balance)?.value > 0
        ? parseFloat(this.addGrantExpenditureForm.get(balance)?.value)
        : 0;
    let cc =
      this.addGrantExpenditureForm.get(amount)?.value > 0
        ? parseFloat(this.addGrantExpenditureForm.get(amount)?.value)
        : 0;
    if (cc > mlc) {
      this.alertHelper
        .viewAlertHtml(
          "error",
          "Invalid inputs",
          "Expenditure amount can not exceed the balance"
        )
        .then((res: any) => {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + amount + '"]'
          );
          this.addGrantExpenditureForm.get(amount)?.patchValue("");
          invalidControl.focus();
        });
    }
  }
  greaterThanZero(event: any) {
    if (event != "") {
      const amount = event;
      if (amount == 0) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          `Amount must be greater than 0.`
        );
        this.addGrantExpenditureForm.patchValue({
          amount: "",
        });
        return;
      }
    }
  }
  fileUploadHandler(event: any) {
    const grantInvoice = event.target.files[0];
    if (grantInvoice != null) {
      if (
        grantInvoice.type != "image/png" &&
        grantInvoice.type != "image/jpg" &&
        grantInvoice.type != "image/jpeg" &&
        grantInvoice.type != "application/pdf"
      ) {
        this.alertHelper.viewAlertHtml(
          "error",
          "Error",
          '<i class="bi bi-arrow-right text-danger"></i> File type should be png, jpg, jpeg or pdf file'
        );
        this.addGrantExpenditureForm.patchValue({ invoiceImage: "" });
        return;
      }
      if (grantInvoice.size >= 1024 * 1024 * 2) {
        this.alertHelper.viewAlertHtml(
          "error",
          "Error",
          '<i class="bi bi-arrow-right text-danger"></i> File size should not be greater than 2 MB'
        );
        this.addGrantExpenditureForm.patchValue({ invoiceImage: "" });
        return;
      }

      this.invoiceImage = event.target.files[0];
    }
  }
  dateValidation() {
    let expenditureDate =
      this.addGrantExpenditureForm.controls["expenditureDate"].value;
    const newDate = new Date();
    if (
      formatDate(expenditureDate, "yyyy-MM-dd", "en_US") >
      formatDate(newDate, "yyyy-MM-dd", "en_US")
    ) {
      this.alertHelper.viewAlert(
        "error",
        "Invalid",
        "Date must not be above today's date"
      );
      this.addGrantExpenditureForm.patchValue({
        expenditureDate: "",
      });
    }
  }
  onSubmit() {
    // if ("INVALID" === this.addGrantExpenditureForm.status) {
    //   for (const key of Object.keys(this.addGrantExpenditureForm.controls)) {
    //     if (this.addGrantExpenditureForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(
    //         this.addGrantExpenditureForm,
    //         this.allLabel
    //       );
    //       break;
    //     }
    //   }
    // }
    if (this.addGrantExpenditureForm.invalid) {
      // this.customValidators.formValidationHandler(this.addGrantExpenditureForm, this.allLabel, this.el);
      this.customValidators.formValidationHandler(
        this.addGrantExpenditureForm,
        this.allLabel,
        this.el,
        {
          required: {
            grantType: "Please select grant type",
            expenditureType: "Please enter expenditure type",
            expenditureDate: "Please enter expenditure date",
            amount: "Please enter valid expenditure amount",
            invoiceImage: "Please upload invoice",
            description: "Please enter description",
          },
        }
      );
    }
    if (this.addGrantExpenditureForm.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          const formData = new FormData();
          formData.append("userId", this.userId);
          formData.append("schoolId", this.schoolId);
          formData.append("academicYear", this.academicYear);
          formData.append(
            "grantType",
            this.addGrantExpenditureForm.get("grantType")?.value
          );
          formData.append(
            "expenditureType",
            this.addGrantExpenditureForm.get("expenditureType")?.value
          );
          formData.append(
            "expenditureDate",
            this.commonFunctionHelper.formatDateHelper(
              this.addGrantExpenditureForm.get("expenditureDate")?.value
            ),
            
          );
          formData.append(
            "balance",
            this.addGrantExpenditureForm.get("balance")?.value
          );
          formData.append(
            "amount",
            this.addGrantExpenditureForm.get("amount")?.value
          );
          formData.append(
            "description",
            this.addGrantExpenditureForm.get("description")?.value
          );
          formData.append("invoiceImage", this.invoiceImage);
          //console.log(formData);
          this.manageGrantExpenditureService
          .addGrantExpendeture(formData)
          .subscribe({
            next: (res: any) => {
              this.spinner.hide();
              this.alertHelper
                .successAlert(
                  "Saved!",
                  "Expenditure details saved successfully",
                  "success"
                )
                .then(() => {
                  this.addGrantExpenditureForm.patchValue({
                    invoiceImage: "",
                  });
                  this.route.navigate(["./../viewGrantExpenditure"], {
                    relativeTo: this.router,
                  });
                  this.initializeform();
                });
            },
            error: (error: any) => {
              this.spinner.hide(); //==== hide spinner
            },
          });
        }
      });
    }
  }
}
