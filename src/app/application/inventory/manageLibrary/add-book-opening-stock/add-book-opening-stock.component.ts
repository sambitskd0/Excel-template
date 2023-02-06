import { formatDate } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { LibraryService } from '../../services/library.service';

@Component({
  selector: 'app-add-book-opening-stock',
  templateUrl: './add-book-opening-stock.component.html',
  styleUrls: ['./add-book-opening-stock.component.css']
})
export class AddBookOpeningStockComponent implements OnInit,AfterViewInit {
  openingStock!: any;
  annextureResults: any ="";
  bkType: any =[];
  bkTypeChanged: boolean = false;  
  submitted: boolean = false;  
  userProfile: any = [];
  sessionData:any="";
  districtName:any="";
  blockName:any="";
  clusterName:any="";
  schoolName:any="";
  bookListChanged: boolean = false;
  bookListData: any = [];
  bookFilterData: any[] = [];
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  academicYear:any = this.config.getAcademicCurrentYear();
  receivedFrom:any="";
  billNo:any="";
  recvDate:any="";
  bookType:any="";
  bookName:any="";
  quantity:any="";
  authorName:any="";
  publisher:any="";
  bookNo:any="";
  singleField: boolean = true; // single row will not have action column
  bookNameChanged: boolean = false;
  authorNameChanged: boolean = false;
  publisherNameChanged: boolean = false;
  formLables: string[] = this.getCustomizedLabelName("");
  allLabel: string[] = ["Academic year","Received From","Bill No","Date"];
  maxDate: any = Date;
  adminPrivilege: boolean = false;

  constructor(
    private el: ElementRef,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private alertHelper: AlertHelper,    
    public customValidators: CustomValidators,
    private commonService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private librararyService: LibraryService,) {
      const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For authorization
      this.maxDate = new Date(); }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }

    this.userProfile = this.commonService.getUserProfile();
    this.getAnnextureData();
    this.getSessionData();
    this.getBookList();
    this.initializeForm();
    this.addRow(0);
  }
  ngAfterViewInit(){
    this.el.nativeElement.querySelector("[formControlName=receivedFrom]").focus();
  }
  getAnnextureData() {
    this.commonService
      .getCommonAnnexture(["BOOK_TYPE"])
      .subscribe({
        next: (res: any) => {          
          this.spinner.hide();
          this.annextureResults = res;
          this.bkType = res?.data?.BOOK_TYPE;                    
        },
      });
  }
  getBookList() {
    this.bookListChanged = true;
    this.spinner.show();
    this.librararyService.getBookMaster('',this.userProfile.school).subscribe({
      next: (data: any) => {
        this.bookListData = data;
        this.bookListData = this.bookListData.data;
        this.bookListChanged = false;
        this.spinner.hide();
      },
    });
  }
   // show number of row according to preServiceEducationalInfoArray items
   openingStockInfo() {
    return this.openingStock.get("openingStockArray") as FormArray;
  }
  filterAssetName(id: any, index: number) {
    
    let levelControl = <FormArray>this.openingStock.controls['openingStockArray'];
    if (id !== "") {
      this.bookFilterData[index] = this.bookListData.filter((x: any) => {       
        return x.bookType === parseInt(id);
      });
    } else {
      this.bookFilterData[index] = [];
    }
  

    levelControl.at(index).get('bookName')?.patchValue("");    
    levelControl.at(index).get('bookNo')?.patchValue("");
  }
  initializeForm() {
    this.openingStock = this.formBuilder.group({
      academicYear: [this.academicYear],
      receivedFrom: [this.receivedFrom,[Validators.maxLength(50),Validators.pattern(/^[a-zA-Z0-9.',-/ ]*$/)]],
      billNo: [this.billNo,[Validators.maxLength(50),Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/)]],
      recvDate: [this.recvDate,[Validators.required]],
      createdBy: [this.userProfile.userId],
      schoolId: [this.userProfile.school],
      openingStockArray: this.formBuilder.array([]), // store all data in this array
      profileId: [this.userProfile.profileId],
    });
  }
   // new row form data
   newOpeningStock() {
    return this.formBuilder.group({
      bookType: [this.bookType, [Validators.required,Validators.pattern(/^[0-9]*$/)]],
      bookName: [this.bookName, [Validators.required,Validators.pattern(/^[a-zA-Z0-9.+,-/ ]*$/)]],      
      bookNo: [this.bookNo, [Validators.required,Validators.maxLength(50),Validators.pattern(/^[0-9]*$/),this.customValidators.firstCharValidatorRF]],      
      quantity: [this.quantity, [Validators.required,Validators.pattern(/^[0-9]*$/),this.customValidators.firstCharValidatorRF]],      
    });
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
    this.bookFilterData.splice(index, 1);
    if(this.openingStockInfo().length === 1){
      this.resetForm();
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
    this.openingStock.reset(); 
    this.addRow(0);
  }
  // ====== get customized label names
  getCustomizedLabelName(levelName: string) {
    return [
      `${levelName}  :- Book type`,
      `${levelName}  :- Book name`,
      `${levelName}  :- Book no.`,
      `${levelName}  :- Book quantity`,
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
            "Duplicate book name can not be selected !!!",
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
    let allValueArray: any = [];
    let formLablesArr = <FormArray>(
      this.openingStock.controls["openingStockArray"]
    );
    formLablesArr.controls?.map(async (item: any, index: number) => {      
      allValueArray.push(item?.controls.bookName.value);      
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
    let authorityLevelsArr = <FormArray>this.openingStock.controls["openingStockArray"];
    authorityLevelsArr.controls?.map((item: any, index: number) => {      
      this.formLables = this.getCustomizedLabelName(
        "SlNo. " + (index + 1)
      );
      
      let errors = this.customValidators.formValidationHandler(
        item,
        this.formLables
      );
      allErrors.push(errors);
    });

    let staticErrors = this.customValidators.formValidationHandler(this.openingStock, this.allLabel);
    allErrors.push(staticErrors);

    return allErrors;
  }
  submitStock(){
    this.submitted = true;
   

    if (this.openingStock.valid == true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          this.librararyService.addBookOpeningStock(this.openingStock.value).subscribe({
            next: (res: any) => {
              this.spinner.hide();
              this.alertHelper
                .successAlert(
                  "Saved!",
                  "Opening stock created successfully.",
                  "success"
                )
                .then(() => {
                  this.getBookList();
                  this.initializeForm();                 
                  this.resetForm();
                  this.bookFilterData =[];
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
  getSessionData() {
    this.spinner.show(); 
    this.librararyService
      .getSessionData(this.userProfile)
      .subscribe({
        next: (res: any) => {          
          this.spinner.hide();
          this.sessionData = res?.data; 
         this.districtName = this.sessionData?.districtName;
         this.blockName = this.sessionData?.blockName;
         this.clusterName = this.sessionData?.clusterName;
         this.schoolName = this.userProfile?.userName; 
         this.spinner.hide();                                               
        },            
      });      
  }
  futuredateCheck(){
    let InVdate = this.openingStock.controls['recvDate'].value;
    const newDate = new Date(); 
    if(InVdate !=='')    
        if (formatDate(InVdate,'yyyy-MM-dd','en_US') > formatDate(newDate,'yyyy-MM-dd','en_US')){
          this.alertHelper.viewAlert(
            "error",
            "Invalid",
            "Date must not be above today's date"
          );
           this.openingStock.patchValue({
            recvDate: ''
           });
        
        }
  }
}
