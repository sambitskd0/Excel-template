import { Component, OnInit, Input, SimpleChanges } from "@angular/core";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-promotion-details-modal",
  templateUrl: "./promotion-details-modal.component.html",
  styleUrls: ["./promotion-details-modal.component.css"],
})
export class PromotionDetailsModalComponent implements OnInit {
  @Input() promotionDetails: any = "";
  @Input() showGrievanceTktNo: any = "";

  fileUrl = environment.filePath;
  showLoader: boolean = true;
  showDetails: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["promotionDetails"]?.firstChange === false) {
      this.promotionDetails = changes["promotionDetails"]?.currentValue;
      
      this.showDetails = true;
      this.showLoader = false;
    }
  }
}
