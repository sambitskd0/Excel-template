import { Component, OnInit, Input, SimpleChanges } from "@angular/core";
import * as Highcharts from "highcharts";
@Component({
  selector: "app-classwise-details",
  templateUrl: "./classwise-details.component.html",
  styleUrls: ["./classwise-details.component.css"],
})
export class ClasswiseDetailsComponent implements OnInit {
  @Input() studentClasswiseCountData!: any;
  public options!: any;

  constructor() {}
  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    // ======= prefill existing data
    if (
      changes["studentClasswiseCountData"]?.firstChange === false &&
      Object.keys(changes["studentClasswiseCountData"]?.currentValue).length
    ) {
      this.studentClasswiseCountData =
        changes["studentClasswiseCountData"]?.currentValue;
      this.setupOptions();
    }
  }
  setupOptions() {
    this.options = {
      chart: {
        type: "column",
        spacingLeft: 0,
        spacingBottom: -5
      },

      title: {
        text: "",
      },

      colors: ["#4e5dde"],

      xAxis: {
        categories: [
          "Class 1 ",
          "Class 2",
          "Class 3",
          "Class 4",
          "Class 5",
          "Class 6",
          "Class 7",
          "Class 8",
          "Class 9",
          "Class 10",
          "Class 11",
          "Class 12",
        ],
      },
      legend: {
     
        layout: 'horizontal',
        align: 'center',
        horizontalAlign: 'middle',
       
      },

      yAxis: {
        //categories: ['0', '1 lac', '2 lac', '3 lac', '4 lac','5 lac'],
        //allowDecimals: false,
        // min: 0,
        // max: 250000,
        title: {
          text: "",
        },
        //tickInterval: 1,
      },
      credits: {
        enabled: false,
      },

      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
            crop:false,
            overflow:'none'
          },
        },
      },

      series: [
        {
          name: "Students",
          data: [...this.studentClasswiseCountData]
          
      
        },
      ],
    };
    Highcharts.chart("classwisedetails", this.options);
  }
}
