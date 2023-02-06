import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-edit-damage-lost-item',
  templateUrl: './edit-damage-lost-item.component.html',
  styleUrls: ['./edit-damage-lost-item.component.css']
})
export class EditDamageLostItemComponent implements OnInit {
  damageItemForm!: any;
  submitted = false;
  damageDate:any ="";
  assetType: any = "";
  assetName: any = "";
  quantity: any = "";
  reasonDamage: any = "";
  remark: any = "";
  assetNameS: any = "";
  assetNameChanged: boolean = false;
  assetData: any = [];
  assetFilterData: any[] = [];
  authorityLabels: string[] = this.getCustomizedLabelName("");
  singleField: boolean = true; // single row will not have action column
  userProfile: any = [];
  updatedBy: any = "";
  profileId: any = "";
  schoolId: any = "";
  id:any="";
  encId:any="";
  openingStockData:any ="";
  assetTypeChanged: boolean = false;
  unit:any="";
  unitChanged: boolean = false;
  annextureResults: any ="";
  asType: any =[];
  damageR: any =[];
  allLabel: string[] = [
    "Date",
    "Asset Type",
    "Asset Name",
    "Quantity",
    "Reason of Damage",
    "Remark",   
  ];
  incUnit: any =[];
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  constructor( private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private alertHelper: AlertHelper,
    private inventoryService: InventoryService,
    public customValidators: CustomValidators,
    private commonService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private route: Router,
    private router: ActivatedRoute,
    private el: ElementRef,) {
      const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization
     }

  ngOnInit(): void {
    this.spinner.show();
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    this.userProfile = this.commonService.getUserProfile();
    this.id = this.router.snapshot.params["encId"];
    this.initializeForm(); // initialize form   
    this.editOpeningStock(this.id);    
    this.getAssetType();  
    this.getAnnextureData();  
  }
  getAssetType() {
    this.assetNameChanged = true;
    this.spinner.show();
    this.inventoryService.getAssetType().subscribe({
      next: (data: any) => {
        this.assetData = data;
        this.assetData = this.assetData.data;
        this.assetNameChanged = false;
        this.spinner.hide();
      },
    });
  }

