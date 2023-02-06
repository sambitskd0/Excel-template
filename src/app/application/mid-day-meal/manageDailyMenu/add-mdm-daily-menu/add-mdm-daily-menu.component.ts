import { Component, ElementRef, OnInit, QueryList, ViewChildren } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { Constant } from "src/app/shared/constants/constant";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { ManageMdmDailyMenuService } from "../../services/manage-mdm-daily-menu.service";

@Component({
  selector: "app-add-mdm-daily-menu",
  templateUrl: "./add-mdm-daily-menu.component.html",
  styleUrls: ["./add-mdm-daily-menu.component.css"],
})
export class AddMdmDailyMenuComponent implements OnInit {
  @ViewChildren("checkboxes") checkboxes!: QueryList<ElementRef>
  addMdmDailyItem!: FormGroup;
  isSelected: boolean = true;
  adminPrivilege: boolean = false;
  submitted: boolean = false;

  MdmDailyItemDatas: any = "";
  daysNames: any = "";
  itemNames: any = "";
  weeklyDays: any = "";
  effectiveDate: any = "";
  updateEffectiveDateStr: any = "";
  description: any = "";
  minDate: any = Date;

  allErrorMessages: string[] = [];
  allLabel: string[] = [
    "Day of week",
    "Items",
    "Effective date",
    "",
    "Description",
    "",
  ];
  itemsArr: any = [];

  userId: any = "";
  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();
  profileId: any = "";

  constructor(
    public customValidators: CustomValidators,
    private el: ElementRef,
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    public commonService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper, //For menu privilege
    private router: Router,
    public manageMdmDailyMenuService: ManageMdmDailyMenuService,
    private commonFunctionHelper: CommonFunctionHelper
  ) {
    const pageUrl: any = this.router.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl); //For menu privilege
    this.commonService.verifyLinkPermission(
      pageUrl,
      this.config.linkType[2],
      this.config.privilege[4]
    ); // For authorization
    this.minDate = new Date();
  }
  ngOnInit(): void {
    if (this.plPrivilege == "admin") {
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
    this.initializeForm();
  }
  initializeForm() {
    this.addMdmDailyItem = this.formBuilder.group({
      weeklyDays: [
        this.weeklyDays,
        [Validators.required, Validators.pattern("^[0-9]*$")],
      ],
      itemsArr: this.formBuilder.array([]),
      effectiveDate: [this.effectiveDate, Validators.required],
      updateEffectiveDateStr: [this.updateEffectiveDateStr],
      description: [
        this.description,
        [
          Validators.maxLength(500),
          this.customValidators.firstCharValidatorRF,
        ],
      ],
      userId: [this.userId],
      profileId: [this.profileId],
    });
  }
  get mdmDailyItemFormControl() {
    return this.addMdmDailyItem.controls;
  }
  onSubmit() {
    /* this.customValidators.formValidationHandler(
  this.addMdmDailyItem,
  this.allLabel
); */
    // if ("INVALID" === this.addMdmDailyItem.status) {
    //   for (const key of Object.keys(this.addMdmDailyItem.controls)) {
    //     if (this.addMdmDailyItem.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(
    //         this.addMdmDailyItem,
    //         this.allLabel
    //       );
    //       break;
    //     }
    //   }
    // }
    // console.log(this.addMdmDailyItem.value.itemsArr.length,"manoj");
    if(this.addMdmDailyItem.value.itemsArr.length==0){
      this.alertHelper.viewAlert("error","Invalid","Please select the item name");
      return;
    }
    if (this.addMdmDailyItem.invalid) {
      // this.customValidators.formValidationHandler(this.addMdmDailyItem,this.allLabel, this.el);
      this.customValidators.formValidationHandler(
        this.addMdmDailyItem,
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
    if (this.addMdmDailyItem.invalid) {
      return;
    }
    if (this.addMdmDailyItem.valid === true) {
      this.alertHelper.submitAlert().then((result: any) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          let upEffectiveDateStr = this.commonFunctionHelper.formatDateHelper(
            this.addMdmDailyItem.get("effectiveDate")?.value
          );
          this.addMdmDailyItem.patchValue({
            updateEffectiveDateStr: upEffectiveDateStr,
          });
          this.manageMdmDailyMenuService
            .createMdmDailyItem(this.addMdmDailyItem.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Daily menu created successfully.",
                    "success"
                  )
                  .then(() => {
                    this.resetFormArray();
                    this.addMdmDailyItem.patchValue({
                      effectiveDate: "",
                    });
                    this.initializeForm();
                    //this.effectiveDate="";
                  });
              },
              error: (error: any) => {
                this.spinner.hide(); //==== hide spinner
              },
            });
        } else {
          this.spinner.hide(); //==== hide spinner
        }
      });
    }
  }
  resetFormArray() {
   
    let frmArray = this.addMdmDailyItem.get('itemsArr') as FormArray;   
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;   
      // frmArray.removeAt(i)   
    });
  }
  changeItem(e: any) {
    const itemsArr: FormArray = this.addMdmDailyItem.get(
      "itemsArr"
    ) as FormArray;
    if (e.target.checked) {
      itemsArr.push(new FormControl(e.target.value));
     
      
    } else {
      const index = itemsArr.controls.findIndex(
        (x) => x.value === e.target.value
      );
      itemsArr.removeAt(index);
      
    }
    // const itemsArr: FormArray = this.addMdmDailyItem.get('itemsArr') as FormArray;
    // let index = this.itemsArr.indexOf(e.target.value);
    // if(e.target.checked){
    //   itemsArr.push(new FormControl(e.target.value));
    // }else{
    //   const index = itemsArr.controls.findIndex(x => x.value === e.target.value);
    //   itemsArr.removeAt(index);
    // }
  }
}
