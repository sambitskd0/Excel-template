import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageIncentiveMasterService } from '../../services/manage-incentive-master.service';

@Component({
  selector: 'app-edit-incentive-master',
  templateUrl: './edit-incentive-master.component.html',
  styleUrls: ['./edit-incentive-master.component.css']
})
export class EditIncentiveMasterComponent implements OnInit {

  editIncentiveForm!: FormGroup;

  submitted: boolean = false;
  adminPrivilege: boolean = false;
  unitLoading: boolean = true;
  id: number = 0;
  incentiveDatas: any = "";
  incentiveName: any = "";
  incentiveCode: any = "";
  incentiveDescription: any = "";
  incentiveUnit: any = "";
  disbursalMode: any = "";
  encId: any = "";
  allErrorMessages: string[] = [];
  incentiveUnitData: any = [];
  allLabel: string[] = ["", "", "Incentive name", "Incentive code", "Incentive description", "Incentive unit", "Disbursal mode", ""];
  userId: any = "";

  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();

  profileId:any = '';

  constructor(
    private el: ElementRef,
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private spinner: NgxSpinnerService, private route: Router,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router: ActivatedRoute, public manageIncentiveMasterService: ManageIncentiveMasterService,
    public customValidator: CustomValidators,
    public commonService: CommonserviceService,
  ) {
    const pageUrl: any = this.route.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization  
    // this.el.nativeElement.querySelector("[formControlName=incentiveName]").focus();
  }

  ngOnInit(): void {
    this.spinner.show();
    if (this.plPrivilege == 'admin') {
      this.adminPrivilege = true;
    }
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.el.nativeElement.querySelector("[formControlName=incentiveName]").focus();
    this.id = this.router.snapshot.params["encId"];
    this.getIncentiveUnit();
    this.editIncentive(this.id);
    this.initializeForm();
    // this.spinner.hide();
  }

  getIncentiveUnit() {
    this.commonService.getIncentiveUnit().subscribe((res: any) => {
      this.incentiveUnitData = res.data;
      this.unitLoading = false;
    });
  }

  initializeForm() {
    this.editIncentiveForm = this.formBuilder.group({
      userId: [this.userId],
      profileId:[this.profileId],
      incentiveName: [
        this.incentiveName,
        [Validators.required, Validators.maxLength(30), Validators.minLength(3), this.customValidators.firstCharValidatorRF, Validators.pattern('^[A-Za-z ]*$')],
      ],
      incentiveCode: [
        this.incentiveCode,
        [Validators.required, Validators.maxLength(20), Validators.minLength(4), Validators.pattern('^[a-zA-ZS0-9.]*$'), this.customValidators.firstCharValidatorRF],
      ],
      incentiveDescription: [
        this.incentiveDescription,
        [Validators.maxLength(300), Validators.minLength(3), this.customValidators.firstCharValidatorRF],
      ],
      incentiveUnit: [
        this.incentiveUnit,
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      disbursalMode: [
        this.disbursalMode,
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      encId: [this.encId],
    });
  }
  editIncentive(id: any) {
    this.spinner.show();
    this.manageIncentiveMasterService.getIncentive(this.id).subscribe((res: any) => {
      this.incentiveDatas = res.data[0];
      this.incentiveName = this.incentiveDatas.incentiveName;
      this.incentiveCode = this.incentiveDatas.incentiveCode;
      this.incentiveDescription = this.incentiveDatas.incentiveDescription;
      this.incentiveUnit = this.incentiveDatas.incentiveUnit;
      this.disbursalMode = this.incentiveDatas.disbursalMode;
      this.encId = this.incentiveDatas.encId;
      this.spinner.hide();
      this.initializeForm();
    });
  }
  onSubmit() {
    // if ("INVALID" === this.editIncentiveForm.status) {
    //   for (const key of Object.keys(this.editIncentiveForm.controls)) {
    //     if (this.editIncentiveForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.editIncentiveForm, this.allLabel);
    //       break;
    //     }
    //   }
    // }
    if (this.editIncentiveForm.invalid) {
      // this.customValidators.formValidationHandler(this.editIncentiveForm, this.allLabel, this.el);
      this.customValidators.formValidationHandler(
        this.editIncentiveForm,
        this.allLabel,
        this.el,
        {
          required: {
            incentiveName: "Please enter incentive name",
            incentiveCode: "Please enter incentive code",
            incentiveUnit: "Please select unit",
            disbursalMode: "Please select mode of disbursal",
          },
        }
      );
    }
    if (this.editIncentiveForm.invalid) {
      return;
    }
    if (this.editIncentiveForm.valid === true) {
      this.alertHelper
        .updateAlert(
          "Do you want to update the record ?",
          "question",
          "Yes, update it!",
          "No, keep it"
        )
        .then((result) => {
          if (result.value) {
            this.spinner.show();
            this.manageIncentiveMasterService
              .updateIncentive(this.editIncentiveForm.value)
              .subscribe({
                next: (res: any) => {
                  this.spinner.hide();
                  this.alertHelper
                    .successAlert(
                      "Saved!",
                      "Incentive detail updated successfully",
                      "success"
                    )
                    .then(() => {
                      this.route.navigate(["../../viewIncentive"], {
                        relativeTo: this.router,
                      });
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
  onCancel() {
    this.route.navigate(["../../viewIncentive"], {
      relativeTo: this.router,
    });
  }
}
