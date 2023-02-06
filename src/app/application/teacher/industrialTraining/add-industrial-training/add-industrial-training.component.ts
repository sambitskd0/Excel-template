import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { IndustrialTrainingService } from '../../services/industrial-training.service';
import { formatDate } from '@angular/common';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CommonFunctionHelper } from 'src/app/core/helpers/common-function-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { Router } from '@angular/router';
import { SchoolService } from 'src/app/application/school/services/school.service';
@Component({
  selector: 'app-add-industrial-training',
  templateUrl: './add-industrial-training.component.html',
  styleUrls: ['./add-industrial-training.component.css']
})
export class AddIndustrialTrainingComponent implements OnInit {
  dropdownSettings:IDropdownSettings={};
  industrialTrainings!: FormGroup;
  userProfile:any=[];
  createdBy:any ="";
  districtName:any='';
  blockName:any='';
  clusterName:any=''; 
  teacherList:any[] =[]; 
  config = new Constant();
  academicYear:any = this.config.getAcademicCurrentYear();
  agencyList:any=[]; 
  trainingTypeList:any=[]; 
  agencyId: any = "";
  dateOfVisit: any = "";
  trainingType: any = "";  
  districtId: any = "";
  blockId: any = "";
  clusterId: any = "";
  schoolId: any = "";
  IschoolIds: any = "";
  description: any = "";
  teachersAttenedTraining: any = "";
  submitted = false;
  allErrorMessages: string[] = [];
  allLabel: string[] = ["","","","","","Agency name","Date of visit","Type of training","Teachers attended training"];
  maxDate: any = Date;
  plPrivilege:string="view"; //For menu privilege
	adminPrivilege: boolean = false;
  
  distLoading: boolean = false;
  blockLoading: boolean = false;

  disrtictChanged: boolean = false;
  blockChanged: boolean = false;
  schoolCatagoryChanged: boolean = false;
  schoolChanged: boolean = false;
  posts: any = [];
  districtData: any = [];
  blockData: any = [];
  schoolCatData: any = [];
  schoolData: any = [];
  teacherData: any = [];
  teacherChanged: boolean = false;
  loginUserType : any ="";
  userDesignation: any ="";
  constructor(
	private formBuilder: FormBuilder,
    private industrialTraining: IndustrialTrainingService,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
  	  private router:Router,
    private spinner: NgxSpinnerService,
    private el: ElementRef,
    private commonserviceService: CommonserviceService,
    private commonFunctionHelper: CommonFunctionHelper,
    private schoolService: SchoolService)
     {
    const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For authorization
    this.maxDate = new Date();
    }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    this.userProfile = this.commonserviceService.getUserProfile();
    this.loginUserType = this.userProfile.loginUserTypeId;
    this.userDesignation = this.userProfile.designationId;
    this.getDistrict();
    if (this.userProfile.district > 0) {
      this.districtId = this.userProfile.district;
      this.getBlock(this.userProfile.district);
    }
    // this.getDetails();    
    this.getAgency();    
    this.getTraining();    
    this.initializeForm(); 
    this.el.nativeElement.querySelector("[formControlName=districtId]").focus();   
    this.dropdownSettings = {      
      idField: 'tId',
      textField: 'teacherName',
      enableCheckAll: true,
      selectAllText: "Select All Teacher",
      unSelectAllText: "UnSelect All Teacher",
      noDataAvailablePlaceholderText: "No data available",
      allowSearchFilter: true,
      itemsShowLimit: 3,
    };   
  }
  
