import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { BankDetailsService } from "../../services/bank-details.service";

import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { SchoolService } from "src/app/application/school/services/school.service";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { StudentInformationService } from "../../services/student-information.service";
import { Constant } from "src/app/shared/constants/constant";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { ErrorHandler } from "src/app/core/helpers/error-handler";
import { Observable } from "rxjs";
import { formatDate } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { SchoolMediumOfInstructionService } from "../../services/school-medium-of-instruction.service";

@Component({
  selector: "app-edit-student",
  templateUrl: "./edit-student.component.html",
  styleUrls: ["./edit-student.component.css"],
})
export class EditStudentComponent implements OnInit {

  @ViewChild("studentPhotoID", { static: false }) studentPhoto!: ElementRef;
  @ViewChild("residentialPhoto", { static: false }) residentialPhoto!: ElementRef;
  @ViewChild("affidavitPhoto", { static: false }) affidavitPhoto!: ElementRef;
  @ViewChild("incomePhoto", { static: false }) incomePhoto!: ElementRef;
  @ViewChild("casteCertificatePhoto", { static: false }) casteCertificatePhoto!: ElementRef;

  public studentAPI = environment.studentAPI;

  //public hide:boolean = false;
  public show: boolean = false;
  public buttonName: any = "Show";
  isVisible: any = 1;
  isSelected: boolean = true;
  optionVal: any;
  optionstream: any;

  encId: any = "";
  studentData: any = [];
  userProfile: any = [];
  schlInfo: any = [];
  public filePath = environment.filePath;

  formData = new FormData();

  studentForm!: FormGroup;
  submitted = false;

  bsValue = new Date();
  // minDOB = new Date(new Date().setFullYear(new Date().getFullYear() - 5));
  minDOB = new Date();
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();

  /* Stundent form control default value set :: start */
  schoolId: any = "";
  admissionType: any = "1"; // New Admission
  class: any = "";
  stream: any = "";
  group: any = "";
  section: any = "";
  admissionNo: any = "";
  medium: any = "";
  admissionDate: any = "";
  freeEducation: any = "0";
  class1PrevStatus: any = "0";

  aadhaar: any = "";
  studentName: any = "";
  fatherName: any = "";
  motherName: any = "";
  dob: any = "";
  gender: any = "";
  socialCategory: any = "";
  religion: any = "";
  motherTongue: any = "";
  habitation: any = "";
  minority: any = "";
  disadvantagedGroup: any = "";
  studentPhotoID: any = "";
  studentPhotoIDPath: any = "";
  disabilityType: any = "";
  communicationAddress: any = "";
  permanentAddress: any = "";
  checkAdd: boolean = false;

  districtId: any = "";
  blockId: any = "";
  clusterId: any = "";
  prevSchoolId: any = "";
  lastYearAttendance: any = "";
  passedLastExam: any = "0";
  markSecuredLastExam: any = "";
  percentageLastExam: any = "";
  cls9To12Trade: any = "";

  // receivedDressSet: any = "0";
  // facilityId: any = "0";
  // freeTextBook: any = "0";
  // freeTransport: any = "0";
  // freeEscort: any = "0";
  // freeBicycle: any = "0";
  // freeHostel: any = "1";
  // attendedSpecialTraining: any = "0";
  // homeless: any = "1";
  // gotMedicine: any = "0";
  // // medicine: any = "";
  // ironTablets: any = "0";
  // dewormingTablets: any = "0";
  // vitaminATablets: any = "0";

  bankAccNo: any = "";
  accHolderName: any = "";
  accHolderType: any = "";
  bankName: any = "";
  otherBankName: any = "";
  IFSC: any = "";

  mobile: any = "";
  email: any = "";
  parentAadharNo: any = "";
  incomeLimit: any = "0";
  residentialCertificate: any = "";
  casteCertificate: any = "";
  incomeCertificate: any = "";
  affidavit: any = "";

  guardianName: any = "";
  guardianMobileNo: any = "";
  guardianRelationship: any = "";

  studentPhotoImageSrc: any = "";
  studentPhotoImageShown: boolean = false;

  residentialPhotoImageSrc: any = '';
  residentialPhotoImageShown: boolean = false;
  residentialPdfShown: boolean = false;
  residentialPdfDownload:any = '';

  affidavitPhotoImageSrc: any = "";
  affidavitPhotoImageShown: boolean = false;
  affidavitPdfShown: boolean = false;

  incomePhotoImageSrc: any = "";
  incomePhotoImageShown: boolean = false;
  incomePdfShown: boolean = false;

  casteCertificatePhotoImageSrc: any = '';
  casteCertificatePhotoImageShown: boolean = false;
  casteCertificatePdfShown: boolean = false;

  allLabel: string[] = [
    "",
    "",
    "",

    "Current class of enrollment",
    "Stream",
    "Group",
    "Section",
    "Admission number",
    "Medium of instruction (Present School)",
    "Date of admission",
    "Getting free education as per RTE Act. (for private unaided school)",
    "If studying in slass 1, status of previous year",

    "Student's aadhaar number",
    "Student name",
    "Father name",
    "Mother name",
    "Date of birth",
    "Gender",
    "Social category",
    "Religion",
    "Mother tongue",
    "Habitation or Locality",
    "Whether belongs to minority",
    "Whether belong to disadvantaged group",
    "Student's photo",
    "Type of disability",
    "Communication address",
    "Permanent address",

    "District",
    "Block",
    "Cluster",
    "Previous school",
    "Last year student's attendance",
    "Have you passed last year exam",
    "Total mark secured  in last exam",
    "Percentage (%) mark secured in last exam",
    "If Class 9 to Class 12 then (In the 9th through 12th , what is the trade/Sector)",

    // "Student received set of dresses",
    // "Facilities recived by CWSN",
    // "Free set of text books",
    // "Free transport",
    // "Free escort facility",
    // "Free bicycle",
    // "Free hostel facility",
    // "Child attended special training",
    // "Whether the child is homeless",
    // "Did you get any medicine in last three months",
    // "What kind of medicine did you get in the last three months(Iron and Folic acid tablets)",
    // "What kind of medicine did you get in the last three months(Deworming tablets)",
    // "What kind of medicine did you get in the last three months(Vitamin A tablets)",

    "Account no.",
    "Account holder name",
    "Account holder",
    "Bank name",
    "IFSC",
    "Other bank name",

    "Mobile number (Student/ Parent)",
    "Email address (Student/ Parent)",
    "Parent aadhaar no.",
    "Whether income > 1.5 Lacs",
    "Annual Income Certificate",
    "Caste Certifiate",
    "Residential Certifiate",
    "affidavit",

    "Name of guardian",
    "Mobile number of guardian",
    "Relationship with student",

    "",
    "",
    ""
  ];

