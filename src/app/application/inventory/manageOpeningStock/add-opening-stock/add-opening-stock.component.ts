import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { Constant } from "src/app/shared/constants/constant";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { InventoryService } from "../../services/inventory.service";

@Component({
  selector: "app-add-opening-stock",
  templateUrl: "./add-opening-stock.component.html",
  styleUrls: ["./add-opening-stock.component.css"],
})
export class AddOpeningStockComponent implements OnInit {
  openingStock!: any;
  submitted = false;
  assetType: any = "";
  assetName: any = "";
  quantity: any = "";
  unit: any = "";
  eol: any = "";
  assetNameS: any = "";
  assetNameChanged: boolean = false;
  assetTypeChanged: boolean = false;
  assetItemNameChanged: boolean = false;
  unitChanged: boolean = false;
  assetData: any = [];
  viewAssetData: any = [];
  assetFilterData: any[] = [];
  authorityLabels: string[] = this.getCustomizedLabelName("");
  singleField: boolean = true; // single row will not have action column
  userProfile: any = [];
  createdBy: any = "";
  profileId: any = "";
  schoolId: any = "";
  annextureResults: any ="";
  asType: any =[];
  incUnit: any =[];
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  
  assetItemData:any[] = [];
  assetItemName:any="";  
  assetItemNameD:any=[];
  asseItemNameC:any="";
  modalAssetItemName:any="";
  modalAssetItemCode:any=[];
  codeAvailable:any="";
  codeChange:any=[];
  qtyFrCode:any=[];
  eolShow: any=[];
  constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private alertHelper: AlertHelper,
    private inventoryService: InventoryService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    public customValidators: CustomValidators,
    private commonService: CommonserviceService,
   
  ) {
    const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For authorization

  }

  ngOnInit(): void {
    this.spinner.show();
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    this.userProfile = this.commonService.getUserProfile();
    this.initializeForm(); // initialize form
    this.addRow(0);
    this.getAssetType();
    this.getAnnextureData();
    // this.dupOpeningStock();
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
 

  filterAssetName(id: any, index: number) {
    let levelControl = <FormArray>this.openingStock.controls['openingStockArray'];
    if (id !== "") {
      this.assetFilterData[index] = this.assetData.filter((x: any) => {
      return x.assetType === parseInt(id);
      });
    } else {
      this.assetFilterData[index] = [];
    }
   levelControl.at(index).get('assetName')?.patchValue("");
   levelControl.at(index).get('assetItemName')?.patchValue("");
   levelControl.at(index).get("codeAvailable")?.patchValue("");
    levelControl.at(index).get('quantity')?.patchValue("");
    levelControl.at(index).get('unit')?.patchValue("");
    levelControl.at(index).get('eol')?.patchValue("");
  }
  filterAssetItem(assetCatId: any, index: number) {
    let levelControl = <FormArray>this.openingStock.controls["openingStockArray"];
    const paramObj = {assetCatId : assetCatId}
    if (assetCatId !== "") {
    this.inventoryService.getAssetItemName(paramObj).subscribe({
      next: (data: any) => {        
         this.assetItemData[index] = data.data;       
        this.assetItemNameChanged = false;
        this.spinner.hide();
      },
    });
   
    
      this.assetItemNameD[index]  = this.assetItemData[index]?.filter((x: any) => {    
      
      return x.assetItemId === parseInt(this.asseItemNameC);
    });
    this.modalAssetItemName = this.assetItemNameD[index]?.at(index)?.assetItemName;
    
    
  }else{
    this.assetItemData[index] = [];
  }
  // levelControl.at(index).get('assetName')?.patchValue("");
  levelControl.at(index).get('assetItemName')?.patchValue("");
  levelControl.at(index).get("codeAvailable")?.patchValue("");
   levelControl.at(index).get('quantity')?.patchValue("");
   levelControl.at(index).get('unit')?.patchValue("");
   levelControl.at(index).get('eol')?.patchValue(""); 
  }
  initializeForm() {
    this.openingStock = this.formBuilder.group({
      createdBy: [this.userProfile.userId],
      schoolId: [this.userProfile.school],
      udiseCode: [this.userProfile.udiseCode],
      openingStockArray: this.formBuilder.array([]), // store all data in this array
      profileId: [this.userProfile.profileId],
    });
  }

  // new row form data
  newOpeningStock() {
    return this.formBuilder.group({
      assetType: [this.assetType, [Validators.required]],
      assetName: [this.assetName, [Validators.required]],
      assetItemName: [this.assetItemName, [Validators.required]],
      assetItemNameData: [this.modalAssetItemName],
      assetItemNameCode: [this.modalAssetItemCode],
      quantity: [this.quantity, [Validators.required,Validators.pattern(/^[0-9]+$/)]],
      codeAvailable: [this.codeAvailable, [Validators.required]],
      unit: [this.unit, [Validators.required]],
      eol: [this.eol, [Validators.pattern(/^[0-9]+$/),Validators.maxLength(3)]],    //Validators.required,  
    });
  }
  dupOpeningStock() {
    //this.assetNameChanged = true;     
    this.inventoryService.dupOpeningStock(this.openingStock.value).subscribe({
      next: (data: any) => {
        if(data.duplicate == 1){
          this.spinner.hide();
          this.alertHelper.successAlert(
            "Invalid",
            "Asset type and asset name already exists !!",
            "error"
          );
        }else{
          this.validateSubmitStock();
        }
        
       
      },
     
    });
  }
  // show number of row according to preServiceEducationalInfoArray items
  openingStockInfo() {
    return this.openingStock.get("openingStockArray") as FormArray;
  }

  addRow(index: any) {
    let emptyRow: Boolean = false;
    this.openingStockInfo()?.controls?.map((item: any, index: number) => {
      if (emptyRow === true) return;
      if (item?.invalid) {
        this.alertHelper.successAlert(
          "Invalid",
          "All the fields are mandatory.",
          "error"
        );
        emptyRow = true;
      }
    });
    if (emptyRow === false) {
      this.openingStockInfo().insert(index + 1, this.newOpeningStock());
      
    }
  }
  // remove row
  removeRow(index: any) {
    this.assetFilterData.splice(index, 1);
    if(this.openingStockInfo().length === 1){
      this.resetForm();
      this.assetItemData = [];
    }
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
    this.addRow(0);
    this.assetFilterData=[];
   this.assetItemData=[];
  }
  // ====== get customized label names
  getCustomizedLabelName(levelName: string) {
    return [
      `${levelName}  :- Asset type`,
      `${levelName}  :- Asset name`,
      `${levelName}  :- Asset item name`,
      `${levelName}  :- ''`,
      `${levelName}  :- ''`,
      `${levelName}  :- Quantity`,
      `${levelName}  :- Is code available`,
      `${levelName}  :- Unit`,
      // `${levelName}  :- End Of Life (In Years)`,
    ];
  }
  validateSubmitStock() {
    Promise.all([this.validateStockForm(), this.checkDuplicateLevel()]).then(
      (value) => {
        
        const formErrors = value[0];
        const checkDuplicateLevelError = value[1];
        if (checkDuplicateLevelError === true) {
          this.alertHelper.successAlert(
            "Invalid",
            "Duplicate asset name can not be selected !!!",
            "error"
          );
        } else {
          let formInvalid: any = false;
          formErrors.map((item: any) => {
            if (item !== false) {
              formInvalid = true;
            }
          });
          formInvalid === false && this.submitStock();
        }
      }
    );
  }
  checkDuplicateLevel(): any {
    let allValueArray: Array<number> = [];
    let authorityLevelsArr = <FormArray>(
      this.openingStock.controls["openingStockArray"]
    );
    authorityLevelsArr.controls?.map(async (item: any, index: number) => {
      allValueArray.push(parseInt(item?.controls.assetItemName.value));
    });

    const uniqueSet = new Set(allValueArray);
    if (allValueArray.length != uniqueSet.size) {
      return true;
    } else {
      return false;
    }
  }
  validateStockForm() {
    let allErrors: any = [];
    let authorityLevelsArr = <FormArray>(
      this.openingStock.controls["openingStockArray"]
    );
    authorityLevelsArr.controls?.map((item: any, index: number) => {
      this.authorityLabels = this.getCustomizedLabelName(
        "SlNo. " + (index + 1)
      );
      let errors = this.customValidators.formValidationHandler(
        item,
        this.authorityLabels
      );
      allErrors.push(errors);
    });    
    return allErrors;
  }
  submitStock() {
    this.submitted = true;
    
    if (this.openingStock.valid == true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          this.inventoryService
            .addOpeningStock(this.openingStock.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Opening stock added successfully.",
                    "success"
                  )
                  .then(() => {
                    this.initializeForm();
                    this.resetForm();
                    this.assetFilterData=[];
                    this.assetItemData=[];
                    // this.showLevel = false;
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
          // this.incUnit = res?.data?.INCENTIVE_UNIT;          
          this.incUnit =res?.data?.INCENTIVE_UNIT.sort((a: any, b: any) => (a.anxtName.toLowerCase() < b.anxtName.toLowerCase()) ? -1 : ((b.anxtName.toLowerCase() > a.anxtName.toLowerCase()) ? 1 : 0));          
        },
      });
  }
//Used to generate multiple row if code available choose yes.
  codeAvailableChange(index: number){
    //this.codeChange = id;
    const checkStockArr: FormArray = this.openingStock.get(
      "openingStockArray"
    ) as FormArray;
    //console.log(checkStockArr?.at(index)?.get('codeAvailable')?.value);
    const codeChngVal = checkStockArr?.at(index)?.get('codeAvailable')?.value;
    if(codeChngVal === '1'){
      this.codeChange[index] = true // display view code badge   
      this.asseItemNameC = checkStockArr?.at(index)?.get('assetItemName')?.value;
      this.assetItemNameD[index]  = this.assetItemData[index].filter((x: any) => {      
        return x.assetItemId === parseInt(this.asseItemNameC);
      });
    // this.modalAssetItemName = this.assetItemNameD[index]?.at(index).assetItemName;
      
       this.qtyFrCode[index] = checkStockArr?.at(index)?.get('quantity')?.value; // get quantity to generate code    
      
    }else{
      this.codeChange[index] = false // hide view code badge      
    }
  
  }
  //this function use to for loop in the front-end
  counter(i: number) {    
   
    return new Array(i);
  }
  codeChangeWiseEvnt(val:any,index:any){  
    if(val == 1){      
      this.eolShow[index] = false;
    }else{     
    this.eolShow[index] = true;
    }
    
  }
}
