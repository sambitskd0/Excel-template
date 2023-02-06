import { formatDate } from "@angular/common";
import { Component, ElementRef, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { SchoolService } from "src/app/application/school/services/school.service";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { Constant } from "src/app/shared/constants/constant";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { DocterDetailsService } from "../../services/doctor-details.service";
import { HealthCheckUpService } from "../../services/health-check-up.service";
import { SmartClassService } from "../../services/smart-class.service";


@Component({
  selector: "app-add-health-check-up",
  templateUrl: "./add-health-check-up.component.html",
  styleUrls: ["./add-health-check-up.component.css"],
})
export class AddHealthCheckUpComponent implements OnInit {
  healthCheckUpLabel: string[] = this.getCustomizedLabelName("");
  public showFilter: boolean = true;
  public permissionForAdd: boolean = false;
  public buttonName: any = "Show";

  config = new Constant();
  loginUserType: any = "";
  clusterName: any = "";
  schoolName: any = "";
  blockName: any = "";
  districtName: any = "";
  villageName: any = "";
  schoolUdiseCode: any = "";
  schoolInfoData: any;
  academicYear: any = this.config.getAcademicCurrentYear();
  userId: any = "";
  profileId: any = "";
  schoolId: any;
  healthCheckupForm!: FormGroup;
  classId: any = "";
  streamId: any = "";
  groupId: any = "";
  sectionId: any = "";
  doctorId: any = "";
  checkupDate: any = "";
  orgCheckupDate: any = "";
  disableFields: boolean = false;

  studentName: any = "";
  studentId: any = "";
  studentCode: any = "";
  chest: any = "";
  dental: any = "";
  throat: any = "";
  leftEye: any = "";
  rightEye: any = "";
  hemoglobinLevel: any = "";
  doseOfDeworming: any = "";
  hearing: any = "";
  chronicDisease: any = "";
  weight: any = "";
  height: any = "";
  bmi: any = "";
  bloodPressure: any = "";
  doctorAdvice: any = "";
  emergencyCntNo: any = "";
  classData: any;
  streamData: any;
  groupData: any;
  studentData: any;
  sectionData: any;
  doctorData: any;
  healthCheckupSearchForm!: FormGroup;
  isStudentData: boolean = false;
  emptyResult: boolean = false;
  allLabelForSearchForm: string[] = [
    "",
    "",
    "",
    "Class",
    "Section",
    "Stream",
    "Group",
    "Checkup date",
    "Doctor name",
    ""
  ];
  allLabel: string[] = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "Checkup date",
    "Doctor name",
    "",
    "Atleast check one record",
    ""
  ];
  submitted: boolean = false;
  checkAllBox: boolean = false;
  healthId: any = [];
  checkAll: boolean = false;
  isChecked: boolean = false;
  plPrivilege:string="view"; //For menu privilege
  adminPrivilege: boolean = false;
  tabs: any = [];  //For shwoing tabs
  maxDate: any = Date;
  constructor(
    private commonService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private spinner: NgxSpinnerService,
    private schoolService: SchoolService,
    private formBuilder: FormBuilder,
    private smartClassService: SmartClassService,
    private docterDetailsService: DocterDetailsService,
    public customValidators: CustomValidators,
    public healthCheckUpService: HealthCheckUpService,
    private alertHelper: AlertHelper,
    private commonFunctionHelper: CommonFunctionHelper,
    private el: ElementRef,
  ) {
    const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For authorization
    this.tabs = this.privilegeHelper.PrimaryLinkTabNames(pageUrl);  //For shwoing tabs 
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.spinner.show();
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    const userProfile = this.commonService.getUserProfile();
    this.schoolId = userProfile?.school;
    this.userId = userProfile?.userId;
    this.profileId = userProfile?.profileId;
    this.loginUserType = userProfile?.loginUserType;
    if (this.loginUserType == "SCHOOL") {
      this.permissionForAdd = true;
    } else {
      this.permissionForAdd = false;
    }
    if (this.schoolId !== 0 && this.schoolId !== "") {
      this.getSchoolInfo(this.schoolId, this.academicYear);
      this.getDoctors(this.schoolId);
      this.getSchoolClasses(this.schoolId);
    } else {
      this.classData = [];
      this.doctorData = [];
    }
    this.initializeForm();
    this.initializeFormForSearch();
    this.spinner.hide();
  }
  ngAfterViewInit() {
    this.el.nativeElement.querySelector("[formControlName=classId]").focus();
  }
  getSchoolInfo(schoolId: any, academicYear: any) {
 
    this.schoolService
      .getSchoolInfo(schoolId, academicYear)
      .subscribe((res: any) => {
        this.schoolInfoData = res.data[0];
        this.districtName = this.schoolInfoData?.districtName;
        this.blockName = this.schoolInfoData?.blockName;
        this.clusterName = this.schoolInfoData?.clusterName;
        this.villageName = this.schoolInfoData?.villageName;
        this.schoolName = this.schoolInfoData?.schoolName;
        this.schoolUdiseCode = this.schoolInfoData?.schoolUdiseCode;
      });
  }
  initializeFormForSearch() {
    this.healthCheckupSearchForm = this.formBuilder.group({
      userId: [this.userId],
      schoolId: [this.schoolId],
      academicYear: [this.academicYear],
      classId: [this.classId, Validators.required],
      streamId: [this.streamId],
      groupId: [this.groupId],
      sectionId: [this.sectionId],
      orgCheckupDate: [this.orgCheckupDate, Validators.required],
      doctorId: [this.doctorId, Validators.required],
      checkupDate: [this.checkupDate],
    });
  }
  initializeForm() {
    this.healthCheckupForm = this.formBuilder.group({
      profileId: [this.profileId],
      userId: [this.userId],
      schoolId: [this.schoolId],
      academicYear: [this.academicYear],
      classId: [this.classId],
      streamId: [this.streamId],
      groupId: [this.groupId],
      sectionId: [this.sectionId],
      checkupDate: [this.checkupDate],
      doctorId: [this.doctorId],
      studentHealthArray: this.formBuilder.array([]), // store all data in this array
      finalHealthArray: this.formBuilder.array([], Validators.required),
      checkAll: [this.checkAll],
    });
  }
  studentHealthInfo(): FormArray {
    return this.healthCheckupForm.get("studentHealthArray") as FormArray;
  }
  getSchoolClasses(schoolEncId: string) {
    if (schoolEncId !== "") {
      this.schoolService
        .getSchoolClasses(schoolEncId)
        .subscribe((res: any = []) => {
          this.classData = res.data;
        });
    }
  }
  classChange(val: any) {
    this.healthCheckupSearchForm.patchValue({
      streamId: "",
    });
    this.healthCheckupSearchForm.patchValue({
      groupId: "",
    });
    this.healthCheckupSearchForm.patchValue({
      sectionId: "",
    });
    this.isStudentData = false;
    this.classId = val;
    if (this.classId !== "") {
      this.getSection(this.classId, this.schoolId, this.academicYear);
      if (this.classId == 11 || this.classId == 12) {
        this.getStream();
      }
    } else {
      this.healthCheckupSearchForm.patchValue({
        classId: "",
      });
      this.healthCheckupSearchForm.patchValue({
        sectionId: "",
      });
      this.healthCheckupSearchForm.patchValue({
        streamId: "",
      });
    }
  }
  streamChange(val: any) {
    this.healthCheckupSearchForm.patchValue({
      groupId: "",
    });
    this.streamId = val;
    if (this.streamId == 3) {
      this.getGroup();
    } else {
      this.groupId = "";
    }
  }
  getStream() {
    this.commonService
      .getCommonAnnexture(["STREAM_TYPE"])
      .subscribe((data: any = []) => {
        this.streamData = data?.data?.STREAM_TYPE;
      });
  }
  getGroup() {
    this.commonService
      .getCommonAnnexture(["STREAM_GROUP_TYPE"])
      .subscribe((data: any = []) => {
        this.groupData = data?.data?.STREAM_GROUP_TYPE;
      });
  }
  getSection(classId: any, schoolId: any, academicYear: any) {
    this.smartClassService
      .getSection(classId, schoolId, academicYear)
      .subscribe((data: any = []) => {
        this.sectionData = data;
        this.sectionData = this.sectionData.data["sections"];
      });
  }
  searchStudent() {
    this.submitted = true;
    this.healthId = [];
    if (
      this.healthCheckupSearchForm.get("classId")?.value == 11 ||
      this.healthCheckupSearchForm.get("classId")?.value == 12
    ) {
      if (
        this.healthCheckupSearchForm.controls["streamId"]?.value == "" ||
        this.healthCheckupSearchForm.controls["streamId"]?.value == 0
      ) {
        this.el.nativeElement.querySelector("[formControlName=streamId]").focus();
       this.alertHelper.viewAlert("error","Invalid","Stream is required");
        return;
      }
    }
    if (this.healthCheckupSearchForm.get("streamId")?.value == 3) {
      if (
        this.healthCheckupSearchForm.controls["groupId"]?.value == "" ||
        this.healthCheckupSearchForm.controls["groupId"]?.value == 0
      ) {
        this.el.nativeElement.querySelector("[formControlName=groupId]").focus();
        this.alertHelper.viewAlert("error","Invalid","Group is required");
        return;
      }
    }
    // if ("INVALID" === this.healthCheckupSearchForm.status) {
    //   for (const key of Object.keys(this.healthCheckupSearchForm.controls)) {
    //     if (this.healthCheckupSearchForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(
    //         this.healthCheckupSearchForm,
    //         this.allLabelForSearchForm
    //       );
    //       break;
    //     }
    //   }
    // }
    if(this.healthCheckupSearchForm.invalid){
      this.customValidators.formValidationHandler(
                this.healthCheckupSearchForm,
                this.allLabelForSearchForm,
                this.el
              );
    }
    if (this.healthCheckupSearchForm.valid === true) {
      this.emptyResult = true;
      this.isStudentData = false;
      let checkupDateStr =  this.commonFunctionHelper.formatDateHelper(this.healthCheckupSearchForm.get("orgCheckupDate")?.value);
      this.healthCheckupSearchForm.patchValue({
        checkupDate: checkupDateStr,
      });
      this.initializeForm();
      this.healthCheckUpService
        .getStudents(this.healthCheckupSearchForm.value)
        .subscribe((data: any = []) => {
          this.studentData = data?.data;
          this.healthCheckupForm.patchValue({
            doctorId: this.studentData[0].doctor,
          });
          let checkupDateString= new Date(this.studentData[0].checkupDt?.toString());
          this.healthCheckupForm.patchValue({
            // checkupDate: this.studentData[0].checkupDt,
            checkupDate: checkupDateString,
          });
          if (this.studentData?.length) {
            this.isStudentData = true;
            this.emptyResult = false;
            this.disableFields = true;
            this.studentData.map((item: any) => {
              this.healthId.push(item?.healthId);
              this.studentHealthInfo().push(
                this.formBuilder.group({
                  checkItem: [
                    {
                      value: false,
                      disabled: item?.healthId,
                    },
                    // [Validators.required],
                  ],
                  studentId: [item.studentId],
                  studentName: [
                    {
                      value: item.studentName,
                      disabled: this.disableFields,
                    },
                    //  [ Validators.pattern(/^[0-9]+$/)],
                  ],
                  studentCode: [
                    {
                      value: item.studentCode,
                      disabled: this.disableFields,
                    },

                    //[ Validators.pattern(/^[0-9]+$/)],
                  ],
                  chest: [
                    {
                      value: item.chest,
                      disabled: item?.chest,
                    },
                    [Validators.maxLength(10),this.customValidators.firstCharValidatorRF],
                  ],
                  dental: [
                    {
                      value: item.dental,
                      disabled: item?.dental,
                    },
                    [Validators.maxLength(10),this.customValidators.firstCharValidatorRF],
                  ],
                  throat: [
                    {
                      value: item.throat,
                      disabled: item?.throat,
                    },
                    [Validators.maxLength(10),this.customValidators.firstCharValidatorRF],
                  ],
                  leftEye: [
                    {
                      value: item.leftEye,
                      disabled: item?.leftEye,
                    },
                    [Validators.maxLength(5),Validators.pattern(/^[-.+0-9]+$/)],
                  ],
                  rightEye: [
                    {
                      value: item.rightEye,
                      disabled: item?.rightEye,
                    },
                    [Validators.maxLength(5),Validators.pattern(/^[-.+0-9]+$/)],
                  ],
                  hemoglobinLevel: [
                    {
                      value: item.hemoglobinLevel,
                      disabled: item?.hemoglobinLevel,
                    },
                    [Validators.maxLength(9),Validators.pattern(/^[0-9-.]+$/)]
                  ],
                  doseOfDeworming: [
                    {
                      value: item.doseOfDeworming,
                      disabled: item?.doseOfDeworming,
                    },
                    //[ Validators.pattern(/^[0-9]+$/)],
                  ],
                  hearing: [
                    {
                      value: item.hearing,
                      disabled: item?.hearing,
                    },
                    [Validators.maxLength(7),Validators.pattern(/^[0-9-]+$/)]
                  ],
                  chronicDisease: [
                    {
                      value: item.chronicDisease,
                      disabled: item?.chronicDisease,
                    },
                    [Validators.maxLength(10),this.customValidators.firstCharValidatorRF],
                  ],
                  weight: [
                    {
                      value: item.weight,
                      disabled: item?.weight,
                    },
                    [Validators.maxLength(3),Validators.pattern(/^[0-9]+$/)]
                  ],
                  height: [
                    {
                      value: item.height,
                      disabled: item?.height,
                    },
                    [Validators.maxLength(3),Validators.pattern(/^[0-9]+$/)]
                  ],
                  bmi: [
                    {
                      value: item.bmi,
                      disabled: item?.bmi,
                    },
                  ],
                  bloodPressure: [
                    {
                      value: item.bloodPressure,
                      disabled: item?.bloodPressure,
                    },
                    [Validators.maxLength(7),Validators.pattern(/^[0-9/]+$/)]     
                  ],
                  doctorAdvice: [
                    {
                      value: item.doctorAdvice,
                      disabled: item?.doctorAdvice,
                    },
                    [Validators.maxLength(250),this.customValidators.firstCharValidatorRF],
                  ],
                  emergencyCntNo: [
                    {
                      value: item.emergencyCntNo,
                      disabled: item?.emergencyCntNo,
                    },
                    [Validators.maxLength(10),Validators.minLength(10),Validators.pattern(/^[0-9]+$/)],
                  ],
                })
              );
            });
          } else {
            this.isStudentData = false;
            this.emptyResult = true;
            this.initializeForm();
          }
        });
    }
  }
  onCheckboxChange(index: number, event: any) {
    const finalHealthArray: FormArray = this.healthCheckupForm.get(
      "finalHealthArray"
    ) as FormArray;
    if (event.target.checked) {
     let chkItem = this.healthCheckupForm?.value?.studentHealthArray[index]["checkItem"];

    } else {
      const studentHealthArray: FormArray = this.healthCheckupForm.get(
        "studentHealthArray"
      ) as FormArray;
      let i: number = 0;
      studentHealthArray.controls.forEach((item: any) => {
        if (item?.value.studentId == event.target.value) {
          return;
        }
        i++;
      });
    }
  }
  checkUncheckAll() {
    this.resetFormArray();
    if (this.healthCheckupForm.get("checkAll")?.value !== true) {
      const finalHealthArray: FormArray = this.healthCheckupForm.get(
        "finalHealthArray"
      ) as FormArray;
      this.studentData.forEach((eachdata: any) => {
        finalHealthArray.push(new FormControl(eachdata));
        eachdata.isChecked = true;
      });
    }
  }
  resetFormArray() {
    this.studentData.forEach((eachdata: any) => {
      eachdata.isChecked = false;
    });
    (this.healthCheckupForm.get("finalHealthArray") as FormArray).clear();
  }
  getDoctors(schoolId: any) {
    this.docterDetailsService
      .getDoctorAccordingToSchoolId(schoolId)
      .subscribe((data: any = []) => {
        this.doctorData = data?.data;
      });
  }
  checkupDateValidation() {
    let checkupDate =
      this.healthCheckupSearchForm.controls["checkupDate"].value;
    const newDate = new Date();
    if (
      formatDate(checkupDate, "yyyy-MM-dd", "en_US") >
      formatDate(newDate, "yyyy-MM-dd", "en_US")
    ) {
      this.alertHelper.viewAlert(
        "error",
        "Invalid",
        "Checkup date must not be above today's date"
      );
      this.healthCheckupSearchForm.patchValue({
        checkupDate: "",
      });
    }
  }
  submitHealthCheckup() {
    const finalHealthArray: FormArray = this.healthCheckupForm.get(
      "finalHealthArray"
    ) as FormArray;
    let i: number = 0;
    (this.healthCheckupForm.get("finalHealthArray") as FormArray).clear();
    this.healthCheckupForm.getRawValue().studentHealthArray.forEach((item: any) => {
       if (item.checkItem == true) {
        finalHealthArray.push(new FormControl(item));
       }
       i++;
     });
    this.submitted = true;
    this.customValidators.formValidationHandler(
      this.healthCheckupForm,
      this.allLabel
    );
    if (this.healthCheckupForm?.controls['finalHealthArray'].valid === true) {
      this.alertHelper.submitAlert().then((result: any) => {
        if (result.value) {
          let checkupDateStr =  this.commonFunctionHelper.formatDateHelper(this.healthCheckupForm.get("checkupDate")?.value);
          this.healthCheckupForm.patchValue({
            checkupDate: checkupDateStr,
          });
          this.spinner.show(); // ==== show spinner
          this.healthCheckUpService
            .addHealthCheckup(this.healthCheckupForm.getRawValue())
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Health checkup record created successfully.",
                    "success"
                  )
                  .then(() => {
                    this.initializeForm();
                    window.location.reload();
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
    } else {
      for (const control of Object.keys(this.healthCheckupForm.controls)) {
        this.healthCheckupForm.controls[control].markAsTouched();
      }
    }
  }
  getCustomizedLabelName(labelData: string) {
    return [
      `${labelData} :- checkbox`,
      `${labelData} :- studentId`,
      `${labelData} :- studentName`,
      `${labelData} :- studentCode`,
      `${labelData} :- chest`,
      `${labelData} :- dental`,
      `${labelData} :- throat`,
      `${labelData} :- leftEye`,
      `${labelData} :- rightEye`,
      `${labelData} :- hemoglobinLevel`,
      `${labelData} :- doseOfDeworming`,
      `${labelData} :- hearing`,
      `${labelData} :- chronicDisease`,
      `${labelData} :- weight`,
      `${labelData} :- height`,
      `${labelData} :- bmi`,
      `${labelData} :- bloodPressure`,
      `${labelData} :- doctorAdvice`,
      `${labelData} :- emergencyCntNo`,
    ];
  }
  validateSubmitHealthCheckup() {
    Promise.all(this.validateHealthCheckupData()).then((value) => {
      const formErrors = value;
      let formInvalid: any = false;
      formErrors.map((item: any) => {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          item
        );   
        if (item !== false) {
          formInvalid = true;
        }
      });
      formInvalid === false && this.submitHealthCheckup();
    });
  }
  validateHealthCheckupData() {
    let allErrors: any = [];
    let studentHealthCheckupArr = <FormArray>(
      this.healthCheckupForm.controls["studentHealthArray"]
    );
    studentHealthCheckupArr?.controls?.map((item: any, index: number) => {
      if(item?.controls?.checkItem.value==true){
        this.healthCheckUpLabel = this.getCustomizedLabelName(
          "SlNo. " + (index + 1)
        );
        let errors = this.customValidators.formArrayValidationHandler(
          item,
          this.healthCheckUpLabel
        );
        if (errors.length > 0) {
          for (const indMsg of errors) {
            allErrors.push(indMsg);
          }
        }
      }
     
    });
    return allErrors;
  }
  toggle() {
    this.showFilter = !this.showFilter;
    if (this.showFilter) this.buttonName = "Hide";
    else this.buttonName = "Show";
  }
}
