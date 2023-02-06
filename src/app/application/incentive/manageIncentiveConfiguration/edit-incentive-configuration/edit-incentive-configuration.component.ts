import { Component, ElementRef, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageIncentiveConfigurationService } from '../../services/manage-incentive-configuration.service';

@Component({
  selector: 'app-edit-incentive-configuration',
  templateUrl: './edit-incentive-configuration.component.html',
  styleUrls: ['./edit-incentive-configuration.component.css']
})
export class EditIncentiveConfigurationComponent implements OnInit {
  editIncentiveConfig!: FormGroup;
  isSelected: boolean = true;
  incentiveConfigData: any  = "";
  incentiveNameData: any    = "";
  genderData: any           = "";
  casteData: any            = "";
  classData: any            = "";
  disabilityTypeData: any   = "";
 

  post: any;
  incentiveId: any    = "";
  class: any          = "";
  gender: any         = "";
  caste: any          = "";
  ageMax: any         = "";
  ageMin: any         = "";
  belongsToBPL: any   = "";
  disabilityType: any = "";
  classArrData: any   = "";

  encId: any          = "";
  userId: any         = "";
  id: any             = "";

  allErrorMessages: string[]  = [];
  classArr: any               = [];
  
  allLabel: string[] = ["", "","Incentive name", "Class", "Gender", "Caste", "Maximum age", "Minimum age", "Belongs to BPL", "Type of disability",""];
 
  submitted: boolean      = false;
  adminPrivilege: boolean = false;
  
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  profileId:any = '';
  

  constructor(
    private el: ElementRef,
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private spinner: NgxSpinnerService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    public manageIncentiveConfigurationService: ManageIncentiveConfigurationService,
    public commonService: CommonserviceService,
    private route: Router,
    private router: ActivatedRoute) { 
      const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization  

    }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    const users = this.commonService.getUserProfile();
   this.userId = users?.userId;
   this.profileId = users?.profileId;
   
