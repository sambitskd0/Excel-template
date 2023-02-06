import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-resource-center-modal',
  templateUrl: './resource-center-modal.component.html',
  styleUrls: ['./resource-center-modal.component.css']
})
export class ResourceCenterModalComponent implements OnInit {
  @Input() resourceCenterData: any = "";
  constructor() { }
  ngOnInit(): void {
    console.log(this.resourceCenterData);
  }

  // detect change in survey data
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);

    if (changes["resourceCenterData"]?.firstChange === false) {
      this.resourceCenterData = changes["resourceCenterData"]?.currentValue;
      console.log(this.resourceCenterData?.inspectionId);
      
    }
  }

}
