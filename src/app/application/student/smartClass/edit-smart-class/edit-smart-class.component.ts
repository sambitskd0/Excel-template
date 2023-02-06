import { Component, OnInit, ElementRef } from '@angular/core';
import { Constant } from 'src/app/shared/constants/constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { SmartClassService } from '../../services/smart-class.service';
import { QuestionBankService } from 'src/app/application/question-bank/services/question-bank.service';
import { SchoolService } from 'src/app/application/school/services/school.service';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';

@Component({
  selector: 'app-edit-smart-class',
  templateUrl: './edit-smart-class.component.html',
  styleUrls: ['./edit-smart-class.component.css']
})
export class EditSmartClassComponent implements OnInit {
  smartClassForm!: FormGroup;
  submitted = false;
   plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  
  academicYear:any = this.config.getAcademicCurrentYear();
  schoolId:any="";
  classId:any="";
  streamId:any="";
  groupId:any="";
  //sectionId:any="";
  classTypeId:any="";
  subjectId:any="";
  encId:any="";
  userId:any="";
  profileId:any="";
  classData:any;
  classTypeData:any;
  streamData:any;
  groupData:any;
  sectionData:any;
  subjectData:any;
  id:any;
  smartClassData:any;
  classWiseSubjects!: any;
  subjectLoad: boolean = false;
  streamLoad: boolean = false;
  groupLoad: boolean = false;
  isClassGreaterThanTen: boolean = false;
  streamGroupTypeLoad: boolean = false;
  adminPrivilege: boolean = false;
  allLabel: string[] = ["","","Class", "Stream", "Group", "Section", "Class type", "Subject","","",""];
  constructor(
    public customValidators: CustomValidators, 
    private formBuilder: FormBuilder, 
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService, 
    private privilegeHelper: PrivilegeHelper,   //For menu privilege 
    private route:Router,
    private router: ActivatedRoute,
    private commonService: CommonserviceService, 
    private el: ElementRef ,
    private smartClassService: SmartClassService,
    private questionBankService: QuestionBankService,
    private schoolService:SchoolService,
  ) { 
    const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization  
  }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    this.id = this.router.snapshot.params["encId"];
    const userProfile = this.commonService.getUserProfile();
    this.userId=userProfile?.userId;
    this.schoolId=userProfile?.school;
    this.profileId=userProfile?.profileId;
    this.initializeForm();
    this.editSmartClass(this.id);
  }
  getSchoolClasses(schoolEncId:string) {
    if(schoolEncId !== ''){
      this.schoolService.getSchoolClasses(schoolEncId).subscribe((res : any = []) => {
        this.classData = res.data.filter(
            (item: any) => item.classId > 8
          );
      });
    }
  }
  getAnxtData() {
    this.commonService
      .getCommonAnnexture(["SMART_CLASS_TYPE"])
      .subscribe((data: any = []) => {
        this.classTypeData = data?.data?.SMART_CLASS_TYPE
      });
  }
 getStream(){
   this.commonService.getCommonAnnexture(["STREAM_TYPE"]).subscribe((data:any=[]) => {
     this.streamData = data;
     this.streamData = this.streamData.data['STREAM_TYPE'];
   });
 }
 getGroup(){
   this.commonService.getCommonAnnexture(["STREAM_GROUP_TYPE"]).subscribe((data:any=[]) => {
     this.groupData = data;
     this.groupData = this.groupData.data['STREAM_GROUP_TYPE'];
   });
 }
