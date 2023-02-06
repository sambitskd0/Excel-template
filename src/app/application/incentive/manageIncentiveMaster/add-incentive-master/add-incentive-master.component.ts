import { Component, ElementRef, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { Constant } from "src/app/shared/constants/constant";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { ManageIncentiveMasterService } from "../../services/manage-incentive-master.service";

@Component({
  selector: "app-add-incentive-master",
  templateUrl: "./add-incentive-master.component.html",
  styleUrls: ["./add-incentive-master.component.css"],
})
export class AddIncentiveMasterComponent implements OnInit {
  incentiveMasterForm!: FormGroup;
  isSelected: boolean = true;
  incentiveUnitData: any;
  incentiveName: any          = "";
  incentiveCode: any          = "";
  incentiveDescription: any   =  "";
  incentiveUnit: any          = "";
  disbursalMode: any          = "";
  allErrorMessages: string[]  = [];
  allLabel: string[]          = ["", "","Incentive name","Incentive code","Incentive description","Incentive unit","Disbursal mode"];
  submitted:boolean           = false;
  adminPrivilege: boolean     = false;
  unitLoading:boolean         = false;
  userId: any                 = "";
  
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();

  profileId:any = '';
 
  constructor(
    private el: ElementRef,
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private spinner: NgxSpinnerService,
    public manageIncentiveMasterService: ManageIncentiveMasterService,
    public commonService:CommonserviceService
  ) {
    const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For authorization
  }

  ngOnInit(): void {
    this.spinner.show();
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    const users = this.commonService.getUserProfile();
   this.userId = users?.userId;
   this.profileId = users?.profileId;
   this.el.nativeElement.querySelector("[formControlName=incentiveName]").focus();
  
    this.initializeForm();
    this.unitLoading = true;
    this.commonService.getIncentiveUnit().subscribe((res: any) => {
      this.incentiveUnitData = res.data;
      this.unitLoading = false;
    });
    this.spinner.hide();
  }
  
  initializeForm() {
    this.incentiveMasterForm = this.formBuilder.group({
      userId:[this.userId],
      profileId:[this.profileId],
      incentiveName: [
        this.incentiveName,
        [
          Validators.required,Validators.maxLength(30),Validators.minLength(3),this.customValidators.firstCharValidatorRF,Validators.pattern('^[A-Za-z ]*$')
        ],
      ],
      incentiveCode: [
        this.incentiveCode,
        [Validators.required,Validators.maxLength(20),Validators.minLength(4),Validators.pattern('^[a-zA-ZS0-9.]*$'),this.customValidators.firstCharValidatorRF],
      ],
      incentiveDescription: [
        this.incentiveDescription,
        [Validators.maxLength(300),Validators.minLength(3),this.customValidators.firstCharValidatorRF],
      ],
      incentiveUnit: [this.incentiveUnit, [Validators.required,Validators.pattern('^[0-9]*$')]],
      disbursalMode: [this.disbursalMode, [Validators.required,Validators.pattern('^[0-9]*$')]],
    });
  }
  get incentiveMasterFormControl() {
    return this.incentiveMasterForm.controls;
  }
  onSubmit() {
    /* this.customValidators.formValidationHandler(
      this.incentiveMasterForm,
      this.allLabel
    ); */

    // if ("INVALID" === this.incentiveMasterForm.status) {
    //   for (const key of Object.keys(this.incentiveMasterForm.controls)) {
    //     if (this.incentiveMasterForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.incentiveMasterForm,this.allLabel);
    //       break;
    //     }
    //   }
    // }
    if (this.incentiveMasterForm.invalid) {
      // this.customValidators.formValidationHandler(this.incentiveMasterForm,this.allLabel, this.el);
      this.customValidators.formValidationHandler(
        this.incentiveMasterForm,
        this.allLabel,
        this.el,
        {
          required: {
            incentiveName: "Please enter Incentive Name",
            incentiveCode: "Please enter Incentive Code",
            incentiveUnit: "Please select Unit",
            disbursalMode: "Please select Mode of Disbursal",
          },
        }
      );
    }
    if (this.incentiveMasterForm.invalid) {
      return;
    }
  
    if (this.incentiveMasterForm.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.manageIncentiveMasterService
            .createIncentive(this.incentiveMasterForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Incentive detail saved successfully",
                    "success"
                  )
                  .then(() => {
                    this.initializeForm();
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
