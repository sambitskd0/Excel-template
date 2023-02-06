import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageEventMasterService } from '../../../services/manage-event-master.service';

@Component({
  selector: 'app-add-eventmaster',
  templateUrl: './add-eventmaster.component.html',
  styleUrls: ['./add-eventmaster.component.css']
})
export class AddEventmasterComponent implements OnInit {

  addEventMasterForm!: FormGroup;
  submitted = false;
  id: number = 0;
  EventTypeData: any=[];
  eventType: any ="";
  EventCategoryData: any=[];
  categoryName: any = "";
  description: any = "";
  encId: any = "";
  period: any = "";
  eventName: any = "";
  userId:any ="";
  profileId:any ="";
  allErrorMessages: string[] = [];
  allLabel: any = ["","","Period", "Event type",
    "Category name", "Event name"];
    eventTypeLoading:boolean=false;
    eventCatLoading:boolean=false;
    plPrivilege:string="view"; //For menu privilege
    config = new Constant();
    adminPrivilege: boolean = false;
    tabs: any = [];  //For shwoing tabs
  constructor(public customValidators: CustomValidators,
    private fb: FormBuilder,
    public manageeventmasterservice: ManageEventMasterService,
    private router: Router,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    public commonserviceService:CommonserviceService,
    private alertHelper: AlertHelper,
    private el:ElementRef,
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
    this.spinner.show();
    this.addeventType();
    this.initializeForm();
    this.el.nativeElement.querySelector("[formControlName=period]").focus();

  }
  initializeForm() {
    this.addEventMasterForm = this.fb.group({
      userId:[this.userId],
      profileId:[this.profileId],
      period: [
        this.period,
        [Validators.required],
      ],
      eventType: [
        this.eventType,
        [Validators.required],
      ],
      categoryName: [
        this.categoryName,
        [Validators.required],
      ],
      eventName: [
        this.eventName,
        [Validators.required,Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/),Validators.maxLength(30),Validators.minLength(3),this.customValidators.firstCharValidatorRF],
      ],

      description: [
        this.description,
        [Validators.maxLength(300)],

      ],
      encId: [this.encId],
    });
  }
  addeventType() {
    this.spinner.show();
    this.eventTypeLoading = true;
    this.manageeventmasterservice.getEventName().subscribe((res: any) => {
      this.EventTypeData = res;
      this.EventTypeData = this.EventTypeData.data;
      this.eventType = this.EventTypeData.eventId;
      this.encId = this.EventTypeData.encId;
     // this.initializeForm();
      this.spinner.hide();
      this.eventTypeLoading = false;
    });
  }
  geteventCategories(id:any) {
    this.eventCatLoading = true;
    this.manageeventmasterservice.getEventCategories(id).subscribe((res: any) => {
      this.EventCategoryData = res;
      this.EventCategoryData = this.EventCategoryData.data;
      this.eventCatLoading = false;

    });
  }
  get subjectFormControl() {
    return this.addEventMasterForm.controls;
  }
  onSubmit() {
    // if ("INVALID" === this.addEventMasterForm.status) {
    //   for (const key of Object.keys(this.addEventMasterForm.controls)) {
    //     if (this.addEventMasterForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.addEventMasterForm,this.allLabel);
    //       break;
    //     }
    //   }
    // }
    if (this.addEventMasterForm.invalid) {
      this.customValidators.formValidationHandler(this.addEventMasterForm, this.allLabel, this.el);
    }
    if (this.addEventMasterForm.invalid) {
      return;
    }

    if (this.addEventMasterForm.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          this.manageeventmasterservice
            .addEventMaster(this.addEventMasterForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Eventmaster created successfully.",
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