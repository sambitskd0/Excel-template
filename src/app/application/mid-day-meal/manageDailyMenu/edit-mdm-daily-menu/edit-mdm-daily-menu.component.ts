import { Component, ElementRef, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CommonFunctionHelper } from 'src/app/core/helpers/common-function-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageMdmDailyMenuService } from '../../services/manage-mdm-daily-menu.service';

@Component({
  selector: 'app-edit-mdm-daily-menu',
  templateUrl: './edit-mdm-daily-menu.component.html',
  styleUrls: ['./edit-mdm-daily-menu.component.css']
})
export class EditMdmDailyMenuComponent implements OnInit {

  editMdmDailyItem!: FormGroup;
  isSelected: boolean = true;
  MdmDailyItemDatas: any = "";
  daysNames: any = "";
  itemNames: any = "";

  weeklyDays: any = "";
  effectiveDate: any = "";
  description: any = "";
  minDate: any = Date;
  allErrorMessages: string[] = [];
  allLabel: string[] = ["", "", "Day of week", "Items", "Effective date", "Description", ""];
  submitted = false;
  itemsArr: any = [];
  encId: any = "";
  id: any;
  userId: any;
  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  profileId: any = "";
  constructor(private el: ElementRef,
    public customValidators: CustomValidators,
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private spinner: NgxSpinnerService,
    public commonService: CommonserviceService,
    public manageMdmDailyMenuService: ManageMdmDailyMenuService,
    private route: Router,
    private router: ActivatedRoute,
    private commonFunctionHelper: CommonFunctionHelper,
  ) {
    const pageUrl: any = this.route.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization  
    
  }

  ngOnInit(): void {
    if (this.plPrivilege == 'admin') {
      this.adminPrivilege = true;
    }
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.el.nativeElement.querySelector("[formControlName=weeklyDays]").focus();
    this.manageMdmDailyMenuService.getWeekDays().subscribe((res: any) => {
      this.daysNames = res.data;
    });
    this.manageMdmDailyMenuService.getMdmItemName().subscribe((res: any) => {
      this.itemNames = res.data;
    });
    this.id = this.router.snapshot.params["encId"];
    this.editMdmDailyItemData(this.id);
    this.initializeform();
  }

  initializeform() {
    this.editMdmDailyItem = this.formBuilder.group({
      userId: [this.userId],
      profileId: [this.profileId],
      weeklyDays: [this.weeklyDays, [Validators.required, , Validators.pattern('^[0-9]*$')]],
      itemsArr: this.formBuilder.array(this.itemsArr),
      effectiveDate: [this.effectiveDate, [Validators.required]],
      description: [this.description, [this.customValidators.firstCharValidatorRF]],
      encId: [this.encId],
    });
  }
  editMdmDailyItemData(id: any) {
    this.spinner.show();
    this.manageMdmDailyMenuService
      .getMdmDailyItemName(this.id)
      .subscribe((data: any) => {
        this.MdmDailyItemDatas = data;
        this.MdmDailyItemDatas = this.MdmDailyItemDatas?.data;
        this.itemsArr = this.MdmDailyItemDatas?.itemTaggedArr;
        this.weeklyDays = this.MdmDailyItemDatas?.weekDaysId;
        this.effectiveDate = new Date(this.MdmDailyItemDatas?.effectiveDate.toString());
        this.description = this.MdmDailyItemDatas?.description;
        this.encId = this.MdmDailyItemDatas?.encId;
        this.initializeform();
        this.minDate =  this.effectiveDate;
       
        this.spinner.hide();
      });
  }

  // changeItem(event:any){
  //   const iteffectiveDateemsArr: FormArray = this.editMdmDailyItem.get('itemsArr') as FormArray;
  //   if (this.itemsArr.includes(parseInt(event.target.value))) {
  //     const index = this.itemsArr.indexOf(
  //       parseInt(event.target.value),
  //       0
  //     );
  //     if (index > -1) {
  //       this.itemsArr.splice(index, 1);
  //     }
  //   } else {
  //     this.itemsArr.push(parseInt(event.target.value));
  //   }
  //   this.initializeform();
  // }
  changeItem(e: any) {
    const iteffectiveDateemsArr: FormArray = this.editMdmDailyItem.get('itemsArr') as FormArray;
    if (e.target.checked) {
      iteffectiveDateemsArr.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      iteffectiveDateemsArr.controls.forEach((item: any) => {
        if (item?.value == e.target.value) {
          const index = iteffectiveDateemsArr.controls.findIndex(x => x.value === item?.value);
          iteffectiveDateemsArr.removeAt(index);
        }
        i++;
      });
    }
  }
  onSubmit() {
    this.submitted = true;
    // if ("INVALID" === this.editMdmDailyItem.status) {
    //   for (const key of Object.keys(this.editMdmDailyItem.controls)) {
    //     if (this.editMdmDailyItem.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.editMdmDailyItem, this.allLabel);
    //       break;
    //     }
    //   }
    // }
    if(this.editMdmDailyItem.value.itemsArr.length==0){
      this.alertHelper.viewAlert("error","Invalid","Please select the item name");
      return;
    }
    if (this.editMdmDailyItem.invalid) {
      // this.customValidators.formValidationHandler(this.editMdmDailyItem,this.allLabel, this.el);
      this.customValidators.formValidationHandler(
        this.editMdmDailyItem,
        this.allLabel,
        this.el,
        {
          required: {
            weeklyDays: "Please select the week day",
            effectiveDate: "Please select the effective date",
          },
        }
      );
    }
    if (this.editMdmDailyItem.invalid) {
      return;
    }
    if (this.editMdmDailyItem.valid === true) {
      this.alertHelper
        .updateAlert(
          "Do you want to update the records ?",
          "question",
          "Yes, update it!",
          "No, keep it"
        )
        .then((result: any) => {
          if (result.value) {
            let effectiveDateStr = this.commonFunctionHelper.formatDateHelper(this.editMdmDailyItem.get("effectiveDate")?.value);
            this.editMdmDailyItem.patchValue({
              receiveDate: effectiveDateStr,
            });
            this.spinner.show(); // ==== show spinner
            this.manageMdmDailyMenuService.updateMdmDailyItem(this.editMdmDailyItem.value).subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Daily menu updated successfully.",
                    "success"
                  )
                  .then(() => {
                    this.route.navigate(["../../viewDailyMenu"], {
                      relativeTo: this.router,
                    });
                  });
              },
              error: (error: any) => {
                this.spinner.hide(); //==== hide spinner
              },
            });
          }
          else {
            this.spinner.hide(); //==== hide spinner
          }
        });
    }
  }
  onCancel() {
    this.route.navigate(["../../viewDailyMenu"], {
      relativeTo: this.router,
    });
  }
}
