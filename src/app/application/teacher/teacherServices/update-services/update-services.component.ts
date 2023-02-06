import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { NgxSpinnerService } from "ngx-spinner";
import { TeacherServiceService } from "../../services/teacher-service.service";
// import { RegistrationService } from "../../services/registration.service";
import { Router, ActivatedRoute } from "@angular/router";
declare const $: any;

@Component({
  selector: "app-update-services",
  templateUrl: "./update-services.component.html",
  styleUrls: ["./update-services.component.css"],
})
export class UpdateServicesComponent implements OnInit {
  uploadProfileImage!: ElementRef;
  isVisible: any;
  isSelected: boolean = true;
  optionVal: any;
  optionstream: any;
  teacherName:any="";
  teacherId:any="";
  updateServiceForm!: FormGroup;
  submitted: boolean = false;
  allLabel: string[] = [
    "Update service",
    "Letter no.",
    "Upload document",
    "Remarks",
  ];
  fileImageChange: boolean = false;
  fileToUpload: any = "";
  imageUrl: any = "";
  isimageUrl: boolean = false;
  techId: any = "";
  teacherServiceData: any;
  districtName: any="";
  blockName:  any="";
  clusterName:  any="";
  schoolName:  any="";
  teacherTitle:  any="";
  lastServiceStatus:  any="";
  fileUpload: any;
  scService: any;
  letterNo: any;
  remark: any;
  teacherLoginCode:  any="";
  teacherCode:  any="";
  constructor(
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private el: ElementRef,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private TeacherServiceService: TeacherServiceService,
    private route: Router,
    private router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.techId = this.router.snapshot.params["techId"];
    // console.log(this.techId)
    this.updateServiceTeacher(this.techId);
    this.initializeForm();
    // $(function () {
    //   $('[data-toggle="tooltip"]').tooltip()
    // })
    this.el.nativeElement.querySelector("[formControlName=scService]").focus();
  }
  updateServiceTeacher(e: any) {
    // console.log(e);
    this.spinner.show();
    this.TeacherServiceService
      .getTeacherServiceDetails(e)
      .subscribe((res: any) => {
        this.teacherServiceData = res.data;
        this.teacherName = res.data['teacherName'];
        this.teacherId = res.data['tId'];
        this.teacherLoginCode = res.data['teacherLoginCode'];
        this.teacherCode = res.data['teacherCode'];
        this.districtName = res.data['districtName'];
        this.blockName = res.data['blockName'];
        this.clusterName = res.data['clusterName'];
        this.schoolName = res.data['schoolName'];
        this.teacherTitle = res.data['teacherTitle'];
        this.lastServiceStatus = res.data['lastServiceStatus'];
        this.spinner.hide();
      });
  }
  initializeForm() {
    this.updateServiceForm = this.formBuilder.group({
      scService: ["", Validators.required],
      letterNo: ["",[Validators.required,Validators.maxLength(40),Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/),this.customValidators.firstCharValidatorRF]],
      fileUpload: ["", Validators.required],
      remark: ["",[ Validators.required,Validators.maxLength(200),this.customValidators.firstCharValidatorRF]],
      fileSource: [""],
      teacherId:this.techId
    });
  }

  handleFileInputTeacher(e: any) {
    let file = e.target.files;
    this.fileImageChange = true;
    if (this.fileImageChange == true) {
      this.updateServiceForm.controls["fileUpload"].setValidators([
        Validators.nullValidator,
        // this.customValidators.requiredFileType(["jpg", "png", "jpeg"]),
        // this.customValidators.fileSizeValidator(file, 300),
      ]);
      this.updateServiceForm.controls["fileUpload"].updateValueAndValidity();
    }
    var ext = file[0].name.substring(file[0].name.lastIndexOf(".") + 1);

    if (ext == "jpg" || ext == "png" || ext == "jpeg" || ext == "pdf" || ext == "JPG" || ext == "PNG" || ext == "JPEG" || ext == "PDF") {
      const fileSize = file[0].size;      
      const fileSizeInKB = Math.round(fileSize / 1024);
      if (fileSizeInKB > 5120) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Upload image must be below 5mb"
        );
        // this.uploadProfileImage.nativeElement.value = "";
        this.updateServiceForm.patchValue({
          fileUpload: "",
        });
        return;
      } else {
        this.fileToUpload = file.item(0);
        //Show image preview
        let reader = new FileReader();
        reader.onload = (event: any) => {
          this.imageUrl = event.target.result;
          this.updateServiceForm.patchValue({
            fileSource: this.imageUrl,
          });
        };
        reader.readAsDataURL(this.fileToUpload);
        this.isimageUrl = true;
      }
    } else {
      this.alertHelper.viewAlert("error", "Invalid", "Inavlid file format");
      this.updateServiceForm.patchValue({
        fileUpload: "",
      });
      this.imageUrl = "";
      this.fileToUpload = Blob;
      this.isimageUrl = false;
    }
  }

  removeTeacherImage() {
    this.imageUrl = "";
    this.fileToUpload = Blob;
    this.isimageUrl = false;
    this.updateServiceForm.patchValue({
      fileUpload: "",
    });
  }

  onSubmit() {
    this.submitted = true;
    // console.log(this.updateServiceForm.status);
    //  if("INVALID" === this.updateServiceForm.status)
    //  {
    //   alert("xjh hg");
    //  }
    if ("INVALID" == this.updateServiceForm.status) {
      for (const key of Object.keys(this.updateServiceForm.controls)) {
        if (this.updateServiceForm.controls[key].status === "INVALID") {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + key + '"]'
          );
          invalidControl.focus();
          this.customValidators.formValidationHandler(
            this.updateServiceForm,
            this.allLabel
          );
          break;
        }
      }
    }

    if (this.updateServiceForm.invalid) {
      return;
    }

    this.alertHelper.submitAlert().then((result: any) => {
      // console.log(result);
      if (result.value) {
        this.spinner.show();
        this.TeacherServiceService
          .updateTeacherService(this.updateServiceForm.value)
          .subscribe({
            next: (res: any) => {
              this.spinner.hide();
              this.alertHelper
                .successAlert(
                  "Saved!",
                  "Teacher service updated successfully.",
                  "success"
                )
                .then(() => {
                  // this.teacherForm.reset();
                  this.initializeForm();
                  this.route.navigate(["../../../viewServices"], {
                    relativeTo: this.router,
                  });
                  //window.location.reload()
                  // this.fileUpload.nativeElement.value = "";
                  // this.scService.nativeElement.value = "";
                  // this.letterNo.nativeElement.value = "";
                  // this.remark.nativeElement.value = "";
                  // this.removeTeacherImage();
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
            complete: () => console.log("done"),
          });
      }
    });
  }

 
}
