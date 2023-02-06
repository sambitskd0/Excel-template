import { Component, ElementRef, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { DivyaService } from "../services/divya.service";

@Component({
  selector: "app-resource-center",
  templateUrl: "./resource-center.component.html",
  styleUrls: ["./resource-center.component.css"],
})
export class ResourceCenterComponent implements OnInit {
  resourceCenterForm!: FormGroup;
  noOfRegisteredCwsnVi: any = "";
  noOfRegisteredCwsnHi: any = "";
  noOfRegisteredCwsnOh: any = "";
  noOfRegisteredCwsnSi: any = "";
  noOfRegisteredCwsnId: any = "";
  noOfRegisteredCwsnCp: any = "";
  noOfRegisteredCwsnOthers: any = "";
  noOfRegisteredCwsnTotal: any = "";

  noOfPresentCwsnVi: any = "";
  noOfPresentCwsnHi: any = "";
  noOfPresentCwsnOh: any = "";
  noOfPresentCwsnSi: any = "";
  noOfPresentCwsnId: any = "";
  noOfPresentCwsnCp: any = "";
  noOfPresentCwsnOthers: any = "";
  noOfPresentCwsnTotal: any = "";

  noOfIEPOrITPPrepared: any = "";
  noOfIEPOrITPUpdated: any = "";
  noOfPostedRT: any = "";
  noOfnoOfPresentRT: any = "";
  noOfPostedRP: any = "";
  noOfnoOfPresentRP: any = "";
  sufficientFurniture: any = "1";
  electricity: any = "1";
  lightFan: any = "1";
  waterFacility: any = "1";
  sufficientEquipments: any = "1";
  cleanlinessStatus: any = "1";
  allLabel: string[] = [
    "Registered CWSN VI",
    "Registered CWSN HI",
    "Registered CWSN OH",
    "Registered CWSN SI",
    "Registered CWSN ID",
    "Registered CWSN CP",
    "Registered CWSN OTHERS",
    "Registered CWSN in the current financial year till the date of visit",
    "Present CWSN VI",
    "Present CWSN HI",
    "Present CWSN OH",
    "Present CWSN SI",
    "Present CWSN ID",
    "Present CWSN CP",
    "Present CWSN OTHERS",
    "Present CWSN at the time of visit ",
    "No. of IEP/ITP prepared ",
    "No. of IEP/ITP updated",
    "No. of RT/BRP(IE) posted",
    "No. of RT/BRP(IE)  present",
    "No. of R.P. Posted",
    "No. of R.P. present",
    "Sufficient Furniture for Staff and Parents",
    "Electricity",
    "Light/Fan ",
    "Water Facility",
    "Sufficient Equipments for CWSN ",
    "Cleanliness status",
  ];
  tokenParams: any = "";
  centerName: any = "";
  userDetails!: any;
  constructor(
    private alertHelper: AlertHelper,
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private spinner: NgxSpinnerService,
    private divyaService: DivyaService,
    private route: ActivatedRoute,
    private jwtHelper: JwtHelperService,
    private router: Router,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.getUserDetails();
    this.initializeForm();
  }
  getUserDetails() {
    this.divyaService.getTokenDetails(this.route, this.router);
    this.divyaService.tokenEmitter.subscribe((res: any) => {
      this.userDetails = res;
      this.centerName = this.userDetails.activityCenterName;
    });
  }
  initializeForm() {
    this.resourceCenterForm = this.formBuilder.group({
      noOfRegisteredCwsnVi: [
        this.noOfRegisteredCwsnVi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfRegisteredCwsnHi: [
        this.noOfRegisteredCwsnHi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfRegisteredCwsnOh: [
        this.noOfRegisteredCwsnOh,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfRegisteredCwsnSi: [
        this.noOfRegisteredCwsnSi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfRegisteredCwsnId: [
        this.noOfRegisteredCwsnId,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfRegisteredCwsnCp: [
        this.noOfRegisteredCwsnCp,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfRegisteredCwsnOthers: [
        this.noOfRegisteredCwsnOthers,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfRegisteredCwsnTotal: [
        this.noOfRegisteredCwsnTotal,
        [Validators.required, Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfPresentCwsnVi: [
        this.noOfPresentCwsnVi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfPresentCwsnHi: [
        this.noOfPresentCwsnHi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfPresentCwsnOh: [
        this.noOfPresentCwsnOh,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfPresentCwsnSi: [
        this.noOfPresentCwsnSi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfPresentCwsnId: [
        this.noOfPresentCwsnId,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfPresentCwsnCp: [
        this.noOfPresentCwsnCp,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfPresentCwsnOthers: [
        this.noOfPresentCwsnOthers,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      noOfPresentCwsnTotal: [
        this.noOfPresentCwsnTotal,
        [Validators.required, Validators.pattern(/^[0-9]\d*$/)],
      ],

      noOfIEPOrITPPrepared: [
        this.noOfIEPOrITPPrepared,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]\d*$/),
        ],
      ],
      noOfIEPOrITPUpdated: [
        this.noOfIEPOrITPUpdated,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]\d*$/),
        ],
      ],
      noOfPostedRT: [
        this.noOfPostedRT,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]\d*$/),
        ],
      ],
      noOfnoOfPresentRT: [
        this.noOfnoOfPresentRT,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]\d*$/),
        ],
      ],
      noOfPostedRP: [
        this.noOfPostedRP,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]\d*$/),
        ],
      ],
      noOfnoOfPresentRP: [
        this.noOfnoOfPresentRP,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]\d*$/),
        ],
      ],
      sufficientFurniture: [
        this.sufficientFurniture,
        [Validators.required, Validators.pattern(/^[0-9]\d*$/)],
      ],
      electricity: [
        this.electricity,
        [Validators.required, Validators.pattern(/^[0-9]\d*$/)],
      ],
      lightFan: [
        this.lightFan,
        [Validators.required, Validators.pattern(/^[0-9]\d*$/)],
      ],
      waterFacility: [
        this.waterFacility,
        [Validators.required, Validators.pattern(/^[0-9]\d*$/)],
      ],
      sufficientEquipments: [
        this.sufficientEquipments,
        [Validators.required, Validators.pattern(/^[0-9]\d*$/)],
      ],
      cleanlinessStatus: [
        this.cleanlinessStatus,
        [Validators.required, Validators.pattern(/^[0-9]\d*$/)],
      ],
    });
  }
  totalRegisteredCwsn(
    noOfRegisteredCwsnVi: any,
    noOfRegisteredCwsnHi: any,
    noOfRegisteredCwsnOh: any,
    noOfRegisteredCwsnSi: any,
    noOfRegisteredCwsnId: any,
    noOfRegisteredCwsnCp: any,
    noOfRegisteredCwsnOthers: any
  ) {
    let rVi = 0;
    let rHi = 0;
    let rOh = 0;
    let rSi = 0;
    let rId = 0;
    let rCp = 0;
    let rOthers = 0;
    if (noOfRegisteredCwsnVi.value !== "") {
      rVi = parseInt(noOfRegisteredCwsnVi.value);
    }
    if (noOfRegisteredCwsnHi.value !== "") {
      rHi = parseInt(noOfRegisteredCwsnHi.value);
    }
    if (noOfRegisteredCwsnOh.value !== "") {
      rOh = parseInt(noOfRegisteredCwsnOh.value);
    }
    if (noOfRegisteredCwsnSi.value !== "") {
      rSi = parseInt(noOfRegisteredCwsnSi.value);
    }
    if (noOfRegisteredCwsnId.value !== "") {
      rId = parseInt(noOfRegisteredCwsnId.value);
    }
    if (noOfRegisteredCwsnCp.value !== "") {
      rCp = parseInt(noOfRegisteredCwsnCp.value);
    }
    if (noOfRegisteredCwsnOthers.value !== "") {
      rOthers = parseInt(noOfRegisteredCwsnOthers.value);
    }
    let total: string | number = rVi + rHi + rOh + rSi + rId + rCp + rOthers;
    if (total == 0) {
      this.resourceCenterForm.patchValue({
        noOfRegisteredCwsnTotal: "",
      });
    } else {
      this.resourceCenterForm.patchValue({
        noOfRegisteredCwsnTotal: total,
      });
    }
  }
  presentRegisteredCwsn(
    noOfPresentCwsnVi: any,
    noOfPresentCwsnHi: any,
    noOfPresentCwsnOh: any,
    noOfPresentCwsnSi: any,
    noOfPresentCwsnId: any,
    noOfPresentCwsnCp: any,
    noOfPresentCwsnOthers: any
  ) {
    let pVi = 0;
    let pHi = 0;
    let pOh = 0;
    let pSi = 0;
    let pId = 0;
    let pCp = 0;
    let pOthers = 0;
    if (noOfPresentCwsnVi.value !== "") {
      pVi = parseInt(noOfPresentCwsnVi.value);
    }
    if (noOfPresentCwsnHi.value !== "") {
      pHi = parseInt(noOfPresentCwsnHi.value);
    }
    if (noOfPresentCwsnOh.value !== "") {
      pOh = parseInt(noOfPresentCwsnOh.value);
    }
    if (noOfPresentCwsnSi.value !== "") {
      pSi = parseInt(noOfPresentCwsnSi.value);
    }
    if (noOfPresentCwsnId.value !== "") {
      pId = parseInt(noOfPresentCwsnId.value);
    }
    if (noOfPresentCwsnCp.value !== "") {
      pCp = parseInt(noOfPresentCwsnCp.value);
    }
    if (noOfPresentCwsnOthers.value !== "") {
      pOthers = parseInt(noOfPresentCwsnOthers.value);
    }
    let total: string | number = pVi + pHi + pOh + pSi + pId + pCp + pOthers;
    if (total == 0) {
      this.resourceCenterForm.patchValue({
        noOfPresentCwsnTotal: "",
      });
    } else {
      this.resourceCenterForm.patchValue({
        noOfPresentCwsnTotal: total,
      });
    }
  }
  maxLimitChk(
    maxLimitCntrl: string,
    compareCntrl: string,
    maxLimitCntrlLabel: string,
    compareCntrlLabel: string
  ) {
    let mlc =
      this.resourceCenterForm.get(maxLimitCntrl)?.value > 0
        ? parseInt(this.resourceCenterForm.get(maxLimitCntrl)?.value)
        : 0;
    let cc =
      this.resourceCenterForm.get(compareCntrl)?.value > 0
        ? parseInt(this.resourceCenterForm.get(compareCntrl)?.value)
        : 0;
    if (cc > mlc) {
      this.alertHelper
        .viewAlertHtml(
          "error",
          "Invalid inputs",
          maxLimitCntrlLabel +
            " can not be empty. Please enter " +
            maxLimitCntrlLabel +
            " first."
        )
        .then((res: any) => {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + compareCntrl + '"]'
          );
          this.resourceCenterForm.get(compareCntrl)?.patchValue("");
          invalidControl.focus();
        });
    }
    if (mlc > 0 && cc > 0) {
      if (mlc < cc) {
        this.alertHelper
          .viewAlertHtml(
            "error",
            "Invalid inputs",
            compareCntrlLabel + " can not be greater than " + maxLimitCntrlLabel
          )
          .then((res: any) => {
            const invalidControl = this.el.nativeElement.querySelector(
              '[formControlName="' + compareCntrl + '"]'
            );
            this.resourceCenterForm.get(compareCntrl)?.patchValue("");
            invalidControl.focus();
          });
      }
    }
  }
  checkFromTotalElement(
    compareCntrl1: string,
    maxLimitCntrl: string,
    type: string
  ) {
    let mlc = parseInt(this.resourceCenterForm.get(maxLimitCntrl)?.value);
    let cc1 = parseInt(this.resourceCenterForm.get(compareCntrl1)?.value);
    if (
      this.resourceCenterForm.get(maxLimitCntrl)?.value == "" &&
      this.resourceCenterForm.get(compareCntrl1)?.value !== ""
    ) {
      this.alertHelper
        .viewAlertHtml(
          "error",
          "Invalid inputs",
          "Registered CWSN " + type + " can not be empty"
        )
        .then((res: any) => {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + maxLimitCntrl + '"]'
          );
          invalidControl.focus();
        });
    }
    if (mlc < cc1) {
      this.alertHelper
        .viewAlertHtml(
          "error",
          "Invalid inputs",
          "Registered CWSN " +
            type +
            " can not be Smaller than CWSN Present " +
            type +
            ""
        )
        .then((res: any) => {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + maxLimitCntrl + '"]'
          );
          invalidControl.focus();
        });
    }
  }
  onSubmit() {
    // console.log(this.resourceCenterForm);
    if ("INVALID" === this.resourceCenterForm.status) {
      for (const key of Object.keys(this.resourceCenterForm.controls)) {

        if (this.resourceCenterForm.controls[key].status === "INVALID") {

          let invalidControl;
          switch (key) {
            case "noOfRegisteredCwsnTotal":
              invalidControl = this.el.nativeElement.querySelector(
                '[formControlName="noOfRegisteredCwsnVi"]'
              );
              break;
            case "noOfPresentCwsnTotal":
              invalidControl = this.el.nativeElement.querySelector(
                '[formControlName="noOfPresentCwsnVi"]'
              );
              break;
            case "noOfAssistiveDevicesTotal":
              invalidControl = this.el.nativeElement.querySelector(
                '[formControlName="noOfAssistiveDevicesVi"]'
              );
              break;
            case "noOfEducationalCwsnTotal":
              invalidControl = this.el.nativeElement.querySelector(
                '[formControlName="noOfEducationalCwsnVi"]'
              );
              break;
            case "noOfEducationalCwsnTotal":
              invalidControl = this.el.nativeElement.querySelector(
                '[formControlName="noOfEducationalCwsnVi"]'
              );
              break;
            case "noOfSkillCwsnTotal":
              invalidControl = this.el.nativeElement.querySelector(
                '[formControlName="noOfSkillCwsnVi"]'
              );
              break;

            default:
              invalidControl = this.el.nativeElement.querySelector(
                '[formControlName="' + key + '"]'
              );
              break;
          }
          invalidControl.focus();
          this.customValidators.formValidationHandler(
            this.resourceCenterForm,
            this.allLabel
          );
          break;
        }
      }
    }
    if (this.resourceCenterForm.invalid) {
      return;
    }
    if (this.resourceCenterForm.valid === true) {
      this.alertHelper.submitAlert().then((result: any) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.divyaService
            .saveResourceCenter(this.resourceCenterForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Resource Center data  saved successfully.",
                    "success"
                  )
                  .then(() => {
                    this.router.navigate(["../success"], {
                      relativeTo: this.route,
                    });
                  });
                this.initializeForm();
              },
              error: (error: any) => {
                this.spinner.hide(); //==== hide spinner
                let errorMessage: string = "";
                if (typeof error.error.msg === "string") {
                  errorMessage +=
                    '<i class="bi bi-arrow-right text-danger"></i> ' +
                    error.error.msg +
                    `<br>`;
                } else {
                  error.error.msg.map(
                    (message: string) =>
                      (errorMessage +=
                        '<i class="bi bi-arrow-right text-danger"></i> ' +
                        message +
                        `<br>`)
                  );
                }
                this.alertHelper.viewAlertHtml(
                  "error",
                  "Invalid inputs",
                  errorMessage
                );
              },
              // complete: () => console.log('done'),
            });
        }
      });
    }
  }
  resetForm() {
    this.initializeForm();
  }
  keyUpInputNumber(event: any, controlname: any, maxLength: number = 3) {
    if (event.target.value.length > maxLength) {
      event.target.value = event.target.value.substr(0, maxLength);
      this.resourceCenterForm.get(controlname)?.patchValue(event.target.value);
    }
    var charCode = event.which ? event.which : event.keyCode;

    if (charCode < 48 || charCode > 57) {
      event.target.value = event.target.value.replace(/[^\d]/g, "");
      this.resourceCenterForm.get(controlname)?.patchValue(event.target.value);
      return false;
    } else {
      return true;
    }
  }
}
