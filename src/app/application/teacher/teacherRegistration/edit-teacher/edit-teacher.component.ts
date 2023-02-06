import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Constant } from "src/app/shared/constants/constant";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { RegistrationService } from "../../services/registration.service";
import { Router, ActivatedRoute } from "@angular/router";
import { formatDate } from "@angular/common";
import { Subscription } from "rxjs";
import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { environment } from "src/environments/environment";
@Component({
  selector: "app-edit-teacher",
  templateUrl: "./edit-teacher.component.html",
  styleUrls: ["./edit-teacher.component.css"],
})
export class EditTeacherComponent implements OnInit {
  public fileUrl = environment.filePath;
  @ViewChild("teacherImage")
  teacherProfileImage!: ElementRef;
  teacherForm!: FormGroup;
  allErrorMessages: string[] = [];
  submitted = false;
  allLabel: string[] = [
    "Prefix",
    "First name",
    "Middle name",
    "Last name",
    "Gender",
    "Date of birth",
    "Social category",
    "Religion",
    "Mobile number",
    "Aadhaar number",
    "Nature of appointment",
    "Type of teacher",
    "",    
    "Date of joining in service",
    "Appointed subject",
    "District of first joining",
    "District",
    "Block",
    "Cluster",
    "School",
    "Appointment for level",
    "Appointing authority",
    "Date of joining of the current school",
    "Cfms code",
    "Pan number",
    "Father name",
    "Mother name",
    "Marital status",
    // "Teacher Image",
    "",
    "",
    "Email id",
    "",
    "Appointment category",
    //change
    "Wheather disable ",
    //change end
    "",
    "",
    // "",
    //change
    "Wheather awarded ",
    "",
    //change end
    "Permanent house number/name",
    "Permanent street/mohalla/sector",
    "",
    "",
    "",
    "Permanent panchayat/post office",
    "Permanent village/area/town",
    "Permanent pin code",
    "Current house number/name",
    "Current street/mohalla/sector",
    "",
    "",
    "",
    "Current panchayat/post office",
    "Current village/area/town",
    "Current pin code",
    "Permanent district ",
    "Permanent block",
    "Current district",
    "Current block",
  ];
  isVisible: any;
  isSelected: boolean = true;
  optionVal: any;
  optionstream: any;
  config = new Constant();
  genders = this.config.genderList;
  religions = this.config.religionList;
  socialCatagories = this.config.socialCatagoryList;
  maritialStatuses = this.config.maritalList;
  bloodGroups = this.config.bloodGroupList;
  districts: any = "";
  districtData: any = "";
  showSpinnerBlock: boolean = false;
  blockData: any = "";
  clusterData: any = "";
  permanentBlockData: any = "";
  currentBlockData: any = "";
  stateOthers: any = "";
  cstateOthers: any = "";

  scDisrtictChanged: boolean = false;
  scBlockChanged: boolean = false;
  scClusterChanged: boolean = false;
  pBlockChanged: boolean = false;
  cBlockChanged: boolean = false;
  scSchoolChanged: boolean = false;
  teacherTitles: any = "";
  teacherTitleChanged: boolean = false;
  teacherGenderChanged: boolean = false;
  teacherGender: any = "";
  teacherGenders: any = "";
  teacherCategoryChanged: boolean = false;
  teacherCategory: any = "";
  teacherCategories: any = "";
  teacherReligionChanged: boolean = false;
  teacherReligion: any = "";
  teacherBldgrpChanged: boolean = false;
  teacherBldGrp: any = "";
  teacherRecCasteChanged: boolean = false;
  teacherRecCaste: any = "";
  teacherMaritialChanged: boolean = false;
  teacherMaritial: any = "";
  teacherAppointmentChanged: boolean = false;
  teacherAppointSubjectChanged: boolean = false;
  appointType: boolean = false;
  appointingAuthority: boolean = false;
  disabilityView: boolean = false;
  teacherImageChange: boolean = false;
  appointmentTypeData: any = "";
  teacherAppointSubject: any = "";
  teacherAppointment: any = "";
  teacherTitleData: any = "";
  appointingAuthData: any = "";
  disabilityTypeData: any = "";
  scSchool: any = "";
  schoolDatas: any = "";
  getSchoolData: any = "";
  fileToUploadTeacher: any = "";
  imageUrlTeacher: any = "";
  isimageUrlTeacher: boolean = false;
  teacherData: any;
  teacherTitleChangedAgain: boolean = false;
  //changes
  teacherT: any;
  maritalStatusval: boolean = false;
  val: any;
  disableVal: any = "";
  awardVal: any;
  //changes end

