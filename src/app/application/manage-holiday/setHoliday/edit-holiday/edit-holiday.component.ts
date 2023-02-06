import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { ActivatedRoute, Router } from "@angular/router";

import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { SchoolService } from 'src/app/application/school/services/school.service';
import { HolidayService } from '../../services/holiday.service';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-edit-holiday',
  templateUrl: './edit-holiday.component.html',
  styleUrls: ['./edit-holiday.component.css']
})
export class EditHolidayComponent implements OnInit {
  encId:string = '';
  holidayForm!:FormGroup
  allErrorMessages: string[] = [];
  submitted = false;
  posts: any = []; 
  holidayData : any = [];
  userProfile:any=[];
  createdBy:any ="";

  districtData: any= [];
  blockData: any = [];
  schoolCatData:any = [];
  schoolData:any = [];
  distLoading:boolean = false; 
  blockLoading:boolean = false; 
  disrtictChanged:boolean = false; 
  blockChanged:boolean = false; 
  schoolCatagoryChanged:boolean = false;
  schoolChanged:boolean = false;
  
  districtId:any = "";
  blockId:any = "";
  schlCatId:any = "";
  schoolId:any = "";
  holidayName:any = "";
  startDate:any = "";
  endDate:any = "";
  isOptionalHoliday:any = "";

  allLabel: string[] = [
    "District",
    "Block",
    "School category",
    "School",
    "Holiday name",
    "Date/start date",
    "End date",
    "",
  ];
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();
  adminPrivilege: boolean = false;

  minDate: any =  new Date(new Date().setMonth(new Date().getMonth()-1));
  // maxDate: any =  new Date(new Date().setMonth(new Date().getMonth()+12));
  maxDate: any =  new Date((new Date().getFullYear()+1), 11, 31);
  minYear: any = Date;

