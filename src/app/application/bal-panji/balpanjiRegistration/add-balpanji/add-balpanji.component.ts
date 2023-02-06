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
import { ActivatedRoute, Router } from "@angular/router";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { SchoolService } from "src/app/application/school/services/school.service";
import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";
declare const $: any;

@Component({
  selector: "app-add-balpanji",
  templateUrl: "./add-balpanji.component.html",
  styleUrls: ["./add-balpanji.component.css"],
})
export class AddBalpanjiComponent implements OnInit {
  addBalpanjiForm!: FormGroup;
  scDisrtictChanged: boolean = false;
  districtData: any = "";
  scBlockChanged: boolean = false;
  blockData: any;
  scClusterChanged: boolean = false;
  scBlockIndChanged: boolean = false;
  searchIdAadhaarChanged: boolean = false;
  searchIdAadhaarFound: boolean = false;
  searchIdAadhaarNotFound: boolean = false;
  scReligionChanged: boolean = false;
  clusterData: any;
  panData: any;
  maxDate: any = Date;
  scPanChanged: boolean = false;
  scVillageChanged: boolean = false;
  scCasteChanged: boolean = false;
  scSocialCategoryChanged: boolean = false;
  scNominatedSchoolChanged: boolean = false;
  scEnrollmentBlockChanged: boolean = false;
  scClassChanged: boolean = false;
  scClassLeaveChanged: boolean = false;
  classChanged: boolean = false;
  classList: any = [];
  villageData: any;
  studentData: any = "";
  studentId: any;
  studentCode: any;
  studentName: any;
  fatherName: any;
  motherName: any;
  guardianName: any;
  dobOfStudent: any = "";
  mobileNumber: any;
  religionData: any;
  casteData: any;
  socialCategoryData: any;
  nominatedSchoolData: any;
  SchoolData: any = [];
  enrollmentBlockData: any;
  classData: any;
  classLeaveData: any;
  scDisablityChanged: boolean = false;
  isChildEnrollmentDiv: boolean = false;
  notEnrolledDiv: boolean = false;
  enroledDiv: boolean = false;
  anexType: any;
  disablityData: any;
  nominatedSchool: any = "";
  getBlockByIndivisualDistrictData: any = [];
  enrollmentBlock: any = "";
  class: any = "";
  scDistrictId: any = "";
  scBlockId: any = "";
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
  posts: any = "";
  schlCatId: any = "";
  enrollmentBlockShow: any = "";
  surveyDateStr: any = "";
  dobOfStudentStr: any = "";
  isReadOnly: boolean = false;
  nominatedSchoolDatas: any = "";
  scNominatedSchoolChangeds: boolean = false;
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
  ];
  getEnrollmentBlockValue: any;
  userProfile = this.commonService.getUserProfile();
  sessionDistrictId: any =
    this.userProfile.district != 0 ? this.userProfile.district : "";
  sessionBlockId: any =
    this.userProfile.block != 0 ? this.userProfile.block : "";
  sessionUdiseCode: any =
    this.userProfile.udiseCode != 0 ? this.userProfile.udiseCode : "";

  studentIdAadharSearched: any = 0;
  matchFound: any = "";

  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  dobSubscription!: any;
  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonserviceService,
    private BalpanjiService: BalpanjiService,
    private alertHelper: AlertHelper,
    private el: ElementRef,
    private schoolService: SchoolService,
    private spinner: NgxSpinnerService,
    public customValidators: CustomValidators,
    private privilegeHelper: PrivilegeHelper, //For menu privilege
    private route: Router,
    private commonFunctionHelper: CommonFunctionHelper,
    private router: ActivatedRoute
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
    if (this.plPrivilege == "admin") {
      this.adminPrivilege = true;
    }
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.schoolId = users?.school;
    this.initializeForm();
    this.getDistrict();
    this.getVillage();
    this.loadAnnexturesDataBySeq();
    this.onChangeOfDates();
    this.getNominatedSchool();
    if (this.sessionUdiseCode != "") {
      this.addBalpanjiForm.patchValue({
        diseCode: this.sessionUdiseCode,
      });
      $(".diseCode").prop("disabled", "disabled");
    }
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

      // validation logic for nominatedSchool
      // if (validationType === "nominatedSchool" && parentValue == 0) {
      // 	conditionStatus = true;
      // }
      // validation logic for enrollmentBlock
      // if (validationType === "enrollmentBlock" && parentValue == 0) {
      // 	conditionStatus = true;
      // }
      //   if (validationType === "enrollmentBlockShow" && parentValue == 0) {
      // 	conditionStatus = true;
      //   }
      // validation logic for class
      // if (validationType === "class" && parentValue == 0) {
      // 	conditionStatus = true;
      // }
      // validation logic for notEnrolledReason
      // if (validationType === "notEnrolledReason" && parentValue == 0) {
      // 	conditionStatus = true;
      // }
      // validation logic for studentIdAadhaar
      // if (validationType === "studentIdAadhaar" && parentValue == 1) {
      // 	conditionStatus = true;
      // }
      // validation logic for studyLeaveReason
      // if (validationType === "studyLeaveReason" && parentValue == 1) {
      // 	conditionStatus = true;
      // }
      // validation logic for districtId
      // if (validationType === "districtId" && parentValue == 1) {
      // 	conditionStatus = true;
      // }
      // validation logic for blockId
      // if (validationType === "blockId" && parentValue == 1) {
      // 	conditionStatus = true;
      // }
      // validation logic for schoolLeft
      // if (validationType === "schoolLeft" && parentValue == 1) {
      // 	conditionStatus = true;
      // }
      // validation logic for classLeft
      // if (validationType === "classLeft" && parentValue == 1) {
      // 	conditionStatus = true;
      // }
      // validation logic for doingClassLeave
      // if (validationType === "doingClassLeave" && parentValue == 1) {
      // 	conditionStatus = true;
      // }

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
    this.addBalpanjiForm = this.formBuilder.group({
      scDistrictId: [this.sessionDistrictId, [Validators.required]],
      scBlockId: [this.sessionBlockId, [Validators.required]],
      scPanId: ["", []],
      scVillageId: ["", []],
      isSchoolWard: ["", [Validators.required]],
      disGovtFrmWard: [
        "",
        [
          Validators.required,
          Validators.maxLength(4),
          Validators.pattern("^[0-9.]*$"),
          this.customValidators.firstCharValidatorRF,
        ],
      ],
      thanaNo: [
        "",
        [
          Validators.required,
          Validators.maxLength(5),
          Validators.pattern("^[0-9]*$"),
          this.customValidators.firstCharValidatorRF,
        ],
      ],
      diseCode: [
        this.sessionUdiseCode,
        [Validators.required, Validators.pattern("^[0-9]*$")],
      ],
      surveyDate: ["", [Validators.required]],
      isChildEnrollment: ["", [Validators.required]],
      studentIdAadhaar: ["", [Validators.maxLength(15)]],
      // studentIdAadhaar: [
      // 	this.studentIdAadhaar,
      // 	[
      // 		this.conditionalValidator(
      // 			() => this.addBalpanjiForm?.get("isChildEnrollment")?.value,
      // 			Validators.required,
      // 			"conditionalValidation",
      // 			"studentIdAadhaar"
      // 		), Validators.maxLength(12)
      // 	],
      // ],
      houseHoldWard: [
        "",
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
        "",
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/),
          this.customValidators.firstCharValidatorRF,
        ],
      ],
      dobOfStudent: ["", [Validators.required]],
      ageOnApril: [""],
      codeOfReligion: ["", [Validators.required]],
      socialCategory: ["", [Validators.required]],
      studyLeaveReason: ["", [Validators.maxLength(300)]],

      doingClassLeave: ["", [Validators.maxLength(300)]],
      nominatedSchool: ["", []],
      enrollmentBlockShow: [""],
      enrollmentBlock: ["", []],

      class: ["", []],
      notEnrolledReason: ["", []],
      disablityId: ["", [Validators.required]],

      districtId: ["", []],
      blockId: ["", []],
      schoolLeft: ["", []],
      classLeft: ["", []],

      surveyDateStr: [this.surveyDateStr],
      dobOfStudentStr: [this.dobOfStudentStr],
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
        this.addBalpanjiForm.patchValue({
          scDistrictId: this.sessionDistrictId,
        });
        this.getBlock(this.sessionDistrictId);
      }
      this.scDisrtictChanged = false;
    });
  }

  getBlock(id: any) {
    this.scBlockChanged = true;
    const districtId = id;
    this.blockData = [];
    //this.SchoolData = [];
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
            this.addBalpanjiForm.patchValue({
              scBlockId: this.sessionBlockId,
            });
            this.getPanchayat(this.sessionDistrictId, this.sessionBlockId);
            this.getVillage();
            // this.getNominatedSchool()
          } else {
            this.addBalpanjiForm.patchValue({
              scBlockId: "",
            });
          }
          this.scBlockChanged = false;
        });
    } else {
      this.scBlockChanged = false;
    }
  }
  getBlockByIndivisualDistrict(id: any) {
    this.scBlockIndChanged = true;
    const districtId = id;
    this.SchoolData = [];
	this.classList=[];
    this.getBlockByIndivisualDistrictData = [];
    this.nominatedSchoolData = [];
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
    this.addBalpanjiForm.patchValue({ nagarnigamId: "" });
    this.addBalpanjiForm.patchValue({ villageId: "" });
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

  getVillage() {
    this.addBalpanjiForm.patchValue({
      scVillageId: "",
    });
    this.scVillageChanged = true;
    this.villageData = [];
    const blockData = this.addBalpanjiForm.getRawValue()?.scBlockId;
    const districtData = this.addBalpanjiForm.getRawValue()?.scDistrictId;
    if (blockData != "") {
      this.BalpanjiService.getVillage(districtData, blockData).subscribe(
        (res: any) => {
          let data: any = res;
          for (let key of Object.keys(data["data"])) {
            this.villageData.push(data["data"][key]);
          }
          /* this.addBalpanjiForm.patchValue({
						scVillageId: ''
					}); */
          this.scVillageChanged = false;
        }
      );
    } else {
      this.scVillageChanged = false;
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

  getNominatedSchool() {
    this.scNominatedSchoolChangeds = true;
    this.nominatedSchoolDatas = [];
    this.scDistrictId = this.addBalpanjiForm.get("scDistrictId")?.value;
    this.scBlockId = this.addBalpanjiForm.get("scBlockId")?.value;
    let paramList: any = {
      districtId: this.scDistrictId,
      blockId: this.scBlockId,
      schoolId: this.schoolId,
    };
    this.schoolService.getSchoolList(paramList).subscribe((res) => {
      this.posts = res;
      let data: any = res;
      for (let key of Object.keys(data["data"])) {
        this.nominatedSchoolDatas.push(data["data"][key]);
      }
      this.getSchoolWiseClasses(this.schoolId);
      this.scNominatedSchoolChangeds = false;
    });
  }
  getSchool(id: any) {
	this.SchoolData = [];
	this.classList = [];
    if (id) {
      this.scNominatedSchoolChanged = true;
      this.districtId = this.addBalpanjiForm.get("districtId")?.value;
      this.blockId = this.addBalpanjiForm.get("blockId")?.value;
      let paramList: any = {
        districtId: this.districtId,
        blockId: this.blockId,
      };
      this.schoolService.getSchoolList(paramList).subscribe((res) => {
        this.posts = res;
        let data: any = res;
        for (let key of Object.keys(data["data"])) {
          this.SchoolData.push(data["data"][key]);
        }
        this.scNominatedSchoolChanged = false;
      });
    }
  }

  getEnrollmentBlock(e: any) {
    this.scEnrollmentBlockChanged = true;

    this.addBalpanjiForm.patchValue({
      enrollmentBlockShow: "Loading...",
    });
    if (e == "") {
      this.addBalpanjiForm.patchValue({
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
        this.addBalpanjiForm.patchValue({
          enrollmentBlockShow: totData,
          enrollmentBlock: this.getEnrollmentBlockValue,
        });
        this.scEnrollmentBlockChanged = false;
      });
    }
  }

  // getClass(e: any) {
  // 	if (e !== "") {
  // 		this.BalpanjiService.getClass(e).subscribe((res: any = []) => {
  // 			this.classData = res.data;
  // 		});
  // 	}

  // }

  // classLeave(e: any) {
  // 	if (e !== "") {
  // 		this.BalpanjiService.getClass(e).subscribe((res: any = []) => {
  // 			this.classLeaveData = res.data;
  // 		});
  // 	}
  // }

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
    this.addBalpanjiForm.patchValue({
      nominatedSchool: "",
    });
    this.addBalpanjiForm.patchValue({
      enrollmentBlock: "",
    });
    this.addBalpanjiForm.patchValue({
      class: "",
    });
    this.addBalpanjiForm.patchValue({
      notEnrolledReason: "",
    });
    this.addBalpanjiForm.patchValue({
      studyLeaveReason: "",
    });
    this.addBalpanjiForm.patchValue({
      districtId: "",
    });
    this.addBalpanjiForm.patchValue({
      blockId: "",
    });

    this.addBalpanjiForm.patchValue({
      schoolLeft: "",
    });
    this.addBalpanjiForm.patchValue({
      classLeft: "",
    });
    this.addBalpanjiForm.patchValue({
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
      this.addBalpanjiForm.patchValue({
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
      this.addBalpanjiForm.patchValue({
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
      this.addBalpanjiForm.patchValue({
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

  focusoutId(e: any) {
    const studentIdAadh = this.el.nativeElement.querySelector(
      '[formControlName="studentIdAadhaar"]'
    ).value.length;
    const trueLen = [12, 15];
    if (studentIdAadh > 0) {
      if (trueLen.indexOf(studentIdAadh) === -1) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Enter digits should be 12 for student id, enter digits should be 15 for aadhaar number."
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

      this.studentCode = this.studentData.data["studentCode"];
      this.studentName = this.studentData.data["studentName"];
      this.fatherName = this.studentData.data["fatherName"];
      this.motherName = this.studentData.data["motherName"];
      this.mobileNumber = this.studentData.data["mobileNumber"];
      // this.dobOfStudent 	= new Date(this.studentData.data['dobOfStudent'].toString());
      this.dobOfStudent = this.studentData.data["dobOfStudent"];
      if (this.studentData["data"] != "") {
        this.enroledDiv = true;
        this.notEnrolledDiv = true;
        this.searchIdAadhaarFound = true;
        this.searchIdAadhaarNotFound = false;
        this.matchFound = 1;
        this.addBalpanjiForm.patchValue({
          matchFound: 1,
        });
      }
      if (this.studentData["data"] == "") {
        this.enroledDiv = false;
        this.notEnrolledDiv = true;
        this.searchIdAadhaarFound = false;
        this.searchIdAadhaarNotFound = true;
        this.matchFound = 0;
        this.addBalpanjiForm.patchValue({
          matchFound: 0,
        });
      }
      this.searchIdAadhaarChanged = false;
    });
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
          "Enter digits should be 12 for student id, enter digits should be 15 for aadhaar number."
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

      this.studentCode = this.studentData.data["studentCode"];
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
        this.addBalpanjiForm.patchValue({
          codeOfReligion: this.studentData.data["religion"],
        });
        this.isReadOnly = true;
      }
      if (this.studentData.data["socialCategory"]) {
        this.addBalpanjiForm.patchValue({
          socialCategory: this.studentData.data["socialCategory"],
        });
        this.isReadOnly = true;
      }
      if (this.studentData.data["disabilityType"]) {
        this.addBalpanjiForm.patchValue({
          disablityId: this.studentData.data["disabilityType"],
        });
        this.isReadOnly = true;
      }

      this.addBalpanjiForm.patchValue({
        studentName: this.studentData.data["studentName"],
        fatherName: this.studentData.data["fatherName"],
        motherName: this.studentData.data["motherName"],
        mobileNumber: this.studentData.data["mobile"],
        dobOfStudent: this.dobOfStudent,
      });

      this.enroledDiv = true;
      this.notEnrolledDiv = false;
      this.searchIdAadhaarFound = true;
      this.searchIdAadhaarNotFound = false;
      this.matchFound = 1;
      this.addBalpanjiForm.patchValue({
        matchFound: 1,
      });

      if (this.studentData["data"] == "") {
        this.enroledDiv = false;
        this.notEnrolledDiv = true;
        this.searchIdAadhaarFound = false;
        this.searchIdAadhaarNotFound = true;
        this.matchFound = 0;
        this.addBalpanjiForm.patchValue({
          matchFound: 0,
        });
      }
      this.searchIdAadhaarChanged = false;
    });
  }
  onChangeOfDates() {
	this.dobSubscription = this.addBalpanjiForm
      ?.get("dobOfStudent")
      ?.valueChanges.subscribe((value: any) => {
        this.getAge(value);
      });
  }

  getAge(e: any) {
    const convertAge = new Date(e);
    if (e != null) {
      const setDate = new Date("2014-04-01");
      if (convertAge > setDate) {
        this.addBalpanjiForm.patchValue({
          ageOnApril: "NA",
        });
      } else {
        const timeDiff = Math.abs(setDate.getTime() - convertAge.getTime());
        const showAge = Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
        this.addBalpanjiForm.patchValue({
          ageOnApril: showAge,
        });
      }
    }
  }

  onSubmit() {
    if (this.addBalpanjiForm.invalid) {
      this.customValidators.formValidationHandler(
        this.addBalpanjiForm,
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
              "Please enter date of birth of the Child.",  
              codeOfReligion:
              "Please select religion of the child.",  
              socialCategory:
              "Please select social category of the child.",  
              disablityId:
              "Please select type of disability of the child.",  
            },
        }
      );
    }
    if (this.addBalpanjiForm.invalid) {
      return;
    }

    this.alertHelper.submitAlert().then((result: any) => {
      let Balpanjisurveydate = this.commonFunctionHelper.formatDateHelper(
        this.addBalpanjiForm.get("surveyDate")?.value
      );
      this.addBalpanjiForm.patchValue({
        surveyDateStr: Balpanjisurveydate,
      });
      let balpanjiDobDate = this.commonFunctionHelper.formatDateHelper(
        new Date(this.addBalpanjiForm.getRawValue()?.dobOfStudent)
      );
      this.addBalpanjiForm.patchValue({
        dobOfStudentStr: balpanjiDobDate,
      });

      if (result.value) {
        this.spinner.show();
        this.BalpanjiService.balpanjiRegistration(
          this.addBalpanjiForm.value
        ).subscribe({
          next: (res: any) => {
            this.spinner.hide();
            this.alertHelper
              .successAlert(
                "Saved!",
                "Balpanji created successfully.",
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

  reset() {
    this.initializeForm();
    this.addBalpanjiForm.patchValue({
      studentName: "",
    });
    this.addBalpanjiForm.patchValue({
      motherName: "",
    });
    this.addBalpanjiForm.patchValue({
      fatherName: "",
    });
  }
  ngOnDestroy() {
    this.dobSubscription?.unsubscribe();
  }
}
