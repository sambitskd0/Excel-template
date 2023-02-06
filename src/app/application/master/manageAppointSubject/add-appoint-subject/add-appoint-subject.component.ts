import { Component, ElementRef, OnInit } from '@angular/core';
import { ManageAppointSubjectService } from '../../services/manage-appoint-subject.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { Constant } from 'src/app/shared/constants/constant';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { Router } from '@angular/router';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';

@Component({
  selector: 'app-add-appoint-subject',
  templateUrl: './add-appoint-subject.component.html',
  styleUrls: ['./add-appoint-subject.component.css']
})
export class AddAppointSubjectComponent implements OnInit {

  appointSubjectForm!: FormGroup;
  allErrorMessages: string[] = [];
  allLabel: string[] = ["","","Subject","Description"];
  subjectName: any = "";
  description: any = "";
  userId: any = "";
  profileId: any = "";
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    public manageAppointSubjectService: ManageAppointSubjectService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private el:ElementRef,
    private alertHelper: AlertHelper,    
    public customValidators: CustomValidators,
    public commonserviceService: CommonserviceService, 

  ) { const pageUrl:any = this.router.url;  
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
    this.el.nativeElement.querySelector("[formControlName=subjectName]").focus();
  }

  initializeForm(){
    this.appointSubjectForm = this.formBuilder.group({
      userId:[this.userId],
      profileId:[this.profileId],
      subjectName: [
        this.subjectName,
        [Validators.required,Validators.pattern('^[a-zA-Z \-\']+'), Validators.maxLength(30),Validators.minLength(3)],
      ],
      description: [
        this.description,
        [Validators.required, Validators.maxLength(300)],
      ],
    });
  }

  get appointSubjectFormControl() {
    return this.appointSubjectForm.controls;
  }

  onSubmit() {
    // if ("INVALID" === this.appointSubjectForm.status) {
    //   for (const key of Object.keys(this.appointSubjectForm.controls)) {
    //     if (this.appointSubjectForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.appointSubjectForm,this.allLabel);
    //       break;
    //     }
    //   }
    // }
    
    if (this.appointSubjectForm.invalid) {
      this.customValidators.formValidationHandler(this.appointSubjectForm, this.allLabel, this.el);
    }

    if (this.appointSubjectForm.invalid) {
      return;
    }
    if(this.appointSubjectForm.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.manageAppointSubjectService
          .createAppointSubject(this.appointSubjectForm.value)
          .subscribe({
            next: (res: any) => {
              this.alertHelper
                .successAlert(
                  "Saved!",
                  "Appointsubject created successfully",
                  "success"
                )
                .then(() => {
                  this.initializeForm();
                });
            },
            error: (error: any) => {

            },
          });
        } 
      });
    }
  }

}
