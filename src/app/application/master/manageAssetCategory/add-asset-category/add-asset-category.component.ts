import { Component, ElementRef, OnInit } from '@angular/core';
import { FormGroup, Validators,FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageAssetCategoryService } from '../../services/manage-asset-category.service';
import { Router } from '@angular/router';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { Constant } from 'src/app/shared/constants/constant';

@Component({
  selector: 'app-add-asset-category',
  templateUrl: './add-asset-category.component.html',
  styleUrls: ['./add-asset-category.component.css']
})
export class AddAssetCategoryComponent implements OnInit {
  addAsset!: FormGroup;
  submitted = false;
  allErrorMessages: string[] = [];
  allLabel: string[] = ["Asset Type","Asset Name","Description","",""];
  assetType:any;
  assetName:string = "";
  assetDescription:any = "";

  plPrivilege:string = "view"; //For menu privilege
  config = new Constant();
  tabs: any = [];  //For shwoing tabs
  userId: any;
  profileId: any;
  adminPrivilege: boolean = false;

  constructor(
    private formBuilder:FormBuilder,
    private alertHelper:AlertHelper,
    public customValidator:CustomValidators,
    private ManageAssetCategoryService:ManageAssetCategoryService, 
    public customValidators: CustomValidators,
    private spinner: NgxSpinnerService, 
    public commonserviceService:CommonserviceService,
    private router:Router,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege  
    private el:ElementRef,
    
  ) { 
      const pageUrl:any = this.router.url;  
      this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
      this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization
      this.tabs = this.privilegeHelper.PrimaryLinkTabNames(pageUrl);  //For shwoing tabs     
    }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    const users = this.commonserviceService.getUserProfile();
   this.userId = users?.userId;
   this.profileId = users?.profileId;
   this.el.nativeElement.querySelector("[formControlName=assetType]").focus();
    this.initializeForm();
  }
  initializeForm(){
    this.addAsset = this.formBuilder.group({
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
      userId:[this.userId],
      profileId:[this.profileId],
    })
  }
  get assetFormControl() {
    return this.addAsset.controls;
  
  }
  onSubmit(){

    // if ("INVALID" === this.addAsset.status) {
    //   for (const key of Object.keys(this.addAsset.controls)) {
    //     if (this.addAsset.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidator.formValidationHandler(this.addAsset,this.allLabel);
    //       break;
    //     }
    //   }
    // }

    if (this.addAsset.invalid) {
      this.customValidators.formValidationHandler(this.addAsset, this.allLabel, this.el);
    }

    if (this.addAsset.invalid) {
      return;
    }
    
    if (this.addAsset.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          this.ManageAssetCategoryService
            .createAsset(this.addAsset.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Asset category created successfully.",
                    "success"
                  )
                  .then(() => {
                    this.initializeForm();
                  });
              },
              error: (error: any) => {
              },
            });
        }
      });
    }
  }
}
