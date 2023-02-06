import { Component, OnInit } from "@angular/core";
import * as CryptoJS from "crypto-js";
import { CommonserviceService } from "src/app/core/services/commonservice.service";

@Component({
  selector: "app-divya-mis",
  templateUrl: "./divya-mis.component.html",
  styleUrls: ["./divya-mis.component.css"],
})
export class DivyaMisComponent implements OnInit {
  public userProfile = JSON.parse(sessionStorage.getItem("userProfile") || '{}');

  public rtSchoolSurveyId: any;
  public rtKgbvId: any;
  public rtResourceCenterId: any;
  public rtArtificialLimbId: any;
  public rtSurveyWorkId: any;
  public rtCampId: any;
  public rtTrainingId: any;
  public rtHomeBasedId: any;
  public rtAnyOtherId: any;

  public officerSchoolSurveyId: any;
  public officerKgbvId: any;
  public officerResourceCenterId: any;
  public officerArtificialLimbId: any;
  public officerTrainingId: any;
  public officerHomeBasedId: any;

  constructor(public commonServices: CommonserviceService) {}

  ngOnInit(): void {
    this.rtSchoolSurveyId = this.commonServices.encryptObject([
      {
        activityType: 1,
        activitySubType: "",
        reportType: 1,
        reportName: "School Visit Report",
      },
    ]);
    this.rtKgbvId = this.commonServices.encryptObject([
      {
        activityType: 2,
        activitySubType: "",
        reportType: 1,
        reportName: "Kasturba Gandhi Balika Vidyalay (KGBV) Visit Report",
      },
    ]);
    this.rtResourceCenterId = this.commonServices.encryptObject([
      {
        activityType: 3,
        activitySubType: "",
        reportType: 1,
        reportName: "Resource Center / Day Care Center Visit Report",
      },
    ]);
    this.rtArtificialLimbId = this.commonServices.encryptObject([
      {
        activityType: 4,
        activitySubType: "",
        reportType: 1,
        reportName: "Artificial Limb Center Visit Report",
      },
    ]);
    this.rtSurveyWorkId = this.commonServices.encryptObject([
      {
        activityType: 7,
        activitySubType: 8,
        reportType: 1,
        reportName: "Survey Work Visit Report (Official Works)",
      },
    ]);
    this.rtCampId = this.commonServices.encryptObject([
      {
        activityType: 7,
        activitySubType: 9,
        reportType: 1,
        reportName: "Camp Visit Report (Official Works)",
      },
    ]);
    this.rtTrainingId = this.commonServices.encryptObject([
      {
        activityType: 7,
        activitySubType: 10,
        reportType: 1,
        reportName: "Training Visit Report (Official Works)",
      },
    ]);
    this.rtHomeBasedId = this.commonServices.encryptObject([
      {
        activityType: 7,
        activitySubType: 11,
        reportType: 1,
        reportName: "Home Based Education Visit Report (Official Works)",
      },
    ]);
    this.rtAnyOtherId = this.commonServices.encryptObject([
      {
        activityType: 7,
        activitySubType: 12,
        reportType: 1,
        reportName: "Any Other Visit Report (Official Works)",
      },
    ]);

    this.officerSchoolSurveyId = this.commonServices.encryptObject([
      {
        activityType: 1,
        activitySubType: "",
        reportType: 2,
        reportName: "School Inspection Report",
      },
    ]);
    this.officerKgbvId = this.commonServices.encryptObject([
      {
        activityType: 2,
        activitySubType: "",
        reportType: 2,
        reportName: "Kasturba Gandhi Balika Vidyalay (KGBV) Inspection Report",
      },
    ]);
    this.officerResourceCenterId = this.commonServices.encryptObject([
      {
        activityType: 3,
        activitySubType: "",
        reportType: 2,
        reportName: "Resource Center / Day Care Center Inspection Report",
      },
    ]);
    this.officerArtificialLimbId = this.commonServices.encryptObject([
      {
        activityType: 4,
        activitySubType: "",
        reportType: 2,
        reportName: "Artificial Limb Center Inspection Report",
      },
    ]);
    this.officerTrainingId = this.commonServices.encryptObject([
      {
        activityType: 5,
        activitySubType: "",
        reportType: 2,
        reportName: "Training Inspection Report",
      },
    ]);
    this.officerHomeBasedId = this.commonServices.encryptObject([
      {
        activityType: 6,
        activitySubType: "",
        reportType: 2,
        reportName: "Home Based Education Inspection Report",
      },
    ]);
  }
}
