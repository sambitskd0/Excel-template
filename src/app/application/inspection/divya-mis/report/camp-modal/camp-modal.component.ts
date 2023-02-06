import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-camp-modal',
  templateUrl: './camp-modal.component.html',
  styleUrls: ['./camp-modal.component.css']
})
export class CampModalComponent implements OnInit {
  @Input() surveyData: any = "";
  constructor() { }

  ngOnInit(): void {
    console.log("school survey:::",this.surveyData);
  }

  // detect change in survey data
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);

    if (changes["surveyData"]?.firstChange === false) {
      this.surveyData = changes["surveyData"]?.currentValue;
      console.log(this.surveyData?.inspectionId);      
    }
  }

}
