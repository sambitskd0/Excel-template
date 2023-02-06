import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { NgxSpinnerService } from 'ngx-spinner';
import { TeacherTransferService } from '../../services/teacher-transfer.service';
import { Constant } from 'src/app/shared/constants/constant';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-raise-transfer-request',
  templateUrl: './raise-transfer-request.component.html',
  styleUrls: ['./raise-transfer-request.component.css']
})
export class RaiseTransferRequestComponent implements OnInit {
  public userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');

  transferRequestForm !: FormGroup;
  submitted = false;

  transferDistrict: any = "";
  transferBlock: any    = "";
  transferCluster: any  = "";
  transferSchool: any   = "";  
  schoolCategory: any   = "";
  transferSchoolCategory: any = "";
  transferDescription: any    = "";

  disrtictChanged:boolean = false;  
  blockChanged:boolean    = false; 
  clusterChanged:boolean  = false;
  schoolChanged:boolean   = false;
  districtData: any       = [];
  blockData: any          = [];
  clusterData: any        = [];
  schoolData: any         = [];

  allLabel: string[] = ["District", "Block", "Cluster", "School", "Remark"];
  plPrivilege:string="view"; //For menu privilege
	adminPrivilege: boolean = false;
  config = new Constant();

  constructor(
    private formBuilder: FormBuilder, 
    public customValidators: CustomValidators,
    private el: ElementRef,
    private commonService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
  	private router:Router, 
    private alertHelper: AlertHelper, 
    private spinner: NgxSpinnerService, 
    private transferService: TeacherTransferService
  ) { 
    const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For authorization
    }

  ngOnInit(): void {
     if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    this.el.nativeElement.querySelector('[formControlName=transferDistrict]').focus();
    this.getDistrict();
    this.initializeForm();
  }  

  initializeForm() {
    this.transferRequestForm = this.formBuilder.group({
      transferDistrict: [
        this.transferDistrict, [Validators.required],
      ],
      transferBlock: [
        this.transferBlock, [Validators.required],
      ],
      transferCluster: [
        this.transferCluster, [Validators.required],
      ],
      transferSchool: [
        this.transferSchool, [Validators.required],
      ],      
      transferDescription: [
        this.transferDescription, [Validators.required,Validators.maxLength(300)],
      ],
      transferSchoolCategory:[this.transferSchoolCategory],
    });
  }
  
  getDistrict(){   
    this.disrtictChanged = true;
    this.commonService.getAllDistrict().subscribe((data:any)=>{
      this.districtData = data;
      this.districtData = this.districtData.data; 
      this.disrtictChanged = false;
    });    
  }

  getBlock(districtId: any) { 
    this.blockChanged = true;

    this.blockData = [];
    this.transferRequestForm.patchValue({"transferBlock":""}); 

    this.clusterData = [];
    this.transferRequestForm.patchValue({"transferCluster":""});

    this.schoolData = [];    
    this.transferRequestForm.patchValue({"transferSchool":""});

    this.schoolCategory = "";
    this.transferRequestForm.patchValue({"transferSchoolCategory":""});

    if(districtId !== ''){  
      this.commonService.getBlockByDistrictid(districtId).subscribe((res: any) => {      
        this.blockData = res;
        this.blockData = this.blockData.data; 
        this.blockChanged = false;         
      });
    } else{      
      this.blockChanged = false;        
    }       
  }

  getCluster(blockId: any) {      
    this.clusterChanged = true;

    this.clusterData = [];
    this.transferRequestForm.patchValue({"transferCluster":""});

    this.schoolData = [];    
    this.transferRequestForm.patchValue({"transferSchool":""});

    this.schoolCategory = "";
    this.transferRequestForm.patchValue({"transferSchoolCategory":""});

    if(blockId !== ''){  
      this.commonService.getClusterByBlockId(blockId).subscribe((res: any) => {      
        this.clusterData = res;
        this.clusterData = this.clusterData.data;
        this.clusterChanged = false;
      });      
    }else{
      this.clusterChanged = false; 
    }   
  }

  getSchool(clusterId:any){ 
    this.schoolChanged = true;

    this.schoolData = [];    
    this.transferRequestForm.patchValue({"transferSchool":""});

    this.schoolCategory = "";
    this.transferRequestForm.patchValue({"transferSchoolCategory":""});

    if(clusterId !== ''){  
      this.commonService.getSchoolList(clusterId).subscribe((res:any) => {      
        this.schoolData = res;
        this.schoolData = this.schoolData.data;

        if(this.userProfile.loginUserTypeId != 3){
          this.schoolData = this.schoolData.filter((sch: any) => {
            return sch.schoolUdiseCode != this.userProfile.udiseCode;
          });
        }

        this.schoolChanged = false;
      });
    }else{
      this.schoolChanged = false; 
    }
  }

  getSchoolCategory(schoolId:any){
    let matchedSchool: any = [];
    matchedSchool = this.schoolData.filter((sch: any) => {
      return sch.schoolId == schoolId;
    });
    this.schoolCategory = matchedSchool[0].schlCatName;
    this.transferRequestForm.patchValue({"transferSchoolCategory":matchedSchool[0].schoolCategory});
    
  }

  submitTransferRequest(){
    this.submitted = true;
    this.customValidators.formValidationHandler(this.transferRequestForm, this.allLabel);

    if(this.transferRequestForm.valid == true){
      this.alertHelper.submitAlert().then((result) => {
        if(result.value){
          this.spinner.show();
          this.transferService.raiseTransferRequest(this.transferRequestForm.value).subscribe({
            next: (res: any) => {
              this.spinner.hide();
              this.alertHelper.successAlert(
                "Saved!",
                "Transfer request raised successfully.",
                "success"
              ).then(()=>{
                this.schoolCategory = "";
                this.transferRequestForm.patchValue({"transferSchoolCategory":""});
                this.initializeForm();
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
          });
        }
      });  
    }
  }



}
