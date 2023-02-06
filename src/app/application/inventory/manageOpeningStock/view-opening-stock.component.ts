import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { environment } from 'src/environments/environment';
import { InventoryService } from '../services/inventory.service';

@Component({
  selector: 'app-view-opening-stock',
  templateUrl: './view-opening-stock.component.html',
  styleUrls: ['./view-opening-stock.component.css']
})
export class ViewOpeningStockComponent implements AfterViewInit,OnInit {
  
  public fileUrl = environment.filePath;
  openingStock!: any;
  openingStockForm!: FormGroup;
  resData: any = "";
  assetNameS: any = "";
  assetNameChanged: boolean = false;
  assetData: any = [];
  assetFilterData: any[] = []; 
  viewStock:any='';
  userProfile:any=[];
  isLoading = false;
  isNorecordFound: boolean = false;
  schoolId: any = ''; 
  pageIndex: any = 0;
  previousSize: any = 0; 
  userId:any="";
  adminPrivilege: boolean = false;
  // mat table
  @Input() mode!: ProgressBarMode;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter!: MatTableExporterDirective;
  pageSize = 10;
  offset = 0;
  currentPage = 0;
  totalRows = 0;
  pageSizeOptions: number[] = [10, 25, 100];
  displayedColumns: string[] = []; // define mat table columns

