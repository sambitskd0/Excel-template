import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { RegistrationService } from '../../services/registration.service';

@Component({
  selector: 'app-view-service-info',
  templateUrl: './view-service-info.component.html',
  styleUrls: ['./view-service-info.component.css']
})
export class ViewServiceInfoComponent implements OnInit {
  teacherEncryptedId!: string | null;
  paramObj: any;
  isLoading :boolean = false; 
  viewServiceData:any=[];
  public userProfile = this.commonserviceService.getUserProfile();
  loginUserType = this.userProfile.loginUserTypeId;  
  userDesignation = this.userProfile.designationId;
  verificationStatus:any="";
  changeReqStatus:any="";
  constructor(
    private activatedRoute: ActivatedRoute,    
    private spinner: NgxSpinnerService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private route: Router,
    private router: ActivatedRoute,
    private registrationService: RegistrationService,
    private commonserviceService: CommonserviceService) { }

  ngOnInit(): void {
    // this.spinner.show();
    this.teacherEncryptedId = this.activatedRoute.snapshot.paramMap?.get("id");
    this.viewServiceInfo();
   
  }

  viewServiceInfo(...params: any) {
    this.spinner.show();  
   
    this.isLoading = true;
    this.registrationService.getExistingServiceInfo(this.teacherEncryptedId).subscribe({
      next: (res: any) => {        
        this.viewServiceData = res?.serviceInfo;  
        this.verificationStatus = res?.verificationStatus;         
        this.changeReqStatus = res?.changeRequestStatus;     
        this.spinner.hide();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
      },
      
    });
  }
}
