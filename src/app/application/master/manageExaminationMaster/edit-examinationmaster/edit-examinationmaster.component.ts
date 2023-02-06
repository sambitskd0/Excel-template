import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormArray,FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import {ManageexaminationmasterService} from '../../services/manageexaminationmaster.service';
import { NgxSpinnerService } from "ngx-spinner";
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';

@Component({
  selector: 'app-edit-examinationmaster',
  templateUrl: './edit-examinationmaster.component.html',
  styleUrls: ['./edit-examinationmaster.component.css']
})
export class EditExaminationmasterComponent implements OnInit {

  editExaminationMasterForm!:FormGroup;
  submitted = false;
  id: number = 0;
  encId: any = "";
  class:any="";
  description:any="";
  selectType:any="";
  examTaggingData:any="";
  editTaggingData:any="";
  examTaggingArray:any=[];
  userId:any="";
  profileId:any="";
  selectTypeLabel:any="";
 allErrorMessages: string[] = [];
  allLabel: any = ["","Type of examination","","Class"];
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  tabs: any = [];  //For shwoing tabs
  constructor(public customValidators:CustomValidators,
    private fb:FormBuilder,
    public manageexaminationmasterservice:ManageexaminationmasterService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private route: Router,
    private router: ActivatedRoute,
    private alertHelper: AlertHelper,private spinner: NgxSpinnerService,
    private commonserviceService: CommonserviceService,
    private el:ElementRef
    ) { 
      const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization 
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
    this.getClassName()
    this.getExaminationMaster(this.id)

  }
  initializeForm()
  {
    this.editExaminationMasterForm = this.fb.group({
      userId:[this.userId],
      profileId:[this.profileId],
      selectType: [
        this.selectType,
     [Validators.required],
      ],
      description: [
       this.description,
       [Validators.maxLength(300)]
     ],
   examTaggingArray: this.fb.array(this.examTaggingArray, Validators.required),
   encId: [this.id],
    });

  }

getClassName()
{
  this.commonserviceService.getCommonAnnexture(['anxtType','CLASS_TYPE'],true).subscribe((res: any) => {
    this.examTaggingData = res;
   this.examTaggingData = this.examTaggingData.data.CLASS_TYPE;
  });

}
getExaminationMaster(id:any)
{
  this.manageexaminationmasterservice.getExaminationMaster(id).subscribe((res: any) => {
    this.editTaggingData = res;
    this.editTaggingData = this.editTaggingData.data;
    this.examTaggingArray=this.editTaggingData.allclassId;
    this.description = this.editTaggingData.description;
    this.selectType = this.editTaggingData.examinationTypeId;  
    this.selectTypeLabel = this.editTaggingData.selectTypeLabel;  
    this.encId = this.editTaggingData.encId;
    this.initializeForm();
    
});

    
}

onCheckboxChange(event: any) {
  const examTaggingArray: FormArray = this.editExaminationMasterForm.get(
    'examTaggingArray'
  ) as FormArray;
  if (this.examTaggingArray.includes(parseInt(event.target.value))) {
   const index = this.examTaggingArray.indexOf(parseInt(event.target.value),0);
   if (index > -1) {
    this.examTaggingArray.splice(index, 1);
  }
}else {
  this.examTaggingArray.push(parseInt(event.target.value));
}
 this.initializeForm();
}
  onSubmit()
  {
    if (this.editExaminationMasterForm.invalid) {
      this.customValidators.formValidationHandler(
        this.editExaminationMasterForm,
        this.allLabel,
        this.el
      );
    }
    if (this.editExaminationMasterForm.valid === true) {
      this.alertHelper.updateAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          this.manageexaminationmasterservice
            .updateExaminationMaster(this.editExaminationMasterForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Examination updated successfully",
                    "success"
                  )
                  .then(() => {
                    this.route.navigate(["../../viewExaminationMaster"], {
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
    this.route.navigate(["../../viewExaminationMaster"], {
      relativeTo: this.router,
    }); 
  }

  }


