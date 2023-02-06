
/**
 * Created By  : Nitish Nanda
 * Created On  : 26-07-2022
 * Module Name : GrantFund
 * Description : Add  Grant Info.
 **/
import { Component, ElementRef, OnInit } from '@angular/core';
import {  FormBuilder, FormGroup, Validators } from "@angular/forms";
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
  selector: 'app-add-grant-info',
  templateUrl: './add-grant-info.component.html',
  styleUrls: ['./add-grant-info.component.css']
})
export class AddGrantInfoComponent implements OnInit {
  addGrantInfoForm!:FormGroup;
  priMemberDiv: boolean = false;
  labelName: string = "";
  userId: any = "";
  school: any = "";
  loginId: any = "";
  userName: any = "";
  district: any = "";
  clusterData: any = "";
  schoolCategory: any="";
  EventNameData:any="";
  encId:any="";
  grantType:any="";
  accountNo:any="";
  ifscCode:any="";
  bankId:any="";
  otherBankName:any="";
  userProfile: any = [];
  schoolId: any = [];
  schlInfo: any = [];
  bankData: any = [];
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  academicYear:any = this.config.getAcademicCurrentYear();
  allLabel: any = ["", "", "Grant type","Bank name","Other bank name","Bank account no.","IFSC code"];
  adminPrivilege: boolean = false;
  
  grantTypeLoading:boolean=false;
  profileId: any = "";
  constructor(
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private spinner: NgxSpinnerService,
    public commonService: CommonserviceService,
    public manageGrantInfoService: ManageGrantInfoService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    public committeeBankDetailsService:CommitteeBankDetailsService,
    private el:ElementRef,
    private route: Router,
    private router: ActivatedRoute,
  ) { 
    const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For authorization
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
    this.getSchoolInfo();
    this.getBankDetails();
    this.initializeform();
    this.getGrantName(this.schoolCategory);
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
    this.addGrantInfoForm.patchValue({
      otherBankName:"",
    });
    this.bankId = val;
  }
  initializeform()
  {
    this.addGrantInfoForm = this.formBuilder.group({
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
        this.accountNo,
        [Validators.required,Validators.maxLength(18),Validators.minLength(9),Validators.pattern(/^[0-9]*$/),this.customValidators.firstCharValidatorRF]
      ],
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
    });
  }
  getGrantName(schoolCategory:any) {
    this.spinner.show();
    this.grantTypeLoading = true;
    this.manageGrantInfoService.getGrantName(schoolCategory).subscribe((res: any) => {
    this.EventNameData = res;
    this.EventNameData = this.EventNameData.data;
    this.spinner.hide();
    this.grantTypeLoading = false;
    });
  }
 
  onSubmit()
  {
    if (this.addGrantInfoForm.get("bankId")?.value == 12){
      if (this.addGrantInfoForm.controls["otherBankName"]?.value == ""){
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="otherBankName"]'
          );
          invalidControl.focus();
          this.alertHelper.viewAlert("error","Invalid","Other bank name is required");
         return;
        }
       
    }
    // if ("INVALID" === this.addGrantInfoForm.status) {
    //   for (const key of Object.keys(this.addGrantInfoForm.controls)) {
    //     if (this.addGrantInfoForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.addGrantInfoForm,this.allLabel);
    //       break;
    //     }
    //   }
    // }
    if (this.addGrantInfoForm.invalid) {
      // this.customValidators.formValidationHandler(this.addGrantInfoForm, this.allLabel, this.el);
      this.customValidators.formValidationHandler(
        this.addGrantInfoForm,
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
    if (this.addGrantInfoForm.invalid) {
      return;
    }
    if (this.addGrantInfoForm.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show(); 
          this.manageGrantInfoService
            .addGrantInfo(this.addGrantInfoForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
              this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Grant info created successfully.",
                    "success"
                  )
                  .then(() => {
                    this.route.navigate(["./../viewGrantInfo"], {
                      relativeTo: this.router,
                    });
                    this.initializeform();
                  });
              },
              error: (error: any) => {
               
              },
            });
        }
      });
    }
  }

  }


