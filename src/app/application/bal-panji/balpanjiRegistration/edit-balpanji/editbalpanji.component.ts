import { Component, OnInit, ElementRef } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
} from "@angular/forms";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { BalpanjiService } from "../../services/balpanji.service";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { NgxSpinnerService } from "ngx-spinner";
import { Router, ActivatedRoute } from "@angular/router";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { SchoolService } from "src/app/application/school/services/school.service";
import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";

@Component({
  selector: "app-editbalpanji",
  templateUrl: "./editbalpanji.component.html",
  styleUrls: ["./editbalpanji.component.css"],
})
export class EditbalpanjiComponent implements OnInit {
  id: any;
  editBalpanjiForm!: FormGroup;
  scDisrtictChanged: boolean = false;
  districtData: any = "";
  scBlockChanged: boolean = false;
  blockData: any;
  dobOfStudent: any = "";
  mobileNumber: any;
  studentCode: any;
  scClusterChanged: boolean = false;
  searchIdAadhaarChanged: boolean = false;
  searchIdAadhaarFound: boolean = false;
  searchIdAadhaarNotFound: boolean = false;
  scReligionChanged: boolean = false;
  clusterData: any;
  classChanged: boolean = false;
  classList: any = [];
  panData: any;
  maxDate: any = Date;
  scPanChanged: boolean = false;
  scVillageChanged: boolean = false;
  scCasteChanged: boolean = false;
  scSocialCategoryChanged: boolean = false;
  schoolChanged: boolean = false;
  scEnrollmentBlockChanged: boolean = false;
  scBlockIndChanged: boolean = false;
  scClassChanged: boolean = false;
  scClassLeaveChanged: boolean = false;
  villageData: any;
  studentData: any;
  studentId: any;
  studentName: any;
  fatherName: any;
  motherName: any;
  religionData: any;
  getBlockByIndivisualDistrictData: any = [];
  casteData: any;
  socialCategoryData: any;
  nominatedSchoolData: any;
  SchoolData: any;
  enrollmentBlockData: any;
  classData: any;
  classLeaveData: any;
  scDisablityChanged: boolean = false;
  isChildEnrollmentDiv: boolean = false;
  notEnrolledDiv: boolean = false;
  enroledDiv: boolean = false;
  getEnrollmentBlockValue: any;
  anexType: any;
  disablityData: any;
  nominatedSchool: any = "";
  enrollmentBlock: any = "";
  class: any = "";
  notEnrolledReason: any = "";
  studyLeaveReason: any = "";
  schoolLeft: any = "";
  classLeft: any = "";
  doingClassLeave: any = "";
  studentIdAadhaar: any = "";
  districtId: any = "";
  blockId: any = "";
  userId: any = "";
  schoolId: any = "";
  scDistrictId: any = "";
  scBlockId: any = "";
  scPanId: any = "";
  scVillageId: any = "";
  isSchoolWard: any = "";
  disGovtFrmWard: any = "";
  thanaNo: any = "";
  diseCode: any = "";
  surveyDate: any = "";
  isChildEnrollment: any = "";
  houseHoldWard: any = "";
  guardianName: any = "";
  businessCode: any = "";
  ageOnApril: any = "";
  codeOfReligion: any = "";
  caste: any = "";
  socialCategory: any = "";
  surveyDateStr: any = "";
  enrollmentBlockShow: any = "";
  disablityId: any = "";
  dobOfStudentStr: any = "";
  dobSubscription!: any;
  posts: any = "";
  isReadOnly: boolean = false;
  nominatedSchoolDatas: any = "";
  scNominatedSchoolChangeds: boolean = false;
  existingBalPanjiData!: any;

