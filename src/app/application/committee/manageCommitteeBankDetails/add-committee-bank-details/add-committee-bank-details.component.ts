import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { CommitteeBankDetailsService } from '../../services/committee-bank-details.service';
import { CommitteeMemberService } from '../../services/committee-member.service';
import { formatDate } from '@angular/common';
import { Constant } from 'src/app/shared/constants/constant';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonFunctionHelper } from 'src/app/core/helpers/common-function-helper';

@Component({
  selector: 'app-add-committee-bank-details',
  templateUrl: './add-committee-bank-details.component.html',
  styleUrls: ['./add-committee-bank-details.component.css']
})
export class AddCommitteeBankDetailsComponent implements OnInit {

  addReconBankDetails!: FormGroup;
  committeeTypeData: any = "";
  memberTypeData: any = "";


  //FORMCONTROLER NAME VARIABLES

  reconstitutionDate: any = "";
  committeeExpireDate: any = "";
  reconstitutionDatestr: any = "";
  committeeExpireDatestr: any = "";

  accHolderName: any = "";
  bankName: any = "";
  otherbankName: any = "";
  bankAccNo: any = "";
  bankIFSC: any = "";
  committeeType: any = "";
  bankData: any = "";
  schoolId: any = "";
  userId: any = "";
  profileId: any = "";
  schoolCategory: any = "";
  schoolTypeData: any = "";
  reconstitutionDateStr = "";
  committeeExpireDateStr = "";

  divshow: boolean = false;
  permissionDiv: boolean = false;
  adminPrivilege: boolean = false;

  allErrorMessages: string[] = [];
  schoolTypeCommitteArr: any = [];
  schoolType: any = [];
  allLabel: string[] = ["Committee type", "Date of reconstitution", "Committee will expire on", "Account holder name", "Bank name","","", "Other bank name", "Account no", "IFSC code", "Branch name"];

  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();
  maxDate: any = Date; 
  minDate: any = Date; 
  constructor(
    private commonFunctionHelper: CommonFunctionHelper,
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    public customValidator: CustomValidators,
    public committeeMemberService: CommitteeMemberService,
    public committeeBankDetailsService: CommitteeBankDetailsService,
    private spinner: NgxSpinnerService,
    public commonService: CommonserviceService,
    public commonserviceService: CommonserviceService,
    public customValidators: CustomValidators,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private route: Router,
    private el: ElementRef,
  ) {
    const pageUrl: any = this.route.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For authorization
    this.minDate = new Date();
  }

  ngOnInit(): void {
    if (this.plPrivilege == 'admin') {
      this.adminPrivilege = true;
    }

    const userProfile = this.commonserviceService.getUserProfile();
    this.schoolId = userProfile?.school;
    this.userId = userProfile?.userId;
    this.profileId = userProfile?.profileId;
    this.schoolCategory = userProfile?.schoolCategory;

    if (userProfile.loginUserTypeId != 3) {
      this.permissionDiv = true;
    } else {
      this.permissionDiv = false;
    }
    this.getBank();
    this.getAnnexData();
    if (userProfile.loginUserTypeId == 2) {
      this.committeeMemberService.getSchoolTypeBySchoolCatId(this.schoolId, this.schoolCategory).subscribe((data: any = []) => {
        this.schoolType = data?.data;
       /*  let schoolTypeCheck = ["2"];
        if (this.schoolType.length == 1) {
          this.schoolTypeData = this.schoolType.filter((item: any) => {
            if (schoolTypeCheck.includes(item.schoolType)) {
              this.schoolTypeCommitteArr = [{ 'id': 1, 'committeeType': 'SMC' }];
            } else {
              this.schoolTypeCommitteArr = [{ 'id': 1, 'committeeType': 'SMC' }, { 'id': 2, 'committeeType': 'SMDC' }];
            }
          });
        } else {
          this.schoolTypeCommitteArr = [{ 'id': 1, 'committeeType': 'SMC' }, { 'id': 2, 'committeeType': 'SMDC' }];
        } */
        this.schoolTypeCommitteArr = [{ 'id': 1, 'committeeType': 'School Management Committee' }, { 'id': 2, 'committeeType': 'School Management Development Committee' }];
      });
    }
    this.initializeForm();
  }
  getBank() {
    this.committeeBankDetailsService.getBankName().subscribe((data: any = []) => {
      this.bankData = data?.data;
    });
  }
  getAnnexData() {
    this.commonserviceService.getCommonAnnexture(["COMMITTEE_TYPE", "MEMBER_TYPE"]).subscribe((data: any = []) => {
      this.committeeTypeData = data?.data?.COMMITTEE_TYPE;
      this.memberTypeData = data?.data?.MEMBER_TYPE;
    });
  }

