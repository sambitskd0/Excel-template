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
  selector: 'app-edit-training-category',
  templateUrl: './edit-training-category.component.html',
  styleUrls: ['./edit-training-category.component.css']
})
export class EditTrainingCategoryComponent implements OnInit {
  trainingCategory!: FormGroup;
  allErrorMessages: string[] = [];
  allLabel: string[] = ["Training name","Description"];
  trainingName: any = "";
  description: any = "";
  submitted = false;
  id: any = "";
  encId: any = "";
  trainingData:any ="";
  userProfile:any=[];
  updatedBy:any="";
  plPrivilege:string="view"; //For menu privilege
	adminPrivilege: boolean = false;
  config = new Constant();
  constructor( private formBuilder: FormBuilder,
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
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    this.userProfile = this.commonserviceService.getUserProfile();
    this.spinner.show();
    this.id = this.router.snapshot.params["encId"];
    this.editTrainingCategory(this.id);
    this.el.nativeElement.querySelector("[formControlName=trainingName]").focus();
    this.initializeForm();
  }
  initializeForm() {
    this.trainingCategory = this.formBuilder.group({
      trainingName: [this.trainingName,[Validators.required, Validators.maxLength(70),Validators.pattern(/^[a-zA-Z0-9.-/ ]*$/),this.customValidators.firstCharValidatorRF] ], 
      description: [this.description,this.customValidators.firstCharValidatorRF],
      encId: [this.id],
      updatedBy: [this.userProfile.userId],
    });
  }
  editTrainingCategory(id:any){
    this.industrialTraining.getTrainingCategory(this.id).subscribe((resp: any) => {
      this.trainingData = resp.data[0];
      this.trainingName = this.trainingData.trainingName;
      this.description = this.trainingData.description;     
      this.encId = this.trainingData.encId;
    
      this.initializeForm();
      this.spinner.hide();
    });
  }
  onSubmit(){
    this.submitted = true;  
    // if ("INVALID" === this.trainingCategory.status) {
    //   for (const key of Object.keys(this.trainingCategory.controls)) {
    //     if (this.trainingCategory.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(
    //         this.trainingCategory,
    //         this.allLabel
    //       );
    //       break;
    //     }
    //   }
    // }
    if(this.trainingCategory.invalid){
      this.customValidators.formValidationHandler(
                this.trainingCategory,
                this.allLabel,
                this.el
              );
    }
    
    if (this.trainingCategory.valid === true) {
      this.alertHelper.updateAlert(
        "Do you want to Update?",
        "question",
        "Yes, Update it!",
        "No, keep it"
      ).then((result) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.industrialTraining
            .updateTrainingCategory(this.trainingCategory.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Type of training updated successfully.",
                    "success"
                  )
                  .then(() => {
                    this.route.navigate(["../../viewTrainingCategory"], {
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
}
