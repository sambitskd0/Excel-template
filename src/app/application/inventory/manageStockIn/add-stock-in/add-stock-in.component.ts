import { formatDate } from "@angular/common";
import { Component, ElementRef, OnInit } from "@angular/core";
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
  selector: "app-add-stock-in",
  templateUrl: "./add-stock-in.component.html",
  styleUrls: ["./add-stock-in.component.css"],
})
export class AddStockInComponent implements OnInit {
  stockIn!: any;
  submitted = false;
  userProfile: any = [];
  createdBy: any = "";
  profileId: any = "";
  schoolId: any = "";
  blockId: any = "";
  approvalBy: any = "";
  invoiceNo: any = "";
  invoiceDate: any = "";
  invoiceImage: any = "";
  assetType: any = "";
  assetName: any = "";
  quantity: any = "";
  unit: any = 0;
  unitPrice: any = "";
  amount: any = 0;
  eol: any = "";
  assetNameS: any = "";
  assetNameChanged: any = "";
  assetData: any = "";
  assetFilterData: any[] = [];
  singleField: boolean = true; // single row will not have action column
  authorityLabels: string[] = this.getCustomizedLabelName("");
  invoiceAmount: any = "";
  allLabel: string[] = ["Approval By", "Invoice Number", "Invoice Date","Upload Invoice"];
  fileSource!:File;
  invoiceTotalAmt:any="";
  annextureResults: any ="";
  asType: any =[];
  incUnit: any =[];
  assetTypeChanged: boolean = false;
  assetItemNameChanged: boolean = false;
  unitChanged: boolean = false; 
  maxDate: any = Date;
  unitOfStock:any=[];
  stockUnitData:any=[];
  unitEach: any[] = [];
  endOfLife: any[] = [];
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  assetItemData:any[] = [];
  assetItemName:any="";
  codeAvailable:any="";
  codeChange:boolean= false;
  qtyFrCode:any="";
  assetItemNameD:any=[];
  asseItemNameC:any="";
  modalAssetItemName:any="";
  modalAssetItemCode:any=[];
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
  ) {const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For authorization
    this.maxDate = new Date();}

  ngOnInit(): void {
    // this.spinner.show();
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    this.userProfile = this.commonService.getUserProfile();
    this.initializeForm(); // initialize form
    this.addRow(0);
    this.getAssetType();
    this.getAnnextureData();
    this.getUnitofStock();
    this.el.nativeElement.querySelector("[formControlName=approvalBy]").focus();
  }
  initializeForm() {
    this.stockIn = this.formBuilder.group({
      approvalBy: [this.approvalBy, [Validators.required]],
      invoiceNo: [this.invoiceNo, [Validators.required,Validators.pattern(/^[a-zA-Z0-9.-/ ]*$/),Validators.maxLength(20)]],
      invoiceDate: [this.invoiceDate, [Validators.required]],
      invoiceImage: [this.invoiceImage, [Validators.required]],
      createdBy: [this.userProfile.userId],
      udiseCode: [this.userProfile.udiseCode],
      schoolId: [this.userProfile.school],
      blockId: [this.userProfile.block],
      fileSource: [''],
      invoiceTotalAmt: [''],
      stockInArray: this.formBuilder.array([]), // store all data in this array
      profileId: [this.userProfile.profileId],
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
    let levelControl = <FormArray>this.stockIn.controls["stockInArray"];
    if (id !== "") {
      this.assetFilterData[index] = this.assetData.filter((x: any) => {
        return x.assetType === parseInt(id);
      });
    } else {
      this.assetFilterData[index] = [];      
    }
    levelControl.at(index).get("assetName")?.patchValue("");
    levelControl.at(index).get("assetItemName")?.patchValue("");
    levelControl.at(index).get("quantity")?.patchValue("");
    levelControl.at(index).get("codeAvailable")?.patchValue("");
    levelControl.at(index).get("unit")?.patchValue("");
    levelControl.at(index).get("eol")?.patchValue("");
    levelControl.at(index).get("unitPrice")?.patchValue("");
    levelControl.at(index).get("amount")?.patchValue("");
    levelControl.at(index).get("invoiceImage")?.patchValue("");
  }
  filterAssetItem(assetCatId: any, index: number) {
    let levelControl = <FormArray>this.stockIn.controls["stockInArray"];
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
  
    
  }
  
  unitAmount(quantity: any, unitPrice: any, index: any) {
    if (quantity.value == "") {
      quantity.value = 0;
    }
    if (unitPrice.value == "") {
      unitPrice.value = 0;
    }
    let total: any = (parseFloat(quantity?.value) * parseFloat(unitPrice?.value)).toFixed(2);
    this.stockInInfo().at(index).patchValue({
      amount: total,
    });
    this.invoiceAmount = 0;
    this.stockInInfo().value.forEach((x: any) => {
      this.invoiceAmount += x.amount;
    });
    this.stockIn.patchValue({
      invoiceTotalAmt: this.invoiceAmount
    });
  }

  // new row form data
  newStockIn() {
    return this.formBuilder.group({
      assetType: [this.assetType, [Validators.required]],
      assetName: [this.assetName, [Validators.required]],
      assetItemName: [this.assetItemName, [Validators.required]],
      assetItemNameData: [this.modalAssetItemName],
      assetItemNameCode: [this.modalAssetItemCode],
      quantity: [
        this.quantity,
        [Validators.required, Validators.pattern(/^[0-9\.]*$/)],
      ],
      codeAvailable: [this.codeAvailable, [Validators.required]],
      unit: [this.unit, [Validators.required]],
      unitPrice: [
        this.unitPrice,
        [
          Validators.required,
          Validators.pattern(/^[0-9\.]*$/),          
        ],
      ],
      amount: [this.amount],
      eol: [
        this.eol,
        [
          Validators.required,
          Validators.pattern(/^[0-9\.]*$/),          
        ],
      ],
    });
  }
  dupStockIn() {
    //this.assetNameChanged = true;     
    this.inventoryService.dupStockIn(this.stockIn.value).subscribe({
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
  stockInInfo() {
    return this.stockIn.get("stockInArray") as FormArray;
  }

  addRow(index: any) {
    let emptyRow: Boolean = false;
    this.stockInInfo()?.controls?.map((item: any, index: number) => {
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
      this.stockInInfo().insert(index + 1, this.newStockIn());
    }
  }

  removeRow(index: any) {
    this.assetFilterData.splice(index, 1);
    if (this.stockInInfo().length === 1) {
      this.resetForm();
    }
    this.stockInInfo().length > 1 && this.stockInInfo().removeAt(index);
    this.checkSingleField();
  }
  checkSingleField() {
    this.singleField = this.stockInInfo()?.length > 1 ? false : true;
  }
  resetFormArray() {
    (this.stockIn.get("stockInArray") as FormArray).clear();    
  }
  resetForm() {
    this.resetFormArray();    
    this.addRow(0);
    this.invoiceAmount = 0;
    this.stockIn.patchValue({approvalBy: ''}); 
    this.stockIn.patchValue({invoiceDate: ''}); 
    this.stockIn.patchValue({invoiceImage: ''}); 
    this.stockIn.patchValue({invoiceNo: ''}); 

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
      `${levelName}  :- Unit price`,
      `${levelName}  :- ''`,
      `${levelName}  :- End of life (in years)`,
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
            "Duplicate asset item name can not be selected !!!",
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
    let authorityLevelsArr = <FormArray>this.stockIn.controls["stockInArray"];
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
    let authorityLevelsArr = <FormArray>this.stockIn.controls["stockInArray"];
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

    let staticErrors = this.customValidators.formValidationHandler(this.stockIn, this.allLabel);
    allErrors.push(staticErrors);

    return allErrors;
  }
  onFileChange(event:any) {
    let file = event.target.files;
    var ext = file[0].name.substring(file[0].name.lastIndexOf(".") + 1);
    if (ext == "jpg" || ext == "pdf" || ext == "jpeg" || ext == "png") {
      const fileSize = file[0].size;
      const fileSizeInKB = Math.round(fileSize / 1024);
      if (fileSizeInKB > 2000) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Upload invoice of maximum 2mb"
        ); 
        this.stockIn.patchValue({
          invoiceImage: ''
        });       
        return;
      } else {
        var doc:File = event.target.files[0];
        var myReader:FileReader = new FileReader();
        myReader.onloadend = (e) => {          
          this.stockIn.patchValue({
            fileSource: myReader.result
          });
        }
        myReader.readAsDataURL(doc);
      }
    } else {
      this.alertHelper.viewAlert("error", "Invalid", "Inavlid file format");
      this.stockIn.patchValue({
        invoiceImage: ''
      });
      return;
    }
  }

  submitStock() {
    this.submitted = true;
    if (this.stockIn.valid == true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          this.inventoryService.addStockIn(this.stockIn.value).subscribe({
            next: (res: any) => {
              this.spinner.hide();
              this.alertHelper
                .successAlert(
                  "Saved!",
                  "Stock In added successfully.",
                  "success"
                )
                .then(() => {
                  this.initializeForm();
                  this.resetForm();
                  this.assetFilterData  =[];
                  this.assetItemData =[];
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
  futuredateCheck(){
    let InVdate = this.stockIn.controls['invoiceDate'].value;
    const newDate = new Date(); 
    if(InVdate !=='')    
        if (formatDate(InVdate,'yyyy-MM-dd','en_US') > formatDate(newDate,'yyyy-MM-dd','en_US')){
          this.alertHelper.viewAlert(
            "error",
            "Invalid",
            "Invoice date must not be above today's date"
          );
           this.stockIn.patchValue({
            invoiceDate: ''
           });
        
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
        this.stockIn.patchValue({
          quantity: '' 
        });  
        return;    
      }
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
    // console.log(index,'index');
    
    let stockControl = <FormArray>(
      this.stockIn.controls["stockInArray"]
    );
    if (id !== "") {
      this.stockUnitData[index] = this.unitOfStock.filter((x: any) => {        
        return x.assetName === parseInt(id);
      });
     
    } else {
      this.stockUnitData[index] = [];
    }
    //console.log(this.stockUnitData[0][0].unit,'this.stockUnitData[0].unit',this.stockUnitData[0][0].eol,"this.stockUnitData[0].eol");
    // const patchData:any=[];
    if (this.stockUnitData.length > 0) {
      stockControl?.at(index)?.patchValue({
        eol: this.stockUnitData[0][0]?.eol,
      });
      stockControl?.at(index)?.patchValue({
        unit: this.stockUnitData[0][0]?.unit,
      });
      // this.stockUnitData.forEach((value: any, i: any) => {       
      //   this.unitEach = value[0]?.unit;
      //   this.endOfLife = value[0]?.eol;        
      //   patchData.push({unit: this.unitEach, eol: this.endOfLife});
      // });
      // console.log(patchData,"patchData");
      // stockControl?.at(index)?.patchValue(patchData);
      // console.log(stockControl?.at(index),"stockControl");
    }
  }
  codeAvailableChange(index: number){
    //this.codeChange = id;
    const checkStockArr: FormArray = this.stockIn.get(
      "stockInArray"
    ) as FormArray;
    //console.log(checkStockArr?.at(index)?.get('codeAvailable')?.value);
    const codeChngVal = checkStockArr?.at(index)?.get('codeAvailable')?.value;
    if(codeChngVal === '1'){
      this.codeChange = true // display view code badge   
      this.asseItemNameC = checkStockArr?.at(index)?.get('assetItemName')?.value;
      this.assetItemNameD[index]  = this.assetItemData[index].filter((x: any) => {      
        return x.assetItemId === parseInt(this.asseItemNameC);
      });
     this.modalAssetItemName = this.assetItemNameD[index]?.at(index).assetItemName;
      
       this.qtyFrCode = checkStockArr?.at(index)?.get('quantity')?.value; // get quantity to generate code     
      
    }else{
      this.codeChange = false // hide view code badge      
    }
  
  }
  //this function use to for loop in the front-end
  counter(i: number) {    
    return new Array(i);
  }
}
