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
  selector: 'app-add-book-master',
  templateUrl: './add-book-master.component.html',
  styleUrls: ['./add-book-master.component.css']
})
export class AddBookMasterComponent implements OnInit,AfterViewInit {
  annextureResults: any ="";
  bkType: any =[];
  bkTypeChanged: boolean = false;  
  userProfile: any = [];
  sessionData:any="";
  districtName:any="";
  blockName:any="";
  clusterName:any="";
  schoolName:any="";
  bookAddForm!:any;
  submitted = false;
  singleField: boolean = true; // single row will not have action column
  bookType:any="";
  bookName:any="";
  authorName:any="";
  publisher:any="";
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  academicYear:any = this.config.getAcademicCurrentYear();
  formLables: string[] = this.getCustomizedLabelName("");
  adminPrivilege: boolean = false;
  
  constructor( 
    private el: ElementRef,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private alertHelper: AlertHelper, 
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,   
    public customValidators: CustomValidators,
    private commonService: CommonserviceService,
    private librararyService: LibraryService,) { 
      const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For authorization
  }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    this.userProfile = this.commonService.getUserProfile();
    this.getAnnextureData();
    this.getSessionData();
    this.initializeForm();
    this.addRow(0);
  }
  ngAfterViewInit(){
    this.el.nativeElement.querySelector("[formControlName=bookType]").focus();
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
  initializeForm() {
    this.bookAddForm = this.formBuilder.group({  
      academicYear:[this.academicYear],   
      createdBy: [this.userProfile.userId],
      schoolId: [this.userProfile.school],      
      bookAddArray: this.formBuilder.array([]), // store all data in this array
      profileId: [this.userProfile.profileId],
    });
  }
  bookAddInfo() {
    return this.bookAddForm.get("bookAddArray") as FormArray;
  }
  addRow(index: any) {
    let emptyRow: Boolean = false;
    this.bookAddInfo()?.controls?.map((item: any, index: number) => {
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
      this.bookAddInfo().insert(index + 1, this.newBookAdd());
    }
  }
   // new row form data
   newBookAdd() {
    return this.formBuilder.group({
      bookType: [this.bookType, [Validators.required,Validators.pattern(/^[0-9]*$/)]],
      bookName: [this.bookName, [Validators.required,Validators.maxLength(50),Validators.pattern(/^[a-zA-Z0-9.+,()-/ ]*$/),this.customValidators.firstCharValidatorRF]],
      authorName: [this.authorName,[Validators.required,Validators.maxLength(50),Validators.pattern(/^[a-zA-Z0-9,. ]*$/),this.customValidators.firstCharValidatorRF]],
      publisher: [this.publisher, [Validators.required,Validators.maxLength(50),Validators.pattern(/^[a-zA-Z0-9 ,.'\-\)\(\[\]]*$/),this.customValidators.firstCharValidatorRF]],
          
    });
  }
  removeRow(index: any) {
    // this.assetFilterData.splice(index, 1);
    if (this.bookAddInfo().length === 1) {
      this.resetForm();
    }
    this.bookAddInfo().length > 1 && this.bookAddInfo().removeAt(index);
    this.checkSingleField();
  }
  checkSingleField() {
    this.singleField = this.bookAddInfo()?.length > 1 ? false : true;
  }
  resetFormArray() {
    (this.bookAddForm.get("bookAddArray") as FormArray).clear();    
  }
  resetForm() {
    this.resetFormArray();    
    this.addRow(0);    
  }
  // ====== get customized label names
  getCustomizedLabelName(levelName: string) {
    return [
      `${levelName}  :- Book type`,
      `${levelName}  :- Book name`,
      `${levelName}  :- Author's name`,
      `${levelName}  :- Publisher`,      
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
      this.bookAddForm.controls["bookAddArray"]
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
    let formLablesArr = <FormArray>(
      this.bookAddForm.controls["bookAddArray"]
    );
    formLablesArr.controls?.map((item: any, index: number) => {
      this.formLables = this.getCustomizedLabelName(
        "SlNo. " + (index + 1)
      );
      
      let errors = this.customValidators.formValidationHandler(
        item,
        this.formLables
      );
      allErrors.push(errors);
    });    
    return allErrors;
  }
  submitStock(){
    this.submitted = true;
     if (this.bookAddForm.valid == true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          this.librararyService
            .addBook(this.bookAddForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Book created successfully.",
                    "success"
                  )
                  .then(() => {
                    this.initializeForm();
                    this.resetForm();
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
  
}
