import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SchoolService } from 'src/app/application/school/services/school.service';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { SubjectTaggingService } from '../../../services/subject-tagging.service';

@Component({
  selector: 'app-edit-subject-tagging',
  templateUrl: './edit-subject-tagging.component.html',
  styleUrls: ['./edit-subject-tagging.component.css']
})
export class EditSubjectTaggingComponent implements OnInit {

  @ViewChildren("checkboxes") checkboxes!: QueryList<ElementRef>
  editSubjectTaggingForm!: FormGroup;
  isSelected: boolean = true;

  allErrorMessages: string[] = [];
  subjectNameDatas: any = [];
  classArr: any = [];

  allLabel: string[] = ["","","Subject name", "Class"];

  submitted: boolean = false;
  adminPrivilege: boolean = false;
  classChanged: boolean = false;
  subjectChanged: boolean = false;

  userId: any = "";
  profileId: any = "";
  plPrivilege: string = "";
  subjectId: any = "";
  schoolId: any = "";
  classData: any = "";
  id: any = "";
  subjectName: any = "";
  encId: any = "";
  classList: any = [];

  constructor(
    private el: ElementRef,
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private route: Router,
    private router: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public commonService: CommonserviceService,
    public subjectTaggingService: SubjectTaggingService,
    public schoolService: SchoolService,
    public activateRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    if (this.plPrivilege == 'admin') {
      this.adminPrivilege = true;
    }
    this.id = this.activateRoute.snapshot.params["encId"];
    const users = this.commonService.getUserProfile();
    this.el.nativeElement.querySelector("[formControlName=subjectId]").focus();
    this.userId = users?.userId;
    this.schoolId = users?.school;
    this.profileId = users?.profileId;
    this.getEditData(this.id);
    this.initializeForm();
    this.spinner.hide();
  }
  initializeForm() {
    this.editSubjectTaggingForm = this.formBuilder.group({
      userId: [this.userId],
      profileId: [this.profileId],
      subjectId: [
        this.subjectId,
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      classArr: this.formBuilder.array(this.classArr),
      encId: [this.encId],
    });
  }
  getSchoolClasses()
  {
   this.classChanged = true;
   this.commonService.getCommonAnnexture(['CLASS_TYPE'],true).subscribe((res: any) => {
     this.classList = res.data;
     this.classList = this.classList.CLASS_TYPE;
   this.classChanged = false;
  });
  }

  getSubject() {
    this.subjectChanged = true;
    this.subjectTaggingService
      .getSubjectList()
      .subscribe((res: any = []) => {
        this.subjectNameDatas = res.data;
        this.subjectChanged = false;
      });
  }

  onSubmit() {
      if (this.editSubjectTaggingForm.invalid) {
        this.customValidators.formValidationHandler(this.editSubjectTaggingForm,this.allLabel, this.el);
      }
      if (this.editSubjectTaggingForm.invalid) {
        return;
      }
      if(this.editSubjectTaggingForm.value.classArr.length==0){
        this.alertHelper.viewAlert("error","Invalid","Class is required");
        return;
      }
      if (this.editSubjectTaggingForm.valid === true) {
        this.alertHelper
          .updateAlert(
            "Do you want to update?",
            "question",
            "Yes, update it!",
            "No, keep it"
          ).then((result) => {
          if (result.value) {
            this.spinner.show(); // ==== show spinner
            this.subjectTaggingService
              .updateSubjectTaggingDetails(this.editSubjectTaggingForm.value)
              .subscribe({
                next: (res: any) => {
                  this.spinner.hide(); //==== hide spinner
                  this.alertHelper
                    .successAlert(
                      "Saved!",
                      "Subject tagging updated successfully.",
                      "success"
                    )
                    .then(() => {
                      this.initializeForm();
                      this.route.navigate(['../../view'], {
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

  getEditData(id: any) {
    this.subjectTaggingService.editSubjectTaggingDetails(id).subscribe((res: any) => {
      this.getSubject();
      this.getSchoolClasses();
      this.subjectId = res?.data[0].subjectId;
      res?.data.forEach((element: any) => {
        this.encId = element?.encId;
        this.classArr = element?.classId
      });
      this.initializeForm();
    });
  }

  resetFormArray() {
    let frmArray = this.editSubjectTaggingForm.get('classArr') as FormArray;
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
      // frmArray.removeAt(i)   
    });
  }

  changeClass(event: any) {
    const classArr: FormArray = this.editSubjectTaggingForm.get('classArr') as FormArray;
    let index = this.classArr.indexOf(event.target.value);
    if (event.target.checked) {
      classArr.push(new FormControl(event.target.value));
    } else {
      const index = classArr.controls.findIndex(x => x.value === event.target.value);
      classArr.removeAt(index);
    }
  }
  onCancel()
{
  this.route.navigate(["../../view"], {
    relativeTo: this.router,
  }); 
}

}
