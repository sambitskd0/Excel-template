import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SchoolService } from 'src/app/application/school/services/school.service';
import { SmartClassService } from 'src/app/application/student/services/smart-class.service';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ClassWiseTeacherTaggedService } from '../../services/class-wise-teacher-tagged.service';

@Component({
  selector: 'app-edit-class-teacher-tagging',
  templateUrl: './edit-class-teacher-tagging.component.html',
  styleUrls: ['./edit-class-teacher-tagging.component.css']
})
export class EditClassTeacherTaggingComponent implements OnInit {

  editClassTeacherTaggedForm !: FormGroup;
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();
  // FormControl variable
  className: any = "";
  sectionName: any = "";
  streamName: any = "";
  groupName: any = "";
  teacherName: any = "";
  groupId: any = "";
  sectionId: any = "";

  allErrorMessages: string[] = [];
  classData: any = [];
  sectionData: any = [];
  streamList: any = [];
  groupList: any = [];
  teacherListData: any = [];
  streamListModal: any = [];
  groupListModal: any = [];
  allData: any = [];

  allLabel: string[] = ["Teacher name","Class name", "Stream name", "Group name", "Section name", "", "", "", ""];

  adminPrivilege: boolean     = false;
  permissionDiv: boolean      = false;
  classChanged: boolean       = false;
  loginUserTypeId: boolean    = false;

  userProfile: any = "";
  schoolId: any = "";
  userId: any = "";
  id: any = "";
  encId: any = "";

  plPrivilege: string = "view"; //For menu privilege



  constructor(
    private formBuilder: FormBuilder,
    private commonserviceService: CommonserviceService,
    private classWiseTeacherTaggedService: ClassWiseTeacherTaggedService,
    private schoolService: SchoolService,
    private smartClassService: SmartClassService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private alertHelper: AlertHelper,
    private router: Router,
    public customValidators: CustomValidators,
    private el: ElementRef,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    if (this.plPrivilege == 'admin') {
      this.adminPrivilege = true;
    }
    const userProfile = this.commonserviceService.getUserProfile();
    this.schoolId = userProfile.school;
    this.userId = userProfile?.userId;
    this.loginUserTypeId    = userProfile?.loginUserTypeId;
    this.id = this.activatedRoute.snapshot.params["encId"];
    if (userProfile.loginUserTypeId != 3) {
      this.permissionDiv = true;
      this.loadAnnexturesData();
      this.getTeacherList(this.schoolId);
      this.getClass(this.schoolId);
      this.getTeacherTaggedById(this.id);
    } else {
      this.permissionDiv = false;
    }
    this.initializeForm();
  }
  ngAfterViewInit(){
    this.el.nativeElement.querySelector("[formControlName=teacherName]").focus();
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
    this.editClassTeacherTaggedForm = this.formBuilder.group({
      teacherName: [
        this.teacherName,
        [Validators.required, Validators.pattern('^[0-9]+')],],
      className: [
        this.className,
        [Validators.required, Validators.pattern('^[0-9]+')],],

      /*  streamName: [
         this.streamName,
       [Validators.required,Validators.pattern('^[0-9]+')],],
       groupName: [
         this.groupName,
       [Validators.required,Validators.pattern('^[0-9]+')],], */
      streamName: [
        this.streamName,
        [
          Validators.pattern(/^[0-9]+$/),
          this.conditionalValidator(
            () => this.editClassTeacherTaggedForm?.get("className")?.value,
            Validators.required,
            "conditionalValidation",
            "stream"
          ),
        ],
      ],
      //group:[this.group],
      groupName: [
        this.groupName,
        [
          Validators.pattern(/^[0-9]+$/),
          this.conditionalValidator(
            () => this.editClassTeacherTaggedForm?.get("streamName")?.value,
            Validators.required,
            "conditionalValidation",
            "group"
          ),
        ],
      ],
      sectionName: [
        this.sectionName,
        [Validators.required, Validators.pattern('^[0-9]+')],],
     
      userId: [this.userId],
      schoolId: [this.schoolId],
      acdemicYear: this.academicYear,
      encId: [this.encId],
    });
  }
  //GET ANNEXTURE DATA
  loadAnnexturesData() {
    const anxTypes = ["STREAM_TYPE", "STREAM_GROUP_TYPE"];
    // this.anxData = this.commonFunction.getAnnextureData(anxTypes);
    let annextureData!: [];
    this.commonserviceService.getCommonAnnexture(anxTypes).subscribe({
      next: (res: any) => {
        annextureData = res?.data;
        this.streamList = res?.data?.STREAM_TYPE;
        this.groupList = res?.data?.STREAM_GROUP_TYPE;
        this.streamList.forEach((value: any) => {
          this.streamListModal[value.anxtValue] = value.anxtName;
        });
        this.groupList.forEach((value: any) => {
          this.groupListModal[value.anxtValue] = value.anxtName;
        });
      },
    });
  }
  //ON CLASS CHANGE
  classChange(val: any) {
    this.editClassTeacherTaggedForm.patchValue({ streamName: "" });
    this.editClassTeacherTaggedForm.patchValue({ groupName: "" });
    this.editClassTeacherTaggedForm.patchValue({ sectionName: "" });
    this.className = val;
    if (this.className !== "") {
      this.getSection(this.className, this.schoolId, this.academicYear);
      if (this.className == 11 || this.className == 12) {
        //this.getStream();
        this.loadAnnexturesData();
      }
    }
  }
  //GET CLASS 
  getClass(schoolEncId: string) {
    if (schoolEncId !== "") {
      this.schoolService.getSchoolClasses(schoolEncId).subscribe((res: any = []) => {
        this.classData = res.data;
      });
    }
  }
  //GET SECTION 
  getSection(classId: any, schoolId: any, academicYear: any) {
    // this.sectionLoad = true;
    this.smartClassService
      .getSection(classId, schoolId, academicYear)
      .subscribe((data: any = []) => {
        this.sectionData = data;
        this.sectionData = this.sectionData.data["sections"];
      });
  }

