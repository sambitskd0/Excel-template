import { Component, OnInit } from '@angular/core';

import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-teacher-mdm',
  templateUrl: './teacher-mdm.component.html',
  styleUrls: ['./teacher-mdm.component.css']
})
export class TeacherMdmComponent implements OnInit {

  public options: any = {
    chart: {
      type: 'column',
      spacingLeft: -5,
    },
  
    title: {
      text: ''
    },

    colors: ['#06b3b1' ],
  
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
      // max: 75,
      title: {
        text: 'In Lakhs'
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
        name: 'Total Teacher Present',
        data: [4.32, 5.25, 4.22, 4.74, 5.36, 5.27]
      
      }
    , ]
    
  }
  constructor() { }

  ngOnInit(): void {
    Highcharts.chart('teacherattendancelastsevendays', this.options);
  }

}



