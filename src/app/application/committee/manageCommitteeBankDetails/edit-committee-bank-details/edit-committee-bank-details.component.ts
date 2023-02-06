import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ErrorHandler, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-edit-committee-bank-details',
  templateUrl: './edit-committee-bank-details.component.html',
  styleUrls: ['./edit-committee-bank-details.component.css']
})
export class EditCommitteeBankDetailsComponent implements OnInit {

  editReconBankDetails!:FormGroup;
 
  committeeTypeData: any        = "";
  memberTypeData: any           = "";
  bankingDetailsData: any       = "";
  
  branchName: any               = "";
  reconstitutionDate: any       = "";
  committeeExpireDate: any      = "";
  reconstitutionDatestr: any    = "";
  committeeExpireDatestr: any   = "";
  accHolderName: any            = "";
  bankName: any                 = "";
  otherbankName: any            = "";
  bankAccNo: any                = "";
  bankIFSC: any                 = "";
  committeeType:any             = "";
  bankData: any                 = "";
  schoolId: any                 = "";
  userId: any                   = "";
  profileId: any                   = "";

  divshow:boolean               = false;
  adminPrivilege: boolean       = false;
  permissionDiv: boolean        = false;

  allErrorMessages: string[] = [];
  allLabel: string[] = ["Committee type", "Date of reconstitution", "Committee will expire on", "Account holder name", "Bank name", "","","Other bank name", "Account no", "IFSC code", "Branch name",""];

  id: any                       = "";
  encId: any                    = "";
  plPrivilege:string            = "view"; //For menu privilege
  config = new Constant();
  
  maxDate: any = Date; 
  minDate: any = Date; 
  constructor(
    private commonFunctionHelper: CommonFunctionHelper,
    private formBuilder:FormBuilder,
    private alertHelper:AlertHelper,
    public customValidator:CustomValidators,
    public committeeBankDetailsService:CommitteeBankDetailsService,
    private spinner: NgxSpinnerService, 
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    public commonserviceService: CommonserviceService,
    public customValidators: CustomValidators,
    private router: ActivatedRoute,
    private route: Router,
    private el: ElementRef,
  ) {
    const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization  
    this.minDate = new Date();
   }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    const userProfile = this.commonserviceService.getUserProfile();
    this.schoolId = userProfile?.school;
    this.userId = userProfile?.userId;
    this.profileId = userProfile?.profileId;

    if (userProfile.loginUserTypeId != 3) {
      this.permissionDiv = true;
    } else {
      this.permissionDiv = false;
    }

    this.getBank();
    this.getAnnexData();
   
