import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-artificial-limb-center-modal',
  templateUrl: './artificial-limb-center-modal.component.html',
  styleUrls: ['./artificial-limb-center-modal.component.css']
})
export class ArtificialLimbCenterModalComponent implements OnInit {
  @Input() altCenterData: any = "";
  constructor() { }
  ngOnInit(): void {
    console.log(this.altCenterData.data);
  }

  // detect change in survey data
  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes);

    if (changes["altCenterData"]?.firstChange === false) {
      this.altCenterData = changes["altCenterData"]?.currentValue;
      console.log(this.altCenterData);
      
    }
  }
}
