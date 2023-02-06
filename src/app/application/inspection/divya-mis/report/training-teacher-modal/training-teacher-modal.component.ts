import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-training-teacher-modal',
  templateUrl: './training-teacher-modal.component.html',
  styleUrls: ['./training-teacher-modal.component.css']
})
export class TrainingTeacherModalComponent implements OnInit {
  @Input() trainingTeacherData: any = "";
  constructor() { }

  ngOnInit(): void {
    console.log(this.trainingTeacherData,"training--teacher============");
  }

  // detect change in survey data
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);

    if (changes["trainingTeacherData"]?.firstChange === false) {
      this.trainingTeacherData = changes["trainingTeacherData"]?.currentValue;
      console.log(this.trainingTeacherData?.inspectionId);
      
    }
  }

}
