import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageDailyConsumptionreportService {

 
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  private apiURL = environment.mdmAPI;
  private refreshRequired = new Subject<void>();
  get RefreshRequired() {
    return this.refreshRequired;
  }
  constructor(private httpClient: HttpClient) { }

  getStudentMdmReceived(schoolId:number,attendanceDate:Date,schoolUdiseCode:any,academicYear:any){
    const allData = {schoolId,attendanceDate,schoolUdiseCode,academicYear};
    return this.httpClient.post(this.apiURL + '/getStudentMdmReceived',JSON.stringify(allData))
  }

  loadDailyConsumptionData(post:any){
    return this.httpClient.post(this.apiURL + '/loadDailyConsumptionData',JSON.stringify(post))
  }
}
