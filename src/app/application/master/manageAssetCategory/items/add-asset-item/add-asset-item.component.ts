import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageAssetItemService } from '../../../services/manage-asset-item.service';
import { Router } from '@angular/router';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { Constant } from 'src/app/shared/constants/constant';

@Component({
  selector: 'app-add-asset-item',
  templateUrl: './add-asset-item.component.html',
  styleUrls: ['./add-asset-item.component.css']
})
export class AddAssetItemComponent implements OnInit {
addAssetItem!: FormGroup;

annexUnitData:any=""
submitted = false;
isSelect:boolean=true;
allErrorMessages: string[] = [];
allLabel: string[] = ["Asset type","Asset name","Asset item name","Asset movable","Asset fixed","Asset unit","Description","",""];
assetType:any="";
assetCatId:any = "";
assetItemName:string = "";
itemMovable:any = "";
itemFixed:any = "";
itemUnit:any = "";
assetDescription:any = "";
assetTypeData:any = [];
anexType: any;
annexData: any;
anextureType: any;
assetNameData: any = [];
showSpinnerBlock: boolean = false;
adminPrivilege: boolean = false;
plPrivilege:string = "view"; //For menu privilege
config = new Constant();
tabs:any = [];  //For shwoing tabs
  userId: any;
  profileId: any;

  constructor(
    private alertHelper:AlertHelper,
    private formBuilder:FormBuilder,
    public customValidator:CustomValidators,
    public manageAssetItemService: ManageAssetItemService,
    private spinner: NgxSpinnerService,
    public commonserviceService:CommonserviceService, 
    private router:Router,
    private privilegeHelper: PrivilegeHelper,  //For menu privilege
    private el:ElementRef,
  ) { 
      const pageUrl:any = this.router.url;  
      this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl, this.config.linkType[3]);  //For menu privilege    
      this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[3], this.config.privilege[4]);  // For authorization
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
    this.anexType = "ASSET_TYPE";
    this.commonserviceService
      .getAnextureType(this.anexType)
      .subscribe((data: any = []) => {
        this.annexData = data;
        this.anextureType = this.annexData.data.sort((a: any, b: any) => (a.anxtName.toLowerCase() < b.anxtName.toLowerCase()) ? -1 : ((b.anxtName.toLowerCase() > a.anxtName.toLowerCase()) ? 1 : 0));
      });
      
      this.commonserviceService
      .getIncentiveUnit()
      .subscribe((data: any = []) => {
        this.annexUnitData = data;
        this.annexUnitData = this.annexUnitData.data.sort((a: any, b: any) => (a.anxtName.toLowerCase() < b.anxtName.toLowerCase()) ? -1 : ((b.anxtName.toLowerCase() > a.anxtName.toLowerCase()) ? 1 : 0));
      });
  }
  initializeForm(){
    this.addAssetItem = this.formBuilder.group({
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
        [Validators.required, Validators.maxLength(50),Validators.minLength(2),Validators.pattern(/^[a-zA-Z ]+$/),this.customValidator.firstCharValidatorRF],
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
      profileId:[this.profileId],
    })
  }

  getAssetName(id: any) {   
    const assetTypeValue = id;
    this.assetNameData = []; 
     this.manageAssetItemService.getAssetnameByAssetId(assetTypeValue).subscribe((res:any) => {      
      let data: any = res;         
      for (let key of Object.keys(data['data'])) {
        this.assetNameData.push(data['data'][key]);
      }
    });
  }

  get assetItemFormControl() {
    return this.addAssetItem.controls;
  }
  onSubmit(){
    if ("INVALID" === this.addAssetItem.status) {
      for (const key of Object.keys(this.addAssetItem.controls)) {
        if (this.addAssetItem.controls[key].status === "INVALID") {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + key + '"]'
          );
          invalidControl.focus();
          this.customValidator.formValidationHandler(this.addAssetItem,this.allLabel);
          break;
        }
      }
    }

    if (this.addAssetItem.invalid) {
      this.customValidator.formValidationHandler(this.addAssetItem, this.allLabel, this.el);
    }

    if (this.addAssetItem.invalid) {
      return;
    }

    if (this.addAssetItem.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          this.manageAssetItemService
            .createAssetItem(this.addAssetItem.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Asset item created successfully.",
                    "success"
                  )
                  .then(() => {
                    this.initializeForm();
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
  }
}
