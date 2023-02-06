import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ShiftmasterService } from '../services/shiftmaster.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-shiftmaster',
  templateUrl: './view-shiftmaster.component.html',
  styleUrls: ['./view-shiftmaster.component.css']
})
export class ViewShiftmasterComponent implements OnInit {
  shiftMasterSearchform!: FormGroup;
   shift: any ="";
  shiftStartTime: any ="";
  shiftEndTime: any ="";
  resData: any ="";
  shiftMasterData: any;
  post: any;
 userId:any="";
 profileId:any="";
  select_all = false;
  isEmpty: boolean = false;
  adminPrivilege: boolean = false;
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  constructor( private formBuilder:FormBuilder,
    private shiftmasterservice:ShiftmasterService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    public commonserviceService: CommonserviceService,
    private alertHelper:AlertHelper,public customValidator:CustomValidators,
    private spinner: NgxSpinnerService) {
      const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For authorization

     }
  ngOnInit(): void {
    this.spinner.show();
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }
    this.initializeForm();
   this.loadShiftMaster();
}
initializeForm(){
  this.shiftMasterSearchform = this.formBuilder.group({
    shift: [this.shift],
  });
}
onSearch()
{
  this.loadShiftMaster();
  
  
}
 loadShiftMaster()
    {
      
      
      this.spinner.show();
      this.shiftmasterservice
      .viewShiftMaster(this.shiftMasterSearchform.value)
      .subscribe((data: any) => {
        this.shiftMasterData = data.data;
        this.isEmpty = this.shiftMasterData.length > 0 ? false : true;
        this.spinner.hide();
        
      });
  }

 deleteShiftMaster(id: number){ 
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
        this.shiftmasterservice.deleteShiftMaster(id,this.userId,this.profileId).subscribe((res:any)=>{
          this.spinner.hide();
        this.alertHelper.successAlert(
          "Deleted!",
          "Shiftmaster deleted successfully",
          "success")
          this.loadShiftMaster();
        });
      }
      else{
        this.spinner.hide();
      }
    })
  }

}
