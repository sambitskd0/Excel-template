import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { SubjectService } from './../../services/subject.service'
import { NgxSpinnerService } from "ngx-spinner";
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';

@Component({
  selector: 'app-edit-subject',
  templateUrl: './edit-subject.component.html',
  styleUrls: ['./edit-subject.component.css']
})
export class EditSubjectComponent implements OnInit {
  editSubjectForm!:FormGroup;
  submitted = false;
  id: number = 0;
  categoryData: any;
  subject: any = "";
  description: any = "";
  encId: any = "";
  allErrorMessages: string[] = [];
  allLabel: any = ["","","Subject name",];
  userId: any;
  profileId: any;
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  tabs: any = [];  //For shwoing tabs
  adminPrivilege: boolean = false;
  constructor(public customValidators:CustomValidators,
    private fb:FormBuilder,
    public subjectservice:SubjectService,
    public commonserviceService:CommonserviceService, 
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private route: Router,
    private router: ActivatedRoute,
    private el:ElementRef,
    private alertHelper: AlertHelper,private spinner: NgxSpinnerService
  ) {
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
    this.id = this.router.snapshot.params["encId"];
    this.initializeForm();
    this.el.nativeElement.querySelector("[formControlName=subject]").focus();
    this.editSubject(this.id);
  
  }
  initializeForm() {
    this.editSubjectForm = this.fb.group({
      userId:[this.userId],
      profileId:[this.profileId],
      subject: [
        this.subject,
        [Validators.required,Validators.pattern('^[a-zA-Z \-\']+'),Validators.maxLength(30),Validators.minLength(3),this.customValidators.firstCharValidatorRF],
      ],
      description: [
        this.description,
        [Validators.maxLength(300)],
     
      ],
      encId: [this.encId],
    });
  
  }
  editSubject(id: any) {
    this.subjectservice.getSubjectData(this.id).subscribe((res: any) => {
      this.categoryData = res;
      this.categoryData = this.categoryData.data;
      this.subject = this.categoryData.subject;
      this.description = this.categoryData.description;
      this.encId = this.categoryData.encId;
  this.initializeForm();
});

}
onSubmit() {
  // if ("INVALID" === this.editSubjectForm.status) {
  //   for (const key of Object.keys(this.editSubjectForm.controls)) {
  //     if (this.editSubjectForm.controls[key].status === "INVALID") {
  //       const invalidControl = this.el.nativeElement.querySelector(
  //         '[formControlName="' + key + '"]'
  //       );
  //       invalidControl.focus();
  //       this.customValidators.formValidationHandler(this.editSubjectForm,this.allLabel);
  //       break;
  //     }
  //   }
  // }
  if (this.editSubjectForm.invalid) {
    this.customValidators.formValidationHandler(this.editSubjectForm, this.allLabel, this.el);
  }
  if (this.editSubjectForm.invalid) {
    return;
  }

  if (this.editSubjectForm.valid === true) {
    this.alertHelper.updateAlert().then((result) => {
      if (result.value) {
        this.spinner.show();
        this.subjectservice
          .updateSubject(this.editSubjectForm.value)
          .subscribe({
            next: (res: any) => {
              this.spinner.hide();
              this.alertHelper
                .successAlert(
                  "Saved!",
                  "Subject updated successfully",
                  "success"
                )
                .then(() => {
                  this.route.navigate(["../../viewSubject"], {
                    relativeTo: this.router,
                  });
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
  this.route.navigate(["../../viewSubject"], {
    relativeTo: this.router,
  }); 
}
}

