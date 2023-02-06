import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SchoolService } from 'src/app/application/school/services/school.service';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { HealthCheckUpService } from '../../services/health-check-up.service';


@Component({
  selector: 'app-edit-health-check-up',
  templateUrl: './edit-health-check-up.component.html',
  styleUrls: ['./edit-health-check-up.component.css']
})
export class EditHealthCheckUpComponent implements OnInit {
  
  schoolUdiseCode: any = "";
  clusterName: any = "";
  schoolName: any = "";
  blockName: any = "";
  districtName: any = "";
  villageName: any = "";
  className: any = "";
  sectionName: any = "";
  streamName: any = "";
  groupName: any = "";
  doctorName: any = "";
  
  schoolInfoData: any;
  config = new Constant();

  academicYear: any = this.config.getAcademicCurrentYear();
  userId: any = "";
  profileId: any = "";
  encId: any = "";
  schoolId: any;
  healthCheckupForm!: FormGroup;
  classId: any = "";
  streamId: any = "";
  groupId: any = "";
  sectionId: any = "";
  doctorId: any = "";
  checkupDate: any = "";
  studentId: any = "";
  studentName: any = "";
  studentCode: any = "";
  chest: any = "";
  dental: any = "";
  throat: any = "";
  leftEye: any = "";
  rightEye: any = "";
  hemoglobinLevel: any = "";
  doseOfDeworming: any = "";
  hearing: any = "";
  chronicDisease: any = "";
  weight: any = "";
  height: any = "";
  bmi: any = "";
  bloodPressure: any = "";
  doctorAdvice: any = "";
  emergencyCntNo: any = "";

