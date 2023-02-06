import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageExpenditureTypeService } from '../../services/manage-expenditure-type.service';

@Component({
  selector: 'app-add-expenditure-type',
  templateUrl: './add-expenditure-type.component.html',
  styleUrls: ['./add-expenditure-type.component.css']
})
export class AddExpenditureTypeComponent implements OnInit {
  addExpenditureTypeForm!:FormGroup;
  allErrorMessages: string[] = [];
  allLabel: string[] = ["","Expenditure type","Description"];
  expenditureName: any = "";
  description:any = ""; 
  userId: any;
  submitted = false;
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  profileId: any = "";

  constructor(
    private formBuilder:FormBuilder,
    private alertHelper:AlertHelper,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    public customValidator:CustomValidators,
    public manageexpendituretypeservice:ManageExpenditureTypeService,
    private spinner: NgxSpinnerService, 
    public commonService:CommonserviceService,
    private el: ElementRef,
  ) { 
    const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For authorization
  }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.initializeForm();
    this.el.nativeElement.querySelector("[formControlName=expenditureName]").focus();
  }
  initializeForm() {
    this.addExpenditureTypeForm = this.formBuilder.group({
      
      userId:[this.userId],
      profileId:[this.profileId],
      expenditureName: [
        this.expenditureName,
        [Validators.required,Validators.pattern('^[a-zA-Z \-\']+'),Validators.maxLength(80),this.customValidator.firstCharValidatorRF]
      ],
      description: [this.description,
        [Validators.maxLength(300),this.customValidator.firstCharValidatorRF]
      ],
    });
  }

  onSubmit()
  {
    this.submitted = true;
    // if ("INVALID" === this.addExpenditureTypeForm.status) {
    //   for (const key of Object.keys(this.addExpenditureTypeForm.controls)) {
    //     if (this.addExpenditureTypeForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidator.formValidationHandler(
    //         this.addExpenditureTypeForm,
    //         this.allLabel
    //       );
    //       break;
    //     }
    //   }
    // }

    if (this.addExpenditureTypeForm.invalid) {
      // this.customValidator.formValidationHandler(this.addExpenditureTypeForm, this.allLabel, this.el);
      this.customValidator.formValidationHandler(
        this.addExpenditureTypeForm,
        this.allLabel,
        this.el,
        {
          required: {
            expenditureName: "Please enter expenditure type",
          },
        }
      );
    }

    if(this.addExpenditureTypeForm.valid == true){
      this.alertHelper.submitAlert().then((result) => {
        if(result.value){
          this.spinner.show();
          this.manageexpendituretypeservice.addExpenditureType(this.addExpenditureTypeForm.value).subscribe({
            next: (res: any) => {
              this.spinner.hide();
              this.alertHelper.successAlert(
                "Saved!",
                "Expenditure type created successfully.",
                "success"
              ).then(()=>{
                this.initializeForm();
              });
            },
            error: (error: any) => {
              this.spinner.hide(); //==== hide spinner
                      },
          });
        }
      });
    }
  }

}


