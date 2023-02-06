import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-school-survey-teacher-modal',
  templateUrl: './school-survey-teacher-modal.component.html',
  styleUrls: ['./school-survey-teacher-modal.component.css']
})
export class SchoolSurveyTeacherModalComponent implements OnInit {
  @Input() surveyData: any = "";
  constructor() { }

  ngOnInit(): void {
    console.log("school survey teacher :::",this.surveyData);
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
