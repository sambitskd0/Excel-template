import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageAnnextureMasterService } from '../../services/manage-annexture-master.service';

@Component({
  selector: 'app-add-annexture-master',
  templateUrl: './add-annexture-master.component.html',
  styleUrls: ['./add-annexture-master.component.css']
})
export class AddAnnextureMasterComponent implements OnInit {

  addAnnextureDataForm!: FormGroup;
  userId: any="";
  annextureType: any="";
  annextureName: any="";
  annextureValue: any="";
  allErrorMessages: string[] = [];
  allLabel: string[] = ["","Annexture Type","Annexture Name","Annexture Value"];

  constructor(
    private formBuilder:FormBuilder,
    private alertHelper:AlertHelper,
    public customValidator:CustomValidators,
    public manageAnnextureMasterService:ManageAnnextureMasterService,
    private spinner: NgxSpinnerService, 
    public commonService:CommonserviceService,
  ) { }

  ngOnInit(): void {
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    console.log(users);
    this.initializeForm();
  }
  initializeForm(){
    this.addAnnextureDataForm = this.formBuilder.group({
      userId:[this.userId],
      annextureType: [
        this.annextureType,
        [Validators.required, Validators.maxLength(25),Validators.pattern(/^[A-Z_]*$/)],
      ],
      annextureName: [
        this.annextureName,
        [Validators.required, Validators.maxLength(25),Validators.pattern(/^[a-zA-Z /]*$/)],
      ],
      annextureValue: [
        this.annextureValue,
        [Validators.required, Validators.maxLength(2),Validators.pattern(/^[1-9]*$/)],
      ],
    })
  }

  onSubmit(){
    this.customValidator.formValidationHandler(
      this.addAnnextureDataForm,
      this.allLabel
    );

    if (this.addAnnextureDataForm.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          this.manageAnnextureMasterService
            .createAnnextureData(this.addAnnextureDataForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Annexture Data created successfully.",
                    "success"
                  )
                  .then(() => {
                    this.initializeForm();
                  });
              },
              error: (error: any) => {
                this.spinner.hide();
                console.log(error);
              },
            });
        }
      });
    }
  }

}
