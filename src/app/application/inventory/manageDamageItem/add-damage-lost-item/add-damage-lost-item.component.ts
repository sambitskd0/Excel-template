import { formatDate } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { Constant } from "src/app/shared/constants/constant";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { InventoryService } from "../../services/inventory.service";

@Component({
  selector: "app-add-damage-lost-item",
  templateUrl: "./add-damage-lost-item.component.html",
  styleUrls: ["./add-damage-lost-item.component.css"],
})
export class AddDamageLostItemComponent implements OnInit {
  damageItemForm!: any;
  damageItemModalForm!: any;
  submitted = false;
  userProfile: any = [];
  createdBy: any = "";
  profileId: any = "";
  schoolId: any = "";
  blockId: any = "";
  damageDate: any = "";
  assetType: any = "";
  assetName: any = "";
  quantity: any = "";
  reasonDamage: any = "";
  remark: any = "";
  assetNameS: any = "";
  assetNameChanged: any = "";
  assetData: any = "";
  assetFilterData: any[] = [];
  singleField: boolean = true; // single row will not have action column
  authorityLabels: string[] = this.getCustomizedLabelName("");
  allLabel: string[] = ["Date"];
  assetTypeChanged: boolean = false;
  unit: any = "";
  unitChanged: boolean = false;
  annextureResults: any = "";
  asType: any = [];
  damageR: any = [];
  maxDate: any = Date;
  incUnit: any = [];
  unitData: any = [];
  totalStockChanged: boolean = false;
  totalStock: any = [];
  stockFilterData: any[] = [];
  totalStockValue: any[] = [];
  unitOfStock:any=[];
  stockUnitData:any=[];
  unitEach: any[] = [];
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  assetItemData:any[] = [];
  assetItemNameD:any=[];
  asseItemNameC:any="";
  modalAssetItemName:any="";
  modalAssetItemCode:any=[];
  assetItemName:any="";
  codeChange:boolean= false;
  codeAvailable:any="";
  assetT:any="";
  assetN:any="";
  assetIN:any="";
  assetCd:any="";
  arrayIndex:any="";
  checkArr:any="";
  chackedItemFromModal:any="";
  chackedItemCode:any="";

