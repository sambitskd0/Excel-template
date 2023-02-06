import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { DivyaService } from '../services/divya.service';

@Component({
  selector: 'app-any-other',
  templateUrl: './any-other.component.html',
  styleUrls: ['./any-other.component.css']
})
export class AnyOtherComponent implements OnInit {
  token!: any;
  anyOtherForm!:FormGroup
  nameOfWork:any="";
  allLabel:any=[
    "Name of work",
  ];
  constructor(private formBuilder: FormBuilder,
    public customValidators: CustomValidators,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    private divyaService: DivyaService,
    private route: ActivatedRoute,
    private router: Router,
    private el: ElementRef) { }

  ngOnInit(): void {
    this.getToken() ;
    this.initializeForm();
  }

  // get token from url query params
  getToken() {
    this.divyaService.getTokenDetails(this.route, this.router);
    // check if side nav status
    this.divyaService.tokenEmitter.subscribe((res: any) => {
      this.token = res;
    });
  }

  initializeForm() {
    this.anyOtherForm = this.formBuilder.group({
      nameOfWork: [this.nameOfWork,[Validators.required,Validators.maxLength(200),Validators.pattern(/^[a-zA-Z0-9 ,.'\-\s]+$/),this.customValidators.firstCharValidatorRF]],   
    });
  }

  onSubmit(){
    if ("INVALID" === this.anyOtherForm.status) {
      for (const key of Object.keys(this.anyOtherForm.controls)) {
        if (this.anyOtherForm.controls[key].status === "INVALID") {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + key + '"]'
          );
          invalidControl.focus();
          this.customValidators.formValidationHandler(this.anyOtherForm,this.allLabel);
          break;
        }
      }
    }
    if (this.anyOtherForm.invalid) {
      return;
    }

    if (this.anyOtherForm.valid === true) {
      this.alertHelper.submitAlert().then((result: any) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.divyaService
            .saveAnyOtherWork(this.anyOtherForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Other work visit data saved successfully.",
                    "success"
                  )
                  .then(() => {
                    this.router.navigate(["../success"], {
                      relativeTo: this.route,
                    });
                  });
              },
              error: (error: any) => {
                this.spinner.hide(); //==== hide spinner
                let errorMessage: string = "";
                if (typeof error.error.msg === "string") {
                  errorMessage +=
                    '<i class="bi bi-arrow-right text-danger"></i> ' +
                    error.error.msg +
                    `<br>`;
                } else {
                  error.error.msg.map(
                    (message: string) =>
                      (errorMessage +=
                        '<i class="bi bi-arrow-right text-danger"></i> ' +
                        message +
                        `<br>`)
                  );
                }
                this.alertHelper.viewAlertHtml(
                  "error",
                  "Invalid inputs",
                  errorMessage
                );
              },
              // complete: () => console.log('done'),
            });
        }
      });
    }
  }


  resetForm(){
    this.initializeForm();
  }

}
