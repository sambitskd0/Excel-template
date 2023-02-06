import { formatDate } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertHelper } from 'src/app/core/helpers/alert-helper';
import { CommonFunctionHelper } from 'src/app/core/helpers/common-function-helper';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { CustomValidators } from 'src/app/shared/validations/custom-validators';
import { UpdateStockService } from '../../services/update-stock.service';

@Component({
  selector: 'app-update-stock',
  templateUrl: './update-stock.component.html',
  styleUrls: ['./update-stock.component.css']
})
export class UpdateStockComponent implements OnInit,AfterViewInit {

  updateStockForm !: FormGroup;

  riceStock: any            = "";
  otherFoodItemprice: any   = "";
  updateStockDate: any      = "";
  userId: any               = "";
  schoolId: any             = "";

  permissionDiv: boolean = false;
  maxDate: any = Date;

  allErrorMessages: string[]  = [];
  allLabel: string[]          = ["","","","","Date","Rice stock(in Kg)","Other food item (in rupees)"];
  
  config = new Constant();
  academicYear: any = this.config.getAcademicCurrentYear();
  clusterId: any = "";
  schoolDetailsData: any  = [];
  updateStockData: any    = [];
  openingStockData: any   = [];

  schoolName:any    = "";
  schoolUdise:any   = "";
  clusterName:any   = "";
  clusterCode:any   = "";
  blockName:any     = "";
  blockCode:any     = "";
  districtName:any  = "";
  districtCode:any  = "";

  openingStockDate:any            = Date;
  fetchedStockAvail: any          = "";
  fetchedFoodItemPriceAvail: any  = "";
  stockAvl:boolean=false;
  profileId: any = "";
  
  constructor(
    private formBuilder: FormBuilder,
    private alertHelper: AlertHelper,
    public customValidators: CustomValidators,
    private spinner: NgxSpinnerService,
    private privilegeHelper: PrivilegeHelper, //For menu privilege
    public commonService: CommonserviceService,
    public updateStockService: UpdateStockService,   
    private el: ElementRef,
    private commonFunctionHelper: CommonFunctionHelper, 
  ) { 
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    const users = this.commonService.getUserProfile();
    this.userId = users?.userId;
   this.schoolId = users?.school;
   this.clusterId = users?.cluster;
   this.profileId = users?.profileId;    
    
    if (users.loginUserTypeId != 3) {
      this.permissionDiv = true;
      this.getSchoolDetails(this.schoolId,this.clusterId);
      this.getUpdateStockDetails(this.schoolId,this.academicYear);
      this.getOpeningStockDetails(this.schoolId,this.academicYear);
    } else {
      this.permissionDiv = false;
    }
   
   this.initializeForm();
  }
  ngAfterViewInit(){
    //this.el.nativeElement.querySelector("[formControlName=updateStockDate]").focus();
  }
  getUpdateStockDetails(schoolId:any,academicYear:any){
    this.updateStockService.getUpdateStockDetails(schoolId,academicYear).subscribe((result:any)=>{
      this.updateStockData = result?.data[0];
      // this.fetchedStockAvail = this.updateStockData?.presentStock;
      if(this.updateStockData?.presentStock){
        this.fetchedStockAvail = (Math.round(this.updateStockData?.presentStock * 100) / 100).toFixed(2);
      }else{
        this.fetchedStockAvail = (this.updateStockData?.riceStock).toFixed(2);
      }
      
      this.fetchedFoodItemPriceAvail = this.updateStockData?.foodItemPrice;
    });
  }
  getOpeningStockDetails(schoolId:any,academicYear:any){
    this.updateStockService.getOpeningStockDetails(schoolId,academicYear).subscribe((result:any)=>{
     
      if(result?.data.length > 0){
        this.stockAvl = true;
        this.openingStockData = result?.data[0];
        const newDate = new Date(); 
        this.openingStockDate=new Date(this.openingStockData?.createdOn);
        this.initializeForm();
      }else{
        this.stockAvl = false;
      }
      
      // this.riceStock=  this.openingStockData?.riceStock;
      // this.otherFoodItemprice=  this.openingStockData?.foodItemPrice;
      // this.initializeForm();
    });
  }

