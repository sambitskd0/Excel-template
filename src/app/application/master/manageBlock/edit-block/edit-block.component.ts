import { Component, ElementRef, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { ManageBlockService } from "../../services/manage-block.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
@Component({
  selector: "app-edit-block",
  templateUrl: "./edit-block.component.html",
  styleUrls: ["./edit-block.component.css"],
})
export class EditBlockComponent implements OnInit {
  id: number = 0;
  blockForm!: FormGroup;
  submitted = false;
  blockData: any = "";
  allDistrict: any;
  posts: any;
  encId: any = "";
  allErrorMessages: string[] = [];
  districtId: any = "";
  blockName: any = "";
  blockCode: any = "";
  allLabel: string[] = ["","","District", "Block name", "Block code",""];
  userId: any;
  profileId: any;
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  districtLoading:boolean=false;
  adminPrivilege: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private route: Router,
    private router: ActivatedRoute,
    public commonserviceService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    public manageBlockService: ManageBlockService,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private spinner: NgxSpinnerService,
    private el:ElementRef,
  ) {
    const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization

  }

  ngOnInit(): void {
    this.spinner.show(); // ==== show spinner
    if(this.plPrivilege=='admin'){
        this.adminPrivilege = true;
    }
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.districtLoading = true;
    this.commonserviceService.getAllDistrict().subscribe((data: any) => {

      this.posts = data;
      this.allDistrict = this.posts.data;
      this.encId = this.id;
      this.districtLoading = false;
    });
    this.id = this.router.snapshot.params["encId"];
    this.editBlock(this.id);
    this.initializeForm();
    this.el.nativeElement.querySelector("[formControlName=districtId]").focus();
  }
  initializeForm() {
    this.blockForm = this.formBuilder.group({
      userId:[this.userId],
      profileId:[this.profileId],
      districtId: [this.districtId, Validators.required],
      blockName: [
        this.blockName,
        [Validators.required,Validators.pattern('^[a-zA-Z \-\']+'),Validators.maxLength(25),Validators.minLength(2),this.customValidators.firstCharValidatorRF],
      ],
      blockCode: [
        this.blockCode,
        [Validators.required,Validators.pattern('^[0-9]*$'),Validators.maxLength(6),Validators.minLength(6),Validators.min(1),this.customValidators.firstCharValidatorRF],
      ],
      encId: [this.encId],
    });
  }
  editBlock(id: Number) {
    this.manageBlockService.getBlockById(this.id).subscribe((data: any) => {
      this.blockData = data;
      this.blockData = this.blockData.data;

      this.districtId = this.blockData.districtId;
      this.blockName = this.blockData.blockName;
      this.blockCode = this.blockData.blockCode;
      //added by saubhagya
      this.encId = this.blockData.encId;
      this.initializeForm();
      this.spinner.hide(); //==== hide spinner
    });
  }

  get blockFormControl() {
    return this.blockForm.controls;
  }

  onSubmit() {
    // if ("INVALID" === this.blockForm.status) {
    //   for (const key of Object.keys(this.blockForm.controls)) {
    //     if (this.blockForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.blockForm,this.allLabel);
    //       break;
    //     }
    //   }
    // }

    if (this.blockForm.invalid) {
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
    }
    
    if (this.blockForm.invalid) {
      return;
    }
    if (this.blockForm.valid === true) {
      this.alertHelper
        .updateAlert(
          "Do you want to update the record ?",
          "question",
          "Yes, update it!",
          "No, keep it"
        )
        .then((result) => {
          if (result.value) {
            this.spinner.show(); // show spinner
            this.manageBlockService
              .updateBlock(this.blockForm.value)
              .subscribe({
                // show spinner
                next: (res: any) => {
                  this.spinner.hide();
                  this.alertHelper
                    .successAlert(
                      "Saved!",
                      "Block record updated successfully.",
                      "success"
                    )
                    .then(() => {
                      this.route.navigate(["../../viewBlock"], {
                        relativeTo: this.router,
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
  onCancel()
  {
    this.route.navigate(["../../viewBlock"], {
      relativeTo: this.router,
    }); 
  }
}
