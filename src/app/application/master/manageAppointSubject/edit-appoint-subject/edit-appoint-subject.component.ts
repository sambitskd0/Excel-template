import { Component, ElementRef, OnInit } from '@angular/core';
import { ManageAppointSubjectService } from '../../services/manage-appoint-subject.service';
import { FormBuilder,FormControl,FormGroup,Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { Constant } from 'src/app/shared/constants/constant';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-edit-appoint-subject',
  templateUrl: './edit-appoint-subject.component.html',
  styleUrls: ['./edit-appoint-subject.component.css']
})
export class EditAppointSubjectComponent implements OnInit {

  appointSubjectForm!: FormGroup;
  submitted = false;
  id: number = 0;
  appointSubjectData: any;
  subjectName: any;
  description: any;
  userId: any;
  profileId: any;
  encId: any;
  allLabel: any = ["","","Subject","Description"];
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  allErrorMessages: string[] = [];
  adminPrivilege: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    public manageAppointSubjectService: ManageAppointSubjectService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private route: Router,
    public customValidators:CustomValidators,
    private el:ElementRef,
    private router: ActivatedRoute,
    private alertHelper: AlertHelper,
    private spinner: NgxSpinnerService,
    public commonserviceService: CommonserviceService,
    
  ) {
    const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization  

  }


  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.id = this.router.snapshot.params['encId'];
    this.editAppointSubject(this.id); 
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
       encId: [this.encId],
    });
  }


  editAppointSubject(id : any){
    this.manageAppointSubjectService.getAppointSubject(this.id).subscribe((data: any) => {
      this.appointSubjectData = data;
      // console.log(this.appointSubjectData);
      
      this.appointSubjectData = this.appointSubjectData.data;
      this.subjectName = this.appointSubjectData.subjectName;
      this.description = this.appointSubjectData.description;
      this.encId = this.appointSubjectData.encId;
      this.appointSubjectForm = new FormGroup({
        subjectName: new FormControl(this.subjectName),
        description: new FormControl(this.description),
        encId: new FormControl(this.encId),
      });
    }); 
  }


  formValidationHandler() {
    this.allErrorMessages = [];
    if (this.appointSubjectForm.invalid === true) {
      const allLabel: any = ['Subject', 'Description'];
      let i = 0;

      for (const iterator in this.appointSubjectForm.controls) {
        // ===== required validation

        if (
          this.appointSubjectForm.controls[iterator].errors?.['required'] === true
        ) {
          // this.allErrorMessages.push(`${allLabel[i]} required`);
          this.alertHelper.viewAlert(
            'error',
            'Invalid',
            `${allLabel[i]} required`
          );
          // this.openModal();
          return;
        }
      }
    }
  }
  onSubmit() {
    if ("INVALID" === this.appointSubjectForm.status) {
      for (const key of Object.keys(this.appointSubjectForm.controls)) {
        if (this.appointSubjectForm.controls[key].status === "INVALID") {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + key + '"]'
          );
          invalidControl.focus();
          this.customValidators.formValidationHandler(this.appointSubjectForm,this.allLabel);
          break;
        }
      }
    }
    if (this.appointSubjectForm.invalid) {
      return;
    }
  
    if (this.appointSubjectForm.valid === true) {
      this.alertHelper.updateAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          this.manageAppointSubjectService
            .updateAppointSubject(this.appointSubjectForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Appointsubject updated successfully",
                    "success"
                  )
                  .then(() => {
                    this.route.navigate(["../../viewAppointSubject"], {
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
    this.route.navigate(["../../viewAppointSubject"], {
      relativeTo: this.router,
    }); 
  }
 
}