  allLabel: string[] = [
    "District",
    "Block",
    "Gram panchayat",
    "Village/Ward",
    "Is there any school in ward",
    "Distance of govt. School in k.m from ward",
    "Thana no.",
    "Udise code of school",
    "Survey date",
    "Is child enrollment in school",
    "Student Id/Aadhaar",
    "House hold no. in ward",
    "Name of boys/girls",
    "Mobile number",
    "Mother name",
    "Father name",
    "Guardian name in case of child not staying with parents",
    "Business of mother/father/guardian",
    "Dob of boys/girls",
    "Age on 1st april 2014 (in full year)",
    "Religion",
    "Social category caste",
    "Study leave reason",

    "What do you do when you leave your studies",
    "If nominated then name of school & types",
    "",
    "Enrollment of block of school",
    "In which class he/she read",
    "If not enrolled in any school till date then code of clear reason",
    "Type of disability",

    "District",
    "Block",
    "Name of school which left",
    "Last class studied",
    "",
    "",
    "",
    "",
    "",
  ];

  userProfile = this.commonService.getUserProfile();
  sessionDistrictId: any =
    this.userProfile.district != 0 ? this.userProfile.district : "";
  sessionBlockId: any =
    this.userProfile.block != 0 ? this.userProfile.block : "";
  sessionUdiseCode: any =
    this.userProfile.udiseCode != 0 ? this.userProfile.udiseCode : "";
  matchFound: any = "";

  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  constructor(
    private route: Router,
    private router: ActivatedRoute,
    private privilegeHelper: PrivilegeHelper, //For menu privilege
    private BalpanjiService: BalpanjiService,
    public customValidators: CustomValidators,
    private formBuilder: FormBuilder,
    private schoolService: SchoolService,
    private commonService: CommonserviceService,
    private alertHelper: AlertHelper,
    private commonFunctionHelper: CommonFunctionHelper,
    private spinner: NgxSpinnerService,
    private el: ElementRef
  ) {
    this.maxDate = new Date();
    const pageUrl: any = this.route.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl); //For menu privilege
    this.commonService.verifyLinkPermission(
      pageUrl,
      this.config.linkType[2],
      this.config.privilege[4]
    ); // For authorization
  }

  ngOnInit(): void {
    // this.scNominatedSchoolChanged = false;s
    if (this.plPrivilege == "admin") {
      this.adminPrivilege = true;
    }
    const users = this.commonService.getUserProfile();

    this.userId = users?.userId;
    this.schoolId = users?.school;
    this.loadAnnexturesDataBySeq();
    this.id = this.router.snapshot.params["bId"];
    this.getBalpanjiEditData(this.id);
    this.initializeForm();
    
  }
  // conditional validation
  conditionalValidator(
    predicate: any,
    validator: ValidatorFn,
    errorNamespace: string,
    validationType: string
  ): ValidatorFn {
    return (formControl: any) => {
      let conditionStatus = false;
      let parentValue = parseInt(predicate());

      // 1) if parent empty
      if (!formControl.parent) {
        return null;
      }

      let error = null;
      conditionStatus = true;
      // validation logic for studentIdAadhaar
      //   if (validationType === "studentIdAadhaar" && parentValue == 1) {
      //     conditionStatus = true;
      //   }  conditionStatus = true;

      // 2) check childs direct parent field
      if (conditionStatus) {
        error = validator(formControl); // validate
      } else {
        error = null;
      }

      // 3) set conditional validation
      if (errorNamespace && error) {
        const customError: any = {}; // custom error property
        customError[errorNamespace] = error;
        error = customError;
      }
      return error;
    };
  }

  initializeForm() {
    this.editBalpanjiForm = this.formBuilder.group({
      scDistrictId: [this.scDistrictId, [Validators.required]],
      scBlockId: [this.scBlockId, [Validators.required]],
      scPanId: [this.scPanId, [Validators.required]],
      scVillageId: [this.scVillageId, []],
      isSchoolWard: [this.isSchoolWard, [Validators.required]],
      disGovtFrmWard: [
        this.disGovtFrmWard,
        [
          Validators.required,
          Validators.maxLength(4),
          Validators.pattern("^[0-9.]*$"),
          this.customValidators.firstCharValidatorRF,
        ],
      ],
      thanaNo: [
        this.thanaNo,
        [
          Validators.required,
          Validators.maxLength(5),
          Validators.pattern("^[0-9]*$"),
          this.customValidators.firstCharValidatorRF,
        ],
      ],
      diseCode: [
        this.diseCode,
        [Validators.required, Validators.pattern("^[0-9]*$")],
      ],
      surveyDate: [this.surveyDate, [Validators.required]],
      isChildEnrollment: [this.isChildEnrollment, [Validators.required]],
      studentIdAadhaar: [this.studentIdAadhaar, [Validators.maxLength(15)]],
      houseHoldWard: [
        this.houseHoldWard,
        [Validators.maxLength(5), this.customValidators.firstCharValidatorRF],
      ],
      studentName: [
        this.studentName,
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(/^[a-zA-Z ]*$/),
          this.customValidators.firstCharValidatorRF,
        ],
      ],
      mobileNumber: [
        this.mobileNumber,
        [
          Validators.maxLength(10),
          Validators.pattern("^[0-9]*$"),
          this.customValidators.firstCharValidatorRF,
        ],
      ],
      motherName: [
        this.motherName,
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(/^[a-zA-Z ]*$/),
          this.customValidators.firstCharValidatorRF,
        ],
      ],
      fatherName: [
        this.fatherName,
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(/^[a-zA-Z ]*$/),
          this.customValidators.firstCharValidatorRF,
        ],
      ],
      guardianName: [
        this.guardianName,
        [
          Validators.maxLength(30),
          Validators.pattern(/^[a-zA-Z ]*$/),
          this.customValidators.firstCharValidatorRF,
        ],
      ],
      businessCode: [
        this.businessCode,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/),
        ],
      ],
      dobOfStudent: [this.dobOfStudent, [Validators.required]],
      ageOnApril: [this.ageOnApril, []],
      codeOfReligion: [this.codeOfReligion, [Validators.required]],
      socialCategory: [this.socialCategory, [Validators.required]],
      studyLeaveReason: [this.studyLeaveReason, [Validators.maxLength(300)]],

      doingClassLeave: [this.doingClassLeave, [Validators.maxLength(300)]],
      nominatedSchool: [this.nominatedSchool, []],
      enrollmentBlockShow: [this.enrollmentBlockShow],
      enrollmentBlock: [this.enrollmentBlock],

      class: [this.class, []],
      notEnrolledReason: [this.notEnrolledReason, []],
      disablityId: [this.disablityId, [Validators.required]],

      districtId: [this.districtId, []],
      blockId: [this.blockId, []],
      schoolLeft: [this.schoolLeft, []],
      classLeft: [this.classLeft, []],

      surveyDateStr: [this.surveyDateStr],
      dobOfStudentStr: [this.dobOfStudentStr],
      bId: [""],
      matchFound: [""],
      schoolId: [this.schoolId],
    });
  }
  getDistrict() {
    this.scDisrtictChanged = true;
    this.commonService.getAllDistrict().subscribe((res: []) => {
      this.districtData = res;
      this.districtData = this.districtData.data;
      if (this.sessionDistrictId != "") {
        $(".scDistrictId").prop("disabled", "disabled");
      }

      this.scDisrtictChanged = false;
    });
  }

  getBlock(id: any) {
    this.scBlockChanged = true;
    const districtId = id;
    this.blockData = [];
    this.panData = [];
    this.villageData = [];
    if (districtId !== "") {
      this.commonService
        .getBlockByDistrictid(districtId)
        .subscribe((res: any) => {
          let data: any = res;
          for (let key of Object.keys(data["data"])) {
            this.blockData.push(data["data"][key]);
          }
          if (this.sessionBlockId != "") {
            $(".scBlockId").prop("disabled", "disabled");
          }

          this.scBlockChanged = false;
        });
    } else {
      this.scBlockChanged = false;
    }
  }
  getBlockByIndivisualDistrict(id: any) {
    const districtId = id;
    this.getBlockByIndivisualDistrictData = [];
    this.editBalpanjiForm.patchValue({ blockId: "" });
    this.nominatedSchoolData = [];
    this.SchoolData = [];
    this.classList = [];
    this.scBlockChanged = true;
    this.scBlockIndChanged = true;
    if (districtId !== "") {
      this.commonService
        .getBlockByDistrictid(districtId)
        .subscribe((res: any) => {
          let data: any = res;
          for (let key of Object.keys(data["data"])) {
            this.getBlockByIndivisualDistrictData.push(data["data"][key]);
          }

          this.editBalpanjiForm.patchValue({
            blockId: this.existingBalPanjiData.schoolLeftBlocktId,
          });

          // if (this.existingBalPanjiData.schoolLeftBlocktId)
          //   this.getSchool(this.existingBalPanjiData.schoolLeftBlocktId);

          this.scBlockIndChanged = false;
          this.scBlockChanged = false;
        });
    } else {
      this.scBlockIndChanged = false;
      this.scBlockChanged = false;
    }
  }

  getPanchayat(distId: any, blockId: any) {
    this.scPanChanged = true;
    this.panData = [];
    this.villageData = [];
    const districtData = distId;
    const blockData = blockId;
    this.editBalpanjiForm.patchValue({ nagarnigamId: "" });
    this.editBalpanjiForm.patchValue({ villageId: "" });
    if (blockId !== "") {
      this.commonService.getPanchayatByBlockId(blockId).subscribe((res) => {
        let data: any = res;
        for (let key of Object.keys(data["data"])) {
          this.panData.push(data["data"][key]);
        }
        this.scPanChanged = false;
      });
    } else {
      this.scPanChanged = false;
    }
  }

  getVillage(distId: any, blockId: any) {
    this.scVillageChanged = true;
    this.villageData = [];
    const districtData = distId;
    const blockData = blockId;
    if (blockId != "") {
      this.BalpanjiService.getVillage(districtData, blockData).subscribe(
        (res: any) => {
          let data: any = res;
          for (let key of Object.keys(data["data"])) {
            this.villageData.push(data["data"][key]);
          }
          this.scVillageChanged = false;
        }
      );
    } else {
      this.scVillageChanged = false;
    }
  }

  getNominatedSchool(blockId: any = 0, districtID: any = 0) {
    const users = this.commonService.getUserProfile();
    this.scNominatedSchoolChangeds = true;
    this.nominatedSchoolDatas = [];
    let district = "";
    let block = "";

    if (users?.district != 0) {
      district = users?.district;
    } else {
      district = districtID;
    }
    if (users?.block != 0) {
      block = users?.block;
    } else {
      block = blockId;
    }

    if (block != "") {
      let paramList: any = { districtId: district, blockId: block };
      this.schoolService.getSchoolList(paramList).subscribe((res) => {
        this.posts = res;
        let data: any = res;
        for (let key of Object.keys(data["data"])) {
          this.nominatedSchoolDatas.push(data["data"][key]);
        }
      });
      this.getSchoolWiseClasses(this.schoolId);
      this.scNominatedSchoolChangeds = false;
    }
  }

  getSchool(blockId: any) {
    this.schoolChanged = true;
    if (blockId) {
      this.SchoolData = [];
      this.classList = [];
      const districtId = this.editBalpanjiForm.getRawValue()?.districtId;
      let paramList: any = { districtId: districtId, blockId: blockId };
      this.schoolService.getSchoolList(paramList).subscribe((res) => {
        this.posts = res;
        let data: any = res;
        for (let key of Object.keys(data["data"])) {
          this.SchoolData.push(data["data"][key]);
        }
        this.getSchoolLeftClasses(
          this.editBalpanjiForm?.getRawValue()?.schoolLeft
        );
      });
      this.schoolChanged = false;
    } else {
      this.schoolChanged = false;
      this.SchoolData = [];
      this.classList = [];
    }
  }
  loadAnnexturesDataBySeq() {
    const anxTypes = [
      "SOCIAL_CATEGORY",
      "MINORITY_COMMUNITY_TYPE",
      "DISABILITY_TYPE",
    ];
    this.commonService.getCommonAnnexture(anxTypes, true).subscribe({
      next: (res: any) => {
        this.socialCategoryData = res?.data?.SOCIAL_CATEGORY;
        this.religionData = res?.data?.MINORITY_COMMUNITY_TYPE;
        this.disablityData = res?.data?.DISABILITY_TYPE;
      },
    });
  }

  getEnrollmentBlock(e: any) {
    this.scEnrollmentBlockChanged = true;

    this.editBalpanjiForm.patchValue({
      enrollmentBlockShow: "Loading...",
    });
    if (e == "") {
      this.editBalpanjiForm.patchValue({
        enrollmentBlockShow: "",
      });
      this.scEnrollmentBlockChanged = false;
    } else {
      this.BalpanjiService.getEnrollmentBlock(e).subscribe((res: any) => {
        let data: any = res;
        let blockName = data["data"]["blockName"];
        let blockCode = data["data"]["blockCode"];
        this.getEnrollmentBlockValue = data["data"]["blockId"];
        let totData = blockCode + "-" + blockName;
        this.editBalpanjiForm.patchValue({
          enrollmentBlockShow: totData,
          enrollmentBlock: this.getEnrollmentBlockValue,
        });
        this.scEnrollmentBlockChanged = false;
      });
    }
  }
  onChangeOfDates() {
    this.dobSubscription = this.editBalpanjiForm
      ?.get("dobOfStudent")
      ?.valueChanges.subscribe((value: any) => {
        this.getAge(value);
      });
  }

  getAge(e: any) {
    const convertAge = new Date(e);
    const setDate = new Date("2014-04-01");
    if (convertAge > setDate) {
      this.editBalpanjiForm.patchValue({
        ageOnApril: "NA",
      });
    } else {
      const timeDiff = Math.abs(setDate.getTime() - convertAge.getTime());
      const showAge = Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
      this.editBalpanjiForm.patchValue({
        ageOnApril: showAge,
      });
    }
  }

  getSchoolWiseClasses(schoolId: any) {
    if (schoolId !== "") {
      this.scClassChanged = true;
      this.schoolService
        .getSchoolWiseClasses(schoolId)
        .subscribe((res: any = []) => {
          this.classData = res.data;
        });
      this.scClassChanged = false;
    } else {
      this.classData = [];
    }
  }

  getSchoolLeftClasses(schoolId: any) {
    console.log(schoolId, "::ywwy");
    this.classList = [];
    if (schoolId !== "") {
      this.scClassLeaveChanged = true;
      this.schoolService
        .getSchoolWiseClasses(schoolId)
        .subscribe((res: any = []) => {
          this.classList = res.data;
        });
      this.scClassLeaveChanged = false;
    } else {
      this.classList = [];
    }
  }

  resetForm() {
    this.editBalpanjiForm.patchValue({
      nominatedSchool: "",
    });
    this.editBalpanjiForm.patchValue({
      enrollmentBlock: "",
    });
    this.editBalpanjiForm.patchValue({
      class: "",
    });
    this.editBalpanjiForm.patchValue({
      notEnrolledReason: "",
    });
    this.editBalpanjiForm.patchValue({
      studyLeaveReason: "",
    });
    this.editBalpanjiForm.patchValue({
      districtId: "",
    });
    this.editBalpanjiForm.patchValue({
      blockId: "",
    });

    this.editBalpanjiForm.patchValue({
      schoolLeft: "",
    });
    this.editBalpanjiForm.patchValue({
      classLeft: "",
    });
    this.editBalpanjiForm.patchValue({
      doingClassLeave: "",
    });
  }
 

  isChildEnrollmentC(e: any) {
    if (e == 0) {
      this.isReadOnly = false;
      this.searchIdAadhaarFound = false;
      this.searchIdAadhaarNotFound = false;
      this.isChildEnrollmentDiv = false;
      this.enroledDiv = false;
      this.notEnrolledDiv = true;
      this.editBalpanjiForm.patchValue({
        studentIdAadhaar: "",
        districtId: "",
        blockId: "",
        schoolLeft: "",
        dobOfStudent: "",
        ageOnApril: "",
        studentName: "",
        fatherName: "",
        motherName: "",
        mobileNumber: "",
        codeOfReligion: "",
        socialCategory: "",
        disabilityType: "",
        houseHoldWard: "",
        guardianName: "",
        businessCode: "",
        enrollmentBlock: "",
        disablityId: "",
        enrollmentBlockShow: "",
      });
      this.resetForm();
    }

    if (e == 1) {
      this.getBlockByIndivisualDistrictData = [];
      this.isChildEnrollmentDiv = true;
      this.notEnrolledDiv = false;
      this.editBalpanjiForm.patchValue({
        studentIdAadhaar: "",
        districtId: "",
        blockId: "",
        schoolLeft: "",
        dobOfStudent: "",
        ageOnApril: "",
        studentName: "",
        fatherName: "",
        motherName: "",
        mobileNumber: "",
        codeOfReligion: "",
        socialCategory: "",
        disabilityType: "",
        houseHoldWard: "",
        guardianName: "",
        businessCode: "",
        enrollmentBlock: "",
        disablityId: "",
        enrollmentBlockShow: "",
      });
      this.resetForm();
    }

    if (e == "") {
      this.searchIdAadhaarFound = false;
      this.searchIdAadhaarNotFound = false;
      this.notEnrolledDiv = false;
      this.enroledDiv = false;
      this.editBalpanjiForm.patchValue({
        studentIdAadhaar: "",
        districtId: "",
        blockId: "",
        schoolLeft: "",
        dobOfStudent: "",
        ageOnApril: "",
        studentName: "",
        fatherName: "",
        motherName: "",
        mobileNumber: "",
        codeOfReligion: "",
        socialCategory: "",
        disabilityType: "",
        houseHoldWard: "",
        guardianName: "",
        businessCode: "",
        enrollmentBlock: "",
        disablityId: "",
        enrollmentBlockShow: "",
      });
      this.resetForm();
    }
  }

  searchIdAadhaar(e: any) {
    const studentIdAadh = this.el.nativeElement.querySelector(
      '[formControlName="studentIdAadhaar"]'
    ).value.length;
    const trueLen = [12, 15];
    if (studentIdAadh > 0) {
      if (trueLen.indexOf(studentIdAadh) === -1) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Enter digits should be 15 for student id, enter digits should be 12 for aadhaar number."
        );
        this.el.nativeElement
          .querySelector('[formControlName="studentIdAadhaar"]')
          .focus();
        return;
      }
    }

    if (e == "") {
      this.alertHelper.viewAlert(
        "error",
        "Invalid",
        "Please enter student id or aadhar number."
      );
      this.el.nativeElement
        .querySelector('[formControlName="studentIdAadhaar"]')
        .focus();
      return;
    }
    this.searchIdAadhaarChanged = true;
    this.BalpanjiService.getStudentIdAadhar(e).subscribe((res: any) => {
      this.studentData = res;

      if (this.studentData.data["studentName"]) {
        this.studentName = this.studentData.data["studentName"];
        this.isReadOnly = true;
      }
      if (this.studentData.data["fatherName"]) {
        this.fatherName = this.studentData.data["fatherName"];
        this.isReadOnly = true;
      }
      if (this.studentData.data["motherName"]) {
        this.motherName = this.studentData.data["motherName"];
        this.isReadOnly = true;
      }
      if (this.studentData.data["mobile"]) {
        this.mobileNumber = this.studentData.data["mobile"];
        this.isReadOnly = true;
      }
      if (this.studentData.data["dob"]) {
        this.dobOfStudent = new Date(this.studentData.data["dob"]?.toString());
        this.isReadOnly = true;
      }
      if (this.studentData.data["religion"]) {
        this.editBalpanjiForm.patchValue({
          codeOfReligion: this.studentData.data["religion"],
        });
      }
      if (this.studentData.data["socialCategory"]) {
        this.editBalpanjiForm.patchValue({
          socialCategory: this.studentData.data["socialCategory"],
        });
        this.isReadOnly = true;
      }
      if (this.studentData.data["disabilityType"]) {
        this.editBalpanjiForm.patchValue({
          disablityId: this.studentData.data["disabilityType"],
        });
        this.isReadOnly = true;
      }
      this.editBalpanjiForm.patchValue({
        studentName: this.studentData.data["studentName"],
      });
      this.editBalpanjiForm.patchValue({
        fatherName: this.studentData.data["fatherName"],
      });
      this.editBalpanjiForm.patchValue({
        motherName: this.studentData.data["motherName"],
      });
      this.editBalpanjiForm.patchValue({
        mobileNumber: this.studentData.data["mobile"],
      });
      this.editBalpanjiForm.patchValue({
        dobOfStudent: this.dobOfStudent,
      });

      if (this.studentData["data"] != "") {
        this.enroledDiv = true;
        this.notEnrolledDiv = false;
        this.searchIdAadhaarFound = true;
        this.searchIdAadhaarNotFound = false;
        this.matchFound = 1;
        this.editBalpanjiForm.patchValue({
          matchFound: 1,
        });
      }
      if (this.studentData["data"] == "") {
        this.enroledDiv = false;
        this.notEnrolledDiv = true;
        this.searchIdAadhaarFound = false;
        this.searchIdAadhaarNotFound = true;
        this.matchFound = 0;
        this.editBalpanjiForm.patchValue({
          matchFound: 0,
        });
      }
      this.searchIdAadhaarChanged = false;
    });
  }

  getBalpanjiEditData(e: any) {
    this.spinner.show();
    this.BalpanjiService.getBalpanjiEditData(e).subscribe((res: any) => {
      if (res.data != "") {
        this.existingBalPanjiData = res?.data;
        let isChildEnrollment = res.data.isChildEnrollment;

        this.getDistrict();
        this.getBlock(res.data.districtId);
        this.getPanchayat(res.data.districtId, res.data.blockId);
        this.getVillage(res.data.districtId, res.data.blockId);
        // this.getCaste();
        // this.getSocialCategory();
        if (isChildEnrollment == 0) {
          this.getNominatedSchool(res.data.blockId, res.data.districtId);
          this.getSchoolWiseClasses(res.data.nominatedSchool);
          this.getEnrollmentBlock(res.data.nominatedSchool);
        } else {
          //   this.getSchool(res.data.blockId);
          this.getSchoolLeftClasses(res.data.schoolLeft);
        }
        //this.getDisablity();
        this.initializeForm();

        this.editBalpanjiForm.patchValue({
          scDistrictId: res.data.districtId,
          scBlockId: res.data.blockId,
          scPanId: res.data.panchayatId,
          scVillageId: res.data.villageId,
          isSchoolWard: res.data.isSchoolWard,
          disGovtFrmWard: res.data.distanceFromWard,
          thanaNo: res.data.thanaNo,
          diseCode: res.data.diseCode,
          surveyDate: new Date(res.data.survayDate),
          isChildEnrollment: res.data.isChildEnrollment,
          houseHoldWard: res.data.houseNoInWard,
          studentName: res.data.studentName,
          mobileNumber: res.data.mobileNumber,
          motherName: res.data.motherName,
          fatherName: res.data.fatherName,
          guardianName: res.data.guardianName,
          businessCode: res.data.businessCodeGuardian,
          dobOfStudent: new Date(res.data.dobOfStudent),
          ageOnApril: res.data.ageOnApril,
          codeOfReligion: res.data.codeOfReligion,
          caste: res.data.caste,
          socialCategory: res.data.socialCategory,
          nominatedSchool: res.data.nominatedSchool,
          enrollmentBlock: res.data.enrollmentBlock,
          class: res.data.classEnrolled,
          notEnrolledReason: res.data.notEnrolledReason,
          studyLeaveReason: res.data.studyLeaveReason,

          districtId: res.data.schoolLeftDistrictId,
          //   blockId: res.data.schoolLeftBlocktId,

          schoolLeft: res.data.schoolLeft,
          classLeft: res.data.classLeft,
          doingClassLeave: res.data.doingClassLeave,
          disablityId: res.data.disablityId,
          bId: res.data.bId,
        });

        if (res.data.schoolLeftDistrictId)
          this.getBlockByIndivisualDistrict(res.data.schoolLeftDistrictId);

        if (res.data.schoolLeftBlocktId)
          this.getSchool(res.data.schoolLeftBlocktId);

        if (res.data.schoolLeft) this.getSchoolLeftClasses(res.data.schoolLeft);

        if (res.data.isChildEnrollment == 1) {
          if (res.data.studentAadharIfEnrolled != null) {
            this.editBalpanjiForm.patchValue({
              studentIdAadhaar: res.data.studentAadharIfEnrolled,
            });
          }
          if (res.data.studentIdIfEnrolled != null) {
            this.editBalpanjiForm.patchValue({
              studentIdAadhaar: res.data.studentIdIfEnrolled,
            });
          }
          this.isChildEnrollmentDiv = true;
          this.notEnrolledDiv = false;
          this.enroledDiv = true;
        } else {
          this.isChildEnrollmentDiv = false;
          this.notEnrolledDiv = true;
        }

        if (this.sessionUdiseCode != "") {
          $(".diseCode").prop("disabled", "disabled");
        }
      }
    });
    this.spinner.hide();
  }

  onSubmit() {
    if (this.editBalpanjiForm.invalid) {
      this.customValidators.formValidationHandler(
        this.editBalpanjiForm,
        this.allLabel,
        this.el,
        {
          required: {
            isSchoolWard:
              "Please select if there is any school in the child's ward.",
              disGovtFrmWard:
              "Please enter distance of govt. school from ward (in Km).",  
              thanaNo:
              "Please enter thana no.",  
              surveyDate:
              "Please enter survey date.",  
              isChildEnrollment:
              "Please select if child is enrolled in school or not.",  
              studentName:
              "Please enter child's name.",
              motherName:
              "Please enter mother's name.",
              fatherName:
              "Please enter father's name.",  
              businessCode:
              "Please enter business of mother/father/guardian.",  
              dobOfStudent:
              "Please enter date of birth of the child.",  
              codeOfReligion:
              "Please select religion of the child.",  
              socialCategory:
              "Please select social category of the child.",  
              disablityId:
              "Please select type of disability of the child.",  
            },
        }
      );
      return;
    }
    this.alertHelper
      .updateAlert(
        "Do you want to Update?",
        "question",
        "Yes, Update it!",
        "No, keep it"
      )
      .then((result: any) => {
        let Balpanjisurveydate = this.commonFunctionHelper.formatDateHelper(
          new Date(this.editBalpanjiForm.getRawValue()?.surveyDate)
        );
        this.editBalpanjiForm.patchValue({
          surveyDateStr: Balpanjisurveydate,
        });
        let balpanjiDobDate = this.commonFunctionHelper.formatDateHelper(
          new Date(this.editBalpanjiForm.getRawValue()?.dobOfStudent)
        );
        this.editBalpanjiForm.patchValue({
          dobOfStudentStr: balpanjiDobDate,
        });

        if (result.value) {
          this.spinner.show();
          this.BalpanjiService.balpanjiEditDataRegistration(
            this.editBalpanjiForm.value
          ).subscribe({
            next: (res: any) => {
              this.spinner.hide();
              this.alertHelper
                .successAlert(
                  "Saved!",
                  "Balpanji updated successfully.",
                  "success"
                )
                .then(() => {
                  this.route.navigate([
                    "Application/balpanji/registration/viewBalpanji",
                  ]);
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

  cancel() {
    this.route.navigate(["Application/balpanji/registration/viewBalpanji"]);
  }
  ngOnDestroy() {
    this.dobSubscription?.unsubscribe();
  }
  resetFilterHandler(type: number) {
    switch (type) {
      case 1:
        this.getBlockByIndivisualDistrictData = [];
        this.SchoolData = [];
        this.classList = [];
        
        // reset existing values
        this.existingBalPanjiData.schoolLeftBlocktId = "";

        this.editBalpanjiForm.patchValue({
          blockId: "",
          schoolLeft: "",
          classLeft: "",
        });
        break;

      case 2:
        this.SchoolData = [];
        this.classList = [];
        this.editBalpanjiForm.patchValue({
          schoolLeft: "",
          classLeft: "",
        });
        this.getSchool(this.editBalpanjiForm?.getRawValue().blockId);
        break;

      case 3:
        this.classList = [];
        this.editBalpanjiForm.patchValue({
          classLeft: "",
        });
        break;

      default:
        break;
    }
    // this.editBalpanjiForm.patchValue({
    //   schoolLeft: "",
    // });
    // this.editBalpanjiForm.patchValue({
    //   classLeft: "",
    // });
    // this.SchoolData = [];
    // this.classList = [];
    // if (blockId) {
    //   this.getSchool(blockId);
    // }
  }
}
