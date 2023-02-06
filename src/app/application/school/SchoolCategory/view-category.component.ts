import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { SchoolCategoryService } from '../services/school-category.service';

@Component({
  selector: 'app-view-category',
  templateUrl: './view-category.component.html',
  styleUrls: ['./view-category.component.css']
})
export class ViewCategoryComponent implements OnInit {
  schoolCategorySearchform!:FormGroup
  public show:boolean = true; 
  anextureType:any; 
  schoolCategoryData:any; 
  anexType:any;
  userId:any=""; 
  profileId:any=""; 
  schlCatName:any=""; 
  posts:any;
  categoryNameData:any=[];
  isEmpty: boolean = false;
  public buttonName:any = 'Show';
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  allLabel: string[] = ["School category"];
  constructor(private spinner: NgxSpinnerService, 
    private schoolCategoryService:SchoolCategoryService, 
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private formBuilder: FormBuilder,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private el: ElementRef,
    public commonserviceService: CommonserviceService) { 
      const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
    }
  ngOnInit(): void {
    this.spinner.show(); // ==== show spinner 
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    this.initializeForm();
    this.loadSchoolCategory();
  } 
  initializeForm() {
    this.schoolCategorySearchform = this.formBuilder.group({
      schlCatName: [this.schlCatName,[Validators.maxLength(40),Validators.minLength(10),Validators.pattern(/^[a-zA-Z0-9 -./]*$/)]],
    });
  }
  loadSchoolCategory(){
    if ("INVALID" === this.schoolCategorySearchform.status) {
      for (const key of Object.keys(this.schoolCategorySearchform.controls)) {
        if (this.schoolCategorySearchform.controls[key].status === "INVALID") {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formControlName="' + key + '"]'
          );
          invalidControl.focus();
          this.customValidators.formValidationHandler(
            this.schoolCategorySearchform,
            this.allLabel
          );
          break;
        }
      }
    }
    if (this.schoolCategorySearchform.valid === true) {
      this.spinner.show(); // ==== show spinner
      this.schoolCategoryService
        .viewSchoolCategory(this.schoolCategorySearchform.value)
        .subscribe((data: []) => {
          this.schoolCategoryData = data;
          this.schoolCategoryData = this.schoolCategoryData.data;
          this.isEmpty = this.schoolCategoryData.length > 0 ? false : true;
          this.spinner.hide(); //==== hide spinner
        if ( this.schoolCategoryData.length > 0) {
         }
        });  
    }
  }
  onsearch() {
    this.loadSchoolCategory();
  }
   deleteSchoolCategory(id:any){
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;
    this.profileId = users?.profileId;
    this.alertHelper
    .deleteAlert(
      "Are you sure to Detele?",
      "",
      "question",
      "Yes, delete it!"
    )
    .then((result) => {
      if (result.value) {
        this.spinner.show(); // ==== show spinner
        this.schoolCategoryService.deleteSchoolCategory(id,this.userId,this.profileId).subscribe((res) => {
          this.spinner.hide(); //==== hide spinner
          this.alertHelper.successAlert( 
            "Deleted!",
            "School category deleted successfully",
            "success"
          );
          this.loadSchoolCategory();
        }); 
      }
    });
  }
  
  toggle() {
    this.show = !this.show;
    if(this.show)  
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }
}
 