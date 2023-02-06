import { Component, OnInit, ElementRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { PhysicalFacilitiesInfoService } from "../../services/physical-facilities-info.service";
import { Constant } from "src/app/shared/constants/constant";
import { SchoolService } from "../../services/school.service";
@Component({
  selector: "app-physical-facilities-info",
  templateUrl: "./physical-facilities-info.component.html",
  styleUrls: ["./physical-facilities-info.component.css"],
})
export class PhysicalFacilitiesInfoComponent implements OnInit {
  enableEdit : boolean = false;
  dataLength : boolean = false;
  verificationStatus: any = "";
  crStatus: any = "";
  freezStatus: any = "";
  activationFlag: any = "";
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();
  /* Initialize form controls */
  encId: any = "";
  schoolId: any = "";
  userProfile: any = [];
  userId:any="";
  constructor(
    private router: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    public commonserviceService: CommonserviceService,
    public customValidators: CustomValidators,
    private alertHelper: AlertHelper,
    private physicalFacilitiesInfoService: PhysicalFacilitiesInfoService,
    private el: ElementRef,
    private schoolService: SchoolService,
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.userProfile = this.commonserviceService.getUserProfile();
    this.userId = this.userProfile?.userId;
    this.encId = this.router.snapshot.params["encId"];
    this.getSchoolStatusForEditOrViewInfo(this.encId, this.academicYear);
    this.spinner.hide();
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
