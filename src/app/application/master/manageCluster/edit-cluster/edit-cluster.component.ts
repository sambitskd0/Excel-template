import { Component, ElementRef, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { ManageClusterService } from "../../services/manage-cluster.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
@Component({
  selector: "app-edit-cluster",
  templateUrl: "./edit-cluster.component.html",
  styleUrls: ["./edit-cluster.component.css"],
})
export class EditClusterComponent implements OnInit {
  id: number = 0;
  clusterForm!: FormGroup;
  submitted = false;
  posts: any;
  allDistrict: any;
  showSpinnerBlock: boolean = false;
  blockData: any = [];
  clusterData: any;
  districtId: any="";
  blockId: any="";
  clusterName: any="";
  clusterCode: any="";
  encId: any;
  allErrorMessages: string[] = [];
  allLabel: string[] = ["","","District", "Block", "Cluster name", "Cluster code"];
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  userId: any;
  profileId: any;
  districtLoading:boolean=false;
  blockLoading:boolean=false;
  adminPrivilege: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private commonserviceService: CommonserviceService,
    private manageClusterService: ManageClusterService,
    private route: Router,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router: ActivatedRoute,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private spinner: NgxSpinnerService,
    private el:ElementRef,
  ) {  const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization

  }
  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.spinner.show(); // ==== show spinner
    this.districtLoading = true;
    this.commonserviceService.getAllDistrict().subscribe((data: []) => {
      this.posts = data;
      this.allDistrict = this.posts.data;
      this.districtLoading = false;
    });
    this.id = this.router.snapshot.params["encId"];
    this.editCluster(this.id);
    this.initializeForm();
    this.el.nativeElement.querySelector("[formControlName=districtId]").focus();
  }
  initializeForm() {
    this.clusterForm = this.formBuilder.group({
      userId:[this.userId],
      profileId:[this.profileId],
      districtId: [this.districtId, Validators.required],
      blockId: [this.blockId, Validators.required],
      clusterName: [
        this.clusterName,
        [
          Validators.required,
          Validators.pattern("^[a-zA-Z -']+"),
          Validators.maxLength(25),
          Validators.minLength(2),
          this.customValidators.firstCharValidatorRF
        ],
      ],
      clusterCode: [
        this.clusterCode,
        [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.maxLength(10),
          Validators.minLength(10),
          Validators.min(1),
          this.customValidators.firstCharValidatorRF
        ],
      ],
      encId: [this.encId],
    });
  }
  editCluster(id: any) {
    this.manageClusterService.getClusterById(this.id).subscribe((data: any) => {
      this.clusterData = data;
      this.clusterData = this.clusterData.data;

      this.districtId = this.clusterData.districtId;
      this.blockId = this.clusterData.blockId;
      this.clusterName = this.clusterData.clusterName;
      this.clusterCode = this.clusterData.clusterCode;
      this.encId = this.clusterData.encId;
      this.getBlock(this.districtId);
      this.initializeForm();
      this.spinner.hide(); //==== hide spinner
    });
  }
  getBlock(id: any) {
    this.showSpinnerBlock = true;
    const districtId = id;
    this.blockData = [];
    this.clusterForm.patchValue({
      blockId: "",
    });
    this.blockLoading = true;
    this.commonserviceService
      .getBlockByDistrictid(districtId)
      .subscribe((res) => {
        let data: any = res;
        for (let key of Object.keys(data["data"])) {
          this.blockData.push(data["data"][key]);
        }
        this.showSpinnerBlock = false;
        this.blockLoading =false;
      });
  }
  get clusterFormControl() {
    return this.clusterForm.controls;
  }

  onSubmit() {
    // if ("INVALID" === this.clusterForm.status) {
    //   for (const key of Object.keys(this.clusterForm.controls)) {
    //     if (this.clusterForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.clusterForm,this.allLabel);
    //       break;
    //     }
    //   }
    // }

    if (this.clusterForm.invalid) {
      this.customValidators.formValidationHandler(
        this.clusterForm,
        this.allLabel,
        this.el,
        {
          required: {
            districtId:
              "Please select a district name.",
              blockId:
              "Please select a block name.",  
              clusterName:
              "Please enter cluster name.",  
              clusterCode:
              "Please enter cluster code.",  
            },
        }
      );
    }

    if (this.clusterForm.invalid) {
      return;
    }
    if (this.clusterForm.valid === true) {
      this.alertHelper
        .updateAlert(
          "Do you want to update the record ? ",
          "question",
          "Yes, update it!",
          "No, keep it"
        )
        .then((result) => {
          if (result.value) {
            if (result.value) {
              this.spinner.show(); // ==== show spinner
              this.manageClusterService
                .updateCluster(this.clusterForm.value)
                .subscribe({
                  next: (res: any) => {
                    this.spinner.hide(); //==== hide spinner
                    this.alertHelper
                      .successAlert(
                        "Saved!",
                        "Cluster record updated successfully.",
                        "success"
                      )
                      .then(() => {
                        this.route.navigate(["../../viewCluster"], {
                          relativeTo: this.router,
                        });
                      }); 
                  },
                  error: (error: any) => {
                    this.spinner.hide(); //==== hide spinner
                  },
                });
            }
          }
        });
    }
  }
  onCancel()
  {
    this.route.navigate(["../../viewCluster"], {
      relativeTo: this.router,
    }); 
  }
}
