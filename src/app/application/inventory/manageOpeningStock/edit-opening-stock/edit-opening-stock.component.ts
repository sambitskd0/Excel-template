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
  selector: 'app-edit-opening-stock',
  templateUrl: './edit-opening-stock.component.html',
  styleUrls: ['./edit-opening-stock.component.css']
})
export class EditOpeningStockComponent implements OnInit {
  openingStock!: any;
  submitted = false;
  assetType: any = "";
  assetName: any = "";
  quantity: any = "";
  unit: any = "";
  eol: any = "";
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
  annextureResults: any ="";
  asType: any =[];
  incUnit: any =[];
  assetTypeChanged: boolean = false;
  unitChanged: boolean = false;
  allLabel: string[] = [    
    "Asset type",
    "Asset name",
    "Quantity",
    "Unit",
    "End of life (in years)",   
  ];
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
    this.openingStock.patchValue({
      assetName: ''
    });
  }
  initializeForm() {
    this.openingStock = this.formBuilder.group({
      assetType: [this.assetType, [Validators.required]],
      assetName: [this.assetName, [Validators.required]],
      quantity: [this.quantity, [Validators.required,Validators.pattern(/^[0-9]+$/)]],
      unit: [this.unit, [Validators.required]],
      eol: [this.eol, [Validators.required,Validators.pattern(/^[0-9]+$/),Validators.maxLength(3)]],
      updatedBy: [this.userProfile.userId],
      schoolId: [this.userProfile.school], // store all data in this array
      encId: [this.id], 
      profileId: [this.userProfile.profileId],
    });
  }

  openingStockInfo() {
    return this.openingStock.get("openingStockArray") as FormArray;
  }
 
  // remove row
  removeRow(index: any) {
    this.assetFilterData.splice(index, 1);
    this.openingStockInfo().length > 1 &&
      this.openingStockInfo().removeAt(index);
    this.checkSingleField();
  }
  checkSingleField() {
    this.singleField = this.openingStockInfo()?.length > 1 ? false : true;
  }
  resetFormArray() {
    (this.openingStock.get("openingStockArray") as FormArray).clear();
  }
  resetForm() {
    this.resetFormArray();
  }
  // ====== get customized label names
  getCustomizedLabelName(levelName: string) {
    return [
      `${levelName}  :- Asset type`,
      `${levelName}  :- Asset name`,
      `${levelName}  :- Quantity`,
      `${levelName}  :- Unit`,
      `${levelName}  :- End of life (in years)`,
    ];
  }
  
  checkDuplicateLevel(): any {
    let allValueArray: Array<number> = [];
    let authorityLevelsArr = <FormArray>(
      this.openingStock.controls["openingStockArray"]
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
    this.inventoryService.getOpeningStock(id).subscribe((resp: any) => {
      this.openingStockData = resp.data[0];
      this.assetType = this.openingStockData.assetType;
      this.assetName = this.openingStockData.assetName;     
      this.quantity = this.openingStockData.quantity;     
      this.unit = this.openingStockData.unit;     
      this.eol = this.openingStockData.eol;     
      this.encId = this.openingStockData.encId;
      this.filterAssetName(this.assetType);
      
      this.initializeForm();
      this.spinner.hide();
    });
  }
  updateStock() {
    this.submitted = true;
    if ("INVALID" === this.openingStock.status) {
      for (const key of Object.keys(this.openingStock.controls)) {
        if (this.openingStock.controls[key].status === "INVALID") {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + key + '"]'
          );
          invalidControl.focus();
          this.customValidators.formValidationHandler(
            this.openingStock,
            this.allLabel
          );
          break;
        }
      }
    }
    if (this.openingStock.valid == true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          this.inventoryService
            .updateOpeningStock(this.openingStock.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Opening stock updated successfully.",
                    "success"
                  )
                  .then(() => {
                    this.route.navigate(["../../viewOpeningStock"], {
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
  
  checkEndofLife(value:any){
    if(value !=''){
      const  endOfLife = value;
      if(endOfLife > 100){
       this.alertHelper.viewAlert(
         "error",
         "Invalid",
         "End of life (in years) can not be greater than 100 year"
       );
       this.openingStock.patchValue({
        eol: ''
      });      
       return;
      }
    }
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
        this.openingStock.openingStockInfo().patchValue({
          quantity: '' 
        });  
        return;    
      }
    }
  }
  getAnnextureData() {
    this.commonService
      .getCommonAnnexture(["ASSET_TYPE", "INCENTIVE_UNIT"])
      .subscribe({
        next: (res: any) => {          
          this.spinner.hide();
          this.annextureResults = res;
          this.asType = res?.data?.ASSET_TYPE;
          this.incUnit =res?.data?.INCENTIVE_UNIT.sort((a: any, b: any) => (a.anxtName.toLowerCase() < b.anxtName.toLowerCase()) ? -1 : ((b.anxtName.toLowerCase() > a.anxtName.toLowerCase()) ? 1 : 0));           
        },
      });
  }
}
