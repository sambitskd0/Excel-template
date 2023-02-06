import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-kgbv-modal',
  templateUrl: './kgbv-modal.component.html',
  styleUrls: ['./kgbv-modal.component.css']
})
export class KgbvModalComponent implements OnInit {

  @Input() surveyData: any = "";
  constructor() {}

  ngOnInit(): void {
    console.log(this.surveyData);
  }

  // detect change in survey data
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes["surveyData"]?.firstChange === false) {
      this.surveyData = changes["surveyData"]?.currentValue;
      console.log(this.surveyData,"this.surveyData");
    }
  }

}
