import { Component, OnInit } from '@angular/core';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { LogInUserProfileService } from './services/log-in-user-profile.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})
export class MyprofileComponent implements OnInit {

  public users = this.commonService.getUserProfile();
  userId = this.users?.userId;
  userData: any = '';

  public fileUrl = environment.filePath;
  // public fileUrl1 = environment.filePath;
  imageUrlTeacher: any = "";
  isimageUrlUser: boolean = false;

  locatedTypeShown: boolean = true;
  labelOfUserShown: boolean = true;

  contactBlockShown: boolean = false;
  contactVillageShown: boolean = false;
  contactPanchayatShown: boolean = false;
  contactMuncipalityShown: boolean = false;
  contactWardShown: boolean = false;

  officeDistrictShown: boolean = false;
  officeBlockShown: boolean = false;
  officeClusterShown: boolean = false;

  vchImage: any = "";
  name: any = "";
  dob: any = "";
  gender: any = "";

  locatedType: any = "";
  contactMuncipality: any = "";
  contactWard: any = "";
  contactPanchayat: any = "";
  contactVillage: any = "";
  contactState: any = "";
  contactDistrict: any = "";
  contactBlock: any = "";
  contactCluster: any = "";
  contactMobileNumber: any = "";
  contactEmailId: any = "";
  contactAddress: any = "";

  levelOfUser: any = "";

  designation: any = "";
  subDesignation: any = "";
  officeDistrict: any = "";

  officeBlock: any = "";
  officeCluster: any = "";

  officeMobileNumber: any = "";
  officeEmailId: any = "";
  officeAddress: any = "";

  constructor
    (private getUserProfile: LogInUserProfileService,
      private commonService: CommonserviceService
    ) { }

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData() {
    return this.getUserProfile.viewLogInUser(this.userId).subscribe((res: any) => {
      this.name = res.data?.vchfullName;
      this.dob = res.data?.dtmDOB;
      this.gender = res.data?.tinGenderId;

      this.locatedType = res.data?.locateId;

      this.contactMuncipality = res.data?.panchayatName;
      this.contactWard = res.data?.villageName;

      this.contactBlock = res.data?.hmblockName;
      this.contactVillage = res.data?.villageName;
      this.contactPanchayat = res.data?.panchayatName;
      this.contactDistrict = res.data?.hmdistrictName;
      this.contactMobileNumber = res.data?.vchMobileNo;
      this.contactEmailId = res.data?.vchEmailId;
      this.contactAddress = res.data?.vchContactAddress;

      this.levelOfUser = res.data?.intLevelId;
      this.designation = res.data?.vchDesignationName;
      this.subDesignation = res.data?.designationGroupName;
      this.officeDistrict = res.data?.ofcDistName;
      this.officeBlock = res.data?.blockName;
      this.officeCluster = res.data?.clusterName;
      this.officeMobileNumber = res.data?.vchOfficePhoneNo;
      this.officeEmailId = res.data?.vchEmailId;
      this.officeAddress = res.data?.vchOfficeAddress;

      if ((res.data.vchImage !== "") && (res.data.vchImage !== null)) {
        this.isimageUrlUser = true;
        var str = res.data.vchImage;
        var newstr = str.replace(".", "~");
        this.imageUrlTeacher = this.fileUrl + "/uploads/userProfiles/" + newstr;
      }

      if (res.data?.locateId == 1) {
        this.contactMuncipalityShown = true;
        this.contactWardShown = true;
      } else if (res.data?.locateId == 2) {
        this.contactBlockShown = true;
        this.contactVillageShown = true;
        this.contactPanchayatShown = true;
      } else {
        this.contactMuncipalityShown = false;
        this.contactWardShown = false;
        this.contactBlockShown = false;
        this.contactVillageShown = false;
        this.contactPanchayatShown = false;
      }

      if (res.data?.intLevelId == 4) {
        this.officeDistrictShown = true;
      } else if (res.data?.intLevelId == 3) {
        this.officeDistrictShown = true;
        this.officeBlockShown = true;
      } else if (res.data?.intLevelId == 2) {
        this.officeDistrictShown = true;
        this.officeBlockShown = true;
        this.officeClusterShown = true;
      } else if (res.data?.intLevelId == 5) {
        this.officeDistrictShown = false;
        this.officeBlockShown = false;
        this.officeClusterShown = false;
      } else {
        this.officeDistrictShown = false;
        this.officeBlockShown = false;
        this.officeClusterShown = false;
      }
    });
  }



}
