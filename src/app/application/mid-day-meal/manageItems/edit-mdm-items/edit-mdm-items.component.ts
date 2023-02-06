import { Component, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageMdmItemService } from '../../services/manage-mdm-item.service';

@Component({
  selector: 'app-edit-mdm-items',
  templateUrl: './edit-mdm-items.component.html',
  styleUrls: ['./edit-mdm-items.component.css']
})
export class EditMdmItemsComponent implements OnInit {
  MDMMasterEditForm!: FormGroup;
  id: any = "";
  ImdmItemDatas: any = "";
  itemName: any = "";
  description: any = "";
  encId: any = "";
  allErrorMessages: string[] = [];
  allLabel: string[] = ["", "", "Item name", "Description", ""];
  submitted = false;
  userId: any;
  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;

  profileId: any = "";

  constructor(
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private spinner: NgxSpinnerService, private route: Router,
    private router: ActivatedRoute,
    public manageMdmItemService: ManageMdmItemService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    public customValidator: CustomValidators,
    public formBuilder: FormBuilder,
    public commonService: CommonserviceService,
    private el: ElementRef
  ) {
    const pageUrl: any = this.route.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization  
  }

  ngOnInit(): void {
    if (this.plPrivilege == 'admin') {
      this.adminPrivilege = true;
    }
    this.id = this.router.snapshot.params["encId"];
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.el.nativeElement.querySelector("[formControlName=itemName]").focus();
    this.initializeForm();
    this.getMdmItem(this.id);
  }
  ngAfterViewInit(){
    this.el.nativeElement.querySelector("[formControlName=itemName]").focus();
  }

  initializeForm() {
    this.MDMMasterEditForm = this.formBuilder.group({
      userId: [this.userId],
      profileId: [this.profileId],
      itemName: [
        this.itemName,
        [
          Validators.required, Validators.maxLength(25), Validators.minLength(2), Validators.pattern('^[a-zA-Z \-\']+'), this.customValidators.firstCharValidatorRF
        ],
      ],
      description: [
        this.description,
        [Validators.maxLength(500),this.customValidators.firstCharValidatorRF],
      ],
      encId: [this.encId],
    });
  }
  getMdmItem(id: any) {
    this.spinner.show();
    this.manageMdmItemService.getMdmItem(this.id).subscribe((res: any) => {
      this.ImdmItemDatas = res;
      this.ImdmItemDatas = this.ImdmItemDatas.data[0];
      this.itemName = this.ImdmItemDatas.itemName;
      this.description = this.ImdmItemDatas.description;
      this.encId = this.ImdmItemDatas.encId;
      this.spinner.hide();
      this.initializeForm();
    });
  }
  onSubmit() {
    // if ("INVALID" === this.MDMMasterEditForm.status) {
    //   for (const key of Object.keys(this.MDMMasterEditForm.controls)) {
    //     if (this.MDMMasterEditForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.MDMMasterEditForm, this.allLabel);
    //       break;
    //     }
    //   }
    // }
    if(this.MDMMasterEditForm.invalid){
      // this.customValidators.formValidationHandler(this.MDMMasterEditForm, this.allLabel, this.el);
      this.customValidators.formValidationHandler(
        this.MDMMasterEditForm,
        this.allLabel,
        this.el,
        {
          required: {
            itemName: "Please enter item name",
          },
        }
      );
    }
    if (this.MDMMasterEditForm.invalid) {
      return;
    }
    if (this.MDMMasterEditForm.valid === true) {
      this.alertHelper
      .updateAlert(
        "Do you want to update the records ?",
        "question",
        "Yes, update it!",
        "No, keep it"
      )
      .then((result: any) => {
        if (result.value) {
          this.spinner.show();
          this.manageMdmItemService.updateMdmItem(this.MDMMasterEditForm.value).subscribe({
            next: (res: any) => {
              this.spinner.hide();
              this.alertHelper
                .successAlert(
                  "Saved!",
                  "MDM Item name updated successfully",
                  "success"
                )
                .then(() => {
                  this.route.navigate(["../../viewMdmItems"], {
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
  onCancel() {
    this.route.navigate(["../../viewMdmItems"], {
      relativeTo: this.router,
    });
  }
}