  checkRec:any=[];
  finalCheckRec:any=[];
  index:any="";
  itemCodeData:any=[];
  codeChangeArr:any=[];
  selectedData:any=[];
  selectedCheckValue:any=[];
  damItemArray:any=[];
  chkRec:any=[];
  checkAll: boolean = false;
  chkItem: boolean = false;
  checkAllStatus: boolean = false;
  chkStatus: any = "";
  @ViewChild('CheckItemModalClose') CheckItemModalClose!:any;
  constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private alertHelper: AlertHelper,
    private inventoryService: InventoryService,
    public customValidators: CustomValidators,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private commonService: CommonserviceService,
    private el: ElementRef
  ) {
    const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For authorization
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    // this.spinner.show();
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    this.userProfile = this.commonService.getUserProfile();
    this.initializeForm(); // initialize form
    this.initializeFormModal();
    this.addRow(0);
    this.getAssetType();
    this.getInvnTotalStock();
    this.getUnitofStock();
    this.getAnnextureData();
    this.el.nativeElement.querySelector("[formControlName=damageDate]").focus();
  }
  initializeForm() {
    this.damageItemForm = this.formBuilder.group({
      damageDate: [this.damageDate, [Validators.required]],
      createdBy: [this.userProfile.userId],
      schoolId: [this.userProfile.school],
      // blockId: [this.userProfile.block],
      damageItemArray: this.formBuilder.array([]), // store all data in this array
      profileId: [this.userProfile.profileId],
      // checkAll: [this.checkAll],
      // checkRecordArr: this.formBuilder.array([], [Validators.required]),
      // checkArr:[this.checkArr]
    });
  }
  initializeFormModal(){
    this.damageItemModalForm = this.formBuilder.group({
    checkRec:this.formBuilder.array(this.checkRec, [Validators.required]),
    // finalCheckRec:this.formBuilder.array(this.finalCheckRec, [Validators.required]),
    index: [this.index],
    // checkAll: [this.checkAll],
    checkAll: [true],
     });
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
    let levelControl = <FormArray>(
      this.damageItemForm.controls["damageItemArray"]
    );
    if (id !== "") {
      this.assetFilterData[index] = this.assetData.filter((x: any) => {
        return x.assetType === parseInt(id);
      });
    } else {
      this.assetFilterData[index] = [];
    }
    levelControl.at(index).get("assetName")?.patchValue("");
    levelControl.at(index).get("assetItemName")?.patchValue("");
    levelControl.at(index).get("codeAvailable")?.patchValue("");
    levelControl.at(index).get("unit")?.patchValue("");
    levelControl.at(index).get("quantity")?.patchValue("");
    levelControl.at(index).get("reasonDamage")?.patchValue("");
    levelControl.at(index).get("remark")?.patchValue("");
  }
  filterAssetItem(assetCatId: any, index: number) {
    let levelControl = <FormArray>this.damageItemForm.controls["damageItemArray"];
    const paramObj = {assetCatId : assetCatId}
    if (assetCatId !== "") {
    this.inventoryService.getAssetItemName(paramObj).subscribe({
      next: (data: any) => {        
         this.assetItemData[index] = data.data;       
        this.assetNameChanged = false;
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
    
  }
  // new row form data
  newDamageItem() {
    return this.formBuilder.group({
      assetType: [this.assetType, [Validators.required]],
      assetName: [this.assetName, [Validators.required]],
      assetItemName: [this.assetItemName, [Validators.required]],      
      unit: [this.unit, [Validators.required]],
      codeAvailable: [this.codeAvailable, [Validators.required]],
      quantity: [
        this.quantity,
        [Validators.required, Validators.pattern(/^[0-9\.]*$/)],
      ],
      reasonDamage: [this.reasonDamage, [Validators.required]],
      remark: [
        this.remark,
        [Validators.required, Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/)],
      ],
      chackedItemFromModal: [this.chackedItemFromModal ],  
      chackedItemCode: [this.chackedItemCode],  
      checkAllStatus: [this.checkAllStatus],  
    });
  }
  damageLostInfo() {
    return this.damageItemForm.get("damageItemArray") as FormArray;
  }
  addRow(index: any) {
    let emptyRow: Boolean = false;
    this.damageLostInfo()?.controls?.map((item: any, index: number) => {
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
      this.damageLostInfo().insert(index + 1, this.newDamageItem());
    }
  }
  removeRow(index: any) {
    this.assetFilterData.splice(index, 1);
    if (this.damageLostInfo().length === 1) {
      this.resetForm();
    }
    this.damageLostInfo().length > 1 && this.damageLostInfo().removeAt(index);
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
    this.addRow(0);
    this.damageItemForm.patchValue({damageDate: ''});

  }
  // ====== get customized label names
  getCustomizedLabelName(levelName: string) {
    return [
      `${levelName}  :- Asset type`,
      `${levelName}  :- Asset name`,
      `${levelName}  :- Asset item name`,
      `${levelName}  :- Unit`,
      `${levelName}  :- Code available`,
      `${levelName}  :- Quantity`,
      `${levelName}  :- Reason of damage`,
      `${levelName}  :- Remark`,
      `${levelName}  :- Atleast select one damage item`,
      `${levelName}  :- Atleast select one damage item`,
      `${levelName}  :- Check all on damage item`,
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
      this.damageItemForm.controls["damageItemArray"]
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
      this.damageItemForm.controls["damageItemArray"]
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

    let staticErrors = this.customValidators.formValidationHandler(
      this.damageItemForm,
      this.allLabel
    );
    allErrors.push(staticErrors);

    return allErrors;
  }
  futuredateCheck() {
    let damDate = this.damageItemForm.controls["damageDate"].value;
    const newDate = new Date();
    if (damDate !== "")
      if (
        formatDate(damDate, "yyyy-MM-dd", "en_US") >
        formatDate(newDate, "yyyy-MM-dd", "en_US")
      ) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Date must not be above today's date"
        );
        this.damageItemForm.patchValue({
          damageDate: "",
        });
      }
  }
  dupDamageItem() {
    //this.assetNameChanged = true;
    this.inventoryService.dupDamageItem(this.damageItemForm.value).subscribe({
      next: (data: any) => {
        if (data.duplicate == 1) {
          this.spinner.hide();
          this.alertHelper.successAlert(
            "Invalid",
            "Asset type and asset name already exists !!",
            "error"
          );
          return;
        } else {
          this.validateSubmitStock();
        }
      },
    });
  }
  quantityCheckDamageItem(index: any) {
    let indexAssetType = this.damageLostInfo().at(index).value["assetType"];
    let indexAssetName = this.damageLostInfo().at(index).value["assetName"];
    let indexQuantity = this.damageLostInfo().at(index).value["quantity"];
    let indexschoolId = this.userProfile.school;
    let params = {
      assetType: indexAssetType,
      assetName: indexAssetName,
      quantity: indexQuantity,
      ischoolId: indexschoolId,
    };
    this.inventoryService.quantityCheckDamageItem(params).subscribe({
      next: (data: any) => {
        if (data.excessQuantity == 1) {
          this.spinner.hide();
          this.alertHelper.successAlert(
            "Invalid",
            "Damage quantity is more than stock!!",
            "error"
          );
          this.damageLostInfo().at(index).patchValue({
            quantity: "",
          });
        }
        return;
      },
    });
  }
  submitStock() {
    this.submitted = true;
    console.log(this.damageItemForm.value,"final dev");
    if (this.damageItemForm.valid == true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          this.inventoryService
            .addDamageItem(this.damageItemForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Damage/lost item added successfully.",
                    "success"
                  )
                  .then(() => {
                    this.initializeForm();
                    this.resetForm();
                    this.assetFilterData  =[];
                  this.assetItemData =[];
                  this.totalStockValue =[];
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
  getAnnextureData() {
    this.commonService
      .getCommonAnnexture(["ASSET_TYPE", "DAMAGE_REASON", "INCENTIVE_UNIT"])
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          this.annextureResults = res;
          this.asType = res?.data?.ASSET_TYPE;
          this.damageR = res?.data?.DAMAGE_REASON;
          this.incUnit = res?.data?.INCENTIVE_UNIT.sort((a: any, b: any) => (a.anxtName.toLowerCase() < b.anxtName.toLowerCase()) ? -1 : ((b.anxtName.toLowerCase() > a.anxtName.toLowerCase()) ? 1 : 0));  
          this.incUnit.forEach((value:any) => {
            this.unitData[value.anxtValue] = value.anxtName;                
        });  
        },
      });
  }
  /* Created By  : Debasis Patra ||  Created On : 24-08-2022  || Description : Check value must be greater than 0 */
  greaterThanZero(event: any) {
    if (event != "") {
      const quantity = event;
      if (quantity == 0) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          `Quantity must be greater than 0.`
        );
        this.damageItemForm.patchValue({
          quantity: "",
        });
        return;
      }
    }
  }
  getInvnTotalStock() {
    this.totalStockChanged = true;
    this.spinner.show();
    let paramList: any = { schoolId: this.userProfile.school};
    this.inventoryService.getTotalStock(paramList).subscribe({
      next: (res: any) => {
        this.totalStock = res?.data;
        this.totalStockChanged = false;
        this.spinner.hide();
      },
    });
  }
  getTotalStock(id: any, index: number) {
   
    let stockControl = <FormArray>(
      this.damageItemForm.controls["damageItemArray"]
    );
    if (id !== "") {
      this.stockFilterData[index] = this.totalStock.filter((x: any) => {
        return x.assetItemId === parseInt(id);
      });
    } else {
      this.stockFilterData[index] = [];
    }
    if (this.stockFilterData.length > 0) {
      this.stockFilterData.forEach((value: any, i: any) => {
        this.totalStockValue[i] = value[0]?.totalstock || "NA";
      });
    }
  }
  getUnitofStock() {
    this.spinner.show();
    let paramList: any = { schoolId: this.userProfile.school };
    this.inventoryService.getUnitofStock(paramList).subscribe({
      next: (res: any) => {
        this.unitOfStock = res?.data;
        this.spinner.hide();
      },
    });
  }
  getUnit(id: any, index: number) {   
    let stockControl = <FormArray>(
      this.damageItemForm.controls["damageItemArray"]
    );
    if (id !== "") {
      this.stockUnitData[index] = this.unitOfStock.filter((x: any) => {        
        return x.assetName === parseInt(id);
      });
     
    } else {
      this.stockUnitData[index] = [];
    }
    const patchData:any=[];
    if (this.stockUnitData.length > 0) {
      this.stockUnitData.forEach((value: any, i: any) => {       
        this.unitEach[i] = value[0]?.unit;              
        patchData.push({unit: this.unitEach[i]});
      });
      stockControl.patchValue(patchData);
    }
  }
  codeAvailableChange(index: number){
    this.damItemArray=[];
    const damageItemArray: FormArray = this.damageItemForm.get(
      "damageItemArray"
    ) as FormArray; 
    this.damItemArray= this.damageItemForm.get(
      "damageItemArray"
    ) as FormArray; 
    this.codeChangeArr[index] = index;
    const codeChngVal = damageItemArray?.at(index)?.get('codeAvailable')?.value;
    this.assetT = damageItemArray?.at(index)?.get('assetType')?.value;
    this.assetN= damageItemArray?.at(index)?.get('assetName')?.value;
    this.assetIN= damageItemArray?.at(index)?.get('assetItemName')?.value;
    this.assetCd= damageItemArray?.at(index)?.get('codeAvailable')?.value;
    if ((codeChngVal === '1') ) {
      this.codeChangeArr[index] = true // display view code badge   
      this.damItemArray?.at(index)?.controls["chackedItemCode"].setValidators([
        Validators.required,
      ]);
      this.damItemArray?.at(index)?.controls["chackedItemFromModal"].setValidators([
        Validators.required,
      ]);
      this.damItemArray?.at(index)?.controls["chackedItemCode"].updateValueAndValidity();
      this.damItemArray?.at(index)?.controls["chackedItemFromModal"].updateValueAndValidity();
    } else {
      this.codeChangeArr[index] = false // hide view code badge   
      this.selectItemModal(index);
      this.damItemArray?.at(index)?.controls["chackedItemCode"].setValidators([
        Validators.nullValidator
      ]);
      this.damItemArray?.at(index)?.controls["chackedItemFromModal"].setValidators([
        Validators.nullValidator
      ]);
      this.damItemArray?.at(index)?.controls["chackedItemCode"].updateValueAndValidity();
      this.damItemArray?.at(index)?.controls["chackedItemFromModal"].updateValueAndValidity();
    }
  }
  resetModalArray(){
    (this.damageItemModalForm.get("checkRec") as FormArray).clear();
  }
  selectItemModal(index:any){
    this.itemCodeData=[];
    const damageItemArray: FormArray = this.damageItemForm.get(
      "damageItemArray"
    ) as FormArray;   
      this.assetT = damageItemArray?.at(index)?.get('assetType')?.value;
      this.assetN= damageItemArray?.at(index)?.get('assetName')?.value;
      this.assetIN= damageItemArray?.at(index)?.get('assetItemName')?.value;
      this.assetCd= damageItemArray?.at(index)?.get('codeAvailable')?.value;
      this.selectedCheckValue= damageItemArray?.at(index)?.get('chackedItemCode')?.value;
      this.chkStatus= damageItemArray?.at(index)?.get('checkAllStatus')?.value;
      this.checkAll=this.chkStatus;
      this.damageItemModalForm.get("checkAll")?.patchValue(this.chkStatus);
    this.arrayIndex=index;
    let paramList: any = {assetT: this.assetT,assetN :this.assetN ,assetIN: this.assetIN,assetCd:this.assetCd, schoolId: this.userProfile.school };
    // this.resetModalArray()
    (this.damageItemModalForm.get("checkRec") as FormArray).clear();

    this.inventoryService.selectItemModal(paramList).subscribe({
      next: (res: any) => {
        this.itemCodeData =res?.data;
        this.damageItemModalForm.patchValue({
          index:index,
        });
        if(this.itemCodeData?.length){
          this.itemCodeData.map((item: any) => {
            this.assetCodeChk().push(
              this.formBuilder.group({
                checkItem: [
                  {
                    value: this.selectedCheckValue.includes(item.assetItemCode),
                    disabled: false,
                  },
                ],
                assetItemCode: [item.assetItemCode],
                assetItemName: [item.assetItemName],
                createdOn: [ item.createdOn],
                eol: [item.eol],

              })
            );
         
          });
        }
        this.spinner.hide();
      },
    });

  }
  checkUncheckAll(arrayIndex:any) {
    const checkRec: FormArray = this.damageItemModalForm.get(
      "checkRec"
    ) as FormArray; 
    if (this.damageItemModalForm.get("checkAll")?.value !== true) {
      let checkItem = true;
      this.checkAll = true;
      this.damageItemModalForm.get("checkAll")?.patchValue(checkItem);
      checkRec?.controls?.map((item: any,arIndex:any) => { 
        item.get("checkItem")?.patchValue(checkItem);
        if(item.get("checkItem").value==true){
          this.selectedData.push(item.get("assetItemCode").value)
        }
      });
    } else {
      let checkItem = false;
      this.checkAll = false;
      this.damageItemModalForm.get("checkAll")?.patchValue(checkItem);
      checkRec?.controls?.map((item: any,arIndex:any) => { 
        item.get("checkItem")?.patchValue(checkItem);
        if(item.get("checkItem").value==true){
          this.selectedData.push(item.get("assetItemCode").value)
        }
        else{
          this.selectedData=[];
        }
      });
    }
  }
  singlecheckUncheck(event:any){
    const checkRec: FormArray = this.damageItemModalForm.get(
      "checkRec"
    ) as FormArray;
    this.chkRec = this.damageItemModalForm.get(
      "checkRec"
    ) as FormArray;
    const selectData:any=[];
    const totalData:any=[];
    let chkItemTrue = true;
    let chkItemFalse = false;
    if(this.chkRec?.at(event)?.get("checkItem")?.value==true){
      this.chkRec?.at(event)?.get("checkItem")?.patchValue(chkItemFalse);
    }else{
      this.chkRec?.at(event)?.get("checkItem")?.patchValue(chkItemTrue);
    }
    checkRec?.controls?.map((subItem:any) => {
       totalData.push(subItem.get("assetItemCode").value)
      if(subItem.get("checkItem").value==true){      
        selectData.push(subItem.get("assetItemCode").value)
      }
    });
    if(selectData.length==totalData.length){
      let checkItem = true;
      this.checkAll = true;
      this.damageItemModalForm.get("checkAll")?.patchValue(checkItem);
    }else{
      let checkItem = false;
      this.checkAll = false;
      this.damageItemModalForm.get("checkAll")?.patchValue(checkItem);
    }
  }
  onSubmitChk(){
    this.selectedData=[];
    const damageItemArray: FormArray = this.damageItemForm.get(
      "damageItemArray"
    ) as FormArray;   
    const checkRec: FormArray = this.damageItemModalForm.get(
      "checkRec"
    ) as FormArray; 
  const arrayIndex=  this.damageItemModalForm?.get('index')?.value;
  this.alertHelper.submitAlert().then((result:any) => {
      if (result.value) {
        checkRec?.controls?.map((item: any,arIndex:any) => { 
          if(item.get("checkItem").value==true){
            this.selectedData.push(item.get("assetItemCode").value)
          }
        });
        if(this.selectedData.length>0){
          damageItemArray?.at(arrayIndex)?.patchValue({
            chackedItemCode: this.selectedData,
          });
          damageItemArray?.at(arrayIndex)?.patchValue({
            chackedItemFromModal: this.damageItemModalForm.get("checkRec")?.value,
          });
          damageItemArray?.at(arrayIndex)?.patchValue({
            quantity: this.selectedData.length,
          });
          damageItemArray?.at(arrayIndex)?.patchValue({
            checkAllStatus: this.damageItemModalForm.get("checkAll")?.value,
          });
          this.alertHelper
            .successAlert(
              "Saved!",
              "Damage  item list Added",
              "success"
            )
            .then(() => {
              this.CheckItemModalClose.nativeElement.click();
          });
        }else{
          this.alertHelper.viewAlert(
            "error",
            "Invalid",
            "Please select atleast one record"
          );
        }
       
      }
  });
  
  }
  assetCodeChk(): FormArray {
    return this.damageItemModalForm.get("checkRec") as FormArray;
  }
}
