import { Component, ElementRef, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ManageStudentGradeService } from 'src/app/application/master/services/manage-student-grade.service';
import { ManageexaminationmasterService } from 'src/app/application/master/services/manageexaminationmaster.service';
import { QuestionBankService } from 'src/app/application/question-bank/services/question-bank.service';
import { SchoolService } from 'src/app/application/school/services/school.service';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { RemedialTrainningService } from '../../services/remedial-trainning.service';

@Component({
  selector: 'app-add-remedial-training',
  templateUrl: './add-remedial-training.component.html',
  styleUrls: ['./add-remedial-training.component.css']
})
export class AddRemedialTrainingComponent implements OnInit {
  public show:boolean = true;
  public buttonName:any = 'Show';
  isVisible: any;
  isSelected: boolean = true;
  subjectLoad:boolean = false;
  streamLoad:boolean = false;
  groupLoad:boolean = false;
  classLoad:boolean = false;

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

  classData: any;
  streamData: any;
  groupData: any;
  subjectData: any;
  studentData: any;
  gradeData: any;
  remedialTrainingSearchForm!: FormGroup; 
  classId: any = "";
  classAnnextureData: any = "";
  streamId: any = "";
  groupId: any = "";
  examType: any = "";
  subjectId: any = "";
  grade: any = "";
  isCatchupClass: any = "2";
  allLabelForSearchForm: string[] = [
    "","","","Exam type","Catchup class","Class","Stream","Group","Subject","Grade"
  ];
  submitted : boolean = false;
  isStudentData: boolean = false;
  emptyResult: boolean = false;
  disableFields: boolean = false; 
  checkAllBox : boolean = false;
  
  remedialId:any = [];
  remedialTrainingForm!: FormGroup; 
  studentName: any = "";
  className: any = "";
  subjectName: any = "";
  gradeName: any = "";
  checkAll: any = "";
  
