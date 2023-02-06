import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { ManageClusterService } from '../../services/manage-cluster.service';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { NgxSpinnerService } from "ngx-spinner";
import { Constant } from 'src/app/shared/constants/constant';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-cluster',
  templateUrl: './add-cluster.component.html',
  styleUrls: ['./add-cluster.component.css']
})
export class AddClusterComponent implements OnInit {
  clusterForm!: FormGroup;
  submitted = false;
  posts: any; 
  clusterName: any = "";
  clusterCode: any = "";
  districtId: any = "";
  blockId: any = "";
  allDistrict:any;
  showSpinnerBlock: boolean = false;
  blockData: any = [];
  allErrorMessages: string[] = [];
  allLabel: string[] = ["","","District","Block", "Cluster name","Cluster code"];
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  userId: any;
  profileId: any;
  districtLoading:boolean=false;
  blockLoading:boolean=false;
  adminPrivilege: boolean = false;
  constructor(private formBuilder: FormBuilder,
    private commonserviceService:CommonserviceService,
    private manageClusterService:ManageClusterService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private alertHelper: AlertHelper ,
    private router:Router,
    public customValidators:CustomValidators,
    private el:ElementRef,
    private spinner: NgxSpinnerService) 
    {const pageUrl:any = this.router.url;  
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
    this.el.nativeElement.querySelector("[formControlName=districtId]").focus();
    this.districtLoading = true;
    this.commonserviceService.getAllDistrict().subscribe((data:[])=>{
      this.posts = data;
      this.allDistrict = this.posts.data; 
      this.districtLoading = false;    
     }); 
   
  }
  initializeForm() {
    this.clusterForm = this.formBuilder.group({
      userId:[this.userId],
      profileId:[this.profileId],
      districtId:[this.districtId,Validators.required],
      blockId:[this.blockId,Validators.required],
      clusterName: [this.clusterName, [Validators.required,Validators.pattern('^[a-zA-Z \-\']+'),Validators.maxLength(25),Validators.minLength(2),this.customValidators.firstCharValidatorRF
    ]],
      clusterCode: [this.clusterCode, [Validators.required,Validators.pattern('^[0-9]*$'),Validators.maxLength(10),Validators.minLength(10),Validators.min(1),this.customValidators.firstCharValidatorRF
    ]]
    });
  }
  getBlock(id: any) {   
    this.showSpinnerBlock = true;
    const districtId = id;
    this.blockData = [];    
    this.clusterForm.patchValue({
      blockId: "",
    });
    this.blockLoading = true;
    this.commonserviceService.getBlockByDistrictid(districtId).subscribe((res) => {      
      let data: any = res;
      for (let key of Object.keys(data['data'])) {
        this.blockData.push(data['data'][key]);
      }
      this.showSpinnerBlock = false;
      this.blockLoading = false;
    });
  }
  get clusterFormControl() {
    return this.clusterForm.controls;
  }
 
  onSubmit(){
    // if ("INVALID" === this.clusterForm.status) {
    //   for (const key of Object.keys(this.clusterForm.controls)) {
    //     if (this.clusterForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.clusterForm,this.allLabel);
    //       break;
    //     }
    //   }
    // }

    if (this.clusterForm.invalid) {
      this.customValidators.formValidationHandler(
        this.clusterForm,
        this.allLabel,
        this.el,
        {
          required: {
            districtId:
              "Please select a district name.",
              blockId:
              "Please select a block name.",  
              clusterName:
              "Please enter cluster name.",  
              clusterCode:
              "Please enter cluster code.",  
            },
        }
      );
    }
    if (this.clusterForm.invalid) {
      return;
    }
    if (this.clusterForm.valid === true) {
      this.alertHelper.submitAlert().then((result) => { 
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.manageClusterService
            .createCluster(this.clusterForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                .successAlert(
                  "Saved!",
                  "New cluster record added successfully.",
                  "success"
                )
                .then(() => {
                  this.initializeForm();
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
