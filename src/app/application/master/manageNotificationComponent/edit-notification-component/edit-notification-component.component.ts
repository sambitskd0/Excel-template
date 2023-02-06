import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageNotificationComponentService } from '../../services/manage-notification-component.service';

@Component({
  selector: 'app-edit-notification-component',
  templateUrl: './edit-notification-component.component.html',
  styleUrls: ['./edit-notification-component.component.css']
})
export class EditNotificationComponentComponent implements OnInit {

  editNotificationComponentForm!: FormGroup;
  userId: any="";
  profileId: any="";
  id: any="";
  encId: any="";
  notifyCatName: any="";
  notifyCompName: any="";
  componentData: any="";
  parentId: any="";
  catNames: any="";
  allErrorMessages: string[] = [];
  allLabel: string[] = ["","","Category name","Component name",""];
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  constructor(
    public customValidator:CustomValidators,
    private formBuilder:FormBuilder,
    public manageNotificationComponentService:ManageNotificationComponentService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private route: Router,
    private router: ActivatedRoute,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    public commonService:CommonserviceService,
    private el:ElementRef,
  ) {
    const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization

   }

  ngOnInit(): void {
    this.spinner.show();
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.id = this.router.snapshot.params["encId"];
    this.el.nativeElement.querySelector("[formControlName=notifyCatName]").focus();
    this.initializeForm();
    this.editNotificationComponent(this.id);
    this.getCategoryName();
  }
  getCategoryName(){
    this.manageNotificationComponentService.getNotificationCategoryName().subscribe((data:[])=>{
      this.catNames = data;
      this.catNames = this.catNames.data;   
     }); 
  }
  initializeForm() {
    
    this.editNotificationComponentForm = this.formBuilder.group({
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
      encId: [this.encId],
    });
  }
  editNotificationComponent(id: any) {
    this.spinner.show();
    this.manageNotificationComponentService.getNotificationComponentData(this.id).subscribe((res: any) => {
    this.componentData = res;
    
    this.componentData = this.componentData.data;
    this.notifyCompName = this.componentData.categoryName;
    this.notifyCatName = this.componentData.parentId;
    this.encId = this.componentData.encId;
    // this.getCategoryName(this.encId);
    this.initializeForm();
    this.spinner.hide();
    });
  }
  onSubmit() {  
    // if ("INVALID" === this.editNotificationComponentForm.status) {
    //   for (const key of Object.keys(this.editNotificationComponentForm.controls)) {
    //     if (this.editNotificationComponentForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidator.formValidationHandler(this.editNotificationComponentForm,this.allLabel);
    //       break;
    //     }
    //   }
    // }
    if (this.editNotificationComponentForm.invalid) {
      this.customValidator.formValidationHandler(this.editNotificationComponentForm, this.allLabel, this.el);
    }
    if (this.editNotificationComponentForm.invalid) {
      return;
    }
  
    if (this.editNotificationComponentForm.valid === true) {
      this.alertHelper.updateAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          this.manageNotificationComponentService
            .updateNotificationCategory(this.editNotificationComponentForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Notification component updated successfully",
                    "success"
                  )
                  .then(() => {
                    this.route.navigate(["../../viewNotificationComponent"], {
                      relativeTo: this.router,
                    });
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
  onCancel()
  {
    this.route.navigate(["../../viewNotificationComponent"], {
      relativeTo: this.router,
    }); 
  }
}
