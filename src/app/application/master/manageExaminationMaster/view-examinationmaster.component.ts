import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageexaminationmasterService } from '../services/manageexaminationmaster.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-examinationmaster',
  templateUrl: './view-examinationmaster.component.html',
  styleUrls: ['./view-examinationmaster.component.css']
})
export class ViewExaminationmasterComponent implements OnInit {
   examinationTypeId: any ="";
  classId: any ="";
  description:any="";
  examinationMasterdata: any;
  post: any;
  userId:any="";
  profileId:any="";
  resData:any;
 select_all = false;
  isEmpty: boolean = false;
  adminPrivilege: boolean = false;
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  tabs: any = [];  //For shwoing tabs
  constructor( private formBuilder:FormBuilder,
    private manageexaminationmasterservice:ManageexaminationmasterService,
    public commonserviceService: CommonserviceService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    private route: ActivatedRoute,
    private alertHelper:AlertHelper,public customValidator:CustomValidators,
    private spinner: NgxSpinnerService) { 
      const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
    this.tabs = this.privilegeHelper.PrimaryLinkTabNames(pageUrl);  //For shwoing tabs
    }


  ngOnInit(): void {
    this.spinner.show();
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    this.loadExaminationMaster();
    
    
  }

 
  loadExaminationMaster()
  {
  this.spinner.show();
    this.manageexaminationmasterservice
    .viewExaminationMaster()
    .subscribe((res: any) => {
      this.examinationMasterdata = res.data;
      this.isEmpty = this.examinationMasterdata.length > 0 ? false : true;
      this.spinner.hide();
     
    });
  }
 

  deleteExaminationMaster(id: number){ 
    const users = this.commonserviceService.getUserProfile();
  this.userId = users?.userId;
  this.profileId = users?.profileId;
     this.alertHelper.deleteAlert(
      "Are you sure to delete?",
      "",
      "question",
      "Yes, delete it!"
    ).then((result)=>{
      this.spinner.show();
      if(result.value){
        this.manageexaminationmasterservice.deleteExaminationMaster(id,this.userId,this.profileId).subscribe((res:any)=>{
          this.spinner.hide();
        this.alertHelper.successAlert(
          "Deleted!",
          "Examination deleted successfully",
          "success")
          this.loadExaminationMaster();
        });
      }
      else{
        this.spinner.hide();
      }
    })
  }
}




