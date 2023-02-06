import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import {CustomValidators} from 'src/app/shared/validations/custom-validators';
import { ShiftmasterService } from '../../services/shiftmaster.service';
import { NgxSpinnerService } from "ngx-spinner";
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-shiftmaster',
  templateUrl: './add-shiftmaster.component.html',
  styleUrls: ['./add-shiftmaster.component.css']
})
export class AddShiftmasterComponent implements OnInit {

  addShiftMasterForm!: FormGroup;
  allErrorMessages: string[] = [];
  allLabel: string[] = ["","","Shift","Period from time","Period to time"];
  shift: any = "";
  shiftStartTime: any;
  shiftEndTime:any;
  userId:any="";
  profileId:any="";
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;

  constructor(private shiftmasterservice:ShiftmasterService, 
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private formBuilder:FormBuilder, 
    private alertHelper:AlertHelper, 
    public commonserviceService:CommonserviceService,
    public customValidators:CustomValidators,
    private el:ElementRef,
    private spinner: NgxSpinnerService) { 
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
    this.el.nativeElement.querySelector("[formControlName=shift]").focus();
  }
  initializeForm(){

    this.addShiftMasterForm = this.formBuilder.group({
      userId:[this.userId],
      profileId:[this.profileId],
      shift: [
        this.shift,
        [Validators.required],
      ],
      shiftStartTime: [
        this.shiftStartTime,
        [Validators.required],
      ],
      shiftEndTime: [
        this.shiftEndTime,
        [Validators.required],
      ]
    })
  }
  get subjectFormControl() {
    return this.addShiftMasterForm.controls;
  }
  onSubmit() {
    // if ("INVALID" === this.addShiftMasterForm.status) {
    //   for (const key of Object.keys(this.addShiftMasterForm.controls)) {
    //     if (this.addShiftMasterForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.addShiftMasterForm,this.allLabel);
    //       break;
    //     }
    //   }
    // }
    if (this.addShiftMasterForm.invalid) {
      this.customValidators.formValidationHandler(this.addShiftMasterForm, this.allLabel, this.el);
    }
    if (this.addShiftMasterForm.invalid) {
      return;
    }

    if (this.addShiftMasterForm.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show(); 
          this.shiftmasterservice
            .addshiftmaster(this.addShiftMasterForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Shiftmaster created successfully.",
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
