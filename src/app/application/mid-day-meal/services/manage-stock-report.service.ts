import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageStockReportService {

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

  getLoginUserDetails(clusterId:number){
    const allData = {clusterId};
    return this.httpClient.post(this.apiURL + '/getLoginUserDetails',JSON.stringify(allData))
  }
  loadStockDatas(post:any){
    return this.httpClient.post(this.apiURL + '/loadStockDatas',JSON.stringify(post))
  }
}