  /* Stundent form control default value set :: end */

  /* Data binding controls :: start */
  anxData: any = [];

  classChanged: boolean = false;
  classList: any = [];
  streamChanged: boolean = false;
  streamList: any = [];
  groupChanged: boolean = false;
  groupList: any = [];
  sectionChanged: boolean = false;
  sectionList: any = [];
  mediumChanged: boolean = false;
  mediumList: any = [];

  genderChanged: boolean = false;
  stdGender: any = [];
  socialCategoryChanged: boolean = false;
  socialCategoryList: any = [];
  religionChanged: boolean = false;
  religionList: any = [];
  languageList: any = [];
  motherTongueChanged: boolean = false;
  disabilityTypeChanged: boolean = false;
  disabilityTypeList: any = [];

  disrtictChanged: boolean = false;
  districtList: any = [];
  clusterChanged: boolean = false;
  clusterList: any = [];
  blockChanged: boolean = false;
  blockList: any = [];
  prevSchoolChanged: boolean = false;
  schoolList: any = [];
  facilityChanged: boolean = false;
  facilityList: any = [];
  hostleFacilityChanged: boolean = false;
  hostleFacilityList: any = [];
  specialTrainingChanged: boolean = false;
  specialTrainingList: any = [];
  homelessChanged: boolean = false;
  homelessList: any = [];
  bankChanged: boolean = false;
  bankList: any = [];
  bankData: any = [];
  accHolderTypeChanged: boolean = false;
  accHolderTypeList: any = [];
  mediumOfInstructions: any = [];

