import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
@Component({
  selector: 'app-student-mdm',
  templateUrl: './student-mdm.component.html',
  styleUrls: ['./student-mdm.component.css']
})
export class StudentMdmComponent implements OnInit {
  public options: any = {
    chart: {
      type: 'column',
      spacingLeft: -5,
    },
  
    title: {
      text: ''
    },

    colors: ['#584ede' ],
  
    xAxis: {
      categories: ['16 Jan', '17 Jan', '18 Jan','19 Jan','23 Jan','24 Jan']
    },
    legend: {
     
      layout: 'horizontal',
      align: 'center',
      horizontalAlign: 'middle',
     
    },
  
    yAxis: {
      //categories: ['0', '50k', '75 k', '1 lac', '125 lac','15 lac'],
      allowDecimals: false,
      //min: 0,
      //max: 275,
      title: {
        text: 'In Thousand'
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
        name: 'Total Students Present',
        data: [1200, 1500, 2300, 2000, 1265, 2567]
      
      }
    , ]
    
  }
  constructor() { }

  ngOnInit(): void {
    Highcharts.chart('mdmteacherattendance', this.options);
  }

}


