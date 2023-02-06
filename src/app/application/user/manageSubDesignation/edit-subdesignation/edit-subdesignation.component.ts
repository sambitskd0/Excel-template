import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageSubdesignationService } from '../../services/manage-subdesignation.service';

@Component({
  selector: 'app-edit-subdesignation',
  templateUrl: './edit-subdesignation.component.html',
  styleUrls: ['./edit-subdesignation.component.css']
})
export class EditSubdesignationComponent implements OnInit {
  editSubDesignationForm!: FormGroup;
  allErrorMessages: string[] = [];
  allLabel: string[] = ["","Level of Users","Designation Name","Sub Designation"];
  userId:any="";
  levelId:any="";
  DesignationData:any='';
  id: number = 0;
  encId: any = "";
  designationName:any="";
  DesignationNameData:any="";
  subDesignationName:any="";
  description:any="";
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;

  constructor(private managesubdesignationservice:ManageSubdesignationService, 
    private formBuilder:FormBuilder, 
    private alertHelper:AlertHelper, 
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private route: Router,
    public customValidator:CustomValidators,
    private router: ActivatedRoute,
    private el: ElementRef ,
    public customValidators:CustomValidators,
    public commonserviceService:CommonserviceService,
    private spinner: NgxSpinnerService) {
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
    this.spinner.show();
    this.id = this.router.snapshot.params["encId"];
    this.getSubDesignation(this.id);
    this.initializeForm();
    
  }
  initializeForm(){

    this.editSubDesignationForm = this.formBuilder.group({
      userId:[this.userId],
      levelId: [
        this.levelId,
        [Validators.required],
      ],
      designationName: [
        this.designationName,
        [Validators.required],
      ],
      subDesignationName: [
        this.subDesignationName,
        [Validators.required],
      ],
      description: [
        this.description,
      ],
      encId: [this.encId],
    
    })
  }
  getDesignation(val:any) {
    this.editSubDesignationForm.patchValue({
      designationName: "",
    });
    const levelId=val;
    this.spinner.show();
    this.managesubdesignationservice.getDesignationName(levelId).subscribe((res: any) => {
    this.DesignationNameData = res;
    this.DesignationNameData = this.DesignationNameData.data;
    this.spinner.hide();
    
    });
  }
  getSubDesignation(id: any) {
    this.spinner.show();
    this.managesubdesignationservice.getSubDesignation(this.id).subscribe((res: any) => {
    this.DesignationData = res;
    this.DesignationData = this.DesignationData.data;
    this.levelId = this.DesignationData.intLevelId;
    this.designationName = this.DesignationData.designationGroupId;
    this.subDesignationName = this.DesignationData.vchDesignationName;
    this.description = this.DesignationData.vchDescription;
    this.encId = this.DesignationData.encId;
    this.getDesignation(this.levelId);
    this.initializeForm();
    this.spinner.hide();
    });
  }
  onSubmit()
  {
    this.customValidators.formValidationHandler(
      this.editSubDesignationForm,
      this.allLabel,
      this.el,
      {
        required: {
          levelId:
            "Please select the level of user.",
            designationName:
            "Please select designation.",  
            subDesignationName:
            "Please enter sub designation.",  
          },
      }
    );

    if (this.editSubDesignationForm.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          this.managesubdesignationservice
            .updateSubDesignation(this.editSubDesignationForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    " Sub-designation updated successfully",
                    "success"
                  )
                  .then(() => {
                    this.route.navigate(["../../viewSubDesignation"], {
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


