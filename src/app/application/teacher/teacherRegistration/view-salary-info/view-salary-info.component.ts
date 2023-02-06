import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { RegistrationService } from '../../services/registration.service';

@Component({
  selector: 'app-view-salary-info',
  templateUrl: './view-salary-info.component.html',
  styleUrls: ['./view-salary-info.component.css']
})
export class ViewSalaryInfoComponent implements OnInit {
  teacherEncryptedId!: string | null;
  paramObj: any;
  isLoading :boolean = false; 
  viewSalaryData:any="";
  public userProfile = this.commonserviceService.getUserProfile();
  loginUserType = this.userProfile.loginUserTypeId;  
  userDesignation = this.userProfile.designationId;
  verificationStatus:any="";
  changeReqStatus: any="";
  annextureResults: any="";
  bankData: any=[];
  constructor(
    private activatedRoute: ActivatedRoute,    
    private spinner: NgxSpinnerService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private route: Router,
    private router: ActivatedRoute,
    private registrationService: RegistrationService,
    private commonserviceService: CommonserviceService,) { }

  ngOnInit(): void {
    this.teacherEncryptedId = this.activatedRoute.snapshot.paramMap?.get("id");
    this.getAnnextureData();
    this.viewSalaryInfo();
  }
  getAnnextureData() { // "TEACHER_PAY_TYPE","TEACHER_PAYMENT_PROCESS"
    
    this.commonserviceService
      .getCommonAnnexture([       
        "BANK",
      ])
      .subscribe({
        next: (res: any) => {          
          this.spinner.hide();
          this.annextureResults = res?.data.BANK;          
          this.annextureResults.forEach((value:any) => {            
            this.bankData[value.anxtValue] = value.anxtName;            
        });
        },
      });
  }
  viewSalaryInfo(...params: any) {
    this.spinner.show();  
   
    this.isLoading = true;
    this.registrationService.getExistingSalaryInfo(this.teacherEncryptedId).subscribe({
      next: (res: any) => {
        this.viewSalaryData = res?.salaryInfo;    
        
        this.verificationStatus = res?.verificationStatus;       
        
        this.changeReqStatus = res?.changeRequestStatus;
        this.spinner.hide();
        // console.log(this.viewSalaryData);
        
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
      
    });
  }

}
