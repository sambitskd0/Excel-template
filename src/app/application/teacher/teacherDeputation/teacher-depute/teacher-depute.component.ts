import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SchoolService } from 'src/app/application/school/services/school.service';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CommonFunctionHelper } from 'src/app/core/helpers/common-function-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { TeacherServiceService } from '../../services/teacher-service.service';
import { RegistrationService } from '../../services/registration.service';


@Component({
  selector: 'app-teacher-depute',
  templateUrl: './teacher-depute.component.html',
  styleUrls: ['./teacher-depute.component.css']
})
export class TeacherDeputeComponent implements OnInit {
  teacherDeputeForm!: FormGroup;
  deptutaionTypeChange: any = "";
  deputationType: any = "";
  levelType: any = "";
  stateName: any = "";
  levelTypeChange: any = "";
  officeName: any = "";
  districtId: any = "";
  blockId: any = "";
  deputedSchoolId: any = "";
  deputationFromDate: any = "";
  letterNo: any = "";
  letterDocument: any = "";
  remark: any = "";


  scDisrtictSelect: boolean = true;
  scDisrtictLoading: boolean = false;
  scBlockSelect: boolean = true;
  scBlockLoading: boolean = false;
  districtData: any = "";
  searchBlockData: any = "";
  districtDataSc: any = "";
  schoolChanged: boolean = false;
  schoolData: any = [];
  posts: any = [];
  loginUserType : any ="";
  userDesignation: any ="";
  userProfile:any=[];
  encId:any="";
  userId:any="";
  allLabel: string[] = [
    "Deputation Type",
    "Level Type",
    "State Name",
    "State Name",
    "District Name",
    "Block Name",
    "Office Name",
    "School Name",
    "Deputation From Date",
    "Letter No",
    "",
    "Remarks"
  ];
  teacherInfo:any="";
  minDate:any = Date;
  maxDate:any = Date;
  imageUrlTeacher: any = "";
  isimageUrlTeacher: boolean = false;
  fileToUploadTeacher: any = "";
  letterPdfShown:boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private alertHelper: AlertHelper,
    private el: ElementRef,
    private commonService: CommonserviceService,
    private schoolService: SchoolService,
    private spinner: NgxSpinnerService,
    private commonFunctionHelper: CommonFunctionHelper,
    private TeacherServiceService : TeacherServiceService,
    private route: Router,
    private router: ActivatedRoute,
    private registrationService: RegistrationService,
  ) { 
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + 30);
  }

  ngOnInit(): void {
    this.encId = this.router.snapshot.params["techId"];
    this.userProfile = this.commonService.getUserProfile();
    this.loginUserType = this.userProfile.loginUserTypeId;
    this.userDesignation = this.userProfile.designationId;
    this.userId = this.userProfile.userId;
    this.getDistrict();
    this.initializeForm();
    this.getTeacherRegistrationInfo(this.encId);
    
  }
  getTeacherRegistrationInfo(encId: any) {
    this.registrationService.registrationInfo(encId).subscribe((res: any) => {
      this.teacherInfo = res?.data;
      this.minDate = new Date(this.teacherInfo?.serviceJoiningDt?.toString());
    });
    
  }
  getDistrict() {
    this.scDisrtictSelect = false;
    this.scDisrtictLoading = true;
    this.commonService.getAllDistrict().subscribe((data: any) => {
      this.districtData = data;
      this.districtData = this.districtData.data;      
     this.scDisrtictLoading = false;
      this.scDisrtictSelect = true;
      
    });
  }
  getBlock(districtId: any) {

    this.scBlockSelect = false;
    this.scBlockLoading = true;
    this.searchBlockData = [];
    this.teacherDeputeForm.controls['blockId'].patchValue('');
    

    if (districtId !== '') {
      this.commonService.getBlockByDistrictid(districtId).subscribe((res: any) => {       
        this.searchBlockData = res;
        this.searchBlockData = this.searchBlockData.data;
        this.scBlockSelect = true;
        this.scBlockLoading = false;
       
      });
    } else {
      this.scBlockSelect = true;
      this.scBlockLoading = false;
    }
  }
  getSchoolList() {
    this.schoolChanged = true;
    this.schoolData = [];
    this.districtId = this.teacherDeputeForm.get('districtId')?.value;
    this.blockId = this.teacherDeputeForm.get('blockId')?.value;
    
    let paramList: any = { districtId: this.districtId, blockId: this.blockId};
   
    if ( this.blockId > 0) {
      this.schoolService.getSchoolList(paramList).subscribe((res: any) => {
        this.posts = res;
        this.schoolData = this.posts.data;
  
        if (
          this.userProfile.udiseCode != 0 ||
          this.userProfile.udiseCode != ""
        ) {
          this.schoolData = this.schoolData.filter((sch: any) => {
            return sch.schoolUdiseCode == this.userProfile.udiseCode;
          });
          this.teacherDeputeForm.controls["deputedSchoolId"]?.patchValue(
            this.schoolData[0].schoolId
          );
          
        } else {
          this.schoolChanged = true;
        }
        this.schoolChanged = false;
      });
    }
    
  }
  initializeForm() {
    this.teacherDeputeForm = this.formBuilder.group({
      deputationType: [this.deputationType, [Validators.required,]],
      levelType: [this.levelType,],
      // stateName: [this.stateName,],
      officeName: [this.officeName, [Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/)]],
      districtId: [this.districtId],
      blockId: [this.blockId],
      deputedSchoolId: [this.deputedSchoolId],
      deputationFromDate: [this.deputationFromDate],
      letterNo: [this.letterNo, [Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/)]],
      letterDocument: [this.letterDocument],
      remark: [this.remark, [this.customValidators.firstCharValidatorRF, Validators.maxLength(500)]],
      fileSource: [""],
      teacherId: [this.encId],
      userId : [this.userId]
    });


  }
  deputationTypeControl(val: any) {
    this.deptutaionTypeChange = val;    
    this.teacherDeputeForm.controls['levelType'].patchValue('');
    this.teacherDeputeForm.controls['districtId'].patchValue('');
    this.teacherDeputeForm.controls['blockId'].patchValue('');
    this.teacherDeputeForm.controls['deputedSchoolId'].patchValue('');
  }
  levelTypeControl(val: any) {
    this.levelTypeChange = val;    
    this.teacherDeputeForm.controls['districtId'].patchValue('');
    this.teacherDeputeForm.controls['blockId'].patchValue('');
    this.teacherDeputeForm.controls['deputedSchoolId'].patchValue('');

  }
  onFileChange(event: any) {
    let file = event.target.files;
    var ext = file[0].name.substring(file[0].name.lastIndexOf(".") + 1);
    if ((ext === 'pdf') || (ext === 'PDF')) {
      this.letterPdfShown = true;
      this.isimageUrlTeacher = false;

    }
    if (ext == "jpg" || ext == "png" || ext == "jpeg" || ext == "pdf" || ext == "JPG" || ext == "PNG" || ext == "JPEG" || ext == "PDF") {
      const fileSize = file[0].size;
      const fileSizeInKB = Math.round(fileSize / 1024);
      if (fileSizeInKB > 2000) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Upload document size must be maximum 2MB"
        );
        this.teacherDeputeForm.patchValue({
          letterDocument: ''
        });
        return;
      } else {
        this.fileToUploadTeacher = file.item(0);
        let doc: File = event.target.files[0];
        let myReader: FileReader = new FileReader();
        myReader.onloadend = (event:any) => {
          this.imageUrlTeacher = event.target.result;
          this.teacherDeputeForm.patchValue({
            fileSource: myReader.result
          });
        }
        myReader.readAsDataURL(doc);
        this.isimageUrlTeacher = true;
      }
    } else {
      this.alertHelper.viewAlert("error", "Invalid", "Inavlid file format");
      this.teacherDeputeForm.patchValue({
        letterDocument: ''
      });
      this.imageUrlTeacher = "";
      this.fileToUploadTeacher = Blob;
      this.isimageUrlTeacher = false;
      return;
    }
  }
  removeTeacherImage() {
    this.imageUrlTeacher = "";
   this.fileToUploadTeacher = Blob;
    this.isimageUrlTeacher = false;
    this.letterPdfShown = false;
    this.teacherDeputeForm.patchValue({
      imageUrlTeacher: '',
      letterDocument: '',
      fileSource:''
    });
  }
  getFormValue(allValue: any) {
   
    return {     
      ...allValue,
      deputationFromDate: this.commonFunctionHelper.formatDateHelper(
        allValue?.deputationFromDate
      ),    
          
    };
  }
  onSubmit() {
   
    if (this.teacherDeputeForm.controls["deputationType"]?.value == '' || this.teacherDeputeForm.controls["deputationType"]?.value == null) {
      const invalidControl = this.el.nativeElement.querySelector(
        '[formControlName="deputationType"]');
      invalidControl.focus();
      this.alertHelper.successAlert("Invalid", "Deputation Type required", "error");
      return;
    }
    if (this.teacherDeputeForm.controls["levelType"]?.value == ''  && this.teacherDeputeForm.controls["deputationType"]?.value == 1 ) {
      const invalidControl = this.el.nativeElement.querySelector(
        '[formControlName="levelType"]');
      invalidControl.focus();
      this.alertHelper.successAlert("Invalid", "Level Type required", "error");
      return;
    }
    // if (this.teacherDeputeForm.controls["stateName"]?.value == '' && this.teacherDeputeForm.controls["levelType"]?.value == 5) {
    //   const invalidControl = this.el.nativeElement.querySelector(
    //     '[formControlName="stateName"]');
    //   invalidControl.focus();
    //   this.alertHelper.successAlert("Invalid", "State Name required", "error");
    //   return;
    // }
    if (this.teacherDeputeForm.controls["officeName"]?.value == ''  && (this.teacherDeputeForm.controls["levelType"]?.value == 5 || this.teacherDeputeForm.controls["levelType"]?.value == 4 || this.teacherDeputeForm.controls["levelType"]?.value == 3)) {
      const invalidControl = this.el.nativeElement.querySelector(
        '[formControlName="officeName"]');
      invalidControl.focus();
      this.alertHelper.successAlert("Invalid", "Office Name required", "error");
      return;
    }
    if (this.teacherDeputeForm.controls["districtId"]?.value == ''  && (this.teacherDeputeForm.controls["levelType"]?.value == 4 || this.teacherDeputeForm.controls["levelType"]?.value == 3 || this.teacherDeputeForm.controls["deputationType"]?.value == 2)) {
      const invalidControl = this.el.nativeElement.querySelector(
        '[formControlName="districtId"]');
      invalidControl.focus();
      this.alertHelper.successAlert("Invalid", "District required", "error");
      return;
    }
    if (this.teacherDeputeForm.controls["blockId"]?.value == ''  && (this.teacherDeputeForm.controls["levelType"]?.value == 3 || this.teacherDeputeForm.controls["deputationType"]?.value == 2)) {
      const invalidControl = this.el.nativeElement.querySelector(
        '[formControlName="blockId"]');
      invalidControl.focus();
      this.alertHelper.successAlert("Invalid", "Block required", "error");
      return;
    }
    if (this.teacherDeputeForm.controls["deputedSchoolId"]?.value == ''  && this.teacherDeputeForm.controls["deputationType"]?.value == 2) {
      const invalidControl = this.el.nativeElement.querySelector(
        '[formControlName="deputedSchoolId"]');
      invalidControl.focus();
      this.alertHelper.successAlert("Invalid", "School required", "error");
      return;
    }

    if (this.teacherDeputeForm.controls["deputationFromDate"]?.value == '' ) {
      const invalidControl = this.el.nativeElement.querySelector(
        '[formControlName="deputationFromDate"]');
      invalidControl.focus();
      this.alertHelper.successAlert("Invalid", "Deputation From Date required", "error");
      return;
    }
    if (this.teacherDeputeForm.controls["letterNo"]?.value == '' ) {
      const invalidControl = this.el.nativeElement.querySelector(
        '[formControlName="letterNo"]');
      invalidControl.focus();
      this.alertHelper.successAlert("Invalid", "Letter No required", "error");
      return;
    }
    if (this.teacherDeputeForm.controls["remark"]?.value == '' ) {
      const invalidControl = this.el.nativeElement.querySelector(
        '[formControlName="remark"]');
      invalidControl.focus();
      this.alertHelper.successAlert("Invalid", "Remark required", "error");
      return;
    }
    // if ("INVALID" === this.teacherDeputeForm.status) {
    //   for (const key of Object.keys(this.teacherDeputeForm.controls)) {
    //     if (this.teacherDeputeForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.teacherDeputeForm, this.allLabel);
    //       break;
    //     }
    //   }
    // }
    // if (this.teacherDeputeForm.invalid) {
    //   return;
    // }
    if (this.teacherDeputeForm.valid === true) {
     
      this.alertHelper.submitAlert().then((result: any) => {
        if (result.value) {
          const allValue = this.teacherDeputeForm.value;
          console.log(allValue);
          
          this.spinner.show(); // ==== show spinner

          this.TeacherServiceService
            .addDeputation(this.getFormValue(allValue))
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Teacher deputed successfully.",
                    "success"
                  )
                  .then(() => {                   
                    this.route.navigate(["../../updateStatus"], {
                      relativeTo: this.router,
                    });
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
 
}
