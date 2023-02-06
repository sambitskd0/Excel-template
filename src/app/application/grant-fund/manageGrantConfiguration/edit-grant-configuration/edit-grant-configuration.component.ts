import { Component, ElementRef, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageGrantConfigService } from '../../services/manage-grant-config.service';

@Component({
  selector: 'app-edit-grant-configuration',
  templateUrl: './edit-grant-configuration.component.html',
  styleUrls: ['./edit-grant-configuration.component.css']
})
export class EditGrantConfigurationComponent implements OnInit {

  editGrantConfigForm!:FormGroup;
  userId: any = "";
  schoolTypeDatas: any =[];
  grantTypeDatas: any = [];
  grantConfigDatas:any = [];
  allErrorMessages: string[] = [];
  allLabel: string[] = ["", "","School Type","Grant Type"];
  schoolType: any ="";
  id: any="";
  encId: any="";
  schoolTypeName: any="";
  schoolCategory: any="";
  grantTypeArr: any = [];
  submitted: boolean=false;
  scCatLoading:boolean=false;
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  profileId: any = "";
  constructor(
    private formBuilder:FormBuilder,
    private alertHelper:AlertHelper,
    public customValidator:CustomValidators,
    public manageGrantConfigService:ManageGrantConfigService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private spinner: NgxSpinnerService, 
    public commonService:CommonserviceService,
    private route: Router,
    private el: ElementRef,
    private router: ActivatedRoute
  ) { 
    const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization
  }

  ngOnInit(): void {
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.schoolCategory = users?.schoolCategory;
    this.getSchooltype();
    this.getGrantType();
    this.id = this.router.snapshot.params["encId"];
    this.getGrantConfigData(this.id);
    this.initializeForm();
    this.el.nativeElement.querySelector("[formControlName=schoolType]").focus();
  }
  getGrantType(){
    this.manageGrantConfigService.getGrantTypeData().subscribe((res:any)=>{
      this.grantTypeDatas = res.data;
    });
  }
  getSchooltype(){
    this.manageGrantConfigService.getSchoolCategories(this.schoolCategory).subscribe((res: any)=> {
      this.schoolTypeDatas = res?.data;
     // console.log(this.schoolTypeDatas)
      this.scCatLoading = false;
    });  
  }
  initializeForm(){
    this.editGrantConfigForm = this.formBuilder.group({
      userId:[this.userId],
      profileId:[this.profileId],
      schoolType:[this.schoolType,[Validators.required]],
      grantTypeArr:  this.formBuilder.array(this.grantTypeArr, Validators.required),
      encId: [this.encId],
    })
  }

  getGrantConfigData(id: any){
    this.spinner.show();
    this.manageGrantConfigService
    .getGrantConfigData(this.id)
    .subscribe((data: any) => {
      this.grantConfigDatas = data;
      this.grantConfigDatas = this.grantConfigDatas.data;
        this.grantConfigDatas.grantconfigtagged.map((item: any) => {
         this.grantTypeArr.push(item.grantType);
      });
      this.schoolType = this.grantConfigDatas.schoolType;
      this.schoolTypeName = this.grantConfigDatas.schlCatName;
      this.encId = this.grantConfigDatas.encId;
      this.initializeForm();
      this.spinner.hide();
    });
  }

  onSubmit(){
    this.submitted = true;
    // this.customValidator.formValidationHandler(
    //   this.editGrantConfigForm,
    //   this.allLabel
    // );
    if (this.editGrantConfigForm.invalid) {
      // this.customValidator.formValidationHandler(
      //   this.editGrantConfigForm,
      //   this.allLabel,
      //   this.el
      // );
      this.customValidator.formValidationHandler(
        this.editGrantConfigForm,
        this.allLabel,
        this.el,
        {
          required: {
            grantTypeArr: "Please Select grant types",
          },
        }
      );
    }
    if (this.editGrantConfigForm.valid === true) {
      this.alertHelper.updateAlert().then((result) => {
            if (result.value) {
              this.spinner.show(); // ==== show spinner
              this.manageGrantConfigService
                .updateGrantConfigData(this.editGrantConfigForm.value)
                .subscribe({
                  next: (res: any) => {
                    this.spinner.hide(); //==== hide spinner
                    this.alertHelper
                      .successAlert(
                        "Saved!",
                        "Grant configuration updated successfully",
                        "success"
                      )
                      .then(() => {
                        this.route.navigate(["../../viewGrantConfiguration"], {
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
  onCancel()
  {
    this.route.navigate(["../../viewGrantConfiguration"], {
      relativeTo: this.router,
    });
  }
  changeGrantType(event:any){
    const classArr: FormArray = this.editGrantConfigForm.get('grantTypeArr') as FormArray;
    if (this.grantTypeArr.includes(parseInt(event.target.value))) {
      const index = this.grantTypeArr.indexOf(
        parseInt(event.target.value),
        0
      );
      if (index > -1) {
        this.grantTypeArr.splice(index, 1);
      }
    } else {
      this.grantTypeArr.push(parseInt(event.target.value));
    }
    this.initializeForm();
  }
}
