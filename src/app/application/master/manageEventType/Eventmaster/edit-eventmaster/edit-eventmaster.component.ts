import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageEventMasterService } from '../../../services/manage-event-master.service';

@Component({
  selector: 'app-edit-eventmaster',
  templateUrl: './edit-eventmaster.component.html',
  styleUrls: ['./edit-eventmaster.component.css']
})
export class EditEventmasterComponent implements OnInit {

  editEventMasterForm!:FormGroup;
  submitted = false;
  id: number = 0;
  eventId: any='';
  EventDataById: any='';
  EventCategoryData: any = "";
  EventMasterData:any= "";
  description:any;
  categoryName:any;
  encId: any = "";
  period:any;
  eventType:any;
  eventName:any;
  userId:any="";
  profileId:any="";
  allErrorMessages: string[] = [];
  allLabel: any = ["","","Period","Event type","Category name",
  "Event name"];
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;

  EventTypeName:any="";
  EventCategoryName:any="";
  eventTypeLoading:boolean=false;
  eventCatLoading:boolean=false;
  tabs: any = [];  //For shwoing tabs
  constructor(public customValidator:CustomValidators,
    private fb:FormBuilder,
    public manageeventmasterservice:ManageEventMasterService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private route: Router,
    private el:ElementRef,
    private router: ActivatedRoute,
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
      this.el.nativeElement.querySelector("[formControlName=period]").focus();
      this.editeventMaster(this.id);
      this.getEventType();
      // this.getEventCategory();
     
     }
     
     getEventType(){
      this.eventTypeLoading = true;
      this.manageeventmasterservice.getEventName().subscribe((res: any) => {
        this.EventTypeName = res.data;
        this.eventTypeLoading = false;
      });
     }
    
     initializeForm() {
      this.editEventMasterForm = this.fb.group({
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
          [Validators.required,Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/),,Validators.maxLength(30),Validators.minLength(3),this.customValidator.firstCharValidatorRF],
        ],
        
        description: [
          this.description,
          [Validators.maxLength(300)],
          
        ],
         encId: [this.encId],
      });
    }
      editeventMaster(id: any) {
         this.spinner.show();
         this.manageeventmasterservice.getEventMaster(this.id).subscribe((res: any) => {
         this.EventMasterData = res;
          this.EventMasterData = this.EventMasterData.data;
          this.period = this.EventMasterData.period;
           this.eventType = this.EventMasterData.eventId;
         this.categoryName = this.EventMasterData.categoryId;
         this.eventName = this.EventMasterData.eventName;
          this.description = this.EventMasterData.description;
         this.encId = this.EventMasterData.encId;
        //  this.geteventCategories(this.eventType);
          this.initializeForm();
          this.geteventCategories(this.eventType);
          this.spinner.hide();
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
      onSubmit()
      {
        // if ("INVALID" === this.editEventMasterForm.status) {
        //   for (const key of Object.keys(this.editEventMasterForm.controls)) {
        //     if (this.editEventMasterForm.controls[key].status === "INVALID") {
        //       const invalidControl = this.el.nativeElement.querySelector(
        //         '[formControlName="' + key + '"]'
        //       );
        //       invalidControl.focus();
        //       this.customValidator.formValidationHandler(this.editEventMasterForm,this.allLabel);
        //       break;
        //     }
        //   }
        // }
        if (this.editEventMasterForm.invalid) {
          this.customValidator.formValidationHandler(this.editEventMasterForm, this.allLabel, this.el);
        }
        if (this.editEventMasterForm.invalid) {
          return;
        }
    if (this.editEventMasterForm.valid === true) {
          this.alertHelper.updateAlert().then((result) => {
            if (result.value) {
              this.spinner.show();
              this.manageeventmasterservice
                .updateEventMaster(this.editEventMasterForm.value)
                .subscribe({
                  next: (res: any) => {
                    this.spinner.hide();
                    this.alertHelper
                      .successAlert(
                        "Saved!",
                        "Event master updated successfully",
                        "success"
                      )
                      .then(() => {
                        this.route.navigate(["../../viewEventMaster"], {
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
        this.route.navigate(["../../viewEventMaster"], {
          relativeTo: this.router,
        }); 
      }
}
