import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { SchoolService } from 'src/app/application/school/services/school.service';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CommonFunctionHelper } from 'src/app/core/helpers/common-function-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { IndustrialTrainingService } from '../../services/industrial-training.service';

@Component({
  selector: 'app-edit-industrial-training',
  templateUrl: './edit-industrial-training.component.html',
  styleUrls: ['./edit-industrial-training.component.css']
})
export class EditIndustrialTrainingComponent implements OnInit {
  // dropdownSettings: any = {};
  // @ViewChild('teachersAttenedTraining') teachersAttenedTraining!: ElementRef;
  userProfile:any=[];
  updatedBy:any="";
  districtName:any='';
  blockName:any='';
  clusterName:any=''; 
  teacherList:any=[]; 
  config = new Constant();
  academicYear:any = this.config.getAcademicCurrentYear();
  agencyList:any=[]; 
  trainingTypeList:any=[]; 
  agencyId: any = "";
  agencyName: any = "";
  dateOfVisit: any = "";
  trainingType: any = "";  
  districtId: any = "";
  blockId: any = "";
  clusterId: any = "";
  schoolId: any = "";
  IschoolIds: any = "";
  description: any = "";
  teachersAttenedTraining: any ="";
  id: any = "";
  encId: any = "";
  submitted = false;
  industrialTrainingData:any="";
  allErrorMessages: string[] = [];
  allLabel: string[] = ["","","","","","","Agency name","Date of visit","Type of training","Teachers attended training"];
  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings:IDropdownSettings={};
  industrialTraingForm!:FormGroup;
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
  loginUserType: any = "";
  userDesignation: any = "";
  constructor(private formBuilder: FormBuilder,
    private industrialTraining: IndustrialTrainingService,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private spinner: NgxSpinnerService,
    private el: ElementRef,
    private commonserviceService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private route: Router,
    private router: ActivatedRoute,
    private commonFunctionHelper: CommonFunctionHelper,
    private schoolService: SchoolService) 
    { const pageUrl:any = this.route.url;  
      this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
      this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization
      this.maxDate = new Date();
    }
  ngOnInit(): void {
    this.userProfile = this.commonserviceService.getUserProfile();
	 if(this.plPrivilege=='admin'){
    this.adminPrivilege = true;
  }
  this.getDistrict();
  if (this.userProfile.district > 0) {
    this.districtId = this.userProfile.district;
    this.getBlock(this.userProfile.district);
  }
   // this.getDetails(); 
    this.dropdownSettings = {
      idField: "tId",
      textField: "teacherName",
      enableCheckAll: true,
      selectAllText: "Select All Teacher",
      unSelectAllText: "UnSelect All Teacher",
      noDataAvailablePlaceholderText: "No data available",
      allowSearchFilter: true,
      itemsShowLimit: 3,
      singleSelection: false,
    }; 
    
    this.loginUserType = this.userProfile.loginUserTypeId;
    this.userDesignation = this.userProfile.designationId;
    this.id = this.router.snapshot.params["encId"];
    setTimeout(() => {
      this.editIndustrialTraining(this.id); 
    }, 1000);
    this.el.nativeElement.querySelector("[formControlName=districtId]").focus();      
    this.initializeForm();
  }