  ngAfterViewInit() {
    this.el.nativeElement.querySelector("[formControlName=committeeType]").focus();
  }
  //CONDITIONAL VALIDATOR
  conditionalValidator(
    predicate: any,
    validator: ValidatorFn,
    errorNamespace: string,
    validationType: string
  ): ValidatorFn {
    return (formControl: any) => {
      let conditionStatus = false;
      let parentValue = parseInt(predicate());

      // 1) if parent empty
      if (!formControl.parent) {
        return null;
      }

      let error = null;

      // validation logic for Other bank name
      if (validationType === "otherbankName" && this.bankName == 22) {
        conditionStatus = true;
      }

      // 2) check childs direct parent field
      if (conditionStatus) {
        error = validator(formControl); // validate
      } else {
        error = null;
      }

      // 3) set conditional validation
      if (errorNamespace && error) {
        const customError: any = {}; // custom error property
        customError[errorNamespace] = error;
        error = customError;
      }
      return error;
    };
  }
  //INITIALIZE FORM
  initializeForm() {
    this.addReconBankDetails = this.formBuilder.group({
      committeeType: [
        this.committeeType,
        [Validators.required, Validators.pattern(/^[0-9]*$/)],
      ],
      reconstitutionDate: [
        this.reconstitutionDate, [Validators.required],
      ],
      committeeExpireDate: [
        this.committeeExpireDate, [Validators.required],
      ],
      accHolderName: [
        this.accHolderName, [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-Z ]*$/), this.customValidators.firstCharValidatorRF,],
      ],
      bankName: [
        this.bankName, [Validators.required, this.customValidators.firstCharValidatorRF, Validators.pattern(/^[0-9]*$/)],
      ],
      reconstitutionDatestr:[this.reconstitutionDatestr],
      committeeExpireDatestr:[this.committeeExpireDatestr],
      /* otherbankName: [
        this.otherbankName, [Validators.pattern(/^[a-zA-Z ]*$/), Validators.maxLength(50), this.customValidators.firstCharValidatorRF,]
      ], */
      otherbankName: [
        this.otherbankName,
        [
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z ]*$/),
          this.customValidators.firstCharValidatorRF,
          this.conditionalValidator(
            () => this.addReconBankDetails?.get("bankName")?.value,
            Validators.required,
            "conditionalValidation",
            "otherbankName"
          ),
        ],
      ],
      bankAccNo: [
        this.bankAccNo, [Validators.required, Validators.minLength(11), Validators.maxLength(18), Validators.pattern(/^[0-9]*$/), this.customValidators.firstCharValidatorRF,],
      ],
      bankIFSC: [
        this.bankIFSC, [Validators.required, Validators.pattern(/^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/), this.customValidators.firstCharValidatorRF,],
      ],
      branchName: [
        this.bankName, [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/), Validators.maxLength(50), this.customValidators.firstCharValidatorRF,],
      ],
    })
  }
   //BANK CHANGE
   bankChange(bankId: any) {
    this.bankName = bankId;
    this.addReconBankDetails.patchValue({otherbankName: "",bankAccNo: "",bankIFSC: "",branchName: ""});
  }
  // SUBMIT FORM DATA
  onSubmit() {
    /* this.customValidator.formValidationHandler(
      this.addReconBankDetails,
      this.allLabel
    ); */
    let reconstitutionDateStr = this.addReconBankDetails?.get("reconstitutionDate")?.value;
    let committeeExpireDateStr =  this.addReconBankDetails?.get("committeeExpireDate")?.value;
   if(reconstitutionDateStr != "" && committeeExpireDateStr!= ""){
     
      if (formatDate(reconstitutionDateStr,'yyyy-MM-dd','en_US') > formatDate(committeeExpireDateStr,'yyyy-MM-dd','en_US')){
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Committee expire date can not be smaller than date of reconstitution."
        ); 
        this.addReconBankDetails.patchValue({committeeExpireDate:''});
        return;
        
      } 
    }
  //  this.el.nativeElement.querySelector("[formControlName=committeeExpireDate]").focus();

    // if ("INVALID" === this.addReconBankDetails.status) {
    //   for (const key of Object.keys(this.addReconBankDetails.controls)) {
    //     if (this.addReconBankDetails.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.addReconBankDetails, this.allLabel);
    //       break;
    //     }
    //   }
    // }

    if(this.addReconBankDetails.invalid){
      // this.customValidators.formValidationHandler(this.addReconBankDetails, this.allLabel, this.el);
      this.customValidators.formValidationHandler(
        this.addReconBankDetails,
        this.allLabel,
        this.el,
        {
          required: {
            committeeType: "Please select committee type",
            reconstitutionDate: `Please select the date of reconstitution`,
            committeeExpireDate: `Please select the committee expiry date`,
            accHolderName: `Please enter the account holder name`,
            bankName: `Please select the bank name`,
            bankAccNo: `Please enter the bank account number`,
            bankIFSC: `Please enter the bank IFSC`,
            branchName: `Please enter the branch name`,
          },
        }
      );
    }
   
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.schoolId = users?.school;
    this.profileId = users?.profileId;
    if (this.addReconBankDetails.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          let reconstitutionDate = this.commonFunctionHelper.formatDateHelper(this.addReconBankDetails.get("reconstitutionDate")?.value);
          let committeeExpireDate = this.commonFunctionHelper.formatDateHelper(this.addReconBankDetails.get("committeeExpireDate")?.value);
          this.addReconBankDetails.patchValue({
            reconstitutionDatestr: reconstitutionDate,
          });
          this.addReconBankDetails.patchValue({
            committeeExpireDatestr: committeeExpireDate,
          });
          this.committeeBankDetailsService
            .addBankDetails(this.addReconBankDetails.value, this.userId,this.schoolId, this.academicYear,this.profileId)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Committee reconstitution & bank details saved successfully",
                    "success"
                  )
                  .then(() => {
                    this.initializeForm();
                    this.addReconBankDetails.patchValue({
                      bankName: ''
                    });
                    this.addReconBankDetails.patchValue({
                      branchName: ''
                    });

                  });
              },
              error: (error: any) => {
                this.spinner.hide();
              },
            });
        }
      });
    }
  }

  /* currentSchDate(event: any) {
    console.log("hi..");
    
    // let reconstitutionDate = this.commonFunctionHelper.formatDateHelper(this.addReconBankDetails.get('reconstitutionDate')?.value);
    // let committeeExpireDate = this.commonFunctionHelper.formatDateHelper(this.addReconBankDetails.get('committeeExpireDate')?.value);
    this.reconstitutionDateStr = this.commonFunctionHelper.formatDateHelper(this.reconstitutionDate);
    this.committeeExpireDateStr = this.commonFunctionHelper.formatDateHelper(this.committeeExpireDate);
    //  console.log(reconstitutionDate,"rerer","committeeExpireDate");

    if (this.reconstitutionDateStr != '' && this.committeeExpireDateStr != '') {
      if (formatDate(this.committeeExpireDate, 'yyyy-MM-dd', 'en_US') < formatDate(this.reconstitutionDate, 'yyyy-MM-dd', 'en_US')) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Committee expire date should not be less than date of committee created"
        );

        this.addReconBankDetails.patchValue({
          committeeExpireDate: ''
        });
      }
    }
  } */
  resetForm() {
    this.addReconBankDetails.patchValue({
      bankName: "",

    });
    this.bankData = [];
  }
}
