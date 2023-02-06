import { Component, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { UpdateStockService } from '../../services/update-stock.service';

@Component({
  selector: 'app-update-opening-stock',
  templateUrl: './update-opening-stock.component.html',
  styleUrls: ['./update-opening-stock.component.css']
})
export class UpdateOpeningStockComponent implements OnInit, AfterViewInit {

  updateOpeningStockForm !: FormGroup;

  riceStock: any = "";
  otherFoodItemprice: any = "";
  userId: any = "";
  schoolId: any = "";

  permissionDiv: boolean = false;

  allErrorMessages: string[] = [];
  allLabel: string[] = ["", "", "", "", "Rice stock(in Kg)", "Other food item (in rupees)"];

  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();
  clusterId: any = "";
  schoolDetailsData: any = [];
  openingStockData: any = [];

  schoolName: any = "";
  schoolUdise: any = "";
  clusterName: any = "";
  clusterCode: any = "";
  blockName: any = "";
  blockCode: any = "";
  districtName: any = "";
  districtCode: any = "";

  upStockRecCnt: any = 0;
  profileId: any = "";

  constructor(
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private spinner: NgxSpinnerService,
    private privilegeHelper: PrivilegeHelper, //For menu privilege
    public commonService: CommonserviceService,
    public updateStockService: UpdateStockService,
    private el: ElementRef
  ) { }

  ngOnInit(): void {

    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;    
    this.schoolId = users?.school;
    this.clusterId = users?.cluster;

    if (users.loginUserTypeId != 3) {
      this.permissionDiv = true;
      this.getSchoolDetails(this.schoolId, this.clusterId);
      this.getOpeningStockDetails(this.schoolId, this.academicYear);
    } else {
      this.permissionDiv = false;
    }
    this.initializeForm();
  }
  ngAfterViewInit() {
    this.el.nativeElement.querySelector("[formControlName=riceStock]").focus();
  }

  getOpeningStockDetails(schoolId: any, academicYear: any) {
    this.updateStockService.getOpeningStockDetails(schoolId, academicYear).subscribe((result: any) => {
      this.openingStockData = result?.data[0];
      this.upStockRecCnt = this.openingStockData?.upStockRecCnt;
      if (this.upStockRecCnt > 0) {
        this.el.nativeElement.querySelector("[formControlName=riceStock]").blur();
      }
      this.riceStock = this.openingStockData?.riceStock;
      this.otherFoodItemprice = this.openingStockData?.foodItemPrice;
      this.initializeForm();
    });
  }
  getSchoolDetails(schoolId: any, clusterId: any) {
    this.updateStockService.getSchoolDetails(schoolId, clusterId).subscribe((result: any) => {
      this.schoolDetailsData = result?.data[0];
      this.districtName = this.schoolDetailsData.districtName;
      this.districtCode = this.schoolDetailsData.districtCode;
      this.blockName = this.schoolDetailsData.blockName;
      this.blockCode = this.schoolDetailsData.blockCode;
      this.clusterName = this.schoolDetailsData.clusterName;
      this.clusterCode = this.schoolDetailsData.clusterCode;
      this.schoolName = this.schoolDetailsData.schoolName;
      this.schoolUdise = this.schoolDetailsData.schoolUdiseCode;
    });
  }
  initializeForm() {
    this.updateOpeningStockForm = this.formBuilder.group({
      userId: [this.userId],
      profileId: [this.profileId],
      schoolId: [this.schoolId],
      academicYear: [this.academicYear],
      riceStock: [
        this.riceStock, [Validators.required, Validators.pattern('^[0-9.]*$'), Validators.maxLength(7), Validators.min(1), this.customValidators.firstCharValidatorRF],
      ],
      otherFoodItemprice: [
        this.otherFoodItemprice, [Validators.pattern('^[0-9.]*$'), Validators.maxLength(7), Validators.min(1), this.customValidators.firstCharValidatorRF,],
      ],
    });
  }

  onSubmit() {
    // if ("INVALID" === this.updateOpeningStockForm.status) {
    //   for (const key of Object.keys(this.updateOpeningStockForm.controls)) {
    //     if (this.updateOpeningStockForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.updateOpeningStockForm,this.allLabel);
    //       break;
    //     }
    //   }
    // }
    if (this.updateOpeningStockForm.invalid) {
      // this.customValidators.formValidationHandler(this.updateOpeningStockForm, this.allLabel, this.el);
      this.customValidators.formValidationHandler(
        this.updateOpeningStockForm,
        this.allLabel,
        this.el,
        {
          required: {
            riceStock: "Please enter the rice stock in kg",
          },
        }
      );
    }
    if (this.updateOpeningStockForm.invalid) {
      return;
    }

    this.alertHelper.submitAlert().then((result) => {
      if (result.value) {
        this.spinner.show(); // ==== show spinner
        this.updateStockService.updateOpeningStock(this.updateOpeningStockForm.value)
          .subscribe({
            next: (res: any) => {
              this.spinner.hide(); //==== hide spinner
              this.alertHelper
                .successAlert(
                  "Saved!",
                  "Opening stock details created successfully",
                  "success"
                )
                .then(() => {
                  this.getOpeningStockDetails(this.schoolId, this.academicYear);
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

