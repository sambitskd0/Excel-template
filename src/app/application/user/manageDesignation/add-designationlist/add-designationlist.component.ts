import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import {CustomValidators} from 'src/app/shared/validations/custom-validators';
import { ManageDesignationService } from '../../services/manage-designation.service';
import { NgxSpinnerService } from "ngx-spinner";
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-designationlist',
  templateUrl: './add-designationlist.component.html',
  styleUrls: ['./add-designationlist.component.css']
})
export class AddDesignationlistComponent implements OnInit {
  addDesignationForm!: FormGroup;
  allErrorMessages: string[] = [];
  allLabel: string[] = ["","Level of Users","Designation Name"];
  userId:any="";
  levelId:any="";
  designationName:any="";
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  constructor(
    private Managedesignationservice:ManageDesignationService, 
    private formBuilder:FormBuilder, 
    private alertHelper:AlertHelper,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router, 
    public customValidators:CustomValidators,
    public commonserviceService:CommonserviceService,
    private el: ElementRef,
    private spinner: NgxSpinnerService
  ) {
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

    this.addDesignationForm = this.formBuilder.group({
      userId:[this.userId],
      levelId: [
        this.levelId,
        [Validators.required],
      ],
      designationName: [
        this.designationName,
        [Validators.required],
      ],
     
    
    })
  }
  onSubmit() {
    
    this.customValidators.formValidationHandler(
      this.addDesignationForm,
      this.allLabel,
      this.el,
      {
        required: {
          levelId:
            "Please select level of user.",
            designationName:
            "Please enter designation name.",  
          },
      }
    );

    if (this.addDesignationForm.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show(); 
          this.Managedesignationservice
            .addDesignation(this.addDesignationForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
              this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Designation created successfully.",
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
