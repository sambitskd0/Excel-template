import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageMdmStudentExpensesService } from '../../services/manage-mdm-student-expenses.service';

@Component({
  selector: 'app-add-student-expenses',
  templateUrl: './add-student-expenses.component.html',
  styleUrls: ['./add-student-expenses.component.css']
})
export class AddStudentExpensesComponent implements OnInit {
  MDMStudentExpencesAddForm !: FormGroup;
  studentType: any = "1";
  riceConsumption: any = "";
  fundAllocated: any = "";
  calories: any = "";
  users: any = "";
  userId: any = "";
  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;

  isSelected: boolean = true;
  stdentExpensesDatas: any;
  allErrorMessages: string[] = [];
  allLabel: string[] = ["", "", "Student type", "Rice consumption (per unit)", "Fund allocated (per unit)", "Calorie (per unit)"];

  submitted = false;
  profileId: any = "";
  constructor(private el: ElementRef,
    public customValidators: CustomValidators,
    private formBuilder: FormBuilder,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router: Router,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    public commonService: CommonserviceService,
    public manageMdmStudentExpensesService: ManageMdmStudentExpensesService,) {
    const pageUrl: any = this.router.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For authorization
  }

  ngOnInit(): void {
    if (this.plPrivilege == 'admin') {
      this.adminPrivilege = true;
    }
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;    
    this.el.nativeElement.querySelector("[formControlName=riceConsumption]").focus();
    this.initializeForm();
  }
  ngAfterViewInit(){
    this.el.nativeElement.querySelector("[formControlName=riceConsumption]").focus();
  }
  initializeForm() {
    this.MDMStudentExpencesAddForm = this.formBuilder.group({
      userId: [this.userId],
      profileId: [this.profileId],
      studentType: [
        this.studentType, [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      riceConsumption: [
        this.riceConsumption, [Validators.required, Validators.pattern('^[0-9.]*$'),Validators.maxLength(6),Validators.min(1), this.customValidators.firstCharValidatorRF],
      ],
      fundAllocated: [
        this.fundAllocated, [Validators.required, Validators.pattern('^[0-9.]*$'), Validators.maxLength(6),Validators.min(1), this.customValidators.firstCharValidatorRF],
      ],
      calories: [
        this.calories, [Validators.required, Validators.pattern('^[0-9.]*$'),Validators.maxLength(6),Validators.min(1), this.customValidators.firstCharValidatorRF],
      ],
    });
  }
  get mdmStudentExpensesFormControl() {
    return this.MDMStudentExpencesAddForm.controls;
  }

  onSubmit() {

    /* this.customValidators.formValidationHandler(
      this.MDMStudentExpencesAddForm,
      this.allLabel
    ); */
    // if ("INVALID" === this.MDMStudentExpencesAddForm.status) {
    //   for (const key of Object.keys(this.MDMStudentExpencesAddForm.controls)) {
    //     if (this.MDMStudentExpencesAddForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.MDMStudentExpencesAddForm, this.allLabel);
    //       break;
    //     }
    //   }
    // }
    if (this.MDMStudentExpencesAddForm.invalid) {
      // this.customValidators.formValidationHandler(this.MDMStudentExpencesAddForm,this.allLabel, this.el);
      this.customValidators.formValidationHandler(
        this.MDMStudentExpencesAddForm,
        this.allLabel,
        this.el,
        {
          required: {
            studentType: "Please select student type",
            riceConsumption: "Please enter the rice consumption per unit",
            fundAllocated: "Please enter fund allocated per unit",
            calories: "Please enter calorie per unit",
          },
        }
      );
    }
    if (this.MDMStudentExpencesAddForm.invalid) {
      return;
    }

    if (this.MDMStudentExpencesAddForm.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show(); // ==== show spinner
          this.manageMdmStudentExpensesService.createStudentExpenses(this.MDMStudentExpencesAddForm.value).subscribe({
            next: (res: any) => {
              this.spinner.hide(); //==== hide spinner
              this.alertHelper
                .successAlert(
                  "Saved!",
                  "Student expense details saved successfully",
                  "success"
                )
                .then(() => {
                  this.initializeForm();
                });
            },
            error: (error: any) => {
              this.spinner.hide(); //==== hide spinner
            },
          });
        }
        else {
          this.spinner.hide(); //==== hide spinner
        }
      });
    }
  }
}
