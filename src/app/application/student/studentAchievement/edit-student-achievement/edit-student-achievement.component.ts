import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { ManageEventCategoryService } from "src/app/application/master/services/manage-event-category.service";
import { StudentAchievementService } from "../../services/student-achievement.service";
import { Constant } from "src/app/shared/constants/constant";
import { SchoolService } from "src/app/application/school/services/school.service";
import { formatDate } from "@angular/common";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { environment } from "src/environments/environment";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { CommonFunctionHelper } from "src/app/core/helpers/common-function-helper";
@Component({
  selector: "app-edit-student-achievement",
  templateUrl: "./edit-student-achievement.component.html",
  styleUrls: ["./edit-student-achievement.component.css"],
})
export class EditStudentAchievementComponent implements OnInit {
  public fileUrl = environment.filePath;
  @ViewChild("achivementImage")
  dropdownSettings: IDropdownSettings = {};
  studentAchivementImage!: ElementRef;
  public show: boolean = true;
  public buttonName: any = "Show";
  optionVal: any;
  optionstream: any;
  studentAchievementForm!: FormGroup;
  config = new Constant();
  clusterName: any = "";
  schoolName: any = "";
  blockName: any = "";
  districtName: any = "";
  villageName: any = "";
  schoolUdiseCode: any = "";
  schoolInfoData: any;
  academicYear: any = this.config.getAcademicCurrentYear();
  //academicYear:any ='';
  userId: any = "";
  profileId: any = "";
  eventTypeId: any = "";
  eventCategoryId: any = "";
  eventNameId: any = "";
  eventLevelId: any = "";
  eventDate: any;
  eventDateStr: any="";
  classId: any = "";
  streamId: any = "";
  groupId: any = "";
  prizeId: any = "";
  studentId: any;
  achivementImage: any;
  achievementDesc: any;
  encId: any;
  schoolId: any = "";
  classData: any = [];
  eventTypeData: any = [];
  eventCategoryData: any = [];
  eventNameData: any = [];
  streamData: any = [];
  groupData: any = [];
  studentData: any = [];
  levelData: any = [];
  prizeData: any = [];
  studentAchievementData: any = [];
  selectedItems: any = [];
  fileToUploadAchievement: any = "";
  achievementImageChange: boolean = false;
  imageUrlAchievement: any = "";
  isimageUrlAchievement: boolean = false;
  isimageUrlStudentAchievementDb: boolean = false;
  submitted: boolean = false;
  allLabel: string[] = [
    "",
    "",
    "",
    "",
    "",
    "Event type",
    "Event category",
    "Event name",
    "Level of event",
    "Event date",
    "",
    "Class",
    "Stream",
    "Group",
    "Prize",
    "Student name",
    "Image upload",
    "Description",
  ];
  sectionId: any = "";
  eventCategoryLoading: boolean = false;
  eventNameLoading: boolean = false;
  plPrivilege: string = "view"; //For menu privilege
  adminPrivilege: boolean = false;
  maxDate: any = Date;
  edate:any="";
  constructor(
    private commonFunctionHelper: CommonFunctionHelper,
    public customValidators: CustomValidators,
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private privilegeHelper: PrivilegeHelper, //For menu privilege
    private route: Router,
    private router: ActivatedRoute,
    private commonService: CommonserviceService,
    private manageEventCategoryService: ManageEventCategoryService, //eventtype
    private studentAchievementService: StudentAchievementService, //eventname
    private el: ElementRef,
    private schoolService: SchoolService
  ) {
    const pageUrl: any = this.route.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl); //For menu privilege
    this.commonService.verifyLinkPermission(
      pageUrl,
      this.config.linkType[2],
      this.config.privilege[4]
    ); // For authorization
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.spinner.show();
    if (this.plPrivilege == "admin") {
      this.adminPrivilege = true;
    }
    this.getEventType();
    this.encId = this.router.snapshot.params["encId"];
    this.editStudentAchievement(this.encId);
    const userProfile = this.commonService.getUserProfile();
    this.schoolId = userProfile?.school;
    this.userId = userProfile?.userId;
    this.profileId = userProfile?.profileId;
    if (this.schoolId !== 0 && this.schoolId !== "") {
      this.getSchoolInfo(this.schoolId, this.academicYear);
      this.getSchoolClasses(this.schoolId);
    } else {
      this.classData = [];
    }
    this.dropdownSettings = {
      idField: "studentId",
      textField: "studentName",
      enableCheckAll: true,
      selectAllText: "Select Student",
      unSelectAllText: "UnSelect Student",
      noDataAvailablePlaceholderText: "No data available",
      allowSearchFilter: true,
      itemsShowLimit: 3,
    };
    this.getAnxtData();
    this.getStream();
    this.getGroup();
    this.initializeForm();
  }
  ngAfterViewInit() {
    this.el.nativeElement.querySelector("[formControlName=eventTypeId]").focus();
  }
  getSchoolInfo(schoolId: any, academicYear: any) {
    this.spinner.show();
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
        this.spinner.hide();
      });
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
  getAnxtData() {
    this.commonService
      .getCommonAnnexture(["LVL", "PRIZE"])
      .subscribe((data: any = []) => {
        this.levelData = data?.data?.LVL;
        this.prizeData = data?.data?.PRIZE;
      });
  }
  getEventType() {
    this.manageEventCategoryService
      .getEventType()
      .subscribe((data: any = []) => {
        this.eventTypeData = data?.data;
      });
  }
  getEventCategoryAccordingToEventType(eventType: any) {
    this.studentAchievementForm.patchValue({
      eventCategoryId: "",
    });
    this.studentAchievementForm.patchValue({
      eventNameId: "",
    });
    this.eventCategoryData = [];
    this.eventNameData = [];
    this.eventCategoryLoading = true;
    const eventTypeId = eventType;
    if (eventTypeId != "") {
      this.studentAchievementService
        .getEventCategoryAccordingToEventType(eventTypeId)
        .subscribe((data: any = []) => {
          this.eventCategoryData = data?.data;
          this.eventCategoryLoading = false;
        });
    } else {
      this.eventCategoryLoading = false;
      this.eventCategoryData = [];
    }
  }
  getEventMasterAccordingToEventCategory(eventCategory: any) {
    this.studentAchievementForm.patchValue({
      eventNameId: "",
    });
    this.eventNameData = [];
    this.eventNameLoading = true;
    const eventCategoryId = eventCategory;
    if (eventCategoryId != "") {
      this.studentAchievementService
        .getEventMasterAccordingToEventCategory(eventCategoryId)
        .subscribe((data: any = []) => {
          this.eventNameData = data?.data;
          this.eventNameLoading = false;
        });
    } else {
      this.eventNameLoading = false;
      this.eventNameData = [];
    }
  }
  getStudents(
    schoolId: number,
    academicYear: string,
    classId: number,
    sectionId: number,
    streamId: number,
    groupId: number,
    eventDates:any
  ) {
    this.studentAchievementForm.patchValue({
      studentId: "",
    });
    this.studentData = [];
    // if(eventDates!=""){
    //   this.edate=eventDates
    // }else{
    //   this.edate=this.studentAchievementForm.get("eventDate")?.value;
    // }
   
    // console.log(this.studentAchievementForm.get("eventDate")?.value,"fafafaf",eventDates);
    //  if(this.edate!=null){
      //  let eventDates = this.commonFunctionHelper.formatDateHelper(this.edate);
          this.studentAchievementService
          .getStudents( 
            schoolId,
            academicYear,
            classId,
            sectionId,
            streamId,
            groupId,
            eventDates
          )
          .subscribe((data: any = []) => {
            this.studentData = data?.data;
            this.studentData.forEach((val: any, key: any) => {
              if (
                this.studentAchievementData.allStudentId.find(
                  (x: any) => x == val.studentId
                )
              ) {
                this.selectedItems.push({
                  studentId: val.studentId,
                  studentName: val.studentName,
                });
              }
            });
          });
        setTimeout(() => {
          this.patchValFunc();
        }, 500);
      // }else{
      //   this.studentAchievementForm.patchValue({
      //     classId: "",
      //   });
      //   this.el.nativeElement.querySelector("[formControlName=eventDate]").focus();
      //     this.alertHelper.viewAlert("error","Invalid","Choose event date first");
      //      return;
      // }
   
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
  classChange(val: any) {
    this.studentAchievementForm.patchValue({
      streamId: "",
    });
    this.studentAchievementForm.patchValue({
      groupId: "",
    });
    this.classId = val;
    this.getStudents(
      this.schoolId,
      this.academicYear,
      this.classId,
      this.sectionId,
      this.streamId,
      this.groupId,
      this.eventDate
    );
    if (this.classId == 11 || this.classId == 12) {
      this.getStream();
    } else {
      this.streamId = "";
      this.groupId = "";
    }
  }
  streamChange(val: any) {
    this.studentAchievementForm.patchValue({
      groupId: "",
    });
    this.streamId = val;
    this.getStudents(
      this.schoolId,
      this.academicYear,
      this.classId,
      this.sectionId,
      this.streamId,
      this.groupId,
      this.eventDate
    );
    if (this.streamId == 3) {
      this.getGroup();
    } else {
      this.groupId = "";
    }
  }
  groupChange(val: any) {
    this.groupId = val;
    this.getStudents(
      this.schoolId,
      this.academicYear,
      this.classId,
      this.sectionId,
      this.streamId,
      this.groupId,
      this.eventDate
    );
  }
  initializeForm() {
    this.studentAchievementForm = this.formBuilder.group({
      profileId: [this.profileId],
      userId: [this.userId],
      encId: [this.encId],
      schoolId: [this.schoolId],
      academicYear: [this.academicYear],
      eventTypeId: [this.eventTypeId, Validators.required],
      eventCategoryId: [this.eventCategoryId, Validators.required],
      eventNameId: [this.eventNameId, Validators.required],
      eventLevelId: [this.eventLevelId, Validators.required],
      eventDate: [this.eventDate, Validators.required],
      eventDateStr: [this.eventDateStr],
      classId: [this.classId, Validators.required],
      streamId: [this.streamId],
      groupId: [this.groupId],
      prizeId: [this.prizeId, Validators.required],
      studentId: [this.studentId, Validators.required],
      achivementImage: [this.achivementImage],
      achievementDesc: [this.achievementDesc, [Validators.maxLength(500),this.customValidators.firstCharValidatorRF]],
      fileSource: [""],
    });
  }
  handleFileInputAchievement(e: any) {
    let file = e.target.files;
    this.achievementImageChange = true;
    if (this.achievementImageChange == true) {
      this.studentAchievementForm.controls["achivementImage"].setValidators([
        Validators.nullValidator,
      ]);
      this.studentAchievementForm.controls[
        "achivementImage"
      ].updateValueAndValidity();
    }
    var ext = file[0].name.substring(file[0].name.lastIndexOf(".") + 1);
    if (ext == "jpg" || ext == "png" || ext == "jpeg"  || ext == "JPG" || ext == "PNG" || ext == "JPEG") {
      const fileSize = file[0].size;
      const fileSizeInKB = Math.round(fileSize / 1024);
      if (fileSizeInKB > 300) {
        this.alertHelper.viewAlert(
          "error",
          "Invalid",
          "Upload Image must be 300KB"
        );
        this.studentAchievementForm.patchValue({
          achivementImage: "",
        });
        return;
      } else {
        this.fileToUploadAchievement = file.item(0);
        let reader = new FileReader();
        reader.onload = (event: any) => {
          this.imageUrlAchievement = event.target.result;
          this.studentAchievementForm.patchValue({
            fileSource: this.imageUrlAchievement,
          });
        };
        reader.readAsDataURL(this.fileToUploadAchievement);
        this.isimageUrlAchievement = true;
        this.isimageUrlStudentAchievementDb = false;
      }
    } else {
      this.alertHelper.viewAlert("error", "Invalid", "Inavlid file format");
      this.studentAchievementForm.patchValue({
        achivementImage: "",
      });
      this.imageUrlAchievement = "";
      this.fileToUploadAchievement = Blob;
      this.isimageUrlAchievement = false;
    }
  }
  removeAchievementImage() {
    this.imageUrlAchievement = "";
    this.fileToUploadAchievement = Blob;
    this.isimageUrlAchievement = false;
    this.studentAchievementForm.patchValue({
      achivementImage: "",
    });
  }
  eventDateValidation() {
    let eventDate = this.studentAchievementForm.controls["eventDate"].value;
    const newDate = new Date();
    if (
      formatDate(eventDate, "yyyy-MM-dd", "en_US") >
      formatDate(newDate, "yyyy-MM-dd", "en_US")
    ) {
      this.alertHelper.viewAlert(
        "error",
        "Invalid",
        "Event date must not be above today's date"
      );
      this.studentAchievementForm.patchValue({
        eventDate: "",
      });
    }
  }
  editStudentAchievement(encId: any): void {
    this.spinner.show();
    this.studentAchievementService
      .getStudentAchievement(this.encId)
      .subscribe((res: any) => {
        this.studentAchievementData = res.data[0];
        this.encId = this.studentAchievementData.encId;
        this.academicYear = this.studentAchievementData.academicYear;
        this.eventTypeId = this.studentAchievementData.eventTypeId;
        this.eventCategoryId = this.studentAchievementData.eventCategoryId;
        this.eventNameId = this.studentAchievementData.eventNameId;
        this.eventLevelId = this.studentAchievementData.eventLevelId;
        this.eventDate = new Date(
          this.studentAchievementData.eventDate?.toString()
        );
        this.classId = this.studentAchievementData.classId;
        this.streamId = this.studentAchievementData.streamId;
        this.groupId = this.studentAchievementData.groupId;
        this.prizeId = this.studentAchievementData.prizeId;
        this.studentId = this.studentAchievementData.allStudentId;
        this.achievementDesc = this.studentAchievementData.achievementDesc;
        if (
          this.studentAchievementData.achivementImage !== "" &&
          this.studentAchievementData["achivementImage"] !== null
        ) {
          this.isimageUrlAchievement = true;
          var str = this.studentAchievementData.achivementImage;
          var newstr = str.replace(".", "~");
          this.imageUrlAchievement = this.fileUrl + "/" + newstr;
          this.achivementImage = this.studentAchievementData.achivementImage;
          this.isimageUrlStudentAchievementDb = true;
        }
        this.getEventCategoryAccordingToEventType(this.eventTypeId);
        this.getEventMasterAccordingToEventCategory(this.eventCategoryId);
        this.getStudents(
          this.schoolId,
          this.academicYear,
          this.classId,
          this.sectionId,
          this.streamId,
          this.groupId,
          this.eventDate
        );

        // const afterFormValidObserver = new Observable((observer) => {
        //   observer.next(this.getStudents(this.schoolId,this.academicYear,this.classId,this.sectionId,this.streamId,this.groupId));
        // });
        // afterFormValidObserver.subscribe({
        //   next: (isValid: any) => {
        //     this.patchValFunc();
        //   },
        // });
        // setTimeout(() => {
        //   this.spinner.show();
        //   this.studentAchievementForm.get("academicYear")?.patchValue(this.academicYear);
        //   this.studentAchievementForm.get("eventTypeId")?.patchValue(this.eventTypeId);
        //   this.studentAchievementForm.get("eventCategoryId")?.patchValue(this.eventCategoryId);
        //   this.studentAchievementForm.get("eventNameId")?.patchValue(this.eventNameId);
        //   this.studentAchievementForm.get("eventLevelId")?.patchValue(this.eventLevelId);
        //   this.studentAchievementForm.get("eventDate")?.patchValue(this.eventDate);
        //   this.studentAchievementForm.get("classId")?.patchValue(this.classId);
        //   this.studentAchievementForm.get("streamId")?.patchValue(this.streamId);
        //   this.studentAchievementForm.get("groupId")?.patchValue(this.groupId);
        //   this.studentAchievementForm.get("prizeId")?.patchValue(this.prizeId);
        //   this.studentAchievementForm.get("studentId")?.patchValue(this.selectedItems);
        //   this.studentAchievementForm.get("achievementDesc")?.patchValue(this.achievementDesc);
        //   this.studentAchievementForm.get("achivementImage")?.patchValue(this.achivementImage);
        //   this.studentAchievementForm.get("schoolId")?.patchValue(this.schoolId);
        //   this.studentAchievementForm.get("userId")?.patchValue(this.userId);
        //   this.spinner.hide();
        // }, 2000);
        // this.spinner.hide();
      });
  }
  patchValFunc() {
    this.studentAchievementForm
      .get("academicYear")
      ?.patchValue(this.academicYear);
    this.studentAchievementForm
      .get("eventTypeId")
      ?.patchValue(this.eventTypeId);
    this.studentAchievementForm
      .get("eventCategoryId")
      ?.patchValue(this.eventCategoryId);
    this.studentAchievementForm
      .get("eventNameId")
      ?.patchValue(this.eventNameId);
    this.studentAchievementForm
      .get("eventLevelId")
      ?.patchValue(this.eventLevelId);
    this.studentAchievementForm.get("eventDate")?.patchValue(this.eventDate);
    this.studentAchievementForm.get("classId")?.patchValue(this.classId);
    this.studentAchievementForm.get("streamId")?.patchValue(this.streamId);
    this.studentAchievementForm.get("groupId")?.patchValue(this.groupId);
    this.studentAchievementForm.get("prizeId")?.patchValue(this.prizeId);
    this.studentAchievementForm
      .get("studentId")
      ?.patchValue(this.selectedItems);
    this.studentAchievementForm
      .get("achievementDesc")
      ?.patchValue(this.achievementDesc);
    this.studentAchievementForm
      .get("achivementImage")
      ?.patchValue(this.achivementImage);
    this.studentAchievementForm.get("schoolId")?.patchValue(this.schoolId);
    this.studentAchievementForm.get("userId")?.patchValue(this.userId);
    this.spinner.hide();
  }
  updateStudentAchievement() {
    this.submitted = true;
    if (
      this.studentAchievementForm.get("classId")?.value == 11 ||
      this.studentAchievementForm.get("classId")?.value == 12
    ) {
      if (
        this.studentAchievementForm.controls["streamId"]?.value == "" ||
        this.studentAchievementForm.controls["streamId"]?.value == 0
      ) {
        this.el.nativeElement.querySelector("[formControlName=streamId]").focus();
        this.alertHelper.viewAlert("error","Invalid","Stream is required");
         return;
      }
    }
    if (this.studentAchievementForm.get("streamId")?.value == 3) {
      if (
        this.studentAchievementForm.controls["groupId"]?.value == "" ||
        this.studentAchievementForm.controls["groupId"]?.value == 0
      ) {
        this.el.nativeElement.querySelector("[formControlName=groupId]").focus();
        this.alertHelper.viewAlert("error","Invalid","Group is required");
        return;
      }
    }
    if ("INVALID" === this.studentAchievementForm.status) {
      for (const key of Object.keys(this.studentAchievementForm.controls)) {
        if (this.studentAchievementForm.controls[key].status === "INVALID") {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + key + '"]'
          );
          invalidControl.focus();
          this.customValidators.formValidationHandler(
            this.studentAchievementForm,
            this.allLabel
          );
          break;
        }
      }
    }
    if (this.studentAchievementForm.invalid) {
      return;
    }
    this.alertHelper.updateAlert().then((result: any) => {
      if (result.value) {
        this.spinner.show(); // ==== show spinner
        let eventDateString = this.commonFunctionHelper.formatDateHelper(
          this.studentAchievementForm.get("eventDate")?.value
        );
        this.studentAchievementForm.patchValue({
          eventDateStr: eventDateString,
        });
        this.studentAchievementService
          .updateStudentAchievement(this.studentAchievementForm.value)
          .subscribe({
            next: (res: any) => {
              this.spinner.hide(); //==== hide spinner
              this.alertHelper
                .successAlert(
                  "Saved!",
                  "Student achievement updated successfully.",
                  "success"
                )
                .then(() => {
                  this.route.navigate(["../../viewStudentAchievement"], {
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
            complete: () => console.log("done"),
          });
      }
    });
  }
  toggle() {
    this.show = !this.show;
    if (this.show) this.buttonName = "Hide";
    else this.buttonName = "Show";
  }
  formCancel(){
    this.route.navigate(["../../viewStudentAchievement"], {
      relativeTo: this.router,
    });
  }
}
