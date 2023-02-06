import { Component, OnInit } from "@angular/core";
import * as Highcharts from "highcharts";
import { SchoolDashboardMisService } from "../../../services/school-dashboard-mis.service";
import { StudentDashboardService } from "../../../services/student-dashboard.service";

@Component({
  selector: "app-genderwise-details",
  templateUrl: "./genderwise-details.component.html",
  styleUrls: ["./genderwise-details.component.css"],
})
export class GenderwiseDetailsComponent implements OnInit {
  public options: any;
  maleStudent: any = 0;
  femaleStudent: any = 0;
  transgenderStudent: any = 0;
  totalStudent: any = 0;
  malestudPer: any = 0;
  femalestudPer: any = 0;
  transstudPer: any = 0;
  categoryCount: any = [];
  public userdetails = JSON.parse(
    sessionStorage.getItem("userProfile") || "{}"
  );
  loginUserType = this.userdetails.loginUserTypeId;
  userDesignation = this.userdetails.designationId;
  userDistrictId = this.userdetails.district;
  userBlockId = this.userdetails.block;
  userClusterId = this.userdetails.cluster;
  userSchoolId = this.userdetails.school;
  details: any = {
    loginUserType: this.loginUserType,
    userDesignation: this.userDesignation,
    userDistrictId: this.userDistrictId,
    userBlockId: this.userBlockId,
    userClusterId: this.userClusterId,
    userSchoolId: this.userSchoolId,
  };
  constructor(private studentDashboardService: StudentDashboardService) {}
  ngOnInit(): void {
    this.genderWiseStudData();
  }
  genderWiseStudData() {
    this.studentDashboardService
      .genderWiseStudData(this.details)
      .subscribe((res: any) => {
        this.femaleStudent = res?.studentGenderWiseType?.[0]?.Female;
        this.maleStudent = res?.studentGenderWiseType?.[0]?.Male;
        this.transgenderStudent = res?.studentGenderWiseType?.[0]?.Transgender;
        this.totalStudent =
          this.maleStudent + this.femaleStudent + this.transgenderStudent;
        this.malestudPer = Math.round(
          (this.maleStudent / this.totalStudent) * 100
        );
        this.femalestudPer = Math.round(
          (this.femaleStudent / this.totalStudent) * 100
        );
        this.transstudPer = Math.round(
          (this.transgenderStudent / this.totalStudent) * 100
        );
        // console.log(this.maleStudent,"malecount",this.femaleStudent,"femalecount",this.transgenderStudent,"trnscount",this.totalStudent,"totcount",this.malestudPer,"male%",this.femalestudPer,"female%",this.transstudPer,"trans%",);
        this.loadGenderStudChart();
      });
  }
  loadGenderStudChart() {
    this.options = {
      chart: {
        type: "pie",
      },
      title: {
        text: "",
      },
      colors: ["#668df6", "#e175d2", "#ffc900"],
      subtitle: {
        text: "",
      },
      credits: {
        enabled: false,
      },
      accessibility: {
        announceNewData: {
          enabled: true,
        },
        point: {
          valueSuffix: "%",
        },
      },

      plotOptions: {
        pie: {
          borderColor: "#ffffff2b",
        },

        series: {
          dataLabels: {
            enabled: false,
            format: "{point.name}: {point.y:.1f}%",
          },
        },
      },

      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat:
          '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>',
      },

      series: [
        {
          name: "Gender Wise Students",
          colorByPoint: true,
          data: [
            {
              name: "Male",
              y: this.maleStudent,
            },
            {
              name: "Female",
              y: this.femaleStudent,
            },

            {
              name: "Transgender",
              y: this.transgenderStudent,
            },
          ],
        },
      ],
    };
    Highcharts.chart("genderwisedetails", this.options);
  }
}
