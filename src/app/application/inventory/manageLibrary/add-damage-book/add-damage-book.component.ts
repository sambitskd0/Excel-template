import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import {  FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { LibraryService } from '../../services/library.service';

@Component({
  selector: 'app-add-damage-book',
  templateUrl: './add-damage-book.component.html',
  styleUrls: ['./add-damage-book.component.css']
})
export class AddDamageBookComponent implements OnInit {
  userProfile: any = [];
  damageBook!: any;
  annextureResults: any ="";
  bkType: any =[];
  bkTypeChanged: boolean = false;  
  submitted: boolean = false;   
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
  amount:any="";
  authorName:any="";
  publisher:any="";
  bookNo:any="";
  reasonDamage:any="";
  quantity:any="";
  damageDate:any="";
  damageDateConv:any="";
  singleField: boolean = true; // single row will not have action column
  bookNameChanged: boolean = false;
  authorNameChanged: boolean = false;
  publisherNameChanged: boolean = false;
  bookNumberChanged: boolean = false;
  bookNumberData:any=[];
  damageR: any =[];
  reasonDaChanged: boolean = false;
  allLabel: string[] = ["Academic year","Book type","Book name","Book no.","Quantity","Damage reason","Damage date"];
  maxDate: any = Date;
  adminPrivilege: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private alertHelper: AlertHelper,    
    public customValidators: CustomValidators,
    private commonService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private librararyService: LibraryService,
    private el: ElementRef) {
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
    // this.addRow(0);
   
  }
  ngAfterViewInit(){
    this.el.nativeElement.querySelector("[formControlName=bookType]").focus();
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
  getAnnextureData() {
    this.commonService
      .getCommonAnnexture(["BOOK_TYPE","DAMAGE_REASON"])
      .subscribe({
        next: (res: any) => {          
          this.spinner.hide();
          this.annextureResults = res;
          this.bkType = res?.data?.BOOK_TYPE;    
          this.damageR = res?.data?.DAMAGE_REASON;                 
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
  filterBookName(id: any) { 
    
    if (id !== "") {
      this.bookFilterData = this.bookListData.filter((x: any) => {       
        return x.bookType === parseInt(id);
      });
    } else {
      this.bookFilterData = [];
    }   
   
  }
  filterBookNo(bookId:any){   
    this.spinner.show();
    this.bookNumberChanged = true;
    this.bookNumberData = [];
    this.damageBook.patchValue({'bookNo':[]});
    if(bookId !== ""){  
      this.librararyService.getBookNo(bookId).subscribe({
        next: (data: any) => {       
          this.bookNumberData = data;
          this.bookNumberData = this.bookNumberData.data;
          this.bookNumberChanged = false;
          this.spinner.hide();
        },
      });
    }else{
      this.bookNumberChanged = false;
      this.bookNumberData = [];
      this.spinner.hide();
    }
    
  }
  initializeForm() {
    this.damageBook = this.formBuilder.group({
      academicYear: [this.academicYear],
      bookType: [this.bookType,[Validators.required,Validators.pattern(/^[0-9\.]*$/)]],
      bookName: [this.bookName,[Validators.required,Validators.pattern(/^[0-9\.]*$/)]],
      bookNo: [this.bookNo,[Validators.required,Validators.pattern(/^[0-9\.]*$/)]],
      quantity: [this.quantity,[Validators.required,Validators.pattern(/^[0-9\.]*$/),this.customValidators.firstCharValidatorRF]],
      reasonDamage: [this.reasonDamage,[Validators.required,Validators.pattern(/^[0-9\.]*$/)]],
      damageDate: [this.damageDate,[Validators.required]],
      createdBy: [this.userProfile.userId],
      schoolId: [this.userProfile.school],
      profileId: [this.userProfile.profileId],
     
    });
  }
  damageSubmit(){
    this.submitted = true;  
  // if ("INVALID" === this.damageBook.status) {
  //   for (const key of Object.keys(this.damageBook.controls)) {
  //     if (this.damageBook.controls[key].status === "INVALID") {
  //       const invalidControl = this.el.nativeElement.querySelector(
  //         '[formControlName="' + key + '"]'
  //       );
  //       invalidControl.focus();
  //       this.customValidators.formValidationHandler(
  //         this.damageBook,
  //         this.allLabel
  //       );
  //       break;
  //     }
  //   }
  // }
  if (this.damageBook.invalid) {
    this.customValidators.formValidationHandler(this.damageBook, this.allLabel, this.el);
  }
  if (this.damageBook.valid === true) {
    this.alertHelper.submitAlert().then((result) => {
      if (result.value) {
        this.spinner.show(); // ==== show spinner
        this.librararyService
          .addDamageBook(this.damageBook.value)
          .subscribe({
            next: (res: any) => {
              this.spinner.hide(); //==== hide spinner
              this.alertHelper
                .successAlert(
                  "Saved!",
                  "Damage book created  successfully.",
                  "success"
                )
                .then(() => {
                  this.initializeForm();
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
  futuredateCheck(){
    let InVdate = this.damageBook.controls['damageDate'].value;
    const newDate = new Date(); 
    if(InVdate !=='')    
        if (formatDate(InVdate,'yyyy-MM-dd','en_US') > formatDate(newDate,'yyyy-MM-dd','en_US')){
          this.alertHelper.viewAlert(
            "error",
            "Invalid",
            "Date must not be above today's date"
          );
           this.damageBook.patchValue({
            damageDate: ''
           });
        
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
          this.damageBook.patchValue({
            quantity: '' 
          });  
          return;    
        }
      }
    }
}
