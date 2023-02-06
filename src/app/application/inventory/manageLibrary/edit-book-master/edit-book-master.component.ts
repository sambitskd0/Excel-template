import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { LibraryService } from '../../services/library.service';

@Component({
  selector: 'app-edit-book-master',
  templateUrl: './edit-book-master.component.html',
  styleUrls: ['./edit-book-master.component.css']
})
export class EditBookMasterComponent implements OnInit {
  submitted = false;
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
  bookType:any="";
  bookName:any="";
  authorName:any="";
  publisher:any="";
  id:any="";
  encId:any="";
  bookMasterData:any=[];
  allLabel: string[] = [    
    "Book type",
    "Book name",
    "Author's name",
    "Publisher",       
  ];
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
   constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private alertHelper: AlertHelper,    
    public customValidators: CustomValidators,
    private commonService: CommonserviceService,
    private librararyService: LibraryService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private route: Router,
    private router: ActivatedRoute,
    private el: ElementRef,) {
      const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization  

     }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    this.id = this.router.snapshot.params["encId"];
    this.userProfile = this.commonService.getUserProfile();
    this.initializeForm();
    this.editOpeningStock(this.id);
    this.getSessionData();
    this.getAnnextureData();
    
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
          this.sessionData = res.data; 
         this.districtName = this.sessionData.districtName;
         this.blockName = this.sessionData.blockName;
         this.clusterName = this.sessionData.clusterName;
         this.schoolName = this.userProfile.userName; 
         this.spinner.hide();                                               
        },            
      });      
  }
  initializeForm() {
    this.bookAddForm = this.formBuilder.group({
      bookType: [this.bookType, [Validators.required]],
      bookName: [this.bookName, [Validators.required,Validators.maxLength(50),Validators.pattern(/^[a-zA-Z0-9.+,-/ ]*$/),this.customValidators.firstCharValidatorRF]],
      authorName: [this.authorName,[Validators.required,Validators.maxLength(50),Validators.pattern(/^[a-zA-Z0-9,. ]*$/),this.customValidators.firstCharValidatorRF]],
      publisher: [this.publisher, [Validators.required,Validators.maxLength(50),Validators.pattern(/^[a-zA-Z0-9 ,.'\-\)\(\[\]]*$/),this.customValidators.firstCharValidatorRF]],
      updatedBy: [this.userProfile.userId],      
      schoolId: [this.userProfile.school],      
      encId: [this.id], 
      profileId: [this.userProfile.profileId],
    });
  }
  editOpeningStock(id:any){
    this.librararyService.getBookMaster(id,this.userProfile.school).subscribe((resp: any) => {
      this.bookMasterData = resp.data[0];
      this.bookType = this.bookMasterData.bookType;
      this.bookName = this.bookMasterData.bookName;     
      this.authorName = this.bookMasterData.authorName;     
      this.publisher = this.bookMasterData.publisher; 
      this.encId = this.bookMasterData.encId;      
      this.initializeForm();
      this.spinner.hide();
    });
  }

  updateBookMaster(){
    this.submitted = true;
    if ("INVALID" === this.bookAddForm.status) {
      for (const key of Object.keys(this.bookAddForm.controls)) {
        if (this.bookAddForm.controls[key].status === "INVALID") {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + key + '"]'
          );
          invalidControl.focus();
          this.customValidators.formValidationHandler(
            this.bookAddForm,
            this.allLabel
          );
          break;
        }
      }
    }
    if (this.bookAddForm.valid == true) {
      this.alertHelper.updateAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          this.librararyService
            .updateBookMaster(this.bookAddForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Book updated successfully.",
                    "success"
                  )
                  .then(() => {
                    this.route.navigate(["../../viewBook"], {
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
}
