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
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { Constant } from "src/app/shared/constants/constant";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { SmartClassService } from "../../services/smart-class.service";
import { StudentMarkService } from "../../services/student-mark.service";

@Component({
  selector: "app-add-student-mark",
  templateUrl: "./add-student-mark.component.html",
  styleUrls: ["./add-student-mark.component.css"],
})
export class AddStudentMarkComponent implements OnInit {
  public show: boolean = true;
  public buttonName: any = "Show";
  isStudentData: boolean = false;
  emptyResult: boolean = false;
  noFilter: boolean = true;

  streamLoad: boolean = false;
  groupLoad: boolean = false;
  classLoad: boolean = false;
  sectionLoad: boolean = false;

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

  selectedStudentData: any = [];
  classData: any = [];
  classAnnextureData: any = [];
  streamData: any = [];
  groupData: any = [];
  sectionData: any = [];
  rawStudentData: any = [];
  studentData: any = [];
  subListingData: any = [];
  examTypeData: any = [];
  studentMarkSearchForm!: FormGroup;
  classId: any = "";
  sectionId: any = "";
  streamId: any = "";
  groupId: any = "";
  examType: any = "";
  studentName: any = "";
  allLabelForSearchForm: string[] = [
    "",
    "",
    "",
    "Exam type",
    "Class",
    "Stream",
    "Group",
    "Section",
   
  ];
  submitted: boolean = false;
  studentMarkForm!: FormGroup;
  subName: any = [];

  markLabels: any[] = this.getCustomizedLabelName("");
  checkAll: boolean = false;
  stdCode: any = "";
  plPrivilege:string="view"; //For menu privilege
  adminPrivilege: boolean = false;
  
  constructor(
    private commonService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private spinner: NgxSpinnerService,
    private schoolService: SchoolService,
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private alertHelper: AlertHelper,
    private smartClassService: SmartClassService,
    private studentMarkService: StudentMarkService,
    private el: ElementRef,
  ) {
    const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For authorization
  }

  newDataObj: any = "";

