import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { IndustrialTrainingService } from '../../services/industrial-training.service';

@Component({
  selector: 'app-edit-training-agency',
  templateUrl: './edit-training-agency.component.html',
  styleUrls: ['./edit-training-agency.component.css']
})
export class EditTrainingAgencyComponent implements OnInit {
  trainingAgency!: FormGroup;
  allErrorMessages: string[] = [];
  allLabel: string[] = ["Agency name","Description","Contact person name","Contact mobile number"];
  agencyName: any = "";
  description: any = "";
  contactPerson: any = "";
  contactNumber: any = "";
  submitted = false;
  id: any = "";
  encId: any = "";
  userProfile:any=[];
  updatedBy:any="";
  trainingAgencyData: any="";
  plPrivilege:string="view"; //For menu privilege
	adminPrivilege: boolean = false;
  config = new Constant();
  constructor(private formBuilder: FormBuilder,
    private industrialTraining: IndustrialTrainingService,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private spinner: NgxSpinnerService,
    private el: ElementRef,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
  	private route: Router,
    private router: ActivatedRoute,
    private commonserviceService: CommonserviceService) 
    { 
    const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization
    }

  ngOnInit(): void {
    this.spinner.show();
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    this.userProfile = this.commonserviceService.getUserProfile();
    this.id = this.router.snapshot.params["encId"];
    this.editTrainingAgency(this.id);
    this.el.nativeElement.querySelector("[formControlName=agencyName]").focus();
    this.initializeForm();
  }
  initializeForm() {
    this.trainingAgency = this.formBuilder.group({
      agencyName: [this.agencyName,[Validators.required, Validators.maxLength(70),Validators.pattern(/^[a-zA-Z0-9. ]*$/),this.customValidators.firstCharValidatorRF] ], 
      description: [this.description,this.customValidators.firstCharValidatorRF],
      contactPerson: [this.contactPerson,[Validators.required, Validators.maxLength(70),Validators.pattern(/^[a-zA-Z. ]*$/),this.customValidators.firstCharValidatorRF]],
      contactNumber: [this.contactNumber,[Validators.required, Validators.minLength(10),Validators.pattern("^[0-9]*$"),this.customValidators.firstCharValidatorRF]],
      encId: [this.id],
      updatedBy: [this.userProfile.userId],
    });
  }
  onSubmit(){
    this.submitted = true;  
    // if ("INVALID" === this.trainingAgency.status) {
    //   for (const key of Object.keys(this.trainingAgency.controls)) {
    //     if (this.trainingAgency.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(
    //         this.trainingAgency,
    //         this.allLabel
    //       );
    //       break;
    //     }
    //   }
    // }

    if(this.trainingAgency.invalid){
      this.customValidators.formValidationHandler(
                this.trainingAgency,
                this.allLabel,
                this.el
              );
    }
    
    if (this.trainingAgency.valid === true) {
      this.alertHelper.updateAlert(
        "Do you want to Update?",
        "question",
        "Yes, Update it!",
        "No, keep it"
      ).then((result) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.industrialTraining
            .updateTrainingAgency(this.trainingAgency.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Training agency updated successfully.",
                    "success"
                  )
                  .then(() => {
                    this.route.navigate(["../../viewTrainingAgency"], {
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
  editTrainingAgency(id:any){
    this.industrialTraining.getTrainingAgency(this.id).subscribe((resp: any) => {
      this.trainingAgencyData = resp.data[0];
      this.agencyName = this.trainingAgencyData.agencyName;
      this.description = this.trainingAgencyData.description;     
      this.contactPerson = this.trainingAgencyData.contactPerson;     
      this.contactNumber = this.trainingAgencyData.contactNumber;     
      this.encId = this.trainingAgencyData.encId;     
      this.initializeForm();
      this.spinner.hide();
    });
  }
}
