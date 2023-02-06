import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { SchoolDashboardMisService } from '../../../services/school-dashboard-mis.service';
@Component({
  selector: 'app-school-management-wise-details',
  templateUrl: './school-management-wise-details.component.html',
  styleUrls: ['./school-management-wise-details.component.css']
})
export class SchoolManagementWiseDetailsComponent implements OnInit {
  public options: any ;
  management:string[] =[];
  managementCount:any =[];
  schoolMgtWiseType:any =[];
  public userdetails = JSON.parse(
    sessionStorage.getItem("userProfile") || "{}"
  );
  loginUserType = this.userdetails.loginUserTypeId;
  userDesignation = this.userdetails.designationId;
  userDistrictId = this.userdetails.district;
  userBlockId = this.userdetails.block;
  userClusterId = this.userdetails.cluster;
  userSchoolId = this.userdetails.school;
  details: any = { loginUserType: this.loginUserType, userDesignation: this.userDesignation, userDistrictId: this.userDistrictId, userBlockId: this.userBlockId, userClusterId: this.userClusterId, userSchoolId: this.userSchoolId }
  maxCount:any="";
  
  constructor(private schoolDashboardMisService :SchoolDashboardMisService) { }

  ngOnInit(): void {
    this.getSchoolMgtData();
  }
  getSchoolMgtData(){
    this.schoolDashboardMisService.getSchoolMgtData(this.details).subscribe((res:any)=>{    
      this.schoolMgtWiseType=res.schoolMgtWiseType;
      let tot=0
      res.schoolMgtWiseType.forEach((val:any) => { 
       this.management.push(val.mgtType);
       this.managementCount.push(val.noOfSchool);
       tot += val.noOfSchool;
     });
    //  this.maxCount = Math.max(...this.managementCount);
     this.maxCount = tot;
    //  this.loadSchoolMgtChart();      
     }) ;
  }
  // loadSchoolMgtChart(){
  //   this.options= {
  //     chart: {
  //       type: 'column'
  //     },
  //     title: {
  //       text: ''
  //     },
  //     colors: ['#fdebd8'],
  //     legend: {
  //       enabled: false,
  //       layout: 'horizontal',
  //       align: 'right',
  //       verticalAlign: 'top',
  //       x: 150,
  //       y: 100,
  //       floating: true,
  //       borderWidth: 1,
  //     },
  //     xAxis: {
  //       categories: this.management,
  //       // plotBands: [{ // visualize the weekend
  //       //   from: 4.5,
  //       //   to: 6.5,
  //       //   color: 'rgba(68, 170, 213, .2)'
  //       // }]
  //     },
  //     yAxis: {
  //       //categories: ['0', '10 k', '20 k', '30 k', '40 k','50 k'],
  //       title: {
  //         text: ''
  //       },
  //       //tickInterval: 10,
  //     },
  //     tooltip: {
  //       shared: true,
  //       borderColor: '#ffa640'
  //     },
  //     credits: {
  //       enabled: false
  //     },
  //     plotOptions: {
  //       areaspline: {
  //         fillOpacity: 0.3,
  //         lineColor: '#ffa640',
          
  //         color: {
  //           linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
  //           stops: [
  //               [0, '#fed5a5'],
  //               [1, '#fff']
  //           ]
  //       },
  //       },
  //       series: {
  //         color: '#ffa640',
  //         lineWidth: 3
  //     }
  //     },
      
  //     series: [{
  //       name: '',
  //       data: this.managementCount
  //     }]
      
  //   }
  //   Highcharts.chart('schoolmanagementwisedetails', this.options);
  // }

}
