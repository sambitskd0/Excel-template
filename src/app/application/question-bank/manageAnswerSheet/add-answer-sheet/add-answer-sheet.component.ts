import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
} from "@angular/core";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from "src/environments/environment";
import { Constant } from "src/app/shared/constants/constant";
import { QuestionBankService } from "../../services/question-bank.service";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { ErrorHandler } from "src/app/core/helpers/error-handler";
import { SchoolService } from "src/app/application/school/services/school.service";
import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { Router } from "@angular/router";

@Component({
  selector: "app-add-answer-sheet",
  templateUrl: "./add-answer-sheet.component.html",
  styleUrls: ["./add-answer-sheet.component.css"],
})
export class AddAnswerSheetComponent implements OnInit {
  @HostListener("document:keyup", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    +event?.which === 13 && this.onSubmit();
  }
  @ViewChild("userInputRef") userInputRef!: ElementRef;
  @ViewChild("selectedAssesmentTypeRef") selectedAssesmentTypeRef!: ElementRef;
  @ViewChild("selectedClassRef") selectedClassRef!: ElementRef;
  @ViewChild("selectedStreamRef") selectedStreamRef!: ElementRef;
  @ViewChild("selectedGroupRef") selectedGroupRef!: ElementRef;
  @ViewChild("selectedSectionRef") selectedSectionRef!: ElementRef;
  @ViewChild("selectedSubjectRef") selectedSubjectRef!: ElementRef;
  @ViewChild("selectedsetNameRef") selectedsetNameRef!: ElementRef;
  @ViewChild("selectedStudentRef") selectedStudentRef!: ElementRef;
  @ViewChild("markObtainedRef") markObtainedRef!: ElementRef;

  private schoolAPI = environment.schoolAPI;

  @ViewChild("fileInput", { static: false })
  fileRef!: ElementRef;

  viewDetails!: any;
  assessmentDetails!: any;
  optionVal: any;
  optionstream: any;
  isLoading = false;
  isNorecordFound: boolean = false;
  classAnnexture!: any;
  annextureLoad: boolean = false;
  classWiseSubjects!: any;
  streamType!: any;
  isClassGreaterThanTen: boolean = false;
  subjectLoad: boolean = false;
  streamLoad: boolean = false;
  groupLoad: boolean = false;
  streamGroupTypeLoad: boolean = false;
  annextureData!: any;
  isScienceStreamSelected: boolean = false;
  streamGroupAnnexture!: any;
  selectedClass: any = "";
  selectedStream: any = "";
  selectedGroup: any = "";
  selectedSubject: any = "";
  selectedAssesmentType: any = "";
  selectedsetName: any = "";
  selectedSection: any = "";
  selectedStudent: any = "";
  assessmentAnnexture!: any;
  pageIndex: any = 0;
  previousSize: any = 0;
  userProfile: any = 0;
  schoolProfile!: any;
  public fileUrl = environment.filePath;
  appearStatus: boolean = true; // true:disable,false:enable
  totalMark: number = 0;
  studentData: any = [];
  answerSheetFile!: File;
  markObtained!: any;
  formData = new FormData();
  studentLoad: boolean = false;
  dateOfExam: any = new Date();
  sectionData: any = "";
  sectionLoad: boolean = false;

  demographyData: any = {
    districtData: [],
    blockData: [],
    clusterData: [],
    schoolData: [],
    disrtictChanged: false,
    blockChanged: false,
    clusterChanged: false,
    schoolChanged: false,
  };

  userInput: any = {
    studentCode: "",
    studentAadhaar: "",
    districtId: "",
    blockId: "",
    clusterId: "",
    schoolId: "",
    studentName: "",
    fatherName: "",
    motherName: "",
    dob: "",
    gender: "",
    schoolCategory: "",
  };
  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  maxDate: any = Date;


