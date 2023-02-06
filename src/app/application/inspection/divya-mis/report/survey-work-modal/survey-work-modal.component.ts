import { Component, Input, OnInit, SimpleChanges } from "@angular/core";

@Component({
  selector: "app-survey-work-modal",
  templateUrl: "./survey-work-modal.component.html",
  styleUrls: ["./survey-work-modal.component.css"],
})
export class SurveyWorkModalComponent implements OnInit {
  @Input() surveyData: any = "";
  constructor() {}

  ngOnInit(): void {}

  // detect change in survey data
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["surveyData"]?.firstChange === false) {
      this.surveyData = changes["surveyData"]?.currentValue;
    }
  }
}