  examTypeData: any = [];
  classWiseSubjects!: any;
  isClassGreaterThanTen: boolean = false;
  allLabel: string[] = [
   "","","","","Exam type","Catchup class","Class","Stream","Group","Subject","Grade","","Atleast check one record",""
   ];
   public permissionForAdd: boolean = false;
   public CheckAllBUttonHide: boolean = false;
   plPrivilege:string="view"; //For menu privilege
   adminPrivilege: boolean = false;
   selectedData:any=[];
   selectedCheckValue:any=[];
   checkedData:any=[];
   checkItem : boolean = false;
   remedialTrainingId: any = "";
  constructor(
    private commonService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private el: ElementRef,
    private activatedRoute:ActivatedRoute,
    private spinner: NgxSpinnerService,
    private schoolService: SchoolService,
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private alertHelper: AlertHelper,
    public manageexaminationmasterservice:ManageexaminationmasterService,
    private managestudentgradeservice:ManageStudentGradeService,
    private remedialTrainningService:RemedialTrainningService,
    private questionBankService: QuestionBankService,
  ) {
    const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For authorization
   }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    const userProfile = this.commonService.getUserProfile();
    this.schoolId = userProfile?.school;
    this.userId = userProfile?.userId;
    this.profileId = userProfile?.profileId;
    this.loginUserType = userProfile?.loginUserType;
    if(this.loginUserType == "SCHOOL"){
      this.permissionForAdd=true;
    }else{
      this.permissionForAdd=false;
    }
    if (this.schoolId !== 0 && this.schoolId !== "") {
      this.getSchoolInfo(this.schoolId, this.academicYear);
      this.getSchoolClasses(this.schoolId);
    }
    if(this.isCatchupClass==2){
      this.getExamTypeData();
      this.getStudentGrade();
    }
    this.initializeFormForSearch();
    this.initializeForm();

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
  initializeFormForSearch() {
    this.remedialTrainingSearchForm = this.formBuilder.group({
      userId: [this.userId],
      schoolId: [this.schoolId],
      academicYear: [this.academicYear],
      examType: [this.examType,Validators.required],
      isCatchupClass: [this.isCatchupClass,Validators.required],
      classId: [this.classId, Validators.required],
      streamId: [this.streamId],
      groupId: [this.groupId],
      subjectId: [this.subjectId,Validators.required],
      grade: [this.grade,Validators.required], 
    });
  }
  initializeForm() {
    this.remedialTrainingForm = this.formBuilder.group({
      userId: [this.userId],
      profileId: [this.profileId],
      schoolId: [this.schoolId],
      academicYear: [this.academicYear],
      examType: [this.examType],
      isCatchupClass: [this.isCatchupClass],
      classId: [this.classId],
      streamId: [this.streamId],
      groupId: [this.groupId],
      subjectId: [this.subjectId],
      grade: [this.grade],
      studentRemedialArray: this.formBuilder.array([]),
      finalRemedialArray: this.formBuilder.array([]),
      checkAll:[this.checkAll],
    });
  }
  getSchoolClasses(schoolEncId:string) {
    if(schoolEncId !== ''){
      this.schoolService.getSchoolClasses(schoolEncId).subscribe((res : any = []) => {
        this.classAnnextureData = res.data;
      });
    }
  }
  isCatchupClassControl(val: any) {
    this.isStudentData = false;
    this.emptyResult = true;
    this.remedialTrainingSearchForm.patchValue({
      examType: "",
    });
    this.remedialTrainingSearchForm.patchValue({
      classId: "",
    });
    this.remedialTrainingSearchForm.patchValue({
      streamId: "",
    });
    this.remedialTrainingSearchForm.patchValue({
      groupId: "",
    });
    this.remedialTrainingSearchForm.patchValue({
      subjectId: "",
    });
    this.remedialTrainingSearchForm.patchValue({
      grade: "",
    });
    this.classData=[];
    this.examTypeData=[];
    this.classWiseSubjects=[];
    this.classId="";
    this.isCatchupClass = val;
    if(this.isCatchupClass==1){
      this.remedialTrainingSearchForm?.controls["examType"].setValidators([
        Validators.nullValidator
      ]);
      this.remedialTrainingSearchForm?.controls["grade"].setValidators([
        Validators.nullValidator
      ]);
      this.remedialTrainingSearchForm?.controls["examType"].updateValueAndValidity();
      this.remedialTrainingSearchForm?.controls["grade"].updateValueAndValidity();
      this.classData=this.classAnnextureData;
    }else{
      this.remedialTrainingSearchForm?.controls["examType"].setValidators([
        Validators.required,
      ]);
      this.remedialTrainingSearchForm?.controls["grade"].setValidators([
        Validators.required,
      ]);
      this.remedialTrainingSearchForm?.controls["examType"].updateValueAndValidity();
      this.remedialTrainingSearchForm?.controls["grade"].updateValueAndValidity();
      this.getExamTypeData();
      this.getStudentGrade();
    }
  }
  getExamTypeData() {
    this.commonService
      .getCommonAnnexture(["EXAM_TERM_TYPE"])
      .subscribe((data: any = []) => {
        this.examTypeData = data?.data?.EXAM_TERM_TYPE
      });
  }
  examTypeChange(val: any) {
    this.remedialTrainingSearchForm.patchValue({
      streamId: "",
    });
    this.remedialTrainingSearchForm.patchValue({
      groupId: "",
    });
    this.remedialTrainingSearchForm.patchValue({
      classId: "",
    });
    this.classId = "";
    this.classData=[];
    this.streamData=[];
    this.groupData=[];
    this.classWiseSubjects=[];
    this.examType = val;
    if (this.examType !== "") {
      this.getClassName(this.examType);
    } else {
      this.remedialTrainingSearchForm.patchValue({
        classId: "",
      });
      this.remedialTrainingSearchForm.patchValue({
        streamId: "",
      });
      this.remedialTrainingSearchForm.patchValue({
        groupId: "",
      });
    }
  }
  getClassName(examinationTypeId: any) {
    this.remedialTrainingSearchForm.patchValue({
      streamId: "",
    });
    this.remedialTrainingSearchForm.patchValue({
      groupId: "",
    });
    this.streamData=[];
    this.groupData=[];

    this.classLoad = true;
    this.commonService.getClassByTermId(examinationTypeId).subscribe((data: any = []) => {
      this.classData = data?.data[0]?.classId;
      const classArr = this.classAnnextureData.filter((item: any) => this.classData.includes(item?.classId))
      this.classData = classArr;
     
    });
    this.classLoad = false;
  }
  classChange(val: any) {
    this.remedialTrainingSearchForm.patchValue({
      streamId: "",
    });
    this.remedialTrainingSearchForm.patchValue({
      groupId: "",
    });
    this.classId = val;
    this.streamId = "";
    if (this.classId !== "") {

      if (this.classId == 11 || this.classId == 12) {
        this.getStream();
      }
    } else {
      this.remedialTrainingSearchForm.patchValue({
        classId: "",
      });
      this.remedialTrainingSearchForm.patchValue({
        streamId: "",
      });
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
  streamChange(val: any) {
    this.remedialTrainingSearchForm.patchValue({
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
  // ===== get class wise subjects
  getSubjects() {
    this.remedialTrainingSearchForm.patchValue({
      subjectId: "",
    });

    const classStreamGroupObj = {
      selectedClassId: parseInt(this.remedialTrainingSearchForm.getRawValue()?.classId),
      selectedStreamId: parseInt(this.remedialTrainingSearchForm.getRawValue()?.streamId),
      selectedGroupId: parseInt(this.remedialTrainingSearchForm.getRawValue()?.groupId),
    };
    if (
      classStreamGroupObj.selectedClassId > 10 &&
      classStreamGroupObj.selectedStreamId == 3 &&
      classStreamGroupObj.selectedGroupId > 0
    ) {
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
    } else {
      this.classWiseSubjects = undefined;
    }
    // 1) get subjects of the selected class
    // 2) if class greater than 10 show stram field
    if (classStreamGroupObj.selectedClassId > 10) {
      this.isClassGreaterThanTen = true;
    } else {
      this.isClassGreaterThanTen = false; //else hide
    }
    if (classStreamGroupObj.selectedClassId < 11) {
      // reset stream and group previous stream value
      this.remedialTrainingSearchForm.patchValue({
        streamId: "",
      });
      this.remedialTrainingSearchForm.patchValue({
        groupId: "",
      });
    }
  }

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
  getStudentGrade()
  {
      this.managestudentgradeservice
      .viewStudentGradeMaster()
      .subscribe((data: any) => {
        this.gradeData = data.data;
       
      });
 }
 studentRemedialInfo(): FormArray {
  return this.remedialTrainingForm.get("studentRemedialArray") as FormArray;
}
  searchStudent(){
    this.submitted = true;  
    if(this.remedialTrainingSearchForm){
      this.customValidators.formValidationHandler(
        this.remedialTrainingSearchForm,
        this.allLabelForSearchForm,
        this.el
      );
    }
    
    if (this.remedialTrainingSearchForm.get("classId")?.value == 11 || this.remedialTrainingSearchForm.get("classId")?.value == 12){
      if(this.remedialTrainingSearchForm.controls["streamId"]?.value == '' || this.remedialTrainingSearchForm.controls["streamId"]?.value == 0) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="streamId"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","Stream required");
        return;
        }
    }
    if(this.remedialTrainingSearchForm.get("streamId")?.value == 3){
      if(this.remedialTrainingSearchForm.controls["groupId"]?.value == '' || this.remedialTrainingSearchForm.controls["groupId"]?.value == 0) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="streamId"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","Group required");
        return;
        }
    }
    if (this.remedialTrainingSearchForm.valid === true) {
      this.remedialId=[];
      this.initializeForm();
      this.remedialTrainningService
        .getStudentsForRemedialTraining(this.remedialTrainingSearchForm.value)
        .subscribe((data: any = []) => {
          this.studentData = data?.data;
          if (this.studentData?.length) {
            this.remedialTrainingForm.patchValue({
              examType: this.studentData[0].examType,
            });
            this.remedialTrainingForm.patchValue({
              classId: this.studentData[0].classId,
            });
            this.remedialTrainingForm.patchValue({
              streamId: this.studentData[0].streamId,
            });
            this.remedialTrainingForm.patchValue({
              groupId: this.studentData[0].groupId,
            });
            this.remedialTrainingForm.patchValue({
              subjectId: this.studentData[0].subject,
            });
            this.remedialTrainingForm.patchValue({
              grade: this.studentData[0].grade,
            });
            this.remedialTrainingForm.patchValue({
              isCatchupClass: this.studentData[0].isCatchupClass,
            });
            this.isStudentData = true;
            this.emptyResult = false;
            this.studentData.map((item: any) => {
              this.remedialId.push(item?.remedialTrainingId)
              
              this.studentRemedialInfo().push(
                this.formBuilder.group({
                  checkItem: [
                    {
                      value: this.checkItem,
                      disabled: false,
                    },
                  ],
                  studentId: [item.studentId],
                  remedialTrainingId: [item.remedialTrainingId],
                  studentCode: [
                    {
                      value:item.studentCode,
                      disabled: item?.studentCode,
                    },
                  ],
                  studentName: [
                    {
                      value:item.studentName,
                      disabled:item?.studentName,
                    },
                  ],
                  gender: [
                    {
                      value:item.gender,
                      disabled:item?.gender,
                    },
                  ],
                })
              );
            }); 
              setTimeout(() => {
              }, 1200);
          } else {
            this.isStudentData = false;
            this.emptyResult = true;
             this.initializeForm();
          }
        });
    }
  }
  onCheckboxChange(index: number, event: any) {
    const finalRemedialArray: FormArray = this.remedialTrainingForm.get(
      "finalRemedialArray"
    ) as FormArray;
   
    if(event.target.checked) {
      finalRemedialArray.push(new FormControl(this.remedialTrainingForm?.getRawValue()?.studentRemedialArray[index]));
    } else {
      let i: number = 0;
     finalRemedialArray.controls.forEach((item: any) => {
        if (item?.value.studentId == event.target.value) {
          finalRemedialArray.removeAt(i);
          return;
        }
        i++;
      });    
    }
    
  }

  // checkUncheckAll(){
  //   this.resetFormArray();
  //   if(this.remedialTrainingForm.get("checkAll")?.value !== true){
  //     const finalRemedialArray: FormArray = this.remedialTrainingForm.get('finalRemedialArray') as FormArray;
  //     this.studentData.forEach((eachdata: any) => {
  //       finalRemedialArray.push(new FormControl(eachdata));
  //         eachdata.isChecked = true;
  //     });
  //   }
  // }
  resetFormArray(){
    this.studentData.forEach((eachdata: any) => {
      eachdata.isChecked = false;
    });
    (this.remedialTrainingForm.get('finalRemedialArray') as FormArray).clear();
  }
  submitRemedialTraining(){
    this.checkedData=[];
    const studentRemedialArray: FormArray = this.remedialTrainingForm.get(
      "studentRemedialArray"
    ) as FormArray; 
    this.submitted = true;  
    if(this.remedialTrainingForm.invalid){
      this.customValidators.formValidationHandler(
        this.remedialTrainingForm,
        this.allLabel,
        this.el
      );
    }
    studentRemedialArray?.controls?.map((item: any,arIndex:any) => { 
      if(item.get("checkItem").value==true && item.get("remedialTrainingId").value==""){
        this.checkedData.push(item.get("studentId").value)
      }
    });
    if(this.checkedData.length>0){
      if (this.remedialTrainingForm.valid === true) {
        this.alertHelper.submitAlert().then((result: any) => {
          if (result.value) {
            this.spinner.show(); // ==== show spinner
            this.remedialTrainningService
              .addRemedialTraining(this.remedialTrainingForm.value)
              .subscribe({
                next: (res: any) => {
                  this.spinner.hide(); //==== hide spinner
                  this.alertHelper
                    .successAlert(
                      "Saved!",
                      "Remedial training  created successfully.",
                      "success"
                    )
                    .then(() => {
                      // this.router.navigate(["./../viewRemedialTraining"], {
                      //   relativeTo: this.activatedRoute,
                      // });
                      this.remedialTrainingSearchForm.patchValue({
                        examType: "",
                      });
                      this.remedialTrainingSearchForm.patchValue({
                        streamId: "",
                      });
                      this.remedialTrainingSearchForm.patchValue({
                        groupId: "",
                      });
                      this.remedialTrainingSearchForm.patchValue({
                        classId: "",
                      });
                      this.remedialTrainingSearchForm.patchValue({
                        isCatchupClass: 2,
                      });
                      this.initializeFormForSearch();
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
                complete: () => console.log("done"),
              });
          }
        });
        }
    }else{
      this.alertHelper.viewAlert(
        "error",
        "Invalid",
        "Please select atleast one record"
      );
    }
    
  }
  checkUncheckAll() {
    const studentRemedialArray: FormArray = this.remedialTrainingForm.get(
      "studentRemedialArray"
    ) as FormArray; 
    if (this.remedialTrainingForm.get("checkAll")?.value !== true) {
      let checkItem = true;
      this.checkAll = true;
      this.remedialTrainingForm.get("checkAll")?.patchValue(checkItem);
      studentRemedialArray?.controls?.map((item: any) => { 
        // console.log(item.get("checkItem"),"item");
        if(item.get("remedialTrainingId").value==""){
          item.get("checkItem")?.patchValue(checkItem);
          if(item.get("checkItem").value==true){
            this.selectedData.push(item.get("studentId").value)
          }
        }
      });
    } else {
      let checkItem = false;
      this.checkAll = false;
      this.remedialTrainingForm.get("checkAll")?.patchValue(checkItem);
      studentRemedialArray?.controls?.map((item: any,arIndex:any) => { 
        if(item.get("remedialTrainingId").value==""){
          item.get("checkItem")?.patchValue(checkItem);
          if(item.get("checkItem").value==true){
            this.selectedData.push(item.get("studentId").value)
          }
          else{
            this.selectedData=[];
          }
        }

      });
    }
  }
  singlecheckUncheck(event:any){
    const studentRemedialArray: FormArray = this.remedialTrainingForm.get(
      "studentRemedialArray"
    ) as FormArray;
    const selectData:any=[];
    const totalData:any=[];
    let chkItemTrue = true;
    let chkItemFalse = false;
    if(studentRemedialArray?.at(event)?.get("checkItem")?.value==true){
      studentRemedialArray?.at(event)?.get("checkItem")?.patchValue(chkItemFalse);
    }else{
      studentRemedialArray?.at(event)?.get("checkItem")?.patchValue(chkItemTrue);
    }
    studentRemedialArray?.controls?.map((subItem:any) => {
       if(subItem.get("remedialTrainingId").value==""){      
        totalData.push(subItem.get("studentId").value)
      }
      if(subItem.get("checkItem").value==true  && subItem.get("remedialTrainingId").value==""){      
        selectData.push(subItem.get("studentId").value)
      }
    });
    if(selectData.length==totalData.length){
      let checkItem = true;
      this.checkAll = true;
      this.remedialTrainingForm.get("checkAll")?.patchValue(checkItem);
    }else{
      let checkItem = false;
      this.checkAll = false;
      this.remedialTrainingForm.get("checkAll")?.patchValue(checkItem);
    }
  }
  toggle() { 
    this.show = !this.show;
    if(this.show)  
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }
}
