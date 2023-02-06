import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CommonserviceService } from 'src/app/core/services/commonservice.service';

@Component({
  selector: 'app-grievance-history-modal',
  templateUrl: './grievance-history-modal.component.html',
  styleUrls: ['./grievance-history-modal.component.css']
})
export class GrievanceHistoryModalComponent implements OnInit {

  @Input() grievanceActionDetails: any  = "";
  @Input() grievanceLogDetails: any     = "";
  @Input() showGrievanceActionTktNo: any= "";

  fileUrl = environment.filePath;
  showActionLoader:boolean   = true;
  showActionDetails:boolean  = false;

  constructor(
    public commonService: CommonserviceService, 
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["grievanceActionDetails"]?.firstChange === false) {
      this.grievanceActionDetails = changes["grievanceActionDetails"]?.currentValue;
      this.grievanceLogDetails    = changes["grievanceLogDetails"]?.currentValue;
      this.showActionDetails      = true;
      this.showActionLoader       = false;
    }
  }

  printModal() {
    let cloneTable 	= document.getElementById("printModalView")?.innerHTML;
    const pageTitle = document.getElementById("ActionHistoryLabel")?.innerHTML;
    this.commonService.printPage(cloneTable, pageTitle);
  }

}
