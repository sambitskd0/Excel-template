/**
 * Created By  : Sambit Kumar Dalai
 * Created On  : 01-08-2022
 * Description : School survey school.
 **/

import { Component, ElementRef, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Data, Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { NgxImageCompressService } from "ngx-image-compress";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { DivyaService } from "../services/divya.service";

@Component({
  selector: "app-school-survey",
  templateUrl: "./school-survey.component.html",
  styleUrls: ["./school-survey.component.css"],
})
export class SchoolSurveyComponent implements OnInit {
  file: any;
  localUrl: any;
  localCompressedURl: any;
  sizeOfOriginalImage!: number;
  sizeOFCompressedImage!: number;
  imgResultBeforeCompress!: string;
  imgResultAfterCompress!: string;
  // member variables
  schoolSurveyForm!: FormGroup;
  totalCwsnVi: any = "";
  totalCwsnHi: any = "";
  totalCwsnOh: any = "";
  totalCwsnSi: any = "";
  totalCwsnId: any = "";
  totalCwsnCp: any = "";
  totalCwsnOthers: any = "";
  totalEnrolledCwsn: any = "";

  presentCwsnVi: any = "";
  presentCwsnHi: any = "";
  presentCwsnOh: any = "";
  presentCwsnSi: any = "";
  presentCwsnId: any = "";
  presentCwsnCp: any = "";
  presentCwsnOthers: any = "";
  totalPresentCwsn: any = "";
  rtBrpVisitDate: any = "";
  iepPrepared: any = "";
  iepUpdated: any = "";
  rampAvailable: any = "1";
  toiletAvailability: any = "1";
  provisionToUpdateAPicture!: File;
  provisionToUpdateAPictureUrl!: any;
  token!: any;
  tokenParams: any = "";
  rtBrpVisitDateConv: any = "";
  maxDate: any = Date;
  userDetails!: any;
  //end
  allLabel: string[] = [
    "Enrolled CWSN in School VI",
    "Enrolled CWSN in School HI",
    "Enrolled CWSN in School OH",
    "Enrolled CWSN in School SI",
    "Enrolled CWSN in School ID",
    "Enrolled CWSN in School CP",
    "Enrolled CWSN in School Others",
    "Enrolled CWSN in School",
    "Present CWSN VI",
    "Present CWSN HI",
    "Present CWSN OH",
    "Present CWSN SI",
    "Present CWSN ID",
    "Present CWSN CP",
    "Present CWSN Others",
    "Present CWSN",
    "Last date of visit of RT/BRP (IE)",
    "No. of IEP prepared",
    "No. of IEP updated ",
    "RAMP available in school ?",
    "Disable Friendly toilet availability ",
  ];
  constructor(
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private alertHelper: AlertHelper,
    private el: ElementRef,
    private imageCompress: NgxImageCompressService,
    private route: ActivatedRoute,
    private jwtHelper: JwtHelperService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private divyaService: DivyaService
  ) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    // this.getToken() ;
    this.getUserDetails();
    this.initializeForm();
  }

  // get user details
  getUserDetails() {
    this.divyaService.getTokenDetails(this.route, this.router);
    // check if side nav status
    this.divyaService.tokenEmitter.subscribe((res: any) => {
      this.userDetails = res;
    });
  }
  initializeForm() {
    this.schoolSurveyForm = this.formBuilder.group({
      totalCwsnVi: [
        this.totalCwsnVi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalCwsnHi: [
        this.totalCwsnHi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalCwsnOh: [
        this.totalCwsnOh,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalCwsnSi: [
        this.totalCwsnSi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalCwsnId: [
        this.totalCwsnId,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalCwsnCp: [
        this.totalCwsnCp,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalCwsnOthers: [
        this.totalCwsnOthers,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalEnrolledCwsn: [
        this.totalEnrolledCwsn,
        [Validators.required, Validators.pattern(/^[0-9]\d*$/)],
      ],
      presentCwsnVi: [
        this.presentCwsnVi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      presentCwsnHi: [
        this.presentCwsnHi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      presentCwsnOh: [
        this.presentCwsnOh,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      presentCwsnSi: [
        this.presentCwsnSi,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      presentCwsnId: [
        this.presentCwsnId,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      presentCwsnCp: [
        this.presentCwsnCp,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      presentCwsnOthers: [
        this.presentCwsnOthers,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]\d*$/)],
      ],
      totalPresentCwsn: [
        this.totalPresentCwsn,
        [Validators.required, Validators.pattern(/^[0-9]\d*$/)],
      ],
      rtBrpVisitDate: [this.rtBrpVisitDate, [Validators.required]],
      iepPrepared: [
        this.iepPrepared,
        [
          Validators.maxLength(3),
          Validators.required,
          Validators.pattern(/^[0-9]\d*$/),
        ],
      ],
      iepUpdated: [
        this.iepUpdated,
        [
          Validators.maxLength(3),
          Validators.required,
          Validators.pattern(/^[0-9]\d*$/),
        ],
      ],

      rampAvailable: [
        this.rampAvailable,
        [Validators.required]
        
      ],
      toiletAvailability: [
        this.toiletAvailability,
        [Validators.required]
      ],
      provisionToUpdateAPicture: [
        this.provisionToUpdateAPicture,        
      ],

      
      fileSource: [""],
      tokenParams: [this.token],
    });
  }
  selectFile(event: any) {
    var fileName: any;
    this.file = event.target.files[0];
    if (
      this.file.type != "image/png" &&
      this.file.type != "image/jpg" &&
      this.file.type != "image/jpeg"
    ) {
      event.target.value = "";
      this.schoolSurveyForm.patchValue({ provisionToUpdateAPicture: "" });
      this.alertHelper.viewAlertHtml(
        "error",
        "Error",
        '<i class="bi bi-arrow-right text-danger"></i> File type should be png, jpg or jpeg file'
      );
      return;
    } else {
      fileName = this.file["name"];
      if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.localUrl = event.target.result;
          this.compressFile(this.localUrl, fileName);
        };
        reader.readAsDataURL(event.target.files[0]);
      }
    }
  }

  compressFile(image: any, fileName: any) {
    var orientation = -1;
    // this.sizeOfOriginalImage = this.imageCompress.byteCount(image)/(1024*1024);
    this.sizeOfOriginalImage = this.imageCompress.byteCount(image);
    // console.warn("Size in bytes is now:", this.sizeOfOriginalImage);
    this.imageCompress
      .compressFile(image, orientation, 50, 50)
      .then((result:any) => {
        this.imgResultAfterCompress = result;
        this.schoolSurveyForm.patchValue({
          fileSource: this.imgResultAfterCompress,
        });
        this.localCompressedURl = result;
        // this.sizeOFCompressedImage = this.imageCompress.byteCount(result)/(1024*1024)
        this.sizeOFCompressedImage = this.imageCompress.byteCount(result);
        // console.warn(
        //   "Size in bytes after compression:",
        //   this.sizeOFCompressedImage
        // );
        // create file from byte
        const imageName = fileName;
        // call method that creates a blob from dataUri
        const imageBlob = this.dataURItoBlob(
          this.imgResultAfterCompress.split(",")[1]
        );
        //imageFile created below is the new compressed file which can be send to API in form data
        const imageFile = new File([result], imageName, { type: "image/jpeg" });
      });
  }
  dataURItoBlob(dataURI: any) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: "image/jpeg" });
    return blob;
  }
  // imageUploadHandler(event: any) {
  //   const uploadedImage = event.target.files[0];
  //   if (uploadedImage != null) {
  //     if (
  //       uploadedImage.type != "image/png" &&
  //       uploadedImage.type != "image/jpg" &&
  //       uploadedImage.type != "image/jpeg"
  //     ) {
  //       event.target.value = "";
  //       this.schoolSurveyForm.patchValue({ provisionToUpdateAPicture: "" });
  //       this.alertHelper.viewAlertHtml(
  //         "error",
  //         "Error",
  //         '<i class="bi bi-arrow-right text-danger"></i> File type should be png, jpg or jpeg file'
  //       );
  //       return;
  //     }
  //     // max 300kb allowed
  //     if (uploadedImage.size >= 1024 * 300) {
  //       event.target.value = "";
  //       this.schoolSurveyForm.patchValue({ provisionToUpdateAPicture: "" });
  //       this.alertHelper.viewAlertHtml(
  //         "error",
  //         "Error",
  //         '<i class="bi bi-arrow-right text-danger"></i> Image size should not be greater than 300 KB'
  //       );
  //       return;
  //     }

  //     const reader = new FileReader();
  //     if (event.target.files && event.target.files.length) {
  //       const [file] = event.target.files;
  //       reader.readAsDataURL(file);
  //       reader.onload = () => {
  //         this.setImage(
  //           reader.result,
  //           "provisionToUpdateAPicture",
  //           uploadedImage
  //         );
  //       };
  //     }
  //   }
  // }
  // // preview image and patch field
  // setImage(image: any, controlName: string, uploadedImage: any) {
  //   // this.formData.set("questionImg", uploadedImage);
  //   this.provisionToUpdateAPictureUrl = image;
  //   this.schoolSurveyForm.patchValue({ controlName: image });
  // }
  totalCalculation(
    valueOne: any,
    valueTwo: any,
    valueThree: any,
    valueFour: any,
    valueFive: any,
    valueSix: any,
    valueSeven: any,
    calculationFor: any
  ) {
    let vOne = 0;
    let vTwo = 0;
    let vThree = 0;
    let vFour = 0;
    let vFive = 0;
    let vSix = 0;
    let vSeven = 0;
    if (valueOne.value !== "") {
      vOne = parseInt(valueOne.value);
    }
    if (valueTwo.value !== "") {
      vTwo = parseInt(valueTwo.value);
    }
    if (valueThree.value !== "") {
      vThree = parseInt(valueThree.value);
    }
    if (valueFour.value !== "") {
      vFour = parseInt(valueFour.value);
    }
    if (valueFive.value !== "") {
      vFive = parseInt(valueFive.value);
    }
    if (valueSix.value !== "") {
      vSix = parseInt(valueSix.value);
    }
    if (valueSeven.value !== "") {
      vSeven = parseInt(valueSeven.value);
    }
    let total: string | number =
      vOne + vTwo + vThree + vFour + vFive + vSix + vSeven;
    if (parseInt(calculationFor) == 1) {
      if (total == 0) {
        this.schoolSurveyForm.patchValue({
          totalEnrolledCwsn: "",
        });
      } else {
        this.schoolSurveyForm.patchValue({
          totalEnrolledCwsn: total,
        });
      }
    }
    if (parseInt(calculationFor) == 2) {
      if (total == 0) {
        this.schoolSurveyForm.patchValue({
          totalPresentCwsn: "",
        });
      } else {
        this.schoolSurveyForm.patchValue({
          totalPresentCwsn: total,
        });
      }
    }
  }

  maxLimitChk(
    maxLimitCntrl: string,
    compareCntrl: string,
    maxLimitCntrlLabel: string,
    compareCntrlLabel: string
  ) {
    let mlc =
      this.schoolSurveyForm.get(maxLimitCntrl)?.value > 0
        ? parseInt(this.schoolSurveyForm.get(maxLimitCntrl)?.value)
        : 0;
    let cc =
      this.schoolSurveyForm.get(compareCntrl)?.value > 0
        ? parseInt(this.schoolSurveyForm.get(compareCntrl)?.value)
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
          this.schoolSurveyForm.get(compareCntrl)?.patchValue("");
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
            this.schoolSurveyForm.get(compareCntrl)?.patchValue("");
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
    let mlc = this.schoolSurveyForm.get(maxLimitCntrl)?.value
      ? parseInt(this.schoolSurveyForm.get(maxLimitCntrl)?.value)
      : 0;
    let cc1 = this.schoolSurveyForm.get(compareCntrl1)?.value
      ? parseInt(this.schoolSurveyForm.get(compareCntrl1)?.value)
      : 0;

    if (mlc < cc1) {
      this.alertHelper
        .viewAlertHtml(
          "error",
          "Invalid inputs",
          "Total Enrolled CWSN " +
            type +
            " can not be Smaller than Present CWSN " +
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
    if ("INVALID" === this.schoolSurveyForm.status) {
      for (const key of Object.keys(this.schoolSurveyForm.controls)) {
        if (this.schoolSurveyForm.controls[key].status === "INVALID") {
          let invalidControl;
          switch (key) {
            case "totalEnrolledCwsn":
              invalidControl = this.el.nativeElement.querySelector(
                '[formControlName="totalCwsnVi"]'
              );
              break;
            case "totalPresentCwsn":
              invalidControl = this.el.nativeElement.querySelector(
                '[formControlName="presentCwsnVi"]'
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
            this.schoolSurveyForm,
            this.allLabel
          );
          break;
        }
      }
    }
    if (this.schoolSurveyForm.invalid) {
      return;
    }
    if (this.schoolSurveyForm.valid === true) {
      this.alertHelper.submitAlert().then((result: any) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.divyaService
            .saveSchoolSurvey(this.schoolSurveyForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "School Survey inspection data saved successfully.",
                    "success"
                  )
                  .then(() => {
                    this.router.navigate(["../success"], {
                      relativeTo: this.route,
                    });
                    this.initializeForm();
                  });
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
              // complete: () => console.log("done"),
            });
        }
      });
    }
  }

  keyUpInputNumber(event: any, controlname: any, maxLength: number = 3) {
    if (event.target.value.length > maxLength) {
      event.target.value = event.target.value.substr(0, maxLength);
      this.schoolSurveyForm.get(controlname)?.patchValue(event.target.value);
    }
    var charCode = event.which ? event.which : event.keyCode;

    if (charCode < 48 || charCode > 57) {
      event.target.value = event.target.value.replace(/[^\d]/g, "");
      this.schoolSurveyForm.get(controlname)?.patchValue(event.target.value);
      return false;
    } else {
      return true;
    }
  }

  resetForm() {
    this.initializeForm();
  }
}
