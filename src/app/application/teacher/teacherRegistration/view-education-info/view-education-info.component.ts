import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonFunctionHelper } from 'src/app/core/helpers/common-function-helper';
import { RegistrationService } from '../../services/registration.service';
import { ViewdetailsService } from '../../services/viewdetails.service';

@Component({
  selector: 'app-view-education-info',
  templateUrl: './view-education-info.component.html',
  styleUrls: ['./view-education-info.component.css']
})
export class ViewEducationInfoComponent implements OnInit {
  teacherId: any = "";
  educationInfoData: any = "";
  preServiceDatas: any = "";
  inServiceDatas: any = "";
  teacherName: any = "";
  teacherTitle: any = "";
  
  preServiceDataEmpty: boolean = false;
  inServiceDataEmpty: boolean = false;
  constructor(
    private spinner: NgxSpinnerService,
    private viewDetailsService: ViewdetailsService,
    private router: ActivatedRoute,   
    public commonFunctionHelper: CommonFunctionHelper,
    private registrationService: RegistrationService,) { }

  ngOnInit(): void {
    this.teacherId = this.router.snapshot.params["id"]; 
    this.viewTeacherEducationInfo(this.teacherId);  
    this.getTeacherInfo();  
  }

  viewTeacherEducationInfo(encId :any){
    this.spinner.show();
    this.viewDetailsService
      .viewTeacherEducationInfo(encId)
      .subscribe((res: any) => {
        this.educationInfoData = res;       
       this.preServiceDatas = this.educationInfoData.preServicedata;
       (this.preServiceDatas.length > 0) ? this.preServiceDataEmpty = false : this.preServiceDataEmpty = true ;
       this.inServiceDatas = this.educationInfoData.inServicedata;
       (this.inServiceDatas.length > 0) ? this.inServiceDataEmpty = false : this.inServiceDataEmpty = true ;
        this.spinner.hide();
      });
  }
  getTeacherInfo() {    
    this.registrationService.teacherDetailsChanged.subscribe((res: any) => { 
      this.teacherName = res?.teacherName;
      this.teacherTitle = res?.teacherTitle;          
    });
  }
}