    this.manageIncentiveConfigurationService.getIncentiveName().subscribe((res: any) => {
      this.incentiveNameData = res.data;
    });
    this.commonService.getGender().subscribe((res: any) => {
      this.genderData = res.data;
    });
    this.commonService.getCaste().subscribe((res: any) => {
      this.casteData = res.data;
    });
    this.commonService.getDisabilityType().subscribe((res: any) => {
      this.disabilityTypeData = res.data;
    });
    // this.commonService.getClass().subscribe((res: any) => {
    //   this.classData = res.data;
    // });
    this.getClass();
    this.id = this.router.snapshot.params["encId"];
    this.editIncentiveConfigClass(this.id);
    this.initializeform();
    this.el.nativeElement.querySelector("[formControlName=incentiveId]").focus();
  }
  getClass() {
    this.commonService
      .getCommonAnnexture(["CLASS_TYPE"],true)
      .subscribe((data: any = []) => {
        this.classData = data?.data?.CLASS_TYPE
      });
  }
  // VALIDATION TO CHECK MAX and MIN Entry
  minToMaxValidation(ageMax:any,ageMin:any){
    if(ageMax.value !=="" && ageMin.value !==""  &&  parseInt(ageMin.value) > parseInt(ageMax.value) ){
      this.alertHelper.viewAlert("error","Invalid","Upper age limit always greater than lower age limit",)
        .then((res: any) => {
          ageMin.focus();
          this.editIncentiveConfig.patchValue({'ageMin':''});
        });
    }
    if(ageMax.value !=="" && ageMin.value !==""  &&  parseInt(ageMin.value) == parseInt(ageMax.value) ){
      this.alertHelper.viewAlert("error","Invalid","Upper age limit not be same as lower age limit")
        .then((res: any) => {
          ageMin.focus();
          this.editIncentiveConfig.patchValue({'ageMin':''});
        });
    }
    
  }
  initializeform() {
    this.editIncentiveConfig = this.formBuilder.group({
      userId:[this.userId],
      profileId:[this.profileId],
      incentiveId: [this.incentiveId,[Validators.required,Validators.pattern('^[0-9]*$')]],
      classArr: this.formBuilder.array(this.classArr),
      gender: [this.gender, [Validators.required,Validators.pattern('^[0-9]*$')]],
      caste: [this.caste, [Validators.required,Validators.pattern('^[0-9]*$')]],
      ageMax: [this.ageMax, [Validators.required,Validators.pattern('^[0-9]*$')]],
      ageMin: [this.ageMin, [Validators.required,Validators.pattern('^[0-9]*$')]],
      belongsToBPL: [this.belongsToBPL, [Validators.required,Validators.pattern('^[0-9]*$')]],
      disabilityType: [this.disabilityType, [Validators.required,Validators.pattern('^[0-9]*$')]],
      encId: [this.encId],
    });
  }

  editIncentiveConfigClass(id: any){
    this.spinner.show();
    this.manageIncentiveConfigurationService
    .getIncentiveConfig(this.id)
    .subscribe((data: any) => {
      this.incentiveConfigData = data.data[0];
      this.incentiveConfigData.incconfigclasstagged.map((item: any) => {
         this.classArr.push(item.incClassTaggedId);
      });
      this.incentiveId = this.incentiveConfigData.incentiveId;
      this.gender = this.incentiveConfigData.gender;
      this.caste = this.incentiveConfigData.caste;
      this.ageMax = this.incentiveConfigData.ageMax;
      this.ageMin = this.incentiveConfigData.ageMin;
      this.disabilityType = this.incentiveConfigData.disabilityType;
      this.belongsToBPL = this.incentiveConfigData.belongsToBPL;
      this.encId = this.incentiveConfigData.encId;
      this.initializeform();
      this.spinner.hide();
    });
  }

  onSubmit() {
    this.submitted = true;
    /* this.customValidators.formValidationHandler(
      this.editIncentiveConfig,
      this.allLabel
    ); */
    // if ("INVALID" === this.editIncentiveConfig.status) {
    //   for (const key of Object.keys(this.editIncentiveConfig.controls)) {
    //     if (this.editIncentiveConfig.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.editIncentiveConfig,this.allLabel);
    //       break;
    //     }
    //   }
    // }
    if (this.editIncentiveConfig.invalid) {
      // this.customValidators.formValidationHandler(this.editIncentiveConfig,this.allLabel, this.el);
      this.customValidators.formValidationHandler(
        this.editIncentiveConfig,
        this.allLabel,
        this.el,
        {
          required: {
            incentiveId: "Please select incentive name",
            gender: "Please select gender",
            caste: "Please select caste",
            ageMax: "Please enter upper age",
            ageMin: "Please enter lower age",
            belongsToBPL: "Please select belongs to BPL or not",
            disabilityType: "Please select type of disability or not",
          },
        }
      );
    }
    if (this.editIncentiveConfig.invalid) {
      return;
    }
    if(this.editIncentiveConfig.value.classArr.length==0){
      this.alertHelper.viewAlert("error","Invalid","Please select class");
      return;
    }
    if (this.editIncentiveConfig.valid === true) {
      this.alertHelper
        .updateAlert(
          "Do you want to update the record ?",
          "question",
          "Yes, update it!",
          "No, keep it"
        )
        .then((result) => {
          if (result.value) {
            if (result.value) {
              this.spinner.show(); // ==== show spinner
              this.manageIncentiveConfigurationService
                .updateIncentiveConfig(this.editIncentiveConfig.value)
                .subscribe({
                  next: (res: any) => {
                    this.spinner.hide(); //==== hide spinner
                    this.alertHelper
                      .successAlert(
                        "Saved!",
                        "Incentive configuration updated successfully.",
                        "success"
                      )
                      .then(() => {
                        this.route.navigate(["../../viewIncentiveConfiguration"], {
                          relativeTo: this.router,
                        });
                      });
                  }, 
                  error: (error: any) => {
                    this.spinner.hide(); //==== hide spinner
                  },
                });
            }
          }
        });
    }
  }

  // OnChangeClass(event:any){
  //   const classArr: FormArray = this.editIncentiveConfig.get('classArr') as FormArray;
  //   if (this.classArr.includes(parseInt(event.target.value))) {
  //     const index = this.classArr.indexOf(
  //       parseInt(event.target.value),
  //       0
  //     );
  //     if (index > -1) {
  //       this.classArr.splice(index, 1);
  //     }
  //   } else {
  //     this.classArr.push(parseInt(event.target.value));
  //   }
  //   this.initializeform();
  // }
  OnChangeClass(e:any) {
    const classArr: FormArray = this.editIncentiveConfig.get('classArr') as FormArray;
    if (e.target.checked) {
     
      classArr.push(new FormControl(e.target.value));
    } else {
       let i: number = 0;
           classArr.controls.forEach((item: any) => {
            if (item?.value == e.target.value) {
               const index = classArr.controls.findIndex(x => x.value === item?.value);
               classArr.removeAt(index);
            }
        i++;
      });
    }
  }
  onCancel(){
    this.route.navigate(["../../viewIncentiveConfiguration"], {
      relativeTo: this.router,
    });
  }

}
