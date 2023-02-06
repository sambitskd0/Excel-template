import { Component, ElementRef, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { Constant } from "src/app/shared/constants/constant";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { ShiftmasterService } from "../../services/shiftmaster.service";

@Component({
  selector: "app-edit-shiftmaster",
  templateUrl: "./edit-shiftmaster.component.html",
  styleUrls: ["./edit-shiftmaster.component.css"],
})
export class EditShiftmasterComponent implements OnInit {
  editShiftMasterForm!: FormGroup;
  submitted = false;
  id: number = 0;
  shiftmasterData: any;
  shift: any = "";
  shiftStartTime: any;
  shiftEndTime: any;
  encId: any = "";
  userId: any = "";
  profileId: any = "";
  allErrorMessages: string[] = [];
  allLabel: any = ["", "Shift", "Period from time", "Period to time"];
  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  constructor(
    public customValidator: CustomValidators,
    private fb: FormBuilder,
    public shiftmasterservice: ShiftmasterService,
    private privilegeHelper: PrivilegeHelper, //For menu privilege
    private route: Router,
    private router: ActivatedRoute,
    private el: ElementRef,
    public commonserviceService: CommonserviceService,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService
  ) {
    const pageUrl: any = this.route.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl); //For menu privilege
    this.commonserviceService.verifyLinkPermission(
      pageUrl,
      this.config.linkType[2],
      this.config.privilege[4]
    ); // For authorization
  }

  ngOnInit(): void {
    if (this.plPrivilege == "admin") {
      this.adminPrivilege = true;
    }
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.spinner.show();
    this.id = this.router.snapshot.params["encId"];
    this.initializeForm();
    this.el.nativeElement.querySelector("[formControlName=shift]").focus();
    this.editShiftMaster(this.id);
  }
  initializeForm() {
    this.editShiftMasterForm = this.fb.group({
      userId: [this.userId],
      profileId: [this.profileId],
      shift: [this.shift, [Validators.required]],
      shiftStartTime: [this.shiftStartTime, [Validators.required]],
      shiftEndTime: [this.shiftEndTime, [Validators.required]],
      encId: [this.encId],
    });
  }
  editShiftMaster(id: any) {
    this.spinner.show();
    this.shiftmasterservice.getShiftMaster(this.id).subscribe((res: any) => {
      this.shiftmasterData = res;
      this.shiftmasterData = this.shiftmasterData.data;
      this.shift = this.shiftmasterData.shift;
      this.shiftStartTime = this.shiftmasterData.shiftStartTime;
      this.shiftEndTime = this.shiftmasterData.shiftEndTime;
      this.encId = this.shiftmasterData.encId;
      this.initializeForm();
      this.spinner.hide();
    });
  }
  onSubmit() {
    // if ("INVALID" === this.editShiftMasterForm.status) {
    //   for (const key of Object.keys(this.editShiftMasterForm.controls)) {
    //     if (this.editShiftMasterForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidator.formValidationHandler(
    //         this.editShiftMasterForm,
    //         this.allLabel
    //       );
    //       break;
    //     }
    //   }
    // }
    if (this.editShiftMasterForm.invalid) {
      this.customValidator.formValidationHandler(this.editShiftMasterForm, this.allLabel, this.el);
    }
    if (this.editShiftMasterForm.invalid) {
      return;
    }
    if (this.editShiftMasterForm.valid === true) {
      this.alertHelper.updateAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          this.shiftmasterservice
            .updateShiftMaster(this.editShiftMasterForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Shiftmaster updated successfully",
                    "success"
                  )
                  .then(() => {
                    this.route.navigate(["../../viewShiftMaster"], {
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
    this.route.navigate(["../../viewShiftMaster"], {
      relativeTo: this.router,
    });
  }
}
