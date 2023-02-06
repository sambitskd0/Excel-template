import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageEventCategoryService } from '../../../services/manage-event-category.service';


@Component({
  selector: 'app-edit-eventcategory',
  templateUrl: './edit-eventcategory.component.html',
  styleUrls: ['./edit-eventcategory.component.css']
})
export class EditEventcategoryComponent implements OnInit {

  editEventCategoryForm!:FormGroup;
  submitted = false;
  id: number = 0;
  eventId: any='';
  EventDataById: any='';
  EventCategoryData: any = "";
  description:any;
  categoryName:any;
  encId: any = "";
  userId:any="";
  profileId:any="";
  eventTypeLoading:boolean=false;
  allErrorMessages: string[] = [];
  allLabel: any = ["","","Event type","Category name",
  ];
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  getEventTypeName:any="";
  tabs: any = [];  //For shwoing tabs
  constructor(public customValidator:CustomValidators,
    private fb:FormBuilder,
    public manageeventcategoryservice:ManageEventCategoryService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private route: Router,
    private router: ActivatedRoute,
    public commonserviceService:CommonserviceService,
    private alertHelper: AlertHelper,
    private el:ElementRef,
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
    this.editeventCategory(this.id);
    this.getEventType();
   
   }
   
   getEventType(){
    this.eventTypeLoading = true;
    this.manageeventcategoryservice.getEventType().subscribe((res: any) => {
      this.getEventTypeName = res.data;
      this.eventTypeLoading = false;
    });
   }
    initializeForm() {
      this.editEventCategoryForm = this.fb.group({
        userId:[this.userId],
        profileId:[this.profileId],
        eventType: [
          this.eventId,
          [Validators.required],
        ],
        categoryName: [
          this.categoryName,
          [Validators.required,Validators.pattern(/^[a-zA-Z0-9 ,.\-\s]+$/),Validators.maxLength(30),Validators.minLength(3),this.customValidator.firstCharValidatorRF
          ],
        ],
        description: [
          this.description,
          [Validators.maxLength(300)],
          ],
         encId: [this.encId],
      });
    }
    editeventCategory(id: any) {
      this.spinner.show();
      this.manageeventcategoryservice.getEventCategory(this.id).subscribe((res: any) => {
        this.EventCategoryData = res;
        this.EventCategoryData = this.EventCategoryData.data;
        this.eventId = this.EventCategoryData.eventId;
        this.categoryName = this.EventCategoryData.categoryName;
        this.description = this.EventCategoryData.description;
       this.encId = this.EventCategoryData.encId;

       this.initializeForm();
        this.spinner.hide();
        });
    }
    onSubmit()
    {
      // if ("INVALID" === this.editEventCategoryForm.status) {
      //   for (const key of Object.keys(this.editEventCategoryForm.controls)) {
      //     if (this.editEventCategoryForm.controls[key].status === "INVALID") {
      //       const invalidControl = this.el.nativeElement.querySelector(
      //         '[formControlName="' + key + '"]'
      //       );
      //       invalidControl.focus();
      //       this.customValidator.formValidationHandler(this.editEventCategoryForm,this.allLabel);
      //       break;
      //     }
      //   }
      // }
      if (this.editEventCategoryForm.invalid) {
        this.customValidator.formValidationHandler(this.editEventCategoryForm, this.allLabel, this.el);
      }
      if (this.editEventCategoryForm.invalid) {
        return;
      }
  
  if (this.editEventCategoryForm.valid === true) {
        this.alertHelper.updateAlert().then((result) => {
          if (result.value) {
            this.spinner.show();
            this.manageeventcategoryservice
              .updateEventCategory(this.editEventCategoryForm.value)
              .subscribe({
                next: (res: any) => {
                  this.spinner.hide();
                  this.alertHelper
                    .successAlert(
                      "Saved!",
                      " Event category updated successfully",
                      "success"
                    )
                    .then(() => {
                      this.route.navigate(["../../viewEventCategory"], {
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
      this.route.navigate(["../../viewEventCategory"], {
        relativeTo: this.router,
      }); 
    }
    }



