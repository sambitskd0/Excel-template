import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import { TeacherDashboardMisService } from '../../../services/teacher-dashboard-mis.service';
@Component({
  selector: 'app-teacher-nature-appointment',
  templateUrl: './teacher-nature-appointment.component.html',
  styleUrls: ['./teacher-nature-appointment.component.css'],
  
})
export class TeacherNatureAppointmentComponent implements OnInit {

  public options: any ;
  category:string[] =[];
  categoryCount:any =[];
  resultData:any[]=[];
  public userdetails = JSON.parse(
    sessionStorage.getItem("userProfile") || "{}"
  );
  loginUserType = this.userdetails.loginUserTypeId;
  userDesignation = this.userdetails.designationId;
  userDistrictId = this.userdetails.district;
  userBlockId = this.userdetails.block;
  userClusterId = this.userdetails.cluster;
  userSchoolId = this.userdetails.school;
  details:any = {loginUserType:this.loginUserType,userDesignation:this.userDesignation,userDistrictId:this.userDistrictId,userBlockId:this.userBlockId,userClusterId:this.userClusterId,userSchoolId:this.userSchoolId}
  // @Output() teacherNatureTypeData = new EventEmitter<any>();
 
  constructor(private teacherDashboardMisService :TeacherDashboardMisService) { }

  ngOnInit(): void {

    
  this.appointmentNatureTypeWise();
 
  }
  appointmentNatureTypeWise(){
    this.teacherDashboardMisService.appointmentNatureTypeWise(this.details).subscribe((res:any)=>{ 
      this.resultData = res.appointmentNatureType;
      // this.teacherNatureTypeData.emit(this.resultData);
     res.appointmentNatureType.forEach((val:any) => {       
      this.category.push(val.appointmentType);
      this.categoryCount.push(val.noOfTeacher);
    });
    this.loadAppointmentNatureChart();      
    }) ;
    
  }
  loadAppointmentNatureChart(){
    this.options = {
      chart: {
        type: 'pie'
      },
      title: {
        text: ''
      },
      colors: ['#668df6','#e175d2','#ffc900'],
      subtitle: {
        text: ''
      },
      credits: {
        enabled: false
      },
      accessibility: {
        announceNewData: {
          enabled: true
        },
        // point: {
        //   valueSuffix: '%'
        // }
      },
    
      plotOptions: {
        pie: {
          borderColor: '#ffffff2b',
        },
      
        series: {
          dataLabels: {
            enabled: false,
            format: '{point.name}: {point.y:.1f}'
          }
        }
      },
    
      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
      },
    
      series: [
        {
          name: "Nature of Appointment wise Teachers",
          colorByPoint: true,
          data: this.resultData
          // data: [
          //   {
          //     name: "Male",
          //     y: 52,
          //     //drilldown: "Male"
          //   },
          //   {
          //     name: "Female",
          //     y: 46,
          //     //drilldown: "Female"
          //   },
            
          //   {
          //     name: "Transgender",
          //     y: 2,
          //     //drilldown:"Transgender"
          //   }
          // ]
        }
      ]
    }
    
    


    // this.options =  {
    //   chart: {
    //     type: 'column',
    //     spacingLeft: 0,
    //   },
    //   title: {
    //     text: ''
    //   },
    //   //colors: ['#e4f1ff'],
     
    //   legend: {
    //     enabled: false,
    //     layout: 'horizontal',
    //     align: 'right',
    //     verticalAlign: 'top',
    //     x: 150,
    //     y: 100,
    //     floating: true,
    //     borderWidth: 1,
    //     // backgroundColor:
    //     //   Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF'
    //   },
    //   xAxis: {
    //     categories: this.category,
    //     plotBands: [{ // visualize the weekend
    //       from: 4.5,
    //       to: 6.5,
    //       color: 'rgba(68, 170, 213, .2)'
    //     }]
    //   },
    //   yAxis: {
    //   //categories: ['0', '1 lac', '2 lac', '3 lac', '4 lac','5 lac'],
    //   min: 0,
    //   max: 100,  
    //   title: {
    //       text: ''
    //     },
    //    //tickInterval: 1,
    //   },
    //   tooltip: {
    //     shared: true,
    //     valueSuffix: ''
    //   },
    //   credits: {
    //     enabled: false
    //   },
    //   plotOptions: {
    //     areaspline: {
    //       fillOpacity: 0.3,
    //       lineColor: '#3f98ff',
    //       color: {
    //         linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
    //         stops: [
    //             [0, '#a7d0ff'],
    //             [1, '#fff']
    //         ],
    //     },
    //     },
        
    //     series: {
    //       color: '#3f98ff',
    //       lineWidth: 3
    //     }
    //   },
        
     
    //   series: [{
    //     name: "",
    //     data: this.categoryCount
    //   }]
      
    // }
    Highcharts.chart('teachernatureappointment', this.options);
  }

}
