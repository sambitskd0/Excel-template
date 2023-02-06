import { Component, OnInit } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-inspection-mis',
  templateUrl: './inspection-mis.component.html',
  styleUrls: ['./inspection-mis.component.css']
})
export class InspectionMisComponent implements OnInit {
  viewInspectionData(paramObj: { offset: any; limit: any; scDistrictId: any; scBlockId: any; scClusterId: any; schoolId: any; userType: any; userId: any; startDate: any; endDate: any; }) {
    throw new Error("Method not implemented.");
  }

  constructor() { }

  ngOnInit(): void {
  }

}
