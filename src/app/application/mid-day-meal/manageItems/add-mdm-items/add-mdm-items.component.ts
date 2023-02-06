import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageMdmItemService } from '../../services/manage-mdm-item.service';

@Component({
  selector: 'app-add-mdm-items',
  templateUrl: './add-mdm-items.component.html',
  styleUrls: ['./add-mdm-items.component.css']
})
export class AddMdmItemsComponent implements OnInit {

  MDMMasterAddForm!:FormGroup;

  isSelected: boolean = true;
  MDMItemDatas: any     = [];
  itemName: any         = "";
  description: any      = "";
  allErrorMessages: string[] = [];
  allLabel: string[] = ["", "","Item name","Description"];
  submitted = false;
  userId: any = "";
  profileId: any = "";

  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  
  constructor( public customValidators: CustomValidators,  
    private formBuilder: FormBuilder, 
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    public commonService:CommonserviceService,
    public manageMdmItemService: ManageMdmItemService,
    private el: ElementRef 
    
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
    this.el.nativeElement.querySelector("[formControlName=itemName]").focus();
    this.initializeForm();
  }
  ngAfterViewInit(){
    this.el.nativeElement.querySelector("[formControlName=itemName]").focus();
  }
initializeForm() {
    this.MDMMasterAddForm = this.formBuilder.group({
      userId:[this.userId],
      profileId:[this.profileId],
      itemName: [
        this.itemName,
        [
          Validators.required,Validators.maxLength(25),Validators.minLength(2),Validators.pattern('^[a-zA-Z \-\']+'),this.customValidators.firstCharValidatorRF
        ],
      ],
      description: [
        this.description,[Validators.maxLength(500),this.customValidators.firstCharValidatorRF],
      ],
    });
  }
  get mdmItemFormControl() {
    return this.MDMMasterAddForm.controls;
  }
  onSubmit(){
    // if ("INVALID" === this.MDMMasterAddForm.status) {
    //   for (const key of Object.keys(this.MDMMasterAddForm.controls)) {
    //     if (this.MDMMasterAddForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.MDMMasterAddForm,this.allLabel);
    //       break;
    //     }
    //   }
    // }
    if(this.MDMMasterAddForm.invalid){
      // this.customValidators.formValidationHandler(this.MDMMasterAddForm,this.allLabel, this.el);
      this.customValidators.formValidationHandler(
        this.MDMMasterAddForm,
        this.allLabel,
        this.el,
        {
          required: {
            itemName: "Please enter item name",
          },
        }
      );
    }
    if (this.MDMMasterAddForm.invalid) {
      return;
    }
    if (this.MDMMasterAddForm.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.manageMdmItemService
            .createMDMItem(this.MDMMasterAddForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "MDM item name saved successfully",
                    "success"
                  )
                  .then(() => {
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
