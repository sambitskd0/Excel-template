import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageMdmStudentExpensesService } from '../../services/manage-mdm-student-expenses.service';

@Component({
  selector: 'app-edit-student-expenses',
  templateUrl: './edit-student-expenses.component.html',
  styleUrls: ['./edit-student-expenses.component.css']
})
export class EditStudentExpensesComponent implements OnInit {
  MDMStudentExpencesEditForm!:FormGroup;
  id:any="";
  studentExpensesDatas: any;
  studentType:any="1";
  riceConsumption:any="";
  fundAllocated:any="";
  calories:any="";

  encId: any = "";
  allErrorMessages: string[] = [];
   allLabel: string[] = ["Student type","", "","Rice consumption (per unit)","Fund allocated (per unit)","Calorie (per unit)",""];
  submitted = false;
  userId: any="";
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  profileId: any = "";

  constructor(
    private el: ElementRef,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private spinner: NgxSpinnerService, private route: Router,
    private router: ActivatedRoute,
    public manageMdmStudentExpensesService: ManageMdmStudentExpensesService,
    public customValidator:CustomValidators,
    public formBuilder:FormBuilder,
    public commonService:CommonserviceService,
  ) { const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization  
  }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;    
    this.id = this.router.snapshot.params["encId"];
    this.el.nativeElement.querySelector("[formControlName=riceConsumption]").focus();
    this.initializeForm();
    this.editStudentExpenses(this.id);
  }
  ngAfterViewInit(){
    this.el.nativeElement.querySelector("[formControlName=riceConsumption]").focus();
  }
  initializeForm(){
    this.MDMStudentExpencesEditForm = this.formBuilder.group({
      studentType: [
        this.studentType,[Validators.required,Validators.pattern('^[0-9]*$')],
      ],
      userId:[this.userId],
      profileId:[this.profileId],
      riceConsumption: [
        this.riceConsumption,[Validators.required,Validators.pattern('^[0-9.]*$'),Validators.min(1),this.customValidators.firstCharValidatorRF],
      ],
      fundAllocated: [
        this.fundAllocated,[Validators.required,Validators.pattern('^[0-9.]*$'),Validators.min(1),this.customValidators.firstCharValidatorRF],
      ],
      calories: [
        this.calories,[Validators.required,Validators.pattern('^[0-9.]*$'),Validators.min(1),this.customValidators.firstCharValidatorRF],
      ],encId:[this.encId],
    });
  }
  editStudentExpenses(id: any){
    this.spinner.show();
    this.manageMdmStudentExpensesService.getStudentExpenses(this.id).subscribe((res: any) => {
    this.studentExpensesDatas = res;
    this.studentExpensesDatas     = this.studentExpensesDatas.data;
    this.studentType              = this.studentExpensesDatas.studentType;
    this.riceConsumption           = this.studentExpensesDatas.riceConsumption;
    this.fundAllocated            = this.studentExpensesDatas.fundAllocated;
    this.calories                 = this.studentExpensesDatas.calories;
    this.encId                    = this.studentExpensesDatas.encId;
    this.spinner.hide();
    this.initializeForm();
    });
  }
  onSubmit(){
    // if ("INVALID" === this.MDMStudentExpencesEditForm.status) {
    //   for (const key of Object.keys(this.MDMStudentExpencesEditForm.controls)) {
    //     if (this.MDMStudentExpencesEditForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.MDMStudentExpencesEditForm,this.allLabel);
    //       break;
    //     }
    //   }
    // }
    if (this.MDMStudentExpencesEditForm.invalid) {
      // this.customValidators.formValidationHandler(this.MDMStudentExpencesEditForm,this.allLabel, this.el);
      this.customValidators.formValidationHandler(
        this.MDMStudentExpencesEditForm,
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
    if (this.MDMStudentExpencesEditForm.invalid) {
      return;
    }
    if (this.MDMStudentExpencesEditForm.valid === true) {
      this.alertHelper.updateAlert(
        "Do you want to update the records ?",
        "question",
        "Yes, update it!",
        "No, keep it"
        ).then((result:any) => {
        if (result.value) {
          this.spinner.show();
          this.manageMdmStudentExpensesService
            .updateStudentExpenses(this.MDMStudentExpencesEditForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Student expense details updated successfully",
                    "success"
                  )
                  .then(() => {
                    this.route.navigate(["../../viewStudentExpenses"], {
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
  onCancel(){
    this.route.navigate(["../../viewStudentExpenses"], {
      relativeTo: this.router,
    });
  }
}
