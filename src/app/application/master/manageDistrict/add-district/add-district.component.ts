import { Component, OnInit,ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { ManageDistrictService } from "../../services/manage-district.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { Router } from "@angular/router";
import { CommonserviceService } from "src/app/core/services/commonservice.service";

@Component({
  selector: "app-add-district",
  templateUrl: "./add-district.component.html",
  styleUrls: ["./add-district.component.css"],
})
export class AddDistrictComponent implements OnInit {
  districtForm!: FormGroup;
  allErrorMessages: string[] = [];
  allLabel: string[] = ["","","District name", "District code"];
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  districtName: any = "";
  districtCode: any = "";
  userId: any="";
  profileId: any="";
  adminPrivilege: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    public manageDistrictService: ManageDistrictService,
    private alertHelper: AlertHelper,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private commonService: CommonserviceService, 
    public customValidators: CustomValidators,
    private spinner: NgxSpinnerService,
    private el: ElementRef 
  ) {const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For authorization
  }
  submitted = false;
 
  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.el.nativeElement.querySelector("[formControlName=districtName]").focus();
    this.initializeForm();
  }
  initializeForm() {
    this.districtForm = this.formBuilder.group({
      userId:[this.userId],
      profileId:[this.profileId],
      districtName: [
        this.districtName,
      [Validators.required,Validators.pattern('^[a-zA-Z \-\']+'), Validators.maxLength(25),Validators.minLength(2),this.customValidators.firstCharValidatorRF],
      ],
      districtCode: [
        this.districtCode,
        [Validators.required,Validators.pattern('^[0-9]*$'), Validators.maxLength(4),Validators.minLength(1),Validators.min(1),this.customValidators.firstCharValidatorRF],
      ],
    });
  }
  get districtFormControl() {
    return this.districtForm.controls;
  }

  onSubmit() {
    // if ("INVALID" === this.districtForm.status) {
    //   for (const key of Object.keys(this.districtForm.controls)) {
    //     if (this.districtForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.districtForm,this.allLabel);
    //       break;
    //     }
    //   }
    // }
    if (this.districtForm.invalid) {
      this.customValidators.formValidationHandler(
        this.districtForm,
        this.allLabel,
        this.el,
        {
          required: {
            districtName:
              "Please enter district name.",
              districtCode:
              "Please enter district code.",  
            },
        }
      );
    }
    if (this.districtForm.invalid) {
      return;
    }

    if (this.districtForm.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.manageDistrictService
            .createDistrict(this.districtForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "New disctrict record added successfully.",
                    "success"
                  )
                  .then(() => {
                    this.initializeForm();
                  });
              },
              error: (error: any) => {
                this.spinner.hide(); //==== hide spinner
                // if form invalid
              
                
              },
             
            });
        }
      });
    }
  }
}
