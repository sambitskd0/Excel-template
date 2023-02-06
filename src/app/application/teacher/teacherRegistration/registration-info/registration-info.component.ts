import { ThisReceiver } from "@angular/compiler";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { Constant } from "src/app/shared/constants/constant";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { environment } from "src/environments/environment";
import { RegistrationService } from "../../services/registration.service";
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: "app-registration-info",
  templateUrl: "./registration-info.component.html",
  styleUrls: ["./registration-info.component.css"],
})
export class RegistrationInfoComponent implements OnInit {
  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;
  public fileUrl = environment.filePath;
  encId: any = "";
  teacherData: any = "";
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

  //changes
  prefix:any = "";
  firstName:any = "";
  middleName:any = "";
  lastName:any = "";
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
  teacherTitleId: any = "";
  blockTeacherType:any = "";
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
  maritalStatusId:any = "";
  spouseName:any = "";
  //changes end
  teacherImage: any = "";
  teacherEmail: any = "";
  bloodGroup: any = "";
  casteRecruitmt: any = "";
  //changes
  disabilityStatus:any = "";
  //changes end
  disability: any = "";
  disabilityPer: any = "";
  //changes
  awardStatus:any = "";
  awardType:any = "";
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
  showMask: boolean = false;
  maskMobilePan: boolean = false;
  draftStatus: boolean = false;
  jfDistrictCode:any="";
  public userProfile = JSON.parse(
    sessionStorage.getItem("userProfile") || "{}"
  );
  loginUserType = this.userProfile.loginUserTypeId;
  userDesignation = this.userProfile.designationId;
  constructor(
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private commonService: CommonserviceService,
    private registrationService: RegistrationService,
    private spinner: NgxSpinnerService,
    private alertHelper: AlertHelper,
    private el: ElementRef,
    private route: Router,
    private router: ActivatedRoute
  ) {
    this.encId = this.router.snapshot.params["id"];
  }

  ngOnInit(): void {
    this.registrationInfo(this.encId);
    this.getTeacherDetails();
  }
  registrationInfo(encId: any) {
    this.spinner.show();
    this.registrationService.registrationInfo(encId).subscribe((res: any) => {
      this.teacherData = res.data;
      this.registrationService.setTeacherDetails(this.teacherData); // set teacher data for cross component sharing :: sambit
      //changes
      this.prefix = this.teacherData.prefix;
      this.firstName = this.teacherData.firstName;
      this.middleName = this.teacherData.middleName;
      this.lastName = this.teacherData.lastName;
      //changes end
      this.teacherName = this.teacherData.teacherName;
      this.gender = this.teacherData.gender;
      this.DOB = this.teacherData.DOB;
      this.socialCategory = this.teacherData.socialCategory;
      this.religion = this.teacherData.religion;
      this.mobile = this.teacherData.mobile;
      this.aadhaarNo = this.teacherData.aadhaarNo;
      this.teacherTitle = this.teacherData.teacherTitle;
      //changes
      this.teacherTitleId = this.teacherData.teacherTitleId;
      this.blockTeacherType = this.teacherData.blockTeacherType;
      //changes end
      this.natureOfAppointmt = this.teacherData.natureOfAppointmt;
      this.serviceJoiningDt = this.teacherData.serviceJoiningDt;
      this.appointedSubject = this.teacherData.appointedSubject;
      this.jfDistrictCode = this.teacherData.jfDistrictCode;
      this.scDistrictId = this.teacherData.scDistrictId;
      this.scBlockId = this.teacherData.scBlockId;
      this.scClusterId = this.teacherData.scClusterId;
      this.schoolId = this.teacherData.schoolId;
      this.appointmentType = this.teacherData.appointmentType;
      this.appointingAuth = this.teacherData.appointingAuth;
      this.joiningCurrentSchoolDt = this.teacherData.joiningCurrentSchoolDt;
      this.CFMScode = this.teacherData.CFMScode;
      this.panNo = this.teacherData.panNo;
      this.fatherName = this.teacherData.fatherName;
      this.motherName = this.teacherData.motherName;
      this.maritalStatus = this.teacherData.maritalStatus;
      //changes
      this.maritalStatusId = this.teacherData.maritalStatusId;
      this.spouseName = this.teacherData.spouseName;
      //changes end
      this.udiseCode = res.udiseCode;
      this.blockCode = res.blockCode;
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
      this.awardType = this.teacherData.awardType;
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
      this.showMask = true;
      this.maskMobilePan = true;      
      if (
        this.teacherData.teacherImage !== "" &&
        this.teacherData["teacherImage"] !== null
        
      ) {
        
        this.isimageUrlTeacher = true;
        var str = this.teacherData.teacherImage;
        var newstr = str.replace(".", "~");
        this.imageUrlTeacher = this.fileUrl + "/" + newstr;
       
        this.teacherImage = this.teacherData.teacherImage;
        this.isimageUrlTeacherDb = true;
      }
      //   this.getBlock(this.scDistrictId);
      //   this.getCluster(this.scBlockId);
      //  this.getPermanentBlock(this.pDistrictId);
      //  this.getCurrentBlock(this.cDistrictId);
      //   this.getTeacherAppointment();
      //   this.getSchool(this.scClusterId);
      //   this.getTeacherTitle();
      //   this.getAppointSubject();
      //   this.getAppointType();
      //   this.getAppointingAuthority();
      //   this.getDisability();
      //   // this.initializeForm();
      this.spinner.hide();
    });
  }
  getTeacherDetails() {
    this.registrationService.getTeacherDetails(this.encId).subscribe({
      next: (res: any) => {
        if (res.success === true) {
          this.draftStatus = res.draftSubmitted;
          this.headerComponent.disableNavHelper(res.draftSubmitted);
          this.spinner.hide();
        }
      },
      error: (err: any) => {
        this.spinner.hide();
      },
    });
  }
}
