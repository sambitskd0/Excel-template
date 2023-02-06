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
  selector: 'app-add-subject',
  templateUrl: './add-subject.component.html',
  styleUrls: ['./add-subject.component.css']
})
export class AddSubjectComponent implements OnInit {
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  subjectForm!: FormGroup;
  allErrorMessages: string[] = [];
  allLabel: string[] = ["Subject name"];
  subjectName: any = '';
  userId:any = '';
  profileId:any = '';

  constructor(
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router: Router,
   // private activateRoute: ActivatedRoute,
    private commonService: CommonserviceService,
    public customValidators: CustomValidators,
    private spinner: NgxSpinnerService,
    private subjectMaster: SubjectMasterService,
    private el: ElementRef
  ) {
   
  }
  submitted = false;

  ngOnInit(): void {
     if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.initializeForm();
  }
  ngAfterViewInit() {
      this.el.nativeElement
        .querySelector("[formControlName=subjectName]")
        .focus();
  }

  initializeForm() {
    this.subjectForm = this.formBuilder.group({
      subjectName: [
        this.subjectName,
        [Validators.required, Validators.maxLength(30), Validators.minLength(2), this.customValidators.firstCharValidatorRF],
      ],
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
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.subjectMaster
            .addSubject(this.subjectForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Subject added successfully.",
                    "success"
                  )
                  .then(() => {
                    this.initializeForm();
                    // this.router.navigate(['../view'], {
                    //   relativeTo: this.activateRoute,
                    // });
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

}
