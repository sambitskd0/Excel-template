import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageGrantTypeService } from '../../services/manage-grant-type.service';

@Component({
  selector: 'app-add-grant-type',
  templateUrl: './add-grant-type.component.html',
  styleUrls: ['./add-grant-type.component.css']
})
export class AddGrantTypeComponent implements OnInit {

  addGrantTypeForm!:FormGroup;
  allErrorMessages: string[] = [];
  allLabel: string[] = ["", "","Grant type","Description"];
  grantName: any = "";
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
    public manageGrantTypeService:ManageGrantTypeService,
    private spinner: NgxSpinnerService, 
    private el: ElementRef,
    public commonService:CommonserviceService,) { 
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
    this.el.nativeElement.querySelector("[formControlName=grantName]").focus();
  }
  initializeForm() {
    this.addGrantTypeForm = this.formBuilder.group({
      
      userId:[this.userId],
      profileId:[this.profileId],
      grantName: [
        this.grantName,
        [Validators.required, Validators.pattern(/^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/),Validators.maxLength(80),this.customValidator.firstCharValidatorRF]
      ],
      description: [this.description,
        [Validators.maxLength(300),this.customValidator.firstCharValidatorRF]
      ],
    });
  }
 onSubmit()
  {
    this.submitted = true;
    // if ("INVALID" === this.addGrantTypeForm.status) {
    //   for (const key of Object.keys(this.addGrantTypeForm.controls)) {
    //     if (this.addGrantTypeForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidator.formValidationHandler(
    //         this.addGrantTypeForm,
    //         this.allLabel
    //       );
    //       break;
    //     }
    //   }
    // }
    if (this.addGrantTypeForm.invalid) {
      // this.customValidator.formValidationHandler(this.addGrantTypeForm, this.allLabel, this.el);
      this.customValidator.formValidationHandler(
        this.addGrantTypeForm,
        this.allLabel,
        this.el,
        {
          required: {
            grantName: "Please enter grant type",
          },
        }
      );
    }
    
    if(this.addGrantTypeForm.valid == true){
      this.alertHelper.submitAlert().then((result) => {
        if(result.value){
          this.spinner.show();
          this.manageGrantTypeService.addGrantTypeData(this.addGrantTypeForm.value).subscribe({
            next: (res: any) => {
              this.spinner.hide();
              this.alertHelper.successAlert(
                "Saved!",
                "Grant type created successfully.",
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