  filterAssetName(id: any) {  
      
    if (id !== "") {
      this.assetFilterData = this.assetData.filter((x: any) => {      
        return x.assetType === parseInt(id);
      });
    } else {
      this.assetFilterData = [];
    }
    this.damageItemForm.patchValue({
      assetName: ''
    });
  }
  initializeForm() {
    this.damageItemForm = this.formBuilder.group({
      damageDate: [this.damageDate, [Validators.required]],
      assetType: [this.assetType, [Validators.required]],
      assetName: [this.assetName, [Validators.required]],
      unit: [this.unit, [Validators.required]],
      quantity: [this.quantity,[Validators.required, Validators.pattern(/^[0-9\.]*$/)]],
      reasonDamage: [this.reasonDamage, [Validators.required]],
      remark: [this.remark,[Validators.required, Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/)]], 
      updatedBy: [this.userProfile.userId],
      schoolId: [this.userProfile.school], // store all data in this array
      encId: [this.id], 
      profileId: [this.userProfile.profileId],
    });
  }
  damageLostInfo() {
    return this.damageItemForm.get("damageItemArray") as FormArray;
  }
 
  // remove row
  removeRow(index: any) {
    this.assetFilterData.splice(index, 1);
    this.damageLostInfo().length > 1 &&
      this.damageLostInfo().removeAt(index);
    this.checkSingleField();
  }
  checkSingleField() {
    this.singleField = this.damageLostInfo()?.length > 1 ? false : true;
  }
  resetFormArray() {
    (this.damageItemForm.get("damageItemArray") as FormArray).clear();
  }
  resetForm() {
    this.resetFormArray();
  }
  getCustomizedLabelName(levelName: string) {
    return [
      `${levelName}  :- Asset Type`,
      `${levelName}  :- Asset Name`,
      `${levelName}  :- Unit`,
      `${levelName}  :- Quantity`,
      `${levelName}  :- Reason of damage`,
      `${levelName}  :- Remark`,
    ];
  }
  checkDuplicateLevel(): any {
    let allValueArray: Array<number> = [];
    let authorityLevelsArr = <FormArray>(
      this.damageItemForm.controls["damageItemArray"]
    );
    authorityLevelsArr.controls?.map(async (item: any, index: number) => {
      allValueArray.push(parseInt(item?.controls.assetName.value));
    });

    const uniqueSet = new Set(allValueArray);
    if (allValueArray.length != uniqueSet.size) {
      return true;
    } else {
      return false;
    }
  }
  
  editOpeningStock(id:any){
    this.inventoryService.getDamageItem(id).subscribe((resp: any) => {
      this.openingStockData = resp.data[0];
      this.damageDate = this.openingStockData.damageDate;
      this.assetType = this.openingStockData.assetType;
      this.assetName = this.openingStockData.assetName; 
      this.unit = this.openingStockData.unit;     
      this.quantity = this.openingStockData.quantity;     
      this.reasonDamage = this.openingStockData.reasonDamage;     
      this.remark = this.openingStockData.remark;     
      this.encId = this.openingStockData.encId;
      this.filterAssetName(this.assetType);
      
      this.initializeForm();
      this.spinner.hide();
    });
  }
  futuredateCheck(){
    let damDate = this.damageItemForm.controls['damageDate'].value;
    const newDate = new Date(); 
    if(damDate !=='')    
        if (formatDate(damDate,'yyyy-MM-dd','en_US') > formatDate(newDate,'yyyy-MM-dd','en_US')){
          this.alertHelper.viewAlert(
            "error",
            "Invalid",
            "Date must not be above today's date"
          );
           this.damageItemForm.patchValue({
            damageDate: ''
           });
        
        }
  }
  quantityCheckDamageItem() {
    let indexAssetType  = this.damageItemForm.value['assetType'];
    let indexAssetName = this.damageItemForm.value['assetName'];
    let indexQuantity = this.damageItemForm.value['quantity'];
    let indexschoolId = this.userProfile.school;
    let params ={assetType:indexAssetType,assetName:indexAssetName,quantity:indexQuantity,ischoolId:indexschoolId}
    this.inventoryService.quantityCheckDamageItem(params).subscribe({
      next: (data: any) => {
        if(data.excessQuantity == 1){
          this.spinner.hide();
          this.alertHelper.successAlert(
            "Invalid",
            "Damage Quantity is more than Stock!!",
            "error"
          );         
          this.damageItemForm.patchValue({
            quantity: '',
          });
         
        }return;
      },
     
    });
  }
  updateDamageItem(){
    this.submitted = true;
    if ("INVALID" === this.damageItemForm.status) {
      for (const key of Object.keys(this.damageItemForm.controls)) {
        if (this.damageItemForm.controls[key].status === "INVALID") {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + key + '"]'
          );
          invalidControl.focus();
          this.customValidators.formValidationHandler(
            this.damageItemForm,
            this.allLabel
          );
          break;
        }
      }
    }
    if (this.damageItemForm.valid == true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          this.inventoryService
            .updateDamageItem(this.damageItemForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Damage/Lost Item Updated successfully.",
                    "success"
                  )
                  .then(() => {
                    this.route.navigate(["../../viewDamageItem"], {
                      relativeTo: this.router,
                    });
                  });
              },
              error: (error: any) => {
                this.spinner.hide(); //==== hide spinner
                let errorMessage: string = "";
                if (typeof error.error.msg === "string") {
                  errorMessage +=
                    '<i class="bi bi-arrow-right text-danger"></i> ' +
                    error.error.msg +
                    `<br>`;
                } else {
                  error.error.msg.map(
                    (message: string) =>
                      (errorMessage +=
                        '<i class="bi bi-arrow-right text-danger"></i> ' +
                        message +
                        `<br>`)
                  );
                }
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
  getAnnextureData() {
    this.commonService
      .getCommonAnnexture(["ASSET_TYPE", "DAMAGE_REASON","INCENTIVE_UNIT"])
      .subscribe({
        next: (res: any) => {          
          this.spinner.hide();
          this.annextureResults = res;
          this.asType = res?.data?.ASSET_TYPE;
          this.damageR = res?.data?.DAMAGE_REASON;   
          this.incUnit =res?.data?.INCENTIVE_UNIT.sort((a: any, b: any) => (a.anxtName.toLowerCase() < b.anxtName.toLowerCase()) ? -1 : ((b.anxtName.toLowerCase() > a.anxtName.toLowerCase()) ? 1 : 0));    
        },
      });
  }
  /* Created By  : Debasis Patra ||  Created On : 24-08-2022  || Description : Check value must be greater than 0 */
  greaterThanZero(event: any) {
    if(event !=''){
      const  quantity = event;
      if(quantity == 0){
          this.alertHelper.viewAlert(
          "error",
          "Invalid",
          `Quantity must be greater than 0.`
        ); 
        this.damageItemForm.patchValue({
          quantity: '' 
        });  
        return;    
      }
    }
  }
}
