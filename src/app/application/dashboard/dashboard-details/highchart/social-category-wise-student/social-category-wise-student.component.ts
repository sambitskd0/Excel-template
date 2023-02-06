import { Component, OnInit, Input, SimpleChanges } from "@angular/core";
import * as Highcharts from "highcharts";
import exporting from "highcharts/modules/variable-pie.js";
exporting(Highcharts);
@Component({
  selector: "app-social-category-wise-student",
  templateUrl: "./social-category-wise-student.component.html",
  styleUrls: ["./social-category-wise-student.component.css"],
})
export class SocialCategoryWiseStudentComponent implements OnInit {
  @Input() studentSocialCatData!: any;
  public options!: any;
  optionData: any = [];
  colorTypes: any = [];
  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    // ======= prefill existing data
    if (
      changes["studentSocialCatData"]?.firstChange === false &&
      Object.keys(changes["studentSocialCatData"]?.currentValue).length
    ) {
      this.studentSocialCatData = changes["studentSocialCatData"]?.currentValue;
      for (const iterator in this.studentSocialCatData) {
        if (iterator === "totalCount") continue;
        this.colorTypes;
        this.optionData.push({
          name: iterator,
          y: this.studentSocialCatData[iterator],
          z:
            (this.studentSocialCatData[iterator] /
              this.studentSocialCatData.totalCount) *
            100,
        });
      }
      this.setupOptions();
    }
  }
  setupOptions() {
    this.options = {
      chart: {
        type: "variablepie",
        spacingTop: 0,
        spacingLeft: 0,
        spacingRight: 0,
        spacingBottom: 2,
      },
      colors: [
        "#4099ff",
        "#ff6f6f",
        "#42dcbd",
        "#c85cc1",
        "#ffc20e",
        "#32a852",
      ],

      title: {
        text: "",
      },
      tooltip: {
        headerFormat: "",
        // pointFormat:
        //   "<b> {point.name}</b><br/>" +
        //   "<b>({point.percentage:.1f} %) </b><br/>",
        // pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
        // '<b>{point.y} ({point.percentage:.1f} %) {point.name} out of Total Students</b><br/>',
        pointFormat:
          '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
          "<b>{point.y}</b><br/>",
        positioner: function () {
          return { x: 300, y: 10 };
        },
      },
      plotOptions: {
        variablepie: {
          borderColor: "#ffffff2b",
          allowPointSelect: false,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            connectorWidth: 1,
            format: "{point.y}",
          },
          showInLegend: true,
        },
      },
      legend: {
        layout: "horizontal",
        align: "center",
        horizontalAlign: "middle",
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: "Social Category Wise Students",
          minPointSize: 20,
          innerSize: "20%",
          zMin: 0,
          data: this.optionData,
        },
      ],
    };
    Highcharts.chart("socialcategorystudent", this.options);
    Highcharts.setOptions({
      lang: {
        thousandsSep: ",",
      },
    });
  }
}
