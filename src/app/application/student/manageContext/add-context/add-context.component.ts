import { Component, OnInit, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertHelper } from "src/app/core/helpers/alert-helper";
import { CustomValidators } from "src/app/shared/validations/custom-validators";
import { NgxSpinnerService } from "ngx-spinner";
import { Constant } from "src/app/shared/constants/constant";
import { PrivilegeHelper } from "src/app/core/helpers/privilege-helper";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonserviceService } from "src/app/core/services/commonservice.service";
import { ContextMasterService } from "../../services/context-master.service";


@Component({
  selector: 'app-add-context',
  templateUrl: './add-context.component.html',
  styleUrls: ['./add-context.component.css']
})
export class AddContextComponent implements OnInit {

  contextForm!: FormGroup;
  allErrorMessages: string[] = [];
  allLabel: string[] = ["Context name"];
  contextName: any = '';
  userId: any = '';
  profileId: any = '';

  constructor(
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router: Router,
    private activateRoute: ActivatedRoute,
    private commonService: CommonserviceService,
    public customValidators: CustomValidators,
    private spinner: NgxSpinnerService,
    private contextMasterService: ContextMasterService,
    private el: ElementRef
  ) {
    const pageUrl: any = this.router.url;
  }
  submitted = false;

  ngOnInit(): void {
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    
    this.initializeForm();
  }
  ngAfterViewInit() {
    this.el.nativeElement
      .querySelector("[formControlName=contextName]")
      .focus();
  }

  initializeForm() {
    this.contextForm = this.formBuilder.group({
      contextName: [
        this.contextName,
        [Validators.required, Validators.maxLength(30), Validators.minLength(2), this.customValidators.firstCharValidatorRF],
      ],
      userId:[this.userId],
      profileId:[this.profileId],
    });
  }

  onSubmit() {
    if (this.contextForm.invalid) {
      this.customValidators.formValidationHandler(this.contextForm, this.allLabel, this.el);
    }
    if (this.contextForm.invalid) {
      return;
    }

    if (this.contextForm.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.contextMasterService
            .addContext(this.contextForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Context added successfully.",
                    "success"
                  )
                  .then(() => {
                    this.initializeForm();
                    this.router.navigate(['../view'], {
                      relativeTo: this.activateRoute,
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

}
