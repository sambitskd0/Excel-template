import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-artificial-limb-center-teacher-modal',
  templateUrl: './artificial-limb-center-teacher-modal.component.html',
  styleUrls: ['./artificial-limb-center-teacher-modal.component.css']
})
export class ArtificialLimbCenterTeacherModalComponent implements OnInit {
  @Input() altCenterTeacherData: any = "";
  constructor() { }
  ngOnInit(): void {
    console.log(this.altCenterTeacherData);
  }

  // detect change in survey data
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);

    if (changes["altCenterTeacherData"]?.firstChange === false) {
      this.altCenterTeacherData = changes["altCenterTeacherData"]?.currentValue;
      console.log(this.altCenterTeacherData?.inspectionId);
      
    }
  }

}
