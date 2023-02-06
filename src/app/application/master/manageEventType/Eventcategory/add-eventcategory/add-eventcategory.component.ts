import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageEventCategoryService } from '../../../services/manage-event-category.service';

@Component({
  selector: 'app-add-eventcategory',
  templateUrl: './add-eventcategory.component.html',
  styleUrls: ['./add-eventcategory.component.css']
})
export class AddEventcategoryComponent implements OnInit {

  addEventCategoryForm!:FormGroup;
  submitted = false;
  id: number = 0;
  EventTypeData: any;
  eventType:any = "";
  categoryName: any = "";
  description:any ="";
  encId: any = "";
  userId: any ="";
  profileId: any ="";
  eventTypeLoading:boolean=false;
  allErrorMessages: string[] = [];
  allLabel: any = ["","","Event Type",
  "Category name"];
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  tabs: any = [];  //For shwoing tabs
  constructor(public customValidators:CustomValidators,
    private fb:FormBuilder,
    public manageeventcategoryservice:ManageEventCategoryService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router: Router,
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
      this.el.nativeElement.querySelector("[formControlName=eventType]").focus();

    }
    initializeForm() {
      this.addEventCategoryForm = this.fb.group({
        userId:[this.userId],
        profileId:[this.profileId],
        eventType: [
          this.eventType,
          [Validators.required],
        ],
        categoryName: [
          this.categoryName,
          [Validators.required,Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/),Validators.maxLength(30),Validators.minLength(3),this.customValidators.firstCharValidatorRF
          ],
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
      this.manageeventcategoryservice.getEventType().subscribe((res: any) => {
      this.EventTypeData = res;
      this.EventTypeData = this.EventTypeData.data;
      this.eventType = this.EventTypeData.eventId;
     this.encId = this.EventTypeData.encId;
      // this.initializeForm();
      this.spinner.hide();
      this.eventTypeLoading = false;
      });
    }
    get subjectFormControl() {
      return this.addEventCategoryForm.controls;
    }
    onSubmit()
    {
      // if ("INVALID" === this.addEventCategoryForm.status) {
      //   for (const key of Object.keys(this.addEventCategoryForm.controls)) {
      //     if (this.addEventCategoryForm.controls[key].status === "INVALID") {
      //       const invalidControl = this.el.nativeElement.querySelector(
      //         '[formControlName="' + key + '"]'
      //       );
      //       invalidControl.focus();
      //       this.customValidators.formValidationHandler(this.addEventCategoryForm,this.allLabel);
      //       break;
      //     }
      //   }
      // }
      if (this.addEventCategoryForm.invalid) {
        this.customValidators.formValidationHandler(this.addEventCategoryForm, this.allLabel, this.el);
      }
      if (this.addEventCategoryForm.invalid) {
        return;
      }
  
      if (this.addEventCategoryForm.valid === true) {
        this.alertHelper.submitAlert().then((result) => {
          if (result.value) {
            this.spinner.show(); 
            this.manageeventcategoryservice
              .addEventCategory(this.addEventCategoryForm.value)
              .subscribe({
                next: (res: any) => {
                  this.spinner.hide();
                this.alertHelper
                    .successAlert(
                      "Saved!",
                      "Event Category Created Successfully.",
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