  healthCheckupData: any;
  classData: any;
  streamData: any;
  groupData: any;
  studentData: any;
  sectionData: any;
  doctorData: any;
  healthCheckupEditForm!: FormGroup;
  submitted : boolean = false;
  allLabel: string[] = ["","","","","","","","","","","chest","dental","throat","leftEye","rightEye","hemoglobinLevel","doseOfDeworming","hearing","chronicDisease","weight","height","bmi","bloodPressure","doctorAdvice","emergencyCntNo","","","","","","","","","",];
  loginUserType: any = "";
  public permissionForAdd: boolean = false;
  plPrivilege:string="view"; //For menu privilege
  adminPrivilege: boolean = false;
  tabs: any = [];  //For shwoing tabs
  constructor(
    private commonService: CommonserviceService,
    private spinner: NgxSpinnerService,
    private schoolService: SchoolService,
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    public healthCheckUpService: HealthCheckUpService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private alertHelper: AlertHelper,
    private route: Router,
    private router: ActivatedRoute,
    private el: ElementRef,
  ) { 
    const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization 
    this.tabs = this.privilegeHelper.PrimaryLinkTabNames(pageUrl);  //For shwoing tabs  

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
    }
    this.encId = this.router.snapshot.params["encId"];
    this.editHealthCheckup(this.encId);
    this.initializeForm();
   
  }
  ngAfterViewInit() {
    this.el.nativeElement.querySelector("[formControlName=chest]").focus();
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
  initializeForm() {
    this.healthCheckupEditForm = this.formBuilder.group({
      profileId: [this.profileId],
      encId: [this.encId],
      userId: [this.userId],
      schoolId: [this.schoolId],
      academicYear: [this.academicYear],
      checkupDate: [this.checkupDate],
      doctorId: [this.doctorId],
      studentId :[this.studentId],
      studentName:[this.studentName],
      studentCode:[this.studentCode],
      chest:[this.chest,[Validators.maxLength(10),this.customValidators.firstCharValidatorRF]],
      dental:[this.dental,[Validators.maxLength(10),this.customValidators.firstCharValidatorRF]],
      throat:[this.throat,[Validators.maxLength(10),this.customValidators.firstCharValidatorRF]],
      leftEye:[this.leftEye,[Validators.maxLength(5),Validators.pattern(/^[-.+0-9]+$/)]],
      rightEye:[this.rightEye,[Validators.maxLength(5),Validators.pattern(/^[-.+0-9]+$/)]],
      hemoglobinLevel:[this.hemoglobinLevel,[Validators.maxLength(9),Validators.pattern(/^[0-9-.]+$/)]],
      doseOfDeworming:[this.doseOfDeworming,[Validators.maxLength(1)]],
      hearing:[this.hearing,[Validators.maxLength(7),Validators.pattern(/^[0-9-]+$/)]],
      chronicDisease:[this.chronicDisease,[Validators.maxLength(10),this.customValidators.firstCharValidatorRF]],
      weight:[this.weight,[Validators.maxLength(3),Validators.pattern(/^[0-9]+$/)]],
      height:[this.height,[Validators.maxLength(3),Validators.pattern(/^[0-9]+$/)]],
      bmi:[this.bmi],
      bloodPressure:[this.bloodPressure,[Validators.maxLength(7),Validators.pattern(/^[0-9/]+$/)]],
      doctorAdvice:[this.doctorAdvice,[Validators.maxLength(250),this.customValidators.firstCharValidatorRF]],
      emergencyCntNo:[this.emergencyCntNo,[Validators.maxLength(10),Validators.minLength(10),Validators.pattern(/^[0-9]+$/)]],
      className:[this.className],
      sectionName:[this.sectionName],
      streamName:[this.streamName],
      groupName:[this.groupName],
      doctorName:[this.doctorName],
      classId:[this.classId],
      streamId:[this.streamId],
      sectionId:[this.sectionId],
      groupId:[this.groupId],
    });
  }
  editHealthCheckup(encId: any){
    this.spinner.show();
    this.healthCheckUpService
      .getHealthCheckup(this.encId)
      .subscribe((res: any) => {
        this.healthCheckupData =  res.data[0];
        this.encId = this.healthCheckupData.encId;
        this.schoolId = this.healthCheckupData.schoolId;
        this.academicYear = this.healthCheckupData.academicYear;
        
        
        this.checkupDate = this.healthCheckupData.checkupDate;
        this.doctorId = this.healthCheckupData.doctorId;
        this.studentId = this.healthCheckupData.studentId;
        this.studentName = this.healthCheckupData.studentName;
        this.studentCode = this.healthCheckupData.studentCode;
        this.chest = this.healthCheckupData.chest;
        this.dental = this.healthCheckupData.dental;
        this.throat = this.healthCheckupData.throat;
        this.leftEye = this.healthCheckupData.leftEye;
        this.rightEye = this.healthCheckupData.rightEye;
        this.hemoglobinLevel = this.healthCheckupData.hemoglobinLevel;
        this.doseOfDeworming = this.healthCheckupData.doseOfDeworming;
        this.hearing = this.healthCheckupData.hearing;
        this.chronicDisease = this.healthCheckupData.chronicDisease;
        this.weight = this.healthCheckupData.weight;
        this.height = this.healthCheckupData.height;
        this.bmi = this.healthCheckupData.bmi;
        this.bloodPressure = this.healthCheckupData.bloodPressure;
        this.doctorAdvice = this.healthCheckupData.doctorAdvice;
        this.emergencyCntNo = this.healthCheckupData.emergencyCntNo;
        this.className = this.healthCheckupData.className;
        this.sectionName = this.healthCheckupData.sectionName;
        this.streamName = this.healthCheckupData.streamName;
        this.groupName = this.healthCheckupData.groupName;
        this.doctorName = this.healthCheckupData.doctorName;
        this.initializeForm();
        this.spinner.hide(); 
      });
  }
  formCancel(){
    this.route.navigate(["../../viewHealthCheckUp"], {
      relativeTo: this.router,
    });
  }
  onSubmit(){
    this.submitted = true;  
    // if ("INVALID" === this.healthCheckupEditForm.status) {
    //   for (const key of Object.keys(this.healthCheckupEditForm.controls)) {
    //     if (this.healthCheckupEditForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(
    //         this.healthCheckupEditForm,
    //         this.allLabel
    //       );
    //       break;
    //     }
    //   }
    // }
    if(this.healthCheckupEditForm.invalid){
      this.customValidators.formValidationHandler(
                this.healthCheckupEditForm,
                this.allLabel,
                this.el
              );
    }
    if (this.healthCheckupEditForm.valid === true) {
      this.alertHelper.updateAlert().then((result: any) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.healthCheckUpService
            .updateHealthCheckup(this.healthCheckupEditForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Health checkup updated successfully.",
                    "success"
                  )
                  .then(() => {
                    this.route.navigate(["../../viewHealthCheckUp"], {
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
  }
}
