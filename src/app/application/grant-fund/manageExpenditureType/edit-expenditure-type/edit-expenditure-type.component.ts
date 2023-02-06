import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageExpenditureTypeService } from '../../services/manage-expenditure-type.service';

@Component({
  selector: 'app-edit-expenditure-type',
  templateUrl: './edit-expenditure-type.component.html',
  styleUrls: ['./edit-expenditure-type.component.css']
})
export class EditExpenditureTypeComponent implements OnInit {
  editExpenditureTypeForm!: FormGroup;
  id: any;
  expenditureName: any = "";
  description: any = "";
  grantTypeDatas: any = "";
  encId: any;
  userId: any;
  allErrorMessages: string[] = [];
  allLabel: any = ["","", "Expenditure type","Description"];
  grantTypeData: any;
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  profileId: any = "";

  constructor(
    public customValidator: CustomValidators,
    private router: ActivatedRoute,
    private manageexpendituretypeservice: ManageExpenditureTypeService,
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    private route: Router,
    private spinner: NgxSpinnerService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private commonService: CommonserviceService,
    private el: ElementRef
  ) {
    const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization 
   }

  ngOnInit(): void {
    this.spinner.show();  // ==== show spinner
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.id = this.router.snapshot.params["encId"];
   
    this.getGrantTypeData(this.id);
    this.initializeForm();
    this.el.nativeElement.querySelector("[formControlName=expenditureName]").focus();
    this.spinner.hide();
  }
  initializeForm() {
    this.editExpenditureTypeForm = this.formBuilder.group({
      userId: [this.userId],
      profileId: [this.profileId],
      expenditureName: [
        this.expenditureName,
        [Validators.required,Validators.pattern('^[a-zA-Z \-\']+'),Validators.maxLength(80),this.customValidator.firstCharValidatorRF],
      ],
      description: [
        this.description, [Validators.maxLength(300),this.customValidator.firstCharValidatorRF],
      ],
      encId: [this.encId],
    });
  }
  getGrantTypeData(id: any) {
    this.spinner.show();
    this.manageexpendituretypeservice.getExpenditureType(this.id).subscribe((res: any) => {
      this.grantTypeDatas = res.data;
      this.expenditureName = this.grantTypeDatas.expenditureName;
      this.description = this.grantTypeDatas.description;
      this.encId = this.grantTypeDatas.encId;
      this.initializeForm();
      this.spinner.hide();
    });
  }
  onSubmit()
  {
    // if ("INVALID" === this.editExpenditureTypeForm.status) {
    //   for (const key of Object.keys(this.editExpenditureTypeForm.controls)) {
    //     if (this.editExpenditureTypeForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidator.formValidationHandler(
    //         this.editExpenditureTypeForm,
    //         this.allLabel
    //       );
    //       break;
    //     }
    //   }
    // }

    if (this.editExpenditureTypeForm.invalid) {
      // this.customValidator.formValidationHandler(this.editExpenditureTypeForm, this.allLabel, this.el);
      this.customValidator.formValidationHandler(
        this.editExpenditureTypeForm,
        this.allLabel,
        this.el,
        {
          required: {
            expenditureName: "Please enter expenditure type",
          },
        }
      );
    }
    
    
    if (this.editExpenditureTypeForm.valid === true) {
      this.alertHelper.updateAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          this.manageexpendituretypeservice
            .updateExpenditureType(this.editExpenditureTypeForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Expenditure type updated successfully",
                    "success"
                  )
                  .then(() => {
                    this.route.navigate(["../../viewExpenditureType"], {
                      relativeTo: this.router,
                    });
                    this.initializeForm();
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
    this.route.navigate(["../../viewExpenditureType"], {
      relativeTo: this.router,
    });
  }

}


