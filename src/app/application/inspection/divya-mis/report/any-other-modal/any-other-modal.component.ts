import { Component, Input, OnInit, SimpleChanges } from "@angular/core";

@Component({
  selector: "app-any-other-modal",
  templateUrl: "./any-other-modal.component.html",
  styleUrls: ["./any-other-modal.component.css"],
})
export class AnyOtherModalComponent implements OnInit {
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
