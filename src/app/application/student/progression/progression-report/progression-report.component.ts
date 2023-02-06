import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SchoolService } from 'src/app/application/school/services/school.service';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { StudentInformationService } from '../../services/student-information.service';

@Component({
  selector: 'app-progression-report',
  templateUrl: './progression-report.component.html',
  styleUrls: ['./progression-report.component.css']
})
export class ProgressionReportComponent implements OnInit {
  public show:boolean = true;
  public buttonName:any = 'Show';
  optionVal:any;
  optionstream:any;

  schoolId: any;  
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();

  schoolInfoData: any;
  districtCode: any = "";
  districtName: any = "";
  blockCode: any = "";
  blockName: any = "";
  clusterCode: any = "";
  clusterName: any = "";
  schoolName: any = "";
  schoolUdiseCode: any = "";

  pgData: any = {};
  studebtListModal: any = {};
  tot = 0 ;

  constructor(
    private commonService: CommonserviceService,
    private spinner: NgxSpinnerService,
    private schoolService : SchoolService,
    private studentService : StudentInformationService,
  ) {}

  ngOnInit(): void {
    const userProfile = this.commonService.getUserProfile();
    this.schoolId = userProfile?.school;
    if (this.schoolId !== 0 && this.schoolId !== "") {
      this.getSchoolBasicInfo(this.schoolId, this.academicYear);
      this.getProgressionData(this.schoolId, this.academicYear);
      //this.getClass(this.schoolId);
    }
  }

  getSchoolBasicInfo(schoolId: any, academicYear: any) {
    this.spinner.show();
    this.schoolService
      .getSchoolBasicInfo(schoolId, academicYear)
      .subscribe((res: any) => {
        this.schoolInfoData = res.data;
        this.districtCode = this.schoolInfoData?.districtCode;
        this.districtName = this.schoolInfoData?.districtName;
        this.blockCode = this.schoolInfoData?.blockCode;
        this.blockName = this.schoolInfoData?.blockName;
        this.clusterCode = this.schoolInfoData?.clusterCode;
        this.clusterName = this.schoolInfoData?.clusterName;
        this.schoolName = this.schoolInfoData?.schoolName;
        this.schoolUdiseCode = this.schoolInfoData?.schoolUdiseCode;
        this.spinner.hide();
      });
  }

  getProgressionData(schoolId: any, academicYear: any) {
    this.spinner.show();
    this.studentService
      .getProgressionData(schoolId, academicYear)
      .subscribe((res: any) => {
        this.spinner.hide();
        const resDt  = res.data;
        const pgInfo : any =[];
        let progressedTot : any = 0;
        let newEnrolledTot :any = 0;
        let CTot :any = 0;
        let passoutTot :any = 0;
        let DTot :any = 0;
        let ETot :any = 0;
        if(res.status == 'SUCCESS' && resDt){
          resDt.allClasses.forEach(function (cls:any) {

              let progressed = (resDt.resData[cls]) ? resDt.resData[cls].progressed : 0;
              let newEnrolled = (resDt.resData[cls]) ? resDt.resData[cls].newEnrolled : 0;
              let C = Number(progressed)+Number(newEnrolled);

              let promoted = (resDt.resData[cls]) ? resDt.resData[cls].promoted : 0;
              let repeater = (resDt.resData[cls]) ? resDt.resData[cls].repeater : 0;
              let dropout = (resDt.resData[cls]) ? resDt.resData[cls].dropout : 0;
              let promotedOtherSchool = (resDt.resData[cls]) ? resDt.resData[cls].promotedOtherSchool : 0;
              let passout = (resDt.resData[cls]) ? resDt.resData[cls].passout : 0;

              let D = Number(promoted)+Number(repeater)+Number(dropout)+Number(promotedOtherSchool);
              let E = Number(C) - Number(D);
              E = (E>0)?E:0;

              progressedTot+=Number(progressed);
              newEnrolledTot+=Number(newEnrolled);
              passoutTot+=Number(passout);
              CTot+=Number(C);

              DTot+=Number(D);
              ETot+=Number(E);

              pgInfo.push({
                'class':cls,
                'progressed':progressed,
                'newEnrolled':newEnrolled,
                'C':C,

                'promoted':promoted,
                'repeater':repeater,
                'dropout':dropout,
                'promotedOtherSchool':promotedOtherSchool,
                'passout':passout,

                'D':D,
                'E':E
              });
          });
          this.pgData = {
            'pgInfo':pgInfo,
            'progressedTot':progressedTot,
            'newEnrolledTot':newEnrolledTot,
            'CTot':CTot,
            'passoutTot':passoutTot,
            'DTot':DTot,
            'ETot':ETot,
            'academicYear':resDt.academicYear,
            'prePrvAcademicYear':resDt.prePrvAcademicYear,
            'prvAcademicYear':resDt.prvAcademicYear
          };          
          console.log(this.pgData);
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

  showStudentList(cls:any,col:any) {
    const paramList = { schoolId : this.schoolId, academicYear : this.academicYear, class : cls, col: col };
    this.spinner.show();
    this.studentService
      .showStudentList(paramList)
      .subscribe((res: any) => {
        this.spinner.hide();
        this.studebtListModal = res.data;
        console.log(this.studebtListModal);
        
      });

  }

}
