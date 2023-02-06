import { Component, OnInit, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { NgxSpinnerService } from "ngx-spinner";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { SubjectMasterService } from "../../services/subject-master.service";

@Component({
  selector: 'app-edit-subject',
  templateUrl: './edit-subject.component.html',
  styleUrls: ['./edit-subject.component.css']
})
export class EditSubjectComponent implements OnInit {

  subjectForm!: FormGroup;
  allErrorMessages: string[] = [];
  allLabel: string[] = ["Subject name"];
  subjectName: any = '';
  id:any = '';
  encId:any = '';
  userId:any = '';
  profileId:any = '';


  constructor(
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private route: Router,
    private router: ActivatedRoute,
    private commonService: CommonserviceService,
    public customValidators: CustomValidators,
    private spinner: NgxSpinnerService,
    private subjectMaster: SubjectMasterService,
    private el: ElementRef
  ) {
    const pageUrl: any = this.router.url;
   }

  submitted = false;

  ngOnInit(): void {
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.id = this.router.snapshot.params["encId"];   
    this.initializeForm();
    this.getSubject(this.id);
  }

  ngAfterViewInit() {
    this.el.nativeElement
      .querySelector("[formControlName=subjectName]")
      .focus();
}

  getSubject(id:any){
    this.subjectMaster.editSubject(id).subscribe((res:any) => {
      console.log(res);
      res?.data.forEach((element:any) => {
        console.log(element);
        this.subjectName = element?.subject;
      this.encId = element?.encId;
      this.initializeForm();
      });
    });
  }

  initializeForm() {
    this.subjectForm = this.formBuilder.group({
      subjectName: [
        this.subjectName,
        [Validators.required, Validators.maxLength(30), Validators.minLength(2), this.customValidators.firstCharValidatorRF],
      ],
      encId: [this.encId],
      userId:[this.userId],
      profileId:[this.profileId],
    });
  }

  onSubmit() {
    if (this.subjectForm.invalid) {
      this.customValidators.formValidationHandler(this.subjectForm, this.allLabel, this.el);
    }
    if (this.subjectForm.invalid) {
      return;
    }

    if (this.subjectForm.valid === true) {
      this.alertHelper
        .updateAlert(
          "Do you want to update?",
          "question",
          "Yes, update it!",
          "No, keep it"
        ).then((result) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.subjectMaster
            .updateSubject(this.subjectForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Subject updated successfully.",
                    "success"
                  )
                  .then(() => {
                    this.initializeForm();
                    this.route.navigate(['../../view'], {
                      relativeTo: this.router,
                    });
                  });
              },
              error: (error: any) => {
                this.spinner.hide(); //==== hide spinner
              },
            });
        }
      });
    }
  }
  onCancel()
  {
    this.route.navigate(["../../view"], {
      relativeTo: this.router,
    });
  }

}
