import { Component, ElementRef, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageGrantConfigService } from '../../services/manage-grant-config.service';

@Component({
  selector: 'app-add-grant-configuration',
  templateUrl: './add-grant-configuration.component.html',
  styleUrls: ['./add-grant-configuration.component.css']
})
export class AddGrantConfigurationComponent implements OnInit {
  addGrantConfigForm!:FormGroup;
  schoolType :any = "";
  allErrorMessages: string[] = [];
  allLabel: string[] = ["", "","School Type","Grant Type"];
  userId: any;
  submitted = false;
  grantTypeDatas: any;
  grantTypeArr: any = [];
  
  schoolCategory: any="";
  schoolCategoryData: any="";
  scCatLoading:boolean = false;
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  profileId: any = "";
  constructor(
    private formBuilder:FormBuilder,
    private alertHelper:AlertHelper,
    public customValidator:CustomValidators,
    public manageGrantConfigService:ManageGrantConfigService,
    private spinner: NgxSpinnerService, 
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    public commonService:CommonserviceService,
    private route: Router,
    private el: ElementRef,
    private router: ActivatedRoute
  ) {
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
    this.schoolCategory = users?.schoolCategory;
    this.getSchooltype();
    this.getGrantType();
    this.initializeForm();
    this.el.nativeElement.querySelector("[formControlName=schoolType]").focus();
  }
  getSchooltype(){
    this.manageGrantConfigService.getSchoolCategories(this.schoolCategory).subscribe((res: any)=> {
      this.schoolCategoryData = res?.data;
      this.scCatLoading = false;
    });  
  }
  getGrantType(){
    this.manageGrantConfigService.getGrantTypeData().subscribe((res:any)=>{
     this.grantTypeDatas = res.data;
    });
  }
  initializeForm(){
    this.addGrantConfigForm = this.formBuilder.group({
      userId:[this.userId],
      profileId:[this.profileId],
      schoolType:[this.schoolType,[Validators.required]],
      grantTypeArr: this.formBuilder.array([], Validators.required),
    })
  }
  changeGrantType(event:any){
    const grantTypeArr: FormArray = this.addGrantConfigForm.get('grantTypeArr') as FormArray;
    let index = this.grantTypeArr.indexOf(event.target.value);
    if(event.target.checked){
      grantTypeArr.push(new FormControl(event.target.value));
    }else{
      const index = grantTypeArr.controls.findIndex(x => x.value === event.target.value);
      grantTypeArr.removeAt(index);
  }
    
  }
  onSubmit(){
    this.submitted = true;
    // this.customValidator.formValidationHandler(this.addGrantConfigForm, this.allLabel);
    if (this.addGrantConfigForm.invalid) {
      // this.customValidator.formValidationHandler(
      //   this.addGrantConfigForm,
      //   this.allLabel,
      //   this.el
      // );
      this.customValidator.formValidationHandler(
        this.addGrantConfigForm,
        this.allLabel,
        this.el,
        {
          required: {
            schoolType: "Please select school type",
            grantTypeArr: "Please select grant types",
          },
        }
      );
    }
    if (this.addGrantConfigForm.valid === true) {
      this.alertHelper.submitAlert().then((result:any) => {
        if (result.value) {
          this.spinner.show();
          this.manageGrantConfigService.addGrantConfigData(this.addGrantConfigForm.value).subscribe({
            next: (res: any) => {
              this.spinner.hide();
              this.alertHelper
                .successAlert(
                  "Saved!",
                  "Grant configuration created successfully.",
                  "success"
                )
                .then(() => {
                  this.initializeForm();
                  this.route.navigate(["./../viewGrantConfiguration"], {
                    relativeTo: this.router,
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
  }

}