  constructor(
    private commonserviceService: CommonserviceService,
    private questionBankService: QuestionBankService,
    private privilegeHelper: PrivilegeHelper, //For menu privilege
    private router: Router,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    public customValidators: CustomValidators,
    private errorHandler: ErrorHandler,
    private schoolService: SchoolService,
    private commonFunctionHelper: CommonFunctionHelper,
    private el: ElementRef
  ) {
    const pageUrl: any = this.router.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl); //For menu privilege
    this.commonserviceService.verifyLinkPermission(
      pageUrl,
      this.config.linkType[2],
      this.config.privilege[4]
    ); // For authorization
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    if (this.plPrivilege == "admin") {
      this.adminPrivilege = true;
    }
    this.userProfile = this.commonserviceService.getUserProfile(); // get user profile
    if (
      this.userProfile?.maxClass >= 9 ||
      this.userProfile?.loginId === "supAdmin"
    ) {
      this.spinner.show();
      this.getDistrict();
      this.getAnnextureData();
      this.searchPanelHandler();
    }
  }
  searchPanelHandler() {
    if (this.userProfile?.school) {
      this.commonserviceService
        .getSearchPanelData(this.userProfile?.school, "SCHOOL")
        .subscribe({
          next: (res: any) => {
            res?.success && (this.schoolProfile = res?.data);
            console.log(res);

            this.spinner.hide();
          },
          error: (error: any) => {
            this.isLoading = false;
            this.spinner.hide();
          },
        });
    } else {
      this.spinner.hide();
    }
  }

  ngAfterViewInit() {
    this.userInputRef?.nativeElement.focus();
  }
  // get annextures
  getAnnextureData() {
    this.annextureLoad = true;

    this.commonserviceService
      .getCommonAnnexture(
        [
          "ASSESSMENT_TYPE",
          "CLASS_TYPE",
          "STREAM_TYPE",
          "STREAM_GROUP_TYPE",
          "SECTION_NAME",
        ],
        true
      )
      .subscribe({
        next: (res: any) => {
          this.annextureData = res?.data;
          this.assessmentAnnexture = res?.data?.ASSESSMENT_TYPE;
          this.classAnnexture = res?.data?.CLASS_TYPE.filter(
            (item: any): any => {
              return (
                +item.anxtValue >= 9 &&
                +item.anxtValue <= this.userProfile?.maxClass
              );
            }
          );

          this.streamType = this.annextureData?.STREAM_TYPE;
          this.annextureLoad = false;
        },
      });
  }
  // ===== get class wise subjects
  getSubjects() {
    this.selectedSubject = "";
    this.classWiseSubjects = undefined;

    // 1) get subjects of the selected class
    // 2) if class greater than 10 show stream field
    if (this.selectedClass > 10) {
      this.isClassGreaterThanTen = true;
      this.isScienceStreamSelected = this.selectedStream == 3 ? true : false; // hide stream group
    } else {
      this.isClassGreaterThanTen = false; //else hide
    }

    const classStreamGroupObj = {
      selectedClassId: parseInt(this.selectedClass),
      selectedStreamId: parseInt(this.selectedStream),
      selectedGroupId: parseInt(this.selectedGroup),
    };
    if (
      classStreamGroupObj.selectedClassId > 10 &&
      classStreamGroupObj.selectedStreamId == 3
    ) {
      if (classStreamGroupObj.selectedGroupId > 0)
        this.getSubjectsClassStreamGroupWise(classStreamGroupObj);
    } else if (
      classStreamGroupObj.selectedClassId > 10 &&
      classStreamGroupObj.selectedStreamId > 0
    ) {
      this.getSubjectsClassStreamGroupWise(classStreamGroupObj);
    } else if (
      classStreamGroupObj.selectedClassId > 0 &&
      classStreamGroupObj.selectedClassId < 11
    ) {
      this.getSubjectsClassStreamGroupWise(classStreamGroupObj);
    }
  }
  // on stream change
  // get calss wise subjects
  getSubjectsClassStreamGroupWise(classStreamGroupObj: object) {
    this.subjectLoad = true;
    this.questionBankService
      .getSubjectsClassStreamGroupWise(classStreamGroupObj)
      .subscribe({
        next: (response: any) => {
          if (response?.success === true) {
            this.classWiseSubjects = response?.data;
          }
          this.subjectLoad = false;
        },
      });
  }
  // on stream change
  getStreamGroupType() {
    this.streamLoad = true;
    if (this.selectedStream == "") this.streamType = undefined;
    // // if science stream selected
    if (parseInt(this.selectedStream) === 3) {
      this.streamGroupAnnexture = this.annextureData?.STREAM_GROUP_TYPE.filter(
        (item: any) => item.anxtValue < 3
      );
      this.isScienceStreamSelected = true; // show stream group
      this.streamGroupTypeLoad = true;
    } else {
      this.isScienceStreamSelected = false; // hide  stream group
      this.streamGroupTypeLoad = false;
      this.selectedGroup = "";
      // reset stream previous group value
    }
    this.streamLoad = false;
    this.streamGroupTypeLoad = false;
  }
  // get students class and section wise
  getStudents() {
    const isClassSectionSelected =
      +this.selectedSection > 0 && +this.selectedClass > 0;

    if (isClassSectionSelected) {
      this.selectedStudent = '';
      this.studentLoad = true;
      const params = {
        classId: +this.selectedClass,
        sectionId: +this.selectedSection,
        schoolId: this.userProfile?.school,
      };
      this.questionBankService
        .getStudentsSchoolClassSectionWise(params)
        .subscribe({
          next: (response: any) => {
            this.studentData = response?.data;
            this.studentLoad = false;
            console.log(this.studentData);
          },
          error: (error: any) => {
            this.studentLoad = false;
          },
        });
    } else {
      this.selectedStudent = '';
      this.studentLoad = false;
    }
  }
  // file upload validation
  fileUploadHandler(event: any) {
    const uploadedImage = this.fileRef.nativeElement.files[0];
    if (uploadedImage != null) {
      if (uploadedImage.type != "application/pdf") {
        event.target.value = "";
        this.alertHelper.viewAlertHtml(
          "error",
          "Error",
          '<i class="bi bi-arrow-right text-danger"></i> File type should be pdf.'
        );
        return;
      }
      // max 2mb allowed
      if (uploadedImage.size / 1024 > 2048) {
        event.target.value = "";
        this.alertHelper.viewAlertHtml(
          "error",
          "Error",
          '<i class="bi bi-arrow-right text-danger"></i> File size should not be greater than 2 MB'
        );
        return;
      }
      this.answerSheetFile = uploadedImage;
    }
  }
  getTotalMark() {
    const validationArr = [
      +this.selectedAssesmentType > 0,
      +this.selectedClass > 0,
      +this.selectedSubject > 0,
      +this.selectedsetName > 0,

      +this.selectedClass > 10 ? +this.selectedStream > 0 : true,
      +this.selectedClass > 10 && +this.selectedStream === 3
        ? +this.selectedGroup > 0
        : true,
      this.userProfile?.school != 0 && this.userProfile?.school?.length > 0,
    ];

    if (!validationArr.includes(false)) {
      const params = {
        assessmentType: +this.selectedAssesmentType,
        classId: +this.selectedClass,
        subjectId: +this.selectedSubject,
        streamId: +this.selectedStream,
        groupId: +this.selectedGroup,
        setId: +this.selectedsetName,
        schoolId: this.userProfile?.school,
      };
      this.questionBankService.getTotalMark(params).subscribe({
        next: (response: any) => {
          this.totalMark = response?.totalMark;
        },
      });
    }
  }

  onSubmit() {
    const isValid = this.validate();
    if (isValid === true) {
      this.prepareFormData();
      this.alertHelper.submitAlert().then((result: any) => {
        if (result.value) {
          this.spinner.show();
          this.submitAnswerSheet();
        }
      });
    }
  }
  submitAnswerSheet() {
    this.spinner.show();

    this.questionBankService.submitAnswerSheet(this.formData).subscribe({
      next: (res: any) => {
        this.spinner.hide();

        if (res.success === true) {
          this.alertHelper.viewAlert("success", "Uploaded", res?.msg);
          this.onReset();
        } else {
          this.alertHelper.viewAlert("error", "", res?.msg);
        }
        this.spinner.hide(); //==== hide spinner
      },
      error: (error: any) => {
        this.spinner.hide(); //==== hide spinner
        this.errorHandler.serverSideErrorHandler(error); // server side error handler
      },
    });
  }
  // prepare form data
  prepareFormData() {
    const userProfile = this.commonserviceService.getUserProfile(); // get user profile
    this.formData.set("schoolId", userProfile?.school);
    this.formData.set("assessmentType", this.selectedAssesmentType);
    this.formData.set("classId", this.selectedClass);
    this.formData.set("subjectId", this.selectedSubject);
    this.formData.set("sectionId", this.selectedSection);
    this.formData.set("streamId", this.selectedStream);
    this.formData.set("groupId", this.selectedGroup);
    this.formData.set("setId", this.selectedsetName);
    this.formData.set("studentId", this.selectedStudent);
    this.formData.set("answerSheetFile", this.answerSheetFile);
    this.formData.set("totalMark", this.totalMark?.toString());
    this.formData.set("markObtained", this.markObtained?.toString());
    this.formData.set(
      "dateOfExam",
      this.commonFunctionHelper.formatDateHelper(this.dateOfExam)
    );
  }
  // validate fields
  validate(): boolean {
    if (!this.selectedAssesmentType) {
      this.selectedAssesmentTypeRef?.nativeElement?.focus();
      this.alertHelper.viewAlert(
        "error",
        "Invalid",
        "Please select assessment type."
      );
      return false;
    }

    if (!this.selectedClass) {
      this.selectedClassRef?.nativeElement?.focus();
      this.alertHelper.viewAlert("error", "Invalid", "Please select class.");
      return false;
    }

    if (parseInt(this.selectedClass) > 10 && !this.selectedStream) {
      this.selectedStreamRef?.nativeElement?.focus();
      this.alertHelper.viewAlert("error", "Invalid", "Please select stream");
      return false;
    }

    if (parseInt(this.selectedStream) === 3 && !this.selectedGroup) {
      this.selectedGroupRef?.nativeElement?.focus();
      this.alertHelper.viewAlert("error", "Invalid", "Please select group");
      return false;
    }

    if (!this.selectedSection) {
      this.selectedSectionRef?.nativeElement?.focus();
      this.alertHelper.viewAlert("error", "Invalid", "Please select section");
      return false;
    }

    if (!this.selectedSubject) {
      this.selectedSubjectRef?.nativeElement?.focus();
      this.alertHelper.viewAlert("error", "Invalid", "Please select subject");
      return false;
    }

    if (!this.selectedsetName) {
      this.selectedsetNameRef?.nativeElement?.focus();
      this.alertHelper.viewAlert("error", "Invalid", "Please select set name");
      return false;
    }

    if (!this.selectedStudent) {
      this.selectedStudentRef?.nativeElement?.focus();
      this.alertHelper.viewAlert("error", "Invalid", "Please select student");
      return false;
    }
    if (!this.answerSheetFile) {
      this.alertHelper.viewAlert(
        "error",
        "Invalid",
        "Please upload the scanned copy of the answer sheet"
      );
      return false;
    }
    if (!this.markObtained) {
      this.markObtainedRef.nativeElement?.focus();
      this.alertHelper.viewAlert(
        "error",
        "Invalid",
        "Please enter the total marks obtained"
      );
      return false;
    }
    if (parseInt(this.markObtained) > this.totalMark) {
      this.markObtainedRef.nativeElement?.focus();
      this.alertHelper.viewAlert(
        "error",
        "Invalid",
        "Obtained mark should not be greater than total mark."
      );
      return false;
    }
    return true;
  }

  onReset() {
    this.fileRef.nativeElement.value = ""; // reset file
    this.studentData = [];
    this.markObtained = null;
    this.totalMark = 0;
    this.selectedsetName = "";
    this.selectedSection = "";
    this.selectedSubject = "";
    this.selectedStream = "";
    this.selectedGroup = "";
    this.isClassGreaterThanTen = false;
    this.isScienceStreamSelected = false;
    this.selectedAssesmentType = '';
    this.selectedClass = '';
    this.ngOnInit();
  }
  getDistrict() {
    this.resetSelection(1);
    this.demographyData.disrtictChanged = true;
    this.commonserviceService.getAllDistrict().subscribe((res: any) => {
      // if demography data present prefill
      if (+this.userProfile?.district) {
        this.getBlock(+this.userProfile.district); // get block
        this.demographyData.districtData = res.data.filter((item: any) => {
          if (+item.districtId === +this.userProfile.district) {
            this.userInput.districtId = item?.districtId;
            return true;
          } else {
            this.userInput.districtId = "";
            return false;
          }
        });
      } else {
        // else show all
        this.demographyData.districtData = res.data;
      }
      this.demographyData.disrtictChanged = false;
    });
  }
  getBlock(districtId: number) {
    this.resetSelection(2);
    if (districtId) {
      this.demographyData.blockChanged = true;
      this.commonserviceService
        .getBlockByDistrictid(districtId)
        .subscribe((res: any) => {
          // if demography data present prefill
          if (+this.userProfile?.block) {
            this.getCluster(+this.userProfile.block); // get cluster
            this.demographyData.blockData = res.data.filter((item: any) => {
              if (+item.blockId === +this.userProfile.block) {
                this.userInput.blockId = item?.blockId;
                return true;
              } else {
                this.userInput.blockId = "";
                return false;
              }
            });
          } else {
            // else show all
            this.demographyData.blockData = res.data;
          }
          this.demographyData.blockChanged = false;
        });
    }
  }
  getCluster(blockId: number) {
    this.resetSelection(3);
    if (blockId) {
      this.demographyData.clusterChanged = true;
      this.commonserviceService
        .getClusterByBlockId(blockId)
        .subscribe((res: any = []) => {
          // if demography data present prefill
          if (+this.userProfile?.cluster) {
            this.getSchool(+this.userProfile.cluster); // get school
            this.demographyData.clusterData = res.data.filter((item: any) => {
              if (+item.clusterId === +this.userProfile.cluster) {
                this.userInput.clusterId = item?.clusterId;
                return true;
              } else {
                this.userInput.clusterId = "";
                return false;
              }
            });
          } else {
            // else show all
            this.demographyData.clusterData = res.data;
          }
          this.demographyData.clusterChanged = false;
        });
    }
  }

  getSchool(clusterId: any) {
    this.demographyData.schoolChanged = true;
    if (clusterId) {
      this.schoolService
        .getSchoolList({ clusterId })
        .subscribe((res: any = []) => {
          // if school login then prefill
          if (+this.userProfile?.udiseCode) {
            this.demographyData.schoolData = res.data.filter((item: any) => {
              if (+item.schoolUdiseCode === +this.userProfile.udiseCode) {
                this.userInput.schoolId = item?.schoolId;
                return true;
              } else {
                this.userInput.clusterId = "";
                return false;
              }
            });
          } else {
            // else show all
            this.demographyData.schoolData = res.data;
          }
          this.demographyData.schoolChanged = false;
        });
    }
  }
  resetSelection(type: number) {
    switch (type) {
      case 1:
        this.demographyData.districtData = [];
        this.demographyData.blockData = [];
        this.demographyData.clusterData = [];
        this.demographyData.schoolData = [];
        this.userInput.districtId = "";
        this.userInput.blockId = "";
        this.userInput.clusterId = "";
        this.userInput.schoolId = "";
        this.userInput.studentName = "";
        this.userInput.fatherName = "";
        this.userInput.motherName = "";
        this.userInput.dob = "";
        this.userInput.gender = "";
        break;
      case 2:
        this.demographyData.blockData = [];
        this.demographyData.clusterData = [];
        this.demographyData.schoolData = [];
        this.userInput.blockId = "";
        this.userInput.clusterId = "";
        this.userInput.schoolId = "";
        break;
      case 3:
        this.demographyData.clusterData = [];
        this.demographyData.schoolData = [];
        this.userInput.clusterId = "";
        this.userInput.schoolId = "";
        break;
      case 4:
        this.demographyData.schoolData = [];
        this.userInput.schoolId = "";
        break;
      default:
        break;
    }
  }
  classChangeHandler() {
    this.selectedStream = "";
    this.selectedGroup = "";
    this.getSubjects();
    this.getStudents();
    this.getTotalMark();
    this.sectionData = undefined;
    if (+this.selectedClass) {
      let param = {
        schoolId: this.userProfile.school,
        classId: this.selectedClass,
        academicYear: this.commonFunctionHelper.currentAcademicYear(),
      };
      this.getSection(param);
    }
  }
  // get class wise section
  getSection(param: any) {
    this.sectionLoad = true;
    this.schoolService.getSection(param).subscribe((res: any) => {
      //console.log(this.section);
      this.sectionData = res.data.sections;
      this.sectionLoad = false;
    });
  }
 
}
