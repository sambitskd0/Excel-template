import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ErrorHandler, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SchoolService } from 'src/app/application/school/services/school.service';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { environment } from 'src/environments/environment';
import { StudentInformationService } from '../../services/student-information.service';

@Component({
  selector: 'app-preview-student',
  templateUrl: './preview-student.component.html',
  styleUrls: ['./preview-student.component.css']
})
export class PreviewStudentComponent implements OnInit {
  public userProfile = JSON.parse(
    sessionStorage.getItem("userProfile") || "{}"
  );
  schlInfo: any = [];
  stdInfo: any = [];
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();
  encId:any = '';
  schoolId:any = '';
  class:any = "";
  stream:any = "";
  passedLastExam:any = "";
  gotMedicine:any = "";
  
  bankName:any = "";
  studentPhotoIDPath:any = "";
  residentialCertificatePath:any = "";
  affidavitPath:any = "";
  incomeCertificatePath:any = "";
  casteCertificatePath:any = "";
  public filePath = environment.filePath;
  plPrivilege:string="view"; //For menu privilege

  constructor(
    private spinner: NgxSpinnerService,
    private commonService:CommonserviceService,
    private schoolService:SchoolService,
    private studentServices:StudentInformationService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private el:ElementRef,
    private httpClient:HttpClient,
    private errorHandler: ErrorHandler,
    private router:Router,
    private activatedRoute:ActivatedRoute,
  ) {
    const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
   }

  ngOnInit(): void {
    this.userProfile = this.commonService.getUserProfile();
    this.schoolId = this.userProfile.school;
    this.getSchoolInfo();
    this.encId = this.activatedRoute.snapshot.params["encId"];
    this.studentInfo(this.encId);
  }

  getSchoolInfo() {
    this.spinner.show();
    this.commonService
      .getSchoolBasicInfo({
        encId: this.userProfile.school,
        academicYear: this.academicYear,
      })
      .subscribe((res: any = []) => {
        this.spinner.hide();
        //console.log('data:::',res.data);
        this.schlInfo = res.data;
      });
  }

  studentInfo(encId: string) {
    this.spinner.show();
    this.studentServices
      .studentInfo({
        encId: encId,
        academicYear: this.academicYear,
      })
      .subscribe((res: any = []) => {
        // console.log("stdInfo:::", res.data);
        // console.log("stdInfo:::", res.data.markSecuredLastExam);
        // console.log("stdInfo:::", res.data.passedLastExam);
        this.stdInfo = res.data;

        if(this.stdInfo.studentPhotoID !== null && this.stdInfo.studentPhotoID.length>0){
          var str = this.stdInfo.studentPhotoID;
          var newstr = str.replace('.','~'); 
          this.studentPhotoIDPath = this.filePath+'/'+newstr;   
        }
        if(this.stdInfo.residentialCertificate !== null && this.stdInfo.residentialCertificate.length>0){
          var str = this.stdInfo.residentialCertificate;
          var newstr = str.replace('.','~'); 
          this.residentialCertificatePath = this.filePath+'/'+newstr;   
        }
        if(this.stdInfo.affidavit !== null && this.stdInfo.affidavit.length>0){
          var str = this.stdInfo.affidavit;
          var newstr = str.replace('.','~'); 
          this.affidavitPath = this.filePath+'/'+newstr;   
        }
    
        if(this.stdInfo.incomeCertificate !== null && this.stdInfo.incomeCertificate.length>0){
          var str = this.stdInfo.incomeCertificate;
          var newstr = str.replace('.','~'); 
          this.incomeCertificatePath = this.filePath+'/'+newstr;   
        }
    
        if(this.stdInfo.casteCertificate !== null && this.stdInfo.casteCertificate.length>0){
          var str = this.stdInfo.casteCertificate;
          var newstr = str.replace('.','~'); 
          this.casteCertificatePath = this.filePath+'/'+newstr;   
        }
        this.spinner.hide();
      });
  }


}
