import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { NgxSpinnerService } from 'ngx-spinner';
import { TeacherTransferService } from '../../services/teacher-transfer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandler } from 'src/app/core/helpers/error-handler';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-transfer-request',
  templateUrl: './edit-transfer-request.component.html',
  styleUrls: ['./edit-transfer-request.component.css']
})
export class EditTransferRequestComponent implements OnInit {
  public userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');

  transferRequestForm !: FormGroup;
  submitted = false;

  id: string            = "";
  encId: any            = ""; 
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
  transferData: any       = [];

  allLabel: string[] = ["District", "Block", "Cluster", "School", "Remark"];

  constructor(
    private formBuilder: FormBuilder, 
    public customValidators: CustomValidators,
    private el: ElementRef,
    private commonService: CommonserviceService, 
    private alertHelper: AlertHelper, 
    private spinner: NgxSpinnerService, 
    private transferService: TeacherTransferService, 
    private route: ActivatedRoute, 
    private errorHandler: ErrorHandler, 
    public router: Router
  ) { }

  ngOnInit(): void {
    this.spinner.show();  // ==== show spinner
    this.id = this.route.snapshot.params["encId"];
    this.transferDetails(this.id);
    this.el.nativeElement.querySelector('[formControlName=transferDistrict]').focus();
    this.getDistrict();
    this.initializeForm();
  }  

  transferDetails(editId:string) {
    this.transferService.getTransferDetails(editId).subscribe((res:any)=>{
          this.transferData = res.data[0];
          //this.transferData = res;
          //this.transferData = this.transferData.data[0];

          this.transferDistrict      = this.transferData.transferDistrict;
          this.getBlock(this.transferDistrict);

          this.transferBlock      = this.transferData.transferBlock;
          this.getCluster(this.transferBlock);

          this.transferCluster      = this.transferData.transferCluster;
          this.transferSchool      = this.transferData.transferSchool;
          this.getSchool(this.transferCluster, ()=>{ this.getSchoolCategory(this.transferSchool); });      

          this.transferDescription      = this.transferData.remark;

          this.encId = this.transferData.encId;
          this.initializeForm();
          this.spinner.hide(); //==== hide spinner                      
       
      });    
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
        this.transferDescription, [Validators.maxLength(300)],
      ],
      transferSchoolCategory:[this.transferSchoolCategory],
      encId: [this.encId],
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

  getSchool(clusterId:any, callBackFuncation:any = ""){ 
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

        if(callBackFuncation != ""){ 
          callBackFuncation();
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

  updateTransferRequest(){
    this.submitted = true;
    this.customValidators.formValidationHandler(this.transferRequestForm, this.allLabel);

    if(this.transferRequestForm.valid == true){
      this.alertHelper.updateAlert(
        "Do you want to Update?",
        "question",
        "Yes, Update it!",
        "No, keep it"
      ).then((result) => {
        if(result.value){
          this.spinner.show();
          this.transferService.updateTransferRequest(this.transferRequestForm.value).subscribe({
            next: (res: any) => {
              this.spinner.hide();
              this.alertHelper.successAlert(
                "Saved!",
                "Transfer request updated successfully.",
                "success"
              ).then(()=>{
                this.router.navigate(["../../viewTransferRequest"], {
                  relativeTo: this.route,
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
          });
        }
      });  
    }
  }


}
