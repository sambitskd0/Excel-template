import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import {CustomValidators} from 'src/app/shared/validations/custom-validators';
import { SubjectService } from '../../services/subject.service';
import { NgxSpinnerService } from "ngx-spinner";
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-subject',
  templateUrl: './add-subject.component.html',
  styleUrls: ['./add-subject.component.css']
})
export class AddSubjectComponent implements OnInit {
  
addSubjectForm!: FormGroup;
  allErrorMessages: string[] = [];
  allLabel: string[] = ["","","Subject name"];
  subject: any = "";
  description: any;
  userId: any;
  profileId: any;
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  tabs: any = [];  //For shwoing tabs
  adminPrivilege: boolean = false;
  constructor(private userdata:SubjectService, 
    private formBuilder:FormBuilder, 
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private alertHelper:AlertHelper,
    private router:Router,
    public commonserviceService:CommonserviceService, 
    public customValidators:CustomValidators,
    private el:ElementRef,
    private spinner: NgxSpinnerService
  ) {
    const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For authorization
    this.tabs = this.privilegeHelper.PrimaryLinkTabNames(pageUrl);  //For shwoing tabs 
  }
  

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.initializeForm();
    this.el.nativeElement.querySelector("[formControlName=subject]").focus();
  }
  initializeForm(){

    this.addSubjectForm = this.formBuilder.group({
      userId:[this.userId],
      profileId:[this.profileId],
      subject: [
        this.subject,
        [Validators.required,Validators.pattern('^[a-zA-Z \-\']+') ,Validators.maxLength(30),Validators.minLength(3),this.customValidators.firstCharValidatorRF],
      ],
      description: [
          this.description,
          [Validators.maxLength(300)],
        ]
    })
  }
  get subjectFormControl() {
    return this.addSubjectForm.controls;
  }
  onSubmit() {
    // if ("INVALID" === this.addSubjectForm.status) {
    //   for (const key of Object.keys(this.addSubjectForm.controls)) {
    //     if (this.addSubjectForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.addSubjectForm,this.allLabel);
    //       break;
    //     }
    //   }
    // }
    if (this.addSubjectForm.invalid) {
      this.customValidators.formValidationHandler(this.addSubjectForm, this.allLabel, this.el);
    }
    if (this.addSubjectForm.invalid) {
      return;
    }

    if (this.addSubjectForm.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show(); 
    
          this.userdata
            .saveusers(this.addSubjectForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Subject created successfully",
                    "success"
                  )
                  .then(() => {
                    this.initializeForm();
                  });
              },
              error: (error: any) => {
                this.spinner.hide(); 
              },
            });
        }
      });
    }
  }
}