  streamControlChange(val: any) {
    this.streamName = val;
  }
  getTeacherList(schoolId: any) {
    if (schoolId !== "") {
      this.classWiseTeacherTaggedService.getTeacherList(schoolId).subscribe((res: any = []) => {
        this.teacherListData = res.data;

      });
    }
  }

  getTeacherTaggedById(id: any) {
    this.classWiseTeacherTaggedService.getTeacherTaggedById(this.id).subscribe((data: any) => {
      this.allData = data;
      this.allData = this.allData.data;
      this.className = this.allData.classId;
      // this.schoolId = this.allData.schoolId;
      // this.academicYear = this.allData.academicYear;
      this.streamName = this.allData.streamId;
      this.groupName = this.allData.groupId;
      this.sectionName = this.allData.sectionId;
      this.teacherName = this.allData.teacherId;
      this.encId = this.allData.encId;
      this.getSection(this.className, this.schoolId, this.academicYear);
      this.streamControlChange(this.streamName);
      this.initializeForm();
      this.spinner.hide();
    });
  }

  onSubmit() {
    if (this.editClassTeacherTaggedForm.invalid) {
      this.customValidators.formValidationHandler(this.editClassTeacherTaggedForm, this.allLabel, this.el);
    }
    if (this.editClassTeacherTaggedForm.invalid) {
      return;
    }
    this.alertHelper.updateAlert().then((result) => {
      if (result.value) {
        this.spinner.show(); // ==== show spinner
        this.classWiseTeacherTaggedService.updateClassTeacherTagged(this.editClassTeacherTaggedForm.value).subscribe({
          next: (res: any) => {
            this.spinner.hide(); //==== hide spinner
            this.alertHelper
              .successAlert(
                "Saved!",
                "Class teacher tagging updated successfully.",
                "success"
              )
              .then(() => {
                this.initializeForm();
                this.editClassTeacherTaggedForm.patchValue({ 'className': '' });
                this.editClassTeacherTaggedForm.patchValue({ 'streamName': '' });
                this.editClassTeacherTaggedForm.patchValue({ 'teacherName': '' });
                this.classChange('');
                this.router.navigate(["../../viewclassTeacherTagging"], {
                  relativeTo: this.activatedRoute,
                });
              });
          },
          error: (error: any) => {
            this.spinner.hide(); //==== hide spinner
          },
        });
      }
    });
  }

  onCancel() {
    this.router.navigate(["../../viewclassTeacherTagging"], {
      relativeTo: this.activatedRoute,
    });
  }

}
