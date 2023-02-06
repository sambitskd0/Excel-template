import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-home-education-modal',
  templateUrl: './home-education-modal.component.html',
  styleUrls: ['./home-education-modal.component.css']
})
export class HomeEducationModalComponent implements OnInit {

  @Input() surveyData: any = "";
  constructor() {}

  ngOnInit(): void {
    console.log(this.surveyData);
  }

  // detect change in survey data
  ngOnChanges(changes: SimpleChanges): void { 
    if (changes["surveyData"]?.firstChange === false) { 
      this.surveyData = changes["surveyData"]?.currentValue;
      console.log(this.surveyData, "this.surveyData");
    }
  }

}
