import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageAssetItemService } from '../../../services/manage-asset-item.service';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { Constant } from 'src/app/shared/constants/constant';

@Component({
  selector: 'app-edit-asset-item',
  templateUrl: './edit-asset-item.component.html',
  styleUrls: ['./edit-asset-item.component.css']
})
export class EditAssetItemComponent implements OnInit {

  editAssetItem!: FormGroup;
  submitted = false;
  id: number = 0;
  assetItemData:any="";
  assetType:any;
  assetCatId:any = "";
  // assetName:string = "";
  assetItemName:string = "";
  assetItemCode:any = "";
  itemMovable:any = "";
  itemFixed:any = "";
  itemUnit:any = "";
  assetDescription:any = "";
  encId: any = "";
  allErrorMessages: string[] = [];
  anexType: any;
  annexData: any="";
  annexUnitData:any=""
  anextureType: any;
  assetNameData: any = [];

  plPrivilege:string = "view"; //For menu privilege
  config = new Constant();
  tabs:any = [];  //For shwoing tabs
  adminPrivilege: boolean = false;
  allLabel: string[] = ["Asset type","Asset Category id","Asset item name","Asset movable","Asset fixed","Asset unit","Description","","",""];
  userId: any;
  profileId: any;

  constructor(public customValidator: CustomValidators,
    private formBuilder: FormBuilder,
    public manageAssetItemService: ManageAssetItemService,
    private route: Router,
    private router: ActivatedRoute,
    private alertHelper: AlertHelper,private spinner: NgxSpinnerService,
    public commonserviceService:CommonserviceService, 
    private privilegeHelper: PrivilegeHelper,  //For menu privilege
    private el:ElementRef,
    ) { 
      const pageUrl:any = this.route.url;  
      this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl, this.config.linkType[3]);  //For menu privilege    
      this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[3], this.config.privilege[4]);  // For authorization
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
    
    this.anexType = "ASSET_TYPE";
    this.commonserviceService
      .getAnextureType(this.anexType)
      .subscribe((data: any = []) => {
        this.annexData = data;
        this.anextureType = this.annexData.data;
      });
      this.commonserviceService
      .getIncentiveUnit()
      .subscribe((data: any = []) => {
        this.annexUnitData = data;
        this.annexUnitData = this.annexUnitData.data;
      });
      this.initializeForm();
      this.editAsset(this.id);
  }
  getAssetName(id: any) {   
    const assetTypeValue = id;
    this.editAssetItem.patchValue({assetCatId:''})
    this.editAssetItem.patchValue({assetItemName:''})
    this.assetNameData = []; 
     this.manageAssetItemService.getAssetnameByAssetId(assetTypeValue).subscribe((res:any) => {      
      let data: any = res;
         
      for (let key of Object.keys(data['data'])) {
        this.assetNameData.push(data['data'][key]);
      }
    });
  }
  initializeForm(){
    this.editAssetItem = this.formBuilder.group({
      assetType: [
        this.assetType,
        [Validators.required,Validators.pattern(/^[0-9]+$/)]
      ],
      assetCatId: [
        this.assetCatId,
        [Validators.required, Validators.pattern(/^[0-9]+$/)],
      ],
      assetItemName: [
        this.assetItemName,
        [Validators.required, Validators.maxLength(25),Validators.minLength(2),Validators.pattern(/^[a-zA-Z ]+$/),this.customValidator.firstCharValidatorRF],
      ],
      itemMovable: [
        this.itemMovable,
        [Validators.required, Validators.pattern(/^[0-9]+$/)],
      ],
      itemFixed: [
        this.itemFixed,
        [Validators.required, Validators.pattern(/^[0-9]+$/)],
      ], 
      itemUnit: [
        this.itemUnit,
        [Validators.required, Validators.pattern(/^[0-9]+$/)],
      ],
      assetDescription: [
        this.assetDescription,
        [Validators.maxLength(500)],
      ],
      userId:[this.userId],
      encId:[this.encId],
    })
  }
  get assetItemFormControl() {
    return this.editAssetItem.controls;
  
  }
  editAsset(id: any) {

    this.spinner.show();
    this.manageAssetItemService.getAssetItemData(this.id).subscribe((res: any) => {
      this.spinner.hide();
      this.assetItemData = res;
      this.assetItemData = this.assetItemData.data;
      this.assetType = this.assetItemData.assetType;
      this.assetCatId = this.assetItemData.assetCatId;
      this.assetItemName = this.assetItemData.assetItemName;
      this.assetItemCode = this.assetItemData.assetItemCode;
      this.itemMovable = this.assetItemData.itemMovable;
      this.itemFixed = this.assetItemData.itemFixed;
      this.itemUnit = this.assetItemData.itemUnit;
      this.assetDescription = this.assetItemData.assetDescription;
      this.encId = this.assetItemData.encId;
      this.getAssetName(this.assetType);
      this.initializeForm();
    });
  }
  onSubmit(){
    if ("INVALID" === this.editAssetItem.status) {
      for (const key of Object.keys(this.editAssetItem.controls)) {
        if (this.editAssetItem.controls[key].status === "INVALID") {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + key + '"]'
          );
          invalidControl.focus();
          this.customValidator.formValidationHandler(this.editAssetItem,this.allLabel);
          break;
        }
      }
    }

    if (this.editAssetItem.invalid) {
      this.customValidator.formValidationHandler(this.editAssetItem, this.allLabel, this.el);
    }

    if (this.editAssetItem.invalid) {
      return;
    }
    this.alertHelper.updateAlert().then((result) => {
      if (result.value) {
        this.spinner.show();
        this.manageAssetItemService
          .updateAssetItemData(this.editAssetItem.value)
          .subscribe({
            next: (res: any) => {
              this.spinner.hide();
              this.alertHelper
                .successAlert(
                  "Saved!",
                  "Asset item updated successfully.",
                  "success"
                )
                .then(() => {
                  this.initializeForm();
                  this.route.navigate(["../../viewAssetItem"], {
                    relativeTo: this.router,
                  });
                });
            },
            error: (error: any) => {
              this.spinner.hide();
              let errorMessage: string = "";
              error.error.msg.map(
                (message: string) =>
                (errorMessage +=
                  '<i class="bi bi-arrow-right text-danger"></i> ' +
                  message +
                  `<br>`)
              );
              this.alertHelper.viewAlertHtml(
                "error",
                "Invalid inputs",
                errorMessage
              );
            },
          });
      }
    });
  }
  onCancel()
  {
    this.route.navigate(["../../viewAssetItem"], {
      relativeTo: this.router,
    }); 
  }
}
