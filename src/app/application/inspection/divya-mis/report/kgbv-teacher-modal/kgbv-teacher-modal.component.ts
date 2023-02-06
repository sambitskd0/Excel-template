import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-kgbv-teacher-modal',
  templateUrl: './kgbv-teacher-modal.component.html',
  styleUrls: ['./kgbv-teacher-modal.component.css']
})
export class KgbvTeacherModalComponent implements OnInit {

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