  // dateValidation(){ 
  //   let receiveDate = this.addGrantReceiveForm.controls['receiveDate'].value; 
  //   const newDate = new Date();     
  //   if (formatDate(receiveDate,'yyyy-MM-dd','en_US') > formatDate(newDate,'yyyy-MM-dd','en_US')){
  //     this.alertHelper.viewAlert(
  //       "error",
  //       "Invalid",
  //       "Date must not be above today's date"
  //     );
  //     this.addGrantReceiveForm.patchValue({
  //       receiveDate: ''
  //   });
  //   }
  // }

  getSchoolDetails(schoolId:any,clusterId:any){
    this.updateStockService.getSchoolDetails(schoolId,clusterId).subscribe((result:any)=>{
      this.schoolDetailsData = result?.data[0];
      this.districtName   = this.schoolDetailsData.districtName;   
      this.districtCode   = this.schoolDetailsData.districtCode;   
      this.blockName      = this.schoolDetailsData.blockName;   
      this.blockCode      = this.schoolDetailsData.blockCode;   
      this.clusterName    = this.schoolDetailsData.clusterName;   
      this.clusterCode    = this.schoolDetailsData.clusterCode; 
      this.schoolName     = this.schoolDetailsData.schoolName;   
      this.schoolUdise    = this.schoolDetailsData.schoolUdiseCode;   
    });
  }
  initializeForm(){
    this.updateStockForm = this.formBuilder.group({
      userId:[this.userId],
      profileId:[this.profileId],
      schoolId:[this.schoolId],
      academicYear:[this.academicYear],
      updateStockDate:[this.updateStockDate,Validators.required],
      riceStock: [
        this.riceStock,[Validators.required,Validators.pattern('^[0-9.-]*$'), Validators.maxLength(7),this.customValidators.firstCharValidatorRF],
      ],
      otherFoodItemprice: [
        this.otherFoodItemprice,[Validators.pattern('^[0-9.]*$'), Validators.maxLength(7),Validators.min(1),this.customValidators.firstCharValidatorRF,],
      ],
    });
  }
  onSubmit(){
      // if ("INVALID" === this.updateStockForm.status) {
      //   for (const key of Object.keys(this.updateStockForm.controls)) {
      //     if (this.updateStockForm.controls[key].status === "INVALID") {
      //       const invalidControl = this.el.nativeElement.querySelector(
      //         '[formControlName="' + key + '"]'
      //       );
      //       invalidControl.focus();
      //       this.customValidators.formValidationHandler(this.updateStockForm,this.allLabel);
      //       break;
      //     }
      //   }
      // }
      if (this.updateStockForm.invalid) {
        // this.customValidators.formValidationHandler(this.updateStockForm,this.allLabel, this.el);
        this.customValidators.formValidationHandler(
          this.updateStockForm,
          this.allLabel,
          this.el,
          {
            required: {
              updateStockDate: `Please select the stock entry date`,
              riceStock: "Please enter rice stock in kg",
            },
          }
        );
      }
      if (this.updateStockForm.invalid) {
        return;
      }
    
    this.alertHelper.submitAlert().then((result) => {
      if (result.value) {
        this.spinner.show(); // ==== show spinner
        // console.log(this.updateStockForm.get("updateStockDate")?.value);
        
        let updateStockDateStr =  this.commonFunctionHelper.formatDateHelper(this.updateStockForm.get("updateStockDate")?.value);
        this.updateStockForm.patchValue({
          updateStockDate: updateStockDateStr,
        });
        this.updateStockService
          .updateStock(this.updateStockForm.value)
          .subscribe({
            next: (res: any) => {
              this.spinner.hide(); //==== hide spinner
              this.alertHelper
                .successAlert(
                  "Saved!",
                  "Stock details updated successfully. ",
                  "success"
                )
                .then(() => {
                  this.initializeForm();
                  this.getOpeningStockDetails(this.schoolId,this.academicYear);
                  this.getUpdateStockDetails(this.schoolId,this.academicYear);
                });
            },
            error: (error: any) => {
              this.spinner.hide(); //==== hide spinner
            },
          });
      }
    });
  }

}
