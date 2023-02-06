import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
@Component({
  selector: 'app-mdm-student-attendance',
  templateUrl: './mdm-student-attendance.component.html',
  styleUrls: ['./mdm-student-attendance.component.css']
})
export class MdmStudentAttendanceComponent implements OnInit {
  public options: any = {
    chart: {
      type: 'column',
      spacingLeft: -5,
    },
  
    title: {
      text: ''
    },

    colors: ['#f29877' ],
  
    xAxis: {
      categories: ['17 Jan','18 Jan','19 Jan','20 Jan','23 Jan','24 Jan']
    },
    legend: {
     
      layout: 'horizontal',
      align: 'center',
      horizontalAlign: 'middle',
     
    },
  
    yAxis: {
      //categories: ['0', '50k', '75 k', '1 lac', '125 lac','15 lac'],
      allowDecimals: false,
      // min: 0,
      // max: 225,
      title: {
        // text: 'In Lakhs'
      }
    },
    credits: {
      enabled: false
    },
  
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true
        }
      }
    },
  
    series: [
     
      {
        name: 'Total Students ate MDM',
        data: [912, 731, 424, 325, 936, 827]
      
      }
    , ]
    
  }
  constructor() { }

  ngOnInit(): void {
    Highcharts.chart('mdmattendance', this.options);
  }

}
