import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
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
  selector: 'app-add-incentive-configuration',
  templateUrl: './add-incentive-configuration.component.html',
  styleUrls: ['./add-incentive-configuration.component.css']
})
export class AddIncentiveConfigurationComponent implements OnInit {
  @ViewChildren("checkboxes") checkboxes!: QueryList<ElementRef>
  addIncentiveConfig!: FormGroup;
  isSelected: boolean = true;
  incentiveConfigData: any = "";
  incentiveNameData: any = "";
  genderData: any = "";
  casteData: any = "";
  classData: any = "";
  disabilityTypeData: any = "";


  post: any;
  incentiveId: any = "";
  class: any = "";
  gender: any = "";
  caste: any = "";
  ageMax: any = "";
  ageMin: any = "";
  belongsToBPL: any = "";
  disabilityType: any = "";
  allErrorMessages: string[] = [];
  classArr: any = [];
  classArrData: any = "";
  adminPrivilege: boolean = false;
  allLabel: string[] = ["", "","Incentive name", "Class", "Gender", "Caste", "Upper age", "Lower age", "Belongs to BPL", "Type of disability"];
  submitted = false;
  userId: any;
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
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For authorization
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
    this.getClass();
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

  initializeform() {
    this.addIncentiveConfig = this.formBuilder.group({
      userId:[this.userId],
      profileId:[this.profileId],
      incentiveId: [this.incentiveId,[Validators.required,Validators.pattern('^[0-9]*$')]],
      classArr: this.formBuilder.array([]),
      gender: [this.gender, [Validators.required,Validators.pattern('^[0-9]*$')] ],
      caste: [this.caste, [Validators.required,Validators.pattern('^[0-9]*$')]],
      ageMax: [this.ageMax, [Validators.required,Validators.pattern('^[0-9]*$'),Validators.min(1)]],
      ageMin: [this.ageMin, [Validators.required,Validators.pattern('^[0-9]*$'),Validators.min(1)]],
      belongsToBPL: [this.belongsToBPL, [Validators.required,Validators.pattern('^[0-9]*$')]],
      disabilityType: [this.disabilityType, [Validators.required,Validators.pattern('^[0-9]*$')]],
    });
  }
  // VALIDATION TO CHECK MAX and MIN Entry
  minToMaxValidation(ageMax:any,ageMin:any){
    if(ageMax.value !=="" && ageMin.value !==""  &&  parseInt(ageMin.value) > parseInt(ageMax.value) ){
      this.alertHelper.viewAlert("error","Invalid","Upper age limit always greater than lower age limit",)
        .then((res: any) => {
          ageMin.focus();
          this.addIncentiveConfig.patchValue({'ageMin':''});
        });
    }
    if(ageMax.value !=="" && ageMin.value !==""  &&  parseInt(ageMin.value) == parseInt(ageMax.value) ){
      this.alertHelper.viewAlert("error","Invalid","Upper age limit not be same as lower age limit")
        .then((res: any) => {
          ageMin.focus();
          this.addIncentiveConfig.patchValue({'ageMin':''});
        });
    }
    
  }
  onSubmit() {
    this.submitted = true;
    // this.customValidators.formValidationHandler(this.addIncentiveConfig, this.allLabel);
    // if ("INVALID" === this.addIncentiveConfig.status) {
    //   for (const key of Object.keys(this.addIncentiveConfig.controls)) {
    //     if (this.addIncentiveConfig.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.addIncentiveConfig,this.allLabel);
    //       break;
    //     }
    //   }
    // }

    
    if (this.addIncentiveConfig.invalid) {
      // this.customValidators.formValidationHandler(this.addIncentiveConfig,this.allLabel, this.el);
      this.customValidators.formValidationHandler(
        this.addIncentiveConfig,
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
    if (this.addIncentiveConfig.invalid) {
      return;
    }
    if(this.addIncentiveConfig.value.classArr.length==0){
      this.alertHelper.viewAlert("error","Invalid","Please select class");
      return;
    }
    if (this.addIncentiveConfig.valid === true) {
      this.alertHelper.submitAlert().then((result:any) => {
        if (result.value) {
          this.spinner.show();
          this.manageIncentiveConfigurationService.addIncentiveConfig(this.addIncentiveConfig.value).subscribe({
            next: (res: any) => {
              this.spinner.hide();
              this.alertHelper
                .successAlert(
                  "Saved!",
                  "Incentive configuration created successfully.",
                  "success"
                )
                .then(() => {
                  this.initializeform();
                  this.resetFormArray();
                 /*  this.route.navigate(["./../viewIncentiveConfiguration"], {
                    relativeTo: this.router,
                  }); */
                });
            }, 
            error: (error: any) => {
              this.spinner.hide(); //==== hide spinner
            },
          });
        }
      });
    }
  }

  resetFormArray() {
   
    let frmArray = this.addIncentiveConfig.get('classArr') as FormArray;   
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;   
      // frmArray.removeAt(i)   
    });
  }

   changeClass(event:any){
    const classArr: FormArray = this.addIncentiveConfig.get('classArr') as FormArray;
    let index = this.classArr.indexOf(event.target.value);
    if(event.target.checked){
      classArr.push(new FormControl(event.target.value));
    }else{
      const index = classArr.controls.findIndex(x => x.value === event.target.value);
      classArr.removeAt(index);
    }
  } 
}
