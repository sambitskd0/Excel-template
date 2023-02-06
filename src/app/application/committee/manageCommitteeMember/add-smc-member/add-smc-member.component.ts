/**
 * Created By  : Manoj Kumar Baliarsingh
 * Created On  : 08-07-2022
 * Module Name : Committee
 * Description : Add  Smc member Component.
 **/

import { AfterViewInit, Component, ElementRef, HostListener, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { ErrorHandler } from "src/app/core/helpers/error-handler";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { Constant } from "src/app/shared/constants/constant";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { CommitteeMemberService } from "../../services/committee-member.service";

@Component({
  selector: "app-add-smc-member",
  templateUrl: "./add-smc-member.component.html",
  styleUrls: ["./add-smc-member.component.css"],
})
export class AddSmcMemberComponent implements OnInit, AfterViewInit {
  searchCommitteeMember!: FormGroup;
  addPriMemberForm!: FormGroup;
  addOtherMemberForm!: FormGroup;

  genderData: any = "";
  socialCatData: any = "";
  getOtherMemberData: any = "";

  committeeType: any = "";
  memberType: any = "";
  memberData: any = "";
  memberIdArr: any = [];



  //FORM CONTROL VARIABLES
  memberName: any = "";
  mobileNumber: any = "";
  socialCategory: any = "";
  belongsToBpl: any = "";
  gender: any = "";
  trainingStatus: any = "";
  studentName: any = "";
  emailId: any = "";
  position: any = "";
  memberFormType: any = "";
  labelName: string = "";
  member: any = "";
  memberId: any = "";
  changeBtnData: any = "";

  schoolCategory: any = "";
  school: any = "";
  loginId: any = "";
  userId: any = "";
  profileId:any = "";
  searchAcademicYear: any = "";

  schoolTypeData: any = "";

  addOtherMemberData: any = [];
  otherMemberData: any = [];
  schoolTypeCommitteArr: any = [];
  memberTypeArr: any = [];
  schoolType: any = [];

  showSpinnerMember: boolean = false;
  checkdissable: boolean = false;

  allPriLabel: string[] = [
    "",
    "",
    "",
    "Name",
    "Mobile",
    "Email",
    "Gender",
    "Social category",
    "Belongs to bpl ",
    "Training status ",
  ];
  allOtherLabel: string[] = [
    "",
    "",
    "",
    "Name",
    "Mobile",
    "Social category",
    "Belongs to bpl",
    "Gender",
    "Email",
    "",
    "",
  ];
  allSearchLabel: string[] = [
    "Committee type",
    "Member type",
    "Member name/mobile",
    "",
  ];

  isOtherMemberData: boolean = false;
  priMember: boolean = false;
  otherMember: boolean = false;
  permissionDiv: boolean = false;
  priMemberDiv: boolean = false;
  memberShowColumn2: boolean = false;
  isNorecordFound: boolean = false;
  disableFields: boolean = true;
  submitted = false;

  //PRI MEMBER
  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();
  adminPrivilege: boolean = false;

  constructor(
    private el: ElementRef,
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private spinner: NgxSpinnerService,
    private privilegeHelper: PrivilegeHelper, //For menu privilege
    public committeeMemberService: CommitteeMemberService,
    public commonService: CommonserviceService,
    private route: Router,
    private router: ActivatedRoute,
    private errorHandler: ErrorHandler
  ) {
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
    this.labelName = "Member";
    this.priMemberDiv = true;
    // GIVING NO ACCESS TO ADMIN
    const users = this.commonService.getUserProfile();

    if (users.loginUserTypeId != 3) {
      this.permissionDiv = true;
    } else {
      this.permissionDiv = false;
    }
    //END OF GIVING NO ACCESS TO ADMIN
    this.userId = users?.userId;
    this.school = users?.school;
    this.loginId = users?.loginId;
    this.profileId = users?.profileId;

    this.schoolCategory = users?.schoolCategory;
    this.searchAcademicYear = this.academicYear;
    this.initializeform();
    this.initializePriForm();
    this.initializeOtherMemForm();

    this.commonService.getCommonAnnexture(["SOCIAL_CATEGORY", "GENDER"]).subscribe((data: any = []) => {
      this.genderData = data?.data?.GENDER;
      this.socialCatData = data?.data?.SOCIAL_CATEGORY;
    });
    if (users.loginUserTypeId == 2) {
      this.committeeMemberService.getSchoolTypeBySchoolCatId(this.school, this.schoolCategory).subscribe((data: any = []) => {
        this.schoolType = data?.data;
        // console.log(this.schoolType);
        
        // let schoolTypeCheck = ["2"];
        /* if (this.schoolType.length == 1) {
          this.schoolTypeData = this.schoolType.filter((item: any) => {
            if (schoolTypeCheck.includes(item.schoolType)) {
              this.schoolTypeCommitteArr = [{ 'id': 1, 'committeeType': 'SMC' }];
            } else {
              this.schoolTypeCommitteArr = [{ 'id': 1, 'committeeType': 'SMC' }, { 'id': 2, 'committeeType': 'SMDC' }];
            }
          });
        } else {
          this.schoolTypeCommitteArr = [{ 'id': 1, 'committeeType': 'SMC' }, { 'id': 2, 'committeeType': 'SMDC' }];
        } */
        this.schoolTypeCommitteArr = [{ 'id': 1, 'committeeType': 'School Management Committee' }, { 'id': 2, 'committeeType': 'School Management Development Committee' }];
      });
      // console.log(this.addOtherMemberForm?.controls['position']);
      // this.committeeMemberInfo().valueChanges.subscribe(value => {
      //   console.log(value);
      // });
    }
  }
  ngAfterViewInit() {
    this.el.nativeElement.querySelector("[formControlName=committeeType]").focus();
  }
  memberTypeChange(memberType: any, committeeType: any) {
    this.initializePriForm();

    this.memberType = memberType.value;
    this.isOtherMemberData = false;
    this.searchCommitteeMember.patchValue({
      memberData: "",
    });
    this.committeeType = committeeType.value;
    if (this.memberType == 3) {
      this.priMember            = true;
      this.otherMember          = false;
      this.priMemberDiv         = false;
      this.isNorecordFound    = false;
    }
    if (this.memberType == 5) {
      this.priMember        = true;
      this.otherMember      = false;
      this.priMemberDiv     = false;
      this.isOtherMemberData    = false;

    }
    if (this.memberType == 1) {
      this.labelName          = "Parent";
      this.priMemberDiv       = true;
      this.priMember          = false;
      this.otherMember        = true;
      this.memberShowColumn2  = false;
      // this.memberShowColumn1 = true;
      // this.memberShowColumn2 = false;
      // this.member = "President";
    }
    if (this.memberType == 2) {
      this.labelName          = "Teacher";
      this.priMemberDiv       = true;
      this.priMember          = false;
      this.otherMember        = true;
      this.memberShowColumn2  = true;
      // this.memberShowColumn1 = false;
      // this.member = "Secretary";
    }
    if (this.memberType == 4) {
      this.labelName = "Student";
      this.priMemberDiv = true;
      this.priMember = false;
      this.otherMember = true;
    }
  }

  getMemberType(committeeTypeId: any) {
    this.showSpinnerMember = true;
    if (committeeTypeId == 1) {
      this.memberTypeArr = [{ 'id': 1, 'memberType': 'Parent' }, { 'id': 2, 'memberType': 'Teacher' },
      { 'id': 3, 'memberType': `Representatives/nominees from local authority/localgovernment/urban local body` }, { 'id': 4, 'memberType': `Bal Sansad (student member)` }]
      this.showSpinnerMember = false;
    }
    if (committeeTypeId == 2) {
      this.memberTypeArr = [{ 'id': 1, 'memberType': 'Parent' }, { 'id': 2, 'memberType': 'Teacher' }, { 'id': 3, 'memberType': `Representatives/nominees from local authority/localgovernment/urban local body` }, { 'id': 4, 'memberType': `Bal Sansad (student member)` }, { 'id': 5, 'memberType': 'Representative of Welfare officer' }]
      this.showSpinnerMember = false;
    }

  }

  checkCheckBoxvalue(event: any) {
    if (event.target.checked == true) {
      this.position = 1;
      this.addPriMemberForm.patchValue({
        position: this.position,
      });
    } else {
      this.position = 0;
      this.addPriMemberForm.patchValue({
        position: this.position,
      });
    }
  }
  initializeform() {
    this.searchCommitteeMember = this.formBuilder.group({
      committeeType: [this.committeeType, [Validators.required,Validators.pattern('^[0-9.]*$'), ]],
      memberType: [this.memberType, [Validators.required,Validators.pattern('^[0-9.]*$'), ]],
      memberData: [this.memberData, [Validators.required,Validators.maxLength(20),Validators.pattern('^[A-Za-z0-9 .]*$'),this.customValidators.firstCharValidatorRF,]],
      searchAcademicYear: [this.searchAcademicYear],
    });
  }
  initializePriForm() {
    this.addPriMemberForm = this.formBuilder.group({
      userId: [this.userId],
      school: [this.school],
      loginId: [this.loginId],
      profileId: [this.profileId],
      // memberType: [this.memberType, [Validators.required]],
      // committeeType: [this.committeeType, [Validators.required]],
      memberName: [this.memberName, [Validators.required, this.customValidators.firstCharValidatorRF, Validators.pattern(/^[a-zA-Z ]+$/), Validators.maxLength(50),this.customValidators.firstCharValidatorRF,]],
      mobileNumber: [this.mobileNumber, [Validators.required, this.customValidators.firstCharValidatorRF, Validators.pattern(/^[0-9]+$/), Validators.maxLength(10),this.customValidators.firstCharValidatorRF,]],
      emailId: [this.emailId, [Validators.maxLength(50)]],
      gender: [this.gender, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      socialCategory: [this.socialCategory, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      belongsToBpl: [this.belongsToBpl, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      trainingStatus: [this.trainingStatus, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    });
  }
  initializeOtherMemForm() {
    this.addOtherMemberForm = this.formBuilder.group({
      userId: [this.userId],
      school: [this.school],
      loginId: [this.loginId],
      profileId: [this.profileId],
      memberName: [this.memberName,[Validators.pattern(/^[a-zA-Z ]]+$/),Validators.maxLength(50)]],
      mobileNumber: [this.mobileNumber,[Validators.pattern(/^[0-9]+$/),Validators.maxLength(10)]],
      socialCategory: [this.socialCategory,[Validators.pattern(/^[0-9]+$/)]],
      belongsToBpl: [this.belongsToBpl,[Validators.pattern(/^[0-9]+$/)]],
      gender: [this.gender,[Validators.pattern(/^[0-9]+$/)]],
      emailId: [this.emailId],
      trainingStatus: [this.trainingStatus,[Validators.pattern(/^[0-9]+$/)]],
      position: [this.position],
      otherMemberData: this.formBuilder.array([]), // store all data in this array
    });
  }

  committeeMemberInfo(): FormArray {
    return this.addOtherMemberForm.get("otherMemberData") as FormArray;
  }

  searchMember() {
    // this.customValidators.formValidationHandler(
    //   this.searchCommitteeMember,
    //   this.allSearchLabel
    // );
    this.memberIdArr=[];
    // if ("INVALID" === this.searchCommitteeMember.status) {
    //   for (const key of Object.keys(this.searchCommitteeMember.controls)) {
    //     if (this.searchCommitteeMember.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.searchCommitteeMember, this.allSearchLabel);
    //       break;
    //     }
    //   }
    // }

    if (this.searchCommitteeMember.invalid) {
      // this.customValidators.formValidationHandler(this.searchCommitteeMember, this.allSearchLabel, this.el);
      this.customValidators.formValidationHandler(
        this.searchCommitteeMember,
        this.allSearchLabel,
        this.el,
        {
          required: {
            committeeType: "Please select committee type",
            memberType: `Please select member type`,
            memberData: `Please enter member name/mobile number to search records`,
          },
        }
      );
    }

    if (this.searchCommitteeMember.invalid) {
      return;
    }
    if (this.searchCommitteeMember.valid === true) {
      this.initializeOtherMemForm();
      this.spinner.show();
      this.committeeMemberService
        .getMembers(this.searchCommitteeMember.value, this.school)
        .subscribe((response: any = []) => {
          this.getOtherMemberData = response?.data;

          this.isNorecordFound = this.getOtherMemberData.length ? false : true;
          if( this.isNorecordFound == true){
            this.isOtherMemberData = false;
          }

          if (this.getOtherMemberData?.length) {
            //checking weather already have president or secretary
            this.getOtherMemberData.forEach((itemm: any) => {
              if(itemm?.position!=0){
                this.memberIdArr.push(itemm?.position);
              }
            })
            if(this.memberIdArr?.length>0){
              this.checkdissable=true;
            }else{
              this.checkdissable=false;
            }
            this.isOtherMemberData = true;
            this.memberFormType = this.getOtherMemberData[0].memberFormType;
            this.getOtherMemberData.map((item: any) => {
              this.committeeMemberInfo().push(
                this.formBuilder.group({
                  memberName: [
                    {
                      value: item.memberName,
                      disabled: item.memberName,
                    },
                  ],
                  mobileNumber: [
                    {
                      value: item?.mobile,
                      disabled: item?.memberId,
                    },
                  ],
                  emailId: [
                    {
                      value: item?.email,
                      disabled: item?.memberId,
                    },
                  ],
                  socialCategory: [
                    {
                      value: item?.socialCategory,
                      disabled: item?.socialCategory,
                    },
                  ],
                  gender: [
                    {
                      value: item?.gender,
                      disabled: item?.gender,
                    },
                  ],
                  belongsToBpl: [
                    {
                      value: item?.belongtoBpl ? item?.belongtoBpl : 2,
                      // value: item?.belongtoBpl,
                      disabled: item?.belongtoBpl,
                    },
                  ],
                  trainingStatus: [
                    {
                      value: item?.trainingStatus,
                      disabled: item?.trainingStatus,
                    },
                  ],
                  memberId: [
                    {
                      value: item?.memberId,
                      disabled: item?.memberId,
                    },
                  ],

                  position: [
                    {
                      value: item?.position,
                      // disabled: item?.memberId,
                      disabled:  this.checkdissable || item?.memberId,
                      // disabled: item?.position,
                    },
                  ],
                  studentName: [
                    {
                      value: item?.studentName,
                      disabled: item?.studentName,
                    },
                  ],
                  changeBtnData: [
                    {
                      value: item?.changeBtnData,
                      disabled: item?.changeBtnData,
                    },
                  ],
                  encId: [
                    {
                      value: item.encId,
                      disabled: item.encId,
                    },
                  ],
                })
              );
            });
          }
          this.spinner.hide();
        });
    }
  }
  addPriMember() {
    const memberType = this.searchCommitteeMember.value.memberType;
    const committeeType = this.searchCommitteeMember.value.committeeType;
    if (committeeType != "") {
      /*    this.customValidators.formValidationHandler(
           this.addPriMemberForm,
           this.allPriLabel
         ); */
      // if ("INVALID" === this.addPriMemberForm.status) {
      //   for (const key of Object.keys(this.addPriMemberForm.controls)) {
      //     if (this.addPriMemberForm.controls[key].status === "INVALID") {
      //       const invalidControl = this.el.nativeElement.querySelector(
      //         '[formControlName="' + key + '"]'
      //       );
      //       invalidControl.focus();
      //       this.customValidators.formValidationHandler(this.addPriMemberForm, this.allPriLabel);
      //       break;
      //     }
      //   }
      // }
      if (this.addPriMemberForm.invalid) {
        this.customValidators.formValidationHandler(
          this.addPriMemberForm,
          this.allPriLabel,
          this.el,
          {
            required: {
              memberName: "Please enter Member Name",
              mobileNumber: `Please enter Member Mobile`,
              gender: `Please enter Member Gender`,
              socialCategory: `Please select Member Social`,
              belongsToBpl: `Please select if Member Belongs to BPL`,
              trainingStatus: `Please select Member Training`,
            },
          }
        );
      }
      if (this.addPriMemberForm.invalid) {
        return;
      }
      if (this.addPriMemberForm.valid === true) {
        this.alertHelper.submitAlert().then((result) => {
          if (result.value) {
            this.spinner.show();
            this.committeeMemberService
              .addPriMembers(
                this.addPriMemberForm.value,
                memberType,
                committeeType,
                this.searchAcademicYear
              )
              .subscribe({
                next: (res: any) => {
                  this.spinner.hide();
                  this.alertHelper
                    .successAlert(
                      "Saved!",
                      "Committee member added successfully",
                      "success"
                    )
                    .then(() => {
                      this.resetPriForm();
                      this.initializePriForm();
                    });
                },
                error: (error: any) => {
                  this.spinner.hide(); //==== hide spinner
                  this.errorHandler.serverSideErrorHandler(error); // server side error handler
                },
              });
          }
        });
      }
    } else {
      this.alertHelper.successAlert("Committee type required", "", "error");
    }
  }

  addOtherMember(index: number, event: any) {
    const memberType = this.searchCommitteeMember.value.memberType;
    const committeeType = this.searchCommitteeMember.value.committeeType;
    const addOtherMemberData =
      this.addOtherMemberForm?.getRawValue().otherMemberData[index];
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.school = users?.school;
    this.loginId = users?.loginId;
    this.schoolCategory = users?.schoolCategory;

    this.alertHelper.submitAlert().then((result: any) => {
      if (result.value) {
        this.spinner.show(); // ==== show spinner
        this.committeeMemberService
          .addOtherMemberData(
            addOtherMemberData,
            memberType,
            committeeType,
            this.school,
            this.userId,
            this.profileId,
            this.schoolCategory, this.searchAcademicYear
          )
          .subscribe({
            next: (res: any) => {
              this.spinner.hide(); //==== hide spinner
              this.alertHelper
                .successAlert(
                  "Saved!",
                  "Committee member created successfully.",
                  "success"
                )
                .then(() => {
                  // this.initializeform();
                  // this.initializeOtherMemForm();
                  window.location.reload();
                });
            },
            error: (error: any) => {
              this.spinner.hide(); //==== hide spinner
            },
          });
      }
    });
  }
  resetPriForm() {
    this.searchCommitteeMember.patchValue({
      memberType: "",
    });
    this.searchCommitteeMember.patchValue({
      committeeType: "",
    });
  }
  changeData(event: any) { }
}
