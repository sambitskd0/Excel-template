import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { DatepickerDateCustomClasses } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { PrivilegeHelper } from 'src/app/core/helpers/privilege-helper';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';
import { Constant } from 'src/app/shared/constants/constant';
import { HolidayService } from '../services/holiday.service';


@Component({
  selector: 'app-holiday-calender',
  templateUrl: './holiday-calender.component.html',
  styleUrls: ['./holiday-calender.component.css']
})
export class HolidayCalenderComponent implements OnInit {

  bsInlineValue = new Date();
  bsInlineRangeValue: Date[];
  maxDate = new Date();
  dates: any= [];

  dateCustomClasses!: DatepickerDateCustomClasses[];

  userProfile:any=[];
  holidayData:any = [];

  days!: any[];

  from = dayjs().startOf('year');
  to = dayjs().endOf('year');
  plPrivilege:string="view"; //For menu privilege
  config = new Constant();


  constructor(
    private spinner : NgxSpinnerService,
    private holidayService : HolidayService,
    private commonService : CommonserviceService,
    private privilegeHelper: PrivilegeHelper,   //For menu privilege
    private router:Router,
  ) { 
    const pageUrl:any = this.router.url;  
    this.plPrivilege = this.privilegeHelper.PrimaryLinkPrivilege(pageUrl);  //For menu privilege    
    this.commonService.verifyLinkPermission(pageUrl, this.config.linkType[2], this.config.privilege[1]);  // For authorization
    
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsInlineRangeValue = [this.bsInlineValue, this.maxDate];

    const startOfYear = dayjs().startOf('year').add(12, 'month');
    function rnd() {
        return startOfYear.add(Math.floor(Math.random() * 365), 'day');
    }
    const colors = ['public', 'optional'];
  
    }

    ngOnInit(): void {    
      this.userProfile = this.commonService.getUserProfile();
      this.loadHolidayData(new Date().getFullYear());
    }

  onForward(): void {
      this.from = this.from.add(12, 'month');
      this.to = this.to.add(12, 'month');
      this.loadHolidayData(this.from.format('YYYY'));
  }

  onBack(): void {
      this.from = this.from.add(-12, 'month');
      this.to = this.to.add(-12, 'month');
      this.loadHolidayData(this.from.format('YYYY'));
  }

  

  loadHolidayData(year:any){
    this.spinner.show();
    const dates = [];
    this.days = [];
    let paramList = {year:year,sessionValue:this.userProfile};
    this.holidayService.holidayCalender(paramList).subscribe((res: any) => {
      this.spinner.hide();      
      this.holidayData = res.data; 
      this.holidayData.publicHoliday.forEach((val: any,key: any)=> {
        this.dates.push({date: dayjs(val.date), class: 'public' });
      });
      this.holidayData.optionalHoliday.forEach((val: any,key: any)=> {
        this.dates.push({date: dayjs(val.date), class: 'optional' });
      });
      this.days = this.dates;
    });
  }

  loadHolidayData_old(year:any){
    this.spinner.show();
    let paramList = {year:year,sessionValue:this.userProfile};
    this.holidayService.holidayCalender(paramList).subscribe((res: any) => {
      this.spinner.hide();      
      this.holidayData = res.data;      
      let dt = {};
      this.holidayData.publicHoliday.forEach((val: any,key: any)=> {
        dt = { date: new Date(val.date), classes: ['public'], tooltipText: val.holiday };
        this.dates.push(dt);
      });
      this.holidayData.optionalHoliday.forEach((val: any,key: any)=> {
        this.dates.push({ date: new Date(val.date), classes: ['optional'], tooltipText: val.holiday });
      });
      this.dateCustomClasses = this.dates;
    });
  }

}