    this.id = this.router.snapshot.params["encId"];
    this.getBankDetails(this.id);
    this.initializeForm();
  }
  ngAfterViewInit() {
    this.el.nativeElement.querySelector("[formControlName=committeeType]").focus();
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
  //CONDITIONAL VALIDATOR STARTS
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
 //CONDITIONAL VALIDATOR ENDS
 //INITIALIZE FORM STARTS

  initializeForm(){
    this.editReconBankDetails = this.formBuilder.group({
      committeeType: [this.committeeType, [Validators.required,Validators.pattern(/^[0-9]*$/)]],
      reconstitutionDate: [this.reconstitutionDate, [Validators.required]],
      committeeExpireDate: [this.committeeExpireDate, [Validators.required]],
      accHolderName: [this.accHolderName, [Validators.required,Validators.maxLength(50),Validators.pattern(/^[a-zA-Z ]*$/),this.customValidators.firstCharValidatorRF]],
      bankName: [this.bankName, [Validators.required,Validators.pattern(/^[0-9]*$/),this.customValidators.firstCharValidatorRF]],
      reconstitutionDatestr:[this.reconstitutionDatestr],
      committeeExpireDatestr:[this.committeeExpireDatestr],
      otherbankName: [
        this.otherbankName,
        [
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z ]*$/),
          this.customValidators.firstCharValidatorRF,
          this.conditionalValidator(
            () => this.editReconBankDetails?.get("bankName")?.value,
            Validators.required,
            "conditionalValidation",
            "otherbankName"
          ),
        ],
      ],
      bankAccNo:[this.bankAccNo, [Validators.required,Validators.minLength(11),Validators.maxLength(18),Validators.pattern(/^[0-9]*$/),this.customValidators.firstCharValidatorRF]],
      bankIFSC:[this.bankIFSC, [Validators.required,Validators.pattern(/^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/),this.customValidators.firstCharValidatorRF]],
      branchName:[this.branchName, [Validators.required,Validators.pattern(/^[a-zA-Z ]*$/),Validators.maxLength(50),this.customValidators.firstCharValidatorRF]],
      encId:[this.encId]
    })
  }
  //GRT DETAILS FOR AUTOFILL
  getBankDetails(id:any)
  {
    this.spinner.show();
    this.committeeBankDetailsService.getBankingDetails(id).subscribe((res: any) => {
      this.bankingDetailsData =  res.data;
        this.encId = this.bankingDetailsData.encId;
        this.committeeType = this.bankingDetailsData.committeeType;
        this.reconstitutionDate = new Date(this.bankingDetailsData.dateOfReconstitution.toString());
        this.committeeExpireDate =  new Date(this.bankingDetailsData.committeeExpDate);
        this.bankName = this.bankingDetailsData.bankName;
        this.accHolderName = this.bankingDetailsData.accounttHolderName;
        this.bankAccNo = this.bankingDetailsData.accountNo;
        this.bankIFSC = this.bankingDetailsData.IFSCCode;
        this.branchName = this.bankingDetailsData.branchName;
        this.otherbankName = this.bankingDetailsData.otherBankName;
       
        this.initializeForm();
        this.spinner.hide();
    });
  }
  //SUBMIT DATA
  onSubmit(){
    /* this.customValidator.formValidationHandler(
      this.editReconBankDetails,
      this.allLabel
    ); */
    let reconstitutionDateStr = this.editReconBankDetails?.get("reconstitutionDate")?.value;
    let committeeExpireDateStr =  this.editReconBankDetails?.get("committeeExpireDate")?.value;
   if(reconstitutionDateStr != "" && committeeExpireDateStr!= ""){
     
      if (formatDate(reconstitutionDateStr,'yyyy-MM-dd','en_US') > formatDate(committeeExpireDateStr,'yyyy-MM-dd','en_US')){
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Committee expire date can not be smaller than date of reconstitution."
        ); 
        this.editReconBankDetails.patchValue({committeeExpireDate:''});
        return;
        
      } 
    }
    
    // if ("INVALID" === this.editReconBankDetails.status) {
    //   for (const key of Object.keys(this.editReconBankDetails.controls)) {
    //     if (this.editReconBankDetails.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.editReconBankDetails, this.allLabel);
    //       break;
    //     }
    //   }
    // }
    if (this.editReconBankDetails.invalid) {
      // this.customValidators.formValidationHandler(this.editReconBankDetails, this.allLabel, this.el);
      this.customValidators.formValidationHandler(
        this.editReconBankDetails,
        this.allLabel,
        this.el,
        {
          required: {
            committeeType: "Please select committee type",
            reconstitutionDate: `Please select the date of reconstitution`,
            committeeExpireDate: `Please select the committee expiry date`,
            accHolderName: `Please enter the account holder name`,
            bankName: `Please select the bank name`,
            bankAccNo: `Please enter the bank Account number`,
            bankIFSC: `Please enter the bank IFSC`,
            branchName: `Please enter the branch name`,
          },
        }
      );
    }
    if (this.editReconBankDetails.invalid) {
      return;
    }
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;
    this.schoolId = users?.school;
    this.profileId = users?.profileId;

    if (this.editReconBankDetails.valid === true) {
      this.alertHelper
        .updateAlert(
          "Do you want to update the records ?",
          "question",
          "Yes, update it!",
          "No, keep it"
        ).then((result) => {
        if (result.value) {
          this.spinner.show();
          let reconstitutionDate = this.commonFunctionHelper.formatDateHelper(this.editReconBankDetails.get("reconstitutionDate")?.value);
          let committeeExpireDate = this.commonFunctionHelper.formatDateHelper(this.editReconBankDetails.get("committeeExpireDate")?.value);
          this.editReconBankDetails.patchValue({
            reconstitutionDatestr: reconstitutionDate,
          });
          this.editReconBankDetails.patchValue({
            committeeExpireDatestr: committeeExpireDate,
          });
          this.committeeBankDetailsService
            .updateBankDetails(this.editReconBankDetails.value,this.userId,this.schoolId,this.profileId)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Committee reconstitution & bank details updated successfully",
                    "success"
                  )
                  .then(() => {
                    this.route.navigate(["../../viewCommitteeBankDetails"], {
                      relativeTo: this.router,
                    });
                    this.initializeForm();
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
  bankChange(bankId:any){
    this.bankName = bankId;
    this.editReconBankDetails.patchValue({otherbankName: "",bankAccNo: "",bankIFSC: "",branchName: ""});
  }
  /* currentSchDate(){
    let reconstitutionDate = this.editReconBankDetails.controls['reconstitutionDate'].value; 
    let committeeExpireDate = this.editReconBankDetails.controls['committeeExpireDate'].value; 
   
    if(reconstitutionDate !='' && committeeExpireDate !=''){
      if (formatDate(committeeExpireDate,'yyyy-MM-dd','en_US') < formatDate(reconstitutionDate,'yyyy-MM-dd','en_US')){
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Date of Commetie expaire should not be less than Date of Committe Crteated"
        );
        this.editReconBankDetails.patchValue({
          committeeExpireDate: ''
       });
      
        }
    }
  } */
  onCancel() {
    this.route.navigate(["../../viewCommitteeBankDetails"], {
      relativeTo: this.router,
    });
  }
}
