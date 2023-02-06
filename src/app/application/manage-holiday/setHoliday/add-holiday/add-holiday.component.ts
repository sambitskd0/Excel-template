import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';

import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { SchoolService } from 'src/app/application/school/services/school.service';
import { HolidayService } from '../../services/holiday.service';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-add-holiday',
  templateUrl: './add-holiday.component.html',
  styleUrls: ['./add-holiday.component.css']
})

export class AddHolidayComponent implements OnInit {

  holidayForm!: FormGroup
  allErrorMessages: string[] = [];
  submitted = false;
  posts: any = [];
  userProfile: any = [];
  createdBy: any = "";

  districtData: any = [];
  blockData: any = [];
  schoolCatData: any = [];
  schoolData: any = [];

  distLoading: boolean = false;
  blockLoading: boolean = false;

  disrtictChanged: boolean = false;
  blockChanged: boolean = false;
  schoolCatagoryChanged: boolean = false;
  schoolChanged: boolean = false;

  districtId: any = "";
  blockId: any = "";
  schlCatId: any = "";
  schoolId: any = "";
  holidayName: any = "";
  startDate: any = "";
  endDate: any = "";

  minDate: any =  new Date(new Date().setMonth(new Date().getMonth()-1));
  // maxDate: any =  new Date(new Date().setMonth(new Date().getMonth()+12));
  maxDate: any =  new Date((new Date().getFullYear()+1), 11, 31);
  minYear: any = Date;