getDetails(){
  this.spinner.show();  
  this.districtId = this.industrialTrainings.get('districtId')?.value;
  this.blockId = this.industrialTrainings.get('blockId')?.value;
  this.schoolId = (this.industrialTrainings.get('schoolId')?.value) ? this.industrialTrainings.get('schoolId')?.value :this.userProfile.school;
  let objList: any = { district: this.districtId, block: this.blockId,school:this.schoolId};
  
  this.industrialTraining
  .getDetails(objList)
  .subscribe({
    next: (res: any) => {
     this.districtName = res.data[0].districtName;
     this.blockName = res.data[1].blockName;
     this.clusterName = res.data[2].clusterName;
     this.teacherList = res.data[3];
     this.IschoolIds = res.data[4].schoolId;     
     this.spinner.hide();
    }
  }); 
}
initializeForm() {   
  this.industrialTrainings = this.formBuilder.group({
    academicYear:[this.academicYear],
    districtId:[this.userProfile.district],
    blockId:[this.userProfile.block],
    clusterId:[this.userProfile.cluster],
    schoolId:[this.schoolId],
    agencyId: [this.agencyId,[Validators.required,] ], 
    dateOfVisit: [this.dateOfVisit,[Validators.required]],
    trainingType: [this.trainingType,[Validators.required]],
    teachersAttenedTraining: [this.teachersAttenedTraining,[Validators.required]],
    description:[this.description,[this.customValidators.firstCharValidatorRF,Validators.maxLength(500)]],
    createdBy:[this.userProfile.userId]
  });
  if (this.userProfile.block != "") {
    this.getSchoolList();
    this.getDetails();
  }
  if (
    this.userProfile.udiseCode != 0 ||
    this.userProfile.udiseCode != ""
  ) {
    //this.getSchoolList();
    this.getDetails();
  }
  
}
getDistrict() {
  this.distLoading = true;
  this.disrtictChanged = true;
  this.commonserviceService.getAllDistrict().subscribe((res: []) => {
    this.posts = res;
    this.districtData = this.posts.data;
    if (this.userProfile.district > 0) {
      this.districtData = this.districtData.filter((dis: any) => {
        return dis.districtId == this.userProfile.district;
      });
      this.industrialTrainings.controls["districtId"].patchValue(this.userProfile.district);
    } else {
      this.disrtictChanged = false;
    }
    this.distLoading = false;
  });
}
getBlock(districtId: any) {
  //console.log('block:::',this.holidayForm.value);   
 
  this.blockChanged = true;
  this.blockLoading = true;
  this.districtId = districtId;
  this.blockData = [];
  this.schoolData = [];

  if (this.userProfile.block > 0) {
    this.blockId = this.userProfile.block;
  }

  if (districtId > 0) {
    this.commonserviceService.getBlockByDistrictid(districtId).subscribe((res) => {
      this.blockData = res;
      this.blockData = this.blockData.data;
      if (this.userProfile.block > 0) {
        this.blockId = this.userProfile.block;
        this.blockData = this.blockData.filter((blo: any) => {
          return blo.blockId == this.userProfile.block;
        });
        this.industrialTrainings.controls['blockId']?.patchValue(this.userProfile.block);
      } else {
        this.blockChanged = false;
      }
      this.blockLoading = false;
    });
  } else {
    this.blockChanged = false;
  }
}
getSchoolList() {
  this.schoolChanged = true;
  this.schoolData = [];
  this.districtId = this.industrialTrainings.get('districtId')?.value;
  this.blockId = this.industrialTrainings.get('blockId')?.value;
  
  let paramList: any = { districtId: this.districtId, blockId: this.blockId};
 
  if ( this.blockId > 0) {
    this.schoolService.getSchoolList(paramList).subscribe((res: any) => {
      this.posts = res;
      this.schoolData = this.posts.data;

      if (
        this.userProfile.udiseCode != 0 ||
        this.userProfile.udiseCode != ""
      ) {
        this.schoolData = this.schoolData.filter((sch: any) => {
          return sch.schoolUdiseCode == this.userProfile.udiseCode;
        });
        this.industrialTrainings.controls["schoolId"]?.patchValue(
          this.schoolData[0].schoolId
        );
        
      } else {
        this.schoolChanged = true;
      }
      this.schoolChanged = false;
    });
  }
  
}

getAgency(){
  this.industrialTraining
  .getAgency('')
  .subscribe({
    next: (res: any) => {
    this.agencyList = res.data; 
    }
  });
}
getTraining(){
  this.industrialTraining
  .getTraining('')
  .subscribe({
    next: (res: any) => {
    this.trainingTypeList = res.data; 
    }
  });
}
getFormValue(allValue: any) {
  return {
    ...allValue,
    dateOfVisit: this.commonFunctionHelper.formatDateHelper(
      allValue?.dateOfVisit
    ),    
  };
}
onSubmit(){
  this.submitted = true;  
  // if ("INVALID" === this.industrialTrainings.status) {
  //   for (const key of Object.keys(this.industrialTrainings.controls)) {
  //     if (this.industrialTrainings.controls[key].status === "INVALID") {
  //       const invalidControl = this.el.nativeElement.querySelector(
  //         '[formControlName="' + key + '"]'
  //       );
  //       invalidControl.focus();
  //       this.customValidators.formValidationHandler(
  //         this.industrialTrainings,
  //         this.allLabel
  //       );
  //       break;
  //     }
  //   }
  // }
  if(this.industrialTrainings.invalid){
    this.customValidators.formValidationHandler(
              this.industrialTrainings,
              this.allLabel,
              this.el
            );
  }
  if (this.industrialTrainings.valid === true) {
    this.alertHelper.submitAlert().then((result) => {
      if (result.value) {
       
        const allValue = this.industrialTrainings?.value;
        this.spinner.show(); // ==== show spinner
        this.industrialTraining
          .addIndustrialTraining(this.getFormValue(allValue))
          .subscribe({
            next: (res: any) => {
              this.spinner.hide(); //==== hide spinner
              this.alertHelper
                .successAlert(
                  "Saved!",
                  "Industrial training created successfully.",
                  "success"
                )
                .then(() => {
                  this.industrialTrainings.get("agencyId")?.patchValue(this.agencyId);
                  this.industrialTrainings.get("dateOfVisit")?.patchValue(this.dateOfVisit);
                  this.industrialTrainings.get("trainingType")?.patchValue(this.trainingType);
                  this.industrialTrainings.get("teachersAttenedTraining")?.patchValue(this.teachersAttenedTraining);
                  this.industrialTrainings.get("description")?.patchValue(this.description);  
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
            complete: () => console.log('done'),
          });
      }
    });
  }
}

  futuredateCheck(){
    let visitDate = this.industrialTrainings.controls['dateOfVisit'].value;
    const newDate = new Date(); 
    if(visitDate !=='')    
        if (formatDate(visitDate,'yyyy-MM-dd','en_US') > formatDate(newDate,'yyyy-MM-dd','en_US')){
          this.alertHelper.viewAlert(
            "error",
            "Invalid",
            "Date of visit must not be above today's date"
          );
           this.industrialTrainings.patchValue({
            dateOfVisit: ''
           });
        
        }
  }
}