  constructor(
    private formBuilder : FormBuilder,
    private alertHelper: AlertHelper,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    public customValidators: CustomValidators,
    private spinner: NgxSpinnerService,
    private commonService:CommonserviceService,
    private schoolService:SchoolService,
    private holidayService:HolidayService,
    private el: ElementRef,
    private route:Router,
    private router:ActivatedRoute,
    ) {
      const pageUrl:any = this.route.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[4]);  // For authorization 
    this.minYear = new Date().getFullYear();
    const day = '01';
    const month = '01';
    this.minDate = new Date(`${day}-${month}-${this.minYear}`); 
     }

  ngOnInit(): void {  
    if(this.plPrivilege=='admin'){
      this.adminPrivilege = true;
    }      
    this.initializeForm();     
    this.encId = this.router.snapshot.params["encId"];
    this.getDistrict();
    this.el.nativeElement.querySelector('[formControlName=districtId]').focus();
    this.userProfile = this.commonService.getUserProfile();
    if (this.userProfile.district>0) {
      this.districtId = this.userProfile.district;
      this.getBlock(this.userProfile.district);
     // this.el.nativeElement.querySelector('[formControlName=blockId]').focus();
    }
    if (this.userProfile.block>0) {     
      this.blockId = this.userProfile.block; 
    }
    this.editHoliday(this.encId);
    this.initializeForm();  
   
  }

  editHoliday(encId: string){
    this.spinner.show();
    let paramList = {encId:encId};
    this.holidayService.getHoliday(paramList).subscribe((res: any) => {
      this.holidayData = res.data[0];      
      this.encId = this.holidayData?.encId ;  
      this.districtId = this.holidayData?.districtId ;
      this.blockId = this.holidayData?.blockId ;
      //console.log(this.blockId);  
      this.schlCatId = this.holidayData?.schlCatId ;  
      this.schoolId = this.holidayData?.schoolId ;  
      this.holidayName = this.holidayData?.holidayName ;
      this.startDate =  new Date(this.holidayData?.startDate);  
      this.endDate = new Date(this.holidayData?.endDate);
      this.isOptionalHoliday = this.holidayData?.isOptionalHoliday ;
      if(this.districtId>0){
        this.getBlock(this.districtId);
        this.getSchoolCategory();
      }
      if(this.schlCatId>0){
        this.getSchoolList();
      }
      this.initializeForm();
      this.spinner.hide();      
    });
  }

  initializeForm() {
    this.holidayForm = this.formBuilder.group({
      // districtId : [{value:this.districtId}],
      // blockId    : [{value:this.blockId}],
      districtId : [this.districtId],
      blockId    : [this.blockId],
      schlCatId  : [this.schlCatId],
      schoolId   : [this.schoolId],
      holidayName: [this.holidayName,[Validators.required,Validators.maxLength(50),Validators.pattern(/^[a-zA-Z ,.'\-\s]+$/),this.customValidators.firstCharValidatorRF]],
      startDate  : [this.startDate, Validators.required],
      endDate    : [this.endDate],
      isOptionalHoliday : [this.isOptionalHoliday],
      encId : [this.encId],
      createdBy : [this.userProfile.userId],
      sessionValue:[this.userProfile], 
      profileId: [this.userProfile.profileId],  
    });
    if (this.userProfile.block != "") {
      //this.getSchoolList();
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

  onSubmit(){
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
      this.alertHelper.updateAlert().then((result: any) => {
        let tempSDate = this.holidayForm.get("startDate")?.value;
        let tempEDate = this.holidayForm.get("endDate")?.value;
        if (result.value) {
          this.holidayForm.patchValue({ startDate: formatDate(this.holidayForm.get("startDate")?.value,"yyyy-MM-dd","en_US") });
          if(this.holidayForm.get("endDate")?.value != ''){
            this.holidayForm.patchValue({ endDate: formatDate(this.holidayForm.get("endDate")?.value,"yyyy-MM-dd","en_US") });
          }
          let formRawData = this.holidayForm.getRawValue();
          this.holidayForm.patchValue({ startDate: tempSDate });
          if(this.holidayForm.get("endDate")?.value != ''){
            this.holidayForm.patchValue({ startDate: tempEDate });
          }
          this.spinner.show(); // ==== show spinner
          this.holidayService
            .updateHoliday(formRawData)
            .subscribe({
              next: (res: any) => {
                this.spinner.hide(); //==== hide spinner
                this.alertHelper
                  .successAlert(
                    "Saved!",
                    "Holiday details updated successfully",
                    "success"
                  )
                  .then(() => {
                    //this.initializeForm();
                    this.route.navigate(["../../viewHoliday"], {
                      relativeTo: this.router,
                    });
                  });
              },
              error: (error: any) => {
                this.spinner.hide(); //==== hide spinner
                let errorMessage: string = "";
                if (typeof error.error.msg === "string") {
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
    }else{
      for(const control of Object.keys(this.holidayForm.controls)) {
        this.holidayForm.controls[control].markAsTouched();
      }
    }

  }

  
  getDistrict(){
    this.distLoading = true;
    this.disrtictChanged = true;
    this.commonService.getAllDistrict().subscribe((res:[])=>{
      this.posts = res;
      this.districtData = this.posts.data;   
      if (this.userProfile.district > 0) {
        this.districtData = this.districtData.filter((dis: any) => {
          return dis.districtId == this.userProfile.district;
        });
        this.holidayForm.controls["districtId"].patchValue(this.userProfile.district);
      }else{
        this.disrtictChanged = false;
      }
      this.distLoading = false;
     });
  }

  getBlock(districtId: any) {  
    this.blockChanged = true;
    this.blockLoading = true;
    this.districtId = districtId;
    this.blockData = [];  
    this.schoolData = [];   

    // this.holidayForm.patchValue({ schlCatId: "" });
    // this.holidayForm.patchValue({ endDate: "" });
    // this.holidayForm.patchValue({ isOptionalHoliday: "" });
    
    if(this.userProfile.block>0){ 
      this.blockId = this.userProfile.block;  
    }

    if(districtId>0){              
      this.commonService.getBlockByDistrictid(districtId).subscribe((res) => {     
        this.blockData = res;
        this.blockData = this.blockData.data; 
        if(this.userProfile.block>0){            
          this.blockId = this.userProfile.block;  
          this.blockData = this.blockData.filter((blo: any) => {
            return blo.blockId == this.userProfile.block;
          });
          this.holidayForm.controls['blockId']?.patchValue(this.userProfile.block);
        }else{          
          this.blockChanged = false;
        } 
        this.blockLoading = false;
      });
    }else{
      this.blockChanged = false;
    }  
  }

  getSchoolCategory(){
    this.schoolCatagoryChanged = true;
    this.schoolCatData = []; 
    this.schoolData = [];  
    this.schoolService.getSchoolCategory().subscribe((res)=>{
      this.posts = res;
      let data: any = res;
      for (let key of Object.keys(data['data'])) {
        this.schoolCatData.push(data['data'][key]);
      } 
      this.schoolCatagoryChanged = false;
     });  
  }

  getSchoolList(){ 
    this.schoolChanged = true;
    this.schoolData = [];  
    this.districtId = (this.holidayForm.get('districtId')?.value > 0)? this.holidayForm.get('districtId')?.value : this.districtId;
    this.blockId = (this.holidayForm.get('blockId')?.value > 0)? this.holidayForm.get('blockId')?.value : this.blockId;
    this.schlCatId = (this.holidayForm.get('schlCatId')?.value > 0)? this.holidayForm.get('schlCatId')?.value : this.schlCatId;
    let paramList : any = { districtId:this.districtId ,blockId:this.blockId , schoolCategoryId : this.schlCatId};
      this.schoolService.getSchoolList(paramList).subscribe((res)=>{
        this.posts = res;
        let data: any = res;
        for(let key of Object.keys(data['data'])) {
          this.schoolData.push(data['data'][key]);
        } 
        this.schoolChanged = false;
      });  
    }
}