  allLabel: string[] = ["District"];

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    const userProfile = this.commonService.getUserProfile();
    this.schoolId = userProfile?.school;
    this.userId = userProfile?.userId;
    this.profileId = userProfile?.profileId;
    this.loginUserType = userProfile?.loginUserType;
    if (this.loginUserType == "SCHOOL") {
    } else {
    }
    if (this.schoolId !== 0 && this.schoolId !== "") {
      this.getSchoolInfo(this.schoolId, this.academicYear);
      this.getClass(this.schoolId);
    }
    this.getExamTypeData();
    this.initializeFormForSearch();
    
  }
  ngAfterViewInit() {
   this.el.nativeElement.querySelector('[formControlName="examType"]').focus();
  }

  initializeFormForSearch() {
    this.studentMarkSearchForm = this.formBuilder.group({
      userId: [this.userId],
      schoolId: [this.schoolId],
      academicYear: [this.academicYear],
      examType: [this.examType, Validators.required],
      classId: [this.classId, Validators.required],
      streamId: [this.streamId],
      groupId: [this.groupId],
      sectionId: [this.sectionId],
     
    });    
  }

  markDetails(index: number): FormArray {
    return this.studentMarkForm.get("studentMarkArray")?.value[index]
      ?.subject as FormArray;
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
  examTypeChange(val: any) {
    this.studentMarkSearchForm.patchValue({
      streamId: "",
    });
    this.studentMarkSearchForm.patchValue({
      groupId: "",
    });
    this.studentMarkSearchForm.patchValue({
      classId: "",
    });
    this.studentMarkSearchForm.patchValue({
      sectionId: "",
    });
    this.classId = "";
    this.classData = [];
    this.streamData = [];
    this.groupData = [];
    this.sectionData = [];
    this.examType = val;
    if (this.examType !== "") {
      this.getClassName(this.examType);
    }
  }
  getClass(schoolEncId: string) {
    if (schoolEncId !== "") {
      this.schoolService
        .getSchoolClasses(schoolEncId)
        .subscribe((res: any = []) => {
          this.classAnnextureData = res.data;
        });
    }
  }
  getClassName(examinationTypeId: any) {
    this.studentMarkSearchForm.patchValue({
      streamId: "",
    });
    this.studentMarkSearchForm.patchValue({
      groupId: "",
    });
    this.studentMarkSearchForm.patchValue({
      sectionId: "",
    });
    this.streamData = [];
    this.groupData = [];
    this.sectionData = [];
    this.classLoad = true;
    this.commonService
      .getClassByTermId(examinationTypeId)
      .subscribe((data: any = []) => {
        this.classData = data?.data[0]?.classId;
        const classArr = this.classAnnextureData.filter((item: any) =>
          this.classData.includes(item?.classId)
        );
        this.classData = classArr;
      });
      this.classLoad = false;
  }

  classChange(val: any) {
    this.studentMarkSearchForm.patchValue({ streamId: "" });
    this.studentMarkSearchForm.patchValue({ groupId: "" });
    this.studentMarkSearchForm.patchValue({ sectionId: "" });
    this.classId = val;
    if (this.classId !== "") {
      this.getSection(this.classId, this.schoolId, this.academicYear);
      if (this.classId == 11 || this.classId == 12) {
        this.getStream();
      }
    }
  }

  getStream() {
    this.streamLoad = true;
    this.commonService
      .getCommonAnnexture(["STREAM_TYPE"])
      .subscribe((data: any = []) => {
        this.streamData = data?.data?.STREAM_TYPE;
       
      });
      this.streamLoad = false;
  }

  getSection(classId: any, schoolId: any, academicYear: any) {
    this.sectionLoad = true;
    this.smartClassService
      .getSection(classId, schoolId, academicYear)
      .subscribe((data: any = []) => {
        this.sectionData = data;
        this.sectionData = this.sectionData.data["sections"];
       
      });
      this.sectionLoad = false;
  }

  streamChange(val: any) {
    this.studentMarkSearchForm.patchValue({
      groupId: "",
    });
    this.streamId = val;
    if (this.streamId == 3) {
      this.getGroup();
    } else {
      this.groupId = "";
    }
  }

  getGroup() {
    this.groupLoad = true;
    this.commonService
      .getCommonAnnexture(["STREAM_GROUP_TYPE"])
      .subscribe((data: any = []) => {
        this.groupData = data?.data?.STREAM_GROUP_TYPE;
       
      });
      this.groupLoad = false;
  }

  searchStudent() {
    this.submitted = true;
    this.noFilter = false;
    if (
      this.studentMarkSearchForm.get("classId")?.value == 11 ||
      this.studentMarkSearchForm.get("classId")?.value == 12
    ) {
      if (
        this.studentMarkSearchForm.controls["streamId"]?.value == "" ||
        this.studentMarkSearchForm.controls["streamId"]?.value == 0
      ) {
        this.el.nativeElement.querySelector("[formControlName=streamId]").focus();
         this.alertHelper.viewAlert("error","Invalid","Stream is required");         
         return;
      }
    }
    if (this.studentMarkSearchForm.get("streamId")?.value == 3) {
      if (
        this.studentMarkSearchForm.controls["groupId"]?.value == "" ||
        this.studentMarkSearchForm.controls["groupId"]?.value == 0
      ) {
        this.el.nativeElement.querySelector("[formControlName=groupId]").focus();
        this.alertHelper.viewAlert("error","Invalid","Group is required");
        return;
      }
    }
    this.customValidators.formValidationHandler(
      this.studentMarkSearchForm,
      this.allLabelForSearchForm
    );
    if (this.studentMarkSearchForm.valid === true) {
      this.initializeForm();
      this.spinner.show();
      this.studentMarkService
        .getStudentsForStudentMark(this.studentMarkSearchForm.value)
        .subscribe((data: any = []) => {
          this.spinner.hide();
          this.studentData = data?.data;
         
          var result = Object.keys(this.studentData).map(
            (key) => this.studentData[key]
          );
          console.log(result[0].groupId,"groupId");
          if(result[0].groupId>0){
            this.studentMarkForm.patchValue({
              groupId: result[0].groupId,
            });
          }
          this.newDataObj = result;
          if (result?.length) {
            this.isStudentData = true;
            this.emptyResult = false;
            this.rawStudentData = result;
            result.map((item: any, stdIndex: number) => {
              // this.stdCode = item.studentCode;
              this.subListingData = item?.subjectData;
              this.studentMarkInfo().push(
                this.formBuilder.group({
                  checkItem: [
                    {
                      value: false,
                      disabled: false,
                    },
                  ],
                  studentId: [
                    {
                      value: item.studentId,
                      disabled: item?.studentId,
                    },
                  ],
                  studentCode: [
                    {
                      value: item.studentCode,
                      disabled: item?.studentCode,
                    },
                  ],
                  studentName: [
                    {
                      value: item.studentName,
                      disabled: item?.studentName,
                    },
                  ],
                  fatherName: [
                    {
                      value: item.fatherName,
                      disabled: item?.fatherName,
                    },
                  ],
                  totalMark: [
                    {
                      value: item.totalMark,
                      disabled: item?.totalMark,
                    },
                  ],
                  securedMark: [
                    {
                      value: item.securedMark,
                      disabled: true,
                    },
                  ],
                  overAllPercentage: [
                    {
                      value: item.overAllPercentage + "%",
                      disabled: true,
                    },
                  ],
                  overAllGrade: [
                    {
                      value: item.overAllGrade,
                      disabled: true,
                    },
                  ],
                  stdSubArray: this.formBuilder.array([]),
                })
              );
              this.subListingData.map((subdata: any, sbIndex: number) => {
                this.stdSubInfo(stdIndex).push(
                  this.formBuilder.group({
                    thMark: [
                      {
                        value: subdata.thMark,
                        disabled: !subdata.isExist,
                      },
                      [
                        Validators.maxLength(5),
                        Validators.pattern(/^[0-9.]+$/),
                      ],
                    ],
                    theoryMark: [subdata.theoryMark],
                    prMark: [
                      {
                        value: subdata.prMark,
                        disabled: !subdata?.practicalMark || !subdata.isExist,
                      },
                      [
                        Validators.maxLength(5),
                        Validators.pattern(/^[0-9.]+$/),
                      ],
                    ],
                    isExist: [subdata.isExist],
                    practicalMark: [subdata.practicalMark],
                    fullMarkForSub: [subdata.fullMark],
                    grade: [
                      {
                        value: subdata.grade,
                        disabled: true,
                      },
                    ],
                    subjectId: [subdata.subjectId],
                  })
                );
              });
            });
          } else {
            this.emptyResult = true;
            this.isStudentData = false;
            this.initializeForm();
          }
        });
    }
  }
  initializeForm() {
    if (!this.examType) {
      this.examType = this.studentMarkSearchForm?.controls["examType"].value;
    }
    this.studentMarkForm = this.formBuilder.group({
      userId: [this.userId],
      profileId: [this.profileId],
      schoolId: [this.schoolId],
      academicYear: [this.academicYear],
      examType: [this.examType],
      classId: [this.classId],
      streamId: [this.streamId],
      groupId: [this.groupId],
      sectionId: [this.sectionId],
      studentMarkArray: this.formBuilder.array([]),
      // finalMarkArray: this.formBuilder.array([]),
      checkAll: [this.checkAll],
    });
  }
  studentMarkInfo(): FormArray {
    return this.studentMarkForm.get("studentMarkArray") as FormArray;
  }
  stdSubInfo(stdIndex: number): FormArray {
    return this.studentMarkInfo().at(stdIndex).get("stdSubArray") as FormArray;
  }
  // ====== get customized label names
  getCustomizedLabelName(levelName: string) {
    return [
      `${levelName}  :- Theory mark`,
      ``,
      `${levelName}  :- Practical mark`,
      ``,
      ``,
    ];
  }
  validateStdMarkData(): any {
    let allErrors: any = [];
    const stdMrkControls = this.studentMarkForm.get(
      "studentMarkArray"
    ) as FormArray;
    stdMrkControls.controls?.map((item: any, stdIndex: any) => {
      if (item?.controls?.checkItem.value == true) {
        const subMrkcontrol = stdMrkControls
          .at(parseInt(stdIndex))
          .get("stdSubArray") as FormArray;
        let authorityLevelsArr = <FormArray>subMrkcontrol;
        authorityLevelsArr.controls?.map((item: any, index: number) => {
          this.markLabels = this.getCustomizedLabelName(
            "SlNo. " +
              (parseInt(stdIndex) + 1) +
              " - " +
              this.subListingData[index]["subject"]
          );
          let errors = this.customValidators.formArrayValidationHandler(
            item,
            this.markLabels
          );
          if (errors.length > 0) {
            for (const indMsg of errors) {
              allErrors.push(indMsg);
            }
          }
        });
      }
    });
    if (allErrors.length > 0) {
      for (const emsg of allErrors) {
        this.alertHelper.viewAlert("error", "Invalid", emsg);
        return false;
      }
    } else {
      return true;
    }
  }
  checkUncheckAll() {
    // this.resetFormArray();
    const stdMrkControls: FormArray = this.studentMarkForm.get(
      "studentMarkArray"
    ) as FormArray;
    if (this.studentMarkForm.get("checkAll")?.value !== true) {
      let checkItem = true;
      stdMrkControls.controls?.map((item: any, stdIndex: any) => {
        item.get("checkItem")?.patchValue(checkItem);
      });
    } else {
      let checkItem = false;
      stdMrkControls.controls?.map((item: any, stdIndex: any) => {
        item.get("checkItem")?.patchValue(checkItem);
      });
    }
  }
  submitStudentMark() {
    this.selectedStudentData=[];
    const stdMrkControls: FormArray = this.studentMarkForm.get(
      "studentMarkArray"
    ) as FormArray;
    this.submitted = true;
    if (this.validateStdMarkData()) {
      //the below method is for check weather there is atleast one record checked
      if (this.studentMarkForm.get("checkAll")?.value !== '') {
        stdMrkControls.controls?.map((item: any, stdIndex: any) => {
          if( item.get("checkItem").value==true){
            this.selectedStudentData.push(item.get("studentId").value)
          }
        });
      }
    if(this.selectedStudentData.length>0){
      if (this.studentMarkForm.get("checkAll")?.value !== '') {
        stdMrkControls.controls?.map((item: any, stdIndex: any) => {
          if( item.get("checkItem").value==true){
            let emptyMarkcount=0;
            const subMrkcontrol = stdMrkControls.at(parseInt(stdIndex)).get("stdSubArray") as FormArray;
            subMrkcontrol.controls?.map((subItem: any, subIndex: any) => { 
              // console.log(subItem,":::each sub data")
              if(subItem.get("thMark").value!="" || subItem.get("prMark").value!=""){
                 emptyMarkcount++;
              }
             });
            //console.log(emptyMarkcount,"::empty count")
            if(emptyMarkcount==0){
              this.alertHelper.successAlert(
                "Invalid",
                "Please mention at least one subject mark on checked student",
                "error"
              );
            }else{
                this.alertHelper.submitAlert().then((result: any) => {
                if (result.value) {
                  this.spinner.show(); // ==== show spinner
                  this.studentMarkService
                    .saveStudentMark(this.studentMarkForm.getRawValue())
                    .subscribe({
                      next: (res: any) => {
                        this.spinner.hide(); //==== hide spinner
                        this.alertHelper
                          .successAlert(
                            "Saved!",
                            "Student(s) mark saved successfully.",
                            "success"
                          )
                          .then(() => {
                            this.initializeForm();
                            this.isStudentData = false;
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
        });
      }
      // this.alertHelper.submitAlert().then((result: any) => {
      //   if (result.value) {
      //     this.spinner.show(); // ==== show spinner
      //     this.studentMarkService
      //       .saveStudentMark(this.studentMarkForm.getRawValue())
      //       .subscribe({
      //         next: (res: any) => {
      //           this.spinner.hide(); //==== hide spinner
      //           this.alertHelper
      //             .successAlert(
      //               "Saved!",
      //               "Student(s) mark saved successfully.",
      //               "success"
      //             )
      //             .then(() => {
      //               this.initializeForm();
      //               this.isStudentData = false;
      //             });
      //         },
      //         error: (error: any) => {
      //           this.spinner.hide(); //==== hide spinner
      //           let errorMessage: string = "";
      //           if (typeof error.error.msg === "string") {
      //             errorMessage +=
      //               '<i class="bi bi-arrow-right text-danger"></i> ' +
      //               error.error.msg +
      //               `<br>`;
      //           } else {
      //             error.error.msg.map(
      //               (message: string) =>
      //                 (errorMessage +=
      //                   '<i class="bi bi-arrow-right text-danger"></i> ' +
      //                   message +
      //                   `<br>`)
      //             );
      //           }
      //           this.alertHelper.viewAlertHtml(
      //             "error",
      //             "Invalid inputs",
      //             errorMessage
      //           );
      //         },
      //       });
      //   }
      // });
    }else{
      this.alertHelper.successAlert(
        "Invalid",
        "Please check atleast one record.",
        "error"
      );
    }      
   }
  }
  toggle() {
    this.show = !this.show;
    if (this.show) this.buttonName = "Hide";
    else this.buttonName = "Show";
  }
  checkTotalMark(
    stdIndex: number,
    subIndex: number,
    securedMark: any,
    totalMark: any
  ) {
    if (parseInt(securedMark.value) > parseInt(totalMark?.value)) {
      let msg =
        "Mark obtained can't be greater than full mark(" +
        totalMark?.value +
        ") !!!";
      this.alertHelper
        .successAlert("Invalid", msg, "error")
        .then((res: any) => {
          securedMark.focus();
        });
    } else {
      this.calculateTotalSecuredMark(stdIndex);
    }
  }
  calculateTotalSecuredMark(stdIndex: number) {
    const stdMrkControls = this.studentMarkForm.get(
      "studentMarkArray"
    ) as FormArray;
    const subMrkcontrol = stdMrkControls
      .at(stdIndex)
      .get("stdSubArray") as FormArray;
    let sum = 0;
    Object.keys(subMrkcontrol.controls).forEach((key) => {
      sum +=
        subMrkcontrol.at(parseInt(key)).get("thMark")?.value > 0
          ? parseFloat(subMrkcontrol.at(parseInt(key)).get("thMark")?.value)
          : 0;
      sum +=
        subMrkcontrol.at(parseInt(key)).get("prMark")?.value > 0
          ? parseFloat(subMrkcontrol.at(parseInt(key)).get("prMark")?.value)
          : 0;
    });
    stdMrkControls.at(stdIndex).get("securedMark")?.patchValue(sum);
  }
  CalculateGrade(stdIndex: number, subIndex: number) {
    const stdMrkControls = this.studentMarkForm.get(
      "studentMarkArray"
    ) as FormArray;
    const subMrkcontrol = stdMrkControls
      .at(stdIndex)
      .get("stdSubArray") as FormArray;
    let prMark =
      subMrkcontrol.at(subIndex).get("prMark")?.value > 0
        ? parseFloat(subMrkcontrol.at(subIndex).get("prMark")?.value)
        : 0;
    let thMark =
      subMrkcontrol.at(subIndex).get("thMark")?.value > 0
        ? parseFloat(subMrkcontrol.at(subIndex).get("thMark")?.value)
        : 0;
    let fullMarkForSub =
      subMrkcontrol.at(subIndex).get("fullMarkForSub")?.value > 0
        ? parseFloat(subMrkcontrol.at(subIndex).get("fullMarkForSub")?.value)
        : 0;
    let grade = "";
    let total: string | number = thMark + prMark;
    let percentage: string | number = (total * 100) / fullMarkForSub;
    if (percentage < 33) {
      grade = "E";
    } else if (percentage < 41) {
      grade = "D";
    } else if (percentage < 61) {
      grade = "C";
    } else if (percentage < 81) {
      grade = "B";
    } else {
      grade = "A";
    }
    subMrkcontrol.at(subIndex).get("grade")?.patchValue(grade);
    let totalMark =
      stdMrkControls.at(stdIndex).get("totalMark")?.value > 0
        ? parseFloat(stdMrkControls.at(stdIndex).get("totalMark")?.value)
        : 0;
    let securedMark =
      stdMrkControls.at(stdIndex).get("securedMark")?.value > 0
        ? parseFloat(stdMrkControls.at(stdIndex).get("securedMark")?.value)
        : 0;
    let overAllGrade = "";
    let overAllPercentage: any = ((securedMark * 100) / totalMark).toFixed(2);
    if (overAllPercentage < 33) {
      overAllGrade = "E";
    } else if (overAllPercentage < 41) {
      overAllGrade = "D";
    } else if (overAllPercentage < 61) {
      overAllGrade = "C";
    } else if (overAllPercentage < 81) {
      overAllGrade = "B";
    } else {
      overAllGrade = "A";
    }
    stdMrkControls.at(stdIndex).get("overAllGrade")?.patchValue(overAllGrade);
    stdMrkControls
      .at(stdIndex)
      .get("overAllPercentage")
      ?.patchValue(overAllPercentage);
  } 
  getExamTypeData() {
    this.commonService
      .getCommonAnnexture(["EXAM_TERM_TYPE"])
      .subscribe((data: any = []) => {
        this.examTypeData = data?.data?.EXAM_TERM_TYPE
      });
  }
}
