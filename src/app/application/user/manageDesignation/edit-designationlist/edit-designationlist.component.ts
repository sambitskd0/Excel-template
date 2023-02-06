import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageDesignationService } from '../../services/manage-designation.service';

@Component({
  selector: 'app-edit-designationlist',
  templateUrl: './edit-designationlist.component.html',
  styleUrls: ['./edit-designationlist.component.css']
})
export class EditDesignationlistComponent implements OnInit {
  editDesignationForm!: FormGroup;
  allErrorMessages: string[] = [];
  allLabel: string[] = ["","Level of Users","Designation Name"];
  userId:any="";
  levelId:any="";
  DesignationData:any='';
  id: number = 0;
  encId: any = "";
  designationName:any="";
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  constructor( private Managedesignationservice:ManageDesignationService, 
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private formBuilder:FormBuilder, 
    private alertHelper:AlertHelper, 
    private route: Router,
    public customValidator:CustomValidators,
    private router: ActivatedRoute,
    public customValidators:CustomValidators,
    private el: ElementRef ,
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
    this.initializeForm();
    this.getDesignation(this.id);
 
  }
  initializeForm(){

    this.editDesignationForm = this.formBuilder.group({
      userId:[this.userId],
      levelId: [
        this.levelId,
        [Validators.required],
      ],
      designationName: [
        this.designationName,
        [Validators.required],
      ],
      encId: [this.encId],
    
    })
  }
  getDesignation(id: any) {
    this.spinner.show();
    this.Managedesignationservice.getDesignation(this.id).subscribe((res: any) => {
    this.DesignationData = res;
    this.DesignationData = this.DesignationData.data;
    this.levelId = this.DesignationData.intLevelId;
    this.designationName = this.DesignationData.designationGroupName;
   this.encId = this.DesignationData.encId;
    this.initializeForm();
    this.spinner.hide();
    });
  }
  onSubmit()
  {
    this.customValidators.formValidationHandler(
      this.editDesignationForm,
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

    if (this.editDesignationForm.valid === true) {
      this.alertHelper.submitAlert().then((result) => {
        if (result.value) {
          this.spinner.show();
          this.Managedesignationservice
            .updateDesignation(this.editDesignationForm.value)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide();
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    " Designation updated successfully",
                    "success"
                  )
                  .then(() => {
                    this.route.navigate(["../../viewDesignationList"], {
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


