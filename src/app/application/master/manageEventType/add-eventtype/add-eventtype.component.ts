import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import {CustomValidators} from 'src/app/shared/validations/custom-validators';
import { ManageEventTypeService } from '../../services/manage-event-type.service';
import { NgxSpinnerService } from "ngx-spinner";
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-eventtype',
  templateUrl: './add-eventtype.component.html',
  styleUrls: ['./add-eventtype.component.css']
})
export class AddEventtypeComponent implements OnInit {

  addEventTypeForm!: FormGroup;
  allErrorMessages: string[] = [];
  allLabel: string[] = ["","","Event type",];
  eventType: any = "";
  description:any="";
  userId:any="";
  profileId:any="";
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  tabs: any = [];  //For shwoing tabs
  constructor(private manageeventtypeservice:ManageEventTypeService, 
    private formBuilder:FormBuilder, 
    private alertHelper:AlertHelper,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege 
    public customValidators:CustomValidators,
    private router:Router,
    private el:ElementRef,
    public commonserviceService:CommonserviceService,
    private spinner: NgxSpinnerService) {
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
    this.el.nativeElement.querySelector("[formControlName=eventType]").focus();
    
  }
  initializeForm(){

    this.addEventTypeForm = this.formBuilder.group({
      userId:[this.userId],
      profileId:[this.profileId],
      eventType: [
        this.eventType,
        [Validators.required,Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/),Validators.maxLength(30),Validators.minLength(3),this.customValidators.firstCharValidatorRF],
      ],
      description: [
        this.description,
        [Validators.maxLength(300)],
        ],
    
    })
  }
  get subjectFormControl() {
    return this.addEventTypeForm.controls;
  }
  onSubmit() {
    // if ("INVALID" === this.addEventTypeForm.status) {
    //   for (const key of Object.keys(this.addEventTypeForm.controls)) {
    //     if (this.addEventTypeForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.addEventTypeForm,this.allLabel);
    //       break;
    //     }
    //   }
    // }

    if (this.addEventTypeForm.invalid) {
      this.customValidators.formValidationHandler(this.addEventTypeForm, this.allLabel, this.el);
    }

    if (this.addEventTypeForm.invalid) {
      return;
    }

    if (this.addEventTypeForm.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show(); 
          this.manageeventtypeservice
            .addEventType(this.addEventTypeForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
              this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Eventtype created successfully",
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
