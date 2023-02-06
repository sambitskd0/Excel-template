import { Component, Input, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { NgxSpinnerService } from 'ngx-spinner';
import {SubjecttaggingService} from './../../services/subjecttagging.service';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { Router } from '@angular/router';


@Component({
  selector: 'app-view-subject-tagging',
  templateUrl: './view-subject-tagging.component.html',
  styleUrls: ['./view-subject-tagging.component.css']
})
export class ViewSubjectTaggingComponent implements OnInit {
  SubjectTaggingForm!: FormGroup;
  anxtName: any ="";
  classId: any="";
  subject:any="";
  subjectTaggingData: any;
  post: any;
  userId: any;
  userProfile: any = [];
  adminPrivilege: boolean = false;
  isNorecordFound: boolean = false;
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  tabs: any = [];  //For shwoing tabs

  constructor( 
    private formBuilder:FormBuilder,
    private subjecttaggingservice:SubjecttaggingService,
    private alertHelper:AlertHelper,
    public customValidator:CustomValidators,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private spinner: NgxSpinnerService,
    public commonserviceService: CommonserviceService,
  ) { 
      const pageUrl:any = this.router.url;  
      this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
      this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[3], this.config.privilege[1]);  // For authorization
      this.tabs = this.privilegeHelper.PrimaryLinkTabNames(pageUrl);  //For shwoing tabs 
    }
 ngOnInit(): void {
    this.spinner.show();
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    } 
    this.userProfile = this.commonserviceService.getUserProfile();
    this.loadSubjectTagging();
  }
  loadSubjectTagging()
  {
    this.spinner.show();
    this.subjecttaggingservice
    .viewSubjectTagging()
    .subscribe((data: any) => {
      this.subjectTaggingData = data.data;
      this.isNorecordFound = this.subjectTaggingData.length ? false : true;
     this.classId = this.subjectTaggingData.className;
      this.subject = this.subjectTaggingData.subject;
      this.spinner.hide();
    });
  }
  deleteSubjectTagging(id: number){ 
    const users = this.commonserviceService.getUserProfile();
    this.userId = users?.userId;
      this.alertHelper.deleteAlert(
        "Are you sure to delete?",
        "",
        "question",
        "Yes, delete it!"
      ).then((result)=>{
        this.spinner.show();
        if(result.value){
          this.subjecttaggingservice.deleteSubjectTagging(id,this.userId).subscribe((res:any)=>{
            this.spinner.hide();
          this.alertHelper.successAlert(
            "Deleted!",
            "Subjecttagging deleted successfully",
            "success")
            this.loadSubjectTagging();
          });
        }
        else{
          this.spinner.hide();
        }
      })
    }

}