//  getSection(classId:any,schoolId:any,academicYear:any){
//    this.smartClassService.getSection(classId,schoolId,academicYear).subscribe((data:any=[]) => { 
//      this.sectionData = data;
//      this.sectionData = this.sectionData.data['sections'];
//    });
//  }
   // ===== get class wise subjects
   getSubjects() {
    this.smartClassForm.patchValue({
      subject: "",
    });

    const classStreamGroupObj = {
      selectedClassId: parseInt(this.smartClassForm.getRawValue()?.classId),
      selectedStreamId: parseInt(this.smartClassForm.getRawValue()?.streamId),
      selectedGroupId: parseInt(this.smartClassForm.getRawValue()?.groupId),
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
      this.smartClassForm.patchValue({
        stream: "",
      });
      this.smartClassForm.patchValue({
        group: "",
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
 getSubjectAccordingToClass(classId:any){
   this.smartClassService.getSubjectAccordingToClass(classId).subscribe((data:any=[]) => { 
     this.subjectData = data;
     this.subjectData = this.subjectData.data;
   });
 }
 classChange(val:any){
    // this.smartClassForm.patchValue({   
    //   sectionId: ''
    // })
    this.smartClassForm.patchValue({   
      subjectId: ''
     })
    this.smartClassForm.patchValue({   
      streamId: ''
     })
     this.smartClassForm.patchValue({   
      groupId: ''
     })
   this.classId=val;
   if( this.classId !==""){
     //this.getSection(this.classId,this.schoolId,this.academicYear);
     this.getSubjectAccordingToClass(this.classId);
   }
   if(this.classId==11 || this.classId==12){
     this.getStream();
   }
   else{
     this.streamId='';
    }
 }
 streamChange(val:any){
  this.smartClassForm.patchValue({   
    groupId: ''
    })
   this.streamId=val;
   if(this.streamId==3 ){
     this.getGroup();
   }
   else{
     this.groupId='';
   }
}
  initializeForm() {
    this.smartClassForm = this.formBuilder.group({
      academicYear:[this.academicYear],
      schoolId: [this.schoolId],
      classId: [this.classId,Validators.required],
      streamId: [this.streamId],
      groupId: [this.groupId],
      //sectionId: [this.sectionId],
      classTypeId: [this.classTypeId,Validators.required],
      subjectId: [this.subjectId,Validators.required],
      encId: [this.encId],
      userId: [this.userId],  
      profileId: [this.profileId],  
    });
  }
  editSmartClass(id: any) {
    this.smartClassService
      .getSmartClass(this.id)
      .subscribe((res: any) => {
        this.smartClassData =  res.data[0];
        this.encId = this.smartClassData.encId;
        this.academicYear = this.smartClassData.academicYear;
        this.schoolId = this.smartClassData.schoolId;
        this.classId = this.smartClassData.classId;
        this.streamId = this.smartClassData.streamId;
        this.groupId = this.smartClassData.groupId;
        //this.sectionId = this.smartClassData.sectionId;
        this.classTypeId = this.smartClassData.classType;
        this.subjectId = this.smartClassData.subjectId;
        const classStreamGroupObj = {
          selectedClassId: parseInt(this.classId),
          selectedStreamId: parseInt(this.streamId),
          selectedGroupId: parseInt(this.groupId),
        };
        if (parseInt(this.classId) > 0)
          this.getSubjectsClassStreamGroupWise(classStreamGroupObj);
        // 1) get subjects of the selected class
        // 2) if class greater than 10 show stram field
        if (parseInt(this.classId) > 10) {
          this.isClassGreaterThanTen = true;
        } else {
          this.isClassGreaterThanTen = false; //else hide
        }
        this.getSchoolClasses(this.schoolId);
        this.getAnxtData();
        // this.getSubjectAccordingToClass(this.classId);
        this.getStream();
        this.getGroup();
       // this.getSection(this.classId,this.schoolId,this.academicYear)
        this.initializeForm();
        this.spinner.hide();
      });
  }
  updateSmartClass(){
    // if ("INVALID" === this.smartClassForm.status) {
    //   for (const key of Object.keys(this.smartClassForm.controls)) {
    //     if (this.smartClassForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       ); 
    //       invalidControl.focus();
    //       break;
    //     }
    //   }
    // }
    if (this.smartClassForm.invalid) {
      this.customValidators.formValidationHandler(this.smartClassForm,this.allLabel, this.el);
    }
    this.submitted = true;
    if (this.smartClassForm.get("classId")?.value == 11 || this.smartClassForm.get("classId")?.value == 12){
      if(this.smartClassForm.controls["streamId"]?.value == '' || this.smartClassForm.controls["streamId"]?.value == 0) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="streamId"]');
          invalidControl.focus();
        this.alertHelper.viewAlert("error","Invalid","Stream required");
        return;
        }
    }
    if(this.smartClassForm.get("streamId")?.value == 3){
      if(this.smartClassForm.controls["groupId"]?.value == '' || this.smartClassForm.controls["groupId"]?.value == 0) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="groupId"]');
          invalidControl.focus();
         this.alertHelper.viewAlert("error","Invalid","Group required");
        return;
        }
    }
    this.customValidators.formValidationHandler(this.smartClassForm, this.allLabel);
    if(this.smartClassForm.valid == true){
      this.alertHelper.submitAlert().then((result) => {
        if(result.value){
          this.spinner.show();
          this.smartClassService.updateSmartClass(this.smartClassForm.value).subscribe({
            next: (res: any) => {
              this.spinner.hide();
              this.alertHelper.successAlert(
                "Updated!",
                "Smart class updated successfully.",
                "success"
              ).then(() => {
                this.route.navigate(["../../viewSmartClass"], {
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
}
 