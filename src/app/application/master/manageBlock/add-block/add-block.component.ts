import { Component, ElementRef, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertHelper, } from "src/app/core/helpers/alert-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { ManageBlockService } from "../../services/manage-block.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { Router } from "@angular/router";

@Component({
  selector: "app-add-block",
  templateUrl: "./add-block.component.html",
  styleUrls: ["./add-block.component.css"],
})
export class AddBlockComponent implements OnInit {
  blockForm!: FormGroup;
  submitted = false;
  posts: any;
  districtData: any = [];
  allDistrict: any;
  allErrorMessages: string[] = [];
  districtId: any = "";
  blockName: any = "";
  blockCode: any = "";
  allLabel: string[] = ["","","District", "Block name", "Block code"];
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  userId: any;
  profileId: any;
  districtLoading:boolean=false;
  adminPrivilege: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    public commonserviceService: CommonserviceService,
    public manageBlockService: ManageBlockService,
    private alertHelper: AlertHelper,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    public customValidators: CustomValidators,
    private spinner: NgxSpinnerService,
    private el:ElementRef,
  ) {const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For authorization
  }
  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    this.initializeForm();
    this.el.nativeElement.querySelector("[formControlName=districtId]").focus();
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.districtLoading = true;
    this.commonserviceService.getAllDistrict().subscribe((data: []) => {
      this.posts = data;
      this.allDistrict = this.posts.data;
      this.districtLoading = false;
    });
  }

 
  get blockFormControl() {
    return this.blockForm.controls;
  }
  initializeForm() {
    this.blockForm = this.formBuilder.group({
      userId:[this.userId],
      profileId:[this.profileId],
      districtId: [this.districtId, Validators.required],
      blockName: [
        this.blockName,
        [Validators.required,Validators.pattern('^[a-zA-Z \-\']+'), Validators.maxLength(25),Validators.minLength(2),this.customValidators.firstCharValidatorRF],
      ],
      blockCode: [
        this.blockCode,
        [Validators.required,Validators.pattern('^[0-9]*$'), Validators.maxLength(6),Validators.minLength(6),Validators.min(1),this.customValidators.firstCharValidatorRF],
      ],
    });
  }
  onSubmit() {
    if ("INVALID" === this.blockForm.status) {
      for (const key of Object.keys(this.blockForm.controls)) {
        if (this.blockForm.controls[key].status === "INVALID") {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + key + '"]'
          );
          invalidControl.focus();
          this.customValidators.formValidationHandler(
            this.blockForm,
            this.allLabel,
            this.el,
            {
              required: {
                districtId:
                  "Please select a district name.",
                  blockName:
                  "Please enter block name.", 
                  blockCode:
                  "Please enter block code.",  
                },
            }
          );
          break;
        }
      }
    }
    if (this.blockForm.invalid) {
      return;
    }

    if (this.blockForm.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          this.manageBlockService.createBlock(this.blockForm.value).subscribe({
            next: (res: any) => {
              this.spinner.hide();
              this.alertHelper
                .successAlert(
                  "Saved!",
                  "New block record added successfully.",
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
