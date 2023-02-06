import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-training-modal',
  templateUrl: './training-modal.component.html',
  styleUrls: ['./training-modal.component.css']
})
export class TrainingModalComponent implements OnInit {
  @Input() trainingData: any = "";
  constructor() { }

  ngOnInit(): void {
    console.log(this.trainingData);
  }

  // detect change in survey data
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);

    if (changes["trainingData"]?.firstChange === false) {
      this.trainingData = changes["trainingData"]?.currentValue;
      console.log(this.trainingData?.inspectionId);
      
    }
  }

}
