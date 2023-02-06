import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-grievance-details-modal',
  templateUrl: './grievance-details-modal.component.html',
  styleUrls: ['./grievance-details-modal.component.css']
})
export class GrievanceDetailsModalComponent implements OnInit {
  @Input() grievanceDetails: any    = "";
  @Input() showGrievanceTktNo: any  = "";

  fileUrl = environment.filePath;
  showLoader:boolean   = true;
  showDetails:boolean  = false;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["grievanceDetails"]?.firstChange === false) {
      this.grievanceDetails = changes["grievanceDetails"]?.currentValue;
      this.showDetails      = true;
      this.showLoader       = false;
    }
  }

}
