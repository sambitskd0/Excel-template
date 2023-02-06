import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageNotificationComponentService } from '../../services/manage-notification-component.service';

@Component({
  selector: 'app-add-notification-component',
  templateUrl: './add-notification-component.component.html',
  styleUrls: ['./add-notification-component.component.css']
})
export class AddNotificationComponentComponent implements OnInit {


  addNotificationComponentForm!: FormGroup;

  allErrorMessages: string[] = [];
  allLabel: string[] = ["","","Category name","Component name"];
  notifyCatName: any = "";
  notifyCompName: any = "";
  catDatas:any="";
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  userId: any;
  profileId: any;
  adminPrivilege: boolean = false;
  constructor(
    private formBuilder:FormBuilder,
    private alertHelper:AlertHelper,
    public customValidator:CustomValidators,
    public manageNotificationComponentService:ManageNotificationComponentService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private spinner: NgxSpinnerService, 
    public commonService:CommonserviceService,
    private el:ElementRef,
  ) {
    const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For authorization

   }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.el.nativeElement.querySelector("[formControlName=notifyCatName]").focus();
    this.manageNotificationComponentService.getNotificationCategoryName().subscribe((data:[])=>{
      this.catDatas = data;
      this.catDatas = this.catDatas.data;   
     }); 
     this.initializeForm();
  }

  initializeForm(){
    this.addNotificationComponentForm = this.formBuilder.group({
      userId:[this.userId],
      profileId:[this.profileId],
      notifyCatName: [
        this.notifyCatName,
        [Validators.required,Validators.pattern(/^[0-9]+$/)],
      ],
      notifyCompName: [
        this.notifyCompName,
        [Validators.required, Validators.maxLength(50),Validators.minLength(2),Validators.pattern(/^[a-zA-Z ]+$/),this.customValidator.firstCharValidatorRF],
      ],
    })
  }
  onSubmit(){
    // if ("INVALID" === this.addNotificationComponentForm.status) {
    //   for (const key of Object.keys(this.addNotificationComponentForm.controls)) {
    //     if (this.addNotificationComponentForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidator.formValidationHandler(this.addNotificationComponentForm,this.allLabel);
    //       break;
    //     }
    //   }
    // }
    if (this.addNotificationComponentForm.invalid) {
      this.customValidator.formValidationHandler(this.addNotificationComponentForm, this.allLabel, this.el);
    }
    if (this.addNotificationComponentForm.invalid) {
      return;
    }

    if (this.addNotificationComponentForm.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          this.manageNotificationComponentService
            .createNotificationComponent(this.addNotificationComponentForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Notification component created successfully.",
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
