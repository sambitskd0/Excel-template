import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { NgxSpinnerService } from "ngx-spinner";
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { ManageexaminationmasterService } from '../../services/manageexaminationmaster.service';
import { Constant } from 'src/app/shared/constants/constant';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';

@Component({
  selector: 'app-add-examinationmaster',
  templateUrl: './add-examinationmaster.component.html',
  styleUrls: ['./add-examinationmaster.component.css']
})
export class AddExaminationmasterComponent implements OnInit {

  addExaminationMasterForm!:FormGroup;
  submitted = false;
  id: number = 0;
  encId: any = "";
  class:any="";
  anexType: any;
  anextureType: any;
  annexData: any;
  description:any="";
  examinationType:any="";
  examTaggingData:any="";
  examTaggingArray:any=[];
 allErrorMessages: string[] = [];
 userId:any="";
 profileId:any="";
  allLabel: any = ["","","Type of examination","","Class"];
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  tabs: any = [];  //For shwoing tabs
  constructor(public customValidators:CustomValidators,
    private fb:FormBuilder,
   private route: Router,
    private router: ActivatedRoute,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private alertHelper: AlertHelper,private spinner: NgxSpinnerService,
    private commonserviceService: CommonserviceService,
    private el:ElementRef,
    private manageexaminationmasterservice: ManageexaminationmasterService) { 
      const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For authorization
    this.tabs = this.privilegeHelper.PrimaryLinkTabNames(pageUrl);  //For shwoing tabs 
    }

 ngOnInit(): void {
  if(this.plPrivilege=='admin'){
    this.adminPrivilege = true;
  }
  const users = this.commonserviceService.getUserProfile();
  this.userId = users?.userId;
  this.profileId = users?.profileId;
  this.id = this.router.snapshot.params["encId"];
   this.initializeForm();
   this.el.nativeElement.querySelector("[formControlName=examinationType]").focus();
   this.getClassName();
   this.getExamTermType();
    }
  initializeForm() {
   this.addExaminationMasterForm = this.fb.group({
    userId:[this.userId],
    profileId:[this.profileId],
       examinationType: [
         this.examinationType,
      [Validators.required],
       ],
       description: [
        this.description,
        [Validators.maxLength(300)]
    
      ],
    examTaggingArray: this.fb.array(this.examTaggingArray, Validators.required),
     });
   }
   getClassName()
   {
    this.commonserviceService.getCommonAnnexture(['CLASS_TYPE'],true).subscribe((res: any) => {
     this.examTaggingData = res;
    this.examTaggingData = this.examTaggingData.data.CLASS_TYPE;
   
   });

   }
   // =============For ExamTermType
  getExamTermType() {
    this.anexType = "EXAM_TERM_TYPE";
    this.commonserviceService
      .getAnextureType(this.anexType)
      .subscribe((data: any = []) => {
        this.annexData = data;
      this.anextureType = this.annexData.data;
      });
  }
   onCheckboxChange(event: any) {
    const examTaggingArray: FormArray = this.addExaminationMasterForm.get(
      'examTaggingArray'
    ) as FormArray;
     const index = this.examTaggingArray.indexOf(parseInt(event.target.value),0)
 if(event.target.checked){
   examTaggingArray.push(new FormControl(event.target.value));
  }else{
const index = examTaggingArray.controls.findIndex(x => x.value === event.target.value);
    examTaggingArray.removeAt(index);
  }

  }
 onSubmit()
  {
    if (this.addExaminationMasterForm.invalid) {
      this.customValidators.formValidationHandler(
        this.addExaminationMasterForm,
        this.allLabel,
        this.el
      );
    }

    if (this.addExaminationMasterForm.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show(); 
          this.manageexaminationmasterservice
            .addExaminationMaster(this.addExaminationMasterForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
              this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Examination created successfully",
                    "success"
                  )
                  .then(() => {
                    this.route.navigate(["../../manageExaminationMaster/viewExaminationMaster"], {
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

  }


