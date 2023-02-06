import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { CommitteeBankDetailsService } from 'src/app/application/committee/services/committee-bank-details.service';
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { ManageGrantInfoService } from '../../services/manage-grant-info.service';


@Component({
  selector: 'app-edit-grant-info',
  templateUrl: './edit-grant-info.component.html',
  styleUrls: ['./edit-grant-info.component.css']
})
export class EditGrantInfoComponent implements OnInit {
  editGrantInfoForm!:FormGroup;
  submitted = false;
  id: number = 0;
  userId: any="";
  schoolCategory:any="";
  EventNameData:any="";
  getEventData:any="";
  grantType:any="";
  accountNo:any="";
  ifscCode:any="";
  bankAccount:any="";
  grantTypeId:any="";
  encId:any="";
  bankId:any="";
  otherBankName:any="";
  schoolId: any = [];
  schlInfo: any = [];
  bankData: any = [];
  allLabel: any = ["", "","Grant type","Bank name","Other bank name","Bank account no.","IFSC code"];
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  academicYear:any = this.config.getAcademicCurrentYear();
  grantTypeLoading:boolean=false;
  adminPrivilege: boolean = false;
  profileId: any = "";
  constructor(private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private spinner: NgxSpinnerService,
    public commonService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    public manageGrantInfoService: ManageGrantInfoService,
    private route: Router,
    private router: ActivatedRoute,
    public committeeBankDetailsService:CommitteeBankDetailsService,
    private el:ElementRef
    ) {
      const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization  
     }
  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    const userProfile = this.commonService.getUserProfile();
    this.userId = userProfile?.userId;
    this.profileId = userProfile?.profileId;
    this.schoolId = userProfile.school;
    this.schoolCategory=userProfile?.schoolCategory;
    this.id = this.router.snapshot.params["encId"];
    this.getSchoolInfo();
    this.getGrantInfo(this.id);
    this.getBankDetails();
    this.initializeform();
    this.getGrantName( this.schoolCategory);
    this.el.nativeElement.querySelector("[formControlName=grantType]").focus();
  }
  getSchoolInfo(){
    this.commonService
    .getSchoolBasicInfo(
      {encId:this.schoolId,academicYear:this.academicYear}
    ).subscribe((res:any=[])=>{ 
    this.schlInfo = res.data;
    });
  }
  getGrantName(schoolCategory:any) {
    this.spinner.show();
    this.grantTypeLoading = true;
    this.manageGrantInfoService.getGrantName(schoolCategory).subscribe((res: any) => {
   this.EventNameData = res.data;
    this.spinner.hide();
    this.grantTypeLoading = false;
    });
  }
  initializeform()
  {
    this.editGrantInfoForm = this.formBuilder.group({
      userId:[this.userId],
      profileId:[this.profileId],
      grantType: [
        this.grantType,
        [Validators.required],
      ],
      bankId:[
        this.bankId,[Validators.required],
      ],
      otherBankName:[
        this.otherBankName,[Validators.maxLength(40),Validators.pattern(/^[a-zA-Z ]*$/),this.customValidators.firstCharValidatorRF],
      ],
      accountNo: [
        this.accountNo ,
        [Validators.required,Validators.maxLength(18),Validators.minLength(9),Validators.pattern(/^[0-9]*$/),this.customValidators.firstCharValidatorRF]],
      
        ifscCode: [
          this.ifscCode,
        [Validators.required,Validators.maxLength(11),Validators.pattern(/^[A-Za-z]{4}\d{7}$/),this.customValidators.firstCharValidatorRF],
      ],
      schoolId:[
        this.schoolId,
      ],
      academicYear:[
        this.academicYear,
      ],
      encId: [this.encId],
    });

  }
  getBankDetails(){
    // this.committeeBankDetailsService
    // .getBankName()
    // .subscribe((data: any = []) => {
    //   this.bankData = data?.data;
    // });
    const anxTypes = ["BANK"];
    this.commonService.getCommonAnnexture(anxTypes).subscribe({
      next: (res: any) => {
        this.bankData = res?.data?.BANK;
      },
    });
  }
  bankChange(val:any){
    this.editGrantInfoForm.patchValue({
      otherBankName:"",
    });
    this.bankId = val;
  }
  getGrantInfo(id: any) {
    this.spinner.show();
    this.manageGrantInfoService.getGrantInfo(this.id).subscribe((res: any) => {
     this.getEventData = res;
     this.getEventData = this.getEventData.data[0];
     this.grantType = this.getEventData.grantTypeId;
       this.accountNo = this.getEventData.bankAccount;
     this.ifscCode = this.getEventData.ifscCode;
     this.bankId = this.getEventData.bankId;
     this.otherBankName = this.getEventData.otherBankName;
     this.encId = this.getEventData.encId;
     this.initializeform();
      this.spinner.hide();
      });
  }
  onSubmit()
  {
    if (this.editGrantInfoForm.get("bankId")?.value == 12){
      if (this.editGrantInfoForm.controls["otherBankName"]?.value == ""){
         this.alertHelper.viewAlert("error","Invalid","Other bank name is required");
          const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName=otherBankName]'
          );
        invalidControl.focus();
         return;
        }
    }
    // if ("INVALID" === this.editGrantInfoForm.status) {
    //   for (const key of Object.keys(this.editGrantInfoForm.controls)) {
    //     if (this.editGrantInfoForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.editGrantInfoForm,this.allLabel);
    //       break;
    //     }
    //   }
    // }
    if (this.editGrantInfoForm.invalid) {
      // this.customValidators.formValidationHandler(this.editGrantInfoForm, this.allLabel, this.el);
      this.customValidators.formValidationHandler(
        this.editGrantInfoForm,
        this.allLabel,
        this.el,
        {
          required: {
            grantType: "Please select grant type",
            bankId: "Please select bank name",
            accountNo: "Please enter bank account number",
            ifscCode: "Please enter bank IFSC",
          },
        }
      );
    }
    if (this.editGrantInfoForm.invalid) {
      return;
    }
if (this.editGrantInfoForm.valid === true) {
      this.alertHelper.updateAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          this.manageGrantInfoService
            .updateGrantInfo(this.editGrantInfoForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Grant info updated successfully",
                    "success"
                  )
                  .then(() => {
                    this.route.navigate(["../../viewGrantInfo"], {
                      relativeTo: this.router,
                    });
                    this.initializeform();
                  });
              },
              error: (error: any) => {
                this.spinner.hide();
        
                },
            });
        }
      });
    }
  }
  onCancel()
  {
    this.route.navigate(["../../viewGrantInfo"], {
      relativeTo: this.router,
    });
  }

  }