  resultListData: any = [];
  questionDetailsData!: any;
  dataSource = new MatTableDataSource(this.resultListData);
  //end
  paramObj: any; 
  serviceType: string = "Search";
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  quantityModal:any="";
  assetItemIdModal:any="";
  profileId:any="";
  openingStkIdModal:any="";
  prevAssetItemCode:any="";
  eol:any="";
  submitted = false;
  allLabel: string[] = ["","","","","Asset item code","End of life"];
  assetCodeLabel: string[] = this.getCustomizedLabelName("");
  @ViewChild("closebuttonCode") closebuttonCode!: any;
  assetItemCodeForm!: FormGroup;
  codeFg:any="";
  asType: any = [];
  constructor(private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private alertHelper: AlertHelper,
    private inventoryService: InventoryService,
    public customValidators: CustomValidators,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private commonService: CommonserviceService,
    private el: ElementRef) 
    { const pageUrl:any = this.router.url;  
      this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
      this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
      const users = this.commonService.getUserProfile();
      this.userId = users?.userId;}

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
      this.displayedColumns = [
        "slNo",
        "assetType",
        "assetName",
        "assetItemName",
        "quantity",
        "unit",
        "prevAssetItemCode",
        // "eol",
        "Action"
      ]; 
    } else {
      this.displayedColumns = [
        "slNo",
        "assetType",
        "assetName",
        "assetItemName",
        "quantity",
        "unit",
        "prevAssetItemCode",
        // "eol",
      ]; 
    }
    // this.el.nativeElement.querySelector("[formControlName=prevAssetItemCode]").focus();   
    this.userProfile = this.commonService.getUserProfile();
    this.schoolId = this.userProfile.school;
    this.viewOpeningStock(this.getSearchParams());
    this.initializeForm();    
    this.getAssetType();
    this.getAnnextureData();
    this.assetItemCodeInitialzeForm();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  
  initializeForm(){ 
    this.openingStockForm = this.formBuilder.group({ 
      assetType:['',],  
      assetName:['',],  
      sessionValue:[this.userProfile],
    }); 
  }
  getAnnextureData() {
    this.commonService
      .getCommonAnnexture(["ASSET_TYPE", "INCENTIVE_UNIT"])
      .subscribe({
        next: (res: any) => {          
          this.spinner.hide();
          this.asType = res?.data?.ASSET_TYPE;
          // this.incUnit = res?.data?.INCENTIVE_UNIT;          
        },
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
  filterAssetName(id: any) {    
    if (id !== "") {
      this.assetFilterData = this.assetData.filter((x: any) => {     
        this.openingStockForm.patchValue({
          assetName: ''
       }); 
        return x.assetType === parseInt(id);
      });
    } else {
      this.openingStockForm.patchValue({
        assetName: ''
     }); 
      this.assetFilterData = [];
    }
    
  }
  viewOpeningStock(...params: any){
   
    const {
      previousSize,
      offset,
      pageSize,
      assetType,
      assetName,
      
    } = params[0];

    this.paramObj = {
      offset: offset,
      limit: pageSize,
      assetType: assetType,
      assetName: assetName,
      schoolId:this.userProfile.school,
      serviceType: this.serviceType, 
      userId: this.userId
    };

    this.isLoading = true;

    this.inventoryService.viewOpeningStock(this.paramObj).subscribe({
      next: (res: any) => {
        this.resultListData.length = previousSize; // set current size
        res?.success === true && this.resultListData.push(...res?.data); // merge with existing data
        this.resultListData.length = res?.totalRecord; // update length
        this.dataSource = new MatTableDataSource(this.resultListData);
        this.dataSource.paginator = this.paginator; // update paginator
        this.dataSource._updateChangeSubscription(); // update table        
        this.isLoading = false;
        this.isNorecordFound = this.resultListData.length ? false : true;
        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });   
  }
  getSearchParams() {
    return {
      previousSize: this.previousSize,
      offset: this.offset.toString(),
      pageSize: this.pageSize.toString(),
      assetType: this.openingStockForm?.get("assetType")?.value,
      assetName: this.openingStockForm?.get("assetName")?.value,
      
    };
  }
  onPageChange(event: any) {
    this.spinner.show();
    this.isLoading = true;
    // event: PageEvent
    this.pageSize = event.pageSize; // current page size ex: 10
    /**
     * pageIndex starts from 0
     * ex: if pageIndex = 0 then offset = 0 * 10 = 0 and if pageIndex =1 then 1*10 = 10
     */
    this.offset = event.pageIndex * event.pageSize;
    this.previousSize = this.pageSize * event.pageIndex; // set previous size
    this.pageIndex = event.pageIndex;
    this.viewOpeningStock(this.getSearchParams());
  }
  onSearch(){
   // reset queryParams
   this.pageIndex = 0;
   this.previousSize = 0;
   this.offset = 0;
   this.previousSize = 0;
   this.resultListData.splice(0, this.resultListData.length); // empty current data
    this.dataSource.paginator = this.paginator; // update paginator
   this.viewOpeningStock(this.getSearchParams());
  }
  deleteOpeningStock(encId:string,assetItemId:any){
    this.alertHelper
    .deleteAlert("Are you sure to delete?", "", "question", "Yes, delete it!")
    .then((result) => {
      if (result.value) {
        this.spinner.show(); // ==== show spinner
        let paramList : any = { encId:encId,assetItemId:assetItemId, updatedBy : this.userProfile.userId ,profileId : this.userProfile.profileId };
        this.inventoryService.deleteOpeningStock(paramList).subscribe({
          next: (res: any) => {
            if (res?.success === true) {
              this.alertHelper.successAlert(
                "Deleted!",
                "Deleted successfully",
                "success"
              );
              this.viewOpeningStock(this.getSearchParams());
            } else {
              this.alertHelper.viewAlert("info", res?.msg);
            }
            this.isLoading = false;
            this.spinner.hide();
          },
          error: (error: any) => {
            this.isLoading = false;
            this.spinner.hide();
          },
        });       
      }
    });
  }

  printPage() {
    let cloneTable 	= document.getElementById("viewTable")?.innerHTML;
    const pageTitle = document.querySelector(".pageName")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }
  downloadOpeningStockList()
  {
    this.spinner.show();   
    this.paramObj.serviceType = "Download";
  
    this.inventoryService.viewOpeningStock(this.paramObj).subscribe({
      next: (res: any) => { 
        let filepath = this.fileUrl + '/' + res.data.replace('.', '~');
       
        window.open(filepath);
        this.spinner.hide();
      },
      error: (error: any) => {
        this.spinner.hide();
      },
    });

  }
 
  //add code to asset item

  addCodeModal(asstItmId:any,qty:any,opnStkId:any){
    this.quantityModal = qty; //quantity
    this.assetItemIdModal = asstItmId; //asset Item Name
    this.openingStkIdModal = opnStkId; //Opening stock id
    // this.beoInitialzeForm();
    // console.log(this.quantityModal,'Quantity');
    const obj ={openingStockId : this.openingStkIdModal,assetItemId:this.assetItemIdModal} // if Required add it assetItemName:  this.assetItemNameModal , quantity:this.quantityModal,
    this.inventoryService.viewSystemGenCode(obj).subscribe({
      next: (res: any) => {
        this.resultListData = res?.data;
        this.codeFg = res?.data[0]['codeUpdateFlag'];       
        if (this.resultListData?.length) {
          this.resultListData.map((item: any) => {           
            this.assetItemCodeInfo().push(
              this.formBuilder.group({
                stockId: [item.stockId],
                openingStockId: [item.openingStockId],
                assetItemName: [
                  {
                    value: item.assetItemName,
                     disabled: false,
                  },
                  //  [ Validators.pattern(/^[0-9]+$/)],
                ],
                assetItemCode: [
                  {
                    value: item.assetItemCode,
                     disabled: false,
                  },
                  //  [ Validators.pattern(/^[0-9]+$/)],
                ],
                prevAssetItemCode: [
                  {
                    value: item.prevAssetItemCode,
                    disabled: (item.codeUpdateFlag === 1 )? true :false,
                  },
                  //  [ Validators.pattern(/^[0-9]+$/)],
                  [
                    Validators.required,
                    Validators.maxLength(30),
                    Validators.pattern(/^[A-Za-z0-9 _./-]+$/),
                    this.customValidators.firstCharValidatorRF,
                  ],
                ],
                eol: [
                  {
                    value: item.eol,
                    disabled: (item.codeUpdateFlag === 1 )? true :false,
                  },

                  [
                    Validators.required,
                    Validators.maxLength(2),
                    Validators.pattern(/^[0-9]+$/),
                    this.customValidators.firstCharValidatorRF,
                  ],
                ],
  
              })
            );
          });
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
    this.assetItemCodeInitialzeForm();
    
  }
  counter(i: number) {  
    return new Array(i);
  }
  assetItemCodeInitialzeForm() {
    this.assetItemCodeForm = this.formBuilder.group({
      //prevAssetItemCode: [this.prevAssetItemCode,[Validators.required]],
      //eol: [this.eol, [Validators.required]],          
      updatedBy: [this.userProfile.userId],
      assetItemCodeArray: this.formBuilder.array([]),
     
    });
  }
  assetItemCodeInfo(): FormArray {
    return this.assetItemCodeForm.get("assetItemCodeArray") as FormArray;
  }
  getFormValue(allValue: any) {
    return {
      ...allValue,       
    };
  }
  onSubmit(){
    this.submitted = true;  
    
    if(this.assetItemCodeForm.invalid){
      
    this.customValidators.formValidationHandler(
      this.assetItemCodeForm,
      this.allLabel
    );
    }
    if (this.assetItemCodeForm?.controls['assetItemCodeArray'].valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
         
          const allValue = this.assetItemCodeForm?.value;
          this.spinner.show(); // ==== show spinner
          this.inventoryService
            .updateAssetItemCode(this.getFormValue(allValue))
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Asset item code updated successfully",
                    "success"
                  )
                  .then(() => {
                    this.closebuttonCode.nativeElement.click();
                    this.viewOpeningStock(this.getSearchParams());
                    this.initializeForm();
                    this.assetItemCodeInitialzeForm();
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
              complete: () => console.log('done'),
            });
        }
      });
    }
  }

  getCustomizedLabelName(labelData: string) {
    return [
      `${labelData} :- stockId`,
      `${labelData} :- openingStockId`,
      `${labelData} :- assetItemName`,
      `${labelData} :- assetItemCode`,
      `${labelData} :- Asset item code`,
      `${labelData} :- End of life (in years)`,
    ];
  }
  validateSubmitAssetCode() {
    Promise.all([this.validateAssetCodeData(), this.checkDuplicateLevel()]).then((value) => {
      const formErrors = value[0];
      //console.log(formErrors.reverse(),"formErrors");
     
      
        const checkDuplicateLevelError = value[1];
        console.log(checkDuplicateLevelError);
        if (checkDuplicateLevelError === true) {
          this.alertHelper.successAlert(
            "Invalid",
            "Duplicate asset item code can not be add !!!",
            "error"
          );
        }else{
          let formInvalid: any = false; 
          formErrors.reverse().map((item: any) => {
            this.alertHelper.viewAlert(
                  "error",
                  "Invalid",
                  item
                );  
            if (item !== false) {
              formInvalid = true;
            }
          });
          formInvalid === false && this.onSubmit();     
        }
             
    });
  }
  validateAssetCodeData() {
    let allErrors: any = [];
    let assetItemCodeArray = <FormArray>(
      this.assetItemCodeForm.controls["assetItemCodeArray"]
    );
    assetItemCodeArray?.controls?.map((item: any, index: number) => {
      //console.log(item,"item",index,"id");
        this.assetCodeLabel = this.getCustomizedLabelName(
          "SlNo. " + (index + 1)
        );
        let errors = this.customValidators.formArrayValidationHandler(
          item,
          this.assetCodeLabel
        );
        //console.log(errors,"error");
        if (errors.length > 0) {
          for (const indMsg of errors) {
           console.log(indMsg,"indmsg");
            allErrors.push(errors);
          }
        }

      //console.log(allErrors,"allErrors");
    });
    return allErrors;
  }
  checkDuplicateLevel(): any {
    let allValueArray: Array<number> = [];
    let asstCodeArr = <FormArray>(
      this.assetItemCodeForm.controls["assetItemCodeArray"]
    );
    asstCodeArr.controls?.map(async (item: any, index: number) => {      
      allValueArray.push(parseInt(item?.controls.prevAssetItemCode.value));
    });

    const uniqueSet = new Set(allValueArray);   
    if (allValueArray.length != uniqueSet.size) {
      return true;
    } else {
      return false;
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
}
