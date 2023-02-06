import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UpdateStockService {

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

  updateOpeningStock(post: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/updateOpeningStock',JSON.stringify(post));
  }
  getSchoolDetails(schoolId:any,clusterId: any): Observable<any> {
    const allData = {'schoolId':schoolId,'clusterId':clusterId};
    return this.httpClient.post(this.apiURL + '/getSchoolDetails',JSON.stringify(allData));
  }
  getOpeningStockDetails(schoolId:any,academicYear: any): Observable<any> {
    const allData = {'schoolId':schoolId,'academicYear':academicYear};
    return this.httpClient.post(this.apiURL + '/getOpeningStockDetails',JSON.stringify(allData));
  }
  getUpdateStockDetails(schoolId:any,academicYear: any): Observable<any> {
    const allData = {'schoolId':schoolId,'academicYear':academicYear};
    return this.httpClient.post(this.apiURL + '/getUpdateStockDetails',JSON.stringify(allData));
  }
  updateStock(post: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/updateStock',JSON.stringify(post));
  }
}
