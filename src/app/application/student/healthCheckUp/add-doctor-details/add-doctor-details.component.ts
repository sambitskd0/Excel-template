import { Component, ElementRef, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SchoolService } from 'src/app/application/school/services/school.service';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { DocterDetailsService } from '../../services/doctor-details.service';

@Component({
  selector: 'app-add-doctor-details',
  templateUrl: './add-doctor-details.component.html',
  styleUrls: ['./add-doctor-details.component.css']
})
export class AddDoctorDetailsComponent implements OnInit {
  public show:boolean = true;
  public buttonName:any = 'Show';
  public permissionForAdd: boolean = false;
  loginUserType: any = "";
  config = new Constant();
  clusterName:any=""; 
  schoolName:any="";
  blockName:any="";
  districtName:any="";
  villageName:any="";
  schoolUdiseCode:any="";
  schoolInfoData:any;
  academicYear:any = this.config.getAcademicCurrentYear();
  schoolId: any;
  userId:any="";
  profileId:any="";
  doctorDetailsForm!: FormGroup;
  doctorName:any="";
  doctorMob:any="";
  doctorDetailsDesc:any="";
  checkupData:any="";
  submitted : boolean = false;
  allLabel: string[] = [
   "","","","","Doctor name","Contact number","Purpose of visit","visit details"
  ];
  plPrivilege:string="view"; //For menu privilege
  adminPrivilege: boolean = false;
  tabs: any = [];  //For shwoing tabs
  constructor(
    public customValidators: CustomValidators,
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private commonService: CommonserviceService,
    private el: ElementRef,
    private schoolService : SchoolService,
    private docterDetailsService : DocterDetailsService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private route: Router,
    private router: ActivatedRoute,
  ) { 
    const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For authorization
    this.tabs = this.privilegeHelper.PrimaryLinkTabNames(pageUrl);  //For shwoing tabs 

  }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    const userProfile = this.commonService.getUserProfile()
    this.schoolId=userProfile?.school;
    this.userId=userProfile?.userId;
    this.profileId=userProfile?.userId;
    this.loginUserType = userProfile?.loginUserType;

    if(this.loginUserType == "SCHOOL"){
      this.permissionForAdd=true;
       this.show = false;
    }else{
      this.permissionForAdd=false;
    }
    if (this.schoolId !== 0 && this.schoolId !== '') {
      this.getSchoolInfo(this.schoolId,this.academicYear);
    }
    this.getCheckupType();
    this.initializeForm();
    
  }
  ngAfterViewInit() {
    this.el.nativeElement.querySelector("[formControlName=doctorName]").focus();
  }
  getSchoolInfo(schoolId: any,academicYear:any){
    this.spinner.show();
    this.schoolService.getSchoolInfo(schoolId,academicYear).subscribe((res:any)=>{
      this.schoolInfoData = res.data[0];
      this.districtName=this.schoolInfoData?.districtName;
      this.blockName=this.schoolInfoData?.blockName;
      this.clusterName=this.schoolInfoData?.clusterName;
      this.villageName=this.schoolInfoData?.villageName;
      this.schoolName=this.schoolInfoData?.schoolName;
      this.schoolUdiseCode=this.schoolInfoData?.schoolUdiseCode;
      this.spinner.hide();
    })      
  }
  getCheckupType(){
    this.commonService.getCommonAnnexture(["HEALTH_CHECKUP_TYPE"]).subscribe((data:any=[]) => {
      this.checkupData = data?.data?.HEALTH_CHECKUP_TYPE
    });
  }
  initializeForm() {
    this.doctorDetailsForm = this.formBuilder.group({
      profileId:[this.profileId],
      userId:[this.userId],
      schoolId: [this.schoolId],
      academicYear:[this.academicYear,],
      doctorName:[this.doctorName,[Validators.required, Validators.maxLength(30),this.customValidators.firstCharValidatorRF]],
      doctorMob:[this.doctorMob, [Validators.required, Validators.minLength(10), Validators.maxLength(10),Validators.pattern("^[0-9]*$")]],
      purposeOfVisitArray: this.formBuilder.array([],Validators.required) ,
      doctorDetailsDesc: [this.doctorDetailsDesc,[Validators.maxLength(500),this.customValidators.firstCharValidatorRF]],
    });
  }
  onCheckboxChange(e:any) {
    const purposeOfVisitArray: FormArray = this.doctorDetailsForm.get('purposeOfVisitArray') as FormArray;
    if (e.target.checked) {
      purposeOfVisitArray.push(new FormControl(e.target.value));
    } else {
       const index = purposeOfVisitArray.controls.findIndex(x => x.value === e.target.value);
       purposeOfVisitArray.removeAt(index);
    }
  }
  onSubmit(){
    this.submitted = true;
    if(this.doctorDetailsForm.invalid){
      this.customValidators.formValidationHandler(
        this.doctorDetailsForm,
        this.allLabel,
        this.el
      );
    }  
    
    // if ("INVALID" === this.doctorDetailsForm.status) {
    //   for (const key of Object.keys(this.doctorDetailsForm.controls)) {
    //     if (this.doctorDetailsForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(
    //         this.doctorDetailsForm,
    //         this.allLabel
    //       );
    //       break;
    //     }
    //   }
    // }
    if (this.doctorDetailsForm.valid === true) {
      this.alertHelper.submitAlert().then((result: any) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.docterDetailsService
            .addDoctorDetails(this.doctorDetailsForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Doctor details created successfully.",
                    "success"
                  )
                  .then(() => {
                    this.route.navigate(["./../viewDocterDetails"], {
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
  toggle() {
    this.show = !this.show;
    if(this.show)  
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }
}
