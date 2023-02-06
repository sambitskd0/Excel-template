import { Component, OnInit, ElementRef, ViewChild, HostBinding, AfterViewInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Constant } from "src/app/shared/constants/constant";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { RegistrationService } from "../../services/registration.service";
import { formatDate } from '@angular/common';
import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";
import { Subscription } from "rxjs";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { Router } from "@angular/router";
import { TeacherTransferService } from "../../services/teacher-transfer.service";
import { IDropdownSettings } from "ng-multiselect-dropdown";
@Component({
  selector: "app-add-notification",
  templateUrl: "./add-notification.component.html",
  styleUrls: ["./add-notification.component.css"],
})
export class AddNotificationComponent implements OnInit,AfterViewInit {
  dropdownSettings: IDropdownSettings = {};
  @ViewChild("teacherImage")
  teacherProfileImage!: ElementRef;
  teacherForm!: FormGroup;
  allErrorMessages: string[] = [];
  submitted = false;
  schoolCatagoryChanged:boolean = false;
  schoolCatData:any = [];
  allLabel: string[] = [
    "Transfer Application Title",
    "Transfer Application Letter No.",
    "Transfer Application From Date",
    "Transfer Application To Date",
    "Type of Teacher",
    "Nature of appointment"
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
  academicYear: any = this.config.getAcademicCurrentYear();
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
  teacherCategoryChanged: boolean = false;
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
  disability: boolean = false;
  teacherImageChange: boolean = false;
  appointmentType: any = "";
  teacherAppointSubject: any = "";
  teacherAppointment: any = "";
  teacherTitle: any[] = [];
  teacherGender: any = "";
  teacherGenders: any = "";
  teacherCategory: any = "";
  teacherCategories: any = "";
  appointingAuth: any = "";
  disabilityType: any = "";
  scSchool: any = "";
  schoolDatas: any = "";
  getSchoolData: any = "";
  fileToUploadTeacher: any = "";
  imageUrlTeacher: any = "";
  isimageUrlTeacher: boolean = false;
  pState: any = "1";
  cState: any = "1";
  religion: any = '1';
  markAsPresent: any = '';
  showAge: any = '';
  currAdd: boolean = false;
  scBlockId: any = "";
  scDistrictId: any = "";
  userProfile: any = [];
  createdBy: any = "";
  cfmsAppointValue: any = "";
  isShown: boolean = false;
  maxDate: any = Date;
  searchDistrictData: any = [];
  searchBlockData: any = [];
  scBlockSelect: boolean = true;
  scBlockLoading: boolean = false;
  scClusterSelect: boolean = true;
  scClusterLoading: boolean = false;
  scSchoolSelect: boolean = true;
  scSchoolLoading: boolean = false;
  scDisrtictSelect: boolean = true;
  scDisrtictLoading: boolean = false;

  // changes
  prefix:any[] = [];
  sikhayak: boolean = false;
  teacherT: any="";
  blockTeacherType: any="";
  blockTeacherTypeField:any="";
  blockTeacherTypeOptions: any[] = [];
  maritalStatus: boolean = false;
  married: any="";
  wheatherDisable: any="";
  wheatherAward: any="";
  awardTypeShown:boolean = false;
  awardType:any="";
  dobSubscription!: any;
  serviceJoining!: any;
  joiningService!: any;
  joiningCurrentSchool!: any;
  serviceJoiningDtSubscription!: Subscription;
  jfDistrictCode:any="";
  // changes end
  plPrivilege:string="view"; //For menu privilege
  
  adminPrivilege: boolean = false;
  public userdetails = JSON.parse(
    sessionStorage.getItem("userProfile") || "{}"
  );
  loginUserType = this.userdetails.loginUserTypeId;
  userDesignation = this.userdetails.designationId;
  userType:any ="";
  userDesg:any ="";
  posts: any;
  scSchoolCategoryLoading:boolean=false;
  scSchoolCategorySelect:boolean=true;
  searchSchoolCategoryId:any="";
  constructor(
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private commonService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private registrationService: RegistrationService,
    private spinner: NgxSpinnerService,
    private alertHelper: AlertHelper,
    private el: ElementRef,
    private commonFunctionHelper: CommonFunctionHelper,
    private transferService: TeacherTransferService,

  ) {
    this.maxDate = new Date();
    const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For authorization

  }

  ngOnInit(): void {    
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    this.userProfile = this.commonService.getUserProfile();
    // this.getSchoolCategory();
    this.loadAnnextureDataBySeq();
    // this.getAppointSubject();
    this.initializeForm();
    this.onChangeOfDates();
    // this.getTeacherTitle();
    // this.el.nativeElement.querySelector("[formControlName=prefix]").focus();  

    this.dropdownSettings = {
			idField: "anxtValue",
			textField: "anxtName",
			enableCheckAll: true,
			selectAllText: "Select All Nature Of Appointment",
			unSelectAllText: "UnSelect All Nature Of Appointment",
			noDataAvailablePlaceholderText: "No data available",
			allowSearchFilter: true,
			itemsShowLimit: 4,
		};
    
  }
  ngAfterViewInit(): void {
    this.maxDate = new Date();   
  }
  onChangeOfDates() { 
    this.dobSubscription = this.teacherForm?.get("DOB")?.valueChanges.subscribe((value: any) => {
        this.teacherAgeCalculate(value,this.teacherForm.getRawValue()?.serviceJoiningDt);
      });
      
    this.serviceJoining = this.teacherForm
      ?.get("serviceJoiningDt")?.valueChanges.subscribe((value: any) => {
        this.teacherAgeCalculate(this.teacherForm.getRawValue()?.DOB, value);
      });      
      this.joiningService = this.teacherForm ?.get("joiningServiceDate")?.valueChanges.subscribe((value: any) => {
        this.joiningServiceDate(this.teacherForm.getRawValue()?.DOB,this.teacherForm.getRawValue()?.serviceJoiningDt,value);
      });      
    this.joiningCurrentSchool = this.teacherForm?.get("joiningCurrentSchoolDt")?.valueChanges.subscribe((value: any) => {
        this.joiningCurrentSchDate(this.teacherForm.getRawValue()?.DOB,this.teacherForm.getRawValue()?.serviceJoiningDt,value);
      });
      
  }
  getAnnextureData() {
    this.commonService
      .getCommonAnnexture(["GENDER",
        //"TEACHER_SOCIAL_CATEGORY",
        // "RELIGION",
        "BLOODGRP",
        //"TEACHER_SOCIAL_CATEGORY",
        "MARITIAL_STATUS",
        // "TEACHER_TITLE",
        // "NATURE_OF_APPOINTMENT",
        "APPOINTMENT_TYPE",
        "APPOINTING_AUTHORITY",
        "DISABILITY",
        "BLOCK_TEACHER_TYPE",
        "PREFIX",
        "AWARDTYPE"
      ])
      .subscribe({
        next: (res: any) => {
          this.spinner.hide(); 
          //.sort((a: any, b: any) => (a.anxtName.toLowerCase() < b.anxtName.toLowerCase()) ? -1 : ((b.anxtName.toLowerCase() > a.anxtName.toLowerCase()) ? 1 : 0));
          // this.teacherAppointment = res?.data?.NATURE_OF_APPOINTMENT;
          this.teacherGender = res?.data?.GENDER;
          //this.teacherCategory = res?.data?.TEACHER_SOCIAL_CATEGORY;
          // this.teacherReligion = res?.data?.RELIGION;
          // this.teacherTitle = res?.data?.TEACHER_TITLE;
          // this.teacherAppointment = res?.data?.NATURE_OF_APPOINTMENT;
          this.appointmentType = res?.data?.APPOINTMENT_TYPE;
          this.appointingAuth = res?.data?.APPOINTING_AUTHORITY;
          this.teacherMaritial = res?.data?.MARITIAL_STATUS;
          this.teacherBldGrp = res?.data?.BLOODGRP;
          //this.teacherRecCaste = res?.data?.TEACHER_SOCIAL_CATEGORY;
          this.disabilityType = res?.data?.DISABILITY;
          this.blockTeacherType = res?.data?.BLOCK_TEACHER_TYPE;
          this.prefix = res?.data?.PREFIX;
          this.awardType = res?.data?.AWARDTYPE;
        },
      });
  }
  loadAnnextureDataBySeq() {
   const anxtType =  [
      //"GENDER",
      "TEACHER_SOCIAL_CATEGORY",
      "RELIGION",
      //"BLOODGRP",
      "TEACHER_SOCIAL_CATEGORY",
      //"MARITIAL_STATUS",
      "TEACHER_TITLE",
      "NATURE_OF_APPOINTMENT",
      "APPOINTED_SUBJECT",
      //"APPOINTMENT_TYPE",
      // "APPOINTING_AUTHORITY",
     // "DISABILITY",
     // "BLOCK_TEACHER_TYPE",
     // "PREFIX",
     // "AWARDTYPE"
    ]
    this.commonService
      .getCommonAnnexture(anxtType,true)
      .subscribe({
        next: (res: any) => {
          this.spinner.hide(); 
          this.teacherAppointment = res?.data?.NATURE_OF_APPOINTMENT;
            this.teacherCategory = res?.data?.TEACHER_SOCIAL_CATEGORY;
         this.teacherReligion = res?.data?.RELIGION;
         this.teacherTitle = res?.data?.TEACHER_TITLE;
         this.teacherAppointSubject = res?.data?.APPOINTED_SUBJECT;
         this.teacherRecCaste = res?.data?.TEACHER_SOCIAL_CATEGORY;
        
        },
      });
  }

  //changes

  get teacherFormControl() {
    return this.teacherForm.controls;
  }
  // getSchoolCategory(){
  //   this.schoolCatagoryChanged = true;
  //   this.schoolCatData = [];  
  //   this.transferService.getSchoolCategory().subscribe((res)=>{
  //     this.posts = res;
  //     let data: any = res;
  //     for (let key of Object.keys(data['data'])) {
  //       this.schoolCatData.push(data['data'][key]);
  //     } 
  //     this.schoolCatagoryChanged = false;
  //    });  
  // }
  //changes end

  initializeForm() {
    this.teacherForm = this.formBuilder.group({
      title: ["", Validators.required],
      letterNo: ["", Validators.required],
      fromDate: ["", Validators.required],
      toDate: ["", Validators.required],
      teacherTitle: ["", Validators.required],
      natureOfAppointmt: ["", Validators.required],
    });
  }
  getTeacherTitle() {
    this.teacherTitleChanged = true;
    this.teacherTitle = [];
    this.registrationService.getTeacherTitle().subscribe((res: any) => {
      this.teacherTitles = res;
      let data: any = res;
      for (let key of Object.keys(data["data"])) {
        this.teacherTitle.push(data["data"][key]);
      }
      this.teacherTitleChanged = false;
    });
  }
  getTeacherAppointment() {
    this.teacherAppointmentChanged = true;
    this.teacherAppointment = [];
    this.registrationService.getTeacherAppointment().subscribe((res: any) => {
      let data: any = res;
      for (let key of Object.keys(data["data"])) {
        this.teacherAppointment.push(data["data"][key]);
      }
      this.teacherAppointmentChanged = false;
    });
  }
  getAppointSubject() {
    this.teacherAppointSubjectChanged = true;
    this.teacherAppointSubject = [];
    this.registrationService.getAppointSubject().subscribe((res: any) => {
      let data: any = res;
      for (let key of Object.keys(data["data"])) {
        //this.teacherAppointSubject.push(data["data"][key]);
      }
      this.teacherAppointSubjectChanged = false;
    });
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

    var ext = file[0].name.substring(file[0].name.lastIndexOf(".") + 1);

    if (ext == "jpg" || ext == "png" || ext == "jpeg" || ext == "gfif" || ext == "JPG" || ext == "PNG" || ext == "JPEG" || ext == "GFIF") {
      const fileSize = file[0].size;
      const fileSizeInKB = Math.round(fileSize / 1024);
      if (fileSizeInKB > 300) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Upload image must be 300kb"
        );
        // this.teacherProfileImage.nativeElement.value = "";
        this.teacherForm.patchValue({
          teacherImage: ""
        });
        return;
      } else {
        this.fileToUploadTeacher = file.item(0);
        //Show image preview
        let reader = new FileReader();
        reader.onload = (event: any) => {
          this.imageUrlTeacher = event.target.result;
          this.teacherForm.patchValue({
            fileSource: this.imageUrlTeacher
          });
        };
        reader.readAsDataURL(this.fileToUploadTeacher);
        this.isimageUrlTeacher = true;
      }
    } else {
      this.alertHelper.viewAlert("error", "Invalid", "Inavlid file format");
      this.teacherForm.patchValue({
        teacherImage: ""
      });
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
      teacherImage: ''
    });
  }
  getFormValue(allValue: any) {
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
		
			this.customValidators.formValidationHandler(
				this.teacherForm,
				this.allLabel
			);	
		
		if (this.teacherForm.valid == true){
			this.alertHelper.submitAlert().then((result: any) => {
				if (result.value) {
					this.spinner.show();
					this.transferService.addNotification(
						this.teacherForm.getRawValue()
					).subscribe({
						next: (res: any) => {
							if (res.success === true) {
								this.alertHelper.successAlert("Saved!", res?.msg, "success").then(() => {
								  window.location.reload();
								});
							  } else {
								this.alertHelper.viewAlert("error", "Invalid", res?.msg);
							  }
							this.spinner.hide();							
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
    if (value != '') {
      const disabilityPercent = value;
      if (disabilityPercent > 100) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="disabilityPer"]');
          invalidControl.focus();
          this.teacherForm.patchValue({
            disabilityPer: ''
          });
          
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "% of disability can not be greater than 100"
        );
       
      
        return;
      }
    }

  }

  teacherAddressCheck(event: any) {
    //  event.target.checked === false;     
    if (event.target.checked) {
      this.currAdd = true;
      let houseName = this.teacherForm.controls['pHouseName'].value;
      let street = this.teacherForm.controls['pStreet'].value;
      let state = this.teacherForm.controls['pState'].value;
      let districtId = this.teacherForm.controls['pDistrictId'].value;
      let blockId = this.teacherForm.controls['pBlockId'].value;
      let panchayat = this.teacherForm.controls['pPanchayat'].value;
      let village = this.teacherForm.controls['pVillage'].value;
      let pin = this.teacherForm.controls['pPIN'].value;
      let districtOther = this.teacherForm.controls['pDistrictOther'].value;
      let blockOther = this.teacherForm.controls['pBlockOther'].value;
      if (state == '2') {
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
        markAsPresent: '1'
      })
    } else {
      this.teacherForm.patchValue({
        cHouseName: '',
        cStreet: '',
        cState: this.cState,
        cDistrictId: '',
        cBlockId: '',
        cPanchayat: '',
        cVillage: '',
        cPIN: '',
        cDistrictOther: '',
        cBlockOther: '',
        markAsPresent: '0'
      })
    }


  }
  nameCheckFather(value: any) {
    let fName = this.teacherForm.controls['fatherName'].value;
    let mName = this.teacherForm.controls['motherName'].value;
    if (value != '') {
      if ((fName === value)) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Father name and Mother name can not be same"
        );
        this.teacherForm.patchValue({
          motherName: ''
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
    this.teacherForm.patchValue({
      markAsPresent: '0'
    })
  }

  cfmsCheck(id: any) {
    this.cfmsAppointValue = id;
    this.teacherForm.patchValue({ CFMScode: '' });
    if ((this.cfmsAppointValue === '2') || (this.cfmsAppointValue === '5')) {
      this.isShown = true;
      this.teacherForm.controls["CFMScode"].setValidators([
        Validators.required,
        Validators.maxLength(40),
        Validators.pattern(/^[a-zA-Z0-9 ]*$/)
      ]);
      this.teacherForm.controls["CFMScode"].updateValueAndValidity();
    } else {
      this.isShown = false;
      this.teacherForm.controls["CFMScode"].setValidators([
        Validators.nullValidator
      ]);
      this.teacherForm.controls["CFMScode"].updateValueAndValidity();
    }

  }

  //changes
  teacherTitleChange(data: any) {
    if (data != "") {
      if ((data === '16') || (data === '17')) { // 16 -prakhand 17 - nagar
        this.blockTeacherTypeOptions = [];
        this.blockTeacherType.forEach((key:any, val:any) => {
          if(data === '16'){
            if((key.anxtValue == 1) || (key.anxtValue == 2)){
              this.blockTeacherTypeOptions?.push(key);
            }
          }else if(data === '17'){
            if((key.anxtValue == 3) || (key.anxtValue == 4)){
              this.blockTeacherTypeOptions?.push(key);
            }
          }
        });
        this.sikhayak = true;
        this.teacherT = data;
      } else {
        this.sikhayak = false;
      }
    }else {
      this.sikhayak = false;
    }
  }

  maritalStatusChange(data: any) {    
      if (data === '2') {
        this.maritalStatus = true;
        this.married = data;
      } else {
        this.teacherForm.controls['spouseName'].patchValue('');
        this.maritalStatus = false;
      }   
  }

  wheatherDisability(data: any) {    
      if (data === '1') {
        this.wheatherDisable = true;
      } else {
        this.teacherForm.controls['disability'].patchValue('');
    this.teacherForm.controls['disabilityPer'].patchValue('');
        this.wheatherDisable = false;
      }    
  }

  wheatherAwarded(data: any) {   
      if (data === '1') {
        this.awardTypeShown = true;
      } else {
        this.teacherForm.controls['typeOfAward'].patchValue('');
        this.awardTypeShown = false;
      }    
  }

  ngOnDestroy() {
    this.dobSubscription?.unsubscribe();
    this.serviceJoining?.unsubscribe();
    this.joiningService?.unsubscribe();
    this.joiningCurrentSchool?.unsubscribe();
  }


}