  allLabel: string[] = [
    "District",
    "Block",
    "School Category",
    "School",
    "Holiday Name",
    "Date/Start Date",
    "End Date",
    "",
    "",
  ];
  plPrivilege: string = "view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private spinner: NgxSpinnerService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router: Router,
    private commonService: CommonserviceService,
    private schoolService: SchoolService,
    private holidayService: HolidayService,
    private el: ElementRef) {
    const pageUrl: any = this.router.url;
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]); // For authorization
    this.minYear = new Date().getFullYear();
    const day = '01';
    const month = '01';
    //this.minDate = new Date(`${day}-${month}-${this.minYear}`);
  }

  ngOnInit(): void {

    console.log(this.maxDate);
    

    if (this.plPrivilege == 'admin') {
      this.adminPrivilege = true;
    }
    this.userProfile = this.commonService.getUserProfile();

    this.getDistrict();
    this.el.nativeElement.querySelector('[formControlName=districtId]').focus();
    if (this.userProfile.district > 0) {
      this.districtId = this.userProfile.district;
      this.getBlock(this.userProfile.district);
    }
    this.getSchoolCategory();
    this.initializeForm();
  }

  initializeForm() {
    this.holidayForm = this.formBuilder.group({
      // districtId : [{value:this.districtId,disabled:this.userProfile.district  != '' ? true : false }],
      // blockId    : [{value:this.blockId,disabled:this.userProfile.block  != '' ? true : false }],
      districtId: [this.districtId],
      blockId: [this.blockId],
      schlCatId: [''],
      schoolId: [''],
      holidayName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-Z ,.'\-\s]+$/)]],
      startDate: ['', Validators.required],
      endDate: [''],
      isOptionalHoliday: [''],
      createdBy: [this.userProfile.userId],
      sessionValue: [this.userProfile],
      profileId: [this.userProfile.profileId],
    });

    if (this.userProfile.block != "") {
      this.getSchoolList();
    }
  }

  compareDate() {
    let sd = this.holidayForm.get("startDate")?.value;
    let ed = this.holidayForm.get("endDate")?.value;
    if (sd != "" && ed != "") {
      if (new Date(ed) < new Date(sd)) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formControlName="endDate"]'
        );
        invalidControl.focus();
        this.alertHelper.viewAlertHtml(
          "error",
          "Invalid inputs",
          "End date should not be less than start date."
        );
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  onSubmit() {
    this.submitted = true;
    // if ("INVALID" === this.holidayForm.status) {
    //   for (const key of Object.keys(this.holidayForm.controls)) {
    //     if (this.holidayForm.controls[key].status === "INVALID") {
    //       const invalidControl = this.el.nativeElement.querySelector(
    //         '[formControlName="' + key + '"]'
    //       );
    //       invalidControl.focus();
    //       this.customValidators.formValidationHandler(this.holidayForm,this.allLabel);
    //       break;
    //     }
    //   }
    // }
    if (this.holidayForm.invalid) {
      // this.customValidators.formValidationHandler(this.holidayForm, this.allLabel, this.el);
      this.customValidators.formValidationHandler(
        this.holidayForm,
        this.allLabel,
        this.el,
        {
          required: {
            holidayName: "Please enter holiday name",
            startDate: "Please enter date/start date of the holiday",
          },
        }
      );
    }
    if (this.holidayForm.valid === true && this.compareDate()) {
      this.alertHelper.submitAlert().then((result: any) => {
        let tempSDate = this.holidayForm.get("startDate")?.value;
        let tempEDate = this.holidayForm.get("endDate")?.value;
        if (result.value) {
          this.holidayForm.patchValue({ startDate: formatDate(this.holidayForm.get("startDate")?.value, "yyyy-MM-dd", "en_US") });
          if (this.holidayForm.get("endDate")?.value != '') {
            this.holidayForm.patchValue({ endDate: formatDate(this.holidayForm.get("endDate")?.value, "yyyy-MM-dd", "en_US") });
          }
          let formRawData = this.holidayForm.getRawValue();
          this.holidayForm.patchValue({ startDate: tempSDate });
          if (this.holidayForm.get("endDate")?.value != '') {
            this.holidayForm.patchValue({ startDate: tempEDate });
          }
          this.spinner.show(); // ==== show spinner
          this.holidayService
            .addHoliday(formRawData)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Holiday details saved successfully",
                    "success"
                  )
                  .then(() => {
                    this.resetForm();
                    this.initializeForm();
                  });
              },
              error: (error: any) => {
                this.spinner.hide(); //==== hide spinner
                let errorMessage: string = "";
                if (typeof error.error?.msg === "string") {
                  errorMessage +=
                    '<i class="bi bi-arrow-right text-danger"></i> ' +
                    error.error.msg +
                    `<br>`;
                } else {
                  error.error.msg.map(
                    (message: string) =>
                    (errorMessage +=
                      '<i class="bi bi-arrow-right text-danger"></i> ' +
                      message +
                      `<br>`)
                  );
                }
                this.alertHelper.viewAlertHtml(
                  "error",
                  "Invalid inputs",
                  errorMessage
                );
              },
              complete: () => console.log('done'),
            });
        }
      });
    } else {
      for (const control of Object.keys(this.holidayForm.controls)) {
        this.holidayForm.controls[control].markAsTouched();
      }
    }

  }


  getDistrict() {
    this.distLoading = true;
    this.disrtictChanged = true;
    this.commonService.getAllDistrict().subscribe((res: []) => {
      this.posts = res;
      this.districtData = this.posts.data;
      if (this.userProfile.district > 0) {
        this.districtData = this.districtData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        this.holidayForm.controls["districtId"].patchValue(this.userProfile.district);
      } else {
        this.disrtictChanged = false;
      }
      this.distLoading = false;
    });
  }

  getBlock(districtId: any) {
    //console.log('block:::',this.holidayForm.value);   
    this.blockChanged = true;
    this.blockLoading = true;
    this.districtId = districtId;
    this.blockData = [];
    this.schoolData = [];

    if (this.userProfile.block > 0) {
      this.blockId = this.userProfile.block;
    }

    if (districtId > 0) {
      this.commonService.getBlockByDistrictid(districtId).subscribe((res) => {
        this.blockData = res;
        this.blockData = this.blockData.data;
        if (this.userProfile.block > 0) {
          this.blockId = this.userProfile.block;
          this.blockData = this.blockData.filter((blo: any) => {
            return blo.blockId == this.userProfile.block;
          });
          this.holidayForm.controls['blockId']?.patchValue(this.userProfile.block);
        } else {
          this.blockChanged = false;
        }
        this.blockLoading = false;
      });
    } else {
      this.blockChanged = false;
    }
  }

  getSchoolCategory() {
    this.schoolCatagoryChanged = true;
    this.schoolCatData = [];
    this.schoolData = [];
    this.schoolService.getSchoolCategory().subscribe((res) => {
      this.posts = res;
      let data: any = res;
      for (let key of Object.keys(data['data'])) {
        this.schoolCatData.push(data['data'][key]);
      }
      this.schoolCatagoryChanged = false;
    });
  }

  getSchoolList() {
    this.schoolChanged = true;
    this.schoolData = [];
    this.districtId = this.holidayForm.get('districtId')?.value;
    this.blockId = this.holidayForm.get('blockId')?.value;
    this.schlCatId = this.holidayForm.get('schlCatId')?.value;
    let paramList: any = { districtId: this.districtId, blockId: this.blockId, schoolCategoryId: this.schlCatId };
    if( this.blockId > 0){
      
    this.schoolService.getSchoolList(paramList).subscribe((res) => {
      this.posts = res;
      let data: any = res;
      for (let key of Object.keys(data['data'])) {
        this.schoolData.push(data['data'][key]);
      }
      this.schoolChanged = false;
    });
    }
  }

  resetForm() {
    this.holidayForm.patchValue({ blockId: "" });
    this.holidayForm.patchValue({ schoolId: "" });
    this.holidayForm.patchValue({ holidayName: "" });
    this.holidayForm.patchValue({ schlCatId: "" });
    this.holidayForm.patchValue({ startDate: "" });
    this.holidayForm.patchValue({ endDate: "" });
    this.holidayForm.patchValue({ isOptionalHoliday: "" });
  }

}
