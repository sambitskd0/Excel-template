import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-resource-center-teacher-modal',
  templateUrl: './resource-center-teacher-modal.component.html',
  styleUrls: ['./resource-center-teacher-modal.component.css']
})
export class ResourceCenterTeacherModalComponent implements OnInit {
  @Input() resourceCenterTeacherData: any = "";
  constructor() { }
  ngOnInit(): void {
    console.log(this.resourceCenterTeacherData);
  }

  // detect change in survey data
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);

    if (changes["resourceCenterTeacherData"]?.firstChange === false) {
      this.resourceCenterTeacherData = changes["resourceCenterTeacherData"]?.currentValue;
      console.log(this.resourceCenterTeacherData?.inspectionId);
      
    }
  }
}
