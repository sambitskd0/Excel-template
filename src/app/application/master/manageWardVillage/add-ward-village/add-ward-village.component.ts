import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageWardVillageService } from '../../services/manage-ward-village.service';

@Component({
  selector: 'app-add-ward-village',
  templateUrl: './add-ward-village.component.html',
  styleUrls: ['./add-ward-village.component.css'] 
})
export class AddWardVillageComponent implements OnInit {
  posts: any;
  wardVillageform!: FormGroup;
  allDistrict:any;
  blockData: any = [];
  optionValue:any='';
  municipaltyData: any =  [];
  panchayatData:any=[];
  blockId:any='';
  districtId:any='';
  panchayatId: any = "";
  villageType: any = "";
  villageName: any = "";
  villageCode: any = "";
  wardName: any = "";
  wardCode: any = "";
  blockChanged:boolean = false; 
  muncipalityChanged:boolean = false; 
  panchayatChanged:boolean = false; 
  showSpinnerBlock: boolean = false;
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  allLabel: string[] = ["","","Type","District","Block","Panchayat/Municipality","Village name","Village code","Ward name","Ward code"];
  submitted = false;
  userId: any;
  profileId: any;
  districtLoading:boolean=false;
  blockLoading:boolean=false;
  panchayatLoading:boolean=false;
  municipalityLoading:boolean=false;
  adminPrivilege: boolean = false;
  constructor(public commonserviceService:CommonserviceService,
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper, 
    public customValidators: CustomValidators,
    private router:Router,
    private el:ElementRef,
    public manageWardVillageService:ManageWardVillageService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private spinner: NgxSpinnerService,) {
    const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For authorization
     }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.initializeForm();
    this.el.nativeElement.querySelector("[formControlName=villageType]").focus();
  }
  getDistrict(){
    this.districtLoading = true;
    this.commonserviceService.getAllDistrict().subscribe((data:[])=>{
      this.posts = data;
      this.allDistrict = this.posts.data;
      this.districtLoading = false;
    });
  }
  // conditional validation
  conditionalValidator(
    predicate: any,
    validator: ValidatorFn,
    errorNamespace: string,
    validationType: string
  ): ValidatorFn {
    return (formControl: any) => {
      let conditionStatus = false;
      let parentValue = parseInt(predicate());

      // 1) if parent empty
      if (!formControl.parent) {
        return null;
      }
      
      let error = null;

       // validation logic for blockContent
       if (validationType === "blockId" && parentValue == 2) {
        conditionStatus = true;
      } 
       // validation logic for panchayatId
      if (validationType === "panchayatId" && (parentValue == 2 || parentValue == 1)) {
        conditionStatus = true;
      } 
      // validation logic for villageName
      if (validationType === "villageName" && parentValue == 2) {
        conditionStatus = true;
      } 
      // validation logic for villageCode
      if (validationType === "villageCode" && parentValue == 2) {
        conditionStatus = true;
      } 
      // validation logic for wardName
      if (validationType === "wardName" && parentValue == 1) {
        conditionStatus = true;
      } 
      // validation logic for wardCode
      if (validationType === "wardCode" && parentValue == 1) {
        conditionStatus = true;
      } 
     
      // 2) check childs direct parent field
      if (conditionStatus) {
        error = validator(formControl); // validate
      } else {
        error = null;
      }

      // 3) set conditional validation
      if (errorNamespace && error) {
        const customError: any = {}; // custom error property
        customError[errorNamespace] = error;
        error = customError;
      }
      return error;
    };
  }
  
  initializeForm() {
    this.wardVillageform = this.formBuilder.group({ 
        userId:[this.userId],
        profileId:[this.profileId],
        villageType:[this.villageType,Validators.required],
        districtId:[this.districtId,Validators.required],
        blockId:[this.blockId,
          [
            this.conditionalValidator(
              () => this.wardVillageform?.get("villageType")?.value,
              Validators.required,
              "conditionalValidation",
              "blockId"
            ),
            Validators.pattern('^[0-9]*$'), 
          ],
        ],
        panchayatId:[this.panchayatId,
          [
            this.conditionalValidator(
              () => this.wardVillageform?.get("villageType")?.value,
              Validators.required,
              "conditionalValidation",
              "panchayatId"
            ),
            Validators.pattern('^[0-9]*$'), 
          ],
        ],
        villageName:[this.villageName,
          [
            this.conditionalValidator(
              () => this.wardVillageform?.get("villageType")?.value,
              Validators.required,
              "conditionalValidation",
              "villageName"
            ),
            // Validators.pattern('^[a-zA-Z0-9. \-\']+'), Validators.maxLength(40),Validators.minLength(2),this.customValidators.firstCharValidatorRF
            Validators.pattern('^[a-zA-Z0-9. ()-]+'), Validators.maxLength(40),Validators.minLength(2),this.customValidators.firstCharValidatorRF
          ],
        ],
        villageCode:[this.villageCode,
          [
            this.conditionalValidator(
              () => this.wardVillageform?.get("villageType")?.value,
              Validators.required,
              "conditionalValidation",
              "villageCode"
            ),
            Validators.pattern('^[0-9]*$'),Validators.maxLength(9),Validators.min(1),this.customValidators.firstCharValidatorRF
          ],
        ],
        wardName:[this.wardName,
          [
            this.conditionalValidator(
              () => this.wardVillageform?.get("villageType")?.value,
              Validators.required,
              "conditionalValidation",
              "wardName"
            ),
            // Validators.pattern('^[a-zA-Z0-9. \-\']+'),Validators.maxLength(40),Validators.minLength(2),this.customValidators.firstCharValidatorRF
            Validators.pattern('^[a-zA-Z0-9. ()-]+'),Validators.maxLength(40),Validators.minLength(2),this.customValidators.firstCharValidatorRF
          ],
        ],
        wardCode:[this.wardCode,
          [
            this.conditionalValidator(
              () => this.wardVillageform?.get("villageType")?.value,
              Validators.required,
              "conditionalValidation",
              "wardCode"
            ),
            Validators.pattern('^[0-9]*$'),Validators.maxLength(9),Validators.min(1),this.customValidators.firstCharValidatorRF
          ],
        ],
      });
  }
  typeChange(val: any) {
    this.getDistrict();
    this.villageType = val;
    if( this.villageType == 1){
      this.wardVillageform.patchValue({districtId: ""});
      this.wardVillageform.patchValue({blockId: ""});
      this.wardVillageform.patchValue({panchayatId: ""});
      this.wardVillageform.patchValue({villageName: ""});
      this.wardVillageform.patchValue({villageCode: ""});
      this.municipaltyData=[];
    }
    if( this.villageType == 2){
      this.wardVillageform.patchValue({districtId: ""});
      this.wardVillageform.patchValue({blockId: ""});
      this.wardVillageform.patchValue({panchayatId: ""});
      this.wardVillageform.patchValue({wardName: ""});
      this.wardVillageform.patchValue({wardCode: ""});
      this.blockData=[];
    }
    
  }
  getBlock(id: any) {
    const districtId = id;
      if(this.wardVillageform?.get("villageType")?.value==2){
        if(districtId==""){
          this.blockData = [] 
          this.panchayatData = [] ;
        }else{
          this.blockChanged = true;
          this.blockData = [];
          this.panchayatData = [] ;
          this.blockLoading = true;
          this.commonserviceService.getBlockByDistrictid(districtId).subscribe((res) => {
          let data: any = res;
          for (let key of Object.keys(data['data'])) {
            this.blockData.push(data['data'][key]);
          }
          this.blockChanged = false;
          this.blockLoading = false;
        });
       }
      }
      else{
        this.getMunipalty(districtId);
      }
  }
  getMunipalty(districtId:any){
    this.muncipalityChanged = true;
   
    if(districtId==""){
      this.municipaltyData = [] ;
      this.muncipalityChanged = false;
    }else{ this.blockId=0;
      this.municipaltyData = [];
       this.villageType=1;
       this.municipalityLoading = true;
      this.commonserviceService.getmunicipaltyByBlockId(districtId,this.blockId,this.villageType).subscribe((res) => {
        let data: any = res;
        for (let key of Object.keys(data['data'])) {
          this.municipaltyData.push(data['data'][key]);
        }
        this.muncipalityChanged = false;
        this.municipalityLoading = false;
      });}
  
  }
  getPanchayat(Id:any){
    this.panchayatChanged = true;
  
    this.villageType=2;   
    const blockId = Id;
    if(blockId == ""){
      this.panchayatChanged = false;
      this.panchayatData=[];
    }
  else{
    this.panchayatData=[];
    this.panchayatLoading = true;
    this.commonserviceService.getmunicipaltyByBlockId(this.districtId,blockId,this.villageType).subscribe((res) => {
      let data: any = res;
      for (let key of Object.keys(data['data'])) {
        this.panchayatData.push(data['data'][key]);
      }
          this.panchayatChanged = false;
          this.panchayatLoading = false;
    });
    
  }
  }
  onSubmit(){
    this.submitted = true;    
   
    // if ("INVALID" === this.wardVillageform.status) {
    //   for (const key of Object.keys(this.wardVillageform.controls)) {
    //     if (this.wardVillageform.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.wardVillageform,this.allLabel);
    //       break;
    //     }
    //   }
    // }
    if (this.wardVillageform.invalid) {
      this.customValidators.formValidationHandler(this.wardVillageform, this.allLabel, this.el);
    }
    if (this.wardVillageform.invalid) {
      return;
    }

    if (this.wardVillageform.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          //const districttId=this.wardVillageform.value.districtId;
          this.manageWardVillageService.createWardVillage(this.wardVillageform.value).subscribe({
            next: (res: any) => {
              this.spinner.hide(); //==== hide spinner
              this.alertHelper
                .successAlert(
                  "Saved!",
                  "Ward/village created successfully.",
                  "success"
                )
                .then(() => {
                  this.initializeForm();
                  this.wardVillageform.patchValue({districtId: ""});
                  this.wardVillageform.patchValue({blockId: ""});
                  this.wardVillageform.patchValue({panchayatId: ""});
                 
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
