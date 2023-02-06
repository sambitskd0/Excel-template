import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { SchoolDashboardMisService } from '../../../services/school-dashboard-mis.service';
@Component({
  selector: 'app-school-category-wise-details',
  templateUrl: './school-category-wise-details.component.html',
  styleUrls: ['./school-category-wise-details.component.css']
})
export class SchoolCategoryWiseDetailsComponent implements OnInit {
  public options: any ;
  category:string[] =[];
  categoryCount:any =[];
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

  constructor( private schoolDashboardMisService :SchoolDashboardMisService,) { }

  ngOnInit(): void {
    this.getSchoolCategoryData();
  }
  getSchoolCategoryData(){
    this.schoolDashboardMisService.getSchoolCategoryData(this.details).subscribe((res:any)=>{    
      res.schoolCategoryWiseType.forEach((val:any) => { 
       this.category.push(val.categoryName);
       this.categoryCount.push(val.noOfSchool);
     });
     this.loadSchoolCategoryChart();      
     }) ;
  }
  loadSchoolCategoryChart(){
    this.options =  {
      chart: {
        type: 'bar'
      },
      title: {
        text: ''
      },
      colors: ['#06b3b1'],
      subtitle: {
        text: ''
      },
      xAxis: {
        categories: this.category,
        title: {
          text: null
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: '',
          align: 'high'
        },
        labels: {
          overflow: 'justify'
        }
      },
      tooltip: {
        valueSuffix: ' '
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      },
      legend: {
        enabled: false,
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        shadow: true
      },
      credits: {
        enabled: false
      },
      series: [{
        name: '',
        data: this.categoryCount
      }]
      
    }
    Highcharts.chart('schoolcategorywisedetails', this.options);
  }
}
