import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
@Component({
  selector: 'app-mdm-served',
  templateUrl: './mdm-served.component.html',
  styleUrls: ['./mdm-served.component.css']
})
export class MdmServedComponent implements OnInit {

  public options: any = {
    chart: {
      type: 'column',
      spacingLeft: -5,
    },
   
    title: {
      text: ''
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May',  'Jun' , 'Jul' , 'Aug' , 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: [{
      // min: 0,
      title: {
        text: 'In Days'
      }
    }, {
      title: {
        text: ''
      },
      opposite: true
    }],
    legend: {
      shadow: false
    },
    tooltip: {
      shared: true,
      backgroundColor: '#ddd',
      borderColor: '#00a96a'
    },
    plotOptions: {
      series: {
        dataLabels: {
            enabled: true,
            inside: false,
            verticalAlign:'top',
            y:0
            // format: '{point.y:.1f}'
        }
    },
      column: {
        grouping: false,
        shadow: false,
        borderWidth: 0
       
      }
    },
    credits: {
      enabled: false
    },
    series: [{
      name: 'Total No. of Days in the Month',
      color: '#e5f6f0',
      data: [25, 23, 25, 25, 15, 20, 25, 25, 25, 20, 25, 20],
      pointPadding: 0,
      pointPlacement: -0.2
      
    }, {
      name: 'MDM Served in Days',
      color: '#00a96a',
      data: [23, 20, 22, 22, 13, 17, 23, 23, 23, 18, 23, 17],
      pointPadding: 0,
      pointPlacement: -0.2
      
    }]
    
  }
  constructor() { }

  ngOnInit(): void {
    Highcharts.chart('mdmserved', this.options);
  }


}
