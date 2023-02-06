import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageAssetCategoryService } from '../../services/manage-asset-category.service';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { Constant } from 'src/app/shared/constants/constant';

@Component({
  selector: 'app-edit-asset-category',
  templateUrl: './edit-asset-category.component.html',
  styleUrls: ['./edit-asset-category.component.css']
})
export class EditAssetCategoryComponent implements OnInit {
  editAssetForm!: FormGroup;
  submitted = false;
  id: number = 0;
  assetData: any;
  assetType: any;
  assetName: string = "";
  assetDescription: any = "";
  encId: any = "";
  allErrorMessages: string[] = [];
  adminPrivilege: boolean = false;
  plPrivilege:string = "view"; //For menu privilege
  config = new Constant();
  tabs:any = [];  //For shwoing tabs
  
  allLabel: string[] = ["Asset Type", "Asset Name", "Description","",""];
  userId: any;
  profileId: any;
  assetCode: any ="";
  // radioSelected:any;
  constructor(
    public customValidator: CustomValidators,
    private formBuilder: FormBuilder,
    public ManageAssetCategoryService: ManageAssetCategoryService,
    private route: Router,
    private router: ActivatedRoute,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    public customValidators: CustomValidators, 
    public commonserviceService:CommonserviceService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege 
    private el:ElementRef,
  ) { 
      const pageUrl:any = this.route.url;  
      this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
      this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization
      this.tabs = this.privilegeHelper.PrimaryLinkTabNames(pageUrl);  //For shwoing tabs        
  }

  ngOnInit(): void {
    this.spinner.show();
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.id = this.router.snapshot.params["encId"];
    this.el.nativeElement.querySelector("[formControlName=assetType]").focus();
    this.initializeForm();
    this.editAsset(this.id);
  }
  initializeForm() {
    this.editAssetForm = this.formBuilder.group({
      assetType: [
        this.assetType,
        [Validators.required,Validators.pattern(/^[0-9]+$/)]
      ],
      assetName: [
        this.assetName,
        [Validators.required, Validators.maxLength(25),Validators.minLength(2),Validators.pattern(/^[A-Za-z ]+$/),this.customValidator.firstCharValidatorRF],
      ],
      assetDescription: [
        this.assetDescription,
        [Validators.maxLength(500)],
      ],
      encId:[this.encId],
      userId:[this.userId],
    })
  }
  editAsset(id: any) {
    this.ManageAssetCategoryService.getAssetData(this.id).subscribe((res: any) => {
      this.assetData = res;
      this.assetData = this.assetData.data;
      // console.log(this.assetData);
      this.assetType = this.assetData.assetType;
      this.assetName = this.assetData.assetName;
      this.assetCode = this.assetData.assetNameCode;
      this.assetDescription = this.assetData.assetDescription;
      this.encId = this.assetData.encId;
      this.initializeForm();
      this.spinner.hide();
    });
  }
  onSubmit() {
    // if ("INVALID" === this.editAssetForm.status) {
    //   for (const key of Object.keys(this.editAssetForm.controls)) {
    //     if (this.editAssetForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidator.formValidationHandler(this.editAssetForm,this.allLabel);
    //       break;
    //     }
    //   }
    // }

    if (this.editAssetForm.invalid) {
      this.customValidators.formValidationHandler(this.editAssetForm, this.allLabel, this.el);
    }

    if (this.editAssetForm.invalid) {
      return;
    }

    this.alertHelper.updateAlert().then((result) => {
      if (result.value) {
        this.spinner.show();
        this.ManageAssetCategoryService
          .updateAsset(this.editAssetForm.value)
          .subscribe({
            next: (res: any) => {
              this.spinner.hide(); 
              this.alertHelper
                .successAlert(
                  "Saved!",
                  "Asset category updated successfully.",
                  "success"
                )
                .then(() => {
                         this.route.navigate(["../../viewAssetCategory"], {
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
  onCancel()
  {
    this.route.navigate(["../../viewAssetCategory"], {
      relativeTo: this.router,
    }); 
  }
}