  //form fields
  encId: string = "";
  //changes
  prefix: any = "";
  teacherPrefix: any = "";
  firstName: any = "";
  middleName: any = "";
  lastName: any = "";
  //changes end
  teacherName: any = "";
  gender: any = "";
  DOB: any = "";
  socialCategory: any = "";
  religion: any = "";
  mobile: any = "";
  aadhaarNo: any = "";
  teacherTitle: any = "";
  //changes
  blockTeacherType: any;
  //changes end
  natureOfAppointmt: any = "";
  serviceJoiningDt: any = "";
  appointedSubject: any = "";
  scDistrictId: any = "";
  scBlockId: any = "";
  scClusterId: any = "";
  schoolId: any = "";
  appointmentType: any = "";
  appointingAuth: any = "";
  joiningCurrentSchoolDt: any = "";
  CFMScode: any = "";
  panNo: any = "";
  fatherName: any = "";
  motherName: any = "";
  maritalStatus: any = "";
  //changes
  spouseName: any = "";
  maritalStatusData: any;
  //changes end
  teacherImage: any = "";
  teacherEmail: any = "";
  bloodGroup: any = "";
  casteRecruitmt: any = "";
  //changes
  teacherDisabilityStatus: boolean = false;
  disabilityStatus: any = "";
  //changes end
  disability: any = "";
  disabilityPer: any = "";
  //changes
  teacherAwardStatus: any = "";
  typeOfAward: any = "";
  teacherAward: any = "";
  teacherAwardType: boolean = false;
  awardStatus: any = "";
  //changes end
  pHouseName: any = "";
  pStreet: any = "";
  pState: any = "1";
  pDistrictId: any = "";
  pBlockId: any = "";
  pPanchayat: any = "";
  pVillage: any = "";
  pPIN: any = "";
  cHouseName: any = "";
  cStreet: any = "";
  cState: any = "1";
  cDistrictId: any = "";
  cBlockId: any = "";
  cPanchayat: any = "";
  cVillage: any = "";
  cPIN: any = "";
  pDistrictOther: any = "";
  pBlockOther: any = "";
  cDistrictOther: any = "";
  cBlockOther: any = "";
  blockCode: any = "";
  fileSource: any = "";
  udiseCode: any = "";
  isimageUrlTeacherDb: boolean = false;
  showAge: any = "";
  markAsPresent: any = "";
  userProfile: any = [];
  updatedBy: any = "";
  currAdd: boolean = false;
  cfmsAppointValue: any = "";
  isShown: boolean = false;
  disabilityType: any = "";
  touchCntl: any = "";
  blockTeacherTypeOptions: any = [];
  sikhayak: boolean = false;
  blockTeacherTitleType: any = "";
  // typeShown:boolean= false;
  maxDate: any = Date;
  dobSubscription!: any;
  serviceJoining!: any;
  joiningService!: any;
  joiningCurrentSchool!: any;
  serviceJoiningDtSubscription!: Subscription;
  jfDistrictCode:any="";
  plPrivilege: string = "view"; //For menu privilege
  adminPrivilege: boolean = false;
  searchDistrictData: any = [];
  searchBlockData: any = [];
  teacherTitleList:any="";
  public userdetails = this.commonService.getUserProfile();
  loginUserType = this.userdetails.loginUserTypeId;
  userDesignation = this.userdetails.designationId;
  editableCoulmns:boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private commonService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private registrationService: RegistrationService,
    private spinner: NgxSpinnerService,
    private alertHelper: AlertHelper,
    private el: ElementRef,
    private route: Router,
    private router: ActivatedRoute,
    private commonFunctionHelper: CommonFunctionHelper
  ) {
    this.maxDate = new Date();
    const pageUrl: any = this.route.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization
  }

  ngOnInit(): void {
    if (this.plPrivilege == 'admin') {
      this.adminPrivilege = true;
    }
    this.userProfile = this.commonService.getUserProfile();
    this.encId = this.router.snapshot.params["encId"];
    this.initializeForm();
    this.editTeacher(this.encId);
    this.getAnnextureData();
    this.loadAnnextureDataBySeq();
    this.getDistrict();
    // this.getAppointSubject();
    this.onChangeOfDates();
    // this.getPrefix();
    this.el.nativeElement.querySelector("[formControlName=prefix]").focus();
  }
  //changes
  onChangeOfDates() {
    // alert(1);
    this.dobSubscription = this.teacherForm
      ?.get("DOB")
      ?.valueChanges.subscribe((value: any) => {
        this.teacherAgeCalculate(
          value,
          this.teacherForm.getRawValue()?.serviceJoiningDt
        );
      });
    this.serviceJoining = this.teacherForm
      ?.get("serviceJoiningDt")
      ?.valueChanges.subscribe((value: any) => {
        this.teacherAgeCalculate(this.teacherForm.getRawValue()?.DOB, value);
      });
    this.joiningService = this.teacherForm
      ?.get("joiningServiceDate")
      ?.valueChanges.subscribe((value: any) => {
        this.joiningServiceDate(
          this.teacherForm.getRawValue()?.DOB,
          this.teacherForm.getRawValue()?.serviceJoiningDt,
          value
        );
      });
    this.joiningCurrentSchool = this.teacherForm
      ?.get("joiningCurrentSchoolDt")
      ?.valueChanges.subscribe((value: any) => {
        this.joiningCurrentSchDate(
          this.teacherForm.getRawValue()?.DOB,
          this.teacherForm.getRawValue()?.serviceJoiningDt,
          value
        );
      });
  }
  get teacherFormControl() {
    return this.teacherForm.controls;
  }
  //changes end

  initializeForm() {
    this.teacherForm = this.formBuilder.group({
      //changes

      prefix: [this.prefix, [Validators.required]],
      firstName: [
        this.firstName,
        [Validators.required, Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9 .]*$/), this.customValidators.firstCharValidatorRF],
      ],
      middleName: [this.middleName, [Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9 .]*$/), this.customValidators.firstCharValidatorRF]],
      lastName: [
        this.lastName,
        [Validators.required, Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9 .]*$/), this.customValidators.firstCharValidatorRF],
      ],
      //changes end
      // teacherName: [
      //   this.teacherName,
      //   [Validators.required, Validators.maxLength(90)],
      // ],
      gender: [{ value: this.gender, disabled: this.editableCoulmns }, Validators.required],
      DOB: [this.DOB, Validators.required],
      socialCategory: [this.socialCategory, Validators.required],
      religion: [this.religion, Validators.required],
      mobile: [
        this.mobile,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.pattern(/^[6-9]{1}[0-9]{9}$/),
          this.customValidators.firstCharValidatorRF
        ],
      ],
      aadhaarNo: [
        this.aadhaarNo,
        [
          Validators.required,
          Validators.minLength(12),
          Validators.pattern("^[0-9]*$"),
          this.customValidators.firstCharValidatorRF
        ],
      ],
      natureOfAppointmt: [this.natureOfAppointmt, Validators.required],
      teacherTitle: [this.teacherTitle, Validators.required],
      //change
      blockTeacherType: [this.blockTeacherType],
      //changes end
      
      serviceJoiningDt: [{ value: this.serviceJoiningDt, disabled: this.editableCoulmns }, Validators.required],
      appointedSubject: [this.appointedSubject, Validators.required],
      jfDistrictCode: [{ value: this.jfDistrictCode, disabled: this.editableCoulmns }, Validators.required],
      scDistrictId: [this.scDistrictId, Validators.required],
      scBlockId: [this.scBlockId, Validators.required],
      scClusterId: [this.scClusterId, Validators.required],
      schoolId: [this.schoolId, Validators.required],
      appointmentType: [this.appointmentType, Validators.required],
      appointingAuth: [this.appointingAuth, Validators.required],
      joiningCurrentSchoolDt: [
        this.joiningCurrentSchoolDt,
        Validators.required,
      ],
      CFMScode: [this.CFMScode],
      panNo: [
        this.panNo,
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern("[A-Z]{5}[0-9]{4}[A-Z]{1}"),
          this.customValidators.firstCharValidatorRF
        ],
      ],
      fatherName: [
        this.fatherName,
        [
          Validators.required,
          Validators.maxLength(90),
          Validators.pattern(/^[a-zA-Z0-9 .]*$/),
          this.customValidators.firstCharValidatorRF
        ],
      ],
      motherName: [
        this.motherName,
        [
          Validators.required,
          Validators.maxLength(90),
          Validators.pattern(/^[a-zA-Z0-9 .]*$/),
          this.customValidators.firstCharValidatorRF
        ],
      ],
      maritalStatus: [this.maritalStatus, Validators.required],
      //changes
      spouseName: [this.spouseName, [Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9 .]*$/), this.customValidators.firstCharValidatorRF]],
      //changes
      teacherImage: [this.teacherImage], //Validators.required
      teacherEmail: [
        this.teacherEmail,
        [
          Validators.required,
          Validators.maxLength(40),
          Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/),
          this.customValidators.firstCharValidatorRF
        ],
      ],
      bloodGroup: [this.bloodGroup],
      casteRecruitmt: [this.casteRecruitmt, Validators.required],
      //changes
      disabilityStatus: [this.disabilityStatus, [Validators.required]],
      //changes end
      disability: [this.disability],
      disabilityPer: [
        this.disabilityPer,
        [Validators.maxLength(3), Validators.pattern(/^[0-9]*$/), this.customValidators.firstCharValidatorRF],
      ],
      //changes
      awardStatus: [this.awardStatus, [Validators.required]],
      typeOfAward: [this.typeOfAward],
      //changes end
      pHouseName: [
        this.pHouseName,
        [Validators.maxLength(190), Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/), this.customValidators.firstCharValidatorRF],
      ],
      pStreet: [
        this.pStreet,
        [Validators.maxLength(190), Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/), this.customValidators.firstCharValidatorRF],
      ],
      pState: [this.pState],
      pDistrictId: [this.pDistrictId],
      pBlockId: [this.pBlockId],
      pPanchayat: [
        this.pPanchayat,
        [Validators.maxLength(190), Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/), this.customValidators.firstCharValidatorRF],
      ],
      pVillage: [
        this.pVillage,
        [Validators.maxLength(190), Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/), this.customValidators.firstCharValidatorRF],
      ],
      pPIN: [
        this.pPIN,
        [Validators.maxLength(6), Validators.pattern("^[0-9]*$")],
      ],
      cHouseName: [
        this.cHouseName,
        [Validators.maxLength(190), Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/), this.customValidators.firstCharValidatorRF],
      ],
      cStreet: [
        this.cStreet,
        [Validators.maxLength(190), Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/), this.customValidators.firstCharValidatorRF],
      ],
      cState: [this.cState],
      cDistrictId: [this.cDistrictId],
      cBlockId: [this.cBlockId],
      cPanchayat: [
        this.cPanchayat,
        [Validators.maxLength(190), Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/), this.customValidators.firstCharValidatorRF],
      ],
      cVillage: [
        this.cVillage,
        [Validators.maxLength(190), Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/), this.customValidators.firstCharValidatorRF],
      ],
      cPIN: [
        this.cPIN,
        [Validators.maxLength(6), Validators.pattern("^[0-9]*$"), this.customValidators.firstCharValidatorRF],
      ],
      pDistrictOther: [
        this.pDistrictOther,
        [Validators.maxLength(40), Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/), this.customValidators.firstCharValidatorRF],
      ],
      pBlockOther: [
        this.pBlockOther,
        [Validators.maxLength(40), Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/), this.customValidators.firstCharValidatorRF],
      ],
      blockCode: [this.blockCode],
      fileSource: [""],
      encId: [this.encId],
      markAsPresent: [this.markAsPresent],
      cDistrictOther: [
        this.cDistrictOther,
        [Validators.maxLength(40), Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/), this.customValidators.firstCharValidatorRF],
      ],
      cBlockOther: [
        this.cBlockOther,
        [Validators.maxLength(40), Validators.pattern(/^[a-zA-Z0-9.,-/ ]*$/), this.customValidators.firstCharValidatorRF],
      ],
      updatedBy: [this.userProfile.userId],
      touchCntl: [""],
    });
  }
  getAnnextureData() {
    this.commonService
      .getCommonAnnexture([
        "GENDER",
        //"TEACHER_SOCIAL_CATEGORY",
        //"RELIGION",
        "BLOODGRP",
       // "TEACHER_SOCIAL_CATEGORY",
        "MARITIAL_STATUS",
        //"TEACHER_TITLE",
        // "NATURE_OF_APPOINTMENT",
        "APPOINTMENT_TYPE",
        "APPOINTING_AUTHORITY",
        "DISABILITY",
        "BLOCK_TEACHER_TYPE",
        "PREFIX",
        "AWARDTYPE",
      ])
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          // this.teacherAppointment = res?.data?.NATURE_OF_APPOINTMENT;
          this.teacherGender = res?.data?.GENDER;
          //this.teacherCategory = res?.data?.TEACHER_SOCIAL_CATEGORY;
         // this.teacherReligion = res?.data?.RELIGION;
         // this.teacherTitleData = res?.data?.TEACHER_TITLE;
         // this.teacherAppointment = res?.data?.NATURE_OF_APPOINTMENT;
          this.appointmentTypeData = res?.data?.APPOINTMENT_TYPE;
          this.appointingAuthData = res?.data?.APPOINTING_AUTHORITY;
          this.teacherMaritial = res?.data?.MARITIAL_STATUS;
          this.teacherBldGrp = res?.data?.BLOODGRP;
         // this.teacherRecCaste = res?.data?.TEACHER_SOCIAL_CATEGORY;
          this.disabilityType = res?.data?.DISABILITY;
          this.teacherPrefix = res?.data?.PREFIX;
          this.blockTeacherTitleType = res?.data?.BLOCK_TEACHER_TYPE;
          this.teacherAward = res?.data?.AWARDTYPE;
          this.disabilityView = false;
        },

      });
  }
   loadAnnextureDataBySeq() {
   const anxtType =  [      
      "TEACHER_SOCIAL_CATEGORY",
      "RELIGION",      
      "TEACHER_SOCIAL_CATEGORY",     
      "TEACHER_TITLE",   
      "NATURE_OF_APPOINTMENT",   
      "APPOINTED_SUBJECT",      
    ]
    this.commonService
      .getCommonAnnexture(anxtType,true)
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();      
          this.teacherAppointment = res?.data?.NATURE_OF_APPOINTMENT;     
          this.teacherCategory = res?.data?.TEACHER_SOCIAL_CATEGORY;
         this.teacherReligion = res?.data?.RELIGION;
         this.teacherTitleList = res?.data?.TEACHER_TITLE;      
         this.teacherAppointSubject = res?.data?.APPOINTED_SUBJECT;        
          this.teacherRecCaste = res?.data?.TEACHER_SOCIAL_CATEGORY;
          this.teacherAppointSubject = res?.data?.APPOINTED_SUBJECT;
        },
      });
  }

  getDistrict() {   
    this.spinner.show();
    this.scDisrtictChanged = true;
    this.commonService.getAllDistrict().subscribe((res: []) => {
      this.districtData = res;
      this.districtData = this.districtData.data;
      
      if (this.userProfile.district != 0 || this.userProfile.district != "") {
        this.searchDistrictData = this.districtData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        this.teacherForm.controls['scDistrictId'].patchValue(this.userProfile.district);
        this.getBlock(this.userProfile.district);
      }
      else {
        this.searchDistrictData = this.districtData;
        // this.scDisrtictSelect = true;
      }

      this.scBlockId = '';
      
      this.scDisrtictChanged = false;
      this.spinner.hide();
    });
  }
  getBlock(districtId: any) {
    // this.spinner.show();
    // this.showSpinnerBlock = true;
    // this.scBlockChanged = true;
    // const districtId = id;
    // this.blockData = [];
    // if (districtId !== "") {
    //   this.commonService
    //     .getBlockByDistrictid(districtId)
    //     .subscribe((res: any) => {
    //       let data: any = res;
    //       for (let key of Object.keys(data["data"])) {
    //         this.blockData.push(data["data"][key]);
    //       }
    //       this.showSpinnerBlock = false;
    //       this.scBlockChanged = false;
    //       this.spinner.hide();
    //     });
    // } else {
    //   this.scBlockChanged = false;
    // }
   

      this.scBlockChanged = false;
      this.scBlockChanged = true;
  
      this.searchBlockData = [];
      this.teacherForm.controls['scBlockId'].patchValue('');
  
      this.clusterData = [];
      this.teacherForm.controls['scClusterId'].patchValue('');
  
      // this.getSchoolData = [];    
      // this.teacherForm.controls['searchSchoolId'].patchValue('');
  
      if (districtId !== '') {
        this.commonService.getBlockByDistrictid(districtId).subscribe((res: any) => {
          this.searchBlockData = res;
          this.searchBlockData = this.searchBlockData.data;
  
          if (this.userProfile.block != 0 || this.userProfile.block != "") {
            this.searchBlockData = this.searchBlockData.filter((blo: any) => {
              return blo.blockId == this.userProfile.block;
            });
            this.teacherForm.controls['scBlockId'].patchValue(this.userProfile.block);
            this.getCluster(this.userProfile.block);
          }
          else {
            this.scBlockChanged = true;
          }
          this.scBlockChanged = false;
        });
      } else {
        this.scBlockChanged = true;
        this.scBlockChanged = false;
      }
  
  }
  getPermanentBlock(id: any) {
    this.spinner.show();
    this.showSpinnerBlock = true;
    this.pBlockChanged = true;
    const districtId = id;
    this.permanentBlockData = [];
    if (districtId !== "") {
      this.commonService
        .getBlockByDistrictid(districtId)
        .subscribe((res: any) => {
          let data: any = res;
          for (let key of Object.keys(data["data"])) {
            this.permanentBlockData.push(data["data"][key]);
          }
          this.showSpinnerBlock = false;
          this.pBlockChanged = false;
          this.spinner.hide();
        });
    }
  }
  getCurrentBlock(id: any) {
    this.spinner.show();
    this.showSpinnerBlock = true;
    this.cBlockChanged = true;
    const districtId = id;
    this.currentBlockData = [];
    if (districtId !== "") {
      this.commonService
        .getBlockByDistrictid(districtId)
        .subscribe((res: any) => {
          let data: any = res;
          for (let key of Object.keys(data["data"])) {
            this.currentBlockData.push(data["data"][key]);
          }
          this.showSpinnerBlock = false;
          this.cBlockChanged = false;
          this.spinner.hide();
        });
    } else {
      this.cBlockChanged = false;
    }
  }
  getCluster(blockId: any) {
    // this.spinner.show();
    // this.showSpinnerBlock = true;
    // this.scClusterChanged = true;
    // const blockId = id;
    // this.clusterData = [];
    // if (blockId !== "") {
    //   this.commonService.getClusterByBlockId(blockId).subscribe((res: any) => {
    //     let data: any = res;
    //     for (let key of Object.keys(data["data"])) {
    //       this.clusterData.push(data["data"][key]);
    //     }
    //     this.showSpinnerBlock = false;
    //     this.scClusterChanged = false;
    //     this.spinner.hide();
    //   });
    // } else {
    //   this.scClusterChanged = false;
    // }
    this.scClusterChanged = false;
    this.scClusterChanged = true;

    this.clusterData = [];
    this.teacherForm.controls['scClusterId'].patchValue('');

    this.getSchoolData = [];
    this.teacherForm.controls['schoolId'].patchValue('');

    if (blockId !== '') {
      this.commonService.getClusterByBlockId(blockId).subscribe((res: any) => {
        this.clusterData = res;
        this.clusterData = this.clusterData.data;

        if (this.userProfile.cluster != 0 || this.userProfile.cluster != "") {
          this.clusterData = this.clusterData.filter((clu: any) => {
            return clu.clusterId == this.userProfile.cluster;
          });
          this.teacherForm.controls['scClusterId'].patchValue(this.userProfile.cluster);
          this.getSchool(this.userProfile.cluster);
        }
        else {
          this.scClusterChanged = true;
        }
        this.scClusterChanged = false;
      });
    } else {
      this.scClusterChanged = true;
      this.scClusterChanged = false;
    }
  }
  getAppointSubject() {
    this.spinner.show();
    this.teacherAppointSubjectChanged = true;
    this.teacherAppointSubject = [];
    this.registrationService.getAppointSubject().subscribe((res: any) => {
      let data: any = res;
      for (let key of Object.keys(data["data"])) {
       // this.teacherAppointSubject.push(data["data"][key]);
      }
      this.teacherAppointSubjectChanged = false;
      this.spinner.hide();
    });
  }

  getSchool(clusterId: any) {
    // this.spinner.show();
    // this.showSpinnerBlock = true;
    // this.scSchoolChanged = true;
    // const clusterId = post;
    // this.getSchoolData = [];
    // if (clusterId !== "") {
    //   this.registrationService.getSchool(post).subscribe((res: any) => {
    //     let data: any = res;
    //     for (let key of Object.keys(data["data"])) {
    //       this.getSchoolData.push(data["data"][key]);
    //     }
    //     this.showSpinnerBlock = false;
    //     this.scSchoolChanged = false;
    //     this.spinner.hide();
    //   });
    // } else {
    //   this.scSchoolChanged = false;
    // }
    this.scSchoolChanged = false;
    this.scSchoolChanged = true;

    this.getSchoolData = [];
    this.teacherForm.controls['schoolId'].patchValue('');

    if (clusterId !== '') {
      this.commonService.getSchoolList(clusterId).subscribe((res: any) => {
        this.getSchoolData = res;
        this.getSchoolData = this.getSchoolData.data;

        if (this.userProfile.udiseCode != 0 || this.userProfile.udiseCode != "") {
          this.getSchoolData = this.getSchoolData.filter((sch: any) => {
            return sch.schoolUdiseCode == this.userProfile.udiseCode;
          });
          this.teacherForm.controls['schoolId'].patchValue(this.getSchoolData[0].schoolId);
        }
        else {
          this.scSchoolChanged = true;
        }
        this.scSchoolChanged = false;
      });
    } else {
      this.scSchoolChanged = true;
      this.scSchoolChanged = false;
    }
  }
  handleFileInputTeacher(e: any) {
    let file = e.target.files;
    this.teacherImageChange = true;
    if (this.teacherImageChange == true) {
      this.teacherForm.controls["teacherImage"].setValidators([
        Validators.nullValidator,
        // this.customValidators.requiredFileType(["jpg", "png", "jpeg"]),
        // this.customValidators.fileSizeValidator(file, 300),
      ]);
      this.teacherForm.controls["teacherImage"].updateValueAndValidity();
    }

    var ext = file[0]?.name.substring(file[0].name.lastIndexOf(".") + 1);

    if (ext == "jpg" || ext == "png" || ext == "jpeg" || ext == "gfif" || ext == "JPG" || ext == "PNG" || ext == "JPEG" || ext == "GFIF") {
      const fileSize = file[0].size;
      const fileSizeInKB = Math.round(fileSize / 1024);
      if (fileSizeInKB > 300) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Upload image must be 300kb"
        );

        return;
      } else {
        this.fileToUploadTeacher = file.item(0);
        //Show image preview
        let reader = new FileReader();
        reader.onload = (event: any) => {
          this.imageUrlTeacher = event.target.result;
          this.teacherForm.patchValue({
            fileSource: this.imageUrlTeacher,
          });
        };
        reader.readAsDataURL(this.fileToUploadTeacher);
        this.isimageUrlTeacher = true;
        this.isimageUrlTeacherDb = false;
      }
    } else {
      this.alertHelper.viewAlert("error", "Invalid", "Inavlid file format");
      this.imageUrlTeacher = "";
      this.fileToUploadTeacher = Blob;
      this.isimageUrlTeacher = false;
    }
  }

  removeTeacherImage() {
    this.imageUrlTeacher = "";
    this.fileToUploadTeacher = Blob;
    this.isimageUrlTeacher = false;
    this.teacherForm.patchValue({
      imageUrlTeacher: '',
      teacherImage: '',
      fileSource: ''
    });
    this.teacherProfileImage.nativeElement.value = "";
  }

  editTeacher(encId: string) {
    this.spinner.show();
    this.registrationService.getTeacher(encId).subscribe((res: any) => {
      this.teacherData = res.data[0];
      //changes
      this.prefix = this.teacherData.prefix;
      this.firstName = this.teacherData.firstName;
      this.middleName = this.teacherData.middleName;
      this.lastName = this.teacherData.lastName;
      //changes end
      // this.teacherName = this.teacherData.teacherName;
      this.gender = this.teacherData.gender;
      this.DOB = (this.teacherData.DOB) ? new Date(this.teacherData.DOB.toString()):'';
      this.socialCategory = this.teacherData.socialCategory;
      this.religion = this.teacherData.religion;
      this.mobile = this.teacherData.mobile;
      this.aadhaarNo = this.teacherData.aadhaarNo;
      this.teacherTitle = this.teacherData.teacherTitle;
      //changes
      this.blockTeacherType = this.teacherData.blockTeacherType;
      //changes end
      this.natureOfAppointmt = this.teacherData.natureOfAppointmt;
      this.serviceJoiningDt = new Date(this.teacherData.serviceJoiningDt.toString());
      this.appointedSubject = this.teacherData.appointedSubject;
      this.jfDistrictCode = this.teacherData.jfDistrictCode;
      this.scDistrictId = this.teacherData.scDistrictId;
      this.scBlockId = this.teacherData.scBlockId;
      this.scClusterId = this.teacherData.scClusterId;
      this.schoolId = this.teacherData.schoolId;
      this.appointmentType = this.teacherData.appointmentType;
      this.appointingAuth = this.teacherData.appointingAuth;
      this.joiningCurrentSchoolDt = new Date(this.teacherData.joiningCurrentSchoolDt.toString());
      this.CFMScode = this.teacherData.CFMScode;
      this.panNo = this.teacherData.panNo;
      this.fatherName = this.teacherData.fatherName;
      this.motherName = this.teacherData.motherName;
      this.maritalStatus = this.teacherData.maritalStatus;
      //changes
      this.spouseName = this.teacherData.spouseName;
      //changes end
      this.udiseCode = res.udiseCode;
      this.blockCode = res.blockCode;

      if (
        this.teacherData.teacherImage !== "" &&
        this.teacherData["teacherImage"] !== null
      ) {
        this.isimageUrlTeacher = true;
        var str = this.teacherData.teacherImage;
        var newstr = str.replace(".", "~");
        this.imageUrlTeacher = this.fileUrl+"/" + newstr;
        this.teacherImage = this.teacherData.teacherImage;
        this.isimageUrlTeacherDb = true;
      }
      // this.teacherImage = this.teacherData.teacherImage ;
      this.teacherEmail = this.teacherData.teacherEmail;
      this.bloodGroup = this.teacherData.bloodGroup;
      this.casteRecruitmt = this.teacherData.casteRecruitmt;
      //changes
      this.disabilityStatus = this.teacherData.disabilityStatus;
      //changes end
      this.disability = this.teacherData.disability;
      this.disabilityPer = this.teacherData.disabilityPer;
      //changes
      this.awardStatus = this.teacherData.awardStatus;
      this.typeOfAward = this.teacherData.awardType;
      //changes end
      this.pHouseName = this.teacherData.pHouseName;
      this.pStreet = this.teacherData.pStreet;
      this.pState = this.teacherData.pState;
      this.pDistrictId = this.teacherData.pDistrictId;
      this.pBlockId = this.teacherData.pBlockId;
      this.pPanchayat = this.teacherData.pPanchayat;
      this.pVillage = this.teacherData.pVillage;
      this.pPIN = this.teacherData.pPIN;
      this.cHouseName = this.teacherData.cHouseName;
      this.cStreet = this.teacherData.cStreet;
      this.cState = this.teacherData.cState;
      this.cDistrictId = this.teacherData.cDistrictId;
      this.cBlockId = this.teacherData.cBlockId;
      this.cPanchayat = this.teacherData.cPanchayat;
      this.cVillage = this.teacherData.cVillage;
      this.cPIN = this.teacherData.cPIN;
      this.pDistrictOther = this.teacherData.pDistrictOther;
      this.pBlockOther = this.teacherData.pBlockOther;
      this.blockCode = this.teacherData.blockCode;
      this.fileSource = this.teacherData.fileSource;
      this.markAsPresent = this.teacherData.markAsPresent;
      this.encId = this.teacherData.encId;
      this.editableCoulmns = (this.teacherData.changeRequestStatus === 2) ? true : false;
      console.log(this.editableCoulmns);
      
      this.getBlock(this.scDistrictId);
      this.getCluster(this.scBlockId);
      this.getPermanentBlock(this.pDistrictId);
      this.getCurrentBlock(this.cDistrictId);

      // this.getTeacherAppointment();
      this.getSchool(this.scClusterId);

      // this.getTeacherTitle();
      // this.getAppointSubject();
      // this.getAppointType();
      // this.getAppointingAuthority();
      // this.getDisability();


      this.cfmsCheck(this.natureOfAppointmt);
      //changes
      setTimeout(() => {
        this.teacherTitleChange(this.teacherTitle);
        this.maritalStatusChange(this.maritalStatus);
        this.teacherTypeFtch(this.natureOfAppointmt);
      }, 1500);

      this.wheatherDisable(this.disabilityStatus);
      this.wheatherAward(this.awardStatus);
      //changes end
      this.initializeForm();

      this.spinner.hide();
    });
  }

  getFormValue(allValue: any) {
    console.log();
    
    // DOB
    // serviceJoiningDt
    // joiningCurrentSchoolDt


    return {

      ...allValue,
      DOB: this.commonFunctionHelper.formatDateHelper(
        allValue?.DOB
      ),
      serviceJoiningDt: this.commonFunctionHelper.formatDateHelper(
        allValue?.serviceJoiningDt
      ),
      joiningCurrentSchoolDt: this.commonFunctionHelper.formatDateHelper(
        allValue?.joiningCurrentSchoolDt
      ),
    };
  }
  onSubmit() {

    this.submitted = true;
    let arrCntrl = [];
    for (const key of Object.keys(this.teacherForm.controls)) {
      if (this.teacherForm.controls[key].touched === true) {
        arrCntrl.push(key);
      }
    }
    this.teacherForm.patchValue({
      touchCntl: arrCntrl,
    });

    //changes

    //this.customValidators.formValidationHandler(this.teacherForm, this.allLabel);
    if (
      this.teacherForm.get("teacherTitle")?.value == "16" ||
      this.teacherForm.get("teacherTitle")?.value == "17"
    ) {
      if (this.teacherForm.controls["blockTeacherType"]?.value == "") {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="blockTeacherType"]'
        );
        invalidControl.focus();
        this.alertHelper.successAlert(
          "Invalid",
          "Block Teacher Type required",
          "error"
        );
        return;
      }
    }
    if (this.teacherForm.get("disabilityStatus")?.value == "1") {
      if (this.teacherForm.controls["disability"]?.value == "") {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="disability"]'
        );
        invalidControl.focus();
        this.alertHelper.successAlert(
          "Invalid",
          "Disability required",
          "error"
        );
        return;
      }
      if (this.teacherForm.controls["disabilityPer"]?.value == "") {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="disabilityPer"]'
        );
        invalidControl.focus();
        this.alertHelper.successAlert(
          "Invalid",
          "Disability Percentage required",
          "error"
        );
        return;
      }
    }
    if (this.teacherForm.get("awardStatus")?.value == "1") {
      if (this.teacherForm.controls["typeOfAward"]?.value == "") {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="typeOfAward"]'
        );
        invalidControl.focus();
        this.alertHelper.successAlert(
          "Invalid",
          "Type Of Award required",
          "error"
        );
        return;
      }
    }
    if (this.teacherForm.get("maritalStatus")?.value == "2") {
      if (this.teacherForm.controls["spouseName"]?.value == "") {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="spouseName"]'
        );
        invalidControl.focus();
        this.alertHelper.successAlert(
          "Invalid",
          "Spouse Name required",
          "error"
        );
        return;
      }
    }

    //changes end

    if ("INVALID" === this.teacherForm.status) {
      for (const key of Object.keys(this.teacherForm.controls)) {
        if (this.teacherForm.controls[key].status === "INVALID") {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + key + '"]'
          );
          invalidControl.focus();
          this.customValidators.formValidationHandler(
            this.teacherForm,
            this.allLabel
          );
          break;
        }
      }
    }
    if (this.teacherForm.invalid) {
      return;
    }
    if (this.teacherForm.valid === true) {
      const adharChk = this.customValidators.validate(
        this.teacherForm.controls["aadhaarNo"].value
      );
      if (!adharChk) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Please provide a valid aadhaar number."
        );
        return;
      }
      // const teacherTit = this.teacherForm.value.teacherTitle;
      // const teacherSch = this.teacherForm.value.schoolId;
      // this.registrationService
      //   .headMasterCheck(teacherTit, teacherSch)
      //   .subscribe({
      //     next: (res: any) => {
      //       if (res.data > 0) {
      //         this.alertHelper.viewAlert(
      //           "error",
      //           "Invalid",
      //           "Head master/college principle already present"
      //         );
      //         return;
      //       }
      //     },
      //   });
      this.alertHelper.updateAlert().then((result: any) => {
        if (result.value) {
          const allValue = this.teacherForm.getRawValue();
          this.spinner.show(); // ==== show spinner

          this.registrationService
            .teacherUpdate(this.getFormValue(allValue))
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Teacher profile updated successfully.",
                    "success"
                  )
                  .then(() => {
                    // this.teacherForm.reset();
                    // this.teacherProfileImage.nativeElement.value = "";
                    // this.initializeForm();
                    // this.removeTeacherImage();
                    this.route.navigate(["../../viewTeacher"], {
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

            });
        }
      });
    }
  }

  pStateControl(value: any) {
    this.pState = value;
  }
  cStateControl(value: any) {
    this.cState = value;
  }
  disabilityPercent(value: any) {
    if (value != "") {
      const disabilityPercent = value;
      if (disabilityPercent > 100) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "% of disability can not be greater than 100"
        );
        this.teacherForm.patchValue({
          disabilityPer: "",
        });
        return;
      }
    }
  }
  teacherAddressCheck(event: any) {
    if (event.target.checked) {
      this.currAdd = true;
      let houseName = this.teacherForm.controls["pHouseName"]?.value;
      let street = this.teacherForm.controls["pStreet"]?.value;
      let state = this.teacherForm.controls["pState"]?.value;
      let districtId = this.teacherForm.controls["pDistrictId"]?.value;
      let blockId = this.teacherForm.controls["pBlockId"]?.value;
      let panchayat = this.teacherForm.controls["pPanchayat"]?.value;
      let village = this.teacherForm.controls["pVillage"]?.value;
      let pin = this.teacherForm.controls["pPIN"]?.value;
      let districtOther = this.teacherForm.controls["pDistrictOther"]?.value;
      let blockOther = this.teacherForm.controls["pBlockOther"]?.value;
      if (state == "2") {
        this.cState = state;
      } else {
        this.cState = state;
      }
      this.teacherForm.patchValue({
        cHouseName: houseName,
        cStreet: street,
        cState: state,
        cDistrictId: districtId,
        cBlockId: blockId,
        cPanchayat: panchayat,
        cVillage: village,
        cPIN: pin,
        cDistrictOther: districtOther,
        cBlockOther: blockOther,
        markAsPresent: "1",
      });
    } else {
      this.teacherForm.patchValue({
        cHouseName: "",
        cStreet: "",
        cState: this.cState,
        cDistrictId: "",
        cBlockId: "",
        cPanchayat: "",
        cVillage: "",
        cPIN: "",
        cDistrictOther: "",
        cBlockOther: "",
        markAsPresent: "0",
      });
    }
  }
  nameCheckFather(value: any) {
    let fName = this.teacherForm.controls["fatherName"]?.value;
    let mName = this.teacherForm.controls["motherName"]?.value;
    if (value != "") {
      if (fName === value) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Father name and Mother name can not be same"
        );
        this.teacherForm.patchValue({
          motherName: "",
        });
        return;
      }
    }
  }
  teacherAgeCalculate(teacherAge: any, joiningDate: any) {
    // let teacherAge = this.teacherForm.controls["DOB"].value;
    // let joiningDate = this.teacherForm.controls["serviceJoiningDt"].value;
    if (joiningDate != "" && teacherAge != "") {
      let year = new Date(teacherAge).getFullYear();
      let month = new Date(teacherAge).getMonth();
      let day = new Date(teacherAge).getDate();
      let jDate = formatDate(
        new Date(year + 18, month, day),
        "yyyy-MM-dd",
        "en_US"
      );
      if (
        formatDate(jDate, "yyyy-MM-dd", "en_US") >
        formatDate(joiningDate, "yyyy-MM-dd", "en_US")
      ) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Date of joining in service must be above 18 years"
        );
        this.teacherForm.patchValue({
          serviceJoiningDt: "",
        });
      }
      const newDate = new Date();
      if (
        formatDate(joiningDate, "yyyy-MM-dd", "en_US") >
        formatDate(newDate, "yyyy-MM-dd", "en_US")
      ) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Date of joining in service must not be above today's date"
        );
        this.teacherForm.patchValue({
          serviceJoiningDt: "",
        });
      }
    }
    if (teacherAge && teacherAge != "") {
      const convertAge = new Date(teacherAge);
      const timeDiff = Math.abs(Date.now() - convertAge.getTime());
      this.showAge = Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
      let year = new Date().getFullYear();
      let month = new Date().getMonth();
      let day = new Date().getDate();
      if (
        formatDate(new Date(year - 80, month, day), "yyyy-MM-dd", "en_US") >
        formatDate(teacherAge, "yyyy-MM-dd", "en_US")
      ) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Age Should not be more than 80 year"
        );
        this.teacherForm.patchValue({
          DOB: "",
        });
      }
      const newDate = new Date();
      if (
        formatDate(teacherAge, "yyyy-MM-dd", "en_US") >
        formatDate(newDate, "yyyy-MM-dd", "en_US")
      ) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Date of birth  must not be above today's date"
        );
        this.teacherForm.patchValue({
          DOB: "",
        });
      }
      if (this.showAge < 18) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Age should not be below 18 year"
        );
        this.teacherForm.patchValue({
          DOB: "",
        });
      }
    }
  }
  joiningServiceDate(teacherAge: any,
    joiningDate: any,
    joiningCurrentSchoolDate: any) {
    // let teacherAge = this.teacherForm.controls["DOB"].value;
    // let joiningDate = this.teacherForm.controls["serviceJoiningDt"].value;
    // let joiningCurrentSchoolDate =
    //   this.teacherForm.controls["joiningCurrentSchoolDt"].value;

    if (joiningDate != "" && joiningCurrentSchoolDate != "") {
      if (
        formatDate(joiningCurrentSchoolDate, "yyyy-MM-dd", "en_US") <
        formatDate(joiningDate, "yyyy-MM-dd", "en_US")
      ) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Date of Joining of the Current school should not be greater than Date of joining in service"
        );
        this.teacherForm.patchValue({
          joiningCurrentSchoolDt: "",
        });
      }
    }
    if (teacherAge != "" && joiningCurrentSchoolDate != "") {
      if (
        formatDate(joiningCurrentSchoolDate, "yyyy-MM-dd", "en_US") <
        formatDate(teacherAge, "yyyy-MM-dd", "en_US")
      ) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Date of Joining of the Current school should not be less than Date of joining in service"
        );
        this.teacherForm.patchValue({
          joiningCurrentSchoolDt: "",
        });
      }
    }
    if (teacherAge != "" && joiningDate != "") {
      let year = new Date(teacherAge).getFullYear();
      let month = new Date(teacherAge).getMonth();
      let day = new Date(teacherAge).getDate();
      let jDate = formatDate(
        new Date(year + 18, month, day),
        "yyyy-MM-dd",
        "en_US"
      );
      if (
        formatDate(jDate, "yyyy-MM-dd", "en_US") >
        formatDate(joiningDate, "yyyy-MM-dd", "en_US")
      ) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Date of joining in service must be above 18 years"
        );
        this.teacherForm.patchValue({
          serviceJoiningDt: "",
        });
      }
      const newDate = new Date();
      if (
        formatDate(joiningDate, "yyyy-MM-dd", "en_US") >
        formatDate(newDate, "yyyy-MM-dd", "en_US")
      ) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Date of joining in service must not be above today's date"
        );
        this.teacherForm.patchValue({
          serviceJoiningDt: "",
        });
      }
    }
  }
  joiningCurrentSchDate(teacherAge: any,
    joiningDate: any,
    joiningCurrentSchoolDate: any) {
    // let joiningDate = this.teacherForm.controls["serviceJoiningDt"].value;
    // let joiningCurrentSchoolDate =
    //   this.teacherForm.controls["joiningCurrentSchoolDt"].value;
    // let teacherAge = this.teacherForm.controls["DOB"].value;
    if (
      joiningDate != "" &&
      joiningCurrentSchoolDate != "" &&
      teacherAge != ""
    ) {
      if (
        formatDate(joiningCurrentSchoolDate, "yyyy-MM-dd", "en_US") <
        formatDate(joiningDate, "yyyy-MM-dd", "en_US")
      ) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Date of Joining of the Current school should not be less than Date of joining in service"
        );
        this.teacherForm.patchValue({
          joiningCurrentSchoolDt: "",
        });
      }
      if (
        formatDate(joiningCurrentSchoolDate, "yyyy-MM-dd", "en_US") <
        formatDate(teacherAge, "yyyy-MM-dd", "en_US")
      ) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Date of Joining of the Current school should not be less than Date of joining in service"
        );
        this.teacherForm.patchValue({
          joiningCurrentSchoolDt: "",
        });
      }
    }
  }
  changeAdrress() {
    this.currAdd = false;
    this.markAsPresent = 0;
    this.teacherForm.patchValue({
      markAsPresent: "0",
    });
  }
  cfmsCheck(id: any) {
    this.cfmsAppointValue = id;
    // this.teacherForm.patchValue({CFMScode:''});
    if (this.cfmsAppointValue == 2 || this.cfmsAppointValue == 5) {
      //changes
      this.teacherForm.controls["CFMScode"]?.patchValue(this.CFMScode);
      //changes end
      this.isShown = true;
      this.teacherForm.controls["CFMScode"]?.setValidators([
        Validators.required,
        Validators.maxLength(40),
        Validators.pattern(/^[a-zA-Z0-9 ]*$/),
      ]);
      this.teacherForm.controls["CFMScode"]?.updateValueAndValidity();
    } else {
      //changes
      this.teacherForm.controls["CFMScode"]?.patchValue("");
      //changes end
      this.isShown = false;
      this.teacherForm.controls["CFMScode"]?.setValidators([
        Validators.nullValidator,
      ]);
      this.teacherForm.controls["CFMScode"]?.updateValueAndValidity();
    }
  }

  //changes
  teacherTitleChange(data: any) {
    // if (data != "") {
    if (data == 16 || data == 17) {
      this.blockTeacherTypeOptions = [];
      this.blockTeacherTitleType.forEach((key: any, val: any) => {
        if (data == 16) {
          if (this.blockTeacherType == 3 || this.blockTeacherType == 4) {
            this.teacherForm.controls["blockTeacherType"]?.patchValue("");
          } else {
            this.teacherForm.controls["blockTeacherType"]?.patchValue(
              this.blockTeacherType
            );
          }
          if (key.anxtValue == 1 || key.anxtValue == 2) {
            this.blockTeacherTypeOptions?.push(key);
          }
        } else if (data == 17) {
          if (this.blockTeacherType == 1 || this.blockTeacherType == 2) {
            this.teacherForm.controls["blockTeacherType"]?.patchValue("");
          } else {
            this.teacherForm.controls["blockTeacherType"]?.patchValue(
              this.blockTeacherType
            );
          }
          if (key.anxtValue == 3 || key.anxtValue == 4) {
            this.blockTeacherTypeOptions?.push(key);
          }
        }
      });
      this.sikhayak = true;
      this.teacherT = data;
    } else {
      this.teacherForm.controls["blockTeacherType"]?.patchValue("");
      this.sikhayak = false;
    }
    // }
  }

  maritalStatusChange(data: any) {
    if (data == 2) {
      this.teacherForm.controls["spouseName"]?.patchValue(this.spouseName);
      this.maritalStatusData = data;
      this.maritalStatus = true;
    } else {
      this.teacherForm.controls["spouseName"]?.patchValue("");
      this.maritalStatus = false;
    }
  }

  wheatherDisable(data: any) {
    if (data == 1) {
      // this.disableVal = data;
      this.teacherForm.controls["disability"]?.patchValue(this.disability);
      this.teacherForm.controls["disabilityPer"]?.patchValue(this.disabilityPer);
      this.teacherDisabilityStatus = true;
    } else {
      this.teacherForm.controls["disability"]?.patchValue("");
      this.teacherForm.controls["disabilityPer"]?.patchValue("");
      this.teacherDisabilityStatus = false;
    }
  }

  wheatherAward(data: any) {
    if (data == 1) {
      this.teacherForm.controls["typeOfAward"]?.patchValue(this.typeOfAward);
      this.awardVal = data;
      this.teacherAwardType = true;
    } else {
      this.teacherForm.controls["typeOfAward"]?.patchValue("");
      this.teacherAwardType = false;
    }
  }
  ngOnDestroy() {
    this.dobSubscription?.unsubscribe();
    this.serviceJoining?.unsubscribe();
    this.joiningService?.unsubscribe();
    this.joiningCurrentSchool?.unsubscribe();
  }
  //changes end
  teacherTypeFtch(data: any){ 
    this.teacherTitleData = this.teacherTitleList.filter((dis: any) => {         
      return dis.parentValue == data;       
     });    
     this.teacherForm.controls["teacherTitle"]?.patchValue(this.teacherTitle); 
    }
}
