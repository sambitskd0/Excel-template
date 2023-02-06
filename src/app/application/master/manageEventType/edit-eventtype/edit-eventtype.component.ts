import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageEventTypeService } from '../../services/manage-event-type.service';

@Component({
  selector: 'app-edit-eventtype',
  templateUrl: './edit-eventtype.component.html',
  styleUrls: ['./edit-eventtype.component.css']
})
export class EditEventtypeComponent implements OnInit {

  editEventTypeForm!:FormGroup;
  submitted = false;
  id: number = 0;
  EventTypeData: any;
  eventType: any = "";
  description:any;
  encId: any = "";
  userId:any="";
  profileId:any="";
  allErrorMessages: string[] = [];
  allLabel: any = ["","","Event type",
  ];
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  tabs: any = [];  //For shwoing tabs
  constructor(public customValidator:CustomValidators,
    private fb:FormBuilder,
    public manageeventtypeservice:ManageEventTypeService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private route: Router,
    private router: ActivatedRoute,
    private el:ElementRef,
    public commonserviceService:CommonserviceService,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService) { 
      const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization 
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
      this.id = this.router.snapshot.params["encId"];
      this.initializeForm();
      this.el.nativeElement.querySelector("[formControlName=eventType]").focus();
      this.editeventType(this.id);
    
    }
    initializeForm() {
      this.editEventTypeForm = this.fb.group({
        userId:[this.userId],
        profileId:[this.profileId],
        eventType: [
          this.eventType,
          [Validators.required,Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/),Validators.maxLength(30),Validators.minLength(3),this.customValidator.firstCharValidatorRF],
        ],
        description: [
          this.description,
          [Validators.maxLength(300)],
          ],
         encId: [this.encId],
      });
    }
    editeventType(id: any) {
      this.spinner.show();
      this.manageeventtypeservice.getEventType(this.id).subscribe((res: any) => {
      this.EventTypeData = res;
      this.EventTypeData = this.EventTypeData.data;
      this.eventType = this.EventTypeData.eventType;
      this.description = this.EventTypeData.description;
     this.encId = this.EventTypeData.encId;
      this.initializeForm();
      this.spinner.hide();
      });
    }
    onSubmit()
    {
      // if ("INVALID" === this.editEventTypeForm.status) {
      //   for (const key of Object.keys(this.editEventTypeForm.controls)) {
      //     if (this.editEventTypeForm.controls[key].status === "INVALID") {
      //       const invalidControl = this.el.nativeElement.querySelector(
      //         '[formControlName="' + key + '"]'
      //       );
      //       invalidControl.focus();
      //       this.customValidator.formValidationHandler(this.editEventTypeForm,this.allLabel);
      //       break;
      //     }
      //   }
      // }

      if (this.editEventTypeForm.invalid) {
        this.customValidator.formValidationHandler(this.editEventTypeForm, this.allLabel, this.el);
      }

      if (this.editEventTypeForm.invalid) {
        return;
      }

      if (this.editEventTypeForm.valid === true) {
        this.alertHelper.updateAlert().then((result) => {
          if (result.value) {
            this.spinner.show();
            this.manageeventtypeservice
              .updateEventType(this.editEventTypeForm.value)
              .subscribe({
                next: (res: any) => {
                  this.spinner.hide();
                  this.alertHelper
                    .successAlert(
                      "Saved!",
                      "Event type updated successfully",
                      "success"
                    )
                    .then(() => {
                      this.route.navigate(["../../viewEventType"], {
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
      this.route.navigate(["../../viewEventType"], {
        relativeTo: this.router,
      }); 
    }
    }