  /* Data binding controls :: end */
  plPrivilege: string = "view"; //For menu privilege
  adminPrivilege: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    private commonFunction: CommonFunctionHelper,
    public customValidators: CustomValidators,
    private spinner: NgxSpinnerService,
    private commonService: CommonserviceService,
    private schoolService: SchoolService,
    private studentService: StudentInformationService,
    private el: ElementRef,
    private httpClient: HttpClient,
    private privilegeHelper: PrivilegeHelper, //For menu privilege
    private errorHandler: ErrorHandler,
    private BankDetailsService: BankDetailsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private mediumOfInstruction: SchoolMediumOfInstructionService
  ) {
    const pageUrl: any = this.router.url;
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
    this.encId = this.activatedRoute.snapshot.params["encId"];
    this.userProfile = this.commonService.getUserProfile();
    this.schoolId = this.userProfile.school;
    this.editStudent(this.encId);
    //this.commonService.getSchoolInfo({encId:this.userProfile.school,academicYear:this.academicYear});
    this.loadAnnexturesData();
    this.loadAnnexturesDataBySeq();
    this.getSchoolInfo();
    this.getSchoolClasses(this.userProfile.school);
    this.getDistrict();
    this.getBank();
    this.initializeForm();
    this.getMediumOfInstruction();
    this.el.nativeElement.querySelector('[formControlName="class"]').focus();
  }

  editStudent(studentEncId: string) {
    this.spinner.show();
    let paramList = { encId: studentEncId, academicYear:this.academicYear };
    this.studentService.getStudent(paramList).subscribe((res: any) => {
      this.spinner.hide();
      this.studentData = res.data;
      this.schoolId = this.studentData.schoolId;
      this.class = this.studentData.class;
      this.stream = this.studentData.stream;
      this.group = this.studentData.group;
      this.section = this.studentData.section;
      this.admissionNo = this.studentData.admissionNo;
      this.medium = this.studentData.medium;
      this.admissionDate = new Date(this.studentData.admissionDate);
      this.freeEducation = this.studentData.freeEducation;
      this.class1PrevStatus = this.studentData.class1PrevStatus;

      this.aadhaar = this.studentData.aadhaar;
      this.studentName = this.studentData.studentName;
      this.fatherName = this.studentData.fatherName;
      this.motherName = this.studentData.motherName;
      this.dob = new Date(this.studentData.dob);
      this.gender = this.studentData.gender;
      this.socialCategory = this.studentData.socialCategory;
      this.religion = this.studentData.religion;
      this.motherTongue = this.studentData.motherTongue;
      this.habitation = this.studentData.habitation;
      this.minority =
        this.studentData.minority > 0 ? this.studentData.minority : "";
      this.disadvantagedGroup =
        this.studentData.disadvantagedGroup > 0
          ? this.studentData.disadvantagedGroup
          : "";

      if (
        this.studentData.studentPhotoID !== null &&
        this.studentData.studentPhotoID.length > 0
      ) {
        var str = this.studentData.studentPhotoID;
        var newstr = str.replace(".", "~");
        this.studentPhotoImageSrc = this.filePath + "/" + newstr;
        this.studentPhotoImageShown = true;
      }

      this.studentPhotoID = "";
      this.disabilityType = (res?.data.disabilityType!=null)?res.data.disabilityType:'';
      this.communicationAddress = this.studentData.communicationAddress;
      this.permanentAddress = this.studentData.permanentAddress;

      this.districtId =
        this.studentData.districtId > 0 ? this.studentData.districtId : "";
      if (this.studentData.districtId > 0) {
        this.getBlock(this.districtId);
      }
      this.blockId =
        this.studentData.blockId > 0 ? this.studentData.blockId : "";
      if (this.studentData.blockId > 0) {
        this.getCluster(this.blockId);
      }
      this.clusterId =
        this.studentData.clusterId > 0 ? this.studentData.clusterId : "";
      if (this.studentData.clusterId > 0) {
        this.getSchool(this.clusterId);
      }
      this.prevSchoolId =
        this.studentData.prevSchoolId > 0 ? this.studentData.prevSchoolId : "";
      this.lastYearAttendance = this.studentData.lastYearAttendance;
      this.passedLastExam = this.studentData.passedLastExam.toString();
      this.markSecuredLastExam = this.studentData.markSecuredLastExam;
      this.percentageLastExam = this.studentData.percentageLastExam;
      this.cls9To12Trade = this.studentData.cls9To12Trade;

      // this.receivedDressSet = this.studentData.receivedDressSet;
      // this.facilityId = this.studentData.facilityId;
      // this.freeTextBook = this.studentData.freeTextBook;
      // this.freeTransport = this.studentData.freeTransport;
      // this.freeEscort = this.studentData.freeEscort;
      // this.freeBicycle = this.studentData.freeBicycle;
      // this.freeHostel = this.studentData.freeHostel;
      // this.attendedSpecialTraining = this.studentData.attendedSpecialTraining;
      // this.gotMedicine = this.studentData.gotMedicine.toString();
      // // this.medicine = this.studentData.medicine;
      // this.ironTablets = this.studentData?.ironTablets?.toString();
      // this.dewormingTablets = this.studentData?.dewormingTablets?.toString();
      // this.vitaminATablets = this.studentData?.vitaminATablets?.toString();

      this.bankAccNo = this.studentData.bankAccNo;
      this.accHolderName = this.studentData.accHolderName;
      this.accHolderType = this.studentData.accHolderType? this.studentData.accHolderType : "";
      this.bankName = this.studentData.bankName;
      this.otherBankName = this.studentData.otherBankName;
      this.IFSC = this.studentData.IFSC;

      this.mobile = this.studentData.mobile ? this.studentData.mobile : "";
      this.email = this.studentData.email ? this.studentData.email : "";
      this.parentAadharNo = this.studentData.parentAadharNo;
      this.incomeLimit = this.studentData.incomeLimit > 0 ? this.studentData.incomeLimit : 0;

      if (this.studentData.residentialCertificate !== null && this.studentData.residentialCertificate.length > 0) {
        var str = this.studentData.residentialCertificate;
        var ext = str.split('.').pop();
        if ((ext === 'pdf') || (ext === 'PDF')) {
          this.residentialPdfShown = true;
        }else{
          this.residentialPhotoImageShown = true;
        }
        var newstr = str.replace(".", "~");
        this.residentialPhotoImageSrc = this.filePath + "/" + newstr;        
      }
      this.residentialCertificate = "";

      if (this.studentData.affidavit !== null && this.studentData.affidavit.length > 0) {
        var str = this.studentData.affidavit;
        var ext = str.split('.').pop();
        if ((ext === 'pdf') || (ext === 'PDF')) {
          this.affidavitPdfShown = true;
        }else{
          this.affidavitPhotoImageShown = true;
        }
        var newstr = str.replace(".", "~");
        this.affidavitPhotoImageSrc = this.filePath + "/" + newstr;        
      }
      this.affidavit = "";

      if (this.studentData.incomeCertificate !== null && this.studentData.incomeCertificate.length > 0) {
        var str = this.studentData.incomeCertificate;
        var ext = str.split('.').pop();
        if ((ext === 'pdf') || (ext === 'PDF')) {
          this.incomePdfShown = true;
        }else{
          this.incomePhotoImageShown = true;
        }
        var newstr = str.replace(".", "~");
        this.incomePhotoImageSrc = this.filePath + "/" + newstr;
      }
      this.incomeCertificate = "";

      if (this.studentData.casteCertificate !== null && this.studentData.casteCertificate.length > 0) {
        var str = this.studentData.casteCertificate;
        var ext = str.split('.').pop();
        if ((ext === 'pdf') || (ext === 'PDF')) {
          this.casteCertificatePdfShown = true;
        }else{
          this.casteCertificatePhotoImageShown = true;
        }
        var newstr = str.replace(".", "~");
        this.casteCertificatePhotoImageSrc = this.filePath + "/" + newstr;
      }
      this.casteCertificate = "";

      this.guardianName = this.studentData.guardianName;
      this.guardianMobileNo = this.studentData.guardianMobileNo;
      this.guardianRelationship = this.studentData.guardianRelationship;

      this.encId = this.studentData.encId;

      this.initializeForm();
      let param = {
        schoolId: this.userProfile.school,
        classId: this.class,
        academicYear: this.academicYear,
      };
      this.getSection(param);
    });
  }

  getBank() {
    this.BankDetailsService.getBankName().subscribe((data: any = []) => {
      this.bankData = data?.data;
    });
  }


  getSchoolInfo() {
    this.spinner.show();
    this.commonService
      .getSchoolBasicInfo({
        encId: this.userProfile.school,
        academicYear: this.academicYear,
      })
      .subscribe((res: any = []) => {
        this.spinner.hide();
        this.schlInfo = res.data;
      });
  }


  loadAnnexturesData() {
    const anxTypes = [
      "GENDER",
      "LANGUAGE",
      "STD_FACILITY",
      "SPECIAL_TRAINING_TYPE",
      "CHILD_HOMELESS",
      "STREAM_TYPE",
      "STREAM_GROUP_TYPE",
      "MEDIUM_OF_INSTRUCTION",
      "BANK",
    ];
    // this.anxData = this.commonFunction.getAnnextureData(anxTypes);
    let annextureData!: [];
    this.commonService.getCommonAnnexture(anxTypes).subscribe({
      next: (res: any) => {
        annextureData = res?.data;
        this.stdGender = res?.data?.GENDER;
        this.languageList = res?.data?.LANGUAGE;
        this.facilityList = res?.data?.STD_FACILITY;
        this.specialTrainingList = res?.data?.SPECIAL_TRAINING_TYPE;
        this.homelessList = res?.data?.CHILD_HOMELESS;
        this.streamList = res?.data?.STREAM_TYPE;
        this.groupList = res?.data?.STREAM_GROUP_TYPE;
        this.mediumList = res?.data?.MEDIUM_OF_INSTRUCTION;
        this.bankList = res?.data?.BANK;
      },
    });
  }

  loadAnnexturesDataBySeq() {
    const anxTypes = [
      "SOCIAL_CATEGORY",
      "RELIGION",
      "DISABILITY_TYPE",
      "HOSTEL_FACILITY",
      "ACCOUNT_HOLDER_TYPE"

    ];
    // this.anxData = this.commonFunction.getAnnextureData(anxTypes);
    let annextureData!: [];
    this.commonService.getCommonAnnexture(anxTypes, true).subscribe({
      next: (res: any) => {
        //console.log(res?.data);
        annextureData = res?.data;
        this.socialCategoryList = res?.data?.SOCIAL_CATEGORY;
        this.religionList = res?.data?.RELIGION;
        this.hostleFacilityList = res?.data?.HOSTEL_FACILITY;
        this.disabilityTypeList = res?.data?.DISABILITY_TYPE;
        this.accHolderTypeList = res?.data?.ACCOUNT_HOLDER_TYPE;
      },
    });
  }


  getDistrict() {
    this.disrtictChanged = true;
    this.commonService.getAllDistrict().subscribe((res: any = []) => {
      this.districtList = res.data;
      this.disrtictChanged = false;
    });
  }

  getBlock(districtId: any) {
    this.blockChanged = true;
    this.districtId = districtId;
    this.blockList = [];
    this.blockId = null;
    this.clusterList = [];
    if (districtId !== "") {
      this.commonService
        .getBlockByDistrictid(districtId)
        .subscribe((res: any = []) => {
          this.blockList = res.data;
          this.blockChanged = false;
        });
    } else {
      this.blockChanged = false;
    }
  }

  getCluster(id: any) {
    this.clusterChanged = true;
    this.blockId = id;
    this.clusterList = [];
    this.clusterId = "";
    if (id !== "") {
      this.commonService.getClusterByBlockId(id).subscribe((res: any = []) => {
        this.clusterList = res.data;
        this.clusterChanged = false;
      });
    } else {
      this.clusterChanged = false;
    }
  }

  getSchool(clusterId: any) {
    //this.showSpinnerBlock = true;
    this.prevSchoolChanged = true;
    this.clusterId = clusterId;
    this.schoolList = [];
    let paramList: any = { clusterId: this.clusterId };
    if (clusterId !== "") {
      this.schoolService.getSchoolList(paramList).subscribe((res: any = []) => {
        this.schoolList = res.data;
        //this.showSpinnerBlock = false;
        this.prevSchoolChanged = false;
      });
    } else {
      this.prevSchoolChanged = false;
    }
  }

  getSchoolClasses(schoolEncId: string) {
    this.classChanged = true;
    if (schoolEncId !== "") {
      this.schoolService
        .getSchoolClasses(schoolEncId)
        .subscribe((res: any = []) => {
          this.classList = res.data;
          this.classChanged = false;
        });
    }
  }

  passedLastExamRdControl(val: any) {
    this.passedLastExam = val;
    this.studentForm.patchValue({ markSecuredLastExam: "" });
    this.studentForm.patchValue({ percentageLastExam: "" });
    this.studentForm.patchValue({ cls9To12Trade: "" });
  }

  classControlChange(val: any) {
    this.studentForm.patchValue({ section: "" });
    this.studentForm.patchValue({ stream: "" });
    this.studentForm.patchValue({ group: "" });
    this.class = val;
    if (this.class !== "") {
      let param = {
        schoolId: this.userProfile.school,
        classId: this.class,
        academicYear: this.academicYear,
      };
      this.getSection(param);
    }
  }

  streamControlChange(val: any) {
    this.stream = val;
    this.studentForm.patchValue({ group: "" });
  }

  getSection(param: any) {
    this.sectionChanged = true;
    this.section = "";
    this.schoolService.getSection(param).subscribe((res: any) => {
      this.sectionList = res.data?.sections;
      this.sectionChanged = false;
    });
  }

  // medicineRdControl(val: any) {
  //   this.gotMedicine = val;
  //   // this.studentForm.patchValue({ medicine: "" });
  //   this.studentForm.patchValue({ ironTablets: "0" });
  //   this.studentForm.patchValue({ dewormingTablets: "0" });
  //   this.studentForm.patchValue({ vitaminATablets: "0" });
  // }

  // Get Other Bank Details when bankid=12 for other Bank
  getBankChangeId(bankId: any) {
    this.bankName = bankId;
    this.studentForm.patchValue({
      otherBankName: "",
    });
  }

  compareDate() {
    let ad = this.studentForm.get("admissionDate")?.value;
    let dob = this.studentForm.get("dob")?.value;

    if (ad != "" && dob != "") {
      if (new Date(ad) <= new Date(dob)) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="admissionDate"]'
        );
        invalidControl.focus();
        this.alertHelper.viewAlertHtml(
          "error",
          "Invalid inputs",
          "Admission date should not be less than or equals to student date of birth."
        );
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  validateAddhar(cntlName: string) {
    if (this.studentForm.controls[cntlName].value != "") {
      const adharChk = this.customValidators.validate(
        this.studentForm.controls[cntlName].value
      );
      if (!adharChk) {
        this.alertHelper
          .viewAlertHtml(
            "error",
            "Invalid input",
            "Please provide a valid aadhaar number."
          )
          .then((res: any) => {
            const invalidControl = this.el.nativeElement.querySelector(
              '[formControlName="' + cntlName + '"]'
            );
            invalidControl.focus();
          });
        return;
      }else if(this.studentForm.controls['aadhaar'].value != ""  && this.studentForm.controls['parentAadharNo'].value != "" && this.studentForm.controls['aadhaar'].value == this.studentForm.controls['parentAadharNo'].value){
        this.alertHelper
          .viewAlertHtml(
            "error",
            "Invalid input",
            "Parent aadhar no. should not be same with the student aadhar no."
          )
          .then((res: any) => {
            const invalidControl = this.el.nativeElement.querySelector(
              '[formControlName="parentAadharNo"]'
            );
            invalidControl.focus();
            return;
          });
      }
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

      // validation logic for stream
      if (validationType === "stream" && parentValue >= 11) {
        conditionStatus = true;
      }
      // validation logic for group
      if (validationType === "group" && parentValue === 3) {
        conditionStatus = true;
      }
      // validation logic for Total Mark Secured
      if (
        validationType === "markSecuredLastExam" &&
        this.passedLastExam == 1
      ) {
        conditionStatus = true;
      }
      // validation logic for Mark Secured
      if (validationType === "percentageLastExam" && this.passedLastExam == 1) {
        conditionStatus = true;
      }
      // validation logic for cls9To12Trade
      if (validationType === "cls9To12Trade" && parentValue > 8) {
        conditionStatus = true;
      }
      // validation logic for Medicine
      // if (validationType === "medicine" && this.gotMedicine == 1) {
      //   conditionStatus = true;
      // }

      // validation logic for Other bank name
      if (validationType === "otherBankName" && this.bankName == 12) {
        conditionStatus = true;
      }

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
    this.studentForm = this.formBuilder.group({
      schoolId: [this.schoolId],
      academicYear: [this.academicYear, Validators.required],
      admissionType: [this.admissionType, Validators.required],
      class: [this.class, Validators.required],
      //stream:[this.stream],
      stream: [
        this.stream,
        [
          Validators.pattern(/^[0-9]+$/),
          this.conditionalValidator(
            () => this.studentForm?.get("class")?.value,
            Validators.required,
            "conditionalValidation",
            "stream"
          ),
        ],
      ],
      //group:[this.group],
      group: [
        this.group,
        [
          Validators.pattern(/^[0-9]+$/),
          this.conditionalValidator(
            () => this.studentForm?.get("stream")?.value,
            Validators.required,
            "conditionalValidation",
            "group"
          ),
        ],
      ],
      section: [this.section, Validators.required],
      admissionNo: [
        this.admissionNo,
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern("^[a-zA-Z0-9/-]*$"),
        ],
      ],
      medium: [this.medium, Validators.required],
      admissionDate: [this.admissionDate, Validators.required],
      freeEducation: [this.freeEducation, Validators.required],
      class1PrevStatus: [this.class1PrevStatus, Validators.required],

      aadhaar: [
        this.aadhaar,
        [Validators.minLength(12), Validators.pattern("^[0-9]*$")],
      ],
      studentName: [
        this.studentName,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z0-9 .]+$/),
          this.customValidators.firstCharValidatorRF,
        ],
      ],
      fatherName: [
        this.fatherName,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z0-9 .]+$/),
          this.customValidators.firstCharValidatorRF,
        ],
      ],
      motherName: [
        this.motherName,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z0-9 .]+$/),
          this.customValidators.firstCharValidatorRF,
        ],
      ],
      dob: [this.dob, Validators.required],
      gender: [this.gender, Validators.required],
      socialCategory: [this.socialCategory, Validators.required],
      religion: [this.religion, Validators.required],
      motherTongue: [this.motherTongue, Validators.required],
      habitation: [
        this.habitation,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z0-9., ]*$/),
          this.customValidators.firstCharValidatorRF,
        ],
      ],
      minority: [this.minority],
      disadvantagedGroup: [this.disadvantagedGroup],
      studentPhotoID: [this.studentPhotoID],
      disabilityType: [this.disabilityType],
      communicationAddress: [
        this.communicationAddress,
        [
          Validators.maxLength(300),
          Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/),
          this.customValidators.firstCharValidatorRF,
        ],
      ],
      permanentAddress: [
        this.permanentAddress,
        [
          Validators.maxLength(300),
          Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/),
          this.customValidators.firstCharValidatorRF,
        ],
      ],

      districtId: [this.districtId],
      blockId: [this.blockId],
      clusterId: [this.clusterId],
      prevSchoolId: [this.prevSchoolId],
      lastYearAttendance: [
        this.lastYearAttendance,
        [
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]+$/),
          this.customValidators.firstCharValidatorRF,
        ],
      ],
      passedLastExam: [this.passedLastExam],
      // markSecuredLastExam:[this.markSecuredLastExam,[Validators.maxLength(10),Validators.pattern(/^[0-9.]+$/),this.customValidators.firstCharValidatorRF]],
      //percentageLastExam:[this.percentageLastExam,[Validators.maxLength(5),Validators.pattern(/^[0-9.]+$/),this.customValidators.firstCharValidatorRF]],
      markSecuredLastExam: [
        this.markSecuredLastExam,
        [
          Validators.pattern(/^[0-9.]+$/),
          Validators.maxLength(10),
          this.conditionalValidator(
            () => this.studentForm?.get("passedLastExam")?.value,
            Validators.required,
            "conditionalValidation",
            "markSecuredLastExam"
          ),
        ],
      ],
      percentageLastExam: [
        this.percentageLastExam,
        [
          Validators.pattern(/^[0-9.]+$/),
          Validators.maxLength(3),
          Validators.min(0),
          Validators.max(100),
          this.conditionalValidator(
            () => this.studentForm?.get("passedLastExam")?.value,
            Validators.required,
            "conditionalValidation",
            "percentageLastExam"
          ),
        ],
      ],
      //cls9To12Trade:[this.cls9To12Trade,[Validators.maxLength(30),Validators.pattern(/^[a-zA-Z0-9 .]+$/),this.customValidators.firstCharValidatorRF]],

      cls9To12Trade: [
        this.cls9To12Trade,
        [
          this.customValidators.firstCharValidatorRF,
          Validators.pattern(/^[a-zA-Z0-9 .]+$/),
          Validators.maxLength(30),
          this.conditionalValidator(
            () => this.studentForm?.get("class")?.value,
            Validators.required,
            "conditionalValidation",
            "cls9To12Trade"
          ),
        ],
      ],

      // receivedDressSet: [this.receivedDressSet],
      // facilityId: [this.facilityId, Validators.required],
      // freeTextBook: [this.freeTextBook, Validators.required],
      // freeTransport: [this.freeTransport, Validators.required],
      // freeEscort: [this.freeEscort, Validators.required],
      // freeBicycle: [this.freeBicycle, Validators.required],
      // freeHostel: [this.freeHostel, Validators.required],
      // attendedSpecialTraining: [this.attendedSpecialTraining,Validators.required,],
      // homeless: [this.homeless, Validators.required],
      // gotMedicine: [this.gotMedicine, Validators.required], 
      // ironTablets: [this.ironTablets],
      // dewormingTablets: [this.dewormingTablets],
      // vitaminATablets: [this.vitaminATablets],
      //medicine:[this.medicine,[Validators.maxLength(50),Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/),this.customValidators.firstCharValidatorRF]],
      // medicine: [
      //   this.medicine,
      //   [
      //     Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/),
      //     Validators.maxLength(50),
      //     this.conditionalValidator(
      //       () => this.studentForm?.get("gotMedicine")?.value,
      //       Validators.required,
      //       "conditionalValidation",
      //       "medicine"
      //     ),
      //   ],
      // ],

      bankAccNo: [
        this.bankAccNo,
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(/^[0-9]*$/),
          this.customValidators.firstCharValidatorRF,
        ],
      ],
      accHolderName: [
        this.accHolderName,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z0-9 .]*$/),
          this.customValidators.firstCharValidatorRF,
        ],
      ],
      accHolderType: [this.accHolderType, Validators.required],
      bankName: [this.bankName, Validators.required],
      IFSC: [
        this.IFSC,
        [
          Validators.required,
          Validators.maxLength(11),
          Validators.pattern(/^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/),
          this.customValidators.firstCharValidatorRF,
        ],
      ],
      otherBankName: [
        this.otherBankName,
        [
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z ]*$/),
          this.customValidators.firstCharValidatorRF,
          this.conditionalValidator(
            () => this.studentForm?.get("bankName")?.value,
            Validators.required,
            "conditionalValidation",
            "otherBankName"
          ),
        ],
      ],

      mobile: [
        this.mobile,
        [
          Validators.pattern("^[0-9]*$"),
          Validators.min(1),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      email: [
        this.email,
        [
          Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/),
          Validators.maxLength(50),
        ],
      ],
      parentAadharNo: [
        this.parentAadharNo,
        [Validators.minLength(12), Validators.pattern("^[0-9]*$")],
      ],
      incomeLimit: [this.incomeLimit],
      incomeCertificate: [this.incomeCertificate],      casteCertificate: [this.casteCertificate],
      residentialCertificate: [this.residentialCertificate],
      affidavit: [this.affidavit],

      guardianName: [
        this.guardianName,
        [
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z0-9 .]+$/),
          this.customValidators.firstCharValidatorRF,
        ],
      ],
      guardianMobileNo: [
        this.guardianMobileNo,
        [
          Validators.pattern("^[0-9]*$"),
          Validators.min(1),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      guardianRelationship: [
        this.guardianRelationship,
        [
          Validators.maxLength(20),
          Validators.pattern(/^[a-zA-Z ]+$/),
          this.customValidators.firstCharValidatorRF,
        ],
      ],

      createdBy: [this.userProfile.userId],
      sessionValue: [this.userProfile],
      encId: [this.encId],
    });
  }

  setFormData() {
    this.formData.append("schoolId", this.studentForm.get("schoolId")?.value);
    this.formData.append("academicYear", this.studentForm.get("academicYear")?.value);
    this.formData.append("admissionType", this.studentForm.get("admissionType")?.value);
    this.formData.append("class", this.studentForm.get("class")?.value);
    this.formData.append("stream", this.studentForm.get("stream")?.value);
    this.formData.append("group", this.studentForm.get("group")?.value);
    this.formData.append("section", this.studentForm.get("section")?.value);
    this.formData.append("admissionNo", this.studentForm.get("admissionNo")?.value);
    this.formData.append("medium", this.studentForm.get("medium")?.value);
    this.formData.append("admissionDate", formatDate(this.studentForm.get("admissionDate")?.value, "yyyy-MM-dd", "en_US"));
    this.formData.append("freeEducation", this.studentForm.get("freeEducation")?.value);
    this.formData.append("class1PrevStatus", this.studentForm.get("class1PrevStatus")?.value);

    this.formData.append("aadhaar", this.studentForm.get("aadhaar")?.value);
    this.formData.append("studentName", this.studentForm.get("studentName")?.value);
    this.formData.append("fatherName", this.studentForm.get("fatherName")?.value);
    this.formData.append("motherName", this.studentForm.get("motherName")?.value);
    this.formData.append("dob", formatDate(this.studentForm.get("dob")?.value, "yyyy-MM-dd", "en_US"));
    this.formData.append("gender", this.studentForm.get("gender")?.value);
    this.formData.append("socialCategory", this.studentForm.get("socialCategory")?.value);
    this.formData.append("religion", this.studentForm.get("religion")?.value);
    this.formData.append("motherTongue", this.studentForm.get("motherTongue")?.value);
    this.formData.append("habitation", this.studentForm.get("habitation")?.value);
    this.formData.append("minority", this.studentForm.get("minority")?.value);
    this.formData.append("disadvantagedGroup", this.studentForm.get("disadvantagedGroup")?.value);

    // this.formData.append("studentPhotoID", this.studentForm.get("studentPhotoID")?.value);
    this.formData.append("studentPhotoID", this.studentPhotoID);

    this.formData.append("disabilityType", this.studentForm.get("disabilityType")?.value);
    this.formData.append("communicationAddress", this.studentForm.get("communicationAddress")?.value);
    this.formData.append("permanentAddress", this.studentForm.get("permanentAddress")?.value);

    this.formData.append("districtId", this.studentForm.get("districtId")?.value);
    this.formData.append("blockId", this.studentForm.get("blockId")?.value);
    this.formData.append("clusterId", this.studentForm.get("clusterId")?.value);
    this.formData.append("prevSchoolId", this.studentForm.get("prevSchoolId")?.value);
    this.formData.append("lastYearAttendance", this.studentForm.get("lastYearAttendance")?.value);
    this.formData.append("passedLastExam", this.studentForm.get("passedLastExam")?.value);
    this.formData.append("markSecuredLastExam", this.studentForm.get("markSecuredLastExam")?.value);
    this.formData.append("percentageLastExam", this.studentForm.get("percentageLastExam")?.value);
    this.formData.append("cls9To12Trade", this.studentForm.get("cls9To12Trade")?.value);

    // this.formData.append("receivedDressSet", this.studentForm.get("receivedDressSet")?.value);
    // this.formData.append("facilityId", this.studentForm.get("facilityId")?.value);
    // this.formData.append("freeTextBook", this.studentForm.get("freeTextBook")?.value);
    // this.formData.append("freeTransport", this.studentForm.get("freeTransport")?.value);
    // this.formData.append("freeEscort", this.studentForm.get("freeEscort")?.value);
    // this.formData.append("freeBicycle", this.studentForm.get("freeBicycle")?.value);
    // this.formData.append("freeHostel", this.studentForm.get("freeHostel")?.value);
    // this.formData.append("attendedSpecialTraining", this.studentForm.get("attendedSpecialTraining")?.value);
    // this.formData.append("homeless", this.studentForm.get("homeless")?.value);
    // this.formData.append("gotMedicine", this.studentForm.get("gotMedicine")?.value);
    // this.formData.append("ironTablets", this.studentForm.get("ironTablets")?.value);
    // this.formData.append("dewormingTablets", this.studentForm.get("dewormingTablets")?.value);
    // this.formData.append("vitaminATablets", this.studentForm.get("vitaminATablets")?.value);

    this.formData.append("bankAccNo", this.studentForm.get("bankAccNo")?.value);
    this.formData.append("accHolderName", this.studentForm.get("accHolderName")?.value);
    this.formData.append("accHolderType", this.studentForm.get("accHolderType")?.value);
    this.formData.append("bankName", this.studentForm.get("bankName")?.value);
    this.formData.append("otherBankName", this.studentForm.get("otherBankName")?.value);

    this.formData.append("IFSC", this.studentForm.get("IFSC")?.value);

    this.formData.append("mobile", this.studentForm.get("mobile")?.value);
    this.formData.append("email", this.studentForm.get("email")?.value);

    // this.formData.append("residentialCertificate", this.studentForm.get("residentialCertificate")?.value);
    // this.formData.append("affidavit", this.studentForm.get("affidavit")?.value);

    this.formData.append("residentialCertificate", this.residentialCertificate);
    this.formData.append("affidavit", this.affidavit);

    this.formData.append("parentAadharNo", this.studentForm.get("parentAadharNo")?.value);

    // this.formData.append("incomeCertificate", this.studentForm.get("incomeCertificate")?.value);
    this.formData.append("incomeCertificate", this.incomeCertificate);
    this.formData.append("casteCertificate", this.casteCertificate);

    this.formData.append("incomeLimit", this.studentForm.get("incomeLimit")?.value);

    this.formData.append("guardianName", this.studentForm.get("guardianName")?.value);
    this.formData.append("guardianMobileNo", this.studentForm.get("guardianMobileNo")?.value);
    this.formData.append("guardianRelationship", this.studentForm.get("guardianRelationship")?.value);
    this.formData.append("createdBy", this.studentForm.get("createdBy")?.value);
    this.formData.append("sessionValue", this.studentForm.get("sessionValue")?.value);
    this.formData.append("encId", this.studentForm.get("encId")?.value);

    this.submitFormData();
  }

  validateForm() {
    // for (const key of Object.keys(this.studentForm.controls)) {
    //   if (this.studentForm.controls[key].status === "INVALID") {
    //     const invalidControl = this.el.nativeElement.querySelector(
    //       '[formControlName="' + key + '"]'
    //     );
    //     invalidControl.focus();
    //     this.customValidators.formValidationHandler(this.studentForm,this.allLabel);
    //     //this.customValidators.customFormValidationHandler(this.studentForm);
    //     break;
    //   }
    // }
    if (this.studentForm.invalid) {
      const validationStatus = this.customValidators.formValidationHandler(
        this.studentForm,
        this.allLabel,
        this.el
      );
      return validationStatus;
    } else {
      return false;
    }
    // const validationStatus = this.customValidators.formValidationHandler(this.studentForm,this.allLabel);
    // return validationStatus;
  }

  submitFormData() {
    this.studentService.updateStudent(this.formData).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == 200) {
          this.alertHelper
            .successAlert("Saved!", res?.msg, "success")
            .then((res: any) => {
              this.router.navigate(["../../"], {
                relativeTo: this.activatedRoute,
              });
            });
        } else {
          this.alertHelper.viewAlert(
            "error",
            "Invalid",
            "Something went wrong."
          );
        }
      },
      error: (error: any) => {
        this.spinner.hide(); //==== hide spinner
        this.errorHandler.serverSideErrorHandler(error); // server side error handler
      },
    });
  }

  onSubmit() {
    const afterFormValidObserver = new Observable((observer) => {
      observer.next(this.validateForm());
    });
    afterFormValidObserver.subscribe({
      next: (isValid: any) => {
        if (isValid === false && this.compareDate()) {
          this.alertHelper.updateAlert().then((result: any) => {
            if (result.value) {
              this.spinner.show();
              this.setFormData();
            }
          });
        }
      },
    });
  }

  fileUploadHandler(event: any, controlName: string) {
    const uploadedFile = event.target.files[0];
    if (uploadedFile != null) {
      if (controlName == "studentPhotoID") {
        if (
          uploadedFile.type != "image/png" &&
          uploadedFile.type != "image/jpg" &&
          uploadedFile.type != "image/jpeg"
        ) {
          event.target.value = "";
          this.resetFileControls(controlName);
          this.studentForm.patchValue({ question: "" });
          this.alertHelper.viewAlertHtml(
            "error",
            "Error",
            '<i class="bi bi-arrow-right text-danger"></i> File type should be png, jpg or jpeg file'
          );
          return;
        }
      } else {
        if (
          uploadedFile.type != "image/png" &&
          uploadedFile.type != "image/jpg" &&
          uploadedFile.type != "image/jpeg" &&
          uploadedFile.type != "application/pdf"
        ) {
          event.target.value = "";
          this.resetFileControls(controlName);
          this.studentForm.patchValue({ question: "" });
          this.alertHelper.viewAlertHtml(
            "error",
            "Error",
            '<i class="bi bi-arrow-right text-danger"></i> File type should be pdf, png, jpg or jpeg file'
          );
          return;
        }
      }
      // Max 2MB allowed
      if (uploadedFile.size >= 1024 * (1024 * 2)) {
        event.target.value = "";
        this.resetFileControls(controlName);
        this.alertHelper.viewAlertHtml(
          "error",
          "Error",
          '<i class="bi bi-arrow-right text-danger"></i> File size should not be greater than 2MB'
        );
        return;
      }

      this.setFileControlsVal(controlName, uploadedFile);

      // const reader = new FileReader();
      // if (event.target.files && event.target.files.length) {
      //   const [file] = event.target.files;
      //   reader.readAsDataURL(file);
      //   reader.onload = () => {
      //     this.setFileControls(reader.result, controlName, uploadedFile);
      //   };
      // }
    }
  }

  // Set and patch file fields
  setFileControlsVal(controlName: string, uploadedFile: any) {
    switch (controlName) {
      case "studentPhotoID":
        this.studentPhotoID = uploadedFile;
        break;
      case "residentialCertificate":
        this.residentialCertificate = uploadedFile;
        break;
      case "affidavit":
        this.affidavit = uploadedFile;
        break;
      case "incomeCertificate":
        this.incomeCertificate = uploadedFile;
        break;
      case "casteCertificate":
        this.casteCertificate = uploadedFile;
      break;
      default:
        break;
    }
  }

  // Set and patch file fields
  setFileControls(file: any, controlName: string, uploadedFile: any) {
    switch (controlName) {
      case "studentPhotoID":
        this.formData.append("studentPhotoID", uploadedFile);
        this.studentForm.patchValue({ studentPhotoID: file });
        break;
      case "residentialCertificate":
        this.formData.append("residentialCertificate", uploadedFile);
        this.studentForm.patchValue({ residentialCertificate: file });
        break;
      case "affidavit":
        this.formData.append("affidavit", uploadedFile);
        this.studentForm.patchValue({ affidavit: file });
        break;
      case "incomeCertificate":
        this.formData.append("incomeCertificate", uploadedFile);
        this.studentForm.patchValue({ incomeCertificate: file });
        break;
      case "casteCertificate":
        this.formData.append("casteCertificate", uploadedFile);
        this.studentForm.patchValue({ casteCertificate: file });
        break;
      default:
        break;
    }
  }

  resetFileControls(controlName: string) {
    switch (controlName) {
      case "studentPhotoID":
        this.studentForm.patchValue({ studentPhotoID: "" });
        break;
      case "residentialCertificate":
        this.studentForm.patchValue({ residentialCertificate: "" });
        break;
      case "affidavit":
        this.studentForm.patchValue({ affidavit: "" });
        break;
      case "incomeCertificate":
        this.studentForm.patchValue({ incomeCertificate: "" });
        break;
      case "casteCertificate":
        this.studentForm.patchValue({ casteCertificate: "" });
        break;
      default:
        break;
    }
  }

  toggle() {
    this.show = !this.show;
    if (this.show) this.buttonName = "Hide";
    else this.buttonName = "Show";
  }

  onReset() {
    [
      "studentPhotoID",
      "residentialCertificate",
      "affidavit",
      "incomeCertificate",
      'casteCertificate',
    ].map((item) => this.resetFileControls(item));
    this.initializeForm();
  }


  sameAddressChecked(event: any){
    if(event.target.checked){
      this.studentForm.patchValue({ permanentAddress: this.studentForm.controls['communicationAddress'].value });
    }else{
      this.studentForm.patchValue({ permanentAddress: "" });
    }
  }

  changeAdrress() {
    if(this.studentForm.controls['communicationAddress'].value === this.studentForm.controls['permanentAddress'].value){    
      this.checkAdd = true;
    }else{
      this.checkAdd = false;
    }
  }

  getMediumOfInstruction() {
    this.mediumChanged = true;
    this.mediumOfInstruction
      .getmediumOfInstruction(this.schoolId)
      .subscribe((res: any) => {
        this.mediumOfInstructions = res?.data;
        this.mediumChanged = false;
      });
  }

  readURL(event: any, param: any): void {
    if (param == 'studentPhotoID') {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = e => {
          this.studentPhotoImageSrc = reader.result,
            this.studentPhotoImageShown = true
        };

        reader.readAsDataURL(file);
      }
    }
    if (param == 'residentialPhoto') {
      var ext = event.target.value.split('.').pop();
      if ((ext === 'pdf') || (ext === 'PDF')) {
        this.residentialPdfShown = true;
        this.residentialPhotoImageShown = false;
      }
      if ((ext === 'jpg') || (ext === 'JPG') || (ext === 'jpeg') || (ext === 'JPEG') || (ext === 'png') || (ext === 'PNG')) {
        this.residentialPhotoImageShown = true;
        this.residentialPdfShown = false;
        if (event.target.files && event.target.files[0]) {
          const file = event.target.files[0];
  
          const reader = new FileReader();
          reader.onload = e => { this.residentialPhotoImageSrc = reader.result };
  
          reader.readAsDataURL(file);
        }
      }
    }
    if (param == 'affidavitPhoto') {
      var ext = event.target.value.split('.').pop();
      if ((ext === 'pdf') || (ext === 'PDF')) {
        this.affidavitPdfShown = true;
        this.affidavitPhotoImageShown = false;
      }
      if ((ext === 'jpg') || (ext === 'JPG') || (ext === 'jpeg') || (ext === 'JPEG') || (ext === 'png') || (ext === 'PNG')) {
        this.affidavitPhotoImageShown = true;
        this.affidavitPdfShown = false;
        
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = e => { this.affidavitPhotoImageSrc = reader.result };

        reader.readAsDataURL(file);
      }
      }
    }
    if (param == 'incomePhoto') {
      var ext = event.target.value.split('.').pop();
      if ((ext === 'pdf') || (ext === 'PDF')) {
        this.incomePdfShown = true;
        this.incomePhotoImageShown = false;
      }
      if ((ext === 'jpg') || (ext === 'JPG') || (ext === 'jpeg') || (ext === 'JPEG') || (ext === 'png') || (ext === 'PNG')) {
        this.incomePhotoImageShown = true;
        this.incomePdfShown = false;
        
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = e => { this.incomePhotoImageSrc = reader.result };

        reader.readAsDataURL(file);
      }
      }
    }

    if (param == 'casteCertificatePhoto') {
      var ext = event.target.value.split('.').pop();
      if ((ext === 'pdf') || (ext === 'PDF')) {
        this.casteCertificatePdfShown = true;
        this.casteCertificatePhotoImageShown = false;

      }
      if ((ext === 'jpg') || (ext === 'JPG') || (ext === 'jpeg') || (ext === 'JPEG') || (ext === 'png') || (ext === 'PNG')) {
        this.casteCertificatePhotoImageShown = true;
        this.casteCertificatePdfShown = false;

        if (event.target.files && event.target.files[0]) {
          const file = event.target.files[0];

          const reader = new FileReader();
          reader.onload = e => { this.casteCertificatePhotoImageSrc = reader.result };

          reader.readAsDataURL(file);
        }
      }

    }

  }

  removeFile(param: any) {
    if (param == 'studentPhotoID') {
      this.studentPhotoImageShown = false;
      this.studentPhotoImageSrc = "";
      this.studentPhoto.nativeElement.value = "";
    }
    if (param == 'residentialPhoto') {
      this.residentialPhotoImageShown = false;
      this.residentialPhotoImageSrc = "";
      this.residentialPhoto.nativeElement.value = "";
      this.residentialPdfShown = false;
    }
    if (param == 'affidavitPhoto') {
      this.affidavitPhotoImageShown = false;
      this.affidavitPhotoImageSrc = "";
      this.affidavitPhoto.nativeElement.value = "";
      this.affidavitPdfShown = false;
    }
    if (param == 'incomePhoto') {
      this.incomePhotoImageShown = false;
      this.incomePhotoImageSrc = "";
      this.incomePhoto.nativeElement.value = "";
      this.incomePdfShown = false;
    }
    if (param == 'casteCertificate') {
      this.casteCertificatePhotoImageShown = false;
      this.casteCertificatePhotoImageSrc = "";
      this.casteCertificate.nativeElement.value = "";
      this.casteCertificatePdfShown = false;
    }
  }
}
