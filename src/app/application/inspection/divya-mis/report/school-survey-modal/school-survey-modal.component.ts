import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-school-survey-modal',
  templateUrl: './school-survey-modal.component.html',
  styleUrls: ['./school-survey-modal.component.css']
})
export class SchoolSurveyModalComponent implements OnInit {
  @Input() surveyData: any = "";
  public fileUrl = environment.inspectionAPI + '/getAfile/';
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
