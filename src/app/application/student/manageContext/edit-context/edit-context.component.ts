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
  selector: 'app-edit-context',
  templateUrl: './edit-context.component.html',
  styleUrls: ['./edit-context.component.css']
})
export class EditContextComponent implements OnInit {

  contextForm!: FormGroup;
  allErrorMessages: string[] = [];
  allLabel: string[] = ["Context name"];
  contextName: any = '';
  id: any = '';
  encId: any = '';
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
    this.id = this.router.snapshot.params["encId"];
    this.initializeForm();
    this.getContext(this.id);
  }

  ngAfterViewInit() {
    this.el.nativeElement
      .querySelector("[formControlName=contextName]")
      .focus();
  }

  getContext(id: any) {
    this.contextMasterService.editContext(id).subscribe((res: any) => {
      res?.data.forEach((element: any) => {
        this.contextName = element?.contextName;
        this.encId = element?.encId;
        this.initializeForm();
      });
    });
  }

  initializeForm() {
    this.contextForm = this.formBuilder.group({
      contextName: [
        this.contextName,
        [Validators.required, Validators.maxLength(30), Validators.minLength(2), this.customValidators.firstCharValidatorRF],
      ],
      encId: [this.encId],
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
      this.alertHelper
        .updateAlert(
          "Do you want to update?",
          "question",
          "Yes, update it!",
          "No, keep it"
        ).then((result) => {
          if (result.value) {
            this.spinner.show(); // ==== show spinner
            this.contextMasterService
              .updateContext(this.contextForm.value)
              .subscribe({
                next: (res: any) => {
                  this.spinner.hide(); //==== hide spinner
                  this.alertHelper
                    .successAlert(
                      "Saved!",
                      "Context updated successfully.",
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
