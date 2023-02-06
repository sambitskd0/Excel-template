import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import {CustomValidators} from 'src/app/shared/validations/custom-validators';
import { ManageSubdesignationService } from '../../services/manage-subdesignation.service';
import { NgxSpinnerService } from "ngx-spinner";
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-subdesignation',
  templateUrl: './add-subdesignation.component.html',
  styleUrls: ['./add-subdesignation.component.css']
})
export class AddSubdesignationComponent implements OnInit {
  addSubDesignationForm!: FormGroup;
  allErrorMessages: string[] = [];
  allLabel: string[] = ["","Level of Users","Designation Name","Sub Designation"];
  userId:any="";
  levelId:any="";
  designationName:any="";
  subDesignationName:any="";
  description:any="";
  DesignationNameData:any="";
  encId:any="";
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;

  constructor( private managesubdesignationservice:ManageSubdesignationService, 
    private formBuilder:FormBuilder, 
    private alertHelper:AlertHelper,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router, 
    private el: ElementRef ,
    public customValidators:CustomValidators,
    public commonserviceService:CommonserviceService,
    private spinner: NgxSpinnerService) { 
      const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For authorization

    }

  ngOnInit(): void {
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;
     this.initializeForm();
  }
  initializeForm(){

    this.addSubDesignationForm = this.formBuilder.group({
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
     
    
    })
  }
  getDesignation(val:any) {
    this.addSubDesignationForm.patchValue({
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

  onSubmit()
  {
    this.customValidators.formValidationHandler(
      this.addSubDesignationForm,
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

    if (this.addSubDesignationForm.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show(); 
          this.managesubdesignationservice
            .addSubDesignation(this.addSubDesignationForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
              this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Sub-designation created successfully.",
                    "success"
                  )
                  .then(() => {
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


