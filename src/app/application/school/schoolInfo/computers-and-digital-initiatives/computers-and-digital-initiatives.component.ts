import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { SchoolService } from  '../../services/school.service';
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';
import { Constant } from "src/app/shared/constants/constant";

@Component({
  selector: 'app-computers-and-digital-initiatives',
  templateUrl: './computers-and-digital-initiatives.component.html',
  styleUrls: ['./computers-and-digital-initiatives.component.css']
})

export class ComputersAndDigitalInitiativesComponent implements OnInit {

  enableEdit : boolean = false;
  dataLength : boolean = false;
  verificationStatus: any = "";
  crStatus: any = "";
  freezStatus: any = "";
  activationFlag: any = "";
  encId:string='';

  labModelChanged : boolean = true;
  labModelData : any = [];  
  ITCInstructorTypeChanged : any = true;
  ITCInstructorTypeData : any = [];  
  /* Initialize form controls for dynamic data binding :: End  */

  /* Initialize form controls :: Start  */
    schoolId:any = "";
    config = new Constant(); 
    academicYear:any = this.config.getAcademicCurrentYear();
  /* Initialize form controls :: End */
  userProfile: any = [];
  CADInfo: any = [];
  userId:any="";
  constructor(
    private router: ActivatedRoute,
    private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    public schoolService: SchoolService,
    private alertHelper : AlertHelper,
    private spinner : NgxSpinnerService,
    private commonserviceService : CommonserviceService,
    private route:Router,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.encId = this.router.snapshot.params["encId"];
    this.userProfile = this.commonserviceService.getUserProfile();
    this.userId = this.userProfile?.userId;
    this.getSchoolStatusForEditOrViewInfo(this.encId,this.academicYear);
  }
  getSchoolStatusForEditOrViewInfo(encId: any, academicYear: any){
    this.schoolService
    .getSchoolStatusForEditOrViewInfo(encId, academicYear)
    .subscribe((res: any) => {
      this.verificationStatus = res.data?.verificationStatus;
      this.crStatus = res.data?.crStatus;
      this.freezStatus = res.data?.freezStatus;
      this.activationFlag = res.data?.activationFlag;
      if(this.verificationStatus== 0 && (this.crStatus==0 || this.crStatus==2) && this.freezStatus==0 && this.userProfile.loginUserTypeId==2 && this.activationFlag ==0){
        this.enableEdit = true;
      }else if(this.verificationStatus==3 && this.userProfile.loginUserTypeId==2 && this.crStatus==2 && this.activationFlag ==0){
        this.enableEdit = true;
      } 
      this.dataLength=true;
    });
  }

}