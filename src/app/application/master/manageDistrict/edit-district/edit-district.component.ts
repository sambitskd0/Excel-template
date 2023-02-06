import { Component, ElementRef, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { ManageDistrictService } from "../../services/manage-district.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
@Component({
  selector: "app-edit-district",
  templateUrl: "./edit-district.component.html",
  styleUrls: ["./edit-district.component.css"],
})
export class EditDistrictComponent implements OnInit {
  districtForm!: FormGroup;
  submitted = false;
  id: number = 0;
  distData: any;
  districtName: any = "";
  districtCode: any = "";
  encId: any = "";
  userId:any="";
  profileId:any="";
  allErrorMessages: string[] = [];
  allLabel: any = ["","","District name", "District code",""];
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  constructor(
    private fb: FormBuilder,
    public customValidators: CustomValidators,
    public manageDistrictService: ManageDistrictService,
    private route: Router,
    private router: ActivatedRoute,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private alertHelper: AlertHelper,
    private commonService: CommonserviceService,
    private spinner: NgxSpinnerService,
    private el:ElementRef,
  ) {const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization
  }
  ngOnInit(): void {
    this.spinner.show();
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.id = this.router.snapshot.params["encId"];
    this.editDistrict(this.id);
    this.initializeForm();
    this.el.nativeElement.querySelector("[formControlName=districtName]").focus();
   
  }
  initializeForm() {
    this.districtForm = this.fb.group({
      userId:[this.userId],
      profileId:[this.profileId],
      districtName: [
        this.districtName,
        [Validators.required, Validators.maxLength(25),Validators.minLength(2),this.customValidators.firstCharValidatorRF],
      ],
      districtCode: [
        this.districtCode,
        [Validators.required, Validators.maxLength(4),Validators.minLength(1),this.customValidators.firstCharValidatorRF],
      ],
      encId: [this.encId],
    });
  }
  editDistrict(id: any) {
    this.manageDistrictService.getDistrictById(this.id).subscribe((data: any) => {
      this.distData = data;
      this.distData = this.distData.data;
      this.districtName = this.distData.districtName;
      this.districtCode = this.distData.districtCode;
      this.encId = this.distData.encId;
      this.initializeForm();
      this.spinner.hide();
    });
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
      this.alertHelper
        .updateAlert(
          "Do you want to update the record ?",
          "question",
          "Yes, update it!",
          "No, keep it"
        )
        .then((result) => {
          if (result.value) {
            this.spinner.show(); // ==== show spinner
            this.manageDistrictService
              .updateDistrict(this.districtForm.value)
              .subscribe({
                next: (res: any) => {
                  this.spinner.hide(); //==== hide spinner
                  this.alertHelper
                    .successAlert(
                      "Saved!",
                      "Disctrict details updated successfully",
                      "success"
                    )
                    .then(() => {
                      this.route.navigate(["../../viewDistrict"], {
                        relativeTo: this.router,
                      });
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
  onCancel()
  {
    this.route.navigate(["../../viewDistrict"], {
      relativeTo: this.router,
    }); 
  }
  
}