  initializeForm() {
    this.industrialTraingForm = this.formBuilder.group({
      teachersAttenedTraining: [this.selectedItems], 
      academicYear:[this.academicYear],
      districtId:[this.userProfile.districtId],
      blockId:[this.userProfile.blockId],
      clusterId:[this.userProfile.clusterId],
      schoolId:[this.schoolId],
      agencyId: [this.agencyId,[Validators.required,] ], 
      dateOfVisit: [this.dateOfVisit,[Validators.required]],
      trainingType: [this.trainingType,[Validators.required]],
      description: [this.description,[this.customValidators.firstCharValidatorRF,Validators.maxLength(500)]],
      encId: [this.id],
      updatedBy: [this.userProfile.userId],
    });
    if (this.userProfile.block > 0 && this.userProfile.udiseCode == 0 && this.userProfile.school == 0) {
     // this.getSchoolList();
      this.getDetails();
      //console.log(1);
      
    }
    if (
      this.userProfile.udiseCode != 0 ||
      this.userProfile.udiseCode != ""
    ) {
      this.getSchoolList();
      //console.log(2);
      //this.getDetails();schoolschool
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
        this.industrialTraingForm.controls["districtId"].patchValue(this.userProfile.district);
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
          this.industrialTraingForm.controls['blockId']?.patchValue(this.userProfile.block);
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
    this.districtId = this.industrialTraingForm.get('districtId')?.value;
    this.blockId = this.industrialTraingForm.get('blockId')?.value;
    
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
          this.industrialTraingForm.controls["schoolId"]?.patchValue(
            this.schoolData[0].schoolId
          );
        } else {
          this.schoolChanged = true;
        }
        this.schoolChanged = false;
        this.getDetails();
      });
    }
  }
  getDetails(){
    this.spinner.show();
    this.districtId = this.industrialTraingForm.get('districtId')?.value;
    this.blockId = this.industrialTraingForm.get('blockId')?.value;
    this.schoolId = this.industrialTraingForm.get('schoolId')?.value;
    let objList: any = { district: this.districtId, block: this.blockId,school:this.schoolId};
    this.industrialTraining
    .getDetails(objList)
    .subscribe({
      next: (res: any) => {
       this.districtName = res.data[0].districtName;
       this.blockName = res.data[1].blockName;
       this.clusterName = res.data[2].clusterName;
       this.teacherList = res.data[3];
       this.IschoolIds = res.data[4].school;     
       
       this.spinner.hide();
      }
    });
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
    
    if(this.industrialTraingForm.invalid){
      this.customValidators.formValidationHandler(
                this.industrialTraingForm,
                this.allLabel,
                this.el
              );
    }
    if (this.industrialTraingForm.valid === true) {
      this.alertHelper.updateAlert().then((result) => {
        if (result.value) {
          const allValue = this.industrialTraingForm?.value;
          this.spinner.show(); // ==== show spinner
          this.industrialTraining
            .updateIndustrialTraining(this.getFormValue(allValue))
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Industrial training updated successfully.",
                    "success"
                  )
                  .then(() => {
                    this.route.navigate(["../../viewIndustrialTraining"], {
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
              complete: () => console.log('done'),
            });
        }
      });
    }
  }
  editIndustrialTraining(id:any){
    this.industrialTraining.getIndustrialTraining(this.id).subscribe((resp: any) => {
      this.industrialTrainingData = resp.data[0];  
      this.schoolId = this.industrialTrainingData.schoolId; 
      this.agencyId = this.industrialTrainingData.agencyId;
      this.agencyName = this.industrialTrainingData.agencyName;
      this.dateOfVisit = new Date(this.industrialTrainingData.dateOfVisit.toString());     
      this.trainingType = this.industrialTrainingData.trainingType; 
      this.teacherList.forEach((val: any, key: any) => {
        if (this.industrialTrainingData.teachersAttened.find((x: any) => x == val.tId)) {
          this.selectedItems.push({
            tId: val.tId,
            teacherName: val.teacherName,
          });
        }
      });
      this.description = this.industrialTrainingData.description;    
      this.encId = this.industrialTrainingData.encId;
      if (this.userProfile.district > 0) {
        this.districtId = this.userProfile.district;
        this.getBlock(this.userProfile.district);
      } 
      
      this.getAgency();    
      this.getTraining(); 
      this.industrialTraingForm.get("districtId")?.patchValue(this.districtId);
      this.industrialTraingForm.get("blockId")?.patchValue(this.blockId);
      this.industrialTraingForm.get("schoolId")?.patchValue(this.schoolId);
      this.industrialTraingForm.get("agencyId")?.patchValue(this.agencyId);
      this.industrialTraingForm.get("dateOfVisit")?.patchValue(this.dateOfVisit);
      this.industrialTraingForm.get("trainingType")?.patchValue(this.trainingType);
      this.industrialTraingForm.get("teachersAttenedTraining")?.patchValue(this.selectedItems);
      this.industrialTraingForm.get("description")?.patchValue(this.description);  
      this.getSchoolList();  
           
      this.spinner.hide();
    });
  }
}
