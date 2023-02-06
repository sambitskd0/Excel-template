import { Component, OnInit} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ManageStudentGradeService } from '../services/manage-student-grade.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Constant } from 'src/app/shared/constants/constant';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { Router } from '@angular/router';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';


@Component({
  selector: 'app-view-studentgrademaster',
  templateUrl: './view-studentgrademaster.component.html',
  styleUrls: ['./view-studentgrademaster.component.css']
})
export class ViewStudentgrademasterComponent implements OnInit {
  resData: any ="";
  studentGradeData: any;
  post: any;
 
  select_all = false;
  isEmpty: boolean = false;
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  constructor( private formBuilder:FormBuilder,
    private managestudentgradeservice:ManageStudentGradeService,
   public customValidator:CustomValidators,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
    public commonserviceService: CommonserviceService,
    private spinner: NgxSpinnerService) {
      const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonserviceService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
     }

  ngOnInit(): void {
    this.spinner.show();
   this.loadStudentGrade();

  }
  loadStudentGrade()
  {
    this.spinner.show();
      this.managestudentgradeservice
      .viewStudentGradeMaster()
      .subscribe((data: any) => {
        this.studentGradeData = data.data;
        this.isEmpty = this.studentGradeData.length > 0 ? false : true;
        this.spinner.hide();
       
       
      });
 }

}
