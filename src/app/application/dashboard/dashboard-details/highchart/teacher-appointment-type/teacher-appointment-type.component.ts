import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { TeacherDashboardMisService } from '../../../services/teacher-dashboard-mis.service';
@Component({
  selector: 'app-teacher-appointment-type',
  templateUrl: './teacher-appointment-type.component.html',
  styleUrls: ['./teacher-appointment-type.component.css']
})
export class TeacherAppointmentTypeComponent implements OnInit {
  categoryAppointment: string[] = [];
  categoryCountAppointment: any = [];
  options: any;
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

  constructor(
    private teacherDashboardMisService: TeacherDashboardMisService
  ) { }

  ngOnInit(): void {
    
    this.loadGraphAppointmentTypeData();
  }
  loadGraphAppointmentTypeData() {
    this.teacherDashboardMisService.getGraphAppointmentType(this.details).subscribe((res: any) => {
      res.data.forEach((val: any) => {
        this.categoryAppointment.push(val.appointmentType);
        this.categoryCountAppointment.push(val.noOfTeacher);
      });
      this.loadAppointmentNatureChart();
    });
  }

  loadAppointmentNatureChart() {
    this.options =  {
      chart: {
        type: 'column',
        spacingLeft: 0,
      },
      title: {
        text: ''
      },
      //colors: ['#e4f1ff'],
     
      legend: {
        enabled: false,
        layout: 'horizontal',
        align: 'right',
        verticalAlign: 'top',
        x: 150,
        y: 100,
        floating: true,
        borderWidth: 1,
        // backgroundColor:
        //   Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF'
      },
      xAxis: {
        categories: this.categoryAppointment,
        plotBands: [{ // visualize the weekend
          from: 4.5,
          to: 6.5,
          color: '#ffff'
        }]
      },
      yAxis: {
      //categories: ['0', '1 lac', '2 lac', '3 lac', '4 lac','5 lac'],
      // min: 0,
      // max: 100,  
      title: {
          text: ''
        },
       //tickInterval: 1,
      },
      tooltip: {
        shared: true,
        valueSuffix: ''
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        areaspline: {
          fillOpacity: 0.3,
          lineColor: '#3f98ff',
          color: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
                [0, '#a7d0ff'],
                [1, '#fff']
            ],
        },
        },
        column: {
          dataLabels: {
            enabled: true
          }
        },
        series: {
          color: '#3f98ff',
          lineWidth: 3
        }
      },
        
     
      series: [{
        name: "",
        data: this.categoryCountAppointment
      }]
      
    }
    Highcharts.chart('teacherappointmenttype', this.options);
  }


}
