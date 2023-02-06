import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonFunctionHelper } from 'src/app/core/helpers/common-function-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { RegistrationService } from '../../services/registration.service';
import { ViewdetailsService } from '../../services/viewdetails.service';

@Component({
  selector: 'app-view-training-and-language-info',
  templateUrl: './view-training-and-language-info.component.html',
  styleUrls: ['./view-training-and-language-info.component.css']
})
export class ViewTrainingAndLanguageInfoComponent implements OnInit {
  teacherId: any = "";
  tariningDatas: any = "";
  tariningListData: any = "";
  trainingDataEmpty :boolean = false;  
  teacherExamPassed:any ="";
  allPlaceOfTraining: any =[];
  plcTraing: any =[];
  trainningSub: any =[];
  exmPass: any =[];
  constructor(
    private spinner: NgxSpinnerService,
    private viewDetailsService: ViewdetailsService,
    private commonService: CommonserviceService,
    private router: ActivatedRoute,   
    private registrationService: RegistrationService,
    public commonFunctionHelper: CommonFunctionHelper) { }


  ngOnInit(): void {
    this.teacherId = this.router.snapshot.params["id"]; 
    this.viewTeacherTrainingInfo(this.teacherId);
    this.getPlaceOfTraining();
    this.getAnnextureData();
  }
  viewTeacherTrainingInfo(encId :any){
    this.spinner.show();
    this.viewDetailsService
      .viewTeacherTrainingInfo(encId)
      .subscribe((res: any) => {
        this.tariningDatas = res?.data; 
        this.trainningSub=res?.data[0];
         (this.tariningDatas) ? this.trainingDataEmpty = false : this.trainingDataEmpty = true;  
        this.spinner.hide();
      });
  }
  getPlaceOfTraining() {
    this.spinner.show();
    this.registrationService.getPlaceOfTraining().subscribe({
      next: (res: any) => {
        if (res.success === true) 
        this.allPlaceOfTraining = res?.data;   
        if((this.allPlaceOfTraining !='') || (this.allPlaceOfTraining != null)){
          this.allPlaceOfTraining.forEach((val:any) => {        
            this.plcTraing[val.anxtValue] = val.anxtName;
          });
        }     
        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
      },
      
      
    });
  }
  getAnnextureData() {
    this.spinner.show();
    this.commonService
      .getCommonAnnexture(["EXAM_PASSED",""
       ])
      .subscribe({
        next: (res: any) => { 
          this.spinner.hide();
          this.teacherExamPassed = res?.data?.EXAM_PASSED; 
          if((this.teacherExamPassed !='') || (this.teacherExamPassed != null)){
            this.teacherExamPassed.forEach((val:any) => {        
              this.exmPass[val.anxtValue] = val.anxtName;
            });
          } 
          this.spinner.hide();
        },
        
      });
  }
}
